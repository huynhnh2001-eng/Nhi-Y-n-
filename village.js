import * as T from './three.js';

/* =========================================================
   Làng gốm Bàu Trúc 3D — góc nhìn thứ ba, thế giới mở nhỏ
   ========================================================= */

const $ = s => document.querySelector(s);
const isTouch = matchMedia('(pointer: coarse)').matches;
if (isTouch) document.body.classList.add('touch');
const { clamp, lerp } = T.MathUtils;
let seed = 20221129;
const rand = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const R = (a, b) => a + rand() * (b - a);
const pick = a => a[Math.floor(rand() * a.length)];

// ---------- renderer ----------
let renderer;
try {
  renderer = new T.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  $('#start-error').hidden = false;
  $('#btn-start').textContent = 'Không thể mở 3D';
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, isTouch ? 1.5 : 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
$('#world').append(renderer.domElement);

const scene = new T.Scene();
const camera = new T.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 900);
scene.fog = new T.Fog(0xd3e3ea, 90, 360);

await Promise.race([document.fonts.load('800 60px "Be Vietnam Pro"'), new Promise(r => setTimeout(r, 1500))]).catch(() => {});

// ---------- helpers ----------
const matCache = new Map();
function M(color, extra) {
  const key = color + (extra ? JSON.stringify(extra) : '');
  if (!matCache.has(key)) matCache.set(key, new T.MeshLambertMaterial({ color, ...extra }));
  return matCache.get(key);
}
const geoCache = new Map();
function BG(w, h, d) {
  const k = `${w}|${h}|${d}`;
  if (!geoCache.has(k)) geoCache.set(k, new T.BoxGeometry(w, h, d));
  return geoCache.get(k);
}
function add(obj, parent = scene, cast = true, receive = true) {
  obj.castShadow = cast; obj.receiveShadow = receive; parent.add(obj); return obj;
}
/** box with bottom at y */
function box(w, h, d, x, y, z, mat, parent = scene, cast = true) {
  const m = new T.Mesh(BG(w, h, d), typeof mat === 'number' ? M(mat) : mat);
  m.position.set(x, y + h / 2, z);
  return add(m, parent, cast);
}
function cyl(rt, rb, h, x, y, z, mat, parent = scene, seg = 10, cast = true) {
  const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg), typeof mat === 'number' ? M(mat) : mat);
  m.position.set(x, y + h / 2, z);
  return add(m, parent, cast);
}
function blob(r, x, y, z, color, parent = scene, sy = 1, detail = 0) {
  const m = new T.Mesh(new T.IcosahedronGeometry(r, detail), M(color, { flatShading: true }));
  m.position.set(x, y, z); m.scale.y = sy; m.rotation.set(rand() * 3, rand() * 3, 0);
  return add(m, parent);
}
function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4;
  if (repeat) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  return t;
}
const FONT = '"Be Vietnam Pro", Arial, sans-serif';

// ---------- collision & world data ----------
const rects = [], circles = [], reserved = [], blockers = [], mapShapes = [];
const solidRect = (x0, z0, x1, z1) => rects.push({ x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1) });
const solidCircle = (x, z, r) => circles.push({ x, z, r });
const reserve = (x0, z0, x1, z1) => reserved.push({ x0, z0, x1, z1 });
const BOUNDS = { x0: -98, x1: 98, z0: -98, z1: 78 };

function collide(p, r) {
  for (let k = 0; k < 2; k++) {
    for (const b of rects) {
      if (p.x < b.x0 - r || p.x > b.x1 + r || p.z < b.z0 - r || p.z > b.z1 + r) continue;
      const cx = clamp(p.x, b.x0, b.x1), cz = clamp(p.z, b.z0, b.z1);
      let dx = p.x - cx, dz = p.z - cz; const d2 = dx * dx + dz * dz;
      if (d2 >= r * r) continue;
      if (d2 > 1e-8) { const d = Math.sqrt(d2); p.x += dx / d * (r - d); p.z += dz / d * (r - d); }
      else {
        const pen = [p.x - b.x0 + r, b.x1 - p.x + r, p.z - b.z0 + r, b.z1 - p.z + r];
        const i = pen.indexOf(Math.min(...pen));
        if (i === 0) p.x = b.x0 - r; else if (i === 1) p.x = b.x1 + r; else if (i === 2) p.z = b.z0 - r; else p.z = b.z1 + r;
      }
    }
    for (const c of circles) {
      const dx = p.x - c.x, dz = p.z - c.z, rr = r + c.r, d2 = dx * dx + dz * dz;
      if (d2 >= rr * rr || d2 < 1e-8) continue;
      const d = Math.sqrt(d2); p.x += dx / d * (rr - d); p.z += dz / d * (rr - d);
    }
  }
  p.x = clamp(p.x, BOUNDS.x0, BOUNDS.x1); p.z = clamp(p.z, BOUNDS.z0, BOUNDS.z1);
}
function isFree(x, z, m = 1) {
  if (x < -100 || x > 100 || z < -100 || z > 80) return true;
  for (const b of [...rects, ...reserved]) if (x > b.x0 - m && x < b.x1 + m && z > b.z0 - m && z < b.z1 + m) return false;
  for (const c of circles) if (Math.hypot(x - c.x, z - c.z) < c.r + m) return false;
  if (z > 49 && z < 63) return false;
  return true;
}
const HALL = { x0: -16, x1: 16, z0: -5.5, z1: 6 };
function groundH(x, z) {
  return (x > HALL.x0 && x < HALL.x1 && z > HALL.z0 && z < HALL.z1) ? 0.4 : 0;
}

// ---------- textures ----------
function terraTexture(base, dark, seedShift) {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 7; i++) { // fire marks
      const x = R(0, w), y = R(0, h), r = R(30, 90);
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, dark); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.globalAlpha = R(.25, .6) * seedShift; g.fillRect(x - r, y - r, r * 2, r * 2);
      g.globalAlpha = 1;
    }
    for (let i = 0; i < 1400; i++) {
      g.fillStyle = rand() > .5 ? 'rgba(255,230,200,.10)' : 'rgba(60,25,10,.12)';
      g.fillRect(R(0, w), R(0, h), 2, 2);
    }
    g.strokeStyle = 'rgba(70,30,15,.55)'; g.lineWidth = 2;
    for (const yy of [.22, .3, .55]) { // incised bands
      const y = h * yy;
      g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke();
      g.beginPath();
      for (let x = 0; x <= w; x += 8) g.lineTo(x, y + 6 + ((x / 8) % 2 ? 6 : 0));
      g.stroke();
    }
  });
}
const terraMats = [
  terraTexture('#b8653c', '#4a2414', 1), terraTexture('#c4744a', '#6b2c14', .8),
  terraTexture('#a9552f', '#2c160c', 1.2), terraTexture('#c98a5c', '#7a3b1c', .7),
].map(map => new T.MeshLambertMaterial({ map, side: T.DoubleSide }));
const rawClayMat = new T.MeshLambertMaterial({ map: terraTexture('#9d8b78', '#6c5c4c', .5), side: T.DoubleSide });
const terra = () => pick(terraMats);

const tileTex = canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = '#b4472c'; g.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 32) {
    const gr = g.createLinearGradient(0, y, 0, y + 32);
    gr.addColorStop(0, 'rgba(255,190,150,.25)'); gr.addColorStop(.75, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(60,10,0,.45)');
    g.fillStyle = gr; g.fillRect(0, y, w, 32);
  }
  g.fillStyle = 'rgba(70,15,5,.35)';
  for (let x = 0; x < w; x += 16) g.fillRect(x, 0, 2, h);
}, [1, 1]);
const tileMat = new T.MeshLambertMaterial({ map: tileTex, side: T.DoubleSide });

const brickTex = canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = '#7d3a24'; g.fillRect(0, 0, w, h);
  for (let y = 0, r = 0; y < h; y += 16, r++) for (let x = (r % 2) * -16; x < w; x += 32) {
    g.fillStyle = `hsl(${R(10, 20)},${R(45, 60)}%,${R(30, 42)}%)`; g.fillRect(x + 1, y + 1, 30, 14);
  }
}, [1, 1]);
const brickMat = new T.MeshLambertMaterial({ map: brickTex });

const paveTex = canvasTex(128, 128, (g, w, h) => {
  g.fillStyle = '#d9c39d'; g.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 32) for (let x = 0; x < w; x += 32) {
    g.fillStyle = `hsl(${R(30, 38)},${R(30, 42)}%,${R(66, 74)}%)`; g.fillRect(x + 1, y + 1, 30, 30);
  }
}, [20, 13]);

const pillarTex = canvasTex(128, 512, (g, w, h) => {
  g.fillStyle = '#1e3150'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#d6aa4c'; g.fillStyle = '#d6aa4c'; g.lineWidth = 4;
  g.strokeRect(10, 10, w - 20, h - 20);
  for (let y = 60; y < h - 40; y += 110) { // cham-inspired motifs
    g.beginPath(); g.moveTo(w / 2, y - 34); g.lineTo(w / 2 + 30, y); g.lineTo(w / 2, y + 34); g.lineTo(w / 2 - 30, y); g.closePath(); g.stroke();
    g.beginPath(); g.arc(w / 2, y, 9, 0, 7); g.fill();
    g.beginPath(); g.arc(w / 2, y + 55, 18, Math.PI, 0); g.stroke();
  }
});

function signTexture(lines, { w = 1024, h = 160, bg = '#14505c', fg = '#fff', border = '#d6aa4c' } = {}) {
  return canvasTex(w, h, (g) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.strokeStyle = border; g.lineWidth = 8; g.strokeRect(8, 8, w - 16, h - 16);
    g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
    lines.forEach(([txt, size, y]) => { g.font = `800 ${size}px ${FONT}`; g.fillText(txt, w / 2, h * y); });
  });
}

const apsaraTex = canvasTex(256, 384, (g, w, h) => {
  g.fillStyle = '#b2603a'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#5c2a14'; g.lineWidth = 6; g.strokeRect(10, 10, w - 20, h - 20);
  g.fillStyle = '#8c4527'; g.strokeStyle = '#4a200e'; g.lineWidth = 5;
  g.beginPath(); g.arc(128, 100, 26, 0, 7); g.fill(); g.stroke(); // head
  g.beginPath(); g.moveTo(104, 82); g.lineTo(128, 36); g.lineTo(152, 82); g.closePath(); g.fill(); g.stroke(); // crown
  g.beginPath(); g.moveTo(128, 126); g.bezierCurveTo(96, 170, 160, 210, 120, 260); g.lineTo(84, 330); g.moveTo(120, 260); g.lineTo(170, 320); g.stroke();
  g.beginPath(); g.moveTo(104, 150); g.quadraticCurveTo(60, 130, 70, 92); g.moveTo(150, 150); g.quadraticCurveTo(200, 170, 196, 120); g.stroke();
  g.beginPath(); g.ellipse(128, 255, 46, 22, 0, 0, 7); g.stroke();
});

const smokeTex = canvasTex(64, 64, (g) => {
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,.85)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
});

function markerTexture(txt, bg, fg = '#3b2600') {
  return canvasTex(128, 128, g => {
    g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.arc(64, 68, 50, 0, 7); g.fill();
    g.fillStyle = bg; g.beginPath(); g.arc(64, 62, 50, 0, 7); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = 6; g.stroke();
    g.fillStyle = fg; g.font = `800 64px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 64, 66);
  });
}
const markNew = new T.SpriteMaterial({ map: markerTexture('!', '#f2b544'), depthTest: false });
const markDone = new T.SpriteMaterial({ map: markerTexture('✓', '#5bd38a', '#0d3a1c'), depthTest: false });

// ---------- sky, light, ground ----------
const sky = new T.Mesh(new T.SphereGeometry(800, 32, 16), new T.ShaderMaterial({
  side: T.BackSide, depthWrite: false, fog: false,
  uniforms: { top: { value: new T.Color(0x2f7fd0) }, bottom: { value: new T.Color(0xd3e3ea) }, sunDir: { value: new T.Vector3(.5, .6, .4).normalize() } },
  vertexShader: 'varying vec3 vp;void main(){vp=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: `uniform vec3 top;uniform vec3 bottom;uniform vec3 sunDir;varying vec3 vp;
  void main(){float h=clamp(vp.y*1.5+.04,0.,1.);vec3 c=mix(bottom,top,pow(h,.65));float s=max(dot(vp,sunDir),0.);c+=vec3(1.,.9,.7)*(pow(s,600.)*4.+pow(s,8.)*.18);
  gl_FragColor=vec4(c,1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  }`,
}));
sky.renderOrder = -1;
scene.add(sky);

scene.add(new T.HemisphereLight(0xe6f0ff, 0xb48d5c, 1.5));
const sun = new T.DirectionalLight(0xfff0d8, 3.1);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 220 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.04;
scene.add(sun, sun.target);
const SUN_OFF = new T.Vector3(50, 80, 40);

function terrainH(x, z) {
  const n = Math.sin(x * .07) * Math.cos(z * .05) + Math.sin(x * .021 + z * .033) * .8;
  const out = Math.min(Math.max(0, Math.max(Math.abs(x) - 110, -z - 110, z - 90)), 170);
  return [out > 0 ? Math.pow(out / 40, 1.4) * (6 + n * 4) : 0, n, out];
}
{ // ground
  const g = new T.PlaneGeometry(900, 900, 160, 160); g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position, col = [];
  const sand = new T.Color(0xd8bf8e), dry = new T.Color(0xc2ad74), scrub = new T.Color(0x9c9a5e), c = new T.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const [hy, n0, out] = terrainH(x, z), n = n0 + R(-.15, .15);
    pos.setY(i, hy);
    c.copy(sand).lerp(dry, clamp(n * .5 + .4, 0, 1)).lerp(scrub, clamp(out / 120 + (n > .9 ? .3 : 0), 0, .7));
    col.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new T.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  add(new T.Mesh(g, new T.MeshLambertMaterial({ vertexColors: true })), scene, false, true);
}

function flat(w, d, x, z, mat, y = .02) {
  const m = new T.Mesh(new T.PlaneGeometry(w, d), mat); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z);
  return add(m, scene, false, true);
}
// courtyard, path, lanes, road
flat(42, 26, 0, 19, new T.MeshLambertMaterial({ map: paveTex }));
{ const t = paveTex.clone(); t.repeat.set(3, 10); t.needsUpdate = true; flat(6, 20, 0, 42, new T.MeshLambertMaterial({ map: t })); }
const laneMat = M(0xc7a873);
flat(150, 4, 0, -28, laneMat, .015); flat(4, 100, -46, 0, laneMat, .016); flat(4, 100, 46, 0, laneMat, .016);
mapShapes.push({ x0: -75, z0: -30, x1: 75, z1: -26, c: '#c7a873' }, { x0: -48, z0: -50, x1: -44, z1: 50, c: '#c7a873' }, { x0: 44, z0: -50, x1: 48, z1: 50, c: '#c7a873' });
mapShapes.push({ x0: -21, z0: 6, x1: 21, z1: 32, c: '#e7d6b4' }, { x0: -3, z0: 32, x1: 3, z1: 52, c: '#e7d6b4' });
reserve(-21, 6, 21, 32); reserve(-3, 32, 3, 52);
flat(500, 10, 0, 56, M(0x55575c), .03);
for (let x = -250; x < 250; x += 6) flat(3, .25, x, 56, M(0xf2f2f2), .04);
flat(500, .3, 0, 51.2, M(0xf2f2f2), .04); flat(500, .3, 0, 60.8, M(0xf2f2f2), .04);
mapShapes.push({ x0: -200, z0: 51, x1: 200, z1: 61, c: '#62646a', label: 'Đường liên xã' });

// ---------- geometry builders ----------
function hipRoof(w, d, h) {
  const x = w / 2, z = d / 2, r = Math.max(0.01, x - z);
  const A = [-x, 0, z], B = [x, 0, z], C = [r, h, 0], D = [-r, h, 0], A2 = [-x, 0, -z], B2 = [x, 0, -z];
  const tris = [A, B, C, A, C, D, B2, A2, D, B2, D, C, B, B2, C, A2, A, D];
  const pos = [], uv = [];
  tris.forEach((p, i) => {
    pos.push(...p);
    const face = Math.floor(i / 6);
    const u = i < 12 ? p[0] * .5 : p[2] * .5;
    uv.push(u, p[1] * 1.6 + (face === 1 ? .5 : 0));
  });
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}
function archPath(p, w, h, sh) {
  p.moveTo(-w / 2, 0); p.lineTo(-w / 2, sh);
  p.quadraticCurveTo(-w / 2, h * .92, 0, h); p.quadraticCurveTo(w / 2, h * .92, w / 2, sh);
  p.lineTo(w / 2, 0); p.lineTo(-w / 2, 0);
  return p;
}
function chamArch(w, h, parent, x, y, z, rotY = 0) {
  const s = archPath(new T.Shape(), w, h, h * .45);
  s.holes.push(archPath(new T.Path(), w * .62, h * .78, h * .33));
  const frame = new T.Mesh(new T.ExtrudeGeometry(s, { depth: .28, bevelEnabled: false }), M(0xf3e7cc));
  frame.position.set(x, y, z); frame.rotation.y = rotY; add(frame, parent);
  const inner = new T.Mesh(new T.ShapeGeometry(archPath(new T.Shape(), w * .62, h * .78, h * .33)), M(0xa8452c, { side: T.DoubleSide }));
  inner.position.set(0, 0, .08); frame.add(inner);
  const cap = new T.Mesh(new T.ConeGeometry(w * .12, h * .25, 6), M(0xd6aa4c)); cap.position.set(0, h + h * .1, .14); frame.add(cap);
  return frame;
}

const POTS = {
  moc: [[0, 0], [.55, 0], [.74, .2], [.87, .65], [.83, 1.05], [.58, 1.45], [.3, 1.7], [.3, 1.95], [.36, 2], [.31, 2], [.25, 1.94], [.25, 1.7], [.53, 1.43], [.77, 1], [.8, .65], [.68, .23], [.48, .12], [0, .12]],
  cao: [[0, 0], [.45, 0], [.62, .25], [.7, .75], [.63, 1.2], [.28, 1.55], [.23, 2.3], [.33, 2.35], [.28, 2.35], [.18, 2.25], [.22, 1.5], [.57, 1.18], [.64, .75], [.56, .28], [.4, .12], [0, .12]],
  bat: [[0, 0], [.45, 0], [.75, .22], [1, .65], [1.05, .7], [.99, .72], [.94, .65], [.7, .27], [.4, .1], [0, .1]],
  tall: [[0, 0], [.3, 0], [.42, .3], [.55, 1], [.58, 1.6], [.5, 2.3], [.36, 2.8], [.3, 3.1], [.4, 3.3], [.34, 3.32], [.26, 3.12], [.32, 2.8], [.46, 2.3], [.54, 1.6], [.5, 1], [.38, .32], [.26, .08], [0, .08]],
  lu: [[0, 0], [.5, 0], [.8, .4], [.95, .9], [.88, 1.3], [.55, 1.55], [.5, 1.65], [.58, 1.7], [.48, 1.7], [.44, 1.6], [.5, 1.5], [.84, 1.28], [.9, .9], [.76, .42], [.48, .08], [0, .08]],
  noi: [[0, 0], [.4, 0], [.65, .2], [.75, .5], [.62, .8], [.6, .88], [.68, .93], [.58, .93], [.55, .86], [.68, .5], [.6, .24], [.38, .06], [0, .06]],
  den: [[0, 0], [.35, 0], [.35, .1], [.15, .2], [.12, .6], [.3, .7], [.34, .86], [.27, .86], [.25, .74], [.08, .65], [0, .65]],
};
const potGeo = {};
for (const k in POTS) potGeo[k] = new T.LatheGeometry(POTS[k].map(p => new T.Vector2(p[0], p[1])), 24);
function pot(kind, x, y, z, s = 1, mat = terra(), parent = scene) {
  const m = new T.Mesh(potGeo[kind], mat);
  m.scale.setScalar(s); m.position.set(x, y, z); m.rotation.y = rand() * 6.28;
  return add(m, parent);
}

// ---------- people ----------
const SKIN = [0xc68a5e, 0xb07650, 0xdcae88, 0x9c6a45];
const SHIRT = [0xe85d4a, 0x3d7dd8, 0xf1c84b, 0xffffff, 0x47a37a, 0xd46aa8, 0x2c3e66, 0xf08a3c];
const PANTS = [0x2d3d63, 0x3b3b3b, 0x6b5844, 0x8aa0c0, 0x22252b];
function person(o = {}) {
  const skin = o.skin ?? pick(SKIN), g = new T.Group();
  const P = (w, h, d, c, x, y, z, parent = g) => { const m = new T.Mesh(BG(w, h, d), M(c)); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
  const hipL = new T.Group(), hipR = new T.Group();
  hipL.position.set(-.11, .86, 0); hipR.position.set(.11, .86, 0); g.add(hipL, hipR);
  for (const hp of [hipL, hipR]) { P(.17, .82, .19, o.pants ?? pick(PANTS), 0, -.41, 0, hp); P(.18, .08, .28, o.shoes ?? 0x2a2420, 0, -.82, .04, hp); }
  if (o.dress) { const d = new T.Mesh(new T.CylinderGeometry(.25, .37, .98, 10), M(o.dress)); d.position.y = .62; d.castShadow = true; g.add(d); }
  const shirt = o.shirt ?? pick(SHIRT);
  P(.48, .62, .27, shirt, 0, 1.17, 0);
  if (o.sash) P(.5, .12, .29, o.sash, 0, .94, 0);
  P(.12, .08, .12, skin, 0, 1.5, 0);
  P(.3, .32, .3, skin, 0, 1.69, 0);
  P(.05, .05, .02, 0x1b1410, -.07, 1.72, .151); P(.05, .05, .02, 0x1b1410, .07, 1.72, .151);
  const hair = o.hair ?? pick([0x1b1410, 0x2a1d14, 0x3b2a1c]);
  if (o.scarf) { P(.35, .2, .35, o.scarf, 0, 1.86, 0); P(.31, .42, .07, o.scarf, 0, 1.6, -.17); }
  else { P(.32, .1, .32, hair, 0, 1.87, 0); P(.32, o.longHair ? .5 : .2, .08, hair, 0, o.longHair ? 1.55 : 1.73, -.13); }
  if (o.hat === 'non') { const h = new T.Mesh(new T.ConeGeometry(.45, .3, 14), M(0xe8d6a4)); h.position.y = 2.02; h.castShadow = true; g.add(h); }
  if (o.cap) { P(.33, .1, .33, o.cap, 0, 1.89, 0); P(.3, .03, .18, o.cap, 0, 1.85, .2); }
  const shL = new T.Group(), shR = new T.Group();
  shL.position.set(-.31, 1.44, 0); shR.position.set(.31, 1.44, 0); g.add(shL, shR);
  for (const sh of [shL, shR]) { P(.13, .56, .15, o.sleeve ?? shirt, 0, -.27, 0, sh); P(.11, .12, .12, skin, 0, -.6, 0, sh); }
  if (o.backpack) { P(.38, .44, .18, o.backpack, 0, 1.2, -.22); P(.28, .16, .06, 0x2e3b2a, 0, 1.08, -.33); }
  g.userData.rig = { hipL, hipR, shL, shR, phase: rand() * 6 };
  return g;
}
function animatePerson(g, speed, dt, airborne = false) {
  const r = g.userData.rig;
  if (airborne) {
    r.hipL.rotation.x = lerp(r.hipL.rotation.x, -.6, .2); r.hipR.rotation.x = lerp(r.hipR.rotation.x, .3, .2);
    r.shL.rotation.z = lerp(r.shL.rotation.z, -.6, .2); r.shR.rotation.z = lerp(r.shR.rotation.z, .6, .2);
    return;
  }
  r.shL.rotation.z = lerp(r.shL.rotation.z, 0, .2); r.shR.rotation.z = lerp(r.shR.rotation.z, 0, .2);
  r.phase += dt * (2.2 + speed * 2.1);
  const a = Math.min(speed / 3.4, 1.35) * .6, s = Math.sin(r.phase);
  r.hipL.rotation.x = lerp(r.hipL.rotation.x, s * a, .3); r.hipR.rotation.x = lerp(r.hipR.rotation.x, -s * a, .3);
  r.shL.rotation.x = lerp(r.shL.rotation.x, -s * a * .9, .3); r.shR.rotation.x = lerp(r.shR.rotation.x, s * a * .9, .3);
}
const cachedSprite = (mat, parent, y) => { const s = new T.Sprite(mat); s.scale.set(.7, .7, .7); s.position.y = y; s.renderOrder = 10; parent.add(s); return s; };

// ---------- vegetation ----------
let frondGeo;
{
  const N = 8, L = 3.2, pos = [], idx = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N, x = 0, z = L * s, y = -1.4 * s * s, w = .62 * Math.sin(Math.PI * Math.min(1, s * 1.15 + .05));
    pos.push(x - w, y - .12 * s, z, x, y + .06, z, x + w, y - .12 * s, z);
    if (i < N) { const a = i * 3; idx.push(a, a + 3, a + 1, a + 1, a + 3, a + 4, a + 1, a + 4, a + 2, a + 2, a + 4, a + 5); }
  }
  frondGeo = new T.BufferGeometry(); frondGeo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); frondGeo.setIndex(idx); frondGeo.computeVertexNormals();
}
function palm(x, z, h = R(6.5, 9)) {
  const g = new T.Group(); g.position.set(x, 0, z); scene.add(g);
  const lx = R(-.5, .5), lz = R(-.5, .5), seg = 7;
  for (let i = 0; i < seg; i++) {
    const t = i / seg, m = cyl(.17 - t * .05, .21 - t * .05, h / seg + .02, lx * t * t, i * h / seg, lz * t * t, i % 2 ? 0x8a7458 : 0x77644c, g, 7);
    m.rotation.set(lz * .08, 0, -lx * .08);
  }
  const top = new T.Vector3(lx, h, lz);
  const fm = M(0x58873a, { side: T.DoubleSide }), fm2 = M(0x6b9a42, { side: T.DoubleSide });
  for (let i = 0; i < 10; i++) {
    const f = new T.Mesh(frondGeo, i % 2 ? fm : fm2); f.position.copy(top);
    f.rotation.set(R(-.35, -.05), i / 10 * Math.PI * 2 + R(-.2, .2), 0, 'YXZ'); add(f, g, true, false);
  }
  blob(.35, top.x, top.y - .2, top.z, 0x6e5a3a, g);
  solidCircle(x, z, .35);
  return g;
}
function frangipani(x, z) {
  const g = new T.Group(); g.position.set(x, 0, z); scene.add(g);
  cyl(.22, .3, 1.6, 0, 0, 0, 0x8c8478, g, 8);
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + R(-.3, .3), b = new T.Group(); b.position.y = 1.5; b.rotation.set(0, a, .55); g.add(b);
    const br = cyl(.1, .15, 1.8, 0, 0, 0, 0x8c8478, b, 6); br.position.y = .9;
    const end = new T.Vector3(0, 1.85, 0);
    blob(.75, end.x, end.y, end.z, 0x4f8a33, b, .7);
    for (let k = 0; k < 5; k++) blob(.13, R(-.5, .5), end.y + R(.1, .45), R(-.5, .5), k % 2 ? 0xfffaf0 : 0xfff1c2, b);
  }
  solidCircle(x, z, .4);
}
function tree(x, z, s = R(.8, 1.3)) {
  const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g);
  cyl(.18, .26, 2.6, 0, 0, 0, 0x6e5a44, g, 7);
  const c = pick([0x4d7a2f, 0x5c8a35, 0x46702c]);
  blob(1.7, 0, 3.6, 0, c, g, .75); blob(1.2, 1, 3.1, .3, c, g, .8); blob(1.2, -.9, 3.3, -.4, c, g, .8); blob(1, .2, 4.4, -.5, c, g, .8);
  solidCircle(x, z, .35 * s);
}
function bougainvillea(x, z, s = 1, parent = scene) {
  const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); parent.add(g);
  for (let i = 0; i < 4; i++) blob(R(.4, .6), R(-.6, .6), R(.4, 1.3), R(-.6, .6), 0x3f6b2b, g, .8);
  for (let i = 0; i < 8; i++) blob(R(.25, .45), R(-.8, .8), R(.5, 1.7), R(-.8, .8), pick([0xd8307f, 0xe94f9b, 0xc22a6e]), g, .8);
}
function cactus(x, z, s = R(.7, 1.3)) {
  const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g);
  const m = M(0x4f7f45, { flatShading: true });
  cyl(.25, .28, 2.2, 0, 0, 0, m, g, 8);
  for (const sd of [-1, 1]) if (rand() > .3) {
    const y = R(.7, 1.3); cyl(.13, .13, .5, sd * .35, y, 0, m, g, 7).rotation.z = Math.PI / 2;
    cyl(.15, .15, R(.6, 1), sd * .55, y, 0, m, g, 7);
  }
  solidCircle(x, z, .35 * s);
}
function agave(x, z, parent = scene) {
  const g = new T.Group(); g.position.set(x, 0, z); parent.add(g);
  for (let i = 0; i < 9; i++) {
    const l = new T.Mesh(new T.ConeGeometry(.09, 1, 4), M(0x7d9a7a, { flatShading: true }));
    l.position.y = .4; l.rotation.set(R(.5, 1), i * .7, 0, 'YXZ'); l.translateY(.2); add(l, g);
  }
}

// ---------- main exhibition hall ----------
const hallRoof = new T.Group(); scene.add(hallRoof);
{
  box(32, .4, 11.5, 0, 0, .25, M(0xcaa983));
  box(6, .2, .9, 0, 0, 6.4, M(0xcaa983));
  flat(29.4, 6.4, 0, -1.5, new T.MeshLambertMaterial({ map: (() => { const t = paveTex.clone(); t.repeat.set(14, 3); t.needsUpdate = true; return t; })() }), .42);
  const wall = M(0xf1e4c8), trim = M(0xb14a2e);
  const walls = [
    box(30, 3.6, .3, 0, .4, -4.85, wall), box(.3, 3.6, 7, -14.85, .4, -1.5, wall), box(.3, 3.6, 7, 14.85, .4, -1.5, wall),
    box(13, 3.6, .3, -8.5, .4, 1.85, wall), box(13, 3.6, .3, 8.5, .4, 1.85, wall), box(4, .9, .3, 0, 3.1, 1.85, wall),
  ];
  blockers.push(...walls);
  box(30.2, .25, .4, 0, .4, 1.85, trim); box(30.2, .25, .4, 0, .4, -4.85, trim);
  solidRect(-15, -5, 15, -4.7); solidRect(-15, -5, -14.7, 2); solidRect(14.7, -5, 15, 2);
  solidRect(-15, 1.7, -2, 2); solidRect(2, 1.7, 15, 2);
  for (const x of [-12, -6, 6, 12]) { // windows
    box(2.4, 2, .36, x, 1.1, 1.85, M(0xf7efdc));
    box(2, 1.6, .4, x, 1.3, 1.85, M(0x2c4a63, { emissive: 0x0b1420 }));
    box(.08, 1.6, .44, x, 1.3, 1.85, M(0xf7efdc)); box(2, .08, .44, x, 2.05, 1.85, M(0xf7efdc));
  }
  for (const sd of [-1, 1]) { const d = box(.08, 2.6, 1.9, sd * 2.05, .4, 2.9, M(0x6b3b22)); d.rotation.y = sd * .2; }
  const pillarMat = [M(0x1e3150), M(0x1e3150), M(0x1e3150), M(0x1e3150), new T.MeshLambertMaterial({ map: pillarTex }), M(0x1e3150)];
  for (let x = -14; x <= 14; x += 4) {
    const p = new T.Mesh(BG(.7, 3.35, .7), pillarMat); p.position.set(x, .4 + 3.35 / 2, 5.3); add(p);
    box(.9, .25, .9, x, .4, 5.3, M(0xd6aa4c)); box(.9, .2, .9, x, 3.55, 5.3, M(0xd6aa4c));
    solidCircle(x, 5.3, .5); blockers.push(p);
  }
  box(32, .4, .5, 0, 3.75, 5.3, M(0xf1e4c8)); box(32, .12, .52, 0, 3.75, 5.3, trim);
  box(30, .1, 7, 0, 3.98, -1.5, M(0xd8c3a0), scene, true);
  box(32, .1, 3.6, 0, 4.0, 3.6, M(0xd8c3a0), scene, true);
  const roof = add(new T.Mesh(hipRoof(34, 13, 3.1), tileMat), hallRoof); roof.position.set(0, 4.1, .25);
  for (const x of [-12, -8, -4, 4, 8, 12]) chamArch(1.5, 1.8, hallRoof, x, 3.95, 6.45);
  chamArch(3.2, 2.9, hallRoof, 0, 3.95, 6.5);
  const sign = new T.Mesh(BG(8.4, 1, .14), [M(0x14505c), M(0x14505c), M(0x14505c), M(0x14505c), new T.MeshBasicMaterial({ map: signTexture([['TRUNG TÂM TRƯNG BÀY', 34, .3], ['LÀNG GỐM BÀU TRÚC', 64, .66]]) }), M(0x14505c)]);
  sign.position.set(0, 3.2, 5.82); add(sign);
  // interior
  for (const x of [-11, -5, 5, 11]) {
    for (let i = 0; i < 3; i++) {
      box(4, .08, .7, x, .9 + i * .8, -4.3, M(0x6e4a2e));
      for (let j = 0; j < 4; j++) pot(pick(['moc', 'cao', 'noi', 'den']), x - 1.5 + j, .98 + i * .8, -4.3, .22);
    }
    box(.08, 2.6, .7, x - 2, .4, -4.3, M(0x5a3a22)); box(.08, 2.6, .7, x + 2, .4, -4.3, M(0x5a3a22));
    solidRect(x - 2, -4.7, x + 2, -3.9);
  }
  const ap = new T.Mesh(BG(2, 2.8, .12), [M(0x8c4527), M(0x8c4527), M(0x8c4527), M(0x8c4527), new T.MeshLambertMaterial({ map: apsaraTex }), M(0x8c4527)]);
  ap.position.set(0, 2.1, -4.62); add(ap);
  for (const x of [-8, 8]) {
    box(3, .8, 1.3, x, .4, -1.2, M(0x7a5132));
    pot('lu', x - .8, 1.2, -1.2, .35); pot('moc', x, 1.2, -1.2, .3); pot('bat', x + .9, 1.2, -1.2, .3);
    solidRect(x - 1.5, -1.85, x + 1.5, -.55);
  }
  // tall jars & greenery in front
  for (const x of [-15.5, -11.2, -6.8, -3.2, 3.2, 6.8, 11.2, 15.5]) { pot('tall', x, 0, 7.4, .55); solidCircle(x, 7.4, .4); }
  for (const x of [-13.2, -9, 9, 13.2]) { pot('lu', x, 0, 7.6, .55); blob(.6, x, 1.25, 7.6, 0x4a7d30, scene, .8); solidCircle(x, 7.6, .55); }
  bougainvillea(-17, 6.6, 1.5); bougainvillea(17, 6.6, 1.5); bougainvillea(-17, -5, 1.3); bougainvillea(17, -5, 1.3);
  solidCircle(-17, 6.6, 1); solidCircle(17, 6.6, 1);
  for (const x of [-5.5, 5.5]) { agave(x, 7.8); }
  reserve(-18, -7, 18, 9);
  mapShapes.push({ x0: -16, z0: -5.5, x1: 16, z1: 6, c: '#b4472c', label: 'Nhà trưng bày' });
}

// ---------- gate ----------
{
  for (const sd of [-1, 1]) {
    const x = sd * 4.6;
    box(1.4, 5, 1.4, x, 0, 40, brickMat); box(1.7, .3, 1.7, x, 5, 40, M(0xd6aa4c));
    box(1.1, 1, 1.1, x, 5.3, 40, brickMat); box(.7, .9, .7, x, 6.3, 40, brickMat);
    const c = new T.Mesh(new T.ConeGeometry(.3, .8, 4), brickMat); c.position.set(x, 7.6, 40); c.rotation.y = Math.PI / 4; add(c);
    solidCircle(x, 40, .9);
    pot('tall', x + sd * 1.6, 0, 40.5, .5);
  }
  const gateSign = new T.MeshBasicMaterial({ map: signTexture([['LÀNG GỐM BÀU TRÚC', 74, .52]], { bg: '#7d3a24', border: '#f2d38a' }) });
  const g = new T.Mesh(BG(8, 1.1, .3), [M(0x7d3a24), M(0x7d3a24), M(0x7d3a24), M(0x7d3a24), gateSign, gateSign]);
  g.position.set(0, 4.6, 40); add(g);
  mapShapes.push({ x0: -5.5, z0: 39.4, x1: 5.5, z1: 40.6, c: '#7d3a24', label: 'Cổng làng' });
}

// ---------- roadside kiosks ----------
function kiosk(x, z, color) {
  box(5, .2, 2.6, x, 0, z, M(0x9b7b56));
  box(5, 2.6, .15, x, .2, z - 1.25, M(0xefe3c6));
  for (const sx of [-2.4, 2.4]) box(.15, 2.8, .15, x + sx, .2, z + 1.2, M(0x6b4a2e));
  const aw = box(5.4, .08, 3, x, 2.9, z, M(color)); aw.rotation.x = -.18;
  for (let i = 0; i < 2; i++) { box(4.6, .08, .5, x, .9 + i * .7, z - .9, M(0x6e4a2e)); for (let j = 0; j < 5; j++) pot(pick(['moc', 'noi', 'den', 'cao']), x - 1.8 + j * .9, .98 + i * .7, z - .9, .2); }
  for (let j = 0; j < 4; j++) pot(pick(['lu', 'tall', 'moc']), x - 2 + j * 1.3, .2, z + .3, R(.3, .45));
  solidRect(x - 2.5, z - 1.3, x + 2.5, z + 1.3);
  mapShapes.push({ x0: x - 2.5, z0: z - 1.3, x1: x + 2.5, z1: z + 1.3, c: '#c98a5c' });
}
kiosk(-10, 46, 0xe85d4a); kiosk(-17, 46, 0x3d7dd8); kiosk(10, 46, 0xf1c84b); kiosk(17, 46, 0x47a37a);

// ---------- workshop shed (xưởng tạo hình) ----------
const WORK = new T.Vector3(-32, 0, -2);
{
  const { x, z } = WORK;
  box(13, .15, 10, x, 0, z, M(0xb59a74));
  for (const px of [-6, 0, 6]) for (const pz of [-4.5, 4.5]) { cyl(.15, .17, 3.3, x + px, 0, z + pz, 0x6b4a2e, scene, 7); solidCircle(x + px, z + pz, .25); }
  const r = add(new T.Mesh(hipRoof(14, 11, 2.2), M(0x9b7b4a, { side: T.DoubleSide, flatShading: true }))); r.position.set(x, 3.3, z);
  box(13, 1.2, .2, x, 0, z - 4.6, M(0xd9c7a2)); solidRect(x - 6.5, z - 4.7, x + 6.5, z - 4.5);
  const stands = [[0, 0], [-3.6, 1.5], [3.6, 1.5]];
  stands.forEach(([sx, sz], i) => {
    cyl(.45, .5, .6, x + sx, 0, z + sz, 0x7a5132, scene, 12);
    pot(i ? pick(['moc', 'cao']) : 'lu', x + sx, .6, z + sz, i ? .3 : .38, rawClayMat);
    solidCircle(x + sx, z + sz, .55);
  });
  for (let i = 0; i < 4; i++) blob(R(.5, .8), x - 5 + i * .9, .2, z - 3.4, 0x8a7562, scene, .45);
  for (let i = 0; i < 6; i++) pot(pick(['moc', 'noi', 'bat', 'cao']), x + 3 + (i % 3) * .8, .15, z - 3.4 + Math.floor(i / 3) * .9, .3, rawClayMat);
  pot('lu', x - 5.5, .15, z + 3.5, .5); box(1.6, .45, .5, x - 2, .15, z + 4, M(0x6b4a2e));
  reserve(x - 7, z - 5.5, x + 7, z + 5.5);
  mapShapes.push({ x0: x - 6.5, z0: z - 5, x1: x + 6.5, z1: z + 5, c: '#9b7b4a', label: 'Xưởng tạo hình' });
}

// ---------- drying yard ----------
{
  const x = -32, z = 16;
  for (let i = 0; i < 3; i++) box(12, .04, 2, x, 0, z - 2.6 + i * 2.6, M(0xcaa86a), scene, false);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 9; j++) pot(pick(['moc', 'noi', 'bat', 'cao', 'den']), x - 5.2 + j * 1.3 + R(-.15, .15), .04, z - 2.6 + i * 2.6 + R(-.2, .2), R(.25, .4), rawClayMat);
  for (let i = 0; i < 3; i++) solidRect(x - 6, z - 3.3 + i * 2.6, x + 6, z - 1.9 + i * 2.6);
  reserve(x - 7, z - 4.5, x + 7, z + 4.5);
  mapShapes.push({ x0: x - 6, z0: z - 3.6, x1: x + 6, z1: z + 3.6, c: '#cbb187', label: 'Sân phơi gốm' });
}

// ---------- open firing yard (bãi nung lộ thiên) ----------
const FIRE = new T.Vector3(32, 0, -6);
const smoke = [];
let fireLight, embers = [];
{
  const { x, z } = FIRE;
  flat(14, 12, x, z, M(0x8f7a5e), .018);
  const straw = M(0xc9a55a, { flatShading: true }), ash = M(0x5b4b3d, { flatShading: true });
  const mound = new T.Mesh(new T.SphereGeometry(3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), straw);
  mound.scale.y = .55; mound.position.set(x, 0, z); add(mound);
  const char = new T.Mesh(new T.SphereGeometry(3.05, 12, 8, 0, Math.PI * 2, 0, Math.PI / 5), ash); char.scale.y = .55; char.position.set(x, 0, z); add(char);
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * Math.PI * 2;
    const e = new T.Mesh(new T.IcosahedronGeometry(R(.25, .45), 0), new T.MeshBasicMaterial({ color: pick([0xff7a1a, 0xffa53a, 0xff5a10]) }));
    e.position.set(x + Math.cos(a) * 2.75, R(.1, .5), z + Math.sin(a) * 2.75); scene.add(e); embers.push(e);
  }
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * Math.PI * 2 + R(-.1, .1);
    const l = cyl(.1, .12, 1.6, 0, 0, 0, 0x5a3e28, scene, 6);
    l.position.set(x + Math.cos(a) * 3.3, .15, z + Math.sin(a) * 3.3); l.rotation.set(Math.PI / 2, 0, -a);
  }
  for (let i = 0; i < 6; i++) { // stacked unfired + fired pots around
    pot(pick(['moc', 'lu', 'noi']), x + 4.6, 0, z - 4 + i * 1.3, .4, i % 2 ? rawClayMat : terra());
    pot(pick(['moc', 'cao', 'noi']), x - 5, 0, z - 3.5 + i * 1.2, .35);
  }
  for (let i = 0; i < 3; i++) box(1.8, .5, .9, x + R(-3, 3), 0, z + 5 + i * .3, M(0x6a4a30));
  fireLight = new T.PointLight(0xff8a3a, 30, 14, 1.6); fireLight.position.set(x, 1.5, z); scene.add(fireLight);
  const sm = new T.SpriteMaterial({ map: smokeTex, color: 0xd9d4cc, transparent: true, depthWrite: false, opacity: .5 });
  for (let i = 0; i < 26; i++) { const s = new T.Sprite(sm.clone()); s.userData.t = rand() * 6; scene.add(s); smoke.push(s); }
  solidCircle(x, z, 3.4);
  reserve(x - 7, z - 6, x + 7, z + 6);
  mapShapes.push({ circle: true, x, z, r: 3.4, c: '#d4622a', label: 'Bãi nung lộ thiên' });
}

// ---------- grape trellis (giàn nho) ----------
const grapes = new T.Vector3(36, 0, 22);
{
  const { x, z } = grapes;
  for (let i = -2; i <= 2; i++) for (const sz of [-3, 0, 3]) { cyl(.07, .08, 2.3, x + i * 2.5, 0, z + sz, 0x6b4a2e, scene, 6); solidCircle(x + i * 2.5, z + sz, .15); }
  for (let i = 0; i < 26; i++) blob(R(.6, 1), x + R(-5, 5), 2.4, z + R(-3.2, 3.2), pick([0x5c8a35, 0x4d7a2f, 0x6b9a42]), scene, .35);
  for (let i = 0; i < 30; i++) { const c = new T.Mesh(new T.ConeGeometry(.12, .3, 6), M(pick([0x5a2a6e, 0x6e2f80, 0x7aa64a]))); c.rotation.x = Math.PI; c.position.set(x + R(-4.8, 4.8), 2.05, z + R(-3, 3)); add(c); }
  reserve(x - 6, z - 4, x + 6, z + 4);
  mapShapes.push({ x0: x - 5.5, z0: z - 3.5, x1: x + 5.5, z1: z + 3.5, c: '#5c8a35', label: 'Giàn nho' });
}

// ---------- village houses ----------
const HOUSE_COLORS = [0xf1e1b8, 0xe9c9a0, 0xf4ecd8, 0xd9e4d0, 0xf0d2b4, 0xe8dcc0];
function house(x, z, rot) {
  const g = new T.Group(); g.position.set(x, 0, z); g.rotation.y = rot; scene.add(g);
  const w = R(7, 9), d = R(5.5, 6.5), h = 3;
  box(w + .4, .25, d + .4, 0, 0, 0, M(0xb8a382), g);
  const wl = box(w, h, d, 0, .25, 0, M(pick(HOUSE_COLORS)), g); blockers.push(wl);
  box(1.1, 2.1, .06, 0, .25, d / 2 + .01, M(0x5a3a22), g, false);
  for (const sx of [-1, 1]) { box(1.1, .95, .06, sx * w / 3.3, 1.3, d / 2 + .01, M(0x2f4858), g, false); box(1.3, .1, .1, sx * w / 3.3, 1.2, d / 2 + .05, M(0xf7efdc), g, false); }
  const r = add(new T.Mesh(hipRoof(w + 1.2, d + 1.2, 2), tileMat), g); r.position.y = h + .25;
  // porch
  for (const sx of [-1, 1]) box(.2, 2.6, .2, sx * (w / 2 - .4), .25, d / 2 + 1.8, M(0x6b4a2e), g);
  const por = box(w, .08, 2, 0, 2.85, d / 2 + 1, tileMat, g); por.rotation.x = .12;
  for (let i = 0; i < 3; i++) pot(pick(['lu', 'moc', 'tall']), R(-w / 2 + .6, w / 2 - .6), 0, d / 2 + R(2.4, 3.6), R(.35, .5), terra(), g);
  const quarter = Math.round(rot / (Math.PI / 2)) % 2 !== 0;
  const hw = (quarter ? d : w) / 2 + .2, hd = (quarter ? w : d) / 2 + .2;
  solidRect(x - hw, z - hd, x + hw, z + hd);
  reserve(x - hw - 2, z - hd - 2, x + hw + 2, z + hd + 2);
  mapShapes.push({ x0: x - hw, z0: z - hd, x1: x + hw, z1: z + hd, c: '#a8523a' });
}
[[-60, -18, Math.PI / 2], [-62, 10, Math.PI / 2], [-62, 36, Math.PI / 2], [-30, -40, 0], [-8, -40, 0], [16, -40, 0], [60, -34, -Math.PI / 2],
 [-30, 38, Math.PI], [58, -12, -Math.PI / 2], [30, 40, Math.PI], [-80, -40, Math.PI / 2], [78, 60, Math.PI], [-78, 62, Math.PI]]
  .forEach(([x, z, r]) => house(x, z, r));

// ---------- far landmarks ----------
const clouds = [];
{
  // Cham-style brick tower on a hill
  const tx = -60, tz = -185;
  const hill = new T.Mesh(new T.SphereGeometry(34, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), M(0xa69465, { flatShading: true }));
  hill.scale.y = .38; hill.position.set(tx, 0, tz); add(hill, scene, false, true);
  let y = 12.5, s = 9;
  for (let i = 0; i < 5; i++) {
    const h = i ? 3 : 8; box(s, h, s, tx, y, tz, brickMat, scene, false);
    if (!i) for (let k = 0; k < 4; k++) { const a = chamArch(2.6, 5, scene, 0, 0, 0); a.position.set(tx + Math.sin(k * Math.PI / 2) * (s / 2 + .1), y, tz + Math.cos(k * Math.PI / 2) * (s / 2 + .1)); a.rotation.y = k * Math.PI / 2; a.material = brickMat; }
    y += h; s *= .74;
  }
  const c = new T.Mesh(new T.ConeGeometry(s * .7, 4, 4), brickMat); c.position.set(tx, y + 2, tz); c.rotation.y = Math.PI / 4; scene.add(c);
  // mountains
  for (let i = 0; i < 26; i++) {
    const a = i / 26 * Math.PI * 2 + R(-.1, .1), d = R(300, 380);
    const m = new T.Mesh(new T.ConeGeometry(R(50, 90), R(35, 80), 7), M(pick([0x9d9a74, 0x8f8d6a, 0xa8a07a]), { flatShading: true }));
    m.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); m.position.y = terrainH(m.position.x, m.position.z)[0] - 6; m.rotation.y = R(0, 3); scene.add(m);
  }
  // clouds
  const cm = new T.MeshLambertMaterial({ color: 0xffffff, fog: false, emissive: 0x9aa8b8 });
  for (let i = 0; i < 14; i++) {
    const g = new T.Group(); g.position.set(R(-400, 400), R(90, 140), R(-400, 300)); scene.add(g); g.userData.cloud = R(1, 3); clouds.push(g);
    for (let k = 0; k < 5; k++) { const b = new T.Mesh(new T.IcosahedronGeometry(R(10, 18), 1), cm); b.position.set(k * 12 - 24 + R(-4, 4), R(-3, 4), R(-6, 6)); b.scale.y = .55; g.add(b); }
  }
}

// ---------- player ----------
const player = person({ skin: 0xc68a5e, shirt: 0x2f8f8a, pants: 0x4a5a7a, shoes: 0xf2f2f2, backpack: 0x6b6b4a, hair: 0x1b1410 });
player.position.set(0, 0, 47); player.rotation.y = Math.PI; scene.add(player);
const P = { vel: new T.Vector3(), vy: 0, grounded: true, run: false };

// ---------- artisans (NPC with dialog) ----------
const ARTISANS = [
  {
    id: 'shape', name: 'Nghệ nhân tạo hình', short: 'Tạo hình', initial: 'T', pos: new T.Vector3(WORK.x, 0, WORK.z + .95),
    look: { dress: 0x8a2f3a, shirt: 0x8a2f3a, scarf: 0xf2eee4, sash: 0xd6aa4c, skin: 0xb07650 },
    lines: [
      'Chào bạn! Ở Bàu Trúc, chúng tôi không dùng bàn xoay. Khối đất đặt trên một bệ cố định, còn người thợ đi vòng quanh nó.',
      'Mỗi vòng đi, đôi tay vuốt đất lên cao dần. Vì vậy mỗi chiếc bình đều có dáng riêng, không cái nào giống hệt cái nào.',
      'Đất sét thường được lấy ven sông Quao rồi trộn với cát mịn, để gốm chịu được lửa khi nung ngoài trời.',
    ],
    note: ['Tạo hình không dùng bàn xoay', 'Người thợ đi vòng quanh bệ đất cố định để vuốt đất thành hình. Đất sét ven sông Quao được trộn cát mịn.'],
  },
  {
    id: 'fire', name: 'Nghệ nhân giữ lửa', short: 'Giữ lửa', initial: 'L', pos: new T.Vector3(FIRE.x - 4.4, 0, FIRE.z + 2.6),
    look: { shirt: 0x3f5e8c, pants: 0x2d2a26, hat: 'non', skin: 0x9c6a45 },
    lines: [
      'Bạn thấy đống rơm đang cháy kia chứ? Gốm Bàu Trúc được nung lộ thiên, không cần lò.',
      'Sản phẩm xếp thành đống, phủ rơm và củi rồi đốt trong vài giờ. Lửa không đều nên mỗi món có những mảng màu loang đỏ, nâu, đen.',
      'Khi gốm còn nóng, người thợ có thể quét nước nhuộm từ vỏ cây để tạo sắc màu. Đó là dấu ấn riêng của lửa Bàu Trúc.',
    ],
    note: ['Nung lộ thiên', 'Gốm xếp đống, phủ rơm và củi, đốt ngoài trời trong vài giờ. Lửa không đều tạo nên những mảng màu loang tự nhiên.'],
  },
  {
    id: 'story', name: 'Người kể chuyện làng', short: 'Kể chuyện', initial: 'K', pos: new T.Vector3(0, .4, -2.6),
    look: { dress: 0xf2eee4, shirt: 0xf2eee4, scarf: 0xb14a2e, sash: 0xb14a2e, skin: 0xc68a5e },
    lines: [
      'Chào mừng bạn đến nhà trưng bày! Nghề gốm ở đây gắn với phụ nữ Chăm, kỹ thuật được truyền từ mẹ sang con.',
      'Hoa văn trên gốm thường được tạo bằng những dụng cụ giản dị như vỏ sò, que tre hay mảnh vải.',
      'Năm 2022, nghệ thuật làm gốm của người Chăm được UNESCO ghi danh vào Danh sách di sản văn hóa phi vật thể cần bảo vệ khẩn cấp.',
    ],
    note: ['Di sản cần bảo vệ khẩn cấp', 'Nghề gốm gắn với phụ nữ Chăm, truyền từ mẹ sang con. UNESCO ghi danh năm 2022.'],
  },
];
for (const a of ARTISANS) {
  a.mesh = person(a.look); a.mesh.position.copy(a.pos); scene.add(a.mesh);
  a.marker = cachedSprite(markNew, a.mesh, 2.6);
  a.mesh.lookAt(a.id === 'fire' ? new T.Vector3(FIRE.x, 0, FIRE.z) : new T.Vector3(a.pos.x, a.pos.y, a.pos.z + 5));
  if (a.id !== 'shape') solidCircle(a.pos.x, a.pos.z, .35);
}

// ---------- tourists, birds, goats, traffic ----------
const tourists = [];
const TOUR_ZONE = { x0: -17, x1: 17, z0: 9, z1: 31 };
for (let i = 0; i < 11; i++) {
  const p = person({ hat: rand() < .25 ? 'non' : undefined, cap: rand() < .25 ? pick([0xffffff, 0xe85d4a, 0x2c3e66]) : undefined, backpack: rand() < .3 ? pick([0x3b3b3b, 0x6b5844]) : undefined, longHair: rand() < .4 });
  p.position.set(R(TOUR_ZONE.x0, TOUR_ZONE.x1), 0, R(TOUR_ZONE.z0, TOUR_ZONE.z1));
  scene.add(p);
  tourists.push({ m: p, target: p.position.clone(), wait: R(0, 4), speed: R(1, 1.5), photo: i < 2 });
}
tourists.slice(0, 2).forEach((t, i) => { t.m.position.set(i ? 4 : -4, 0, 24); t.m.lookAt(0, 0, 0); const r = t.m.userData.rig; r.shR.rotation.x = -1.6; box(.08, .14, .02, 0, -.62, .1, 0x111111, r.shR); });

const birdBody = new T.SphereGeometry(.12, 7, 5), birdWing = BG(.24, .02, .1);
function bird(color = 0x9a9aa6) {
  const g = new T.Group();
  const b = new T.Mesh(birdBody, M(color)); b.scale.set(.9, .8, 1.5); g.add(b);
  const h = new T.Mesh(birdBody, M(0x6f7380)); h.scale.setScalar(.6); h.position.set(0, .1, .16); g.add(h);
  const wl = new T.Mesh(birdWing, M(color)), wr = wl.clone(); wl.position.x = -.14; wr.position.x = .14; g.add(wl, wr);
  g.userData.w = [wl, wr]; g.traverse(o => o.castShadow = true); scene.add(g);
  return g;
}
const pigeons = [];
for (let i = 0; i < 16; i++) {
  const g = bird(pick([0x9a9aa6, 0xb6b6bf, 0x7c7f8c, 0xe8e8ea]));
  const home = new T.Vector3(R(-14, 14), 0, R(9, 30));
  g.position.copy(home); pigeons.push({ g, state: 'ground', t: R(0, 5), target: home.clone(), vel: new T.Vector3() });
}
const flyers = [];
for (let i = 0; i < 9; i++) flyers.push({ g: bird(0x5a5a62), r: R(8, 22), h: R(10, 18), s: R(.25, .45) * (rand() < .5 ? -1 : 1), a: R(0, 6), cx: R(-10, 30), cz: R(-10, 10) });

const goats = [];
const GOAT_ZONE = { x0: 58, x1: 92, z0: 6, z1: 44 };
for (let i = 0; i < 9; i++) {
  const g = new T.Group(), c = pick([0xf2efe8, 0x6b4a32, 0x2a2420, 0xd8c3a0]);
  box(.9, .45, .42, 0, .45, 0, c, g).rotation.y = Math.PI / 2;
  const head = new T.Group(); head.position.set(0, .82, .5); g.add(head);
  box(.24, .3, .38, 0, -.15, .1, c, head); box(.05, .25, .05, -.07, .1, -.02, 0x8a7a66, head).rotation.x = -.5; box(.05, .25, .05, .07, .1, -.02, 0x8a7a66, head).rotation.x = -.5;
  for (const [lx, lz] of [[-.13, .32], [.13, .32], [-.13, -.32], [.13, -.32]]) box(.08, .45, .08, lx, 0, lz, c, g);
  g.position.set(R(GOAT_ZONE.x0, GOAT_ZONE.x1), 0, R(GOAT_ZONE.z0, GOAT_ZONE.z1));
  scene.add(g); goats.push({ g, head, target: g.position.clone(), wait: R(0, 6) });
}
mapShapes.push({ x0: GOAT_ZONE.x0, z0: GOAT_ZONE.z0, x1: GOAT_ZONE.x1, z1: GOAT_ZONE.z1, c: '#b8b070', label: 'Bãi chăn dê' });

const vehicles = [];
function motorbike(color) {
  const g = new T.Group();
  box(.25, .35, 1.4, 0, .35, 0, color, g); box(.3, .25, .55, 0, .7, -.25, 0x222222, g); box(.08, .5, .08, 0, .7, .55, 0x333333, g); box(.6, .05, .05, 0, 1.15, .55, 0x333333, g);
  for (const z of [-.55, .6]) { const w = cyl(.3, .3, .1, 0, 0, z, 0x1a1a1a, g, 12); w.rotation.z = Math.PI / 2; w.position.y = .3; }
  const rider = person({ cap: pick([0xffffff, 0xe85d4a, 0xf1c84b]), shirt: pick(SHIRT) });
  rider.position.set(0, .05, -.2); const r = rider.userData.rig; r.hipL.rotation.x = r.hipR.rotation.x = -1.4; r.shL.rotation.x = r.shR.rotation.x = -1.1;
  g.add(rider); scene.add(g); return g;
}
function truck() {
  const g = new T.Group();
  box(2.2, 1.9, 2, 0, .5, 2.3, 0x2f6fb0, g); box(2.3, 2.3, 4.6, 0, .5, -1.2, 0xe8e2d4, g); box(2, .7, .05, 0, 1.5, 3.31, 0x22303c, g);
  for (const z of [2.2, -.5, -2.6]) for (const x of [-1.05, 1.05]) { const w = cyl(.5, .5, .3, x, 0, z, 0x1a1a1a, g, 12); w.rotation.z = Math.PI / 2; w.position.y = .5; }
  scene.add(g); return g;
}
for (let i = 0; i < 7; i++) {
  const dir = i % 2 ? 1 : -1, m = i === 3 ? truck() : motorbike(pick([0xd8302f, 0x2f6fb0, 0x111111, 0xf2f2f2, 0x47a37a]));
  m.position.set(R(-150, 150), 0, dir > 0 ? 58.5 : 53.5); m.rotation.y = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
  vehicles.push({ m, dir, speed: i === 3 ? 7 : R(8, 12), cur: 0 });
}

// ---------- collectibles & puzzle pieces ----------
const ITEMS = [
  { id: 'moc', name: 'Bình dáng mộc', pos: [-11.5, .4, 0], kind: 'moc', fact: 'Dáng bình tròn, cổ thon, sắc đất nung ấm — kiểu dáng quen thuộc của gốm Bàu Trúc.' },
  { id: 'cao', name: 'Bình cổ cao', pos: [-27, 0, 4], kind: 'cao', fact: 'Cổ bình vươn dài từ thân bầu, được vuốt lên từng chút khi người thợ đi vòng quanh.' },
  { id: 'bat', name: 'Bát đất', pos: [-37, 0, 21], kind: 'bat', fact: 'Đồ gia dụng như bát, nồi từng là sản phẩm chính phục vụ đời sống hằng ngày.' },
  { id: 'lu', name: 'Lu nước', pos: [0, 0, -12], kind: 'lu', fact: 'Lu, vò lớn dùng chứa nước, chứa lương thực — rất cần ở miền nắng gió Ninh Thuận.' },
  { id: 'noi', name: 'Nồi đất', pos: [38, 0, 1], kind: 'noi', fact: 'Nồi đất nung lộ thiên chịu nhiệt tốt, giữ hương vị món ăn quê nhà.' },
  { id: 'den', name: 'Đèn gốm', pos: [37.2, 0, 23.5], kind: 'den', fact: 'Đèn gốm là một trong những sản phẩm trang trí làng làm thêm để phục vụ khách tham quan.' },
  { id: 'apsara', name: 'Phù điêu Apsara', pos: [-55, 0, 14], kind: 'apsara', fact: 'Hình tượng vũ nữ Apsara gợi nhắc nghệ thuật điêu khắc Chăm, được nghệ nhân đưa vào gốm trang trí.' },
];
const PIECES = [[13, .4, 0], [-46, 0, -34], [72, 0, 26], [17, 0, 28.5], [-70, 0, 46], [24, 0, -48]];
const pickups = [];
const beamMat = new T.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: .16, depthWrite: false, side: T.DoubleSide });
const ringMat = new T.MeshBasicMaterial({ color: 0xffc94a, transparent: true, opacity: .75, side: T.DoubleSide });
const beamGeo = new T.CylinderGeometry(.55, .55, 7, 16, 1, true), ringGeo = new T.RingGeometry(.6, .8, 32);
let pieceGeo;
{
  const s = new T.Shape(); s.moveTo(-.3, -.3); s.lineTo(.3, -.3); s.lineTo(.3, -.1); s.absarc(.3, 0, .1, -Math.PI / 2, Math.PI / 2, false);
  s.lineTo(.3, .3); s.lineTo(.1, .3); s.absarc(0, .3, .1, 0, Math.PI, false); s.lineTo(-.3, .3); s.lineTo(-.3, -.3);
  pieceGeo = new T.ExtrudeGeometry(s, { depth: .12, bevelEnabled: true, bevelSize: .03, bevelThickness: .03, bevelSegments: 1 }); pieceGeo.center();
}
function makePickup(kind, x, y, z, data) {
  const g = new T.Group(); g.position.set(x, y, z); scene.add(g);
  let model;
  if (kind === 'piece') model = new T.Mesh(pieceGeo, new T.MeshLambertMaterial({ color: 0xf2b544, emissive: 0x6a4300 }));
  else if (kind === 'apsara') model = new T.Mesh(BG(.6, .85, .08), [M(0x8c4527), M(0x8c4527), M(0x8c4527), M(0x8c4527), new T.MeshLambertMaterial({ map: apsaraTex, emissive: 0x2a1000 }), new T.MeshLambertMaterial({ map: apsaraTex })]);
  else { model = new T.Mesh(potGeo[kind], new T.MeshLambertMaterial({ map: terraMats[0].map, side: T.DoubleSide, emissive: 0x3a1a08 })); model.scale.setScalar(kind === 'bat' ? .45 : .35); model.position.y = -.35; }
  const spin = new T.Group(); spin.position.y = 1.1; spin.add(model); g.add(spin); model.castShadow = true;
  const beam = new T.Mesh(beamGeo, beamMat); beam.position.y = 3.5; g.add(beam);
  const ring = new T.Mesh(ringGeo, ringMat); ring.rotation.x = -Math.PI / 2; ring.position.y = .05; g.add(ring);
  const p = { kind, g, spin, ring, data, got: false, pos: new T.Vector3(x, y, z) };
  pickups.push(p); return p;
}
ITEMS.forEach(it => makePickup(it.kind, ...it.pos, it));
PIECES.forEach((p, i) => makePickup('piece', ...p, { id: 'piece' + i }));

// ---------- scatter vegetation ----------
[[-19, 10], [19, 10], [-20, 30], [20, 30], [-7, 36], [7, 36], [-24, 6], [24, 6]].forEach(([x, z]) => palm(x, z));
[[-9, 12], [9, 12], [-14, 26], [14, 26]].forEach(([x, z]) => frangipani(x, z));
[[-10, 26], [10, 26]].forEach(([x, z]) => { pot('tall', x, 0, z, .5); solidCircle(x, z, .35); });
for (const p of pickups) reserve(p.pos.x - 1.5, p.pos.z - 1.5, p.pos.x + 1.5, p.pos.z + 1.5);
for (let i = 0; i < 180; i++) {
  const x = R(-110, 110), z = R(-110, 48);
  if (!isFree(x, z, 2)) continue;
  const k = rand();
  if (k < .32) tree(x, z); else if (k < .5) cactus(x, z); else if (k < .62) palm(x, z); else if (k < .72) bougainvillea(x, z, R(.8, 1.3)); else if (k < .78) frangipani(x, z); else agave(x, z);
}
{ // grass tufts & stones (instanced)
  const n = 1400, im = new T.InstancedMesh(new T.ConeGeometry(.14, .55, 4), M(0xa7a55c, { flatShading: true }), n);
  const st = new T.InstancedMesh(new T.DodecahedronGeometry(.25, 0), M(0xa39a8c, { flatShading: true }), 300);
  const m4 = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), v = new T.Vector3(), s = new T.Vector3();
  const col = new T.Color();
  let a = 0, b = 0;
  for (let i = 0; i < 6000 && (a < n || b < 300); i++) {
    const x = R(-110, 110), z = R(-110, 75);
    if (!isFree(x, z, .6)) continue;
    if (a < n) {
      e.set(R(-.2, .2), R(0, 6), R(-.2, .2)); q.setFromEuler(e); const sc = R(.6, 1.4);
      m4.compose(v.set(x, .2 * sc, z), q, s.set(sc, sc, sc)); im.setMatrixAt(a, m4);
      im.setColorAt(a, col.setHSL(R(.13, .2), R(.3, .45), R(.4, .55))); a++;
    } else if (b < 300) {
      e.set(R(0, 3), R(0, 3), 0); q.setFromEuler(e); const sc = R(.5, 1.6);
      m4.compose(v.set(x, .05, z), q, s.set(sc, sc * .6, sc)); st.setMatrixAt(b++, m4);
    }
  }
  im.count = a; st.count = b; im.receiveShadow = st.receiveShadow = true; st.castShadow = true;
  scene.add(im, st);
}

const PHOTO_SPOT = new T.Vector3(0, 0, 20);
{
  const ring = new T.Mesh(new T.RingGeometry(1.1, 1.4, 40), new T.MeshBasicMaterial({ color: 0x4c8dff, transparent: true, opacity: .8 }));
  ring.rotation.x = -Math.PI / 2; ring.position.set(PHOTO_SPOT.x, .05, PHOTO_SPOT.z); scene.add(ring);
  const s = new T.Sprite(new T.SpriteMaterial({ map: markerTexture('📷', '#4c8dff', '#fff'), depthTest: false })); s.scale.set(.6, .6, .6); s.position.set(PHOTO_SPOT.x, 1.4, PHOTO_SPOT.z); s.renderOrder = 10; scene.add(s);
  PHOTO_SPOT.userData = { ring, s };
}

// ---------- state / HUD ----------
const state = { coins: 500000, mana: 100, met: new Set(), items: new Set(), pieces: new Set(), photo: false, visitedHall: false, notes: [], gameMin: 8 * 60 + 7, done: false };
const fmt = n => new Intl.NumberFormat('vi-VN').format(n);
const DAYS = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
{ const d = new Date(); $('#date').textContent = `${DAYS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1} · Nắng nhẹ`; }
function toast(html) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html; $('#toasts').append(t);
  setTimeout(() => t.remove(), 3500);
}
function addNote(title, text) { if (!state.notes.some(n => n.title === title)) state.notes.push({ title, text }); }
function refreshHUD() {
  $('#coins').textContent = fmt(state.coins) + ' GVNĐ';
  $('#pieces').textContent = `${state.pieces.size}/${PIECES.length}`;
  $('#pieces-bar').style.width = (state.pieces.size / PIECES.length * 100) + '%';
  $('#bag').textContent = state.items.size + state.pieces.size;
  const q = [['#q-met', `Gặp gỡ nghệ nhân (${state.met.size}/3)`, state.met.size === 3], ['#q-items', `Gốm đặc trưng (${state.items.size}/${ITEMS.length})`, state.items.size === ITEMS.length], ['#q-photo', `Ảnh kỷ niệm (${state.photo ? 1 : 0}/1)`, state.photo]];
  let activeSet = false;
  for (const [sel, txt, done] of q) {
    const el = $(sel); el.textContent = txt; el.classList.toggle('done', done);
    el.classList.toggle('active', !done && !activeSet); if (!done) activeSet = true;
  }
  if (!state.done && state.met.size === 3 && state.items.size === ITEMS.length && state.photo) {
    state.done = true;
    setTimeout(() => openPanel('HOÀN THÀNH HÀNH TRÌNH', `<h2>Bạn đã khám phá trọn Bàu Trúc!</h2><p>Gặp đủ ba nghệ nhân, sưu tầm 7 món gốm đặc trưng và lưu lại một tấm ảnh kỷ niệm. Phần thưởng: <b>+200.000 GVNĐ</b>.</p><p>Muốn tự tay nặn một chiếc bình? Xem buổi workshop mẫu trên trang chính.</p><div class="row"><button class="btn ghost" data-close>Tiếp tục dạo</button><a class="btn" href="index.html#workshop">Xem workshop</a></div>`), 600);
    state.coins += 200000; setTimeout(refreshHUD, 650);
  }
}

// ---------- panels ----------
const panel = $('#panel');
let uiOpen = false;
function openPanel(kicker, html) {
  $('#panel-kicker').textContent = kicker; $('#panel-body').innerHTML = html;
  $('#panel-body').querySelectorAll('[data-close]').forEach(b => b.onclick = () => panel.close());
  if (!panel.open) panel.showModal(); uiOpen = true; keys.clear(); joy.active = false; $('#joy').hidden = true;
}
panel.addEventListener('close', () => { uiOpen = false; });
$('#panel .close').onclick = () => panel.close();
panel.addEventListener('click', e => { if (e.target === panel) panel.close(); });

function talk(a) {
  let i = 0;
  const render = () => {
    openPanel(a.name.toUpperCase(), `<div class="talk"><div class="avatar">${a.initial}</div><div><h2>${a.name}</h2><p class="line">${a.lines[i]}</p></div></div>
      <div class="row"><span class="dots">${a.lines.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</span>
      <button class="btn" id="talk-next">${i < a.lines.length - 1 ? 'Tiếp →' : 'Cảm ơn!'}</button></div>`);
    $('#talk-next').onclick = () => { if (++i < a.lines.length) render(); else { panel.close(); finishTalk(a); } };
  };
  a.mesh.lookAt(player.position.x, a.mesh.position.y, player.position.z);
  render();
}
function finishTalk(a) {
  if (state.met.has(a.id)) return;
  state.met.add(a.id); a.marker.material = markDone; state.coins += 50000;
  addNote(...a.note);
  toast(`Đã gặp <em>${a.name}</em> · +50.000 GVNĐ · Sổ tay mới`);
  refreshHUD();
}
function potIcon(kind) {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
  if (kind === 'apsara') { g.drawImage(apsaraTex.image, 34, 4, 60, 120); return c.toDataURL(); }
  const pts = POTS[kind], half = pts.slice(0, Math.ceil(pts.length / 2) + 1), maxH = Math.max(...pts.map(p => p[1])), maxR = Math.max(...pts.map(p => p[0]));
  const s = Math.min(100 / maxH, 54 / maxR);
  g.beginPath(); half.forEach(([r, y], i) => g[i ? 'lineTo' : 'moveTo'](64 + r * s, 116 - y * s)); [...half].reverse().forEach(([r, y]) => g.lineTo(64 - r * s, 116 - y * s));
  const gr = g.createLinearGradient(20, 0, 108, 0); gr.addColorStop(0, '#d58a5c'); gr.addColorStop(1, '#8c4527'); g.fillStyle = gr; g.fill();
  return c.toDataURL();
}
function showCollection() {
  openPanel('BỘ SƯU TẬP', `<h2>Gốm đặc trưng · ${state.items.size}/${ITEMS.length}</h2>
    <div class="grid7">${ITEMS.map(it => `<div class="item ${state.items.has(it.id) ? '' : 'locked'}"><img src="${potIcon(it.kind)}" width="64" height="64" alt="" style="display:block;margin:0 auto 6px;${state.items.has(it.id) ? '' : 'filter:brightness(0) invert(.4)'}">${state.items.has(it.id) ? it.name : 'Chưa tìm thấy'}</div>`).join('')}</div>
    <h2>Mảnh ghép · ${state.pieces.size}/${PIECES.length}</h2><p>Ghép đủ 6 mảnh để mở bức ảnh gốm Bàu Trúc.</p>
    <div class="puzzle-img">${PIECES.map((_, i) => `<span class="${state.pieces.has('piece' + i) ? 'got' : ''}">${state.pieces.has('piece' + i) ? '' : i + 1}</span>`).join('')}</div>`);
}
function showNotes() {
  openPanel('SỔ TAY', `<h2>Những điều đã học</h2>${state.notes.length ? `<ul class="notes">${state.notes.map(n => `<li><b>${n.title}</b><p>${n.text}</p></li>`).join('')}</ul>` : '<p>Sổ tay còn trống. Trò chuyện với nghệ nhân và nhặt gốm đặc trưng để ghi thêm.</p>'}
  <p class="fine">Thông tin tóm lược để trải nghiệm, nên tham khảo thêm tư liệu chính thức.</p>`);
}
function showMap() {
  openPanel('BẢN ĐỒ', `<canvas id="bigmap" width="720" height="720"></canvas><div class="legend"><span><i style="background:#2f8f8a"></i>Bạn</span><span><i style="background:#f2b544"></i>Nghệ nhân</span><span><i style="background:#ff7a3a"></i>Gốm đặc trưng</span><span><i style="background:#c38bff"></i>Mảnh ghép</span><span><i style="background:#4c8dff"></i>Điểm chụp ảnh</span></div>`);
  drawMap($('#bigmap').getContext('2d'), 720, 0, 8, 3.4, true);
}

// ---------- map drawing ----------
function drawMap(g, size, cx, cz, scale, labels = false, heading = null) {
  const W = size, toX = x => W / 2 + (x - cx) * scale, toY = z => W / 2 + (z - cz) * scale;
  g.fillStyle = '#dcc89e'; g.fillRect(0, 0, W, W);
  for (const s of mapShapes) {
    g.fillStyle = s.c;
    if (s.circle) { g.beginPath(); g.arc(toX(s.x), toY(s.z), s.r * scale, 0, 7); g.fill(); }
    else g.fillRect(toX(s.x0), toY(s.z0), (s.x1 - s.x0) * scale, (s.z1 - s.z0) * scale);
  }
  const dot = (x, z, c, r) => { g.fillStyle = c; g.beginPath(); g.arc(toX(x), toY(z), r, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = Math.max(1.5, r / 3); g.stroke(); };
  const rr = labels ? 7 : 6;
  for (const p of pickups) if (!p.got) dot(p.pos.x, p.pos.z, p.kind === 'piece' ? '#c38bff' : '#ff7a3a', rr * .8);
  for (const a of ARTISANS) dot(a.pos.x, a.pos.z, state.met.has(a.id) ? '#5bd38a' : '#f2b544', rr);
  if (!state.photo) dot(PHOTO_SPOT.x, PHOTO_SPOT.z, '#4c8dff', rr);
  if (labels) {
    g.font = `700 15px ${FONT}`; g.textAlign = 'center';
    for (const s of mapShapes) if (s.label) {
      const x = s.circle ? s.x : (s.x0 + s.x1) / 2, z = s.circle ? s.z - s.r - 1.5 : s.z0 - 1.5;
      g.fillStyle = 'rgba(20,32,64,.85)'; const w = g.measureText(s.label).width + 12; g.fillRect(toX(x) - w / 2, toY(z) - 17, w, 22);
      g.fillStyle = '#fff'; g.fillText(s.label, toX(x), toY(z));
    }
  }
  // player arrow
  g.save(); g.translate(toX(player.position.x), toY(player.position.z)); g.rotate(Math.PI - player.rotation.y);
  const a = labels ? 13 : 11;
  g.fillStyle = '#2f8f8a'; g.strokeStyle = '#fff'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(0, -a); g.lineTo(a * .75, a * .8); g.lineTo(0, a * .4); g.lineTo(-a * .75, a * .8); g.closePath(); g.stroke(); g.fill();
  g.restore();
  if (heading !== null) { // camera view cone on minimap
    g.save(); g.translate(W / 2, W / 2); g.rotate(-heading);
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, W * .45); gr.addColorStop(0, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, W * .45, -Math.PI / 2 - .5, -Math.PI / 2 + .5); g.fill(); g.restore();
  }
}
const mini = $('#minimap').getContext('2d');

// ---------- photo ----------
function takePhoto() {
  if (uiOpen) return;
  renderer.render(scene, camera);
  const src = renderer.domElement.toDataURL('image/jpeg', .9);
  const img = new Image();
  img.onload = () => {
    const w = 1280, h = Math.round(w * img.height / img.width), c = document.createElement('canvas'); c.width = w; c.height = h + 110;
    const g = c.getContext('2d'); g.fillStyle = '#f7f3eb'; g.fillRect(0, 0, w, h + 110); g.drawImage(img, 0, 0, w, h);
    g.fillStyle = '#a3442b'; g.font = `800 40px ${FONT}`; g.fillText('LÀNG GỐM BÀU TRÚC', 34, h + 58);
    g.fillStyle = '#7e786e'; g.font = `500 22px ${FONT}`; g.fillText('Ninh Phước · Ninh Thuận · ' + new Date().toLocaleDateString('vi-VN'), 34, h + 92);
    const url = c.toDataURL('image/jpeg', .9);
    const atSpot = player.position.distanceTo(PHOTO_SPOT) < 3.2;
    openPanel('ẢNH KỶ NIỆM', `<img class="photo" src="${url}" alt="Ảnh chụp trong làng gốm Bàu Trúc 3D">
      <p style="margin-top:12px">${atSpot ? 'Tuyệt! Bạn đã chụp ảnh tại điểm check-in trước nhà trưng bày.' : 'Ảnh đẹp đấy! Đứng trong vòng tròn xanh trước nhà trưng bày để hoàn thành nhiệm vụ ảnh kỷ niệm.'}</p>
      <div class="row"><button class="btn ghost" data-close>Đóng</button><a class="btn" download="bau-truc-3d.jpg" href="${url}">Tải ảnh</a></div>`);
    if (atSpot && !state.photo) {
      state.photo = true; state.coins += 30000; PHOTO_SPOT.userData.s.visible = false; PHOTO_SPOT.userData.ring.visible = false;
      addNote('Điểm check-in', 'Ảnh kỷ niệm trước nhà trưng bày làng gốm Bàu Trúc.');
      toast('Hoàn thành <em>Ảnh kỷ niệm</em> · +30.000 GVNĐ'); refreshHUD();
    }
  };
  img.src = src;
}

// ---------- input ----------
const keys = new Set();
const joy = { active: false, id: null, ox: 0, oy: 0, x: 0, y: 0 };
let yaw = Math.PI * 0, pitch = .32, camDist = 6.5, jumpQueued = false, runToggle = false, started = false;
addEventListener('keydown', e => {
  if (!started || uiOpen) return;
  keys.add(e.code);
  if (e.code === 'Space') { jumpQueued = true; e.preventDefault(); }
  if (e.code === 'KeyE') interact();
  if (e.code === 'KeyC') takePhoto();
  if (e.code === 'KeyM') showMap();
  if (e.code === 'KeyB') showCollection();
  if (e.code === 'KeyN') showNotes();
});
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', () => keys.clear());
const cvs = renderer.domElement;
const drags = new Map();
cvs.addEventListener('pointerdown', e => {
  if (!started) return;
  cvs.setPointerCapture(e.pointerId);
  if (e.pointerType === 'touch' && e.clientX < innerWidth * .45 && !joy.active) {
    Object.assign(joy, { active: true, id: e.pointerId, ox: e.clientX, oy: e.clientY, x: 0, y: 0 });
    const j = $('#joy'); j.hidden = false; j.style.left = e.clientX + 'px'; j.style.top = e.clientY + 'px'; $('#knob').style.transform = '';
  } else drags.set(e.pointerId, { x: e.clientX, y: e.clientY });
});
cvs.addEventListener('pointermove', e => {
  if (joy.active && e.pointerId === joy.id) {
    let dx = e.clientX - joy.ox, dy = e.clientY - joy.oy; const d = Math.hypot(dx, dy), m = 50;
    if (d > m) { dx *= m / d; dy *= m / d; }
    joy.x = dx / m; joy.y = dy / m; $('#knob').style.transform = `translate(${dx}px,${dy}px)`;
    return;
  }
  const p = drags.get(e.pointerId); if (!p) return;
  const k = e.pointerType === 'touch' ? .007 : .005;
  yaw -= (e.clientX - p.x) * k; pitch = clamp(pitch + (e.clientY - p.y) * k * .8, -.15, 1.25);
  p.x = e.clientX; p.y = e.clientY;
});
const endPtr = e => { if (joy.active && e.pointerId === joy.id) { joy.active = false; joy.x = joy.y = 0; $('#joy').hidden = true; } drags.delete(e.pointerId); };
cvs.addEventListener('pointerup', endPtr); cvs.addEventListener('pointercancel', endPtr);
cvs.addEventListener('wheel', e => { e.preventDefault(); camDist = clamp(camDist + e.deltaY * .01, 3, 14); }, { passive: false });
cvs.addEventListener('contextmenu', e => e.preventDefault());

$('#btn-jump').addEventListener('pointerdown', () => jumpQueued = true);
$('#btn-run').onclick = e => { runToggle = !runToggle; e.currentTarget.classList.toggle('on', runToggle); };
$('#btn-act').onclick = () => interact();
$('#prompt').onclick = () => interact();
$('#btn-photo').onclick = takePhoto;
$('#btn-map').onclick = showMap;
$('#btn-collection').onclick = showCollection;
$('#btn-notes').onclick = showNotes;
$('#q-toggle').onclick = e => { const q = $('#quests'); q.classList.toggle('collapsed'); e.currentTarget.setAttribute('aria-expanded', !q.classList.contains('collapsed')); };
if (innerWidth < 760) $('#quests').classList.add('collapsed');

// ---------- interactions ----------
let currentAction = null;
function findAction() {
  const p = player.position;
  for (const a of ARTISANS) if (Math.hypot(p.x - a.mesh.position.x, p.z - a.mesh.position.z) < 2.6) return { text: `Trò chuyện với ${a.name}`, run: () => talk(a) };
  if (Math.hypot(p.x - (WORK.x + 3.6), p.z - (WORK.z + 1.5)) < 1.8 || Math.hypot(p.x - (WORK.x - 3.6), p.z - (WORK.z + 1.5)) < 1.8)
    return { text: 'Thử nặn gốm', run: () => openPanel('XƯỞNG TẠO HÌNH', `<h2>Thử đi vòng quanh bệ đất</h2><p>Người thợ Bàu Trúc vừa bước giật lùi quanh bệ, vừa dùng tay và miếng vải ướt vuốt đất lên. Bạn hãy thử: đi một vòng quanh bệ gốm này và quan sát dáng bình.</p><p>Muốn tự tay làm thật? Xem buổi workshop mẫu (90 phút, nhóm nhỏ) trên trang chính.</p><div class="row"><button class="btn ghost" data-close>Ở lại xưởng</button><a class="btn" href="index.html#workshop">Xem workshop</a></div>`) };
  if (p.distanceTo(PHOTO_SPOT) < 1.6 && !state.photo) return { text: 'Chụp ảnh kỷ niệm', key: 'C', run: takePhoto };
  return null;
}
function interact() { if (!uiOpen && currentAction) currentAction.run(); }

// ---------- objective / waypoint ----------
function objective() {
  if (!state.visitedHall) return { text: 'Vào nhà trưng bày', pos: new T.Vector3(0, 3, 4) };
  for (const id of ['story', 'shape', 'fire']) if (!state.met.has(id)) { const a = ARTISANS.find(x => x.id === id); return { text: `Gặp ${a.name}`, pos: a.mesh.position.clone().setY(a.mesh.position.y + 2.2) }; }
  if (!state.photo) return { text: 'Chụp ảnh tại điểm check-in', pos: PHOTO_SPOT.clone().setY(1.6) };
  let best = null, bd = 1e9;
  for (const p of pickups) if (!p.got && p.kind !== 'piece') { const d = p.pos.distanceTo(player.position); if (d < bd) { bd = d; best = p; } }
  if (best) return { text: `Tìm ${best.data.name}`, pos: best.pos.clone().setY(best.pos.y + 2) };
  return null;
}

// ---------- main loop ----------
const clock = new T.Clock();
const camTarget = new T.Vector3().copy(player.position).setY(1.6);
const ray = new T.Raycaster();
const tmpV = new T.Vector3(), fwd = new T.Vector3(), right = new T.Vector3(), dir = new T.Vector3();
let hudTimer = 0, introT = 0;

function update(dt, t) {
  // ---- player movement ----
  let ix = 0, iz = 0;
  if (started && !uiOpen) {
    if (keys.has('KeyW') || keys.has('ArrowUp')) iz += 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) iz -= 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) ix -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) ix += 1;
    if (joy.active) { ix += joy.x; iz -= joy.y; }
  }
  const len = Math.hypot(ix, iz); if (len > 1) { ix /= len; iz /= len; }
  const moving = len > .08;
  fwd.set(-Math.sin(yaw), 0, -Math.cos(yaw)); right.set(Math.cos(yaw), 0, -Math.sin(yaw));
  dir.copy(fwd).multiplyScalar(iz).addScaledVector(right, ix);
  const wantRun = (keys.has('ShiftLeft') || keys.has('ShiftRight') || runToggle) && moving && state.mana > 2;
  const speed = moving ? (wantRun ? 7 : 3.5) * Math.min(1, len) : 0;
  if (moving) dir.normalize();
  P.vel.x = lerp(P.vel.x, dir.x * speed, Math.min(1, dt * 10)); P.vel.z = lerp(P.vel.z, dir.z * speed, Math.min(1, dt * 10));
  const pos = player.position;
  pos.x += P.vel.x * dt; pos.z += P.vel.z * dt;
  collide(pos, .38);
  const gh = groundH(pos.x, pos.z);
  if (jumpQueued && P.grounded && started && !uiOpen) { P.vy = 5.4; P.grounded = false; }
  jumpQueued = false;
  P.vy -= 15 * dt; pos.y += P.vy * dt;
  if (pos.y <= gh) { pos.y = gh; P.vy = 0; P.grounded = true; } else if (pos.y - gh > .05) P.grounded = false;
  state.mana = clamp(state.mana + (wantRun ? -14 : 9) * dt, 0, 100);
  if (moving) {
    const target = Math.atan2(dir.x, dir.z); let d = target - player.rotation.y;
    d = Math.atan2(Math.sin(d), Math.cos(d)); player.rotation.y += d * Math.min(1, dt * 12);
  }
  const hs = Math.hypot(P.vel.x, P.vel.z);
  animatePerson(player, hs, dt, !P.grounded);

  // ---- hall visit & roof ----
  const inside = pos.x > -14.7 && pos.x < 14.7 && pos.z > -4.7 && pos.z < 1.9;
  hallRoof.visible = !inside;
  if (inside && !state.visitedHall) { state.visitedHall = true; toast('Bạn đã vào <em>Nhà trưng bày</em>'); }

  // ---- camera ----
  if (!started) {
    introT += dt * .06;
    camera.position.set(Math.sin(introT) * 38, 13 + Math.sin(introT * 1.7) * 2, 22 + Math.cos(introT) * 30);
    camera.lookAt(0, 3, 4);
  } else {
    camTarget.lerp(tmpV.set(pos.x, pos.y + 1.6, pos.z), Math.min(1, dt * 12));
    let dist = inside ? Math.min(camDist, 4.2) : camDist;
    const p2 = inside ? Math.min(pitch, .55) : pitch;
    dir.set(Math.sin(yaw) * Math.cos(p2), Math.sin(p2), Math.cos(yaw) * Math.cos(p2));
    ray.set(camTarget, dir); ray.far = dist + .3;
    const hit = ray.intersectObjects(blockers, false)[0];
    if (hit) dist = Math.max(1.1, hit.distance - .35);
    camera.position.copy(camTarget).addScaledVector(dir, dist);
    camera.position.y = Math.max(camera.position.y, groundH(camera.position.x, camera.position.z) + .3);
    if (inside) camera.position.y = Math.min(camera.position.y, 3.7);
    camera.lookAt(camTarget);
  }
  sky.position.copy(camera.position);
  sun.position.copy(pos).add(SUN_OFF); sun.target.position.copy(pos);

  // ---- artisans ----
  const sh = ARTISANS[0];
  if (!uiOpen || !panel.open) {
    const ang = t * .55;
    sh.mesh.position.set(WORK.x + Math.sin(ang) * .95, 0, WORK.z + Math.cos(ang) * .95);
    sh.mesh.rotation.y = ang + Math.PI;
    animatePerson(sh.mesh, .9, dt);
    const r = sh.mesh.userData.rig; r.shR.rotation.x = -.9; r.shR.rotation.z = .5;
  }
  ARTISANS.forEach(a => { a.marker.position.y = 2.6 + Math.sin(t * 3) * .08; });
  if (!state.photo) PHOTO_SPOT.userData.s.visible = camera.position.distanceTo(PHOTO_SPOT.userData.s.position) > 6;
  const fa = ARTISANS[1].mesh.userData.rig; fa.shR.rotation.x = -.6 + Math.sin(t * 1.5) * .3;

  // ---- tourists ----
  for (const tr of tourists) {
    if (tr.photo) continue;
    const m = tr.m;
    if (tr.wait > 0) { tr.wait -= dt; animatePerson(m, 0, dt); continue; }
    tmpV.subVectors(tr.target, m.position); tmpV.y = 0; const d = tmpV.length();
    if (d < .4) { tr.wait = R(1.5, 6); tr.target.set(R(TOUR_ZONE.x0, TOUR_ZONE.x1), 0, R(TOUR_ZONE.z0, TOUR_ZONE.z1)); continue; }
    tmpV.normalize(); m.position.addScaledVector(tmpV, tr.speed * dt);
    const before = m.position.clone(); collide(m.position, .35);
    if (Math.hypot(pos.x - m.position.x, pos.z - m.position.z) < .75) { const k = tmpV.set(m.position.x - pos.x, 0, m.position.z - pos.z).normalize(); m.position.addScaledVector(k, .05); }
    if (before.distanceTo(m.position) > tr.speed * dt * .7) tr.target.set(R(TOUR_ZONE.x0, TOUR_ZONE.x1), 0, R(TOUR_ZONE.z0, TOUR_ZONE.z1));
    m.rotation.y = Math.atan2(tr.target.x - m.position.x, tr.target.z - m.position.z);
    animatePerson(m, tr.speed, dt);
  }
  // player vs tourist push
  for (const tr of tourists) { const m = tr.m.position, dx = pos.x - m.x, dz = pos.z - m.z, d = Math.hypot(dx, dz); if (d < .75 && d > 1e-4) { pos.x += dx / d * (.75 - d); pos.z += dz / d * (.75 - d); } }

  // ---- pigeons ----
  for (const b of pigeons) {
    const g = b.g, [wl, wr] = g.userData.w;
    if (b.state === 'ground') {
      b.t -= dt; g.rotation.x = Math.max(0, Math.sin(t * 6 + g.id)) * .5;
      wl.rotation.z = wr.rotation.z = 0;
      if (b.t < 0) { b.t = R(1, 4); g.rotation.y = R(0, 6.28); }
      g.position.addScaledVector(tmpV.set(Math.sin(g.rotation.y), 0, Math.cos(g.rotation.y)), dt * .25);
      if (Math.hypot(pos.x - g.position.x, pos.z - g.position.z) < 2.6 && hs > .5) {
        b.state = 'fly'; b.t = R(2.5, 4); b.vel.set(g.position.x - pos.x, 0, g.position.z - pos.z).normalize().multiplyScalar(R(3, 5)); b.vel.y = R(3, 4.5);
        b.target.set(R(-14, 14), 0, R(9, 30));
      }
    } else {
      b.t -= dt; const flap = Math.sin(t * 30 + g.id) * .9; wl.rotation.z = flap; wr.rotation.z = -flap; g.rotation.x = 0;
      if (b.t > 0) { g.position.addScaledVector(b.vel, dt); b.vel.y -= dt * 1.2; }
      else { tmpV.subVectors(b.target, g.position); const d = tmpV.length(); g.position.addScaledVector(tmpV.normalize(), Math.min(d, dt * 5)); if (d < .1) { b.state = 'ground'; g.position.y = 0; } }
      g.rotation.y = Math.atan2(b.t > 0 ? b.vel.x : tmpV.x, b.t > 0 ? b.vel.z : tmpV.z);
    }
    if (b.state === 'ground') g.position.y = groundH(g.position.x, g.position.z) + .1;
  }
  for (const f of flyers) {
    f.a += f.s * dt; const g = f.g, [wl, wr] = g.userData.w;
    g.position.set(f.cx + Math.cos(f.a) * f.r, f.h + Math.sin(f.a * 2) * 1.2, f.cz + Math.sin(f.a) * f.r);
    g.rotation.y = -f.a + (f.s > 0 ? Math.PI : 0); const flap = Math.sin(t * 12 + f.r) * .7; wl.rotation.z = flap; wr.rotation.z = -flap;
  }

  // ---- goats ----
  for (const go of goats) {
    const g = go.g;
    if (go.wait > 0) { go.wait -= dt; go.head.rotation.x = .6 + Math.sin(t * 3 + g.id) * .15; continue; }
    tmpV.subVectors(go.target, g.position); const d = tmpV.length();
    if (d < .3) { go.wait = R(2, 8); go.target.set(R(GOAT_ZONE.x0, GOAT_ZONE.x1), 0, R(GOAT_ZONE.z0, GOAT_ZONE.z1)); continue; }
    g.position.addScaledVector(tmpV.normalize(), dt * .7); g.rotation.y = Math.atan2(tmpV.x, tmpV.z); go.head.rotation.x = 0;
    g.position.y = Math.abs(Math.sin(t * 8)) * .03;
  }

  // ---- traffic ----
  for (const v of vehicles) {
    let want = v.speed;
    const ahead = (pos.x - v.m.position.x) * v.dir;
    if (Math.abs(pos.z - v.m.position.z) < 2.2 && ahead > 0 && ahead < 9) want = 0;
    for (const o of vehicles) if (o !== v && o.dir === v.dir) { const a = (o.m.position.x - v.m.position.x) * v.dir; if (a > 0 && a < 7) want = Math.min(want, o.cur * .9); }
    v.cur = lerp(v.cur, want, Math.min(1, dt * 2)); v.m.position.x += v.cur * v.dir * dt;
    if (v.m.position.x > 220) v.m.position.x = -220; if (v.m.position.x < -220) v.m.position.x = 220;
  }

  // ---- fire & smoke ----
  fireLight.intensity = 26 + Math.sin(t * 13) * 5 + Math.sin(t * 7.3) * 4;
  embers.forEach((e, i) => { e.scale.setScalar(.8 + Math.sin(t * 6 + i) * .25); });
  for (const s of smoke) {
    s.userData.t += dt; const k = (s.userData.t % 6) / 6;
    s.position.set(FIRE.x + Math.sin(s.userData.t * 1.3 + s.id) * (.6 + k * 2) + k * 4, 1.4 + k * 14, FIRE.z + Math.cos(s.userData.t + s.id) * (.6 + k * 1.5));
    const sc = 1.4 + k * 6; s.scale.set(sc, sc, sc); s.material.opacity = (1 - k) * .45 * Math.min(1, k * 8);
  }
  for (const o of clouds) { o.position.x += o.userData.cloud * dt; if (o.position.x > 450) o.position.x = -450; }

  // ---- pickups ----
  for (const p of pickups) {
    if (p.got) continue;
    p.spin.rotation.y += dt * 1.6; p.spin.position.y = 1.1 + Math.sin(t * 2.4 + p.pos.x) * .12;
    p.ring.scale.setScalar(1 + Math.sin(t * 3) * .08);
    if (Math.hypot(pos.x - p.pos.x, pos.z - p.pos.z) < 1.25 && Math.abs(pos.y - p.pos.y) < 1.6 && started) {
      p.got = true; scene.remove(p.g);
      if (p.kind === 'piece') { state.pieces.add(p.data.id); state.coins += 20000; toast(`Nhặt được <em>Mảnh ghép ${state.pieces.size}/${PIECES.length}</em> · +20.000 GVNĐ`); if (state.pieces.size === PIECES.length) setTimeout(showCollection, 800); }
      else { state.items.add(p.data.id); state.coins += 40000; addNote(p.data.name, p.data.fact); toast(`Thu thập <em>${p.data.name}</em> · +40.000 GVNĐ`); }
      refreshHUD();
    }
  }

  // ---- HUD (throttled) ----
  hudTimer -= dt;
  if (started) {
    state.gameMin += dt; // 1 phút trong game / giây
    $('#mana-bar').style.width = state.mana + '%';
    currentAction = uiOpen ? null : findAction();
    const pr = $('#prompt'); pr.hidden = !currentAction;
    if (currentAction) { $('#prompt-text').textContent = currentAction.text; pr.querySelector('kbd').textContent = isTouch ? 'Chạm' : (currentAction.key || 'E'); }
    // waypoint
    const ob = objective(), wp = $('#waypoint');
    const obDist = ob ? Math.hypot(ob.pos.x - pos.x, ob.pos.z - pos.z) : 0;
    if (ob && !uiOpen && !(currentAction && obDist < 4)) {
      tmpV.copy(ob.pos).project(camera);
      const behind = tmpV.z > 1;
      let sx = (tmpV.x * .5 + .5) * innerWidth, sy = (-tmpV.y * .5 + .5) * innerHeight;
      if (behind) { sx = clamp(innerWidth - sx, innerWidth * .3, innerWidth * .7); sy = innerHeight * .72; }
      sx = clamp(sx, 110, innerWidth - 110); sy = clamp(sy, innerWidth < 760 ? 250 : 120, innerHeight - 90);
      wp.hidden = false; wp.style.transform = `translate(${sx}px,${sy}px) translate(-50%,-50%)`;
      const dd = Math.round(Math.hypot(ob.pos.x - pos.x, ob.pos.z - pos.z));
      if (hudTimer < 0) { $('#wp-text').textContent = ob.text; $('#wp-dist').textContent = dd + ' m'; }
    } else wp.hidden = true;
  }
  if (hudTimer < 0) {
    hudTimer = .12;
    const m = Math.floor(state.gameMin) % 1440; $('#clock').textContent = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    $('#mana-val').textContent = Math.round(state.mana);
    mini.save(); mini.beginPath(); mini.arc(150, 150, 150, 0, 7); mini.clip();
    drawMap(mini, 300, pos.x, pos.z, 3.2, false, yaw);
    mini.restore();
  }
}

function loop() {
  const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime;
  update(dt, t);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

refreshHUD();
$('#hud').classList.add('off');
const startBtn = $('#btn-start');
startBtn.disabled = false; startBtn.textContent = 'Bắt đầu khám phá';
startBtn.onclick = () => {
  started = true; $('#start').classList.add('hide'); $('#hud').classList.remove('off');
  yaw = 0; pitch = .3;
  camTarget.copy(player.position).setY(1.6);
  setTimeout(() => toast('Đi theo biển chỉ dẫn <em>➜</em> để bắt đầu hành trình'), 600);
  cvs.focus?.();
};
window.__village = { state, player, scene, camera, renderer };
loop();

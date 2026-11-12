const {ST,SB,PG}=DATA;
const sec=await figma.getNodeByIdAsync('1:2');
const WM={300:'Light',400:'Regular',500:'Medium',600:'SemiBold',700:'Bold',800:'ExtraBold'};
const FN=ST.map(s=>{let st=WM[s[1]]||'Regular';if(s[2])st=st=='Regular'?'Italic':st+' Italic';return{family:/Playfair/.test(s[0])?'Playfair Display':'Be Vietnam Pro',style:st}});
await Promise.all([...new Set(FN.map(f=>f.family+'|'+f.style))].map(k=>{const[a,b]=k.split('|');return figma.loadFontAsync({family:a,style:b})}));
const col=c=>({r:c[0],g:c[1],b:c[2]});
const sp=c=>({type:'SOLID',color:col(c),opacity:c.length>3?c[3]:1});
const GR={A:['#6e2c18','#c0653d','#5a2312'],B:['#3d2a20','#8a6448','#2e1f17']};
let CF=sec.children.find(n=>n.name=='🧩 Components');
if(!CF){CF=figma.createFrame();CF.name='🧩 Components';sec.appendChild(CF);CF.layoutMode='HORIZONTAL';CF.layoutWrap='WRAP';CF.itemSpacing=48;CF.counterAxisSpacing=48;CF.paddingTop=CF.paddingBottom=CF.paddingLeft=CF.paddingRight=48;CF.resize(5000,200);CF.primaryAxisSizingMode='FIXED';CF.counterAxisSizingMode='AUTO';CF.fills=[{type:'SOLID',color:{r:1,g:1,b:1}}];CF.x=100;CF.y=6000;}
const REG={};for(const c of CF.children)REG[c.name]=c;
const pot=(s,p)=>{const nm='Gốm minh họa/'+s+' · '+(p=='A'?'đất đỏ':'đất nâu');if(REG[nm])return REG[nm];const b=SB[s].bb,g=GR[p];
 const f=figma.createNodeFromSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${b[2]}" height="${b[3]}" viewBox="${b[0]} ${b[1]} ${b[2]} ${b[3]}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset=".45" stop-color="${g[1]}"/><stop offset="1" stop-color="${g[2]}"/></linearGradient></defs><path d="${SB[s].d}" fill="url(#g)"/></svg>`);
 const c=figma.createComponentFromNode(f);c.name=nm;c.fills=[];for(const k of c.children)k.constraints={horizontal:'SCALE',vertical:'SCALE'};CF.appendChild(c);REG[nm]=c;return c;};
const stripes=(g,w,h)=>{const a=+g.match(/\((\d+)deg/)[1];const st=[...g.matchAll(/rgb\((\d+), (\d+), (\d+)\) (\d+)px/g)];const bd=[];for(let k=0;k+1<st.length;k+=2)bd.push(['#'+[1,2,3].map(j=>(+st[k][j]).toString(16).padStart(2,'0')).join(''),+st[k][4],+st[k+1][4]]);const per=bd[bd.length-1][2],ar=a*Math.PI/180,L=Math.abs(w*Math.sin(ar))+Math.abs(h*Math.cos(ar)),cx=w/2,cy=h/2;let rs='';for(let k=0;k<Math.floor(L/per)+2;k++)for(const[c,s0,e]of bd)rs+=`<rect x="${(cx-L/2+k*per+s0).toFixed(1)}" y="${(cy-L).toFixed(1)}" width="${e-s0}" height="${(2*L).toFixed(1)}" fill="${c}"/>`;const n=figma.createNodeFromSvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><g transform="rotate(${a-90} ${cx} ${cy})">${rs}</g></svg>`);n.name='Họa tiết sọc';n.clipsContent=true;n.fills=[];return n;};
const imgPaints=(d)=>{const P=[];if(d.src)P.push({type:'SOLID',color:d.src=='A'?{r:.24,g:.2,b:.17}:{r:.55,g:.42,b:.33}});if(d.rg)P.push({type:'GRADIENT_RADIAL',gradientTransform:[[1,0,0],[0,1,-.05]],gradientStops:[{position:0,color:{...col(d.rg[0]),a:1}},{position:.7,color:{...col(d.rg[1]),a:1}},{position:1,color:{...col(d.rg[1]),a:1}}]});if(d.ov)P.push({type:'SOLID',color:{r:0,g:0,b:0},opacity:.18},{type:'GRADIENT_LINEAR',gradientTransform:[[0,1,0],[-1,0,1]],gradientStops:[{position:.4,color:{r:0,g:0,b:0,a:0}},{position:1,color:{r:0,g:0,b:0,a:.55}}]});return P;};
const strokes=(n,st)=>{if(!st)return;n.strokes=[sp(st[0])];n.strokeAlign='INSIDE';const w=st[1];if(w.every(v=>v==w[0]))n.strokeWeight=w[0];else{n.strokeTopWeight=w[0];n.strokeRightWeight=w[1];n.strokeBottomWeight=w[2];n.strokeLeftWeight=w[3];}if(st[2])n.dashPattern=[4,4];};
const txt=d=>d.sg.map(s=>s[0]).join('');
const styleText=(t,d)=>{let i=0;for(const[s,si]of d.sg){const a=i,b=i+s.length;i=b;if(!s.length)continue;const st=ST[si];t.setRangeFontName(a,b,FN[si]);t.setRangeFontSize(a,b,st[3]);t.setRangeLineHeight(a,b,st[4]?{unit:'PIXELS',value:st[4]}:{unit:'AUTO'});t.setRangeLetterSpacing(a,b,{unit:'PIXELS',value:st[5]});t.setRangeFills(a,b,[{type:'SOLID',color:col(st[6]),opacity:st[7]}]);}};
const AL={l:'LEFT',c:'CENTER',r:'RIGHT',s:'LEFT',j:'JUSTIFIED',e:'RIGHT'};
let N=0,INST=0;
function place(n,d,parent,pL){parent.appendChild(n);
 if(d.ab&&parent.layoutMode&&parent.layoutMode!='NONE'){n.layoutPositioning='ABSOLUTE';}
 if(d.xy&&(d.ab||!pL)){n.x=d.xy[0];n.y=d.xy[1];}
 if(pL&&!d.ab&&d.sz=='L'){n.layoutSizingHorizontal='FILL';}
}
function mkText(d){const t=figma.createText();t.fontName=FN[d.sg[0][1]];t.characters=txt(d);styleText(t,d);t.textAlignHorizontal=AL[d.al]||'LEFT';if(d.ml){t.textAutoResize='HEIGHT';t.resize(Math.max(d.w+1,1),t.height);}else t.textAutoResize='WIDTH_AND_HEIGHT';t.name=txt(d).slice(0,40);return t;}
function mkFrame(d,isComp){const f=isComp?figma.createComponent():figma.createFrame();f.name=isComp?d.cp:d.n;f.resize(Math.max(d.w,1),Math.max(d.h,1));
 f.fills=d.fill?[sp(d.fill)]:(d.img?imgPaints(d.img):[]);strokes(f,d.st);if(d.rad)f.cornerRadius=d.rad==999?Math.min(d.w,d.h)/2:d.rad;f.clipsContent=!!d.clip||!!(d.img&&d.img.rep);
 if(d.L){f.layoutMode=d.L=='V'?'VERTICAL':'HORIZONTAL';if(d.L=='W'){f.layoutWrap='WRAP';f.counterAxisSpacing=d.cg||0;}f.itemSpacing=d.g||0;const p=d.p||[0,0,0,0];f.paddingTop=Math.max(0,p[0]);f.paddingRight=Math.max(0,p[1]);f.paddingBottom=Math.max(0,p[2]);f.paddingLeft=Math.max(0,p[3]);f.primaryAxisAlignItems=d.pa=='S'?'SPACE_BETWEEN':d.pa=='C'?'CENTER':'MIN';f.counterAxisAlignItems=d.ca=='C'?'CENTER':d.ca=='M'?'MAX':'MIN';}
 if(d.img&&d.img.rep){const s=stripes(d.img.rep,d.w,d.h);f.appendChild(s);if(d.L)s.layoutPositioning='ABSOLUTE';s.x=0;s.y=0;}
 for(const c of d.c||[])mk(c,f,d.L||0);
 if(d.L){f.layoutSizingHorizontal=d.hw?'HUG':'FIXED';f.layoutSizingVertical=d.hf?'FIXED':'HUG';if(!d.hw&&Math.abs(f.width-d.w)>.5)f.resize(d.w,f.height);}
 return f;}
function vPad(f,d){const u=d.u[0];f.paddingLeft=Math.max(0,u[2]);f.paddingTop=Math.max(0,u[3]);f.paddingRight=Math.max(0,d.w-u[2]-u[4]);f.paddingBottom=Math.max(0,d.h-u[3]-u[5]);}
function mkV(d){const f=figma.createFrame();f.name='Gốm minh họa';f.resize(Math.max(d.w,1),Math.max(d.h,1));f.fills=[];f.clipsContent=false;
 if(d.u.length==1){f.layoutMode='HORIZONTAL';vPad(f,d);const i=pot(d.u[0][0],d.u[0][1]).createInstance();f.appendChild(i);i.resize(Math.max(d.u[0][4],1),Math.max(d.u[0][5],1));f.layoutSizingHorizontal='FIXED';f.layoutSizingVertical='FIXED';f.resize(Math.max(d.w,1),Math.max(d.h,1));return f;}
 for(const u of d.u){const i=pot(u[0],u[1]).createInstance();f.appendChild(i);i.resize(Math.max(u[4],1),Math.max(u[5],1));i.x=u[2];i.y=u[3];}return f;}
function mk(d,parent,pL){let n;N++;
 if(d.k=='f'){if(d.cp){let c=REG[d.cp];if(!c){c=mkFrame(d,true);CF.appendChild(c);REG[d.cp]=c;}n=c.createInstance();INST++;place(n,d,parent,pL);ov(n,d,true);return n;}n=mkFrame(d,false);}
 else if(d.k=='t')n=mkText(d);
 else if(d.k=='i'){if(d.rep){n=stripes(d.rep,d.w,d.h);}else{n=figma.createRectangle();n.resize(Math.max(d.w,1),Math.max(d.h,1));n.fills=imgPaints(d);n.name=d.src?'Ảnh · '+(d.src=='A'?'artisan.jpg':'pottery.jpg'):'Nền gradient';if(d.rad)n.cornerRadius=d.rad==999?Math.min(d.w,d.h)/2:d.rad;}}
 else if(d.k=='v')n=mkV(d);
 else if(d.k=='vs'){n=figma.createNodeFromSvg(d.s.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '));n.name='Bản đồ';n.fills=[];}
 else if(d.k=='r'){n=figma.createRectangle();n.resize(Math.max(d.w,.01),Math.max(d.h,.01));n.fills=d.fill?[sp(d.fill)]:[];strokes(n,d.st);if(d.rad)n.cornerRadius=d.rad==999?Math.min(d.w,d.h)/2:d.rad;n.name='Hình';}
 else if(d.k=='sp'){n=figma.createFrame();n.name='spacer';n.fills=[];n.resize(Math.max(d.w,.01),Math.max(d.h,.01));}
 place(n,d,parent,pL);return n;}
function ov(n,d,root){
 if(!n||!d)return;
 if(d.k=='t'&&n.type=='TEXT'){const s=txt(d);if(n.characters!==s){n.characters=s;styleText(n,d);}else if(d.sg.length>1)styleText(n,d);return;}
 if(d.k=='v'&&n.children){d.u.forEach((u,i)=>{const c=n.children[i];if(c&&c.type=='INSTANCE'){const m=pot(u[0],u[1]);if(c.mainComponent!==m)c.swapComponent(m);c.resize(Math.max(u[4],1),Math.max(u[5],1));if(d.u.length>1){try{c.x=u[2];c.y=u[3];}catch(e){}}}});if(d.u.length==1&&n.layoutMode&&n.layoutMode!='NONE')vPad(n,d);if(Math.abs(n.width-d.w)>.5||Math.abs(n.height-d.h)>.5)n.resize(d.w,d.h);return;}
 if('fills'in n&&d.k!='sp'){if(d.k=='f'&&!(d.img&&d.img.rep))n.fills=d.fill?[sp(d.fill)]:(d.img?imgPaints(d.img):[]);else if(d.k=='r')n.fills=d.fill?[sp(d.fill)]:[];else if(d.k=='i'&&!d.rep)n.fills=imgPaints(d);}
 const fixW=!('layoutSizingHorizontal'in n)||n.layoutSizingHorizontal=='FIXED',fixH=!('layoutSizingVertical'in n)||n.layoutSizingVertical=='FIXED';
 if(d.k!='t'&&((fixW&&Math.abs(n.width-d.w)>.5)||(fixH&&Math.abs(n.height-d.h)>.5))){try{n.resize(fixW?d.w:n.width,fixH?d.h:n.height);}catch(e){}}
 if(d.c&&n.children){const kids=n.children.filter(k=>k.name!='Họa tiết sọc');for(let i=0;i<d.c.length;i++)ov(kids[i],d.c[i],false);}
}
for(const old of sec.children.filter(c=>c.name==PG.n))old.remove();
const page=figma.createFrame();page.name=PG.n;sec.appendChild(page);page.x=IX*1300+100;page.y=100;page.resize(1100,PG.h);page.fills=[sp(PG.fill)];page.clipsContent=true;
page.layoutMode='VERTICAL';page.itemSpacing=PG.g||0;const pp=PG.p||[0,0,0,0];page.paddingTop=Math.max(0,pp[0]);page.paddingBottom=Math.max(0,pp[2]);page.counterAxisAlignItems='CENTER';
for(const c of PG.c)mk(c,page,'V');
page.layoutSizingHorizontal='FIXED';page.layoutSizingVertical='HUG';
let mx=0,my=0;for(const c of sec.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}sec.resizeWithoutConstraints(mx+100,my+100);
return {page:page.id,h:Math.round(page.height),nodes:N,instances:INST,comps:Object.keys(REG).length};

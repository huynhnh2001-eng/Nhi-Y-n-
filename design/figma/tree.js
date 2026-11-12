const { chromium } = require('playwright');
const fs=require('fs');
const [,, inFile, outFile] = process.argv;
(async()=>{
 const b=await chromium.launch({proxy:{server:process.env.HTTPS_PROXY},args:['--ignore-certificate-errors']});
 const p=await b.newPage({viewport:{width:1100,height:900}});
 await p.goto('file://'+inFile,{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
 const H=await p.evaluate(()=>document.documentElement.scrollHeight);
 await p.setViewportSize({width:1100,height:H}); await p.waitForTimeout(200);
 const data=await p.evaluate(()=>{
  const R=v=>Math.round(v*10)/10;
  const col=c=>{const m=c&&c.match(/rgba?\(([^)]+)\)/); if(!m) return null; const a=m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [a[0]/255,a[1]/255,a[2]/255,a.length>3?a[3]:1].map(x=>Math.round(x*1000)/1000)};
  const vis=c=>c&&c[3]>0.01;
  // shape bboxes
  const SB={}; const tmp=document.createElementNS('http://www.w3.org/2000/svg','svg'); document.body.appendChild(tmp);
  document.querySelectorAll('symbol').forEach(s=>{const pth=s.querySelector('path').cloneNode(); tmp.appendChild(pth); const bb=pth.getBBox(); SB[s.id]={d:pth.getAttribute('d'),bb:[bb.x,bb.y,bb.width,bb.height].map(R)};});
  tmp.remove();
  const ST=[]; const stIdx=(cs,op)=>{const k=JSON.stringify([cs.fontFamily.split(',')[0].replace(/["']/g,'').trim(),+cs.fontWeight,cs.fontStyle=='italic'?1:0,parseFloat(cs.fontSize),cs.lineHeight=='normal'?0:R(parseFloat(cs.lineHeight)),R(parseFloat(cs.letterSpacing)||0),col(cs.color).slice(0,3),R(col(cs.color)[3]*op)]); let i=ST.indexOf(k); if(i<0){ST.push(k);i=ST.length-1} return i;};
  const opac=el=>{let o=1;for(let e=el;e&&e.nodeType==1;e=e.parentElement)o*=parseFloat(getComputedStyle(e).opacity);return o};
  const isInline=e=>{const c=getComputedStyle(e);return c.display=='inline'&&!vis(col(c.backgroundColor))&&c.backgroundImage=='none'&&e.tagName!='svg'&&e.tagName!='BR'?true:e.tagName=='BR'};
  const segsOf=(el)=>{const out=[];const rec=(e)=>{const cs=getComputedStyle(e);const si=stIdx(cs,opac(e));for(const n of e.childNodes){if(n.nodeType==3){let t=n.textContent.replace(/\s+/g,' ');if(cs.textTransform=='uppercase')t=t.toUpperCase();if(t)out.push([t,si])}else if(n.nodeType==1){if(n.tagName=='BR')out.push(['\n',si]);else rec(n)}}
     const af=getComputedStyle(e,'::after').content; if(af&&af!='none'&&af!='normal'&&af.length>2)out.push([JSON.parse(af),si]);};rec(el);
    // trim
    if(out.length){out[0][0]=out[0][0].replace(/^ /,'');out[out.length-1][0]=out[out.length-1][0].replace(/ $/,'');}
    for(let i=0;i<out.length;i++){if(out[i][0]=='\n'){if(i>0)out[i-1][0]=out[i-1][0].replace(/ $/,'');if(i+1<out.length)out[i+1][0]=out[i+1][0].replace(/^ /,'')}}
    return out.filter(s=>s[0].length);};
  const textRect=(el)=>{const rg=document.createRange();rg.selectNodeContents(el);const rs=[...rg.getClientRects()].filter(q=>q.width>0);if(!rs.length)return null;const L=Math.min(...rs.map(q=>q.left)),T=Math.min(...rs.map(q=>q.top)),Rr=Math.max(...rs.map(q=>q.right)),B=Math.max(...rs.map(q=>q.bottom));return {x:L,y:T,w:Rr-L,h:B-T,lines:new Set(rs.map(q=>Math.round(q.bottom))).size}};
  const boxStyle=(cs,el)=>{const o={};const bg=col(cs.backgroundColor);if(vis(bg))o.fill=bg;
    const sd=['Top','Right','Bottom','Left'].map(s=>({w:parseFloat(cs['border'+s+'Width']),c:col(cs['border'+s+'Color']),st:cs['border'+s+'Style']}));
    const ok=sd.map(s=>s.w>0&&s.st!='none'&&vis(s.c)); if(ok.some(Boolean)){const s=sd[ok.indexOf(true)]; o.st=[s.c,ok.map((v,i)=>v?sd[i].w:0),s.st=='dashed'?1:0];}
    const rad=parseFloat(cs.borderTopLeftRadius); if(rad) o.rad=cs.borderTopLeftRadius.includes('%')?999:rad;
    if(cs.overflow=='hidden') o.clip=1; return o;};
  const nameOf=(el)=>{if(el.tagName=='SECTION'||el.tagName=='HEADER'){const h=el.querySelector('h1,h2');if(h)return (el.tagName=='HEADER'?'Header — ':'Section — ')+h.innerText.replace(/\s+/g,' ').trim();}
    return el.className&&typeof el.className=='string'?el.className.trim():el.tagName.toLowerCase();};
  const svgNode=(el,r)=>{const uses=[...el.querySelectorAll('use')]; if(uses.length){return {k:'v',w:R(r.width),h:R(r.height),u:uses.map(u=>{const ur=u.getBoundingClientRect();const id=u.getAttribute('href').slice(1);return {s:id,p:u.getAttribute('fill').includes('clay2')?'B':'A',x:R(ur.x-r.x),y:R(ur.y-r.y),w:R(ur.width),h:R(ur.height)}})}}
     const c=el.cloneNode(true);c.setAttribute('width',R(r.width));c.setAttribute('height',R(r.height));c.removeAttribute('style');return {k:'vs',w:R(r.width),h:R(r.height),s:c.outerHTML.replace(/\s+/g,' ')};};
  const build=(el)=>{
   const cs=getComputedStyle(el); if(cs.display=='none'||cs.visibility=='hidden'||parseFloat(cs.opacity)==0) return null;
   const r=el.getBoundingClientRect(); if(r.width<0.5&&r.height<0.5&&el.tagName!='BR') return null;
   let n;
   if(el.tagName.toLowerCase()=='svg'){ if(r.width<2) return null; n=svgNode(el,r); n.r=r; if(cs.position=='absolute')n.ab=1; return n;}
   const bs=boxStyle(cs,el); const bgi=cs.backgroundImage!='none';
   const kidsEl=[...el.childNodes].filter(c=>(c.nodeType==3&&c.textContent.trim())||(c.nodeType==1&&getComputedStyle(c).display!='none'));
   const hasText=kidsEl.some(c=>c.nodeType==3);
   const allInline=kidsEl.every(c=>c.nodeType==3||isInline(c));
   const pad=['Top','Right','Bottom','Left'].map(s=>R(parseFloat(cs['padding'+s])));
   const nm=nameOf(el);
   // image leaf
   if(bgi){ let img;
     if(cs.backgroundImage.startsWith('url(')){img={src:cs.backgroundImage.includes('artisan')?'A':'P',fl:cs.filter=='none'?'':cs.filter,ov:el.matches('.dig .bg')?1:0}}
     else if(cs.backgroundImage.startsWith('radial'))img={rg:[...cs.backgroundImage.matchAll(/rgb\((\d+), (\d+), (\d+)\)/g)].map(m=>[m[1]/255,m[2]/255,m[3]/255].map(v=>Math.round(v*1000)/1000))};
     else img={rep:cs.backgroundImage};
     if(!kidsEl.length){n={k:'i',n:nm,w:R(r.width),h:R(r.height),...img,...bs}; n.r=r; if(cs.position=='absolute')n.ab=1; return n;}
     Object.assign(bs,{img});
   }
   if(kidsEl.length&&hasText&&allInline){ // text
     const segs=segsOf(el); if(!segs.length) return null;
     const tr=textRect(el);
     const t={k:'t',sg:segs,al:cs.textAlign[0],ml:tr&&tr.lines>1?1:0};
     const boxed=bs.fill||bs.st||pad.some(v=>v>0)||bs.img;
     if(!boxed){ t.w=R(tr.w);t.h=R(tr.h); t.r={x:tr.x,y:tr.y,width:tr.w,height:tr.h,right:tr.x+tr.w,bottom:tr.y+tr.h}; if(t.ml){t.w=R(r.width-pad[1]-pad[3]); t.r={x:r.x+pad[3],y:tr.y,width:t.w,height:tr.h,right:r.x+pad[3]+t.w,bottom:tr.y+tr.h}} if(cs.position=='absolute')t.ab=1; return t;}
     t.w=R(tr.w);t.h=R(tr.h);t.r={x:tr.x,y:tr.y,width:tr.w,height:tr.h,right:tr.x+tr.w,bottom:tr.y+tr.h}; if(t.ml){t.w=R(r.width-pad[1]-pad[3]);}
     n={k:'f',n:nm,w:R(r.width),h:R(r.height),...bs,c:[t]};
   } else {
     const kids=[];
     // pseudo before (abs or filter checkbox)
     for(const ps of ['::before']){const pc=getComputedStyle(el,ps); if(pc.content=='none'||pc.content=='normal')continue; const bg=col(pc.backgroundColor);
       if(pc.position=='absolute'&&vis(bg)) kids.push({k:'r',n:'dot',w:parseFloat(pc.width),h:parseFloat(pc.height),fill:bg,rad:parseFloat(pc.borderTopLeftRadius)?999:0,ab:1,r:{x:r.x+parseFloat(pc.left),y:r.y+parseFloat(pc.top),width:parseFloat(pc.width),height:parseFloat(pc.height)}});
       else if(el.matches('.filter label')){const on=el.classList.contains('on');kids.push({k:'r',n:'checkbox',w:11,h:11,fill:on?col(pc.backgroundColor):null,st:on?null:[col(pc.borderTopColor),[1,1,1,1],0],r:{x:r.x,y:r.y+(r.height-11)/2,width:11,height:11,right:r.x+11,bottom:r.y+(r.height+11)/2}});}
     }
     for(const c of kidsEl){
       if(c.nodeType==3){const rg=document.createRange();rg.selectNodeContents(c);const rs=[...rg.getClientRects()].filter(q=>q.width>0);if(!rs.length)continue;const L=Math.min(...rs.map(q=>q.left)),T=Math.min(...rs.map(q=>q.top)),Rr=Math.max(...rs.map(q=>q.right)),B=Math.max(...rs.map(q=>q.bottom));
         let t=c.textContent.replace(/\s+/g,' ').trim(); if(cs.textTransform=='uppercase')t=t.toUpperCase(); const lines=new Set(rs.map(q=>Math.round(q.bottom))).size;
         kids.push({k:'t',sg:[[t,stIdx(cs,opac(el))]],al:cs.textAlign[0],ml:lines>1?1:0,w:R(Rr-L),h:R(B-T),r:{x:L,y:T,width:Rr-L,height:B-T,right:Rr,bottom:B}}); }
       else {const k=build(c); if(k) kids.push(k);}
     }
     n={k:'f',n:nm,w:R(r.width),h:R(r.height),...bs,c:kids};
     n.disp=cs.display; n.fd=cs.flexDirection; n.fw=cs.flexWrap; n.jc=cs.justifyContent; n.ai=cs.alignItems; n.pi=cs.placeItems; n.ta=cs.textAlign;
     n.cg=parseFloat(cs.columnGap)||0; n.rgp=parseFloat(cs.rowGap)||0;
   }
   n.r=r; n.pad=pad; if(cs.position=='absolute')n.ab=1;
   return n;
  };
  window.__PFX=(()=>{const e=document.querySelector('.img.a');return e?getComputedStyle(e).backgroundImage.slice(5000,5100):'@@'})();
  const roots=[...document.querySelectorAll('body > header, main > section, body > footer')].map(build).filter(Boolean);
  // serialize rects
  const fix=(n,pr)=>{ if(!n) return; const r=n.r; n.x=R(r.x-(pr?pr.x:0)); n.y=R(r.y-(pr?pr.y:0)); n.rw=R(r.width); n.rh=R(r.height); delete n.r; (n.c||[]).forEach(c=>fix(c,r)); };
  roots.forEach(n=>fix(n,{x:0,y:0}));
  return {t:document.title,H:document.documentElement.scrollHeight,bg:col(getComputedStyle(document.body).backgroundColor),ST:ST.map(s=>JSON.parse(s)),SB,roots};
 });
 fs.writeFileSync(outFile,JSON.stringify(data));
 await b.close();
})();

import json,collections,hashlib,sys
S='/tmp/claude-0/-home-user-Nhi-Y-n-/3fc42395-1980-59d7-81b3-60f9c8ce1169/scratchpad/'
TITLES=['00 Trang chủ','01 Bộ sưu tập số','02 Tin tức','03 Sự kiện','04 Hiện vật','05 Trải nghiệm tham quan','06 Chi tiết tour','07 Câu chuyện nghệ nhân']
pages=[json.load(open(S+f'tr/p{i}.json')) for i in range(8)]
# global style table
GST=[];
def gsi(st):
    k=json.dumps(st)
    if k not in GST: GST.append(k)
    return GST.index(k)
def r1(v): return round(v,1)
def remap(n,ST):
    if n['k']=='t': n['sg']=[[t,gsi(ST[s])] for t,s in n['sg']]
    for c in n.get('c',[]): remap(c,ST)
for p in pages:
    for r in p['roots']: remap(r,p['ST'])
STY=[json.loads(k) for k in GST]
def textbox(n):
    # expand range rect to line boxes
    st=STY[n['sg'][0][1]]; fs=st[3]; lh=st[4] or fs*1.3
    ch=fs*1.26; lines=max(1,round((n['rh']-ch)/lh)+1) if n.get('ml') else 1
    H=lines*lh; n['y']=r1(n['y']-(H-n['rh'])/2); n['rh']=r1(H); n['h']=r1(H)
def ext(c): return c['x'],c['y'],c['x']+c['rw'],c['y']+c['rh']
def layout(n,par=None):
    for c in n.get('c',[]):
        if c['k']=='t' and 'rw' in c: textbox(c)
    for c in n.get('c',[]): 
        if c['k']=='f': layout(c,n)
    if n['k']!='f': return
    W,H=n['rw'],n['rh']; kids=[c for c in n['c'] if not c.get('ab')]
    pad=n.get('pad',[0,0,0,0])
    n['L']=0
    if not kids: return
    d=None; disp=n.get('disp','block')
    rows=[]
    for c in sorted(kids,key=lambda c:c['y']):
        if rows and c['y']<rows[-1][1]-1: rows[-1][0].append(c); rows[-1][1]=max(rows[-1][1],c['y']+c['rh'])
        else: rows.append([[c],c['y']+c['rh']])
    oneRow=len(rows)==1 and len(kids)>1
    if disp=='flex': d='H' if n.get('fd','row').startswith('row') else 'V'
    if disp=='grid' or (disp=='flex' and d=='H' and len(rows)>1): d='H' if len(rows)==1 else ('V' if all(len(r[0])==1 for r in rows) else 'W')
    if d is None: d='H' if oneRow else 'V'
    if len(kids)==1 and d=='W': d='V'
    # check overlap validity
    if d=='V':
        s=sorted(kids,key=lambda c:c['y'])
        if any(s[i+1]['y']<s[i]['y']+s[i]['rh']-1.5 for i in range(len(s)-1)): d=0
    if d=='H':
        s=sorted(kids,key=lambda c:c['x'])
        if any(s[i+1]['x']<s[i]['x']+s[i]['rw']-1.5 for i in range(len(s)-1)): d=0
    if not d: return
    n['L']=d
    xs=[ext(c) for c in kids]; minx=min(e[0] for e in xs); miny=min(e[1] for e in xs); maxx=max(e[2] for e in xs); maxy=max(e[3] for e in xs)
    if d=='W':
        order=[c for r in rows for c in sorted(r[0],key=lambda c:c['x'])]
        r0=sorted(rows[0][0],key=lambda c:c['x']); cg=min([r0[i+1]['x']-r0[i]['x']-r0[i]['rw'] for i in range(len(r0)-1)] or [0])
        rg=min([min(c['y'] for c in rows[i+1][0])-max(c['y']+c['rh'] for c in rows[i][0]) for i in range(len(rows)-1)] or [0])
        n['c']=order+[c for c in n['c'] if c.get('ab')]; n['g']=r1(cg-0.6); n['cg']=r1(rg)
        n['p']=[r1(miny),r1(max(0,W-maxx)),r1(max(0,H-maxy)),r1(minx)]; n['ca']='N'; n['hw']=0; n['hh']=1 if H-maxy>=-1 else 0
        # wrap requires content width fits: set right pad so rows wrap identically
        return
    ax=0 if d=='H' else 1
    s=sorted(kids,key=lambda c:(c['x'] if d=='H' else c['y']))
    gaps=[(s[i+1]['x']-s[i]['x']-s[i]['rw']) if d=='H' else (s[i+1]['y']-s[i]['y']-s[i]['rh']) for i in range(len(s)-1)]
    new=[]; g=0; pa='N'
    if d=='H' and n.get('jc')=='space-between' and len(s)>=2: pa='S'; new=s
    elif gaps and max(gaps)-min(gaps)<=1.2: g=r1(sum(gaps)/len(gaps)); new=s
    else:
        for i,c in enumerate(s):
            new.append(c)
            if i<len(gaps) and abs(gaps[i])>0.6:
                new.append({'k':'sp','w':r1(gaps[i]) if d=='H' else 1,'h':r1(gaps[i]) if d=='V' else 1,'rw':0,'rh':0,'x':0,'y':0})
    n['c']=new+[c for c in n['c'] if c.get('ab')]; n['g']=g
    pl,pt,pr,pb=minx,miny,W-maxx,H-maxy
    # counter alignment
    if d=='V':
        offs=[c['x']-pl for c in kids]; rights=[W-pr-(c['x']+c['rw']) for c in kids]; cent=[(c['x']+c['rw']/2)-(pl+(W-pl-pr)/2) for c in kids]
    else:
        offs=[c['y']-pt for c in kids]; rights=[H-pb-(c['y']+c['rh']) for c in kids]; cent=[(c['y']+c['rh']/2)-(pt+(H-pt-pb)/2) for c in kids]
    ca='N'
    if all(abs(o)<1.2 for o in offs): ca='N'
    elif all(abs(o)<1.2 for o in cent): ca='C'
    elif all(abs(o)<1.2 for o in rights): ca='M'
    if d=='V' and ca!='N' and all(abs(o)<1.2 for o in offs): ca='N'
    # prefer css padding on counter axis when centered
    if ca=='C':
        if d=='V': pl=pr=min(pl,pr) if abs(pl-pr)<1.5 else pl; 
        else: pt=pt
    if d=='V' and ca=='C': pl,pr=pad[3],pad[1]
    if d=='H' and ca=='C': pt,pb=pad[0],pad[2]
    if pa=='N' and d=='H' and n.get('jc')=='center': pa='C'
    if pa=='N' and d=='V' and n.get('jc')=='center': pa='C'
    if pa=='C': 
        if d=='H': pl,pr=pad[3],pad[1]
        else: pt,pb=pad[0],pad[2]
    n['p']=[r1(max(pt,-999)),r1(max(pr,0)),r1(pb),r1(max(pl,0))]; n['ca']=ca; n['pa']=pa
    n['hw']=1 if (d=='H' and pa=='N' and abs(pr-pad[1])<1.5 and abs(pl-pad[3])<1.5 and n.get('disp') not in ('block','grid','flex') ) else 0
    n['hh']=1 if pb>=-0.5 else 0
    # mark fill-width kids in V
    if d=='V':
        for c in kids:
            if abs(c['x']-pl)<1.2 and abs(c['rw']-(W-pl-pr))<1.5 and (c['k']=='f' or (c['k']=='t' and c.get('ml'))): c['sz']='L'
for p in pages:
    page={'k':'f','n':'page','rw':1100,'rh':p['H'],'x':0,'y':0,'c':p['roots'],'disp':'block','pad':[0,0,0,0]}
    layout(page); p['page']=page
# signatures & components
def sig(n):
    if n['k']=='f': return 'f:'+n['n']+':'+str(n.get('L'))+'['+','.join(sig(c) for c in n['c'])+']'
    if n['k']=='t': return 't'
    if n['k']=='v': return 'v'
    return n['k']
def size(n): return 1+sum(size(c) for c in n.get('c',[]))
cnt=collections.Counter()
def walk(n,f):
    f(n)
    for c in n.get('c',[]): walk(c,f)
GENERIC={'div','span','p','li','ul','a','page','dl','b','i','dt','dd','small','label','ol','h4','h5','h3','article'}
WL={'nav':'Header/Nav','logo':'Brand/Logo','head':'Section/Heading','tabs':'Filter/Tabs','btnl':'Button/Outline','mini':'Button/Dark','btn':'Button/Light','badge':'Badge','badge dk':'Badge/Accent','card':'Card','tour':'Card/Tour','row':'List/Row','row on':'List/Row · nổi bật','fg':'Footer/Columns','fb':'Footer/Bottom','footer':'Footer','pager':'Pagination','spec':'Spec table','award':'Award row','stat':'Stats','search':'Input/Search','price':'Price','ic':'Info item','qa':'FAQ','meta':'Card/Meta','ctrl':'Viewer/Controls','facts4':'Facts','thumbs':'Thumbnails','visit':'Visit info','strip':'Header/Strip','tl':'Timeline','ex':'Grid/Staggered'}
def cand(n,par=None):
    if n['k']!='f' or size(n)<2: return False
    if n['n'] in WL: return True
    if par and par['n']=='tabs': return True
    return False
def walkp(n,f,par=None):
    f(n,par)
    for c in n.get('c',[]): walkp(c,f,n)
for p in pages: walkp(p['page'],lambda n,par: cnt.update([sig(n)]) if cand(n,par) else None)
NAMES={}
def compname(n,par):
    if par and par['n']=='tabs': return 'Filter/Tab · đang chọn' if n['n']=='on' else 'Filter/Tab'
    base=WL[n['n']]
    if base=='Card':
        kinds=[c['k'] for c in n['c']]
        first=n['c'][0] if n['c'] else {}
        if first.get('k')=='i' or (first.get('k')=='f' and any(c['k']=='i' for c in first.get('c',[]))): base='Card/Ảnh'
        elif first.get('k')=='f': base='Card/Minh họa'
        else: base='Card/Văn bản'
    return base
compkeys={}
for p in pages:
    def mark(n,par):
        if cand(n,par) and cnt[sig(n)]>=2:
            sg=sig(n)
            if sg not in compkeys:
                base=compname(n,par); k=base; j=2
                while k in compkeys.values(): k=f'{base} · {j}'; j+=1
                compkeys[sg]=k
            n['cp']=compkeys[sg]
    walkp(p['page'],mark)
print('components',len(compkeys)); print(sorted(compkeys.values()))
# compact output
def cmp(n,parentL):
    o={'k':n['k']}
    for k in ('w','h'): 
        if k in n: o[k]=n[k]
    if 'rw' in n and n['k']!='sp': o['w']=n['rw']; o['h']=n['rh']
    if n.get('ab') or parentL==0: o['xy']=[n['x'],n['y']]
    if n.get('ab'): o['ab']=1
    if n.get('sz'): o['sz']=n['sz']
    if n['k']=='f':
        o['n']=n['n']
        for k in ('fill','st','rad','clip','L','p','g','cg','ca','pa','hw','hh','cp'):
            if n.get(k) not in (None,0,'N',[0,0,0,0]) : o[k]=n[k]
        if n.get('img'): o['img']=n['img']
        o['c']=[cmp(c,n.get('L',0)) for c in n['c']]
    elif n['k']=='t': o.update(sg=n['sg'],al=n['al'],ml=n.get('ml',0))
    elif n['k']=='i':
        for k in ('src','ov','rg','rep','rad','fill','fl'):
            if n.get(k): o[k]=n[k]
    elif n['k']=='v': o['u']=[[u['s'],u['p'],u['x'],u['y'],u['w'],u['h']] for u in n['u']]
    elif n['k']=='vs': o['s']=n['s']
    elif n['k']=='r':
        for k in ('fill','st','rad'): 
            if n.get(k): o[k]=n[k]
    return o
out={'ST':STY,'SB':pages[0]['SB'],'pages':[]}
for i,p in enumerate(pages):
    pg=cmp(p['page'],None); pg['n']=TITLES[i]; pg['fill']=p['bg']
    out['pages'].append(pg)
js=json.dumps(out,ensure_ascii=False,separators=(',',':'))
open(S+'tr/all.json','w').write(js)
print(len(js),[len(json.dumps(pg,ensure_ascii=False,separators=(',',':'))) for pg in out['pages']])

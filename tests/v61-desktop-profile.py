from pathlib import Path
import re
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'public/index.html').read_text().replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1760,1440,1160):
  page=b.new_page(viewport={'width':width,'height':900},service_workers='block')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='commit',timeout=18000)
  page.wait_for_function('typeof render === "function" && typeof mtFitCurrentPreview === "function"')
  page.evaluate('''() => {
   api=async()=>({ok:true,results:[]});
   const logs=Array.from({length:13},(_,i)=>({id:i+1,mediaKey:'anime:'+i,mediaType:'anime',title:'Watching number '+i,cover:'',year:'2025',status:'In progress',progress:i,rating:8,updatedAt:Date.now()-i*1000}));
   state.me={id:23,name:'alice',globalName:'Alice',stats:{total:13},role:'member',socials:{}};
   state.profile={...state.me,followers:5,joined:Date.now()};state.profileLogs=logs;
   state.feed=[];state.view='profile';state.profileTab='overview';render();
  }''')
  page.wait_for_timeout(350)
  dims=page.evaluate('''() => {
   const get=(s)=>document.querySelector(s).getBoundingClientRect(),cur=get('.pf-current-panel'),global=get('.pf-global-activity'),head=get('.pf-hero'),side=get('.layout.pf-page>.side');
   const a=[...document.querySelectorAll('.pf-current-panel .mt-current-item')];return {
    x:[get('.pf-center-column').x,get('.pf-current-rail').x,get('.pf-global-rail').x],
    height:[cur.height,global.height],top:[head.top,cur.top,global.top,side.top],
    visible:a.filter(e=>getComputedStyle(e).display!=='none').length,total:a.length,
    last:a.filter(e=>getComputedStyle(e).display!=='none').at(-1)?.getBoundingClientRect().bottom,
    footer:get('.pf-current-panel footer').top,
    tabs:getComputedStyle(document.querySelector('.pf-tabs')).backgroundColor,
    hero:head.height,hasSide:side.width,bodyWidth:document.documentElement.scrollWidth,
   }
  }''')
  print('desktop',width,dims)
  assert dims['x'][0]<dims['x'][1]<dims['x'][2],dims
  assert abs(dims['height'][0]-dims['height'][1])<=2,dims
  assert dims['visible']>4 and dims['visible']<13,dims
  assert dims['last']<=dims['footer']+1,dims
  assert dims['hero']>=170,dims
  assert dims['bodyWidth']<=width+2,dims
  assert len(errors)==0,errors
  if width==1760:
   page.screenshot(path='/mnt/data/mediatok-v61-profile-desktop-preview.png')
   poster=page.locator('.pf-poster').first
   def before():return poster.evaluate('e=>({title:getComputedStyle(e.querySelector(".pf-title")).transform,sub:getComputedStyle(e.querySelector(".pf-sub")).transform,card:getComputedStyle(e).transform,icon:getComputedStyle(e.querySelector(".pf-type")).opacity})')
   print('before hover',before())
   poster.hover();page.wait_for_timeout(450);print('after hover',before())
   assert before()['card']=='none'
  page.close()
 # image upscaling/compression test on a 2400x1600 noise image >400KB
 page=b.new_page(viewport={'width':1100,'height':800},service_workers='block');page.set_content(html,wait_until='commit',timeout=18000)
 page.wait_for_function('typeof mtProfileImageData === "function"')
 res=page.evaluate('''async () => {
    const c=document.createElement('canvas');c.width=2400;c.height=1600;const ctx=c.getContext('2d');
    // Image is large and busy to ensure the upload exceeds the old 400 KB cap.
    const id=ctx.createImageData(c.width,c.height);for(let i=0;i<id.data.length;i+=4){let v=Math.floor(Math.random()*256);id.data[i]=v;id.data[i+1]=(v+79)%256;id.data[i+2]=(v+153)%256;id.data[i+3]=255}ctx.putImageData(id,0,0);
    const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));
    const file=new File([blob],'large-avatar.png',{type:'image/png'});
    const value=await mtProfileImageData(file);
    return {original:file.size,encoded:value.length,prefix:value.slice(0,23)};
 }''')
 print('image compression',res)
 assert res['original']>400*1024 and res['encoded']<600000 and res['prefix'].startswith('data:image/webp;base64')
 page.close();b.close()
 print('PASS v61 desktop alignment, adaptive current list, hover isolation, image uploads')

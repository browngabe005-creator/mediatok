from pathlib import Path
from playwright.sync_api import sync_playwright
import re
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'public/index.html').read_text().replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (1180,1440,1760,390):
  page=b.new_page(viewport={'width':w,'height':900},service_workers='block',reduced_motion='no-preference')
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(html,wait_until='commit',timeout=25000)
  page.wait_for_function('typeof profilePage === "function"')
  page.evaluate('''() => {const u={id:23,name:'alice',globalName:'Alice',avatarUrl:'',bio:'',accent:'#9073c0',banner:'Mono',bannerUrl:'',status:'',stats:{total:130},followers:12,socials:{profileFxEnabled:true,profileFxColor:'#ff00ff',musicEnabled:false}};
   state.me=u;state.profile=u;state.profileLogs=Array.from({length:12},(_,i)=>({mediaKey:'anime:'+i,mediaType:'anime',title:'Title '+i,status:'In progress',progress:i,updatedAt:Date.now()-i*1200}));state.feed=[];state.view='profile';state.profileTab='overview';render();}''')
  page.wait_for_timeout(120)
  data=page.evaluate('''() => {const rect=q=>{const r=document.querySelector(q)?.getBoundingClientRect();return r?{left:r.left,top:r.top,right:r.right,bottom:r.bottom,h:r.height}:null};return {hero:rect('.pf-hero'),name:rect('.pf-hero-name'),roles:rect('.pf-status-role-row'),actions:rect('.pf-hero-actions'),edit:rect('.pf-hero-actions .btn'),avatar:rect('.pf-hero-avatar')};}''')
  print('WIDTH',w,'roles',data['roles'],'actions',data['actions'],'name',data['name'])
  if w>=1021:
   role=data['roles'];actions=data['actions'];hero=data['hero'];avatar=data['avatar']
   assert role and actions and hero and avatar
   # rank badges and the action buttons must visually share the same horizontal line
   assert abs((role['top']+role['bottom'])/2 - (actions['top']+actions['bottom'])/2)<7,(w,data)
   assert actions['left']>data['name']['right'] and actions['right']<=hero['right']+1,(w,data)
  assert not errs,(w,errs)
  page.close()
 b.close()

from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops, ImageStat
import re
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'public/index.html').read_text().replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in (1180,1440,1760,390):
  page=browser.new_page(viewport={'width':w,'height':900},reduced_motion='no-preference',service_workers='block',device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='commit',timeout=25000)
  page.wait_for_function('typeof profilePage === "function" && typeof mtSyncProfileAtmosphere === "function"')
  page.evaluate('''() => {const u={id:23,name:'alice',globalName:'Alice',avatarUrl:'',bio:'',accent:'#9073c0',banner:'Mono',bannerUrl:'',status:'',stats:{total:130},followers:12,socials:{profileFxEnabled:true,profileFxColor:'#ff00ff',musicEnabled:false}};
   state.me=u;state.profile=u;state.profileLogs=Array.from({length:12},(_,i)=>({mediaKey:'anime:'+i,mediaType:'anime',title:'Title '+i,status:'In progress',progress:i,updatedAt:Date.now()-i*1200}));state.feed=[];state.view='profile';state.profileTab='overview';render();}''')
  page.wait_for_timeout(250)
  dims=page.evaluate('''() => {const rect=q=>{const r=document.querySelector(q)?.getBoundingClientRect();return r?{left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width}:null};const l=document.querySelector('.layout.pf-page'),hero=document.querySelector('.pf-hero');return {hero:rect('.pf-hero'),avatar:rect('.pf-hero-avatar'),name:rect('.pf-hero-name'),actions:rect('.pf-hero-actions'),side:rect('.layout.pf-page>.side'),center:rect('.pf-center-column'),right:rect('.pf-right-zone'),fx:l?.classList.contains('mt-profile-fx-on'), glow:getComputedStyle(hero,'::before').backgroundImage,pointerGlow:getComputedStyle(document.querySelector('.mt-profile-pointer-glow')).opacity};}''')
  assert dims['fx'] and dims['pointerGlow']!='0' and 'radial-gradient' in dims['glow'],(w,dims)
  if w>=1021:
   h=dims['hero'];a=dims['avatar'];n=dims['name'];ac=dims['actions'];
   assert a['left']<h['left']+h['width']*.16,(w,dims)
   assert n['left']>a['right'] and n['left']<ac['left'],(w,dims)
   assert h['top']>=dims['side']['top']-4 and abs(h['top']-dims['right']['top'])<4,(w,dims)
   assert abs(n['top']+n['bottom']-2*(a['top']+a['bottom'])/2)<125,(w,dims)
  if w==1440:
   x=dims['hero']['left']+dims['hero']['width']*.5;y=dims['hero']['top']+dims['hero']['width']*.095
   page.mouse.move(x,y)
   page.wait_for_timeout(150)
   hero=page.locator('.pf-hero')
   hero.screenshot(path='/mnt/data/mediatok-v66-hero-with-glow.png')
   before=page.evaluate('getComputedStyle(document.querySelector(".pf-hero"),"::before").opacity')
   assert float(before)>0.7
   assert page.locator('.mt-profile-pointer-glow').evaluate("el=>getComputedStyle(el).opacity")!='0'
   assert page.evaluate("document.querySelector('.pf-hero').style.getPropertyValue('--mt-hero-mx')")!=''
   page.evaluate("document.querySelector('.layout.pf-page').classList.remove('mt-profile-fx-on')")
   page.wait_for_timeout(10)
   hero.screenshot(path='/mnt/data/mediatok-v66-hero-without-glow.png')
   a=Image.open('/mnt/data/mediatok-v66-hero-with-glow.png').convert('RGB');b=Image.open('/mnt/data/mediatok-v66-hero-without-glow.png').convert('RGB')
   diff=ImageChops.difference(a,b)
   brightness=sum(ImageStat.Stat(diff).mean)/3
   print('glow screenshot mean difference',brightness)
   assert brightness>1.2,brightness
  print('PASS',w, 'header',dims['hero'], 'glow',dims['glow'][:68], 'errors',errors[:2]);assert not errors,errors
  page.close()
 browser.close()

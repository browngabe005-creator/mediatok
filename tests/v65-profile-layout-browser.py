from pathlib import Path
from playwright.sync_api import sync_playwright
import re
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'public/index.html').read_text().replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1760,1440,1180,390):
  page=b.new_page(viewport={'width':width,'height':900},service_workers='block',reduced_motion='no-preference')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='commit',timeout=20000)
  page.wait_for_function('typeof profilePage === "function" && typeof mtSyncProfileAtmosphere === "function"',timeout=10000)
  page.evaluate('''() => {
    const user={id:23,name:'alice',globalName:'Alice',role:'member',stats:{total:300},
      socials:{lastfm:'alice-fm',musicMode:'favorites',musicEnabled:true,musicFavorites:[{name:'Sade',type:'artist'}],profileFxEnabled:true,profileFxColor:'#ef76be'},followers:6,joined:Date.now()};
    state.me={...user};state.profile={...user};state.feed=[];
    state.profileLogs=Array.from({length:12},(_,i)=>({id:i+1,mediaKey:'anime:'+i,mediaType:'anime',title:'Currently watching '+i,cover:'',status:'In progress',progress:i,updatedAt:Date.now()-i*1000}));
    state.view='profile';state.profileTab='overview';
    api=async(path,options)=>{if(path==='/api/profile'&&options?.method==='POST'){
        const b=JSON.parse(options.body);state.me={...state.me,...b,socials:{...state.me.socials,...b.socials},avatarUrl:state.me.avatarUrl||''};return {user:state.me};
      } if(path==='/api/me')return {user:state.me};if(path.startsWith('/api/profile/'))return {user:state.me,logs:state.profileLogs};return {ok:true,items:[]};};
    loadProfile=async()=>{state.profile={...state.me};return true};history.pushState=()=>{};
    render();
  }''')
  page.wait_for_timeout(300)
  val=page.evaluate('''() => {const r=s=>document.querySelector(s)?.getBoundingClientRect(),center=x=>(x?.left+x?.right)/2;
    const hero=r('.pf-hero'),avatar=r('.pf-hero-id>.pf-hero-avatar'),name=r('.pf-hero-name'),side=r('.layout.pf-page>.side'),middle=r('.pf-center-column'),right=r('.pf-right-zone'),now=r('.pf-current-panel'),feed=r('.pf-global-activity'),music=r('.pf-music-rail');
    return {hero:{left:hero?.left,top:hero?.top,width:hero?.width},avatarX:center(avatar),nameX:center(name),
      side:{left:side?.left,top:side?.top,right:side?.right},middle:{left:middle?.left,top:middle?.top,right:middle?.right},
      right:{left:right?.left,top:right?.top,right:right?.right},nowTop:now?.top,feedTop:feed?.top,musicTop:music?.top,
      particles:document.querySelectorAll('.mt-profile-atmosphere.has-particles canvas').length,
      particleCanvasDisplay:getComputedStyle(document.querySelector('.mt-profile-atmosphere canvas')).display,
      count:document.querySelectorAll('.mt-current-item').length,
      scrollWidth:document.documentElement.scrollWidth}}''')
  print('WIDTH',width,val)
  if width>=1021:
   assert abs(val['side']['top']-val['middle']['top'])<3,(width,val)
   assert abs(val['middle']['top']-val['right']['top'])<3,(width,val)
   assert abs(val['nowTop']-val['feedTop'])<3,(width,val)
   assert val['side']['right']<val['middle']['left']<val['middle']['right']<val['right']['left'],(width,val)
   assert val['avatarX']<val['hero']['left']+val['hero']['width']*.35,(width,val)
   assert val['nameX']<val['hero']['left']+val['hero']['width']*.65,(width,val)
   if val['musicTop']:assert val['musicTop']>val['nowTop']
  assert val['scrollWidth']<width+5,(width,val)
  assert val['particles']==1 and val['particleCanvasDisplay']=='block',(width,val)
  if width==1440:
   page.screenshot(path='/mnt/data/mediatok-v65-profile-preview.png',full_page=False)
   # Actual Alice physics: a particle gains horizontal velocity when cursor near it; click generates ripples and sparks.
   result=page.evaluate('''() => {window.dispatchEvent(new PointerEvent('pointermove',{clientX:500,clientY:320}));
    document.querySelector('.pf-hero').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:500,clientY:320}));return !!document.querySelector('#mtProfileAtmosphere.has-particles') }''')
   assert result
   page.evaluate('openProfileEditor()');page.locator('button.pe-tab[data-t="look"]').click();
   assert page.locator('#editFxEnabled').is_checked()
   assert page.locator('#editFxColor').input_value()=='#ef76be'
  assert not errors,(width,errors)
  page.close()
 b.close()
print('PASS v65 profile left avatar, centered content, right rails, original-source particles, editor options')

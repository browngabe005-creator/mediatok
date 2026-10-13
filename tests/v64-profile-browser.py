from pathlib import Path
from playwright.sync_api import sync_playwright
import re
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'public/index.html').read_text().replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1760,1440,1160,390):
  page=b.new_page(viewport={'width':width,'height':900},service_workers='block', reduced_motion='no-preference')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='commit',timeout=20000)
  page.wait_for_function('typeof profilePage === "function" && typeof mtSyncProfileAtmosphere === "function"')
  page.evaluate('''() => {
    const user={id:23,name:'alice',globalName:'Alice',role:'member',stats:{total:12},socials:{lastfm:'alice-fm',musicMode:'favorites',musicFavorites:[{name:'Sade',type:'artist'}]},followers:6,joined:Date.now()};
    state.me={...user};state.profile={...user};state.feed=[];state.profileLogs=Array.from({length:10},(_,i)=>({id:i+1,mediaKey:'anime:'+i,mediaType:'anime',title:'Currently watching '+i,cover:'',status:'In progress',progress:i,updatedAt:Date.now()-i*1000}));state.view='profile';state.profileTab='overview';
    api=async(path,options)=>{if(path==='/api/profile'&&options?.method==='POST'){
      const b=JSON.parse(options.body);state.me={...state.me,...b,socials:{...state.me.socials,...b.socials},avatarUrl:state.me.avatarUrl||''};return {user:state.me};
      } if(path==='/api/me')return {user:state.me};if(path.startsWith('/api/profile/'))return {user:state.me,logs:state.profileLogs};return {ok:true,items:[]};};
    loadProfile=async()=>{state.profile={...state.me};return true};history.pushState=()=>{};
    render();
  }''')
  page.wait_for_timeout(250)
  assert page.locator('#mtMusicShowcase').count()==0, 'music should be off by default'
  assert page.locator('#mtProfileAtmosphere').count()==1, 'atmosphere present but disabled'
  assert 'has-particles' not in (page.locator('#mtProfileAtmosphere').get_attribute('class') or '')
  assert page.evaluate('document.documentElement.scrollWidth')<=width+3,'horizontal overflow'
  if width>=1021:
   d=page.evaluate('''() => {let r=s=>document.querySelector(s)?.getBoundingClientRect();return {side:r('.layout.pf-page>.side')?.top,hero:r('.pf-hero')?.top,now:r('.pf-current-panel')?.top,feed:r('.pf-global-activity')?.top,sideBottom:r('.layout.pf-page>.side')?.bottom,nowBottom:r('.pf-current-panel')?.bottom,avatarX:(r('.pf-hero-id>.pf-hero-avatar')?.left+r('.pf-hero-id>.pf-hero-avatar')?.right)/2,heroX:(r('.pf-hero')?.left+r('.pf-hero')?.right)/2}}''')
   print('alignment',width,d)
   assert abs(d['side']-d['hero'])<4 and abs(d['now']-d['feed'])<3,d
   assert abs(d['sideBottom']-d['nowBottom'])<5,d
   assert abs(d['avatarX']-d['heroX'])<6,d
  if width==1440:
   page.evaluate('''() => openProfileEditor()''')
   page.locator('button.pe-tab[data-t="look"]').click()
   assert page.locator('#editMusicEnabled').count()==1
   page.locator('#editMusicEnabled').check()
   page.locator('#editBgEnabled').check()
   page.locator('#editProfileBg').fill('https://example.com/profile-background.jpg')
   page.locator('#editFxEnabled').check()
   page.locator('#editFxColor').fill('#ef76be')
   page.get_by_role('button',name='Save profile').last.click()
   page.wait_for_timeout(300)
   assert page.locator('#mtMusicShowcase').count()==1,'enabled music visible'
   assert 'has-background' in (page.locator('#mtProfileAtmosphere').get_attribute('class') or '')
   assert 'has-particles' in (page.locator('#mtProfileAtmosphere').get_attribute('class') or '')
   css=page.locator('.mt-profile-background').evaluate('(el)=>el.style.backgroundImage')
   assert 'profile-background.jpg' in css,css
   assert page.evaluate("state.profile.socials.profileFxColor")== '#ef76be'
   # Off is persistent, makes visitors not see the music rail.
   page.evaluate('''() => openProfileEditor()''');page.locator('button.pe-tab[data-t="look"]').click()
   page.locator('#editMusicEnabled').uncheck()
   page.locator('#editFxEnabled').uncheck()
   page.get_by_role('button',name='Save profile').last.click()
   page.wait_for_timeout(150)
   assert page.locator('#mtMusicShowcase').count()==0,'disabled music hidden'
   # Editing other values should preserve HTTPS background.
   page.evaluate('''() => openProfileEditor()''');page.locator('button.pe-tab[data-t="look"]').click()
   assert 'profile-background.jpg' in page.locator('#editProfileBg').input_value()
   page.get_by_role('button',name='Cancel').last.click()
   # Existing uploaded background must survive opening/saving appearance again.
   sample='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5h2ioAAAAASUVORK5CYII='
   page.evaluate('''(sample) => {state.me.socials.profileBackground=sample;state.me.socials.profileBackgroundEnabled=true;state.profile={...state.me}}''',sample)
   page.evaluate('''() => openProfileEditor()''')
   page.locator('button.pe-tab[data-t="look"]').click()
   assert page.locator('#editProfileBg').get_attribute('data-uploaded')==sample
   page.get_by_role('button',name='Save profile').last.click()
   page.wait_for_timeout(120)
   assert page.evaluate('state.profile.socials.profileBackground')==sample
   # A guest should only see music when its owner enabled it.
   page.evaluate('''() => {state.profile.socials.musicEnabled=true;state.me=null;render()}''')
   page.wait_for_timeout(100)
   assert page.locator('#mtMusicShowcase').count()==1
   page.evaluate('''() => {state.profile.socials.musicEnabled=false;render()}''')
   page.wait_for_timeout(100)
   assert page.locator('#mtMusicShowcase').count()==0
  print('PASS responsive',width,'errors:',errors)
  assert not errors,errors
  page.close()
 b.close()
print('PASS v64 all responsive profile + settings cases')

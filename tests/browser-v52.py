from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import io,re
html=Path(__file__).resolve().parents[1].joinpath('public/index.html').read_text()
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
buf=io.BytesIO(); Image.new('RGB',(120,160),'#bbaabc').save(buf,format='PNG');png=buf.getvalue()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':920},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('https://img.example/**',lambda r:r.fulfill(body=png,content_type='image/png'))
 page.route('https://bad.example/**',lambda r:r.fulfill(status=404,body='missing'))
 page.set_content(html,wait_until='commit',timeout=18000)
 page.wait_for_function('() => typeof renderMemberResults === "function" && typeof openMediaDetails === "function"',timeout=12000)
 page.evaluate('''() => {
  window.fetch=async (input)=>new Response(JSON.stringify({results:[],data:[],cover:'',alternates:[]}),{headers:{'content-type':'application/json'}});
  state.view='discover';state.type='anime';state.me=null;state.results=[];state.search='';
  state.memberResults=[{name:'member_one',globalName:'Member One',avatar:'https://bad.example/avatar.png',avatarFallback:'https://img.example/discord.png'}];
  document.querySelector('#app').innerHTML=shell('<div id="memberSearchResults">'+renderMemberResults()+'</div>',false);
 }''')
 page.wait_for_function("() => {const x=document.querySelector('.member-result img');return x && x.complete && x.naturalWidth>0 && x.src.includes('img.example/discord.png')}",timeout=8000)
 print('PASS v52: Global Search member photo falls back to valid Discord avatar',flush=True)
 # On result card, details open by clicking the image/card, not a separate View details button.
 page.evaluate('''() => {state.view='discover';state.type='anime';state.results=[{key:'naruto',title:'Naruto',mediaType:'anime',cover:'https://img.example/naruto.png'}];document.querySelector('#app').innerHTML=shell('<div class="card" id="targetSearch">'+renderResults()+'</div>',false)}''')
 assert page.locator('#targetSearch .result-actions button').count()==1
 page.locator('#targetSearch .result .cover').click()
 page.wait_for_selector('.mt-media-pop-back .mt-media-pop',timeout=4000)
 assert page.locator('.mt-media-pop h2').inner_text()=='Naruto'
 page.keyboard.press('Escape')
 assert page.locator('.mt-media-pop').count()==0
 print('PASS v52: one-click media details + animation + Escape close',flush=True)
 # Profile showcase/planning posters are direct click targets, with no view-details overlay.
 page.evaluate('''() => {
  state.view='profile';state.profile={name:'member_one',globalName:'Member One',id:91,stats:{total:2},joined:Date.now(),shape:'circle'};
  state.profileLogs=[{title:'Welcome Back, Alice',mediaType:'manga',cover:'https://img.example/alice.png',mediaKey:'manga:alice',status:'Completed',rating:10},{title:'Naruto',mediaType:'anime',cover:'https://img.example/naruto.png',status:'Planning'}];
  state.profileTab='overview';document.querySelector('#app').innerHTML=shell(profilePage(),false);
 }''')
 assert page.locator('.pf-view-details').count()==0
 assert page.locator('.pf-media-action').count()>=2
 page.locator('.pf-media-action').first.click()
 page.wait_for_selector('.mt-media-pop',timeout=4000)
 assert page.locator('.mt-media-pop h2').inner_text()=='Welcome Back, Alice'
 page.keyboard.press('Escape')
 assert 'Passport Dexx' not in page.title()
 print('PASS v52: profile Showcase/Planning direct clicks, clean popup and MediaTok branding',flush=True)
 # Homepage tiles use known artwork immediately and clicking a poster doesn't navigate away.
 page.evaluate('''() => {
  state.view='home';state.profile=null;state.search='';state.results=[];
  state.feed=[{id:1,mediaType:'anime',title:'Naruto',cover:'https://img.example/naruto.png',user:{name:'member_one'}}];render();
 }''')
 page.wait_for_function("() => document.querySelector('#medium-showcase-animanga img')?.naturalWidth > 0",timeout=7000)
 page.locator('#medium-showcase-animanga .medium-poster').first.click()
 page.wait_for_selector('.mt-media-pop',timeout=5000)
 assert page.evaluate('state.view')=='home'
 assert page.locator('.mt-media-pop h2').inner_text()=='Naruto'
 print('PASS v52: home poster opens details without navigation and without pre-testing known images',flush=True)
 page.keyboard.press('Escape')
 page.evaluate('''() => {state.view='feed';state.feedMode='global';render()}''')
 page.wait_for_selector('.activity-body .activity-cover',timeout=5000)
 page.locator('.activity-body .activity-cover').first.click()
 page.wait_for_selector('.mt-media-pop',timeout=4500)
 assert page.locator('.mt-media-pop h2').inner_text()=='Naruto'
 print('PASS v52: Global Recents image clicks directly through to media details',flush=True)
 assert not errors,errors
 browser.close()

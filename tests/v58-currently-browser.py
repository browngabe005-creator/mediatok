from pathlib import Path
import re
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'public/index.html').read_text()
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1770,'height':900},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='commit',timeout=17000)
 page.wait_for_function("typeof profilePage === 'function' && typeof openCurrentMediaList === 'function'",timeout=12000)
 page.evaluate('''() => {
  const make=(i,type)=>({id:i,mediaKey:`${type}:title${i}`,mediaType:type,title:`Title ${i}`,cover:'',year:'2025',status:i<9?'In progress':'Completed',progress:i*3,rating:8,updatedAt:Date.now()-i*10000});
  const logs=[...Array.from({length:12},(_,i)=>make(i,i%2?'manga':'anime'))];
  window.__calls=[];window.__saved=[];
  api=async (path,opts={})=>{
   window.__calls.push(path);
   if(path.startsWith('/api/logs/progress?'))return {log:{status:'In progress',progress:12}};
   if(path.startsWith('/api/profile/'))return {user:state.profile,logs:state.profileLogs};
   if(path==='/api/logs/progress'){window.__saved.push(JSON.parse(opts.body));return {ok:true}};
   if(path.startsWith('/api/credits/'))return {directors:[],authors:[],cast:[]};
   return {ok:true};
  };
  state.me={id:23,name:'alice',globalName:'Alice',stats:{total:12},role:'member',shape:'circle',favs:[],socials:{}};
  state.profile={...state.me,followers:3,joined:Date.now()};state.profileLogs=logs;state.feed=[];state.view='profile';state.profileTab='overview';
  render();
 }''')
 assert page.locator('.pf-current-panel').count()==1
 assert page.locator('.pf-current-panel .mt-current-item').count()==6
 assert page.locator('.pf-global-rail').count()==1
 boxes=page.evaluate('''() => ['.pf-center-column','.pf-current-rail','.pf-global-rail'].map(s=>document.querySelector(s)?.getBoundingClientRect().x)''')
 assert boxes[0]<boxes[1]<boxes[2],boxes
 assert page.locator('.pf-current-panel').evaluate('(e)=>getComputedStyle(e).maxHeight')!='none'
 page.locator('.pf-current-panel button:has-text("View all")').click()
 assert page.locator('.mt-current-full .mt-current-item').count()==9
 page.locator('.mt-current-filters button:has-text("Anime")').click()
 assert page.locator('.mt-current-full .mt-current-item').count()==5
 page.locator('.mt-current-modal .mt-current-item').first.click()
 page.wait_for_selector('.media-detail-modal .mt-detail-progress')
 page.wait_for_function("() => document.querySelector('#mtProgressValue')?.value==='12'")
 page.locator('#mtProgressValue').fill('17')
 page.locator('#mtProgressStatus').select_option('In progress')
 page.locator('#mtSaveProgress').click()
 page.wait_for_function('window.__saved.length===1')
 saved=page.evaluate('window.__saved[0]');assert saved['progress']==17 and saved['status']=='In progress' and saved['type']=='anime',saved
 page.evaluate("() => {closeModal();setProfileTab('anime')}")
 assert page.locator('.mt-medium-current').count()==1
 assert 'Currently watching' in page.locator('.mt-medium-current').inner_text()
 page.evaluate('''() => {state.profileLogs.forEach(l=>l.status='Completed');setProfileTab('overview')}''')
 assert page.locator('.pf-current-panel').count()==0
 assert page.locator('.pf-global-rail').count()==1
 assert not errors,errors
 print('PASS v58 browser: profile rail at right, capped six; full list; media tab active summary; inline episode save; empty-state unchanged')
 browser.close()

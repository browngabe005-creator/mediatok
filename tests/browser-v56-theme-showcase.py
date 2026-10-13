from pathlib import Path
import re
from playwright.sync_api import sync_playwright
html=Path(__file__).resolve().parents[1].joinpath('public/index.html').read_text()
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1220,'height':920},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='commit',timeout=18000)
 page.wait_for_function('typeof openProfileEditor==="function" && typeof applyTheme==="function"',timeout=10000)
 page.evaluate('''() => {
  state.me={id:22,name:'RoseTest',globalName:'Rose',favs:['anime:naruto'],stats:{},shape:'circle',links:{},socials:{}};
  state.profile={...state.me};state.profileLogs=[{mediaKey:'anime:naruto',mediaType:'anime',title:'Naruto',cover:'https://cdn.myanimelist.net/test.jpg',rating:9,status:'Completed'}];state.view='profile';state.profileTab='overview';
  window.api=async path=>path.startsWith('/api/profile/')?{logs:state.profileLogs}:path==='/api/me'?{user:state.me}:{ok:true};
  window.openSiteMediaDetails=(type,title)=>{window.__details=title};
  window.refreshFeed=async()=>{};
 }''')
 page.evaluate('render()')
 # verify icon square removed from profile showcase and no old View details overlay
 page.wait_for_selector('.pf-page .pf-poster .pf-type')
 icon=page.evaluate('''()=>{let e=document.querySelector('.pf-page .pf-poster .pf-type'),s=getComputedStyle(e);return {bg:s.backgroundColor,shadow:s.boxShadow,radius:s.borderRadius}}''')
 assert icon['bg']=='rgba(0, 0, 0, 0)',icon
 assert icon['shadow']=='none',icon
 assert page.locator('.pf-page .pf-poster .pf-view-details:visible').count()==0
 print('PASS profile posters: icon only, no box/hover text overlay')
 page.evaluate('peTab="showcase";openProfileEditor()')
 page.wait_for_selector('.pe-showgrid .pe-pick',timeout=10000)
 def check(theme):
  page.evaluate('(theme)=>applyTheme(theme)',theme)
  return page.evaluate('''()=>{
    const comp=s=>getComputedStyle(document.querySelector(s));
    return {body:comp('body').backgroundColor,editor:comp('.pe-showgrid .pe-pick').backgroundColor,text:comp('.pe-showgrid .pe-pick .pf-title').color,sub:comp('.pe-showgrid .pe-pick .pf-sub').color,root:document.documentElement.dataset.theme}
  }''')
 light=check('light');print('Light',light)
 assert light['editor'] in ('rgb(255, 255, 255)','rgb(255, 250, 253)'),light
 dark=check('dark');print('Dark',dark)
 assert dark['editor']!='rgb(255, 255, 255)',dark
 pink=check('pink');print('Pink',pink)
 assert pink['root']=='pink' and pink['body']=='rgb(255, 243, 247)',pink
 assert pink['editor']=='rgb(255, 250, 253)' and pink['text']=='rgb(57, 32, 49)',pink
 initial=page.evaluate('peFavs.length')
 page.locator('.pe-pick .pe-toggle').first.click()
 after_first=page.evaluate('peFavs.length')
 assert abs(after_first-initial)==1,(initial,after_first)
 page.locator('.pe-pick .pe-toggle').first.click()
 assert page.evaluate('peFavs.length')==initial,'add/remove should be reversible'
 page.evaluate('closeModal();state.view="settings";render()')
 page.wait_for_selector('#mtThemeSelect')
 assert page.locator('#mtThemeSelect option[value="pink"]').count()==1
 assert page.locator('#mtThemeSelect').input_value()=='pink'
 page.locator('#mtThemeSelect').select_option('light')
 assert page.evaluate('document.documentElement.dataset.theme')=='light'
 page.locator('#mtThemeSelect').select_option('pink')
 assert page.evaluate('document.documentElement.dataset.theme')=='pink'
 # Text remains visible in pink Details, Settings, and labels.
 page.evaluate('''() => {window.fetch=async()=>new Response(JSON.stringify({authors:['Test Author'],directors:[],cast:[],crew:[],voices:[],studios:[]} ),{headers:{'content-type':'application/json'}});state.results=[{key:'sample:novel',title:'Sample Novel',mediaType:'novel',creator:'Test Author',description:'A novel to read',cover:''}];openMediaDetails(0)}''')
 page.wait_for_selector('.media-detail-modal .md-heading h2')
 detail=page.evaluate('''() => {const c=x=>getComputedStyle(document.querySelector(x));return {bg:c('.media-detail-modal').backgroundColor,title:c('.md-heading h2').color,info:c('.md-overview').color,credits:c('.md-credit span').color}}''')
 assert detail['bg']=='rgb(255, 250, 253)',detail
 assert detail['title']=='rgb(57, 32, 49)' and detail['info']=='rgb(57, 32, 49)',detail
 page.evaluate('closeModal()')
 print('PASS pink details: heading, description, credits have readable dark text on blush background')
 print('PASS themes: light, dark, pink, persisted selector, original Showcase selection untouched')
 assert not errors,errors
 browser.close()

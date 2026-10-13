from pathlib import Path
from playwright.sync_api import sync_playwright
import re
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'public/index.html').read_text().replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1440,'height':900},service_workers='block')
 errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 page.set_content(html,wait_until='commit',timeout=25000)
 page.wait_for_function('typeof profilePage === "function" && typeof dmPage === "function"')
 page.evaluate('''() => { const me={id:1,name:'me',globalName:'Me',stats:{},links:{},externalStats:{_autoSync:{}},socials:{}}; const u={id:2,name:'alice',globalName:'Alice',stats:{anime:3,total:3},followers:1,socials:{},links:{}};state.me=me;state.profile=u;state.profileLogs=[{id:1,mediaKey:'a',mediaType:'anime',title:'Low',status:'Completed',rating:4,updatedAt:300},{id:2,mediaKey:'b',mediaType:'anime',title:'High',status:'Completed',rating:10,updatedAt:100},{id:3,mediaKey:'c',mediaType:'anime',title:'Newest',status:'Completed',rating:8,updatedAt:500}];state.profileTab='anime';state.profileStatus='All';state.profileSort='recent';document.querySelector('#app').innerHTML=shell(profilePage(),false);}''')
 assert page.locator('.pf-sort select').count()==1
 titles=page.locator('.pf-grid-posters .pf-title').all_text_contents();assert titles[0]=='Newest',titles
 page.select_option('.pf-sort select','ranking');page.wait_for_timeout(50)
 titles=page.locator('.pf-grid-posters .pf-title').all_text_contents();assert titles[0]=='High',titles
 assert page.get_by_text('Message',exact=True).count()==1
 page.evaluate("state.results=[{title:'Missing art',mediaType:'anime',cover:'',year:''}];state.type='anime';document.querySelector('#app').innerHTML='<div class=\"search-results\">'+renderResults()+'</div>'")
 assert page.locator('.mt-cover-placeholder svg').count()==1
 # Profile editor includes the new VNDB integration.
 page.evaluate("state.me={id:1,name:'me',globalName:'Me',stats:{},links:{},externalStats:{_autoSync:{}},socials:{}}")
 page.evaluate("openProfileEditor()")
 page.wait_for_timeout(100)
 page.get_by_text('Accounts',exact=True).click();page.wait_for_timeout(50)
 assert page.get_by_text('VNDB',exact=True).count()==1
 assert page.get_by_text('Auto-update linked list',exact=True).count()>=3
 assert not errs,errs
 b.close()
print('PASS v70 browser: profile sorting, DM button, VNDB card, auto-sync controls, icon placeholder')

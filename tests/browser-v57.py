from pathlib import Path
import re
from playwright.sync_api import sync_playwright
html=Path(__file__).resolve().parents[1].joinpath('public/index.html').read_text()
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1440,'height':900},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='commit',timeout=18000)
 page.wait_for_function('typeof openProfileEditor==="function" && typeof searchMedia==="function"',timeout=10000)
 page.evaluate('''() => {
  state.me={id:2,name:'alice',globalName:'Alice',avc:'https://cdn.discordapp.com/embed/avatars/0.png',stats:{anime:9},shape:'circle',links:{},socials:{},favs:'[]'};
  state.view='settings';state.feed=[];state.type='novel';state.results=[];state.memberResults=[];
  window.api=async path=>path.startsWith('/api/profile/')?{logs:[{mediaKey:'novel:faith',mediaType:'novel',title:'Faith',cover:'',status:'Completed'}]}:
   path.startsWith('/api/leaderboard')?[]:path.startsWith('/api/books/browse')?{results:[],nextOffset:30,hasMore:false}:
   path==='/api/me'?{user:state.me}:path.startsWith('/api/feed')?[]:{ok:true};
  window.openSiteMediaDetails=()=>{};
 }''')
 page.evaluate('render()')
 page.wait_for_selector('.mt-side-account .mt-account-identity',timeout=8000)
 assert page.locator('#topUser .btn').count()==0, 'signed-in name must no longer be in top header'
 assert page.locator('.mt-side-account .mt-account-identity').count()==1
 assert page.locator('#goodreadsLibraryFile').count()==0,'Goodreads should not appear in Settings'
 assert page.locator('#passportLibraryFile').count()==0,'Passport Dex should not appear in Settings'
 page.evaluate('peTab="accounts";openProfileEditor()')
 page.wait_for_selector('.pe-pane[data-p="accounts"] #goodreadsLibraryFile',timeout=8000)
 assert page.locator('.pe-pane[data-p="accounts"] .integration-card').count()==6
 assert page.locator('.pe-pane[data-p="accounts"] #passportLibraryFile').count()==1
 page.locator('#goodreadsLibraryFile').set_input_files(files={'name':'goodreads_library_export.csv','mimeType':'text/csv','buffer':b'Book Id,Title,Author,My Rating,Exclusive Shelf\n1,Test Theology Book,Any Author,4,read\n2,To Read Book,Other Author,0,to-read\n'})
 page.get_by_role('button',name='Preview & import CSV').click()
 page.wait_for_selector('#mtLibraryImportConfirm',timeout=8000)
 assert '2 books ready' in page.locator('#mtLibraryImportPreview').inner_text()
 assert page.locator('#mtLibraryImportPreview').inner_text().count('Planning')==1
 page.locator('#passportLibraryFile').set_input_files(files={'name':'my-collection.json','mimeType':'application/json','buffer':b'{"games":[{"title":"Stardew Valley","status":"completed"}],"books":[{"title":"Summa Theologiae","status":"to-read"}]}'})
 page.get_by_role('button',name='Preview & import file').click()
 page.wait_for_function('mtLibraryImport && mtLibraryImport.service === "passport"')
 assert {x['type'] for x in page.evaluate('mtLibraryImport.entries')}=={'novel','game'}
 print('PASS Settings imports removed; same-layout Goodreads and Passport Dex integrated in Accounts; CSV preview')
 page.evaluate('closeModal();state.view="discover";state.type="novel";state.search="";render()')
 page.wait_for_selector('#discoverSearchInput',timeout=8000)
 page.locator('#discoverSearchInput').fill('theology')
 assert page.locator('#globalSearchInput').input_value()=='theology','search fields should synchronize'
 assert page.locator('#discoverSearchInput').input_value()=='theology'
 page.locator('#globalSearchInput').fill('Christian philosophy')
 assert page.locator('#discoverSearchInput').input_value()=='Christian philosophy'
 page.evaluate('globalSearchTimer&&clearTimeout(globalSearchTimer)')
 print('PASS both search fields are real inputs and synchronized')
 # Hover animation should leave titles unmoved
 page.evaluate('''() => {document.querySelector('#app').innerHTML='<div class="pf-page">'+pfPoster({mediaType:'anime',title:'Naruto',mediaKey:'anime:naruto',cover:'https://example.com/test.jpg',status:'Completed'})+'</div>';}''')
 page.wait_for_selector('.pf-page .pf-poster',timeout=8000)
 poster=page.locator('.pf-page .pf-poster').first
 poster.hover()
 assert page.evaluate("getComputedStyle(document.querySelector('.pf-page .pf-poster')).transform")=='none','card and title should not translate'
 print('PASS hover applies to artwork and keeps title still')
 assert not errors,errors
 browser.close()

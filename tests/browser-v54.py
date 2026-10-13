from pathlib import Path
import re,io
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'public/index.html').read_text()
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1250,'height':980},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='commit',timeout=15000)
 page.wait_for_function('() => typeof peRenderPicks === "function" && typeof mtParseLibraryImport === "function"',timeout=10000)
 page.evaluate('''() => {
  state.me={id:11,name:'test',globalName:'Test',favs:[],stats:{},shape:'circle',links:{},socials:{}};
  state.profile={...state.me};state.profileLogs=[];state.view='profile';state.profileTab='overview';
  window.api=async (path,opts) => path.startsWith('/api/profile/') ? {logs:[
  {mediaKey:'anime:naruto',mediaType:'anime',title:'Naruto',cover:'',rating:9,status:'Completed'},
  {mediaKey:'manga:alice',mediaType:'manga',title:'Welcome Back, Alice',cover:'',rating:8,status:'Completed'}
  ]} : path==='/api/me' ? {user:state.me} : {ok:true,imported:opts&&opts.body ? JSON.parse(opts.body).entries.length : 0,skipped:0};
  window.refreshFeed=async () => {};
  window.openSiteMediaDetails=(type,title)=>{window.__lastDetails=title};
 }''')
 page.evaluate("() => {peTab='showcase';openProfileEditor()}")
 page.wait_for_selector('#peShowGrid .pe-pick',timeout=7000)
 assert page.locator('#peShowGrid .pe-pick').count()==2
 assert page.locator('.pe-pick button.pe-toggle').count()==2
 assert page.locator('.pe-pick button .pf-media-action').count()==0, 'must not nest article inside button'
 page.locator('.pe-pick .pf-poster').first.click()
 assert page.evaluate('window.__lastDetails')=='Naruto'
 assert page.evaluate('peFavs.length')==0, 'poster should show details only'
 page.locator('.pe-pick .pe-toggle').first.click()
 assert page.evaluate('peFavs.length')==1, 'plus should add'
 assert page.evaluate('window.__lastDetails')=='Naruto', 'toggle must not open details'
 assert page.locator('.pe-pick .pe-toggle').first.get_attribute('aria-pressed')=='true'
 page.locator('.pe-pick .pe-toggle').first.click()
 assert page.evaluate('peFavs.length')==0, 'minus should remove'
 print('PASS showcase: details click stays separate, + / ✓ add or remove, no nested buttons')
 page.evaluate('closeModal();state.view="settings";render()')
 page.wait_for_selector('#goodreadsLibraryFile')
 csv='Book Id,Title,Author,My Rating,Exclusive Shelf,Year Published\n111,"A Book, With Commas",Test Author,4,read,2020\n222,Unfinished Book,Other,0,to-read,2016\n333,Currently Reading,Other,3,currently-reading,2023\n'
 page.locator('#goodreadsLibraryFile').set_input_files({'name':'goodreads_library_export.csv','mimeType':'text/csv','buffer':csv.encode()})
 page.locator('button:has-text("Preview Goodreads")').click()
 page.wait_for_function('mtLibraryImport && mtLibraryImport.entries.length===3')
 result=page.evaluate('mtLibraryImport.entries')
 print('goodreads result',result)
 assert result[0]['title']=='A Book, With Commas'
 assert result[0]['rating']==8
 assert result[0]['status']=='Completed'
 assert result[1]['rating'] is None and result[1]['status']=='Planning'
 assert result[2]['rating']==6 and result[2]['status']=='In progress'
 page.locator('#mtLibraryImportConfirm').click()
 page.wait_for_function('mtLibraryImport===null')
 assert '3 new entries added' in page.locator('#mtLibraryImportPreview').inner_text()
 print('PASS Goodreads: quoted CSV, 1–5 star conversion, shelf statuses, batch importer')
 passport={'games':[{'title':'Stardew Valley','status':'played','rating':9}], 'movies':[{'name':'Spirited Away','status':'watched','rating':10}], 'books':[{'title':'Dune','status':'to-read','rating':7}]}
 page.locator('#passportLibraryFile').set_input_files({'name':'my-passport.json','mimeType':'application/json','buffer':__import__('json').dumps(passport).encode()})
 page.locator('button:has-text("Preview Passport Dex")').click()
 page.wait_for_function('mtLibraryImport && mtLibraryImport.entries.length===3')
 ents=page.evaluate('mtLibraryImport.entries')
 assert {x['type'] for x in ents}=={'game','film','novel'},ents
 assert [x['status'] for x in ents]==['Completed','Completed','Planning'],ents
 print('PASS Passport Dex: collection JSON sections, media type mapping, statuses')
 assert not errors,errors
 browser.close()

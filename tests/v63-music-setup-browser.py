from pathlib import Path
from playwright.sync_api import sync_playwright
import re
root=Path(__file__).resolve().parents[1]
html=(root/'public/index.html').read_text().replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1440,'height':900},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='commit',timeout=18000)
 page.wait_for_function('typeof profilePage === "function" && typeof openMusicEditor === "function"')
 page.evaluate('''() => {api=async path=>path.startsWith('/api/music')?{source:'unconfigured',items:[],message:'Last.fm API key missing on MediaTok Worker. The site administrator must configure LASTFM_API_KEY.'}:{ok:true,results:[]};state.me={id:23,name:'alice',role:'member',socials:{lastfm:'alice_fm',musicMode:'recent',musicFavorites:[]},stats:{total:1}};state.profile={...state.me,joined:Date.now()};state.profileLogs=[];state.feed=[];state.view='profile';state.profileTab='overview';render()}''')
 page.locator('#mtMusicList').wait_for(timeout=5000)
 page.wait_for_function("document.querySelector('#mtMusicList')?.innerText.includes('API key missing')")
 assert page.locator('#mtMusicFeedback').is_visible()
 page.get_by_role('button',name='Edit',exact=True).last.click()
 assert page.locator('#mtMusicUsername').input_value()=='alice_fm'
 assert 'username' in page.locator('.mt-music-hint').inner_text().lower()
 page.get_by_role('button',name='Cancel').last.click()
 # Open existing Accounts editor; verify Last.fm setup is discoverable there.
 page.evaluate("() => {openProfileImports()}")
 assert page.get_by_role('heading',name='Last.fm Music').count()==1
 assert page.get_by_role('button',name='Set up music').count()==1
 page.get_by_role('button',name='Set up music').click()
 assert page.get_by_role('heading',name='Edit music showcase').count()==1
 assert not errors, errors
 b.close()
print('PASS v63 Last.fm connection status + Accounts setup navigation')

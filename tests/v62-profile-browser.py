from pathlib import Path
from playwright.sync_api import sync_playwright
import re
root=Path(__file__).resolve().parents[1]
html=(root/'public/index.html').read_text().replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in [1760,1440,1160,390]:
  page=b.new_page(viewport={'width':width,'height':900},service_workers='block')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='commit',timeout=18000)
  page.wait_for_function('typeof profilePage === "function" && typeof openMusicEditor === "function"')
  page.evaluate('''() => {api=async path => path.startsWith('/api/music')?{mode:'recent',items:[{type:'artist',name:'Beach House',image:'',url:'https://www.last.fm/music/Beach+House'},{type:'artist',name:'Sade',image:''},{type:'artist',name:'Radiohead',image:''},{type:'artist',name:'Portishead',image:''}]}:{ok:true,results:[]};
   const logs=Array.from({length:12},(_,i)=>({id:i+1,mediaKey:'anime:'+i,mediaType:'anime',title:'Currently watching '+i,cover:'',year:'2025',status:'In progress',progress:i,rating:8,updatedAt:Date.now()-i*1000}));
   state.me={id:23,name:'alice',globalName:'Alice',stats:{total:12},role:'member',socials:{lastfm:'alice-fm',musicMode:'recent',musicFavorites:[]}};
   state.profile={...state.me,followers:5,joined:Date.now()};state.profileLogs=logs;
   state.feed=[];state.view='profile';state.profileTab='overview';render();}''')
  page.wait_for_timeout(350)
  dims=page.evaluate('''() => {const rect=s=>{const x=document.querySelector(s);return x?x.getBoundingClientRect():null};return {side:rect('.layout.pf-page>.side')?.top,hero:rect('.pf-hero')?.top,now:rect('.pf-current-panel')?.top,feed:rect('.pf-global-activity')?.top,feedBottom:rect('.pf-global-activity')?.bottom,nowBottom:rect('.pf-current-panel')?.bottom,music:rect('.pf-music-rail')?.top,bodyWidth:document.documentElement.scrollWidth,musicItems:document.querySelectorAll('#mtMusicList .mt-music-track').length}}''')
  print('v62',width,dims,'errors',errors)
  assert not errors,errors
  assert dims['musicItems']==4,dims
  assert dims['bodyWidth']<=width+2,dims
  if width>=1021:
   assert abs(dims['hero']-dims['side'])<4, dims
   assert abs(dims['now']-dims['feed'])<2, dims
   assert dims['music']>=max(dims['feedBottom'],dims['nowBottom'])-1,dims
  if width==1440:
   page.screenshot(path='/mnt/data/mediatok-v62-desktop-preview.png')
   page.get_by_role('button',name='Edit',exact=True).last.click()
   assert page.locator('#mtMusicUsername').input_value()=='alice-fm'
   page.locator('#mtMusicMode').select_option('favorites')
   assert not page.locator('#mtMusicManual').is_hidden()
   page.locator('#mtMusicKind0').select_option('song')
   assert not page.locator('#mtMusicArtist0').is_hidden()
   page.get_by_role('button',name='Cancel').last.click()
  page.close()
 b.close()
print('PASS v62 profile/music layouts, modal edit, responsive bounds')

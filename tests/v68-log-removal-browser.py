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
 page.set_content(html,wait_until='commit',timeout=25000)
 page.wait_for_function('typeof openMediaDetails === "function"')
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 # Browser calls are mocked; local tests never make changes to real account data.
 page.evaluate('''() => {
 const user={id:23,name:'alice',globalName:'Alice',status:'',bannerUrl:'',avatarUrl:'',socials:{},stats:{total:1}};
 state.me=user;state.profile={...user};state.view='profile';state.profileTab='overview';
 state.profileLogs=[{id:18,mediaKey:'mal:18',mediaType:'anime',title:'One Piece',cover:'',status:'In progress',progress:8,year:'1999',rating:9,note:'notes'}];state.feed=[];
 state.results=[{key:'anime:one piece',title:'One Piece',mediaType:'anime',year:'1999',cover:''}];state.type='anime';
 window.__deleted=[];window.confirm=()=>true;
 api=async (url,opts={})=>{
  if(url.startsWith('/api/logs/progress?'))return {log:{id:18,mediaKey:'mal:18',status:'In progress',progress:8}};
  if(url==='/api/logs/18'&&opts.method==='DELETE'){window.__deleted.push(18);return {ok:true,id:18}}
  if(url==='/api/me')return {user:{...user,stats:{total:0}}};
  if(url.startsWith('/api/profile/'))return {user:{...user,stats:{total:0}},logs:[]};
  if(url.startsWith('/api/feed'))return [];
  if(url.startsWith('/api/media-credits'))return {directors:[],authors:[],creators:[]};
  return {};
 };
 loadMediaCredits=async()=>{};
}''')
 page.evaluate('openMediaDetails(0)')
 page.wait_for_function('!document.querySelector("#mtDetailsRemoveLog").hidden')
 assert page.locator('#mtDetailsRemoveLog').inner_text().strip()=='Remove from my list'
 page.locator('#mtDetailsRemoveLog').click()
 page.wait_for_function('window.__deleted.length === 1')
 assert page.evaluate('state.profileLogs.length')==0
 assert not page.locator('.media-detail-modal').count()
 # When it is not the owner's entry, no Remove button should show in details
 page.evaluate('''() => {state.me=null;state.results=[{key:'anime:naruto',title:'Naruto',mediaType:'anime',cover:''}];openMediaDetails(0)}''')
 assert page.locator('#mtDetailsRemoveLog').is_hidden()
 # Edit-entry dialog has an owner-only remove action, also when opened from search.
 page.evaluate('''() => {state.me={id:23,name:'alice'};state.type='anime';state.results=[{key:'anime:one piece',title:'One Piece',mediaType:'anime',year:'1999',cover:''}];state.editingLog={id:18,mediaKey:'mal:18',status:'In progress',progress:8};openLog(0)}''')
 assert page.locator('#mtEditRemoveLog').is_visible()
 assert page.locator('#mtEditRemoveLog').get_attribute('data-log-id')=='18'
 page.evaluate('closeModal()')
 # Owner profile poster should have remove control without opening details
 page.evaluate('''() => {state.me={id:23,name:'alice'};state.profile={id:23,name:'alice'};}''')
 poster=page.evaluate('pfPoster({id:19,mediaKey:"mal:19",mediaType:"anime",title:"Naruto",status:"Completed",cover:""})')
 assert 'mt-poster-remove' in poster
 assert 'data-title="Naruto"' in poster
 page.evaluate('''() => {state.profile={id:24,name:'other'};}''')
 other=page.evaluate('pfPoster({id:19,mediaType:"anime",title:"Naruto",status:"Completed",cover:""})')
 assert 'mt-poster-remove' not in other
 assert not errors,errors
 print('PASS v68 browser: remove from details updates profile, guest controls hidden, profile owner-only buttons, no JS errors')
 b.close()

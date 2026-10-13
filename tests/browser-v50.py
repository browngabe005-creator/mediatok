from pathlib import Path
from playwright.sync_api import sync_playwright
import re,base64
html=Path(__file__).resolve().parents[1].joinpath('public/index.html').read_text()
html=html.replace('});boot();','});')
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9iV8KggAAAAASUVORK5CYII=')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1400,'height':900},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('https://cdn.myanimelist.net/**',lambda route:route.fulfill(body=png,content_type='image/png'))
 page.route('https://discord.com/old.png',lambda route:route.fulfill(body=png,content_type='image/png'))
 page.route('https://images.example.com/custom.png',lambda route:route.fulfill(status=404,body='not found'))
 page.set_content(html,wait_until='commit',timeout=14000)
 page.wait_for_function("() => typeof runGlobalSearch==='function'&&typeof animeArtworkSources==='function'",timeout=14000)
 page.evaluate('''() => {
  history.pushState=()=>{};window.__v50requests=[];
  window.fetch=async (input, opts={})=>{
   const url=String(input);window.__v50requests.push(url);
   const out=value=>new Response(JSON.stringify(value),{status:200,headers:{'content-type':'application/json'}});
   if(url.includes('/api/search/users'))return out({results:[]});
   if(url.includes('/api/search/media/cover')||url.includes('/api/search/v42/cover')||url.includes('/api/search/cover'))return out({cover:'',alternates:[]});
   if(url.includes('/api/search/media?'))return out({providerStatus:'local',results:[{title:'Naruto',mediaType:'anime',key:'mediatok-seed:anime:naruto',cover:''}]});
   if(url.includes('/api/search/v42')||url.includes('/api/search/catalog'))return out({providerStatus:'offline',results:[]});
   if(url.includes('api.jikan.moe'))return out({data:[{title:'Naruto',images:{jpg:{large_image_url:'https://cdn.myanimelist.net/naruto-v50.jpg'}}}]});
   if(url.includes('kitsu.io'))return out({data:[]});
   if(url.includes('graphql.anilist.co'))return out({data:{Page:{media:[]}}});
   return out({user:null,results:[]});
  };
  state.me=null;state.view='home';state.search='';state.type='all';state.results=[];state.feed=[];render();
 }''')
 page.locator('#globalSearchInput').fill('Naruto')
 page.locator('form.global-search button[type=submit]').click()
 try: page.wait_for_function("() => {const x=document.querySelector('.result img.cover');return x&&x.complete&&x.naturalWidth>0}",timeout=14000)
 except Exception:
  print('DEBUG', page.evaluate('''() => ({view:state.view,search:state.search,type:state.type,html:document.querySelector('#searchResults')?.innerHTML?.slice(0,1800),rows:state.results,requestLog:window.__v50requests,path:location.pathname,active:document.querySelector('#app')?.innerHTML?.slice(0,400),renderSource:render.toString().slice(0,300),errors:document.querySelector('#searchMessage')?.textContent,cache:[...coverDetailsCache.entries()].map(([k,v])=>({key:k,value:v.value}))})'''))
  raise
 assert 'Naruto' in page.locator('.result-title').first.inner_text()
 assert page.locator('.result img.cover').first.get_attribute('src')=='https://cdn.myanimelist.net/naruto-v50.jpg'
 assert page.evaluate("() => window.__v50requests.some(u=>u.includes('api.jikan.moe'))")
 # leaderboard should try custom user profile avatar then older Discord photo
 page.evaluate('''() => {
  const root=document.createElement('section');root.id='v50-avatars';root.innerHTML=leaderboardAvatar({name:'Jane',avatar:'https://images.example.com/custom.png',avatarFallback:'https://discord.com/old.png'},44,'mt-lb-avatar');document.body.appendChild(root);
 }''')
 page.wait_for_function("() => {const i=document.querySelector('#v50-avatars img');return i&&i.complete&&i.naturalWidth>0&&i.src.includes('discord.com/old.png')}",timeout=8000)
 assert not errors,errors
 print('PASS v50 browser: global-search anime fallback renders; custom avatar falls back to Discord photo')
 b.close()

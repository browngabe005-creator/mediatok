from pathlib import Path
from playwright.sync_api import sync_playwright
import re,io
from PIL import Image
html=Path(__file__).resolve().parents[1].joinpath('public/index.html').read_text()
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));","const path='';")
png=io.BytesIO();Image.new('RGB',(80,120),'#c0c5f5').save(png,format='PNG');png=png.getvalue()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1600,'height':1000},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('https://cdn.art.example/**',lambda route:route.fulfill(status=404) if 'broken.png' in route.request.url else route.fulfill(body=png,content_type='image/png'))
 page.set_content(html,wait_until='commit',timeout=12000)
 page.wait_for_function('() => typeof loadPickCovers === "function" && typeof searchMedia === "function"',timeout=12000)
 page.evaluate('''() => {
  window.__coverRequests=[];
  window.fetch=async (url)=>{
   const x=String(url),answer=(v)=>new Response(JSON.stringify(v),{headers:{'Content-Type':'application/json'}});
   if(x.includes('/api/search/users'))return answer({results:[]});
   if(x.includes('/api/search/media/cover')){
     window.__coverRequests.push(x);
     return answer({cover:'https://cdn.art.example/healthy.png',alternates:[]});
   }
   if(x.includes('/api/search/media?'))return answer({results:[{title:window.__searchTitle||'Naruto',cover:'https://cdn.art.example/healthy.png',key:'test:1',mediaType:'anime'}],providerStatus:'ok'});
   return answer({results:[]});
  };
  state.view='discover';state.type='anime';state.search='';state.results=[];state.feed=[];
  window.__searchTitle=NICHE_PICKS.anime[0][0];render();
 }''')
 page.locator('#globalSearchInput').fill(page.evaluate('window.__searchTitle'))
 page.evaluate('searchMedia()')
 page.wait_for_function("() => document.querySelector('.result img.cover')?.naturalWidth > 0",timeout=12000)
 page.wait_for_function("() => !!knownArtwork(window.__searchTitle,'anime')",timeout=5000)
 print('PASS: working search image populates shared artwork cache',flush=True)
 page.evaluate('''() => {
  state.feed=[{id:74,mediaType:'anime',title:window.__searchTitle,cover:'',year:'',status:'Completed',updatedAt:Date.now(),user:{name:'tester'},commentCount:0},
    {id:75,mediaType:'game',title:'Elden Ring',cover:'https://cdn.art.example/broken.png',year:'',status:'Planning',updatedAt:Date.now(),user:{name:'tester'},commentCount:0}];
  state.view='home';render();
 }''')
 # Crucial: state.search still has the old query; homepage poster loader must not skip.
 page.wait_for_function("() => document.querySelector('#featuredMedia img')?.naturalWidth > 0",timeout=15000)
 assert page.evaluate('state.search')==page.evaluate('window.__searchTitle')
 print('PASS: homepage posters work after navigating back from search',flush=True)
 try:
  page.wait_for_function("() => [...document.querySelectorAll('.right-activity-feed img.activity-cover')].filter(x=>x.naturalWidth>0).length===2",timeout=12000)
 except Exception:
  print('FEED DEBUG',page.evaluate("""() => ({rows:[...document.querySelectorAll('.right-activity-feed .activity')].map(x=>({title:x.querySelector('.activity-title')?.textContent,cover:x.querySelector('.activity-cover')?.outerHTML})), requests:window.__coverRequests, errors:[]})"""), 'PAGE ERRORS',errors,flush=True);raise
 print('PASS: homepage global activity hydrates missing cover AND broken old image',flush=True)
 page.wait_for_function("() => document.querySelectorAll('#medium-showcase-animanga img').length>0",timeout=25000)
 print('PASS: homepage explore-by-medium art has candidates and renders',flush=True)
 page.evaluate("state.view='feed';render()")
 page.wait_for_function("() => [...document.querySelectorAll('.main img.activity-cover')].filter(x=>x.naturalWidth>0).length===2",timeout=25000)
 print('PASS: Global Recents feed renders both recovered media images',flush=True)
 assert not errors,errors[:4]
 browser.close()

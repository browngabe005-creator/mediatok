from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import io,re
html=Path(__file__).resolve().parents[1].joinpath('public/index.html').read_text()
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));","const path='';")
png=io.BytesIO();Image.new('RGB',(140,200),'#a0caac').save(png,format='PNG');png=png.getvalue()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1440,'height':1100},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('https://img.example/**',lambda r:r.fulfill(body=png,content_type='image/png'))
 page.set_content(html,wait_until='commit',timeout=15000)
 page.wait_for_function('() => typeof homepageFeaturedPicks === "function"',timeout=12000)
 page.evaluate('''() => {
  window.__lookups=0;
  window.fetch=async url=>{
   const path=String(url);
   if(path.includes('/api/search/media/cover'))window.__lookups++;
   return new Response(JSON.stringify({cover:'',results:[],alternates:[],users:[]}),{headers:{'Content-Type':'application/json'}});
  };
  state.me=null;state.view='home';state.search='Naruto';state.results=[];
  state.feed=[
   {id:1,mediaType:'anime',title:'Naruto',cover:'https://img.example/naruto.jpg',user:{name:'alice'}},
   {id:2,mediaType:'manga',title:'One Piece',cover:'https://img.example/one-piece.jpg',user:{name:'bob'}},
   {id:3,mediaType:'film',title:'Spirited Away',cover:'https://img.example/film.jpg',user:{name:'alice'}},
   {id:4,mediaType:'tv',title:'The Mentalist',cover:'https://img.example/tv.jpg',user:{name:'alice'}},
   {id:5,mediaType:'novel',title:'Dune',cover:'https://img.example/novel.jpg',user:{name:'alice'}},
   {id:6,mediaType:'game',title:'Elden Ring',cover:'https://img.example/game.jpg',user:{name:'alice'}}
  ];
  render();
 }''')
 page.wait_for_function("() => document.querySelectorAll('#featuredMedia .niche-art img').length === 6 && [...document.querySelectorAll('#featuredMedia .niche-art img')].every(x => x.naturalWidth > 0)",timeout=13000)
 print('PASS: all 6 homepage featured covers immediately reused from real logged media',flush=True)
 page.wait_for_function("() => ['animanga','filmstv','books','discover'].every(k=>document.querySelectorAll('#medium-showcase-'+k+' img').length>0)",timeout=4000)
 print('PASS: four homepage category tiles display covers from global feed',flush=True)
 assert page.evaluate('window.__lookups') == 0, 'already-known covers should not call external lookup'
 print('PASS: no cover API queries needed for displayed homepage artwork',flush=True)
 assert not errors,errors[:5]
 # ensure global side not broken and search state survives return
 assert page.evaluate('state.search')=='Naruto'
 page.evaluate("state.view='feed';render()")
 page.wait_for_function("() => document.querySelectorAll('.main .activity-cover').length > 0",timeout=8000)
 print('PASS: Global Recents still renders',flush=True)
 browser.close()

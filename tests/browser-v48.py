from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
import re,io
html=Path(__file__).resolve().parents[1].joinpath('public/index.html').read_text()
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
buffer=io.BytesIO(); Image.new('RGB',(140,200),'#bacaac').save(buffer,format='PNG');png=buffer.getvalue()
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1440,'height':1100},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('https://img.example/**',lambda r:r.fulfill(body=png,content_type='image/png'))
 page.set_content(html,wait_until='commit',timeout=15000)
 page.wait_for_function('() => typeof homepageFeaturedPicks === "function"',timeout=10000)
 page.evaluate('''() => {
  window.__covers=[];
  window.fetch=async (url)=>{
    const path=String(url);const loc=new URL(path,'https://mediatok.org/');
    if(loc.pathname.includes('/cover')){
      const title=loc.searchParams.get('q')||'fallback'; window.__covers.push(title);
      return new Response(JSON.stringify({cover:'https://img.example/'+encodeURIComponent(title)+'.jpg',alternates:[]}),{headers:{'Content-Type':'application/json'}})
    }
    if(loc.pathname.includes('/api/webnovels/browse')){
      const offset=Number(loc.searchParams.get('offset'))||0;
      const results=Array.from({length:36},(_,i)=>({title:'Webnovel '+(offset+i),mediaType:'webnovel'}));
      return new Response(JSON.stringify({results,total:99,hasMore:offset+36<99}),{headers:{'Content-Type':'application/json'}});
    }
    return new Response(JSON.stringify({results:[],cover:'',alternates:[],user:null}),{headers:{'Content-Type':'application/json'}});
  }
  state.me=null;state.view='home';state.search='';state.results=[];
  state.feed=[
   {id:1,mediaType:'anime',title:'Naruto',cover:'',user:{name:'a'}},
   {id:2,mediaType:'manga',title:'One Piece',cover:'',user:{name:'a'}},
   {id:3,mediaType:'film',title:'Spirited Away',cover:'',user:{name:'a'}},
   {id:4,mediaType:'tv',title:'The Mentalist',cover:'',user:{name:'a'}},
   {id:5,mediaType:'novel',title:'Dune',cover:'',user:{name:'a'}},
   {id:6,mediaType:'game',title:'Elden Ring',cover:'',user:{name:'a'}}
  ];
  render();
 }''')
 page.wait_for_function("() => document.querySelectorAll('#featuredMedia .niche-art img').length===6 && [...document.querySelectorAll('#featuredMedia .niche-art img')].every(x=>x.naturalWidth>0)",timeout=25000)
 print('PASS v48: homepage renders 6 recovered covers when all original logged-media cover URLs are empty',flush=True)
 page.wait_for_function("() => ['animanga','filmstv','books','discover'].every(k => [...document.querySelectorAll('#medium-showcase-'+k+' img')].some(x=>x.naturalWidth>0))",timeout=22000)
 print('PASS v48: all four homepage category tiles display real fetched images',flush=True)
 assert not errors,errors[:5]
 page.evaluate("() => { state.view='books';state.type='webnovel';state.search='';state.results=[];render(); }")
 page.wait_for_function("() => document.querySelectorAll('#mt-webnovel-browse button').length===36",timeout=8000)
 assert page.is_visible('#mt-webnovel-more')
 page.click('#mt-webnovel-more')
 page.wait_for_function("() => document.querySelectorAll('#mt-webnovel-browse button').length===72",timeout=5000)
 print('PASS v48: webnovel browse lists 36 titles per page and Load more works',flush=True)
 assert not errors,errors[:6]
 browser.close()

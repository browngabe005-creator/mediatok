from pathlib import Path
from playwright.sync_api import sync_playwright
h=Path(__file__).parents[1].joinpath('public/index.html').read_text().replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));","const path='';")
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1200,'height':900},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for item in ['localStorage','sessionStorage']:
  page.evaluate(f"Object.defineProperty(window,'{item}',{{value:{{getItem:()=>null,setItem:()=>{{}},removeItem:()=>{{}}}},configurable:true}})")
 page.set_content(h,wait_until='domcontentloaded')
 page.evaluate('''() => {
  window.fetch=async (url, options={})=>{
   const text=String(url);
   const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
   if(text.includes('/api/search/users'))return json({results:[{name:'mangafan',id:11,avatarUrl:''}]});
   if(text.includes('/api/search/v42?')){
    if(window.__catalogOffline)throw new TypeError('offline');
    await new Promise(r=>setTimeout(r,70));
    return json({results:[{key:'jikan:anime:1',title:'Naruto',mediaType:'anime',year:2002,cover:'https://cdn.myanimelist.net/naruto.jpg',coverFallbacks:[]},{key:'jikan:manga:2',title:'One Piece',mediaType:'manga',year:1997,cover:'https://cdn.myanimelist.net/onepiece.jpg'}],providerStatus:'ok'});
   }
   if(text.includes('/api/search/v42/cover'))return json({cover:'https://cdn.myanimelist.net/other.jpg',alternates:[]});
   return json({results:[]});
  };
  state.view='discover';state.type='all';state.search='';render();
 }''')
 page.locator('#globalSearchInput').fill('Naruto')
 page.evaluate('runGlobalSearch()')
 page.wait_for_timeout(180)
 titles=page.locator('.result-title').all_text_contents();assert 'Naruto' in titles and 'One Piece' in titles,titles
 src=page.locator('.result .cover').first.get_attribute('src');assert src == 'https://cdn.myanimelist.net/naruto.jpg',src
 retryUrl=page.evaluate("""() => {const im=document.createElement('img');im.dataset.coverOriginal='https://cdn.myanimelist.net/naruto.jpg';im.dataset.coverAlternates='[]';im.alt='Naruto';document.body.appendChild(im);mediaCoverError(im);return im.getAttribute('src')}""")
 assert '/api/search/v42/image?' in retryUrl, 'Cover did not try same-origin proxy after source error' 
 page.evaluate('window.__catalogOffline=true')
 page.evaluate("document.querySelector('#globalSearchInput').value='Naruto';searchMedia()")
 page.wait_for_timeout(150)
 assert 'Naruto' in page.locator('.result-title').all_text_contents()
 print('CACHE MESSAGE:',page.locator('#searchMessage').inner_text()); assert len(page.locator('.result-title').all_text_contents())>=1
 print('PASS browser v41: header search, mixed media results, proxy cover URLs, offline cache retention')
 # New scoped search uses same maintained endpoint.
 page.evaluate("state.type='manga';state.search='Naruto';document.querySelector('#globalSearchInput').value='Naruto';window.__catalogOffline=false;searchMedia()")
 page.wait_for_timeout(150)
 assert page.locator('.result-title').count()>=1
 assert not errors,errors
 print('PASS browser v41: scoped media and no browser page errors')
 browser.close()

from pathlib import Path
from playwright.sync_api import sync_playwright
import re
html_strip_link = lambda h: re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>', '', h)
html=Path(__file__).parents[1].joinpath('public/index.html').read_text().replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','').replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));","const path='';")
html=html_strip_link(html)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1280,'height':920},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='commit',timeout=9000)
 print("before wait",flush=True)
 page.wait_for_function("() => {try{return typeof $ === 'function'}catch{return false}}",timeout=10000)
 page.evaluate('''() => {
 window.__variant='legacy';window.__hit=[];
 window.fetch=async (url,opts={})=>{
   const s=String(url);window.__hit.push(s);
   const result=(value,status=200,content='application/json')=>new Response(content==='application/json'?JSON.stringify(value):String(value),{status,headers:{'Content-Type':content}});
   if(s.includes('/api/search/users'))return result({results:[]});
   if(s.includes('/api/search/media?'))return result('<html>Not found</html>',404,'text/html');
   if(s.includes('/api/search/v42?'))return result('<html>Not found</html>',404,'text/html');
   if(s.includes('/api/search/catalog?')){
       if(window.__variant==='offline')throw new Error('offline');
       return result({results:[{key:'jikan:anime:1',title:'Naruto',cover:'https://cdn.myanimelist.net/naruto.jpg',mediaType:'anime'}]});
   }
   if(s.includes('api.jikan.moe'))return result({data:[{mal_id:1,title:'Naruto',images:{jpg:{large_image_url:'https://cdn.myanimelist.net/naruto.jpg'}}}]});
   if(s.includes('graphql.anilist.co'))return result({errors:[{message:'limited'}]},429);
   if(s.includes('kitsu.io'))return result({data:[]});
   return result({results:[]});
 };
 state.view='discover';state.type='anime';state.search='';render();
 }''')
 page.locator('#globalSearchInput').fill('Naruto');page.evaluate('searchMedia()');
 page.wait_for_timeout(400)
 titles=page.locator('.result-title').all_text_contents();assert 'Naruto' in titles,titles
 hit=page.evaluate('window.__hit');assert any('/api/search/media?' in x for x in hit) and any('/api/search/v42?' in x for x in hit) and any('/api/search/catalog?' in x for x in hit),hit
 print('PASS browser: route fallback -> legacy JSON')
 page.evaluate('''() => {window.__variant='offline';state.search='Naruto';document.getElementById('globalSearchInput').value='Naruto';searchMedia()}''')
 page.wait_for_timeout(400)
 assert 'Naruto' in page.locator('.result-title').all_text_contents()
 print('PASS browser: cached titles remain during outage')
 page.evaluate('''() => {mediaSearchCache.clear();state.type='anime';state.search='Naruto';document.getElementById('globalSearchInput').value='Naruto';searchMedia()}''')
 page.wait_for_timeout(1200)
 assert 'Naruto' in page.locator('.result-title').all_text_contents()
 print('PASS browser: direct Jikan fallback after all Worker routes fail')
 next_url=page.evaluate("""() => {const img=document.createElement('img');img.dataset.coverOriginal='https://cdn.myanimelist.net/naruto.jpg';img.dataset.coverAlternates='[]';img.alt='Naruto';document.body.appendChild(img);mediaCoverError(img);return img.getAttribute('src')}""")
 assert next_url.startswith('/api/catalog-image?'),next_url
 print('PASS browser: original cover -> legacy media image proxy')
 assert not errors,errors
 b.close()

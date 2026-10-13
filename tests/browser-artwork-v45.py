from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,re
html=Path(__file__).resolve().parents[1].joinpath('public/index.html').read_text()
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));","const path='';")
png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9iV8KggAAAAASUVORK5CYII=')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=b.new_page(viewport={'width':1280,'height':900},service_workers='block')
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('https://cdn.myanimelist.net/**',lambda route:route.fulfill(body=png,content_type='image/png'))
 page.set_content(html,wait_until='commit',timeout=12000)
 page.wait_for_function("() => {try{return typeof searchMedia === 'function'}catch{return false}}",timeout=9000)
 page.evaluate('''() => {
  window.fetch=async (url)=>{
    const path=String(url);const result=(x)=>new Response(JSON.stringify(x),{headers:{'Content-Type':'application/json'}});
    if(path.includes('/api/search/users'))return result({results:[]});
    if(path.includes('/api/search/media/cover'))return result({cover:'https://cdn.myanimelist.net/v45-naruto.png',alternates:[]});
    if(path.includes('/api/search/media?'))return result({providerStatus:'local',results:[{key:'mediatok-seed:anime:naruto',mediaType:'anime',title:'Naruto',cover:'',subtitle:'Local'}]});
    return result({results:[]});
  };
  state.view='discover';state.type='anime';state.search='';render();
 }''')
 page.locator('#globalSearchInput').fill('Naruto')
 page.evaluate('searchMedia()')
 page.wait_for_function("() => document.querySelector('.result .cover') !== null",timeout=8000)
 assert 'Naruto' in page.locator('.result-title').first.inner_text()
 img=page.locator('.result img.cover').first
 assert img.get_attribute('src')=='https://cdn.myanimelist.net/v45-naruto.png'
 assert 'without-cover' not in page.locator('.result').first.get_attribute('class')
 assert img.count()==1
 # Profile cover recovery now applies to games and books too, not only manga.
 page.evaluate('''() => {const n=document.createElement('div');n.className='pf-img pf-empty';n.dataset.profileCoverMissing='1';n.dataset.mediaType='game';n.dataset.title='Elden Ring';document.body.appendChild(n);hydrateProfileCovers(document.body);}''')
 page.wait_for_function("() => [...document.querySelectorAll('img.pf-img')].some(i => i.alt==='Elden Ring')",timeout=8000)
 assert not errors,errors[:3]
 print('PASS v45 browser: blank offline index artwork hydrated, correct media title, preserved result actions')
 b.close()

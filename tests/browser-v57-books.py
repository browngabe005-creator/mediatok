from pathlib import Path
import re
from playwright.sync_api import sync_playwright
html=Path(__file__).resolve().parents[1].joinpath('public/index.html').read_text().replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html).replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));","const path='';")
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1250,'height':950},service_workers='block');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='commit')
 page.wait_for_function('typeof runDiscoverSearch==="function"')
 page.evaluate('''()=>{
 state.me={id:7,name:'Tester',stats:{},links:{},socials:{},favs:'[]'};
 state.view='discover';state.type='novel';state.search='';state.results=[];state.memberResults=[];
 window.fetch=async url=>{const x=String(url);
  if(x.includes('/api/search/users'))return new Response(JSON.stringify({results:[]}),{headers:{'Content-Type':'application/json'}});
  if(x.startsWith('/api/books/browse'))return new Response(JSON.stringify({results:[{key:'openlibrary:/works/1',mediaType:'novel',title:'A Theology Handbook',cover:'',creator:'A Scholar',year:'2020'}],hasMore:true,nextOffset:30,providerStatus:'ok'}),{headers:{'Content-Type':'application/json'}});
  return new Response(JSON.stringify({results:[],providerStatus:'empty'}),{headers:{'Content-Type':'application/json'}});
 };
 window.api=async x=>x.startsWith('/api/books/browse')?{results:[{key:'openlibrary:/works/2',mediaType:'novel',title:'Church History Studies',cover:'',year:'1990'}],hasMore:false,nextOffset:60}: x.startsWith('/api/profile')?{logs:[]} : {};
 window.cachedCoverDetails=async()=>({cover:'',alternates:[]});
 render();
 }''')
 page.locator('#discoverSearchInput').fill('theology')
 page.locator('.mt-discover-search button').click()
 page.wait_for_selector('.result-title:text("A Theology Handbook")',timeout=7000)
 assert page.locator('.mt-book-more button').count()==1
 page.locator('.mt-book-more button').click()
 page.wait_for_selector('.result-title:text("Church History Studies")',timeout=7000)
 assert page.locator('.result').count()==2
 assert page.locator('.mt-book-more button').count()==0
 print('PASS actual Discover input submits a book search; paginated results append without replacing first-page entries')
 assert not errors,errors
 b.close()

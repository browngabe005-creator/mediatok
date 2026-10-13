from playwright.sync_api import sync_playwright
from pathlib import Path
import json
h=Path(__file__).parents[1].joinpath('public/index.html').read_text()
# This is a DOM interaction test in an isolated browser document. The browser
# blocks network navigation; the pathname and network are stubbed, not live.
h=h.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));","const path='';")
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1200,'height':800},service_workers='block')
 page_errors=[];page.on('pageerror',lambda e:page_errors.append(str(e)))
 for item in ['localStorage','sessionStorage']:
  page.evaluate(f"Object.defineProperty(window,'{item}',{{value:{{getItem:()=>null,setItem:()=>{{}},removeItem:()=>{{}}}},configurable:true}})")
 page.set_content(h,wait_until='domcontentloaded')
 page.evaluate('''() => {
  window.fetch = async (url, opts) => {
   const text=String(url);
   const json=(data)=>new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}});
   if(text.includes('/api/search/users'))return json({results:[]});
   if(text.includes('/api/search/all')) {
    const events=[
      {event:'results',results:[{title:'Naruto',key:'jikan:anime:22',cover:'',mediaType:'anime',subtitle:'Anime'}]},
      {event:'results',results:[{title:'Naruto Manga',key:'jikan:manga:23',cover:'',mediaType:'manga',subtitle:'Manga'}]},
      {event:'done',providerStatus:'ok',results:[{title:'Naruto',key:'jikan:anime:22',cover:'',mediaType:'anime',subtitle:'Anime'},{title:'Naruto Manga',key:'jikan:manga:23',cover:'',mediaType:'manga',subtitle:'Manga'}]}
    ];
    return new Response(events.map(x=>JSON.stringify(x)).join('\\n')+'\\n',{status:200,headers:{'content-type':'application/x-ndjson'}});
   }
   if(text.includes('/api/search/catalog'))return json({results:[{title:'Naruto',key:'jikan:anime:22',cover:'',subtitle:'Anime'}]});
   return json({results:[]});
  }
 }''')
 page.evaluate("state.view='discover'; state.type='all'; state.search=''; render()")
 page.wait_for_timeout(250)
 assert page.locator('#globalSearchInput').count()==1,'header search missing'
 page.locator('#globalSearchInput').fill('naruto')
 page.evaluate('runGlobalSearch()')
 page.wait_for_timeout(350)
 titles=page.locator('.result-title').all_text_contents()
 print('all search titles',titles)
 assert 'Naruto' in titles and 'Naruto Manga' in titles
 page.evaluate("setType('anime')")
 page.wait_for_timeout(350)
 titles=page.locator('.result-title').all_text_contents()
 print('category search titles',titles)
 assert 'Naruto' in titles
 assert not page_errors,f'page errors {page_errors}'
 print('PASS browser DOM search UI: streaming results and scoped search')
 browser.close()

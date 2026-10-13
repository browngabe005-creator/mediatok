from pathlib import Path
from playwright.sync_api import sync_playwright
import re
html=Path(__file__).resolve().parents[1].joinpath('public/index.html').read_text()
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1400,'height':1000},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,wait_until='commit',timeout=16000)
 page.wait_for_function('() => typeof browseMoreWebnovels === "function"',timeout=15000)
 page.evaluate('''() => {
  window.__browseRequests=[];
  window.fetch=async input=>{
   const u=new URL(String(input),'https://mediatok.org/');
   if(u.pathname==='/api/webnovels/browse'){
    const offset=Number(u.searchParams.get('offset')||0),q=u.searchParams.get('q')||'';
    window.__browseRequests.push({offset,q});
    const total=q?73:12500;
    const results=Array.from({length:Math.max(0,Math.min(36,total-offset))},(_,i)=>({title:(q?'Matched Novel ':'Story ')+(offset+i),mediaType:'webnovel',creator:'Writer '+i,cover:''}));
    return new Response(JSON.stringify({results,total,hasMore:offset+36<total,source:'MediaTok catalog'}),{headers:{'content-type':'application/json'}});
   }
   return new Response(JSON.stringify({results:[],user:null}),{headers:{'content-type':'application/json'}});
  };
  state.me=null;state.view='books';state.type='webnovel';state.results=[];state.search='';render();
 }''')
 page.wait_for_function("() => document.querySelectorAll('#mt-webnovel-browse button').length === 36",timeout=10000)
 assert '12,500' in page.locator('#mt-webnovel-directory-status').inner_text()
 assert page.is_visible('#mt-webnovel-more')
 page.click('#mt-webnovel-more')
 page.wait_for_function("() => document.querySelectorAll('#mt-webnovel-browse button').length === 72",timeout=10000)
 page.fill('#mt-webnovel-filter','magic school')
 page.wait_for_function("() => document.querySelectorAll('#mt-webnovel-browse button').length === 36 && document.querySelector('#mt-webnovel-directory-status').textContent.includes('73 matching')",timeout=10000)
 assert page.evaluate("() => window.__browseRequests.at(-1).q")=='magic school'
 page.click('#mt-webnovel-more')
 page.wait_for_function("() => document.querySelectorAll('#mt-webnovel-browse button').length === 72",timeout=10000)
 assert not errors,errors
 print('PASS v49 browser: 12,500 live count, pagination, instant directory filter, filtered Load More')
 browser.close()

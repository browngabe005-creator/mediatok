from pathlib import Path
from playwright.sync_api import sync_playwright
import re,json
html=Path(__file__).resolve().parents[1].joinpath('public/index.html').read_text()
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
with sync_playwright() as p:
    b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=b.new_page(viewport={'width':1280,'height':880},service_workers='block')
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(html,wait_until='commit',timeout=18000)
    page.wait_for_function('() => typeof openMediaDetails === "function" && typeof applyTheme === "function"',timeout=9000)
    page.evaluate('''() => {
      window.fetch=async(input)=> new Response(JSON.stringify({directors:['Test Director'],authors:['Test Author'],creators:[],studios:['Test Studio'],crew:[{name:'Test Director',role:'Director'}],cast:[{name:'Test Actor',role:'Lead'}],voices:[]}),{headers:{'content-type':'application/json'}});
      state.results=[{key:'test:novel',title:'Sample Novel',mediaType:'novel',cover:'',creator:'Original Author',description:'This is a story about creative people.'}];
      applyTheme('dark');
      openMediaDetails(0);
    }''')
    immediately=page.locator('#mdCredits').inner_text()
    assert 'Original Author' in immediately,immediately
    css=page.evaluate('''() => {
      const cs=x=>getComputedStyle(document.querySelector(x));
      return {background:cs('body').backgroundColor,modal:cs('.media-detail-modal').backgroundColor,heading:cs('.md-heading h2').color,description:cs('.md-overview').color,credits:cs('.md-credit span').color}
    }''')
    assert css['background']=='rgb(8, 8, 8)',css
    assert css['modal']=='rgb(21, 21, 21)',css
    assert css['heading']=='rgb(245, 245, 245)',css
    assert css['description']=='rgb(245, 245, 245)',css
    page.wait_for_function("() => document.querySelector('#mdCredits')?.textContent.includes('Test Author')",timeout=5000)
    assert 'Test Actor' in page.locator('#mdPeople').inner_text()
    print('PASS v53: pure black body, charcoal modal, readable details text, immediate novel author, enriched author/cast',flush=True)
    page.evaluate("applyTheme('blue-black')")
    assert page.evaluate("getComputedStyle(document.body).backgroundColor")=='rgb(8, 8, 8)'
    page.evaluate("applyTheme('light')")
    assert page.evaluate("getComputedStyle(document.body).backgroundColor")!='rgb(8, 8, 8)'
    print('PASS v53: legacy blue-black selection also charcoal; light mode unchanged',flush=True)
    assert not errors,errors
    b.close()

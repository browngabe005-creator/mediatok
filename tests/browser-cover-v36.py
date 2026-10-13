from playwright.sync_api import sync_playwright
from pathlib import Path
h=Path(__file__).parents[1].joinpath('public/index.html').read_text().replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));","const path='';")
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
  page=browser.new_page(viewport={'width':1200,'height':850},service_workers='block')
  page.on('pageerror', lambda e: print('PAGE_ERROR',str(e)))
  for item in ['localStorage','sessionStorage']:
    page.evaluate(f"Object.defineProperty(window,'{item}',{{value:{{getItem:()=>null,setItem:()=>{{}},removeItem:()=>{{}}}},configurable:true}})")
  page.set_content(h,wait_until='domcontentloaded')
  page.evaluate('''() => {
    window.fetch=async (url)=>{
      const u=String(url);
      const data=u.includes('/api/search/cover') ? {cover:'https://cdn.myanimelist.net/other-manga.jpg',alternates:[]} : {results:[]};
      return new Response(JSON.stringify(data),{status:200,headers:{'content-type':'application/json'}})
    };
    // Disable actual images/network; the fallback handler is exercised directly.
    state.view='discover';state.type='manga';state.search='x';
    state.results=[{key:'broken:1',title:'One Piece',cover:'https://cdn.myanimelist.net/fail.jpg',mediaType:'manga'}];
    render();
  }''')
  assert page.locator('.result .cover').count()==1
  page.evaluate('''() => {
    const img=document.querySelector('.result .cover');
    // Force exhaustion of known alternatives, including the proxy, then call recovery.
    img.dataset.coverOriginal='https://cdn.myanimelist.net/fail.jpg';
    img.dataset.coverAlternates='[]';img.dataset.coverStep='2';
    mediaCoverError(img);
  }''')
  page.wait_for_timeout(180)
  output=page.locator('.result .cover').get_attribute('src')
  assert 'other-manga.jpg' in output,output
  # When another cover also fails, the UI should not show a fake poster.
  page.evaluate('''() => {
    const img=document.querySelector('.result .cover');img.dataset.coverStep='10';mediaCoverError(img);
  }''')
  assert page.locator('.result .cover').count()==0
  assert page.locator('.result-title').inner_text()=='One Piece'
  print('PASS cover error: alternate catalog lookup, final broken image disappears, title remains')
  browser.close()

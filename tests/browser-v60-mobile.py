from pathlib import Path
from playwright.sync_api import sync_playwright
import re,base64
root=Path(__file__).resolve().parents[1]
html=(root/'public/index.html').read_text()
css=(root/'public/mobile-v60.css').read_text()
html=html.replace('<link rel="stylesheet" href="/mobile-v60.css?v=60">','<style id="mtMobileTest">'+css+'</style>')
html=html.replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
# Blank URLs from page.set_content() represent localhost paths and are handled by simulated API.
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
html=html.replace("history.pushState({},'','/');", "").replace("history.pushState({},'', '/');", "")
# 1x1 pixel valid PNG
img='data:image/png;base64,'+base64.b64encode(bytes.fromhex('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000b49444154789c636000020000050001a5f645400000000049454e44ae426082')).decode()
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    for width in (375,390,428,760):
      page=browser.new_page(viewport={'width':width,'height':812},device_scale_factor=1,service_workers='block',is_mobile=True,has_touch=True)
      errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
      page.set_content(html,wait_until='commit',timeout=17000)
      page.wait_for_function('typeof mtMobileHome === "function" && typeof render === "function"')
      page.evaluate('''(img) => {
        api=async (path,opts={})=>{
          if(path.startsWith('/api/profile/'))return {user:state.me,logs:[{id:1,mediaType:'anime',title:'Steins Gate',status:'In progress',progress:12,cover:img,mediaKey:'anime:steinsgate',year:2011}]};
          if(path.startsWith('/api/search/'))return {results:[]};
          if(path==='/api/me')return {user:state.me};
          if(path==='/api/feed')return state.feed;
          if(path.startsWith('/api/leaderboard'))return [];
          if(path.startsWith('/api/notifications'))return {unread:0};
          return {ok:true,results:[]};
        };
        state.me={name:'alice',globalName:'Alice',id:1,stats:{anime:9,manga:5,film:3,total:17}};
        state.profile={...state.me,joined:Date.now(),followers:3};
        state.profileLogs=[{id:1,mediaType:'anime',title:'Steins Gate',status:'In progress',progress:12,cover:img,mediaKey:'anime:steinsgate',year:2011}];
        state.feed=[{id:2,title:'Cowboy Bebop',mediaType:'anime',cover:img,status:'Completed',user:{name:'bob'},updatedAt:Date.now()}];
        state.view='home';
        void render();
      }''',img)
      page.locator('.mt-mobile-dashboard').wait_for()
      assert page.locator('.mt-mobile-nav button').count()==5
      assert page.locator('.mt-mobile-media').count()>=2
      page.evaluate("() => {window.__mobilePosterClick=null;openSiteMediaDetails=(...args)=>{window.__mobilePosterClick=args}}")
      page.locator('#mtMobileContinue .mt-mobile-media').first.click()
      assert page.evaluate("window.__mobilePosterClick[1]")=='Steins Gate'
      for theme in ('light','dark','pink'):
        page.evaluate('(theme)=>applyTheme(theme)',theme)
        assert page.locator('.mt-mobile-hello h1').is_visible()
        assert page.locator('.mt-mobile-nav').is_visible()
      page.evaluate("()=>applyTheme('light')")
      assert page.locator('#mtMobileContinue .mt-mobile-media').count()==1
      assert page.locator('.mt-mobile-search-hero').is_visible()
      assert page.locator('.top .global-search').is_hidden()
      assert not page.evaluate("document.documentElement.scrollWidth > innerWidth + 3"),('home overflow',width)
      assert page.locator('.layout > .rightcol').count()==0
      assert page.locator('.mt-mobile-profile-btn').is_visible()
      # Discover: search really reachable and category rail scrollable.
      page.locator('.mt-mobile-nav button[data-view="discover"]').click()
      page.locator('#discoverSearchInput').wait_for(state='visible',timeout=3500)
      assert page.locator('.mt-mobile-dashboard').count()==0
      assert page.locator('.mt-mobile-nav button[data-view="discover"]').get_attribute('class') is not None
      assert not page.evaluate("document.documentElement.scrollWidth > innerWidth + 3"),('discover overflow',width)
      # Mobile My List preserves existing profile functionality.
      page.evaluate("() => {state.view='profile';state.profile={...state.me,joined:Date.now(),followers:3};state.profileTab='overview';render()}")
      page.locator('.pf-page .pf-hero').wait_for()
      assert page.locator('.pf-page .pf-tabs').count()==1
      assert not page.evaluate("document.documentElement.scrollWidth > innerWidth + 3"),('profile overflow',width)
      # More opens a real sheet and includes hidden secondary functionality.
      page.locator('#mtMobileMore').click()
      assert page.locator('#mobileMenuLayer').is_visible()
      assert 'Leaderboard' in page.locator('#mobileMenuContent').inner_text()
      assert 'Recent activity' in page.locator('#mobileMenuContent').inner_text()
      page.locator('.mobile-menu-close').click()
      assert page.locator('#mobileMenuLayer').is_hidden()
      assert not errors,(width,errors)
      print(f'PASS mobile {width}px: independent Home, continue rail, 5-tab nav, discover search, profile, More sheet, no horizontal overflow')
      page.close()
    # Verify desktop still uses original dashboard/navigation.
    page=browser.new_page(viewport={'width':1440,'height':900},service_workers='block')
    page.set_content(html,wait_until='commit',timeout=17000)
    page.wait_for_function('typeof render === "function"')
    page.evaluate("() => {api=async()=>[];state.me=null;state.feed=[];state.view='home';render()}")
    assert page.locator('.welcome').is_visible()
    assert page.locator('.mobile-bottom').is_hidden()
    assert page.locator('.topnav').is_visible()
    assert page.locator('.layout > .side').is_visible()
    print('PASS desktop 1440px: original 3-column home and top navigation unchanged')
    browser.close()

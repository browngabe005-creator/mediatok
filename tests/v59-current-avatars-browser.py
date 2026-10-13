from pathlib import Path
import re,base64
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'public/index.html').read_text().replace('<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>','')
html=re.sub(r'<link[^>]+fonts.googleapis.com[^>]*>','',html)
html=html.replace("const path=decodeURIComponent(location.pathname.replace(/^\\/+|\\/+$/g,''));", "const path='';")
img='data:image/png;base64,'+base64.b64encode(bytes.fromhex('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000b49444154789c636000020000050001a5f645400000000049454e44ae426082')).decode()
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=browser.new_page(viewport={'width':1780,'height':900},service_workers='block')
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.route('https://broken.example/**', lambda route:route.fulfill(status=404,body='not found'))
    page.set_content(html,wait_until='commit',timeout=17000)
    page.wait_for_function('typeof profilePage === "function" && typeof renderFeed === "function"')
    page.evaluate('''(img) => {
      const logs=Array.from({length:11},(_,i)=>({id:i+1,mediaKey:'anime:'+i,mediaType:'anime',title:'Currently item '+i,cover:'',year:'2025',status:'In progress',progress:i*3,rating:8,updatedAt:Date.now()-i*1000}));
      api=async()=>({ok:true,results:[]});
      state.me={id:23,name:'alice',globalName:'Alice',stats:{total:11},role:'member',socials:{}};
      state.profile={...state.me,followers:2,joined:Date.now()};
      state.profileLogs=logs;
      state.feed=Array.from({length:4},(_,i)=>({id:i+91,title:'Logged title '+i,mediaType:'anime',status:'Completed',updatedAt:Date.now()-i*100000,year:2024,user:{name:'bob',avatar:'https://broken.example/user.png',avatarFallback:img}}));
      state.view='profile';state.profileTab='overview';
      document.querySelector('#app').innerHTML=shell(profilePage(),false);
    }''',img)
    assert page.locator('.pf-current-panel').count()==1
    assert page.locator('.pf-current-panel .mt-current-item').count()==4
    assert page.locator('.pf-global-activity').count()==1
    dims=page.evaluate('''() => {
       const a=document.querySelector('.pf-current-panel'), b=document.querySelector('.pf-global-activity'),items=document.querySelector('.mt-current-items');
       return {a:Math.round(a.getBoundingClientRect().height),b:Math.round(b.getBoundingClientRect().height),overflow:getComputedStyle(items).overflowY,listHeight:items.scrollHeight,clientHeight:items.clientHeight,footer:!!a.querySelector('footer button')};
    }''')
    assert abs(dims['a']-dims['b'])<=1,dims
    assert dims['overflow']!='auto' and dims['overflow']!='scroll',dims
    assert dims['listHeight']<=dims['clientHeight']+3,dims
    assert dims['footer'],dims
    page.locator('.pf-current-panel footer button').click()
    assert page.locator('.mt-current-full .mt-current-item').count()==11
    page.evaluate('closeModal()')
    avatar=page.locator('.pf-global-activity .activity-top img.avatar').first
    avatar.wait_for(state='attached')
    page.wait_for_function("() => document.querySelector('.pf-global-activity .activity-top img.avatar')?.getAttribute('data-attempted-fallback')==='yes'",timeout=8000)
    assert avatar.get_attribute('src')==img
    # Global Search members use identical fallback, so broken uploads must not blank the image.
    page.evaluate('''(img) => {state.memberResults=[{name:'bob',globalName:'Bob',avatar:'https://broken.example/user.png',avatarFallback:img}];document.querySelector('#app').innerHTML=renderMemberResults()}''',img)
    member=page.locator('.member-result img.avatar').first
    page.wait_for_function("() => document.querySelector('.member-result img.avatar')?.getAttribute('data-attempted-fallback')==='yes'",timeout=8000)
    assert member.get_attribute('src')==img
    assert not errors,errors
    print('PASS v59 browser: matching-height current/global panels, 4 non-scroll preview + view-all; activity and member-search PFP fallback')
    browser.close()

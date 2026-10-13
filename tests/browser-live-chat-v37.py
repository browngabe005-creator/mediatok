from playwright.sync_api import sync_playwright
from pathlib import Path
p=Path(__file__).resolve().parents[1]
h=p.joinpath('public/index.html').read_text()
start=h.index('// A separate WebSocket room:')
end=h.index('async function forumPage(){',start)
live_js=h[start:end]
setup_js='''
const state={view:'forum',me:{id:1,name:'testperson',role:'member'}};
const $=(selector)=>document.querySelector(selector);
const esc=(x)=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const initials=(x)=>String(x||'?').slice(0,2);
const userLink=(x)=>'/'+encodeURIComponent(x);
const avatar=(u,size)=>`<span class="avatar" style="width:${size}px;height:${size}px">${esc(initials(u.name))}</span>`;
function toast(x){window.__toasts.push(x)}
window.__toasts=[];window.__wsEvents=[];
class FakeWs {
 static OPEN=1;static CONNECTING=0;static CLOSED=3;
 constructor(url){this.url=url;this.readyState=0;window.__ws=this;setTimeout(()=>{
  this.readyState=1;this.onopen?.();this.onmessage?.({data:JSON.stringify({type:'snapshot',hour:Math.floor(Date.now()/3600000),nextReset:(Math.floor(Date.now()/3600000)+1)*3600000,online:2,messages:[{id:'00000000-0000-0000-0000-000000000001',user_id:'2',author:'anotherUser',avatar:'',role:'member',body:'hi everyone',image_id:null,created_at:Date.now()}]})});
 },10)}
 send(wire){const pkt=JSON.parse(wire);window.__wsEvents.push(pkt);if(pkt.type==='send')this.onmessage?.({data:JSON.stringify({type:'message',message:{id:'00000000-0000-0000-0000-000000000999',user_id:'1',author:'testperson',avatar:'',role:'member',body:pkt.body,image_id:pkt.imageId,created_at:Date.now()}})});}
 close(){this.readyState=3;this.onclose?.({});}
}
window.WebSocket=FakeWs;
window.fetch=async()=>new Response(JSON.stringify({imageId:'00000000-0000-0000-0000-000000000222'}),{status:200,headers:{'content-type':'application/json'}});
'''
with sync_playwright() as pwt:
 browser=pwt.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for width in (1200,390):
  page=browser.new_page(viewport={'width':width,'height':800})
  errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body></body></html>')
  page.add_script_tag(content=setup_js+'\n'+live_js+'\ndocument.body.innerHTML=liveForumChatMarkup();forumLiveConnect();')
  page.locator('.mt-live-text').first.wait_for(timeout=3000)
  assert page.locator('.mt-live-text').first.inner_text()=='hi everyone'
  assert page.locator('#mtLiveOnline').inner_text()=='2 online'
  # Quote a message and send a proper reply reference.
  page.locator('.mt-live-action').first.click()
  assert page.locator('#mtLiveReplyPreview').is_visible()
  assert 'anotherUser' in page.locator('#mtLiveReplyPreview').inner_text()
  page.locator('#mtLiveInput').fill('reply from me')
  page.locator('#mtLiveSend').click()
  assert page.evaluate('window.__wsEvents.some(x=>x.type==="send" && x.replyTo==="00000000-0000-0000-0000-000000000001")')
  assert not page.locator('#mtLiveReplyPreview').is_visible()
  # Emoji composer and quick reaction send the intended WebSocket payloads.
  page.locator('.mt-live-emoji-trigger').click()
  assert page.locator('#mtLiveEmojiPicker').is_visible()
  page.locator('#mtLiveEmojiPicker button').first.click()
  assert '😀' in page.locator('#mtLiveInput').input_value()
  page.locator('.mt-live-action').filter(has_text='React').first.click()
  assert page.evaluate('window.__wsEvents.some(x=>x.type==="react" && x.emoji==="❤️")')
  # @ mention picker suggests authors from current chat.
  page.locator('#mtLiveInput').fill('@ano')
  assert page.locator('#mtLiveMentionPopup').is_visible()
  page.locator('#mtLiveMentionPopup button').first.click()
  assert '@anotherUser ' in page.locator('#mtLiveInput').input_value()

  page.locator('#mtLiveInput').fill('hello room')
  page.locator('#mtLiveInput').press('Enter')
  page.wait_for_timeout(80)
  assert page.locator('.mt-live-text').count()>=2
  assert page.evaluate('window.__wsEvents.some(x=>x.type==="send" && x.body==="hello room")')
  page.evaluate("forumLiveUpload=new File([new Uint8Array([137,80,78,71])],'tiny.png',{type:'image/png'})")
  page.locator('#mtLiveInput').fill('image attached')
  page.locator('#mtLiveSend').click()
  page.wait_for_timeout(120)
  assert page.evaluate('window.__wsEvents.some(x=>x.type==="send" && x.imageId==="00000000-0000-0000-0000-000000000222")')
  assert page.locator('#mtLiveCountdown').inner_text().startswith('Resets in')
  assert not errors,errors
  page.evaluate('forumLiveStop()')
  print(f'PASS v37 browser: live chat, enter to send, image flow ({width}px)')
  page.close()
 browser.close()

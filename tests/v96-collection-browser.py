# Requires a static server for public/ on port 8765 and Python Playwright.
# All account, feed, import and profile APIs use local test fixtures.
import json, os
from playwright.sync_api import sync_playwright
user={'id':1,'name':'alice','globalName':'Alice','socials':{'profileLayout':'future'},'links':{},'stats':{},'accent':'#bb99aa','shape':'circle'}
logs=[{'id':i,'mediaType':['anime','film','game'][i%3],'mediaKey':f'test:{i}','title':f'Title {i}','status':'Planning' if i<20 else 'Completed','rating':8,'user':user,'updatedAt':i} for i in range(137)]
posts=[]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium')
 page=b.new_page(viewport={'width':1440,'height':900},service_workers='block')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 def route(r):
  path=r.request.url.split('/api/')[1]
  data={}
  if path=='me':data={'user':user}
  elif path.startswith('logs?'):data=logs
  elif path=='following':data={'users':[{'id':2,'name':'bob','global_name':'Bob'}]}
  elif path.startswith('feed'):data=[]
  elif path.startswith('profile/alice'):data={'user':user,'logs':logs,'users':[]}
  elif path=='profile' and r.request.method=='POST':
   body=r.request.post_data_json;posts.append(body);user.update(body);data={'user':user}
  elif path=='import/library':
   body=r.request.post_data_json;posts.append(body);logs.append({'id':138,'mediaType':'novel','title':'Imported Book','status':'Planning'});data={'imported':1,'skipped':0}
  elif path.startswith('search/users'):data={'users':[]}
  r.fulfill(json=data)
 page.route('**/api/**',route)
 page.route('https://**',lambda r:r.abort())
 page.add_init_script("localStorage.setItem('mt_site_skin','passport')")
 page.goto(os.environ.get('MEDIATOK_TEST_URL','http://127.0.0.1:8765/'),wait_until='domcontentloaded')
 page.wait_for_selector('.pp95-hub-summary')
 assert page.locator('.pp95-hub-summary b').all_text_contents()==['137','117','20']
 page.wait_for_selector('#ppCircleMembers a')
 assert page.locator('#ppCircleMembers .pp-circle-member > span:last-child').inner_text()=='Bob'
 assert page.locator('.pp-rail').bounding_box()['width']==68
 for el in page.locator('.pp-rail-links .pp-rail-button').all(): assert el.bounding_box()['height']==52
 page.locator('.pp-rail-links [aria-label="Library"]').click()
 page.wait_for_selector('.pp-library-card')
 assert page.locator('.pp-library-card').count()==137
 page.locator('#ppLibrarySearch').fill('Title 136')
 assert page.locator('.pp-library-card').count()==1
 page.locator('#ppLibrarySearch').fill('')
 page.locator('.pp-library .pp-pill').click()
 page.wait_for_selector('[data-p="accounts"]:visible')
 page.locator('#goodreadsLibraryFile').set_input_files({'name':'books.csv','mimeType':'text/csv','buffer':b'Title,Author,Exclusive Shelf\nImported Book,Author,to-read\n'})
 page.locator('button[onclick="previewLibraryImport(\'goodreads\')"]').click()
 page.wait_for_selector('#mtLibraryImportConfirm')
 page.locator('#mtLibraryImportConfirm').click()
 page.wait_for_function("document.querySelector('#mtLibraryImportPreview').textContent.includes('Import complete')")
 page.evaluate('closeModal()')
 page.wait_for_function("document.querySelectorAll('.pp-library-card').length===138")
 page.evaluate("history.pushState({},'', '/');state.profile=state.me;state.profileLogs="+json.dumps(logs)+";state.view='profile';render()")
 page.locator('.mt-ref-future-head-actions [aria-label="Change profile layout"]').click()
 page.wait_for_selector('[data-p="layout"]:visible')
 page.locator('[data-layout="anime"]').click()
 page.locator('button[onclick="saveProfile()"]').click()
 page.wait_for_selector('.mt-layout-anime')
 assert user['socials']['profileLayout']=='anime'
 assert page.evaluate("localStorage.getItem('mt_site_skin')")=='passport'
 assert any('service' in x and x['service']=='goodreads' for x in posts)
 page.evaluate("goView('feed')")
 page.wait_for_selector('.pp95-circle-feed')
 page.locator('button[onclick="setFeedMode(\'following\')"]').click()
 page.wait_for_function("state.feedMode==='following'")
 page.evaluate('refreshFeed()')
 assert page.evaluate('state.feedMode')=='following'
 page.evaluate("goView('library')")
 page.wait_for_selector('.pp-library-card')
 page.screenshot(path='/tmp/collection-desktop.png')
 page.set_viewport_size({'width':390,'height':844})
 page.screenshot(path='/tmp/collection-mobile.png')
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.evaluate("state.me.socials.profileLayout='future';state.profile=state.me;state.profileLogs="+json.dumps(logs)+";state.view='profile';render()")
 page.wait_for_selector('.mt-layout-future')
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.screenshot(path='/tmp/collection-profile-mobile.png')
 page.locator('.mt-ref-future-head-actions [aria-label="Change profile layout"]').click()
 page.locator('[data-layout="original"]').click()
 page.locator('button[onclick="saveProfile()"]').click()
 page.wait_for_function("state.me.socials.profileLayout==='original'")
 assert not errors,errors
 print('PASS: 137 titles and all planning counts, followed circle, filters, CSV import and refreshed 138 titles, saved profile layout, independent site style, following feed, 68px/52px rail, mobile overflow, no page errors')
 b.close()

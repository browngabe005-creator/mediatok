import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('Passport routes use dedicated pages and media details',()=>{
 const index=read('public/index.html'), passport=read('public/passport-v95.js');
 assert.match(index,/mtPassportOpenDetails\(i\)/);
 assert.match(index,/state\.view==='people'&&document\.documentElement\.dataset\.siteSkin==='passport'/);
 assert.match(index,/mtPassportFeedPage\(\)/);
 assert.match(index,/mtPassportSyncHub\(\)/);
 for(const key of ['mtPassportStashDirectory','mtPassportStashDetail','mtPassportOpenDetails','mtPassportDetailsTab','mtPassportSearchPeople','mtPassportLibrarySummary','mtPassportCompareUser'])assert.ok(passport.includes(key),key);
 assert.match(passport,/\/api\/search\/users\?q=/);
 assert.match(passport,/\/api\/logs\?user=/);
 assert.match(passport,/saveDetailProgress\(\)/);
 assert.match(passport,/mtOpenSaveToListFromDetails\(\)/);
});
test('Site styles remain local; profile layouts not replaced',()=>{
 const index=read('public/index.html');
 assert.match(index,/localStorage\.setItem\('mt_site_skin'/);
 for(const fn of ['function profilePage(){','function mtAnimeProfilePage(u)','function mtFutureProfilePage(u)'])assert.ok(index.includes(fn),fn);
 const css=read('public/passport-v95.css');
 assert.match(css,/data-profile-active="true"/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
test('v95 pre-cache and health version match',()=>{
 const sw=read('public/service-worker.js'),worker=read('src/worker.js');
 assert.match(sw,/passport-v95\.js/);assert.match(sw,/passport-v95\.css/);
 assert.match(sw,/mediatok-v95/);assert.match(worker,/version:"v95"/);
});

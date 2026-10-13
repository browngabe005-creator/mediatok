import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('Passport layout is an independent per-browser site style',()=>{
 const html=read('public/index.html');
 const js=read('public/site-layouts-v94.js');
 const css=read('public/site-layouts-v94.css');
 assert.match(html,/mtSiteSkinValues=\['default','anilist','passport'\]/);
 assert.match(html,/localStorage\.setItem\('mt_site_skin'/);
 assert.match(html,/mtPassportDiscoverPage\(\)/);
 assert.match(html,/mtPassportLibraryPage\(\)/);
 assert.match(html,/mtSkinHomePage\(\)/);
 for(const required of ['mtSiteShell','mtPassportDiscoverPage','mtPassportLibraryPage','mtPassportLoadLibrary','mtPassportFilterLibrary','mtSkinHomePage'])assert.ok(js.includes(required),required);
 assert.match(js,/api\('\/api\/logs\?user='/);
 assert.match(css,/data-profile-active="true"/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(html,/function profilePage\(\)/);
 assert.match(html,/function mtAnimeProfilePage\(u\)/);
 assert.match(html,/function mtFutureProfilePage\(u\)/);
});
test('v94 assets precached and health updated',()=>{
 const sw=read('public/service-worker.js'),worker=read('src/worker.js');
 assert.match(sw,/site-layouts-v94\.js/);
 assert.match(sw,/site-layouts-v94\.css/);
 assert.match(sw,/mediatok-v95/);
 assert.match(worker,/version:"v95"/);
});

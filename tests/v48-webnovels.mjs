import assert from 'node:assert/strict';
import {catalogRoute} from '../src/catalog-v41.js';
import {seedTitles} from '../src/local-seed-catalog.js';
import {readFileSync} from 'node:fs';
const workerSource=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8').replace(/^import \{ catalogRoute, pruneCatalogCache \} from '\.\/catalog-v41\.js';\s*/, 'const catalogRoute=globalThis.__mediatokCatalogRoute;').replace("export { ForumLiveRoom } from './live-chat.js';", '');
globalThis.__mediatokCatalogRoute=catalogRoute;
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64'));
const oldFetch=globalThis.fetch;
globalThis.fetch=async()=>{throw Error('All external catalogs offline')};
const index=seedTitles.filter(row=>row.mediaType==='webnovel');
assert(index.length>=90,'webnovel directory should offer dozens of entries');
assert.equal(new Set(index.map(x=>x.title.toLowerCase().replaceAll('’',"'"))).size,index.length,'deduplicated directory');
async function get(path){const r=await catalogRoute(new Request('https://mediatok.org'+path),{},null);assert(r,'route should be implemented');assert.equal(r.status,200);return r.json();}
const viaWorker=await worker.fetch(new Request('https://mediatok.org/api/webnovels/browse?offset=0&limit=36'),{DB:{prepare(){throw Error('DB not needed for browse')}},ASSETS:{fetch:()=>new Response('SPA')}});
assert.equal(viaWorker.status,200,'Worker must dispatch browse endpoint, not return HTML');
assert.equal((await viaWorker.json()).results.length,36);
const a=await get('/api/webnovels/browse?offset=0&limit=36');assert.equal(a.results.length,36);assert(a.hasMore);assert(a.total>=90);
const b=await get('/api/webnovels/browse?offset=36&limit=36');assert.equal(b.results.length,36);assert(b.results[0].title!==a.results[0].title);
const c=await get('/api/webnovels/browse?offset=72&limit=36');assert(c.results.length>0);
for(const [q,title] of [['worm','Worm'],['wandering inn','The Wandering Inn'],['lord of the mysteries','Lord of the Mysteries'],['shadow slave','Shadow Slave'],['cultivation chat','Cultivation Chat Group'],['reverend insanity','Reverend Insanity']]){
 const data=await get('/api/search/media?type=webnovel&q='+encodeURIComponent(q));
 assert(data.results.some(r=>r.title===title),`webnovel ${title} available offline`);
}
console.log('PASS v48: ',index.length,'webnovel titles; browse pagination and offline search work with all external providers down');
globalThis.fetch=oldFetch;

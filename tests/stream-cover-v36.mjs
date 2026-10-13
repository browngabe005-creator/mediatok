import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const workerSource=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8').replace(/^export \{ ForumLiveRoom \} from '\.\/live-chat\.js';\s*/,'');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64'));
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const calls=[];
globalThis.fetch=async (url, options={})=>{
 const u=String(url);calls.push(u);
 if(u.includes('/api.jikan.moe/v4/manga')){await sleep(100);return reply({data:[{mal_id:5,title:'One Piece',images:{jpg:{large_image_url:'https://cdn.myanimelist.net/images/manga/5.jpg'},webp:{large_image_url:'https://cdn.myanimelist.net/images/manga/5.webp'}}}]})}
 if(u.includes('/api.jikan.moe/v4/anime')){await sleep(120);return reply({data:[{mal_id:6,title:'Naruto',images:{jpg:{large_image_url:'https://cdn.myanimelist.net/images/anime/6.jpg'}}}]})}
 if(u.includes('graphql.anilist.co')){await sleep(1500);return reply({data:{Page:{media:[]},a:{media:[]},m:{media:[]}}})}
 if(u.includes('kitsu.io')){await sleep(1500);return reply({data:[]})}
 if(u.includes('store.steampowered.com'))return reply({items:[{id:123,name:'Elden Ring',tiny_image:'https://shared.akamai.steamstatic.com/store_item_assets/123.jpg'}]});
 if(u.includes('openlibrary.org/search.json'))return reply({docs:[{title:'Dune',cover_i:777}]});
 return reply({items:[],docs:[],data:[],results:[]});
};
const env={DB:{prepare(){return{bind(){return this},async first(){return null},async all(){return {results:[]}}}}},ASSETS:{fetch(){return reply({site:true})}}};
// Existing JSON scoped catalog still supported (no breaking the old interface).
const jsonResponse=await worker.fetch(new Request('https://mediatok.org/api/search/catalog?type=manga&q=One%20Piece'),env);
assert.equal(jsonResponse.status,200);
assert.equal((await jsonResponse.json()).results[0].title,'One Piece');
// NDJSON scoped stream yields results before the late AniList API responds.
const start=performance.now();
const resp=await worker.fetch(new Request('https://mediatok.org/api/search/catalog?type=manga&q=One%20Piece&stream=1'),env);
assert.match(resp.headers.get('content-type'),/ndjson/);
let buf='',firstResult=Infinity,received=[];
for await(const chunk of resp.body){buf+=new TextDecoder().decode(chunk);const lines=buf.split('\n');buf=lines.pop();for(const line of lines){if(!line)continue;const evt=JSON.parse(line);received.push(evt);if(evt.event==='results'&&firstResult===Infinity)firstResult=performance.now()-start;}}
assert.ok(firstResult<500,'first scoped batch was not fast: '+firstResult);
assert.ok(received.some(x=>x.event==='done'));
assert.ok(received.some(x=>x.event==='results'&&x.results.some(r=>r.title==='One Piece')));
console.log('PASS scoped progressive search first result',Math.round(firstResult),'ms; late AniList 1500ms');
const cover=await worker.fetch(new Request('https://mediatok.org/api/search/cover?type=manga&q=One%20Piece'),env);
assert.equal(cover.status,200);
const c=await cover.json();assert.match(c.cover,/5\.jpg/);assert.match(c.alternates[0],/5\.webp/);
const wrong=await worker.fetch(new Request('https://mediatok.org/api/search/cover?type=manga&q=Not%20One%20Piece'),env);
assert.equal((await wrong.json()).cover,'','do not incorrectly use covers from near-title matches');
const game=await worker.fetch(new Request('https://mediatok.org/api/search/cover?type=game&q=Elden%20Ring'),env);
assert.match((await game.json()).cover,/123\.jpg/);
const book=await worker.fetch(new Request('https://mediatok.org/api/search/cover?type=novel&q=Dune'),env);
assert.match((await book.json()).cover,/777-M\.jpg/);
console.log('PASS exact-title manga, game, book cover lookup and wrong-title rejection');

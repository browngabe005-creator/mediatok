import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const workerSource=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8').replace(/^export \{ ForumLiveRoom \} from '\.\/live-chat\.js';\s*/,'');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64'));
const reply=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:{'content-type':'application/json'}});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let calls=0;
globalThis.fetch=async(url,options={})=>{
 const u=String(url);calls++;
 if(u.includes('api.jikan.moe/v4/anime')){await sleep(120);return reply({data:[{mal_id:22,title:'Naruto',images:{jpg:{large_image_url:'https://cdn.myanimelist.net/naruto.jpg'}}}]});}
 if(u.includes('api.jikan.moe/v4/manga')){await sleep(170);return reply({data:[{mal_id:23,title:'Naruto Manga',images:{jpg:{large_image_url:'https://cdn.myanimelist.net/naruto-manga.jpg'}}}]});}
 if(u.includes('graphql.anilist.co')){await sleep(1700);return reply({data:{Page:{media:[]},a:{media:[]},m:{media:[]}}});}
 if(u.includes('store.steampowered.com')){await sleep(320);return reply({items:[{id:24,name:'Naruto Storm',type:'app',tiny_image:'https://shared.akamai.steamstatic.com/naruto.jpg'}]});}
 if(u.includes('api.tvmaze.com')){await sleep(200);return reply([]);}
 if(u.includes('itunes.apple.com')){await sleep(250);return reply({results:[]});}
 if(u.includes('kitsu.io')){await sleep(2400);return reply({data:[]});}
 await sleep(2000);return reply({items:[],docs:[],data:[],results:[]});
};
const env={DB:{prepare(){return{bind(){return this},async first(){return null},async all(){return {results:[]}}}}},ASSETS:{fetch(){return reply({})}}};
const start=performance.now();
const stream=await worker.fetch(new Request('https://mediatok.org/api/search/all?stream=1&q=naruto'),env);
assert.equal(stream.status,200);assert.match(stream.headers.get('content-type'),/ndjson/);
const reader=stream.body.getReader();let combined='',firstMs=Infinity;
for(;;){const {done,value}=await reader.read();if(done)break;combined+=new TextDecoder().decode(value);if(combined.includes('"event":"results"')&&firstMs===Infinity)firstMs=performance.now()-start;}
const events=combined.trim().split('\n').map(JSON.parse);
assert.ok(firstMs<700,`first streaming results after ${firstMs}ms`);
assert.ok(events.some(x=>x.event==='results'&&x.results.some(r=>r.title==='Naruto')));
assert.ok(events.some(x=>x.event==='done'));
console.log(`PASS all-media stream first visible results in ${Math.round(firstMs)}ms (slow AniList 1700ms, Kitsu 2400ms)`);
const catStart=performance.now();
const cat=await worker.fetch(new Request('https://mediatok.org/api/search/catalog?type=anime&q=naruto'),env);
const catTime=performance.now()-catStart;
assert.equal(cat.status,200);const catData=await cat.json();
assert.ok(catData.results.some(r=>r.title==='Naruto'));
assert.ok(catTime<750,`scoped anime took ${catTime}ms`);
console.log(`PASS anime category responded in ${Math.round(catTime)}ms without waiting 1700ms AniList`);

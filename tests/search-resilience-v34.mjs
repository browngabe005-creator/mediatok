import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const workerSource=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8').replace(/^export \{ ForumLiveRoom \} from '\.\/live-chat\.js';\s*/,'');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64'));
const json=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:{'Content-Type':'application/json'}});
const original=globalThis.fetch;
let fallbackCalls=0;
globalThis.fetch=async url=>{
 const target=String(url);
 if(target.includes('graphql.anilist.co'))return json({errors:[{message:'rate limited'}]},429);
 if(target.includes('api.jikan.moe/v4/anime')){fallbackCalls++;return json({data:[{mal_id:20,title:'Naruto',images:{jpg:{large_image_url:'https://cdn.myanimelist.net/images/anime/cover.jpg'}},year:2002}]});}
 if(target.includes('api.jikan.moe/v4/manga'))return json({data:[]});
 if(target.includes('kitsu.io'))return json({data:[]});
 if(target.includes('store.steampowered.com'))return json({items:[]});
 if(target.includes('tvmaze.com'))return json([]);
 if(target.includes('itunes.apple.com'))return json({results:[]});
 if(target.includes('openlibrary.org'))return json({docs:[]});
 if(target.includes('googleapis.com'))return json({items:[]});
 if(target.includes('api.vndb.org'))return json({results:[]});
 return json({error:'unavailable'},503);
};
const env={DB:{prepare(sql){return{bind(){return this},async first(){return null},async all(){if(sql.includes('avatar_url'))throw Error('D1_ERROR: no such column: avatar_url');return {results:[{id:1,name:'narutofan',global_name:'Naruto Fan',avc:'',role:'member'}]}}}}},ASSETS:{fetch(){return json({ok:true})}}};
async function request(path){const r=await worker.fetch(new Request('https://mediatok.org'+path),env);return {status:r.status,data:await r.json()}}
let out=await request('/api/search/all?q=Naruto');
assert.equal(out.status,200);
assert.ok(out.data.results.some(r=>r.title==='Naruto'&&r.mediaType==='anime'),'Jikan should cover AniList outage');
assert.ok(fallbackCalls>0);
out=await request('/api/search/users?q=naruto');
assert.equal(out.status,200);assert.equal(out.data.results[0].name,'narutofan');
const badImage=await worker.fetch(new Request('https://mediatok.org/api/catalog-image?url='+encodeURIComponent('https://evil.example/internal.png')),env);
assert.equal(badImage.status,403,'proxy must reject untrusted hosts');
const wrongImage=await worker.fetch(new Request('https://mediatok.org/api/catalog-image?url='+encodeURIComponent('http://cdn.myanimelist.net/test.jpg')),env);
assert.equal(wrongImage.status,403,'proxy must reject HTTP');
globalThis.fetch=original;
console.log('PASS AniList outage Jikan fallback; legacy user column fallback; restricted image proxy');

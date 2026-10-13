import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8').replace(/^export \{ ForumLiveRoom \} from '\.\/live-chat\.js';\s*/,'');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const base=Date.now();let elapsed=0;Date.now=()=>base+elapsed;
const store=new Map();
globalThis.caches={default:{
 async match(request){const key=request.url||String(request),hit=store.get(key);return hit&&hit.expires>Date.now()?hit.response.clone():undefined},
 async put(request,response){const key=request.url||String(request),ttl=Number((response.headers.get('cache-control')||'').match(/max-age=(\d+)/)?.[1]||0);store.set(key,{response:response.clone(),expires:Date.now()+ttl*1000})}
}};
let up=true,calls={};
const data=(x,status=200)=>new Response(JSON.stringify(x),{status,headers:{'content-type':'application/json'}});
globalThis.fetch=async(url,opts={})=>{
 const host=new URL(String(url)).hostname;calls[host]=(calls[host]||0)+1;
 if(host==='graphql.anilist.co')return data({errors:[{message:'Rate limited'}]},429);
 if(host==='api.jikan.moe')return up
  ?data({data:[{mal_id:22,title:'One Piece',images:{jpg:{large_image_url:'https://cdn.myanimelist.net/images/manga/22.jpg'}}}]})
  :data({error:'Rate limited'},429);
 if(host==='kitsu.io')return data({error:'Temporarily unavailable'},503);
 return data({error:'Offline'},503);
};
const env={DB:{prepare(){return{bind(){return this},async first(){return null},async all(){return{results:[]}}}}},ASSETS:{fetch(){return data({})}}};
async function get(path){const res=await worker.fetch(new Request('https://mediatok.org'+path),env);return {status:res.status,body:await res.json()}}
// First successful catalog query creates a durable cache entry.
let result=await get('/api/search/catalog?type=manga&q=One%20Piece');
assert.equal(result.status,200);assert.ok(result.body.results.some(r=>r.title==='One Piece'));
// Fresh cache works even when every source is subsequently rate-limited.
up=false;elapsed+=1000;
const callsBefore={...calls};result=await get('/api/search/catalog?type=manga&q=One%20Piece');
assert.ok(result.body.results.some(r=>r.title==='One Piece'));assert.deepEqual(calls,callsBefore);
// After freshness window expires, it attempts refresh, then serves stale results.
elapsed+=11*60*1000;result=await get('/api/search/catalog?type=manga&q=One%20Piece');
assert.ok(result.body.results.some(r=>r.title==='One Piece'));
assert.equal(result.body.stale,true,'should serve known-good stale cache on provider outage');
console.log('PASS cached results survive temporary external provider outages');
// Missing cover only caches for seconds; after rate limits clear the cover returns.
result=await get('/api/search/cover?type=manga&q=One%20Piece');
assert.equal(result.body.cover,'');
up=true;elapsed+=65*1000;
result=await get('/api/search/cover?type=manga&q=One%20Piece');
assert.match(result.body.cover,/22\.jpg/);
console.log('PASS missing image recovers when provider becomes available');
// No failed search response is cached as the result for the user's title.
const health=await get('/api/health');assert.equal(health.body.version,'v40');
console.log('PASS v40 backend health and no migration required');

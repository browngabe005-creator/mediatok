import assert from 'node:assert/strict';
import {handleMusicRoute,sanitizeMusic,recentArtistsFromLastfm} from '../src/music-v62.js';
const mock={lastfm:'alice-fm',musicMode:'recent',musicFavorites:[]};
assert.deepEqual(sanitizeMusic(mock),mock);
assert.throws(()=>sanitizeMusic({lastfm:'bad/name'}),/valid Last.fm/);
assert.throws(()=>sanitizeMusic({musicFavorites:[{type:'song',name:'Halo'}]}),/performing artist/);
const record={name:'Alice',socials:JSON.stringify({twitter:'https://twitter.com/example',...mock})};
let called=0;const requests=[];
const db={prepare(sql){return {bind(...args){return {async first(){if(sql.startsWith('SELECT socials'))return {socials:record.socials};return record},async run(){if(sql.startsWith('UPDATE users')){record.socials=args[0];called++}return {success:true}}}}}}};
const env={DB:db,LASTFM_API_KEY:'fake-key'};
const previous=globalThis.fetch;
globalThis.fetch=async function(url){requests.push(String(url));return new Response(JSON.stringify({recenttracks:{track:[{artist:{'#text':'Beach House'},image:[{'#text':'https://lastfm.freetls.fastly.net/a.jpg',size:'large'}]},{artist:{'#text':'Radiohead'}},{artist:{'#text':'Beach House'}},{artist:{'#text':'Sade'}},{artist:{'#text':'Massive Attack'}},{artist:{'#text':'Portishead'}}]}}),{status:200})};
const user=async()=>({id:4});
try{
 const get=async path=>{const r=await handleMusicRoute(new Request('https://mediatok.org'+path),env,{},user);return r.json()};
 const out=await get('/api/music/v62?profile=Alice');assert.equal(out.items.length,4);assert.equal(out.items[0].name,'Beach House');assert.ok(out.items[0].image.startsWith('https://'));
 assert.equal(requests.length,1);assert.ok(!requests[0].includes('bad/name'));
 await get('/api/music/v62?profile=Alice');assert.equal(requests.length,1,'repeat reads should be cached');
 const post=new Request('https://mediatok.org/api/music/v62/preferences',{method:'POST',body:JSON.stringify({lastfm:'alice-fm',musicMode:'favorites',musicFavorites:[{type:'artist',name:'Sade'},{type:'song',name:'Nightcall',artist:'Kavinsky'}]})});
 const r=await handleMusicRoute(post,env,{},user);const json=await r.json();assert.equal(json.ok,true);assert.equal(called,1);assert.equal(JSON.parse(record.socials).twitter,'https://twitter.com/example');
 const favs=await get('/api/music/v62?profile=Alice');assert.equal(favs.items.length,2);assert.equal(favs.items[1].name,'Nightcall');
 const unauth=await handleMusicRoute(new Request('https://mediatok.org/api/music/v62/preferences',{method:'POST',body:'{}'}),env,{},async()=>null);assert.equal(unauth.status,401);
 console.log('PASS v62 Last.fm retrieval, four unique artists, cache, favorites, persistence, auth');
} finally {globalThis.fetch=previous}

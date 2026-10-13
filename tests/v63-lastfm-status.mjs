import assert from 'node:assert/strict';
import {handleMusicRoute} from '../src/music-v62.js';
const profile={name:'Alice',socials:JSON.stringify({lastfm:'alice_music',musicMode:'recent',musicFavorites:[{type:'artist',name:'Sade'}],twitter:'https://twitter.com/alice'})};
const db={prepare(sql){return {bind(...params){return {first:async()=>sql.startsWith('SELECT socials')?{socials:profile.socials}:profile,run:async()=>{if(sql.startsWith('UPDATE'))profile.socials=params[0];return {success:true}}}}}}};
const req=(path,opts)=>new Request('https://mediatok.org'+path,opts);
const get=async(env)=>{const r=await handleMusicRoute(req('/api/music/v63?profile=Alice'),env,{},async()=>({id:23}));assert.equal(r.status,200);return r.json()};
const unconfigured=await get({DB:db});assert.equal(unconfigured.source,'unconfigured');assert.match(unconfigured.message,/LASTFM_API_KEY/);assert.equal(unconfigured.items[0].name,'Sade');
const oldFetch=globalThis.fetch;
try{
 globalThis.fetch=async()=>new Response(JSON.stringify({error:6,message:'User not found'}),{status:200});
 const invalidUser=await get({DB:db,LASTFM_API_KEY:'test-key'});assert.equal(invalidUser.source,'invalid_user');assert.match(invalidUser.message,/username/);
 globalThis.fetch=async()=>new Response(JSON.stringify({error:10,message:'Invalid API key'}),{status:200});
 const invalidKey=await get({DB:db,LASTFM_API_KEY:'test-key'});assert.equal(invalidKey.source,'invalid_key');
 globalThis.fetch=async()=>new Response(JSON.stringify({recenttracks:{track:[{artist:{'#text':'Beach House'}},{artist:{'#text':'Sade'}},{artist:{'#text':'Radiohead'}},{artist:{'#text':'Portishead'}}]}}),{status:200});
 const active=await get({DB:db,LAST_FM_KEY:'test-key'});assert.equal(active.source,'lastfm');assert.equal(active.items.length,4);
 const post=await handleMusicRoute(req('/api/music/v63/preferences',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lastfm:'alice_music',musicMode:'favorites',musicFavorites:[{type:'artist',name:'Fiona Apple'}]})}),{DB:db},{},async()=>({id:23})); assert.equal(post.status,200); assert.equal(JSON.parse(profile.socials).twitter,'https://twitter.com/alice');
 const manual=await get({DB:db});assert.equal(manual.source,'favorites');assert.equal(manual.items[0].name,'Fiona Apple');
 const compatible=await handleMusicRoute(req('/api/music/v62?profile=Alice'),{DB:db},{},async()=>({id:23}));assert.equal(compatible.status,200);
 console.log('PASS v63 valid Last.fm, unconfigured, bad user/key, manual favorites, legacy routes, socials preservation');
}finally{globalThis.fetch=oldFetch}

import assert from 'node:assert/strict';
import {catalogRoute} from '../src/catalog-v41.js';
import {readFile,writeFile,unlink} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const workerFile=new URL('../src/.v45-worker-test.mjs',import.meta.url);
await writeFile(workerFile,(await readFile(new URL('../src/worker.js',import.meta.url),'utf8')).replace("export { ForumLiveRoom } from './live-chat.js';",''));
const {default:worker}=await import(pathToFileURL(workerFile.pathname).href);
await unlink(workerFile);
const stored=new Map();let fetchCount=0, failJikan=false;
const env={DB:{prepare(sql){return {args:[],bind(...args){this.args=args;return this},async first(){if(sql.includes('SELECT response_json')){const hit=stored.get(this.args[0]);return hit?{response_json:JSON.stringify(hit.rows),updated_at:hit.at}:null;}return null;},async all(){return {results:[]}},async run(){if(sql.includes('INSERT INTO media_catalog_cache'))stored.set(this.args[0],{rows:JSON.parse(this.args[1]),at:Number(this.args[2])});return {success:true}}}}}};
const direct=globalThis.fetch;
const body=(data,status=200,kind='application/json',headers={})=>new Response(kind==='application/json'?JSON.stringify(data):data,{status,headers:{'Content-Type':kind,...headers}});
globalThis.fetch=async(address,options={})=>{
 const u=String(address);fetchCount++;
 if(u.includes('api.jikan.moe/v4/anime'))return failJikan?body({},429):body({data:[{mal_id:20,title:'Naruto',images:{jpg:{large_image_url:'https://cdn.myanimelist.net/naruto.jpg'}}}]});
 if(u.includes('api.jikan.moe/v4/manga'))return body({data:[{mal_id:21,title:'One Piece',images:{jpg:{large_image_url:'https://cdn.myanimelist.net/onepiece.jpg'}}}]});
 if(u.includes('graphql.anilist.co'))return body({},503);
 if(u.includes('kitsu.io/api/edge/anime'))return body({data:[{id:'22',attributes:{canonicalTitle:'Naruto Backup',titles:{en:'Naruto Backup'},posterImage:{large:'https://media.kitsu.io/naruto.jpg'}}}]});
 if(u.includes('kitsu.io'))return body({data:[]});
 if(u.includes('store.steampowered.com/api/storesearch'))return body({items:[{id:1245620,name:'Elden Ring',type:'app'}]});
 if(u.includes('openlibrary.org/search.json'))return body({docs:[{key:'/works/OL1',title:'Dune',cover_i:123456}]});
 if(u.includes('googleapis.com/books'))return body({items:[{id:'g1',volumeInfo:{title:'Reverend Insanity',imageLinks:{thumbnail:'https://books.google.com/image.jpg'}}}]});
 if(u.includes('api.vndb.org'))return body({results:[{id:'v1',title:'Steins;Gate',image:{url:'https://s.vndb.org/cv/123.jpg'}}]});
 if(u.includes('itunes.apple.com'))return body({results:[{trackId:2,trackName:'Spirited Away',artworkUrl100:'https://is1-ssl.mzstatic.com/image/100x100bb.jpg'}]});
 if(u.includes('api.tvmaze.com'))return body([{show:{id:1,name:'The Mentalist',image:{original:'https://static.tvmaze.com/image.jpg'}}}]);
 if(u==='https://covers.openlibrary.org/b/id/123456-M.jpg?default=false')return body('',302,'text/plain',{Location:'https://archive.org/download/s_covers/test.jpg'});
 if(u==='https://archive.org/download/s_covers/test.jpg')return body('fake-image-bytes',200,'image/jpeg');
 if(u.includes('en.wikipedia.org'))return body({query:{pages:{}}});
 return body({},404);
};
async function get(type,q){const r=await catalogRoute(new Request(`https://mediatok.org/api/search/media/cover?${new URLSearchParams({type,q})}`),env,null);assert.equal(r.status,200);return await r.json()}
const cases=[['anime','Naruto','cdn.myanimelist.net'],['manga','One Piece','cdn.myanimelist.net'],['game','Elden Ring','steamstatic.com'],['novel','Dune','covers.openlibrary.org'],['webnovel','Reverend Insanity','books.google.com'],['visual-novel','Steins;Gate','vndb.org'],['film','Spirited Away','mzstatic.com'],['tv','The Mentalist','tvmaze.com']];
for(const [type,title,hostname] of cases){const row=await get(type,title);assert.ok(row.cover.includes(hostname),`${type} missing artwork: ${JSON.stringify(row)}`)}
assert.ok(stored.size>=8,'positive images must cache across requests');
const n=fetchCount;
assert.ok((await get('game','Elden Ring')).cover.includes('steamstatic'));
assert.equal(fetchCount,n,'repeat cover request should use stored hit');
const r=await catalogRoute(new Request('https://mediatok.org/api/search/media?type=anime&q=naruto'),env,null);const data=await r.json();
assert.ok(data.results.length&&data.results[0].title==='Naruto','offline search remains unchanged');
assert.equal(data.providerStatus,'local');
// A second title uses the third provider after Jikan fails.
failJikan=true;
const back=await get('anime','Naruto Backup');
assert.ok(back.cover.includes('kitsu.io'),`third-party fallback failed: ${JSON.stringify(back)}`);
// The Worker proxy must safely follow Open Library's CDN redirect.
const proxy=await worker.fetch(new Request('https://mediatok.org/api/catalog-image?'+new URLSearchParams({url:'https://covers.openlibrary.org/b/id/123456-M.jpg?default=false'})),env,{});
assert.equal(proxy.status,200,'Open Library archive redirect should work');
assert.match(proxy.headers.get('Content-Type'),/image/);
console.log('PASS v45: offline search preserved; eight media cover providers; fallback after 429; persistent artwork cache; validated Open Library proxy redirects');
globalThis.fetch=direct;

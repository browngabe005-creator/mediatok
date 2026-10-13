import assert from 'node:assert/strict';
import {catalogRoute} from '../src/catalog-v41.js';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const storage=new Map();let requests=0, fail=false;
const env={DB:{prepare(sql){return{args:[],bind(...args){this.args=args;return this},async first(){if(!sql.includes('SELECT response_json'))throw new Error('unexpected SQL');const r=storage.get(this.args[0]);return r?{response_json:JSON.stringify(r.rows),updated_at:r.at}:null},async run(){if(sql.includes('INSERT INTO media_catalog_cache'))storage.set(this.args[0],{rows:JSON.parse(this.args[1]),at:Number(this.args[2])});return {success:true}}}}}};
const ctx={queue:[],waitUntil(p){this.queue.push(p)}};
const answer=(body,status=200,ct='application/json')=>new Response(ct.startsWith('application/json')?JSON.stringify(body):body,{status,headers:{'Content-Type':ct}});
const directFetch=globalThis.fetch;
globalThis.fetch=async(url,opts={})=>{
 requests++;const u=String(url);
 if(u.includes('graphql.anilist.co')){await sleep(240);return answer({},503)}
 if(u.includes('api.jikan.moe/v4/anime')){await sleep(45);return fail?answer({},429):answer({data:[{mal_id:10,title:'Naruto',images:{jpg:{large_image_url:'https://cdn.myanimelist.net/images/anime/5/17407.jpg'}}}]})}
 if(u.includes('api.jikan.moe/v4/manga'))return answer({data:[{mal_id:11,title:'One Piece',images:{jpg:{image_url:'https://cdn.myanimelist.net/onepiece.jpg'}}}]});
 if(u.includes('kitsu.io')){await sleep(105);return answer({data:[]});}
 if(u.includes('store.steampowered.com'))return answer({items:[{id:570,name:'Dota 2',type:'app'}]});
 if(u.includes('api.tvmaze.com'))return answer([{show:{id:1,name:'The Mentalist',image:{original:'https://static.tvmaze.com/uploads/images/original_untouched/0/1.jpg'}}}]);
 if(u.includes('itunes.apple.com'))return answer({results:[{trackId:4,trackName:'Spirited Away',artworkUrl100:'https://is1-ssl.mzstatic.com/image/100x100bb.jpg'}]});
 if(u.includes('openlibrary.org/search.json'))return answer({docs:[{key:'/works/OL123',title:'Dune',cover_i:123}]});
 if(u.includes('googleapis.com/books'))return answer({items:[{id:'abc',volumeInfo:{title:'Reverend Insanity',imageLinks:{thumbnail:'https://books.google.com/book.jpg'}}}]});
 if(u.includes('api.vndb.org'))return answer({results:[{id:'v1',title:'Steins Gate',image:{url:'https://s.vndb.org/cv/01/123.jpg'}}]});
 if(u.includes('en.wikipedia.org/w/api.php'))return answer({query:{pages:{}}});
 if(u.includes('cdn.myanimelist.net/images'))return answer('fake-image',200,'image/jpeg');
 return answer({},404);
};
async function call(type,q,path='/api/search/v41'){const response=await catalogRoute(new Request('https://mediatok.org'+path+'?'+new URLSearchParams({type,q})),env,ctx);return {response,data:await response.json()}}
const start=performance.now();
const anime=await call('anime','naruto test v41');assert.equal(anime.response.status,200);assert.equal(anime.data.results[0].title,'Naruto');assert.ok(performance.now()-start<200,'Slow AniList blocked fast Jikan');
await Promise.all(ctx.queue.splice(0));assert.ok(storage.size>=1,'Durable D1 cache missing');
fail=true;const cacheCalls=requests;const repeated=await call('anime','naruto test v41');assert.equal(repeated.data.results[0].title,'Naruto');assert.equal(requests,cacheCalls,'Cached search still hit providers');
assert.equal((await call('game','dota')).data.results[0].title,'Dota 2');
assert.ok((await call('game','dota')).data.results[0].cover.startsWith('https://'),'Games expose a direct provider image URL');
assert.equal((await call('film','spirited')).data.results[0].title,'Spirited Away');
assert.equal((await call('tv','mental')).data.results[0].title,'The Mentalist');
assert.equal((await call('novel','dune')).data.results[0].title,'Dune');
assert.ok(/^Steins.?Gate$/i.test((await call('visual-novel','steins')).data.results[0].title));
assert.equal((await call('webnovel','reverend')).data.results[0].title,'Reverend Insanity');
assert.equal((await call('manga','one piece')).data.results[0].title,'One Piece');
assert.equal((await call('all','stories')).response.status,200);
const cover=await call('anime','naruto test v41','/api/search/v41/cover');assert.ok(cover.data.cover.startsWith('https://'));
const blocked=await catalogRoute(new Request('https://mediatok.org/api/search/v41/image?'+new URLSearchParams({url:'https://127.0.0.1/private'})),env,ctx);assert.equal(blocked.status,400);
const img=await catalogRoute(new Request('https://mediatok.org/api/search/v41/image?'+new URLSearchParams({url:'https://cdn.myanimelist.net/images/anime/5/17407.jpg'})),env,ctx);assert.equal(img.status,200);assert.equal(img.headers.get('Content-Type'),'image/jpeg');
const invalid=await call('badtype','title');assert.equal(invalid.response.status,400);
console.log('PASS catalog v41: fast fallback, D1 cache on repeat, 10 search modes, game covers, secure image proxy, cover lookup');
globalThis.fetch=directFetch;

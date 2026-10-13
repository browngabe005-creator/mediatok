import assert from 'node:assert/strict';
import {catalogRoute} from '../src/catalog-v41.js';
const oldFetch=globalThis.fetch;
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json'}});
globalThis.fetch=async url=>{
 let s=String(url);
 if(s.includes('api.jikan.moe'))return reply({data:[{mal_id:10,title:'Naruto',images:{jpg:{large_image_url:'https://cdn.myanimelist.net/naruto.jpg'}}}]});
 if(s.includes('store.steampowered.com'))return reply({items:[{id:570,name:'Dota 2',type:'app'}]});
 return reply({data:[],items:[],docs:[],results:[],query:{pages:{}}});
};
const env={DB:{prepare(s){return{bind(){return this},async first(){return null},async run(){return {success:true}}}}}};
const ctx={waitUntil(p){p.catch(()=>{})}};
for(const route of ['/api/search/media','/api/search/v42','/api/search/v41']){
 let res=await catalogRoute(new Request('https://mediatok.org'+route+'?type=anime&q=naruto'),env,ctx);
 let body=await res.json();assert.equal(res.status,200);assert.equal(body.results[0].title,'Naruto');
}
let res=await catalogRoute(new Request('https://mediatok.org/api/search/media?type=game&q=dota'),env,ctx);assert.equal((await res.json()).results[0].title,'Dota 2');
let diagn=await catalogRoute(new Request('https://mediatok.org/api/search/media/diagnostics?type=anime'),env,ctx);assert.equal((await diagn.json()).version,'v43');
res=await catalogRoute(new Request('https://mediatok.org/api/search/media/image?url=https://127.0.0.1/private'),env,ctx);assert.equal(res.status,400);
console.log('PASS v43: stable route, v42/v41 compatibility, anime+games, diagnostics, proxy allowlist');
globalThis.fetch=oldFetch;

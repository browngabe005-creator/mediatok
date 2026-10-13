import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const workerSource=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8').replace(/^export \{ ForumLiveRoom \} from '\.\/live-chat\.js';\s*/,'');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64'));
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
const calls=[];
globalThis.fetch=async(url,options={})=>{
 const s=String(url);calls.push(s);
 if(s.includes('graphql.anilist.co'))return reply({data:{a:{media:[{id:1,title:{english:'Naruto'},coverImage:{large:'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/naruto.jpg'},format:'TV'}]},m:{media:[{id:2,title:{english:'Naruto Manga'},coverImage:{large:'https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/naruto.jpg'}}]}}});
 if(s.includes('store.steampowered.com'))return reply({items:[{id:10,name:'Naruto Shippuden: Ultimate Ninja Storm',tiny_image:'https://shared.akamai.steamstatic.com/10.jpg'}]});
 if(s.includes('api.tvmaze.com'))return reply([]);
 if(s.includes('itunes.apple.com'))return reply({results:[]});
 if(s.includes('openlibrary.org'))return reply({docs:[]});
 if(s.includes('googleapis.com'))return reply({items:[]});
 if(s.includes('api.vndb.org'))return reply({results:[]});
 return reply({error:'provider unavailable'},503);
};
const env={DB:{prepare(){return{bind(){return this},async first(){return null},async all(){return {results:[]}}}}},ASSETS:{fetch(){return reply({site:true})}}};
async function get(path){const res=await worker.fetch(new Request('https://mediatok.org'+path),env);return {status:res.status,data:await res.json()}}
const all=await get('/api/search/all?q=Naruto');
assert.equal(all.status,200);assert.ok(all.data.results.some(x=>x.mediaType==='anime'&&x.title==='Naruto'));
assert.ok(all.data.results.some(x=>x.mediaType==='manga'));
assert.ok(all.data.results.some(x=>x.mediaType==='game'));
const game=all.data.results.find(x=>x.mediaType==='game');
assert.match(game.cover,/10\.jpg/);assert.ok(game.coverFallbacks.some(x=>x.includes('library_600x900.jpg')));
const health=await get('/api/health');assert.equal(health.data.version,'v40');
console.log('PASS all-media endpoint across anime, manga, games; image fallback metadata; versioned health');

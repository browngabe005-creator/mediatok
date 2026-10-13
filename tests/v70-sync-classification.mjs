import assert from 'node:assert/strict';
import {fetchAniListEntries,fetchMalEntries,fetchVndbEntries} from '../src/sync-v70.js';
const response=data=>new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});
let calls=[];
globalThis.fetch=async (url,opts={})=>{
  calls.push([String(url),opts]);
  if(String(url).includes('graphql.anilist.co')){
    const type=JSON.parse(opts.body).variables.type;
    return response({data:{MediaListCollection:{lists:[{entries:[{status:'CURRENT',progress:3,score:85,media:{id:type==='MANGA'?10:20,title:{english:type==='MANGA'?'Oregairu':'Test Anime'},coverImage:{large:'https://s4.anilist.co/x.jpg'},startDate:{year:2011},type,format:type==='MANGA'?'NOVEL':'TV'}}]}]}}});
  }
  if(String(url).includes('/users/test/mangalist')) return response({data:[{status:'reading',chapters_read:12,score:9,manga:{mal_id:33,title:'Spice and Wolf',type:'Light Novel',images:{jpg:{image_url:'https://cdn.myanimelist.net/a.jpg'}},published:{from:'2006-01-01'}}}],pagination:{has_next_page:false}});
  if(String(url).includes('/users/test/animelist')) return response({data:[],pagination:{has_next_page:false}});
  if(String(url).includes('/kana/user')) return response({tester:{id:'u99',username:'tester'}});
  if(String(url).includes('/kana/ulist')) return response({results:[{id:'v4',vote:80,finished:null,labels:[{label:'Playing'}],vn:{id:'v4',title:'Steins;Gate',released:'2009-10-15',image:{url:'https://t.vndb.org/x.jpg'}}}],more:false});
  throw new Error('unexpected '+url);
};
const ani=await fetchAniListEntries('alice');
assert.equal(ani.find(x=>x.title==='Oregairu').type,'light-novel');
assert.equal(ani.find(x=>x.title==='Test Anime').type,'anime');
const mal=await fetchMalEntries('test');
assert.equal(mal[0].type,'light-novel');
const vn=await fetchVndbEntries('tester');
assert.equal(vn.entries[0].type,'visual-novel');
assert.equal(vn.entries[0].status,'In progress');
console.log('PASS v70 sync: AniList NOVEL -> light-novel; MAL Light Novel -> light-novel; VNDB -> visual-novel');

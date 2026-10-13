import assert from 'node:assert/strict';
import {catalogRoute} from '../src/catalog-v41.js';
import {seedTitles} from '../src/local-seed-catalog.js';
const neverFetch=globalThis.fetch;
globalThis.fetch=async ()=>{throw Error('Provider unavailable')};
const fakeDB={prepare(sql){return {sql,bind(...args){this.args=args;return this},async first(){return null},async all(){
 if(this.sql.includes('FROM media_logs')){
  assert.equal(this.args.length,3);
  if(this.args[0].includes('original title'))return {results:[{media_type:'manga',title:'An Original Title',media_key:'loc:100',cover:'https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/sample.jpg',media_year:'2020'}]};
  return {results:[]};
 }return {results:[]};
 },async run(){return {success:true}}};}};
async function check(type,q,env){const r=await catalogRoute(new Request(`https://mediatok.org/api/search/media?type=${type}&q=${encodeURIComponent(q)}`),env,null);assert.equal(r.status,200);return await r.json();}
const cases=[['anime','naruto'],['manga','one piece'],['webnovel','reverend insanity'],['game','elden ring'],['novel','dune'],['tv','the mentalist'],['film','spirited away']];
for(const [type,q] of cases){const d=await check(type,q,{DB:fakeDB});assert.ok(d.results.some(x=>x.title.toLowerCase().includes(q)),`${type} ${q} has local result`);assert.equal(d.providerStatus,'local');}
const local=await check('manga','original title',{DB:fakeDB});assert.equal(local.results[0].mediaType,'manga');assert.equal(local.results[0].cover.startsWith('https://'),true);
const broad=await check('all','naruto',{DB:fakeDB});assert.ok(broad.results.length>=2);assert.ok(new Set(broad.results.map(x=>x.mediaType)).has('anime'));assert.ok(new Set(broad.results.map(x=>x.mediaType)).has('manga'));
const seedOnly=await check('game','elden ring',{});assert.ok(seedOnly.results.some(r=>r.title==='Elden Ring'));
console.log('v44 offline search PASS: seeded categories, all media, logged artwork, no APIs, no D1 cache migration. Indexed titles:',seedTitles.length);
globalThis.fetch=neverFetch;

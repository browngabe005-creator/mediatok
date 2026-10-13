import assert from 'node:assert/strict';
import {catalogRoute} from '../src/catalog-v41.js';
const response=data=>new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});
globalThis.fetch=async (url,opts={})=>{
 if(String(url).includes('graphql.anilist.co')) return response({data:{Page:{pageInfo:{total:4321,hasNextPage:true},media:[{id:1,title:{english:'My Teen Romantic Comedy SNAFU',romaji:'Yahari Ore'},coverImage:{extraLarge:'https://s4.anilist.co/a.jpg'},startDate:{year:2011},description:'LN'}]}}});
 throw new Error('unexpected provider '+url);
};
const env={DB:{prepare(){return {bind(){return {async all(){return {results:[]}},async first(){return null},async run(){return {}}}},async first(){return null}}}}};
const req=new Request('https://mediatok.org/api/lightnovels/browse?offset=30&q=Oregairu');
const res=await catalogRoute(req,env,{});assert.equal(res.status,200);const body=await res.json();assert.equal(body.results[0].mediaType,'light-novel');assert.match(body.results[0].title,/Romantic Comedy/);assert.equal(body.totalApprox,4321);assert.equal(body.hasMore,true);
console.log('PASS v70 light novels: paginated AniList NOVEL catalog stays separate from manga/VNs');

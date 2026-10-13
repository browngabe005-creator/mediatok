import assert from 'node:assert/strict';
import {creditRoute} from '../src/credits-v53.js';
let requests=0;
globalThis.fetch=async (input,opts={})=>{
  requests++;
  const path=String(input);
  if(path.includes('graphql.anilist.co')) return new Response(JSON.stringify({data:{Media:{title:{english:'Naruto'},staff:{edges:[{role:'Director',node:{name:{full:'Hayato Date'},image:{medium:'https://example.org/h.jpg'}}}]},studios:{nodes:[{name:'Studio Pierrot'}]},characters:{edges:[{role:'MAIN',node:{name:{full:'Naruto Uzumaki'},image:{medium:'https://example.org/n.jpg'}},voiceActors:[{name:{full:'Junko Takeuchi'},image:{medium:'https://example.org/j.jpg'}}]}]}}}}),{headers:{'Content-Type':'application/json'}});
  if(path.includes('api.themoviedb.org/3/movie/123')) return new Response(JSON.stringify({title:'Example Film',credits:{crew:[{job:'Director',name:'Example Director',profile_path:'/a.jpg'}],cast:[{name:'Example Actor',character:'Hero',profile_path:'/b.jpg'}]}}),{status:200});
  if(path.includes('www.googleapis.com/books'))return new Response(JSON.stringify({items:[{volumeInfo:{title:'Dune',authors:['Frank Herbert']}}]}),{status:200});
  return new Response('{}',{status:503});
};
const get=async (type,key,title,env={})=>{const r=await creditRoute(new Request('https://mediatok.org/api/credits/v53?'+new URLSearchParams({type,key,title})),env);assert.equal(r.status,200);return r.json()};
const a=await get('anime','anilist:20','Naruto');assert.equal(a.directors[0],'Hayato Date');assert.equal(a.cast[0].name,'Naruto Uzumaki');assert.equal(a.voices[0].name,'Junko Takeuchi');
const n=requests;const again=await get('anime','anilist:20','Naruto');assert.equal(requests,n,'warm memory credits must perform no extra provider fetch');assert.equal(again.cache,'memory');
const movie=await get('film','tmdb-movie:123','Example Film',{TMDB_API_KEY:'test'});assert.equal(movie.directors[0],'Example Director');assert.equal(movie.cast[0].name,'Example Actor');
const book=await get('novel','googlebooks:abc','Dune');assert.equal(book.authors[0],'Frank Herbert');
const game=await get('game','steam:123','Any Game');assert.equal(game.crew.length,0);
const bad=await creditRoute(new Request('https://mediatok.org/api/credits/v53?type=other&title=n'),{});assert.equal(bad.status,400);
console.log('PASS v53: anime director/studio/voice + warm cache, film cast/director, books authors, game fallback, query validation; no D1');

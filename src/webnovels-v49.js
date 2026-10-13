/* MediaTok web fiction directory v49.
 * Prefer a prebuilt compact local snapshot (public/webnovels/catalog.json),
 * then an openly available static WebNovel snapshot. Both are paginated and
 * filterable without involving the working anime/manga/game search providers.
 * Attribution and provenance: README-V49-WEBNOVEL-LIBRARY.md.
 */
import { seedTitles } from './local-seed-catalog.js';

const SOURCES=[
 'https://varun-patkar.github.io/webnovel-advanced-search/data/books-index.json',
 'https://raw.githubusercontent.com/Varun-Patkar/webnovel-advanced-search/main/data/books-index.json'
];
const TIMEOUT=6200;
let cache=null, inFlight=null;
const clean=x=>String(x==null?'':x).trim().slice(0,220);
const fold=x=>clean(x).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function url(x){const s=clean(x);return /^https:\/\/[^\s]+$/i.test(s)?s:''}
export function normalizeWebnovelIndex(input){
 const books=Array.isArray(input)?input:Array.isArray(input?.books)?input.books:Array.isArray(input?.results)?input.results:[];
 const seen=new Set(),rows=[];
 for(const b of books){
  if(!b||typeof b!=='object')continue;
  const title=clean(b.n??b.title??b.name??b.bookName??b.book_name??b.book_title);
  if(title.length<2)continue;
  const key=fold(title);if(seen.has(key))continue;seen.add(key);
  const id=clean(b.id??b.i??b.bookId??b.book_id??b.bid);
  const suppliedKey=clean(b.key);
  const stableKey=suppliedKey.startsWith('webnovel:')?suppliedKey:(id?`webnovel:${id}`:`webnovel:${key.replace(/ /g,'-')}`);
  const titleCover=url(b.cover??b.coverUrl??b.cover_url??b.image??b.imageUrl??b.pic) ||
   (/^\d{2,20}$/.test(id)?`https://book-pic.webnovel.com/bookcover/${id}`:'');
  rows.push({key:stableKey,title,mediaType:'webnovel',
   cover:titleCover,creator:clean(b.creator??b.author??b.authorName??b.a??''),subtitle:clean(b.subtitle??b.source??b.publisher??'Web fiction'),
   description:clean(b.description??b.intro??'')});
 }
 return rows;
}
function withSeed(rows){
 const seen=new Set(rows.map(x=>fold(x.title)));
 const baseline=seedTitles.filter(x=>x.mediaType==='webnovel'&&!seen.has(fold(x.title)))
 .map(x=>({key:`mediatok-webnovel:${fold(x.title).replace(/ /g,'-')}`,title:x.title,mediaType:'webnovel',
 cover:'',creator:'',subtitle:x.subtitle||'MediaTok offline web fiction'}));
 return [...rows,...baseline];
}
async function download(urlOrRequest,handler,timeout=TIMEOUT){
 const controller=new AbortController(),t=setTimeout(()=>controller.abort(),timeout);
 try{
  const res=await handler(urlOrRequest,{signal:controller.signal,headers:{Accept:'application/json'}});
  if(!res.ok||!(res.headers.get('content-type')||'').toLowerCase().includes('json'))throw Error('Not JSON');
  const size=Number(res.headers.get('content-length')||0);
  if(size>18000000)throw Error('Source too large');
  const input=await res.json();
  if(JSON.stringify(input).length>18000000)throw Error('Source too large');
  const rows=normalizeWebnovelIndex(input);
  if(rows.length<100)throw Error('Invalid or partial index');
  return rows;
 }finally{clearTimeout(t)}
}
async function refresh(env){
 // Local assets take priority, so successful builds remain fully independent
 // of GitHub / WebNovel / third-party availability after deployment.
 if(env?.ASSETS?.fetch){
  try{
   const rows=await download(new Request('https://mediatok.org/webnovels/catalog.json'),
    (input,opts)=>env.ASSETS.fetch(input,opts),2400);
   return {rows:withSeed(rows),source:'MediaTok catalog',generatedAt:Date.now()};
  }catch{}
 }
 for(const endpoint of SOURCES){
  try{
   const rows=await download(endpoint,fetch);
   return {rows:withSeed(rows),source:'WebNovel public snapshot',generatedAt:Date.now()};
  }catch(e){console.warn('Web fiction index unavailable',String(e?.message||e).slice(0,100))}
 }
 return {rows:withSeed([]),source:'Offline starter titles',generatedAt:Date.now()};
}
export async function loadWebnovels(env){
 // Avoid thundering-herd requests. Reuse the last *successful* directory for 24h,
 // and retry after a short 5-minute cooldown if only the offline seeds were loaded.
 const t=Date.now();if(cache&&cache.expires>t)return cache.data;
 if(inFlight)return inFlight;
 inFlight=refresh(env).then(data=>{
   cache={data,expires:Date.now()+(data.rows.length>200?86400000:300000)};return data;
 }).finally(()=>{inFlight=null});
 return inFlight;
}
export function resetWebnovelsForTesting(){cache=null;inFlight=null}
export function listWebnovels(data,{offset=0,limit=36,q='' }={}){
 const n=fold(q);const all=n?data.rows.filter(x=>fold(x.title).includes(n)||fold(x.creator).includes(n)):data.rows;
 const start=Math.max(0,Math.min(200000,Number(offset)||0));
 const size=Math.max(1,Math.min(60,Number(limit)||36));
 return {results:all.slice(start,start+size),total:all.length,offset:start,limit:size,
 hasMore:start+size<all.length,source:data.source,version:'v49'};
}
export function searchWebnovels(data,q){
 const n=fold(q);if(n.length<2)return [];
 return data.rows.filter(x=>fold(x.title).includes(n)||fold(x.creator).includes(n))
 .sort((a,b)=>{const rank=x=>{const t=fold(x.title);return +(t===n)*100 + +(t.startsWith(n))*40 + +(t.includes(n))*10 + +(!!x.cover)*2};return rank(b)-rank(a)}).slice(0,24);
}
export const webnovelSource=SOURCES[0];

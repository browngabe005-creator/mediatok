import { seedTitles } from './local-seed-catalog.js';
import { loadWebnovels, listWebnovels, searchWebnovels } from './webnovels-v49.js';
// MediaTok v41: single catalog boundary. No browser-facing third-party search calls.
// Successful responses are saved in the existing D1 database (migration 0013).
// If the cache table is not installed, requests still work with edge/in-isolate caching.
const TYPES = new Set(['all','anime','manga','light-novel','webnovel','visual-novel','game','film','tv','novel','comic']);
const now=()=>Date.now();
const norm=s=>String(s||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const timeoutMs=2300, freshMs=6*3600000, staleMs=30*86400000;
const inFlight=new Map(), hot=new Map(), hostBlock=new Map();
function result(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
function entry(key,title,cover='',opts={}){return {key,title:String(title||'').trim(),cover:String(cover||'').replace(/^http:/,'https:'),coverFallbacks:opts.coverFallbacks||[],year:opts.year||'',subtitle:opts.subtitle||'',description:opts.description||'',creator:opts.creator||'',adult:!!opts.adult,mediaType:opts.mediaType||'',extra:opts.extra||''}}
function rank(rows,q){const n=norm(q);const seen=new Set();return rows.filter(x=>{if(!x?.title)return false;const key=`${x.mediaType}:${norm(x.title)}`;if(!norm(x.title)||seen.has(key))return false;seen.add(key);return true}).sort((a,b)=>{const s=x=>{const t=norm(x.title);return (t===n?200:0)+(t.startsWith(n)?50:0)+(t.includes(n)?20:0)+(x.cover?4:0)};return s(b)-s(a)}).slice(0,24)}
async function grab(url,options={}){
  const host=new URL(url).hostname;
  if((hostBlock.get(host)||0)>now())throw new Error('Provider cooldown');
  const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),timeoutMs);
  try{
    const r=await fetch(url,{...options,signal:ctrl.signal,headers:{Accept:'application/json',...(options.headers||{})}});
    if(!r.ok){if([429,500,502,503,504].includes(r.status))hostBlock.set(host,now()+([429,503].includes(r.status)?30000:7000));throw new Error(`Provider ${host} responded ${r.status}`)}
    if(!(r.headers.get('Content-Type')||'').includes('json'))throw new Error(`Unexpected response from ${host}`);
    const d=await r.json();if(d?.errors?.length)throw new Error('Catalog GraphQL error');return d;
  } finally{clearTimeout(timer)}
}
const aj=(q,type)=>grab('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:'query($q:String!,$t:MediaType!){Page(perPage:22){media(search:$q,type:$t,sort:SEARCH_MATCH){id title{english romaji native} coverImage{extraLarge large medium} startDate{year} format isAdult description(asHtml:false)}}}',variables:{q,t:type}})}).then(d=>(d.data?.Page?.media||[]).map(m=>entry(`anilist:${m.id}`,m.title?.english||m.title?.romaji||m.title?.native,m.coverImage?.extraLarge||m.coverImage?.large,{mediaType:type==='ANIME'?'anime':'manga',coverFallbacks:[m.coverImage?.large,m.coverImage?.medium].filter(Boolean),year:m.startDate?.year,subtitle:`${m.format||type} · AniList`,description:m.description,adult:m.isAdult})));
const jk=(q,type)=>grab(`https://api.jikan.moe/v4/${type}?q=${encodeURIComponent(q)}&limit=20`).then(d=>(d.data||[]).map(m=>entry(`jikan:${type}:${m.mal_id}`,m.title_english||m.title,m.images?.jpg?.large_image_url||m.images?.jpg?.image_url,{mediaType:type,coverFallbacks:[m.images?.webp?.large_image_url,m.images?.jpg?.image_url].filter(Boolean),year:m.year||(m.published?.from||'').slice(0,4),subtitle:`${m.type||type} · MyAnimeList`,description:m.synopsis,adult:/hentai|rx/i.test(m.rating||'')})));
const kitsu=(q,type)=>grab(`https://kitsu.io/api/edge/${type}?filter[text]=${encodeURIComponent(q)}&page[limit]=15`).then(d=>(d.data||[]).map(x=>{const m=x.attributes||{};return entry(`kitsu:${type}:${x.id}`,m.titles?.en||m.titles?.en_jp||m.canonicalTitle,m.posterImage?.large||m.posterImage?.medium,{mediaType:type,coverFallbacks:[m.posterImage?.original,m.posterImage?.medium].filter(Boolean),year:(m.startDate||'').slice(0,4),subtitle:`${type} · Kitsu`,description:m.synopsis})}));
const openlibrary=q=>grab(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=30&fields=key,title,cover_i,first_publish_year,author_name`).then(d=>(d.docs||[]).map(x=>entry(`openlibrary:${x.key}`,x.title,x.cover_i?`https://covers.openlibrary.org/b/id/${x.cover_i}-M.jpg`:'',{mediaType:'novel',year:x.first_publish_year,subtitle:'Open Library',creator:(x.author_name||[]).join(', ')})));
const books=q=>grab(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=30`).then(d=>(d.items||[]).map(x=>{const m=x.volumeInfo||{};return entry(`googlebooks:${x.id}`,m.title,m.imageLinks?.thumbnail||m.imageLinks?.smallThumbnail||'',{mediaType:'novel',year:(m.publishedDate||'').slice(0,4),subtitle:'Google Books',creator:(m.authors||[]).join(', '),description:m.description})}));
// v57: bibliographic search must include subjects and authors, not title alone.
// Pages come from two independent public catalogs. Only successful pages are cached.
const bookPageCache=new Map();
async function browseBooks(q,offset=0,env){
 const pageOffset=Math.min(2000,Math.max(0,Math.trunc(Number(offset)||0)));
 const cacheKey=norm(q)+'|'+pageOffset;const cached=bookPageCache.get(cacheKey);
 if(cached&&cached.until>now())return cached.payload;
 const [ol,google]=await Promise.allSettled([
  grab(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=30&offset=${pageOffset}&fields=key,title,cover_i,first_publish_year,author_name,edition_count`,{}),
  grab(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&startIndex=${Math.min(960,pageOffset)}&maxResults=30`,{})
 ]);
 const rows=[];
 if(ol.status==='fulfilled')for(const x of ol.value.docs||[])rows.push(entry(`openlibrary:${x.key}`,x.title,x.cover_i?`https://covers.openlibrary.org/b/id/${x.cover_i}-M.jpg`:'',{mediaType:'novel',year:x.first_publish_year,creator:(x.author_name||[]).join(', '),subtitle:'Book · Open Library'}));
 if(google.status==='fulfilled')for(const x of google.value.items||[]){const m=x.volumeInfo||{};rows.push(entry(`googlebooks:${x.id}`,m.title,m.imageLinks?.thumbnail||m.imageLinks?.smallThumbnail||'',{mediaType:'novel',creator:(m.authors||[]).join(', '),year:(m.publishedDate||'').slice(0,4),subtitle:'Book · Google Books',description:m.description}));}
 // Local MediaTok titles still appear even if both external sources are down.
 if(pageOffset===0)rows.unshift(...await localMediaSearch('novel',q,env));
 const ranked=rank(rows,q);
 const totalApprox=Math.max(Number(ol.status==='fulfilled'?ol.value.numFound:0)||0,Number(google.status==='fulfilled'?google.value.totalItems:0)||0);
 const payload={results:ranked,offset:pageOffset,nextOffset:pageOffset+30,hasMore:totalApprox>pageOffset+30||rows.length>29,totalApprox,providerStatus:ol.status==='rejected'&&google.status==='rejected'?'offline':'ok'};
 bookPageCache.set(cacheKey,{payload,until:now()+(payload.results.length?15*60*1000:30000)});
 if(bookPageCache.size>150)bookPageCache.delete(bookPageCache.keys().next().value);
 return payload;
}

// v70: Light Novels are a distinct AniList media format. They are stored under
// AniList's MANGA media type, but format=NOVEL. Keep them completely separate
// from manga and visual novels, with real pagination instead of a tiny seed list.
const lnPageCache=new Map();
async function browseLightNovels(q='',offset=0,env){
 const pageOffset=Math.min(15000,Math.max(0,Math.trunc(Number(offset)||0))),page=Math.floor(pageOffset/30)+1;
 const term=String(q||'').trim().slice(0,110),cacheKey=norm(term)+'|'+pageOffset;const cached=lnPageCache.get(cacheKey);if(cached&&cached.until>now())return cached.payload;
 const query=term?
  'query($page:Int!,$q:String!){Page(page:$page,perPage:30){pageInfo{total hasNextPage} media(type:MANGA,format:NOVEL,search:$q,sort:SEARCH_MATCH){id title{english romaji native} coverImage{extraLarge large medium} startDate{year} description(asHtml:false)}}}':
  'query($page:Int!){Page(page:$page,perPage:30){pageInfo{total hasNextPage} media(type:MANGA,format:NOVEL,sort:POPULARITY_DESC){id title{english romaji native} coverImage{extraLarge large medium} startDate{year} description(asHtml:false)}}}';
 let payload;
 try{
  const d=await grab('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,variables:term?{page,q:term}:{page}})});
  const pg=d.data?.Page||{},rows=(pg.media||[]).map(m=>entry(`anilist:${m.id}`,m.title?.english||m.title?.romaji||m.title?.native,m.coverImage?.extraLarge||m.coverImage?.large||m.coverImage?.medium||'',{mediaType:'light-novel',coverFallbacks:[m.coverImage?.large,m.coverImage?.medium].filter(Boolean),year:m.startDate?.year,subtitle:'Light novel · AniList',description:m.description}));
  if(pageOffset===0){const local=await localMediaSearch('light-novel',term||'light novel',env);for(const x of local)if(!rows.some(r=>norm(r.title)===norm(x.title)))rows.push({...x,mediaType:'light-novel'});}
  payload={results:term?rank(rows,term):rows.slice(0,36),offset:pageOffset,nextOffset:pageOffset+30,hasMore:!!pg.pageInfo?.hasNextPage,totalApprox:Number(pg.pageInfo?.total||0),providerStatus:'ok'};
 }catch(e){const local=pageOffset===0?await localMediaSearch('light-novel',term||'',env):[];payload={results:local,offset:pageOffset,nextOffset:pageOffset+30,hasMore:false,totalApprox:local.length,providerStatus:local.length?'local':'offline'};}
 lnPageCache.set(cacheKey,{payload,until:now()+(payload.results.length?15*60*1000:30000)});if(lnPageCache.size>120)lnPageCache.delete(lnPageCache.keys().next().value);return payload;
}
const anilistLightNovels=q=>grab('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:'query($q:String!){Page(perPage:30){media(search:$q,type:MANGA,format:NOVEL,sort:SEARCH_MATCH){id title{english romaji native} coverImage{extraLarge large medium} startDate{year} description(asHtml:false)}}}',variables:{q}})}).then(d=>(d.data?.Page?.media||[]).map(m=>entry(`anilist:${m.id}`,m.title?.english||m.title?.romaji||m.title?.native,m.coverImage?.extraLarge||m.coverImage?.large||m.coverImage?.medium||'',{mediaType:'light-novel',coverFallbacks:[m.coverImage?.large,m.coverImage?.medium].filter(Boolean),year:m.startDate?.year,subtitle:'Light novel · AniList',description:m.description})));

const steam=q=>grab(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(q)}&l=en&cc=us`).then(d=>(d.items||[]).filter(x=>x.name&&(!x.type||x.type==='app')).map(x=>entry(`steam-game:${x.id}`,x.name,x.tiny_image||`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${x.id}/header.jpg`,{mediaType:'game',subtitle:'Game · Steam',coverFallbacks:[`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${x.id}/header.jpg`,`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${x.id}/library_600x900.jpg`].filter(Boolean)})));
const wiki=(q,type)=>grab(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q+' '+(type==='game'?'video game':'visual novel'))}&gsrnamespace=0&gsrlimit=14&prop=pageimages%7Cextracts&piprop=thumbnail&pithumbsize=440&exintro=1&explaintext=1&format=json`).then(d=>Object.values(d.query?.pages||{}).filter(x=>type==='game'?/video game|game series/i.test(x.extract||''):/visual novel/i.test(x.extract||'')).map(x=>entry(`wikipedia-${type}:${x.pageid}`,x.title,x.thumbnail?.source,{mediaType:type,subtitle:'Wikipedia',description:x.extract})));
const itunes=q=>grab(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=movie&limit=20`).then(d=>(d.results||[]).map(x=>entry(`itunes-movie:${x.trackId}`,x.trackName,(x.artworkUrl600||x.artworkUrl100||'').replace(/\d+x\d+bb/,'600x900bb'),{mediaType:'film',year:(x.releaseDate||'').slice(0,4),subtitle:'Film · iTunes'})));
const tvmaze=q=>grab(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`).then(d=>(Array.isArray(d)?d:[]).map(x=>{const m=x.show||{};return entry(`tvmaze:${m.id}`,m.name,m.image?.original||m.image?.medium,{mediaType:'tv',year:(m.premiered||'').slice(0,4),subtitle:'TV · TVmaze',description:m.summary})}));
const vndb=q=>grab('https://api.vndb.org/kana/vn',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({filters:['search','=',q],fields:'id,title,released,image.url',results:20,sort:'searchrank'})}).then(d=>(d.results||[]).map(x=>entry(`vndb:${x.id}`,x.title,x.image?.url,{mediaType:'visual-novel',year:(x.released||'').slice(0,4),subtitle:'Visual novel · VNDB'})));
const tasks=(type,q)=>{
 switch(type){
 case 'anime':return [()=>jk(q,'anime'),()=>aj(q,'ANIME'),()=>kitsu(q,'anime')];
 case 'manga':return [()=>jk(q,'manga'),()=>aj(q,'MANGA'),()=>kitsu(q,'manga')];
 case 'light-novel':return [()=>anilistLightNovels(q),()=>jk(q,'manga').then(x=>x.filter(m=>/novel/i.test(m.subtitle||'')).map(m=>({...m,mediaType:type}))),()=>books(q).then(x=>x.filter(m=>/light novel|novel/i.test((m.subtitle||'')+' '+(m.description||''))).map(m=>({...m,mediaType:type})))];
 case 'webnovel':return [()=>books(q).then(x=>x.map(m=>({...m,mediaType:type}))),()=>openlibrary(q).then(x=>x.map(m=>({...m,mediaType:type}))),()=>jk(q,'manga').then(x=>x.filter(m=>/novel/i.test(m.subtitle||'')).map(m=>({...m,mediaType:type})))];
 case 'novel':return [()=>openlibrary(q),()=>books(q)];
 case 'comic':return [()=>books(q).then(x=>x.map(m=>({...m,mediaType:type}))),()=>openlibrary(q).then(x=>x.map(m=>({...m,mediaType:type})))];
 case 'game':return [()=>steam(q),()=>wiki(q,'game')];
 case 'visual-novel':return [()=>vndb(q),()=>wiki(q,'visual-novel')];
 case 'film':return [()=>itunes(q)];
 case 'tv':return [()=>tvmaze(q)];
 default:return [];
 }
};
function firstUsable(jobs,q,type){
 // Return first actual matches. Other providers cannot delay this resolution.
 // Every task is guarded, so a rejected provider never becomes an unhandled rejection.
 let completed=0,failures=0;return new Promise(resolve=>{
  if(!jobs.length)return resolve({results:[],failed:true});
  let resolved=false;
  const deadline=setTimeout(()=>{if(!resolved){resolved=true;resolve({results:[],failed:true})}},2850);
  // Launch one preferred provider first; backups start only if still needed.
  // This avoids three simultaneous provider calls for every keystroke.
  jobs.forEach((fn,index)=>setTimeout(()=>{
   if(resolved)return;
   Promise.resolve().then(fn).then(rows=>{
    if(resolved)return;
    const list=rank(rows,q);
    if(list.length){resolved=true;clearTimeout(deadline);resolve({results:list,failed:false})}
    else if(++completed===jobs.length){resolved=true;clearTimeout(deadline);resolve({results:[],failed:false})}
   }).catch(()=>{
    if(!resolved){failures++;if(++completed===jobs.length){resolved=true;clearTimeout(deadline);resolve({results:[],failed:failures===jobs.length})}}
   });
  },index*250));
 });
}
// Limit aggregate searches: old All Media search launched 8 categories x 2 providers
// on every keystroke, exhausting shared API quotas and making everything appear offline.
async function quickAll(q,env){
 const categories=['anime','manga','game','tv','film','novel','webnovel','visual-novel','comic','light-novel'];
 const saved=await Promise.all(categories.map(category=>getCached(env,ckey(category,q)).catch(()=>null)));
 const cached=saved.flatMap(hit=>hit?.rows?.length?hit.rows.slice(0,4):[]);
 // Prefer answers saved by a previous individual category search.
 if(cached.length)return {results:rank(cached,q).slice(0,30),failed:false,cached:true};
 return new Promise(resolve=>{
  let cursor=0,active=0,finished=0,hasResponse=false,done=false,limit=5;
  const collected=[];
  let grace=null;
  const overall=setTimeout(()=>end(),2600);
  function end(){
   if(done)return;done=true;clearTimeout(overall);clearTimeout(grace);
   resolve({results:rank(collected,q).slice(0,30),failed:!hasResponse});
  }
  const launch=()=>{
   while(!done&&active<3&&cursor<limit){
    const type=categories[cursor++];active++;
    // One provider per category for a broad query. Targeted searches retain full fallback.
    const primary=tasks(type,q).slice(0,1);
    firstUsable(primary,q,type).then(answer=>{
     if(done)return;
     if(!answer.failed)hasResponse=true;
     if(answer.results.length){
      collected.push(...answer.results.slice(0,5));
      if(!grace)grace=setTimeout(end,400);
     }
    }).catch(()=>{}).finally(()=>{
     active--;finished++;
     if(!done){if(finished===limit){if(!collected.length&&limit===5){limit=categories.length;launch();}else end();}else launch();}
    });
   }
  };
  launch();
 });
}
// Local MediaTok entries are a real independent search source, not an external
// API fallback. A catalog provider outage must never hide titles that members
// have already logged. This query is bounded and does not expose private notes.
async function localMediaSearch(type,q,env){
 if(!q||q.length<2)return [];
 const n=norm(q);
 // Built-in title names are offline-searchable even if this D1 database has no
 // member logs yet. No fabricated covers, dates, or provider IDs are attached.
 const seed=seedTitles.filter(x=>(type==='all'||x.mediaType===type)&&norm(x.title).includes(n)).map(x=>entry(
   `mediatok-seed:${x.mediaType}:${norm(x.title).replace(/ /g,'-')}`,
   x.title,'',{mediaType:x.mediaType,subtitle:x.subtitle||'MediaTok curated title',description:x.description||''}
 ));
 if(!env?.DB)return rank(seed,q);
 try{
  const {results=[]}=await env.DB.prepare(`
   SELECT media_type, title, media_key, MAX(cover) AS cover,
          MAX(media_year) AS media_year, COUNT(*) AS popularity
   FROM media_logs
   WHERE INSTR(LOWER(title), ?) > 0 AND (? = 'all' OR media_type = ?)
   GROUP BY media_type, LOWER(title)
   ORDER BY popularity DESC LIMIT 35
  `).bind(q.toLowerCase(),type,type).all();
  return rank([...results.filter(r=>TYPES.has(r.media_type)&&r.media_type!=='all').map(r=>entry(
    r.media_key||`mediatok:${r.media_type}:${norm(r.title)}`,
    r.title,r.cover||'',{mediaType:r.media_type,year:r.media_year||'',subtitle:'MediaTok community entry'}
  )),...seed],q);
 }catch(e){console.warn('Local media index unavailable',String(e?.message||e));return rank(seed,q)}
}
const ckey=(type,q)=>`v41:${type}:${norm(q)}`;
async function loadDB(db,key){if(!db)return null;try{const x=await db.prepare('SELECT response_json,updated_at FROM media_catalog_cache WHERE cache_key=?').bind(key).first();if(!x)return null;const rows=JSON.parse(x.response_json);return Array.isArray(rows)?{rows,at:Number(x.updated_at)}:null}catch{return null}}
async function storeDB(db,key,rows){if(!db||!rows.length)return;try{await db.prepare('INSERT INTO media_catalog_cache(cache_key,response_json,updated_at) VALUES(?,?,?) ON CONFLICT(cache_key) DO UPDATE SET response_json=excluded.response_json,updated_at=excluded.updated_at').bind(key,JSON.stringify(rows.slice(0,30)),now()).run()}catch(e){console.warn('Search persistence unavailable; apply migration 0013_catalog_cache',String(e?.message||e))}}
async function getCached(env,key){const m=hot.get(key);if(m&&now()-m.at<staleMs)return m;const d=await loadDB(env?.DB,key);if(d&&now()-d.at<staleMs){hot.set(key,d);return d}return null}
async function searchCore(type,q,env,ctx,force=false){
 const key=ckey(type,q),cached=await getCached(env,key),age=cached?now()-cached.at:Infinity;
 if(cached&&!force){
  if(age>=freshMs&&ctx?.waitUntil)ctx.waitUntil(searchCore(type,q,env,null,true).catch(()=>{}));
  return {results:cached.rows,cached:true,stale:age>=freshMs,providerStatus:age>=freshMs?'stale':'ok'};
 }
 if(!force){
  const local=await localMediaSearch(type,q,env);
  if(local.length){
   if(ctx?.waitUntil)ctx.waitUntil(searchCore(type,q,env,null,true).catch(()=>{}));
   return {results:local,cached:false,stale:false,providerStatus:'local'};
  }
 }
 if(inFlight.has(key))return inFlight.get(key);
 const work=(async()=>{
  let found=[],unavailable=true;
  if(type==='all'){
   const broad=await quickAll(q,env);
   found=broad.results;unavailable=broad.failed;
  }else{const response=await firstUsable(tasks(type,q),q,type);found=response.results;unavailable=response.failed}
  if(found.length){const packet={rows:found,at:now()};hot.set(key,packet);if(hot.size>220)hot.delete(hot.keys().next().value);const writer=storeDB(env?.DB,key,found);if(ctx?.waitUntil)ctx.waitUntil(writer);else await writer;return {results:found,cached:false,stale:false,providerStatus:'ok'}}
  if(cached)return {results:cached.rows,cached:true,stale:true,providerStatus:'stale'};
  return {results:[],cached:false,stale:false,providerStatus:unavailable?'offline':'empty'};
 })().finally(()=>inFlight.delete(key));inFlight.set(key,work);return work;
}
const allowedHosts=new Set(['upload.wikimedia.org','commons.wikimedia.org','s4.anilist.co','cdn.myanimelist.net','media.kitsu.io','covers.openlibrary.org','books.google.com','books.googleusercontent.com','image.tmdb.org','static.tvmaze.com','t.vndb.org','s.vndb.org','shared.akamai.steamstatic.com','shared.fastly.steamstatic.com','store.steampowered.com','cdn.akamai.steamstatic.com','steamcdn-a.akamaihd.net','book-pic.webnovel.com']);
function permitted(url){try{const u=new URL(url);const host=u.hostname.toLowerCase();return u.protocol==='https:'&&!u.port&&!u.username&&!u.password&&(allowedHosts.has(host)||(/^is\d+-ssl\.mzstatic\.com$/.test(host))||host.endsWith('.googleusercontent.com'))}catch{return false}}
async function serveImage(req,ctx){const raw=new URL(req.url).searchParams.get('url')||'';if(!permitted(raw))return new Response('Image URL not supported',{status:400});const cache=typeof caches!=='undefined'?caches.default:null;
 if(cache){try{const match=await cache.match(req);if(match)return match}catch{}}
 let current=raw;
 for(let attempt=0;attempt<3;attempt++){
  let r;try{const abort=new AbortController();const clock=setTimeout(()=>abort.abort(),4400);try{r=await fetch(current,{redirect:'manual',signal:abort.signal,headers:{Accept:'image/avif,image/webp,image/jpeg,image/png,image/*'}})}finally{clearTimeout(clock)}}catch{return new Response('Image temporarily unavailable',{status:503,headers:{'Cache-Control':'no-store'}})}
  if(r.status>=300&&r.status<400){let next;try{next=new URL(r.headers.get('Location')||'',current).href}catch{return new Response('Image redirect invalid',{status:502})}if(!permitted(next))return new Response('Image redirect blocked',{status:403});current=next;continue}
  if(!r.ok||!(r.headers.get('Content-Type')||'').toLowerCase().startsWith('image/'))return new Response('Image temporarily unavailable',{status:502,headers:{'Cache-Control':'no-store'}});
  const size=Number(r.headers.get('Content-Length')||0);if(size>4500000)return new Response('Image too large',{status:413});
  const headers=new Headers({'Content-Type':r.headers.get('Content-Type')||'image/jpeg','Cache-Control':'public, max-age=604800','X-Content-Type-Options':'nosniff'});
  const response=new Response(r.body,{status:200,headers});if(cache&&ctx?.waitUntil)ctx.waitUntil(cache.put(req,response.clone()).catch(()=>{}));return response;
 }
 return new Response('Image redirect limit reached',{status:502});
}
const artworkPending=new Map(),artworkHot=new Map();
export async function catalogRoute(request,env,ctx){
 if(request.method!=='GET')return null;
 const u=new URL(request.url),path=u.pathname;
 if(path==='/api/search/media/image'||path==='/api/search/v42/image'||path==='/api/search/v41/image')return serveImage(request,ctx);
 if(path==='/api/search/media/diagnostics'||path==='/api/search/v42/diagnostics'){
  const type=TYPES.has(u.searchParams.get('type'))&&u.searchParams.get('type')!=='all'?u.searchParams.get('type'):'anime';
  const probe=u.searchParams.get('q')?.trim().slice(0,80)||(type==='game'?'Elden Ring':type==='manga'?'One Piece':'Naruto');
  const started=now(),providers=[];
  for(const [i,fn] of tasks(type,probe).slice(0,2).entries()){
   const tick=now();
   try {const rows=await fn();providers.push({source:i===0?'primary':'backup',status:'ok',matches:rows.length,elapsedMs:now()-tick});}
   catch(e){providers.push({source:i===0?'primary':'backup',status:String(e?.message||e).slice(0,120),elapsedMs:now()-tick});}
   if(providers[0]?.matches)break;
  }
  let cache='unavailable';try{const row=await env?.DB?.prepare('SELECT COUNT(*) AS n FROM media_catalog_cache').first();cache=row?'ready':'unavailable'}catch(e){cache='missing_or_unavailable';}
  return result({version:'v49',type,query:probe,cache,providers,elapsedMs:now()-started,advice:'The diagnostic is measured by the live Worker; no login required.'});
 }
 if(path==='/api/books/browse'){const q=(u.searchParams.get('q')||'').trim().slice(0,110);if(q.length<2)return result({results:[],hasMore:false,providerStatus:'empty'});return result(await browseBooks(q,u.searchParams.get('offset'),env));}
 if(path==='/api/lightnovels/browse'){const q=(u.searchParams.get('q')||'').trim().slice(0,110);return result(await browseLightNovels(q,u.searchParams.get('offset'),env));}
 if(path==='/api/webnovels/browse'){
  const payload=listWebnovels(await loadWebnovels(env),{
   offset:u.searchParams.get('offset'),limit:u.searchParams.get('limit'),q:u.searchParams.get('q')||''});
  return result(payload);
 }
 if(!['/api/search/media','/api/search/media/cover','/api/search/v42','/api/search/v42/cover','/api/search/v41','/api/search/v41/cover'].includes(path))return null;
 const q=(u.searchParams.get('q')||'').trim().slice(0,110),type=u.searchParams.get('type')||'all';
 if(!TYPES.has(type))return result({error:'Unsupported category',results:[]},400);
 if(q.length<2)return result({results:[],providerStatus:'empty'});
 if(type==='webnovel'&&!path.endsWith('/cover')){
  const directory=await loadWebnovels(env);
  const matches=searchWebnovels(directory,q);
  if(matches.length){
   const local=await localMediaSearch(type,q,env);
   return result({results:rank([...matches,...local],q),providerStatus:directory.rows.length>200?'directory':'local',
     totalCatalogTitles:directory.rows.length,version:'v49'});
  }
 }
 if(path.endsWith('/cover')){
  if(type==='all')return result({cover:'',alternates:[]});
  // Artwork is independent from search. The offline-first catalog deliberately
  // returns some entries without covers; those need an explicit image lookup.
  const id=`artwork:v45:${type}:${norm(q)}`;
  const wantsFreshAlternates=u.searchParams.get('alternate')==='1';
  const memory=artworkHot.get(id);
  if(!wantsFreshAlternates&&memory?.until>now())return result({...memory.value,cached:true});
  const edge=typeof caches!=='undefined'?caches.default:null;
  const edgeKey=new Request('https://mediatok-cache.internal/artwork-v45?'+new URLSearchParams({type,q:norm(q)}));
  if(edge&&!wantsFreshAlternates){
   try{const hit=await edge.match(edgeKey);if(hit){const data=await hit.json();if(data?.cover){artworkHot.set(id,{value:data,until:now()+3600000});return result({...data,cached:true});}}}catch{}
  }
  const saved=await loadDB(env?.DB,id);
  const first=saved?.rows?.[0];
  if(first?.cover&&now()-saved.at<30*86400000&&!wantsFreshAlternates){
   const response={cover:first.cover,alternates:first.coverFallbacks||[]};
   artworkHot.set(id,{value:response,until:now()+3600000});
   return result({...response,cached:true});
  }
  const pendingKey=id+(u.searchParams.get('alternate')==='1'?':alternates':'');
  const existing=artworkPending.get(pendingKey);
  if(existing)return result(await existing);
  const lookup=(async()=>{
   const resultSet=await searchCore(type,q,env,ctx);
   const possible=[],seen=new Set();
   const add=(url)=>{
    if(typeof url!=='string'||!/^https:\/\//i.test(url)||seen.has(url))return;
    seen.add(url);
    // Open Library otherwise returns a tiny blank JPEG with HTTP 200.
    if(url.includes('covers.openlibrary.org/')&&!url.includes('default='))url+=(url.includes('?')?'&':'?')+'default=false';
    possible.push(url);
   };
   if(first?.cover&&u.searchParams.get('alternate')==='1'){add(first.cover);(first.coverFallbacks||[]).forEach(add);}
   const exact=resultSet.results.find(x=>norm(x.title)===norm(q)&&x.cover);
   if(exact){add(exact.cover);(exact.coverFallbacks||[]).forEach(add);}
   // Even when the local index returned a title immediately, consult actual
   // provider artwork. All three providers can be needed when one is throttled.
   const providers=tasks(type,q).slice(0,3);
   const job=fn=>Promise.resolve().then(fn).then(rows=>{
    const matching=rows.filter(x=>norm(x.title)===norm(q) ||
      (norm(q).length>=10&&norm(x.title).startsWith(norm(q))));
    if(!matching.length||!matching.some(x=>x.cover))throw new Error('No exact artwork');
    return matching.slice(0,3);
   });
   const wantsAlternates=u.searchParams.get('alternate')==='1';
   // Run alternate catalog providers only when needed. Searching all of them
   // for every visible poster previously exhausted shared public-API quotas.
   if(!possible.length||wantsAlternates){
    for(const provider of providers){
     const matching=await Promise.race([
      job(provider).catch(()=>[]),
      new Promise(resolve=>setTimeout(()=>resolve([]),1350))
     ]);
     for(const item of matching){
      if(type==='game'&&/^steam-game:\d+$/.test(item.key||'')){
       const appId=item.key.split(':')[1];
       add(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900.jpg`);
       add(`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`);
      }
      add(item.cover);(item.coverFallbacks||[]).forEach(add);
     }
     if(possible.length&&!wantsAlternates)break;
    }
   }
   // Only use exact or close catalog-title matches; do not invent posters
   // for local seed titles that genuinely have no published artwork.
   const out={cover:possible[0]||'',alternates:possible.slice(1,8)};
   if(out.cover){
    artworkHot.set(id,{value:out,until:now()+3600000});
    if(artworkHot.size>450)artworkHot.delete(artworkHot.keys().next().value);
    if(edge){const store=edge.put(edgeKey,new Response(JSON.stringify(out),{headers:{'Content-Type':'application/json','Cache-Control':'public, max-age=604800'}})).catch(()=>{});if(ctx?.waitUntil)ctx.waitUntil(store);}
    const row={cover:out.cover,coverFallbacks:out.alternates};
    // Persist positive covers across Worker restarts; never persist misses.
    const save=storeDB(env?.DB,id,[row]);
    if(ctx?.waitUntil)ctx.waitUntil(save);else await save;
   }
   return out;
  })();
  artworkPending.set(pendingKey,lookup);
  try{return result(await lookup)}finally{artworkPending.delete(pendingKey)}
 }
 const data=await searchCore(type,q,env,ctx,u.searchParams.get('refresh')==='1');return result({...data,version:'v48'});
}
export async function pruneCatalogCache(db){if(!db)return;try{await db.prepare('DELETE FROM media_catalog_cache WHERE updated_at<?').bind(now()-staleMs).run()}catch{}}

// Isolated, read-only media credit enrichment. No D1 reads, writes or migrations.
// Frontend displays catalog creators immediately; this only enriches missing details.
const memory = new Map();
const inflight = new Map();
const TTL = 6 * 60 * 60 * 1000;
const FAIL_TTL = 90 * 1000;
const norm = v => String(v || '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const clean = v => String(v || '').replace(/<[^>]+>/g, '').trim().slice(0, 150);
const p = x => x ? {name:clean(x.name),role:clean(x.role),image:String(x.image||'').startsWith('https://')?x.image:''} : null;
function unique(people, max=14){const seen=new Set();return (people||[]).map(p).filter(x=>{if(!x?.name||seen.has(x.name.toLowerCase()))return false;seen.add(x.name.toLowerCase());return true}).slice(0,max)}
async function jsonFetch(url, options={}, timeout=2600){
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeout);
  try {const result=await fetch(url,{...options,signal:controller.signal,headers:{Accept:'application/json',...(options.headers||{})}});if(!result.ok)throw new Error('Upstream '+result.status);return await result.json()}
  finally {clearTimeout(timer)}
}
function base(data){return {directors:[],creators:[],authors:[],studios:[],cast:[],crew:[],voices:[],source:'catalog',...data}}
async function aniCredits(type,key,title){
  const id=/^anilist:(\d+)$/.exec(key)?.[1];
  const byId=!!id;
  const search=byId?'':', $search:String!';
  const field=byId?'id:$id':'search:$search';
  const query=`query($type:MediaType!${byId?', $id:Int!':search}) { Media(${field},type:$type) { title {english romaji native} staff(perPage:18,sort:RELEVANCE){edges{role node{name{full} image{medium}}}} studios(isMain:true,perPage:5){nodes{name}} characters(perPage:15,sort:ROLE){edges{role node{name{full} image{medium}} voiceActors(language:JAPANESE){name{full} image{medium}}}}} } }`;
  const data=await jsonFetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,variables:{type:type.toUpperCase(),...(byId?{id:Number(id)}:{search:title})}})},3200);
  if(data.errors?.length||!data.data?.Media)throw new Error('AniList returned no credits');
  const m=data.data.Media;
  if(!byId && ![m.title?.english,m.title?.romaji,m.title?.native].some(t=>norm(t)===norm(title)))return base({});
  const crew=unique((m.staff?.edges||[]).map(e=>({name:e.node?.name?.full,role:e.role,image:e.node?.image?.medium})),16);
  const cast=unique((m.characters?.edges||[]).map(e=>({name:e.node?.name?.full,role:e.role,image:e.node?.image?.medium})),15);
  const voices=unique((m.characters?.edges||[]).flatMap(e=>(e.voiceActors||[]).slice(0,1).map(v=>({name:v.name?.full,role:`${e.node?.name?.full||'Character'} · voice actor`,image:v.image?.medium}))),14);
  const authors=type==='manga'?crew.filter(e=>/story|author|original|artist|illustrat/i.test(e.role)).map(e=>e.name).slice(0,8):[];
  const directors=type==='anime'?crew.filter(e=>/director/i.test(e.role)).map(e=>e.name).slice(0,5):[];
  return base({authors,directors,studios:(m.studios?.nodes||[]).map(x=>clean(x.name)).filter(Boolean),crew,cast,voices,source:'AniList'})
}
async function jikanCredits(type,key){
  const match=new RegExp(`^jikan:${type}:(\\d+)$`).exec(key);
  if(!match)return base({});
  const id=match[1];
  if(type==='manga'){
    const d=await jsonFetch(`https://api.jikan.moe/v4/manga/${id}/full`);
    const authors=unique((d.data?.authors||[]).map(x=>({name:x.name,role:'Author',image:''})),10);
    return base({authors:authors.map(x=>x.name),crew:authors,source:'MyAnimeList'});
  }
  const d=await jsonFetch(`https://api.jikan.moe/v4/anime/${id}/staff`);
  const crew=unique((d.data||[]).map(x=>({name:x.person?.name,role:(x.positions||[]).join(', '),image:x.person?.images?.jpg?.image_url})),16);
  return base({crew,directors:crew.filter(x=>/director/i.test(x.role)).map(x=>x.name),source:'MyAnimeList'});
}
async function tmdbCredits(type,key,title,year,env){
  if(!env.TMDB_API_KEY)return base({});
  const kind=type==='film'?'movie':'tv', match=/^tmdb-(movie|tv):(\d+)$/.exec(key);
  let id=match&&match[1]===kind?match[2]:'';
  if(!id){
    const params=new URLSearchParams({api_key:env.TMDB_API_KEY,query:title});if(kind==='movie'&&/^\d{4}$/.test(year))params.set('year',year);
    const d=await jsonFetch(`https://api.themoviedb.org/3/search/${kind}?${params}`);
    const item=(d.results||[]).find(x=>norm(kind==='movie'?x.title:x.name)===norm(title));if(!item)return base({});id=item.id;
  }
  const params=new URLSearchParams({api_key:env.TMDB_API_KEY,append_to_response:kind==='movie'?'credits':'aggregate_credits'});
  const d=await jsonFetch(`https://api.themoviedb.org/3/${kind}/${id}?${params}`);
  const raw=kind==='movie'?d.credits||{}:d.aggregate_credits||{};
  const img=x=>x?`https://image.tmdb.org/t/p/w185${x}`:'';
  const crew=unique((raw.crew||[]).filter(x=>/director|writer|story|creator/i.test([x.job,...(x.jobs||[]).map(j=>j.job)].join(' '))).map(x=>({name:x.name,role:x.job||(x.jobs||[]).map(y=>y.job).join(', '),image:img(x.profile_path)})),12);
  const cast=unique((raw.cast||[]).map(x=>({name:x.name,role:x.character||(x.roles||[]).map(y=>y.character).join(', '),image:img(x.profile_path)})),18);
  return base({directors:crew.filter(x=>/director/i.test(x.role)).map(x=>x.name),creators:(d.created_by||[]).map(x=>clean(x.name)),crew,cast,source:'TMDB'});
}
async function tvmazeCredits(key,title){
  let id=/^tvmaze:(\d+)$/.exec(key)?.[1];
  if(!id){const d=await jsonFetch(`https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(title)}`);if(norm(d.name)!==norm(title))return base({});id=d.id}
  const d=await jsonFetch(`https://api.tvmaze.com/shows/${id}?embed[]=cast&embed[]=crew`);
  const cast=unique((d._embedded?.cast||[]).map(x=>({name:x.person?.name,role:x.character?.name,image:x.person?.image?.medium})),18);
  const crew=unique((d._embedded?.crew||[]).filter(x=>/creator|director|writer/i.test(x.type)).map(x=>({name:x.person?.name,role:x.type,image:x.person?.image?.medium})),12);
  return base({crew,cast,directors:crew.filter(x=>/director/i.test(x.role)).map(x=>x.name),source:'TVmaze'});
}
async function googleBooksCredits(key,title){
  if(!/^(googlebooks|openlibrary)/.test(key))return base({});
  const d=await jsonFetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent('intitle:'+title)}&maxResults=5`);
  const item=(d.items||[]).find(x=>norm(x.volumeInfo?.title)===norm(title));
  return base({authors:(item?.volumeInfo?.authors||[]).map(clean),source:'Google Books'});
}
async function lookup(type,key,title,year,env){
  if(['anime','manga'].includes(type)){
    try {const a=await aniCredits(type,key,title);if(a.crew.length||a.cast.length||a.studios.length||a.authors.length)return a} catch {}
    if(key.startsWith(`jikan:${type}:`))return jikanCredits(type,key);
    return base({});
  }
  if(type==='film')return tmdbCredits(type,key,title,year,env);
  if(type==='tv'){
    if(env.TMDB_API_KEY){try{const t=await tmdbCredits(type,key,title,year,env);if(t.cast.length||t.crew.length)return t}catch{}}
    return tvmazeCredits(key,title);
  }
  if(['novel','light-novel','webnovel','comic','manga'].includes(type))return googleBooksCredits(key,title);
  return base({});
}
export async function creditRoute(request,env,ctx){
  const url=new URL(request.url);if(url.pathname!=='/api/credits/v53')return null;
  if(request.method!=='GET')return new Response('Method not allowed',{status:405});
  const type=String(url.searchParams.get('type')||'').slice(0,32).toLowerCase();
  const title=clean(url.searchParams.get('title')).slice(0,120);
  const key=String(url.searchParams.get('key')||'').slice(0,130);
  const year=String(url.searchParams.get('year')||'').slice(0,4);
  if(!/^(anime|manga|film|tv|novel|light-novel|webnovel|comic|game|visual-novel)$/.test(type)||!title)return new Response(JSON.stringify({error:'Invalid media credit query'}),{status:400,headers:{'Content-Type':'application/json'}});
  const cacheKey=`${type}|${key}|${norm(title)}|${year}`;
  const now=Date.now();const existing=memory.get(cacheKey);
  const output=(value,source)=>new Response(JSON.stringify({...value,cache:source}),{headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'public,max-age=300,s-maxage=21600','X-Content-Type-Options':'nosniff'}});
  if(existing&&existing.expires>now)return output(existing.value,'memory');
  const edge=typeof caches === 'undefined' ? null : caches.default;
  const canonical=new Request(new URL(`/api/credits/v53?${new URLSearchParams({type,title,key,year})}`,url.origin).href);
  if(edge){try {const cached=await edge.match(canonical);if(cached){const val=await cached.json();memory.set(cacheKey,{value:val,expires:now+TTL});return output(val,'edge')}}catch{}}
  let task=inflight.get(cacheKey);
  if(!task){task=(async()=>{try {return await lookup(type,key,title,year,env)}catch{return base({})}})();inflight.set(cacheKey,task);task.finally(()=>inflight.delete(cacheKey))}
  const value=await task;
  const hasData=!!(value.crew.length||value.cast.length||value.directors.length||value.creators.length||value.authors.length||value.studios.length);
  memory.set(cacheKey,{value,expires:now+(hasData?TTL:FAIL_TTL)});
  if(memory.size>800){const first=memory.keys().next().value;memory.delete(first)}
  if(hasData&&edge&&ctx?.waitUntil){ctx.waitUntil(edge.put(canonical,new Response(JSON.stringify(value),{headers:{'Cache-Control':'public,max-age=21600','Content-Type':'application/json'}})).catch(()=>{}))}
  return output(value,'live');
}

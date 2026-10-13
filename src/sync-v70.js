const safeJSON=value=>{try{return value?JSON.parse(value):{}}catch{return {}}};
const cleanText=value=>String(value??'').trim();
const clampRating=value=>{if(value===null||value===undefined||value==='')return null;const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(10,n)):null};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const statusOf=value=>{const s=String(value||'').toLowerCase();if(/completed|finished/.test(s))return 'Completed';if(/current|watching|reading|playing|in.?progress/.test(s))return 'In progress';if(/dropped|abandoned/.test(s))return 'Dropped';if(/paused|stalled|on.?hold/.test(s))return 'On hold';return 'Planning'};
const noteFor=service=>`Imported from ${{anilist:'AniList',mal:'MyAnimeList',vndb:'VNDB',letterboxd:'Letterboxd'}[service]||service}`;

async function fetchJSON(url,options={}){
 const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),7000);
 try{const res=await fetch(url,{...options,signal:ctrl.signal,headers:{Accept:'application/json',...(options.headers||{})}});if(!res.ok)throw new Error(`Upstream ${res.status}`);return await res.json()}finally{clearTimeout(timer)}
}

export async function fetchAniListEntries(username){
 const query='query($name:String!,$type:MediaType!){MediaListCollection(userName:$name,type:$type){lists{entries{status progress score media{id title{english romaji native} coverImage{extraLarge large medium} startDate{year} type format}}}}}';
 const rows=[];
 for(const mediaType of ['ANIME','MANGA']){
  const data=await fetchJSON('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,variables:{name:username,type:mediaType}})});
  if(data.errors?.length)throw new Error(data.errors[0]?.message||'AniList list unavailable');
  for(const list of data.data?.MediaListCollection?.lists||[])for(const e of list.entries||[]){const m=e.media;if(!m?.id)continue;const type=mediaType==='ANIME'?'anime':(String(m.format||'').toUpperCase()==='NOVEL'?'light-novel':'manga');rows.push({key:`anilist:${m.id}`,type,title:m.title?.english||m.title?.romaji||m.title?.native||`AniList ${m.id}`,cover:m.coverImage?.extraLarge||m.coverImage?.large||m.coverImage?.medium||'',year:m.startDate?.year||'',status:statusOf(e.status),progress:Number(e.progress)||0,rating:e.score?Math.min(10,Number(e.score)/10):null});}
 }
 return rows;
}

export async function fetchMalEntries(username){
 const rows=[];
 for(const mt of [{path:'animelist',type:'anime'},{path:'mangalist',type:'manga'}]){
  for(let page=1;page<=60;page++){
   const data=await fetchJSON(`https://api.jikan.moe/v4/users/${encodeURIComponent(username)}/${mt.path}?limit=25&page=${page}`);
   const items=Array.isArray(data.data)?data.data:[];
   for(const e of items){const m=e[mt.type]||e;const title=m.title||m.title_english;if(!title)continue;const malType=String(m.type||e.type||'');const type=mt.type==='manga'&&/\b(light\s*novel|novel)\b/i.test(malType)?'light-novel':mt.type;rows.push({key:`mal:${mt.type}:${m.mal_id||title}`,type,title,cover:m.images?.jpg?.large_image_url||m.images?.webp?.large_image_url||m.images?.jpg?.image_url||'',year:m.year||String(m.published?.from||'').slice(0,4),status:statusOf(e.status),progress:Number(e.episodes_watched||e.chapters_read||0),rating:e.score?Math.min(10,Number(e.score)):null});}
   if(!data.pagination?.has_next_page||!items.length)break;
   await sleep(340);
  }
 }
 return rows;
}

export async function lookupVndbUser(username){
 const q=cleanText(username).replace(/^@/,'');if(!q)return null;
 const data=await fetchJSON(`https://api.vndb.org/kana/user?q=${encodeURIComponent(q)}`);
 return data[q]||Object.values(data||{}).find(v=>v&&String(v.username||'').toLowerCase()===q.toLowerCase())||null;
}

export async function fetchVndbEntries(username){
 const user=await lookupVndbUser(username);if(!user?.id)throw new Error('VNDB user not found');
 const rows=[];
 for(let page=1;page<=40;page++){
  const data=await fetchJSON('https://api.vndb.org/kana/ulist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user:user.id,fields:'id, vote, started, finished, labels, vn.title, vn.released, vn.image.url',results:100,page,sort:'lastmod',reverse:true})});
  const items=Array.isArray(data.results)?data.results:[];
  for(const e of items){const vn=e.vn||{};const title=vn.title||e.title;if(!title)continue;const labels=(e.labels||[]).map(x=>String(x.label||'')).join(' ');const status=e.finished?'Completed':statusOf(labels);rows.push({key:`vndb:${vn.id||e.id}`,type:'visual-novel',title,cover:vn.image?.url||'',year:String(vn.released||'').slice(0,4),status,progress:0,rating:e.vote?Math.max(0,Math.min(10,Number(e.vote)/10)):null});}
  if(!data.more||!items.length)break;
 }
 return {user,entries:rows};
}

function xmlText(block,tag){const m=block.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,'i'));return m?m[1].replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim():''}
export async function fetchLetterboxdEntries(username){
 const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),7000);
 try{
  const res=await fetch(`https://letterboxd.com/${encodeURIComponent(username)}/rss/`,{signal:ctrl.signal,headers:{Accept:'application/rss+xml,application/xml,text/xml'}});if(!res.ok)throw new Error(`Letterboxd RSS ${res.status}`);const xml=await res.text();const items=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(m=>m[1]);const rows=[];
  for(const item of items){const title=xmlText(item,'letterboxd:filmTitle')||xmlText(item,'title').replace(/,\s*\d{4}\s*[-–].*$/,'').trim();if(!title)continue;const year=xmlText(item,'letterboxd:filmYear');const rating=Number(xmlText(item,'letterboxd:memberRating'));const link=xmlText(item,'link');const id=(link.match(/\/film\/([^/]+)/)||[])[1]||title.toLowerCase().replace(/[^a-z0-9]+/g,'-');rows.push({key:`letterboxd:${id}`,type:'film',title,cover:'',year,status:'Completed',progress:0,rating:Number.isFinite(rating)&&rating>0?Math.min(10,rating*2):null});}
  return rows;
 }finally{clearTimeout(timer)}
}

export async function fetchExternalEntries(service,username){
 if(service==='anilist')return await fetchAniListEntries(username);
 if(service==='mal')return await fetchMalEntries(username);
 if(service==='vndb')return (await fetchVndbEntries(username)).entries;
 if(service==='letterboxd')return await fetchLetterboxdEntries(username);
 throw new Error('Unsupported sync service');
}

export async function upsertExternalEntries(db,userId,service,entries){
 const clean=[];const seen=new Set();
 for(const raw of entries||[]){const type=String(raw?.type||'');const title=cleanText(raw?.title).slice(0,200),key=cleanText(raw?.key).slice(0,240);if(!['anime','manga','light-novel','visual-novel','film'].includes(type)||!title||!key||seen.has(key))continue;seen.add(key);clean.push({...raw,type,title,key});}
 if(!clean.length)return {processed:0,changed:0};
 const now=Date.now(),note=noteFor(service);let changed=0;
 // Earlier MediaTok file imports used `anilist:file:<id>` while account sync uses
 // `anilist:<id>`. Normalize those old keys before upserting so an existing
 // Light Novel is moved from Manga instead of duplicated.
 if(service==='anilist'){
  for(const x of clean){const m=String(x.key).match(/^anilist:(\d+)$/);if(!m)continue;const oldKey=`anilist:file:${m[1]}`;
   const existing=await db.prepare('SELECT id FROM media_logs WHERE user_id=? AND media_key=? LIMIT 1').bind(userId,x.key).first();
   if(existing){await db.prepare('DELETE FROM media_logs WHERE user_id=? AND media_key=?').bind(userId,oldKey).run();}
   else {try{const r=await db.prepare('UPDATE media_logs SET media_key=?,media_type=?,updated_at=? WHERE user_id=? AND media_key=?').bind(x.key,x.type,now,userId,oldKey).run();changed+=Number(r?.meta?.changes||0)}catch{}}
  }
 }
 for(let i=0;i<clean.length;i+=40){const stmts=clean.slice(i,i+40).map(x=>db.prepare(`INSERT INTO media_logs(user_id,media_key,media_type,title,cover,media_year,status,progress,rating,note,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,media_key) DO UPDATE SET media_type=excluded.media_type,title=excluded.title,cover=CASE WHEN excluded.cover='' THEN media_logs.cover ELSE excluded.cover END,media_year=excluded.media_year,status=excluded.status,progress=excluded.progress,rating=CASE WHEN excluded.rating IS NULL THEN media_logs.rating ELSE excluded.rating END,updated_at=excluded.updated_at WHERE media_logs.media_type<>excluded.media_type OR media_logs.title<>excluded.title OR (excluded.cover<>'' AND media_logs.cover<>excluded.cover) OR media_logs.media_year<>excluded.media_year OR media_logs.status<>excluded.status OR media_logs.progress<>excluded.progress OR (excluded.rating IS NOT NULL AND COALESCE(media_logs.rating,-1)<>excluded.rating)`).bind(userId,x.key,x.type,x.title,String(x.cover||'').slice(0,1000),String(x.year||'').slice(0,12),statusOf(x.status),Math.max(0,Math.min(100000,Number(x.progress)||0)),clampRating(x.rating),note,now,now));const result=await db.batch(stmts);for(const r of result||[])changed+=Number(r?.meta?.changes||0);}
 return {processed:clean.length,changed};
}

export function autoSyncSettings(user){const stats=safeJSON(user?.stats);const prefs=stats._autoSync&&typeof stats._autoSync==='object'?stats._autoSync:{};return {stats,prefs};}
export async function setAutoSync(db,user,service,enabled){const {stats,prefs}=autoSyncSettings(user);prefs[service]=!!enabled;stats._autoSync=prefs;await db.prepare('UPDATE users SET stats=?,updated_at=? WHERE id=?').bind(JSON.stringify(stats),Date.now(),user.id).run();return prefs;}
export async function syncService(db,user,service,{force=true}={}){
 const links=safeJSON(user.links),username=links[service];if(!username)throw new Error(`Link ${service} first`);
 const stats=safeJSON(user.stats),record=stats[service]&&typeof stats[service]==='object'?stats[service]:{};
 if(!force&&Date.now()-Number(record.listSyncedAt||0)<30*60*1000)return {service,skipped:true,processed:0,changed:0};
 const entries=await fetchExternalEntries(service,username);const result=await upsertExternalEntries(db,user.id,service,entries);
 record.listSyncedAt=Date.now();record.listCount=result.processed;record.lastSyncChanged=result.changed;stats[service]=record;
 await db.prepare('UPDATE users SET stats=? WHERE id=?').bind(JSON.stringify(stats),user.id).run();
 return {service,imported:result.processed,changed:result.changed};
}
export async function autoSyncUser(db,user,{force=false,services=null}={}){
 const links=safeJSON(user.links),{prefs}=autoSyncSettings(user);const live=services||['anilist','mal','vndb','letterboxd'];const results=[];
 let fresh=user;
 for(const service of live){if(!links[service])continue;if(prefs[service]===false)continue;try{const out=await syncService(db,fresh,service,{force});results.push(out);fresh=await db.prepare('SELECT * FROM users WHERE id=?').bind(user.id).first()||fresh;}catch(error){results.push({service,error:String(error?.message||error)})}}
 return results;
}
export async function scheduledAutoSync(db,limit=12){
 let rows=[];try{const out=await db.prepare("SELECT * FROM users WHERE banned=0 AND (links LIKE '%anilist%' OR links LIKE '%mal%' OR links LIKE '%vndb%' OR links LIKE '%letterboxd%') ORDER BY updated_at DESC LIMIT ?").bind(Math.max(1,Math.min(30,Number(limit)||12))).all();rows=out.results||[]}catch{return []}
 const results=[];for(const user of rows){results.push({user:user.id,results:await autoSyncUser(db,user,{force:false})});await sleep(120)}return results;
}

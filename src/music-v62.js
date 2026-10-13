// v62 public Last.fm music showcase. Uses the existing users.socials JSON column;
// never sends LASTFM_API_KEY to the browser or stores access tokens.
const reply=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
function parseObject(value){try{const result=typeof value==='string'?JSON.parse(value||'{}'):value;return result&&typeof result==='object'&&!Array.isArray(result)?result:{}}catch{return {}}}
export function sanitizeMusic(raw){
 const obj=parseObject(raw),lastfm=String(obj.lastfm||'').trim().replace(/^@/,'');
 if(lastfm&&!/^[a-zA-Z0-9_+.-]{1,45}$/.test(lastfm))throw new Error('Enter a valid Last.fm username (letters, numbers, dots, dashes or underscores).');
 const mode=obj.musicMode==='favorites'?'favorites':'recent';
 const entries=Array.isArray(obj.musicFavorites)?obj.musicFavorites:[];
 if(entries.length>4)throw new Error('You can select up to four favorite artists or songs.');
 const favorites=entries.map(x=>({type:x?.type==='song'?'song':'artist',name:String(x?.name||'').trim().slice(0,100),artist:String(x?.artist||'').trim().slice(0,100)})).filter(x=>x.name);
 if(favorites.some(x=>x.type==='song'&&!x.artist))throw new Error('Enter the performing artist for each favorite song.');
 return {lastfm,musicMode:mode,musicFavorites:favorites};
}
export function recentArtistsFromLastfm(body){
 const tracks=body?.recenttracks?.track||[];
 const seen=new Set(),out=[];
 for(const item of (Array.isArray(tracks)?tracks:[tracks])){
  const artist=typeof item?.artist==='string'?item.artist:String(item?.artist?.['#text']||item?.artist?.name||'').trim();
  if(!artist||seen.has(artist.toLocaleLowerCase('en')))continue;
  seen.add(artist.toLocaleLowerCase('en'));
  const images=Array.isArray(item.image)?item.image:[];
  const image=(images.find(x=>x.size==='extralarge'&&x['#text'])||images.find(x=>x.size==='large'&&x['#text'])||images.find(x=>x.size==='medium'&&x['#text'])||{} )['#text']||'';
  out.push({type:'artist',name:artist,artist:'',image:/^https:\/\//i.test(image)?image:'',url:'https://www.last.fm/music/'+encodeURIComponent(artist)});
  if(out.length>=4)break;
 }
 return out;
}
const memo=new Map();
export async function handleMusicRoute(request,env,ctx,getAuthenticatedUser){
 const url=new URL(request.url),path=url.pathname;
 if(!['/api/music/v62','/api/music/v62/preferences','/api/music/v63','/api/music/v63/preferences'].includes(path))return null;
 if(path.endsWith('/preferences')){
  if(request.method!=='POST')return reply({error:'Method not allowed'},405);
  const me=await getAuthenticatedUser(request,env);if(!me)return reply({error:'Sign in to edit your music.'},401);
  let body;try{body=await request.json()}catch{return reply({error:'Invalid JSON'},400)}
  let music;try{music=sanitizeMusic(body)}catch(e){return reply({error:e.message},400)}
  // Get current socials at update time to avoid clobbering connected social links.
  const row=await env.DB.prepare('SELECT socials FROM users WHERE id=?').bind(me.id).first();
  if(!row)return reply({error:'Account not found'},404);
  const socials={...parseObject(row.socials),...music};
  await env.DB.prepare('UPDATE users SET socials=?,updated_at=? WHERE id=?').bind(JSON.stringify(socials),Date.now(),me.id).run();
  return reply({ok:true,music});
 }
 if(request.method!=='GET')return reply({error:'Method not allowed'},405);
 const profile=String(url.searchParams.get('profile')||'').trim();
 if(!/^[a-zA-Z0-9_-]{3,32}$/.test(profile))return reply({error:'Invalid profile'},400);
 const row=await env.DB.prepare('SELECT name,socials FROM users WHERE name=? COLLATE NOCASE').bind(profile).first();
 if(!row)return reply({error:'Profile not found'},404);
 const data=parseObject(row.socials);let music;
 try{music=sanitizeMusic(data)}catch{music={lastfm:'',musicMode:'favorites',musicFavorites:[]}}
 const favorites=music.musicFavorites.map(x=>({...x,image:'',url:x.type==='song'?'https://www.last.fm/music/'+encodeURIComponent(x.artist)+'/_/'+encodeURIComponent(x.name):'https://www.last.fm/music/'+encodeURIComponent(x.name)}));
 if(music.musicMode==='favorites'||!music.lastfm)return reply({mode:music.musicMode,lastfm:music.lastfm,items:favorites.slice(0,4),connected:!!music.lastfm,source:'favorites'});
 const key=String(env.LASTFM_API_KEY||env.LAST_FM_API_KEY||env.LASTFM_KEY||env.LAST_FM_KEY||env.LASTFM_API||'').trim();
 if(!key)return reply({mode:'recent',connected:true,source:'unconfigured',items:favorites.slice(0,4),message:'Last.fm API key missing on MediaTok Worker. The site administrator must configure the LASTFM_API_KEY secret.'});
 const cacheKey=music.lastfm.toLocaleLowerCase('en'),old=memo.get(cacheKey);
 if(old&&old.expires>Date.now())return reply({mode:'recent',connected:true,source:'lastfm-cache',items:old.items});
 const endpoint=new URL('https://ws.audioscrobbler.com/2.0/');
 endpoint.search=new URLSearchParams({method:'user.getrecenttracks',user:music.lastfm,api_key:key,format:'json',limit:'35'}).toString();
 try{
  const response=await fetch(endpoint.toString(),{signal:AbortSignal.timeout(4200),headers:{'Accept':'application/json'}});
  if(!response.ok)throw Error('Last.fm HTTP '+response.status);
  const payload=await response.json();if(payload.error)throw Error('Last.fm API '+payload.error+': '+String(payload.message||''));
  const items=recentArtistsFromLastfm(payload);
  memo.set(cacheKey,{items,expires:Date.now()+300000});
  if(memo.size>300)memo.delete(memo.keys().next().value);
  return reply({mode:'recent',connected:true,source:'lastfm',items, message:items.length?'':'No recent listening found for this Last.fm username. Check its spelling and scrobbling history.'});
 }catch(e){
  const detail=String(e?.message||'');
  const badUser=/Last.fm API (6|17):/.test(detail);
  const badKey=/Last.fm API (10|26):/.test(detail);
  const message=badUser?'Last.fm could not find this username. Check the name in Edit music.':badKey?'MediaTok Last.fm API key was rejected. The site administrator needs to replace it.':/Last.fm HTTP 429/.test(detail)?'Last.fm is rate-limiting requests. Try again in a few minutes.':'Last.fm could not be reached. Favorites can still be displayed.';
  return reply({mode:'recent',connected:true,source:badUser?'invalid_user':badKey?'invalid_key':'unavailable',items:old?.items||favorites.slice(0,4),message});
 }
}

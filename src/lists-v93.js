// MediaTok v93: standalone, ownership-checked Custom Lists API.
// No dependency on, or mutation of, media_logs/profile layouts.
const respond=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const fail=(message,status=400)=>respond({error:message},status);
const kinds=new Set(['anime','manga','film','tv','novel','light-novel','webnovel','comic','game','visual-novel']);
const visibilityValues=new Set(['public','unlisted','private']);
const intID=v=>/^[1-9]\d{0,11}$/.test(String(v))?Number(v):null;
const sanitized=(v,max)=>String(v??'').trim().slice(0,max);
const coverURL=v=>{const url=sanitized(v,1000);return /^https:\/\/[^\s"<>]+$/i.test(url)?url:''};
const mediaKey=(type,key,title)=>sanitized(key,250)||`${type}:${title.normalize('NFKC').toLocaleLowerCase('en-US')}`.slice(0,250);
async function payload(request){try {const b=await request.json();return b&&typeof b==='object'&&!Array.isArray(b)?b:null}catch{return null}}
const owner=(list,actor)=>!!actor&&list.user_id===actor.id;
const visible=(list,actor,token)=>owner(list,actor)||list.visibility==='public'||(list.visibility==='unlisted'&&token===list.share_token);
const expose=(list,actor)=>({id:list.id,title:list.title,description:list.description,visibility:list.visibility,ranked:!!list.ranked,createdAt:list.created_at,updatedAt:list.updated_at,itemCount:Number(list.item_count||0),owner:{name:list.owner_name||'',id:list.user_id},...(owner(list,actor)?{shareToken:list.share_token}:{})});
export async function handleListRoute(request,env,url,actor){
 const db=env.DB,method=request.method,route=url.pathname;
 if(route==='/api/lists'&&method==='GET'){
  const mine=url.searchParams.get('mine')==='1';const name=sanitized(url.searchParams.get('user'),24);
  if(mine&&!actor)return fail('Sign in to see your lists.',401);
  let rows;
  const base=`SELECT l.*,u.name owner_name,(SELECT COUNT(*) FROM user_list_items i WHERE i.list_id=l.id) item_count FROM user_lists l JOIN users u ON u.id=l.user_id`;
  if(mine)rows=await db.prepare(`${base} WHERE l.user_id=? ORDER BY l.updated_at DESC LIMIT 50`).bind(actor.id).all();
  else if(name)rows=await db.prepare(`${base} WHERE u.name=? COLLATE NOCASE AND l.visibility='public' ORDER BY l.updated_at DESC LIMIT 50`).bind(name).all();
  else rows=await db.prepare(`${base} WHERE l.visibility='public' ORDER BY l.updated_at DESC LIMIT 60`).all();
  return respond({lists:(rows.results||[]).map(l=>expose(l,actor))});
 }
 if(route==='/api/lists'&&method==='POST'){
  if(!actor)return fail('Sign in to create a list.',401);
  const b=await payload(request);if(!b)return fail('Invalid JSON.');
  const title=sanitized(b.title,90),description=sanitized(b.description,1200),visibility=sanitized(b.visibility,16)||'public';
  if(!title)return fail('List title is required.');if(!visibilityValues.has(visibility))return fail('Invalid visibility.');
  const count=await db.prepare('SELECT COUNT(*) total FROM user_lists WHERE user_id=?').bind(actor.id).first();
  if(Number(count?.total||0)>=40)return fail('Maximum of 40 lists per account.',409);
  const now=Date.now(),token=crypto.randomUUID().replace(/-/g,'')+crypto.randomUUID().replace(/-/g,'');
  const out=await db.prepare('INSERT INTO user_lists(user_id,title,description,visibility,ranked,share_token,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)').bind(actor.id,title,description,visibility,b.ranked===false?0:1,token,now,now).run();
  return respond({ok:true,id:out.meta.last_row_id,shareToken:token},201);
 }
 const match=route.match(/^\/api\/lists\/([1-9]\d{0,11})(?:\/(items|reorder)(?:\/([1-9]\d{0,11}))?)?$/);
 if(!match)return fail('List endpoint not found.',404);
 const id=intID(match[1]),child=match[2],itemId=intID(match[3]);
 const list=await db.prepare('SELECT l.*,u.name owner_name,(SELECT COUNT(*) FROM user_list_items i WHERE i.list_id=l.id) item_count FROM user_lists l JOIN users u ON u.id=l.user_id WHERE l.id=?').bind(id).first();
 if(!list)return fail('List not found.',404);
 const self=owner(list,actor),token=url.searchParams.get('token')||'';
 if(method==='GET'&&!child){if(!visible(list,actor,token))return fail('List not found.',404);
  const rows=await db.prepare('SELECT id,media_key,media_type,title,cover,media_year,note,position,created_at FROM user_list_items WHERE list_id=? ORDER BY position ASC,id ASC LIMIT 250').bind(id).all();
  return respond({list:expose(list,actor),items:(rows.results||[]).map(x=>({id:x.id,mediaKey:x.media_key,mediaType:x.media_type,title:x.title,cover:x.cover,year:x.media_year,note:x.note,position:x.position}))});
 }
 if(!self)return fail(actor?'You can only edit your own lists.':'Sign in to manage lists.',actor?403:401);
 if(method==='DELETE'&&!child){await db.prepare('DELETE FROM user_lists WHERE id=? AND user_id=?').bind(id,actor.id).run();return respond({ok:true})}
 if(method==='PATCH'&&!child){const b=await payload(request);if(!b)return fail('Invalid JSON.');
  const title=b.title===undefined?list.title:sanitized(b.title,90),description=b.description===undefined?list.description:sanitized(b.description,1200),visibility=b.visibility===undefined?list.visibility:sanitized(b.visibility,16),ranked=b.ranked===undefined?list.ranked:(b.ranked?1:0);
  if(!title||!visibilityValues.has(visibility))return fail('Invalid title or visibility.');
  await db.prepare('UPDATE user_lists SET title=?,description=?,visibility=?,ranked=?,updated_at=? WHERE id=? AND user_id=?').bind(title,description,visibility,ranked,Date.now(),id,actor.id).run();return respond({ok:true});
 }
 if(child==='items'&&method==='POST'&&!itemId){const b=await payload(request);if(!b)return fail('Invalid JSON.');
  const type=sanitized(b.mediaType,30),title=sanitized(b.title,200);if(!kinds.has(type)||!title)return fail('Choose a valid media type and title.');
  const count=await db.prepare('SELECT COUNT(*) total,COALESCE(MAX(position),0) max_position FROM user_list_items WHERE list_id=?').bind(id).first();
  if(Number(count?.total||0)>=150)return fail('Maximum of 150 items per list.',409);
  const key=mediaKey(type,b.mediaKey,title);if(!key)return fail('Media reference required.');
  try{const out=await db.prepare('INSERT INTO user_list_items(list_id,media_key,media_type,title,cover,media_year,note,position,created_at) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,key,type,title,coverURL(b.cover),sanitized(b.year,12),sanitized(b.note,800),Number(count?.max_position||0)+1,Date.now()).run();
    await db.prepare('UPDATE user_lists SET updated_at=? WHERE id=?').bind(Date.now(),id).run();return respond({ok:true,id:out.meta.last_row_id},201);
  }catch(e){if(/UNIQUE|constraint/i.test(String(e?.message)))return fail('This title is already in the list.',409);throw e}
 }
 if(child==='items'&&itemId&&method==='DELETE'){
  const out=await db.prepare('DELETE FROM user_list_items WHERE id=? AND list_id=?').bind(itemId,id).run();if(!out.meta.changes)return fail('List item not found.',404);
  await db.prepare('UPDATE user_lists SET updated_at=? WHERE id=?').bind(Date.now(),id).run();return respond({ok:true});
 }
 if(child==='items'&&itemId&&method==='PATCH'){
  const b=await payload(request);if(!b)return fail('Invalid JSON.');
  const note=sanitized(b.note,800);const out=await db.prepare('UPDATE user_list_items SET note=? WHERE id=? AND list_id=?').bind(note,itemId,id).run();if(!out.meta.changes)return fail('List item not found.',404);return respond({ok:true});
 }
 if(child==='reorder'&&method==='POST'){
  const b=await payload(request),positions=b?.itemIds;
  if(!Array.isArray(positions)||positions.length>150||!positions.every(x=>intID(x)!==null)||new Set(positions.map(Number)).size!==positions.length)return fail('Invalid item order.');
  const rows=await db.prepare('SELECT id FROM user_list_items WHERE list_id=?').bind(id).all();const current=(rows.results||[]).map(x=>x.id);
  if(current.length!==positions.length||positions.some(x=>!current.includes(Number(x))))return fail('Item order must include every item exactly once.',409);
  await db.batch([...positions.map((v,i)=>db.prepare('UPDATE user_list_items SET position=? WHERE list_id=? AND id=?').bind(i+1,id,Number(v))),db.prepare('UPDATE user_lists SET updated_at=? WHERE id=?').bind(Date.now(),id)]);return respond({ok:true});
 }
 return fail('Unsupported list operation.',405);
}

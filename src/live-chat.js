import { DurableObject } from 'cloudflare:workers';

const HOUR = 3_600_000;
const MAX_IMAGE = 700 * 1024;
const MAX_MESSAGES = 180;
const MAX_IMAGES = 80;
const MAX_CLIENTS = 350;
const TYPES = { 'image/jpeg': [0xff,0xd8,0xff], 'image/png':[0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a], 'image/gif':[0x47,0x49,0x46,0x38], 'image/webp':[0x52,0x49,0x46,0x46] };
const err = (error, code = 400) => Response.json({error}, {status:code, headers:{'Cache-Control':'no-store'}});
const json = data => Response.json(data, {headers:{'Cache-Control':'no-store'}});

// SQLite-backed Durable Object: one live forum room, WebSocket hibernation and UTC-hour resets.
// Chat is deliberately isolated from the existing D1 forum tables and user collections.
export class ForumLiveRoom extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY, hour INTEGER NOT NULL, user_id TEXT NOT NULL,
      author TEXT NOT NULL, avatar TEXT NOT NULL, role TEXT NOT NULL,
      body TEXT NOT NULL, image_id TEXT, created_at INTEGER NOT NULL
    )`);
    this.sql.exec('CREATE INDEX IF NOT EXISTS idx_chat_recent ON chat_messages(created_at)');
    // Upgrade the existing room in place; never recreate or clear it when deploying.
    const columns = this.sql.exec('PRAGMA table_info(chat_messages)').toArray().map(x=>x.name);
    if (!columns.includes('reply_to')) this.sql.exec('ALTER TABLE chat_messages ADD COLUMN reply_to TEXT');
    this.sql.exec(`CREATE TABLE IF NOT EXISTS chat_reactions (message_id TEXT NOT NULL, user_id TEXT NOT NULL, emoji TEXT NOT NULL, PRIMARY KEY(message_id,user_id,emoji))`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS chat_images (
      id TEXT PRIMARY KEY, hour INTEGER NOT NULL, owner_id TEXT NOT NULL,
      mime TEXT NOT NULL, content BLOB NOT NULL, created_at INTEGER NOT NULL
    )`);
    this.postTimes = new Map();
    this.uploadTimes = new Map();
  }

  get online() { return this.ctx.getWebSockets().length; }
  broadcast(payload) {
    const wire = JSON.stringify(payload);
    for (const ws of this.ctx.getWebSockets()) {
      try { ws.send(wire); } catch { /* clients disconnect independently */ }
    }
  }
  async ensureHour() {
    const hour = Math.floor(Date.now() / HOUR);
    const stored = this.ctx.storage.kv.get('active_hour');
    if (stored !== hour) {
      this.sql.exec('DELETE FROM chat_messages');
      this.sql.exec('DELETE FROM chat_images');
      this.sql.exec('DELETE FROM chat_reactions');
      this.ctx.storage.kv.put('active_hour', hour);
      this.postTimes.clear();
      this.uploadTimes.clear();
      if (stored !== undefined) this.broadcast({type:'reset',hour,nextReset:(hour+1)*HOUR});
    }
    if ((await this.ctx.storage.getAlarm()) !== (hour+1)*HOUR) await this.ctx.storage.setAlarm((hour+1)*HOUR);
    return hour;
  }
  async alarm() { await this.ensureHour(); }
  rows() {
    const rows = this.sql.exec('SELECT id,user_id,author,avatar,role,body,image_id,reply_to,created_at FROM chat_messages ORDER BY created_at DESC LIMIT 100').toArray().reverse();
    const reactions=this.sql.exec('SELECT message_id,emoji,COUNT(*) AS total FROM chat_reactions GROUP BY message_id,emoji').toArray();
    const byId=new Map();for(const r of reactions){if(!byId.has(r.message_id))byId.set(r.message_id,[]);byId.get(r.message_id).push({emoji:r.emoji,count:r.total});}
    return rows.map(r=>({...r,reactions:byId.get(r.id)||[]}));
  }
  identity(request) {
    try {
      const raw = request.headers.get('X-MT-Chat-User') || '{}';
      const user = JSON.parse(raw);
      return {
        id: String(user.id || ''),
        author: String(user.name || '').slice(0,45),
        avatar: String(user.avatar || '').slice(0,2048),
        role: String(user.role || 'member').slice(0,20),
      };
    } catch { return {id:'',author:'',avatar:'',role:'member'}; }
  }
  async fetch(request) {
    const url = new URL(request.url);
    const user = this.identity(request);
    const hour = await this.ensureHour();
    const route = url.pathname;
    if (route.endsWith('/ws')) {
      if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') return err('WebSocket upgrade required.',426);
      if (this.online >= MAX_CLIENTS) return err('Chat is busy. Try again shortly.',503);
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);
      this.ctx.acceptWebSocket(server);
      server.serializeAttachment(user);
      server.send(JSON.stringify({type:'snapshot',messages:this.rows(),hour,nextReset:(hour+1)*HOUR,online:this.online,canPost:!!user.id}));
      this.broadcast({type:'presence',online:this.online});
      return new Response(null, {status:101, webSocket:client});
    }
    if (route.endsWith('/snapshot') && request.method === 'GET') {
      return json({messages:this.rows(),online:this.online,hour,nextReset:(hour+1)*HOUR});
    }
    if (route.endsWith('/upload') && request.method === 'POST') {
      if (!user.id) return err('Sign in to upload an image.',401);
      const mime=(request.headers.get('Content-Type')||'').split(';')[0].trim().toLowerCase();
      if (!TYPES[mime]) return err('Use JPG, PNG, WebP, or GIF.',415);
      const declared=Number(request.headers.get('Content-Length')||0);
      if (declared > MAX_IMAGE) return err('Image must be smaller than 700 KB.',413);
      const now = Date.now(), last = this.uploadTimes.get(user.id)||0;
      if (now-last < 3500) return err('Please wait a moment before uploading another image.',429);
      if (this.sql.exec('SELECT COUNT(*) AS n FROM chat_images').one().n >= MAX_IMAGES) return err('Image limit for this hour reached. Please try next hour.',429);
      const bytes = new Uint8Array(await request.arrayBuffer());
      if (!bytes.length || bytes.length > MAX_IMAGE) return err('Image must be smaller than 700 KB.',413);
      if (!TYPES[mime].every((part,index)=>bytes[index] === part)) return err('The file is not a valid image.',415);
      if (mime==='image/webp' && String.fromCharCode(...bytes.slice(8,12))!=='WEBP') return err('Invalid WebP file.',415);
      const id=crypto.randomUUID();
      this.sql.exec('INSERT INTO chat_images(id,hour,owner_id,mime,content,created_at) VALUES(?,?,?,?,?,?)',id,hour,user.id,mime,bytes,now);
      this.uploadTimes.set(user.id,now);
      return json({imageId:id,url:`/api/forum/live/images/${id}`});
    }
    if (route.includes('/images/') && request.method === 'GET') {
      const id=route.split('/').pop();
      if (!/^[0-9a-f-]{36}$/i.test(id)) return err('Image not found.',404);
      const image=this.sql.exec('SELECT mime, content FROM chat_images WHERE id=? AND hour=?',id,hour).one();
      if (!image) return err('Image expired or removed.',404);
      return new Response(image.content, {headers:{'Content-Type':image.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}});
    }
    return err('Not found.',404);
  }
  async webSocketMessage(ws, wire) {
    const hour = await this.ensureHour();
    const user=ws.deserializeAttachment() || {};
    let data;
    try { if (typeof wire !== 'string' || wire.length > 6000) throw new Error('Too long'); data=JSON.parse(wire); }
    catch { ws.send(JSON.stringify({type:'error',error:'Invalid message.'})); return; }
    if (data.type === 'ping') { ws.send(JSON.stringify({type:'pong'})); return; }
    if (!user.id) { ws.send(JSON.stringify({type:'error',error:'Sign in to post.'})); return; }
    if (data.type === 'send') {
      const body=String(data.body||'').trim();
      const imageId=String(data.imageId||'').trim();
      const now=Date.now();
      if ((!body && !imageId) || body.length > 1000) { ws.send(JSON.stringify({type:'error',error:'Messages must be 1–1000 characters, or contain an image.'})); return; }
      if (now - (this.postTimes.get(user.id)||0) < 900) {ws.send(JSON.stringify({type:'error',error:'Sending too quickly.'})); return;}
      if (imageId) {
        const image=this.sql.exec('SELECT owner_id,hour FROM chat_images WHERE id=?',imageId).one();
        if (!image || image.hour!==hour || image.owner_id!==user.id) { ws.send(JSON.stringify({type:'error',error:'Upload your image before sending.'})); return; }
        if (this.sql.exec('SELECT id FROM chat_messages WHERE image_id=? LIMIT 1',imageId).one()) { ws.send(JSON.stringify({type:'error',error:'This image has already been posted.'})); return; }
      }
      const replyTo=String(data.replyTo||'').trim();
      const parent=replyTo && /^[0-9a-f-]{36}$/i.test(replyTo) ? this.sql.exec('SELECT id FROM chat_messages WHERE id=?',replyTo).one() : null;
      if (replyTo&&!parent){ws.send(JSON.stringify({type:'error',error:'That message has expired. Remove the reply and try again.'}));return;}
      const message={id:crypto.randomUUID(),user_id:user.id,author:user.author,avatar:user.avatar||'',role:user.role||'member',body,image_id:imageId||null,reply_to:parent?.id||null,created_at:now,reactions:[]};
      this.sql.exec('INSERT INTO chat_messages(id,hour,user_id,author,avatar,role,body,image_id,reply_to,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)',message.id,hour,message.user_id,message.author,message.avatar,message.role,body,message.image_id,message.reply_to,now);
      this.postTimes.set(user.id,now);
      this.sql.exec('DELETE FROM chat_images WHERE id IN (SELECT image_id FROM chat_messages ORDER BY created_at DESC LIMIT -1 OFFSET ?)',MAX_MESSAGES);
      this.sql.exec('DELETE FROM chat_messages WHERE id IN (SELECT id FROM chat_messages ORDER BY created_at DESC LIMIT -1 OFFSET ?)',MAX_MESSAGES);
      this.sql.exec('DELETE FROM chat_reactions WHERE message_id NOT IN (SELECT id FROM chat_messages)');
      this.broadcast({type:'message',message});
      // Mentions are routed only to exact real usernames; never a mass @everyone ping.
      const mentions=[...new Set([...body.matchAll(/(^|[^\w])@([A-Za-z0-9_-]{3,24})\b/g)].map(x=>x[2].toLowerCase()))].filter(x=>x!==String(user.author||'').toLowerCase()).slice(0,5);
      if(mentions.length){
        for(const recipient of this.ctx.getWebSockets()){
          try{const peer=recipient.deserializeAttachment()||{};if(mentions.includes(String(peer.author||'').toLowerCase()))recipient.send(JSON.stringify({type:'mention',message}));}catch{}
        }
        if(this.env.DB){this.ctx.waitUntil((async()=>{
          try{
            const placeholders=mentions.map(()=>'?').join(',');
            const {results=[]}=await this.env.DB.prepare(`SELECT id,name FROM users WHERE LOWER(name) IN (${placeholders})`).bind(...mentions).all();
            for(const target of results){if(String(target.id)===String(user.id))continue;
              await this.env.DB.prepare('INSERT INTO notifications(user_id,actor_id,kind,detail,created_at) VALUES(?,?,?,?,?)').bind(target.id,Number(user.id),'chat_mention',JSON.stringify({author:user.author,text:body.slice(0,180),messageId:message.id}),now).run();
            }
          }catch(e){console.error('Chat mention notification skipped',String(e?.message||e));}
        })());}
      }
      return;
    }
    if (data.type === 'react') {
      const id=String(data.id||'');
      const allowed=['👍','❤️','😂','🔥','😮','😢','👏','💯'];
      const emoji=String(data.emoji||'');
      if(!/^[0-9a-f-]{36}$/i.test(id)||!allowed.includes(emoji))return;
      if(!this.sql.exec('SELECT id FROM chat_messages WHERE id=?',id).one())return;
      const found=this.sql.exec('SELECT 1 FROM chat_reactions WHERE message_id=? AND user_id=? AND emoji=?',id,user.id,emoji).one();
      if(found)this.sql.exec('DELETE FROM chat_reactions WHERE message_id=? AND user_id=? AND emoji=?',id,user.id,emoji);
      else this.sql.exec('INSERT INTO chat_reactions(message_id,user_id,emoji) VALUES(?,?,?)',id,user.id,emoji);
      const reactions=this.sql.exec('SELECT emoji,COUNT(*) AS count FROM chat_reactions WHERE message_id=? GROUP BY emoji',id).toArray();
      this.broadcast({type:'reactions',id,reactions});return;
    }
    if (data.type === 'delete') {
      const id=String(data.id||'');
      if (!/^[0-9a-f-]{36}$/i.test(id)) return;
      const found=this.sql.exec('SELECT user_id,image_id FROM chat_messages WHERE id=?',id).one();
      if (!found) return;
      if (found.user_id !== user.id && !['owner','admin','moderator'].includes(user.role)) {ws.send(JSON.stringify({type:'error',error:'You cannot remove this message.'})); return;}
      this.sql.exec('DELETE FROM chat_messages WHERE id=?',id);
      this.sql.exec('DELETE FROM chat_reactions WHERE message_id=?',id);
      if (found.image_id) this.sql.exec('DELETE FROM chat_images WHERE id=?',found.image_id);
      this.broadcast({type:'delete',id});
    }
  }
  webSocketClose() { this.broadcast({type:'presence',online:this.online}); }
  webSocketError() { this.broadcast({type:'presence',online:this.online}); }
}

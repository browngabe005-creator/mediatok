// Offline Durable Object logic regression using Node's built-in in-memory SQLite.
// It exercises the actual v37 class source with a minimal DurableObject platform shim.
const fs=require('node:fs');
const {DatabaseSync}=require('node:sqlite');
const assert=require('node:assert/strict');
const {webcrypto}=require('node:crypto');
let code=fs.readFileSync(require('node:path').join(__dirname,'../src/live-chat.js'),'utf8');
code=code.replace("import { DurableObject } from 'cloudflare:workers';",'').replace('export class ForumLiveRoom','class ForumLiveRoom');
class DO {constructor(ctx,env){this.ctx=ctx;this.env=env;}}
class MyResponse { constructor(body,options={}){this.body=body;this.status=options.status||200;this.headers=options.headers||{};}}
MyResponse.json=(obj,opts={})=>({status:opts.status||200,json:async()=>obj,headers:opts.headers||{}});
const Room=Function('DurableObject','Response','WebSocketPair','crypto',code+'; return ForumLiveRoom;')(DO,MyResponse,()=>{},webcrypto);
function mockContext(){
 const db=new DatabaseSync(':memory:');let alarm=null,conns=[];const kv=new Map();
 return {ctx:{storage:{sql:{exec(query,...args){ const stmt=db.prepare(query);const a=args.map(v=>v instanceof Uint8Array?Buffer.from(v):v); const rows=/^\s*SELECT/i.test(query)?stmt.all(...a):(stmt.run(...a),[]);return {toArray(){return rows},one(){return rows[0]}};}},kv:{get:k=>kv.get(k),put:(k,v)=>kv.set(k,v)},getAlarm:async()=>alarm,setAlarm:async(v)=>alarm=v},getWebSockets:()=>conns,acceptWebSocket:socket=>conns.push(socket)},db,kv,conns};
}
async function test(){
 const {ctx,kv,conns}=mockContext(); const room=new Room(ctx,{});
 const user={id:'1',name:'Alice',avatar:'',role:'member'}, ident={'X-MT-Chat-User':JSON.stringify(user)};
 const snapshot=await room.fetch(new Request('https://test/api/forum/live/snapshot',{headers:ident}));
 assert.equal((await snapshot.json()).messages.length,0);
 const received=[];const ws={deserializeAttachment:()=>({id:'1',author:'Alice',avatar:'',role:'member'}),send:x=>received.push(JSON.parse(x))};
 conns.push(ws);
 await room.webSocketMessage(ws,JSON.stringify({type:'send',body:'hello room'}));
 assert.equal(received[0].type,'message');
 assert.equal(room.rows()[0].body,'hello room');
 assert.equal(room.rows()[0].body,'hello room');
 // Replies quote a real message, reactions toggle and are included in snapshots.
 const firstId=room.rows()[0].id;
 const bobInbox=[];const bob={deserializeAttachment:()=>({id:'2',author:'Bob',role:'member'}),send:x=>bobInbox.push(JSON.parse(x))};
 conns.push(bob); room.postTimes.set('1',0);
 await room.webSocketMessage(ws,JSON.stringify({type:'send',body:'Hey @Bob',replyTo:firstId}));
 assert.equal(room.rows()[1].reply_to,firstId);
 assert(bobInbox.some(x=>x.type==='mention'&&x.message.reply_to===firstId));
 await room.webSocketMessage(bob,JSON.stringify({type:'react',id:firstId,emoji:'❤️'}));
 assert.equal(room.rows()[0].reactions[0].count,1);
 await room.webSocketMessage(bob,JSON.stringify({type:'react',id:firstId,emoji:'❤️'}));
 assert.equal(room.rows()[0].reactions.length,0);
 room.postTimes.set('1',0);

 // Image upload + read, same hour, with matching user identity.
 const png=Uint8Array.from([137,80,78,71,13,10,26,10,1,2,3]);
 const upload=await room.fetch(new Request('https://test/api/forum/live/upload',{method:'POST',headers:{...ident,'Content-Type':'image/png'},body:png}));
 assert.equal(upload.status,200);const {imageId}=await upload.json();
 await room.webSocketMessage(ws,JSON.stringify({type:'send',body:'picture',imageId}));
 assert.equal(room.rows().length,3,'image message follows the earlier reply once cooldown is cleared');
 room.postTimes.set('1',0);
 await room.webSocketMessage(ws,JSON.stringify({type:'send',body:'picture',imageId}));
 assert.equal(room.rows().length,3);
 const got=await room.fetch(new Request(`https://test/api/forum/live/images/${imageId}`,{headers:ident}));
 assert.equal(got.status,200);assert.equal(Buffer.from(got.body).byteLength,png.byteLength);
 const forbidden=await room.fetch(new Request('https://test/api/forum/live/upload',{method:'POST',headers:{'Content-Type':'image/png'},body:png}));
 assert.equal(forbidden.status,401);
 // Hourly reset removes both history and image attachments.
 kv.set('active_hour',Math.floor(Date.now()/3600000)-1);
 await room.ensureHour();
 assert.equal(room.rows().length,0);
 const gone=await room.fetch(new Request(`https://test/api/forum/live/images/${imageId}`,{headers:ident}));
 assert.equal(gone.status,404);
 assert(received.some(x=>x.type==='reset'));
 console.log('PASS v37 DO room: post/rate limit, image upload/retrieval, auth, hourly cleanup');
}
test().catch(e=>{console.error(e);process.exit(1)});

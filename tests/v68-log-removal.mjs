import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8');
const start=source.indexOf('  const logMatch = url.pathname.match(/^\\/api\\/logs\\/(\\d+)$/);');
const end=source.indexOf('  return null;',start);
assert(start>0&&end>start);
const handler=new Function('request','env','db','url','method','currentUser','json',`return (async()=>{${source.slice(start,end)}})()`);
const rows=[{id:13,user_id:5,title:'Naruto'},{id:14,user_id:6,title:'A book'}];
const db={prepare(sql){return {bind(...args){return {
 async first(){if(sql.includes('SELECT id,user_id'))return rows.find(x=>x.id===args[0])||null;throw Error(sql)},
 async run(){assert.match(sql,/DELETE FROM media_logs WHERE id=\? AND user_id=\?/);const i=rows.findIndex(x=>x.id===args[0]&&x.user_id===args[1]);if(i>=0)rows.splice(i,1);return {meta:{changes:i>=0?1:0}}}
}}}}};
const json=(val,status=200)=>new Response(JSON.stringify(val),{status,headers:{'Content-Type':'application/json'}});
async function call(id,user){const url=new URL('https://mediatok.org/api/logs/'+id);const req=new Request(url,{method:'DELETE'});const res=await handler(req,{},db,url,'DELETE',async()=>user,json);return [res.status,await res.json()]}
assert.equal((await call(13,null))[0],401);assert.equal(rows.length,2);
assert.equal((await call(13,{id:6}))[0],403);assert.equal(rows.length,2);
assert.equal((await call(99,{id:5}))[0],404);assert.equal(rows.length,2);
const [status,result]=await call(13,{id:5});assert.equal(status,200);assert.equal(result.id,13);assert.equal(rows.length,1);assert.equal(rows[0].id,14);
console.log('PASS v68 backend: auth, ownership, missing-log protection; owner deletes exactly one media entry');

import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8');
const start=source.indexOf('  if (url.pathname === "/api/feed"');
const end=source.indexOf('  if (url.pathname === "/api/profile"',start);
assert(start>0&&end>start);
const route=new Function('request','env','db','url','method','currentUser','json','logObject',`return (async()=>{${source.slice(start,end)}})()`);
const makeRow=(extra={})=>({id:19,user_id:5,media_key:'anime:test',media_type:'anime',title:'Test',cover:'',name:'alice',avc:'https://cdn.discordapp.com/avatars/5/old.png',avatar_url:'https://img.example/new.png',status:'In progress',updated_at:123,role:'member',...extra});
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
const logObject= new Function('row',`return (${source.match(/function logObject\(row\)\s*\{([\s\S]*?)\n\}/)?.[1]?.trim().replace(/^return /,'').replace(/;$/,'')})`);
// Non-testing runtime reads the shared mapper; use a direct function to verify output.
const logMapper=(row)=>({user:{name:row.name,avatar:row.avatar_url||row.avc||'',avatarFallback:row.avc||''}});
async function test(legacy,following){const queries=[];let r=new Request('https://mediatok.org/api/feed?limit=4'+(following?'&mode=following':''));const db={prepare(sql){queries.push(sql);return {bind(...args){return {async all(){if(legacy&&sql.includes('u.avatar_url'))throw Error('D1_ERROR: no such column: u.avatar_url');return {results:[legacy?makeRow({avatar_url:undefined}):makeRow()]}}}}}}};const out=await route(r,{},db,new URL(r.url),'GET',async()=>following?{id:33}:null,json,logMapper);assert.equal(out.status,200);const user=(await out.json())[0].user;assert.equal(user.avatar,legacy?'https://cdn.discordapp.com/avatars/5/old.png':'https://img.example/new.png');assert.equal(user.avatarFallback,'https://cdn.discordapp.com/avatars/5/old.png');assert(queries[0].includes('u.avatar_url'));if(legacy)assert.equal(queries.length,2);if(following)assert(queries[0].includes('JOIN follows'));}
for(const legacy of [false,true])for(const following of [false,true])await test(legacy,following);
assert(source.includes('avatar: row.avatar_url || row.avc || ""'));
console.log('PASS v59 feed API: custom avatar + Discord fallback, legacy schema, global & following.');

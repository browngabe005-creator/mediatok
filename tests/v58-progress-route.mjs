import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8');
const start=src.indexOf('  if (url.pathname === "/api/logs/progress"');
const end=src.indexOf('  if (url.pathname === "/api/logs/all"',start);
assert(start>0&&end>start);
const route=new Function('request','env','db','url','method','currentUser','json','mediaTypes',`return (async()=>{${src.slice(start,end)}})()`);
let rows=[{id:4,user_id:12,media_key:'mal:101',media_type:'anime',title:'Naruto',status:'In progress',progress:8,rating:9,note:'Keep this',cover:'old'}];
let nextId=5;
const db={prepare(sql){return {bind(...v){return {async first(){assert.match(sql,/FROM media_logs/);const [id,key,type,title]=v;return rows.filter(r=>r.user_id===id&&(r.media_key===key||(r.media_type===type&&r.title.toLowerCase()===title.toLowerCase())))[0]||null},async run(){if(sql.includes('UPDATE media_logs')){const [status,progress,now,cover,cover2,id,userId]=v;let r=rows.find(x=>x.id===id&&x.user_id===userId);assert(r);r.status=status;r.progress=progress;r.updated_at=now;if(!r.cover)r.cover=cover;return {meta:{changes:1}}}assert.match(sql,/INSERT INTO media_logs/);const [user,key,type,title,cover,year,status,progress,now]=v;rows.push({id:nextId++,user_id:user,media_key:key,media_type:type,title,cover,status,progress,rating:null,note:''});return {meta:{changes:1}}}}}}}};
const json=(x,code=200)=>new Response(JSON.stringify(x),{status:code,headers:{'Content-Type':'application/json'}});
const types=new Set(['anime','manga','film','tv','game','novel','light-novel','comic','webnovel','visual-novel']);
async function call(method,obj,user={id:12}){const url=new URL('https://mediatok.org/api/logs/progress');if(method==='GET')Object.entries(obj).forEach(([k,v])=>url.searchParams.set(k,v));let req=new Request(url,{method,...method==='POST'?{body:JSON.stringify(obj),headers:{'Content-Type':'application/json'}}:{}});let res=await route(req,{},db,url,method,async()=>user,json,types);return {code:res.status,body:await res.json()}}
let a=await call('GET',{type:'anime',title:'Naruto',key:'anime:naruto'});assert.equal(a.body.log.progress,8);
a=await call('POST',{type:'anime',title:'Naruto',key:'anime:naruto',status:'In progress',progress:13});assert.equal(a.code,200);assert.equal(rows.length,1);assert.equal(rows[0].note,'Keep this');assert.equal(rows[0].rating,9);assert.equal(rows[0].progress,13);
a=await call('POST',{type:'manga',title:'New title',status:'In progress',progress:3});assert.equal(a.code,200);assert.equal(a.body.created,true);assert.equal(rows.length,2);
a=await call('POST',{type:'anime',title:'Naruto',progress:-2});assert.equal(a.code,400);
a=await call('POST',{type:'anime',title:'Naruto',progress:2},null);assert.equal(a.code,401);
console.log('PASS v58 backend: existing imported key matched, progress updated without clearing rating/note; new active log saved; bad input rejected; auth required');

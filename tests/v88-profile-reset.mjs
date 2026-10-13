import fs from 'node:fs';
import assert from 'node:assert/strict';

const worker = fs.readFileSync(new URL('../src/worker.js',import.meta.url),'utf8');
const html = fs.readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
const start = worker.indexOf('  if (url.pathname === "/api/logs/reset-group"');
const end = worker.indexOf('  if (url.pathname === "/api/logs/all"',start);
assert(start>=0 && end>start,'Scoped reset route exists');
const source=worker.slice(start,end);
const asyncRoute=new Function('url','method','request','env','db','mediaTypes','currentUser','getStats','json',`return (async()=>{${source}return null})()`);
const allowed=new Set(['anime','manga','film','tv','novel','light-novel','webnovel','comic','game','visual-novel']);
const originals=[
 {id:1,user_id:1,media_type:'anime',status:'Planning'},
 {id:2,user_id:1,media_type:'anime',status:'Planning'},
 {id:3,user_id:1,media_type:'anime',status:'Completed'},
 {id:4,user_id:1,media_type:'manga',status:'Planning'},
 {id:5,user_id:2,media_type:'anime',status:'Planning'},
];
function setup(){
 const rows=originals.map(x=>({...x}));
 const db={prepare(sql){return {bind(...args){return {
   async first(){assert.match(sql,/^SELECT COUNT/);return {total:rows.filter(x=>matches(x,sql,args)).length}},
   async run(){assert.match(sql,/^DELETE/);const gone=rows.filter(x=>matches(x,sql,args));for(const r of gone){const i=rows.indexOf(r);rows.splice(i,1)}return {meta:{changes:gone.length}}}
 }}}}};
 function matches(row,sql,args){return row.user_id===args[0] && (!/media_type=\?/.test(sql)||row.media_type===args[1]) && (!/status=\?/.test(sql)||row.status===args[args.length-1])}
 return {rows,db};
}
const response=(data,status=200)=>({status,data});
async function send(db,body,user={id:1}){
 return asyncRoute(new URL('https://mediatok.org/api/logs/reset-group'),'POST',{json:async()=>body},{},db,allowed,async()=>user,async()=>({total:42}),response)
}
{
 const {rows,db}=setup();const r=await send(db,{mediaType:'anime',status:'Planning',expectedCount:2,confirmation:'RESET'});
 assert.equal(r.status,200);assert.equal(r.data.deleted,2);assert.deepEqual(rows.map(x=>x.id),[3,4,5]);
}
{
 const {rows,db}=setup();const r=await send(db,{mediaType:'anime',status:'All',expectedCount:3,confirmation:'RESET'});
 assert.equal(r.data.deleted,3);assert.deepEqual(rows.map(x=>x.id),[4,5]);
}
{
 const {rows,db}=setup();const r=await send(db,{mediaType:'all',status:'Planning',expectedCount:3,confirmation:'RESET'});
 assert.equal(r.data.deleted,3);assert.deepEqual(rows.map(x=>x.id),[3,5]);
}
for(const body of [
 {mediaType:'all',status:'All',expectedCount:5,confirmation:'RESET'},
 {mediaType:'random',status:'Planning',expectedCount:1,confirmation:'RESET'},
 {mediaType:'anime',status:'Planning',expectedCount:2,confirmation:'reset'},
 {mediaType:'anime',status:'Planning',expectedCount:3,confirmation:'RESET'},
 {mediaType:'anime',status:'Planning',expectedCount:0,confirmation:'RESET'}
]){
 const {rows,db}=setup();const r=await send(db,body);assert(r.status>=400,JSON.stringify(body));assert.equal(rows.length,5);
}
{
 const {rows,db}=setup();const r=await send(db,{mediaType:'anime',status:'Planning',expectedCount:2,confirmation:'RESET'},null);assert.equal(r.status,401);assert.equal(rows.length,5);
}
assert(html.includes("profileResetFooter(tab,sf,shown.length)"));
assert(html.includes("profileResetFooter('all','Planning',planning.length)"));
assert(html.includes("if(!mtOwnProfile()||count<=0)return ''"));
assert(html.includes('Type <b>RESET</b>'));
console.log('v88 profile scoped reset: PASSED (scope, other users, confirmation, stale count, auth, UI placement)');

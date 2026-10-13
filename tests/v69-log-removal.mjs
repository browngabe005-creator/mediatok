import assert from 'node:assert/strict';
import {readFileSync, writeFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
const functionSource=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end,source.indexOf(start)));
const state={me:{id:23,name:'alice'},profile:{id:'23',name:'alice'},profileLogs:[],feed:[],results:[],profileTab:'anime'};
const types=['anime','manga','film','tv','novel','webnovel','light-novel','comic','game','visual-novel'];
let calls=[],confirmed=true,closed=0,rendered=0,toasts=[];
const context=vm.createContext({state,Number,String,Array,URLSearchParams,console,
 TYPES:Object.fromEntries(types.map(t=>[t,{label:t}])),ico:()=>'',esc:s=>String(s??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;'),rnum:()=>null,catalogCoverSrc:s=>s,STAR:'*',
 api:async()=>{throw Error('offline')},confirm:()=>confirmed,toast:(...x)=>toasts.push(x),login:()=>{},closeModal:()=>closed++,render:async()=>rendered++,loadProfile:async()=>{},refreshFeed:async()=>{}});
vm.runInContext(functionSource('function mtOwnProfile()', 'function mtProgressUnit(')+functionSource('function pfPoster(', 'function socialHref(')+functionSource('async function deleteLog(', 'async function loadProfile('),context);
const run=s=>vm.runInContext(s,context);
for(const [i,type] of types.entries()){
 const log={id:i+1,mediaKey:'import:'+i,mediaType:type,title:'Imported '+type,status:'Completed'};
 state.profileLogs=[log];context.item={key:'different-source',title:log.title};context.kind=type;
 assert.equal(run('mtKnownOwnLog(item,kind)').id,i+1);
 assert.equal((await run('mtResolveOwnLog(item,kind)')).id,i+1,'own profile should not require endpoint');
 context.log=log;
 const poster=run('pfPoster(log)');assert.match(poster,/>Remove log<\/button>/);assert.match(poster,/event.stopPropagation/);
 state.profile={id:24,name:'other'};assert.equal(run('mtKnownOwnLog(item,kind)'),null);assert.doesNotMatch(run('pfPoster(log)'),/mt-poster-remove/);
 state.profile={id:'23',name:'alice'};
}
state.profileLogs=[];
context.api=async path=>{calls.push(path);if(path.startsWith('/api/logs/progress'))throw Error('lookup failed');return {logs:[{id:51,mediaKey:'other',mediaType:'manga',title:'Berserk'}]}};
assert.equal((await run("mtResolveOwnLog({title:'BERSERK',key:'new'},'manga')")).id,51);
assert.equal((await run("mtResolveOwnLog({title:'BERSERK',key:'new'},'anime')")),null,'same title in another medium must not match');
state.me=null;assert.equal(run("mtKnownOwnLog({title:'Berserk'},'manga')"),null);assert.doesNotMatch(run('pfPoster(log)'),/mt-poster-remove/);
state.me={id:23,name:'alice'};state.profileLogs=[{id:90},{id:91}];state.feed=[{id:90},{id:92}];
context.api=async(path,opts)=>{calls.push(path);if(opts?.method==='DELETE')return {ok:true};return {user:{id:23,name:'alice',stats:{total:1}}}};
calls=[];confirmed=false;await run('deleteLog(90)');assert.equal(calls.length,0);assert.equal(state.profileLogs.length,2);
confirmed=true;context.api=async()=>{throw Error('network error')};await run('deleteLog(90)');assert.equal(state.profileLogs.length,2);assert.equal(closed,0);
context.api=async()=>({});await run('deleteLog(90)');assert.equal(state.profileLogs.length,2,'HTML/empty responses must not falsely report deletion');
context.api=async(path,opts)=>opts?.method==='DELETE'?{ok:true}:{user:{id:23,name:'alice',stats:{total:1}}};await run('deleteLog(90)');
assert.equal(state.profileLogs.length,1);assert.equal(state.profileLogs[0].id,91);assert.equal(state.feed[0].id,92);assert.equal(state.me.stats.total,1);assert.equal(closed,1);assert.equal(rendered,1);
// Generate the actual profile header to inspect its element hierarchy.
Object.assign(context,{safeAccent:()=> '#999',profileAvatar:()=>'<span class="pf-hero-avatar"></span>',mtCurrentLogs:()=>[],isPlanning:l=>l.status==='Planning',parseFavs:()=>[],profileIdentityHTML:()=>'',mtCurrentPanel:()=>'',renderFeed:()=>'',mtMusicPanel:()=>'',bannerStyle:()=>'',rnum:()=>null});
vm.runInContext(functionSource('function profilePage(){','function setProfileTab('),context);
state.profile={id:'23',name:'alice',stats:{total:1}};state.profileLogs=[];state.profileTab='overview';
const profile=run('profilePage()');assert.match(profile,/Edit profile/);assert.match(profile,/Share profile/);
writeFileSync('/tmp/mediatok-v69-profile.html',profile);
assert.match(source,/meta name="mediatok-build" content="v69"/);
console.log('PASS v69: all ten media types, visible labels, owner-only controls, offline local lookup, API fallback, cancel/failure/success deletion and count refresh');

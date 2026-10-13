import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const workerSource=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8').replace(/^import \{ catalogRoute, pruneCatalogCache \} from '\.\/catalog-v41\.js';\s*/,'').replace(/^export \{ ForumLiveRoom \} from '\.\/live-chat\.js';\s*/,'');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64')); 
const users = [
 {id:1,display_name:'Narrative',profile_avatar:'',non_game_count:2},
 {id:2,display_name:'Multiplayer',profile_avatar:'',non_game_count:2},
 {id:3,display_name:'Reader',profile_avatar:'',non_game_count:4},
 {id:4,display_name:'Other',profile_avatar:'',non_game_count:0}
];
const games=[
 {user_id:1,title:'Elden Ring'},
 {user_id:1,title:'Disco Elysium'},
 {user_id:1,title:'Red Dead Redemption 2'},
 {user_id:2,title:'Fortnite'},
 {user_id:2,title:'Valorant'},
 {user_id:2,title:'League of Legends'},
 {user_id:2,title:'Tetris'},
 {user_id:4,title:'Unknown Multiplayer Thing'},
 {user_id:4,title:'Minecraft'},
];
const queries=[];
const env={DB:{prepare(sql){queries.push(sql);return {async all(){if(sql.includes('non_game_count'))return {results:users};if(sql.includes('SELECT l.user_id,l.title'))return {results:games};return {results:[]}},async first(){return null},bind(){return this}}}},ASSETS:{fetch:()=>new Response('ok')}};
const response=await worker.fetch(new Request('https://mediatok.org/api/leaderboard'),env);
assert.equal(response.status,200);
const list=await response.json();
const count=Object.fromEntries(list.map(x=>[x.name,x.entries]));
assert.deepEqual({Narrative:count.Narrative,Multiplayer:count.Multiplayer,Reader:count.Reader,Other:count.Other},{Narrative:5,Multiplayer:2,Reader:4,Other:0});
assert.equal(list[0].name,'Narrative');
assert.equal(list[1].name,'Reader');
assert(queries[0].includes("IN ('anime','manga'"),'only explicit non-game types belong to SQL tally');
assert(queries[1].includes("IN ('game','games','videogame','videogames')"),'all supported game type variants are filtered independently');
console.log('PASS: completed story-focused games count; multiplayer/non-story/unknown games excluded; other media still count');

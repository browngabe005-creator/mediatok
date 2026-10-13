import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {handleListRoute} from '../src/lists-v93.js';
import {recordMediaActivity} from '../src/activity-v93.js';
const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON;');
for(const name of ['0001_initial.sql','0002_media_social.sql','0016_media_identity_events.sql','0017_custom_lists.sql'])db.exec(fs.readFileSync(new URL('../migrations/'+name,import.meta.url),'utf8'));
const now=Date.now();
db.prepare(`INSERT INTO users(discord_id,name,joined,updated_at) VALUES(?,?,?,?)`).run('test-discord-1','alice',now,now);
db.prepare(`INSERT INTO users(discord_id,name,joined,updated_at) VALUES(?,?,?,?)`).run('test-discord-2','bob',now,now);
db.prepare(`INSERT INTO media_logs(user_id,media_key,media_type,title,created_at,updated_at) VALUES(?,?,?,?,?,?)`).run(1,'anilist:1','anime','Test Anime',now,now);
class D1{
 constructor(d){this.d=d}
 prepare(sql){const statement=this.d.prepare(sql);let args=[];return {bind(...v){args=v;return this},async first(){return statement.get(...args)||null},async all(){return {results:statement.all(...args)}},async run(){const result=statement.run(...args);return {meta:{changes:result.changes,last_row_id:Number(result.lastInsertRowid)}}}}}
 async batch(stmts){const responses=[];this.d.exec('BEGIN');try{for(const s of stmts)responses.push(await s.run());this.d.exec('COMMIT')}catch(e){this.d.exec('ROLLBACK');throw e}return responses}
}
const env={DB:new D1(db)},alice={id:1,name:'alice'},bob={id:2,name:'bob'};
async function api(method,path,actor=null,body){const url=new URL(path,'https://mediatok.org');const res=await handleListRoute(new Request(url,{method,...(body?{headers:{'content-type':'application/json'},body:JSON.stringify(body)}:{})}),env,url,actor);return [res.status,await res.json()]}
assert.equal((await api('POST','/api/lists',null,{title:'hi'}))[0],401);
let [status,data]=await api('POST','/api/lists',alice,{title:'Top fiction',description:'A list',visibility:'public'});assert.equal(status,201);const publicId=data.id;
[status,data]=await api('POST',`/api/lists/${publicId}/items`,alice,{mediaType:'anime',mediaKey:'anilist:1',title:'Test Anime'});assert.equal(status,201);const item1=data.id;
[status,data]=await api('POST',`/api/lists/${publicId}/items`,alice,{mediaType:'manga',mediaKey:'anilist:2',title:'Test Manga'});assert.equal(status,201);const item2=data.id;
assert.equal((await api('POST',`/api/lists/${publicId}/items`,alice,{mediaType:'anime',mediaKey:'anilist:1',title:'Test Anime'}))[0],409);
assert.equal((await api('POST',`/api/lists/${publicId}/items`,bob,{mediaType:'game',title:'Not my list'}))[0],403);
assert.equal((await api('GET',`/api/lists/${publicId}`,null))[1].items.length,2);
assert.equal((await api('POST',`/api/lists/${publicId}/reorder`,alice,{itemIds:[item2,item1]}))[0],200);
assert.equal((await api('GET',`/api/lists/${publicId}`,null))[1].items[0].id,item2);
assert.equal((await api('POST',`/api/lists/${publicId}/reorder`,alice,{itemIds:[item2,item2]}))[0],400);
assert.equal((await api('PATCH',`/api/lists/${publicId}`,bob,{title:'Hacked'}))[0],403);
assert.equal((await api('PATCH',`/api/lists/${publicId}`,alice,{title:'Top films and anime',visibility:'private'}))[0],200);
assert.equal((await api('GET',`/api/lists/${publicId}`,bob))[0],404);
assert.equal((await api('GET',`/api/lists/${publicId}`,alice))[0],200);
let unlisted=await api('POST','/api/lists',alice,{title:'Hidden picks',visibility:'unlisted'}),secret=unlisted[1].shareToken,secretId=unlisted[1].id;
assert.equal((await api('GET',`/api/lists/${secretId}`,null))[0],404);
assert.equal((await api('GET',`/api/lists/${secretId}?token=bad`,null))[0],404);
assert.equal((await api('GET',`/api/lists/${secretId}?token=${secret}`,null))[0],200);
assert.equal((await api('GET','/api/lists',null))[1].lists.length,0);
assert.equal((await api('GET','/api/lists?mine=1',alice))[1].lists.length,2);
assert.equal((await api('GET','/api/lists?mine=1',null))[0],401);
assert.equal((await api('DELETE',`/api/lists/${publicId}`,alice))[0],200);
assert.equal(db.prepare('SELECT COUNT(*) n FROM media_logs WHERE user_id=1').get().n,1,'Deleting list must not delete media log');
assert.equal(await recordMediaActivity(env.DB,{userId:1,mediaKey:'anilist:1',mediaType:'anime',eventKind:'log_created',status:'Completed'}),true);
assert.equal(db.prepare('SELECT COUNT(*) n FROM media_activity_events').get().n,1);
assert.equal(db.prepare('SELECT COUNT(*) n FROM media_provider_ids').get().n,0,'No automatic title merging');
console.log('v93 Lists API / ownership / unlisted token / reorder / independent logs / events: PASS');

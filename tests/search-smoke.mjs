// Offline smoke test: confirms Worker routes, provider isolation, and result shapes.
// Run from the project root: node tests/search-smoke.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const workerSource=readFileSync(new URL('../src/worker.js',import.meta.url),'utf8').replace(/^export \{ ForumLiveRoom \} from '\.\/live-chat\.js';\s*/,'');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64'));
let requests = [];
const unavailable = () => new Response(JSON.stringify({ error: 'temporary provider outage' }), { status: 503, headers: { 'content-type': 'application/json' } });
const reply = data => new Response(JSON.stringify(data), { status: 200, headers: { 'content-type': 'application/json' } });
globalThis.fetch = async (url, init = {}) => {
  const u = String(url), params = new URL(u).searchParams, q = params.get('q') || params.get('title') || params.get('term') || params.get('query') || '';
  requests.push(u);
  if (u.includes('graphql.anilist.co')) {
    const request = JSON.parse(init.body || '{}');
    if ((request.variables?.search || '').toLowerCase().includes('naruto')) return reply({ data: { Page: { media: [ { id: 1, title: { english: 'Naruto' }, coverImage: { large: 'https://example.org/naruto.jpg' }, startDate: { year: 2002 }, format: 'TV', isAdult: false } ] } } });
    return unavailable();
  }
  if (u.includes('openlibrary.org')) {
    if (q.toLowerCase().includes('dune')) return reply({ docs: [{ key: '/works/OL1W', title: 'Dune', author_name: ['Frank Herbert'], first_publish_year: 1965, cover_i: 42 }] });
    return unavailable();
  }
  if (u.includes('itunes.apple.com') && q.toLowerCase().includes('spirited')) return reply({ results: [{ trackId: 10, trackName: 'Spirited Away', releaseDate: '2001-01-01', artworkUrl100: 'https://example.org/movie.jpg' }] });
  if (u.includes('api.tvmaze.com') && q.toLowerCase().includes('mentalist')) return reply([{ show: { id: 20, name: 'The Mentalist', premiered: '2008-09-23', image: { medium: 'https://example.org/tv.jpg' } } }]);
  if (u.includes('store.steampowered.com') && q.toLowerCase().includes('elden')) return reply({ items: [{ id: 30, name: 'Elden Ring', type: 'app', tiny_image: 'https://example.org/game.jpg' }] });
  if (u.includes('api.vndb.org')) return reply({ results: [{ id: 'v1', title: 'Steins;Gate', released: '2009-10-15', image: { url: 'https://example.org/vn.jpg' } }] });
  return unavailable();
};
const users = [{id:1,name:'gabriel',global_name:'Gabriel',avc:'',avatar_url:'',bio:'Hello',role:'member'}];
const env = { DB: { prepare(sql) {
  return { bind(...args) { this.args=args; return this; }, async first(){return null}, async all(){if(sql.includes('SELECT id,name,global_name'))return {results:users};return {results:[]}}, async run(){return {}} };
} }, ASSETS: { fetch() { return reply({assets:true}) } } };
async function get(path){ const response = await worker.fetch(new Request('https://mediatok.org'+path),env);return [response.status,await response.json()]; }
for (const [type,query,expected] of [
  ['anime','naruto','Naruto'],['webnovel','Reverend Insanity','Reverend Insanity'],
  ['novel','Dune','Dune'],['film','Spirited Away','Spirited Away'],
  ['tv','The Mentalist','The Mentalist'],['game','Elden Ring','Elden Ring'],
  ['visual-novel','Steins Gate','Steins;Gate']
]) {
  const [status,data] = await get('/api/search/catalog?type='+encodeURIComponent(type)+'&q='+encodeURIComponent(query));
  assert.equal(status,200,`${type} returned ${status}: ${data.error}`);
  assert.ok(Array.isArray(data.results));
  assert.ok(data.results.some(r=>r.title===expected),`${type} missing ${expected}`);
  console.log(`PASS ${type.padEnd(13)} ${expected}`);
}
const [userStatus,userData] = await get('/api/search/users?q=gabriel');
assert.equal(userStatus,200);assert.equal(userData.results[0].name,'gabriel');assert.equal(userData.results[0].bio,'Hello');
console.log('PASS public user search');
const [healthStatus,health] = await get('/api/health');assert.equal(healthStatus,200);assert.equal(health.ok,true);
console.log('PASS worker health');
console.log('All offline smoke tests passed. These do not verify live third-party APIs or Cloudflare deployment.');

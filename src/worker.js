import { catalogRoute, pruneCatalogCache } from './catalog-v41.js';
import { handleListRoute } from './lists-v93.js';
import { recordMediaActivity } from './activity-v93.js';
import { creditRoute } from './credits-v53.js';
import { handleMusicRoute } from './music-v62.js';
import { lookupVndbUser, upsertExternalEntries, setAutoSync, syncService, autoSyncUser, scheduledAutoSync } from './sync-v70.js';
export { ForumLiveRoom } from './live-chat.js';
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});
const cookie = (name, value, maxAge = 0) => `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`;
const getCookie = (request, name) => {
  const raw = request.headers.get("Cookie") || "";
  for (const part of raw.split(";")) { const i = part.indexOf("="); if (i >= 0 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim()); }
  return null;
};
const randomToken = (bytes = 32) => { const a = new Uint8Array(bytes); crypto.getRandomValues(a); return [...a].map(x => x.toString(16).padStart(2, "0")).join(""); };
const redirect = (url, headers = {}) => new Response(null, { status: 302, headers: { Location: url, ...headers } });
const cleanName = value => String(value || "member").normalize("NFKD").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24) || "member";
const safeJSON = value => { try { return value ? JSON.parse(value) : {}; } catch { return {}; } };
const avatarUrl = d => d.avatar ? `https://cdn.discordapp.com/avatars/${d.id}/${d.avatar}.${d.avatar.startsWith("a_") ? "gif" : "png"}?size=256` : `https://cdn.discordapp.com/embed/avatars/${Number(d.discriminator || 0) % 5}.png`;
const mediaTypes = new Set(["anime", "manga", "film", "tv", "novel", "light-novel", "webnovel", "comic", "game", "visual-novel"]);
// Leaderboard eligibility must not be inferred from someone clicking Completed.
// Logs store title/type, not genre or multiplayer flags, so unknown games are
// excluded until reviewed rather than rewarding easily spammed online titles.
// This list covers known story-led releases and can be expanded as catalog metadata improves.
const LEADERBOARD_STORY_GAMES = new Set(`
Elden Ring|Sekiro Shadows Die Twice|Bloodborne|Demon's Souls|Dark Souls|Dark Souls II|Dark Souls III|Lies of P|Hollow Knight|Silksong|Disco Elysium|Pathologic 2|Night in the Woods|SOMA|Outer Wilds|What Remains of Edith Finch|Firewatch|Gone Home|The Stanley Parable|The Beginner's Guide|To the Moon|Finding Paradise|Omori|Undertale|Deltarune|OneShot|Celeste|Gris|Journey|Spiritfarer|Oxenfree|Oxenfree II Lost Signals|Life is Strange|Life is Strange Before the Storm|Life is Strange 2|Life is Strange True Colors|Detroit Become Human|Heavy Rain|Beyond Two Souls|Until Dawn|The Quarry|The Walking Dead|The Wolf Among Us|The Last of Us|The Last of Us Part II|Uncharted|Uncharted 2 Among Thieves|Uncharted 3 Drake's Deception|Uncharted 4 A Thief's End|Uncharted The Lost Legacy|God of War|God of War Ragnarok|Horizon Zero Dawn|Horizon Forbidden West|Ghost of Tsushima|Ghost of Yotei|Days Gone|Marvel's Spider-Man|Marvel's Spider-Man Miles Morales|Marvel's Spider-Man 2|Batman Arkham Asylum|Batman Arkham City|Batman Arkham Origins|Batman Arkham Knight|Red Dead Redemption|Red Dead Redemption 2|Grand Theft Auto IV|Grand Theft Auto V|Bully|L.A. Noire|The Witcher|The Witcher 2 Assassins of Kings|The Witcher 3 Wild Hunt|Cyberpunk 2077|Phantom Liberty|Baldur's Gate 3|Baldur's Gate|Baldur's Gate II|Divinity Original Sin 2|Divinity Original Sin|Dragon Age Origins|Dragon Age II|Dragon Age Inquisition|Dragon Age The Veilguard|Mass Effect|Mass Effect 2|Mass Effect 3|Mass Effect Andromeda|Star Wars Knights of the Old Republic|Star Wars Knights of the Old Republic II|Star Wars Jedi Fallen Order|Star Wars Jedi Survivor|Star Wars Outlaws|Fallout|Fallout 2|Fallout 3|Fallout New Vegas|Fallout 4|The Elder Scrolls III Morrowind|The Elder Scrolls IV Oblivion|The Elder Scrolls V Skyrim|Kingdom Come Deliverance|Kingdom Come Deliverance II|The Outer Worlds|The Outer Worlds 2|BioShock|BioShock 2|BioShock Infinite|Prey|Dishonored|Dishonored 2|Deathloop|Control|Alan Wake|Alan Wake 2|Quantum Break|Max Payne|Max Payne 2 The Fall of Max Payne|Max Payne 3|Metal Gear Solid|Metal Gear Solid 2 Sons of Liberty|Metal Gear Solid 3 Snake Eater|Metal Gear Solid 4 Guns of the Patriots|Metal Gear Solid V The Phantom Pain|Death Stranding|Death Stranding 2 On the Beach|Silent Hill 2|Resident Evil|Resident Evil 2|Resident Evil 3|Resident Evil 4|Resident Evil 5|Resident Evil 6|Resident Evil 7 Biohazard|Resident Evil Village|Resident Evil Code Veronica|Amnesia The Dark Descent|Amnesia Rebirth|Amnesia The Bunker|Outlast|Outlast 2|Alien Isolation|Dead Space|Dead Space 2|Dead Space 3|The Evil Within|The Evil Within 2|Little Nightmares|Little Nightmares II|Inside|Limbo|Portal|Portal 2|Half-Life|Half-Life 2|Half-Life Alyx|Black Mesa|A Plague Tale Innocence|A Plague Tale Requiem|Hellblade Senua's Sacrifice|Senua's Saga Hellblade II|NieR Automata|NieR Replicant|Drakengard 3|Yakuza 0|Yakuza Kiwami|Yakuza Kiwami 2|Yakuza 3|Yakuza 4|Yakuza 5|Yakuza 6 The Song of Life|Yakuza Like a Dragon|Like a Dragon Infinite Wealth|Like a Dragon Gaiden The Man Who Erased His Name|Judgment|Lost Judgment|Persona 3|Persona 3 Reload|Persona 4|Persona 4 Golden|Persona 5|Persona 5 Royal|Metaphor ReFantazio|Shin Megami Tensei III Nocturne|Shin Megami Tensei V|Shin Megami Tensei V Vengeance|Final Fantasy VII|Final Fantasy VII Remake|Final Fantasy VII Rebirth|Final Fantasy VIII|Final Fantasy IX|Final Fantasy X|Final Fantasy XII|Final Fantasy XIII|Final Fantasy XV|Final Fantasy XVI|Final Fantasy Tactics|Chrono Trigger|Chrono Cross|Dragon Quest XI|Dragon Quest VIII|Dragon Quest IX|Dragon Quest III|Xenoblade Chronicles|Xenoblade Chronicles 2|Xenoblade Chronicles 3|Xenogears|The Legend of Zelda Breath of the Wild|The Legend of Zelda Tears of the Kingdom|The Legend of Zelda Ocarina of Time|The Legend of Zelda Majora's Mask|The Legend of Zelda Twilight Princess|The Legend of Zelda Skyward Sword|The Legend of Zelda Link's Awakening|The Legend of Zelda Echoes of Wisdom|Super Mario Odyssey|Super Mario Galaxy|Super Mario Galaxy 2|Paper Mario The Thousand-Year Door|Super Paper Mario|EarthBound|Mother 3|Pokemon Mystery Dungeon Explorers of Sky|Pokemon Black|Pokemon White|Pokemon Black 2|Pokemon White 2|Pokemon Legends Arceus|Hades|Hades II|Transistor|Bastion|Pyre|Inscryption|Return of the Obra Dinn|Pentiment|Citizen Sleeper|Citizen Sleeper 2 Starward Vector|Slay the Princess|The House in Fata Morgana|Steins Gate|Danganronpa Trigger Happy Havoc|Danganronpa 2 Goodbye Despair|Danganronpa V3 Killing Harmony|Ace Attorney Phoenix Wright|The Great Ace Attorney Chronicles|Zero Escape Virtue's Last Reward|999 Nine Hours Nine Persons Nine Doors|AI The Somnium Files|The Forgotten City|Tunic|The Talos Principle|The Talos Principle 2|Stray|Hi-Fi Rush|Psychonauts|Psychonauts 2|Ori and the Blind Forest|Ori and the Will of the Wisps|Cuphead|Shadow of the Colossus|The Last Guardian|Ico|Okami|Katana ZERO|Hotline Miami|Hotline Miami 2 Wrong Number|Terranigma|Vagrant Story|Fire Emblem Three Houses|Fire Emblem Engage|Triangle Strategy|Octopath Traveler|Octopath Traveler II|Bravely Default|Bravely Second|Metroid Dread|Metroid Prime|Metroid Prime 2 Echoes|Metroid Prime 3 Corruption|Metroid Fusion|Metroid Zero Mission|Returnal|Armored Core VI Fires of Rubicon
`.trim().split('|').map(v=>v.trim().toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()));
// Multiplayer/live-service and non-narrative series are intentionally absent.
function leaderboardEligibleGame(title) {
 const name=String(title||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 if(!name)return false;
 return LEADERBOARD_STORY_GAMES.has(name);
}

// Provider throttling is often shared across a Cloudflare POP. Briefly back off
// 429/503 sources rather than making every visitor immediately retry them.
// Cache API is best-effort and scoped to the current POP, not a global database.
async function providerCooldown(hostname) {
  const cache=typeof caches!=="undefined"?caches.default:null;
  if(!cache)return false;
  try{return !!(await cache.match(new Request("https://mediatok-cache.internal/provider-backoff-v40/"+encodeURIComponent(hostname))))}catch{return false}
}
async function backoffProvider(hostname,seconds=25) {
  const cache=typeof caches!=="undefined"?caches.default:null;
  if(!cache)return;
  try{await cache.put(new Request("https://mediatok-cache.internal/provider-backoff-v40/"+encodeURIComponent(hostname)),new Response("cooldown",{headers:{"Cache-Control":"public,max-age="+seconds}}))}catch{}
}

const requestIP = request => String(request.headers.get("CF-Connecting-IP") || "").trim().slice(0, 64);
const suspiciousName = value => {
  const normalized = String(value || "").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]/g, "");
  return ["gabe", "gabriel", "gabrielbrown", "faiai"].some(keyword => normalized.includes(keyword));
};
async function recordSecurityEvent(db, {event, username = "", ip = "", detail = ""}) {
  try {
    await db.prepare("INSERT INTO security_events(event_type,username,ip_address,detail,created_at) VALUES(?,?,?,?,?)")
      .bind(event, String(username).slice(0, 80), String(ip).slice(0, 64), String(detail).slice(0, 300), Date.now()).run();
  } catch (e) { console.error("Security event logging failed; apply migration 0011_security_events.sql", String(e?.message || e)); }
}

function publicUser(row, stats = {}) {
  return row ? {
    id: row.id, name: row.name, discordUsername: row.discord_username, globalName: row.global_name || "",
    bio: row.bio || "", status: row.status || "", favs: row.favs || "", banner: row.banner || "Mono",
    bannerUrl: row.banner_url || "", accent: row.accent || "#6d6bf5", avc: row.avc || "", shape: row.shape || "circle",
    joined: row.joined, role: row.role || "member", avatarUrl: row.avatar_url || "", links: safeJSON(row.links), socials: safeJSON(row.socials), externalStats: safeJSON(row.stats), stats, followers: Number(row.followers_count||0), following: Number(row.following_count||0)
  } : null;
}
async function currentUser(request, env) {
  const token = getCookie(request, "mt_session");
  if (!token) return null;
  const user = await env.DB.prepare("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires_at>?").bind(token, Date.now()).first();
  return user && user.banned ? null : user;
}
async function uniqueName(db, base) {
  const original = cleanName(base); let name = original, n = 1;
  while (await db.prepare("SELECT id FROM users WHERE name=? COLLATE NOCASE").bind(name).first()) name = `${original}_${++n}`.slice(0, 32);
  return name;
}
async function getStats(db, userId) {
  const { results = [] } = await db.prepare("SELECT media_type, COUNT(*) AS total FROM media_logs WHERE user_id=? AND status != 'Planning' GROUP BY media_type").bind(userId).all();
  const out = { anime: 0, manga: 0, film: 0, tv: 0, novel: 0, "light-novel": 0, webnovel: 0, comic: 0, game: 0, "visual-novel": 0, total: 0 };
  for (const row of results) { out[row.media_type] = row.total; out.total += row.total; }
  return out;
}
function logObject(row) {
  return { id: row.id, mediaKey: row.media_key, mediaType: row.media_type, title: row.title, cover: row.cover || "", year: row.media_year || "", status: row.status, progress: row.progress, rating: row.rating, note: row.note || "", createdAt: row.created_at, updatedAt: row.updated_at,
    user: { id: row.user_id, name: row.name, avatar: row.avatar_url || row.avc || "", avatarFallback: row.avc || "", role: row.role || "member" }, commentCount: row.comment_count || 0 };
}

const emailNorm = value => String(value || "").trim().toLowerCase();
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
const utf8 = value => new TextEncoder().encode(value);
const toB64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const fromB64 = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
async function passwordHash(password, saltText = randomToken(16)) {
  const key = await crypto.subtle.importKey("raw", utf8(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({name:"PBKDF2", hash:"SHA-256", salt:fromB64(toB64(utf8(saltText))), iterations:100000}, key, 256);
  return `pbkdf2-sha256$100000$${toB64(utf8(saltText))}$${toB64(bits)}`;
}
async function verifyPassword(password, stored) {
  try { const [algo, rounds, salt, expected] = stored.split("$"); if(algo!=="pbkdf2-sha256" || Number(rounds)!==100000)return false; const actual=await passwordHashWithSalt(password,salt,Number(rounds)); const a=fromB64(actual), b=fromB64(expected); if(a.length!==b.length)return false; let diff=0; for(let i=0;i<a.length;i++)diff|=a[i]^b[i]; return diff===0; } catch { return false; }
}
async function passwordHashWithSalt(password, salt, iterations) {
 const key=await crypto.subtle.importKey("raw",utf8(password),"PBKDF2",false,["deriveBits"]);
 const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:fromB64(salt),iterations},key,256); return toB64(bits);
}
async function createSession(user, env, origin) {
 const token=randomToken(32), now=Date.now();
 await env.DB.prepare("INSERT INTO sessions(token,user_id,expires_at,created_at) VALUES(?,?,?,?)").bind(token,user.id,now+30*24*60*60*1000,now).run();
 return redirect(origin+"/?signed_in=1", {"Set-Cookie":cookie("mt_session",token,30*24*60*60),"Cache-Control":"no-store"});
}
async function sha256Hex(value) {
 const digest = await crypto.subtle.digest("SHA-256", utf8(value));
 return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
async function sendAuthEmail(env, to, subject, title, message, actionLabel, link) {
 if(!env.RESEND_API_KEY || !env.AUTH_FROM_EMAIL) throw new Error("Email sending is not configured. Set RESEND_API_KEY and AUTH_FROM_EMAIL in Worker secrets/variables.");
 const safeLink=String(link).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
 const html=`<!doctype html><html><body style="margin:0;background:#f6f7fc;font-family:Arial,sans-serif;color:#262742"><div style="max-width:560px;margin:30px auto;background:#fff;border:1px solid #e8e9f5;border-radius:18px;padding:30px"><h1 style="color:#6d6bf5">MediaTok</h1><h2>${title}</h2><p style="line-height:1.7">${message}</p><p style="margin:28px 0"><a href="${safeLink}" style="background:#6d6bf5;color:#fff;text-decoration:none;padding:13px 20px;border-radius:10px;font-weight:bold">${actionLabel}</a></p><p style="font-size:12px;color:#777b9b;line-height:1.6">If the button does not work, copy this link into your browser:<br>${safeLink}</p><p style="font-size:12px;color:#777b9b">If you did not request this, you can ignore this email.</p></div></body></html>`;
 const res=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({from:env.AUTH_FROM_EMAIL,to:[to],subject,html,text:`${title}\n\n${message}\n\n${link}\n\nIf you did not request this, ignore this email.`})});
 if(!res.ok){const detail=await res.text();console.error("Transactional email failed",res.status,detail.slice(0,300));throw new Error("Email delivery failed. Check your Resend domain and sender configuration.");}
}
async function issueAuthToken(db,user,purpose) {
 const token=randomToken(32), now=Date.now(), expires=now+(purpose==="verify"?24:1)*60*60*1000;
 await db.prepare("INSERT INTO auth_tokens(token_hash,user_id,purpose,created_at,expires_at) VALUES(?,?,?,?,?)").bind(await sha256Hex(token),user.id,purpose,now,expires).run();
 return token;
}
async function emailAuth(request, env, mode) {
 if(request.method!=="POST")return json({error:"Method not allowed."},405);
 let body;try{body=await request.json()}catch{return json({error:"Invalid request."},400)}
 const email=emailNorm(body.email), password=String(body.password||"");
 if(!validEmail(email))return json({error:"Enter a valid email address."},400);
 const db=env.DB, now=Date.now();
 // Email verification is mandatory; do not allow a deployment variable to disable it.
 const needVerify=true;
 if(mode==="register"){
  if(password.length<12 || password.length>128)return json({error:"Use a password between 12 and 128 characters."},400);
  const requestedName=String(body.username||"").trim();
  if(!/^[A-Za-z0-9_-]{3,24}$/.test(requestedName))return json({error:"Choose a username of 3–24 characters using letters, numbers, underscores, or hyphens."},400);
  const ip = requestIP(request);
  if (suspiciousName(requestedName)) await recordSecurityEvent(db, {event:"flagged_username_registration_attempt", username:requestedName, ip, detail:"Username matched configured impersonation/abuse keywords."});
  const exists=await db.prepare("SELECT id FROM users WHERE email=? COLLATE NOCASE AND auth_provider='email'").bind(email).first();
  if(exists)return json({error:"An email account already uses that address. Try signing in instead."},409);
  const nameTaken=await db.prepare("SELECT id FROM users WHERE name=? COLLATE NOCASE").bind(requestedName).first();
  if(nameTaken)return json({error:"That username is already taken. Choose another one."},409);
  const hash=await passwordHash(password), name=requestedName;
  const internalDiscordId=`email_${randomToken(18)}`;
  const result=await db.prepare("INSERT INTO users (discord_id,discord_username,global_name,email,name,bio,status,favs,banner,avc,shape,joined,role,links,stats,updated_at,password_hash,auth_provider,email_verified_at) VALUES(?,?,?, ?,?,'','','','Mono','','circle',?,'member','{}','{}',?,?,?,?)")
   .bind(internalDiscordId,"","",email,name,now,now,hash,"email",needVerify?null:now).run();
  const user=await db.prepare("SELECT * FROM users WHERE id=?").bind(result.meta.last_row_id).first();
  if(ip){try{await db.prepare("UPDATE users SET last_ip=? WHERE id=?").bind(ip,user.id).run()}catch{}}
  try { const owner=await db.prepare("SELECT id FROM users WHERE role='owner' ORDER BY id LIMIT 1").first(); if(owner && Number(owner.id)!==Number(user.id)){ await db.prepare("INSERT OR IGNORE INTO follows(follower_id,following_id,created_at) VALUES(?,?,?)").bind(user.id,owner.id,now).run(); await db.prepare("INSERT INTO notifications(user_id,actor_id,kind,detail,created_at) VALUES(?,?,?,?,?)").bind(owner.id,user.id,"follow",JSON.stringify({name:user.name}),now).run(); } } catch(e) { console.error("Default owner follow skipped; apply migration 0009_social_features.sql",String(e?.message||e)); }
  if(!needVerify)return json({ok:true,verificationRequired:false,message:"Account created. You can sign in now."},201);
  try { const token=await issueAuthToken(db,user,"verify"); await sendAuthEmail(env,email,"Verify your MediaTok email","Verify your email address","Click below to verify your email and activate your MediaTok email account. This link expires in 24 hours.","Verify email",`${new URL(request.url).origin}/auth/email/verify?token=${token}`); }
  catch(e){ console.error("Verification email setup/send failed",String(e?.message||e)); await db.prepare("DELETE FROM users WHERE id=? AND auth_provider='email' AND email_verified_at IS NULL").bind(user.id).run(); return json({error:String(e?.message||e)},503); }
  return json({ok:true,verificationRequired:true,message:"Check your inbox for a verification link. You must verify your email before signing in."},201);
 }
 if(mode==="login"){
  if(password.length<12 || password.length>128)return json({error:"Email or password is incorrect."},401);
  const user=await db.prepare("SELECT * FROM users WHERE email=? COLLATE NOCASE AND password_hash IS NOT NULL AND auth_provider='email'").bind(email).first();
  if(!user || !(await verifyPassword(password,user.password_hash)))return json({error:"Email or password is incorrect."},401);
  if(user.banned)return json({error:"This account is unavailable."},403);
  if(!user.email_verified_at&&needVerify)return json({error:"Verify your email first. Check your inbox for the verification link or request another one."},403);
  return await createSession(user,env,new URL(request.url).origin);
 }
 if(mode==="resend-verification"){
  const user=await db.prepare("SELECT * FROM users WHERE email=? COLLATE NOCASE AND auth_provider='email' AND email_verified_at IS NULL").bind(email).first();
  if(user){const recent=await db.prepare("SELECT id FROM auth_tokens WHERE user_id=? AND purpose='verify' AND created_at>? LIMIT 1").bind(user.id,now-10*60*1000).first();if(!recent){try{const token=await issueAuthToken(db,user,"verify");await sendAuthEmail(env,email,"Verify your MediaTok email","Verify your email address","Click below to verify your email. This link expires in 24 hours.","Verify email",`${new URL(request.url).origin}/auth/email/verify?token=${token}`)}catch(e){console.error("Resend verification failed",String(e?.message||e));return json({error:"Could not send email. Check the email service configuration."},503)}}}
  return json({ok:true,message:"If an unverified email account exists, a verification link will be sent."});
 }
 if(mode==="forgot-password"){
  const user=await db.prepare("SELECT * FROM users WHERE email=? COLLATE NOCASE AND auth_provider='email' AND password_hash IS NOT NULL AND email_verified_at IS NOT NULL").bind(email).first();
  if(user){const recent=await db.prepare("SELECT id FROM auth_tokens WHERE user_id=? AND purpose='reset' AND created_at>? LIMIT 1").bind(user.id,now-10*60*1000).first();if(!recent){try{const token=await issueAuthToken(db,user,"reset");await sendAuthEmail(env,email,"Reset your MediaTok password","Reset your password","We received a request to reset your MediaTok password. This link expires in one hour and can only be used once.","Reset password",`${new URL(request.url).origin}/?auth_action=reset&token=${token}`)}catch(e){console.error("Password reset email failed",String(e?.message||e));return json({error:"Could not send email. Check the email service configuration."},503)}}}
  return json({ok:true,message:"If a verified MediaTok email account exists for that address, a password-reset link will be sent."});
 }
 return json({error:"Unknown email authentication action."},404);
}
async function verifyEmailRoute(request,env){
 const url=new URL(request.url),token=url.searchParams.get("token")||"";if(!/^[a-f0-9]{64}$/.test(token))return new Response("This verification link is invalid. Request a new one from MediaTok.",{status:400});
 const hash=await sha256Hex(token),now=Date.now(),row=await env.DB.prepare("SELECT t.id,t.user_id FROM auth_tokens t WHERE t.token_hash=? AND t.purpose='verify' AND t.consumed_at IS NULL AND t.expires_at>? ").bind(hash,now).first();
 if(!row)return new Response("This verification link has expired or was already used. Return to MediaTok and request a new link.",{status:400});
 await env.DB.batch([env.DB.prepare("UPDATE users SET email_verified_at=?,updated_at=? WHERE id=? AND auth_provider='email'").bind(now,now,row.user_id),env.DB.prepare("UPDATE auth_tokens SET consumed_at=? WHERE id=? AND consumed_at IS NULL").bind(now,row.id)]);
 return redirect(url.origin+"/?email_verified=1",{"Cache-Control":"no-store"});
}
async function resetPassword(request,env){
 if(request.method!=="POST")return json({error:"Method not allowed."},405);let body;try{body=await request.json()}catch{return json({error:"Invalid request."},400)}
 const token=String(body.token||""),password=String(body.password||"");if(!/^[a-f0-9]{64}$/.test(token))return json({error:"This reset link is invalid or expired."},400);if(password.length<12||password.length>128)return json({error:"Use a password between 12 and 128 characters."},400);
 const now=Date.now(),hash=await sha256Hex(token),row=await env.DB.prepare("SELECT t.id,t.user_id FROM auth_tokens t JOIN users u ON u.id=t.user_id WHERE t.token_hash=? AND t.purpose='reset' AND t.consumed_at IS NULL AND t.expires_at>? AND u.auth_provider='email' AND u.email_verified_at IS NOT NULL").bind(hash,now).first();if(!row)return json({error:"This reset link is invalid, expired, or already used. Request another one."},400);
 const newHash=await passwordHash(password);await env.DB.batch([env.DB.prepare("UPDATE users SET password_hash=?,updated_at=? WHERE id=? AND auth_provider='email'").bind(newHash,now,row.user_id),env.DB.prepare("UPDATE auth_tokens SET consumed_at=? WHERE id=? AND consumed_at IS NULL").bind(now,row.id),env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(row.user_id)]);return json({ok:true,message:"Password updated. You can now sign in."});
}

async function oauthStart(request, env) {
  if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) return new Response("Discord login isn't configured yet. Add DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET to the mediatok Worker.", { status: 500 });
  const state = randomToken(24), origin = new URL(request.url).origin;
  const callback = `${origin}/auth/discord/callback`, u = new URL("https://discord.com/oauth2/authorize");
  u.searchParams.set("client_id", env.DISCORD_CLIENT_ID); u.searchParams.set("response_type", "code");
  u.searchParams.set("redirect_uri", callback); u.searchParams.set("scope", "identify email"); u.searchParams.set("state", state);
  return redirect(u.toString(), { "Set-Cookie": cookie("mt_oauth_state", state, 600) });
}
async function oauthCallback(request, env) {
  const url = new URL(request.url), code = url.searchParams.get("code"), state = url.searchParams.get("state"), savedState = getCookie(request, "mt_oauth_state");
  if (!code || !state || !savedState || state !== savedState) return new Response("Discord sign-in expired. Go back to MediaTok and try again.", { status: 400 });
  const callback = `${url.origin}/auth/discord/callback`;
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, client_secret: env.DISCORD_CLIENT_SECRET, grant_type: "authorization_code", code, redirect_uri: callback }) });
  if (!tokenRes.ok) return new Response("Discord token exchange failed. Check the redirect URI in the Discord Developer Portal.", { status: 502 });
  const token = await tokenRes.json(), userRes = await fetch("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${token.access_token}` } });
  if (!userRes.ok) return new Response("Could not read your Discord account. Please try again.", { status: 502 });
  const d = await userRes.json(), db = env.DB, now = Date.now(), clientIP = request.headers.get("CF-Connecting-IP") || "";
  if(clientIP){try{const ban=await db.prepare("SELECT id FROM ip_bans WHERE ip_address=? OR ip_hash=?").bind(clientIP,clientIP).first();if(ban)return new Response("Access denied.",{status:403})}catch{}}
  let user = await db.prepare("SELECT * FROM users WHERE discord_id=?").bind(d.id).first();
  if (!user) {
    const name = await uniqueName(db, d.global_name || d.username || `member${d.id.slice(-5)}`);
    const role = (env.OWNER_DISCORD_ID && d.id === env.OWNER_DISCORD_ID) ? "owner" : (env.ADMIN_DISCORD_ID && d.id === env.ADMIN_DISCORD_ID ? "admin" : "member");
    const result = await db.prepare(`INSERT INTO users (discord_id,discord_username,global_name,email,name,bio,status,favs,banner,avc,shape,joined,role,links,stats,updated_at) VALUES (?,?,?,?,?,'','','','Mono',?,'circle',?,?,'{}','{}',?)`)
      .bind(d.id, d.username || "", d.global_name || "", d.email || "", name, avatarUrl(d), now, role, now).run();
    user = await db.prepare("SELECT * FROM users WHERE id=?").bind(result.meta.last_row_id).first();
  } else {
    const role = (env.OWNER_DISCORD_ID && d.id === env.OWNER_DISCORD_ID) ? "owner" : (env.ADMIN_DISCORD_ID && d.id === env.ADMIN_DISCORD_ID ? "admin" : (user.role || "member"));
    await db.prepare("UPDATE users SET discord_username=?,global_name=?,email=?,avc=?,role=?,updated_at=? WHERE id=?").bind(d.username || "", d.global_name || "", d.email || "", avatarUrl(d), role, now, user.id).run();
    if(clientIP){try{await db.prepare("UPDATE users SET last_ip=? WHERE id=?").bind(clientIP,user.id).run()}catch{}}
  }
  if(clientIP){try{await db.prepare("UPDATE users SET last_ip=? WHERE id=?").bind(clientIP,user.id).run()}catch{}}
  const session = randomToken(32);
  await db.prepare("INSERT INTO sessions(token,user_id,expires_at,created_at) VALUES(?,?,?,?)").bind(session, user.id, now + 30 * 24 * 60 * 60 * 1000, now).run();
  const response = redirect(url.origin + "/");
  response.headers.append("Set-Cookie", cookie("mt_session", session, 30 * 24 * 60 * 60));
  response.headers.append("Set-Cookie", cookie("mt_oauth_state", "", 0));
  return response;
}
async function handleAPI(request, env, url, emitCatalogBatch = null) {
  const db = env.DB, method = request.method;
  // Scoped search can progressively stream individual successful catalog batches.
  // The JSON-only endpoint below remains unchanged for existing clients.
  if (url.pathname === "/api/search/catalog" && method === "GET" && url.searchParams.get("stream") === "1") {
    const innerURL = new URL(url.href);
    innerURL.searchParams.delete("stream");
    let closed = false;
    const stream = new ReadableStream({start(controller) {
      const send = event => {if (!closed) {try {controller.enqueue(new TextEncoder().encode(JSON.stringify(event)+"\n"));} catch {closed=true;}}};
      // Execute the same server-side search once; deliver usable results as they arrive.
      Promise.resolve().then(() => handleAPI(request, env, innerURL, rows => send({event:"results",results:rows})))
        .then(async response => {const data=await response.json().catch(()=>({results:[],error:"Search temporarily unavailable"}));if(!response.ok||data.error)send({event:"error",error:data.error||"Catalog temporarily unavailable"});send({event:"done",providerStatus:(!response.ok||data.error)?"offline":"ok",...data});})
        .catch(error => {console.error("Scoped stream error",String(error?.message||error));send({event:"error",error:"Catalog unavailable"});})
        .finally(() => {if(!closed){closed=true;try{controller.close();}catch{}}});
    }});
    return new Response(stream,{headers:{"Content-Type":"application/x-ndjson; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","X-Accel-Buffering":"no"}});
  }
  const actor = (method !== "GET" || url.pathname.startsWith("/api/admin")) ? await currentUser(request, env) : null;
  if (url.pathname === "/api/lists" || url.pathname.startsWith("/api/lists/")) return handleListRoute(request,env,url,actor || await currentUser(request,env));
  const isStaff = u => !!u && ["owner", "admin", "moderator"].includes(u.role);
  const isAdmin = u => !!u && ["owner", "admin"].includes(u.role);
  if (url.pathname === "/api/media-details" && method === "GET") {
    const key=String(url.searchParams.get("key")||"").slice(0,100), type=String(url.searchParams.get("type")||"");
    if(!["film","tv"].includes(type)) return json({error:"Unsupported media detail request."},400);
    if(!env.TMDB_API_KEY)return json({error:"TMDB details are not configured."},503);
    const kind=type==="film"?"movie":"tv", match=key.match(/^tmdb-(movie|tv):(\d{1,12})$/);
    let id=match && match[1]===kind ? match[2] : "";
    // Non-TMDB catalog results (for example iTunes movies) still get credits by title.
    if(!id){
      const title=String(url.searchParams.get("title")||"").trim().slice(0,180), year=String(url.searchParams.get("year")||"").slice(0,4);
      if(!title)return json({error:"A title is required to look up credits."},400);
      const params=new URLSearchParams({api_key:env.TMDB_API_KEY,query:title});
      if(kind==="movie"&&/^\d{4}$/.test(year))params.set("year",year);
      const search=await fetch(`https://api.themoviedb.org/3/search/${kind}?${params}`,{headers:{Accept:"application/json"}});
      if(!search.ok)return json({error:"Media credits are temporarily unavailable."},502);
      const results=(await search.json()).results||[], norm=v=>String(v||"").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
      const exact=results.find(x=>norm(kind==="movie"?(x.title||x.original_title):(x.name||x.original_name))===norm(title));
      const selected=exact||(results.length===1?results[0]:null);if(!selected)return json({error:"No confident matching title was found for cast credits."},404);id=String(selected.id);
    }
    const endpoint=kind==="movie"?`movie/${id}?append_to_response=credits`:`tv/${id}?append_to_response=aggregate_credits`;
    const upstream=await fetch(`https://api.themoviedb.org/3/${endpoint}&api_key=${encodeURIComponent(env.TMDB_API_KEY)}`,{headers:{Accept:"application/json"}});
    if(!upstream.ok)return json({error:"Media credits are temporarily unavailable."},502);
    const d=await upstream.json(), img=p=>p?`https://image.tmdb.org/t/p/w185${p}`:"";
    const raw=kind==="movie"?(d.credits||{}):(d.aggregate_credits||{});
    const cast=(raw.cast||[]).slice(0,18).map(x=>({name:x.name||"",role:kind==="movie"?(x.character||""):(x.roles||[]).map(y=>y.character).filter(Boolean).join(", "),image:img(x.profile_path)}));
    const crew=(raw.crew||[]).filter(x=>kind==="movie"?/director|writer|screenplay|story/i.test(x.job||""):/creator|director|writer|executive producer/i.test(x.jobs?.map(y=>y.job).join(" ")||"")).slice(0,12).map(x=>({name:x.name||"",role:kind==="movie"?(x.job||""):(x.jobs||[]).map(y=>y.job).join(", "),image:img(x.profile_path)}));
    return json({title:d.title||d.name||"",directors:kind==="movie"?(raw.crew||[]).filter(x=>x.job==="Director").map(x=>x.name).slice(0,5):[],creators:kind==="tv"?(d.created_by||[]).map(x=>x.name).slice(0,8):[],crew,cast});
  }
  if (url.pathname === "/api/admin/summary" && method === "GET") {
    const me = await currentUser(request, env); if (!isStaff(me)) return json({error:"Staff access required."},403);
    const {results: users=[]} = await db.prepare("SELECT id,name,discord_username,global_name,role,bio,joined,banned,email,last_ip FROM users ORDER BY joined DESC LIMIT 300").all();
    // Keep the portal usable if an older production database has not applied migration 0003 yet.
    let audit=[]; try { const result=await db.prepare("SELECT a.id,a.action,a.detail,a.created_at,u.name AS actor FROM moderation_audit a JOIN users u ON u.id=a.actor_id ORDER BY a.created_at DESC LIMIT 100").all(); audit=result.results||[]; } catch (e) { audit=[]; }
    let ipBans=[];if(isAdmin(me)){try{const result=await db.prepare('SELECT id,ip_address,reason,created_at FROM ip_bans ORDER BY created_at DESC LIMIT 200').all();ipBans=result.results||[]}catch{ipBans=[]}}
    let securityEvents=[];if(isAdmin(me)){try{const result=await db.prepare('SELECT id,event_type,username,ip_address,detail,created_at FROM security_events ORDER BY created_at DESC LIMIT 200').all();securityEvents=result.results||[]}catch{securityEvents=[]}}
    return json({users: users.map(u=>({...u,email:isAdmin(me)?u.email:undefined,last_ip:isAdmin(me)?u.last_ip:undefined})),audit,auditAvailable:audit.length>0,ipBans,securityEvents,permissions:{manageRoles:isAdmin(me),viewPrivate:isAdmin(me),ban:isStaff(me),manageIpBans:isAdmin(me)}});
  }
  if (url.pathname.match(/^\/api\/admin\/users\/\d+$/) && method === "PATCH") {
    const me = await currentUser(request, env); if (!isStaff(me)) return json({error:"Staff access required."},403);
    let b; try { b=await request.json(); } catch { return json({error:"Invalid request."},400); }
    const targetId=Number(url.pathname.split("/").pop()), target=await db.prepare("SELECT * FROM users WHERE id=?").bind(targetId).first();
    if(!target) return json({error:"User not found."},404);
    if(target.role==="owner" && me.role!=="owner") return json({error:"Only the owner can change the owner account."},403);
    if(b.role!==undefined){if(!isAdmin(me))return json({error:"Only owners and admins can manage roles."},403);if(!["member","moderator","admin"].includes(b.role))return json({error:"Invalid role."},400);if(target.role==="owner")return json({error:"The owner role cannot be changed here."},403);if(b.role==="admin"&&me.role!=="owner")return json({error:"Only the owner can appoint admins."},403);await db.prepare("UPDATE users SET role=?,updated_at=? WHERE id=?").bind(b.role,Date.now(),targetId).run();}
    if(b.banned!==undefined){if(typeof b.banned!=="boolean")return json({error:"Invalid ban value."},400);await db.prepare("UPDATE users SET banned=?,updated_at=? WHERE id=?").bind(b.banned?1:0,Date.now(),targetId).run();}
    try { await db.prepare("INSERT INTO moderation_audit(actor_id,action,target_user_id,detail,created_at) VALUES(?,?,?,?,?)").bind(me.id,b.role!==undefined?"role_change":"ban_change",targetId,JSON.stringify({role:b.role,banned:b.banned}),Date.now()).run(); } catch (e) { /* Role/ban change remains successful on legacy DBs; apply migration 0003 to enable audit history. */ }
    return json({ok:true});
  }
  if (url.pathname === "/api/admin/ip-bans" && method === "POST") {
    const me=await currentUser(request,env);if(!isAdmin(me))return json({error:"Only owners and admins can manage IP bans."},403);
    let b;try{b=await request.json()}catch{return json({error:"Invalid request."},400)}
    const ip=String(b.ip||'').trim(),reason=String(b.reason||'').trim().slice(0,300);
    if(!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip)&&! /^[0-9a-fA-F:]{3,45}$/.test(ip))return json({error:"Enter a valid IPv4 or IPv6 address."},400);
    try{await db.prepare('INSERT INTO ip_bans(ip_hash,ip_address,reason,actor_id,created_at) VALUES(?,?,?,?,?)').bind(ip,ip,reason,me.id,Date.now()).run()}catch(e){if(String(e.message||e).toLowerCase().includes('unique'))return json({error:"That IP is already banned."},409);throw e}
    try{await db.prepare('INSERT INTO moderation_audit(actor_id,action,detail,created_at) VALUES(?,?,?,?)').bind(me.id,'ip_ban',JSON.stringify({ip,reason}),Date.now()).run()}catch{}return json({ok:true});
  }
  if (url.pathname.match(/^\/api\/admin\/ip-bans\/\d+$/) && method === "DELETE") {
    const me=await currentUser(request,env);if(!isAdmin(me))return json({error:"Only owners and admins can manage IP bans."},403);const id=Number(url.pathname.split('/').pop());await db.prepare('DELETE FROM ip_bans WHERE id=?').bind(id).run();try{await db.prepare('INSERT INTO moderation_audit(actor_id,action,detail,created_at) VALUES(?,?,?,?)').bind(me.id,'ip_unban',JSON.stringify({id}),Date.now()).run()}catch{}return json({ok:true});
  }
  // Lightweight artwork-only lookup for unloaded/broken posters. This is
  // separate from search, cached, and never blocks media search results.
  if (url.pathname === "/api/search/cover" && method === "GET") {
    const type=String(url.searchParams.get("type")||"");
    const title=String(url.searchParams.get("q")||"").trim().slice(0,120);
    if(!mediaTypes.has(type)||title.length<2)return json({cover:"",alternates:[]});
    const normalize=v=>String(v||"").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g,"");
    const target=normalize(title);
    const titleMatch=v=>{const n=normalize(v);if(!n||!target)return false;if(n===target)return true;if(target.length>=7&&n.length>=7&&(n.includes(target)||target.includes(n)))return true;const a=String(title||"").toLowerCase().split(/[^a-z0-9]+/).filter(x=>x.length>2),b=String(v||"").toLowerCase().split(/[^a-z0-9]+/).filter(x=>x.length>2);if(!a.length||!b.length)return false;const bs=new Set(b);let hit=0;for(const x of a)if(bs.has(x))hit++;return hit/Math.max(a.length,b.length)>=.7};
    const cache=typeof caches!=="undefined"?caches.default:null;
    const key=new Request("https://mediatok-cache.internal/cover-v85?"+new URLSearchParams({type,q:target}));
    if(cache){try{const response=await cache.match(key);if(response)return new Response(response.body,{headers:{"Content-Type":"application/json","Cache-Control":"public,max-age=3600","X-Cover-Cache":"HIT"}})}catch{}}
    const aborts=new Set();
    const requestJSON=async(u,options={})=>{
      const controller=new AbortController();aborts.add(controller);
      const timer=setTimeout(()=>controller.abort(),3200);
      try{const upstreamHost=new URL(u).hostname;if(await providerCooldown(upstreamHost))throw new Error("Provider temporarily rate-limited");const r=await fetch(u,{...options,signal:controller.signal,headers:{Accept:"application/json",...(options.headers||{})}});if(r.status===429||r.status===503)await backoffProvider(upstreamHost,r.status===429?35:15);if(!r.ok)throw new Error("Provider HTTP "+r.status);return await r.json();}
      finally{clearTimeout(timer);aborts.delete(controller)}
    };
    const tasks=[];
    if(type==="anime"||type==="manga"||type==="light-novel"||type==="webnovel") {
      const kind=type==="anime"?"anime":"manga";
      tasks.push(requestJSON("https://graphql.anilist.co",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:"query($q:String!,$type:MediaType!){Page(perPage:8){media(search:$q,type:$type,sort:SEARCH_MATCH){title{english romaji native synonyms}coverImage{extraLarge large medium}}}}",variables:{q:title,type:type==="anime"?"ANIME":"MANGA"}})}).then(d=>{
        const m=(d.data?.Page?.media||[]).find(x=>[x.title?.english,x.title?.romaji,x.title?.native,...(x.title?.synonyms||[])].some(titleMatch));
        return m?[m.coverImage?.extraLarge,m.coverImage?.large,m.coverImage?.medium].filter(Boolean):[];
      }));
      tasks.push(requestJSON(`https://api.jikan.moe/v4/${kind}?q=${encodeURIComponent(title)}&limit=5`).then(d=>{
        const m=(d.data||[]).find(x=>[x.title,x.title_english,x.title_japanese,...(x.title_synonyms||[])].some(titleMatch));
        return m?[m.images?.jpg?.large_image_url,m.images?.webp?.large_image_url,m.images?.jpg?.image_url,m.images?.webp?.image_url].filter(Boolean):[];
      }));
      if(type==="anime"||type==="manga")tasks.push(requestJSON(`https://kitsu.io/api/edge/${kind}?filter[text]=${encodeURIComponent(title)}&page[limit]=8`).then(d=>{
        const m=(d.data||[]).find(x=>{const a=x.attributes||{};return [a.canonicalTitle,...Object.values(a.titles||{})].some(titleMatch)});
        const p=m?.attributes?.posterImage;return p?[p.large,p.original,p.medium,p.small].filter(Boolean):[];
      }));
    }
    if(["novel","comic","light-novel","webnovel"].includes(type)) {
      tasks.push(requestJSON(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}&maxResults=8`).then(d=>{
        const hit=(d.items||[]).find(x=>normalize(x.volumeInfo?.title)===target&&x.volumeInfo?.imageLinks);const im=hit?.volumeInfo?.imageLinks||{};
        return [im.extraLarge,im.large,im.medium,im.thumbnail,im.smallThumbnail].filter(Boolean).map(x=>String(x).replace(/^http:/,'https:'));
      }));
      tasks.push(requestJSON(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=6&fields=title,cover_i`).then(d=>{
        const doc=(d.docs||[]).find(x=>normalize(x.title)===target&&x.cover_i);
        return doc?[`https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`]:[];
      }));
    }
    if(type==="game") {
      tasks.push(requestJSON(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(title)}&l=en&cc=us`).then(d=>{
        const g=(d.items||[]).find(x=>normalize(x.name)===target);
        return g?[g.tiny_image,`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${g.id}/header.jpg`,`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${g.id}/library_600x900.jpg`].filter(Boolean):[];
      }));
    }
    if(type==="visual-novel") {
      tasks.push(requestJSON("https://api.vndb.org/kana/vn",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filters:["search","=",title],fields:"title,image.url",results:8})}).then(d=>{
        const vn=(d.results||[]).find(x=>normalize(x.title)===target);return vn?.image?.url?[vn.image.url]:[];
      }));
    }
    if(type==="tv") {
      tasks.push(requestJSON(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(title)}`).then(d=>{
        const hit=(d||[]).map(x=>x.show||{}).find(x=>normalize(x.name)===target&&x.image);return hit?[hit.image?.original,hit.image?.medium].filter(Boolean):[];
      }));
    }
    if(type==="film") {
      tasks.push(requestJSON(`https://itunes.apple.com/search?term=${encodeURIComponent(title)}&entity=movie&limit=20`).then(d=>{
        const hit=(d.results||[]).find(x=>normalize(x.trackName)===target);if(!hit)return [];const raw=String(hit.artworkUrl600||hit.artworkUrl100||'');const sizes=['600x900bb','600x600bb','300x450bb'];const variants=sizes.map(size=>raw.replace(/\d+x\d+bb/,size));return [...variants,raw,hit.artworkUrl100].filter((v,i,a)=>v&&a.indexOf(v)===i);
      }));
    }
    // v74: film and TV participate in the same lightweight artwork recovery path.
    const batches=await Promise.race([Promise.allSettled(tasks),new Promise(resolve=>setTimeout(()=>resolve([]),1900))]);
    for(const controller of aborts)controller.abort();
    const urls=[...new Set(batches.flatMap(x=>x.status==="fulfilled"&&Array.isArray(x.value)?x.value:[]))].filter(x=>/^https:\/\//.test(x)).slice(0,6);
    const body={cover:urls[0]||"",alternates:urls.slice(1)};
    // Cache real artwork for a day, but never poison a visitor's covers for
    // half an hour because a shared catalog was briefly throttled.
    // A short negative cooldown still prevents a retry storm.
    if(cache){try{await cache.put(key,new Response(JSON.stringify(body),{headers:{"Content-Type":"application/json","Cache-Control":"public,max-age="+(urls.length?86400:10)}}))}catch{}}
    return json(body);
  }
  if (url.pathname === "/api/search/anilist" && method === "GET") {
    const q=String(url.searchParams.get("q")||"").trim().slice(0,120);
    const type=String(url.searchParams.get("type")||"anime");
    if(!q)return json({results:[]});
    if(!["anime","manga","light-novel","webnovel","visual-novel"].includes(type))return json({error:"Unsupported AniList media type."},400);
    const cache=typeof caches!=="undefined"?caches.default:null;
    const cacheKey=new Request("https://mediatok-cache.internal/anilist?"+new URLSearchParams({type,q:q.toLowerCase()}));
    if(cache){try{const hit=await cache.match(cacheKey);if(hit)return new Response(hit.body,{status:200,headers:hit.headers})}catch{}}
    const mediaType=type==="anime"?"ANIME":"MANGA";
    const format=type==="visual-novel"?",format:VISUAL_NOVEL":(type==="light-novel"||type==="webnovel")?",format_in:[NOVEL,MANGA]":"";
    const gql=`query($search:String!){Page(perPage:24){media(search:$search,type:${mediaType}${format},sort:SEARCH_MATCH){id title{english romaji native} coverImage{extraLarge large medium} startDate{year} format episodes chapters volumes averageScore isAdult description(asHtml:false)}}}`;
    try {
      const upstream=await fetch("https://graphql.anilist.co",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({query:gql,variables:{search:q}}),signal:AbortSignal.timeout(6500)});
      const payload=await upstream.json().catch(()=>({}));
      if(!upstream.ok||payload.errors?.length) {
        console.error("AniList search upstream error",upstream.status,JSON.stringify(payload.errors||[]).slice(0,500));
        return json({error:upstream.status===429?"AniList is rate-limiting searches. Please wait a moment and retry.":"AniList search is temporarily unavailable.",results:[]},502);
      }
      const results=(payload.data?.Page?.media||[]).map(m=>({key:`anilist:${m.id}`,title:m.title?.english||m.title?.romaji||m.title?.native||"",cover:m.coverImage?.extraLarge||m.coverImage?.large||"",coverFallbacks:[m.coverImage?.large,m.coverImage?.medium].filter(Boolean),year:m.startDate?.year||"",subtitle:`${m.format||type} · AniList`,description:m.description||"",adult:!!m.isAdult,extra:[m.episodes?`${m.episodes} episodes`:"",m.chapters?`${m.chapters} chapters`:"",m.volumes?`${m.volumes} volumes`:"",m.averageScore?`AniList score ${m.averageScore}/100`:""].filter(Boolean).join(" · ")}));
      const response=json({results});
      if(cache){try{const headers=new Headers(response.headers);headers.set("Cache-Control","public, max-age=60, s-maxage=600");await cache.put(cacheKey,new Response(JSON.stringify({results}),{headers}))}catch{}}
      return response;
    } catch(e) { console.error("AniList search fetch failed",String(e?.message||e)); return json({error:"Could not connect to AniList. Please retry shortly.",results:[]},502); }
  }
  // One short, independent query for all media.  Scoped catalog search below remains available.
  if (url.pathname === "/api/search/all" && method === "GET") {
    const q=String(url.searchParams.get("q")||"").trim().slice(0,120);
    if(q.length<2)return json({results:[],providerStatus:"empty"});
    const cache=typeof caches!=="undefined"?caches.default:null;
    const key=new Request("https://mediatok-cache.internal/search-all-v35?"+new URLSearchParams({q:q.toLowerCase()}));
    let staleAll=null;
    if(cache){try{const hit=await cache.match(key);if(hit){const body=await hit.json();if(Array.isArray(body.results)){
      staleAll=body.results;
      if(Date.now()-Number(body.at||0)<10*60*1000)return json({...body,cached:true});
    }}}catch{}}
    const streamControllers=new Set();let streamStopped=false;
    const limitedFetch=async (u,options={})=>{
      if(streamStopped)throw new Error("Search finished");
      const abort=new AbortController(), timer=setTimeout(()=>abort.abort(),2500);streamControllers.add(abort);
      try{
        const upstreamHost=new URL(u).hostname;
        if(await providerCooldown(upstreamHost))throw new Error("Provider temporarily rate-limited");
        const r=await fetch(u,{...options,redirect:"follow",signal:abort.signal,headers:{Accept:"application/json",...(options.headers||{})}});
        if(r.status===429||r.status===503)await backoffProvider(upstreamHost,r.status===429?35:15);
        if(!r.ok)throw new Error("HTTP "+r.status);
        const data=await r.json();if(data?.errors?.length)throw new Error(String(data.errors[0]?.message||"GraphQL error"));
        return data;
      }finally{clearTimeout(timer);streamControllers.delete(abort)}
    };
    // Stream each provider's results as soon as it responds; do not make a fast
    // catalog wait for an unrelated, throttled provider. Non-stream clients get JSON.
    const streaming=url.searchParams.get("stream")==="1";
    let streamController=null;
    const stream=streaming?new ReadableStream({start(controller){streamController=controller;}}):null;
    const send=(event)=>{if(streamController){try{streamController.enqueue(new TextEncoder().encode(JSON.stringify(event)+"\n"))}catch{}}};
    const group=[];
    const add=(type,rows)=>{
      const batch=(rows||[]).filter(r=>r?.title).slice(0,12).map(r=>({...r,mediaType:type}));
      group.push(...batch);
      if(batch.length)send({event:"results",results:batch});
    };
    // Avoid flooding Workers' limited outbound connections. Prioritize the
    // frequently searched indexes, then enqueue supplementary providers.
    // At most six remote catalog calls in flight; extra sources queue behind them.
    let outbound=0;const pending=[];
    const limit=(fn)=>new Promise((resolve,reject)=>{
      const run=()=>{if(streamStopped){reject(new Error("Search finished"));return}outbound++;Promise.resolve().then(fn).then(resolve,reject).finally(()=>{outbound--;pending.shift()?.()})};
      if(outbound<6)run();else pending.push(run);
    });
    const jobs=[
      limit(async()=>{
        const query=`query($q:String!){a:Page(perPage:12){media(search:$q,type:ANIME,sort:SEARCH_MATCH){id title{english romaji native} coverImage{extraLarge large medium} startDate{year} format}} m:Page(perPage:12){media(search:$q,type:MANGA,sort:SEARCH_MATCH){id title{english romaji native} coverImage{extraLarge large medium} startDate{year} format}}}`;
        const d=(await limitedFetch("https://graphql.anilist.co",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query,variables:{q}})})).data||{};
        const map=(x,t)=>({key:`anilist:${x.id}`,title:x.title?.english||x.title?.romaji||x.title?.native||"",cover:x.coverImage?.extraLarge||x.coverImage?.large||"",coverFallbacks:[x.coverImage?.large,x.coverImage?.medium].filter(Boolean),year:x.startDate?.year||"",subtitle:x.format||t});
        add("anime",(d.a?.media||[]).map(x=>map(x,"Anime")));
        add("manga",(d.m?.media||[]).map(x=>map(x,"Manga")));
      }),
      limit(async()=>{const d=await limitedFetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=10`);add("anime",(d.data||[]).map(x=>({key:`jikan:anime:${x.mal_id}`,title:x.title_english||x.title,cover:x.images?.jpg?.large_image_url||x.images?.jpg?.image_url||"",coverFallbacks:[x.images?.webp?.large_image_url,x.images?.jpg?.image_url].filter(Boolean),year:x.year||"",subtitle:"Anime · MyAnimeList"})))}),
      limit(async()=>{const d=await limitedFetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(q)}&limit=10`);add("manga",(d.data||[]).map(x=>({key:`jikan:manga:${x.mal_id}`,title:x.title_english||x.title,cover:x.images?.jpg?.large_image_url||x.images?.jpg?.image_url||"",coverFallbacks:[x.images?.webp?.large_image_url,x.images?.jpg?.image_url].filter(Boolean),year:(x.published?.from||"").slice(0,4),subtitle:"Manga · MyAnimeList"})))}),
      limit(async()=>{const d=await limitedFetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(q)}&l=en&cc=us`);add("game",(d.items||[]).filter(x=>x.name&&(!x.type||x.type==="app")).map(x=>({key:`steam-game:${x.id}`,title:x.name,cover:x.tiny_image||`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${x.id}/header.jpg`,coverFallbacks:[`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${x.id}/library_600x900.jpg`,`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${x.id}/header.jpg`].filter(Boolean),subtitle:"Game · Steam"})))}),
      limit(async()=>{const d=await limitedFetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`);add("tv",d.map(x=>{const s=x.show||{};return {key:`tvmaze:${s.id}`,title:s.name,cover:s.image?.original||s.image?.medium||"",year:(s.premiered||"").slice(0,4),subtitle:"TV · TVmaze"}}))}),
      limit(async()=>{const d=await limitedFetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=movie&limit=15`);add("film",(d.results||[]).map(x=>({key:`itunes-movie:${x.trackId}`,title:x.trackName,cover:(x.artworkUrl600||x.artworkUrl100||"").replace(/\d+x\d+bb/,"600x600bb"),coverFallbacks:[(x.artworkUrl600||x.artworkUrl100||"").replace(/\d+x\d+bb/,"600x900bb"),(x.artworkUrl600||x.artworkUrl100||"").replace(/\d+x\d+bb/,"300x450bb"),x.artworkUrl600,x.artworkUrl100].filter(Boolean),year:(x.releaseDate||"").slice(0,4),subtitle:"Film · iTunes"})))}),
      limit(async()=>{const d=await limitedFetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=16&fields=key,title,author_name,first_publish_year,cover_i`);add("novel",(d.docs||[]).map(x=>({key:`openlibrary:${x.key}`,title:x.title,cover:x.cover_i?`https://covers.openlibrary.org/b/id/${x.cover_i}-L.jpg`:"",year:x.first_publish_year||"",subtitle:(x.author_name||[]).slice(0,2).join(", ")||"Open Library"})))}),
      limit(async()=>{const d=await limitedFetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=12`);add("light-novel",(d.items||[]).map(x=>({key:`googlebooks:${x.id}`,title:x.volumeInfo?.title||"",cover:(x.volumeInfo?.imageLinks?.thumbnail||"").replace("http://","https://"),year:(x.volumeInfo?.publishedDate||"").slice(0,4),subtitle:"Book · Google Books"})))}),
      limit(async()=>{const d=await limitedFetch("https://api.vndb.org/kana/vn",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filters:["search","=",q],fields:"id,title,released,image.url",results:12,sort:"searchrank"})});add("visual-novel",(d.results||[]).map(x=>({key:`vndb:${x.id}`,title:x.title,cover:x.image?.url||"",year:(x.released||"").slice(0,4),subtitle:"Visual novel · VNDB"})))}),
      limit(async()=>{const d=await limitedFetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(q)}&page[limit]=8`);add("anime",(d.data||[]).map(x=>{const a=x.attributes||{};return {key:`kitsu:anime:${x.id}`,title:a.titles?.en||a.titles?.en_jp||a.canonicalTitle,cover:a.posterImage?.large||a.posterImage?.medium||"",coverFallbacks:[a.posterImage?.original,a.posterImage?.medium].filter(Boolean),year:(a.startDate||"").slice(0,4),subtitle:"Anime · Kitsu"}}))}),
      limit(async()=>{const d=await limitedFetch(`https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(q)}&page[limit]=8`);add("manga",(d.data||[]).map(x=>{const a=x.attributes||{};return {key:`kitsu:manga:${x.id}`,title:a.titles?.en||a.titles?.en_jp||a.canonicalTitle,cover:a.posterImage?.large||a.posterImage?.medium||"",coverFallbacks:[a.posterImage?.original,a.posterImage?.medium].filter(Boolean),year:(a.startDate||"").slice(0,4),subtitle:"Manga · Kitsu"}}))})
    ];
    const finalize=async()=>{
      // Bound total latency even when a proxy buffers the response stream.
      let settled=null;
      let deadline;
      await Promise.race([Promise.allSettled(jobs).then(x=>{settled=x}),new Promise(resolve=>{deadline=setTimeout(resolve,2300)})]);
      clearTimeout(deadline);streamStopped=true;for(const c of streamControllers)c.abort();
      const failed=settled?settled.filter(x=>x.status==="rejected").length:jobs.length;
      const normalize=v=>String(v||"").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g,"").trim();
      const nq=normalize(q), seen=new Set(), count=new Map();
      const final=group.filter(x=>{const id=x.mediaType+":"+normalize(x.title);if(seen.has(id))return false;seen.add(id);return true;})
        .sort((a,b)=>{const score=x=>{const t=normalize(x.title);return (t===nq?120:0)+(t.startsWith(nq)?50:0)+(t.includes(nq)?20:0)+(x.cover?2:0)};return score(b)-score(a)})
        .filter(x=>{const n=count.get(x.mediaType)||0;if(n>=6)return false;count.set(x.mediaType,n+1);return true}).slice(0,30);
      const providerStatus=settled?(failed===jobs.length?"offline":failed?"partial":"ok"):(final.length?"partial":"offline");
      const chosen=final.length?final:(staleAll?.length?staleAll:[]);
      const body={results:chosen,providerStatus:final.length?providerStatus:(chosen.length?"stale":providerStatus),failedProviders:failed,totalProviders:jobs.length,at:Date.now(),stale:!final.length&&chosen.length>0};
      // Long-lived successful edge cache survives intermittent shared-provider outages.
      if(final.length&&cache){try{await cache.put(key,new Response(JSON.stringify(body),{headers:{"Content-Type":"application/json","Cache-Control":"public, max-age=86400"}}))}catch{}}
      send({event:"done",...body});
      if(streamController){try{streamController.close()}catch{}}
      return json(body,failed===jobs.length&&!final.length?503:200);
    };
    if(streaming){
      void finalize().catch(e=>{send({event:"error",error:"Media catalog unavailable"});try{streamController.close()}catch{};console.error("All media streaming search failed",String(e))});
      return new Response(stream,{headers:{"Content-Type":"application/x-ndjson; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff","X-Accel-Buffering":"no"}});
    }
    return await finalize();
  }
  if (url.pathname === "/api/search/catalog" && method === "GET") {
    const q=String(url.searchParams.get("q")||"").trim().slice(0,160);
    const type=String(url.searchParams.get("type")||"anime");
    if(!q)return json({results:[]});
    if(!["anime","manga","light-novel","webnovel","visual-novel","film","tv","novel","comic","game"].includes(type))return json({error:"Unsupported media type."},400);
    const includeAdult=true;
    const results=[];
    // Keep prior successful results for 48 hours so transient provider outages
    // can return stale-but-usable results. Refresh active results after 10 min.
    const cache=typeof caches!=="undefined"?caches.default:null;
    const cacheKey=new Request("https://mediatok-cache.internal/catalog-v35?"+new URLSearchParams({type,q:q.toLowerCase()}).toString());
    let staleResults=null;
    if(cache){try{
      const hit=await cache.match(cacheKey);
      if(hit){const cached=await hit.json();if(Array.isArray(cached.results)){
        staleResults=cached.results;
        if(Date.now()-Number(cached.at||0)<10*60*1000)return json({results:cached.results,cached:true});
      }}
    }catch(e){console.warn("Catalog cache read failed",String(e))}}
    // Explicit timeouts prevent one unresponsive upstream from hanging search.
    // Rate limits and provider failures are isolated by Promise.allSettled.
    const activeCatalogFetches=new Set();
    const safeFetch=async(u,opts={})=>{
      const controller=new AbortController();activeCatalogFetches.add(controller);
      const timer=setTimeout(()=>controller.abort(),1950);
      try{
        // Avoid forbidden / unnecessary User-Agent headers in cross-origin Worker fetches.
        const upstreamHost=new URL(u).hostname;
        if(await providerCooldown(upstreamHost))throw new Error("Provider temporarily rate-limited");
        const r=await fetch(u,{...opts,signal:controller.signal,headers:{"Accept":"application/json",...(opts.headers||{})}});
        if(r.status===429||r.status===503)await backoffProvider(upstreamHost,r.status===429?35:15);
        if(!r.ok)throw new Error(`Provider returned ${r.status}`);
        const data=await r.json();
        if(data?.errors?.length)throw new Error(`GraphQL provider error: ${String(data.errors[0]?.message||"Unknown").slice(0,80)}`);
        return data;
      }finally{clearTimeout(timer);activeCatalogFetches.delete(controller)}
    };
    // Run providers in parallel; a failing provider never blocks or hides the others.
    const norm=v=>String(v||"").toLowerCase().replace(/[^a-z0-9]+/g,"").trim();
    let providerOk=0,providerFail=0;
    // Fast-first catalog search: return the first nonempty successful provider,
    // allowing a brief grace period to collect other completed responses.
    // Never wait the full timeout of every external API just to show a title.
    const gather=async(jobs)=>await new Promise(resolve=>{
      let completed=0,finished=false,grace=null;
      const replies=Array(jobs.length);
      const finish=()=>{
        if(finished)return;finished=true;clearTimeout(hard);if(grace)clearTimeout(grace);
        const seen=new Set(results.map(x=>norm(x.title)));
        for(const batch of replies){if(!Array.isArray(batch))continue;for(const item of batch){const k=norm(item.title);if(!k||seen.has(k))continue;seen.add(k);results.push(item)}}
        for(const controller of activeCatalogFetches)controller.abort();
        resolve();
      };
      const hard=setTimeout(finish,1550);
      for(const [i,job] of jobs.entries())Promise.resolve(job).then(batch=>{
        if(finished)return;
        providerOk++;replies[i]=Array.isArray(batch)?batch:[];
        if(replies[i].length && typeof emitCatalogBatch === "function") emitCatalogBatch(replies[i].filter(x=>x?.title).slice(0,20).map(x=>({...x,mediaType:type})));
        if(replies[i].some(x=>x?.title)&&!grace)grace=setTimeout(finish,350);
      }).catch(e=>{if(!finished){providerFail++;console.warn("Catalog fallback failed",String(e?.message||e))}})
      .finally(()=>{if(!finished&&++completed===jobs.length)finish()});
    });
    try {
      if(type==="webnovel") {
        // Web fiction has no complete, universal catalog. Search several independent indexes
        // and merge their results so lesser-known and translated titles have a better chance.
        const media=`id title{english romaji native} coverImage{extraLarge large medium} startDate{year} format volumes averageScore isAdult description(asHtml:false)`;
        const aq=`query ($search:String!){Page(perPage:30){media(search:$search,type:MANGA,format:NOVEL,sort:SEARCH_MATCH){${media}}}}`;
        const mapGoogle=x=>{const v=x.volumeInfo||{};return {key:`googlebooks-webnovel:${x.id}`,title:v.title||"",cover:(v.imageLinks?.thumbnail||v.imageLinks?.smallThumbnail||"").replace("http://","https://"),year:(v.publishedDate||"").slice(0,4),subtitle:`Web fiction / book · ${(v.authors||[]).slice(0,2).join(", ")||"Google Books"}`,creator:(v.authors||[]).join(", "),description:v.description||"",extra:[v.publisher,v.pageCount?`${v.pageCount} pages`:""].filter(Boolean).join(" · ")}};
        const mapOpen=x=>({key:`openlibrary-webnovel:${x.key||x.edition_key?.[0]||x.title}`,title:x.title||"",cover:x.cover_i?`https://covers.openlibrary.org/b/id/${x.cover_i}-L.jpg`:"",year:x.first_publish_year||"",subtitle:`Web fiction / book · ${(x.author_name||[]).slice(0,2).join(", ")||"Open Library"}`,creator:(x.author_name||[]).join(", "),extra:(x.subject||[]).slice(0,4).join(" · ")});
        const jobs=[
          safeFetch("https://graphql.anilist.co",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:aq,variables:{search:q}})}).then(j=>(j.data?.Page?.media||[]).map(m=>({key:`anilist-webnovel:${m.id}`,title:m.title?.english||m.title?.romaji||m.title?.native||"",cover:m.coverImage?.extraLarge||m.coverImage?.large||"",coverFallbacks:[m.coverImage?.large,m.coverImage?.medium].filter(Boolean),year:m.startDate?.year||"",subtitle:"Web novel / novel · AniList",description:m.description||"",adult:!!m.isAdult,extra:[m.format||"",m.volumes?`${m.volumes} volumes`:"",m.averageScore?`AniList score ${m.averageScore}/100`:""].filter(Boolean).join(" · ")}))),
          safeFetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=40&printType=books`).then(j=>(j.items||[]).map(mapGoogle)),
          safeFetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=30&fields=key,title,author_name,first_publish_year,cover_i,subject`).then(j=>(j.docs||[]).map(mapOpen)),
          // Wikipedia catches web serials with articles even when book indexes omit them.
          safeFetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q+' (web novel OR web serial OR web fiction)')}&gsrnamespace=0&gsrlimit=15&prop=pageimages%7Cextracts%7Cinfo&inprop=url&piprop=thumbnail&pithumbsize=500&exintro=1&explaintext=1&format=json&origin=*`).then(j=>Object.values(j.query?.pages||{}).map(x=>({key:`wikipedia-webnovel:${x.pageid}`,title:x.title||"",cover:x.thumbnail?.source||"",year:((x.extract||"").match(/\b(?:19|20)\d{2}\b/)||[])[0]||"",subtitle:"Web fiction · Wikipedia",description:x.extract||"",extra:x.fullurl||""}))),
          // Search with a broader web-fiction phrase too; some catalogs index aliases or translated names.
          safeFetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q+' web novel')}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,subject`).then(j=>(j.docs||[]).map(mapOpen))
        ];
        await gather(jobs);
        // A query-specific curated seed helps for notable works that are missing from public indexes.
        // This is a fallback, not a claim to be a complete list of all web novels.
        const curatedWebNovels=[
          {title:"Reverend Insanity",aliases:["gu zhen ren","master of gu","daoist gu"],creator:"Gu Zhen Ren",year:"2012",description:"A dark cultivation fantasy web novel about Fang Yuan and his pursuit of immortality."},
          {title:"Lord of Mysteries",aliases:["circle of inevitability","cuttlefish that loves diving"],creator:"Cuttlefish That Loves Diving",year:"2018",description:"A mystery-driven fantasy web novel with occult powers, secret organizations, and cosmic horror."},
          {title:"Shadow Slave",aliases:["guiltythree"],creator:"Guiltythree",year:"2022",description:"A dark fantasy web serial about survival and a dangerous supernatural world."},
          {title:"Mother of Learning",aliases:["domagoj kurmaic","nobody103"],creator:"Domagoj Kurmaic",year:"2011",description:"A time-loop fantasy about a young mage repeatedly reliving the month before a catastrophic invasion."},
          {title:"The Beginning After the End",aliases:["turtleme","tbate"],creator:"TurtleMe",year:"2017",description:"A reincarnation fantasy following a former king reborn into a world of magic."},
          {title:"Omniscient Reader's Viewpoint",aliases:["omniscient readers viewpoint","sing shong","orv"],creator:"singNsong",year:"2018",description:"A reader discovers that the apocalyptic scenario from his favorite web novel has become reality."},
          {title:"The Legendary Mechanic",aliases:["qi peijia"],creator:"Qi Peijia",year:"2017",description:"A science-fantasy web novel about a player trapped in a game-like universe."},
          {title:"Warlock of the Magus World",aliases:["the wizard world"],creator:"The Plagiarist",year:"2016",description:"A progression fantasy about a calculating protagonist using an AI chip to pursue power."},
          {title:"A Record of a Mortal's Journey to Immortality",aliases:["mortal journey to immortality","wang yu"],creator:"Wang Yu",year:"2008",description:"A cultivation story following an ordinary young man on the path to immortality."},
          {title:"Supreme Magus",aliases:["legion20"],creator:"Legion20",year:"2018",description:"A reincarnation fantasy about magic, identity, and survival."}
        ];
        const nq=norm(q);
        for(const w of curatedWebNovels){const match=[w.title,...w.aliases].some(v=>{const nv=norm(v);return nv===nq||(nq.length>=4&&(nv.includes(nq)||nq.includes(nv)))});if(match&&!results.some(r=>norm(r.title)===norm(w.title)))results.push({key:`mediatok-webnovel:${norm(w.title)}`,title:w.title,cover:"",year:w.year,subtitle:"Web novel · MediaTok index",creator:w.creator,description:w.description,extra:`Author: ${w.creator} · Curated web-serial entry`})}
        results.sort((a,b)=>Number(norm(b.title)===nq)-Number(norm(a.title)===nq));
      } else if(type==="light-novel") {
        // Light novels are indexed inconsistently, so ask AniList both with and without the NOVEL format filter.
        const media=`id title{english romaji native} coverImage{extraLarge large medium} startDate{year} format volumes averageScore isAdult description(asHtml:false)`;
        const aq=(filter)=>`query ($search:String!){Page(perPage:20){media(search:$search,type:MANGA${filter},sort:SEARCH_MATCH){${media}}}}`;
        const aniMap=m=>({key:`anilist-ln:${m.id}`,title:m.title?.english||m.title?.romaji||m.title?.native||"",cover:m.coverImage?.extraLarge||m.coverImage?.large||"",coverFallbacks:[m.coverImage?.large,m.coverImage?.medium].filter(Boolean),year:m.startDate?.year||"",subtitle:`Light novel · AniList${m.format&&m.format!=="NOVEL"?` · ${m.format}`:""}`,description:m.description||"",adult:!!m.isAdult,extra:[m.volumes?`${m.volumes} volumes`:"",m.averageScore?`AniList score ${m.averageScore}/100`:""].filter(Boolean).join(" · ")});
        const ani=(filter)=>safeFetch("https://graphql.anilist.co",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:aq(filter),variables:{search:q.replace(/\s+series$/i,"")}})}).then(j=>(j.data?.Page?.media||[]).map(aniMap));
        await gather([
          ani(",format_in:[NOVEL]"),
          ani(""),
          safeFetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(q)}&limit=20`).then(j=>(j.data||[]).map(m=>({key:`jikan-ln:${m.mal_id}`,title:m.title_english||m.title||"",cover:m.images?.jpg?.large_image_url||m.images?.jpg?.image_url||"",coverFallbacks:[m.images?.webp?.large_image_url,m.images?.jpg?.image_url,m.images?.webp?.image_url].filter(Boolean),year:m.published?.from?.slice(0,4)||"",subtitle:`${m.type||"Novel"} · MyAnimeList`,description:m.synopsis||"",creator:(m.authors||[]).map(a=>a.name).join(", "),adult:/rx|hentai|explicit/i.test(String(m.rating||"")),extra:[m.volumes?`${m.volumes} volumes`:"",m.score?`MAL score ${m.score}`:""].filter(Boolean).join(" · ")}))),
          safeFetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent('intitle:'+q)}&maxResults=20`).then(j=>(j.items||[]).map(x=>{const v=x.volumeInfo||{};return {key:`googlebooks-ln:${x.id}`,title:v.title||"",cover:(v.imageLinks?.thumbnail||v.imageLinks?.smallThumbnail||"").replace("http://","https://"),year:(v.publishedDate||"").slice(0,4),subtitle:`Book · ${(v.authors||[]).slice(0,2).join(", ")||"Google Books"}`,creator:(v.authors||[]).join(", "),description:v.description||"",extra:[v.publisher,v.pageCount?`${v.pageCount} pages`:""].filter(Boolean).join(" · ")}})),
          safeFetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,subject`).then(j=>(j.docs||[]).map(x=>({key:`openlibrary-ln:${x.key}`,title:x.title||"",cover:x.cover_i?`https://covers.openlibrary.org/b/id/${x.cover_i}-L.jpg`:"",year:x.first_publish_year||"",subtitle:`Book · ${(x.author_name||[]).slice(0,2).join(", ")||"Open Library"}`,creator:(x.author_name||[]).join(", "),extra:(x.subject||[]).slice(0,3).join(" · ")})))
        ]);
        // Exact title matches first so similarly named adaptations don't bury the requested series.
        results.sort((a,b)=>Number(norm(b.title)===norm(q))-Number(norm(a.title)===norm(q)));
      } else if(type==="anime"||type==="manga") {
        // AniList, MyAnimeList (Jikan) and Kitsu are queried together; AniList results keep priority in the merged list.
        const aq=`query ($search:String!){Page(perPage:12){media(search:$search,type:${type==="anime"?"ANIME":"MANGA"},sort:SEARCH_MATCH){id title{english romaji} coverImage{extraLarge large medium} startDate{year} format episodes chapters volumes averageScore isAdult description(asHtml:false) staff(perPage:3,sort:RELEVANCE){nodes{name{full}}} studios(isMain:true,perPage:3){nodes{name}}}}}`;
        await gather([
          safeFetch("https://graphql.anilist.co",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:aq,variables:{search:q}})}).then(j=>(j.data?.Page?.media||[]).map(m=>({key:`anilist:${m.id}`,title:m.title?.english||m.title?.romaji||"",cover:m.coverImage?.extraLarge||m.coverImage?.large||"",coverFallbacks:[m.coverImage?.large,m.coverImage?.medium].filter(Boolean),year:m.startDate?.year||"",subtitle:m.format||"AniList",description:m.description||"",creator:(m.staff?.nodes||[]).map(x=>x.name?.full).filter(Boolean).join(", "),studio:(m.studios?.nodes||[]).map(x=>x.name).filter(Boolean).join(", "),adult:!!m.isAdult,extra:[m.episodes?`${m.episodes} episodes`:"",m.chapters?`${m.chapters} chapters`:"",m.volumes?`${m.volumes} volumes`:"",m.averageScore?`AniList score ${m.averageScore}/100`:""].filter(Boolean).join(" · ")}))),
          safeFetch(`https://api.jikan.moe/v4/${type}?q=${encodeURIComponent(q)}&limit=12`).then(j=>(j.data||[]).map(m=>({key:`jikan:${type}:${m.mal_id}`,title:m.title_english||m.title||"",cover:m.images?.jpg?.large_image_url||m.images?.jpg?.image_url||"",coverFallbacks:[m.images?.webp?.large_image_url,m.images?.jpg?.image_url,m.images?.webp?.image_url].filter(Boolean),year:m.year||m.published?.from?.slice(0,4)||"",subtitle:`${m.type||type} · MyAnimeList`,description:m.synopsis||"",creator:(m.authors||[]).map(a=>a.name).join(", "),studio:(m.studios||[]).map(a=>a.name).join(", "),ageRating:m.rating||"",extra:[m.episodes?`${m.episodes} episodes`:"",m.chapters?`${m.chapters} chapters`:"",m.volumes?`${m.volumes} volumes`:"",m.score?`MAL score ${m.score}`:""].filter(Boolean).join(" · ")}))),
          safeFetch(`https://kitsu.io/api/edge/${type}?filter[text]=${encodeURIComponent(q)}&page[limit]=12&sort=-userCount`).then(j=>(j.data||[]).map(item=>{const a=item.attributes||{},titles=a.titles||{};return {key:`kitsu:${type}:${item.id}`,title:titles.en||titles.en_jp||a.canonicalTitle||"",cover:a.posterImage?.large||a.posterImage?.original||a.posterImage?.medium||"",coverFallbacks:[a.posterImage?.original,a.posterImage?.medium,a.posterImage?.small].filter(Boolean),year:(a.startDate||"").slice(0,4),subtitle:`${a.subtype||type} · Kitsu`,description:a.synopsis||"",creator:"",studio:"",ageRating:a.ageRating||"",extra:[a.episodeCount?`${a.episodeCount} episodes`:"",a.chapterCount?`${a.chapterCount} chapters`:"",a.volumeCount?`${a.volumeCount} volumes`:"",a.averageRating?`Kitsu score ${(Number(a.averageRating)/10).toFixed(1)}/10`:""].filter(Boolean).join(" · ")}}))
        ]);
      } else if(type==="visual-novel") {
        await gather([
          safeFetch("https://api.vndb.org/kana/vn",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filters:["search","=",q],fields:"title, released, image.url, id, description, developers.name",results:20,sort:"searchrank"})}).then(j=>(j.results||[]).map(x=>({key:`vndb:${x.id}`,title:x.title,cover:x.image?.url||"",year:(x.released||"").slice(0,4),subtitle:"Visual novel · VNDB",description:x.description||"",creator:(x.developers||[]).map(d=>d.name).join(", "),extra:x.released?`Released ${x.released}`:""}))),
          safeFetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q+" visual novel game")}&gsrlimit=12&prop=pageimages%7Cextracts&piprop=thumbnail&pithumbsize=400&exintro=1&explaintext=1&format=json`).then(j=>Object.values(j.query?.pages||{}).filter(x=>/visual novel/i.test(x.extract||"")).map(x=>({key:`wikipedia-vn:${x.pageid}`,title:x.title,cover:x.thumbnail?.source||"",year:((x.extract||"").match(/\b(?:19|20)\d{2}\b/)||[])[0]||"",subtitle:"Visual novel · Wikipedia",description:x.extract||""})))
        ]);
      } else if(type==="tv") {
        // Search more than one public TV index query so titles/aliases omitted from a single
        // TVmaze query can still be found. TMDB is added when the operator configured a key.
        const cleanTV=v=>String(v||"").replace(/<[^>]*>/g," ").replace(/&amp;/g,"&").replace(/&#039;/g,"'").replace(/\s+/g," ").trim();
        const terms=[q,q.replace(/:/g," "),q.replace(/\bthe\b/ig," ").replace(/\s+/g," ").trim()].filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,3);
        const tvJobs=terms.map(term=>safeFetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(term)}`).then(j=>(j||[]).map(x=>{const a=x.show||{};return {key:`tvmaze:${a.id}`,title:cleanTV(a.name),cover:a.image?.original||a.image?.medium||"",year:(a.premiered||"").slice(0,4),subtitle:(a.genres||[]).slice(0,2).join(", ")||"TV show",description:cleanTV(a.summary||""),creator:a.network?.name||a.webChannel?.name||"",extra:[a.type,a.status,a.premiered?`Premiered ${a.premiered}`:"",a.ended?`Ended ${a.ended}`:""].filter(Boolean).join(" · "),mediaKind:"tv"};})));
        if(env.TMDB_API_KEY)tvJobs.push(safeFetch(`https://api.themoviedb.org/3/search/tv?api_key=${encodeURIComponent(env.TMDB_API_KEY)}&query=${encodeURIComponent(q)}&include_adult=${includeAdult}`).then(j=>(j.results||[]).map(x=>({key:`tmdb-tv:${x.id}`,title:x.name||x.original_name||"",cover:x.poster_path?`https://image.tmdb.org/t/p/w500${x.poster_path}`:"",year:(x.first_air_date||"").slice(0,4),subtitle:"TV show · TMDB",description:x.overview||"",creator:"",adult:!!x.adult,extra:x.first_air_date?`First aired ${x.first_air_date}`:"",mediaKind:"tv"}))));
        const settledTV=await Promise.allSettled(tvJobs);for(const item of settledTV){if(item.status==="fulfilled"){providerOk++;for(const x of item.value)results.push(x)}else providerFail++}
        // Free fallback for recognizable TV series not indexed by TVmaze; do not show
        // Wikipedia results without an article image, matching the site's no-missing-cover rule.
        try{const w=await safeFetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q+" television series TV show")}&gsrnamespace=0&gsrlimit=12&prop=pageimages%7Cextracts&piprop=thumbnail%7Coriginal&pithumbsize=500&exintro=1&explaintext=1&format=json&origin=*`);for(const a of Object.values(w.query?.pages||{})){const title=cleanTV(a.title||""),description=cleanTV(a.extract||"");const image=a.thumbnail?.source||a.original?.source||"";if(!title||!image||!description||!/(television series|animated series|TV series|television show|animated television)/i.test(description.slice(0,1400)))continue;const proxiedCover=new URL("/api/catalog-image",url.origin);proxiedCover.searchParams.set("url",image);results.push({key:`wikipedia-tv:${a.pageid}`,title,cover:proxiedCover.href,year:(description.match(/\b(?:19|20)\d{2}\b/)||[])[0]||"",subtitle:"TV show · Wikipedia",description,creator:"",extra:"Television series",mediaKind:"tv"});}}catch(e){console.error("TV Wikipedia fallback failed",String(e?.message||e))}
      } else if(type==="film") {
        // Use independent public catalogs, then Wikipedia as a final no-key fallback.
        const filmProviders=[];
        if(env.TMDB_API_KEY) filmProviders.push(safeFetch(`https://api.themoviedb.org/3/search/movie?api_key=${encodeURIComponent(env.TMDB_API_KEY)}&query=${encodeURIComponent(q)}&include_adult=${includeAdult}`).then(j=>(j.results||[]).map(x=>({key:`tmdb-movie:${x.id}`,title:x.title||x.original_title,cover:x.poster_path?`https://image.tmdb.org/t/p/w500${x.poster_path}`:"",year:(x.release_date||"").slice(0,4),subtitle:"Film · TMDB",description:x.overview||"",adult:!!x.adult,extra:x.release_date?`Released ${x.release_date}`:""}))));
        filmProviders.push(safeFetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=movie&limit=25`).then(j=>(j.results||[]).filter(x=>x.trackName).map(x=>({key:`itunes-movie:${x.trackId}`,title:x.trackName,cover:(x.artworkUrl600||x.artworkUrl100||"").replace(/\d+x\d+bb/,"600x600bb"),coverFallbacks:[(x.artworkUrl600||x.artworkUrl100||"").replace(/\d+x\d+bb/,"600x900bb"),(x.artworkUrl600||x.artworkUrl100||"").replace(/\d+x\d+bb/,"300x450bb"),x.artworkUrl600,x.artworkUrl100].filter(Boolean),year:(x.releaseDate||"").slice(0,4),subtitle:x.primaryGenreName||"Film",description:x.longDescription||"",creator:x.artistName||"",extra:x.releaseDate?`Released ${x.releaseDate}`:""}))));
        const settled=await Promise.allSettled(filmProviders);for(const item of settled){if(item.status==="fulfilled"){providerOk++;results.push(...item.value)}else providerFail++}
        if(!results.length){
          try {
            const search=await safeFetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q+' film movie')}&srnamespace=0&srlimit=12&format=json&origin=*`);
            const pages=(search.query?.search||[]).filter(x=>x.title);
            const details=await Promise.allSettled(pages.map(x=>safeFetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages%7Cextracts&piprop=thumbnail&pithumbsize=500&exintro=1&explaintext=1&titles=${encodeURIComponent(x.title)}&format=json&origin=*`)));
            for(let i=0;i<details.length;i++){if(details[i].status!=="fulfilled")continue;const page=Object.values(details[i].value.query?.pages||{})[0];if(!page?.title)continue;results.push({key:`wikipedia-film:${page.pageid}`,title:page.title.replace(/\s*\(.*?\)\s*$/,""),cover:page.thumbnail?.source||"",year:(page.extract?.match(/\b(?:18|19|20)\d{2}\b/)||[])[0]||"",subtitle:"Film · Wikipedia",description:page.extract||"",extra:""});}
          } catch(e) { console.error("Wikipedia film fallback",String(e?.message||e)); }
        }
      } else if(type==="novel"||type==="comic") {
        // Open Library is slow and Google Books throttles shared IPs, so run both and keep whatever answers.
        await gather([
          safeFetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=15&fields=key,title,author_name,first_publish_year,cover_i,subject`).then(j=>(j.docs||[]).map(x=>({key:`openlibrary:${x.key}`,title:x.title,cover:x.cover_i?`https://covers.openlibrary.org/b/id/${x.cover_i}-L.jpg`:"",year:x.first_publish_year||"",subtitle:(x.author_name||[]).slice(0,2).join(", "),creator:(x.author_name||[]).join(", "),extra:(x.subject||[]).slice(0,3).join(" · ")}))),
          safeFetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(q)}&maxResults=15`).then(j=>(j.items||[]).filter(x=>x.volumeInfo?.title).map(x=>{const v=x.volumeInfo||{};return {key:`googlebooks:${x.id}`,title:v.title,cover:(v.imageLinks?.thumbnail||v.imageLinks?.smallThumbnail||"").replace("http://","https://"),year:(v.publishedDate||"").slice(0,4),subtitle:(v.authors||[]).slice(0,2).join(", "),creator:(v.authors||[]).join(", "),description:v.description||"",extra:[v.publisher,v.pageCount?`${v.pageCount} pages`:""].filter(Boolean).join(" · ")}}))
        ]);
      } else {
        // Console/PC games are not reliably indexed by Apple's mobile-app catalog.
        // Search Steam plus Wikipedia so well-known console titles still appear.
        const gameTerms=[q,q.replace(/\s+(remake|remastered|reload|edition)$/i,""),q.replace(/[:：]/g," ")].filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,3);
        const gameJobs=[];
        for(const term of gameTerms){
          gameJobs.push(safeFetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&l=en&cc=us`).then(j=>(j.items||[]).filter(x=>x.name&&(!x.type||x.type==="app")).map(x=>({key:`steam-game:${x.id}`,title:x.name,cover:x.tiny_image||`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${x.id}/header.jpg`,coverFallbacks:[`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${x.id}/library_600x900.jpg`,`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${x.id}/header.jpg`].filter(Boolean),year:"",subtitle:"PC game · Steam",description:"",creator:"",extra:"Steam catalog"}))));
          gameJobs.push(safeFetch(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term+' video game')}&gsrnamespace=0&gsrlimit=10&prop=pageimages%7Cextracts%7Cinfo&inprop=url&piprop=thumbnail&pithumbsize=500&exintro=1&explaintext=1&format=json&origin=*`).then(j=>Object.values(j.query?.pages||{}).filter(a=>a.title&&/\b(video game|game series|survival horror game|role-playing game|action-adventure game)\b/i.test(a.extract||"")).map(a=>({key:`wikipedia-game:${a.pageid}`,title:a.title,cover:a.thumbnail?.source||"",year:((a.extract||"").match(/\b(?:19|20)\d{2}\b/)||[])[0]||"",subtitle:"Video game · Wikipedia",description:a.extract||"",creator:"",extra:a.fullurl||""}))));
        }
        await gather(gameJobs);
      }
      const normalizedQuery=String(q||"").toLowerCase().replace(/[^a-z0-9]+/g,"").trim();
      const uniqueResults=[];const seenCatalogTitles=new Set();
      for(const item of results){const k=String(item.title||"").toLowerCase().replace(/[^a-z0-9]+/g,"").trim();if(!k||seenCatalogTitles.has(k))continue;seenCatalogTitles.add(k);uniqueResults.push(item)}
      const score=item=>{const title=norm(item.title);return (title===normalizedQuery?100:0)+(title.startsWith(normalizedQuery)?30:0)+(title.includes(normalizedQuery)?10:0)};
      uniqueResults.sort((a,b)=>score(b)-score(a));
      const final=uniqueResults.filter(x=>x.title).slice(0,24);
      // Only report an outage when every provider failed; otherwise return what we have.
      if(!final.length&&providerOk===0&&providerFail>0)throw new Error("All catalog providers failed");
      // If upstreams are failing, preserve the last successful cached search.
      if(!final.length&&staleResults?.length&&providerFail>0)return json({results:staleResults,cached:true,stale:true});
      const body={results:final,provider:"server"};
      if(final.length&&cache){try{await cache.put(cacheKey,new Response(JSON.stringify({...body,at:Date.now()}),{headers:{"Content-Type":"application/json","Cache-Control":"public, max-age=172800"}}))}catch(e){console.warn("Catalog cache write failed",String(e))}}
      return json(body);
    } catch(e) { console.error("Catalog search failed",{type,message:String(e?.message||e)});if(staleResults?.length)return json({results:staleResults,cached:true,stale:true});return json({error:"All available media search providers are unavailable right now. Please retry shortly."},503); }
  }
  if (url.pathname === "/api/search/film" && method === "GET") {
    const q=String(url.searchParams.get("q")||"").trim().slice(0,160);if(!q)return json({results:[]});
    const includeAdult=true;
    if(!env.TMDB_API_KEY)return json({results:[],configured:false});
    const r=await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${encodeURIComponent(env.TMDB_API_KEY)}&query=${encodeURIComponent(q)}&include_adult=${includeAdult}`,{headers:{"Accept":"application/json"}});
    if(!r.ok)return json({error:"TMDB search failed. Check the TMDB_API_KEY Worker secret."},502);
    const data=await r.json();return json({configured:true,results:(data.results||[]).slice(0,20).map(x=>({key:`tmdb-movie:${x.id}`,title:x.title||x.original_title,cover:x.poster_path?`https://image.tmdb.org/t/p/w500${x.poster_path}`:"",year:(x.release_date||"").slice(0,4),subtitle:"Film · TMDB",description:x.overview||"",adult:!!x.adult,extra:x.release_date?`Released ${x.release_date}`:""}))});
  }
  if (url.pathname === "/api/links" && method === "POST") {
    const me=await currentUser(request,env); if(!me)return json({error:"Sign in first."},401);
    let b;try{b=await request.json()}catch{return json({error:"Invalid request."},400)}
    const service=String(b.service||"").toLowerCase(), username=String(b.username||"").trim().replace(/^@/,"").slice(0,64);
    if(!["anilist","mal","letterboxd","vndb"].includes(service)||! /^[A-Za-z0-9_-]{1,64}$/.test(username))return json({error:"Enter a valid public profile username."},400);
    let profile;
    if(service==="letterboxd") {
      profile={name:username,siteUrl:`https://letterboxd.com/${encodeURIComponent(username)}/`,avatar:{large:""},statistics:{}};
    } else if(service==="vndb") {
      try{const v=await lookupVndbUser(username);if(!v?.id)return json({error:"VNDB user not found. The account must be publicly visible."},404);profile={name:v.username||username,siteUrl:`https://vndb.org/${v.id}`,avatar:{large:""},statistics:{}}}
      catch(e){return json({error:String(e?.message||"VNDB is temporarily unavailable.")},502)}
    } else if(service==="anilist"){
      const q='query($name:String!){User(name:$name){name siteUrl avatar{large} statistics{anime{count meanScore episodesWatched} manga{count meanScore chaptersRead}}}}';
      const r=await fetch("https://graphql.anilist.co",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({query:q,variables:{name:username}})});const j=await r.json();profile=j.data?.User;if(!r.ok||j.errors||!profile){const upstream=String(j.errors?.[0]?.message||"");if(/blocked|manually blocked|principal/i.test(upstream))return json({error:"AniList has blocked the server request. Try again shortly or use the file importer."},502);return json({error:upstream||"AniList profile not found or temporarily unavailable."},404);}
    } else {
      const r=await fetch(`https://api.jikan.moe/v4/users/${encodeURIComponent(username)}/full`,{headers:{"Accept":"application/json"}});const j=await r.json();if(!r.ok||!j.data)return json({error:"MyAnimeList profile not found or temporarily unavailable."},404);const x=j.data;profile={name:x.username,siteUrl:x.url,avatar:{large:x.images?.jpg?.image_url||""},statistics:{anime:{count:x.statistics?.anime?.completed||0,meanScore:x.statistics?.anime?.scores?.[0]?.score||0,episodesWatched:x.statistics?.anime?.episodes_watched||0},manga:{count:x.statistics?.manga?.completed||0,meanScore:x.statistics?.manga?.scores?.[0]?.score||0,chaptersRead:x.statistics?.manga?.chapters_read||0}}};
    }
    const links=safeJSON(me.links), stats=safeJSON(me.stats);links[service]=profile.name;stats[service]={url:profile.siteUrl,avatar:profile.avatar?.large||"",anime:profile.statistics?.anime||{},manga:profile.statistics?.manga||{},syncedAt:Date.now()};stats._autoSync={...(stats._autoSync||{}),[service]:true};
    await db.prepare("UPDATE users SET links=?,stats=?,updated_at=? WHERE id=?").bind(JSON.stringify(links),JSON.stringify(stats),Date.now(),me.id).run();
    let sync=null;try{const fresh=await db.prepare('SELECT * FROM users WHERE id=?').bind(me.id).first();sync=await syncService(db,fresh,service,{force:true})}catch(e){sync={error:String(e?.message||e)}}
    return json({ok:true,service,username:profile.name,profile:stats[service],sync});
  }
  if (url.pathname === "/api/links/save" && method === "POST") {
    const me=await currentUser(request,env); if(!me)return json({error:"Sign in first."},401);
    let b;try{b=await request.json()}catch{return json({error:"Invalid request."},400)}
    const service=String(b.service||""); if(!["anilist","mal"].includes(service))return json({error:"Choose AniList or MyAnimeList."},400);
    const username=String(b.username||"").trim().replace(/^@/,"").slice(0,64); if(!/^[A-Za-z0-9_-]{1,64}$/.test(username))return json({error:"Enter a valid public username."},400);
    const profile=b.profile&&typeof b.profile==="object"?b.profile:{};
    const links=safeJSON(me.links),stats=safeJSON(me.stats);links[service]=username;stats[service]={url:String(profile.url|| (service==="anilist"?`https://anilist.co/user/${encodeURIComponent(username)}/`:`https://myanimelist.net/profile/${encodeURIComponent(username)}`)),avatar:String(profile.avatar||"").slice(0,1000),anime:profile.anime||{},manga:profile.manga||{},syncedAt:Date.now()};stats._autoSync={...(stats._autoSync||{}),[service]:true};
    await db.prepare("UPDATE users SET links=?,stats=?,updated_at=? WHERE id=?").bind(JSON.stringify(links),JSON.stringify(stats),Date.now(),me.id).run();return json({ok:true,service,username,profile:stats[service]});
  }
  if (url.pathname === "/api/import/external" && method === "POST") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in first."},401);
    let b;try{b=await request.json()}catch{return json({error:"Invalid import data."},400)}
    const service=String(b.service||"").toLowerCase();if(!["anilist","mal","vndb"].includes(service))return json({error:"Unsupported import service."},400);
    const items=Array.isArray(b.entries)?b.entries.slice(0,5000):[];if(!items.length)return json({error:"No public list entries were returned. Make sure your list is public."},400);
    const result=await upsertExternalEntries(db,me.id,service,items);if(!result.processed)return json({error:"No supported entries were found in that public list."},400);
    return json({ok:true,imported:result.processed,changed:result.changed,stats:await getStats(db,me.id)});
  }
  if (url.pathname === "/api/links/sync" && method === "POST") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in first."},401);
    let b;try{b=await request.json()}catch{return json({error:"Invalid sync request."},400)}
    const service=String(b.service||"").toLowerCase();if(!["anilist","mal","vndb","letterboxd"].includes(service))return json({error:"Choose a linked service."},400);
    try{const out=await syncService(db,me,service,{force:true});return json({ok:true,imported:out.imported||0,changed:out.changed||0,service,stats:await getStats(db,me.id)})}catch(e){return json({error:String(e?.message||"Sync failed.")},502)}
  }
  if (url.pathname === "/api/links/sync-all" && method === "POST") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in first."},401);
    const results=await autoSyncUser(db,me,{force:true});return json({ok:true,results,stats:await getStats(db,me.id)});
  }
  if (url.pathname === "/api/links/auto-run" && method === "POST") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in first."},401);
    const results=await autoSyncUser(db,me,{force:false});return json({ok:true,results});
  }
  if (url.pathname === "/api/links/auto-sync" && method === "POST") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in first."},401);
    let b;try{b=await request.json()}catch{return json({error:"Invalid request."},400)}
    const service=String(b.service||"").toLowerCase();if(!["anilist","mal","vndb","letterboxd"].includes(service))return json({error:"Invalid service."},400);
    const prefs=await setAutoSync(db,me,service,b.enabled!==false);return json({ok:true,prefs});
  }
  if (url.pathname === "/api/links" && method === "DELETE") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in first."},401);let b;try{b=await request.json()}catch{return json({error:"Invalid request."},400)}if(!["anilist","mal","letterboxd","vndb"].includes(b.service))return json({error:"Invalid service."},400);const links=safeJSON(me.links),stats=safeJSON(me.stats);delete links[b.service];delete stats[b.service];if(stats._autoSync)delete stats._autoSync[b.service];await db.prepare("UPDATE users SET links=?,stats=?,updated_at=? WHERE id=?").bind(JSON.stringify(links),JSON.stringify(stats),Date.now(),me.id).run();return json({ok:true});
  }
  // v71: file-based Goodreads, Passport Dex, and Serializd TV migrations. No third-party credentials
  // or public scraping are required. The caller owns the export file.
  if (url.pathname === "/api/import/library" && method === "POST") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in before importing your library."},401);
    let body;try{body=await request.json()}catch{return json({error:"Invalid library import JSON."},400)}
    const service=String(body?.service||"").toLowerCase();
    if(!["goodreads","passport","serializd"].includes(service))return json({error:"Choose Goodreads, Passport Dex, or Serializd."},400);
    if(!Array.isArray(body.entries)||!body.entries.length||body.entries.length>50)return json({error:"Import 1–50 entries per batch."},400);
    const types=new Set(["anime","manga","game","film","tv","novel","webnovel","comic","light-novel","visual-novel"]);
    const states=new Set(["Planning","Completed","In progress","Dropped","On hold"]);
    // One bounded query per batch: duplicates from manual logs or other importers
    // must be kept, not overwritten. Importing the same file twice is idempotent.
    const current=await db.prepare("SELECT media_key,media_type,title FROM media_logs WHERE user_id=? LIMIT 10000").bind(me.id).all();
    const seen=new Set((current.results||[]).map(l=>String(l.media_type)+'|'+String(l.title||'').trim().toLowerCase().normalize('NFKC').replace(/\s+/g,' ')));
    let imported=0,skipped=0;const now=Date.now();
    for(const x of body.entries){
      if(!x||typeof x!=="object") {skipped++;continue}
      const title=String(x.title||'').trim().slice(0,200),type=String(x.type||'').trim().toLowerCase();
      if(!title||!types.has(type)||(service==='goodreads'&&type!=='novel')||(service==='serializd'&&type!=='tv')){skipped++;continue}
      const signature=type+'|'+title.toLowerCase().normalize('NFKC').replace(/\s+/g,' ');
      if(seen.has(signature)){skipped++;continue}
      seen.add(signature);
      const rawCover=String(x.cover||'').trim();const cover=/^https:\/\//i.test(rawCover)?rawCover.slice(0,1000):'';
      const year=/^(?:19|20)\d{2}$/.test(String(x.year||''))?String(x.year):'';
      const status=states.has(x.status)?x.status:'Planning';
      let rating=x.rating===null||x.rating===''||x.rating===undefined?null:Number(x.rating);
      if(!Number.isFinite(rating)||rating<=0)rating=null;else rating=Math.max(0,Math.min(10,rating));
      const author=String(x.author||'').replace(/[\r\n]+/g,' ').slice(0,120);
      const sourceLabel=service==='goodreads'?'Goodreads':service==='serializd'?'Serializd':'Passport Dex';
      const note=`Imported from ${sourceLabel}${author?' · '+author:''}`.slice(0,450);
      const key=`import:${service}:${type}:${title.toLowerCase().normalize('NFKC').replace(/\s+/g,' ').slice(0,170)}`.slice(0,245);
      const result=await db.prepare(`INSERT INTO media_logs(user_id,media_key,media_type,title,cover,media_year,status,progress,rating,note,created_at,updated_at)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,media_key) DO NOTHING`)
        .bind(me.id,key,type,title,cover,year,status,0,rating,note,now,now).run();
      if(Number(result?.meta?.changes||0)>0)imported++;else skipped++;
    }
    return json({ok:true,imported,skipped});
  }
  if (url.pathname === "/api/import/letterboxd" && method === "POST") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in first."},401);
    let b;try{b=await request.json()}catch{return json({error:"Invalid import data."},400)}
    const rows=Array.isArray(b.entries)?b.entries.slice(0,1000):[];if(!rows.length)return json({error:"No Letterboxd CSV rows found."},400);
    let imported=0;const now=Date.now();
    const posterCache=new Map();
    await Promise.all(rows.map(async row=>{const title=String(row.title||row.Name||'').trim().slice(0,200);if(!title)return;const year=String(row.year||row.Year||'').slice(0,12);const watched=String(row.watchedDate||row['Watched Date']||'').trim();const ratingRaw=row.rating||row.Rating||'';let rating=null;if(ratingRaw!==''&&Number.isFinite(Number(ratingRaw)))rating=Math.max(0,Math.min(10,Number(ratingRaw)*2));const filmIdentity=String(row.uri||row.URI||title).slice(0,220).toLowerCase();const key=`letterboxd:${filmIdentity}${watched?`:${watched}`:''}`;
      let cover='';if(env.TMDB_API_KEY){const cacheKey=(title+'|'+year).toLowerCase();if(posterCache.has(cacheKey))cover=posterCache.get(cacheKey);else{try{const sr=await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${encodeURIComponent(env.TMDB_API_KEY)}&query=${encodeURIComponent(title)}&include_adult=false`,{headers:{Accept:'application/json'}});if(sr.ok){const sd=await sr.json();const matches=sd.results||[];const match=(year?matches.find(x=>String(x.release_date||'').slice(0,4)===year):null)||matches.find(x=>x.poster_path)||null;if(match?.poster_path)cover=`https://image.tmdb.org/t/p/w342${match.poster_path}`}}catch{}posterCache.set(cacheKey,cover)}}
      await db.prepare(`INSERT INTO media_logs(user_id,media_key,media_type,title,cover,media_year,status,progress,rating,note,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,media_key) DO UPDATE SET title=excluded.title,cover=CASE WHEN excluded.cover='' THEN media_logs.cover ELSE excluded.cover END,media_year=excluded.media_year,rating=COALESCE(excluded.rating,media_logs.rating),updated_at=excluded.updated_at`).bind(me.id,key,'film',title,cover,year,'Completed',1,rating,watched?`Imported from Letterboxd · watched ${watched}`:'Imported from Letterboxd',now,now).run();imported++;
    }));
    return json({ok:true,imported,stats:await getStats(db,me.id)},201);
  }

  if (url.pathname === "/api/forum/threads" && method === "GET") {
    const { results = [] } = await db.prepare("SELECT t.id,t.user_id,t.category,t.title,t.body,t.created_at,t.updated_at,u.name AS author,u.avc AS author_avatar,(SELECT COUNT(*) FROM forum_replies r WHERE r.thread_id=t.id) AS reply_count FROM forum_threads t JOIN users u ON u.id=t.user_id ORDER BY t.updated_at DESC LIMIT 100").all();
    return json(results);
  }
  const replyMatch = url.pathname.match(/^\/api\/forum\/threads\/(\d+)\/replies$/);
  if (replyMatch && method === "GET") {
    const { results = [] } = await db.prepare("SELECT r.id,r.body,r.created_at,u.id AS user_id,u.name AS author,u.avc AS avatar,u.role FROM forum_replies r JOIN users u ON u.id=r.user_id WHERE r.thread_id=? ORDER BY r.created_at ASC LIMIT 200").bind(Number(replyMatch[1])).all();
    return json(results);
  }
  if (replyMatch && method === "POST") {
    const user = await currentUser(request, env); if (!user) return json({error:"Sign in to reply."},401);
    const threadId = Number(replyMatch[1]);
    if (!await db.prepare("SELECT id FROM forum_threads WHERE id=?").bind(threadId).first()) return json({error:"Thread not found."},404);
    let b; try { b=await request.json(); } catch { return json({error:"Invalid request."},400); }
    const body=String(b.body||"").trim().slice(0,3000); if(body.length<1)return json({error:"Write a reply first."},400);
    const now=Date.now(); const thread=await db.prepare("SELECT user_id,title FROM forum_threads WHERE id=?").bind(threadId).first(); const result=await db.prepare("INSERT INTO forum_replies(thread_id,user_id,body,created_at) VALUES(?,?,?,?)").bind(threadId,user.id,body,now).run();
    await db.prepare("UPDATE forum_threads SET updated_at=? WHERE id=?").bind(now,threadId).run();
    if(thread && Number(thread.user_id)!==Number(user.id)){try{await db.prepare("INSERT INTO notifications(user_id,actor_id,kind,detail,created_at) VALUES(?,?,?,?,?)").bind(thread.user_id,user.id,"forum_reply",JSON.stringify({title:thread.title,threadId,replyId:result.meta.last_row_id}),now).run()}catch(e){console.error("Forum reply notification skipped",String(e?.message||e))}}
    return json({ok:true,id:result.meta.last_row_id},201);
  }
  if (url.pathname === "/api/forum/threads" && method === "POST") {
    const user = await currentUser(request, env); if (!user) return json({ error: "Sign in to post." }, 401);
    let b; try { b = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
    const title = String(b.title || "").trim().slice(0, 140), body = String(b.body || "").trim().slice(0, 5000);
    const categories = new Set(["Anime","Manga","Novels","Movies & TV","Games","General"]);
    const category = categories.has(b.category) ? b.category : "General";
    if (title.length < 3 || body.length < 3) return json({ error: "Add a title and a little more detail." }, 400);
    const now = Date.now(); const result = await db.prepare("INSERT INTO forum_threads(user_id,category,title,body,created_at,updated_at) VALUES(?,?,?,?,?,?)").bind(user.id, category, title, body, now, now).run();
    return json({ ok: true, id: result.meta.last_row_id }, 201);
  }
  const followerLookup=url.pathname.match(/^\/api\/profile\/([^/]+)\/(followers|following)$/);
  if (followerLookup && method === 'GET') {
    const username=decodeURIComponent(followerLookup[1]);
    const target=await db.prepare('SELECT id FROM users WHERE name=? COLLATE NOCASE').bind(username).first();
    if(!target)return json({error:'Profile not found.'},404);
    const sql=followerLookup[2]==='followers'
      ? 'SELECT u.name,u.global_name,u.avc,u.avatar_url FROM follows f JOIN users u ON u.id=f.follower_id WHERE f.following_id=? ORDER BY f.created_at DESC LIMIT 100'
      : 'SELECT u.name,u.global_name,u.avc,u.avatar_url FROM follows f JOIN users u ON u.id=f.following_id WHERE f.follower_id=? ORDER BY f.created_at DESC LIMIT 100';
    const {results=[]}=await db.prepare(sql).bind(target.id).all();
    return json({users:results});
  }
  if (url.pathname === "/api/following" && method === "GET") {
    const me=await currentUser(request,env); if(!me)return json({error:"Sign in first."},401);
    const {results=[]}=await db.prepare("SELECT u.id,u.name,u.global_name,u.avc,u.avatar_url FROM follows f JOIN users u ON u.id=f.following_id WHERE f.follower_id=? ORDER BY f.created_at DESC LIMIT 500").bind(me.id).all();
    return json({users:results});
  }
  if (url.pathname === "/api/follow" && method === "POST") {
    const me=await currentUser(request,env); if(!me)return json({error:"Sign in first."},401);
    let b;try{b=await request.json()}catch{return json({error:"Invalid request."},400)}
    const target=await db.prepare("SELECT id,name FROM users WHERE name=? COLLATE NOCASE OR id=? LIMIT 1").bind(String(b.username||""),Number(b.userId)||-1).first();
    if(!target)return json({error:"That profile could not be found."},404); if(Number(target.id)===Number(me.id))return json({error:"You cannot follow yourself."},400);
    if(b.follow===false){await db.prepare("DELETE FROM follows WHERE follower_id=? AND following_id=?").bind(me.id,target.id).run();return json({ok:true,following:false});}
    const now=Date.now();await db.prepare("INSERT OR IGNORE INTO follows(follower_id,following_id,created_at) VALUES(?,?,?)").bind(me.id,target.id,now).run();
    try{await db.prepare("INSERT INTO notifications(user_id,actor_id,kind,detail,created_at) VALUES(?,?,?,?,?)").bind(target.id,me.id,"follow",JSON.stringify({name:me.name}),now).run()}catch{}
    return json({ok:true,following:true});
  }
  // v70: private messages live inside the Forum experience, but are visible
  // only to the two members in each thread.
  if (url.pathname === "/api/dms/start" && method === "POST") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in to send a message."},401);
    let b;try{b=await request.json()}catch{return json({error:"Invalid message request."},400)}
    const name=String(b.username||"").trim().slice(0,24);if(!name)return json({error:"Choose a member."},400);
    const other=await db.prepare("SELECT id,name,avc,avatar_url FROM users WHERE name=? COLLATE NOCASE AND banned=0 LIMIT 1").bind(name).first();
    if(!other)return json({error:"Member not found."},404);if(Number(other.id)===Number(me.id))return json({error:"You cannot message yourself."},400);
    const low=Math.min(Number(me.id),Number(other.id)),high=Math.max(Number(me.id),Number(other.id)),now=Date.now();
    await db.prepare("INSERT OR IGNORE INTO dm_threads(user_low_id,user_high_id,created_at,updated_at) VALUES(?,?,?,?)").bind(low,high,now,now).run();
    const thread=await db.prepare("SELECT id FROM dm_threads WHERE user_low_id=? AND user_high_id=?").bind(low,high).first();
    return json({ok:true,threadId:thread?.id,member:{id:other.id,name:other.name,avatar:other.avatar_url||other.avc||'',avatarFallback:other.avc||''}});
  }
  if (url.pathname === "/api/dms" && method === "GET") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in to view messages."},401);
    const {results=[]}=await db.prepare(`SELECT t.id,t.updated_at,
      CASE WHEN t.user_low_id=? THEN hi.id ELSE lo.id END other_id,
      CASE WHEN t.user_low_id=? THEN hi.name ELSE lo.name END other_name,
      CASE WHEN t.user_low_id=? THEN COALESCE(NULLIF(hi.avatar_url,''),hi.avc,'') ELSE COALESCE(NULLIF(lo.avatar_url,''),lo.avc,'') END other_avatar,
      CASE WHEN t.user_low_id=? THEN COALESCE(hi.avc,'') ELSE COALESCE(lo.avc,'') END other_avatar_fallback,
      (SELECT body FROM dm_messages m WHERE m.thread_id=t.id ORDER BY m.created_at DESC LIMIT 1) last_body,
      (SELECT created_at FROM dm_messages m WHERE m.thread_id=t.id ORDER BY m.created_at DESC LIMIT 1) last_at,
      (SELECT COUNT(*) FROM dm_messages m WHERE m.thread_id=t.id AND m.sender_id<>? AND m.read_at IS NULL) unread
      FROM dm_threads t JOIN users lo ON lo.id=t.user_low_id JOIN users hi ON hi.id=t.user_high_id
      WHERE t.user_low_id=? OR t.user_high_id=? ORDER BY COALESCE(last_at,t.updated_at) DESC LIMIT 100`)
      .bind(me.id,me.id,me.id,me.id,me.id,me.id,me.id).all();
    return json({threads:results});
  }
  const dmMatch=url.pathname.match(/^\/api\/dms\/(\d+)\/messages$/);
  if (dmMatch && (method === "GET" || method === "POST")) {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in to use private messages."},401);
    const threadId=Number(dmMatch[1]);const thread=await db.prepare("SELECT * FROM dm_threads WHERE id=? AND (user_low_id=? OR user_high_id=?)").bind(threadId,me.id,me.id).first();
    if(!thread)return json({error:"Message thread not found."},404);
    if(method==="POST"){
      let b;try{b=await request.json()}catch{return json({error:"Invalid message."},400)}const body=String(b.body||"").trim().slice(0,2000);if(!body)return json({error:"Write a message first."},400);
      const now=Date.now();const r=await db.prepare("INSERT INTO dm_messages(thread_id,sender_id,body,created_at) VALUES(?,?,?,?)").bind(threadId,me.id,body,now).run();await db.prepare("UPDATE dm_threads SET updated_at=? WHERE id=?").bind(now,threadId).run();
      const recipient=Number(thread.user_low_id)===Number(me.id)?thread.user_high_id:thread.user_low_id;try{await db.prepare("INSERT INTO notifications(user_id,actor_id,kind,detail,created_at) VALUES(?,?,?,?,?)").bind(recipient,me.id,"message",JSON.stringify({threadId,preview:body.slice(0,100)}),now).run()}catch{}
      return json({ok:true,id:r.meta?.last_row_id,createdAt:now});
    }
    const {results=[]}=await db.prepare(`SELECT m.id,m.sender_id,m.body,m.created_at,m.read_at,u.name,
      COALESCE(NULLIF(u.avatar_url,''),u.avc,'') avatar,COALESCE(u.avc,'') avatar_fallback
      FROM dm_messages m JOIN users u ON u.id=m.sender_id WHERE m.thread_id=? ORDER BY m.created_at ASC LIMIT 500`).bind(threadId).all();
    await db.prepare("UPDATE dm_messages SET read_at=? WHERE thread_id=? AND sender_id<>? AND read_at IS NULL").bind(Date.now(),threadId,me.id).run();
    return json({threadId,messages:results});
  }
  if (url.pathname === "/api/notifications" && method === "GET") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in first."},401);
    const {results=[]}=await db.prepare("SELECT n.id,n.kind,n.detail,n.created_at,n.read_at,u.name AS actor_name FROM notifications n LEFT JOIN users u ON u.id=n.actor_id WHERE n.user_id=? ORDER BY n.created_at DESC LIMIT 100").bind(me.id).all();
    return json({notifications:results,unread:results.filter(n=>!n.read_at).length});
  }
  if (url.pathname === "/api/notifications/read" && method === "POST") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in first."},401);await db.prepare("UPDATE notifications SET read_at=? WHERE user_id=? AND read_at IS NULL").bind(Date.now(),me.id).run();return json({ok:true});
  }
  if (url.pathname === "/api/me" && method === "GET") {
    const user = await currentUser(request, env); if(!user)return json({user:null}); const counts=await db.prepare("SELECT (SELECT COUNT(*) FROM follows WHERE following_id=?) followers_count,(SELECT COUNT(*) FROM follows WHERE follower_id=?) following_count").bind(user.id,user.id).first(); return json({ user: publicUser({...user,...counts}, await getStats(db, user.id)) });
  }
  if (url.pathname === "/api/leaderboard" && method === "GET") {
    // Everyone's completed non-game media counts normally. A game counts
    // only when confirmed story-led and included in the reviewed catalog.
    // This avoids multiplayer and non-story titles inflating the leaderboard.
    try {
      // The profile editor saves uploaded/user-supplied pictures in avatar_url,
      // while older Discord accounts keep their image in avc. Return both so
      // the browser can retry if the preferred image expires or is unavailable.
      const leaderboardQuery=(customAvatar)=>`SELECT
        u.id AS id,
        COALESCE(NULLIF(TRIM(u.name),''),'Member') AS display_name,
        ${customAvatar ? "COALESCE(NULLIF(TRIM(u.avatar_url),''),NULLIF(TRIM(u.avc),''),'')" : "COALESCE(NULLIF(TRIM(u.avc),''),'')"} AS profile_avatar,
        COALESCE(NULLIF(TRIM(u.avc),''),'') AS fallback_avatar,
        SUM(CASE WHEN LOWER(TRIM(COALESCE(l.status,'')))='completed'
          AND LOWER(REPLACE(REPLACE(REPLACE(TRIM(COALESCE(l.media_type,'')),'-',''),'_',''),' ','')) IN ('anime','manga','film','movie','movies','tv','television','novel','lightnovel','webnovel','comic','comics','visualnovel') THEN 1 ELSE 0 END) AS non_game_count
        FROM users u LEFT JOIN media_logs l ON l.user_id=u.id
        WHERE COALESCE(u.banned,0)=0
        GROUP BY u.id,u.name,u.avc${customAvatar?',u.avatar_url':''}`;
      let users;
      try {({results:users=[]}=await db.prepare(leaderboardQuery(true)).all());}
      catch(e){
        // An older database may not yet have the custom-avatar column.
        if(!/no such column.*avatar_url/i.test(String(e?.message||e)))throw e;
        ({results:users=[]}=await db.prepare(leaderboardQuery(false)).all());
      }
      const byId=new Map(users.map(u=>[Number(u.id),Number(u.non_game_count)||0]));
      const {results:games=[]}=await db.prepare(`SELECT l.user_id,l.title
        FROM media_logs l JOIN users u ON u.id=l.user_id
        WHERE COALESCE(u.banned,0)=0
          AND LOWER(TRIM(COALESCE(l.status,'')))='completed'
          AND LOWER(REPLACE(REPLACE(REPLACE(TRIM(COALESCE(l.media_type,'')),'-',''),'_',''),' ','')) IN ('game','games','videogame','videogames')`).all();
      for(const game of games){
        const id=Number(game.user_id);
        if(byId.has(id)&&leaderboardEligibleGame(game.title))byId.set(id,byId.get(id)+1);
      }
      const ranked=users.map(u=>({id:Number(u.id),name:String(u.display_name||'Member'),avatar:String(u.profile_avatar||''),avatarFallback:String(u.fallback_avatar||''),entries:Math.max(0,byId.get(Number(u.id))||0)}));
      ranked.sort((a,b)=>b.entries-a.entries||a.name.localeCompare(b.name,undefined,{sensitivity:'base'})||a.id-b.id);
      return json(ranked.slice(0,10).map((u,index)=>({rank:index+1,...u})),200);
    } catch (e) {
      console.error('Leaderboard query failed',String(e?.message||e));
      return json({error:'Leaderboard could not be loaded. Check the Worker logs for the database query error.'},500);
    }
  }
  // Fast, bounded public member lookup for the unified search bar.
  if (url.pathname === "/api/search/users" && method === "GET") {
    const q=String(url.searchParams.get("q")||"").trim().slice(0,64);
    if(q.length<2)return json({results:[]});
    const escaped=q.toLowerCase().replace(/[!%_]/g,"!$&");
    const starts=escaped+"%", contains="%"+escaped+"%";
    try{
      // The older D1 schema lacks avatar_url; the public lookup should still work there.
      const run=(cols)=>db.prepare(`SELECT ${cols} FROM users
        WHERE COALESCE(banned,0)=0 AND (LOWER(name) LIKE ? ESCAPE '!' OR LOWER(COALESCE(global_name,'')) LIKE ? ESCAPE '!')
        ORDER BY CASE WHEN LOWER(name)=? THEN 0 WHEN LOWER(name) LIKE ? ESCAPE '!' THEN 1 ELSE 2 END,
        name COLLATE NOCASE LIMIT 10`).bind(contains,contains,q.toLowerCase(),starts).all();
      let r;try{r=await run('id,name,global_name,avc,avatar_url,bio,role')}catch(e){
        if(!/no such column.*avatar_url/i.test(String(e?.message||e)))throw e;
        r=await run('id,name,global_name,avc,bio,role');
      }
      return json({results:(r.results||[]).map(u=>({id:u.id,name:u.name,globalName:u.global_name||"",avatar:u.avatar_url||u.avc||"",avatarFallback:u.avc||"",bio:String(u.bio||"").slice(0,140),role:u.role||"member"}))});
    }catch(e){console.error("Public member search failed",String(e?.message||e));return json({error:"Member search is temporarily unavailable."},503)}
  }
  if (url.pathname === "/api/members" && method === "GET") {
    const { results = [] } = await db.prepare("SELECT * FROM users ORDER BY joined DESC LIMIT 100").all();
    return json(await Promise.all(results.map(async u => publicUser(u, await getStats(db, u.id)))));
  }
  if (url.pathname === "/api/feed" && method === "GET") {
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 30)));
    const me=await currentUser(request,env), mode=url.searchParams.get("mode")==="following"?"following":"global";
    let results=[];
    // Use uploaded profile photos consistently in Global Activity, with Discord
    // avatars as fallbacks. This is one joined query, not one D1 read per user.
    // Retain compatibility with older deployments missing users.avatar_url.
    const feedQuery = (customAvatar) => `SELECT l.*,u.name,u.avc,${customAvatar?'u.avatar_url,':''}u.role,(SELECT COUNT(*) FROM log_comments c WHERE c.log_id=l.id) AS comment_count FROM media_logs l JOIN users u ON u.id=l.user_id ${mode==='following'?'JOIN follows f ON f.following_id=l.user_id AND f.follower_id=? ':''}ORDER BY l.updated_at DESC LIMIT ?`;
    if(mode==='following'&&!me)return json({error:'Sign in to view Following Recents.'},401);
    const runFeed=(customAvatar)=>mode==='following'?db.prepare(feedQuery(customAvatar)).bind(me.id,limit).all():db.prepare(feedQuery(customAvatar)).bind(limit).all();
    try {const r=await runFeed(true);results=r.results||[]}
    catch(e){if(!/no such column.*avatar_url/i.test(String(e?.message||e)))throw e;const r=await runFeed(false);results=r.results||[]}
    return json(results.map(logObject));
  }
  // Future Theme per-item icons and artwork. Separate from the media catalog,
  // so imports/syncs cannot overwrite a member's personal presentation choices.
  if (url.pathname === "/api/profile/future-visual" && method === "POST") {
    const me=await currentUser(request,env);if(!me)return json({error:"Sign in first."},401);
    let b;try{b=await request.json()}catch{return json({error:"Invalid request."},400)}
    const kind=String(b.kind||""),key=String(b.key||""),value=String(b.value||"").trim();
    const navSlots=["add","home","library","followers","notifications","profile"];
    const navIcons=["plus","home","bookopen","user","bell","star","film","tv","book","grid","heart","bookmark","spark","search","play","settings","flag","chat","music","game","panels"];
    if(kind==="navs"){
      const icons=b.icons;
      if(!icons||typeof icons!=="object"||Array.isArray(icons)||Object.keys(icons).length!==navSlots.length||navSlots.some(k=>!navIcons.includes(icons[k])))return json({error:"Choose a valid icon for every sidebar item."},400);
      try{await db.batch(navSlots.map(k=>db.prepare("INSERT INTO profile_visual_overrides(user_id,slot,value,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id,slot) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at").bind(me.id,'nav:'+k,icons[k],Date.now())))}catch(e){console.error('Sidebar icon save failed',e?.message||e);return json({error:"Apply migration 0015_profile_visual_overrides.sql before saving icons."},500)}
      return json({ok:true});
    }
    if(!["cover","nav"].includes(kind))return json({error:"Invalid customization."},400);
    if(kind==="nav"){
      if(!["add","home","library","followers","notifications","profile"].includes(key))return json({error:"Invalid sidebar item."},400);
      if(!["plus","home","bookopen","user","bell","star","film","tv","book","grid","heart","bookmark","spark","search","play","settings","flag","chat","music","game","panels"].includes(value))return json({error:"Choose a supported icon."},400);
    }else{
      if(!key||key.length>250)return json({error:"Invalid media selection."},400);
      const owned=await db.prepare("SELECT 1 FROM media_logs WHERE user_id=? AND media_key=? LIMIT 1").bind(me.id,key).first();
      if(!owned)return json({error:"That media entry is not in your library."},403);
      const urlOk=/^https:\/\/[^\s<>"']{1,996}$/i.test(value)&&value.length<=1000;
      const imageOk=/^data:image\/(?:png|jpeg|webp|avif);base64,[A-Za-z0-9+/=]+$/i.test(value)&&value.length<=160000;
      if(value&&!urlOk&&!imageOk)return json({error:"Use an HTTPS image URL or an uploaded image under 120 KB."},400);
    }
    const slot=kind+":"+key;
    try{
      if(!value){await db.prepare("DELETE FROM profile_visual_overrides WHERE user_id=? AND slot=?").bind(me.id,slot).run();}
      else{await db.prepare("INSERT INTO profile_visual_overrides(user_id,slot,value,updated_at) VALUES(?,?,?,?) ON CONFLICT(user_id,slot) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at").bind(me.id,slot,value,Date.now()).run();}
    }catch(e){console.error('Future profile visual save failed',e?.message||e);return json({error:"Could not save customization. Apply migration 0015_profile_visual_overrides.sql first."},500)}
    return json({ok:true});
  }
  if (url.pathname === "/api/profile" && method === "POST") {
    const user = await currentUser(request, env); if (!user) return json({ error: "Sign in first." }, 401);
    let b; try { b = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
    const bio = String(b.bio ?? user.bio ?? "").slice(0, 500), status = String(b.status ?? user.status ?? "").slice(0, 160);
    const oldSocials = safeJSON(user.socials); const rawSocials = b.socials && typeof b.socials === "object" ? b.socials : oldSocials;
    const cleanSocial = (value, platform) => { let v=String(value||"").trim().slice(0,300); if(!v)return ""; if(!/^https?:\/\//i.test(v)) v=(platform==="twitter"?"https://twitter.com/":platform==="tiktok"?"https://www.tiktok.com/@":"https://www.instagram.com/")+v.replace(/^@/,""); try { const x=new URL(v); const hosts={twitter:["twitter.com","www.twitter.com","x.com","www.x.com"],tiktok:["tiktok.com","www.tiktok.com"],instagram:["instagram.com","www.instagram.com"]}; return (x.protocol==="https:"&&hosts[platform].includes(x.hostname.toLowerCase()))?x.href:""; } catch { return ""; } };
    const bgRaw = String(rawSocials.profileBackground ?? oldSocials.profileBackground ?? '').trim();
    const validBgData = /^data:image\/(?:png|jpeg|webp|gif|avif);base64,[A-Za-z0-9+/=]+$/i.test(bgRaw) && bgRaw.length <= 550000;
    const bgUrl = /^https:\/\//i.test(bgRaw) && bgRaw.length<=1000 ? bgRaw : (validBgData ? bgRaw : '');
    if(bgRaw && !bgUrl) return json({error:'Use an HTTPS background URL or a compressed image under 400 KB.'},400);
    const particleColor = /^#[0-9a-fA-F]{6}$/.test(String(rawSocials.profileFxColor||oldSocials.profileFxColor||''))?String(rawSocials.profileFxColor||oldSocials.profileFxColor):'#b59afc';
    const socials = JSON.stringify({...oldSocials,twitter:cleanSocial(rawSocials.twitter,"twitter"),tiktok:cleanSocial(rawSocials.tiktok,"tiktok"),instagram:cleanSocial(rawSocials.instagram,"instagram"),
       musicEnabled:(rawSocials.musicEnabled ?? oldSocials.musicEnabled) === true,profileBackground:bgUrl,
       profileBackgroundEnabled:(rawSocials.profileBackgroundEnabled ?? oldSocials.profileBackgroundEnabled) === true && !!bgUrl,
       profileFxEnabled:(rawSocials.profileFxEnabled ?? oldSocials.profileFxEnabled) === true,profileFxColor:particleColor,
       profileLayout:["original","anime","future"].includes(rawSocials.profileLayout)?rawSocials.profileLayout:(["original","anime","future"].includes(oldSocials.profileLayout)?oldSocials.profileLayout:"original")});
    const bannerRaw = String(b.bannerUrl ?? user.banner_url ?? "").trim(), avatarRaw = String(b.avatarUrl ?? user.avatar_url ?? "").trim();
    const validUploadedAvatar = /^data:image\/(png|jpeg|webp|gif|avif);base64,[A-Za-z0-9+/=]+$/i.test(avatarRaw) && avatarRaw.length <= 600000;
    const validUploadedBanner = /^data:image\/(png|jpeg|webp|gif|avif);base64,[A-Za-z0-9+/=]+$/i.test(bannerRaw) && bannerRaw.length <= 600000;
    if (avatarRaw.startsWith("data:") && !validUploadedAvatar) return json({ error: "Uploaded profile pictures must be supported image files no larger than 400 KB." }, 400);
    if (bannerRaw.startsWith("data:") && !validUploadedBanner) return json({ error: "Uploaded banners must be supported image files no larger than 400 KB." }, 400);
    const bannerUrl = validUploadedBanner ? bannerRaw : (/^https:\/\//i.test(bannerRaw) ? bannerRaw.slice(0, 1000) : ""), customAvatarUrl = validUploadedAvatar ? avatarRaw : (/^https:\/\//i.test(avatarRaw) ? avatarRaw.slice(0, 1000) : ""), accent = /^#[0-9a-fA-F]{6}$/.test(String(b.accent || user.accent || "")) ? String(b.accent || user.accent) : "#6d6bf5";
    const shape = ["circle", "rounded", "square"].includes(b.shape) ? b.shape : (["circle", "rounded", "square"].includes(user.shape) ? user.shape : "circle");
    const bannerPreset = ["Mono", "Dusk", "Ocean", "Ember", "Forest", "Slate"].includes(b.banner) ? b.banner : (user.banner || "Mono");
    let favs = String(user.favs || "");
    if (b.favs !== undefined) favs = JSON.stringify((Array.isArray(b.favs) ? b.favs : []).map(x => String(x).slice(0, 250)).slice(0, 5));
    let name = user.name;
    if (b.name !== undefined) {
      const proposed = String(b.name).trim();
      if (!/^[a-zA-Z0-9_-]{3,24}$/.test(proposed)) return json({ error: "Username must be 3–24 characters: letters, numbers, _ or -." }, 400);
      const exists = await db.prepare("SELECT id FROM users WHERE name=? COLLATE NOCASE AND id<>?").bind(proposed, user.id).first();
      if (exists) return json({ error: "That username is already taken." }, 409);
      name = proposed;
    }
    try {
      await db.prepare("UPDATE users SET name=?,bio=?,status=?,banner_url=?,avatar_url=?,accent=?,shape=?,banner=?,favs=?,socials=?,updated_at=? WHERE id=?").bind(name, bio, status, bannerUrl, customAvatarUrl, accent, shape, bannerPreset, favs, socials, Date.now(), user.id).run();
    } catch (err) {
      console.error("Profile save failed:", err?.message || err);
      return json({ error: "Profile could not be saved. The database may need the latest profile-image migration. Check Worker logs for details." }, 500);
    }
    const updated = await db.prepare("SELECT * FROM users WHERE id=?").bind(user.id).first();
    return json({ user: publicUser(updated, await getStats(db, user.id)) });
  }
  if (url.pathname.startsWith("/api/profile/") && method === "GET") {
    const name = decodeURIComponent(url.pathname.slice("/api/profile/".length));
    const user = await db.prepare("SELECT * FROM users WHERE name=? COLLATE NOCASE").bind(name).first();
    if (!user) return json({ error: "Profile not found." }, 404);
    const { results = [] } = await db.prepare(`SELECT l.*,u.name,u.avc,u.role,(SELECT COUNT(*) FROM log_comments c WHERE c.log_id=l.id) AS comment_count FROM media_logs l JOIN users u ON u.id=l.user_id WHERE l.user_id=? ORDER BY l.updated_at DESC`).bind(user.id).all();
    const counts=await db.prepare("SELECT (SELECT COUNT(*) FROM follows WHERE following_id=?) followers_count,(SELECT COUNT(*) FROM follows WHERE follower_id=?) following_count").bind(user.id,user.id).first(); const me=await currentUser(request,env); let isFollowing=false; if(me){isFollowing=!!await db.prepare("SELECT 1 FROM follows WHERE follower_id=? AND following_id=?").bind(me.id,user.id).first();}
    let futureCovers={},futureNavIcons={};
    try{const overrides=await db.prepare("SELECT slot,value FROM profile_visual_overrides WHERE user_id=? LIMIT 2000").bind(user.id).all();for(const item of overrides.results||[]){if(item.slot.startsWith('cover:'))futureCovers[item.slot.slice(6)]=item.value;else if(item.slot.startsWith('nav:'))futureNavIcons[item.slot.slice(4)]=item.value}}catch(e){console.warn('Future profile customization unavailable; apply migration 0015',e?.message||e)}
    return json({ user: {...publicUser({...user,...counts}, await getStats(db, user.id)), isFollowing, futureCovers, futureNavIcons}, logs: results.map(logObject) });
  }
  // v58: lightweight authenticated progress read/update. Do not overwrite ratings,
  // notes, or an imported entry when a user updates an episode or chapter.
  if (url.pathname === "/api/logs/progress" && (method === "GET" || method === "POST")) {
    const me = await currentUser(request, env);
    if (!me) return json({ error: "Sign in to save progress." }, 401);
    let body = {};
    if (method === "POST") {
      try { body = await request.json(); } catch { return json({ error: "Invalid progress request." }, 400); }
    } else body = Object.fromEntries(url.searchParams);
    const type = String(body.type || "").trim();
    const title = String(body.title || "").trim().slice(0,200);
    if (!mediaTypes.has(type) || !title) return json({ error: "Choose a valid title and media type." }, 400);
    const requestedKey = String(body.key || "").trim().slice(0,250);
    const key = requestedKey || `${type}:${title.toLowerCase()}`.slice(0,250);
    // Keys from different import sites are not always the same. Find an existing
    // record by its key, then by title/type, restricted to the signed-in member.
    const existing = await db.prepare(`SELECT id,media_key,status,progress FROM media_logs
      WHERE user_id=? AND (media_key=? OR (media_type=? AND title=? COLLATE NOCASE))
      ORDER BY CASE WHEN media_key=? THEN 0 ELSE 1 END, updated_at DESC LIMIT 1`)
      .bind(me.id,key,type,title,key).first();
    if (method === "GET") return json({ log: existing ? { id:existing.id, mediaKey:existing.media_key, status:existing.status, progress:existing.progress } : null });
    const progress = Number(body.progress);
    if (!Number.isInteger(progress) || progress < 0 || progress > 100000) return json({ error: "Progress must be a whole number between 0 and 100,000." }, 400);
    const status = String(body.status || "In progress");
    if (!["In progress","Completed","On hold","Planning","Dropped"].includes(status)) return json({ error: "Invalid media status." }, 400);
    const cover = /^https?:\/\//i.test(String(body.cover||"")) ? String(body.cover).slice(0,1000) : "";
    const year = String(body.year || "").slice(0,12);
    const now = Date.now();
    if (existing) {
      await db.prepare(`UPDATE media_logs SET status=?,progress=?,updated_at=?,
        cover=CASE WHEN cover='' AND ?<>'' THEN ? ELSE cover END
        WHERE id=? AND user_id=?`).bind(status,progress,now,cover,cover,existing.id,me.id).run();
    } else {
      await db.prepare(`INSERT INTO media_logs(user_id,media_key,media_type,title,cover,media_year,status,progress,rating,note,created_at,updated_at)
        VALUES(?,?,?,?,?,?,?,?,NULL,'',?,?)`).bind(me.id,key,type,title,cover,year,status,progress,now,now).run();
    }
    await recordMediaActivity(db,{userId:me.id,mediaKey:existing?.media_key||key,mediaType:type,eventKind:existing?'progress_updated':'log_created',previousStatus:existing?.status||null,status,progress,source:'manual',occurredAt:now});
    return json({ ok:true, id:existing?.id || null, created:!existing, progress, status });
  }
  // v88: Scoped profile reset. A medium and optional status are always explicit;
  // the signed-in user's records are the only possible deletion target.
  if (url.pathname === "/api/logs/reset-group" && method === "POST") {
    const me = await currentUser(request, env);
    if (!me) return json({ error: "Sign in to reset your media list." }, 401);
    let body;
    try { body = await request.json(); } catch { return json({ error: "Invalid reset request." }, 400); }
    const mediaType = String(body?.mediaType || "");
    const status = String(body?.status || "");
    const allowedStatuses = ["All", "Completed", "In progress", "Planning", "On hold", "Dropped"];
    if (!allowedStatuses.includes(status) || !(mediaTypes.has(mediaType) || (mediaType === "all" && status === "Planning"))) {
      return json({ error: "Choose a valid medium and status." }, 400);
    }
    if (body?.confirmation !== "RESET") return json({ error: "Type RESET to confirm this change." }, 400);
    const expectedCount = Number(body?.expectedCount);
    if (!Number.isSafeInteger(expectedCount) || expectedCount <= 0) return json({ error: "The selected list is empty or invalid. Refresh your profile." }, 400);
    const scoped = mediaType === "all"
      ? { clause:"user_id=? AND status=? COLLATE NOCASE", args:[me.id, status] }
      : status === "All"
        ? { clause:"user_id=? AND media_type=?", args:[me.id, mediaType] }
        : { clause:"user_id=? AND media_type=? AND status=?", args:[me.id, mediaType, status] };
    const before = await db.prepare(`SELECT COUNT(*) AS total FROM media_logs WHERE ${scoped.clause}`).bind(...scoped.args).first();
    if (Number(before?.total || 0) !== expectedCount) return json({ error: "This list changed. Refresh the profile and review the reset again." }, 409);
    const removed = await db.prepare(`DELETE FROM media_logs WHERE ${scoped.clause}`).bind(...scoped.args).run();
    return json({ ok:true, deleted:Number(removed.meta?.changes || 0), mediaType, status, stats:await getStats(db, me.id) });
  }
  if (url.pathname === "/api/logs/all" && method === "DELETE") {
    const user = await currentUser(request, env);
    if (!user) return json({ error: "Sign in first." }, 401);
    // Only clear the signed-in user's own entries; related comments are removed by the FK cascade.
    const before = await db.prepare("SELECT COUNT(*) AS total FROM media_logs WHERE user_id=?").bind(user.id).first();
    await db.prepare("DELETE FROM media_logs WHERE user_id=?").bind(user.id).run();
    return json({ ok: true, deleted: Number(before?.total || 0), stats: await getStats(db, user.id) });
  }
  if (url.pathname === "/api/logs" && method === "GET") {
    const userName = url.searchParams.get("user");
    let rows;
    if (userName) rows = await db.prepare(`SELECT l.*,u.name,u.avc,u.role,(SELECT COUNT(*) FROM log_comments c WHERE c.log_id=l.id) AS comment_count FROM media_logs l JOIN users u ON u.id=l.user_id WHERE u.name=? COLLATE NOCASE ORDER BY l.updated_at DESC, l.id DESC`).bind(userName).all();
    else rows = await db.prepare(`SELECT l.*,u.name,u.avc,u.role,(SELECT COUNT(*) FROM log_comments c WHERE c.log_id=l.id) AS comment_count FROM media_logs l JOIN users u ON u.id=l.user_id ORDER BY l.updated_at DESC LIMIT 40`).all();
    return json((rows.results || []).map(logObject));
  }
  if (url.pathname === "/api/logs" && method === "POST") {
    const user = await currentUser(request, env); if (!user) return json({ error: "Sign in to log media." }, 401);
    let b; try { b = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
    const mediaType = String(b.mediaType || "");
    if (!mediaTypes.has(mediaType)) return json({ error: "Choose a supported media type." }, 400);
    const title = String(b.title || "").trim().slice(0, 200); if (!title) return json({ error: "A title is required." }, 400);
    const mediaKey = String(b.mediaKey || `${mediaType}:${title.toLowerCase()}`).slice(0, 250);
    const cover = /^https?:\/\//i.test(String(b.cover || "")) ? String(b.cover).slice(0, 1000) : "";
    const status = ["Completed", "In progress", "Planning", "On hold", "Dropped"].includes(b.status) ? b.status : "Completed";
    const progress = Math.max(0, Math.min(100000, Number.parseInt(b.progress, 10) || 0));
    const rating = b.rating === "" || b.rating === null || b.rating === undefined ? null : Math.max(0, Math.min(10, Number(b.rating)));
    const note = String(b.note || "").slice(0, 800), year = String(b.year || "").slice(0, 12), now = Date.now();
    const prior = await db.prepare("SELECT status FROM media_logs WHERE user_id=? AND media_key=?").bind(user.id,mediaKey).first();
    await db.prepare(`INSERT INTO media_logs(user_id,media_key,media_type,title,cover,media_year,status,progress,rating,note,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,media_key) DO UPDATE SET media_type=excluded.media_type,title=excluded.title,cover=excluded.cover,media_year=excluded.media_year,status=excluded.status,progress=excluded.progress,rating=excluded.rating,note=excluded.note,updated_at=excluded.updated_at`)
      .bind(user.id, mediaKey, mediaType, title, cover, year, status, progress, rating, note, now, now).run();
    const row = await db.prepare(`SELECT l.*,u.name,u.avc,u.role,(SELECT COUNT(*) FROM log_comments c WHERE c.log_id=l.id) AS comment_count FROM media_logs l JOIN users u ON u.id=l.user_id WHERE l.user_id=? AND l.media_key=?`).bind(user.id, mediaKey).first();
    await recordMediaActivity(db,{userId:user.id,mediaKey,mediaType,eventKind:prior?'log_updated':'log_created',previousStatus:prior?.status||null,status,progress,rating,source:'manual',occurredAt:now});
    return json({ log: logObject(row), stats: await getStats(db, user.id) });
  }
  const commentMatch = url.pathname.match(/^\/api\/logs\/(\d+)\/comments$/);
  if (commentMatch && method === "GET") {
    const logId = Number(commentMatch[1]);
    const { results = [] } = await db.prepare(`SELECT c.id,c.body,c.created_at,u.name,u.avc,u.role FROM log_comments c JOIN users u ON u.id=c.user_id WHERE c.log_id=? ORDER BY c.created_at ASC LIMIT 100`).bind(logId).all();
    return json(results.map(c => ({ id: c.id, body: c.body, createdAt: c.created_at, user: { name: c.name, avatar: c.avc || "", role: c.role } })));
  }
  if (commentMatch && method === "POST") {
    const user = await currentUser(request, env); if (!user) return json({ error: "Sign in to comment." }, 401);
    const logId = Number(commentMatch[1]); if (!await db.prepare("SELECT id FROM media_logs WHERE id=?").bind(logId).first()) return json({ error: "Log not found." }, 404);
    let b; try { b = await request.json(); } catch { return json({ error: "Invalid request." }, 400); }
    const body = String(b.body || "").trim().slice(0, 1000); if (!body) return json({ error: "Write a comment first." }, 400);
    const now = Date.now(); await db.prepare("INSERT INTO log_comments(log_id,user_id,body,created_at) VALUES(?,?,?,?)").bind(logId, user.id, body, now).run();
    return json({ ok: true, comment: { body, createdAt: now, user: { name: user.name, avatar: user.avc || "", role: user.role } } }, 201);
  }
  const logMatch = url.pathname.match(/^\/api\/logs\/(\d+)$/);
  if (logMatch && method === "DELETE") {
    const user = await currentUser(request, env); if (!user) return json({ error: "Sign in first." }, 401);
    const log = await db.prepare("SELECT id,user_id FROM media_logs WHERE id=?").bind(Number(logMatch[1])).first();
    if (!log) return json({ error: "Log not found." }, 404); if (log.user_id !== user.id) return json({ error: "You can only remove your own logs." }, 403);
    await db.prepare("DELETE FROM media_logs WHERE id=? AND user_id=?").bind(log.id,user.id).run(); return json({ ok: true, id:log.id });
  }
  return null;
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function safePublicImage(value, fallback) {
  try { const u = new URL(String(value || "")); if (u.protocol === "https:" && !u.username && !u.password) return u.href; } catch {}
  return fallback;
}
async function discordProfilePreview(request, env, url) {
  const ua = request.headers.get("User-Agent") || "";
  // Only serve the crawler-specific HTML to preview bots. Real visitors keep the normal app.
  if (!/(Discordbot|Twitterbot|facebookexternalhit|Facebot|Slackbot|TelegramBot|WhatsApp|Embedly|LinkedInBot)/i.test(ua)) return null;
  if (request.method !== "GET" || url.pathname === "/" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) return null;
  const rawName = url.pathname.replace(/^\/+|\/+$/g, "");
  if (!rawName || rawName.includes("/")) return null;
  let name; try { name = decodeURIComponent(rawName); } catch { return null; }
  if (!/^[\p{L}\p{N}_-]{1,32}$/u.test(name)) return null;
  const user = await env.DB.prepare("SELECT id,name,bio,avc,banner FROM users WHERE name=? COLLATE NOCASE AND banned=0").bind(name).first();
  if (!user) return null;
  const totals = await env.DB.prepare("SELECT COUNT(*) AS total FROM media_logs WHERE user_id=? AND status<>'Planning'").bind(user.id).first();
  const title = `${user.name} on MediaTok`;
  const bio = String(user.bio || "").trim().slice(0, 220);
  const description = `${bio ? bio + " · " : ""}${Number(totals?.total || 0)} logged media on MediaTok. Explore their anime, manga, films, shows, books, and more.`.slice(0, 300);
  const image = safePublicImage(user.avc, new URL("/mt-logo.png", url.origin).href);
  const canonical = new URL("/" + encodeURIComponent(user.name), url.origin).href;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(title)}</title><meta name="description" content="${escapeHTML(description)}"><link rel="canonical" href="${escapeHTML(canonical)}"><meta property="og:type" content="profile"><meta property="og:site_name" content="MediaTok"><meta property="og:title" content="${escapeHTML(title)}"><meta property="og:description" content="${escapeHTML(description)}"><meta property="og:url" content="${escapeHTML(canonical)}"><meta property="og:image" content="${escapeHTML(image)}"><meta property="og:image:alt" content="${escapeHTML(user.name)}'s MediaTok profile"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${escapeHTML(title)}"><meta name="twitter:description" content="${escapeHTML(description)}"><meta name="twitter:image" content="${escapeHTML(image)}"></head><body><p><a href="${escapeHTML(canonical)}">View ${escapeHTML(user.name)} on MediaTok</a></p></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300", "X-Content-Type-Options": "nosniff" } });
}

async function releaseWatchFetch(url, options={}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal, headers: { Accept: "application/json", ...(options.headers||{}) } });
    if (!response.ok) throw new Error(`Release provider returned ${response.status}`);
    return await response.json();
  } finally { clearTimeout(timer); }
}
async function releaseNotification(db, userId, kind, title, detail, eventKey, now) {
  const existing = await db.prepare("SELECT id FROM notifications WHERE user_id=? AND kind=? AND detail LIKE ? LIMIT 1")
    .bind(userId, kind, `%${eventKey.replace(/[%_]/g, '')}%`).first();
  if (existing) return false;
  await db.prepare("INSERT INTO notifications(user_id,actor_id,kind,detail,created_at) VALUES(?,NULL,?,?,?)")
    .bind(userId, kind, JSON.stringify({ title, ...detail, eventKey }), now).run();
  return true;
}
async function checkAnimeRelease(db, item, now) {
  const query = `query ($search:String!) { Media(search:$search,type:ANIME) { id title { english romaji } status season seasonYear startDate { year month day } nextAiringEpisode { episode airingAt timeUntilAiring } relations { edges { relationType node { id type format status season seasonYear title { english romaji } nextAiringEpisode { episode airingAt timeUntilAiring } } } } } }`;
  const data = await releaseWatchFetch("https://graphql.anilist.co", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({query,variables:{search:item.title}}) });
  const media=data?.data?.Media;
  if (!media?.id) return;
  const old=await db.prepare("SELECT * FROM release_watch_state WHERE user_id=? AND media_key=?").bind(item.user_id,item.media_key).first();
  const next=media.nextAiringEpisode;
  const planned=/plan/i.test(String(item.status||''));
  // A planned premiere or the first episode should raise one useful alert, not hourly spam.
  const start=media.startDate;
  const officialStart=(start?.year&&start?.month&&start?.day)?Date.UTC(start.year,start.month-1,start.day):null;
  const premiere=(next?.episode===1&&next?.airingAt?Number(next.airingAt)*1000:officialStart);
  if(planned&&premiere&&premiere>=now-72*3600000&&premiere<=now+14*24*3600000){
    const eventKey=`anime-premiere:${media.id}:${Math.floor(premiere/86400000)}`;
    await releaseNotification(db,item.user_id,'planned_release',media.title?.english||media.title?.romaji||item.title,{airingAt:premiere,provider:'AniList',mediaType:'anime',url:`https://anilist.co/anime/${media.id}`},eventKey,now);
  }
  // Last-known upcoming episode has aired since the previous hourly check.
  const prev=/^anilist:(\d+):ep:(\d+):(\d+)$/.exec(String(old?.last_episode_key||''));
  if(prev&&Number(prev[3])*1000<=now&&Number(prev[3])*1000>=now-48*3600000){
    const eventKey=`anime-released:${prev[1]}:${prev[2]}:${prev[3]}`;
    await releaseNotification(db,item.user_id,'episode_released',media.title?.english||media.title?.romaji||item.title,{episode:Number(prev[2]),airingAt:Number(prev[3])*1000,provider:'AniList',mediaType:'anime',url:`https://anilist.co/anime/${prev[1]}`},eventKey,now);
  }
  if (next?.airingAt) {
    const airAt=Number(next.airingAt)*1000, eventKey=`anilist:${media.id}:ep:${next.episode}:${next.airingAt}`;
    if (airAt > now-6*60*60*1000 && airAt <= now+24*60*60*1000 && old?.last_episode_key !== eventKey) {
      await releaseNotification(db,item.user_id,"episode",media.title?.english||media.title?.romaji||item.title,{episode:Number(next.episode),airingAt:airAt,provider:"AniList",mediaType:"anime",url:`https://anilist.co/anime/${media.id}`},eventKey,now);
    }
  }
  let seasonKey=old?.last_season_key||"";
  const sequels=(media.relations?.edges||[]).filter(e=>e.relationType==="SEQUEL"&&e.node?.type==="ANIME").map(e=>e.node);
  for(const sequel of sequels){
    const upcoming=sequel.nextAiringEpisode;
    if(!upcoming?.airingAt || sequel.status!=="RELEASING") continue;
    const airAt=Number(upcoming.airingAt)*1000;
    if(Number(upcoming.airingAt)*1000<=now+24*3600000){
      const episodeEvent=`anilist-sequel-episode:${sequel.id}:${upcoming.episode}:${upcoming.airingAt}`;
      await releaseNotification(db,item.user_id,'episode',sequel.title?.english||sequel.title?.romaji||item.title,{episode:Number(upcoming.episode),airingAt:airAt,provider:'AniList',mediaType:'anime',url:`https://anilist.co/anime/${sequel.id}`,sequelOf:item.title},episodeEvent,now);
    }
    const eventKey=`anilist-season:${sequel.id}:${upcoming.airingAt}`;
    if(airAt>=now-6*60*60*1000 && airAt<=now+45*24*60*60*1000 && seasonKey!==eventKey){
      await releaseNotification(db,item.user_id,"season",sequel.title?.english||sequel.title?.romaji||item.title,{season:sequel.season||null,airingAt:airAt,provider:"AniList",mediaType:"anime",url:`https://anilist.co/anime/${sequel.id}`},eventKey,now);
      seasonKey=eventKey;
    }
  }
  const episodeKey=next && Number(next.airingAt)*1000<=now+24*60*60*1000?`anilist:${media.id}:ep:${next.episode}:${next.airingAt}`:(old?.last_episode_key||"");
  await db.prepare("INSERT INTO release_watch_state(user_id,media_key,media_type,provider_id,last_episode_key,last_season_key,last_season,last_checked_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(user_id,media_key) DO UPDATE SET provider_id=excluded.provider_id,last_episode_key=excluded.last_episode_key,last_season_key=excluded.last_season_key,last_season=excluded.last_season,last_checked_at=excluded.last_checked_at")
    .bind(item.user_id,item.media_key,"anime",String(media.id),episodeKey,seasonKey,Number(media.seasonYear)||null,now).run();
}
async function checkTVRelease(db, item, now) {
  const search=await releaseWatchFetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(item.title)}`);
  const norm=x=>String(x||"").toLowerCase().replace(/[^a-z0-9]+/g,"").trim();
  const match=(search||[]).find(x=>norm(x.show?.name)===norm(item.title)) || (search||[])[0];
  if(!match?.show?.id) return;
  const show=await releaseWatchFetch(`https://api.tvmaze.com/shows/${match.show.id}?embed[]=nextepisode&embed[]=previousepisode`);
  const next=show?._embedded?.nextepisode, previous=show?._embedded?.previousepisode;
  const old=await db.prepare("SELECT * FROM release_watch_state WHERE user_id=? AND media_key=?").bind(item.user_id,item.media_key).first();
  const planned=/plan/i.test(String(item.status||''));
  const premiered=show.premiered&&Date.parse(show.premiered+'T00:00:00Z');
  if(planned&&Number.isFinite(premiered)&&premiered>=now-72*3600000&&premiered<=now+14*24*3600000){
    const eventKey=`tv-premiere:${show.id}:${show.premiered}`;
    await releaseNotification(db,item.user_id,'planned_release',show.name||item.title,{airingAt:premiered,provider:'TVmaze',mediaType:'tv',url:show.url||`https://www.tvmaze.com/shows/${show.id}`},eventKey,now);
  }
  // TVmaze exposes the actual most recently aired episode as well as the next episode.
  if(previous?.airstamp){const aired=Date.parse(previous.airstamp);
    if(Number.isFinite(aired)&&aired<=now&&aired>=now-48*3600000){
      const eventKey=`tv-episode-released:${show.id}:${previous.id}`;
      await releaseNotification(db,item.user_id,'episode_released',show.name||item.title,{episode:Number(previous.number)||null,season:Number(previous.season)||null,airingAt:aired,provider:'TVmaze',mediaType:'tv',url:show.url||`https://www.tvmaze.com/shows/${show.id}`},eventKey,now);
    }
  }
  let seasonKey=old?.last_season_key||"";
  if(next?.airstamp){
    const airAt=Date.parse(next.airstamp);
    if(planned&&Number(next.number)===1&&Number.isFinite(airAt)&&airAt>=now-72*3600000&&airAt<=now+14*24*3600000){
      const eventKey=`tv-planned-season:${show.id}:${next.season}:${next.id}`;
      await releaseNotification(db,item.user_id,'planned_release',show.name||item.title,{airingAt:airAt,season:Number(next.season)||null,provider:'TVmaze',mediaType:'tv',url:show.url||`https://www.tvmaze.com/shows/${show.id}`},eventKey,now);
    }
    const eventKey=`tvmaze:${show.id}:ep:${next.id}`;
    if(Number.isFinite(airAt)&&airAt>now-6*60*60*1000&&airAt<=now+24*60*60*1000&&old?.last_episode_key!==eventKey){
      await releaseNotification(db,item.user_id,"episode",show.name||item.title,{episode:Number(next.number)||null,season:Number(next.season)||null,airingAt:airAt,provider:"TVmaze",mediaType:"tv",url:show.url||`https://www.tvmaze.com/shows/${show.id}`},eventKey,now);
    }
    const previousSeason=Number(previous?.season)||Number(old?.last_season)||0, nextSeason=Number(next.season)||0;
    if(nextSeason>0&&previousSeason>0&&nextSeason>previousSeason){
      const seasonEvent=`tvmaze-season:${show.id}:season:${nextSeason}`;
      if(seasonKey!==seasonEvent&&airAt>=now-6*60*60*1000&&airAt<=now+60*24*60*60*1000){
        await releaseNotification(db,item.user_id,"season",show.name||item.title,{season:nextSeason,airingAt:airAt,provider:"TVmaze",mediaType:"tv",url:show.url||`https://www.tvmaze.com/shows/${show.id}`},seasonEvent,now);
        seasonKey=seasonEvent;
      }
    }
  }
  const episodeKey=next?.id && Date.parse(next.airstamp)<=now+24*60*60*1000?`tvmaze:${show.id}:ep:${next.id}`:(old?.last_episode_key||"");
  const currentSeason=Number(next?.season)||Number(previous?.season)||Number(old?.last_season)||0;
  await db.prepare("INSERT INTO release_watch_state(user_id,media_key,media_type,provider_id,last_episode_key,last_season_key,last_season,last_checked_at) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(user_id,media_key) DO UPDATE SET provider_id=excluded.provider_id,last_episode_key=excluded.last_episode_key,last_season_key=excluded.last_season_key,last_season=excluded.last_season,last_checked_at=excluded.last_checked_at")
    .bind(item.user_id,item.media_key,"tv",String(show.id),episodeKey,seasonKey,currentSeason||null,now).run();
}
async function runReleaseChecks(env) {
  const db=env.DB, now=Date.now();
  const {results=[]}=await db.prepare("SELECT l.user_id,l.media_key,l.media_type,l.title,l.status FROM media_logs l LEFT JOIN release_watch_state r ON r.user_id=l.user_id AND r.media_key=l.media_key WHERE l.media_type IN ('anime','tv') AND LOWER(l.status)<>'dropped' AND TRIM(l.title)<>'' ORDER BY COALESCE(r.last_checked_at,0) ASC,l.updated_at DESC LIMIT 1000").all();
  // Avoid duplicate provider lookups for users who track the same show; cap work per cron to protect shared API limits.
  let checked=0;
  for(const item of results){
    if(checked>=80) break;
    try { if(item.media_type==='anime') await checkAnimeRelease(db,item,now); else await checkTVRelease(db,item,now); checked++; }
    catch(e){ console.error("Release check failed",{title:item.title,type:item.media_type,error:String(e?.message||e)}); }
  }
  console.log(`Release watcher checked ${checked} tracked titles.`);
}

export default {
  async scheduled(controller, env, ctx) { ctx.waitUntil(runReleaseChecks(env)); ctx.waitUntil(pruneCatalogCache(env.DB)); ctx.waitUntil(scheduledAutoSync(env.DB,12)); },
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      // Proxy only Wikimedia-hosted images so Wikipedia covers can be served reliably
      // even when direct hotlink requests are blocked by a browser/network.
      if (url.pathname === "/api/catalog-image" && request.method === "GET") {
        const raw = url.searchParams.get("url") || "";
        let imageURL;
        try { imageURL = new URL(raw); } catch { return new Response("Invalid image URL", { status: 400 }); }
        // Only serve known public catalog image hosts. Prevent open-proxy/SSRF behavior.
        const host=imageURL.hostname.toLowerCase();
        const allowed=["upload.wikimedia.org","commons.wikimedia.org","s4.anilist.co","cdn.myanimelist.net","media.kitsu.io","covers.openlibrary.org","books.google.com","books.googleusercontent.com","image.tmdb.org","static.tvmaze.com","t.vndb.org","s.vndb.org","shared.akamai.steamstatic.com","shared.fastly.steamstatic.com","store.steampowered.com","cdn.akamai.steamstatic.com","steamcdn-a.akamaihd.net","book-pic.webnovel.com","raw.githubusercontent.com"];
        const allowedSubdomain=(host.endsWith(".mzstatic.com")&&/^is[0-9]+-ssl\.mzstatic\.com$/.test(host))||host.endsWith(".googleusercontent.com");
        if(imageURL.protocol!=="https:"||imageURL.port||imageURL.username||imageURL.password||(!allowed.includes(host)&&!allowedSubdomain))return new Response("Image host not allowed",{status:403});
        // A book-cover URL can legitimately redirect to an Internet Archive
        // cover shard. Follow a *validated* redirect, not an arbitrary URL.
        let target=imageURL,upstream;
        for(let hop=0;hop<4;hop++){
          upstream=await fetch(target.href,{redirect:"manual",headers:{"Accept":"image/avif,image/webp,image/apng,image/jpeg,image/png,image/*;q=0.8"},cf:{cacheTtl:86400,cacheEverything:true}});
          if(upstream.status<300||upstream.status>=400)break;
          const location=upstream.headers.get("Location");
          if(!location)return new Response("Missing image redirect",{status:502,headers:{"Cache-Control":"no-store"}});
          const next=new URL(location,target);
          const dest=next.hostname.toLowerCase();
          const accepted=allowed.includes(dest)||((dest.endsWith(".mzstatic.com")&&/^is[0-9]+-ssl\.mzstatic\.com$/.test(dest))||dest.endsWith(".googleusercontent.com"))||
            (imageURL.hostname==='covers.openlibrary.org'&&(dest==='archive.org'||dest.endsWith('.archive.org')));
          if(next.protocol!=="https:"||next.port||next.username||next.password||!accepted)return new Response("Image redirect blocked",{status:403,headers:{"Cache-Control":"no-store"}});
          target=next;
        }
        if (!upstream?.ok) return new Response("Cover image unavailable", { status: upstream?.status === 404 ? 404 : 502, headers: { "Cache-Control": "no-store" } });
        const byteLength=Number(upstream.headers.get("Content-Length")||0);
        if(byteLength>6*1024*1024)return new Response("Image is too large",{status:413});
        const contentType = upstream.headers.get("Content-Type") || "application/octet-stream";
        if (!contentType.toLowerCase().startsWith("image/")) return new Response("Upstream did not return an image", { status: 502 });
        const headers = new Headers({ "Content-Type": contentType, "Cache-Control": "public, max-age=86400, s-maxage=604800", "X-Content-Type-Options": "nosniff", "Access-Control-Allow-Origin": "*" });
        const length = upstream.headers.get("Content-Length"); if (length) headers.set("Content-Length", length);
        return new Response(upstream.body, { status: 200, headers });
      }
      if (url.pathname.startsWith('/api/forum/live/')) {
        if (!env.FORUM_LIVE) return json({error:'Live chat binding is missing. Deploy the full v37 Worker with its Durable Object.'},503);
        const allowed = /^\/api\/forum\/live\/(?:ws|snapshot|upload|images\/[a-fA-F0-9-]{36})$/;
        if (!allowed.test(url.pathname)) return json({error:'Live chat endpoint not found.'},404);
        if (url.pathname.endsWith('/ws') && request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') return json({error:'Use a WebSocket connection.'},426);
        if (url.pathname.endsWith('/upload') && request.method !== 'POST') return json({error:'Method not allowed.'},405);
        const user = await currentUser(request,env);
        if (url.pathname.endsWith('/upload') && !user) return json({error:'Sign in to post images.'},401);
        const avatar = String(user?.avatar_url || user?.avc || '');
        const metadata = {id:user?.id||'',name:user?.name||'',role:user?.role||'member',avatar:avatar.length<2048?avatar:''};
        const headers = new Headers(request.headers);
        headers.delete('Cookie');headers.delete('Authorization');headers.delete('X-MT-Chat-User');
        headers.set('X-MT-Chat-User',JSON.stringify(metadata));
        // The Durable Object is internal; it trusts only the authenticated identity supplied by this Worker.
        const forwarded = new Request(request,{headers});
        return env.FORUM_LIVE.getByName('mediatok-forum').fetch(forwarded);
      }
      if (url.pathname === '/api/credits/v53') return await creditRoute(request, env, ctx);
      // Health endpoint is intentionally independent of D1 so deployment/routing can be checked safely.
      if (url.pathname.startsWith("/api/music/v62") || url.pathname.startsWith("/api/music/v63")) return await handleMusicRoute(request,env,ctx,currentUser);
      if (url.pathname === "/api/health" && request.method === "GET") {
        return json({ ok: true, service: "mediatok-worker", version:"v96", catalogRoute: "/api/search/media", diagnosticsRoute:"/api/search/media/diagnostics", authRoute: "/auth/discord" });
      }
      // v41 catalog is a separate, maintained search service. Legacy routes remain for compatibility.
      if (url.pathname === '/api/books/browse' || url.pathname === '/api/lightnovels/browse' || url.pathname === '/api/webnovels/browse' || url.pathname.startsWith('/api/search/v41') || url.pathname.startsWith('/api/search/v42') || url.pathname === '/api/search/media' || url.pathname.startsWith('/api/search/media/')) { const response=await catalogRoute(request,env,ctx); if(response)return response; }
      const clientIP=request.headers.get("CF-Connecting-IP")||"";if(clientIP&&url.pathname!=="/auth/logout"){try{const ban=await env.DB.prepare("SELECT id FROM ip_bans WHERE ip_address=? OR ip_hash=?").bind(clientIP,clientIP).first();if(ban)return new Response("This IP address is banned from MediaTok.",{status:403,headers:{"Cache-Control":"no-store"}})}catch{}}
      if ((url.pathname === "/auth/discord" || url.pathname === "/auth/discord/") && request.method === "GET") return await oauthStart(request, env);
      if (url.pathname === "/auth/email/register") return await emailAuth(request, env, "register");
      if (url.pathname === "/auth/email/login") return await emailAuth(request, env, "login");
      if (url.pathname === "/auth/email/resend-verification") return await emailAuth(request, env, "resend-verification");
      if (url.pathname === "/auth/email/forgot-password") return await emailAuth(request, env, "forgot-password");
      if (url.pathname === "/auth/email/reset-password") return await resetPassword(request, env);
      if (url.pathname === "/auth/email/verify" && request.method === "GET") return await verifyEmailRoute(request, env);
      if (url.pathname === "/auth/discord/callback" && request.method === "GET") return await oauthCallback(request, env);
      if (url.pathname === "/auth/logout" && request.method === "GET") {
        const token = getCookie(request, "mt_session"); if (token) { try { await env.DB.prepare("DELETE FROM sessions WHERE token=?").bind(token).run(); } catch (e) { console.error("Session cleanup failed", String(e?.message||e)); } }
        return redirect(url.origin + "/?logged_out=1", { "Set-Cookie": "mt_session=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; Secure; SameSite=Lax", "Cache-Control":"no-store" });
      }
      if (url.pathname.startsWith("/api/")) { const response = await handleAPI(request, env, url); if (response) return response; }
      const preview = await discordProfilePreview(request, env, url);
      if (preview) return preview;
      return env.ASSETS.fetch(request);
    } catch (error) {
      console.error("MediaTok request failed", { path: url.pathname, message: String(error?.message || error) });
      return json({ error: "MediaTok had a server error. Check the Worker logs for the request path." }, 500);
    }
  }
};

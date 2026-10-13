

const IC={"home": "<path d='M3.5 11 12 4l8.5 7'/><path d='M5.5 9.8V20h13V9.8'/><path d='M10 20v-5h4v5'/>", "search": "<circle cx='11' cy='11' r='6.5'/><path d='m20 20-4.2-4.2'/>", "grid": "<rect x='3.5' y='3.5' width='7' height='7' rx='1.6'/><rect x='13.5' y='3.5' width='7' height='7' rx='1.6'/><rect x='3.5' y='13.5' width='7' height='7' rx='1.6'/><rect x='13.5' y='13.5' width='7' height='7' rx='1.6'/>", "film": "<rect x='3' y='4' width='18' height='16' rx='2'/><path d='M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4'/>", "book": "<path d='M6 3.5h11a2 2 0 0 1 2 2V20H8a2 2 0 0 1-2-2z'/><path d='M6 18a2 2 0 0 1 2-2h11'/>", "bookopen": "<path d='M12 6.5C10 5 7 4.6 3.5 5v13c3.5-.4 6.5 0 8.5 1.5 2-1.5 5-1.9 8.5-1.5V5C17 4.6 14 5 12 6.5z'/><path d='M12 6.5v13'/>", "bookmark": "<path d='M6.5 3.5h11v17L12 16.5l-5.5 4z'/>", "play": "<rect x='3' y='4' width='18' height='13' rx='2'/><path d='M10 8.2v5.6l4.6-2.8z'/><path d='M8 21h8'/>", "tv": "<rect x='3' y='7' width='18' height='13' rx='2'/><path d='m8 3 4 4 4-4'/>", "panels": "<rect x='3.5' y='3.5' width='8' height='10' rx='1.4'/><rect x='14' y='3.5' width='6.5' height='6' rx='1.4'/><rect x='14' y='12' width='6.5' height='8.5' rx='1.4'/><rect x='3.5' y='16' width='8' height='4.5' rx='1.4'/>", "game": "<rect x='2.5' y='7' width='19' height='11' rx='5.5'/><path d='M7.5 10.5v4M5.5 12.5h4'/><circle cx='15.8' cy='11.6' r='.9'/><circle cx='18' cy='14' r='.9'/>", "dialog": "<rect x='3' y='4' width='18' height='12' rx='2'/><path d='M7 8.5h10M7 11.5h6M9 20h6M12 16v4'/>", "chat": "<path d='M4 5h16v11H10l-4 4v-4H4z'/>", "forum": "<path d='M3.5 4.5h12v8H9l-3.5 3v-3h-2z'/><path d='M18.5 9h2v8.5h-2v3l-3.5-3H10v-2'/>", "settings": "<path d='M4 7h9M18 7h2M4 17h3M12 17h8'/><circle cx='15.5' cy='7' r='2.4'/><circle cx='9.5' cy='17' r='2.4'/>", "flag": "<path d='M5.5 21V4M5.5 4.5h12l-2.5 4 2.5 4h-12'/>", "heart": "<path d='M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z'/>", "bell": "<path d='M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 1.8H4.2z'/><path d='M10 21h4'/>", "user": "<circle cx='12' cy='8' r='4'/><path d='M4.5 21c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5'/>", "edit": "<path d='M4 20l4.2-1L19.5 7.7a2.1 2.1 0 0 0-3-3L5.2 16z'/><path d='m14.5 6.5 3 3'/>", "star": "<path d='M12 3.2l2.7 5.5 6 .9-4.4 4.2 1 6L12 17l-5.3 2.8 1-6L3.3 9.6l6-.9z'/>", "check": "<path d='m5 12.5 4.5 4.5L19 7.5'/>", "arrow": "<path d='M5 12h14M13 6l6 6-6 6'/>", "plus": "<path d='M12 5v14M5 12h14'/>", "upload": "<path d='M12 16V4M7 9l5-5 5 5M4.5 20h15'/>", "refresh": "<path d='M20 11a8 8 0 0 0-14.3-4L4 9'/><path d='M4 4v5h5'/><path d='M4 13a8 8 0 0 0 14.3 4L20 15'/><path d='M20 20v-5h-5'/>", "spark": "<path d='M12 3c.7 5 2.5 6.8 7.5 7.5-5 .7-6.8 2.5-7.5 7.5-.7-5-2.5-6.8-7.5-7.5C9.5 9.8 11.3 8 12 3z'/>", "alert": "<circle cx='12' cy='12' r='9'/><path d='M12 7.5v5.5M12 16.4h.01'/>", "info": "<circle cx='12' cy='12' r='9'/><path d='M12 11v5M12 7.7h.01'/>", "loader": "<path d='M12 3a9 9 0 1 0 9 9'/>", "x": "<path d='M6 6l12 12M18 6 6 18'/>", "link": "<path d='M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1'/><path d='M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'/>"};const ico=(n,c='')=>`<svg class='ic${c?' '+c:''}' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'>${IC[n]||IC.spark}</svg>`;
const TYPES={all:{label:'All media',icon:ico('search'),color:'#6681b3'},anime:{label:'Anime',icon:ico('play'),color:'#8b83f6'},manga:{label:'Manga',icon:ico('bookopen'),color:'#f1a0bf'},film:{label:'Films',icon:ico('film'),color:'#f4b36e'},tv:{label:'TV shows',icon:ico('tv'),color:'#67cbb8'},novel:{label:'Novels',icon:ico('book'),color:'#81a8f4'},'light-novel':{label:'Light novels',icon:ico('bookmark'),color:'#b9a0ef'},webnovel:{label:'Web novels',icon:ico('bookopen'),color:'#a6a0f5'},comic:{label:'Comics',icon:ico('panels'),color:'#f28e8e'},game:{label:'Games',icon:ico('game'),color:'#7ac9de'},'visual-novel':{label:'Visual novels',icon:ico('dialog'),color:'#c2a0ef'}};
const state={memberResults:[],me:null,view:'home',profile:null,profileLogs:[],feed:[],feedMode:"global",notifications:[],unreadNotifications:0,members:[],type:'anime',results:[],featured:[],search:'',loading:false,comments:{},commentOpen:{},logTarget:null,returnProfile:false,includeMature:true};
const savedTheme=(()=>{try{return localStorage.getItem('mt_theme')||'light'}catch{return 'light'}})();
function applyTheme(theme){const valid=['light','dark','blue-black'].includes(theme)?theme:'light';document.documentElement.dataset.theme=valid;try{localStorage.setItem('mt_theme',valid)}catch{}const meta=document.getElementById('mtThemeColor');if(meta)meta.content=valid==='light'?'#f6f7ff':valid==='blue-black'?'#050b16':'#0b1220';const darkBox=document.getElementById('mtDarkMode');if(darkBox)darkBox.checked=valid!=='light';const themeSelect=document.getElementById('mtThemeSelect');if(themeSelect)themeSelect.value=valid;}
function setDarkMode(enabled){applyTheme(enabled?'dark':'light');toast(enabled?'Dark mode enabled.':'Light mode enabled.','success')}
function setSiteTheme(theme){applyTheme(theme);toast(theme==='blue-black'?'Blue-black theme enabled.':theme==='dark'?'Dark theme enabled.':'Light theme enabled.','success')}
applyTheme(savedTheme);
function setMatureContent(){state.includeMature=true;render()}
function isMatureMedia(){return false}
const $=s=>document.querySelector(s);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const fmtDate=t=>{const d=new Date(Number(t)||Date.now());return d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})};const timeAgo=t=>{const m=Math.max(0,Math.floor((Date.now()-Number(t))/60000));return m<1?'just now':m<60?`${m}m ago`:m<1440?`${Math.floor(m/60)}h ago`:`${Math.floor(m/1440)}d ago`};const initials=s=>String(s||'?').slice(0,1).toUpperCase();const coverImg=(url,alt='')=>url?`<img class="cover" src="${esc(url)}" alt="${esc(alt)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"> <div class="cover-empty" style="display:none">${ico('spark')}</div>`:`<div class="cover-empty">${ico('spark')}</div>`;
async function api(path,opts={}){const res=await fetch(path,{credentials:'include',headers:{'Content-Type':'application/json',...(opts.headers||{})},...opts});let data={};try{data=await res.json()}catch{}if(!res.ok)throw new Error(data.error||`Request failed (${res.status})`);return data}
function toast(msg,type='info'){const icon=type==='success'?ico('check'):type==='error'?ico('alert'):type==='loading'?ico('loader'):ico('info');$('#toastRoot').innerHTML=`<div role="status" aria-live="polite" class="toast ${type}"><span class="toast-icon">${icon}</span><span>${esc(msg)}</span></div>`;if(type!=='loading')setTimeout(()=>$('#toastRoot').innerHTML='',type==='error'?4200:3000)}
function activityCoverFailed(img){
 if(img.dataset.artworkTitle){const key=artworkKey(img.dataset.artworkTitle,img.dataset.mediaType);verifiedArtworkMemory.delete(key);try{localStorage.removeItem(VERIFIED_ARTWORK_PREFIX+key)}catch{}}
 // Existing URLs can be stale. Turn them into recoverable titles instead of
 // replacing them with a permanent spark icon.
 const replacement=document.createElement('div');
 replacement.className='activity-cover activity-cover-missing';replacement.setAttribute('role','button');replacement.tabIndex=0;
 replacement.dataset.filmTitle=img.dataset.artworkTitle||img.alt||'';
 replacement.dataset.mediaType=img.dataset.mediaType||'anime';
 replacement.dataset.rejectedArtwork=img.dataset.coverOriginal||img.currentSrc||img.src;
 replacement.style.cssText='display:grid;place-items:center;font-size:24px';
 replacement.innerHTML=TYPES[replacement.dataset.mediaType]?.icon||ico('spark');
 img.replaceWith(replacement);void hydrateActivityCover(replacement);
}
async function hydrateActivityCover(node){
 if(!node?.isConnected||node.dataset.loadingArtwork==='1')return;
 node.dataset.loadingArtwork='1';
 const title=node.dataset.filmTitle,type=node.dataset.mediaType||'anime';
 try{
  let source=await sharedCoverForTitle(title,type);
  let src=source?await testedImage(source):'';
  if(!src&&node.dataset.rejectedArtwork){
   // The feed may contain an expired/invalid cover URL from a user's old log.
   // Request fresh provider alternatives, not the same broken image forever.
   const fresh=await cachedCoverDetails(title,type,true).catch(()=>({cover:'',alternates:[]}));
   for(const next of [fresh.cover,...(fresh.alternates||[])]){
    if(!next||next===source||next===node.dataset.rejectedArtwork)continue;
    const tried=await testedImage(next);if(tried){source=next;src=tried;break;}
   }
  }
  if(!src||!node.isConnected)return;
  saveVerifiedArtwork(title,type,source);
  const img=document.createElement('img');img.className='activity-cover';img.alt=title;img.setAttribute('role','button');img.tabIndex=0;
  img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';
  img.dataset.artworkTitle=title;img.dataset.mediaType=type;img.dataset.coverOriginal=source;
  img.onload=()=>recordCoverLoaded(img);img.onerror=()=>activityCoverFailed(img);
  node.replaceWith(img);img.src=src;
 }catch{}finally{node.dataset.loadingArtwork='0'}
}
async function loadRecentFilmCovers(scope=document){
 // Despite its old name this now covers every medium and every rendered feed,
 // including the right-hand Global Recents panel on the homepage.
 const nodes=[...scope.querySelectorAll('.activity-cover-missing[data-film-title]')].slice(0,state.view==='home'?14:36);let next=0;
 const worker=async()=>{while(next<nodes.length){await hydrateActivityCover(nodes[next++]);}};
 await Promise.all(Array.from({length:Math.min(3,nodes.length)},worker));
}

function login(){openAuthModal('login')}function logout(){state.me=null;state.profile=null;location.replace(new URL('/auth/logout',window.location.origin).href)}
function avatar(u,size=36){const src=u?.avatarUrl||u?.avatar_url||u?.avc||u?.avatar||'';if(!src)return `<span class="avatar" style="width:${size}px;height:${size}px">${esc(initials(u?.name))}</span>`;return `<img class="avatar" style="width:${size}px;height:${size}px" src="${esc(src)}" alt="${esc(u?.name||'Profile picture')}" loading="lazy" referrerpolicy="no-referrer" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'avatar',textContent:'${esc(initials(u?.name))}',style:'width:${size}px;height:${size}px'}))">`}
// Profile-specific avatar loader: preserve uploaded PFPs and retry the linked account image.
function profileAvatarFailed(img){
  const fallback=img.getAttribute('data-fallback-src')||'';
  if(fallback && img.getAttribute('data-attempted-fallback')!=='yes'){
    img.setAttribute('data-attempted-fallback','yes');
    img.src=fallback;
    return;
  }
  const span=document.createElement('span');
  span.className=img.className;
  span.textContent=img.getAttribute('data-initials')||'?';
  span.setAttribute('role','img');
  span.setAttribute('aria-label',img.alt||'Profile picture');
  span.style.width=img.style.width;
  span.style.height=img.style.height;
  img.replaceWith(span);
}
function profileAvatar(u,size=88,klass='pf-hero-avatar'){
  const primary=String(u?.avatarUrl||u?.avatar_url||'').trim();
  const backup=String(u?.avc||u?.avatar||'').trim();
  const valid=v=>/^https?:\/\//i.test(v)||/^\/(?!\/)/.test(v)||/^data:image\/(png|jpeg|webp|gif|avif);base64,[A-Za-z0-9+/=]+$/i.test(v);
  const first=valid(primary)?primary:valid(backup)?backup:'';
  const second=valid(backup)&&backup!==first?backup:'';
  const name=String(u?.globalName||u?.name||'Profile');
  const classes='avatar '+klass;
  const fallback=esc(initials(name));
  if(!first)return `<span class="${classes}" role="img" aria-label="${esc(name)} profile picture" style="width:${size}px;height:${size}px">${fallback}</span>`;
  return `<img class="${classes}" src="${esc(first)}" ${second?`data-fallback-src="${esc(second)}"`:''} data-initials="${fallback}" alt="${esc(name)} profile picture" style="width:${size}px;height:${size}px" loading="eager" decoding="async" referrerpolicy="no-referrer" onerror="profileAvatarFailed(this)">`;
}
function userLink(name){return '/'+encodeURIComponent(name||'')}
function goView(view){document.title='MediaTok — Your media, all in one place';state.view=view;state.profile=null;history.pushState({},'', '/');render();window.scrollTo({top:0,behavior:'smooth'})}
function mobileMenuItems(){
 const items=[['home','home','Overview'],['discover','search','Discover media'],['animanga','grid','Animanga'],['filmstv','film','Films & TV'],['books','book','Books & comics'],['forum','forum','Community forum'],['leaderboard','trophy','Leaderboard'],['feed','heart','Recent activity'],['settings','settings','Settings']];
 if(state.me){items.push(['notifications','bell','Notifications',state.unreadNotifications||0]);items.push(['profile','user','My profile']);items.push(['customize','edit','Customize profile']);if(['owner','admin','moderator'].includes(state.me.role))items.push(['admin','flag','Admin portal']);}
 return items;
}
function mobileMenuLink(item){const [view,icon,label,count]=item;let action='';if(view==='notifications')action='loadNotifications();closeMobileMenu()';else if(view==='profile')action=`closeMobileMenu();location.href=${JSON.stringify(userLink(state.me.name))}`;else if(view==='customize')action='closeMobileMenu();openProfileEditor()';else action=`closeMobileMenu();goView(${JSON.stringify(view)})`;return `<button type="button" class="mobile-menu-link ${state.view===view?'active':''}" onclick="${action.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"><span class="mobile-menu-icon">${ico(icon)}</span><span class="mobile-menu-label">${esc(label)}</span>${count?`<span class="pill">${Number(count)}</span>`:''}</button>`}
function renderMobileMenu(){const root=$('#mobileMenuContent');if(!root)return;const account=state.me?`<div class="mobile-menu-account">${avatar(state.me,44)}<div class="account-copy"><strong>${esc(state.me.name)}</strong><small>Account and profile</small></div><button class="btn light small" onclick="closeMobileMenu();openProfileEditor()">Edit</button></div>`:`<div class="mobile-menu-account"><span class="mobile-menu-icon">${ico('user')}</span><div class="account-copy"><strong>Welcome to MediaTok</strong><small>Sign in to save your collection</small></div><button class="btn primary small" onclick="closeMobileMenu();login()">Sign in</button></div>`;const items=mobileMenuItems();root.innerHTML=account+`<div class="mobile-menu-section-title">Browse</div>${items.filter(x=>['home','discover','animanga','filmstv','books','forum','leaderboard'].includes(x[0])).map(mobileMenuLink).join('')}<div class="mobile-menu-section-title">Your space</div>${items.filter(x=>!['home','discover','animanga','filmstv','books','forum','leaderboard'].includes(x[0])).map(mobileMenuLink).join('')}<div class="mobile-menu-foot">Your MediaTok account keeps your media, profile, and community in one place.</div>`}
function openMobileMenu(){const layer=$('#mobileMenuLayer'),trigger=$('#mobileMenuTrigger');if(!layer)return;renderMobileMenu();layer.hidden=false;layer.setAttribute('aria-hidden','false');document.body.classList.add('mobile-menu-open');trigger?.setAttribute('aria-expanded','true');$('#mobileMenuContent')?.querySelector('button')?.focus({preventScroll:true});}
function closeMobileMenu(){const layer=$('#mobileMenuLayer'),trigger=$('#mobileMenuTrigger');if(!layer)return;layer.hidden=true;layer.setAttribute('aria-hidden','true');document.body.classList.remove('mobile-menu-open');trigger?.setAttribute('aria-expanded','false');trigger?.focus({preventScroll:true});}
function toggleMobileMenu(){const layer=$('#mobileMenuLayer');if(layer?.hidden)openMobileMenu();else closeMobileMenu();}
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('#mobileMenuLayer')?.hidden)closeMobileMenu()});

function setActive(){document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view))}
function openAuthModal(mode='login'){
 const root=$('#modalRoot'); if(!root)return;
 root.innerHTML=`<div class="modal-back" onclick="if(event.target===this)closeModal()"><section class="modal" style="max-width:480px"><div class="eyebrow">Your account, your choice</div><h2 style="margin:6px 0 8px">${mode==='register'?'Create your MediaTok account':'Sign in to MediaTok'}</h2><p class="sub" style="line-height:1.6;margin-bottom:16px">Use an email address you choose, or continue with Discord. These login methods stay separate and are never automatically merged.</p><div class="tabs"><button class="tab ${mode==='login'?'active':''}" onclick="openAuthModal('login')">Sign in with email</button><button class="tab ${mode==='register'?'active':''}" onclick="openAuthModal('register')">Create email account</button></div><form onsubmit="submitEmailAuth(event,'${mode}')">${mode==='register'?`<div class="formitem"><label for="authUsername">Username</label><input class="field" id="authUsername" name="username" type="text" autocomplete="username" minlength="3" maxlength="24" pattern="[A-Za-z0-9_-]{3,24}" required placeholder="Choose a public username"><div class="sub">3–24 characters: letters, numbers, underscores, or hyphens. This is what other members will see, not your email.</div></div>`:''}<div class="formitem" style="margin-top:12px"><label for="authEmail">Email address</label><input class="field" id="authEmail" name="email" type="email" autocomplete="email" maxlength="254" required placeholder="you@example.com"></div><div class="formitem" style="margin-top:12px"><label for="authPassword">Password</label><input class="field" id="authPassword" name="password" type="password" autocomplete="${mode==='register'?'new-password':'current-password'}" minlength="12" maxlength="128" required placeholder="At least 12 characters"><div class="sub">Use a unique password you don't use elsewhere.</div></div>${mode==='register'?`<div class="tip" style="margin-top:12px"><b>Email verification required</b>We’ll email you a link. You must verify your email before you can sign in. Accounts remain separate from Discord.</div>`:`<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:12px"><button type="button" class="textbtn" onclick="openForgotPassword()">Forgot password?</button><button type="button" class="textbtn" onclick="resendVerificationFromLogin()">Resend verification email</button></div>`}<div id="authError" role="alert" style="color:#b52e48;margin-top:12px;display:none"></div><button class="btn primary" id="authSubmit" type="submit" style="width:100%;margin-top:15px">${mode==='register'?'Create email account':'Sign in with email'}</button></form><div style="display:flex;align-items:center;gap:10px;margin:18px 0;color:var(--muted);font-size:12px"><span style="height:1px;background:var(--line);flex:1"></span>OR<span style="height:1px;background:var(--line);flex:1"></span></div><button class="btn white" style="width:100%" onclick="location.assign('/auth/discord')">Continue with Discord</button><p class="sub" style="margin-top:13px">MediaTok will not ask for your Discord password. Discord sign-in happens on Discord's official website.</p></section></div>`;
}
async function submitEmailAuth(event,mode){event.preventDefault();const button=$('#authSubmit'),error=$('#authError');button.disabled=true;button.textContent=mode==='register'?'Sending verification…':'Signing in…';error.style.display='none';try{const response=await fetch(`/auth/email/${mode}`,{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:$('#authEmail').value,password:$('#authPassword').value,username:mode==='register'?$('#authUsername').value.trim():undefined})});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Could not continue.');if(mode==='register'){if(data.verificationRequired===false){openAuthModal('login');toast('Account created. You can sign in now.','success');return}openAuthMessage('Check your email',data.message||'Open the verification link sent to your inbox.');return}closeModal();state.me=(await api('/api/me')).user;await refreshFeed();render();toast('Signed in successfully.','success')}catch(e){error.textContent=e.message;error.style.display='block';button.disabled=false;button.textContent=mode==='register'?'Create email account':'Sign in with email'}}
function openAuthMessage(title,message){$('#modalRoot').innerHTML=`<div class="modal-back" onclick="if(event.target===this)closeModal()"><section class="modal" style="max-width:440px"><div class="eyebrow">MediaTok account</div><h2>${esc(title)}</h2><p class="sub" style="line-height:1.7">${esc(message)}</p><button class="btn primary" style="width:100%;margin-top:15px" onclick="closeModal()">Got it</button></section></div>`}
function openForgotPassword(){ $('#modalRoot').innerHTML=`<div class="modal-back" onclick="if(event.target===this)closeModal()"><section class="modal" style="max-width:440px"><div class="eyebrow">Account recovery</div><h2>Forgot your password?</h2><p class="sub" style="line-height:1.6">Enter your email and we’ll send a reset link if a verified MediaTok email account matches it.</p><form onsubmit="submitAuthEmailAction(event,'forgot-password')"><div class="formitem"><label>Email address</label><input class="field" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com"></div><div id="authActionError" role="alert" style="color:#b52e48;margin-top:12px;display:none"></div><button class="btn primary" id="authActionSubmit" style="width:100%;margin-top:15px">Send reset link</button><button type="button" class="btn white" style="width:100%;margin-top:8px" onclick="openAuthModal('login')">Back to sign in</button></form></section></div>`}
async function resendVerificationFromLogin(){const email=$('#authEmail')?.value.trim();if(!email){const e=$('#authError');e.textContent='Enter your email address first.';e.style.display='block';return}try{const r=await fetch('/auth/email/resend-verification',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not send verification email.');openAuthMessage('Check your inbox',d.message)}catch(e){const el=$('#authError');el.textContent=e.message;el.style.display='block'}}
async function submitAuthEmailAction(event,mode){event.preventDefault();const form=event.currentTarget,button=$('#authActionSubmit'),error=$('#authActionError');button.disabled=true;error.style.display='none';try{const r=await fetch('/auth/email/'+mode,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:form.email.value})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not send email.');openAuthMessage('Check your inbox',d.message||'If the address is eligible, an email will arrive shortly.')}catch(e){error.textContent=e.message;error.style.display='block';button.disabled=false}}
function openResetPassword(token){$('#modalRoot').innerHTML=`<div class="modal-back"><section class="modal" style="max-width:440px"><div class="eyebrow">Account recovery</div><h2>Choose a new password</h2><p class="sub">Use at least 12 characters. This link can only be used once.</p><form onsubmit="submitNewPassword(event,'${esc(token)}')"><div class="formitem"><label>New password</label><input class="field" name="password" type="password" minlength="12" maxlength="128" autocomplete="new-password" required></div><div id="resetError" role="alert" style="color:#b52e48;margin-top:12px;display:none"></div><button class="btn primary" id="resetSubmit" style="width:100%;margin-top:15px">Update password</button></form></section></div>`}
async function submitNewPassword(event,token){event.preventDefault();const form=event.currentTarget,button=$('#resetSubmit'),error=$('#resetError');button.disabled=true;try{const r=await fetch('/auth/email/reset-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token,password:form.password.value})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not reset password.');history.replaceState({},'', '/');openAuthMessage('Password updated',d.message);setTimeout(()=>openAuthModal('login'),900)}catch(e){error.textContent=e.message;error.style.display='block';button.disabled=false}}

function updateTop(){const root=$('#topUser');if(state.me)root.innerHTML=`<span class="mt-top-tools"><button class="notification-top" type="button" aria-label="Notifications${state.unreadNotifications?' ('+state.unreadNotifications+' unread)':''}" title="Notifications" onclick="loadNotifications()">${ico('bell')}${state.unreadNotifications?`<span class="mt-notify-count">${Number(state.unreadNotifications)>99?'99+':Number(state.unreadNotifications)}</span>`:''}</button><button class="btn light small" onclick="location.href='${userLink(state.me.name)}'">${avatar(state.me,25)} &nbsp; ${esc(state.me.name)}</button></span>`;else root.innerHTML=`<button class="btn primary" onclick="login()">Sign in</button>`}
function shell(main,sideRight=true){setTimeout(()=>loadLeaderboard(),0);return `<div class="layout${state.view==='profile'?' pf-page':''}"><aside class="side"><div class="side-title">YOUR SPACE</div>${[['home','home','Overview'],['discover','search','Discover media'],['animanga','grid','Animanga'],['filmstv','film','Films & TV'],['books','book','Books & comics'],['forum','forum','Forum'],['leaderboard','trophy','Leaderboard'],['settings','settings','Settings']].map(([v,i,l])=>`<button class="side-link ${state.view===v?'active':''}" onclick="goView('${v}')"><span class="ico">${ico(i)}</span>${l}</button>`).join('')}<div class="side-title" style="margin-top:13px">COMMUNITY</div>${state.me&&['owner','admin','moderator'].includes(state.me.role)?`<button class="side-link ${state.view==='admin'?'active':''}" onclick="goView('admin')"><span class="ico">${ico('flag')}</span>Admin portal</button>`:''}<button class="side-link ${state.view==='feed'?'active':''}" onclick="goView('feed')"><span class="ico">${ico('heart')}</span>Recent activity</button>${state.me?`<button class="side-link ${state.view==='notifications'?'active':''}" onclick="loadNotifications()"><span class="ico">${ico('bell')}</span>Notifications ${state.unreadNotifications?`<span class="pill">${state.unreadNotifications}</span>`:''}</button>`:''}${state.me?`<button class="side-link" onclick="location.href='${userLink(state.me.name)}'"><span class="ico">${ico('user')}</span>My profile</button><button class="side-link" onclick="openProfileEditor()"><span class="ico">${ico('edit')}</span>Customize profile</button>`:''}<div class="side-bottom">One profile for everything you watch, read, play and love.<br><b style="color:#7d7be8">Make your media yours</b></div></aside><main class="main">${main}</main>${sideRight?rightColumn():''}</div><footer class="footer">MediaTok · One home for every medium · <a href="https://docs.anilist.co/" target="_blank" rel="noopener">Media data inspiration</a></footer><a class="discord-icon-float" href="https://discord.gg/mangatok" target="_blank" rel="noopener" aria-label="MediaTok Discord" title="MediaTok Discord"><svg viewBox="0 0 127 96" aria-hidden="true"><path fill="currentColor" d="M107.7 8A105 105 0 0 0 81.6 0a72 72 0 0 0-3.3 6.8 98 98 0 0 0-29.4 0A72 72 0 0 0 45.6 0 106 106 0 0 0 19.4 8C2.9 32.5-1.6 56.4.7 79.9a106 106 0 0 0 32 16.2 78 78 0 0 0 6.9-11.1 68 68 0 0 1-10.8-5.2l2.7-2.1c20.8 9.7 43.4 9.7 64 0l2.7 2.1a69 69 0 0 1-10.8 5.2 77 77 0 0 0 6.9 11.1 105 105 0 0 0 32-16.2C134 52.6 122 26 107.7 8ZM42 66c-6.2 0-11.4-5.7-11.4-12.7S35.7 40.6 42 40.6s11.5 5.7 11.4 12.7C53.4 60.3 48.4 66 42 66Zm42.8 0c-6.2 0-11.4-5.7-11.4-12.7s5-12.7 11.4-12.7 11.5 5.7 11.4 12.7C96.2 60.3 91.2 66 84.8 66Z"/></svg></a>`}
let leaderboardCache=null,leaderboardLoading=null;
async function loadLeaderboard(force=false){const root=$('#sideLeaderboardRows');if(!root)return;if(leaderboardCache&&!force&&Date.now()-(window.mtLeaderboardFetchedAt||0)<60000){root.innerHTML=leaderboardRowsHTML(leaderboardCache);return}if(leaderboardLoading)return;leaderboardLoading=(async()=>{try{const rows=await api('/api/leaderboard?version=v48&now='+Date.now());leaderboardCache=Array.isArray(rows)?rows:[];window.mtLeaderboardFetchedAt=Date.now();const live=$('#sideLeaderboardRows');if(live)live.innerHTML=leaderboardRowsHTML(leaderboardCache)}catch{const live=$('#sideLeaderboardRows');if(live)live.innerHTML='<div class="side-leaderboard-loading">Leaderboard unavailable</div>'}finally{leaderboardLoading=null}})();await leaderboardLoading}
function leaderboardAvatar(u,size=42,klass='avatar'){
 const name=String(u?.name||u?.display_name||'Member');
 const valid=src=>/^https?:\/\//i.test(src)||/^\/(?!\/)/.test(src)||/^data:image\/(?:png|jpeg|webp|gif);base64,/i.test(src);
 const first=String(u?.avatar||u?.avatarUrl||u?.profile_avatar||'').trim();
 const backup=String(u?.avatarFallback||u?.fallback_avatar||u?.avc||'').trim();
 const source=valid(first)?first:valid(backup)?backup:'';
 const alt=valid(backup)&&backup!==source?backup:'';
 const classes=''+klass;
 if(!source)return `<span class="${classes}" role="img" aria-label="${esc(name)} profile picture" style="width:${size}px;height:${size}px">${esc(initials(name))}</span>`;
 return `<img class="${classes}" src="${esc(source)}" ${alt?`data-fallback-src="${esc(alt)}"`:''} data-initials="${esc(initials(name))}" alt="${esc(name)} profile picture" loading="lazy" decoding="async" referrerpolicy="no-referrer" style="width:${size}px;height:${size}px" onerror="profileAvatarFailed(this)">`;
}
function leaderboardRowsHTML(rows){if(!rows.length)return '<div class="side-leaderboard-loading">No members yet</div>';return rows.map(u=>`<button class="side-leaderboard-row" type="button" onclick="location.href='${userLink(u.name)}'" title="Open ${esc(u.name)} profile"><span class="side-leaderboard-rank">${u.rank}</span>${leaderboardAvatar(u,25,'avatar')}<span class="side-leaderboard-name">${esc(u.name)}</span><strong>${Number(u.entries||0).toLocaleString()}</strong></button>`).join('')}
function rightColumn(){const stats=state.me?.stats||{};return `<aside class="rightcol"><section class="panel rightbox"><h3>${state.me?'Your collection':'Track everything'}</h3>${Object.entries(TYPES).map(([k,t])=>`<div class="type-row"><span class="type-dot" style="--dot:${t.color}"></span><span class="type-name">${t.label}</span><strong>${state.me?(stats[k]||0):'—'}</strong></div>`).join('')}<div class="type-row" style="padding-top:13px"><span class="type-name"><b>Total logged</b></span><strong>${state.me?(stats.total||0):'—'}</strong></div></section><section class="panel rightbox right-activity-box"><div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px"><h3 style="margin:0">Recent activity</h3><button class="textbtn" onclick="goView('feed')">See all ${ico('arrow')}</button></div><div class="right-activity-feed">${renderFeed((state.feed||[]).slice(0,5))}</div></section><section class="tip"><b>Your taste, in one place</b>Keep your anime, manga, films, shows, novels, comics and games together. Every entry becomes part of your profile.</section>${state.me?`<section class="panel rightbox"><h3>Your profile</h3><div style="display:flex;align-items:center;gap:10px">${avatar(state.me,42)}<div style="min-width:0"><b>${esc(state.me.name)}</b><div class="sub">mediatok.org/${esc(state.me.name)}</div></div></div><button class="btn light" style="width:100%;margin-top:13px" onclick="openProfileEditor()">Customize profile</button></section>`:''}</aside>`}
const NICHE_PICKS={
 anime:[['Serial Experiments Lain','anime','identity, isolation, and the internet'],['Texhnolyze','anime','bleak cyberpunk and existential dread'],['Mononoke','anime','stylized supernatural mysteries'],['Haibane Renmei','anime','quiet, spiritual melancholy'],['Paranoia Agent','anime','urban anxiety and collective fear'],['The Tatami Galaxy','anime','regret, choices, and alternate lives'],['Ergo Proxy','anime','memory and post-apocalyptic identity'],['Mushishi','anime','quiet supernatural folklore'],['Girls’ Last Tour','anime','friendship at the end of the world'],['Kaiba','anime','memory, class, and identity'],['Ping Pong the Animation','anime','ambition and self-discovery'],['Sonny Boy','anime','surreal adolescence and uncertainty']],
 manga:[['Welcome Back, Alice','manga','Shuzo Oshimi’s uncomfortable coming-of-age drama'],['The Climber','manga','obsession, solitude, and ambition'],['Goodnight Punpun','manga','a dark, intimate portrait of growing up'],['Aku no Hana','manga','alienation and adolescent shame'],['Homunculus','manga','psychological horror and self-perception'],['Fire Punch','manga','violent dystopia with strange philosophical turns'],['Blood on the Tracks','manga','family tension and psychological dread'],['The Flowers of Evil','manga','shame, desire, and adolescence'],['Chi no Wadachi','manga','an unsettling family drama'],['Solanin','manga','young adulthood and uncertainty'],['No Longer Human','manga','a manga adaptation of alienation and shame'],['Ultra Heaven','manga','surreal sci-fi and altered perception']],
 film:[['Perfect Blue','film','identity, fame, and psychological horror'],['The Holy Mountain','film','surreal, symbolic midnight cinema'],['Stalker','film','slow cinema, faith, and desire'],['House (Hausu)','film','experimental cult horror'],['A Brighter Summer Day','film','youth, violence, and social change'],['The Godfather','film','crime, family, and moral corrosion'],['Come and See','film','an uncompromising anti-war film'],['Persona','film','identity and fractured relationships'],['Yi Yi','film','ordinary lives and quiet revelations'],['Mulholland Drive','film','dream logic and fractured identity'],['Paris, Texas','film','distance, memory, and reconnection'],['Ikiru','film','meaning and the time we have']],
 tv:[['The Sopranos','tv','character study disguised as a mob drama'],['Twin Peaks','tv','small-town mystery and dream logic'],['The Leftovers','tv','grief, faith, and the inexplicable'],['Mr. Robot','tv','alienation, systems, and fractured identity'],['The Mentalist','tv','a sharp procedural with a long-running mystery'],['Hannibal','tv','stylized psychological cat-and-mouse'],['Six Feet Under','tv','family, mortality, and change'],['Severance','tv','work, memory, and identity'],['Dark','tv','time, family, and consequence'],['Mad Men','tv','identity and reinvention'],['The Wire','tv','institutions and urban life'],['Atlanta','tv','surreal comedy and social observation']],
 novel:[['White Nights','novel','loneliness, longing, and an imagined connection'],['Notes from Underground','novel','resentment and self-sabotage'],['The Stranger','novel','alienation and absurdity'],['No Longer Human','novel','masking, shame, and disconnection'],['The Trial','novel','bureaucratic nightmare and helplessness'],['The Bell Jar','novel','identity and inner life'],['The Brothers Karamazov','novel','faith, doubt, and responsibility'],['The Metamorphosis','novel','family, alienation, and change'],['The Plague','novel','community under pressure'],['The Death of Ivan Ilyich','novel','mortality and self-examination'],['The Book of Disquiet','novel','fragmented reflections on life'],['Crime and Punishment','novel','guilt and moral conflict']],
 'light-novel':[['Welcome to the N.H.K.!','light-novel','withdrawal, anxiety, and connection'],['Three Days of Happiness','light-novel','meaning, time, and regret'],['The Empty Box and Zeroth Maria','light-novel','psychological mystery and looping reality'],['Kino’s Journey','light-novel','philosophical travel stories'],['Monogatari Series','light-novel','wordplay, oddities, and unreliable narration'],['Spice and Wolf','light-novel','economics and companionship'],['Boogiepop','light-novel','urban legends and fractured viewpoints'],['The Melancholy of Haruhi Suzumiya','light-novel','reality and adolescence'],['86','light-novel','war and humanity'],['The Apothecary Diaries','light-novel','court mysteries and observation'],['Re:Zero','light-novel','choices and consequences'],['The Zaregoto Series','light-novel','mystery and unreliable narration']],
 comic:[['The Sandman','comic','myth, dreams, and dark fantasy'],['From Hell','comic','historical horror and obsession'],['Black Hole','comic','adolescence and body-horror metaphor'],['Maus','comic','memory and inherited trauma'],['Daytripper','comic','ordinary lives and mortality'],['Watchmen','comic','power, morality, and consequence'],['Persepolis','comic','growing up through political upheaval'],['Asterios Polyp','comic','identity and relationships'],['Ghost World','comic','friendship and drifting into adulthood'],['The Sculptor','comic','art, time, and sacrifice'],['Fun Home','comic','family and self-discovery'],['Saga','comic','family in a strange universe']],
 game:[['Disco Elysium','game','failed detective, politics, and inner voices'],['Pathologic 2','game','plague, sacrifice, and moral uncertainty'],['Night in the Woods','game','small-town alienation and growing up'],['SOMA','game','identity and consciousness'],['The House in Fata Morgana','game','gothic tragedy and unreliable history'],['Kentucky Route Zero','game','magical realism and economic anxiety'],['Outer Wilds','game','curiosity, discovery, and impermanence'],['Planescape: Torment','game','identity and the self'],['Signalis','game','memory and cosmic horror'],['Silent Hill 2','game','grief and psychological horror'],['Return of the Obra Dinn','game','deduction and mystery'],['1000xRESIST','game','memory, identity, and inheritance']],
 'visual-novel':[['The House in Fata Morgana','visual-novel','gothic tragedy and unreliable history'],['Umineko When They Cry','visual-novel','mystery, truth, and belief'],['The Silver Case','visual-novel','fragmented crime stories'],['Saya no Uta','visual-novel','cosmic horror and perception'],['Steins;Gate','visual-novel','time travel and consequence'],['428: Shibuya Scramble','visual-novel','interwoven stories and choices'],['The Sekimeiya: Spun Glass','visual-novel','locked-room mystery'],['AI: The Somnium Files','visual-novel','investigation and surreal dreams'],['Higurashi When They Cry','visual-novel','rural mystery and paranoia'],['Paranormasight','visual-novel','urban legends and supernatural mystery'],['The Great Ace Attorney','visual-novel','courtroom mystery'],['Remember11','visual-novel','psychological mystery and fractured reality']]
};
// This directory is an intentionally non-exhaustive offline starting point;
// searching still consults the broader catalog and manual entry remains available.
const WEBNOVEL_RECOMMENDATIONS=["Reverend Insanity", "Lord of the Mysteries", "Circle of Inevitability", "Shadow Slave", "Mother of Learning", "The Beginning After the End", "Omniscient Reader’s Viewpoint", "The Legendary Mechanic", "Warlock of the Magus World", "A Record of a Mortal's Journey to Immortality", "Supreme Magus", "Solo Leveling", "The King's Avatar", "Release That Witch", "Coiling Dragon", "Stellar Transformations", "Desolate Era", "Swallowed Star", "I Shall Seal the Heavens", "A Will Eternal", "Renegade Immortal", "Pursuit of the Truth", "Beyond the Timescape", "Against the Gods", "Martial World", "True Martial World", "Tales of Demons and Gods", "The Novel's Extra", "Trash of the Count's Family", "The Second Coming of Gluttony", "SSS-Class Suicide Hunter", "Overgeared", "The Legendary Moonlight Sculptor", "Everyone Else Is a Returnee", "The Book Eating Magician", "Damn Reincarnation", "The Tutorial Is Too Hard", "The World After the Fall", "The S-Classes That I Raised", "The Author's POV", "My Vampire System", "My Werewolf System"];
NICHE_PICKS.webnovel=WEBNOVEL_RECOMMENDATIONS.map(title=>[title,'webnovel','Web fiction · browse or search']);
function searchPick(type,title){state.view='discover';state.profile=null;state.type=type;state.search=title;state.results=[];history.pushState({},'','/');render();setTimeout(()=>{const input=$('#globalSearchInput');if(input)input.value=title;searchMedia()},80)}
function pickCards(type,limit=50){const source=(NICHE_PICKS[type]||NICHE_PICKS.anime);const picks=source.slice(0,limit);return `<div class="niche-grid">${picks.map(([title,t,desc],i)=>`<article class="niche-card"><div class="niche-art mt-tap-poster" id="pickart-${type}-${i}" data-pick-title="${esc(title)}" data-pick-type="${esc(t)}" role="button" tabindex="0" aria-label="Open ${esc(title)} details" onclick="openSiteMediaDetails(this.dataset.pickType,this.dataset.pickTitle,this.querySelector('img')?.dataset.coverOriginal||'')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}"><span>${TYPES[t]?.icon||ico('spark')}</span></div><div class="niche-info"><div class="tile-title" title="${esc(title)}">${esc(title)}</div><div class="tile-meta">${esc(desc)}</div><button class="textbtn" onclick="searchPick('${t}','${title.replace(/\\/g,'\\\\').replace(/'/g,"\\'")}')">Find title ${ico('arrow')}</button></div></article>`).join('')}</div>`}
let featuredMedium='anime';const FEATURED_MEDIUM_ORDER=['anime','manga','film','tv','novel','light-novel','webnovel','comic','game','visual-novel'];function rotateFeatured(){const i=FEATURED_MEDIUM_ORDER.indexOf(featuredMedium);featuredMedium=FEATURED_MEDIUM_ORDER[(i+1)%FEATURED_MEDIUM_ORDER.length];const root=$('#featuredMedia');if(root){root.innerHTML=pickCards(featuredMedium,6);loadPickCovers(root);}}
let coverLookupActive=0;
const coverLookupPending=[];
function coverLookupSlot(fn){return new Promise((resolve,reject)=>{
 const run=()=>{coverLookupActive++;Promise.resolve().then(fn).then(resolve,reject).finally(()=>{coverLookupActive--;coverLookupPending.shift()?.()})};
 if(coverLookupActive<2)run();else coverLookupPending.push(run);
});}
async function coverLookup(title,type,alternate=false){
 if(!title||!TYPES[type]||type==='all')return {cover:'',alternates:[]};
 return coverLookupSlot(async()=>{
  for(const route of ['/api/search/media/cover','/api/search/v42/cover','/api/search/cover']){
   const abort=new AbortController(), timer=setTimeout(()=>abort.abort(),route==='/api/search/media/cover'?4900:2400);
   try{
    const res=await fetch(route+'?'+new URLSearchParams({type,q:title,...(alternate?{alternate:'1'}:{})}),{signal:abort.signal,headers:{Accept:'application/json'}});
    if(!res.ok||!(res.headers.get('content-type')||'').includes('json'))continue;
    const data=await res.json();
    if(data?.cover||data?.alternates?.length)return {cover:/^https:\/\//i.test(data.cover||'')?data.cover:'',alternates:Array.isArray(data.alternates)?data.alternates:[]};
    if(route==='/api/search/media/cover')break; // route worked: aliases would repeat the same empty lookup
   }catch{}finally{clearTimeout(timer)}
  }
  // Old workers may not have the cover API. A normal search still carries cover data.
  try{const hit=mediaSearchCache.get(type+':'+title.toLowerCase())||readSearchDisk(type+':'+title.toLowerCase());const rows=hit?.rows||[];const exact=rows.find(x=>x.title?.toLowerCase()===title.toLowerCase()&&x.cover);if(exact)return {cover:exact.cover,alternates:exact.coverFallbacks||[]};}catch{}
  return {cover:'',alternates:[]};
 });
}
// v50: anime artwork is not coupled to search. When the Worker catalog is
// throttled, try the public anime image catalogs independently, in the browser.
// Only use artwork for title-matched results; never show an unrelated cover.
const animeArtworkCache=new Map();
let animeArtworkActive=0;const animeArtworkQueue=[];
function animeArtworkSlot(fn){return new Promise(resolve=>{
 const start=()=>{animeArtworkActive++;Promise.resolve().then(fn).then(resolve,()=>resolve([])).finally(()=>{animeArtworkActive--;animeArtworkQueue.shift()?.()})};
 if(animeArtworkActive<2)start();else animeArtworkQueue.push(start);
})}
async function animeArtworkSources(title){
 const key=artworkKey(title,'anime');if(!key||key.endsWith('|'))return [];
 const previous=animeArtworkCache.get(key);if(previous&&previous.until>Date.now())return previous.value;
 const promise=animeArtworkSlot(async()=>{
  const wanted=key.split('|').slice(1).join('|').replace(/[^a-z0-9]/g,'');
  const match=names=>(names||[]).some(name=>{
   const n=String(name||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
   return n===wanted||(wanted.length>=9&&n.length>=9&&(n.startsWith(wanted)||wanted.startsWith(n)));
  });
  const covers=[],unique=new Set();const push=url=>{const src=catalogCoverSrc(url);if(src&&!unique.has(src)){unique.add(src);covers.push(src)}};
  const read=async(url,opts={})=>{
   const abort=new AbortController(),clock=setTimeout(()=>abort.abort(),3300);
   try{const res=await fetch(url,{...opts,signal:abort.signal});if(!res.ok)return null;return await res.json()}catch{return null}finally{clearTimeout(clock)}
  };
  // Jikan (MyAnimeList), Kitsu and AniList use different media art CDNs.
  const j=await read('https://api.jikan.moe/v4/anime?q='+encodeURIComponent(title)+'&limit=8');
  for(const a of j?.data||[]){if(!match([a.title,a.title_english,a.title_japanese,...(a.title_synonyms||[])]))continue;
   push(a.images?.webp?.large_image_url);push(a.images?.jpg?.large_image_url);push(a.images?.jpg?.image_url);break;}
  if(covers.length<2){
   const k=await read('https://kitsu.io/api/edge/anime?filter[text]='+encodeURIComponent(title)+'&page[limit]=10');
   for(const a of k?.data||[]){const m=a.attributes||{};if(!match([m.canonicalTitle,...Object.values(m.titles||{})]))continue;
    push(m.posterImage?.large);push(m.posterImage?.original);break;}
  }
  if(!covers.length){
   const a=await read('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:'query($q:String!){Page(perPage:10){media(search:$q,type:ANIME,sort:SEARCH_MATCH){title{english romaji native}coverImage{extraLarge large medium}}}}',variables:{q:title}})});
   for(const m of a?.data?.Page?.media||[]){if(!match(Object.values(m.title||{})))continue;
    push(m.coverImage?.extraLarge);push(m.coverImage?.large);push(m.coverImage?.medium);break;}
  }
  return covers.slice(0,6);
 });
 animeArtworkCache.set(key,{value:promise,until:Date.now()+8000});
 const found=await promise;animeArtworkCache.set(key,{value:found,until:Date.now()+(found.length?6*3600000:30000)});
 if(animeArtworkCache.size>180)animeArtworkCache.delete(animeArtworkCache.keys().next().value);
 return found;
}
const coverDetailsCache=new Map();
async function cachedCoverDetails(title,type,refresh=false){
 const key=String(type)+'|'+String(title).trim().toLowerCase(), now=Date.now();
 const previous=coverDetailsCache.get(key);
 if(!refresh&&previous&&previous.expires>now)return previous.value;
 const value=(async()=>{
  const data=await coverLookup(title,type,refresh).catch(()=>({cover:'',alternates:[]}));
  if(type!=='anime'||(data?.cover&&!refresh))return data;
  const additional=await animeArtworkSources(title).catch(()=>[]);
  const distinct=[...(refresh?additional:[]),data?.cover,...(data?.alternates||[]),...(!refresh?additional:[])].filter((url,i,arr)=>url&&arr.indexOf(url)===i);
  return {cover:distinct[0]||'',alternates:distinct.slice(1,8)};
 })();
 coverDetailsCache.set(key,{value,expires:now+2500});
 const data=await value;
 coverDetailsCache.set(key,{value:data,expires:Date.now()+(data?.cover?12*3600000:45000)});
 if(coverDetailsCache.size>180)coverDetailsCache.delete(coverDetailsCache.keys().next().value);
 return data;
}
async function coverForTitle(title,type){return (await cachedCoverDetails(title,type)).cover||''}
// Keep successful image lookups, but expire failures. Earlier builds cached
// empty responses for the entire tab session, making temporary API rate limits
// look like permanently broken artwork.
const coverLookupCache=new Map();
async function cachedCoverForTitle(title,type){
 const key=String(type)+'|'+String(title).trim().toLowerCase(),now=Date.now();
 const existing=coverLookupCache.get(key);
 if(existing&&existing.expires>now)return existing.value;
 const promise=coverForTitle(title,type).catch(()=> '');
 coverLookupCache.set(key,{value:promise,expires:now+2500});
 const src=await promise;
 coverLookupCache.set(key,{value:src||'',expires:Date.now()+(src?24*60*60*1000:20000)});
 if(coverLookupCache.size>200)coverLookupCache.delete(coverLookupCache.keys().next().value);
 return src||'';
}
// Shared artwork for search, homepage recommendations and global activity.
// Store only images which have actually loaded, not missing-cover API responses.
const verifiedArtworkMemory=new Map();
const VERIFIED_ARTWORK_PREFIX='mt_verified_artwork_v46:';
function artworkKey(title,type){return String(type||'').toLowerCase()+'|'+String(title||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function knownArtwork(title,type){
 const key=artworkKey(title,type);if(!key||key.endsWith('|'))return '';
 const memory=verifiedArtworkMemory.get(key);
 if(memory&&Date.now()-memory.at<30*86400000)return memory.url;
 try{const disk=JSON.parse(localStorage.getItem(VERIFIED_ARTWORK_PREFIX+key)||'null');if(disk?.url&&Date.now()-disk.at<30*86400000){verifiedArtworkMemory.set(key,disk);return disk.url}}catch{}
 return '';
}
let homeArtworkRefreshTimer=null;
function refreshHomepageFromKnownArtwork(){
 if(state.view!=='home')return;
 // Recovered artwork in Global Recents is authoritative. Don't leave a
 // medium tile full of stale/broken URLs just because it already has 3 items.
 for(const [key,types] of Object.entries(MEDIUM_SHOWCASE_TYPES)){
  const existing=mediumShowcaseState[key]?.items||[];
  const confirmed=homepageLoggedPicks(types,24).filter(x=>knownArtwork(x.title,x.type));
  const ids=new Set(),next=[];
  for(const item of [...confirmed,...existing]){
   const id=artworkKey(item.title,item.type);if(ids.has(id)||next.length>=3)continue;
   ids.add(id);next.push({...item,cover:knownArtwork(item.title,item.type)||item.cover});
  }
  const previous=existing.map(x=>artworkKey(x.title,x.type)+':'+(x.cover||''));
  const fresh=next.map(x=>artworkKey(x.title,x.type)+':'+(x.cover||''));
  if(previous.join('|')!==fresh.join('|')){
   mediumShowcaseState[key]={items:next,offset:0};renderMediumShowcase(key);
  }
 }
 const root=$('#featuredMedia');if(!root||root.dataset.loaded!=='1')return;
 const featured=[...root.querySelectorAll('.niche-art img')];
 const loaded=featured.filter(img=>img.complete&&img.naturalWidth>0).length;
 const confirmed=homepageLoggedPicks(null,36).filter(x=>knownArtwork(x.title,x.type)).length;
 if(loaded<6&&confirmed>loaded){
  root.innerHTML=`<div class="niche-grid">${homepageFeaturedPicks().map(homepageFeaturedCard).join('')}</div>`;
  void loadPickCovers(root);
 }
}
function saveVerifiedArtwork(title,type,url){
 const src=catalogCoverSrc(url);const key=artworkKey(title,type);
 if(!src||!key||key.endsWith('|'))return;
 const previous=verifiedArtworkMemory.get(key);
 // Repainting a poster from the same known image must not cause a new render
 // (which would fire onload again and create a refresh loop).
 if(previous?.url===src&&Date.now()-previous.at<86400000)return;
 const value={url:src,at:Date.now()};verifiedArtworkMemory.set(key,value);
 try{localStorage.setItem(VERIFIED_ARTWORK_PREFIX+key,JSON.stringify(value))}catch{}
 if(verifiedArtworkMemory.size>320)verifiedArtworkMemory.delete(verifiedArtworkMemory.keys().next().value);
 if(state.view==='home'&&(!previous||previous.url!==src)){
  clearTimeout(homeArtworkRefreshTimer);
  homeArtworkRefreshTimer=setTimeout(refreshHomepageFromKnownArtwork,1150);
 }
}
function recordCoverLoaded(img){
 if(img?.naturalWidth>0&&img?.naturalHeight>0)saveVerifiedArtwork(img.dataset.artworkTitle||img.alt||'',img.dataset.mediaType||'',img.currentSrc||img.src);
}
async function sharedCoverForTitle(title,type){
 const remembered=knownArtwork(title,type);if(remembered)return remembered;
 // A result already obtained by the working search system can supply art.
 const fromVisible=(state.results||[]).find(x=>x.mediaType===type&&artworkKey(x.title,type)===artworkKey(title,type)&&x.cover);
 if(fromVisible?.cover)return catalogCoverSrc(fromVisible.cover);
 // The global feed already carries the stored cover URL. The homepage must
 // reuse that successful source instead of always triggering a new API search.
 const fromFeed=(state.feed||[]).find(x=>x.mediaType===type&&artworkKey(x.title,type)===artworkKey(title,type)&&x.cover);
 if(fromFeed?.cover)return catalogCoverSrc(fromFeed.cover);
 return cachedCoverForTitle(title,type);
}
// Preload without swapping out an existing placeholder until there is a real image.
// Try direct URLs then the existing Worker proxy; neither should block search.
function testedImage(url){return new Promise(resolve=>{
 const candidates=[catalogCoverSrc(url),catalogCoverProxy(url),catalogCoverProxy(url,true)].filter(Boolean);
 let idx=0;const tryNext=()=>{
  if(idx>=candidates.length)return resolve('');
  const src=candidates[idx++];const img=new Image();const timer=setTimeout(()=>{img.onload=null;img.onerror=null;tryNext()},3900);
  img.onload=()=>{clearTimeout(timer);resolve(img.naturalWidth&&img.naturalHeight?src:'')};
  img.onerror=()=>{clearTimeout(timer);tryNext()};img.referrerPolicy='no-referrer';img.src=src;
 };tryNext();
})}
async function loadPickCovers(scope=document){
 // Do not skip homepage artwork because the visitor previously used header search.
 const nodes=[...scope.querySelectorAll('[data-pick-title][data-pick-type]')];let cursor=0;
 // Keep the external catalog requests throttled; sending 50 at once makes APIs
 // rate-limit and leaves many recommendation covers blank.
 const worker=async()=>{while(cursor<nodes.length){const node=nodes[cursor++];if(!node.isConnected||node.querySelector('img'))continue;const title=node.dataset.pickTitle,type=node.dataset.pickType;if(!title||!type)continue;let src=catalogCoverSrc(node.dataset.pickCover||'');if(!src)try{src=await sharedCoverForTitle(title,type)}catch{}
  if(!node.isConnected)continue;
  if(src){const img=document.createElement('img');img.alt=title;img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';img.style.cssText='width:100%;height:100%;object-fit:contain;object-position:center;display:block';img.dataset.mediaType=type;img.dataset.artworkTitle=title;img.dataset.coverOriginal=src;img.dataset.coverAlternates='[]';img.onload=()=>recordCoverLoaded(img);img.onerror=()=>{mediaCoverError(img);if(!node.querySelector('img')&&!node.querySelector('span'))node.innerHTML=`<span title="${esc(title)}">${TYPES[type]?.icon||ico('spark')}</span>`};img.src=src;node.replaceChildren(img)}
  else if(node.dataset.coverRetryScheduled!=='1'){
   // Refresh a temporarily missing decorative image once after provider
   // cooldown. Do not run an endless interval that exhausts API quotas.
   node.dataset.coverRetryScheduled='1';
   setTimeout(async()=>{
    if(!node.isConnected||document.hidden)return;
    const recovered=await sharedCoverForTitle(title,type).catch(()=> '');
    if(!node.isConnected||!recovered||node.querySelector('img'))return;
    const poster=document.createElement('img');poster.alt=title;poster.loading='lazy';poster.decoding='async';poster.referrerPolicy='no-referrer';poster.style.cssText='width:100%;height:100%;object-fit:contain;object-position:center;display:block';poster.dataset.mediaType=type;poster.dataset.artworkTitle=title;poster.dataset.coverOriginal=recovered;poster.dataset.coverAlternates='[]';poster.onload=()=>recordCoverLoaded(poster);poster.onerror=()=>mediaCoverError(poster);poster.src=recovered;node.replaceChildren(poster);
   },25000);
  }
 }};
 await Promise.all(Array.from({length:Math.min(3,nodes.length)},worker));
}
// Explore-by-medium cards use randomly chosen catalog titles, but only render an item
// after a real cover image successfully loads. The sets reshuffle on every page load
// and rotate to the next covers while the homepage remains open.
const MEDIUM_SHOWCASE_TYPES={
 animanga:['anime','manga'],
 filmstv:['film','tv'],
 books:['novel','light-novel','webnovel','comic'],
 discover:['anime','manga','film','tv','novel','light-novel','webnovel','comic','game','visual-novel']
};
const mediumShowcaseState={};
let mediumShowcaseTimer=null;
function mediumShuffle(items){return items.slice();}
// Reuse covers already available on Global Recents. This avoids forcing four
// homepage categories to each call several unreliable third-party APIs.
function homepageLoggedPicks(types=null,limit=20){
 const result=[],seen=new Set();
 for(const entry of state.feed||[]){
  const type=entry.mediaType,title=String(entry.title||'').trim();
  if(!TYPES[type]||type==='all'||(types&&!types.includes(type))||!title)continue;
  if(/(?:hentai|18\+|\bnsfw\b)/i.test(title))continue;
  const key=artworkKey(title,type);if(seen.has(key))continue;
  const verified=knownArtwork(title,type);
  const cover=catalogCoverSrc(verified||entry.cover||'');
  if(!cover)continue;
  seen.add(key);result.push({title,type,cover,verified:!!verified,desc:'Recently logged on MediaTok'});
 }
 // Verified image URLs should win over a broken link to a recent log.
 result.sort((a,b)=>Number(b.verified)-Number(a.verified));
 return result.slice(0,limit);
}
function homepageFeaturedCard(item,i){
 const title=String(item.title||''),type=String(item.type||'anime');
 const cover=catalogCoverSrc(item.cover||knownArtwork(title,type)||'');
 const callTitle=encodeURIComponent(title).replace(/'/g,'%27');
 const callType=encodeURIComponent(type).replace(/'/g,'%27');
 return `<article class="niche-card" id="home-card-${i}"><div class="niche-art mt-tap-poster" id="home-pick-${i}" data-pick-title="${esc(title)}" data-pick-type="${esc(type)}" data-pick-cover="${esc(cover)}" role="button" tabindex="0" aria-label="Open ${esc(title)} details" onclick="openSiteMediaDetails(decodeURIComponent('${callType}'),decodeURIComponent('${callTitle}'),this.dataset.pickCover)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}">${cover?`<img src="${esc(cover)}" alt="${esc(title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-artwork-title="${esc(title)}" data-media-type="${esc(type)}" data-cover-original="${esc(cover)}" data-cover-alternates="[]" onload="recordCoverLoaded(this)" onerror="mediaCoverError(this)">`:`<span>${TYPES[type]?.icon||ico('spark')}</span>`}</div><div class="niche-info"><div class="tile-title" title="${esc(title)}">${esc(title)}</div><div class="tile-meta">${esc(item.desc||TYPES[type]?.label||type)}</div><span class="mt-tap-hint">Open artwork to see details ${ico('arrow')}</span></div></article>`;
}
function homepageFeaturedPicks(){
 const logged=homepageLoggedPicks(null,6),seen=new Set(logged.map(x=>artworkKey(x.title,x.type)));
 // A Global Recents item can have no saved URL even though its image is
 // recovered later. Keep the title in the homepage's own artwork queue.
 for(const entry of state.feed||[]){
  if(logged.length>=6)break;
  const title=String(entry.title||'').trim(),type=entry.mediaType;
  if(!title||!TYPES[type]||type==='all')continue;
  const key=artworkKey(title,type);if(seen.has(key))continue;
  seen.add(key);logged.push({title,type,cover:knownArtwork(title,type)||catalogCoverSrc(entry.cover||''),desc:'Recently logged on MediaTok'});
 }

 const picks=['anime','manga','film','tv','novel','game'].flatMap(type=>(NICHE_PICKS[type]||[]).slice(0,1).map(([title,t,desc])=>({title,type:t||type,desc})));
 for(const item of picks){if(logged.length>=6)break;const key=artworkKey(item.title,item.type);if(!seen.has(key)){logged.push(item);seen.add(key)}}
 return logged.slice(0,6);
}
async function mediumImageLoads(src){return await testedImage(src);}
function renderMediumShowcase(key){
 const root=$('#medium-showcase-'+key),data=mediumShowcaseState[key];if(!root||!data)return;
 const items=(data.items||[]).slice(0,3);
 root.innerHTML=items.map(item=>`<span class="medium-poster mt-tap-poster" role="button" tabindex="0" title="Open ${esc(item.title)} details" onclick="event.stopPropagation();openSiteMediaDetails(this.dataset.mediaType,this.dataset.mediaTitle,this.dataset.mediaCover)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();this.click()}" data-media-type="${esc(item.type)}" data-media-title="${esc(item.title)}" data-media-cover="${esc(item.cover)}"><img src="${esc(item.displayCover||catalogCoverSrc(item.cover))}" alt="${esc(item.title)}" data-artwork-title="${esc(item.title)}" data-media-type="${esc(item.type)}" data-cover-original="${esc(item.cover)}" data-cover-alternates="[]" loading="lazy" decoding="async" referrerpolicy="no-referrer" onload="recordCoverLoaded(this)" onerror="mediaCoverError(this)"></span>`).join('');
}
async function loadOneMediumShowcase(key){
 const root=$('#medium-showcase-'+key);if(!root)return;
 const types=MEDIUM_SHOWCASE_TYPES[key]||MEDIUM_SHOWCASE_TYPES.discover;
 const already=mediumShowcaseState[key]?.items||[];
 const seen=new Set(already.map(x=>artworkKey(x.title,x.type)));
 const found=already.slice();
 for(const item of homepageLoggedPicks(types,12)){
  if(found.length>=3)break;
  const id=artworkKey(item.title,item.type);if(seen.has(id))continue;
  seen.add(id);found.push(item);
 }
 mediumShowcaseState[key]={items:found.slice(0,3),offset:0};renderMediumShowcase(key);
 // A known, working community cover is sufficient to render this category.
 // Do not fire additional catalog calls on every homepage view just to fill decorative slots.
 if(found.length>0)return;
 // v52: Request only the missing posters. Do not preload each picture through
 // three 3.9-second proxy probes before showing it. The <img> has onerror recovery.
 const pool=Object.entries(NICHE_PICKS).filter(([type])=>types.includes(type))
  .flatMap(([type,items])=>items.slice(0,5).map(([title,t,desc])=>({title,type:t||type,desc})))
  .filter(item=>!seen.has(artworkKey(item.title,item.type))).slice(0,9);
 let cursor=0;
 const load=async()=>{
  while(root.isConnected&&state.view==='home'&&found.length<3&&cursor<pool.length){
   const item=pool[cursor++],id=artworkKey(item.title,item.type);
   if(seen.has(id))continue;
   seen.add(id);
   const cover=await sharedCoverForTitle(item.title,item.type).catch(()=>'');
   if(!cover||!root.isConnected||state.view!=='home'||found.length>=3)continue;
   found.push({...item,cover});
   mediumShowcaseState[key]={items:found.slice(0,3),offset:0};renderMediumShowcase(key);
  }
 };
 await Promise.all([load(),load()]);
}
function startMediumShowcases(){
 if(mediumShowcaseTimer)clearTimeout(mediumShowcaseTimer);
 for(const key of Object.keys(MEDIUM_SHOWCASE_TYPES)){
  delete mediumShowcaseState[key];
  mediumShowcaseState[key]={items:homepageLoggedPicks(MEDIUM_SHOWCASE_TYPES[key],3),offset:0};
  renderMediumShowcase(key);
 }
 // All sections can fill independently: one slow title no longer holds the rest.
 const keys=Object.keys(MEDIUM_SHOWCASE_TYPES);
 for(const [index,key] of keys.entries())setTimeout(()=>{
  if(state.view==='home')void loadOneMediumShowcase(key).catch(()=>{});
 },120*index);
}
function homePage(){const stats=state.me?.stats||{};return `<section class="welcome"><div class="eyebrow">Your personal media universe</div><h1>${state.me?`Welcome back, ${esc(state.me.globalName||state.me.name)}`:'Everything you love. One profile.'}</h1><p>${state.me?'Pick up where you left off, add a new entry, or see what everyone has been enjoying lately.':'Track anime, manga, films, TV, novels, comics and games in one clean, customizable space.'}</p><div style="display:flex;gap:9px;flex-wrap:wrap"><button class="btn primary" onclick="goView('discover')">${ico('plus')} Log something</button>${state.me?`<button class="btn white" onclick="location.href='${userLink(state.me.name)}'">View my profile</button>`:`<button class="btn white" onclick="login()">Sign in</button>`}</div></section>${state.me?`<div class="stats">${[[TYPES.anime.icon,'Anime',stats.anime],[TYPES.manga.icon,'Manga',stats.manga],[TYPES.film.icon,'Films',stats.film],[TYPES.tv.icon,'TV shows',stats.tv]].map(([i,l,n])=>`<div class="stat"><div class="miniicon">${i}</div><div class="n">${n||0}</div><div class="label">${l} logged</div></div>`).join('')}</div>`:''}<div class="section-head"><h2>From the community & niche picks</h2><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><button class="textbtn" onclick="rotateFeatured()">Rotate medium ${ico('refresh')}</button><button class="textbtn" onclick="goView('discover')">Explore all media ${ico('arrow')}</button></div></div><section class="card"><p class="page-desc" style="margin-bottom:8px">Artwork from recently logged media appears here first, with curated recommendations when the community feed has fewer titles.</p><div id="featuredMedia">${pickCards('anime',6)}</div><p class="sub" style="margin:12px 0 0">Browse recent community titles and curated recommendations across media. Images are shared with Global Recents.</p></section><div class="section-head"><h2>Explore by medium</h2><span class="sub">Choose what you want to log</span></div><div class="media-grid">${[['animanga',ico('play'),'Animanga','Anime, manga & light novels'],['filmstv',ico('film'),'Films & TV','Movies and series'],['books',ico('book'),'Books & comics','Novels, comics & more'],['discover',ico('grid'),'All media','Search every category']].map(([v,i,t,d])=>`<button class="media-tile" style="text-align:left;cursor:pointer;padding:0" onclick="goView('${v}')"><div class="medium-showcase" id="medium-showcase-${v}" aria-label="Rotating ${t} covers"></div><div class="tile-info"><div class="tile-title">${t}</div><div class="tile-meta">${d}</div><span class="textbtn">Explore ${ico('arrow')}</span></div></button>`).join('')}</div>`}
function renderFeed(logs){if(!logs?.length)return `<div class="empty"><div class="emoji">${ico('spark')}</div><b>No activity yet</b><p>When people start logging media, their latest entries will appear here.</p><button class="btn light" onclick="goView('discover')">Find something to log</button></div>`;return logs.map(l=>`<article class="activity" id="log-${l.id}"><div class="activity-top">${avatar({name:l.user?.name,avc:l.user?.avatar||l.user?.avc},32)}<div><a class="activity-user" href="${userLink(l.user?.name)}">${esc(l.user?.name||'member')}</a><div class="sub">logged a ${esc(TYPES[l.mediaType]?.label?.toLowerCase()||l.mediaType)}</div></div><span class="activity-time">${timeAgo(l.updatedAt)}</span></div><div class="activity-body" onclick="if(event.target.closest('.activity-cover'))openFeedMediaDetails(this.querySelector('.activity-media-detail'))" onkeydown="if(event.target.closest('.activity-cover')&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openFeedMediaDetails(this.querySelector('.activity-media-detail'))}">${l.cover?`<img class="activity-cover" role="button" tabindex="0" src="${esc(catalogCoverSrc(l.cover))}" alt="${esc(l.title)}" data-artwork-title="${esc(l.title)}" data-media-type="${esc(l.mediaType||'anime')}" loading="eager" onload="recordCoverLoaded(this)" onerror="activityCoverFailed(this)">`:`<div class="activity-cover activity-cover-missing" role="button" tabindex="0" data-film-title="${esc(l.title)}" data-film-year="${esc(l.year||'')}" data-media-type="${esc(l.mediaType||'film')}" style="display:grid;place-items:center;font-size:26px">${TYPES[l.mediaType]?.icon||ico('spark')}</div>`}<div class="activity-content"><span class="pill">${esc(l.status)}</span><h3 class="activity-title"><button class="activity-media-detail" data-media-type="${esc(l.mediaType)}" data-media-title="${esc(l.title)}" data-media-cover="${esc(l.cover||'')}" data-media-year="${esc(l.year||'')}" data-media-key="${esc(l.mediaKey||'')}" onclick="openFeedMediaDetails(this)">${esc(l.title)}</button></h3><div class="activity-meta">${esc(TYPES[l.mediaType]?.label||l.mediaType)} ${l.year?'· '+esc(l.year):''}${l.progress?` · Progress ${Number(l.progress)}`:''}${l.rating!==null&&l.rating!==undefined?` · ${STAR} ${Number(l.rating).toFixed(1)}/10`:''}</div>${l.note?`<p class="activity-note">${esc(l.note)}</p>`:''}<div class="activity-actions"><button class="textbtn" onclick="toggleComments(${l.id})">${ico('chat')} ${l.commentCount||0} comments</button>${state.me&&state.me.name===l.user?.name?`<button class="textbtn" onclick="deleteLog(${l.id})">Remove</button>`:''}</div></div></div><div id="comments-${l.id}" class="comments ${state.commentOpen[l.id]?'':'hidden'}">${state.commentOpen[l.id]?renderComments(l.id):''}</div></article>`).join('')}
function renderComments(id){const list=state.comments[id]||[];return `${list.map(c=>`<div class="comment">${avatar({name:c.user?.name,avc:c.user?.avatar},27)}<div class="comment-body"><b>${esc(c.user?.name||'member')}</b><span class="sub">${timeAgo(c.createdAt)}</span><div>${esc(c.body)}</div></div></div>`).join('')}${state.me?`<div class="comment-form"><input class="field" id="comment-input-${id}" placeholder="Write a comment…" maxlength="1000" onkeydown="if(event.key==='Enter')postComment(${id})"><button class="btn primary small" onclick="postComment(${id})">Send</button></div>`:`<div class="sub" style="padding:8px 0">Sign in with Discord to comment.</div>`}`}
async function loadFeatured(){
 const root=$('#featuredMedia');if(!root||root.dataset.loaded==='1')return;
 root.dataset.loaded='1';
 const picks=homepageFeaturedPicks();
 root.innerHTML=`<div class="niche-grid">${picks.map(homepageFeaturedCard).join('')}</div>`;
 // Only cards without a known image need an external catalog lookup.
 void loadPickCovers(root);
}
function quickAddFeatured(i){const item=state.featured?.[i];if(!item)return;state.type=item.type;state.results=[item];openLog(0)}
function renderMemberResults(){
 if(!state.memberResults?.length)return '';
 return `<div class="member-heading">Members matching your search</div><div class="member-grid">${state.memberResults.map(u=>`<a class="member-result" href="${userLink(u.name)}">${leaderboardAvatar({name:u.name,avatar:u.avatar,avatarFallback:u.avatarFallback},42,'avatar')}<div class="member-copy"><strong>${esc(u.globalName||u.name)}</strong><span>@${esc(u.name)}${u.bio?' · '+esc(u.bio):''}</span></div>${ico('arrow')}</a>`).join('')}</div>`;
}
let globalSearchTimer;
function queueGlobalSearch(value){
 clearTimeout(globalSearchTimer);if(mediaSearchAbort)mediaSearchAbort.abort();state.search=String(value||'').trim();
 if(!state.search){state.memberResults=[];state.results=[];if(['discover','animanga','filmstv','books'].includes(state.view))render();return;}
 // Live search on the discovery page without interrupting typing elsewhere.
 if(state.search.length>=2&&['discover','animanga','filmstv','books'].includes(state.view))globalSearchTimer=setTimeout(()=>searchMedia(),360);
}
async function runGlobalSearch(){
 clearTimeout(globalSearchTimer);
 const q=($('#globalSearchInput')?.value||'').trim();if(!q)return toast('Enter a title or username.');
 state.search=q;
 state.type='all'; // Header search covers every medium by default.
 if(state.view!=='discover'){state.view='discover';state.profile=null;history.pushState({},'','/');}
 await render();
 await searchMedia();
}
async function searchMembers(query,seq){
 if(query.length<2){state.memberResults=[];const e=$('#memberSearchResults');if(e)e.innerHTML='';return;}
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3500);
 try{
  const r=await fetch('/api/search/users?q='+encodeURIComponent(query),{headers:{Accept:'application/json'},signal:controller.signal});
  if(!r.ok||!(r.headers.get('content-type')||'').includes('json'))throw new Error('Member search API unavailable');
  const data=await r.json();if(seq!==mediaSearchSequence||state.search!==query)return;
  state.memberResults=Array.isArray(data.results)?data.results:[];
  const el=$('#memberSearchResults');if(el)el.innerHTML=renderMemberResults();
 }catch(e){if(seq===mediaSearchSequence){state.memberResults=[];const el=$('#memberSearchResults');if(el)el.innerHTML='';console.warn('Member lookup failed:',e);}}
 finally{clearTimeout(timer)}
}
let webnovelBrowseOffset=0,webnovelBrowseQuery='',webnovelBrowseGeneration=0,webnovelFilterTimer=null;
function filterWebnovelDirectory(value){
 webnovelBrowseQuery=String(value||'').slice(0,100);clearTimeout(webnovelFilterTimer);
 webnovelFilterTimer=setTimeout(()=>void browseMoreWebnovels(true),220);
}
async function browseMoreWebnovels(reset=false){
 const root=$('#mt-webnovel-browse');if(!root)return;
 if(reset){webnovelBrowseOffset=0;root.innerHTML='';}
 const offset=webnovelBrowseOffset,query=webnovelBrowseQuery,gen=++webnovelBrowseGeneration;
 const button=$('#mt-webnovel-more');if(button){button.disabled=true;button.hidden=true;}
 const status=$('#mt-webnovel-directory-status');if(status)status.textContent='Loading webnovels…';
 let rows=[],hasMore=false,total=0,source='Offline starter titles';
 try{
  const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),10500);
  try{
   const response=await fetch('/api/webnovels/browse?'+new URLSearchParams({offset,limit:36,q:query}),
    {signal:abort.signal,headers:{Accept:'application/json'}});
   if(!response.ok||!(response.headers.get('content-type')||'').includes('json'))throw Error('Webnovel directory unavailable');
   const data=await response.json();rows=Array.isArray(data.results)?data.results:[];
   hasMore=!!data.hasMore;total=Number(data.total)||0;source=String(data.source||'MediaTok catalog');
  }finally{clearTimeout(timer)}
 }catch{
  if(offset===0&&!query){rows=WEBNOVEL_RECOMMENDATIONS.map(title=>({title,mediaType:'webnovel'}));total=rows.length;}
  source='Offline starter titles';
 }
 if(gen!==webnovelBrowseGeneration||!root.isConnected)return;
 if(rows.length){
  root.insertAdjacentHTML('beforeend',rows.map(r=>{
   const title=String(r.title||''),encoded=encodeURIComponent(title).replace(/'/g,'%27');
   const cover=String(r.cover||'');
   const poster=/^https:\/\/[^\s]+$/i.test(cover)?`<img src="${esc(cover)}" loading="lazy" referrerpolicy="no-referrer" alt="" onerror="this.remove()">`:'';
   return `<button class="webnovel-browse-title" type="button" onclick="searchPick('webnovel',decodeURIComponent('${encoded}'))">${poster}<span class="webnovel-browse-info"><strong>${esc(title)}</strong>${r.creator?`<small>${esc(r.creator)}</small>`:''}</span>${ico('arrow')}</button>`;
  }).join(''));
 }
 webnovelBrowseOffset=offset+rows.length;
 if(button){button.hidden=!hasMore;button.disabled=false;}
 if(status)status.textContent=total?`${total.toLocaleString()} ${query?'matching ':''}webnovels · ${source}`:(query?'No matching titles. Try the main search bar.':'No directory entries are available right now.');
}
function discoverPage(){const types=state.view==='animanga'?['anime','manga','light-novel']:state.view==='filmstv'?['film','tv']:state.view==='books'?['novel','light-novel','webnovel','comic']:['all','anime','manga','film','tv','novel','light-novel','webnovel','comic','game','visual-novel'];state.type=types.includes(state.type)?state.type:types[0];const picks=NICHE_PICKS[state.type]||NICHE_PICKS.anime;const emptyContent=state.results.length?renderResults():state.search?'<div class="loading" role="status">Search for a title or member above.</div>':`<section class="card" style="grid-column:1/-1"><div class="section-head" style="margin-top:0"><div><h2>Hand-picked for the MediaTok crowd</h2><div class="sub">Not just the biggest hits — oddities, cult favorites, and stories with something to say.</div></div></div>${pickCards(state.type,6)}</section>`;return shell(`<div class="eyebrow">Build your collection</div><h1 class="page-title">${state.view==='animanga'?'Animanga':state.view==='filmstv'?'Films & TV':state.view==='books'?'Books & comics':'Discover media'}</h1><p class="page-desc">Search for a title, open its cover, and add it to your personal log. Your entries show up on your profile and in the community feed.</p><div class="tabs">${types.map(k=>`<button class="tab ${state.type===k?'active':''}" onclick="setType('${k}')">${TYPES[k].icon} ${TYPES[k].label}</button>`).join('')}</div><div class="search-context">${ico('search')} Use the search bar above to find ${TYPES[state.type]?.label.toLowerCase()||'media'} and members. Switch categories to search another catalog.</div><section id="memberSearchResults" aria-live="polite">${renderMemberResults()}</section><div id="searchMessage" class="sub" style="margin:0 0 12px">${state.results.length?`${state.results.length} results. Select a title to log it.`:'Explore niche recommendations below, or search any title.'}</div><div class="search-results" id="searchResults">${emptyContent}</div>${state.type==='webnovel'&&!state.search?`<section class="card mt-webnovels-directory"><h2>Browse webnovels</h2><p class="sub">Browse thousands of web serials and translated novels, or search a specific title. The displayed total reflects the actual loaded catalog.</p><input class="input" id="mt-webnovel-filter" type="search" placeholder="Filter the webnovel directory…" oninput="filterWebnovelDirectory(this.value)" autocomplete="off" aria-label="Filter webnovel directory" style="width:100%;margin-top:10px"><p class="sub" id="mt-webnovel-directory-status" role="status">Loading the webnovel catalog…</p><div id="mt-webnovel-browse" class="mt-webnovel-browse"></div><button id="mt-webnovel-more" class="btn white" type="button" hidden onclick="browseMoreWebnovels()">Load more webnovels</button></section>`:''}`)}
async function openSiteMediaDetails(mediaType,title,cover='',year='',extra={}){const type=TYPES[mediaType]?mediaType:(TYPES[state.type]?state.type:'anime');const item={...extra,key:extra.mediaKey||`${type}:${String(title||'').toLowerCase()}`,title:String(title||''),cover:cover||'',year:year||'',mediaType:type,subtitle:extra.subtitle||TYPES[type]?.label||type};state.type=type;state.results=[item];await openMediaDetails(0)}
async function prepareMediaCollectionAction(i){const r=state.results[i];if(!r)return;if(!state.me){login();return}state.editingLog=null;try{const rows=await api('/api/logs?user='+encodeURIComponent(state.me.name));const key=r.key||`${state.type}:${String(r.title||'').toLowerCase()}`;state.editingLog=(Array.isArray(rows)?rows:[]).find(l=>(l.mediaKey&&l.mediaKey===key)||(l.mediaType===state.type&&String(l.title).toLowerCase()===String(r.title).toLowerCase()))||null;}catch(e){state.editingLog=null}closeModal();state.logTarget=r;openLog(i)}
function mediaCoverError(img){
 const original=img.dataset.coverOriginal||img.currentSrc||img.src;
 let alternates=[];try{alternates=JSON.parse(img.dataset.coverAlternates||'[]')}catch{}
 const source=[original,...alternates].filter(x=>/^https:\/\//i.test(String(x||'')));
 const choices=[],seen=new Set();
 for(const url of source){for(const next of [url,catalogCoverProxy(url),catalogCoverProxy(url,true)]){if(next&&!seen.has(next)){seen.add(next);choices.push(next)}}}
 // First attempt is the proxied primary image; on error try its direct URL,
 // then the alternate artwork via proxy/direct. No 404 is cached in the proxy.
 const step=Number(img.dataset.coverStep||0)+1;
 img.dataset.coverStep=String(step);
 if(step<choices.length){img.src=choices[step];return;}
 if(!img.dataset.coverResolved){
  img.dataset.coverResolved='1';
  const title=img.alt?.replace(/^Cover for /,'')||'',type=img.dataset.mediaType||state.type;
  void cachedCoverDetails(title,type,true).then(data=>{
   if(!img.isConnected)return;
   const already=new Set(source),extra=[data.cover,...(data.alternates||[])].filter(x=>x&&!already.has(x));
   if(extra.length){img.dataset.coverOriginal=extra[0];img.dataset.coverAlternates=JSON.stringify(extra.slice(1));img.dataset.coverStep='0';img.src=extra[0];}
   else scheduleCoverImageRetry(img,title,type);
  }).catch(()=>scheduleCoverImageRetry(img,title,type));
  return;
 }
 removeBrokenCover(img);
}
function scheduleCoverImageRetry(img,title,type){
 if(!img?.isConnected)return;
 if(img.dataset.coverRetry==='1'||document.hidden){removeBrokenCover(img);return;}
 img.dataset.coverRetry='1';
 setTimeout(async()=>{
  if(!img.isConnected)return;
  const data=await cachedCoverDetails(title,type,true).catch(()=>({cover:'',alternates:[]}));
  if(!img.isConnected)return;
  const previous=img.dataset.coverOriginal||'';
  const extra=[data.cover,...(data.alternates||[])].filter(x=>x&&x!==previous&&/^https:\/\//i.test(x));
  if(extra.length){img.dataset.coverOriginal=extra[0];img.dataset.coverAlternates=JSON.stringify(extra.slice(1));img.dataset.coverStep='0';img.src=extra[0];}
  else removeBrokenCover(img);
 },12000);
}
function removeBrokenCover(img){
 if(img?.dataset?.artworkTitle){verifiedArtworkMemory.delete(artworkKey(img.dataset.artworkTitle,img.dataset.mediaType));try{localStorage.removeItem(VERIFIED_ARTWORK_PREFIX+artworkKey(img.dataset.artworkTitle,img.dataset.mediaType))}catch{}}
 // Do not render a misleading generic icon where no genuine artwork exists.
 img.onerror=null;
 const parent=img.closest('.result,.md-hero,.niche-art,.pf-frame,.medium-poster');
 if(parent?.classList.contains('result'))parent.classList.add('without-cover');
 img.remove();
}
function catalogCoverSrc(source){
 // Browsers can display catalog HTTPS images without requiring MediaTok's Worker image route.
 // Always try the original first; only fall back to the proxy if image loading fails.
 try{const url=new URL(String(source||''));if(url.protocol!=='https:')return '';if(url.hostname==='covers.openlibrary.org'&&!url.searchParams.has('default'))url.searchParams.set('default','false');return url.href}catch{return ''}
}
function catalogCoverProxy(source,legacy=false){
 const src=catalogCoverSrc(source);if(!src)return '';
 return (legacy?'/api/search/v42/image?':'/api/catalog-image?')+new URLSearchParams({url:src});
}
function mediaPoster(r,type){
 const src=String(r.cover||knownArtwork(r.title,type)||'').trim();
 if(!/^https:\/\//i.test(src))return ``;
 const alt=JSON.stringify((Array.isArray(r.coverFallbacks)?r.coverFallbacks:[]).filter(x=>typeof x==='string'&&/^https:\/\//i.test(x)).slice(0,4));
 return `<img class="cover" src="${esc(catalogCoverSrc(src))}" alt="${esc(r.title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-media-type="${esc(type)}" data-artwork-title="${esc(r.title)}" onload="recordCoverLoaded(this)" data-cover-original="${esc(catalogCoverSrc(src))}" data-cover-alternates="${esc(alt)}" onerror="mediaCoverError(this)">`;
}
function resultMarkup(r,i){const type=TYPES[r.mediaType]?r.mediaType:state.type;
return `<div data-cover-result-index="${i}" class="result media-result ${r.cover?'':'without-cover'}" role="button" tabindex="0" onclick="openMediaDetails(${i})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMediaDetails(${i})}">${mediaPoster(r,type)}<div class="result-text"><div class="result-title">${esc(r.title)}</div><div class="result-desc">${esc(TYPES[type]?.label||type)} · ${esc(r.year||'Year unknown')}${r.subtitle?' · '+esc(r.subtitle):''}</div><div class="result-actions"><button class="btn primary small" onclick="event.stopPropagation();state.type='${type}';state.logTarget=state.results[${i}];openLog(${i})">Add to collection</button></div></div></div>`}
function renderResults(){return state.results.map(resultMarkup).join('')}
// Artwork loading is intentionally separate from search. The v44 local index
// has real titles but no images; search should not wait for artwork APIs.
async function hydrateResultArtwork(container,rows,sequence){
 if(!container?.isConnected)return;
 const missing=rows.map((row,i)=>({row,i})).filter(({row})=>{
  if(!row?.title)return false;
  const type=TYPES[row.mediaType]&&row.mediaType!=='all'?row.mediaType:(state.type!=='all'?state.type:'');
  if(!type)return false;
  row.mediaType=type;
  return !(row.cover||knownArtwork(row.title,type));
 }).slice(0,30);
 let next=0;
 const runner=async()=>{while(next<missing.length){
  const {row,i}=missing[next++];
  if(sequence!==mediaSearchSequence||!container.isConnected||!row.title)continue;
  const data=await cachedCoverDetails(row.title,row.mediaType).catch(()=>null);
  if(sequence!==mediaSearchSequence||!container.isConnected||state.results[i]!==row||!data?.cover)continue;
  const card=container.querySelector(`[data-cover-result-index="${i}"]`);
  if(!card||card.querySelector('img.cover'))continue;
  row.cover=data.cover;
  row.coverFallbacks=data.alternates||[];
  const image=document.createElement('img');
  image.className='cover';image.alt=row.title;image.loading='lazy';image.decoding='async';
  image.referrerPolicy='no-referrer';image.dataset.mediaType=row.mediaType;image.dataset.artworkTitle=row.title;image.onload=()=>recordCoverLoaded(image);
  image.dataset.coverOriginal=data.cover;image.dataset.coverAlternates=JSON.stringify(data.alternates||[]);
  image.onerror=()=>mediaCoverError(image);
  card.prepend(image);card.classList.remove('without-cover');image.src=data.cover;
 }};
 await Promise.all(Array.from({length:Math.min(3,missing.length)},()=>runner()));
}

// A visitor must always be able to record a title, even when every outside
// catalog is down. Custom entries never pretend to be verified catalog hits.
function customMediaEntry(){
 const q=state.search.trim();if(!q)return '';
 return `<div class="mt-custom-entry"><span>Can't find your title?</span><button class="btn light small" type="button" onclick="addCustomMedia()">Add “${esc(q)}” manually</button></div>`;
}
function addCustomMedia(){
 if(!state.me){login();return}
 const q=state.search.trim().slice(0,160);
 if(!q)return;
 const type=state.type==='all'?(document.querySelector('#mtCustomMediaType')?.value||'anime'):state.type;
 if(!TYPES[type]||type==='all')return;
 state.type=type;
 state.results=[{key:`custom:${type}:${q.toLowerCase().replace(/\s+/g,'-')}`,title:q,cover:'',mediaType:type,subtitle:'Manually added title',year:''}];
 state.editingLog=null;
 openLog(0);
}


function peopleMarkup(people, label){if(!people?.length)return '';return `<section class="md-section"><div class="md-section-title">${esc(label)}</div><div class="md-people">${people.map(p=>`<div class="md-person">${p.image?`<img src="${esc(p.image)}" alt="Portrait of ${esc(p.name||'cast member')}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='https://ui-avatars.com/api/?name='+encodeURIComponent(this.alt.replace('Portrait of ',''))+'&background=34324f&color=ffffff&size=160&rounded=true&bold=true'">`:`<div class="md-person-placeholder">${ico('user-round')}</div>`}<div class="md-person-name">${esc(p.name||'Unknown')}</div>${p.role?`<div class="md-person-role">${esc(p.role)}</div>`:''}</div>`).join('')}</div></section>`}
function detailCreditMarkup(r){const creators=String(r.creator||'').split(',').map(x=>x.trim()).filter(Boolean);const studios=String(r.studio||'').split(',').map(x=>x.trim()).filter(Boolean);let out='';if(creators.length){const label=['novel','light-novel','comic','manga'].includes(state.type)?'Author':state.type==='game'?'Developer':state.type==='tv'?'Network':'Creator / staff';if(!(state.type==='tv'&&/^tvmaze:/.test(r.key||'')))out+=`<div class="md-credit"><b>${label}</b><span>${creators.map(esc).join(', ')}</span></div>`}if(studios.length)out+=`<div class="md-credit"><b>Studio</b><span>${studios.map(esc).join(', ')}</span></div>`;return out}
async function openMediaDetails(i){const r=state.results[i];if(!r)return;const type=TYPES[r.mediaType]?r.mediaType:state.type;state.type=type;const root=$('#modalRoot');root.innerHTML=`<div class="modal-back mt-media-pop-back" onclick="if(event.target===this)closeModal()"><section class="modal media-detail-modal mt-media-pop" role="dialog" aria-modal="true" aria-label="${esc(r.title)} details"><button class="md-close" onclick="closeModal()" aria-label="Close">${ico('x')}</button><div class="md-hero">${r.cover?`<img class="md-poster" src="${esc(r.cover)}" alt="Cover for ${esc(r.title)}" data-media-type="${esc(type)}" data-cover-original="${esc(r.cover)}" data-cover-alternates="${esc(JSON.stringify(r.coverFallbacks||[]))}" onerror="mediaCoverError(this)">`:`<div class="md-poster md-poster-empty">${TYPES[type]?.icon||ico('spark')}</div>`}<div class="md-heading"><div class="eyebrow">${esc(TYPES[type]?.label||type)}${r.year?' · '+esc(r.year):''}</div><h2>${esc(r.title)}</h2><p>${esc(r.subtitle||'Media details')}</p>${r.extra?`<div class="md-facts">${esc(r.extra)}</div>`:''}<div class="md-credit-list" id="mdCredits">${detailCreditMarkup(r)||'<div class="md-muted">Loading creator and cast details…</div>'}</div></div></div><div class="md-body">${r.description?`<section class="md-section"><div class="md-section-title">Overview</div><p class="md-overview">${esc(String(r.description).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()).slice(0,2200)}</p></section>`:''}<div id="mdPeople"><div class="md-muted">Looking up cast and crew…</div></div></div><div class="md-actions"><button class="btn white" onclick="closeModal()">Close</button><button class="btn primary" onclick="prepareMediaCollectionAction(${i})">${state.me?'Add / edit my entry':'Add to collection'}</button></div></section></div>`;if(!r.cover){void cachedCoverDetails(r.title,type).then(data=>{if(!root.isConnected||!data?.cover)return;const missing=root.querySelector('.md-poster-empty');if(!missing)return;const img=document.createElement('img');img.className='md-poster';img.alt='Cover for '+r.title;img.dataset.mediaType=type;img.dataset.coverOriginal=data.cover;img.dataset.coverAlternates=JSON.stringify(data.alternates||[]);img.onerror=()=>mediaCoverError(img);img.src=data.cover;missing.replaceWith(img);r.cover=data.cover;r.coverFallbacks=data.alternates||[];}).catch(()=>{});}loadMediaCredits(r,type)}
async function loadMediaCredits(r,type){
  window.__mtVoicePeople=[];
  const root=$('#mdPeople'),credits=$('#mdCredits');
  if(!root)return;
  const set=(html)=>{if(root?.isConnected)root.innerHTML=html};
  const personImage=(name,url)=>url||`https://ui-avatars.com/api/?name=${encodeURIComponent(name||'MediaTok cast')}&background=34324f&color=ffffff&size=160&rounded=true&bold=true`;
  const cleanPeople=(arr)=>(arr||[]).filter(x=>x&&x.name).map(x=>({...x,image:personImage(x.name,x.image)}));
  const aniLookup=async(kind,title)=>{
    const query=`query($search:String!,$type:MediaType!){Page(perPage:8){media(search:$search,type:$type,sort:SEARCH_MATCH){id title{english romaji native} coverImage{extraLarge large} startDate{year} staff(perPage:20,sort:RELEVANCE){edges{role node{name{full} image{large medium}}}} studios(isMain:true,perPage:5){nodes{name}} characters(perPage:24,sort:ROLE){edges{role node{name{full} image{large medium}} voiceActors(language:JAPANESE){name{full} image{large medium}}}}}}}`;
    const res=await fetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({query,variables:{search:title,type:kind.toUpperCase()}})});
    if(!res.ok)throw new Error('AniList lookup failed');
    const data=await res.json();if(data.errors?.length)throw new Error(data.errors[0].message||'AniList lookup failed');
    const norm=s=>String(s||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    const list=data.data?.Page?.media||[];
    return list.find(m=>[m.title?.english,m.title?.romaji,m.title?.native].some(t=>norm(t)===norm(title)))||list[0]||null;
  };
  try{
    let crew=[],cast=[],voices=[],label='Cast',foundAni=false;
    if(['anime','manga'].includes(type)){
      let m=null;
      try{m=await aniLookup(type,r.title)}catch{}
      if(m){
        foundAni=true;
        if(!r.cover&&m.coverImage?.extraLarge){const poster=$('.md-poster');if(poster?.tagName==='IMG')poster.src=m.coverImage.extraLarge;else if(poster){const img=document.createElement('img');img.className='md-poster';img.alt='Cover for '+r.title;img.src=m.coverImage.extraLarge;poster.replaceWith(img)}}
        const staff=(m.staff?.edges||[]).map(e=>({name:e.node?.name?.full,role:e.role,image:e.node?.image?.large||e.node?.image?.medium}));
        if(type==='manga'){
          crew=staff.filter(x=>/author|story|art|illustrat|original creator/i.test(x.role||'')).slice(0,16);
          if(!crew.length)crew=staff.slice(0,12);
          cast=(m.characters?.edges||[]).slice(0,18).map(e=>({name:e.node?.name?.full,role:e.role,image:e.node?.image?.large||e.node?.image?.medium}));
          label='Characters';
          if(credits){const authors=crew.map(x=>x.name).filter(Boolean);credits.innerHTML=authors.length?`<div class="md-credit"><b>Author / Artist</b><span>${authors.map(esc).join(', ')}</span></div>`:'';const studios=(m.studios?.nodes||[]).map(x=>x.name).filter(Boolean);if(studios.length)credits.insertAdjacentHTML('beforeend',`<div class="md-credit"><b>Studio</b><span>${studios.map(esc).join(', ')}</span></div>`)}
        }else{
          crew=staff.slice(0,16);
          cast=(m.characters?.edges||[]).slice(0,18).map(e=>({name:e.node?.name?.full,role:e.role,image:e.node?.image?.large||e.node?.image?.medium}));
          voices=(m.characters?.edges||[]).flatMap(e=>(e.voiceActors||[]).slice(0,1).map(v=>({name:v.name?.full,role:`${e.node?.name?.full||'Character'} · Japanese voice`,image:v.image?.large||v.image?.medium}))).slice(0,18);
          if(credits){const roles=staff.filter(x=>/director|series composition|original creator|screenplay/i.test(x.role||''));credits.innerHTML=roles.length?`<div class="md-credit"><b>Director / Staff</b><span>${roles.slice(0,8).map(x=>esc(x.name)).join(', ')}</span></div>`:'';const studios=(m.studios?.nodes||[]).map(x=>x.name).filter(Boolean);if(studios.length)credits.insertAdjacentHTML('beforeend',`<div class="md-credit"><b>Studio</b><span>${studios.map(esc).join(', ')}</span></div>`)}
          label='Characters';
        }
      }else{
        const endpoint=type==='anime'?'anime':'manga';
        const search=await fetch(`https://api.jikan.moe/v4/${endpoint}?q=${encodeURIComponent(r.title)}&limit=8`).then(x=>x.ok?x.json():Promise.reject());
        const norm=s=>String(s||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
        const item=(search.data||[]).find(x=>norm(x.title_english)===norm(r.title)||norm(x.title)===norm(r.title))||(search.data||[])[0];
        if(item){
          const id=item.mal_id;
          if(!r.cover&&item.images?.jpg?.large_image_url){const poster=$('.md-poster');if(poster?.tagName==='IMG')poster.src=item.images.jpg.large_image_url;else if(poster){const img=document.createElement('img');img.className='md-poster';img.alt='Cover for '+r.title;img.src=item.images.jpg.large_image_url;poster.replaceWith(img)}}
          if(type==='anime'){
            const j=await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`).then(x=>x.ok?x.json():Promise.reject());
            cast=(j.data||[]).slice(0,18).map(x=>({name:x.character?.name,role:x.role,image:x.character?.images?.jpg?.image_url}));
            voices=(j.data||[]).flatMap(x=>(x.voice_actors||[]).filter(v=>/Japanese/i.test(v.language||'')).slice(0,1).map(v=>({name:v.person?.name,role:`${x.character?.name||'Character'} · Japanese voice`,image:v.person?.images?.jpg?.image_url}))).slice(0,18);label='Characters';
          }else{
            const [a,c]=await Promise.all([fetch(`https://api.jikan.moe/v4/manga/${id}/authors`).then(x=>x.ok?x.json():Promise.reject()).catch(()=>({data:[]})),fetch(`https://api.jikan.moe/v4/manga/${id}/characters`).then(x=>x.ok?x.json():Promise.reject()).catch(()=>({data:[]}))]);
            crew=(a.data||[]).map(x=>({name:x.name,role:x.type,image:x.images?.jpg?.image_url}));cast=(c.data||[]).slice(0,18).map(x=>({name:x.character?.name,role:x.role,image:x.character?.images?.jpg?.image_url}));label='Characters';
            if(credits&&crew.length)credits.innerHTML=`<div class="md-credit"><b>Author</b><span>${crew.map(x=>esc(x.name)).join(', ')}</span></div>`;
          }
        }
      }
    }else if(/^tmdb-(movie|tv):/.test(r.key||'')||((type==='film'||type==='tv')&&(/^(itunes-movie|wikipedia-film|wikipedia-tv):/.test(r.key||'')))){
      const params=new URLSearchParams({key:r.key||'',type});if(!/^tmdb-(movie|tv):/.test(r.key||'')){params.set('title',r.title||'');params.set('year',r.year||'')}
      const j=await fetch(`/api/media-details?${params}`).then(x=>x.ok?x.json():Promise.reject());crew=j.crew||[];cast=j.cast||[];label='Cast';
      if(j.directors?.length&&credits)credits.insertAdjacentHTML('afterbegin',`<div class="md-credit"><b>Director</b><span>${j.directors.map(esc).join(', ')}</span></div>`);
      if(j.creators?.length&&credits)credits.insertAdjacentHTML('afterbegin',`<div class="md-credit"><b>Created by</b><span>${j.creators.map(esc).join(', ')}</span></div>`);
    }else if(/^tvmaze:/.test(r.key||'')){
      const id=(r.key.match(/:(\d+)$/)||[])[1];if(id){const j=await fetch(`https://api.tvmaze.com/shows/${id}?embed[]=cast&embed[]=crew`).then(x=>x.ok?x.json():Promise.reject());cast=(j._embedded?.cast||[]).slice(0,18).map(x=>({name:x.person?.name,role:x.character?.name,image:x.person?.image?.medium}));crew=(j._embedded?.crew||[]).filter(x=>/creator|director|writer/i.test(x.type||'')).slice(0,10).map(x=>({name:x.person?.name,role:x.type,image:x.person?.image?.medium}));label='Cast'}
    }else if(/^itunes-movie:/.test(r.key||'')){if(r.creator&&credits)credits.innerHTML=`<div class="md-credit"><b>Listed by</b><span>${esc(r.creator)}</span></div>`}
    if(!root?.isConnected)return;
    crew=cleanPeople(crew);cast=cleanPeople(cast);voices=cleanPeople(voices);
    let html='';if(crew.length)html+=peopleMarkup(crew,(['anime','manga'].includes(type)&&type==='manga')?'Authors & artists':(['anime','manga'].includes(type)?'Creators & staff':'Directors & crew'));if(cast.length)html+=peopleMarkup(cast,label);if(voices.length)html+=peopleMarkup(voices,'Voice actors');
    set(html||'<div class="md-muted">No cast or creator records were returned for this title. Try another title variant if the catalog listing uses a different name.</div>');
  }catch(e){set('<div class="md-muted">Credits are temporarily unavailable from the source catalogs. Please try again in a moment.</div>')}
}

function setType(type){state.type=type;state.results=[];render();const input=$('#globalSearchInput');if(input)input.value=state.search;if(state.search)setTimeout(searchMedia,0);}
async function browserAnimangaSearch(type,q){
  const timeoutFetch=async(url,opts={})=>{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);try{const r=await fetch(url,{...opts,signal:controller.signal,headers:{Accept:'application/json',...(opts.headers||{})}});if(!r.ok)throw new Error(`Provider returned ${r.status}`);return await r.json()}finally{clearTimeout(timer)}};
  const endpoint=type==='anime'?'anime':'manga',kind=type.toUpperCase();
  const anilistQuery=`query ($search:String!,$type:MediaType!){Page(perPage:12){media(search:$search,type:$type,sort:SEARCH_MATCH){id title{english romaji} coverImage{extraLarge large} startDate{year} format episodes chapters volumes averageScore isAdult description(asHtml:false)}}}`;
  const providers=[
    timeoutFetch(`https://api.jikan.moe/v4/${endpoint}?q=${encodeURIComponent(q)}&limit=12`).then(j=>(j.data||[]).map(m=>({key:`jikan:${type}:${m.mal_id}`,title:m.title_english||m.title||'',cover:m.images?.jpg?.large_image_url||m.images?.jpg?.image_url||'',year:m.year||m.published?.from?.slice(0,4)||'',subtitle:`${m.type||type} · MyAnimeList`,description:m.synopsis||'',creator:(m.authors||[]).map(a=>a.name).join(', '),studio:(m.studios||[]).map(a=>a.name).join(', '),ageRating:m.rating||'',extra:[m.episodes?`${m.episodes} episodes`:'',m.chapters?`${m.chapters} chapters`:'',m.volumes?`${m.volumes} volumes`:'',m.score?`MAL score ${m.score}`:''].filter(Boolean).join(' · ')}))),
    timeoutFetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:anilistQuery,variables:{search:q,type:kind}})}).then(j=>(j.data?.Page?.media||[]).map(m=>({key:`anilist:${m.id}`,title:m.title?.english||m.title?.romaji||'',cover:m.coverImage?.extraLarge||m.coverImage?.large||'',year:m.startDate?.year||'',subtitle:m.format||'AniList',description:m.description||'',creator:'',studio:'',adult:!!m.isAdult,extra:[m.episodes?`${m.episodes} episodes`:'',m.chapters?`${m.chapters} chapters`:'',m.volumes?`${m.volumes} volumes`:'',m.averageScore?`AniList score ${m.averageScore}/100`:''].filter(Boolean).join(' · ')}))),
    timeoutFetch(`https://kitsu.io/api/edge/${endpoint==='anime'?'anime':'manga'}?filter[text]=${encodeURIComponent(q)}&page[limit]=12&sort=-userCount`).then(j=>(j.data||[]).map(item=>{const a=item.attributes||{},t=a.titles||{};return {key:`kitsu:${type}:${item.id}`,title:t.en||t.en_jp||a.canonicalTitle||'',cover:a.posterImage?.large||a.posterImage?.original||a.posterImage?.medium||'',year:(a.startDate||'').slice(0,4),subtitle:`${a.subtype||type} · Kitsu`,description:a.synopsis||'',creator:'',studio:'',ageRating:a.ageRating||'',extra:[a.episodeCount?`${a.episodeCount} episodes`:'',a.chapterCount?`${a.chapterCount} chapters`:'',a.volumeCount?`${a.volumeCount} volumes`:''].filter(Boolean).join(' · ')}}))
  ];
  // Ask all public catalogs at once; use the first provider that returns actual matches.
  const attempts=providers.map(p=>p.then(rows=>rows.filter(x=>x.title).slice(0,24)).then(rows=>{if(!rows.length)throw new Error('No matches from this provider');return rows}));
  try{return await Promise.any(attempts)}catch{return []}
}
async function browserCatalogSearch(type,q){
  const fetchJson=async(url,opts={})=>{const c=new AbortController();const t=setTimeout(()=>c.abort(),8000);try{const r=await fetch(url,{...opts,signal:c.signal,headers:{Accept:'application/json',...(opts.headers||{})}});if(!r.ok)throw new Error('Provider returned '+r.status);return await r.json()}finally{clearTimeout(t)}};
  if(type==='anime'||type==='manga')return browserAnimangaSearch(type,q);
  const rows=[];
  if(type==='film'){
    // Film providers are independent: a timeout from one must not block the other.
    const providers = await Promise.allSettled([
      fetchJson(`/api/search/film?q=${encodeURIComponent(q)}&includeAdult=true`).then(j=>(j.results||[]).map(x=>({...x,subtitle:x.subtitle||'Film · TMDB'}))),
      fetchJson(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=movie&limit=25`).then(j=>(j.results||[]).filter(x=>x.trackName).map(x=>({key:`itunes-movie:${x.trackId}`,title:x.trackName,cover:(x.artworkUrl600||x.artworkUrl100||'').replace(/\d+x\d+bb/,'600x900bb'),year:(x.releaseDate||'').slice(0,4),subtitle:x.primaryGenreName||'Film',description:x.longDescription||'',creator:x.artistName||'',extra:x.releaseDate?`Released ${x.releaseDate}`:''})))
    ]);
    for(const provider of providers) if(provider.status==='fulfilled') rows.push(...provider.value);
    if(!rows.length){
      try{
        const j=await fetchJson(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q+' film movie')}&srnamespace=0&srlimit=10&format=json&origin=*`);
        const pages=(j.query?.search||[]).filter(x=>x.title);
        const details=await Promise.allSettled(pages.map(x=>fetchJson(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages%7Cextracts&piprop=thumbnail&pithumbsize=500&exintro=1&explaintext=1&titles=${encodeURIComponent(x.title)}&format=json&origin=*`)));
        for(const item of details){if(item.status!=='fulfilled')continue;const a=Object.values(item.value.query?.pages||{})[0];if(a?.title)rows.push({key:`wikipedia-film:${a.pageid}`,title:a.title,cover:a.thumbnail?.source||'',year:(a.extract?.match(/\b(?:18|19|20)\d{2}\b/)||[])[0]||'',subtitle:'Film · Wikipedia',description:a.extract||'',creator:'',extra:''})}
      }catch(e){console.warn('Film fallback unavailable',e)}
    }
  }else if(type==='tv'){
    // Broad TV catalog search: combine TVmaze title search, alternate query forms,
    // optional TMDB TV search (when configured on the Worker), and Wikipedia fallback.
    const cleanTitle=v=>String(v||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&#039;/g,"'").replace(/\s+/g,' ').trim();
    const terms=[q,q.replace(/:/g,' '),q.replace(/\bthe\b/ig,' ').replace(/\s+/g,' ').trim()].filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,3);
    const providers=await Promise.allSettled(terms.map(term=>fetchJson(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(term)}`).then(j=>(j||[]).map(x=>{const a=x.show||{};return {key:`tvmaze:${a.id}`,title:cleanTitle(a.name),cover:a.image?.original||a.image?.medium||'',year:(a.premiered||'').slice(0,4),subtitle:(a.genres||[]).slice(0,2).join(', ')||'TV show',description:cleanTitle(a.summary||''),creator:a.network?.name||a.webChannel?.name||'',extra:[a.type,a.status].filter(Boolean).join(' · '),mediaKind:'tv'}}))));
    for(const provider of providers)if(provider.status==='fulfilled')rows.push(...provider.value);
    // Wikipedia is a free fallback that catches titles missing from TVmaze's indexed catalog.
    try{const wiki=await fetchJson(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q+' television series TV show')}&gsrnamespace=0&gsrlimit=12&prop=pageimages%7Cextracts&piprop=thumbnail&pithumbsize=500&exintro=1&explaintext=1&format=json&origin=*`);for(const a of Object.values(wiki.query?.pages||{})){const title=cleanTitle(a.title||'');const extract=cleanTitle(a.extract||'');if(!title||!extract||!/(television series|animated series|TV series|television show|animated television)/i.test(extract.slice(0,900)))continue;rows.push({key:`wikipedia-tv:${a.pageid}`,title,cover:a.thumbnail?.source||'',year:(extract.match(/\b(?:19|20)\d{2}\b/)||[])[0]||'',subtitle:'TV show · Wikipedia',description:extract,creator:'',extra:'Television series',mediaKind:'tv'});}}catch(e){console.warn('TV fallback unavailable',e)}
    const seenTv=new Set();const uniqueTv=rows.filter(x=>{const k=String(x.title||'').toLowerCase().replace(/[^a-z0-9]+/g,'').trim();if(!k||seenTv.has(k))return false;seenTv.add(k);return true});rows.length=0;rows.push(...uniqueTv);
  }else if(type==='game'){
    // Game-specific catalogs include console and PC titles missing from mobile app stores.
    const terms=[q,q.replace(/\s+(remake|remastered|reload|edition)$/i,''),q.replace(/[:：]/g,' ')].filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,3);
    const providers=await Promise.allSettled(terms.flatMap(term=>[
      fetchJson(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(term)}&l=en&cc=us`).then(j=>(j.items||[]).filter(x=>x.name&&(!x.type||x.type==='app')).map(x=>({key:`steam-game:${x.id}`,title:x.name,cover:x.tiny_image||`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${x.id}/header.jpg`,coverFallbacks:[`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${x.id}/library_600x900.jpg`,`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${x.id}/header.jpg`].filter(Boolean),year:'',subtitle:'PC game · Steam',description:'',creator:'',extra:'Steam catalog'}))),
      fetchJson(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term+' video game')}&gsrnamespace=0&gsrlimit=10&prop=pageimages%7Cextracts%7Cinfo&inprop=url&piprop=thumbnail&pithumbsize=500&exintro=1&explaintext=1&format=json&origin=*`).then(j=>Object.values(j.query?.pages||{}).filter(a=>a.title&&/\b(video game|game series|survival horror game|role-playing game|action-adventure game)\b/i.test(a.extract||'')).map(a=>({key:`wikipedia-game:${a.pageid}`,title:a.title,cover:a.thumbnail?.source||'',year:((a.extract||'').match(/\b(?:19|20)\d{2}\b/)||[])[0]||'',subtitle:'Video game · Wikipedia',description:a.extract||'',creator:'',extra:a.fullurl||''})))
    ]));
    for(const provider of providers)if(provider.status==='fulfilled')rows.push(...provider.value);
    const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,'').trim();rows.sort((a,b)=>Number(norm(b.title)===norm(q))-Number(norm(a.title)===norm(q)));
  }else if(type==='light-novel'){
    // Search broadly, because bibliographic catalogs inconsistently label light novels.
    const terms=[q,q.replace(/\s+series$/i,''),q+' novel'].filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,2);
    const anilistQuery=`query ($search:String!){Page(perPage:20){media(search:$search,type:MANGA,sort:SEARCH_MATCH){id title{english romaji native} coverImage{extraLarge large} startDate{year} format volumes averageScore isAdult description(asHtml:false)}}}`;
    const providers=await Promise.allSettled([
      ...terms.map(term=>fetchJson('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:anilistQuery,variables:{search:term}})}).then(j=>(j.data?.Page?.media||[]).map(m=>({key:`anilist-ln:${m.id}`,title:m.title?.english||m.title?.romaji||m.title?.native||'',cover:m.coverImage?.extraLarge||m.coverImage?.large||'',year:m.startDate?.year||'',subtitle:`Light novel · AniList${m.format&&m.format!=='NOVEL'?' · '+m.format:''}`,description:m.description||'',adult:!!m.isAdult,extra:[m.volumes?`${m.volumes} volumes`:'',m.averageScore?`AniList score ${m.averageScore}/100`:'' ].filter(Boolean).join(' · ')})))),
      ...terms.map(term=>fetchJson(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(term)}&limit=20`).then(j=>(j.data||[]).map(m=>({key:`jikan-ln:${m.mal_id}`,title:m.title_english||m.title||'',cover:m.images?.jpg?.large_image_url||m.images?.jpg?.image_url||'',year:m.published?.from?.slice(0,4)||'',subtitle:`${m.type||'Novel'} · MyAnimeList`,description:m.synopsis||'',creator:(m.authors||[]).map(a=>a.name).join(', '),adult:/rx|hentai|explicit/i.test(String(m.rating||'')),extra:[m.volumes?`${m.volumes} volumes`:'',m.score?`MAL score ${m.score}`:''].filter(Boolean).join(' · ')})))),
      fetchJson(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(q)}&maxResults=20`).then(j=>(j.items||[]).map(x=>{const v=x.volumeInfo||{};return {key:`googlebooks-ln:${x.id}`,title:v.title||'',cover:(v.imageLinks?.thumbnail||v.imageLinks?.smallThumbnail||'').replace('http://','https://'),year:(v.publishedDate||'').slice(0,4),subtitle:`Book · ${(v.authors||[]).slice(0,2).join(', ')||'Google Books'}`,creator:(v.authors||[]).join(', '),description:v.description||'',extra:[v.publisher,v.pageCount?`${v.pageCount} pages`:'' ].filter(Boolean).join(' · ')}})),
      fetchJson(`https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,subject`).then(j=>(j.docs||[]).map(x=>({key:`openlibrary-ln:${x.key}`,title:x.title||'',cover:x.cover_i?`https://covers.openlibrary.org/b/id/${x.cover_i}-L.jpg`:'',year:x.first_publish_year||'',subtitle:`Book · ${(x.author_name||[]).slice(0,2).join(', ')||'Open Library'}`,creator:(x.author_name||[]).join(', '),extra:(x.subject||[]).slice(0,3).join(' · ')})))
    ]);
    const seen=new Set();for(const provider of providers){if(provider.status!=='fulfilled')continue;for(const item of provider.value){const key=String(item.title||'').toLowerCase().replace(/[^a-z0-9]+/g,'').trim();if(!key||seen.has(key))continue;seen.add(key);rows.push(item)}}
    const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,'').trim();rows.sort((a,b)=>Number(norm(b.title)===norm(q))-Number(norm(a.title)===norm(q)));
  }else if(['novel','comic'].includes(type)){
    const requests=[fetchJson(`https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=15&fields=key,title,author_name,first_publish_year,cover_i,subject`).then(j=>(j.docs||[]).map(x=>({key:`openlibrary:${x.key}`,title:x.title||'',cover:x.cover_i?`https://covers.openlibrary.org/b/id/${x.cover_i}-L.jpg`:'',year:x.first_publish_year||'',subtitle:(x.author_name||[]).slice(0,2).join(', '),creator:(x.author_name||[]).join(', '),extra:(x.subject||[]).slice(0,3).join(' · ')}))),fetchJson(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(q)}&maxResults=15`).then(j=>(j.items||[]).map(x=>{const v=x.volumeInfo||{};return {key:`googlebooks:${x.id}`,title:v.title||'',cover:(v.imageLinks?.thumbnail||v.imageLinks?.smallThumbnail||'').replace('http://','https://'),year:(v.publishedDate||'').slice(0,4),subtitle:(v.authors||[]).slice(0,2).join(', '),creator:(v.authors||[]).join(', '),description:v.description||'',extra:[v.publisher,v.pageCount?`${v.pageCount} pages`:'' ].filter(Boolean).join(' · ')}}))];
    const settled=await Promise.allSettled(requests);for(const r of settled)if(r.status==='fulfilled')rows.push(...r.value);
    if(type==='light-novel')for(const r of rows)r.subtitle=`Light novel search${r.subtitle?' · '+r.subtitle:''}`;
  }else if(type==='visual-novel'){
    const sources=await Promise.allSettled([
      fetchJson('https://api.vndb.org/kana/vn',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({filters:['search','=',q],fields:'title, released, image.url, id, description, developers.name',results:12,sort:'searchrank'})}).then(j=>(j.results||[]).map(x=>({key:`vndb:${x.id}`,title:x.title||'',cover:x.image?.url||'',year:(x.released||'').slice(0,4),subtitle:'Visual novel · VNDB',description:x.description||'',creator:(x.developers||[]).map(d=>d.name).join(', '),extra:x.released?`Released ${x.released}`:''}))),
      fetchJson(`https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q+' visual novel')}&gsrlimit=10&prop=pageimages%7Cextracts&piprop=thumbnail&pithumbsize=400&exintro=1&explaintext=1&format=json&origin=*`).then(j=>Object.values(j.query?.pages||{}).filter(x=>/visual novel/i.test(x.extract||'')).map(x=>({key:`wiki-vn:${x.pageid}`,title:x.title||'',cover:x.thumbnail?.source||'',year:'',subtitle:'Visual novel · Wikipedia',description:x.extract||''})))
    ]);
    for(const item of sources)if(item.status==='fulfilled')rows.push(...item.value);
  }
  return rows.filter(x=>x.title&&(state.includeMature||!isMatureMedia(x))).slice(0,24);
}
// If the deployed Worker cannot answer /api/search/all, try browser-accessible
// providers by category instead of falsely reporting zero results. Browsers
// still depend on each catalog's CORS policy; failures are isolated.
async function browserAllMediaSearch(q){
 const groups=['anime','manga','film','tv','novel','light-novel','webnovel','comic','game','visual-novel'];
 const completed=await Promise.allSettled(groups.map(async mediaType=>{
  const rows=await browserCatalogSearch(mediaType,q);
  return (Array.isArray(rows)?rows:[]).slice(0,6).map(r=>({...r,mediaType}));
 }));
 return completed.flatMap(x=>x.status==='fulfilled'?x.value:[]);
}
// One reliable entry point for every medium. AniList is a source, never a blocker.
const mediaSearchCache=new Map();let mediaSearchSequence=0,mediaSearchAbort=null;
const searchDiskKey = 'mt_catalog_v36_';
function readSearchDisk(key){try{const item=JSON.parse(localStorage.getItem(searchDiskKey+key)||sessionStorage.getItem(searchDiskKey+key));return item&&Array.isArray(item.rows)&&Date.now()-item.at<7*24*60*60*1000?item:null}catch{return null}}
function saveSearchDisk(key,rows){try{if(!rows?.length)return;const copy=rows.slice(0,25).map(({title,key,cover,coverFallbacks,year,subtitle,mediaType,description,creator,studio,extra,adult})=>({title,key,cover,coverFallbacks,year,subtitle,mediaType,description:String(description||'').slice(0,800),creator,studio,extra,adult}));localStorage.setItem(searchDiskKey+key,JSON.stringify({rows:copy,at:Date.now()}));}catch{}}

async function browserAllMediaSearchFast(q){
 const types=['anime','manga','game','novel','film','tv'];
 const attempts=types.map(async type=>{
  const rows=await browserCatalogSearch(type,q);
  if(!Array.isArray(rows)||!rows.length)throw new Error('No matches');
  return rows.slice(0,8).map(row=>({...row,mediaType:type}));
 });
 try{return await Promise.any(attempts)}catch{return []}
}
// One source of truth for MediaTok search; no parallel browser-side catalog calls.
// Remember the last working API route instead of assuming every Cloudflare deployment
// serves the newest version. Legacy routes still provide real catalog results.
let preferredCatalogRoute='';
async function requestCatalogRoute(route,type,q,controller,deadline=2400){
 const abort=new AbortController();const cleanup=()=>abort.abort();
 if(controller.signal.aborted)throw new DOMException('Aborted','AbortError');
 controller.signal.addEventListener('abort',cleanup,{once:true});
 const clock=setTimeout(()=>abort.abort(),deadline);
 try{
  const res=await fetch(route+'?'+new URLSearchParams({type,q}),{headers:{Accept:'application/json'},signal:abort.signal,cache:'no-store'});
  if(!(res.headers.get('content-type')||'').includes('json'))throw new Error('Route returned HTML');
  const data=await res.json();if(!res.ok||!Array.isArray(data.results))throw new Error(data?.error||'Search route unavailable ('+res.status+')');
  return data;
 }finally{clearTimeout(clock);controller.signal.removeEventListener('abort',cleanup)}
}
async function fetchCatalogResilient(type,q,controller){
 const routes=['/api/search/media','/api/search/v42',...(type==='all'?[]:['/api/search/catalog'])];
 if(preferredCatalogRoute&&routes.includes(preferredCatalogRoute))routes.unshift(...routes.splice(routes.indexOf(preferredCatalogRoute),1));
 let lastError;
 for(const route of routes){
  if(controller.signal.aborted)throw new DOMException('Aborted','AbortError');
  try{
   const data=await requestCatalogRoute(route,type,q,controller,route===preferredCatalogRoute?3900:2300);
   if(data.results.length){preferredCatalogRoute=route;return {...data,sourceRoute:route}}
   // A successful empty response is still preferable to an error, but see whether
   // another route can return actual titles before declaring no results.
   if(!lastError)lastError={data,sourceRoute:route};
  }catch(e){if(controller.signal.aborted)throw e;lastError=lastError?.data?lastError:e;}
 }
 if(lastError?.data&&lastError.data.providerStatus!=='offline')return {...lastError.data,sourceRoute:lastError.sourceRoute};
 // The Worker may not be serving API routes at all. Direct public catalogs are
 // an emergency browser fallback, not the normal or first search path.
 if(controller.signal.aborted)throw new DOMException('Aborted','AbortError');
 const browser=type==='all'?browserAllMediaSearchFast(q):browserCatalogSearch(type,q);
 const rows=await Promise.race([browser,new Promise(resolve=>setTimeout(()=>resolve([]),3600))]).catch(()=>[]);
 if(controller.signal.aborted)throw new DOMException('Aborted','AbortError');
 if(rows?.length)return {results:rows,providerStatus:'browser-fallback',sourceRoute:'browser'};
 if(lastError?.data)return lastError.data;
 throw lastError instanceof Error?lastError:new Error('Search APIs are temporarily unavailable');
}
async function searchMedia(){
 const q=($('#globalSearchInput')?.value||state.search||'').trim();if(q.length<2)return;
 const type=state.type,seq=++mediaSearchSequence,key=type+':'+q.toLowerCase();state.search=q;
 const message=$('#searchMessage'),container=$('#searchResults');if(!message||!container)return;
 if(mediaSearchAbort)mediaSearchAbort.abort();
 const controller=new AbortController();mediaSearchAbort=controller;
 searchMembers(q,seq);
 const previous=mediaSearchCache.get(key)||readSearchDisk(key);
 const manualOptions=()=>state.type==='all'?`<label class="sub" for="mtCustomMediaType">Category</label><select class="select" id="mtCustomMediaType">${Object.entries(TYPES).filter(([t])=>t!=='all').map(([t,d])=>`<option value="${t}">${esc(d.label)}</option>`).join('')}</select>`:'';
 const showCustom=()=>{if(!container?.isConnected||!state.search)return;let node=container.querySelector('.mt-custom-entry');if(!node){container.insertAdjacentHTML('beforeend',`<div class="mt-custom-entry">${manualOptions()}${customMediaEntry()}</div>`);}};

 const renderRows=(rows,note)=>{if(seq!==mediaSearchSequence||!container.isConnected)return;state.results=rows;container.innerHTML=rows.length?renderResults():'<div class="empty">No verified results found.</div>';showCustom();message.textContent=note;void hydrateResultArtwork(container,rows,seq);};
 if(previous?.rows?.length)renderRows(previous.rows,'Saved matches · checking for updates…');
 else{state.results=[];message.textContent='Searching media catalogs…';container.innerHTML='<div class="loading" role="status">Finding matching titles…</div>';showCustom();}
 try{
  const data=await fetchCatalogResilient(type,q,controller);
  if(seq!==mediaSearchSequence||state.type!==type||state.search!==q)return;
  const rows=Array.isArray(data.results)?data.results.slice(0,30):[];
  if(rows.length){
   renderRows(rows,`${rows.length} matches${data.sourceRoute==='browser'?' · alternate catalog':data.providerStatus==='local'?' · MediaTok local catalog':data.stale?' · cached while catalogs recover':data.cached?' · cached':''}`);
   mediaSearchCache.set(key,{rows,at:Date.now()});saveSearchDisk(key,rows);
   if(mediaSearchCache.size>100)mediaSearchCache.delete(mediaSearchCache.keys().next().value);
  }
  else if(previous?.rows?.length)renderRows(previous.rows,'Showing saved matches while catalogs recover.');
  else{state.results=[];message.textContent=data.providerStatus==='offline'?'Catalogs are temporarily unavailable.':'No matching titles found.';container.innerHTML='<div class="empty"><b>No matches yet</b><p>Try another title or search again in a moment.</p><button class="btn white" onclick="searchMedia()">Try again</button></div>';showCustom();}
 }catch(e){
  if(seq!==mediaSearchSequence||state.type!==type||state.search!==q)return;
  if(previous?.rows?.length)renderRows(previous.rows,'Catalog unavailable · showing saved titles.');
  else{message.textContent='Search temporarily unavailable';container.innerHTML='<div class="empty"><b>Unable to reach a media catalog</b><p>The site is still available. Retry the search to reconnect.</p><button class="btn white" onclick="searchMedia()">Retry search</button></div>';showCustom();console.warn('MediaTok catalog search:',e?.message||e);}
 }finally{if(mediaSearchAbort===controller)mediaSearchAbort=null;}
}

function openLog(i){if(!state.me)return login();state.logTarget=state.results[i];const r=state.logTarget,edit=state.editingLog;$('#modalRoot').innerHTML=`<div class="modal-back" onclick="if(event.target===this)closeModal()"><section class="modal"><div style="display:flex;gap:14px">${r.cover?`<img src="${esc(r.cover)}" style="width:84px;height:118px;object-fit:cover;border-radius:11px" alt="">`:`<div class="cover-empty" style="width:84px;height:118px;aspect-ratio:auto;border-radius:11px">${TYPES[state.type].icon}</div>`}<div><div class="eyebrow">${edit?'Edit your entry':'Add to your collection'}</div><h2>${esc(r.title)}</h2><p>${esc(TYPES[state.type].label)} ${r.year?'· '+esc(r.year):''}</p>${r.creator?`<p class="sub"><b>Author / creator:</b> ${esc(r.creator)}</p>`:''}${r.studio?`<p class="sub"><b>Studio:</b> ${esc(r.studio)}</p>`:''}${r.extra?`<p class="sub">${esc(r.extra)}</p>`:''}</div></div>${r.description?`<div class="media-description"><b>About this title</b><p>${esc(r.description.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()).slice(0,1800)}</p></div>`:`<div class="media-description"><b>About this title</b><p class="sub">A description is not available from the current catalog for this entry.</p></div>`}<div class="formgrid"><div class="formitem"><label>Status</label><select class="select" id="logStatus"><option ${edit?.status==='Completed'?'selected':''}>Completed</option><option ${edit?.status==='In progress'?'selected':''}>In progress</option><option ${edit?.status==='Planning'?'selected':''}>Planning</option><option ${edit?.status==='On hold'?'selected':''}>On hold</option><option ${edit?.status==='Dropped'?'selected':''}>Dropped</option></select></div><div class="formitem"><label>Progress (episodes / chapters / pages)</label><input class="field" id="logProgress" type="number" min="0" value="${edit?.progress??0}"></div><div class="formitem"><label>Rating (0–10, optional)</label><input class="field" id="logRating" type="number" min="0" max="10" step="0.5" value="${edit?.rating??''}" placeholder="e.g. 8.5"><div class="sub">Your score is saved to your profile and appears on recent activity.</div></div><div class="formitem"><label>Year</label><input class="field" id="logYear" value="${esc(edit?.year||r.year||'')}" placeholder="Year"></div></div><div class="formitem"><label>Thoughts (optional)</label><textarea class="textarea" id="logNote" maxlength="800" placeholder="What did you think? Keep a note for your profile…">${esc(edit?.note||'')}</textarea></div><div class="modal-actions"><button class="btn white" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="saveLog()">${edit?'Update entry':'Save entry'}</button></div></section></div>`}
function closeModal(){$('#modalRoot').innerHTML=''}
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.querySelector('#modalRoot .mt-media-pop-back'))closeModal()});
async function saveLog(){const r=state.logTarget;if(!r)return;try{const result=await api('/api/logs',{method:'POST',body:JSON.stringify({mediaKey:state.editingLog?.mediaKey||r.key||`${state.type}:${r.title.toLowerCase()}`,mediaType:state.type,title:r.title,cover:r.cover,year:$('#logYear').value,status:$('#logStatus').value,progress:$('#logProgress').value,rating:$('#logRating').value,note:$('#logNote').value})});state.me.stats=result.stats;closeModal();toast(state.editingLog?'Entry updated!':'Added to your collection!');state.editingLog=null;await refreshFeed();if(state.profile&&state.profile.name===state.me.name)await loadProfile(state.me.name);render();}catch(e){toast(e.message)}}
async function refreshFeed(){try{state.feed=await api('/api/feed?limit=40&mode=global')}catch(e){state.feed=[]}}
async function refreshGlobalFeed(){try{state.feed=await api('/api/feed?limit=100&mode='+state.feedMode);await render();}catch(e){toast(e.message||'Could not refresh activity.')}}
async function setFeedMode(mode){state.feedMode=mode;try{state.feed=await api('/api/feed?limit=100&mode='+mode);render()}catch(e){toast(e.message||'Sign in to view Following Recents.');state.feedMode='global';state.feed=await api('/api/feed?limit=100').catch(()=>[]);render()}}
async function toggleFollow(username,following){try{await api('/api/follow',{method:'POST',body:JSON.stringify({username,follow:!following})});if(state.profile)await loadProfile(state.profile.name);state.me=(await api('/api/me')).user;render();toast(following?'Unfollowed.':'Following '+username+'.','success')}catch(e){toast(e.message||'Could not update follow.','error')}}
async function showProfileConnections(kind){
 const u=state.profile||state.me;if(!u)return;
 const username=u.name;
 try{const data=await api(`/api/profile/${encodeURIComponent(username)}/${kind}`);const users=data.users||[];
 $('#modalRoot').innerHTML=`<div class="modal-back" onclick="if(event.target===this)closeModal()"><section class="modal" style="max-width:460px"><h2>${kind==='followers'?'Followers':'Following'} · ${esc(username)}</h2><div class="mt-follow-people">${users.length?users.map(x=>`<a class="mt-follow-person" href="${userLink(x.name)}">${avatar({name:x.name,avc:x.avatar_url||x.avc},38)}<span><b>${esc(x.global_name||x.name)}</b><small>@${esc(x.name)}</small></span></a>`).join(''):'<p class="sub">No users yet.</p>'}</div><button class="btn white" onclick="closeModal()">Close</button></section></div>`;
 }catch(e){toast(e.message||'Could not load followers','error')}
}
async function refreshUnread(){if(!state.me||document.hidden)return;try{const d=await api('/api/notifications');const count=Number(d.unread)||0;if(count!==state.unreadNotifications){state.unreadNotifications=count;updateTop();}}catch{}}
setInterval(refreshUnread,60000);window.addEventListener('focus',refreshUnread);
async function loadNotifications(){if(!state.me)return login();try{const d=await api('/api/notifications');state.notifications=d.notifications||[];state.unreadNotifications=d.unread||0;await api('/api/notifications/read',{method:'POST'});state.unreadNotifications=0;state.view='notifications';render()}catch(e){toast(e.message||'Could not load notifications.')}}
async function toggleComments(id){state.commentOpen[id]=!state.commentOpen[id];if(state.commentOpen[id]){try{state.comments[id]=await api(`/api/logs/${id}/comments`)}catch(e){state.comments[id]=[]} }const node=$(`#comments-${id}`);if(node){node.classList.toggle('hidden',!state.commentOpen[id]);node.innerHTML=state.commentOpen[id]?renderComments(id):''}}
async function postComment(id){const input=$(`#comment-input-${id}`),body=input?.value.trim();if(!body)return;try{await api(`/api/logs/${id}/comments`,{method:'POST',body:JSON.stringify({body})});state.comments[id]=await api(`/api/logs/${id}/comments`);const node=$(`#comments-${id}`);if(node)node.innerHTML=renderComments(id);toast('Comment posted.')}catch(e){toast(e.message)}}
async function deleteLog(id){if(!confirm('Remove this media from your collection?'))return;try{await api(`/api/logs/${id}`,{method:'DELETE'});await refreshFeed();if(state.me)state.me= (await api('/api/me')).user;render();toast('Entry removed.')}catch(e){toast(e.message)}}
async function loadProfile(name){try{const p=await api('/api/profile/'+encodeURIComponent(name));state.profile=p.user;state.profileLogs=p.logs||[];state.profileTab='overview';state.profileStatus='All';return true}catch(e){state.profile=null;state.profileLogs=[];return false}}
const BANNER_PRESETS={Mono:['Accent',a=>`linear-gradient(115deg,${a},#c2c0ff 48%,#c9f6ed)`],Dusk:['Dusk',()=>'linear-gradient(120deg,#2b2d5b,#6b5bd2 55%,#e59ab8)'],Ocean:['Ocean',()=>'linear-gradient(120deg,#0f4c75,#2a9d8f 60%,#a8e6cf)'],Ember:['Ember',()=>'linear-gradient(120deg,#7a1f3d,#e4572e 55%,#ffc46b)'],Forest:['Forest',()=>'linear-gradient(120deg,#1f4d3a,#4f9d69 55%,#d4e8a0)'],Slate:['Slate',()=>'linear-gradient(120deg,#23263a,#4a5072 60%,#8c93b5)']};
const ACCENTS=['#6d6bf5','#e5528a','#ef7d3b','#d9a21b','#2fa57f','#2b9bd6','#8b5cf6','#4b5563'];
const SHAPES=[['circle','Circle'],['rounded','Rounded'],['square','Square']];
const PROFILE_LINKS={anilist:['AniList',n=>'https://anilist.co/user/'+encodeURIComponent(n)],mal:['MyAnimeList',n=>'https://myanimelist.net/profile/'+encodeURIComponent(n)],letterboxd:['Letterboxd',n=>'https://letterboxd.com/'+encodeURIComponent(n)+'/']};
const safeAccent=c=>/^#[0-9a-fA-F]{6}$/.test(c||'')?c:'#6d6bf5';
const bannerStyle=u=>{const a=safeAccent(u.accent);if(u.bannerUrl)return `background-image:url('${esc(u.bannerUrl).replace(/'/g,'%27')}')`;const p=BANNER_PRESETS[u.banner]||BANNER_PRESETS.Mono;return `background-image:${p[1](a)}`};
const parseFavs=u=>{try{const v=JSON.parse(u?.favs||'[]');return Array.isArray(v)?v.map(String):[]}catch{return[]}};
const rnum=l=>l.rating===null||l.rating===undefined||l.rating===''?null:Number(l.rating);
const isPlanning=l=>String(l.status||'').toLowerCase()==='planning';
const STAR=ico('star','fill');
function profileCoverFailed(img,type,title){
 type=type||img.dataset.mediaType;title=title||img.dataset.title;
 const original=img.dataset.coverOriginal||'';
 if(!img.dataset.triedDirect&&/^https:\/\//.test(original)){
  img.dataset.triedDirect='1';img.src=catalogCoverProxy(original);return;
 }
 if(!img.dataset.triedV42&&/^https:\/\//.test(original)){
  img.dataset.triedV42='1';img.src=catalogCoverProxy(original,true);return;
 }
 if(!img.dataset.triedAlternate&&TYPES[type]&&type!=='all'){
  img.dataset.triedAlternate='1';
  void cachedCoverDetails(title,type,true).then(data=>{
   if(!img.isConnected)return;
   const other=[data.cover,...(data.alternates||[])].find(x=>x&&x!==original);
   if(other){img.dataset.coverOriginal=other;img.dataset.triedDirect='';img.src=catalogCoverSrc(other);}
   else displayMissingProfileCover(img,type,title);
  }).catch(()=>displayMissingProfileCover(img,type,title));return;
 }
 displayMissingProfileCover(img,type,title);
}
function displayMissingProfileCover(img,type,title){
 if(!img.isConnected)return;
 const d=document.createElement('div');d.className='pf-img pf-empty';d.innerHTML=TYPES[type]?.icon||ico('spark');
 d.dataset.profileCoverMissing='1';d.dataset.mediaType=type;d.dataset.title=title;img.replaceWith(d);
}
async function hydrateProfileCovers(scope=document){const nodes=[...scope.querySelectorAll('[data-profile-cover-missing="1"]')];let cursor=0;const worker=async()=>{while(cursor<nodes.length){const node=nodes[cursor++];if(!node.isConnected)continue;const type=node.dataset.mediaType,title=node.dataset.title;if(!title||!TYPES[type]||type==='all')continue;const src=await cachedCoverForTitle(title,type);if(!src||!node.isConnected)continue;const img=document.createElement('img');img.className='pf-img';img.alt=title;img.loading='lazy';img.dataset.coverOriginal=src;img.src=catalogCoverSrc(src);img.onerror=()=>profileCoverFailed(img,type,title);node.replaceWith(img)}};await Promise.all(Array.from({length:Math.min(3,nodes.length)},worker))}
function renderProfileRecents(){return ''}
function openProfilePosterDetails(el){const d=el.dataset;openSiteMediaDetails(d.profileMediaType,d.profileTitle,d.profileCover||'',d.profileYear||'',{mediaKey:d.profileMediaKey||'',status:d.profileStatus||'',progress:Number(d.profileProgress)||0,rating:d.profileRating===''?null:Number(d.profileRating),note:d.profileNote||''})}
function openFeedMediaDetails(el){const d=el.dataset;openSiteMediaDetails(d.mediaType,d.mediaTitle,d.mediaCover||'',d.mediaYear||'',{mediaKey:d.mediaKey||''})}
function pfPoster(l,small){const t=TYPES[l.mediaType]||{},r=rnum(l);const img=l.cover?`<img class="pf-img" src="${esc(catalogCoverSrc(l.cover))}" alt="" loading="lazy" data-media-type="${esc(l.mediaType)}" data-title="${esc(l.title)}" data-cover-original="${esc(l.cover)}" onerror="profileCoverFailed(this)">`:`<div class="pf-img pf-empty" data-profile-cover-missing="1" data-media-type="${esc(l.mediaType)}" data-title="${esc(l.title)}">${t.icon||ico('spark')}</div>`;return `<article class="pf-poster pf-media-action" title="${esc(l.title)}" role="button" tabindex="0" data-profile-media-type="${esc(l.mediaType)}" data-profile-title="${esc(l.title)}" data-profile-cover="${esc(l.cover||'')}" data-profile-year="${esc(l.year||'')}" data-profile-media-key="${esc(l.mediaKey||'')}" data-profile-status="${esc(l.status||'')}" data-profile-progress="${Number(l.progress)||0}" data-profile-rating="${l.rating==null?'':Number(l.rating)}" data-profile-note="${esc(l.note||'')}" onclick="openProfilePosterDetails(this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}"><div class="pf-frame">${img}<span class="pf-type" style="--tc:${t.color||'#6d6bf5'}">${t.icon||''}</span>${r!==null?`<span class="pf-score">${STAR}${r.toFixed(1)}</span>`:''}</div><b class="pf-title">${esc(l.title)}</b><span class="pf-sub">${esc(l.status||'Logged')}${l.year?' · '+esc(l.year):''}</span></article>`}
function socialHref(platform,value){let v=String(value||'').trim();if(!v)return '';if(!/^https?:\/\//i.test(v)){v=v.replace(/^@/,'');const hosts={twitter:'https://twitter.com/',tiktok:'https://www.tiktok.com/@',instagram:'https://www.instagram.com/'};v=(hosts[platform]||'')+v}try{const x=new URL(v);if(x.protocol!=='https:'&&x.protocol!=='http:')return '';const host=x.hostname.toLowerCase();const allowed={twitter:['twitter.com','www.twitter.com','x.com','www.x.com'],tiktok:['tiktok.com','www.tiktok.com'],instagram:['instagram.com','www.instagram.com']};return allowed[platform]?.includes(host)?x.href:''}catch{return ''}}
function profileIdentityHTML(u,preview){const own=!preview&&state.me&&state.me.id===u.id,st=u.stats||{},a=safeAccent(u.accent);const av=profileAvatar(u,96,'pf-avatar');const roleLabel={owner:'Owner',admin:'Admin',moderator:'Moderator'}[u.role]||'Member';const action=preview?'':own?`<button class="btn primary pf-action" onclick="openProfileEditor()">${ico('edit')} Customize profile</button>`:`<button class="btn ${u.isFollowing?'white':'primary'} pf-action" onclick="toggleFollow('${esc(u.name)}',${!!u.isFollowing})">${u.isFollowing?ico('check')+' Following':ico('plus')+' Follow'}</button>`;return `<aside class="pf-pass shape-${esc(u.shape||'circle')}" style="--pa:${a}"><div class="pf-pass-id">${av}<div class="pf-idtext"><h1>${esc(u.globalName||u.name)}</h1><div class="pf-handle">@${esc(u.name)}</div></div></div>${u.status?`<div class="pf-status">${esc(u.status)}</div>`:''}${u.bio?`<p class="pf-bio">${esc(u.bio)}</p>`:`<p class="pf-bio pf-bio-empty">No bio yet.</p>`}${(()=>{const s=u.socials||{};return ['twitter','tiktok','instagram'].map(k=>{const href=socialHref(k,s[k]);return href?`<a class="pf-social" href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${k}">${k==='twitter'?'𝕏':k==='tiktok'?'♪':'◎'} ${k==='twitter'?'Twitter / X':k==='tiktok'?'TikTok':'Instagram'}</a>`:''}).filter(Boolean).join(' ')})()}<div class="pf-counts"><div><b>${st.total||0}</b><span>Entries</span></div></div><div class="pf-meta"><div><span>Joined</span><b>${esc(fmtDate(u.joined))}</b></div><div><span>Role</span><b>${roleLabel}</b></div></div>${action}</aside>`}
function profilePage(){const u=state.profile;if(!u)return `<div class="card"><div class="empty"><div class="emoji">${ico('user')}</div><b>Profile not found</b><p>This username doesn't exist yet.</p><button class="btn primary" onclick="goView('home')">Go home</button></div></div>`;
const all=state.profileLogs||[],planning=all.filter(isPlanning),logged=all.filter(l=>!isPlanning(l)),rated=logged.filter(l=>rnum(l)!==null);const profileRoleTotal=Number((u.stats||{}).total??all.length);const profileEntryRole=profileRoleTotal>=1000?'Elitist':profileRoleTotal>=500?'Enthusiast':profileRoleTotal>=300?'Consumer':'Normie';const mean=rated.length?rated.reduce((s,l)=>s+rnum(l),0)/rated.length:null;const stats=u.stats||{};const tab=state.profileTab||'overview';const own=!!(state.me&&state.me.id===u.id);
const order=['anime','manga','tv','film','novel','webnovel','game','visual-novel','comic','light-novel'];const tabLabel={film:'Movies',novel:'Books',tv:'TV','visual-novel':'Visual Novels','light-novel':'Light Novels'};
const tabs=[['overview','Overview',ico('grid'),null],...order.map(k=>[k,tabLabel[k]||TYPES[k].label,TYPES[k].icon,all.filter(l=>l.mediaType===k).length]),['planning','Planning',ico('bookmark'),planning.length]];
const tabBar=`<nav class="pf-tabs" aria-label="Profile sections">${tabs.map(([id,label,icon,n])=>`<button class="pf-tab ${tab===id?'active':''}" onclick="setProfileTab('${id}')">${icon}<span>${label}</span>${n!==null&&n!==undefined?`<small class="pf-tab-count">${n}</small>`:''}</button>`).join('')}</nav>`;
const sec=(cls,title,sub,body)=>`<section class="pf-sec ${cls}"><header class="pf-head"><h2>${title}</h2><span>${sub}</span></header>${body}</section>`;
let content;
if(tab==='overview'){const byKey=new Map(logged.map(l=>[String(l.mediaKey),l]));let picks=parseFavs(u).map(k=>byKey.get(k)).filter(Boolean).slice(0,5);const pinned=picks.length>0;if(!pinned){const seen=new Set();picks=rated.slice().sort((a,b)=>rnum(b)-rnum(a)).filter(l=>{const k=l.mediaType+'|'+String(l.title).toLowerCase();if(seen.has(k))return false;seen.add(k);return true}).slice(0,5)}
const slots=Array.from({length:5},(_,i)=>picks[i]?pfPoster(picks[i]):(own?`<button type="button" class="pf-slot pf-slot-add" onclick="openShowcasePicker()" aria-label="Add to showcase">${ico('plus')}</button>`:`<div class="pf-slot">${ico('plus')}</div>`)).join('');
const roleTotal=Number((u.stats||{}).total??all.length);const role=roleTotal>=1000?'Elitist':roleTotal>=500?'Enthusiast':roleTotal>=300?'Consumer':'Normie';
const dex='';
const rail=(list,msg)=>list.length?`<div class="pf-rail">${list.map(l=>pfPoster(l)).join('')}</div>`:`<div class="pf-none">${msg}</div>`;
content=`<div class="pf-row pf-row-a">${sec('pf-showcase','Showcase',(pinned?'Picked by '+esc(u.globalName||u.name):'Top rated')+(own?` · <button type="button" class="textbtn pf-editlink" onclick="openShowcasePicker()">Edit</button>`:''),`<div class="pf-showrow">${slots}</div>`)}</div><div class="pf-row pf-row-b">${sec('','Planning',planning.length+' planned',rail(planning.slice(0,6),'Nothing planned yet.')+ (planning.length>6?`<div class="pf-planning-more"><button class="btn light" type="button" onclick="setProfileTab('planning')">See all ${planning.length} planned →</button></div>`:''))}</div>`}

else if(tab==='planning'){content=`<div class="pf-row pf-row-list">${sec('','Planning',planning.length+' planned',planning.length?`<div class="pf-grid-posters">${planning.map(l=>pfPoster(l)).join('')}</div>`:`<div class="pf-none">Nothing planned yet.</div>`)}</div>`}
else{const list=all.filter(l=>l.mediaType===tab);const sf=state.profileStatus||'All';const shown=list.filter(l=>sf==='All'||l.status===sf);const statuses=['Completed','In progress','Planning','On hold','Dropped'].map(s=>[s,list.filter(l=>l.status===s).length]).filter(x=>x[1]);const lr=list.filter(l=>rnum(l)!==null);const lm=lr.length?lr.reduce((s,l)=>s+rnum(l),0)/lr.length:null;const t=TYPES[tab]||{};
const chips=`<div class="pf-chips">${[['All',list.length],...statuses].map(([s,n])=>`<button class="pf-fchip ${sf===s?'active':''}" onclick="setProfileStatus('${esc(s)}')">${esc(s)} <small>${n}</small></button>`).join('')}</div>`;
const grid=shown.length?`<div class="pf-grid-posters">${shown.map(l=>pfPoster(l)).join('')}</div>`:`<div class="pf-none">${list.length?'Nothing with that status.':`No ${esc((tabLabel[tab]||t.label||'media').toLowerCase())} logged yet.`}</div>`;
const sum=`<div class="pf-summary"><div class="pf-sumtop"><span class="pf-dex-ic" style="--tc:${t.color}">${t.icon||''}</span><div><b>${list.length}</b><span>entries</span></div><div><b>${lm!==null?lm.toFixed(1):'-'}</b><span>mean score</span></div></div>${statuses.map(([s,n])=>`<div class="pf-sumrow"><span>${esc(s)}</span><i style="--w:${Math.round(n/list.length*100)}%"></i><b>${n}</b></div>`).join('')}</div>`;
content=`<div class="pf-row pf-row-list">${sec('',esc(tabLabel[tab]||t.label||'Media'),shown.length+' shown',chips+grid)}${sec('pf-sumsec','Summary','',sum)}</div>`}
const profileRail=`<div class="pf-profile-rail">${profileIdentityHTML(u,false)}</div>`;const globalRail=`<aside class="pf-global-rail"><section class="pf-global-activity"><header><h2>Global recent activity</h2><button class="textbtn" onclick="goView('feed')">See all →</button></header>${renderFeed((state.feed||[]).slice(0,4))}</section></aside>`;
return `<div class="pf pf-profile-grid" style="--pa:${safeAccent(u.accent)}"><main class="pf-center-column"><header class="pf-hero"><div class="pf-banner" style="${bannerStyle(u)}"></div><div class="pf-hero-id">${profileAvatar(u,88)}<div class="pf-hero-name"><h1>${esc(u.globalName||u.name)}</h1><div>@${esc(u.name)}</div><div class="pf-status-role-row">${u.status?`<span class="pf-hero-status">${esc(u.status)}</span>`:''}<span class="pf-hero-status pf-entry-role">${profileEntryRole}</span><button class="pf-followers-badge" type="button" onclick="showProfileConnections('followers')" aria-label="View followers"><strong>${Number(u.followers)||0}</strong> followers</button></div></div><div class="pf-hero-actions">${state.me&&state.me.id===u.id?`<button class="btn light" onclick="openProfileEditor()">${ico('edit')} Edit profile</button>`:`<button class="btn ${u.isFollowing?'white':'primary'}" onclick="toggleFollow('${esc(u.name)}',${!!u.isFollowing})">${u.isFollowing?'Following':'Follow'}</button>`}<button class="btn light" onclick="navigator.clipboard?.writeText(location.href).then(()=>toast('Profile link copied')).catch(()=>toast('Copy the profile URL from your address bar'))">${ico('share')} Share</button></div></div></header><div class="pf-top-tabs">${tabBar}</div><div class="pf-main">${content}</div></main>${globalRail}</div>`}
function openShowcasePicker(){peTab='showcase';openProfileEditor()}
function setProfileTab(tab){state.profileTab=tab;state.profileStatus='All';const app=$('#app');if(app){app.innerHTML=shell(profilePage(),false);hydrateProfileCovers(app)}window.scrollTo({top:0,behavior:'smooth'})}
function setProfileStatus(s){state.profileStatus=s;const app=$('#app');if(app){app.innerHTML=shell(profilePage(),false);hydrateProfileCovers(app)}}
/* ---------- Customize profile ---------- */
let peTab='identity',peFavs=[],peLogs=[];
function peUser(){const u=state.me||{};const v=id=>document.getElementById(id);return {...u,name:(v('editName')?.value||u.name||'').trim()||u.name,status:v('editStatus')?.value??u.status,bio:v('editBio')?.value??u.bio,accent:v('editAccent')?.value||u.accent,shape:v('editShape')?.value||u.shape||'circle',banner:v('editBannerPreset')?.value||u.banner||'Mono',bannerUrl:v('editBanner')?.value??u.bannerUrl,avatarUrl:v('editAvatar')?.value||u.avatarUrl||''}}
function peRefresh(){const box=$('#pePreview');if(!box)return;const u=peUser();box.innerHTML=`<div class="pe-prev-banner" style="${bannerStyle(u)}"></div>${profileIdentityHTML(u,true)}`;document.querySelectorAll('.pe-swatch').forEach(b=>b.classList.toggle('on',b.dataset.c.toLowerCase()===String(u.accent).toLowerCase()));document.querySelectorAll('.pe-preset').forEach(b=>b.classList.toggle('on',b.dataset.k===u.banner));document.querySelectorAll('.pe-shape').forEach(b=>b.classList.toggle('on',b.dataset.k===u.shape));const bp=$('#editBannerPreview');if(bp){bp.style.cssText=bannerStyle(u)}const ph=$('#editBannerPlaceholder');if(ph)ph.hidden=!!u.bannerUrl}
function peSetAccent(c){$('#editAccent').value=c;peRefresh()}
function peSetPreset(k){$('#editBannerPreset').value=k;if($('#editBanner').value&&!confirm('Switching to a preset removes your uploaded banner image. Continue?'))return;$('#editBanner').value='';const f=$('#editBannerFile');if(f)f.value='';$('#editBannerState').textContent='Using the '+BANNER_PRESETS[k][0]+' preset';peRefresh()}
function peSetShape(k){$('#editShape').value=k;peRefresh()}
function peTabGo(t){peTab=t;document.querySelectorAll('.pe-tab').forEach(b=>b.classList.toggle('active',b.dataset.t===t));document.querySelectorAll('.pe-pane').forEach(p=>p.classList.toggle('hidden',p.dataset.p!==t))}
function peRenderPicks(){const box=$('#peShowGrid');if(!box)return;const q=($('#peShowSearch')?.value||'').toLowerCase();const list=peLogs.map((l,i)=>[l,i]).filter(([l])=>!isPlanning(l)&&(!q||String(l.title).toLowerCase().includes(q)));$('#peShowCount').textContent=peFavs.length+' / 5 picked';box.innerHTML=list.length?list.map(([l,idx])=>{const i=peFavs.indexOf(String(l.mediaKey));return `<button type="button" class="pe-pick ${i>=0?'on':''}" onclick="pePick(${idx})" title="${esc(l.title)}">${pfPoster(l)}${i>=0?`<span class="pe-pick-n">${i+1}</span>`:''}</button>`}).join(''):`<div class="pf-none">${peLogs.length?'No titles match.':'Log some media first, then pick your showcase here.'}</div>`}
function pePick(idx){const key=String(peLogs[idx].mediaKey);const i=peFavs.indexOf(key);if(i>=0)peFavs.splice(i,1);else if(peFavs.length>=5)return toast('Your showcase holds up to 5 titles.','error');else peFavs.push(key);peRenderPicks()}
function peClearPicks(){peFavs=[];peRenderPicks()}
async function openProfileEditor(){if(!state.me)return login();const u=state.me;peFavs=parseFavs(u);peLogs=[];const shape=u.shape||'circle',preset=BANNER_PRESETS[u.banner]?u.banner:'Mono';
const tabsDef=[['identity','Identity','user'],['look','Appearance','edit'],['showcase','Showcase','star'],['accounts','Accounts','link']];
$('#modalRoot').innerHTML=`<div class="modal-back" onclick="if(event.target===this)closeModal()"><section class="modal pe" role="dialog" aria-label="Customize your profile"><div class="pe-wrap"><aside class="pe-side"><div class="pe-side-label">Live preview</div><div id="pePreview" class="pe-preview"></div></aside><div class="pe-body"><header class="pe-head"><div><h2>Customize your profile</h2><p>Changes show in the preview as you make them. Nothing is saved until you press Save.</p></div><button class="pe-x" type="button" onclick="closeModal()" aria-label="Close">${ico('x')}</button></header><nav class="pe-tabs">${tabsDef.map(([id,l,ic])=>`<button type="button" class="pe-tab ${peTab===id?'active':''}" data-t="${id}" onclick="peTabGo('${id}')">${ico(ic)}<span>${l}</span></button>`).join('')}</nav>
<div class="pe-pane ${peTab==='identity'?'':'hidden'}" data-p="identity"><div class="pe-cols"><div><div class="formitem"><label>Username / profile URL</label><input class="field" id="editName" maxlength="24" value="${esc(u.name)}" oninput="peRefresh()"><div class="sub">mediatok.org/yourname</div></div><div class="formitem"><label>Status line</label><input class="field" id="editStatus" maxlength="160" value="${esc(u.status||'')}" placeholder="Currently reading…" oninput="peRefresh()"></div></div><div class="formitem"><label>Bio</label><textarea class="textarea pe-bio" id="editBio" maxlength="500" placeholder="Tell people a little about your taste…" oninput="peRefresh()">${esc(u.bio||'')}</textarea></div></div></div>
<div class="pe-pane ${peTab==='look'?'':'hidden'}" data-p="look"><div class="pe-cols"><div><div class="formitem"><label>Accent color</label><div class="pe-swatches">${ACCENTS.map(c=>`<button type="button" class="pe-swatch" data-c="${c}" style="--c:${c}" onclick="peSetAccent('${c}')" aria-label="Accent ${c}"></button>`).join('')}<label class="pe-custom" title="Custom color"><input id="editAccent" type="color" value="${esc(safeAccent(u.accent))}" oninput="peRefresh()"></label></div></div><div class="formitem"><label>Banner style</label><div class="pe-presets">${Object.entries(BANNER_PRESETS).map(([k,p])=>`<button type="button" class="pe-preset" data-k="${k}" style="background-image:${p[1](safeAccent(u.accent))}" onclick="peSetPreset('${k}')"><span>${p[0]}</span></button>`).join('')}</div><input type="hidden" id="editBannerPreset" value="${preset}"></div><div class="formitem"><label>Picture shape</label><div class="pe-seg">${SHAPES.map(([k,l])=>`<button type="button" class="pe-shape" data-k="${k}" onclick="peSetShape('${k}')">${l}</button>`).join('')}</div><input type="hidden" id="editShape" value="${esc(shape)}"></div></div>
<div><div class="formitem"><label>Profile picture</label><div class="pe-upload"><img id="editAvatarPreview" class="avatar pe-up-av" src="${esc(u.avatarUrl||u.avc||'')}" alt="" onerror="this.dataset.failed='1';this.style.opacity='.35'"><div class="pe-up-copy"><b id="editAvatarState">Current picture</b><div class="sub">PNG, JPG, WebP, AVIF or GIF, up to 400 KB.</div><label class="btn light small upload-pick" for="editAvatarFile">${ico('upload')} Upload</label><input type="file" id="editAvatarFile" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" hidden onchange="handleAvatarUpload(this)"></div></div><input type="hidden" id="editAvatar" value="${esc(u.avatarUrl||'')}"></div><div class="formitem"><label>Banner image</label><div class="pe-upload"><div class="upload-banner-preview pe-up-ban" id="editBannerPreview" style="${bannerStyle(u)}"><span id="editBannerPlaceholder" ${u.bannerUrl?'hidden':''}>Preset in use</span></div><div class="pe-up-copy"><b id="editBannerState">${u.bannerUrl?'Current banner':'No image selected'}</b><div class="sub">Wide images and GIFs work best, up to 400 KB.</div><div class="pe-btnrow"><label class="btn light small upload-pick" for="editBannerFile">${ico('upload')} Upload</label><button class="btn white small" type="button" onclick="clearBannerUpload()">Remove</button></div><input type="file" id="editBannerFile" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" hidden onchange="handleBannerUpload(this)"></div></div><input type="hidden" id="editBanner" value="${esc(u.bannerUrl||'')}"></div></div></div></div>
<div class="pe-pane ${peTab==='showcase'?'':'hidden'}" data-p="showcase"><div class="pe-showtop"><div><b>Pick up to 5 titles for your Showcase</b><div class="sub">They appear in order on your profile. Leave it empty to show your top rated titles automatically.</div></div><div class="pe-showtools"><span class="pill" id="peShowCount">0 / 5 picked</span><button type="button" class="textbtn" onclick="peClearPicks()">Reset</button></div></div><input class="field" id="peShowSearch" placeholder="Search your logged titles…" oninput="peRenderPicks()" style="margin:10px 0"><div class="pe-showgrid" id="peShowGrid"><div class="pf-none">Loading your titles…</div></div></div>
<div class="pe-pane ${peTab==='accounts'?'':'hidden'}" data-p="accounts"><div class="sub" style="margin-bottom:6px">Add your public social profiles. They appear as links on your profile card. You can enter a username or full profile URL.</div><div class="integration-grid"><div class="integration-card"><h3>Social profiles</h3><label>Twitter / X</label><input class="field" id="socialTwitter" placeholder="@username or profile URL" value="${esc(u.socials?.twitter||'')}"><label style="display:block;margin-top:9px">TikTok</label><input class="field" id="socialTiktok" placeholder="@username or profile URL" value="${esc(u.socials?.tiktok||'')}"><label style="display:block;margin-top:9px">Instagram</label><input class="field" id="socialInstagram" placeholder="@username or profile URL" value="${esc(u.socials?.instagram||'')}"></div><div class="integration-card"><h3>AniList</h3><p>Link your public profile or import an AniList export file (CSV, XML, or JSON).</p><input class="field" id="link-anilist" placeholder="AniList username" value="${esc(u.links?.anilist||'')}"><div class="integration-actions"><button class="btn light small" onclick="linkExternal('anilist')">Link</button><button class="btn primary small" onclick="importByUsername('anilist')">Import by username</button></div><input class="file-input" type="file" id="anilistFile" accept=".csv,.xml,.json,.txt,.zip,.gz,application/xml,text/csv,application/json,application/zip,application/gzip" style="margin-top:8px"><button class="btn primary small" style="margin-top:7px" onclick="importListFile('anilist')">Import file</button></div>
<div class="integration-card"><h3>MyAnimeList</h3><p>Link your public profile or import your MAL anime/manga export file (CSV, XML, or JSON).</p><input class="field" id="link-mal" placeholder="MAL username" value="${esc(u.links?.mal||'')}"><div class="integration-actions"><button class="btn light small" onclick="linkExternal('mal')">Link</button><button class="btn primary small" onclick="importByUsername('mal')">Import by username</button></div><input class="file-input" type="file" id="malFile" accept=".csv,.xml,.json,.txt,.zip,.gz,application/xml,text/csv,application/json,application/zip,application/gzip" style="margin-top:8px"><button class="btn primary small" style="margin-top:7px" onclick="importListFile('mal')">Import file</button></div>
<div class="integration-card"><h3>Letterboxd</h3><p>Import your diary CSV export. Letterboxd does not offer general API access for full diary imports.</p><input class="field" id="link-letterboxd" placeholder="Letterboxd username" value="${esc(u.links?.letterboxd||'')}"><button class="btn light small" onclick="linkExternal('letterboxd')">Link profile</button><input class="file-input" type="file" id="letterboxdCsv" accept=".csv,text/csv" style="margin-top:8px"><button class="btn primary small" style="margin-top:7px" onclick="importLetterboxdCsv()">Import diary</button></div></div><div class="import-status">Linked: ${esc(Object.entries(u.links||{}).filter(([k])=>['anilist','mal','letterboxd'].includes(k)).map(([k,v])=>(k==='mal'?'MAL':k==='letterboxd'?'Letterboxd':'AniList')+' @'+v).join(' · ')||'none')}</div></div>
</div></div><div class="modal-actions"><button class="btn white" onclick="closeModal()">Cancel</button><button class="btn primary" onclick="saveProfile()">Save profile</button></div></section></div>`;
peRefresh();document.querySelectorAll('.pe-swatch').forEach(b=>b.classList.toggle('on',b.dataset.c.toLowerCase()===safeAccent(u.accent).toLowerCase()));
try{const p=await api('/api/profile/'+encodeURIComponent(u.name));peLogs=(p.logs||[]).slice().sort((a,b)=>(rnum(b)??-1)-(rnum(a)??-1));}catch{peLogs=[]}peRenderPicks()}
async function anilistGraphQL(query,variables){const r=await fetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({query,variables})});let j={};try{j=await r.json()}catch{}if(!r.ok||j.errors){const msg=j.errors?.[0]?.message||`AniList request failed (${r.status}).`;if(/blocked|principal|temporarily disabled/i.test(msg))throw new Error('AniList is blocking this network request. Try again later; MediaTok cannot override AniList IP blocks.');throw new Error(msg)}return j.data}
async function linkExternal(service,doImport=false){const label=service==='mal'?'MyAnimeList':service==='letterboxd'?'Letterboxd':'AniList';const username=($('#link-'+service)?.value||'').trim()||prompt(`Enter your ${label} username`);if(!username)return;try{let out;if(service==='anilist'){const q='query($name:String!){User(name:$name){name siteUrl avatar{large} statistics{anime{count meanScore episodesWatched} manga{count meanScore chaptersRead}}}}';const d=await anilistGraphQL(q,{name:username.trim().replace(/^@/,'')});const p=d.User;if(!p)throw new Error('Could not find that public AniList profile.');out=await api('/api/links/save',{method:'POST',body:JSON.stringify({service,username:p.name,profile:{url:p.siteUrl,avatar:p.avatar?.large||'',anime:p.statistics?.anime||{},manga:p.statistics?.manga||{}}})})}else{out=await api('/api/links',{method:'POST',body:JSON.stringify({service,username})})}state.me=(await api('/api/me')).user;if(doImport){await syncExternal(service)}else{toast(`${label} linked: @${out.username}`);openProfileEditor()}}catch(e){toast(e.message)}}
async function importByUsername(service){const username=($('#link-'+service)?.value||'').trim();if(!username)return toast('Enter the public username first.');await linkExternal(service,true)}
function parseImportCSV(input){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<input.length;i++){const c=input[i];if(c==='"'&&input[i+1]==='"'&&quoted){cell+='"';i++}else if(c==='"')quoted=!quoted;else if(c===','&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&input[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell=''}else cell+=c}row.push(cell);if(row.some(v=>v.trim()))rows.push(row);return rows}
function normalImportEntries(text,service,filename){const cleanName=filename.replace(/\.gz$/i,'');const ext=(cleanName.split('.').pop()||'').toLowerCase();let records=[];if(ext==='json'||/^\s*[\[{]/.test(text)){let obj=JSON.parse(text);if(Array.isArray(obj))records=obj;else{for(const k of ['anime','manga','entries','data','items','list','lists'])if(Array.isArray(obj?.[k]))records.push(...obj[k]);if(!records.length&&obj&&typeof obj==='object')records=Object.values(obj).flatMap(x=>Array.isArray(x)?x:(x&&typeof x==='object'?[x]:[]))}}else if(ext==='xml'||/<(?:anime|manga|myanimelist|animelist|mangalist)\b/i.test(text)){const doc=new DOMParser().parseFromString(text,'application/xml');if(doc.querySelector('parsererror'))throw new Error('The XML file could not be read. Choose the original AniList or MAL export.');records=[...doc.querySelectorAll('anime, manga, entry, media')].map(el=>{const o={};for(const child of el.children)o[child.tagName.toLowerCase()]=child.textContent.trim();return o})}else{const rows=parseImportCSV(text);if(rows.length<2)throw new Error('This file has no list rows.');const h=rows[0].map(x=>x.trim().toLowerCase().replace(/[ _-]+/g,'_'));records=rows.slice(1).map(r=>Object.fromEntries(h.map((k,i)=>[k,(r[i]||'').trim()]))) }
const val=(o,keys)=>{for(const k of keys){if(o[k]!==undefined&&o[k]!==null&&String(o[k]).trim()!=='')return o[k]}return ''};return records.map((o,i)=>{const title=val(o,['title','series_title','manga_title','name','english_title','romaji_title']);if(!title)return null;const typeRaw=String(val(o,['type','media_type','kind'])||'').toLowerCase();let type=/manga/.test(typeRaw)||('manga_title'in o)||('my_read_chapters'in o)||('my_read_volumes'in o)?'manga':'anime';const id=val(o,['id','media_id','series_animedb_id','manga_mangadb_id','anilist_id','mal_id']);const status=val(o,['status','my_status','my_watched_status','my_read_status','list_status']);const progress=val(o,['progress','my_watched_episodes','my_read_chapters','episodes_watched','chapters_read']);const score=val(o,['score','my_score','rating']);const year=val(o,['year','series_start','start_date','startdate']);const cover=val(o,['cover','image','image_url','cover_url']);let rating=score===''?null:Number(score);if(rating!==null&&Number.isFinite(rating)&&rating>10)rating=rating/10;if(rating!==null&&!Number.isFinite(rating))rating=null;return {key:`${service}:file:${id||type+':'+String(title).toLowerCase().replace(/[^a-z0-9]+/g,'-')}`,type,title:String(title).slice(0,200),cover:/^https:\/\//i.test(String(cover))?String(cover):'',year:String(year).slice(0,4),status:String(status||'Planning'),progress:Math.max(0,Number(progress)||0),rating}}).filter(Boolean)}
async function readImportText(blob,name){if(/\.gz$/i.test(name)){if(typeof DecompressionStream==='undefined')throw new Error('This browser cannot decompress the .gz export. Download the uncompressed XML/CSV export instead.');const stream=blob.stream().pipeThrough(new DecompressionStream('gzip'));return await new Response(stream).text()}return await blob.text()}
async function importListFile(service){const file=$('#'+service+'File')?.files?.[0];if(!file)return toast('Choose an export file first.');try{let entries=[];if(file.name.toLowerCase().endsWith('.zip')){if(!window.JSZip)throw new Error('The ZIP reader did not load. Refresh and try again, or choose an extracted XML/CSV file.');const zip=await JSZip.loadAsync(file);const files=Object.values(zip.files).filter(f=>!f.dir&&/\.(xml|csv|json)(\.gz)?$/i.test(f.name));for(const item of files){let blob=await item.async('blob');const text=await readImportText(blob,item.name);try{entries.push(...normalImportEntries(text,service,item.name))}catch(e){if(!/no anime or manga|no list rows/i.test(e.message))throw e}}}else{const text=await readImportText(file,file.name);entries=normalImportEntries(text,service,file.name)}const unique=new Map(entries.map(x=>[x.key,x]));entries=[...unique.values()];if(!entries.length)throw new Error(`No anime or manga titles were found in ${file.name}. For MyAnimeList, choose the downloaded .xml.gz file or export ZIP; for AniList, choose the list export CSV/JSON/XML or export ZIP, not a profile page or unrelated file.`);const out=await api('/api/import/external',{method:'POST',body:JSON.stringify({service,entries})});state.me=(await api('/api/me')).user;await refreshFeed();closeModal();render();toast(`Import complete: ${out.imported} entries saved.`,'success')}catch(e){toast(e.message||'Import failed. Please check the file and try again.','error')}}
async function importLetterboxdCsv(){const file=$('#letterboxdCsv')?.files?.[0];if(!file)return toast('Choose your Letterboxd diary CSV first.','error');toast('Importing Letterboxd entries…','loading');try{const text=(await file.text()).replace(/^\uFEFF/,'');const rows=parseImportCSV(text);if(rows.length<2)throw new Error('The CSV appears to be empty.');const norm=s=>String(s||'').replace(/^\uFEFF/,'').trim().toLowerCase();const headers=rows[0].map(norm);const pick=(row,names)=>{for(const name of names){const i=headers.indexOf(name);if(i>=0&&row[i]!==undefined)return row[i].trim()}return ''};const entries=rows.slice(1).map(row=>({title:pick(row,['name','film title','title']),year:pick(row,['year']),watchedDate:pick(row,['watched date','date']),rating:pick(row,['rating']),uri:pick(row,['letterboxd uri','uri'])})).filter(x=>x.title);if(!entries.length)throw new Error('No film titles were found. Please choose the Letterboxd diary CSV (usually diary.csv), not a different export file.');let imported=0;for(let i=0;i<entries.length;i+=50){const batch=entries.slice(i,i+50);toast(`Importing Letterboxd: ${Math.min(i+batch.length,entries.length)} / ${entries.length}…`,'loading');const out=await api('/api/import/letterboxd',{method:'POST',body:JSON.stringify({entries:batch})});imported+=Number(out.imported)||0}if(!imported)throw new Error('No films were imported. Check that you selected the Letterboxd diary CSV.');state.me=(await api('/api/me')).user;await refreshFeed();closeModal();render();toast(`Import complete: ${imported} entries saved from ${entries.length} rows.`,'success')}catch(e){toast(e.message||'Letterboxd import failed. Nothing more was imported.','error')}}
async function syncExternal(service){try{let out;if(service==='anilist'){const linked=state.me?.links?.anilist;if(!linked)throw new Error('Link your AniList account first.');const entries=[];const query='query($name:String!,$type:MediaType!){MediaListCollection(userName:$name,type:$type){lists{entries{status progress score media{id title{english romaji} coverImage{extraLarge large} startDate{year}}}}}}';for(const t of [{type:'ANIME',mediaType:'anime'},{type:'MANGA',mediaType:'manga'}]){const d=await anilistGraphQL(query,{name:linked,type:t.type});for(const list of d.MediaListCollection?.lists||[])for(const e of list.entries||[]){const m=e.media;if(m)entries.push({key:`anilist:${m.id}`,type:t.mediaType,title:m.title?.english||m.title?.romaji||'',cover:m.coverImage?.extraLarge||m.coverImage?.large||'',year:m.startDate?.year||'',status:e.status,progress:e.progress||0,rating:e.score?Math.min(10,Number(e.score)/10):null})}}out=await api('/api/import/external',{method:'POST',body:JSON.stringify({service,entries})})}else{out=await api('/api/links/sync',{method:'POST',body:JSON.stringify({service})})}state.me=(await api('/api/me')).user;await refreshFeed();closeModal();render();toast(`Imported or updated ${out.imported} entries.`)}catch(e){toast(e.message)}}
async function unlinkExternal(service){try{await api('/api/links',{method:'DELETE',body:JSON.stringify({service})});state.me=(await api('/api/me')).user;toast('Account unlinked.');openProfileEditor()}catch(e){toast(e.message)}}
async function resetAllLogs(){if(!state.me)return login();if(!confirm('Delete every media log from your profile? This cannot be undone.'))return;if(!confirm('Final confirmation: permanently remove all your logged anime, manga, books, films, TV, games, and visual novels?'))return;try{const out=await api('/api/logs/all',{method:'DELETE'});state.me.stats=out.stats||{};state.profileLogs=[];state.profile=null;toast(`Reset complete. Removed ${Number(out.deleted)||0} entries.`,'success');await refreshFeed();if(state.view==='settings')render();}catch(e){toast(e.message||'Could not reset your logs.','error')}}
function settingsPage(){if(!state.me)return `<section class="card"><h1 class="page-title">Settings</h1><p>Sign in to manage your account.</p><button class="btn primary" onclick="login()">Sign in</button></section>`;return `<div class="eyebrow">Your account</div><h1 class="page-title">Settings</h1><p class="page-desc">Your profile, imports, and session in one place.</p><div class="settings-grid"><section class="card settings-card"><h2>Appearance</h2><p class="sub">Choose how MediaTok looks on this device. Your preference is saved automatically.</p><label class="theme-toggle"><input id="mtDarkMode" type="checkbox" ${document.documentElement.dataset.theme!=='light'?'checked':''} onchange="setDarkMode(this.checked)"> Enable dark mode</label><label for="mtThemeSelect" style="display:block;margin-top:14px;font-weight:700">Site theme</label><select id="mtThemeSelect" class="select theme-select" onchange="setSiteTheme(this.value)"><option value="light" ${document.documentElement.dataset.theme==='light'?'selected':''}>Light — original MediaTok</option><option value="dark" ${document.documentElement.dataset.theme==='dark'?'selected':''}>Dark mode</option><option value="blue-black" ${document.documentElement.dataset.theme==='blue-black'?'selected':''}>Blue-black — midnight blue</option></select></section><section class="card settings-card"><h2>Profile</h2><p class="sub">Edit your name, bio, avatar, banner, and media connections.</p><button class="btn light" onclick="openProfileEditor()">Edit profile</button></section><section class="card settings-card"><h2>Media imports</h2><p class="sub">Import list exports from AniList, MyAnimeList, or Letterboxd diary CSV.</p><button class="btn light" onclick="openProfileEditor()">Manage imports</button></section><section class="card settings-card"><h2>Session</h2><p class="sub">End your current MediaTok session on this browser. Your saved account data stays in place.</p><button class="btn white" onclick="logout()">Log out</button></section><section class="card settings-card"><h2>Reset your logs</h2><p class="sub">Delete every media entry from your profile so you can start your collection over. This cannot be undone. Your account, profile, and connections stay intact.</p><button class="btn white" style="border-color:#d94b63;color:#b52e48" onclick="resetAllLogs()">Delete all my logs</button></section></div>`}
async function adminPage(){if(!state.me||!['owner','admin','moderator'].includes(state.me.role))return `<section class="card"><h2>Staff only</h2><p>You don't have permission to open this page.</p></section>`;let data;try{data=await api('/api/admin/summary')}catch(e){return `<section class="card"><h2>Admin portal</h2><p>${esc(e.message)}</p></section>`}const roleOptions=(u)=>['member','moderator',...(state.me.role==='owner'?['admin']:[])].map(r=>`<option value="${r}" ${u.role===r?'selected':''}>${r}</option>`).join('');return `<div class="eyebrow">Moderation & permissions</div><h1 class="page-title">Admin portal</h1><p class="page-desc">Manage community roles and account access. Private account email is visible to owners and admins only.</p><section class="stats"><div class="stat"><div class="n">${data.users.length}</div><div class="label">Recent members</div></div><div class="stat"><div class="n">${data.users.filter(u=>u.role==='moderator').length}</div><div class="label">Moderators</div></div><div class="stat"><div class="n">${data.users.filter(u=>u.banned).length}</div><div class="label">Banned accounts</div></div></section><section class="card"><h2>Members and roles</h2><div style="overflow:auto"><table style="width:100%;border-collapse:collapse;text-align:left"><thead><tr><th style="padding:10px">Member</th><th>Role</th><th>Status</th><th>Actions</th>${data.permissions.viewPrivate?'<th>Email</th><th>Last IP</th>':''}</tr></thead><tbody>${data.users.map(u=>`<tr style="border-top:1px solid var(--line)"><td style="padding:10px"><b>${esc(u.global_name||u.name)}</b><div class="sub">@${esc(u.name)}</div></td><td>${data.permissions.manageRoles&&u.role!=='owner'?`<select class="select" id="role-${u.id}" style="min-width:110px">${roleOptions(u)}</select>`:`<span class="pill">${esc(u.role)}</span>`}</td><td>${u.banned?'Banned':'Active'}</td><td style="white-space:nowrap">${data.permissions.manageRoles&&u.role!=='owner'?`<button class="btn light small" onclick="adminUpdate(${u.id},'role')">Save role</button> `:''}${data.permissions.ban&&u.role!=='owner'?`<button class="btn ${u.banned?'light':'white'} small" onclick="adminUpdate(${u.id},'ban',${!u.banned})">${u.banned?'Unban':'Ban'}</button>`:''}</td>${data.permissions.viewPrivate?`<td>${esc(u.email||'—')}</td><td>${esc(u.last_ip||'—')} ${u.last_ip?`<button class="btn white small" onclick="adminBanIp('${esc(u.last_ip)}')">Ban IP</button>`:''}</td>`:''}</tr>`).join('')}</tbody></table></div></section>${data.permissions.manageIpBans?`<section class="card"><h2>IP bans</h2><p class="sub">IP addresses are private and visible only to owners and admins. Banned addresses are blocked at the Worker.</p><form class="ip-ban-form" onsubmit="createIpBan(event)"><input class="field" name="ip" placeholder="IPv4 or IPv6 address" required><input class="field" name="reason" placeholder="Reason (optional)"><button class="btn primary">Ban IP</button></form>${(data.ipBans||[]).length?(data.ipBans||[]).map(b=>`<div class="ip-ban-row"><div><b>${esc(b.ip_address||b.ip_hash)}</b><div class="sub">${esc(b.reason||'No reason provided')} · ${timeAgo(b.created_at)}</div></div><button class="btn white small" onclick="removeIpBan(${b.id})">Unban</button></div>`).join(''):'<p class="sub">No IP bans.</p>'}</section>`:''}${data.permissions.viewPrivate?`<section class="card"><h2>Security & flagged signup logs</h2><p class="sub">Private IP data is restricted to owners and admins. Logs are for abuse prevention; review context before taking action.</p>${(data.securityEvents||[]).length?(data.securityEvents||[]).map(e=>`<div class="activity"><b>${esc(e.event_type.replaceAll('_',' '))}</b><div class="activity-meta">${timeAgo(e.created_at)} · username: ${esc(e.username||'—')} · IP: ${esc(e.ip_address||'unavailable')}</div><div>${esc(e.detail||'')}</div>${e.ip_address?`<button class="btn white small" onclick="adminBanIp('${esc(e.ip_address)}')">Ban IP</button>`:''}</div>`).join(''):'<p class="sub">No flagged registration attempts recorded.</p>'}</section>`:''}<section class="card"><h2>Moderation audit log</h2>${data.audit.length?data.audit.map(a=>`<div class="activity"><b>${esc(a.action.replace('_',' '))}</b><div class="activity-meta">by ${esc(a.actor)} · ${timeAgo(a.created_at)}</div><div>${esc(a.detail)}</div></div>`).join(''):'<p class="sub">No moderation actions recorded yet.</p>'}</section>`}
async function adminBanIp(ip){const reason=prompt('Reason for banning '+ip+' (optional):')||'';if(!confirm('Ban this IP address? Everyone using it will be blocked.'))return;try{await api('/api/admin/ip-bans',{method:'POST',body:JSON.stringify({ip,reason})});toast('IP address banned.');render()}catch(e){toast(e.message)}}async function createIpBan(event){event.preventDefault();const form=event.currentTarget;try{await api('/api/admin/ip-bans',{method:'POST',body:JSON.stringify({ip:form.ip.value,reason:form.reason.value})});toast('IP address banned.');render()}catch(e){toast(e.message)}}async function removeIpBan(id){if(!confirm('Remove this IP ban?'))return;try{await api('/api/admin/ip-bans/'+id,{method:'DELETE'});toast('IP ban removed.');render()}catch(e){toast(e.message)}}async function adminUpdate(id,kind,value){try{const body=kind==='role'?{role:$('#role-'+id).value}:{banned:value};await api('/api/admin/users/'+id,{method:'PATCH',body:JSON.stringify(body)});toast('Moderation change saved.');render()}catch(e){toast(e.message)}}
async function handleAvatarUpload(input){const file=input?.files?.[0];if(!file)return;if(!/^image\/(png|jpeg|webp|gif|avif)$/.test(file.type)){toast('Choose a PNG, JPG, WebP, GIF, or AVIF image.','error');input.value='';return}if(file.size>400*1024){toast('Please choose an image no larger than 400 KB. Animated GIFs are supported.','error');input.value='';return}try{const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||''));reader.onerror=()=>reject(new Error('Could not read that image.'));reader.readAsDataURL(file)});const field=$('#editAvatar'),img=$('#editAvatarPreview'),label=$('#editAvatarState');field.value=dataUrl;img.dataset.failed='';img.style.opacity='1';img.src=dataUrl;label.textContent='New picture selected';peRefresh();toast('Picture selected. Press Save profile to keep it.','success')}catch(e){toast(e.message,'error')}}
async function handleBannerUpload(input){const file=input?.files?.[0];if(!file)return;if(!/^image\/(png|jpeg|webp|gif|avif)$/.test(file.type)){toast('Choose a PNG, JPG, WebP, GIF, or AVIF image.','error');input.value='';return}if(file.size>400*1024){toast('Please choose a banner no larger than 400 KB. Animated GIFs are supported.','error');input.value='';return}try{const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||''));reader.onerror=()=>reject(new Error('Could not read that banner.'));reader.readAsDataURL(file)});$('#editBanner').value=dataUrl;const preview=$('#editBannerPreview');preview.style.backgroundImage=`url("${dataUrl}")`;preview.classList.add('has-image');$('#editBannerPlaceholder').hidden=true;$('#editBannerState').textContent='New banner selected';peRefresh();toast('Banner selected. Press Save profile to keep it.','success')}catch(e){toast(e.message,'error')}}
function clearBannerUpload(){const field=$('#editBanner'),preview=$('#editBannerPreview'),label=$('#editBannerState');field.value='';const file=$('#editBannerFile');if(file)file.value='';preview.style.backgroundImage='';preview.classList.remove('has-image');$('#editBannerPlaceholder').hidden=false;label.textContent='Banner removed';peRefresh()}
function previewProfileImage(inputId,previewId,stateId){const input=$('#'+inputId),img=$('#'+previewId),label=$('#'+stateId);if(!input||!img||!label)return;const url=input.value.trim();img.dataset.failed='';img.style.opacity='1';if(!url){img.src=state.me?.avc||'';label.textContent='Using your Discord picture';return}if(!/^https:\/\//i.test(url)){label.textContent='Use an HTTPS image URL';img.style.opacity='.35';return}label.textContent='Loading preview…';img.onload=()=>{img.style.opacity='1';label.textContent='Picture ready to save'};img.onerror=()=>{img.style.opacity='.35';label.textContent='Preview failed — check that this is a direct image URL'};img.src=url}
async function saveProfile(){const avatarUrl=$('#editAvatar').value.trim();if(avatarUrl&&!/^https:\/\//i.test(avatarUrl)&&!/^data:image\/(png|jpeg|webp|gif|avif);base64,/i.test(avatarUrl)){toast('Use an HTTPS image URL or upload a supported image file.','error');return}if(avatarUrl && (avatarUrl.startsWith('data:image/') || avatarUrl!==String(state.me?.avc||''))){const img=$('#editAvatarPreview');if(!img||img.dataset.failed==='1'||!img.complete||img.naturalWidth===0){toast('Your profile picture has not loaded. Wait for the preview before saving.','error');return}}const saveButton=document.querySelector('.modal-actions .btn.primary');try{if(saveButton){saveButton.disabled=true;saveButton.textContent='Saving…'}const data=await api('/api/profile',{method:'POST',body:JSON.stringify({name:$('#editName').value.trim(),accent:$('#editAccent').value,status:$('#editStatus').value,bio:$('#editBio').value,bannerUrl:$('#editBanner').value.trim(),avatarUrl,shape:$('#editShape').value,banner:$('#editBannerPreset').value,favs:peFavs,socials:{twitter:$('#socialTwitter')?$('#socialTwitter').value.trim():(state.me?.socials?.twitter||''),tiktok:$('#socialTiktok')?$('#socialTiktok').value.trim():(state.me?.socials?.tiktok||''),instagram:$('#socialInstagram')?$('#socialInstagram').value.trim():(state.me?.socials?.instagram||'')}})});state.me=data.user;const check=await api('/api/me');if(check.user)state.me=check.user;if(avatarUrl&&state.me.avatarUrl!==avatarUrl)throw new Error('The server did not confirm the new picture. Please try again.');closeModal();history.pushState({},'',userLink(state.me.name));await loadProfile(state.me.name);render();toast('Profile saved.','success')}catch(e){if(saveButton){saveButton.disabled=false;saveButton.textContent='Save profile'}toast(e.message||'Could not save profile. Please try again.','error')}}
async function render(){if(state.view!=='forum'&&forumLiveSocket)forumLiveStop();setActive();updateTop();if(!$('#mobileMenuLayer')?.hidden)renderMobileMenu();const path=decodeURIComponent(location.pathname.replace(/^\/+|\/+$/g,''));if(path&&!['api','auth','assets'].includes(path.split('/')[0])){document.title='@'+path+' | MediaTok';state.view='profile';if(!state.profile||state.profile.name.toLowerCase()!==path.toLowerCase())await loadProfile(path);$('#app').innerHTML=shell(profilePage(),false);loadRecentFilmCovers($('#app'));hydrateProfileCovers($('#app'));return}
if(state.view==='profile'&&state.profile){document.title='@'+state.profile.name+' | MediaTok';$('#app').innerHTML=shell(profilePage(),false);loadRecentFilmCovers($('#app'));hydrateProfileCovers($('#app'));return}
if(state.view==='notifications'){$('#app').innerHTML=shell(`<div class="eyebrow">Your community</div><h1 class="page-title">Notifications</h1><p class="page-desc">Follows, messages, forum replies, and tracked media updates.</p><section class="card">${state.notifications.length?state.notifications.map(n=>`<div class="activity"><b>${esc(n.actor_name||'MediaTok')}</b> ${esc(({follow:'started following you',message:'sent you a message',forum_reply:'replied to your forum thread',chat_mention:'mentioned you in live chat',episode:'has an episode airing soon',episode_released:'has a new episode available',planned_release:'has a new release to check out',season:'has a new season coming'})[n.kind]||'sent you a notification')} ${(()=>{try{const d=JSON.parse(n.detail||'{}');return esc([d.title||d.text||d.message||'',n.kind==='episode'&&d.episode?`Episode ${d.episode}`:'',n.kind==='season'&&d.season?`Season ${d.season}`:'',d.airingAt?new Date(d.airingAt).toLocaleString(): ''].filter(Boolean).join(' · '))}catch{return ''}})()} <div class="sub">${fmtDate(n.created_at)}</div></div>`).join(''):`<div class="empty"><div class="emoji">${ico('bell')}</div><b>You’re all caught up</b><p>New activity will appear here.</p></div>`}</section>`);return}
if(state.view==='discover'||state.view==='animanga'||state.view==='filmstv'||state.view==='books'){$('#app').innerHTML=discoverPage();if(!state.search){loadPickCovers($('#app'));if(state.type==='webnovel')void browseMoreWebnovels(true)}else if(state.results.length)void hydrateResultArtwork($('#searchResults'),state.results,mediaSearchSequence);return}
if(state.view==='forum'){forumLiveStop();$('#app').innerHTML=shell(await forumPage());forumLiveConnect();return}
if(state.view==='leaderboard'){$('#app').innerHTML=shell(await leaderboardPage(),false);loadFreshLeaderboard();return}
if(state.view==='admin'){$('#app').innerHTML=shell(await adminPage(),false);return}
if(state.view==='settings'){$('#app').innerHTML=shell(settingsPage(),false);return}
if(state.view==='feed'){$('#app').innerHTML=shell(`<div class="eyebrow">The community</div><h1 class="page-title">Global recent activity</h1><p class="page-desc">Switch between all members’ recent logs and recent logs from people you follow. Open any entry’s comments to join the conversation.</p><section class="card"><div class="section-head" style="margin-top:0"><h2>${state.feedMode==='following'?'Following Recents':'Global Recents'}</h2><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn ${state.feedMode==='global'?'primary':'white'} small" onclick="setFeedMode('global')">Global Recents</button><button class="btn ${state.feedMode==='following'?'primary':'white'} small" onclick="setFeedMode('following')">Following Recents</button><button class="btn white small" onclick="refreshGlobalFeed()">${ico('refresh')} Refresh</button></div></div>${renderFeed(state.feed)}</section>`);loadRecentFilmCovers($('#app'));return}
$('#app').innerHTML=shell(homePage());loadFeatured();startMediumShowcases();void loadRecentFilmCovers($('#app'))}
async function boot(){const q=new URLSearchParams(location.search);if(q.get('auth_action')==='reset'&&q.get('token')){history.replaceState({},'', '/');openResetPassword(q.get('token'));}if(q.get('email_verified')==='1'){history.replaceState({},'', '/');setTimeout(()=>openAuthMessage('Email verified','Your email is verified. You can now sign in to MediaTok.'),0)}try{state.me=(await api('/api/me')).user}catch{state.me=null}if(state.me){try{const nd=await api('/api/notifications');state.unreadNotifications=Number(nd.unread)||0}catch{state.unreadNotifications=0}}try{state.feed=await api('/api/feed?limit=40&mode=global')}catch{state.feed=[]}await render()}
async function leaderboardPage(){
 const rootId='mtLeaderboard';
 return `<section id="${rootId}" class="mt-lb-shell">
 <div class="mt-lb-hero"><div><div class="mt-lb-kicker">MEDIATOK COMMUNITY</div><h1>Leaderboard</h1><p>Only completed media count. Non-story, multiplayer-focused, and unclassified games are excluded from rankings (but remain in your profile).</p></div><button class="mt-lb-refresh" type="button" onclick="loadFreshLeaderboard()">↻ Refresh</button></div>
 <div class="mt-lb-stats"><div><span>RANKING</span><strong>Top members</strong></div><div><span>SCORING</span><strong>Completed entries</strong></div><div><span>UPDATED</span><strong id="mtLbUpdated">Loading…</strong></div></div>
 <div class="mt-lb-board"><div class="mt-lb-board-head"><span>RANK</span><span>MEMBER</span><span>COMPLETED</span></div><div id="mtLbRows"><div class="mt-lb-state"><span class="mt-lb-spinner"></span><b>Loading leaderboard</b><p>Fetching the latest member rankings…</p></div></div></div>
 <p class="mt-lb-footnote">Only Completed entries count; games count only when verified as story-focused. Multiplayer and unclassified games are excluded.</p></section>`;
}
async function loadFreshLeaderboard(){
 const rowsRoot=document.querySelector('#mtLbRows');const updated=document.querySelector('#mtLbUpdated');if(!rowsRoot)return;
 rowsRoot.innerHTML='<div class="mt-lb-state"><span class="mt-lb-spinner"></span><b>Refreshing rankings</b><p>Contacting MediaTok…</p></div>';
 try{
  const data=await api('/api/leaderboard?version=v48&now='+Date.now());
  if(data&&data.error)throw new Error(data.error);
  const rows=Array.isArray(data)?data:(Array.isArray(data.results)?data.results:[]);
  if(!rows.length){rowsRoot.innerHTML='<div class="mt-lb-state"><b>No rankings yet</b><p>Completed entries will appear here once members have logged them.</p></div>';if(updated)updated.textContent='Just checked';return;}
  rowsRoot.innerHTML=rows.map((u,i)=>{
   const name=String(u.name||u.display_name||u.username||'Member');
   const count=Math.max(0,Number(u.entries??u.completed_count??u.entry_count??0)||0);
   const rank=Number(u.rank)||i+1;
   const face=leaderboardAvatar(u,44,'mt-lb-avatar');
   const medal=rank===1?'♛':rank===2?'Ⅱ':rank===3?'Ⅲ':String(rank);
   return `<a class="mt-lb-row ${rank<=3?'mt-lb-podium':''} mt-lb-rank-${rank<=3?rank:'other'}" href="${userLink(name)}"><span class="mt-lb-rank">${medal}</span><span class="mt-lb-member">${face}<span class="mt-lb-member-copy"><strong>${esc(name)}</strong><small>Rank #${rank}</small></span></span><span class="mt-lb-score"><strong>${count.toLocaleString()}</strong><small>${count===1?'entry':'entries'}</small></span></a>`;
  }).join('');if(updated)updated.textContent='Just checked';
 }catch(e){rowsRoot.innerHTML=`<div class="mt-lb-state mt-lb-error"><b>Leaderboard couldn’t load</b><p>${esc(e.message||'The server returned an error.')}</p><button class="mt-lb-refresh" type="button" onclick="loadFreshLeaderboard()">Try again</button></div>`;if(updated)updated.textContent='Unavailable';}
}



// A separate WebSocket room: chat messages/images expire every UTC hour, forum threads do not.
let forumLiveSocket=null, forumLiveReconnect=null, forumLiveTimer=null, forumLiveUpload=null, forumLiveStatus='Connecting…',forumLiveHour=0,forumLiveNextReset=0;
let forumLiveMsgs=[], forumLiveManualClose=false,forumLiveOnline=0,forumLiveReconnectMs=700,forumLiveReplyTo=null;
function liveForumChatMarkup(){
 const composer=state.me?`<div class="mt-live-send"><div class="mt-live-preview" id="mtLivePreview" hidden><img id="mtLivePreviewImg" alt="Selected image"><div><div class="sub" id="mtLivePreviewLabel">Image selected</div><button class="textbtn" type="button" onclick="forumLiveRemoveImage()">Remove image</button></div></div><div id="mtLiveReplyPreview" class="mt-live-reply-preview" hidden></div><div class="mt-live-compose"><button class="mt-live-add" type="button" title="Attach an image" aria-label="Attach an image" onclick="document.getElementById('mtLiveFile')?.click()">＋</button><input id="mtLiveFile" class="mt-live-upload" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onchange="forumLiveChooseImage(this)"><textarea id="mtLiveInput" class="mt-live-input" maxlength="1000" rows="1" placeholder="Message the community…" aria-label="Chat message" onkeydown="forumLiveKeyDown(event)" oninput="forumLiveMentionSuggest()"></textarea><button class="mt-live-emoji-trigger" type="button" title="Pick an emoji" aria-label="Choose emoji" onclick="forumLiveToggleEmoji()">☺</button><button class="btn primary mt-live-sendbtn" type="button" id="mtLiveSend" onclick="forumLiveSend()">Send</button></div><div id="mtLiveEmojiPicker" class="mt-live-emoji-picker" hidden>${['😀','😂','😍','🥹','🔥','👍','❤️','🎉','💀','😭','💯','👀','✨','🙏'].map(e=>`<button type="button" onclick="forumLiveInsertEmoji('${e}')">${e}</button>`).join('')}</div><div id="mtLiveMentionPopup" class="mt-live-mention-popup" hidden></div><div class="mt-live-note"><span>Enter to send · Shift+Enter for a new line · Images up to 700 KB</span><span id="mtLiveStatus" class="mt-live-status"></span></div></div>`:`<div class="mt-live-login">Sign in to chat and share images. You can still read the conversation.</div>`;
 return `<section class="mt-live" id="mtLive" aria-label="Live community chat"><header class="mt-live-head"><div class="mt-live-title"><span class="mt-live-dot" id="mtLiveDot" aria-hidden="true"></span><h2>Live chat</h2><span class="pill"># general</span></div><div class="mt-live-meta"><span id="mtLiveOnline">Connecting…</span><span class="mt-live-hour" id="mtLiveCountdown">Resets hourly</span></div></header><div class="mt-live-list" id="mtLiveList" role="log" aria-live="off" aria-label="Recent live messages"><div class="mt-live-empty"><b>Connecting to the room…</b><span>Messages and images clear automatically every hour.</span></div></div>${composer}</section>`;
}
function forumLiveStop(){
 forumLiveManualClose=true;
 clearTimeout(forumLiveReconnect);clearInterval(forumLiveTimer);
 forumLiveReconnect=null;forumLiveTimer=null;
 const sock=forumLiveSocket;forumLiveSocket=null;
 if(sock){sock.onclose=null;sock.onerror=null;sock.onmessage=null;try{sock.close(1000,'Leaving forum')}catch{}}
 forumLiveUpload=null;forumLiveReplyTo=null;
}
function forumLiveSetStatus(message){forumLiveStatus=message;const status=$('#mtLiveStatus');if(status)status.textContent=message;}
function forumLiveClock(){
 const el=$('#mtLiveCountdown');if(!el)return;
 const left=Math.max(0,forumLiveNextReset-Date.now());
 const m=Math.floor(left/60000),sec=Math.floor((left%60000)/1000);
 el.textContent=forumLiveNextReset?`Resets in ${m}:${String(sec).padStart(2,'0')}`:'Resets every hour';
 // If a network outage spans the reset, never keep showing old messages.
 if(forumLiveNextReset && Date.now()>forumLiveNextReset+1000 && forumLiveHour!==Math.floor(Date.now()/3600000)) {
   forumLiveHour=Math.floor(Date.now()/3600000);forumLiveMsgs=[];forumLiveClearReply();forumLivePaint(true);
   forumLiveNextReset=(forumLiveHour+1)*3600000;
 }
}
function forumLivePaint(stick=false){
 const list=$('#mtLiveList');if(!list)return;
 const closeToBottom=list.scrollHeight-list.scrollTop-list.clientHeight<90;
 const last=Math.floor(Date.now()/3600000);
 forumLiveMsgs=forumLiveMsgs.filter(x=>Number(x.created_at)>=last*3600000);
 list.innerHTML=forumLiveMsgs.length?forumLiveMsgs.slice(-100).map(m=>{
   const own=state.me&&String(state.me.id)===String(m.user_id);
   const mayDelete=own||state.me&&['owner','admin','moderator'].includes(state.me.role);
   const role=['owner','admin','moderator'].includes(m.role)?`<span class="mt-live-role">${esc(m.role)}</span>`:'';
   const ref=m.reply_to?forumLiveMsgs.find(x=>x.id===m.reply_to):null;
   const reply=ref?`<button class="mt-live-quoted" type="button" onclick="forumLiveJump('${esc(ref.id)}')"><b>↳ ${esc(ref.author)}</b><span>${esc((ref.body||'Image').slice(0,100))}</span></button>`:'';
   const picture=m.image_id?`<a href="/api/forum/live/images/${encodeURIComponent(m.image_id)}" target="_blank" rel="noopener noreferrer" aria-label="Open image"><img class="mt-live-picture" loading="lazy" src="/api/forum/live/images/${encodeURIComponent(m.image_id)}" alt="Photo shared by ${esc(m.author)}" onerror="this.closest('a').remove()"></a>`:'';
   const emotes=(m.reactions||[]).map(r=>`<button class="mt-live-reaction" type="button" onclick="forumLiveReact('${esc(m.id)}','${esc(r.emoji)}')">${esc(r.emoji)} <span>${Number(r.count)||0}</span></button>`).join('');
   return `<div class="mt-live-msg" data-msg="${esc(m.id)}"><a class="mt-live-profile-link" href="${userLink(m.author)}" title="View @${esc(m.author)}'s profile">${avatar({name:m.author,avc:m.avatar},33)}</a><div class="mt-live-main"><div class="mt-live-byline"><a href="${userLink(m.author)}"><b>${esc(m.author)}</b></a>${role}<time>${new Date(Number(m.created_at)).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}</time></div>${reply}${m.body?`<div class="mt-live-text">${forumLiveFormatMentions(m.body)}</div>`:''}${picture}<div class="mt-live-actions"><button type="button" class="mt-live-action" onclick="forumLiveSetReply('${esc(m.id)}')">Reply</button>${state.me?`<button type="button" class="mt-live-action" onclick="forumLiveReact('${esc(m.id)}','❤️')">♡ React</button>`:''}${emotes}</div></div>${mayDelete?`<button class="mt-live-delete" type="button" aria-label="Delete message" title="Delete message" onclick="forumLiveDelete('${esc(m.id)}')">✕</button>`:''}</div>`;
 }).join(''):`<div class="mt-live-empty"><b>It’s quiet in here</b><span>Be the first to say something. Chat clears every hour.</span></div>`;
 if(stick||closeToBottom)list.scrollTop=list.scrollHeight;
}
function forumLiveFormatMentions(body){
 return esc(body).replace(/(^|[^\w])@([A-Za-z0-9_-]{3,24})\b/g,(whole,prefix,name)=>`${prefix}<span class="mt-live-ping ${state.me&&name.toLowerCase()===String(state.me.name).toLowerCase()?'mine':''}">@${name}</span>`);
}
function forumLiveJump(id){const node=document.querySelector(`[data-msg="${id}"]`);node?.scrollIntoView({block:'nearest',behavior:'smooth'});node?.classList.add('mt-live-flash');setTimeout(()=>node?.classList.remove('mt-live-flash'),1200)}
function forumLiveSetReply(id){
 const message=forumLiveMsgs.find(m=>m.id===id);if(!message)return;
 forumLiveReplyTo=id;const el=$('#mtLiveReplyPreview');if(el){el.hidden=false;el.innerHTML=`<span>Replying to <b>@${esc(message.author)}</b> · ${esc((message.body||'Image').slice(0,80))}</span><button type="button" onclick="forumLiveClearReply()" aria-label="Cancel reply">✕</button>`;}$('#mtLiveInput')?.focus();
}
function forumLiveClearReply(){forumLiveReplyTo=null;const el=$('#mtLiveReplyPreview');if(el){el.hidden=true;el.innerHTML='';}}
function forumLiveReact(id,emoji){if(!state.me)return login();if(forumLiveSocket?.readyState===WebSocket.OPEN)forumLiveSocket.send(JSON.stringify({type:'react',id,emoji}));}
function forumLiveToggleEmoji(){const el=$('#mtLiveEmojiPicker');if(el)el.hidden=!el.hidden;}
function forumLiveInsertEmoji(emoji){const field=$('#mtLiveInput');if(!field)return;const start=field.selectionStart,end=field.selectionEnd;field.setRangeText(emoji,start,end,'end');$('#mtLiveEmojiPicker').hidden=true;field.focus();}
function forumLiveMentionSuggest(){const field=$('#mtLiveInput'),popup=$('#mtLiveMentionPopup');if(!field||!popup)return;
 const before=field.value.slice(0,field.selectionStart);const found=before.match(/(?:^|\s)@([A-Za-z0-9_-]{0,24})$/);if(!found){popup.hidden=true;return}
 const query=found[1].toLowerCase();const names=[...new Set(forumLiveMsgs.map(x=>x.author).filter(Boolean))].filter(n=>n.toLowerCase().includes(query)&&(!state.me||n.toLowerCase()!==state.me.name.toLowerCase())).slice(0,8);
 popup.hidden=names.length===0;popup.innerHTML=names.map(name=>`<button type="button" data-mention="${esc(name)}">@${esc(name)}</button>`).join('');
 popup.querySelectorAll('[data-mention]').forEach(b=>b.addEventListener('click',()=>{
 const val=field.value;const prior=val.slice(0,field.selectionStart),after=val.slice(field.selectionStart);const match=prior.match(/(?:^|\s)@[A-Za-z0-9_-]{0,24}$/);if(!match)return;
 const initial=prior.length-match[0].length;field.value=val.slice(0,initial)+(match[0].startsWith(' ')?' ':'')+'@'+b.dataset.mention+' '+after;popup.hidden=true;field.focus();
 }));
}
function forumLiveConnect(){
 if(!$('#mtLive')||state.view!=='forum')return;
 forumLiveManualClose=false;
 clearTimeout(forumLiveReconnect);
 if(forumLiveSocket&&(forumLiveSocket.readyState===WebSocket.OPEN||forumLiveSocket.readyState===WebSocket.CONNECTING))return;
 if(!window.WebSocket){forumLiveSetStatus('WebSockets are unavailable in this browser.');return;}
 const dot=$('#mtLiveDot');if(dot)dot.classList.remove('ready');
 const label=$('#mtLiveOnline');if(label)label.textContent='Connecting…';
 try{
 const ws=new WebSocket(`${location.protocol==='https:'?'wss':'ws'}://${location.host}/api/forum/live/ws`);
 forumLiveSocket=ws;
 ws.onopen=()=>{forumLiveReconnectMs=700;dot?.classList.add('ready');forumLiveSetStatus('Connected');};
 ws.onmessage=event=>{
   if(forumLiveSocket!==ws||!$('#mtLive'))return;
   let packet;try{packet=JSON.parse(event.data)}catch{return}
   if(packet.type==='snapshot'){
      forumLiveHour=packet.hour;forumLiveNextReset=packet.nextReset;forumLiveMsgs=Array.isArray(packet.messages)?packet.messages:[];
      forumLiveOnline=packet.online||0;forumLivePaint(true);forumLiveClock();
   }else if(packet.type==='message'){
      if(!forumLiveMsgs.some(m=>m.id===packet.message?.id))forumLiveMsgs.push(packet.message);
      forumLivePaint();forumLiveSetStatus('Connected');
   }else if(packet.type==='delete'){
      forumLiveMsgs=forumLiveMsgs.filter(m=>m.id!==packet.id);forumLivePaint();
   }else if(packet.type==='reset'){
      forumLiveHour=packet.hour;forumLiveNextReset=packet.nextReset;forumLiveMsgs=[];forumLiveClearReply();forumLivePaint(true);
      forumLiveRemoveImage();forumLiveSetStatus('New chat hour');
   }else if(packet.type==='reactions'){const message=forumLiveMsgs.find(m=>m.id===packet.id);if(message){message.reactions=packet.reactions||[];forumLivePaint();}}else if(packet.type==='mention'){if(state.me&&String(packet.message?.author).toLowerCase()!==String(state.me.name).toLowerCase()){toast('@'+packet.message.author+' mentioned you in live chat','success');refreshUnread();}}else if(packet.type==='presence'){forumLiveOnline=packet.online||0;}
   else if(packet.type==='error'){forumLiveSetStatus(packet.error||'Message failed');toast(packet.error||'Chat error','error')}
   const online=$('#mtLiveOnline');if(online)online.textContent=`${forumLiveOnline} online`;
 };
 ws.onclose=()=>{
   if(forumLiveSocket!==ws)return;
   forumLiveSocket=null;dot?.classList.remove('ready');forumLiveSetStatus('Reconnecting…');
   if(!forumLiveManualClose&&state.view==='forum'&&$('#mtLive')){
      forumLiveReconnect=setTimeout(forumLiveConnect,forumLiveReconnectMs);
      forumLiveReconnectMs=Math.min(15000,forumLiveReconnectMs*1.7);
   }
 };
 ws.onerror=()=>{forumLiveSetStatus('Chat connection interrupted');};
 }catch(e){forumLiveSetStatus('Could not connect to live chat');}
 if(!forumLiveTimer)forumLiveTimer=setInterval(()=>{if(!$('#mtLive')||state.view!=='forum'){forumLiveStop();return}forumLiveClock()},1000);
}
function forumLiveKeyDown(e){if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();forumLiveSend()}}
function forumLiveRemoveImage(){forumLiveUpload=null;const input=$('#mtLiveFile');if(input)input.value='';const preview=$('#mtLivePreview');if(preview)preview.hidden=true;const img=$('#mtLivePreviewImg');if(img){if(img.dataset.url)URL.revokeObjectURL(img.dataset.url);img.dataset.url='';img.removeAttribute('src')}}
async function forumLiveChooseImage(input){
 let file=input.files?.[0];forumLiveRemoveImage();if(!file)return;
 const types=['image/jpeg','image/png','image/webp','image/gif'];
 if(!types.includes(file.type)){toast('Choose JPG, PNG, WebP, or GIF.','error');return}
 if(file.size>700*1024 && file.type!=='image/gif'){
   try{file=await forumLiveCompress(file)}catch{toast('Could not process image.','error');return}
 }
 if(file.size>700*1024){toast('Image is too large. Choose an image under 700 KB.','error');return}
 forumLiveUpload=file;const preview=$('#mtLivePreview'),img=$('#mtLivePreviewImg');
 if(!preview||!img)return;
 img.dataset.url=URL.createObjectURL(file);img.src=img.dataset.url;
 $('#mtLivePreviewLabel').textContent=`${file.name||'Image'} · ${Math.ceil(file.size/1024)} KB`;
 preview.hidden=false;
}
async function forumLiveCompress(file){
 const bitmap=await createImageBitmap(file);
 try{
  const max=1400,scale=Math.min(1,max/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
  canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
  for(const quality of [.8,.64,.48,.32]){
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
    if(blob&&blob.size<=700*1024)return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.webp',{type:'image/webp'});
  }
  throw new Error('Image too large');
 }finally{bitmap.close?.()}
}
async function forumLiveSend(){
 const field=$('#mtLiveInput'),button=$('#mtLiveSend');if(!field||!button)return;
 const text=field.value.trim(),file=forumLiveUpload;
 if(!text&&!file)return;
 const socket=forumLiveSocket;
 if(!socket||socket.readyState!==WebSocket.OPEN){forumLiveSetStatus('Waiting for chat connection…');return}
 button.disabled=true;forumLiveSetStatus(file?'Uploading image…':'Sending…');
 try{
   let imageId='';
   if(file){
     const response=await fetch('/api/forum/live/upload',{method:'POST',headers:{'Content-Type':file.type},body:file,credentials:'same-origin'});
     const result=await response.json();if(!response.ok)throw new Error(result.error||'Upload failed');
     imageId=result.imageId;
   }
   if(forumLiveSocket!==socket||socket.readyState!==WebSocket.OPEN)throw new Error('Chat disconnected. Please try again.');
   socket.send(JSON.stringify({type:'send',body:text,imageId,replyTo:forumLiveReplyTo}));
   field.value='';forumLiveClearReply();forumLiveRemoveImage();forumLiveSetStatus('Sent');
 }catch(e){forumLiveSetStatus(e.message||'Could not send');toast(e.message||'Could not send','error')}
 finally{button.disabled=false;field.focus()}
}
function forumLiveDelete(id){const socket=forumLiveSocket;if(socket?.readyState!==WebSocket.OPEN){forumLiveSetStatus('Disconnected');return}socket.send(JSON.stringify({type:'delete',id}))}

async function forumPage(){let threads=[],forumError='';try{threads=await api('/api/forum/threads')}catch(e){forumError=e.message||'Forum database tables are missing. Apply the forum migration, then refresh.'}const cats=['All','Anime','Manga','Novels','Movies & TV','Games','General'];return `<div class="eyebrow">Community hub</div><h1 class="page-title">MediaTok Forum</h1><p class="page-desc">Start discussions, share recommendations, debate endings, and talk about the media you love.</p>${liveForumChatMarkup()}<section class="card"><div class="search-row"><input id="forumSearch" class="field" placeholder="Search discussions…" oninput="filterForum()"><button class="btn white" onclick="render()">${ico('refresh')} Refresh</button></div><div class="tabs" id="forumCats">${cats.map((c,i)=>`<button class="tab ${i===0?'active':''}" data-cat="${esc(c)}" onclick="forumCategory('${esc(c)}',this)">${esc(c)}</button>`).join('')}</div></section>${state.me?`<section class="card"><h3>Start a discussion</h3><input id="threadTitle" class="field" maxlength="140" placeholder="A clear, interesting title" style="margin-bottom:9px"><select id="threadCategory" class="select" style="margin-bottom:9px">${cats.slice(1).map(c=>`<option>${esc(c)}</option>`).join('')}</select><textarea id="threadBody" class="textarea" maxlength="5000" placeholder="Add context, your opinion, or a question…"></textarea><div class="sub" style="margin-top:7px">Be respectful. Spoiler warnings are appreciated.</div><button class="btn primary" style="margin-top:10px" onclick="createThread()">${ico('plus')} Post thread</button></section>`:`<section class="card">Sign in with Discord to start a discussion or reply.</section>`}<section class="card">${forumError?`<div class="tip"><b>Forum needs a database migration</b>${esc(forumError)}<br>The forum tables are missing or the Worker returned a database error. Apply migrations/0005_forum_repair.sql to the existing remote D1 database, deploy the Worker, then refresh.</div>`:''}<div class="section-head" style="margin-top:0"><h2>Discussions</h2><span class="sub">${threads.length} recent threads</span></div><div id="forumThreads">${threads.length?threads.map(t=>forumThread(t)).join(''):`<div class="empty"><div class="emoji">${ico('forum')}</div><b>No discussions yet</b><p>Be the first to start a conversation.</p></div>`}</div></section>`}
function forumThread(t){return `<article class="activity forum-thread" data-title="${esc((t.title+' '+t.body).toLowerCase())}" data-category="${esc(t.category)}" id="thread-${t.id}"><div class="activity-top">${avatar({name:t.author,avc:t.author_avatar},34)}<div><b>${esc(t.author)}</b><div class="sub">${timeAgo(t.created_at)} · ${Number(t.reply_count||0)} replies</div></div><span class="pill">${esc(t.category)}</span></div><h3 class="activity-title">${esc(t.title)}</h3><p style="white-space:pre-wrap;line-height:1.6">${esc(t.body)}</p><div class="activity-actions"><button class="textbtn" onclick="toggleThreadReplies(${t.id})">${ico('chat')} View replies (${Number(t.reply_count||0)})</button></div><div id="thread-replies-${t.id}" class="comments hidden"></div></article>`}
let activeForumCategory='All';function forumCategory(cat,button){activeForumCategory=cat;document.querySelectorAll('#forumCats .tab').forEach(b=>b.classList.toggle('active',b===button));filterForum()}function filterForum(){const q=($('#forumSearch')?.value||'').toLowerCase();document.querySelectorAll('.forum-thread').forEach(el=>el.classList.toggle('hidden',!(activeForumCategory==='All'||el.dataset.category===activeForumCategory)||!el.dataset.title.includes(q)))}
async function toggleThreadReplies(id){const box=$('#thread-replies-'+id);if(!box)return;if(!box.dataset.loaded){try{const rows=await api('/api/forum/threads/'+id+'/replies');box.innerHTML=rows.map(r=>`<div class="comment">${avatar({name:r.author,avc:r.avatar},28)}<div class="comment-body"><b>${esc(r.author)}</b><span class="sub">${timeAgo(r.created_at)}</span><div style="white-space:pre-wrap">${esc(r.body)}</div></div></div>`).join('')||'<div class="sub">No replies yet. Start the conversation.</div>';box.dataset.loaded='1'}catch(e){box.innerHTML=`<div class="sub">${esc(e.message)}</div>`}}box.classList.toggle('hidden');if(state.me&&!box.querySelector('form'))box.insertAdjacentHTML('beforeend',`<form class="comment-form" onsubmit="postThreadReply(event,${id})"><input class="field" name="body" maxlength="3000" placeholder="Write a reply…" required><button class="btn primary small">Reply</button></form>`)}
async function postThreadReply(event,id){event.preventDefault();const form=event.currentTarget;try{await api('/api/forum/threads/'+id+'/replies',{method:'POST',body:JSON.stringify({body:form.body.value})});toast('Reply posted.');const box=$('#thread-replies-'+id);box.dataset.loaded='';await toggleThreadReplies(id);box.classList.remove('hidden')}catch(e){toast(e.message)}}
async function createThread(){try{await api('/api/forum/threads',{method:'POST',body:JSON.stringify({title:$('#threadTitle').value,category:$('#threadCategory').value,body:$('#threadBody').value})});toast('Thread posted.');render()}catch(e){toast(e.message)}}
window.addEventListener('popstate',async()=>{const path=decodeURIComponent(location.pathname.replace(/^\/+|\/+$/g,''));if(path){state.view='profile';await loadProfile(path)}else{state.view='home';state.profile=null}render()});boot();


// Progressive Web App install support. iOS users can use Share > Add to Home Screen.
let mediaTokInstallPrompt=null;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();mediaTokInstallPrompt=event;const btn=document.getElementById('installAppBtn');if(btn)btn.hidden=false;});
window.addEventListener('appinstalled',()=>{mediaTokInstallPrompt=null;const btn=document.getElementById('installAppBtn');if(btn)btn.hidden=true;});
async function installMediaTok(){if(mediaTokInstallPrompt){mediaTokInstallPrompt.prompt();try{await mediaTokInstallPrompt.userChoice}catch{}mediaTokInstallPrompt=null;const btn=document.getElementById('installAppBtn');if(btn)btn.hidden=true;return;}const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);if(isIOS){if(typeof toast==='function')toast('To install: tap Share, then “Add to Home Screen”.');else alert('To install MediaTok: tap Share, then “Add to Home Screen”.');}else if(typeof toast==='function')toast('Use your browser menu and choose Install app or Add to Home screen.');}
if('serviceWorker' in navigator && location.protocol==='https:'){window.addEventListener('load',()=>navigator.serviceWorker.register('/service-worker.js').catch(err=>console.warn('MediaTok offline support unavailable',err)));}

from pathlib import Path
p=Path('/mnt/data/mediatok-v62/public/index.html')
s=p.read_text()
block=r'''// v62: Music showcase for a public profile, independent of logged media.
function mtMusicSettings(){const social=state.profile?.socials||{};return {lastfm:String(social.lastfm||''),musicMode:social.musicMode==='favorites'?'favorites':'recent',musicFavorites:Array.isArray(social.musicFavorites)?social.musicFavorites.slice(0,4):[]}}
function mtMusicCard(x){const type=x.type==='song'?'Song':'Artist';let href='';try{const u=new URL(x.url||'');if(u.protocol==='https:'&&['www.last.fm','last.fm'].includes(u.hostname))href=u.href}catch{}
 const cover=/^https:\/\//i.test(x.image||'')?`<img loading="lazy" src="${esc(x.image)}" alt="" onerror="this.remove();this.parentElement.classList.add('mt-music-noart')">`:'';
 return `<a class="mt-music-track" ${href?`href="${esc(href)}" target="_blank" rel="noopener noreferrer"`:'aria-disabled="true"'}><span class="mt-music-art">${ico('music')}${cover}</span><span class="mt-music-copy"><strong>${esc(x.name)}</strong><small>${esc(x.type==='song'?(x.artist||'Unknown artist'):type)}</small></span>${ico('arrow')}</a>`;
}
function mtMusicPanel(){const settings=mtMusicSettings(),owner=!!(state.me&&state.me.id===state.profile?.id);if(!settings.lastfm&&!settings.musicFavorites.length&&!owner)return '';
 const favorites=settings.musicFavorites.map(x=>({...x,image:'',url:x.type==='song'?'https://www.last.fm/music/'+encodeURIComponent(x.artist||'')+'/_/'+encodeURIComponent(x.name):'https://www.last.fm/music/'+encodeURIComponent(x.name)}));
 const initial=settings.musicMode==='favorites'||!settings.lastfm?favorites:[];
 return `<section class="pf-music-rail" id="mtMusicShowcase" aria-label="Music showcase"><header class="mt-music-head"><div><div class="eyebrow">The soundtrack</div><h2>${settings.musicMode==='favorites'?'Favorite music':'Recently listened artists'}</h2></div>${owner?`<button class="textbtn" type="button" onclick="openMusicEditor()">${ico('edit')} Edit</button>`:''}</header><div class="mt-music-grid" id="mtMusicList">${initial.length?initial.map(mtMusicCard).join(''):`<div class="mt-music-empty">${settings.lastfm?'Loading recent music…':'Connect Last.fm or pick four favorites to share your music.'}</div>`}</div>${settings.lastfm?`<a class="mt-music-source" href="https://www.last.fm/user/${encodeURIComponent(settings.lastfm)}" rel="noopener noreferrer" target="_blank">Last.fm · @${esc(settings.lastfm)} ${ico('arrow')}</a>`:''}</section>`;
}
async function mtLoadMusic(){const holder=document.getElementById('mtMusicShowcase'),user=state.profile?.name;if(!holder||!user)return;const prefs=mtMusicSettings();if(prefs.musicMode==='favorites'||!prefs.lastfm)return;
 try{const data=await api('/api/music/v62?profile='+encodeURIComponent(user));if(state.profile?.name!==user||!document.getElementById('mtMusicShowcase'))return;const list=document.getElementById('mtMusicList');if(!list)return;list.innerHTML=data.items?.length?data.items.map(mtMusicCard).join(''):`<div class="mt-music-empty">${esc(data.source==='unconfigured'?'Last.fm needs its API key configured.':data.source==='unavailable'?'Last.fm is temporarily unavailable.': 'No recent listening yet. Choose favorite songs or artists with Edit.')}</div>`}catch{const list=document.getElementById('mtMusicList');if(list)list.innerHTML='<div class="mt-music-empty">Music is temporarily unavailable.</div>'}
}
function openMusicEditor(){if(!state.me||state.profile?.id!==state.me.id)return;const prefs=mtMusicSettings(),favs=Array.from({length:4},(_,i)=>prefs.musicFavorites[i]||{type:'artist',name:'',artist:''});
 const rows=favs.map((x,i)=>`<div class="mt-music-editrow"><label for="mtMusicKind${i}">Slot ${i+1}</label><select class="select" id="mtMusicKind${i}" onchange="mtMusicUpdateRows()"><option value="artist" ${x.type!=='song'?'selected':''}>Artist</option><option value="song" ${x.type==='song'?'selected':''}>Song</option></select><input class="field" id="mtMusicName${i}" maxlength="100" placeholder="Artist or song name" value="${esc(x.name)}"><input class="field mt-music-songartist" id="mtMusicArtist${i}" maxlength="100" placeholder="Performed by (artist)" value="${esc(x.artist||'')}"></div>`).join('');
 $('#modalRoot').innerHTML=`<div class="modal-back" onclick="if(event.target===this)closeModal()"><section class="modal mt-music-edit" role="dialog" aria-modal="true" aria-label="Edit music"><header class="mt-music-head"><div><div class="eyebrow">Your profile</div><h2>Edit music showcase</h2></div><button type="button" class="md-close" onclick="closeModal()" aria-label="Close">${ico('x')}</button></header><p class="sub">Link a public Last.fm profile to show your four recently listened artists, or hand-pick four artists and songs.</p><label class="mt-music-label" for="mtMusicUsername">Last.fm username</label><input class="field" id="mtMusicUsername" maxlength="45" placeholder="Your Last.fm username" value="${esc(prefs.lastfm)}"><label class="mt-music-label" for="mtMusicMode">What should visitors see?</label><select class="select" id="mtMusicMode" onchange="mtMusicUpdateRows()"><option value="recent" ${prefs.musicMode==='recent'?'selected':''}>Recent artists from Last.fm</option><option value="favorites" ${prefs.musicMode==='favorites'?'selected':''}>My four favorite artists or songs</option></select><div class="mt-music-manual" id="mtMusicManual"><p class="sub">Choose up to four favorites. Empty slots are hidden.</p>${rows}</div><footer class="mt-music-actions"><button type="button" class="btn white" onclick="closeModal()">Cancel</button><button type="button" class="btn primary" id="mtMusicSave" onclick="mtMusicSave()">Save music</button></footer></section></div>`;
 mtMusicUpdateRows();
}
function mtMusicUpdateRows(){const m=$('#mtMusicManual');if(!m)return;m.hidden=$('#mtMusicMode')?.value!=='favorites';for(let i=0;i<4;i++){const artist=$('#mtMusicArtist'+i),kind=$('#mtMusicKind'+i);if(artist&&kind)artist.hidden=kind.value!=='song'}}
async function mtMusicSave(){const el=$('#mtMusicSave');if(el){el.disabled=true;el.textContent='Saving…'}const musicFavorites=[];for(let i=0;i<4;i++){const type=$('#mtMusicKind'+i)?.value||'artist',name=$('#mtMusicName'+i)?.value.trim()||'',artist=$('#mtMusicArtist'+i)?.value.trim()||'';if(name)musicFavorites.push({type,name,artist})}try{
 const data=await api('/api/music/v62/preferences',{method:'POST',body:JSON.stringify({lastfm:$('#mtMusicUsername').value.trim(),musicMode:$('#mtMusicMode').value,musicFavorites})});
 const social={...(state.profile.socials||{}),...data.music};state.profile.socials=social;if(state.me?.id===state.profile.id)state.me.socials={...(state.me.socials||{}),...data.music};closeModal();
 // Only replace the profile page if the member is still viewing it.
 if(state.view==='profile'&&state.profile){$('#app').innerHTML=shell(profilePage(),false);mtScheduleCurrentFit();mtLoadMusic();hydrateProfileCovers($('#app'))}toast('Music saved to your profile.','success');
 }catch(e){toast(e.message||'Could not save music.','error');if(el){el.disabled=false;el.textContent='Save music'}}}
'''
marker='function profilePage(){const u=state.profile;'
assert marker in s
s=s.replace(marker,block+'\n'+marker,1)
old='return `<div class="pf pf-profile-grid ${current.length?\'mt-has-current\':\'\'}" style="--pa:${safeAccent(u.accent)}"><main'
assert old in s
s=s.replace(old,'return `<div class="pf pf-profile-grid ${current.length?\'mt-has-current\':\'\'}" style="--pa:${safeAccent(u.accent)}"><main',1)
old='</div></main>${currentRail}${globalRail}</div>`}'
assert old in s
s=s.replace(old,'</div></main><div class="pf-right-zone">${currentRail}${globalRail}${mtMusicPanel()}</div></div>`}',1)
s=s.replace('mtScheduleCurrentFit();hydrateProfileCovers(app)','mtScheduleCurrentFit();mtLoadMusic();hydrateProfileCovers(app)')
s=s.replace("mtScheduleCurrentFit();loadRecentFilmCovers($('#app'));hydrateProfileCovers($('#app'));return}","mtScheduleCurrentFit();mtLoadMusic();loadRecentFilmCovers($('#app'));hydrateProfileCovers($('#app'));return}")
# no omission on profile if separate render branch, replace all occurrences
s=s.replace("mtScheduleCurrentFit();loadRecentFilmCovers($('#app'));hydrateProfileCovers($('#app'));return}","mtScheduleCurrentFit();mtLoadMusic();loadRecentFilmCovers($('#app'));hydrateProfileCovers($('#app'));return}")
# implement ico music
s=s.replace('"link": "<path d=', '"music": "<path d=\'M9 18V5l12-2v13\'/><circle cx=\'6\' cy=\'18\' r=\'3\'/><circle cx=\'18\' cy=\'16\' r=\'3\'/>", "link": "<path d=',1)
# service worker version css to invalidate old stale theme
s=s.replace('v61-desktop-profile','v62-music-profile')
p.write_text(s)

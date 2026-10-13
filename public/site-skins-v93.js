// Site-wide Passport-style mouse interaction, independent of profile theme.
// This does not request images, change state or store any server-side preference.
(()=>{
 const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const selector='.layout:not(.pf-page) .media-tile, .layout:not(.pf-page) .niche-card, .layout:not(.pf-page) .mt-list-summary, .pp-app .niche-art, .pp-app .pp-library-art, .pp-app .mt-list-summary';
 let frame=0,last=null;
 const active=()=>document.documentElement.dataset.siteSkin==='passport'&&document.documentElement.dataset.profileActive!=='true'&&!reduceMotion.matches;
 const reset=node=>{if(!node)return;node.style.transform='';node.style.removeProperty('--mt-pointer-x');node.style.removeProperty('--mt-pointer-y')};
 document.addEventListener('pointermove',e=>{
  if(e.pointerType!=='mouse'||!active()){if(last){reset(last);last=null}return}
  const target=e.target instanceof Element?e.target.closest(selector):null;
  if(target!==last){reset(last);last=target}
  if(!target)return;
  const rect=target.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-rect.left)/(rect.width||1))),y=Math.max(0,Math.min(1,(e.clientY-rect.top)/(rect.height||1)));
  cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   if(!target.isConnected||!active())return;
   target.style.transform=`perspective(950px) translateY(-4px) scale(1.018) rotateY(${((x-.5)*10).toFixed(2)}deg) rotateX(${((.5-y)*10).toFixed(2)}deg)`;
   target.style.setProperty('--mt-pointer-x',(x*100)+'%');target.style.setProperty('--mt-pointer-y',(y*100)+'%');
  });
 },{passive:true});
 document.addEventListener('pointerout',e=>{if(last&&e.target instanceof Node&&last.contains(e.target)&&!(e.relatedTarget instanceof Node&&last.contains(e.relatedTarget))){cancelAnimationFrame(frame);reset(last);last=null}},true);
 window.addEventListener('blur',()=>{cancelAnimationFrame(frame);reset(last);last=null});
})();

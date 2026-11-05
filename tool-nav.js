(()=>{
  const key=new URLSearchParams(location.search).get('key');
  const storageKey='pa-nav-key';
  if(key){try{sessionStorage.setItem(storageKey,key)}catch(e){}}
  let token=key;
  if(!token){try{token=sessionStorage.getItem(storageKey)}catch(e){}}
  const valid=k=>{
    if(!k||typeof PAAccess==='undefined')return false;
    if(k===PAAccess.permanent)return true;
    try{
      const raw=atob(k.replace(/-/g,'+').replace(/_/g,'/'));
      const d=JSON.parse(new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0))));
      return !!(d&&d.v===1&&typeof d.name==='string'&&d.name.trim()&&Number.isFinite(d.until)&&Date.now()<d.until&&typeof d.nonce==='string'&&d.nonce.length>=12);
    }catch(e){return false;}
  };
  const authorized=valid(token);
  if(!authorized){try{sessionStorage.removeItem(storageKey)}catch(e){}}
  document.addEventListener('DOMContentLoaded',()=>{
    const nav=document.querySelector('header nav');
    if(!nav)return;
    if(!authorized){nav.innerHTML='<a href="index.html">Projekt</a>';return;}
    nav.innerHTML='<a href="index.html">Projekt</a><a href="tool.html?key='+encodeURIComponent(token)+'">Tool</a><a href="excel-anleitung.html">Anleitung</a><a href="quellcode.html">Quellcode &amp; Transparenz</a><a href="projektideen.html">Projektideen</a><a href="tipp.html">Tipp</a>';
  });
})();

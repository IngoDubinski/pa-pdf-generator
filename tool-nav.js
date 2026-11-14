/* Gemeinsame Navigation: freigegebener Link gilt für beide Tools.
   Clientseitige Freigabe ist bei statischen Seiten kein serverseitiger Schutz. */
(()=>{
 const query=new URLSearchParams(location.search).get('key');const store='pa-nav-key';
 if(query){try{sessionStorage.setItem(store,query);}catch{}}
 let token=query; if(!token)try{token=sessionStorage.getItem(store);}catch{}
 const valid=k=>{
  if(!k||typeof PAAccess==='undefined')return false;
  if(k===PAAccess.permanent)return true;
  try{const raw=atob(k.replace(/-/g,'+').replace(/_/g,'/'));const d=JSON.parse(new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0))));return !!(d&&d.v===1&&typeof d.name==='string'&&d.name.trim()&&Number.isFinite(d.until)&&Date.now()<d.until&&typeof d.nonce==='string'&&d.nonce.length>=12);}catch{return false;}
 };
 const authorized=valid(token);
 if(!authorized)try{sessionStorage.removeItem(store);}catch{}
 document.addEventListener('DOMContentLoaded',()=>{
  const nav=document.querySelector('header nav');
  if(nav){
   const entries=[['index.html','PA-Tools'],['tool.html','PA-Drucktool'],['ep-generator.html','EP Generator'],['vorlagen.html','Vorlagen'],['excel-anleitung.html','Anleitung'],['quellcode.html','Quellcode'],['architektur.html','Schaubild'],['projektideen.html','Projektideen'],['tipp.html','Tipp']];
   nav.replaceChildren();
   for(const [link,label] of entries){if(!authorized&&['tool.html','ep-generator.html'].includes(link))continue;const a=document.createElement('a');a.textContent=label;a.href=link+(authorized&&['tool.html','ep-generator.html','index.html'].includes(link)?'?key='+encodeURIComponent(token):'');nav.append(a);}
  }
  for(const a of document.querySelectorAll('[data-key-link]')){if(authorized)a.href=a.getAttribute('href').split('?')[0]+'?key='+encodeURIComponent(token);else{a.href='#';a.onclick=e=>{e.preventDefault();alert('Bitte einen persönlichen Freigabelink vom Administrator verwenden.');};}}
  const status=document.getElementById('portalStatus');if(status)status.textContent=authorized?'Dein Freigabelink ist gültig. Beide Tools sind verfügbar.':'Für die Werkzeuge ist ein persönlicher Freigabelink erforderlich.';
 });
})();

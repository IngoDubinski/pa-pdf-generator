// Einfacher clientseitiger Zugangsschutz, kein Schutz vor Quellcode-Einsicht.
const PAAccess = (() => {
  const permanent = "OH7H119DMQVAsqVbfrr7D_mu77TiPzYqedmTUKyRYbbbgPiB";
  const decode = s => { try { const raw=atob(s.replace(/-/g,'+').replace(/_/g,'/')); return JSON.parse(new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0)))); } catch(e){return null;} };
  function allowed(){ const key=new URLSearchParams(location.search).get('key'); if(key===permanent)return true; const d=decode(key||''); return !!(d && d.v===1 && typeof d.name==='string' && d.name.trim() && Number.isFinite(d.until) && Date.now()<d.until && typeof d.nonce==='string' && d.nonce.length>=12); }
  return {allowed,permanent};
})();

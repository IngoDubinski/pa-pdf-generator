/* Linkstatus fuer GitHub Pages. Sichtbarkeitskontrolle, KEINE serverseitige Authentifizierung. */
const PAAccess = (() => {
  const permanent = "OH7H119DMQVAsqVbfrr7D_mu77TiPzYqedmTUKyRYbbbgPiB";
  const sessionKey = 'pa-nav-key';
  function decode(value) {
    try {
      const b64 = value.replace(/-/g,'+').replace(/_/g,'/');
      const raw=atob(b64);
      return JSON.parse(new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0))));
    } catch (_) { return null; }
  }
  function token() {
    const query = new URLSearchParams(location.search);
    if (query.has('key')) return query.get('key') || '';
    try { return sessionStorage.getItem(sessionKey) || ''; } catch (_) { return ''; }
  }
  function check(value) {
    if (!value) return 'none';
    if (value === permanent) return 'admin';
    const d=decode(value);
    if (!(d && d.v===1 && typeof d.name==='string' && d.name.trim() &&
      Number.isFinite(d.until) && typeof d.nonce==='string' && d.nonce.length>=12)) return 'invalid';
    return Date.now() < d.until ? 'valid' : 'expired';
  }
  function state() { return check(token()); }
  function allowed() { return ['valid','admin'].includes(state()); }
  function isPermanent() { return state() === 'admin'; }
  function currentToken() { return allowed() ? token() : ''; }
  function requireLink(adminOnly=false) {
    if (adminOnly ? isPermanent() : allowed()) return true;
    const reason=adminOnly && allowed() ? 'admin' : state()==='expired' ? 'expired' : 'access';
    location.replace('index.html?notice='+encodeURIComponent(reason));
    return false;
  }
  // Valid links remain available while navigating the portal. Invalid / expired
  // links are removed; the public landing page remains available independently.
  try {
    const query=new URLSearchParams(location.search);
    if (query.has('key')) {
      if (allowed()) sessionStorage.setItem(sessionKey, token());
      else sessionStorage.removeItem(sessionKey);
    } else if (!allowed()) sessionStorage.removeItem(sessionKey);
  } catch (_) {}
  return {allowed,isPermanent,currentToken,state,requireLink,permanent};
})();

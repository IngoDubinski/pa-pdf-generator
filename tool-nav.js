/* Portalnavigation und Tool-Sichtbarkeit; keine echte Zugangskontrolle auf GitHub Pages. */
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const access=typeof PAAccess !== 'undefined' ? PAAccess : null;
    const authorized=!!access?.allowed();
    const admin=!!access?.isPermanent();
    const token=authorized ? access.currentToken() : '';
    const nav=document.querySelector('header nav');
    const links=[
      ['index.html','PA-Tools','public'],
      ['tool.html','PA-Drucktool','user'],
      ['ep-generator.html','EP Generator','user'],
      ['ep-seite2.html','EP 2. Seite','user'],
      ['antrag-be.html','Antrag BE','admin'],
      ['vorlagen.html','Vorlagen','public'],
      ['excel-anleitung.html','Anleitung','public'],
      ['quellcode.html','Quellcode','public'],
      ['architektur.html','Schaubild','public'],
      ['projektideen.html','Projektideen','public'],
      ['tipp.html','Tipp','public']
    ];
    if(nav){
      nav.replaceChildren();
      for(const [url,label,role] of links){
        if(role==='admin'&&!admin)continue;
        if(role==='user'&&!authorized)continue;
        const a=document.createElement('a');
        a.textContent=label;
        a.href=url+(authorized&&(role!=='public'||url==='index.html')?'?key='+encodeURIComponent(token):'');
        nav.append(a);
      }
    }
    for(const card of document.querySelectorAll('[data-admin-only]'))card.hidden=!admin;
    for(const a of document.querySelectorAll('[data-key-link]')){
      const requireAdmin=a.hasAttribute('data-admin-link');
      if(authorized&&(!requireAdmin||admin)){
        a.href=a.getAttribute('href').split('?')[0]+'?key='+encodeURIComponent(token);
        a.classList.remove('tool-link-disabled');
        a.removeAttribute('aria-disabled');
      }else{
        a.removeAttribute('href');
        a.classList.add('tool-link-disabled');
        a.setAttribute('aria-disabled','true');
        a.tabIndex=-1;
      }
    }
    const status=document.getElementById('portalStatus');
    if(status){
      const notice=new URLSearchParams(location.search).get('notice');
      const state=access?.state()||'none';
      if(admin)status.textContent='Admin-Dauerlink aktiv: Alle Werkzeuge und Platzhalter sind sichtbar.';
      else if(authorized)status.textContent='Freigabelink gültig: PA-Drucktool, EP Generator und EP 2. Seite verfügbar.';
      else if(notice==='admin')status.textContent='Dieses Werkzeug ist dem Admin-Dauerlink vorbehalten. Du kannst die öffentliche Projektinformation weiterhin ansehen.';
      else if(notice==='expired'||state==='expired')status.textContent='Dein Freigabelink ist abgelaufen. Bitte einen neuen Link anfordern. Die Projektinformation bleibt frei zugänglich.';
      else if(state==='invalid'||new URLSearchParams(location.search).has('key'))status.textContent='Der Freigabelink ist ungültig. Bitte den Link prüfen oder einen neuen anfordern.';
      else status.textContent='Die Projektinformation ist frei zugänglich. Zum Öffnen eines Werkzeugs wird ein gültiger Freigabelink benötigt.';
      status.classList.toggle('portal-warning',!authorized);
    }
  });
})();

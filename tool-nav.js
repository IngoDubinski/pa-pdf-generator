/* PA-Tools v1.6.6: Hauptnavigation mit ausklappbarem Info/Hilfe-Menue.
 * Github Pages bietet nur clientseitige Sichtbarkeitskontrolle, keinen echten Zugangsschutz.
 */
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const access = typeof PAAccess !== 'undefined' ? PAAccess : null;
    const authorized = !!access?.allowed();
    const admin = !!access?.isPermanent();
    const token = authorized ? access.currentToken() : '';
    const addKey = url => authorized ? url + '?key=' + encodeURIComponent(token) : url;

    const portal = document.getElementById('toolPortal');
    if (portal) portal.hidden = !authorized;
    const flow = document.getElementById('localFlowDetails');
    if (flow) flow.hidden = !authorized;
    const nav = document.querySelector('header nav');
    if (nav && authorized) {
      // Kein Aufblitzen der internen Navigation: Die nav-Tags sind im HTML vorab versteckt.
      nav.replaceChildren();
      const directLinks = [
        ['index.html', 'PA-Tools'],
        ['tool.html', 'PA-Drucktool'],
        ['ep-generator.html', 'EP Generator'],
        ['ep-seite2.html', 'EP 2. Seite'],
        ['antrag-be.html', 'Antrag BE · Beta'],
        ['profil.html', 'Mein Profil'],
        ['tn-zertifikat.html', 'TN-Zertifikat · geplant']
      ];

      for (const [href, label] of directLinks) {
        const a = document.createElement('a');
        a.href = addKey(href);
        a.textContent = label;
        if (location.pathname.endsWith('/' + href)) a.setAttribute('aria-current', 'page');
        nav.append(a);
      }

      const menu = document.createElement('details');
      menu.className = 'nav-info-help';
      const summary = document.createElement('summary');
      summary.textContent = 'Info/Hilfe';
      summary.setAttribute('aria-label', 'Info/Hilfe: weitere Seiten aufklappen');
      menu.append(summary);
      const entries = document.createElement('div');
      entries.className = 'nav-info-links';
      const helpLinks = [
        ['vorlagen.html', 'Vorlagen'],
        ['excel-anleitung.html', 'Anleitung'],
        ['quellcode.html', 'Quellcode'],
        ['architektur.html', 'Schaubild'],
        ['projektideen.html', 'Projektideen'],
        ['tipp.html', 'Tipp']
      ];
      for (const [href, label] of helpLinks) {
        const a = document.createElement('a');
        a.href = href; // Oeffentliche Hilfeseiten brauchen keinen Token in der URL.
        a.textContent = label;
        if (location.pathname.endsWith('/' + href)) a.setAttribute('aria-current', 'page');
        entries.append(a);
      }
      menu.append(entries);
      nav.append(menu);
      document.addEventListener('click', event => {
        if (menu.open && !menu.contains(event.target)) menu.open = false;
      });
      document.addEventListener('keydown', event => {
        if (menu.open && event.key === 'Escape') {
          menu.open = false;
          summary.focus();
        }
      });
      nav.hidden = false;
    } else if (nav) {
      nav.replaceChildren();
      nav.hidden = true;
    }

    for (const card of document.querySelectorAll('[data-admin-only]')) card.hidden = !authorized;
    for (const a of document.querySelectorAll('[data-key-link]')) {
      const needsAdmin = a.hasAttribute('data-admin-link') && !a.hasAttribute('data-beta-public');
      if (authorized && (!needsAdmin || admin)) {
        a.href = addKey(a.getAttribute('href').split('?')[0]);
        a.classList.remove('tool-link-disabled');
        a.removeAttribute('aria-disabled');
      } else {
        a.removeAttribute('href');
        a.classList.add('tool-link-disabled');
        a.setAttribute('aria-disabled', 'true');
        a.tabIndex = -1;
      }
    }
    const status = document.getElementById('portalStatus');
    if (status) {
      const notice = new URLSearchParams(location.search).get('notice');
      const state = access?.state() || 'none';
      if (admin) status.textContent = 'Admin-Dauerlink aktiv: Alle Werkzeuge und Platzhalter sind sichtbar.';
      else if (authorized) status.textContent = 'Freigabelink gültig: PA-Drucktool, EP Generator, EP 2. Seite und Antrag BE (Beta) verfügbar.';
      else if (notice === 'admin') status.textContent = 'Dieses Werkzeug ist dem Admin-Dauerlink vorbehalten. Du kannst die öffentliche Projektinformation weiterhin ansehen.';
      else if (notice === 'expired' || state === 'expired') status.textContent = 'Dein Freigabelink ist abgelaufen. Bitte einen neuen Link anfordern. Die Projektinformation bleibt frei zugänglich.';
      else if (state === 'invalid' || new URLSearchParams(location.search).has('key')) status.textContent = 'Der Freigabelink ist ungültig. Bitte den Link prüfen oder einen neuen anfordern.';
      else status.textContent = 'Die Projektinformation ist frei zugänglich. Zum Öffnen eines Werkzeugs wird ein gültiger Freigabelink benötigt.';
      status.classList.toggle('portal-warning', !authorized);
    }
  });
})();

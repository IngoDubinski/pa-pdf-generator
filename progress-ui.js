/* Fortschrittsanzeige für EP-Generator und PA-Drucktool. Läuft ausschließlich im Browser. */
'use strict';
const PAProgress=(()=>{
  function connect(id){
    const root=document.getElementById(id);
    if(!root)throw new Error('Fortschrittsanzeige nicht gefunden: '+id);
    const bar=root.querySelector('progress');
    const percent=root.querySelector('[data-progress-percent]');
    const detail=root.querySelector('[data-progress-label]');
    const title=root.querySelector('[data-progress-title]');
    let current=0;
    function show(value,message){
      const next=Math.min(100,Math.max(current,Math.max(0,Math.floor(Number(value)||0))));
      current=next;
      bar.value=next;
      percent.textContent=next+' %';
      if(message)detail.textContent=message;
    }
    return {
      start(message){current=0;root.hidden=false;root.dataset.state='running';root.setAttribute('aria-busy','true');bar.value=0;title.textContent='Erstellung läuft';show(0,message||'Verarbeitung startet …');},
      update(value,message){show(value,message);},
      finish(message){show(100,message||'Fertig.');root.dataset.state='done';root.setAttribute('aria-busy','false');title.textContent='Fertig';},
      fail(message){root.dataset.state='error';root.setAttribute('aria-busy','false');title.textContent='Vorgang abgebrochen';detail.textContent=message||'Es ist ein Fehler aufgetreten.';},
      hide(){root.hidden=true;root.removeAttribute('aria-busy');}
    };
  }
  return {connect};
})();

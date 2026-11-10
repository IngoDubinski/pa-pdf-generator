"use strict";
// Ausschließlich Anzeige-Umschaltung. Die bestehenden Druckfunktionen bleiben unverändert.
(()=>{
 const workflows={class:['importPanel','settingsPanel','classOutputPanel','ownTemplatesPanel'],single:['importPanel','settingsPanel','singlePanel','ownTemplatesPanel'],blanko:['blankoPanel','ownTemplatesPanel']};
 const ids=['importPanel','settingsPanel','singlePanel','blankoPanel','classOutputPanel','ownTemplatesPanel'];
 const buttons=[...document.querySelectorAll('[data-workflow-button]')];
 const help=document.getElementById('workflowHelp');
 function activate(mode){
  if(!workflows[mode])mode='class';
  document.body.dataset.workflow=mode;
  for(const id of ids){const el=document.getElementById(id);if(el)el.hidden=!workflows[mode].includes(id);}
  for(const b of buttons){const on=b.dataset.workflowButton===mode;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));}
  help.textContent=mode==='class'?'Schülerliste laden, Aufgaben und Dokumente auswählen, anschließend Klassen-PDFs erstellen.':mode==='single'?'Schülerliste laden, Aufgaben auswählen und im Einzeldruck Schüler und Dokumente bestimmen.':'Ohne Schülerliste: Dokumentart auswählen und eine leere Vorlage erzeugen.';
 }
 buttons.forEach(b=>b.addEventListener('click',()=>activate(b.dataset.workflowButton)));
 activate('class');
})();

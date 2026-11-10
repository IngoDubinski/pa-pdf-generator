"use strict";
/* Nur Bedienoptionen, niemals Schülerdaten oder hochgeladene Dateien speichern. */
(()=>{
 const key='pa-drucktool-settings-v1';
 const mode=document.getElementById('pdfMode');
 const sort=document.getElementById('sortMode');
 const area=document.getElementById('taskSelection');
 const seStrike=document.getElementById('seStrike');
 const blankoMode=document.getElementById('blankoPdfMode');
 if(!mode||!sort||!area)return;
 const allowed=(select,value)=>[...select.options].some(o=>o.value===value);
 let saved=null;
 try{saved=JSON.parse(localStorage.getItem(key)||'null');}catch(e){}
 if(saved&&typeof saved==='object'){
  if(typeof saved.pdfMode==='string'&&allowed(mode,saved.pdfMode))mode.value=saved.pdfMode;
  if(typeof saved.sortMode==='string'&&allowed(sort,saved.sortMode))sort.value=saved.sortMode;
  if(typeof saved.seStrike==='boolean' && seStrike)seStrike.checked=saved.seStrike;
  if(Array.isArray(saved.tasks)){
   const choices=new Set(saved.tasks.filter(x=>typeof x==='string'));
   for(const input of area.querySelectorAll('input[type="checkbox"][data-category]')){
    input.checked=choices.has(JSON.stringify([input.dataset.category,input.value]));
   }
  }
 }
 if(blankoMode)blankoMode.value=mode.value;
 if(typeof checkTasks==='function')checkTasks();
 function save(){
  const tasks=[...area.querySelectorAll('input[type="checkbox"][data-category]:checked')]
   .map(x=>JSON.stringify([x.dataset.category,x.value]));
  try{localStorage.setItem(key,JSON.stringify({pdfMode:mode.value,sortMode:sort.value,seStrike:seStrike?.checked??true,tasks}));}
  catch(e){/* Browser erlaubt ggf. keine Speicherung; Anwendung bleibt nutzbar. */}
 }
 mode.addEventListener('change',()=>{if(blankoMode)blankoMode.value=mode.value;save();});
 sort.addEventListener('change',save);
 area.addEventListener('change',save);
 seStrike?.addEventListener('change',save);
})();

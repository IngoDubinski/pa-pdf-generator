"use strict";
/* Klassenverbund: lokale Zuordnung, keine Speicherung oder Übertragung. */
(()=>{
 const root=document.getElementById('paVerbund');
 const active=document.getElementById('verbundAktiv');
 const blockBox=document.getElementById('verbundBlocks');
 const groupBox=document.getElementById('verbundGroups');
 const info=document.getElementById('verbundStatus');
 const categories=['AK I','AK II','AK III'];
 const blockChoice={}; // pro Kategorie Name der Aufgabe in Block A
 const assignments=new Map(); // Klasse/Gruppe -> {a,b}; keine Persistenz
 const key=(sheet,group)=>`${sheet}::${group}`;
 const clean=s=>String(s||'').trim();
 const option=(v,selected)=>{const o=document.createElement('option');o.value=v;o.textContent=v;o.selected=v===selected;return o;};
 const tasksByCat=()=>Object.fromEntries(categories.map(c=>[c,taskList().filter(t=>t.category===c).map(t=>t.name)]));
 function drawBlocks(){
  blockBox.replaceChildren();
  const by=tasksByCat();
  const title=document.createElement('p');title.innerHTML='<strong>Aufgabenblöcke für alle Gruppen</strong>';blockBox.append(title);
  for(const cat of categories){
   const names=by[cat];const row=document.createElement('div');row.style.cssText='display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:8px 0';
   const label=document.createElement('label');label.textContent=cat+' – Block A: ';
   const select=document.createElement('select');select.dataset.category=cat;
   if(names.length!==2){select.append(option('Bitte zwei Aufgaben auswählen','Bitte zwei Aufgaben auswählen'));select.disabled=true;}
   else{if(!names.includes(blockChoice[cat]))blockChoice[cat]=names[0];for(const name of names)select.append(option(name,blockChoice[cat]));}
   label.append(select);row.append(label);
   const other=document.createElement('span');other.textContent='Block B: '+(names.length===2?names.find(n=>n!==blockChoice[cat]):'–');row.append(other);
   blockBox.append(row);
  }
 }
 function drawGroups(){
  groupBox.replaceChildren();
  const sheets=currentReport.filter(r=>!r.errors.length);
  if(!sheets.length){groupBox.textContent='Bitte zuerst eine Excel-Datei mit Gruppen und Beobachtern laden.';return;}
  for(const sheet of sheets){
   const groups=[...new Set(sheet.students.map(r=>r.group).filter(g=>g!=null))].sort((a,b)=>a-b);
   if(!groups.length)continue;
   const h=document.createElement('h4');h.textContent='Klasse '+sheet.name.toUpperCase();groupBox.append(h);
   for(const group of groups){
    const rows=sheet.students.filter(r=>r.group===group);
    const pairs=rows.map(r=>[clean(r.observer1),clean(r.observer2)]);
    const unique=[...new Set(pairs.flat().filter(Boolean))];
    const k=key(sheet.name,group);
    if(!assignments.has(k)){
     const first=clean(rows[0].observer1),second=clean(rows[0].observer2);
     // Gleiche Beobachter betreuen zwei aufeinanderfolgende Gruppen.
     // In der zweiten Gruppe tauschen die Gruppen den Aufgabenblock,
     // nicht die Beobachter ihre Aufgaben.
     const secondGroup=Number(group)%2===0;
     assignments.set(k,secondGroup?{a:second,b:first}:{a:first,b:second});
    }
    const state=assignments.get(k);
    const div=document.createElement('div');div.style.cssText='display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #ddd';
    const name=document.createElement('strong');name.textContent=`Gruppe ${group} (${rows.length} Schüler)`;div.append(name);
    for(const block of ['a','b']){
     const label=document.createElement('label');label.textContent=`Block ${block.toUpperCase()}: `;
     const sel=document.createElement('select');sel.dataset.key=k;sel.dataset.block=block;
     sel.append(option('',''));
     for(const person of [...new Set([...unique,state.a,state.b].filter(Boolean))])sel.append(option(person,state[block]));
     label.append(sel);div.append(label);
    }
    const swap=document.createElement('button');swap.type='button';swap.textContent='Tauschen';swap.dataset.swap=k;div.append(swap);
    if(pairs.some(pair=>pair[0]!==pairs[0][0]||pair[1]!==pairs[0][1])){
     const warn=document.createElement('small');warn.className='err';warn.textContent=' Unterschiedliche Beobachternamen innerhalb dieser Gruppe in Excel – bitte prüfen.';div.append(warn);
    }
    groupBox.append(div);
   }
  }
  if(!groupBox.children.length)groupBox.textContent='Keine Gruppennummern vorhanden. Bei SaxSVS-Import bitte Gruppenzuordnung in Excel ergänzen.';
 }
 function refresh(){drawBlocks();drawGroups();updateStatus();}
 function updateStatus(){
  if(!active.checked){info.textContent='Deaktiviert: Beobachterfeld auf BB bleibt leer.';return;}
  const by=tasksByCat();
  const invalid=categories.some(c=>by[c].length!==2);
  const missing=[...assignments.values()].filter(x=>!x.a||!x.b||x.a===x.b).length;
  info.textContent=(invalid?'Bitte zuerst genau zwei Aufgaben je Arbeitskreis wählen. ':'')+(missing?`${missing} Gruppe(n) ohne vollständige, unterschiedliche Beobachterzuordnung: BB-Feld dort leer. `:'')+'Die Zuordnung wird nur für diese Sitzung verwendet.';
 }
 blockBox.addEventListener('change',e=>{if(e.target.matches('select[data-category]')){blockChoice[e.target.dataset.category]=e.target.value;drawBlocks();updateStatus();}});
 groupBox.addEventListener('change',e=>{const el=e.target;if(!el.matches('select[data-key]'))return;assignments.get(el.dataset.key)[el.dataset.block]=el.value;updateStatus();});
 groupBox.addEventListener('click',e=>{const el=e.target;if(!el.matches('button[data-swap]'))return;const state=assignments.get(el.dataset.swap);[state.a,state.b]=[state.b,state.a];drawGroups();updateStatus();});
 active.addEventListener('change',updateStatus);
 document.getElementById('taskSelection').addEventListener('change',()=>{drawBlocks();updateStatus();});
 // App-Import (Excel und SaxSVS) ruft refreshExpertClasses nach dem Einlesen auf.
 const oldRefresh=window.refreshExpertClasses;
 window.refreshExpertClasses=function(...args){const ret=oldRefresh(...args);assignments.clear();refresh();return ret;};
 window.PAVerbund={observerFor(sheet,record,task){
  if(!active.checked||record.group==null||!task)return '';
  const by=tasksByCat();if(categories.some(c=>by[c].length!==2))return '';
  const a=blockChoice[task.category];const b=by[task.category].find(x=>x!==a);
  const state=assignments.get(key(sheet,record.group));
  if(!state||!state.a||!state.b||state.a===state.b)return '';
  return task.name===a?state.a:task.name===b?state.b:'';
 }};
 refresh();
})();

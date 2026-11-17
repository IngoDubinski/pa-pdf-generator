'use strict';
(()=>{
const C=EPCore,S=EPSelection,$=id=>document.getElementById(id);
let generating=false;let students=[],importWarnings=[],activeClass='',kpFiles=[],pvFiles=[],indexKP=new Map(),indexPV=new Map(),scanWarnings=[],signBytes=null,template=null;
const epProgress=PAProgress.connect('epProgress');let lastClassPdfUrl=null;const pause=()=>new Promise(r=>setTimeout(r,0));
window.addEventListener('pagehide',()=>{if(lastClassPdfUrl)URL.revokeObjectURL(lastClassPdfUrl);});
const classDrafts=new Map(),selectedByClass=new Map();let lastDraft=null;const dkey='pa-ep-web-v020-', dbname='pa-ep-signature';
const localGet=(key,def='')=>{try{return localStorage.getItem(dkey+key)??def;}catch{return def;}};
const localSet=(key,v)=>{try{localStorage.setItem(dkey+key,v);}catch{}};
$('epSchool').value=localGet('school','');$('epStaff').value=localGet('staff','');$('epSort').value=localGet('sort-v2','nr');
$('epSchool').addEventListener('input',()=>localSet('school',$('epSchool').value));$('epStaff').addEventListener('input',()=>localSet('staff',$('epStaff').value));$('epSort').addEventListener('change',()=>{localSet('sort-v2',$('epSort').value);renderPicker();});
$('epGoals').value=C.GOALS;
for(const name of C.EVENTS){const l=document.createElement('label');l.textContent=name;const i=document.createElement('input');i.type='date';i.dataset.event=name;l.append(i);$('epEvents').append(l);}
const extraList=$('epExtraList');
function renderExtraCount(){
 const count=extraList.querySelectorAll('.ep-extra-row').length;
 $('epExtraCount').textContent=`${count} zusätzliche Veranstaltung${count===1?'':'en'} erfasst.`;
}
function addExtraEvent({date='',name='',place='Schule'}={}){
 const row=document.createElement('div');row.className='ep-extra-row';
 const datelabel=document.createElement('label');datelabel.textContent='Datum';
 const inputDate=document.createElement('input');inputDate.type='date';inputDate.className='ep-extra-date';inputDate.value=/^\d{4}-\d{2}-\d{2}$/.test(date)?date:'';datelabel.append(inputDate);
 const eventlabel=document.createElement('label');eventlabel.textContent='Veranstaltung';
 const inputName=document.createElement('input');inputName.type='text';inputName.className='ep-extra-name';inputName.placeholder='z. B. Betriebserkundung';inputName.maxLength=150;inputName.value=name;eventlabel.append(inputName);
 const placelabel=document.createElement('label');placelabel.textContent='Ort';
 const select=document.createElement('select');select.className='ep-extra-place';
 for(const item of C.BO_LOCATIONS)select.append(new Option(item,item));
 select.value=C.BO_LOCATIONS.includes(place)?place:'Schule';placelabel.append(select);
 const del=document.createElement('button');del.type='button';del.className='ep-extra-delete';del.textContent='Entfernen';del.setAttribute('aria-label','Zusätzliche Veranstaltung entfernen');
 del.addEventListener('click',()=>{row.remove();renderExtraCount();});
 row.append(datelabel,eventlabel,placelabel,del);extraList.append(row);renderExtraCount();
}
function extraEvents(){return [...extraList.querySelectorAll('.ep-extra-row')].map(row=>({
 date:row.querySelector('.ep-extra-date').value,
 name:row.querySelector('.ep-extra-name').value.trim(),
 place:row.querySelector('.ep-extra-place').value
}));}
$('epAddExtra').addEventListener('click',()=>addExtraEvent());
function snapshot(){return {goals:$('epGoals').value,events:Object.fromEntries([...document.querySelectorAll('[data-event]')].map(x=>[x.dataset.event,x.value])),extraEvents:extraEvents()};}
function restore(draft){$('epGoals').value=draft.goals;for(const i of document.querySelectorAll('[data-event]'))i.value=draft.events?.[i.dataset.event]||'';extraList.replaceChildren();for(const item of draft.extraEvents||[])addExtraEvent(item);renderExtraCount();}
function selectedIndexSet(){if(!selectedByClass.has(activeClass))selectedByClass.set(activeClass,new Set());return selectedByClass.get(activeClass);}
function renderPicker(){
 const list=$('epSingleList'),selection=selectedIndexSet();
 const visible=S.entries(students,activeClass,$('epSingleSearch').value,$('epSort').value);
 list.replaceChildren();
 for(const {student,index} of visible){
  const label=document.createElement('label'),checkbox=document.createElement('input'),name=document.createElement('span'),id=document.createElement('small');
  checkbox.type='checkbox';checkbox.checked=selection.has(index);checkbox.setAttribute('aria-label',student.name);
  checkbox.addEventListener('change',()=>{checkbox.checked?selection.add(index):selection.delete(index);updateSelectionCount();});
  name.textContent=student.name;id.textContent=student.id==null?'ID fehlt':'ID '+student.id;
  label.append(checkbox,name,id);list.append(label);
 }
 if(!visible.length){const empty=document.createElement('p');empty.className='ep-empty';empty.textContent=students.length?'Keine Schüler für diese Suche gefunden.':'Bitte zuerst eine Excel-Liste laden.';list.append(empty);}
 updateSelectionCount();
}
function updateSelectionCount(){
 const selection=selectedIndexSet(),total=S.entries(students,activeClass).length,n=S.selected(students,activeClass,selection).length;
 $('epSingleCount').textContent=`${n} von ${total} Schülern ausgewählt.`;
 $('epGenerateSelected').disabled=generating||!n;
}
function switchClass(to){
 if(activeClass){const d=snapshot();classDrafts.set(activeClass,d);lastDraft=d;}
 else if(!lastDraft)lastDraft=snapshot();
 activeClass=to;restore(classDrafts.get(to)||lastDraft||{goals:C.GOALS,events:{},extraEvents:[]});
 const members=students.filter(x=>x.cls===to);
 $('epClassInfo').textContent=to?`${to.toUpperCase()}: ${members.length} Schüler`:'Keine Klasse gewählt';
 $('epOutputStatus').textContent='Klasse '+to+' gewählt. Vor Ausgabe bitte Zuordnung prüfen.';
 $('epSingleClass').value=to;$('epSingleSearch').value='';renderPicker();
}
$('epSingleClass').addEventListener('change',e=>{$('epClass').value=e.target.value;switchClass(e.target.value);});
$('epSingleSearch').addEventListener('input',renderPicker);
$('epSelectVisible').addEventListener('click',()=>{const set=selectedIndexSet();for(const {index} of S.entries(students,activeClass,$('epSingleSearch').value))set.add(index);renderPicker();});
$('epSelectNone').addEventListener('click',()=>{selectedIndexSet().clear();renderPicker();});
$('epClass').addEventListener('change',e=>switchClass(e.target.value));
$('epExcel').addEventListener('change',async()=>{const file=$('epExcel').files[0];if(!file)return;try{
 const result=await C.excel(file);students=result.students;importWarnings=result.warnings;const classes=[...new Set(students.map(x=>x.cls))].sort();$('epClass').replaceChildren(...classes.map(x=>new Option(x.toUpperCase(),x)));$('epSingleClass').replaceChildren(...classes.map(x=>new Option(x.toUpperCase(),x)));classDrafts.clear();selectedByClass.clear();activeClass='';lastDraft=null;switchClass(classes[0]);$('epImportStatus').textContent=`${students.length} Schüler in ${classes.length} Klasse(n) eingelesen.\n${result.warnings.slice(0,12).join('\n')||'Keine Importwarnungen.'}`;
}catch(e){$('epImportStatus').textContent='Excel-Import fehlgeschlagen: '+e.message;students=[];activeClass='';$('epClass').replaceChildren(new Option('Bitte zuerst Excel laden',''));$('epSingleClass').replaceChildren(new Option('Erst Excel importieren',''));selectedByClass.clear();renderPicker();}});
$('epKP').onchange=()=>{kpFiles=[...$('epKP').files];$('epImportStatus').textContent+=`\n${kpFiles.length} KP-Datei(en) ausgewählt.`;};
$('epPV').onchange=()=>{pvFiles=[...$('epPV').files];$('epImportStatus').textContent+=`\n${pvFiles.length} PV-Datei(en) ausgewählt.`;};
$('epMode').addEventListener('change',()=>{const file=$('epMode').value==='files';$('epFolderArea').hidden=!file;$('epOutputHint').textContent=file?'Die ZIP-Datei enthält einen Klassenordner. Der Browser speichert sie in deinem üblichen Downloadordner.':'Die Klassen-PDF wird heruntergeladen. Anschließend erscheint ein Link zum Öffnen und Drucken. Kein leeres neues Browserfenster.';});
async function openDB(){return new Promise((ok,fail)=>{const r=indexedDB.open(dbname,1);r.onupgradeneeded=()=>r.result.createObjectStore('assets');r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error);});}
async function storeSig(data){const db=await openDB();try{await new Promise((ok,no)=>{const tx=db.transaction('assets','readwrite');tx.objectStore('assets').put(data,'signature');tx.oncomplete=ok;tx.onerror=()=>no(tx.error);});}finally{db.close();}}
async function readSig(){const db=await openDB();try{return await new Promise((ok,no)=>{const tx=db.transaction('assets','readonly'),r=tx.objectStore('assets').get('signature');r.onsuccess=()=>ok(r.result||null);r.onerror=()=>no(r.error);});}finally{db.close();}}
async function forgetSig(){const db=await openDB();try{await new Promise((ok,no)=>{const tx=db.transaction('assets','readwrite');tx.objectStore('assets').delete('signature');tx.oncomplete=ok;tx.onerror=()=>no(tx.error);});}finally{db.close();}}
async function initSig(){try{signBytes=PAProfile.getSignatureBytes()||await readSig();$('epSignStatus').textContent=signBytes?'Eine lokale Unterschrift ist gespeichert.':'Noch keine Unterschrift gespeichert.';}catch(e){$('epSignStatus').textContent='Browser-Speicher für Unterschrift nicht verfügbar: '+e.message;}}initSig();window.addEventListener('pa-profile-changed',()=>{const b=PAProfile.getSignatureBytes();if(b){signBytes=b;$('epUseSign').checked=PAProfile.get()?.useSignature!==false;$('epSignStatus').textContent='Unterschrift aus persönlichem Profil übernommen.';}});
$('epSignFile').addEventListener('change',async()=>{const f=$('epSignFile').files[0];if(!f)return;if(!/^image\/(png|jpeg)$/.test(f.type)){alert('Bitte PNG oder JPG wählen.');return;}try{signBytes=new Uint8Array(await f.arrayBuffer());await storeSig(signBytes);$('epUseSign').checked=true;$('epSignStatus').textContent=`Unterschrift lokal gespeichert (${f.name}).`;}catch(e){$('epSignStatus').textContent='Unterschrift konnte nicht gespeichert werden: '+e.message;}});
$('epForgetSign').addEventListener('click',async()=>{try{await forgetSig();signBytes=null;$('epSignFile').value='';$('epSignStatus').textContent='Unterschrift gelöscht.';}catch(e){alert(e.message);}});
async function scan(onProgress=null,onlyStudents=null){if(!students.length||!activeClass)throw Error('Bitte zuerst Excel-Schülerliste und Klasse wählen.');
 const progress=(start,span,kind)=>(p)=>{const fraction=(p.fileIndex+p.page/Math.max(1,p.pageCount))/Math.max(1,p.fileCount);onProgress?.(start+span*fraction,`${kind}: ${p.file} · Seite ${p.page}/${p.pageCount}`);};
 const kp=await C.indexPdfs(kpFiles,'KP',activeClass,onProgress?progress(4,14,'KP'):null);onProgress?.(18,'KP-Abgleich abgeschlossen.');
 const pv=await C.indexPdfs(pvFiles,'PV',activeClass,onProgress?progress(18,12,'PV'):null);onProgress?.(30,'Excel- und PDF-IDs werden abgeglichen.');indexKP=kp.index;indexPV=pv.index;scanWarnings=[...kp.warnings,...pv.warnings];
 const selected=onlyStudents||students.filter(s=>s.cls===activeClass),known=new Set(),warnings=[];for(const s of selected){const key=`${s.cls}:${s.id}`;if(s.id==null){warnings.push(`${s.name}: Schüler-ID in Excel fehlt.`);continue;}if(known.has(key)){warnings.push(`${activeClass} ID ${s.id} doppelt in Excel – bitte korrigieren.`);continue;}known.add(key);if(!indexKP.get(key)){warnings.push(`ID ${s.id} ${s.name}: KP fehlt – EP trotzdem möglich, kein KP/PV.`);continue;}if(!indexKP.get(key)?.assessment?.hasValues)warnings.push(`ID ${s.id} ${s.name}: Keine auswertbaren PA-Werte im KP.`);if(!indexPV.get(key))warnings.push(`ID ${s.id} ${s.name}: PV fehlt.`);}
 const extra=[...indexKP.keys()].filter(k=>k.startsWith(activeClass+':')&&!known.has(k));if(extra.length&&!onlyStudents)warnings.push(`Zusätzliche KP-IDs ohne Excel-Schüler: ${extra.slice(0,15).join(', ')}`);
 return {selected,warnings:[...scanWarnings,...warnings]};
}
$('epCheck').addEventListener('click',async()=>{const out=$('epOutputStatus');out.textContent='Prüfe IDs in den PDF-Dateien …';try{const {selected,warnings}=await scan();out.textContent=`Klasse ${activeClass}: ${selected.length} Schüler, ${selected.filter(x=>indexKP.get(`${x.cls}:${x.id}`)).length} KP, ${selected.filter(x=>indexPV.get(`${x.cls}:${x.id}`)).length} PV.\n${warnings.length?warnings.slice(0,40).join('\n'):'Alle vorhandenen IDs sind zugeordnet.'}`;}catch(e){out.textContent='Prüfung fehlgeschlagen: '+e.message;}});
function save(blob,name,keepForPrint=false){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();if(!keepForPrint)setTimeout(()=>URL.revokeObjectURL(url),90000);return url;}
const pick=()=>['EP','KP','PV'].filter(d=>$('epDoc'+d).checked);
const settings=()=>({school:$('epSchool').value.trim(),staff:$('epStaff').value.trim(),goals:$('epGoals').value,events:Object.fromEntries([...document.querySelectorAll('[data-event]')].map(x=>[x.dataset.event,x.value])),extraEvents:extraEvents()});
async function getTemplate(){if(!template){const r=await fetch('Vorlagen/EP/Entwicklungsplan_ausfuellbar.pdf');if(!r.ok)throw Error('EP-PDF-Vorlage nicht verfügbar.');template=new Uint8Array(await r.arrayBuffer());}return template;}
async function generate(single=false){
 if(generating)return;
 const btn=single?$('epGenerateSelected'):$('epGenerate'),out=$('epOutputStatus'),s=settings(),docs=pick(),mode=single?'single':$('epMode').value,folder=$('epFolder').value;
 if(!activeClass){out.textContent='Bitte zuerst Klasse wählen.';return;}if(single&&!S.selected(students,activeClass,selectedIndexSet()).length){out.textContent='Bitte mindestens einen Schüler für den Einzeldruck auswählen.';return;}if(!s.school){out.textContent='Schulname fehlt (Pflichtangabe).';return;}if(!docs.length){out.textContent='Bitte mindestens einen Dokumenttyp auswählen.';return;}
 const incomplete=s.extraEvents.filter(e=>(e.date||e.name)&&(!e.date||!e.name));
 if(docs.includes('EP')&&incomplete.length){out.textContent='Zusätzliche BO-Aktivität unvollständig: Bitte jeweils Datum und Veranstaltung eintragen oder die Zeile entfernen.';return;}
 generating=true;$('epGenerate').disabled=true;$('epGenerateSelected').disabled=true;$('epClass').disabled=true;$('epSingleClass').disabled=true;out.textContent='Verarbeitung startet …';$('epResultLinks').replaceChildren();
 if(lastClassPdfUrl){URL.revokeObjectURL(lastClassPdfUrl);lastClassPdfUrl=null;}
 epProgress.start('Vorbereitung: ausgewählte Klasse '+activeClass.toUpperCase());
 try{
  await pause(); // Browser darf Balken und Sanduhr malen, bevor die CPU-lastige PDF-Verarbeitung beginnt.
  const targets=single?S.selected(students,activeClass,selectedIndexSet()):null;
  const {selected,warnings}=await scan((pct,msg)=>epProgress.update(pct,msg),targets);
  const chosen=S.sortStudents(selected,$('epSort').value);
  if(!chosen.length)throw Error('Keine Schüler für diese Klasse.');
  epProgress.update(31,'EP-Vorlage laden und Dokumente vorbereiten …');await pause();
  const tpl=docs.includes('EP')?await getTemplate():null,sign=$('epUseSign').checked?signBytes:null,zip=new JSZip(),parts=[],skipped=[],realizedTypes=new Set();
  for(let i=0;i<chosen.length;i++){
   const st=chosen[i],key=`${st.cls}:${st.id}`,kp=indexKP.get(key),pv=indexPV.get(key),outputs=[];
   const label=`${i+1}/${chosen.length} Schüler: ${st.name}`;
   epProgress.update(33+53*i/chosen.length,label+' – Dokumente vorbereiten …');await pause();
   if(docs.includes('EP')){epProgress.update(33+53*(i+.2)/chosen.length,label+' – EP erstellen');outputs.push(['EP',await C.buildEP(st,s,kp?.assessment,tpl,sign)]);}
   if(kp){if(docs.includes('KP')){epProgress.update(33+53*(i+.45)/chosen.length,label+' – KP beschriften');outputs.push(['KP',await C.annotate(kp,'KP',st,s,sign)]);}
    if(docs.includes('PV')&&pv){epProgress.update(33+53*(i+.65)/chosen.length,label+' – PV beschriften');outputs.push(['PV',await C.annotate(pv,'PV',st,s,sign)]);}}
   for(const [kind] of outputs)realizedTypes.add(kind);
   if(!outputs.length){skipped.push(st.name);epProgress.update(33+53*(i+1)/chosen.length,label+' – keine passenden Dokumente');continue;}
   if(mode==='class'||mode==='single'){parts.push(...outputs.map(x=>x[1]));}
   else{
    const root=`${activeClass}/`,name=C.safe(st.name)+' '+activeClass;
    if(folder==='merged'){const joined=outputs.length===1?outputs[0][1]:await C.mergePdf(outputs.map(x=>x[1]));zip.file(`${root}${outputs.map(x=>x[0]).join('+')} ${name}.pdf`,joined);}
    else for(const [kind,pdf] of outputs){const dir=folder==='per_student'?`${root}${C.safe(st.name)} ${activeClass}/`:`${root}${({EP:'Entwicklungspläne',KP:'Kompetenzprofile',PV:'Profilvergleiche'})[kind]} ${activeClass}/`;zip.file(`${dir}${kind} ${name}.pdf`,pdf);}
   }
   epProgress.update(33+53*(i+1)/chosen.length,`${i+1}/${chosen.length} Schüler verarbeitet`);
   out.textContent=`${i+1}/${chosen.length} Schüler verarbeitet …`;
  }
  if(mode==='class'||mode==='single'){
   if(!parts.length)throw Error('Keine Dokumente zum Drucken vorhanden.');
   epProgress.update(87,`${parts.length} Dokumente zur Klassen-PDF zusammenfügen …`);await pause();
   const merged=await C.mergePdf(parts,({done,total})=>epProgress.update(87+11*done/total,`Klassen-PDF: ${done}/${total} Dokumente zusammengeführt`));
   const blob=new Blob([merged],{type:'application/pdf'}),filename=single?S.filename(chosen,activeClass,docs.filter(d=>realizedTypes.has(d)),C.safe):`EP Klassendruck ${activeClass} ${docs.join('+')}.pdf`;
   epProgress.update(99,'PDF wird zum Download bereitgestellt …');
   lastClassPdfUrl=save(blob,filename,true);
   // Erst ein ECHTER Klick öffnet das fertige PDF, nicht ein vorab erzeugtes leeres Popup.
   const link=document.createElement('a');link.href=lastClassPdfUrl;link.target='_blank';link.rel='noopener';link.className='pa-result-link';link.textContent='PDF öffnen / drucken';
   const hint=document.createElement('p');hint.textContent='Die Klassen-PDF wurde heruntergeladen. Zum Drucken auf „PDF öffnen / drucken“ klicken und im PDF-Viewer Strg+P verwenden.';
   $('epResultLinks').append(link,hint);
  }else{
   epProgress.update(87,'ZIP-Datei wird gepackt …');await pause();
   const blob=await zip.generateAsync({type:'blob'},meta=>epProgress.update(87+12*meta.percent/100,`ZIP wird gepackt: ${Math.round(meta.percent)} %`));
   save(blob,`EP_Generator_${activeClass}_${docs.join('+')}.zip`);
  }
  epProgress.finish('Die Ausgabe wurde erstellt und heruntergeladen.');
  out.textContent=`Fertig: ${activeClass.toUpperCase()}, ${chosen.length} Schüler${single?' (Einzeldruck-Auswahl)':''}.\n${warnings.length?warnings.slice(0,40).join('\n'):'Keine Warnungen.'}${skipped.length?'\nOhne ausgewählte Dokumente: '+skipped.join(', '):''}\nEP-Formularfelder bleiben bearbeitbar.`;
 }catch(e){epProgress.fail('Ausgabe fehlgeschlagen: '+e.message);out.textContent='Ausgabe fehlgeschlagen: '+e.message;console.error(e);}finally{generating=false;$('epClass').disabled=false;$('epSingleClass').disabled=false;$('epGenerate').disabled=false;updateSelectionCount();}
}
$('epGenerate').addEventListener('click',()=>generate(false));
$('epGenerateSelected').addEventListener('click',()=>generate(true));
renderPicker();
})();

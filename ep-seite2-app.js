'use strict';
(()=>{
 if(!PAAccess.allowed())return;
 document.getElementById('ep2App').hidden=false;
 const $=id=>document.getElementById(id), PDF=PDFLib;
 let entries=[], printBytes=null, printUrl=null, busy=false;
 const status=s=>{$('status').textContent=s;};
 const fileBytes=async f=>new Uint8Array(await f.arrayBuffer());
 const extPdf=f=>/\.pdf$/i.test(f.name);
 const displayName=e=>e.name||`(Name fehlt: ${e.file.name})`;
 const sorted=()=>[...new Set(entries.map(e=>e.cls).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'de',{numeric:true}));
 const lines=e=>e.error?'Nicht verarbeitet: '+e.error:e.next?typeof e.next==='number'?`Nächste freie Zeile ${e.next}/14`:`Weiter auf ${e.next}`:'Nicht beschreibbar';
 function visible(e){return !$('classFilter').value||e.cls===$('classFilter').value;}
 function redraw(){
  const select=$('classFilter'),old=select.value;select.replaceChildren(new Option('Alle Klassen',''));sorted().forEach(c=>select.add(new Option(c,c)));select.value=sorted().includes(old)?old:'';
  const box=$('roster');box.replaceChildren();
  for(let n=0;n<entries.length;n++){
   const e=entries[n];if(!visible(e))continue;
   const label=document.createElement('label');label.className='ep2-student'+(!e.next?' blocked':'');
   const check=document.createElement('input');check.type='checkbox';check.checked=e.selected;check.disabled=!e.next;check.onchange=()=>{e.selected=check.checked;summary();};
   const content=document.createElement('span');const strong=document.createElement('strong');strong.textContent=displayName(e);
   const sub=document.createElement('small');sub.textContent=` · ${e.cls||'Klasse fehlt'} · ${lines(e)} · ${e.file.name}`;
   content.append(strong,sub);label.append(check,content);box.append(label);
  }
  if(!box.children.length)box.textContent='Keine PDFs in dieser Auswahl.';
  summary();
 }
 function summary(){$('rosterSummary').textContent=`${entries.length} PDF(s) eingelesen · ${entries.filter(e=>e.selected&&e.next).length} zur Fortschreibung ausgewählt · ${entries.filter(e=>!e.next).length} nicht beschreibbar.`;}
 async function inspectFiles(files){
  if(busy)return;busy=true;$('generate').disabled=true;entries=[];printBytes=null;resetPrint();status('PDFs werden lokal geprüft …');
  for(const file of files.filter(extPdf)){
   const entry={file,name:'',cls:'',next:null,selected:false,error:null};
   try{
    const src=await fileBytes(file);const doc=await PDF.PDFDocument.load(src,{ignoreEncryption:false});
    if(doc.getPageCount()<2)throw Error('Weniger als zwei Seiten');
    const form=doc.getForm(),p=EPSeite2Core.person(form),v=EPSeite2Core.inspect(form);
    if(!p.name||!p.cls)throw Error('Name oder Klasse ist im PDF nicht ausgefüllt');
    Object.assign(entry,{name:p.name,cls:p.cls,next:v.next,selected:!!v.next});
   }catch(err){entry.error=String(err.message||err)}
   entries.push(entry);
  }
  entries.sort((a,b)=>(a.cls||'').localeCompare(b.cls||'','de',{numeric:true})||(a.name||'').localeCompare(b.name||'','de'));
  busy=false;$('generate').disabled=false;redraw();if(document.querySelector('input[name="mode"]:checked').value==='class'&&sorted().length){$('classFilter').value=sorted()[0];redraw();}status(`${entries.length} PDF(s) geprüft. Bitte Schülerauswahl und Veranstaltungsdaten kontrollieren.`);
 }
 function resetPrint(){if(printUrl)URL.revokeObjectURL(printUrl);printUrl=null;$('print').disabled=true;$('downloadPrint').disabled=true;}
 $('files').addEventListener('change',e=>inspectFiles([...e.target.files]));
 $('folder').addEventListener('change',e=>inspectFiles([...e.target.files]));
 $('classFilter').onchange=()=>{const v=$('classFilter').value;if(document.querySelector('input[name="mode"]:checked').value==='class'&&!v&&sorted().length){$('classFilter').value=sorted()[0];}redraw();};
 document.querySelectorAll('input[name="mode"]').forEach(x=>x.onchange=()=>{if(x.value==='mixed')$('classFilter').value='';else if(sorted().length)$('classFilter').value=sorted()[0];redraw();});
 $('selectAll').onclick=()=>{entries.filter(visible).forEach(e=>{if(e.next)e.selected=true});redraw();};
 $('selectNone').onclick=()=>{entries.filter(visible).forEach(e=>e.selected=false);redraw();};
 function data(){const date=$('eventDate').value,title=$('eventTitle').value.trim(),place=$('eventPlace').value.trim(),notes=$('eventNotes').value.trim(),rating=$('eventRating').value;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!title)throw Error('Datum und Veranstaltungstitel sind Pflicht.');
  const [y,m,d]=date.split('-');return {date:`${d}.${m}.${y.slice(-2)}`,title,place:place||'Schule',notes,rating};
 }
 function pdfName(e){const base=(e.file.name||'EP.pdf').replace(/\.pdf$/i,'');return EPSeite2Core.safeFile(base)+'_BO_ergaenzt.pdf';}
 function uniqueName(name,used){let result=name,n=2;while(used.has(result.toLowerCase())){result=name.replace(/\.pdf$/i,`_${n++}.pdf`);}used.add(result.toLowerCase());return result;}
 async function buildPrint(docs){
  const output=await PDF.PDFDocument.create();
  // Convert *copies* to fixed print pages. Original/edited individual PDFs stay fillable.
  for(const bytes of docs){
   const source=await PDF.PDFDocument.load(bytes);try{source.getForm().flatten()}catch(e){throw Error('Druck-PDF kann nicht sicher erstellt werden: '+e.message)}
   const pages=await output.copyPages(source,source.getPageIndices());pages.forEach(p=>output.addPage(p));
  }
  return output.save({useObjectStreams:false});
 }
 function download(bytes,name,mime){const blob=new Blob([bytes],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
 async function writeFolder(dir,results){
  // This folder is used ONLY for new output files. Never overwrite any existing file.
  const names=[];for await(const [name] of dir.entries())names.push(name.toLowerCase());const used=new Set(names);
  for(const {name,bytes} of results){let output=uniqueName(name,used);const handle=await dir.getFileHandle(output,{create:true});const writer=await handle.createWritable();await writer.write(bytes);await writer.close();}
 }
 $('generate').onclick=async()=>{
  if(busy)return;
  const classMode=document.querySelector('input[name="mode"]:checked').value==='class';
  if(classMode&&!$('classFilter').value){status('Bitte eine Klasse auswählen.');return;}
  const chosen=entries.filter(e=>e.selected&&e.next&&(!classMode||e.cls===$('classFilter').value));if(!chosen.length){status('Bitte mindestens einen beschreibbaren EP auswählen.');return;}
  let event;try{event=data();}catch(err){status(err.message);return;}
  const destination=document.querySelector('input[name="destination"]:checked').value;
  let dir=null;
  if(destination==='folder'){
   if(typeof window.showDirectoryPicker!=='function'){status('Ordnerauswahl wird in diesem Browser nicht unterstützt. Bitte ZIP-Ausgabe wählen.');return;}
   try{dir=await window.showDirectoryPicker({mode:'readwrite'});}catch(err){status('Ordnerauswahl abgebrochen: '+err.message);return;}
  }
  busy=true;$('generate').disabled=true;resetPrint();
  const results=[],logs=[],changed=new Map();const used=new Set();
  for(const e of chosen){
   try{
    const doc=await PDF.PDFDocument.load(await fileBytes(e.file));const form=doc.getForm();
    // Fail closed: re-read all rows immediately before modification.
    const row=await EPSeite2Core.append(doc,event);
    const bytes=await doc.save({useObjectStreams:false,updateFieldAppearances:true});
    const name=uniqueName(pdfName(e),used);results.push({name,bytes});changed.set(e,bytes);logs.push(`OK ${displayName(e)} (${e.cls}): BO-Zeile ${row}`);
   }catch(err){logs.push(`ÜBERSPRUNGEN ${displayName(e)}: ${err.message}`);}
   status(`${results.length} Dateien vorbereitet.\n`+logs.join('\n'));
  }
  if(!results.length){busy=false;$('generate').disabled=false;return;}
  try{
   if(dir){await writeFolder(dir,results);}else{
    const zip=new JSZip();for(const r of results)zip.file(r.name,r.bytes);
    const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE'});download(blob,`PA-Tools_v1.6.6_EP2_${new Date().toISOString().slice(0,10)}.zip`,'application/zip');
   }
   const scope=$('printScope').value;const printDocs=[];
   for(const e of entries){
    if(scope==='changed'&&!changed.has(e))continue;
    if(e.error)continue;
    if(classMode&&e.cls!==$('classFilter').value)continue;
    if(changed.has(e))printDocs.push(changed.get(e));else{
     try{const bytes=await fileBytes(e.file);const check=await PDF.PDFDocument.load(bytes);if(check.getPageCount()<2)throw Error('kein EP');printDocs.push(bytes);}catch(err){logs.push(`NICHT DRUCKBAR ${displayName(e)}: ${err.message}`)}
    }
   }
   if(printDocs.length){
    try{printBytes=await buildPrint(printDocs);$('print').disabled=false;$('downloadPrint').disabled=false;}
    catch(err){logs.push('Druckausgabe nicht verfügbar: '+err.message);}
   }
   logs.push(`Fertig: ${results.length} neue EP-PDF(s) ausgegeben. Originale unverändert.`);
  }catch(err){logs.push('Fehler bei der Ausgabe: '+err.message);}
  busy=false;$('generate').disabled=false;status(logs.join('\n'));
 };
 $('print').onclick=()=>{if(!printBytes)return;resetUrl();window.open(printUrl,'_blank','noopener');};
 function resetUrl(){if(printUrl)URL.revokeObjectURL(printUrl);printUrl=URL.createObjectURL(new Blob([printBytes],{type:'application/pdf'}));}
 $('downloadPrint').onclick=()=>{if(printBytes)download(printBytes,'EP_2_Seite_Sammeldruck.pdf','application/pdf')};
})();

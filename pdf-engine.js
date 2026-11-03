"use strict";
// Browser-only PDF generator. All processing in memory, no fetch to external domains.
// pdf-lib (MIT) must be present locally in js/pdf-lib.min.js.
const SKILLS={
 'AK I':['Kommunikationsfähigkeit','Kritikfähigkeit','Teamfähigkeit','Planungsfähigkeit'],
 'AK II':['Problemlösefähigkeit','Durchhaltevermögen','Verantwortungsfähigkeit'],
 'AK III':['Selbständigkeit','Ordentlichkeit','Feinmotorische Fähigkeit','Arbeitsgenauigkeit','Arbeitstempo']
};
const templates={BB:'Vorlagen/Vorlage Beobachtungsbogen.pdf',BBK:'Vorlagen/Vorlage Beobachterkonferenzbogen.pdf',SE:'Vorlagen/Vorlage Selbsteinschaetzungsbogen.pdf'};
const fileLabel={BBK:'Beobachterkonferenzbogen',SE:'Selbsteinschätzung'};
const safeName=s=>String(s).replace(/[<>:"/\\|?*\x00-\x1f]/g,'').trim().replace(/[. ]+$/,'')||'Unbenannt';
const setStatus=(s,isError=false)=>{const e=document.getElementById('generationStatus');e.textContent=s;e.className=isError?'err':'ok';};
function taskList(){return Object.keys(tasks).flatMap(cat=>[...area.querySelectorAll(`input[data-category="${cat}"]:checked`)].map(el=>({category:cat,name:el.value})));}
function checkedDocs(){return ['BB','BBK','SE'].filter(k=>document.getElementById('doc'+k).checked);}
function setText(form,key,value){try{const field=form.getTextField(key);field.setText(String(value));return true;}catch(e){return false;}}
function setCheck(form,key){try{form.getCheckBox(key).check();}catch(e){throw new Error('Checkbox nicht gefunden: '+key+' ('+e.message+')');}}
function removeRadioWidgets(pdf){
 // Remove radio widget annotations from pages AND corresponding fields from AcroForm.
 // This is for FLATTENED output only; no radio dots may be introduced by flatten().
 const {PDFName,PDFArray}=PDFLib;
 const form=pdf.getForm();
 const names=form.getFields().filter(field=>field instanceof PDFLib.PDFRadioGroup).map(field=>field.getName());
 for(const name of names){
   try{form.removeField(form.getRadioGroup(name));}catch(e){throw new Error('Radiofeld '+name+': '+e.message);}
 }
}
function resetRadioStates(pdf){
 // For editable mode force /V /Off on the parent and /AS /Off on all widgets.
 const {PDFName}=PDFLib;
 const form=pdf.getForm();
 for(const field of form.getFields()){
  if(!(field instanceof PDFLib.PDFRadioGroup))continue;
  const acro=field.acroField;
  acro.dict.set(PDFName.of('V'),PDFName.of('Off'));
  for(const widget of acro.getWidgets())widget.dict.set(PDFName.of('AS'),PDFName.of('Off'));
 }
}
function renameFields(pdf,prefix){
 // Renaming after copying is unnecessary: each student's form is flattened BEFORE copying.
 // Editable export is assembled as separate independent field dictionaries with unique names.
 const form=pdf.getForm();
 for(const field of form.getFields()){
  const original=field.getName();
  field.acroField.setPartialName(prefix+original);
 }
}
async function makeOne(templateBytes,record,sheet,kind,task,selected,editable,serial){
 const pdf=await PDFLib.PDFDocument.load(templateBytes,{updateMetadata:false});
 const form=pdf.getForm();
 const fullName=record.group==null?record.name:`${record.name} (${record.group})`;
 const values={'Name Schüler/in':fullName,'Name Schüler':fullName,'Datum':record.date,'AC Einheit':`PA ${record.date.slice(-4)} ${sheet.toLowerCase()}`};
 if(kind==='BB')values['Aufgbe']=task.name;
 if(kind==='BBK')Object.assign(values,{'Name Beobachter/in':record.observer1||'','Name 2. Beobachter/in':record.observer2||'','Aufgaben':selected.map(t=>t.name).join(', ')});
 for(const [k,v] of Object.entries(values))setText(form,k,v);
 if(kind==='BB')for(const skill of SKILLS[task.category])setCheck(form,skill);
 if(kind==='BBK'||kind==='SE'){
  if(editable)resetRadioStates(pdf);else removeRadioWidgets(pdf);
 }
 if(editable){renameFields(pdf,`s${String(serial).padStart(4,'0')}_`);}
 else{form.flatten({updateFieldAppearances:true});}
 return pdf;
}
async function joinStudents(bytes,records,sheet,kind,task,selected,editable){
 const output=await PDFLib.PDFDocument.create();
 const {PDFName,PDFDict}=PDFLib;
 const seen=new Set();
 for(let i=0;i<records.length;i++){
  const pdf=await makeOne(bytes,records[i],sheet,kind,task,selected,editable,i+1);
  const pages=await output.copyPages(pdf,pdf.getPageIndices());
  for(const page of pages){
   output.addPage(page);
   if(!editable)continue;
   // CopyPages kopiert Widget-Annotationen, aber nicht den AcroForm-Feldindex.
   // Referenzen aus den kopierten Seiten als Formularfelder registrieren.
   const annotations=page.node.Annots();
   if(!annotations)continue;
   for(let j=0;j<annotations.size();j++){
    const annotRef=annotations.get(j);
    const annot=output.context.lookup(annotRef,PDFDict);
    if(!annot)continue;
    const parent=annot.get(PDFName.of('Parent'));
    const fieldRef=parent||annotRef;
    const key=fieldRef.toString();
    if(seen.has(key))continue;
    seen.add(key);
    output.catalog.getOrCreateAcroForm().addField(fieldRef);
   }
  }
 }
 if(editable){
  // Prüfen, ob die kopierten Felddefinitionen weiterhin erreichbar sind.
  const fields=output.getForm().getFields();
  if(!fields.length)throw Error('Keine bearbeitbaren Formularfelder übernommen.');
 }
 return output.save({useObjectStreams:false});
}
async function generatePDFs(){
 const btn=document.getElementById('generateButton');
 if(!window.PDFLib){setStatus('Die mitgelieferte PDF-Bibliothek fehlt (js/pdf-lib.min.js). Bitte ZIP vollständig entpacken.',true);return;}
 if(!currentReport.length){setStatus('Bitte zuerst eine Excel-Datei auswählen.',true);return;}
 if(!checkTasks()){setStatus('Bitte genau zwei Aufgaben je Kategorie wählen.',true);return;}
 const classes=selectedClasses(),docs=checkedDocs(),selected=taskList(),editable=document.getElementById('pdfMode').value==='Bearbeitbar';
 if(!classes.length||!docs.length){setStatus('Bitte mindestens eine Klasse und Dokumentart wählen.',true);return;}
 btn.disabled=true;
 try{
  const loaded={};const files=[...document.getElementById('templateFiles').files];for(const kind of docs){const filename=templates[kind].split('/').pop();const f=files.find(f=>f.name===filename);if(f){loaded[kind]=await f.arrayBuffer();}else{try{const response=await fetch(templates[kind]);if(!response.ok)throw Error('HTTP '+response.status);loaded[kind]=await response.arrayBuffer();}catch(e){throw Error('Vorlage nicht automatisch ladbar: '+filename+'. Bei lokalem Start (file://) bitte die Vorlagen unten auswählen oder die GitHub-Pages-Version verwenden.');}}}
  const archive=new JSZip();let completed=0;const total=classes.length*(docs.includes('BB')?6:0)+classes.length*Number(docs.includes('BBK'))+classes.length*Number(docs.includes('SE'));
  for(const sheet of classes){
   const rows=sortedStudents(sheet);const year=rows[0].date.slice(-4),folder=archive.folder(`PA ${year} ${sheet.toUpperCase()}`);
   const jobs=[...(docs.includes('BB')?selected.map(task=>({kind:'BB',task})):[]),...(docs.includes('BBK')?[{kind:'BBK',task:null}]:[]),...(docs.includes('SE')?[{kind:'SE',task:null}]:[])];
   for(const {kind,task} of jobs){
    setStatus(`${++completed}/${total}: ${sheet.toUpperCase()} – ${task?.name||fileLabel[kind]}`);
    await new Promise(resolve=>setTimeout(resolve,0));
    const pdf=await joinStudents(loaded[kind],rows,sheet,kind,task,selected,editable);
    folder.file(safeName(`PA ${year} ${task?.name||fileLabel[kind]} ${sheet.toUpperCase()} komplett`)+'.pdf',pdf);
   }
  }
  setStatus('ZIP wird lokal erstellt …');const blob=await archive.generateAsync({type:'blob',compression:'DEFLATE'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='PA-PDF-Ausgabe.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
  setStatus(`Fertig: ${total} Sammel-PDFs im ZIP. Bearbeitbare Ausgabe bitte besonders sorgfältig testen.`);
 }catch(e){console.error(e);setStatus('PDF-Erstellung fehlgeschlagen: '+e.message,true);}finally{btn.disabled=false;}
}
document.getElementById('generateButton').addEventListener('click',generatePDFs);

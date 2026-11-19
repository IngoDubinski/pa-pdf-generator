/* Einheitliche bearbeitbare BO-Fortsetzungsseiten auf Grundlage von EP-Seite 2. */
'use strict';
const EPContinuation=(()=>{
 const ROWS=14;
 const PDF=typeof window!=='undefined'?window.PDFLib:globalThis.PDFLib;
 const P=PDF;
 const fields=[[' Datum','date'],['','title'],[' Ort','place'],[' Notizen','notes']];
 const original=(form,name)=>{try{return form.getTextField(name);}catch{return null;}};
 const check=(form,name)=>{try{return form.getCheckBox(name);}catch{return null;}};
 const rowKey=(page,row,suffix)=>`BOFort_${page}_${row}${suffix}`;
 const checkKey=(page,row,n)=>`BOFort_${page}_${row}_Check${n}`;
 const rectOf=(field)=>field?.acroField.getWidgets()?.[0]?.getRectangle();
 const short=s=>String(s||'').replace(/^(\d{2}\.\d{2}\.)\d{2}(\d{2})$/,'$1$2');
 function fit(field,value,width=90){
  const text=String(value??'').trim();
  const lines=text.split(/\r?\n/);
  const size=Math.min(8,Math.max(5,8*width/Math.max(width,Math.max(...lines.map(s=>s.length),1)*4.1)));
  field.setFontSize(size);field.setText(text);
  return field;
 }
 function list(form){const pages=[];
  for(let p=1;p<100;p++){
   if(!original(form,rowKey(p,1,' Datum')))break;
   let last=0;
   for(let i=1;i<=ROWS;i++){
    const occupied=fields.some(([suffix])=>!!original(form,rowKey(p,i,suffix))?.getText()?.trim())||[1,2,3].some(n=>!!check(form,checkKey(p,i,n))?.isChecked());
    if(occupied)last=i;
   }
   pages.push({page:p,last,hasSpace:last<ROWS});
  }
  return pages;
 }
 function rowFill(form,p,i,data){
  const vals={' Datum':short(data.date),'':data.title,' Ort':data.place||'Schule',' Notizen':data.notes||''};
  for(const [suffix] of fields){const field=original(form,rowKey(p,i,suffix));if(!field)throw Error('Unvollständige BO-Fortsetzungsseite.');fit(field,vals[suffix],rectOf(field)?.width-6||80);}
  if(data.rating){const c=check(form,checkKey(p,i,Number(data.rating)));if(!c)throw Error('Smiley-Feld fehlt.');c.check();}
 }
 async function addPage(doc){
  if(doc.getPageCount()<2)throw Error('EP-Vorlage benötigt mindestens zwei Seiten.');
  const form=doc.getForm(),source=doc.getPage(1),width=source.getWidth(),height=source.getHeight();
  // Originalseite 2 als Layoutvorlage; Formularfelder eindeutig neu erstellen.
  form.updateFieldAppearances();
  const [background]=await doc.embedPdf(await doc.save({useObjectStreams:false}),[1]);
  const page=doc.addPage([width,height]);page.drawPage(background,{x:0,y:0,width,height});
  const index=list(form).length+1;
  for(const name of ['Name Schülerin Schüler','Klasse','Name Schule','Geburtsdatum']){
   const old=original(form,name),rect=rectOf(old);if(!rect)continue;
   const field=form.createTextField(`BOFort_${index}_Header_${name.replace(/[^a-zA-Z]/g,'_')}`);
   field.addToPage(page,{...rect,backgroundColor:undefined,borderColor:undefined,borderWidth:0});
   fit(field,old.getText()||'',rect.width-8);
  }
  for(let i=1;i<=ROWS;i++){
   for(const [suffix] of fields){
    const prev=original(form,`BO${i}${suffix}`),rect=rectOf(prev);if(!rect)throw Error(`EP-Vorlage: BO${i}${suffix} fehlt.`);
    const name=rowKey(index,i,suffix),field=form.createTextField(name);
    if(prev.isMultiline())field.enableMultiline();
    field.addToPage(page,{...rect,backgroundColor:undefined,borderColor:undefined,borderWidth:0});
    field.setFontSize(8);
   }
   for(let n=1;n<=3;n++){
    const originalName=i===10&&n===3?'Check Box4BO10_3':`Check BoxBO${i}_${n}`;
    const old=check(form,originalName),rect=rectOf(old);if(!rect)throw Error('EP-Vorlage: Bewertungsfeld fehlt.');
    const field=form.createCheckBox(checkKey(index,i,n));
    field.addToPage(page,{...rect,backgroundColor:undefined,borderColor:P.rgb(0,0,0),borderWidth:.6});
   }
  }
  return index;
 }
 async function append(doc,data){
  const form=doc.getForm(),existing=list(form),free=existing.find(p=>p.hasSpace);
  const page=free?.page||await addPage(doc);
  const row=free?free.last+1:1;
  rowFill(form,page,row,data);
  return `Fortsetzung ${page}, Zeile ${row}`;
 }
 async function appendMany(doc,entries){for(const entry of entries)await append(doc,entry);}
 return Object.freeze({ROWS,list,addPage,append,appendMany});
})();
if(typeof module!=='undefined'&&module.exports)module.exports=EPContinuation;

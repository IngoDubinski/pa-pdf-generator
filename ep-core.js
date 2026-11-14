/* EP Generator – rein lokale PDF-/XLSX-Verarbeitung. Keine Uploads, keine externen APIs.
   Die Profil-AC-PDF-Erkennung verwendet die Text-/Vektorgrafik-Struktur der getesteten
   Sachsen-PDF-Ausgaben. Bei abweichenden/mehrdeutigen Quellen wird NICHT geraten. */
'use strict';
const EPCore=(()=>{
const PDF=window.PDFLib;
const FALLBACK='keine Daten aus der PA gefunden';
const EVENTS=['Projektvorstellung','Elternabend','Merkmalsschulung','Potenzialanalyse','Auswertungsgespräch','Entwicklungsplangespräch'];
const GOALS=`1. Teilnahme an mindestens drei Berufserkundung nach Interesse\n\n2. Teilnahme an Aktionstagen (genial sozial, Boyday bzw. Erlebnistagen)\n\n3. Besuch Berufsorientierungsmesse 82. Oberschule am 04.05.27\n\n4. eigenständige Praktikumsplatzsuche nach Interessengebiet\n\nInternetseiten, um sich über Berufe, Berufsfelder und Bewerbung zu informieren:\nwww.berufe.tv, berufenet.arbeitsagentur.de, planet-beruf.de`;
const safe=s=>String(s||'').replace(/[\\/:*?"<>|\x00-\x1f]/g,'_').trim().slice(0,110)||'Unbekannt';
const cls=s=>(String(s||'').replace(/\s+/g,'').match(/^\d{1,2}[a-z]$/i)?.[0]||'').toLowerCase();
const colNo=s=>[...(s.match(/^[A-Z]+/i)?.[0]||'').toUpperCase()].reduce((x,c)=>x*26+c.charCodeAt(0)-64,0)-1;
const date=s=>{if(s===null||s===undefined||s==='')return '';if(typeof s==='number'&&s>0){const d=new Date(Date.UTC(1899,11,30)+Math.round(s)*86400000);return `${String(d.getUTCDate()).padStart(2,'0')}.${String(d.getUTCMonth()+1).padStart(2,'0')}.${d.getUTCFullYear()}`;}let m=String(s).trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/);if(m){let y=+m[3];if(y<100)y+=y<80?2000:1900;return `${m[1].padStart(2,'0')}.${m[2].padStart(2,'0')}.${y}`;}m=String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?`${m[3]}.${m[2]}.${m[1]}`:'';};
const shortDate=s=>{let v=date(s);return v?v.slice(0,6)+v.slice(-2):'';};
const bytes=async file=>new Uint8Array(await file.arrayBuffer());
const xml=s=>new DOMParser().parseFromString(s,'application/xml');
const nodes=(root,name)=>[...root.getElementsByTagNameNS('*',name)];
const attr=(e,k)=>e?.getAttribute(k)||'';
async function excel(file){
 const zip=await JSZip.loadAsync(file),read=async path=>{let z=zip.file(path);if(!z)throw Error('Excel-Dateiteil fehlt: '+path);return xml(await z.async('string'));};
 const wb=await read('xl/workbook.xml'),rels=await read('xl/_rels/workbook.xml.rels');const paths={};
 for(const r of nodes(rels,'Relationship')){let path=attr(r,'Target').replace(/^\//,'');if(!path.startsWith('xl/'))path='xl/'+path;paths[attr(r,'Id')]=path;}
 let strings=[];if(zip.file('xl/sharedStrings.xml')){const shared=await read('xl/sharedStrings.xml');strings=nodes(shared,'si').map(si=>nodes(si,'t').map(x=>x.textContent).join(''));}
 const students=[],warnings=[];
 for(const sheet of nodes(wb,'sheet')){
  const klass=cls(attr(sheet,'name'));if(!klass)continue;
  let rid=sheet.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id')||attr(sheet,'r:id');let path=paths[rid];if(!path)throw Error('Tabellenblatt nicht gefunden: '+klass);
  const doc=await read(path),rows=nodes(doc,'sheetData').flatMap(x=>nodes(x,'row'));
  const parsed=rows.map(row=>{const cells={};for(const cell of nodes(row,'c')){const i=colNo(attr(cell,'r'));if(i<0)continue;const t=attr(cell,'t');let v=nodes(cell,'v')[0]?.textContent||'';if(t==='s')v=strings[+v]||'';else if(t==='inlineStr')v=nodes(cell,'t').map(x=>x.textContent).join('');else if(v!==''&&Number.isFinite(+v))v=+v;cells[i]=v;}return cells;});
  if(!parsed.length)continue;
  const headers={};for(const [i,v] of Object.entries(parsed[0]))headers[String(v).trim().toLowerCase().replace(/\s+/g,'')]=+i;
  const idx=(...names)=>{for(let n of names){let x=headers[n.toLowerCase().replace(/\s+/g,'')];if(x!==undefined)return x;}return -1;};
  const nameCol=idx('Kompletter Name'),firstCol=idx('Vorname'),lastCol=idx('Nachname','Name'),birthCol=idx('Geb.-Datum','Geburtsdatum'),paCol=idx('PA Datum','PA-Datum');
  if(nameCol<0&&(firstCol<0||lastCol<0)){warnings.push(klass+': Spalte „Kompletter Name“ oder Vorname/Nachname fehlt.');continue;}
  const idCol=0;
  for(let r=1;r<parsed.length;r++){const row=parsed[r],str=i=>i<0?'':String(row[i]??'').trim();const name=nameCol>=0?str(nameCol):[str(firstCol),str(lastCol)].filter(Boolean).join(' ');if(!name)continue;const n=/^\d+$/.test(str(idCol))?+str(idCol):null;students.push({cls:klass,id:n,name,birth:date(row[birthCol]),paDate:date(row[paCol]),origin:'Excel'});if(n===null)warnings.push(`${klass} ${name}: Keine numerische Schüler-ID in Spalte A.`);}
 }
 if(!students.length)throw Error('Keine Schüler gefunden. Excel-Reiter z. B. 7a und Namen prüfen.');
 return {students,warnings};
}
function decodedStream(raw){return new TextDecoder('latin1').decode(PDF.decodePDFRawStream(raw).decode());}
function pageContent(page){let c=page.node.Contents();if(c instanceof PDF.PDFArray)return [...Array(c.size())].map((_,i)=>decodedStream(c.lookup(i))).join('\n');return decodedStream(c);}
function pageSegments(page){
 const font=page.node.Resources()?.lookup(PDF.PDFName.of('Font')),maps={};if(font)for(const k of font.keys()){
  const f=font.lookup(k),u=f?.lookup(PDF.PDFName.of('ToUnicode'));if(!u)continue;
  const m={},cmap=decodedStream(u);
  for(const g of cmap.matchAll(/<([0-9a-f]{4})>\s*<([0-9a-f]{4})>\s*\[((?:\s*<[0-9a-f]+>)+)\s*\]/gi)){let first=parseInt(g[1],16);[...g[3].matchAll(/<([0-9a-f]+)>/gi)].forEach((x,i)=>{let codes=x[1].match(/.{4}/g)||[];m[first+i]=codes.map(h=>String.fromCharCode(parseInt(h,16))).join('');});}
  maps[k.toString().slice(1)]=m;
 }
 const src=pageContent(page),out=[];
 for(const part of src.matchAll(/\bBT\s*([\s\S]*?)\s*ET\b/g)){
  const b=part[1],f=b.match(/\/(F\d+)\s+[\d.]+\s+Tf/),map=maps[f?.[1]]||{},td=b.match(/(-?[\d.]+)\s+(-?[\d.]+)\s+Td/);
  const t=[...b.matchAll(/<([a-f0-9]+)>\s*Tj/gi)].map(g=>{let s='';for(let i=0;i<g[1].length;i+=4)s+=map[parseInt(g[1].slice(i,i+4),16)]||'';return s;}).join('');
  if(t)out.push({text:t,x:td?+td[1]:null,y:td?-Number(td[2]):null});
 }
 return {blocks:out,text:out.map(b=>b.text).join('\n'),raw:src};
}
function ident(text,kind){const top=kind==='PV'?text.match(/Sch[üu]ler\s*ID\s*:\s*(\d+)/i):null;const matches=[...text.matchAll(/\bID\s*:\s*(\d+)/gi)];const bottom=matches.length?+matches[matches.length-1][1]:null;
 if(top&&bottom&&+top[1]!==bottom)return null;return top?+top[1]:bottom;}
function green(pageinfo){
 const cells=[];const regex=/0\.407843\d*\s+0\.752941\d*\s+0\.176470\d*\s+scn[\s\S]{0,160}?\s([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+re\s*f/g;
 for(const m of pageinfo.raw.matchAll(regex)){let [x,y,w,h]=m.slice(1).map(Number);if(x<195||x>650||y<155||y>590||w<18||w>24||h<11||h>16)continue;cells.push({x,y,side:x<400?'L':'R'});}
 const groups=new Map();for(const r of cells){const k=`${Math.round(r.y)}:${r.side}`;if(!groups.has(k))groups.set(k,new Set());groups.get(k).add(Math.round(r.x));}
 const values=[],strong=[];
 for(const [k,xs] of groups){const [y,side]=k.split(':'),score=xs.size;if(!score||score>5)continue;
  let labels=pageinfo.blocks.filter(b=>b.x!=null&&b.y!=null&&Math.abs(b.y-(+y+19))<=3&&(side==='L'?b.x<150:b.x>295&&b.x<500)&&!b.text.toLowerCase().includes('nicht erfasst'));
  if(!labels.length)continue;
  const closest=labels.sort((a,b)=>Math.abs(a.y-(+y+19))-Math.abs(b.y-(+y+19)))[0];
  const name=closest.text.trim();if(name.length<4||/^(\d+|\.{2,})$/.test(name))continue;
  values.push({name,score});if(score>=4&&!strong.includes(name))strong.push(name);
 }
 return {hasValues:values.length>0,strengths:strong,values};
}
async function indexPdfs(files,kind,onlyClass=''){
 const index=new Map(),warnings=[];
 for(const file of files){const doc=await PDF.PDFDocument.load(await bytes(file));for(let n=0;n<doc.getPageCount();n++){
  const page=doc.getPages()[n],p=pageSegments(page),klass=cls(p.text.match(/AC\s*[-–]?\s*Einheit\s*:\s*[^\n]*?\b(\d{1,2}[a-z])\b/i)?.[1]),id=ident(p.text,kind);
  if(onlyClass&&klass&&klass!==onlyClass)continue;
  if(!klass||!id){warnings.push(`${kind} ${file.name} Seite ${n+1}: Klasse/ID nicht eindeutig – Seite nicht zugeordnet.`);continue;}
  const key=`${klass}:${id}`;if(index.has(key)){index.set(key,null);warnings.push(`${kind} ${klass} ID ${id}: doppelt, nicht zugeordnet.`);}else index.set(key,{file,page:n,info:p,assessment:kind==='KP'?green(p):null});
 }}
 return {index,warnings};
}
function toBytes(v){return Uint8Array.from(v);}
function adjustField(form,key,value){if(value===undefined||value===null)return;let f;try{f=form.getTextField(key);}catch{return;}
 const s=String(value),r=f.acroField.getWidgets()[0]?.getRectangle(),width=r?.width||180;
 let size=key==='BO Ziele Start'||key==='persönliche Stärken Start'?s.length>200?7.2:8.5:key.startsWith('BO')?8.2:10.2;
 if(key.endsWith(' Datum'))size=7.6;
 if(['Name Schülerin Schüler','Name Schule'].includes(key))while(size>6.3&&s.length*size*.51>width-8)size-=.3;
 f.setText(s);try{f.setFontSize(size);}catch{f.acroField.setDefaultAppearance(`/Helv ${size} Tf 0 g`);f.setFontSize(size);}}
async function trimImage(imgBytes){
 const blob=new Blob([imgBytes]),url=URL.createObjectURL(blob);try{
  const image=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=url;});
  const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
  const {data,width,height}=ctx.getImageData(0,0,canvas.width,canvas.height);let minX=width,minY=height,maxX=-1,maxY=-1;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){const q=(y*width+x)*4;if(data[q+3]<40)continue;if(Math.min(data[q],data[q+1],data[q+2])>235)continue;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}
  if(maxX<0)return imgBytes;
  const padX=Math.max(3,Math.round((maxX-minX)*.04)),padY=Math.max(3,Math.round((maxY-minY)*.11));minX=Math.max(0,minX-padX);maxX=Math.min(width-1,maxX+padX);minY=Math.max(0,minY-padY);maxY=Math.min(height-1,maxY+padY);
  const cut=document.createElement('canvas');cut.width=maxX-minX+1;cut.height=maxY-minY+1;cut.getContext('2d').drawImage(canvas,minX,minY,cut.width,cut.height,0,0,cut.width,cut.height);
  return new Uint8Array(await (await new Promise(r=>cut.toBlob(r,'image/png'))).arrayBuffer());
 }finally{URL.revokeObjectURL(url);}
}
const trimmedSignatures=new WeakMap();
async function signature(pdf,raw){if(!raw)return null;let trimmed=trimmedSignatures.get(raw);if(!trimmed){trimmed=await trimImage(raw);trimmedSignatures.set(raw,trimmed);}return pdf.embedPng(trimmed);}
function drawFit(page,s,x,top,maxWidth,base=9,min=5.7){if(!s)return;const font=page.docFont||null;let sz=base;while(sz>min&&s.length*sz*.52>maxWidth)sz-=.25;page.drawText(String(s),{x,y:page.getHeight()-top-sz,size:sz,color:PDF.rgb(0,0,0),maxWidth});}
function drawImage(page,img,x,top,width,height){if(!img)return;const scale=Math.min(width/img.width,height/img.height);const w=img.width*scale,h=img.height*scale;page.drawImage(img,{x:x+(width-w)/2,y:page.getHeight()-top-height+(height-h)/2,width:w,height:h});}
async function buildEP(student,settings,assessment,template,signBytes){
 const pdf=await PDF.PDFDocument.load(template),form=pdf.getForm();
 for(const [key,value] of Object.entries({'Name Schülerin Schüler':student.name,'Klasse':student.cls,'Name Schule':settings.school,'Geburtsdatum':student.birth,'persönliche Stärken Start':assessment?.hasValues?assessment.strengths.join(', '):FALLBACK,'BO Ziele Start':settings.goals||''}))adjustField(form,key,value);
 let row=0;for(const name of EVENTS){let val=settings.events?.[name]||'';if(name==='Potenzialanalyse'&&!val)val=student.paDate;if(!val)continue;row++;adjustField(form,`BO${row} Datum`,shortDate(val));adjustField(form,`BO${row}`,name);adjustField(form,`BO${row} Ort`,'Schule');}
 const first=pdf.getPages()[0];if(settings.staff||signBytes){
  // Keep line visible; printed name below the line next to original label.
  first.drawRectangle({x:69,y:first.getHeight()-448.8,width:252,height:12.8,color:PDF.rgb(1,1,1)});
  if(signBytes){const sig=await signature(pdf,signBytes);drawImage(first,sig,138,414.9,113,30.9);}
  first.drawLine({start:{x:71,y:first.getHeight()-447.6},end:{x:319,y:first.getHeight()-447.6},thickness:.65,color:PDF.rgb(0,0,0)});
  if(settings.staff)drawFit(first,settings.staff,174,450,141,9.1,6);
 }
 form.updateFieldAppearances();return pdf.save({useObjectStreams:false,updateFieldAppearances:true});
}
function labelPosition(info,txt){return info.blocks.find(b=>b.text.includes(txt)&&b.x!==null&&b.y!==null);}
function ptsFromRaw(b){return {x:68.04+.736564974*b.x,top:15+.736564974*b.y};}
async function annotate(item,kind,student,settings,signBytes){
 const source=await PDF.PDFDocument.load(await bytes(item.file)),pdf=await PDF.PDFDocument.create();const [page]=await pdf.copyPages(source,[item.page]);pdf.addPage(page);
 const info=item.info,add=(label,value,topOffset=-18,width=130,base=9)=>{const r=labelPosition(info,label);if(!r||!value)return;const p=ptsFromRaw(r);drawFit(page,value,p.x-2,p.top+topOffset,width,base,5.4);};
 add('Name Schüler/in',student.name,-18,125,9.1);
 add('Name Projektmitarbeiter/in',settings.staff,-18,130,8.8);
 if(kind==='PV'){
  const raw=labelPosition(info,'Name:');if(raw){const p=ptsFromRaw(raw);if(p.top<200)drawFit(page,student.name,p.x+34,p.top-4,220,9,5.5);}
 }
 if(signBytes){const r=labelPosition(info,'Unterschrift Projektmitarbeiter/in');if(r){const p=ptsFromRaw(r);drawImage(page,await signature(pdf,signBytes),p.x+2,p.top-39,125,30);}}
 return pdf.save({useObjectStreams:false});
}
async function mergePdf(parts){
 const out=await PDF.PDFDocument.create(),form=out.getForm();
 for(let i=0;i<parts.length;i++){
  const src=await PDF.PDFDocument.load(parts[i]),copied=await out.copyPages(src,src.getPageIndices());copied.forEach(p=>{p.node.set(PDF.PDFName.of('Annots'),out.context.obj([]));out.addPage(p);});
  // Rebuild EP AcroForm fields with unique names instead of flattening.
  const sourceForm=src.getForm();for(const field of sourceForm.getFields()){
   const isText=field instanceof PDF.PDFTextField, isCheck=field instanceof PDF.PDFCheckBox;
   if(!isText&&!isCheck)continue;
   for(let wi=0;wi<field.acroField.getWidgets().length;wi++){
    const widget=field.acroField.getWidgets()[wi],rect=widget.getRectangle();
    const pref=widget.dict.get(PDF.PDFName.of('P'));
    const pageIndex=src.getPages().findIndex(p=>p.ref.toString()===pref?.toString());
    if(pageIndex<0)continue;
    const pp=copied[pageIndex],name=`s${i}_${field.getName().replace(/[^a-zA-Z0-9äöüÄÖÜ_]/g,'_')}_${wi}`;
    if(isText){
     const f=form.createTextField(name);
     if(field.isMultiline())f.enableMultiline();
     // Explicit undefined prevents pdf-lib's opaque WHITE widget background.
     // The PDF template already draws every table line and cell border.
     f.addToPage(pp,{x:rect.x,y:rect.y,width:rect.width,height:rect.height,
       backgroundColor:undefined,borderColor:undefined,borderWidth:0});
     f.setText(field.getText()||'');
     const size=+field.acroField.getDefaultAppearance()?.match(/\s([\d.]+) Tf/)?.[1]||9;
     f.setFontSize(Math.min(11,Math.max(6,size)));
    }else{
     const f=form.createCheckBox(name);
     // Keep checkboxes legible when blank; omit the white fill so surrounding
     // table/grid lines are never covered by PDF annotation appearances.
     f.addToPage(pp,{x:rect.x,y:rect.y,width:rect.width,height:rect.height,
       backgroundColor:undefined,borderColor:PDF.rgb(0,0,0),borderWidth:0.7});
     if(field.isChecked())f.check();
    }
   }
  }
 }
 form.updateFieldAppearances();return out.save({useObjectStreams:false});
}
return {GOALS,EVENTS,FALLBACK,excel,pageSegments,ident,green,indexPdfs,buildEP,annotate,mergePdf,shortDate,safe,cls,bytes};
})();

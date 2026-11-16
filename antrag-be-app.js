'use strict';
(()=>{
const $=id=>document.getElementById(id), Z=window.JSZip, P=window.PDFLib;
let roster=[],selected=new Set(),evReceived=new Set(),pendingSaved=null,printUrl='',busy=false;
const FIELDS=['company','date','address','from','to','meeting','meettime','returnPlace','returnTime','deadline','evdeadline','field','jobs','capacity','transport','leader','companions','signup','hints','program','remarks'];
const val=id=>$(id).value.trim(), data=()=>Object.fromEntries(FIELDS.map(x=>[x,val(x)]));
const esc=x=>String(x??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const clean=x=>String(x||'').replace(/[\\/:*?"<>|\x00-\x1f]/g,'_').trim().slice(0,95)||'Unbekannt';
const fmt=x=>{if(!/^\d{4}-\d\d-\d\d$/.test(x||''))return '';const [y,m,d]=x.split('-');const dt=new Date(`${x}T12:00:00Z`);return `${d}.${m}.${y} (${['So','Mo','Di','Mi','Do','Fr','Sa'][dt.getUTCDay()]})`;};
const compact=x=>{const bits=String(x||'').split(/[,;\n]/).map(x=>x.trim()).filter(Boolean);return bits;};
function got(){return roster.filter((x,i)=>selected.has(i));}
const studentKey=st=>st.cls.toLowerCase()+'|'+st.name.trim().toLocaleLowerCase('de');
function selectedStatus(){const n=selected.size,c=+val('capacity');$('selection').textContent=`${n} Schüler ausgewählt${c?' · '+Math.max(0,c-n)+' von '+c+' Plätzen frei':''}${c&&n>c?' · ACHTUNG: Kapazität überschritten':''}`;
 const received=[...selected].filter(i=>evReceived.has(i)).length;
 $('evSummary').textContent=`Einverständniserklärungen erhalten: ${received} von ${n} · Offen: ${n-received}`;
}
function applySaved(){if(!pendingSaved||!roster.length)return;
 selected.clear();evReceived.clear();const selectedKeys=new Set(pendingSaved.selected||[]),receivedKeys=new Set(pendingSaved.evReceived||[]);
 roster.forEach((st,i)=>{const k=studentKey(st);if(selectedKeys.has(k))selected.add(i);if(receivedKeys.has(k))evReceived.add(i);});
 $('status').textContent=`Veranstaltung geladen: ${selected.size} zugeordnete Teilnehmer, ${evReceived.size} EV-Häkchen. Bitte Schülerliste prüfen.`;
 pendingSaved=null;
}
function render(){const filter=val('classFilter'),q=val('search').toLowerCase(),target=$('students');target.replaceChildren();let visible=0;
 const head=document.createElement('div');head.style.cssText='display:grid;grid-template-columns:minmax(150px,1fr) 95px;gap:12px;padding:7px 6px;font-weight:700';head.innerHTML='<span>Teilnahme</span><span>EV erhalten</span>';target.append(head);
 roster.forEach((st,i)=>{if(filter&&st.cls!==filter||q&&!st.name.toLowerCase().includes(q))return;visible++;
 const label=document.createElement('label');label.style.cssText='display:grid;grid-template-columns:minmax(150px,1fr) 95px;gap:12px;align-items:center';
 const first=document.createElement('span'),cb=document.createElement('input');cb.type='checkbox';cb.checked=selected.has(i);cb.onchange=()=>{cb.checked?selected.add(i):selected.delete(i);selectedStatus();};first.append(cb,document.createTextNode(' '+st.cls.toUpperCase()+' · '+st.name));
 const ev=document.createElement('input');ev.type='checkbox';ev.title='Unterschriebene Einverständniserklärung liegt vor';ev.setAttribute('aria-label','Einverständniserklärung erhalten: '+st.name);ev.checked=evReceived.has(i);ev.onchange=()=>{ev.checked?evReceived.add(i):evReceived.delete(i);selectedStatus();};
 label.append(first,ev);target.append(label);});if(!visible)target.textContent='Keine passenden Schüler.';selectedStatus();}
$('excel').addEventListener('change',async()=>{const file=$('excel').files[0];if(!file)return;try{const r=await EPCore.excel(file);roster=r.students;selected.clear();evReceived.clear();applySaved();const classes=[...new Set(roster.map(x=>x.cls))].sort();$('classFilter').replaceChildren(new Option('Alle Klassen',''),...classes.map(x=>new Option(x.toUpperCase(),x)));$('excelStatus').textContent=`${roster.length} Schüler aus ${classes.length} Klassen. `+(r.warnings.length?r.warnings.slice(0,3).join(' · '):'');render();}catch(e){roster=[];selected.clear();evReceived.clear();render();$('excelStatus').textContent='Importfehler: '+e.message;}});
$('classFilter').onchange=render;$('search').oninput=render;
for(const [id,on] of [['all',true],['none',false]])$(id).onclick=()=>{const f=val('classFilter'),q=val('search').toLowerCase();roster.forEach((s,i)=>{if((!f||s.cls===f)&&(!q||s.name.toLowerCase().includes(q)))on?selected.add(i):selected.delete(i);});render();};
function download(content,name,type='application/octet-stream'){const u=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);}
$('saveProject').onclick=()=>{const payload={version:2,event:data(),selected:[...selected].map(i=>studentKey(roster[i])),evReceived:[...evReceived].map(i=>studentKey(roster[i]))};download(JSON.stringify(payload,null,2),clean(val('company')||'BE')+' Veranstaltung.json','application/json');$('status').textContent='Veranstaltung einschließlich Teilnehmerauswahl und EV-Rücklauf gespeichert.';};
$('loadProject').onchange=async()=>{const f=$('loadProject').files[0];if(!f)return;try{const j=JSON.parse(await f.text());if(![1,2].includes(j.version)||!j.event||typeof j.event!=='object')throw Error('Unbekanntes Veranstaltungsformat');for(const id of FIELDS)if(typeof j.event[id]==='string')$(id).value=j.event[id];pendingSaved=j.version===2?{selected:Array.isArray(j.selected)?j.selected:[],evReceived:Array.isArray(j.evReceived)?j.evReceived:[]}:null;
 if(roster.length)applySaved();else $('status').textContent='Veranstaltungsdaten geladen. Bitte die passende Excel-Schülerliste einlesen, damit Teilnehmer und EV-Häkchen zugeordnet werden.';
 selectedStatus();}catch(e){$('status').textContent='Datei konnte nicht geladen werden: '+e.message;}};
// DOCX: in sich geschlossenes, mit Word/LibreOffice bearbeitbares OOXML. Kein Cloud-Dienst.
const wP=(str,bold=false)=>`<w:p><w:pPr><w:spacing w:after="120"/></w:pPr><w:r>${bold?'<w:rPr><w:b/></w:rPr>':''}<w:t xml:space="preserve">${esc(str)}</w:t></w:r></w:p>`;
const wTable=rows=>`<w:tbl><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>${rows.map(row=>`<w:tr>${row.map(c=>`<w:tc><w:tcPr><w:tcW w:w="3300" w:type="dxa"/></w:tcPr>${wP(c)}</w:tc>`).join('')}</w:tr>`).join('')}</w:tbl>`;
async function docx(title,paragraphs,tables=[]){const zip=new Z();zip.file('[Content_Types].xml','<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');zip.file('_rels/.rels','<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');zip.file('word/document.xml',`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${wP(title,true)}${paragraphs.map(x=>wP(x)).join('')}${tables.map(x=>wTable(x)).join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1100" w:bottom="1000" w:left="1100" w:right="1100"/></w:sectPr></w:body></w:document>`);return zip.generateAsync({type:'uint8array'});}
function setCell(tc,text){if(!tc)return;const ts=[...tc.getElementsByTagNameNS('*','t')];if(ts.length){ts[0].textContent=String(text||'');for(const t of ts.slice(1))t.textContent='';}else{const p=tc.getElementsByTagNameNS('*','p')[0];if(p){const r=tc.ownerDocument.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main','w:r'),t=tc.ownerDocument.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main','w:t');t.textContent=String(text||'');r.append(t);p.append(r);}}}
function tableCells(row){return [...row.childNodes].filter(e=>e.localName==='tc');}
function setAt(table,ri,ci,text){const rows=[...table.childNodes].filter(x=>x.localName==='tr'),cells=tableCells(rows[ri]);if(!cells[ci])throw Error('Die Exkursionsantrag-Vorlage hat eine unerwartete Tabellenstruktur.');setCell(cells[ci],text);}
function desc(d){return `Betriebserkundung ${d.company}`;}
async function schoolDoc(d,students){const response=await fetch('Vorlagen/BE/Exkursionsantrag_Original.docx');if(!response.ok)throw Error('Originalvorlage Exkursionsantrag fehlt.');const zip=await Z.loadAsync(await response.arrayBuffer());const doc=new DOMParser().parseFromString(await zip.file('word/document.xml').async('string'),'application/xml');if(doc.querySelector('parsererror'))throw Error('Vorlage ist kein gültiges Word-XML.');const tables=[...doc.getElementsByTagNameNS('*','tbl')];if(tables.length<2)throw Error('Exkursionsantrag: Tabellen nicht gefunden.');const t=tables[0],g=tables[tables.length-1],adult=1+compact(d.companions).length,classes=[...new Set(students.map(x=>x.cls.toUpperCase()))].join(', ')||'keine Teilnehmer';const cl=`Interessierte Schüler aus Klassen ${classes} (siehe TN-Liste)`;
 for(const [row,col,value] of [[0,1,cl],[1,1,desc(d)],[2,1,fmt(d.date)],[3,1,d.leader],[4,1,`Gesamt: ${students.length+adult}`],[4,2,`Kinder: ${students.length}`],[4,3,`Erwachsene: ${adult}`],[5,1,[d.leader,d.companions].filter(Boolean).join(', ')],[6,1,d.transport]])setAt(t,row,col,value);
 for(const [row,col,value] of [[0,1,cl],[1,1,desc(d)],[2,1,fmt(d.date)],[3,1,d.leader]])setAt(g,row,col,value);
 setAt(t,12,0,`Datum ${fmt(new Date().toISOString().slice(0,10))}`);
 // Word-Datumsfeld vollständig entfernen, damit Word nicht zusätzlich seinen alten Feldwert anzeigt.
 const dateCell=tableCells([...t.childNodes].filter(x=>x.localName==='tr')[12])[0];
 for(const run of [...dateCell.getElementsByTagNameNS('*','r')])if(run.getElementsByTagNameNS('*','fldChar').length||run.getElementsByTagNameNS('*','instrText').length)run.remove();
 // Die beiden Tabellenzellen für Treff und Ende enthalten verschachtelte Ort/Uhrzeit-Tabellen.
 const rows=[...t.childNodes].filter(e=>e.localName==='tr');const travel=[[7,d.meeting,d.meettime],[8,d.returnPlace,d.returnTime]];
 for(const [i,place,time] of travel){const cells=tableCells(rows[i]),nested=cells[1]?.getElementsByTagNameNS('*','tbl')[0];if(!nested)continue;const nr=[...nested.childNodes].filter(x=>x.localName==='tr');if(nr.length>=2){setCell(tableCells(nr[0]).at(-1),place);setCell(tableCells(nr[1]).at(-1),time?time+' Uhr':'');}}
 // Hinweis bleibt im Antrag, Unterschriften/Genehmigung werden nie vorausgefüllt.
 if(d.remarks){const note=tableCells(rows[9])[1];if(note)setCell(note,d.remarks);}
 // Original-Antrag bewahren; die Schülerliste als zweite Seite im gleichen bearbeitbaren DOCX anhängen.
 const body=doc.getElementsByTagNameNS('*','body')[0],sect=[...body.childNodes].find(x=>x.localName==='sectPr');
 for(const node of [...body.childNodes].reverse()){if(node.localName==='sectPr')continue;if(node.localName!=='p')break;const txt=[...node.getElementsByTagNameNS('*','t')].map(t=>t.textContent).join('').trim();if(txt)break;body.removeChild(node);}
 const appendix=`<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:pPr><w:pageBreakBefore/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t>Anlage zum Exkursionsantrag – Teilnehmerliste</w:t></w:r></w:p>${wP('Betriebserkundung: '+d.company+' · '+fmt(d.date))}${wP('Teilnehmende Schülerinnen und Schüler: '+students.length)}${wTable([['Nr.','Klasse','Vorname','Nachname'],...students.map((s,i)=>[String(i+1),s.cls.toUpperCase(),...nameParts(s.name)])])}`;
 const parsed=new DOMParser().parseFromString(`<root xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${appendix}</root>`,'application/xml');if(parsed.querySelector('parsererror'))throw Error('Anlage konnte nicht erstellt werden.');
 for(const node of [...parsed.documentElement.childNodes])body.insertBefore(doc.importNode(node,true),sect||null);
 zip.file('word/document.xml',new XMLSerializer().serializeToString(doc));return zip.generateAsync({type:'uint8array'});}
const full=d=>`${fmt(d.date)}, ${d.from}–${d.to} Uhr`;
function pdfLines(text,size,font,width){const parts=String(text||'').split(/\n/),lines=[];for(const para of parts){let line='';for(const word of (para.split(/\s+/).filter(Boolean))){const test=line?line+' '+word:word;if(font.widthOfTextAtSize(test,size)>width&&line){lines.push(line);line=word;}else line=test;}lines.push(line);}return lines;}
async function printPDF(documents){const pdf=await P.PDFDocument.create(),regular=await pdf.embedFont(P.StandardFonts.Helvetica),bold=await pdf.embedFont(P.StandardFonts.HelveticaBold),W=595,H=842;
 for(const d of documents){let page=pdf.addPage([W,H]),y=790;const push=(text,opts={})=>{const size=opts.size||10,font=opts.bold?bold:regular,margin=45;for(const line of pdfLines(text,size,font,W-margin*2)){if(y<60){page=pdf.addPage([W,H]);y=790;}page.drawText(line.slice(0,260),{x:margin,y,size,font,color:P.rgb(.13,.18,.27)});y-=size+5;}y-=opts.gap??8;};push(d.title,{size:17,bold:true,gap:20});for(const line of d.lines)push(line);if(d.rows?.length){y-=8;for(const r of d.rows){push(r.join('  |  '),{size:9,gap:3});}}}
 return pdf.save();}
// XLSX: Originalvorlage bearbeiten, alle Formatierungen, Druck- und Tabellen-Einstellungen erhalten.
function nameParts(name){const words=String(name||'').trim().split(/\s+/).filter(Boolean);return words.length<2?[words[0]||'','']:[words.slice(0,-1).join(' '),words.at(-1)];}
async function feedbackXlsx(d,students){
 const r=await fetch('Vorlagen/BE/TN_Liste_Feedback_Original.xlsx');if(!r.ok)throw Error('Originalvorlage Feedback fehlt.');
 const z=await Z.loadAsync(await r.arrayBuffer()),ns='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
 const path='xl/worksheets/sheet1.xml',doc=new DOMParser().parseFromString(await z.file(path).async('string'),'application/xml');
 if(doc.querySelector('parsererror'))throw Error('Ungültige Excel-Vorlage.');
 const ss=doc.getElementsByTagNameNS(ns,'sheetData')[0],rows=[...ss.childNodes].filter(x=>x.localName==='row');
 const src=rows.find(x=>x.getAttribute('r')==='8');if(!src)throw Error('Vorlage: Musterzeile fehlt.');
 const colCell=(row,col)=>[...row.childNodes].find(c=>c.localName==='c'&&c.getAttribute('r')?.replace(/\d+/g,'')===col);
 function put(row,col,v){let cell=colCell(row,col);if(!cell){cell=doc.createElementNS(ns,'c');cell.setAttribute('r',col+row.getAttribute('r'));row.append(cell);}cell.removeAttribute('t');for(const n of [...cell.childNodes])if(n.localName==='v'||n.localName==='is'||n.localName==='f')cell.removeChild(n);
 if(v===''||v===null||v===undefined)return;
 if(typeof v==='number'){const node=doc.createElementNS(ns,'v');node.textContent=String(v);cell.append(node);}else{cell.setAttribute('t','inlineStr');const isl=doc.createElementNS(ns,'is'),t=doc.createElementNS(ns,'t');t.textContent=String(v);isl.append(t);cell.append(isl);}}
 // Veranstaltungsstammdaten im originalen Kopf.
 const top=Object.fromEntries(rows.map(r=>[+r.getAttribute('r'),r]));
 put(top[3],'C',[d.field,d.jobs].filter(Boolean).join(' · '));
 const date=new Date(d.date+'T12:00:00Z');const serial=Math.floor((date.getTime()-Date.UTC(1899,11,30))/86400000);
 put(top[4],'C',serial);put(top[5],'C',d.company);
 const count=Math.max(6,students.length),delta=count-8;
 // Die beiden ursprünglichen Leerzeilen werden als Teil der Liste genutzt.
 const existing=rows.filter(r=>{const n=+r.getAttribute('r');return n>=7&&n<=14;});
 for(const r of existing)ss.removeChild(r);
 for(let i=0;i<count;i++){
   const no=7+i, row=src.cloneNode(true);row.setAttribute('r',String(no));
   for(const c of [...row.childNodes])if(c.localName==='c'){const col=c.getAttribute('r').replace(/\d+/g,'');c.setAttribute('r',col+no);}
   const st=students[i],parts=st?nameParts(st.name):['',''];
   for(const [col,value] of [['A',st?i+1:''],['B',st?st.cls.toUpperCase():''],['C',parts[0]],['D',parts[1]],['E',''],['F',''],['G','J'],['H','K'],['I','L'],['J','']])put(row,col,value);
   const before=[...ss.childNodes].find(e=>e.localName==='row'&&+e.getAttribute('r')>=15);ss.insertBefore(row,before||null);
 }
 for(const row of rows.filter(r=>+r.getAttribute('r')>=15)){const n=+row.getAttribute('r')+delta;row.setAttribute('r',String(n));for(const c of [...row.childNodes])if(c.localName==='c')c.setAttribute('r',c.getAttribute('r').replace(/\d+$/,n));}
 const dim=doc.getElementsByTagNameNS(ns,'dimension')[0];if(dim)dim.setAttribute('ref',`A1:J${14+count-6}`);
 const sort=doc.getElementsByTagNameNS(ns,'sortState')[0];if(sort){sort.setAttribute('ref',`B7:D${6+count}`);for(const condition of [...sort.childNodes])if(condition.localName==='sortCondition'){const s=condition.getAttribute('ref');if(s)condition.setAttribute('ref',s.replace(/\d+$/,6+count));}}
 z.file(path,new XMLSerializer().serializeToString(doc));
 const tp='xl/tables/table1.xml';if(z.file(tp)){const td=new DOMParser().parseFromString(await z.file(tp).async('string'),'application/xml');const table=td.documentElement;table.setAttribute('ref',`A6:J${6+count}`);const af=[...table.childNodes].find(e=>e.localName==='autoFilter');if(af)af.setAttribute('ref',`A6:J${6+count}`);z.file(tp,new XMLSerializer().serializeToString(td));}
 return z.generateAsync({type:'uint8array'});
}
const pdfDoc=(title,lines,rows)=>({title,lines,rows});
async function generate(){if(busy)return;
 const d=data(),students=got(),chosen=new Set([...document.querySelectorAll('[data-doc]:checked')].map(x=>x.dataset.doc));
 if(!d.company||!d.date){$('status').textContent='Bitte Firma und Datum eingeben.';return;}
 if(!chosen.size){$('status').textContent='Bitte mindestens ein Dokument auswählen.';return;}
 if(!students.length){$('status').textContent='Bitte zuerst Schüler aus Excel auswählen.';return;}
 if(+d.capacity&&students.length>+d.capacity&&!confirm(`Es sind ${students.length} Schüler gewählt, aber nur ${d.capacity} Plätze vorhanden. Trotzdem fortfahren?`))return;
 busy=true;$('generate').disabled=true;$('status').textContent='Originalvorlagen werden lokal mit den gewählten Angaben ausgefüllt …';
 try{
 const zip=new Z(),folder=`BE ${clean(d.company)} ${d.date.slice(0,4)}/`;
 if(chosen.has('antrag'))zip.file(folder+'01 Exkursionsantrag mit TN-Anlage.docx',await schoolDoc(d,students));
 if(chosen.has('feedback'))zip.file(folder+'02 TN-Liste mit Feedback.xlsx',await feedbackXlsx(d,students));
 zip.file(folder+'Veranstaltung.json',JSON.stringify({version:2,event:d,selected:[...selected].map(i=>studentKey(roster[i])),evReceived:[...evReceived].map(i=>studentKey(roster[i]))},null,2));
 zip.file(folder+'BITTE LESEN.txt','Bearbeitbare Originalvorlagen: Exkursionsantrag (Word) mit TN-Anlage und Feedbackliste (Excel).\nDruck: Originale in Word/LibreOffice beziehungsweise Excel öffnen, vor dem Ausdruck prüfen und dort ausdrucken.\nBeim Antrag Duplexdruck aktivieren; die TN-Anlage beginnt auf einer neuen Seite.\nEine originalgetreue Sammeldruck-PDF ist in dieser Version bewusst nicht enthalten.\n');
 const blob=await zip.generateAsync({type:'blob'});download(blob,clean(`BE ${d.company} ${d.date.slice(0,4)}`)+'.zip','application/zip');
 $('status').textContent=`Fertig: ${students.length} Schüler. Original-Word-Antrag inklusive TN-Anlage und Original-Excel-Feedbackliste sind im ZIP. Beide Dateien bleiben bearbeitbar. Bitte Druckbild vor Nutzung prüfen.`;
 }catch(e){console.error(e);$('status').textContent='Erstellung fehlgeschlagen: '+e.message;}finally{busy=false;$('generate').disabled=false;}
}
$('generate').onclick=generate;
render();})();

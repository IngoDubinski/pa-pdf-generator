'use strict';
// XLSX is a ZIP containing XML. JSZip is bundled locally; no network calls.
const required=['Kompletter Name','PA Datum','Gruppe 1-6','1. Beobachter','2. Beobachter'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const xml=s=>new DOMParser().parseFromString(s,'application/xml');
const nodes=(p,n)=>Array.from(p.getElementsByTagNameNS('*',n));
const attr=(n,k)=>n?.getAttribute(k)||'';
const text=n=>n?.textContent||'';
const colIndex=ref=>{let n=0;for(const c of (ref.match(/^[A-Z]+/i)||[''])[0].toUpperCase())n=n*26+c.charCodeAt(0)-64;return n-1;};
function excelDate(v){const x=Number(v);if(!Number.isFinite(x)||x<1)return '';const d=new Date(Date.UTC(1899,11,30)+Math.round(x)*86400000);return `${String(d.getUTCDate()).padStart(2,'0')}.${String(d.getUTCMonth()+1).padStart(2,'0')}.${d.getUTCFullYear()}`;}
function normDate(v,isNumeric){if(isNumeric&&/^\d+(\.\d+)?$/.test(String(v)))return excelDate(v);const s=String(v).trim();let m=s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);if(!m)m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)?.slice(0).map((x,i,a)=>i===0?a[3]:i===1?a[2]:i===2?a[1]:x);if(!m)return '';const dd=+m[1],mm=+m[2],yy=+m[3],d=new Date(Date.UTC(yy,mm-1,dd));return d.getUTCFullYear()===yy&&d.getUTCMonth()===mm-1&&d.getUTCDate()===dd?`${String(dd).padStart(2,'0')}.${String(mm).padStart(2,'0')}.${yy}`:'';}
async function inspect(file){
 const zip=await JSZip.loadAsync(file);const read=async p=>{const f=zip.file(p);if(!f)throw Error('XLSX-Bestandteil fehlt: '+p);return xml(await f.async('string'));};
 const book=await read('xl/workbook.xml'),rels=await read('xl/_rels/workbook.xml.rels');
 const paths={};for(const r of nodes(rels,'Relationship')){let target=attr(r,'Target').replace(/^\//,'');if(!target.startsWith('xl/'))target='xl/'+target;paths[attr(r,'Id')]=target;}
 let strings=[];if(zip.file('xl/sharedStrings.xml')){const s=await read('xl/sharedStrings.xml');strings=nodes(s,'si').map(si=>nodes(si,'t').map(text).join(''));}
 const sheets=nodes(book,'sheet').filter(s=>/^7[a-z]$/i.test(attr(s,'name')));
 if(!sheets.length)throw Error('Keine Klassenreiter gefunden. Benenne die Excel-Reiter z. B. 7a, 7b oder 7c.');
 const report=[];
 for(const sh of sheets){const name=attr(sh,'name'),id=attr(sh,'r:id')||sh.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id');let path=paths[id];if(!path)throw Error('Tabellenpfad fehlt: '+name);path=path.replace(/\/[^/]+\/\.\.\//g,'/');const doc=await read(path);const rows=nodes(doc,'sheetData').flatMap(n=>nodes(n,'row'));
 const decoded=rows.map(row=>{const cells={};for(const c of nodes(row,'c')){const i=colIndex(attr(c,'r'));if(i<0)continue;const typ=attr(c,'t');let v=text(nodes(c,'v')[0]);if(typ==='s')v=strings[Number(v)]??'';else if(typ==='inlineStr')v=nodes(c,'t').map(text).join('');cells[i]={value:v,numeric:typ==='n'||(!typ&&v!==''&&Number.isFinite(Number(v)))};}return {line:Number(attr(row,'r')),cells};});
 const first=decoded.find(r=>r.line===1);const headers={};if(first)for(const [i,c] of Object.entries(first.cells))headers[c.value.trim()]=Number(i);
 const missing=required.filter(k=>!(k in headers));const errors=[];if(missing.length)errors.push('Pflichtspalten fehlen: '+missing.join(', '));let count=0;const years=new Set();const students=[];
 if(!missing.length)for(const row of decoded.filter(r=>r.line>=2)){const get=k=>row.cells[headers[k]]||{value:'',numeric:false};const student=get('Kompletter Name').value.trim();if(!student)continue;count++;
 const g=Number(String(get('Gruppe 1-6').value).replace(',','.'));if(!Number.isInteger(g)||g<1||g>6)errors.push(`Zeile ${row.line}: Gruppe muss eine ganze Zahl von 1 bis 6 sein.`);
 const dc=get('PA Datum'),date=normDate(dc.value,dc.numeric);if(!date)errors.push(`Zeile ${row.line}: PA Datum ist ungültig.`);else years.add(date.slice(-4));
 students.push({name:student,group:g,date,observer1:get('1. Beobachter').value,observer2:get('2. Beobachter').value,line:row.line});
 }
 if(!count&&!missing.length)errors.push('Keine Schülernamen gefunden.');if(years.size>1)errors.push('Mehrere PA-Jahre in einer Klasse gefunden.');report.push({name,count,errors,students,year:[...years][0]||null});
 }
 return report;
}
let currentReport=[];
const input=document.getElementById('excel'),status=document.getElementById('status'),results=document.getElementById('results');
input.addEventListener('change',async()=>{results.innerHTML='';const file=input.files[0];if(!file)return;if(!/\.xlsx$/i.test(file.name)){status.textContent='Bitte eine .xlsx-Datei auswählen.';return;}status.textContent='Prüfung läuft – ausschließlich lokal …';try{const report=await inspect(file);currentReport=report;const bad=report.reduce((a,r)=>a+r.errors.length,0);status.textContent=bad?`Prüfung abgeschlossen: ${bad} Problem(e) gefunden.`:`Prüfung erfolgreich: ${report.length} Klassenreiter erkannt.`;results.innerHTML='<p><strong>Klassen auswählen:</strong></p>'+report.map(r=>`<label style="display:inline-block;margin-right:18px"><input type="checkbox" class="class-check" value="${esc(r.name)}" ${r.errors.length?'disabled':'checked'}> ${esc(r.name.toUpperCase())}</label>`).join('')+'<table><thead><tr><th>Klasse</th><th>Schüler</th><th>Prüfung</th></tr></thead><tbody>'+report.map(r=>`<tr><td>${esc(r.name)}</td><td>${r.count}</td><td class="${r.errors.length?'err':'ok'}">${r.errors.length?r.errors.map(esc).join('<br>'):'✓ In Ordnung'}</td></tr>`).join('')+'</tbody></table>';}catch(e){status.textContent='Datei konnte nicht geprüft werden: '+e.message;}});

// Daten bleiben ausschließlich im Arbeitsspeicher des Browsers. Keine Netzwerkaufrufe.
function selectedClasses(){return [...document.querySelectorAll('.class-check:checked')].map(el=>el.value)}
function sortedStudents(className){
 const sheet=currentReport.find(r=>r.name===className);if(!sheet)return [];
 const rows=[...sheet.students],mode=document.getElementById('sortMode').value;
 if(mode==='Gruppe aufsteigend')rows.sort((a,b)=>a.group-b.group||a.line-b.line);
 else if(mode==='Gruppe absteigend')rows.sort((a,b)=>b.group-a.group||a.line-b.line);
 else rows.sort((a,b)=>a.name.localeCompare(b.name,'de')*(mode==='Name absteigend'?-1:1));
 return rows;
}
function showPreview(){
 const target=document.getElementById('preview');if(!currentReport.length){target.textContent='Bitte zuerst eine Excel-Datei auswählen.';return;}
 const classes=selectedClasses();if(!classes.length){target.textContent='Bitte mindestens eine gültige Klasse auswählen.';return;}
 const jobs=Object.entries(tasks).flatMap(([cat])=>[...area.querySelectorAll(`input[data-category="${cat}"]:checked`)].map(x=>x.value));
 if(!checkTasks()){target.textContent='Bitte die 2+2+2-Regel einhalten.';return;}
 const docs=['BB','BBK','SE'].filter(k=>document.getElementById('doc'+k).checked);
 if(!docs.length){target.textContent='Bitte mindestens eine Dokumentart auswählen.';return;}
 target.innerHTML='<strong>Geplanter PDF-Lauf:</strong><br>'+classes.map(name=>{const rows=sortedStudents(name),sheet=currentReport.find(r=>r.name===name);return `${esc(name.toUpperCase())}: ${rows.length} Schüler, ${docs.includes('BB')?6:0}${docs.includes('BBK')?'+1 BBK':''}${docs.includes('SE')?'+1 SE':''} Sammeldateien; erstes Kind: ${esc(rows[0]?.name||'–')} (${rows[0]?.group||'–'})`;}).join('<br>')+'<p class="notice">Die PDF-Engine für die originalgetreue Formularverarbeitung ist noch nicht integriert. Es werden noch keine PDFs erstellt.</p>';
}
document.getElementById('previewButton').addEventListener('click',showPreview);

'use strict';
// SaxSVS text PDF importer (local, no OCR). Requires bundled pdf-lib.
// Extracts PDF text operators, including ToUnicode CMaps and WinAnsi fonts.
(function(){
 const pick=id=>document.getElementById(id);
 const file=pick('saxFile'),date=pick('saxDate'),button=pick('saxImport'),status=pick('saxStatus'),preview=pick('saxPreview');
 const bytesToString=b=>Array.from(b,x=>String.fromCharCode(x)).join('');
 const decode=b=>{try{return new TextDecoder('utf-8',{fatal:true}).decode(b)}catch(_){return new TextDecoder('windows-1252').decode(b)}};
 function rawBytes(obj){
  if(!obj)return null;
  try{if(obj instanceof PDFLib.PDFRawStream)return PDFLib.decodePDFRawStream(obj).decode();
   if(obj instanceof PDFLib.PDFContentStream)return obj.getUnencodedContents();}catch(_){return null}
  return null;
 }
 function hexBytes(hex){const s=hex.replace(/\s/g,'');return Uint8Array.from((s.length%2?s+'0':s).match(/../g)||[],x=>parseInt(x,16))}
 function cmapOf(font,ctx){
  const map=new Map();try{const cmap=ctx.lookup(font.get(PDFLib.PDFName.of('ToUnicode'))),b=rawBytes(cmap);if(!b)return map;const s=bytesToString(b);
   const uni=h=>{let t='';for(let i=0;i<h.length;i+=4)t+=String.fromCharCode(parseInt(h.slice(i,i+4),16));return t};
   for(const match of s.matchAll(/beginbfchar([\s\S]*?)endbfchar/g))for(const m of match[1].matchAll(/<([\da-fA-F]+)>\s*<([\da-fA-F]+)>/g))map.set(m[1].toUpperCase(),uni(m[2]));
   for(const match of s.matchAll(/beginbfrange([\s\S]*?)endbfrange/g))for(const line of match[1].split(/\r?\n/)){
    const m=line.match(/<([\da-fA-F]+)>\s*<([\da-fA-F]+)>\s*<([\da-fA-F]+)>/);if(!m)continue;
    const a=parseInt(m[1],16),z=parseInt(m[2],16),v=parseInt(m[3],16),len=m[1].length;
    if(z-a>1024)continue;for(let k=a;k<=z;k++)map.set(k.toString(16).toUpperCase().padStart(len,'0'),uni((v+k-a).toString(16).padStart(m[3].length,'0')));
   }
  }catch(e){console.warn('ToUnicode konnte nicht gelesen werden',e)}return map;
 }
 function fontMaps(page,ctx){const maps=new Map();try{const res=ctx.lookup(page.node.get(PDFLib.PDFName.of('Resources'))),fonts=ctx.lookup(res.get(PDFLib.PDFName.of('Font')));
  for(const [name,ref] of fonts.entries()){const font=ctx.lookup(ref);maps.set(name.decodeText().replace(/^\//,''),cmapOf(font,ctx))}
 }catch(e){console.warn('PDF-Schriften',e)}return maps;}
 function tokenize(s){const out=[];let i=0;while(i<s.length){let c=s[i];if(/\s/.test(c)){i++;continue}if(c==='%'){while(i<s.length&&s[i]!='\n')i++;continue}
  if(c==='('){i++;const b=[];let depth=1;while(i<s.length&&depth){c=s[i++];if(c==='\\'){const n=s[i++];if(/[0-7]/.test(n)){let v=n;for(let j=0;j<2&&/[0-7]/.test(s[i]||'');j++)v+=s[i++];b.push(parseInt(v,8));}else if(n==='n')b.push(10);else if(n==='r')b.push(13);else if(n==='t')b.push(9);else if(n==='\n'){}else b.push(n.charCodeAt(0));}else if(c==='('){depth++;b.push(40)}else if(c===')'){depth--;if(depth)b.push(41)}else b.push(c.charCodeAt(0));}out.push({type:'bytes',value:Uint8Array.from(b)});continue}
  if(c==='<'&&s[i+1]!=='<'){let j=s.indexOf('>',i+1);if(j<0)break;out.push({type:'bytes',value:hexBytes(s.slice(i+1,j))});i=j+1;continue}
  if(c==='['||c===']'){out.push(c);i++;continue}
  const m=s.slice(i).match(/^[^\s()<>\[\]%]+/);if(m){out.push(m[0]);i+=m[0].length}else i++;
 }return out;}
 function extractPage(page,ctx){const maps=fontMaps(page,ctx),items=[];let stream='';
  const contents=page.node.get(PDFLib.PDFName.of('Contents'));const obj=ctx.lookup(contents);
  if(obj instanceof PDFLib.PDFArray){for(let i=0;i<obj.size();i++){const b=rawBytes(ctx.lookup(obj.get(i)));if(b)stream+=bytesToString(b)+'\n'}}else{const b=rawBytes(obj);if(b)stream=bytesToString(b)}
  const tokens=tokenize(stream);let args=[],font='',x=0,y=0,leading=12,fontSize=10;
  function decodeToken(token){const b=token.value,map=maps.get(font)||new Map();if(!map.size)return decode(b);
   let out='';const lens=[...new Set([...map.keys()].map(k=>k.length/2))].sort((a,b)=>b-a);for(let i=0;i<b.length;){let hit=false;for(const n of lens){if(i+n>b.length)continue;const h=Array.from(b.slice(i,i+n),v=>v.toString(16).padStart(2,'0')).join('').toUpperCase();if(map.has(h)){out+=map.get(h);i+=n;hit=true;break}}if(!hit){out+=decode(b.slice(i,i+1));i++}}return out;
  }
  function add(v){if(!v)return;items.push({x,y,text:v});x+=v.length*fontSize*.45}
  for(let i=0;i<tokens.length;i++){const t=tokens[i];if(typeof t!=='string'||!['BT','ET','Tf','Tm','Td','TD','T*','TL','Tj','TJ',"'",'"'].includes(t)){args.push(t);if(args.length>500)args=[];continue}
   if(t==='BT'){x=0;y=0}else if(t==='Tf'){font=String(args.at(-2)||'').replace(/^\//,'');fontSize=Number(args.at(-1))||10}
   else if(t==='Tm'){x=Number(args.at(-6))||0;y=Number(args.at(-5))||0; // replaced below: matrix last two
    x=Number(args.at(-2))||0;y=Number(args.at(-1))||0;
   }else if(t==='Td'||t==='TD'){x+=Number(args.at(-2))||0;y+=Number(args.at(-1))||0;if(t==='TD')leading=-(Number(args.at(-1))||12)}
   else if(t==='TL')leading=Number(args.at(-1))||12;
   else if(t==='T*'||t==="'"){y-=leading;if(t==="'"&&args.at(-1)?.type==='bytes')add(decodeToken(args.at(-1)))}
   else if(t==='Tj'&&args.at(-1)?.type==='bytes')add(decodeToken(args.at(-1)));
   else if(t==='TJ'){const start=args.lastIndexOf('['),end=args.lastIndexOf(']');if(start>=0&&end>start){let combined='';for(const v of args.slice(start+1,end)){if(v?.type==='bytes')combined+=decodeToken(v);else if(typeof v==='string'&&/^[-\d.]+$/.test(v)&&Number(v)<-170)combined+=' '}add(combined)}}
   args=[];
  }return items;
 }
 function readRows(items,height){
  const texts=items.filter(t=>t.text.trim()).sort((a,b)=>b.y-a.y||a.x-b.x);
  const klass=texts.find(t=>/^Klasse\s*$/i.test(t.text.trim()));let cls='';
  if(klass){const candidates=texts.filter(t=>Math.abs(t.y-klass.y)<12&&t.x>klass.x+25&&/^\d{1,2}[a-z]$/i.test(t.text.trim()));cls=candidates[0]?.text.trim().toLowerCase()||''}
  if(!cls){const line=texts.find(t=>/^\d{1,2}[a-z]$/i.test(t.text.trim())&&t.y>height*.60);cls=line?.text.trim().toLowerCase()||''}
  const headN=texts.find(t=>/^Name$/i.test(t.text.trim())),headV=texts.find(t=>/^Vorname$/i.test(t.text.trim()));
  if(!headN||!headV)throw Error('Die Spalten „Name“ und „Vorname“ wurden nicht erkannt. Bitte eine textbasierte SaxSVS-PDF verwenden.');
  const left=headN.x,mid=headV.x,edge=mid+(mid-left)*.99;
  const cells=texts.filter(t=>t.y<headN.y-4&&t.y>35&&t.x>=left-10&&t.x<edge);
  const groups=[];for(const t of cells){let g=groups.find(r=>Math.abs(r.y-t.y)<3);if(!g){g={y:t.y,parts:[]};groups.push(g)}g.parts.push(t)}
  const students=groups.sort((a,b)=>b.y-a.y).map((r,i)=>{const last=r.parts.filter(t=>t.x<mid-5).sort((a,b)=>a.x-b.x).map(t=>t.text.trim()).join(' ').trim();const first=r.parts.filter(t=>t.x>=mid-5).sort((a,b)=>a.x-b.x).map(t=>t.text.trim()).join(' ').trim();return {name:(first+' '+last).trim(),first,last,line:i+2,group:null,observer1:'',observer2:''}}).filter(r=>r.first&&r.last&&!/^(name|vorname)$/i.test(r.last));
  if(!students.length)throw Error('Keine vollständigen Vor- und Nachnamen erkannt. Das PDF könnte ein Bild sein oder eine andere Textkodierung verwenden.');
  if(!cls)throw Error('Klassenbezeichnung konnte nicht sicher erkannt werden.');
  return {cls,students};
 }
 function validDate(s){if(!s)return true;const m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return false;const d=new Date(s+'T00:00:00Z');return d.getUTCFullYear()==+m[1]&&d.getUTCMonth()+1==+m[2]&&d.getUTCDate()==+m[3]}

 const diagButton=pick('saxDiagnose'),diagStatus=pick('saxDiagStatus');
 diagButton.addEventListener('click',async()=>{
  diagButton.disabled=true;diagStatus.textContent='Diagnose wird lokal erstellt …';
  try{
   if(!file.files.length)throw Error('Bitte zuerst eine PDF-Datei auswählen.');
   const doc=await PDFLib.PDFDocument.load(await file.files[0].arrayBuffer());
   const pages=doc.getPages().map((page,i)=>{
    const items=extractPage(page,doc.context).filter(t=>t.text.trim());
    const ys=[...new Set(items.map(t=>Math.round(t.y/5)*5))];
    const xs=[...new Set(items.map(t=>Math.round(t.x/10)*10))].sort((a,b)=>a-b);
    const ranges=[0,0,0,0];
    for(const t of items){const n=t.text.length;ranges[n<=2?0:n<=10?1:n<=25?2:3]++}
    const headings={name:0,vorname:0,klasse:0};
    for(const t of items){const s=t.text.trim().toLowerCase();if(s==='name')headings.name++;if(s==='vorname')headings.vorname++;if(s==='klasse')headings.klasse++}
    const rowCounts=new Map();for(const t of items){const y=Math.round(t.y/5)*5;rowCounts.set(y,(rowCounts.get(y)||0)+1)}
    return {seite:i+1,breite:Math.round(page.getWidth()),hoehe:Math.round(page.getHeight()),textElemente:items.length,zeilenCa:ys.length,spaltenpositionenGerundet:xs,elementeProZeileVerteilung:[...rowCounts.values()].reduce((a,n)=>(a[n>=5?'5plus':String(n)]=(a[n>=5?'5plus':String(n)]||0)+1,a),{}),textlaengenBereiche:{'1-2':ranges[0],'3-10':ranges[1],'11-25':ranges[2],'>25':ranges[3]},spaltenueberschriftenGefunden:headings};
   });
   const report={format:'PA-SaxSVS-Strukturdiagnose-v1',hinweis:'Keine PDF-Texte, Schülernamen oder Dateinamen enthalten. Bitte Bericht vor dem Teilen dennoch prüfen.',seiten:pages};
   const blob=new Blob([JSON.stringify(report,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
   a.href=url;a.download='PA-SaxSVS-Diagnose-ohne-Namen.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
   diagStatus.textContent='Diagnose gespeichert. Bitte JSON-Datei vor dem Teilen prüfen.';
  }catch(e){diagStatus.textContent='Diagnose fehlgeschlagen: '+e.message}finally{diagButton.disabled=false}
 });
 button.addEventListener('click',async()=>{
  status.textContent='PDF wird lokal gelesen …';preview.replaceChildren();button.disabled=true;
  try{if(!file.files.length)throw Error('Bitte eine PDF-Schülerliste auswählen.');if(!validDate(date.value))throw Error('Ungültiges PA-Datum.');
   const doc=await PDFLib.PDFDocument.load(await file.files[0].arrayBuffer());const all=[];let cls='';for(const page of doc.getPages()){
    const {cls:found,students}=readRows(extractPage(page,doc.context),page.getHeight());if(cls&&found!==cls)throw Error('Unterschiedliche Klassen in der PDF erkannt.');cls=found;all.push(...students);
   }
   const dateValue=date.value?date.value.split('-').reverse().join('.'):'';
   const unique=new Map();for(const r of all)unique.set(r.name+'|'+r.line,r);const students=[...unique.values()].map((r,i)=>({...r,line:i+2,date:dateValue}));
   if(students.length>50)throw Error('Mehr als 50 Schüler erkannt. Bitte PDF prüfen.');
   currentReport=[{name:cls,count:students.length,students,errors:[],year:dateValue.slice(-4)||null}];
   results.innerHTML='<p><strong>Klasse auswählen:</strong></p><label><input type="checkbox" class="class-check" value="'+esc(cls)+'" checked> '+esc(cls.toUpperCase())+'</label>';
   refreshExpertClasses();
   const heading=document.createElement('p');heading.textContent=`${cls.toUpperCase()}: ${students.length} Namen erkannt. Bitte die Liste vor dem Drucken prüfen.`;preview.append(heading);
   const list=document.createElement('ol');list.style.maxHeight='250px';list.style.overflow='auto';for(const r of students){const li=document.createElement('li');li.textContent=r.name;list.append(li)}preview.append(list);
   status.textContent='PDF importiert. Schülerliste bitte kontrollieren.';
  }catch(e){currentReport=[];results.replaceChildren();refreshExpertClasses();status.textContent='PDF-Import fehlgeschlagen: '+e.message;console.warn(e)}finally{button.disabled=false}
 });
})();

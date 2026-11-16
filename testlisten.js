// Gemeinsame, lokale Demodaten: werden erst auf Knopfdruck geladen, nie hochgeladen.
(()=>{const path='Vorlagen/Klassenlisten%20Dummydaten_7a-8c.xlsx';
 document.querySelectorAll('[data-test-list]').forEach(b=>b.addEventListener('click',async()=>{
  const input=document.getElementById(b.dataset.testList);
  if(!input)return;
  b.disabled=true;
  try{const res=await fetch(path,{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);
   const file=new File([await res.blob()],'Klassenlisten Dummydaten_7a-8c.xlsx',{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
   const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));
  }catch(e){alert('Testdatei konnte nicht geladen werden: '+e.message);}
  finally{b.disabled=false;}
 }));
})();

const d=require('./_tmp_data1623.cjs');
const want=process.argv.slice(2);
for(const iss of d) for(const s of (iss.subchapters||[])){
  const code=(s.title.match(/ff\.\d+\.\d+/)||[''])[0];
  if(want.includes(code)){ console.log('=== TITLE:',JSON.stringify(s.title)); console.log((s.content||s.text||'').toString().slice(0,1100)); console.log(); }
}

const d=require('./_data0811d.cjs');
const want=process.argv.slice(2);
for(const e of d){ for(const sc of (e.subchapters||[])){
  for(const w of want){ if(sc.title.includes(w)){ console.log('=== TITLE:',JSON.stringify(sc.title)); console.log(String(sc.content||sc.body||sc.text||'').replace(/<[^>]*>/g,' ').slice(0,900)); console.log(); } }
}}

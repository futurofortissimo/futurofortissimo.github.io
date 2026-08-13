const fs=require('fs');
const d=fs.readFileSync('data.js','utf8');
const s=d.indexOf('[');let t=d.slice(s).trim();
while(t.length&&!t.endsWith(']'))t=t.slice(0,-1);
const a=JSON.parse(t);
const want=process.argv.slice(2);
for(const iss of a) for(const sc of (iss.subchapters||[])){
  for(const w of want){
    if((sc.title||'').includes(w)){
      console.log('=== TITLE(verbatim):',JSON.stringify(sc.title));
      console.log('--- CONTENT:',(sc.content||'').replace(/\s+/g,' ').slice(0,900));
      console.log();
    }
  }
}

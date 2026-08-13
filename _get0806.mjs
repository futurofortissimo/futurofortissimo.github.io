import {rawData} from './data.js';
const codes=process.argv.slice(2);
for(const iss of rawData) for(const sc of (iss.subchapters||[])){
  const t=sc.title||'';
  for(const c of codes){
    if(t.replace(/\s+/g,'').includes(c.replace(/\s+/g,''))){
      console.log('=== TITLE:',JSON.stringify(t));
      console.log((sc.content||'').replace(/\s+/g,' ').slice(0,1400));
      console.log();
    }
  }
}

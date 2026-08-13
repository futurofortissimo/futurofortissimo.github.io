import {rawData} from './data.js';
const want=process.argv.slice(2);
for(const iss of rawData) for(const sc of (iss.subchapters||[])){
  const t=sc.title||'';
  for(const w of want) if(t.replace(/\s+/g,'').includes(w.replace(/\s+/g,''))){
    console.log('=== TITLE:',JSON.stringify(t));
    console.log('LINK:',sc.link);
    console.log((sc.content||'').slice(0,1400));
    console.log('---');
  }
}

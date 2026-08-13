import {rawData} from './data.js';
const terms=process.argv.slice(2).map(t=>t.toLowerCase());
for(const iss of rawData) for(const sc of (iss.subchapters||[])){
  const blob=((sc.title||'')+' '+(sc.content||'')).toLowerCase();
  for(const t of terms){
    let i=blob.indexOf(t);
    if(i>=0) console.log('###', sc.title.replace(/\s+/g,' ').slice(0,90), '|', (sc.content||'').replace(/\s+/g,' ').slice(Math.max(0,i-160), i+220));
  }
}

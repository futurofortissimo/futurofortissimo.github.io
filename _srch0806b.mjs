import {rawData} from './data.js';
const terms = process.argv.slice(2).map(s=>s.toLowerCase());
const out=[];
for(const n of rawData){
  for(const s of (n.subchapters||[])){
    const body=(s.content||s.text||JSON.stringify(s));
    const blob=((s.title||'')+' '+body).toLowerCase();
    for(const t of terms) if(blob.includes(t)) { out.push([t, s.title, body.slice(0,200).replace(/\s+/g,' ')]); break; }
  }
}
for(const o of out) console.log(o[0]+' >> '+o[1]+' || '+o[2]);
console.log('TOT', out.length);

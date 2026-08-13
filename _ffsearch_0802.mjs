import {rawData} from './data.js';
const terms = process.argv.slice(2).map(s=>s.toLowerCase());
const out=[];
for (const iss of rawData) {
  for (const sc of (iss.subchapters||[])) {
    const blob = JSON.stringify(sc).toLowerCase();
    const hits = terms.filter(t=>blob.includes(t));
    if (hits.length) out.push({t:sc.title, hits, snip:(sc.content||'').slice(0,200)});
  }
}
out.sort((a,b)=>b.hits.length-a.hits.length);
for (const o of out.slice(0,40)) console.log(o.hits.join(',')+' | '+o.t+'\n    '+o.snip.replace(/\s+/g,' ')+'\n');

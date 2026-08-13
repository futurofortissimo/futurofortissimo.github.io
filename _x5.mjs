import {rawData} from './data.js';
const seen={};
for(const e of rawData) for(const s of (e.subchapters||[])){
  const m=(s.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  (seen[m[0]]=seen[m[0]]||[]).push(s.title.trim());
}
const dups=Object.entries(seen).filter(([k,v])=>v.length>1);
console.log('duplicated codes:',dups.length);
console.log('range81-160 unique total:',Object.keys(seen).filter(k=>{const n=+k.split('.')[1];return n>=81&&n<=160;}).length);

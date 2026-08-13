import {rawData} from './data.js';
for(const n of [4,53,132]){
  const iss=rawData.find(i=>{const m=/ff\.(\d+)/.exec(i.title||'');return m&&+m[1]===n});
  if(!iss){console.log('ff.'+n+' missing');continue}
  console.log('=== ff.'+n+' :: '+JSON.stringify(iss.title));
  (iss.subchapters||[]).forEach(s=>console.log('   *',JSON.stringify(s.title)));
}

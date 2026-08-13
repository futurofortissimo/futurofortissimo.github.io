import {rawData} from './data.js';
const want={4:'ff.4.1',53:'ff.53.3',132:'ff.132.3'};
for(const n of Object.keys(want)){
  const iss=rawData.find(i=>{const m=/ff\.(\d+)/.exec(i.title||'');return m&&+m[1]===+n});
  const sc=(iss.subchapters||[]).find(s=>s.title.includes(want[n]));
  console.log('=== '+want[n]+' :: '+sc.title);
  console.log((sc.content||'').replace(/\s+/g,' ').slice(0,1400));
  console.log('');
}

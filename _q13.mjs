import {rawData} from './data.js';
const rx=new RegExp(process.argv[2],'i');
for (const issue of rawData) for (const sub of (issue.subchapters||[])){
  const blob=(sub.title||'')+' '+(sub.content||'');
  if(rx.test(blob)){ const m=(sub.title||'').match(/ff\.\d+\.\d+/); console.log('###', sub.title.slice(0,90).replace(/\n/g,' ')); console.log('   ', (sub.content||'').replace(/\s+/g,' ').slice(0,300)); }
}

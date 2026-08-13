import {rawData} from './data.js';
const re=new RegExp(process.argv[2]);
for(const n of rawData) for(const s of (n.subchapters||[])) if(re.test(s.title||'')) console.log(JSON.stringify(s.title)+' || '+((s.content||s.text||'').slice(0,260).replace(/\s+/g,' ')));

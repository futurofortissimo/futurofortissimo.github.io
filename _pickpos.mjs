import {rawData} from './data.js';
const inChap=new Set(['ff.1.2','ff.12.4','ff.20.1','ff.20.2','ff.20.3','ff.26.5','ff.32.5','ff.34.5','ff.5.1','ff.5.6','ff.57.3','ff.58.3','ff.98.1']);
const kw=new RegExp(process.argv[2],'i');
for(const e of rawData) for(const sc of (e.subchapters||[])){
  const m=(sc.title||'').match(/ff\.\d+\.\d+/); if(!m) continue;
  const code=m[0]; if(inChap.has(code)) continue;
  const body=String(sc.content||'').replace(/\s+/g,' ');
  if(kw.test(sc.title)||kw.test(body)) console.log(code+' | '+sc.title.replace(/\s+/g,' ')+' || '+body.slice(0,200));
}

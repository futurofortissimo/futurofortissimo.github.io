import {rawData} from './data.js';
for(const e of rawData) for(const sc of (e.subchapters||[])){
  const m=(sc.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  if(+m[1]<152) continue;
  const body=String(sc.content||'').replace(/\s+/g,' ');
  console.log(m[0]+' | '+sc.title.replace(/\s+/g,' ')+' || '+body.slice(0,170));
}

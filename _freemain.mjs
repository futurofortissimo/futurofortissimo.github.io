import {rawData} from './data.js';
import fs from 'fs';
const used=new Set(JSON.parse(fs.readFileSync('_usedmain0812.json','utf8')));
const free=[];
for(const e of rawData) for(const sc of (e.subchapters||[])){
  const m=(sc.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  const code='ff.'+m[1]+'.'+m[2]; if(used.has(code)) continue;
  const body=String(sc.content||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
  free.push([+m[1],code,sc.title.replace(/\s+/g,' '),body.slice(0,220)]);
}
free.sort((a,b)=>a[0]-b[0]);
console.error('FREE_VS_MAIN',free.length);
for(const f of free) console.log(f[1],'|',f[2],'||',f[3]);

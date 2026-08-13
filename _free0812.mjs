import {rawData} from './data.js';
import fs from 'fs';
const used=new Set(JSON.parse(fs.readFileSync('_usedxr0812.json','utf8')));
let all=0, free=[];
for(const e of rawData) for(const sc of (e.subchapters||[])){
  const m=(sc.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue; all++;
  const code='ff.'+m[1]+'.'+m[2]; if(used.has(code)) continue;
  free.push([+m[1],code,sc.title.replace(/\s+/g,' ')]);
}
free.sort((a,b)=>a[0]-b[0]);
console.error('TOTAL',all,'FREE',free.length);
for(const f of free) console.log(f[1],'|',f[2]);

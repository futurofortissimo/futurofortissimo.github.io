import {rawData} from './data.js';
import fs from 'fs';
const used=new Set(JSON.parse(fs.readFileSync('_usedxr0811.json','utf8')));
for(const f of fs.readdirSync('book')) if(f.endsWith('.html')){
  const t=fs.readFileSync('book/'+f,'utf8');
  for(const m of t.matchAll(/ff\.(\d+)\.(\d+)/g)) used.add('ff.'+m[1]+'.'+m[2]);
}
let free=[];
for(const e of rawData) for(const sc of (e.subchapters||[])){
  const m=(sc.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  const code='ff.'+m[1]+'.'+m[2]; if(used.has(code)) continue;
  free.push([+m[1],code,sc.title.replace(/\s+/g,' ')]);
}
free.sort((a,b)=>a[0]-b[0]);
console.error('FREE',free.length);
for(const f of free) console.log(f[1],'|',f[2]);

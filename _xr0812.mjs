import {rawData} from './data.js';
import fs from 'fs';
const used=new Set(JSON.parse(fs.readFileSync('_usedxr0811.json','utf8')));
// add local book files
for(const f of fs.readdirSync('book')) if(f.endsWith('.html')){
  const t=fs.readFileSync('book/'+f,'utf8');
  for(const m of t.matchAll(/ff\.(\d+)\.(\d+)/g)) used.add('ff.'+m[1]+'.'+m[2]);
}
const kw=new RegExp(process.argv[2],'i');
const out=[];
for(const e of rawData) for(const sc of (e.subchapters||[])){
  const m=(sc.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  const code='ff.'+m[1]+'.'+m[2]; if(used.has(code)) continue;
  const body=String(sc.content||sc.body||sc.text||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
  if(kw.test(sc.title)||kw.test(body)) out.push([+m[1],code,sc.title.replace(/\s+/g,' '),body.slice(0,260)]);
}
out.sort((a,b)=>a[0]-b[0]);
for(const o of out) console.log(o[1],'|',o[2],'||',o[3]);
console.error('HITS',out.length,'USED',used.size);

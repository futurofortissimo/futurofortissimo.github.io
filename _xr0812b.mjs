import {rawData} from './data.js';
import fs from 'fs';
const used=new Set(JSON.parse(fs.readFileSync('_usedxr0811.json','utf8')));
for(const f of fs.readdirSync('book')) if(f.endsWith('.html')){
  const t=fs.readFileSync('book/'+f,'utf8');
  for(const m of t.matchAll(/ff\.(\d+)\.(\d+)/g)) used.add('ff.'+m[1]+'.'+m[2]);
}
const kw=new RegExp(process.argv[2],'i');
let tot=0, free=0;
for(const e of rawData) for(const sc of (e.subchapters||[])){
  const m=(sc.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  const code='ff.'+m[1]+'.'+m[2];
  const body=String(sc.content||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
  if(kw.test(sc.title)||kw.test(body)){ tot++; const u=used.has(code); if(!u)free++;
    console.log((u?'USED ':'FREE '),code,'|',sc.title.replace(/\s+/g,' '),'||',body.slice(0,200)); }
}
console.error('TOT',tot,'FREE',free);

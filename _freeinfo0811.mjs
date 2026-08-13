import {rawData} from './data.js';
import fs from 'fs';
const free=new Set(fs.readFileSync('_free0811.txt','utf8').split(/\r?\n/).filter(Boolean));
for(const e of rawData){
  for(const sc of (e.subchapters||[])){
    const m=(sc.title||'').match(/ff\.(\d+)\.(\d+)/);
    if(!m) continue;
    const code=m[0];
    if(!free.has(code)) continue;
    const body=String(sc.content||'').replace(/\s+/g,' ');
    console.log('=== '+code+' | TITLE: '+sc.title.replace(/\s+/g,' '));
    console.log('    '+body.slice(0,340));
  }
}

import {rawData} from './data.js';
const used=new Set('ff.1.2 ff.1.3 ff.11.1 ff.12.4 ff.138.1 ff.138.2 ff.20.1 ff.20.2 ff.20.3 ff.26.5 ff.32.5 ff.34.2 ff.34.3 ff.34.5 ff.5.1 ff.5.3 ff.5.6 ff.57.3 ff.58.3 ff.60.1 ff.60.3 ff.60.4 ff.60.5 ff.98.1'.split(' '));
const kw=new RegExp(process.argv[2],'i');
let n=0;
for(const e of rawData){for(const sc of (e.subchapters||[])){
 const m=(sc.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
 const code='ff.'+m[1]+'.'+m[2]; if(used.has(code)) continue;
 const body=String(sc.content||sc.body||sc.text||'').replace(/<[^>]*>/g,' ');
 if(kw.test(sc.title)||kw.test(body)){ n++; console.log(code,'|',sc.title.replace(/\s+/g,' '),'||',body.replace(/\s+/g,' ').slice(0,190)); }
}}
console.error('HITS',n);

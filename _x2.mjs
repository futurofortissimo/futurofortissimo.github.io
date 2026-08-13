import {rawData} from './data.js';
const used=new Set(['ff.42.2','ff.11.2','ff.28.3','ff.70.1','ff.11.1','ff.1.2','ff.70.4','ff.46.2','ff.46.3','ff.70.2','ff.115.1','ff.11.5','ff.26.2','ff.58.4','ff.58.2','ff.61.4','ff.149.1','ff.149.2','ff.149.3','ff.149.4','ff.149.5','ff.12','ff.32','ff.56.2','ff.135.2','ff.149.3']);
const kw=/carbone|coal|solare|fotovolt|rete elettrica|batteri|mix elettric|gas natural|elettricit|kWh|megawatt|rinnovabil|curva di Wright|costo del solare|stoccaggio|accumul/i;
const out=[];
for(const e of rawData){
  for(const s of (e.subchapters||[])){
    const m=(s.title||'').match(/ff\.(\d+)\.(\d+)/);
    if(!m) continue;
    const code='ff.'+m[1]+'.'+m[2];
    if(used.has(code)) continue;
    const txt=(s.content||'');
    if(kw.test(txt)||kw.test(s.title)){
      const hits=(txt.match(kw)||[]).length;
      out.push({code,title:s.title.trim(),len:txt.length,snip:txt.slice(0,220).replace(/\s+/g,' ')});
    }
  }
}
out.sort((a,b)=>parseInt(a.code.split('.')[1])-parseInt(b.code.split('.')[1]));
console.log('candidates:',out.length);
for(const o of out) console.log(o.code,'|',o.title,'|',o.snip.slice(0,150));

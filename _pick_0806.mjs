import {rawData} from './data.js';
const terms=process.argv.slice(2).map(t=>t.toLowerCase());
const lo=+process.env.LO||0, hi=+process.env.HI||9999;
const out=[];
for(const iss of rawData) for(const sc of (iss.subchapters||[])){
  const code=(sc.title||'').match(/ff\.(\d+)\.(\d+)/);
  if(!code) continue; const n=+code[1]; if(n<lo||n>hi) continue;
  const blob=((sc.title||'')+' '+(sc.content||'')).toLowerCase();
  let s=0; for(const t of terms) if(blob.includes(t)) s++;
  if(s) out.push({s,title:sc.title,snip:(sc.content||'').replace(/\s+/g,' ').slice(0,200)});
}
out.sort((a,b)=>b.s-a.s);
for(const o of out.slice(0,12)) console.log(o.s,'|',o.title,'\n   ',o.snip,'\n');

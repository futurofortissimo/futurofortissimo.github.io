import {rawData} from './data.js';
const terms=process.argv.slice(2).map(t=>t.toLowerCase());
const out=[];
for(const iss of rawData) for(const sc of (iss.subchapters||[])){
  const t=sc.title||''; const c=(sc.content||'');
  const blob=(t+' '+c).toLowerCase();
  let s=0, hits=[];
  for(const term of terms) if(blob.includes(term)){s++;hits.push(term);}
  if(s) out.push({s,t,hits,snip:c.replace(/\s+/g,' ').slice(0,260)});
}
out.sort((a,b)=>b.s-a.s);
for(const o of out.slice(0,20)) console.log(o.s,o.hits.join(','),'|',o.t,'\n   ',o.snip,'\n');

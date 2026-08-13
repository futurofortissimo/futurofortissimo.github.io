import {rawData} from './data.js';
const terms = process.argv.slice(2).map(s=>s.toLowerCase());
const out=[];
for(const n of rawData){
  for(const s of (n.subchapters||[])){
    const t=(s.title||''); const c=(s.content||'');
    const hay=(t+' '+c).toLowerCase();
    let score=0; for(const term of terms) if(hay.includes(term)) score++;
    if(score>0) out.push({score, title:t, link:s.link, snip:c.slice(0,220)});
  }
}
out.sort((a,b)=>b.score-a.score);
for(const o of out.slice(0,25)) console.log(o.score,'|',o.title,'\n   ',o.snip.replace(/\s+/g,' ').slice(0,200),'\n');

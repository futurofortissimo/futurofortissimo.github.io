import {rawData} from './data.js';
const terms=process.argv.slice(2).map(s=>s.toLowerCase());
const out=[];
for(const iss of rawData){
  for(const sc of (iss.subchapters||[])){
    const t=(sc.title||'')+' '+(sc.content||'');
    const lt=t.toLowerCase();
    let score=0; const hit=[];
    for(const term of terms){ if(lt.includes(term)){score++; hit.push(term);} }
    if(score) out.push({score,title:sc.title,hit,iss:iss.title});
  }
}
out.sort((a,b)=>b.score-a.score);
for(const o of out.slice(0,40)) console.log(o.score,'|',o.title,'|',o.hit.join(','));

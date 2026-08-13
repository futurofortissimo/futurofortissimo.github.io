import {rawData} from './data.js';
const terms = process.argv.slice(2).map(t=>t.toLowerCase());
const out=[];
for(const iss of rawData){
  for(const sc of (iss.subchapters||[])){
    const blob=((sc.title||'')+' '+(sc.content||'')+' '+JSON.stringify(sc.keypoints||'')).toLowerCase();
    let score=0; for(const t of terms) if(blob.includes(t)) score++;
    if(score) out.push({score, code:(sc.title||'').match(/ff\.\d+\.\d+/)?.[0], title:sc.title, snip:(sc.content||'').slice(0,260)});
  }
}
out.sort((a,b)=>b.score-a.score);
for(const o of out.slice(0,18)) console.log(o.score,'|',o.title,'\n   ',o.snip.replace(/\s+/g,' '),'\n');

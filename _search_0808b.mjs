import {rawData} from './data.js';
const terms=process.argv.slice(2).map(s=>s.toLowerCase());
const out=[];
for(const iss of rawData) for(const sc of (iss.subchapters||[])){
  const t=(sc.title||''), c=(sc.content||'');
  const hay=(t+' '+c).toLowerCase();
  let score=0; for(const term of terms) if(hay.includes(term)) score++;
  if(score) out.push({score,title:t.replace(/\s+/g,' '),snip:c.replace(/\s+/g,' ').slice(0,260)});
}
out.sort((a,b)=>b.score-a.score);
for(const o of out.slice(0,25)) console.log('['+o.score+']',o.title,'\n   ',o.snip,'\n');

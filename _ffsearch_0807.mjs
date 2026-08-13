import { rawData } from './data.js';
const terms = process.argv.slice(2).map(s=>s.toLowerCase());
const out=[];
for (const p of rawData) {
  for (const s of (p.subchapters||[])) {
    const hay = ((s.title||'')+' '+(s.content||'')).toLowerCase();
    const score = terms.filter(t=>hay.includes(t)).length;
    if (score>0) out.push({score, title:s.title, snippet:(s.content||'').slice(0,260)});
  }
}
out.sort((a,b)=>b.score-a.score);
for (const o of out.slice(0,25)) console.log(o.score,'|',o.title,'\n   ',o.snippet.replace(/\s+/g,' '),'\n');

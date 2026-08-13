import {rawData} from './data.js';
import {readFileSync} from 'fs';
const used=new Set(readFileSync('./used_codes_book.txt','utf8').split(/\s+/).map(s=>s.replace(/^ff\./,'').trim()).filter(Boolean));
// codes touched by OPEN PRs 475-482 (not yet merged into used_codes_book.txt)
'125.3 14.2 42.4 135.2 149.1 149.3 11.3 110.4 16.4 37.4 70.4 73.6 82.2 120.5 53.1 33.4 34.4 56.4 22.1 35.3 35.4 47.1 68.2 86.2 86.3 1.5 2.1 52.2 73.2 82.4'.split(' ').forEach(c=>used.add(c));
const natura=/solar|fotovolt|eolic|rinnovab|\benergia\b|clima|co2|carbon|emissio|batter|nuclear|idrogen|foresta|biodiver|oceano|acqua|fiume|agricol|suolo|plastic|ricicl|geoinge|rete elettric|grid/i;
const filler=/cuoricino|refer a friend|whatsapp|buona estate|supportare questo progetto|prompt:/i;
const out=[];
for (const issue of rawData) for (const sub of (issue.subchapters||[])){
  const m=(sub.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  const code=m[1]+'.'+m[2]; if(used.has(code)) continue;
  const c=(sub.content||''); if(c.length<600||filler.test(c)) continue;
  if(!natura.test(sub.title+' '+c)) continue;
  out.push({code,num:+m[1],title:(sub.title||'').replace(/\s+/g,' ').slice(0,75),len:c.length});
}
out.sort((a,b)=>a.num-b.num);
console.log('CANDIDATES:',out.length);
const buckets={OLD:out.filter(x=>x.num<55),MID:out.filter(x=>x.num>=55&&x.num<115),REC:out.filter(x=>x.num>=115)};
for(const b of Object.keys(buckets)){console.log('====',b,buckets[b].length);buckets[b].slice(0,14).forEach(x=>console.log(' ff.'+x.code,'['+x.len+']',x.title));}

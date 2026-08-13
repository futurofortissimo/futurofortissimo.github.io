import {rawData} from './data.js';
import {readFileSync} from 'fs';
const used=new Set(readFileSync('./used_codes_book.txt','utf8').split(/\s+/).map(s=>s.replace(/^ff\./,'').trim()).filter(Boolean));
['149.3','139.3','137.2','43.3','8.5','31.1','24.4','71.4','67.3','146.3','90.3','40.2'].forEach(c=>used.add(c));
const kw=/solar|fotovolt|eolic|rinnovab|\benergia\b|clima|co2|carbon|emissio|batter|nuclear|idrogen|foresta|biodiver|oceano|agricol|carne|microbioma|elettric|veicol|mobilit|cibo|dieta|nutri|plastic|ricicl|geoinge/i;
const filler=/cuoricino|caffè|caffe|refer a friend|whatsapp|buona estate|supportare questo progetto|©|prompt:/i;
const out=[];
for (const issue of rawData) for (const sub of (issue.subchapters||[])){
  const m=sub.title.match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  const code=m[1]+'.'+m[2]; if(used.has(code)) continue;
  const c=(sub.content||''); if(c.length<500) continue;
  const blob=sub.title+' '+c;
  if(!kw.test(blob)) continue;
  // count filler hits
  const f=(c.match(filler)||[]).length;
  out.push({code,num:+m[1],title:sub.title.slice(0,55),len:c.length,filler:f});
}
out.sort((a,b)=>a.num-b.num);
out.forEach(x=>console.log(x.num<60?'OLD':x.num<120?'MID':'REC',`ff.${x.code}`,`[${x.len}|f${x.filler}]`,x.title));

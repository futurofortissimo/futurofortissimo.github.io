import {rawData} from './data.js';
import {readFileSync} from 'fs';
const used=new Set(readFileSync('./used_codes_book.txt','utf8').split(/\s+/).map(s=>s.replace(/^ff\./,'').trim()).filter(Boolean));
// codes touched by open PRs 459-466
'102.2 11.2 112.5 120.1 120.2 123.2 124.3 129.2 135.2 138.5 139.1 139.2 14.2 145.1 148.2 149.3 30.2 42.2 53.1 82.2 82.3 87.4 90.3 43.3 8.5 31.1 24.4 71.4 67.3 137.2 139.3 146.3 40.2'.split(' ').forEach(c=>used.add(c));
const axes = {
  natura: /solar|fotovolt|eolic|rinnovab|\benergia\b|clima|co2|carbon|emissio|batter|nuclear|idrogen|foresta|biodiver|oceano|acqua|agricol|carne|microbioma|elettric|veicol|mobilit|\bcibo\b|dieta|nutri|plastic|ricicl|geoinge|citt/i,
  tech: /\bai\b|intelligenza artific|robot|chip|gpu|nvidia|openai|llm|gpt-|neural|deep ?learn|algoritm|comput|datacenter|modell[oi] linguistic/i,
  societa: /democra|politic|demograf|fertilit|natalit|cripto|crypto|economia|lavoro|cultura|psicolog|felicit|stress|solitudin|longevit|sport|salute|sonno|dopamin|social/i,
};
const filler=/cuoricino|refer a friend|whatsapp|buona estate|supportare questo progetto|prompt:/i;
const cand={natura:[],tech:[],societa:[]};
for (const issue of rawData) for (const sub of (issue.subchapters||[])){
  const m=(sub.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  const code=m[1]+'.'+m[2]; if(used.has(code)) continue;
  const c=(sub.content||''); if(c.length<500||filler.test(c)) continue;
  const blob=sub.title+' '+c;
  for(const ax of Object.keys(axes)){ if(axes[ax].test(blob)){ cand[ax].push({code,num:+m[1],title:sub.title.slice(0,60),len:c.length}); break; } }
}
for(const ax of Object.keys(cand)){
  cand[ax].sort((a,b)=>a.num-b.num);
  console.log(`==== ${ax.toUpperCase()} (${cand[ax].length}) ====`);
  const buckets={OLD:cand[ax].filter(x=>x.num<60),MID:cand[ax].filter(x=>x.num>=60&&x.num<120),REC:cand[ax].filter(x=>x.num>=120)};
  for(const b of Object.keys(buckets)) buckets[b].slice(0,8).forEach(x=>console.log(b,`ff.${x.code}`,`[${x.len}]`,x.title));
}

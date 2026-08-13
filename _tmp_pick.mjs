import {rawData} from './data.js';
import {readFileSync} from 'fs';
const usedTxt = readFileSync('./used_codes_book.txt','utf8');
const used = new Set(usedTxt.split(/\s+/).map(s=>s.replace(/^ff\./,'').trim()).filter(Boolean));
['149.3','139.3','137.2'].forEach(c=>used.add(c));

const axes = {
  natura: /solar|eolic|rinnovab|energia|clima|co2|carbon|emissio|batter|nuclear|ambient|foresta|albero|pianta|biodiver|acqua|oceano|mare|mobilit|\bauto\b|bici|citt|cibo|dieta|nutri|agricol|carne|food|plastic|ricicl/i,
  tech: /\bai\b|intelligenza artific|robot|chip|gpu|nvidia|openai|llm|gpt|modello|neural|deep ?learn|algoritm|softwar|comput|cyber|stable ?diff|genera(tiv|zione)/i,
  societa: /democr|politic|demograf|fertilit|natali|stato|nazione|cripto|crypto|economia|lavoro|cultura|psicolog|felicit|stress|solitudin|longevit|sport|wellbeing|diseguag/i,
};
function lookup(code){
  for (const issue of rawData) for (const sub of (issue.subchapters||[])){
    const m=sub.title.match(/ff\.(\d+)\.(\d+)/);
    if(m && (m[1]+'.'+m[2])===code) return sub;
  }
  return null;
}
const cand={natura:[],tech:[],societa:[]};
for (const issue of rawData) for (const sub of (issue.subchapters||[])){
  const m=sub.title.match(/ff\.(\d+)\.(\d+)/);
  if(!m) continue;
  const code=m[1]+'.'+m[2];
  if(used.has(code)) continue;
  const c=(sub.content||'');
  if(c.length<350) continue;
  const blob=(sub.title+' '+c);
  for(const ax of Object.keys(axes)){
    if(axes[ax].test(blob)){ cand[ax].push({code,num:+m[1],emoji:sub.title.split(' ')[0],title:sub.title,len:c.length}); break; }
  }
}
for(const ax of Object.keys(cand)){
  cand[ax].sort((a,b)=>a.num-b.num);
  console.log(`\n==== ${ax.toUpperCase()} (${cand[ax].length}) ====`);
  console.log('OLD<60:', cand[ax].filter(x=>x.num<60).slice(0,10).map(x=>x.code).join(' '));
  console.log('MID60-120:', cand[ax].filter(x=>x.num>=60&&x.num<120).slice(0,10).map(x=>x.code).join(' '));
  console.log('REC>=120:', cand[ax].filter(x=>x.num>=120).slice(0,10).map(x=>x.code).join(' '));
}

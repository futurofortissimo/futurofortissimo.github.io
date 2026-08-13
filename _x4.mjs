import {rawData} from './data.js';
const seen={};
for(const e of rawData) for(const s of (e.subchapters||[])){
  const m=(s.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  (seen[m[0]]=seen[m[0]]||[]).push({t:s.title.trim(),c:(s.content||'').replace(/\s+/g,' ')});
}
const used=new Set(['ff.42.2','ff.11.2','ff.28.3','ff.70.1','ff.11.1','ff.1.2','ff.70.4','ff.46.2','ff.46.3','ff.70.2','ff.115.1','ff.11.5','ff.26.2','ff.58.4','ff.58.2','ff.61.4','ff.149.1','ff.149.2','ff.149.3','ff.149.4','ff.149.5','ff.56.2','ff.135.2','ff.28.3']);
const kw=/carbone|mix elettric|rete elettrica|generazion|batter|accumul|stoccagg|fotovolt|solare|eolic|gigawatt|GW\b|TWh|kWh|bolletta|centrale/i;
for(const [code,arr] of Object.entries(seen)){
  const n=parseInt(code.split('.')[1]);
  if(n<81||n>160) continue;
  if(used.has(code)) continue;
  if(arr.length>1) continue; // skip ambiguous duplicated codes
  const {t,c}=arr[0];
  const hits=(c.match(kw)||[]).length;
  if(hits>=1) console.log(hits,'|',code,'|',t,'|',c.slice(0,190));
}

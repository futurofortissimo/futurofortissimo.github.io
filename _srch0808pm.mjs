import {rawData} from './data.js';
const terms=process.argv.slice(2).map(s=>s.toLowerCase());
const used=new Set(['ff.110.2','ff.123.1','ff.129.3','ff.59.1','ff.59.2','ff.140.3','ff.98.2','ff.4.1','ff.4.4','ff.119.1','ff.71.2','ff.1.5','ff.8.3','ff.54.1','ff.102.2','ff.53.3','ff.132.3','ff.12.3','ff.105.2','ff.120.4','ff.92.1','ff.120.3','ff.49.4','ff.73.2','ff.52.2','ff.86.2','ff.35.4','ff.68.2','ff.61.1','ff.87.2','ff.84.4','ff.1.6','ff.28.1','ff.24.4','ff.135.4']);
for(const p of rawData){
 for(const s of (p.subchapters||[])){
  const code=(s.title||'').match(/ff\.\d+\.\d+/)?.[0];
  if(!code||used.has(code)) continue;
  const blob=((s.title||'')+' '+(s.content||'')).toLowerCase();
  const hits=terms.filter(t=>blob.includes(t));
  if(hits.length){
   console.log(code,'|',hits.join(','),'|',s.title.trim());
  }
 }
}

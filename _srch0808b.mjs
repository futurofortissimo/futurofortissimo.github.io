import {rawData} from './data.js';
const kws = process.argv.slice(2).map(s=>s.toLowerCase());
const used = new Set(require0());
function require0(){ return []; }
for (const it of rawData){
  for (const sc of (it.subchapters||[])){
    const hay = ((sc.title||'')+' '+(sc.content||'')).toLowerCase();
    if (kws.some(k=>hay.includes(k))){
      const m = (sc.title||'').match(/ff\.\d+\.\d+/);
      console.log('---', sc.title, '|', sc.link);
      const idx = hay.indexOf(kws.find(k=>hay.includes(k)));
      console.log('   ...'+(sc.content||'').slice(Math.max(0,idx-160), idx+260).replace(/\s+/g,' '));
    }
  }
}

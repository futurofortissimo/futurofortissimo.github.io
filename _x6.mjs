import {rawData} from './data.js';
for(const e of rawData) for(const s of (e.subchapters||[])){
  const m=(s.title||'').match(/ff\.\d+\.\d+/);
  if(m&&['ff.81.3'].includes(m[0])){
    console.log('TITLE_RAW:['+s.title+']');
    console.log('CP:',[...s.title].slice(0,5).map(c=>c.codePointAt(0).toString(16)).join(' '));
    console.log((s.content||'').replace(/\s+/g,' ').slice(0,900));
  }
}

import {rawData} from './data.js';
const want=['ff.5.2','ff.70.3','ff.135.1'];
for(const e of rawData) for(const s of (e.subchapters||[])){
  const m=(s.title||'').match(/ff\.\d+\.\d+/);
  if(m&&want.includes(m[0])){
    console.log('=== CODE:',m[0]);
    console.log('TITLE_RAW:['+s.title+']');
    console.log('CODEPOINTS:',[...s.title].slice(0,4).map(c=>c.codePointAt(0).toString(16)).join(' '));
    console.log('CONTENT:',(s.content||'').replace(/\s+/g,' ').slice(0,700));
    console.log();
  }
}

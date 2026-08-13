import { rawData } from './data.js';
const codes = process.argv.slice(2);
for (const c of codes) {
  let found=false;
  for (const p of rawData) for (const s of (p.subchapters||[])) {
    if ((s.title||'').replace(/\s+/g,' ').includes(c)) {
      found=true;
      console.log('=== ', JSON.stringify(s.title));
      console.log('CONTENT:', (s.content||'').replace(/\s+/g,' ').slice(0,900));
      console.log();
    }
  }
  if(!found) console.log('!!! NOT FOUND:', c);
}

import { rawData } from './data.js';
const map = {};
for (const nl of rawData) {
  for (const sc of (nl.subchapters||[])) {
    const m = (sc.title||'').match(/ff\.(\d+)\.(\d+)/);
    if (m) map['ff.'+m[1]+'.'+m[2]] = sc;
  }
}
const mode = process.argv[2];
if (mode === 'search') {
  const kw = process.argv.slice(3).map(s=>s.toLowerCase());
  for (const [code,sc] of Object.entries(map)) {
    const hay = ((sc.title||'')+' '+(sc.content||'')).toLowerCase();
    if (kw.every(k=>hay.includes(k))) console.log(code+' | '+sc.title.replace(/\s+/g,' ').trim());
  }
} else {
  for (const code of process.argv.slice(2)) {
    const sc = map[code];
    if (!sc) { console.log('### '+code+' :: NOT FOUND'); continue; }
    console.log('### '+code+' :: '+sc.title.replace(/\s+/g,' ').trim());
    console.log((sc.content||'').replace(/\s+/g,' ').trim().slice(0,700));
    console.log('');
  }
}

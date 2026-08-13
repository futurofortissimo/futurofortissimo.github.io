import fs from 'fs';
const src = fs.readFileSync('data.js','utf8');
const mod = await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
const used = new Set(fs.readFileSync('book/chapter-02-1-4.html','utf8').match(/ff\.\d+\.\d+/g)||[]);
const terms=process.argv.slice(2).map(s=>s.toLowerCase());
for (const post of mod.rawData) for (const sc of (post.subchapters||[])) {
  const code=(sc.title||'').match(/ff\.\d+\.\d+/)?.[0]; if(!code) continue;
  const n=+code.split('.')[1]; if(n<128) continue;
  const blob=((sc.title||'')+' '+JSON.stringify(sc.content||'')).toLowerCase();
  const hits=terms.filter(t=>blob.includes(t)); if(!hits.length) continue;
  console.log((used.has(code)?'[USED] ':'       ')+code.padEnd(10),'|',hits.join(','),'|',sc.title.slice(0,80));
}

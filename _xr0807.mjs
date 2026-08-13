import fs from 'fs';
const src = fs.readFileSync('data.js','utf8');
const mod = await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
const raw = mod.rawData;
const used = new Set(fs.readFileSync('book/chapter-02-1-4.html','utf8').match(/ff\.\d+\.\d+/g)||[]);
const terms = process.argv.slice(2).map(s=>s.toLowerCase());
const out=[];
for (const post of raw) for (const sc of (post.subchapters||[])) {
  const code=(sc.title||'').match(/ff\.\d+\.\d+/)?.[0]; if(!code) continue;
  const blob=((sc.title||'')+' '+JSON.stringify(sc.content||sc.text||sc)).toLowerCase();
  const hits=terms.filter(t=>blob.includes(t));
  if(hits.length) out.push({code,title:sc.title,hits,used:used.has(code),n:+code.split('.')[1]});
}
out.sort((a,b)=>b.hits.length-a.hits.length||a.n-b.n);
for(const o of out.slice(0,45)) console.log((o.used?'[USED] ':'       ')+o.code.padEnd(10),'|',o.hits.join(','),'|',o.title.slice(0,90));
console.log('total',out.length);

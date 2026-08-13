const fs=require('fs');
const raw=require('./_data_tmp_0809c.cjs');
const idx=[];
for(const iss of raw){ for(const sc of (iss.subchapters||[])){
  const m=(sc.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  idx.push({code:'ff.'+m[1]+'.'+m[2], title:sc.title, content:sc.content||'', link:sc.link||'', issue:iss.title});
}}
fs.writeFileSync('_ffidx_0809c.json',JSON.stringify(idx,null,1));
const used=new Set(fs.readFileSync('book/chapter-01-2-2.html','utf8').match(/ff\.\d+\.\d+/g)||[]);
const q=process.argv.slice(2);
const hits=idx.filter(x=>!used.has(x.code) && q.some(k=>(x.title+' '+x.content).toLowerCase().includes(k.toLowerCase())));
console.log('SUBCH',idx.length,'HITS',hits.length);
for(const h of hits.slice(0,45)) console.log(h.code,'|',h.title.replace(/\s+/g,' ').slice(0,70),'||',h.content.replace(/\s+/g,' ').slice(0,140));

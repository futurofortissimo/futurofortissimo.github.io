const fs=require('fs');
const src=fs.readFileSync('data.js','utf8');
// find all ff.x.y entries with titles
const re=/ff\.(\d+)\.(\d+)/g;
const terms=process.argv.slice(2).map(s=>s.toLowerCase());
// crude: split data.js into subchapter records by "ff.x.y"
const idx=[];let m;
while((m=re.exec(src))) idx.push({code:m[0],pos:m.index});
for(let i=0;i<idx.length;i++){
  const start=idx[i].pos, end=(idx[i+1]?idx[i+1].pos:src.length);
  const chunk=src.slice(start,Math.min(end,start+3000)).toLowerCase();
  if(terms.every(t=>chunk.includes(t))){
    console.log('=== '+idx[i].code+' ===');
    console.log(src.slice(start,start+400).replace(/\s+/g,' '));
  }
}

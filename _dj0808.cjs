const fs=require('fs');
const src=fs.readFileSync('data.js','utf8');
// find all subchapter entries: look for ff.x.y codes with titles
const re=/"(ff\.(\d+)\.(\d+))"\s*:\s*\{([\s\S]{0,600}?)\}/g;
let m,c=0;
const terms=process.argv.slice(2).map(s=>s.toLowerCase());
while((m=re.exec(src))){
  const body=m[4];
  const low=(m[1]+' '+body).toLowerCase();
  if(terms.every(t=>low.includes(t))){
    console.log('=== '+m[1]);
    console.log(body.replace(/\s+/g,' ').slice(0,500));
    if(++c>14) break;
  }
}
if(c===0) console.log('NO MATCH (regex shape may differ)');

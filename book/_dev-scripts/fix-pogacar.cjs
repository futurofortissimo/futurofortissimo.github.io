#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const files=['chapter-01-mobilita.html','chapter-01-ambiente.html','chapter-01-cibo.html','chapter-02-robotica.html','chapter-02-metaverso.html','chapter-02-prodotti.html','chapter-03-psicologia.html','chapter-03-alimentazione.html','chapter-03-cultura.html'];
let total=0;
for(const f of files){
  const full=path.join(root,f);
  if(!fs.existsSync(full))continue;
  let txt=fs.readFileSync(full,'utf8');
  const before=txt;
  // Pogačar: ensure entity is correct (sometimes &#269; renders, ensure consistency)
  txt=txt.replace(/Poga&#269;ar/g,'Pogačar');
  // Stray &#39; in prose body (skip if inside attributes/JSON-LD)
  // Apply only inside <p>...</p>
  txt=txt.replace(/(<p[^>]*>[\s\S]*?<\/p>)/g,(p)=>p.replace(/&#39;/g,'&rsquo;'));
  if(txt!==before){fs.writeFileSync(full,txt,'utf8');console.log(`${f}: fixed`);total++;}
}
console.log(`Total files: ${total}`);

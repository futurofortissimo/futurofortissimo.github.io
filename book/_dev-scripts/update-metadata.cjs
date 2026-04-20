#!/usr/bin/env node
// Update article:modified_time + dateModified to today's date in all subchapter HTMLs.
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const files=['chapter-01-mobilita.html','chapter-01-ambiente.html','chapter-01-cibo.html','chapter-02-robotica.html','chapter-02-metaverso.html','chapter-02-prodotti.html','chapter-03-psicologia.html','chapter-03-alimentazione.html','chapter-03-cultura.html'];
const today='2026-04-20';
let total=0;
for(const f of files){
  const full=path.join(root,f);
  if(!fs.existsSync(full))continue;
  let txt=fs.readFileSync(full,'utf8');
  const before=txt;
  txt=txt.replace(/article:modified_time"[^>]*content="[^"]+"/g,(m)=>m.replace(/content="[^"]+"/, `content="${today}"`));
  txt=txt.replace(/"dateModified":\s*"[^"]+"/g,`"dateModified": "${today}"`);
  if(txt!==before){fs.writeFileSync(full,txt,'utf8');console.log(`${f}: updated`);total++;}
}
console.log(`Total: ${total}`);

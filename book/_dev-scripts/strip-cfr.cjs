#!/usr/bin/env node
// Strip "cfr. " before <span class="fc">…</span> closer.
// Pattern: (cfr. <span class="fc">…</span>) → (<span class="fc">…</span>)
// Idempotent.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const files=['chapter-01-mobilita.html','chapter-01-ambiente.html','chapter-01-cibo.html','chapter-02-robotica.html','chapter-02-metaverso.html','chapter-02-prodotti.html','chapter-03-psicologia.html','chapter-03-alimentazione.html','chapter-03-cultura.html'];
const re=/\(cfr\.\s+(<span class="fc">[^<]+(?:<\/span>;\s*<span class="fc">[^<]+)*<\/span>)\)/g;
let total=0;
for(const f of files){
  const full=path.join(root,f);
  if(!fs.existsSync(full))continue;
  let txt=fs.readFileSync(full,'utf8');
  let local=0;
  txt=txt.replace(re,(_m,inner)=>{local++;return `(${inner})`;});
  if(local){fs.writeFileSync(full,txt,'utf8');console.log(`${f}: -${local} cfr`);total+=local;}
  else console.log(`${f}: 0`);
}
console.log(`Total: ${total}`);

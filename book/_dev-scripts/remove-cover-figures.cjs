#!/usr/bin/env node
// Remove generic cover figures whose img src matches /index_files/pubs/ffN.webp|png (not ff_X_Y_card.png)
// These are cover illustrations with caption bridges — not helpful per Michele.
// KEEP: book covers (libri/*.jpg/png), card_img (ff_X_Y_card.png), SVG charts.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const files=['chapter-01-mobilita.html','chapter-01-ambiente.html','chapter-01-cibo.html','chapter-02-robotica.html','chapter-02-metaverso.html','chapter-02-prodotti.html','chapter-03-psicologia.html','chapter-03-alimentazione.html','chapter-03-cultura.html'];

// Pattern: <figure>...img src="/index_files/pubs/ffN.webp|png|jpeg" (no _card)...</figure>
// Allow optional attrs, optional <figcaption>
const re=/\s*<figure[^>]*>\s*<img[^>]*src="\/index_files\/pubs\/(?:98|ff\d+)\.(?:webp|png|jpeg)"[^>]*\/?>\s*(?:<figcaption[^>]*>[\s\S]*?<\/figcaption>\s*)?<\/figure>/g;

let total=0;
for(const f of files){
  const full=path.join(root,f);
  if(!fs.existsSync(full))continue;
  let txt=fs.readFileSync(full,'utf8');
  const before=txt;
  const matches=(txt.match(re)||[]).length;
  txt=txt.replace(re,'');
  if(txt!==before){fs.writeFileSync(full,txt,'utf8');console.log(`${f}: -${matches} cover figures`);total+=matches;}
  else console.log(`${f}: 0`);
}
console.log(`Total removed: ${total}`);

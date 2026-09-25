#!/usr/bin/env node
// Auto-wrap prose links with bidirectional anchors. Idempotent.
const fs = require('fs');
const path = require('path');
const files = [
  'chapter-01-mobilita.html','chapter-01-ambiente.html','chapter-01-cibo.html',
  'chapter-02-robotica.html','chapter-02-metaverso.html','chapter-02-prodotti.html',
  'chapter-03-psicologia.html','chapter-03-alimentazione.html','chapter-03-cultura.html',
];
const rootDir = path.resolve(__dirname, '..');
function escRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function processFile(filename){
  const full = path.join(rootDir, filename);
  if (!fs.existsSync(full)) return { added:0, skipped:'missing'};
  let txt = fs.readFileSync(full,'utf8');
  const biblioMatch = txt.match(/<section id="bibliografia"[\s\S]*?<\/section>/);
  if (!biblioMatch) return {added:0,skipped:'no biblio'};
  const liRe = /<li id="fonte-(\d+)">\s*<a href="([^"]+)"/g;
  const fontes = [];
  let m;
  while ((m = liRe.exec(biblioMatch[0])) !== null) fontes.push({n:parseInt(m[1],10), url:m[2]});
  if (!fontes.length) return {added:0,skipped:'no fontes'};
  const artRe = /<article class="prose">([\s\S]*?)<\/article>/;
  const artMatch = txt.match(artRe);
  if (!artMatch) return {added:0,skipped:'no article'};
  let article = artMatch[1];
  let totalAdded = 0;
  // Una fonte citata piu' volte nello stesso capitolo riceveva lo stesso id due
  // volte: l'id duplicato e' HTML non valido. Dalla seconda occorrenza in poi
  // l'id prende un suffisso, la freccia di ritorno resta sulla prima.
  const SUFFIXES = 'bcdefgh';
  const usedIds = new Set((article.match(/id="(ref-fonte-[0-9a-z-]+)"/g) || [])
    .map(s => s.slice(4, -1)));
  function nextId(n){
    if (!usedIds.has(`ref-fonte-${n}`)) return `ref-fonte-${n}`;
    for (const s of SUFFIXES){
      if (!usedIds.has(`ref-fonte-${n}-${s}`)) return `ref-fonte-${n}-${s}`;
    }
    return null;
  }
  for (const f of fontes){
    const escUrl = escRe(f.url);
    const linkRe = new RegExp(`<a href="${escUrl}"[^>]*>[\\s\\S]*?<\\/a>`,'g');
    const matches = [...article.matchAll(linkRe)];
    // Gli id si assegnano in ordine di documento (la prima citazione tiene
    // l'id nudo), le sostituzioni si applicano al contrario per non spostare
    // gli offset di quelle ancora da fare.
    const planned = [];
    for (const match of matches){
      const offset = match.index;
      const matchStr = match[0];
      const before = article.substring(Math.max(0,offset-80), offset);
      if (/id="ref-fonte-[0-9a-z-]+"/.test(before)) continue;
      const after = article.substring(offset+matchStr.length, offset+matchStr.length+100);
      if (after.match(new RegExp(`^\\s*<sup>\\s*<a href="#fonte-${f.n}"`))) continue;
      const id = nextId(f.n);
      if (!id) continue;
      usedIds.add(id);
      planned.push({offset, matchStr, id});
    }
    for (const p of planned.reverse()){
      const replacement = `<a id="${p.id}"></a>${p.matchStr}<sup><a href="#fonte-${f.n}" style="color:var(--accent);text-decoration:none;">[${f.n}]</a></sup>`;
      article = article.substring(0,p.offset) + replacement + article.substring(p.offset+p.matchStr.length);
      totalAdded++;
    }
  }
  if (totalAdded === 0) return {added:0,skipped:'no matches'};
  const newTxt = txt.replace(artMatch[0], `<article class="prose">${article}</article>`);
  fs.writeFileSync(full,newTxt,'utf8');
  return {added:totalAdded};
}
let grand = 0;
for (const f of files){
  const r = processFile(f);
  if (r.skipped && r.added===0) console.log(`${f}: ${r.skipped}`);
  else { console.log(`${f}: +${r.added}`); grand += r.added; }
}
console.log(`Total: ${grand}`);

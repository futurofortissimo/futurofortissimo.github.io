const fs=require('fs');
let s=fs.readFileSync('data.js','utf8');
s=s.replace('export const rawData','const rawData')+'\nmodule.exports=rawData;';
fs.writeFileSync('_data0811d.cjs',s);
const d=require('./_data0811d.cjs');
const subs=[];
for(const e of d){ for(const sc of (e.subchapters||[])){ subs.push({t:sc.title, body:(sc.content||sc.body||sc.text||JSON.stringify(sc)).slice(0,4000)}); } }
console.log('subs',subs.length);
const kw=process.argv.slice(2);
const re=new RegExp(kw.join('|'),'i');
let n=0;
for(const s2 of subs){ if(re.test(s2.t)||re.test(s2.body)){ n++; console.log('---',s2.t); } }
console.log('matches',n);

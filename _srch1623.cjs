const fs=require('fs');
let t=fs.readFileSync('data.js','utf8');
t=t.replace(/^export const rawData =/,'module.exports =');
fs.writeFileSync('_tmp_data1623.cjs',t);
const d=require('./_tmp_data1623.cjs');
const subs=[];
for(const iss of d) for(const s of (iss.subchapters||[])) subs.push({t:s.title, c:(s.content||s.text||JSON.stringify(s)).toString()});
console.log('subs',subs.length);
const kws=process.argv.slice(2);
for(const s of subs){
  const low=(s.t+' '+s.c).toLowerCase();
  const hits=kws.filter(k=>low.includes(k.toLowerCase()));
  if(hits.length) console.log(s.t.replace(/\n/g,' | '),'  <<',hits.join(','));
}

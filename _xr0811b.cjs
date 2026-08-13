const fs=require('fs');
const src=fs.readFileSync('data.js','utf8');
const mod=src.replace(/^export const rawData =/,'module.exports=');
fs.writeFileSync('_tmpdata0811.cjs',mod);
const raw=require('./_tmpdata0811.cjs');
const subs=[];
for(const u of raw) for(const s of (u.subchapters||[])) subs.push({title:s.title,content:s.content||'',link:s.link});
console.log('SUBCHAPTERS',subs.length);
const kws=process.argv.slice(2);
for(const kw of kws){
  const rx=new RegExp(kw,'i');
  const hits=subs.filter(s=>rx.test(s.title)||rx.test(s.content));
  console.log('\n=== '+kw+' -> '+hits.length+' ===');
  for(const h of hits.slice(0,10)) console.log(JSON.stringify(h.title));
}

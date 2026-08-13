const fs=require('fs');
const d=fs.readFileSync('data.js','utf8');
const s=d.indexOf('[');let t=d.slice(s).trim();
while(t.length&&!t.endsWith(']'))t=t.slice(0,-1);
const a=JSON.parse(t);
const subs=[];
for(const iss of a) for(const sc of (iss.subchapters||[])) subs.push(sc);
console.error('subchapters:',subs.length);
const kws=process.argv.slice(2);
for(const sc of subs){
  const blob=((sc.title||'')+' '+(sc.content||'')).toLowerCase();
  const hits=kws.filter(k=>blob.includes(k.toLowerCase()));
  if(hits.length) console.log(sc.title.replace(/\s+/g,' ').trim(),'|| hits:',hits.join(','));
}

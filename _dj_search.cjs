const fs=require('fs');let d=fs.readFileSync('data.js','utf8');
const s=d.indexOf('[');let t=d.slice(s).trim();
while(t.length&&t[t.length-1]!==']')t=t.slice(0,-1);
const data=JSON.parse(t);
const subs=[];
data.forEach(iss=>(iss.subchapters||[]).forEach(sc=>subs.push(sc)));
const kws=process.argv.slice(2).map(x=>x.toLowerCase());
const used=new Set(['58.3','32.5','5.6','98.1','20.2','1.2','20.1','57.3','34.5','20.3']);
subs.forEach(sc=>{
  const blob=((sc.title||'')+' '+(sc.content||'')).toLowerCase();
  const hits=kws.filter(k=>blob.includes(k));
  if(hits.length){
    const m=(sc.title||'').match(/ff\.(\d+\.\d+)/);
    const code=m?m[1]:'?';
    if(used.has(code))return;
    console.log(code+' :: '+sc.title+' :: hits='+hits.join(',')+' :: '+(sc.content||'').replace(/\s+/g,' ').slice(0,220));
  }
});

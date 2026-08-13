const fs=require('fs');let d=fs.readFileSync('data.js','utf8');
const s=d.indexOf('[');let t=d.slice(s).trim();
while(t.length&&t[t.length-1]!==']')t=t.slice(0,-1);
const data=JSON.parse(t);
const subs=[];data.forEach(i=>(i.subchapters||[]).forEach(sc=>subs.push(sc)));
process.argv.slice(2).forEach(code=>{
 const hit=subs.filter(sc=>(sc.title||'').replace(/\s+/g,'').includes('ff.'+code));
 hit.forEach(h=>{console.log('=== '+JSON.stringify(h.title));console.log((h.content||'').replace(/\s+/g,' ').slice(0,700));console.log('');});
});

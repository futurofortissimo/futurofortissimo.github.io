const fs=require('fs');
let s=fs.readFileSync('data.js','utf8');
// find the exported array
const m=s.match(/(?:const|let|var)\s+\w+\s*=\s*(\[[\s\S]*)/);
let src=m?m[1]:s;
let data;
try{ data=eval(src.replace(/;?\s*(export\s+default\s+\w+;?)?\s*$/,'')); }catch(e){ console.log('EVAL FAIL',e.message); process.exit(1);}
console.log('top-level items:',data.length);
console.log(JSON.stringify(data[0]).slice(0,800));

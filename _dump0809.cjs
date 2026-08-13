const fs=require('fs');
let s=fs.readFileSync('data.js','utf8');
const m=s.match(/(?:const|let|var)\s+\w+\s*=\s*(\[[\s\S]*)/);
const data=eval(m[1].replace(/;?\s*(export\s+default\s+\w+;?)?\s*$/,''));
const want=process.argv.slice(2);
data.forEach(ch=>(ch.subchapters||[]).forEach(sc=>{
  const code=(sc.title.match(/ff\.\d+\.\d+/)||[])[0];
  if(want.includes(code)){
    console.log('\n===== '+code+' =====');
    console.log('TITLE:',sc.title);
    console.log('LINK:',sc.link);
    console.log('CONTENT:',(sc.content||'').slice(0,1400));
  }
}));

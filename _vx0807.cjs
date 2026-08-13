const fs=require('fs');
let s=fs.readFileSync('data.js','utf8');
const codes=['4.1','53.3','132.3'];
for(const c of codes){
  const re=new RegExp('"code"\s*:\s*"ff\.'+c.replace('.','\.')+'"');
  const m=re.exec(s);
  if(!m){console.log('ff.'+c+' :: NOT FOUND');continue;}
  const start=Math.max(0,m.index-400);
  const chunk=s.slice(m.index,m.index+2000);
  const t=/"title"\s*:\s*"([^"]{0,160})"/.exec(chunk);
  const b=/"(?:body|text|content|description)"\s*:\s*"([^"]{0,700})"/.exec(chunk);
  console.log('=== ff.'+c+' ===');
  console.log('TITLE:',t?t[1]:'(n/a)');
  console.log('BODY:',b?b[1].slice(0,600):'(n/a)');
  console.log('');
}

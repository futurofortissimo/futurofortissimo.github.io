const fs=require('fs');
let s=fs.readFileSync('data.js','utf8');
const m=s.match(/(?:const|let|var)\s+\w+\s*=\s*(\[[\s\S]*)/);
const data=eval(m[1].replace(/;?\s*(export\s+default\s+\w+;?)?\s*$/,''));
const subs=[];
data.forEach(ch=>(ch.subchapters||[]).forEach(sc=>{
  const code=(sc.title.match(/ff\.\d+\.\d+/)||[])[0];
  if(code) subs.push({code,title:sc.title,link:sc.link,content:sc.content||''});
}));
console.log('subchapters:',subs.length);
const terms=process.argv.slice(2);
subs.forEach(x=>{
  const hay=(x.title+' '+x.content).toLowerCase();
  const hits=terms.filter(t=>hay.includes(t.toLowerCase()));
  if(hits.length) console.log(x.code,'|',x.title,'| HITS:',hits.join(','));
});

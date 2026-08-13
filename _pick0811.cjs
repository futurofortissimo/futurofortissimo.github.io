const fs=require('fs');
const d=require('./_data0811d.cjs');
const used=new Set(JSON.parse(fs.readFileSync('_usedxr0811.json','utf8')));
const all=[];
for(const e of d){
  for(const sc of (e.subchapters||[])){
    const m=(sc.title||'').match(/ff\.(\d+)\.(\d+)/);
    const code = m? 'ff.'+m[1]+'.'+m[2] : null;
    all.push({code, title:sc.title, body:String(sc.content||sc.body||sc.text||'').replace(/<[^>]*>/g,' ')});
  }
}
console.log('TOTAL SUBS', all.length, 'with code', all.filter(a=>a.code).length);
const free=all.filter(a=>a.code && !used.has(a.code));
console.log('UNUSED', free.length);
const kw=process.argv.slice(2);
const re=new RegExp(kw.join('|'),'i');
for(const f of free){ if(re.test(f.title)||re.test(f.body)) console.log(f.code,'|',f.title.slice(0,110)); }

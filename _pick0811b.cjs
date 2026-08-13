const d=require('./_data0811d.cjs');
const exclude=new Set(['ff.1.2','ff.12.4','ff.20.1','ff.20.2','ff.20.3','ff.26.5','ff.32.5','ff.34.5','ff.5.1','ff.5.6','ff.57.3','ff.58.3','ff.98.1']);
const kw=process.argv.slice(2);
const re=new RegExp(kw.join('|'),'i');
for(const e of d){ for(const sc of (e.subchapters||[])){
  const m=(sc.title||'').match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  const code='ff.'+m[1]+'.'+m[2]; if(exclude.has(code)) continue;
  const body=String(sc.content||sc.body||sc.text||'').replace(/<[^>]*>/g,' ');
  if(re.test(sc.title)||re.test(body)) console.log(code,'|',sc.title.replace(/\s+/g,' ').slice(0,100),'||',body.replace(/\s+/g,' ').slice(0,180));
}}

const fs=require('fs');
const src=fs.readFileSync('data.js','utf8');
const json=src.replace(/^export const rawData =/,'').replace(/;\s*$/,'');
let data; try{data=JSON.parse(json);}catch(e){console.log('parse fail',e.message);process.exit(1);}
// collect all book html text
const dir='book';
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.html'));
let book='';
for(const f of files) book+=fs.readFileSync(dir+'/'+f,'utf8');
const KW=/chip|silicio|inferenza|token|GPU|NVIDIA|datacenter|data center|semicondut|TSMC|calcolo|compute|latenza|velocit|hardware|wafer|processor|acceleratori/i;
const out=[];
for(const iss of data){
  for(const sc of (iss.subchapters||[])){
    const m=(sc.title||'').match(/ff\.(\d+)\.(\d+)/);
    if(!m) continue;
    const code='ff.'+m[1]+'.'+m[2];
    if(book.includes(code)) continue;              // already used somewhere in book
    const txt=(sc.title||'')+' '+(sc.content||'');
    if(!KW.test(txt)) continue;
    const hits=(txt.match(KW)||[]).length;
    out.push({code,title:sc.title,n:txt.length,snip:(sc.content||'').slice(0,220).replace(/\s+/g,' ')});
  }
}
console.log('candidati inediti + on-topic:',out.length);
for(const o of out.slice(0,40)) console.log('\n'+o.code+' | '+o.title+'\n   '+o.snip);

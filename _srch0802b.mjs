import {rawData} from './data.js';
const terms=process.argv.slice(2);
const subs=[];
for(const iss of rawData) for(const sc of (iss.subchapters||[])) subs.push(sc);
for(const t of terms){
  console.log('\n##### '+t);
  let n=0;
  for(const sc of subs){
    const hay=((sc.title||'')+' '+(sc.content||'')).toLowerCase();
    if(hay.includes(t.toLowerCase())){
      n++; if(n>7) continue;
      const c=(sc.content||''); const i=c.toLowerCase().indexOf(t.toLowerCase());
      console.log('  TITLE: '+sc.title);
      console.log('    ..."'+c.slice(Math.max(0,i-140), i+200).replace(/\s+/g,' ')+'"');
    }
  }
  console.log('  hits: '+n);
}

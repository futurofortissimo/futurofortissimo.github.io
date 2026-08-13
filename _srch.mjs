import {rawData} from './data.js';
const kw=process.argv.slice(2).map(s=>s.toLowerCase());
for(const post of rawData){
  for(const sc of (post.subchapters||[])){
    const t=(sc.title||''); const c=(sc.content||'');
    const hay=(t+' '+c).toLowerCase();
    if(kw.some(k=>hay.includes(k))){
      const code=(t.match(/ff\.\d+\.\d+/)||[''])[0];
      console.log('---',code,'|',t.replace(/\s+/g,' ').slice(0,90));
      const i=Math.max(0,hay.indexOf(kw.find(k=>hay.includes(k)))-160);
      console.log('   ',c.replace(/\s+/g,' ').slice(i,i+340));
    }
  }
}

import {rawData} from './data.js';
console.log('issues:',rawData.length);
for(const n of ['ff.4','ff.53','ff.132']){
  const iss=rawData.filter(i=>new RegExp('(^|\s)'+n.replace(/\./g,'\.')+'(\s|$)').test(i.title||''));
  console.log('--- issue',n,'found:',iss.length);
  for(const i of iss){console.log('  TITLE:',i.title);(i.subchapters||[]).forEach(s=>console.log('    *',s.title));}
}

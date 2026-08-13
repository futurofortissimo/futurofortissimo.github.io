import {rawData} from './data.js';
const want=['ff.4.1','ff.53.3','ff.132.3'];
for(const w of want){
  let hit=null;
  for(const iss of rawData) for(const sc of (iss.subchapters||[])){
    if(new RegExp('(^|\s)'+w.replace(/\./g,'\.')+'(\s|$)').test(sc.title||'')){hit={iss,sc};}
  }
  console.log('=== '+w+' ===');
  if(!hit){console.log('NOT FOUND');continue;}
  console.log('ISSUE :',hit.iss.title);
  console.log('TITLE :',hit.sc.title);
  console.log('LINK  :',hit.sc.link);
  console.log('BODY  :',(hit.sc.content||'').slice(0,900).replace(/\s+/g,' '));
  console.log('');
}

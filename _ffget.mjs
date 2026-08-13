import {rawData} from './data.js';
const codes=process.argv.slice(2);
for(const iss of rawData) for(const sc of (iss.subchapters||[])){
  for(const c of codes){
    if((sc.title||'').includes('ff.'+c+' ')||(sc.title||'').includes('ff.'+c+'\u00a0')||new RegExp('ff\.'+c.replace('.','\.')+'(?![0-9])').test(sc.title||'')){
      console.log('TITLE_RAW: '+JSON.stringify(sc.title));
      console.log('LINK: '+(sc.link||''));
      console.log('CONTENT: '+(sc.content||'').replace(/\s+/g,' ').slice(0,900));
      console.log('---');
    }
  }
}

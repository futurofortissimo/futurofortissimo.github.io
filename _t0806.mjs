import {rawData} from './data.js';
const want=['ff.105.1','ff.36.4','ff.49.3'];
for(const iss of rawData) for(const sc of (iss.subchapters||[])){
  for(const w of want) if((sc.title||'').includes(w+' ')||(sc.title||'').includes(w)){
    console.log(JSON.stringify(sc.title));
    console.log('   ', (sc.content||'').replace(/\s+/g,' ').slice(0,300));
  }
}

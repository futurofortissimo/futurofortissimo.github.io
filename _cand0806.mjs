import {rawData} from './data.js';
import fs from 'fs';
const rob=fs.readFileSync('/tmp/crob.html','utf8');
const c214=fs.readFileSync('/tmp/c214.html','utf8');
const terms=['robot','automa','mano','braccio','muscol','movimento','camminare','equilibrio','tatto','toccare','simulaz','apprend','allenament','miniaturizz','codice','software','cervello','corpo'];
for(const n of rawData) for(const s of (n.subchapters||[])){
  const t=s.title||''; const m=t.match(/ff\.(\d+)\.(\d+)/); if(!m) continue;
  const code='ff.'+m[1]+'.'+m[2];
  if(rob.includes(code)||c214.includes(code)) continue;
  const body=(s.content||s.text||'');
  const hits=terms.filter(x=>(t+' '+body).toLowerCase().includes(x));
  if(hits.length>=2) console.log(code+' ['+hits.join(',')+'] '+t+' :: '+body.slice(0,150).replace(/\s+/g,' '));
}

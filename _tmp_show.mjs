import {rawData} from './data.js';
const want = process.argv.slice(2);
function find(code){
  for (const issue of rawData) for (const sub of (issue.subchapters||[])){
    const m=sub.title.match(/ff\.(\d+)\.(\d+)/);
    if(m && (m[1]+'.'+m[2])===code) return {sub, issue};
  }
  return null;
}
for(const code of want){
  const r=find(code);
  if(!r){console.log(`\n### ${code} NOT FOUND`);continue;}
  console.log(`\n######## ff.${code} ########`);
  console.log('TITLE:', r.sub.title);
  console.log('LINKS:', JSON.stringify(r.sub.links||r.sub.connections||[]));
  console.log('CONTENT:', (r.sub.content||'').replace(/\s+/g,' ').trim());
}

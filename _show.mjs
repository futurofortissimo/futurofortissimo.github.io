import {rawData} from './data.js';
const want=new Set(process.argv.slice(2));
for (const issue of rawData) for (const sub of (issue.subchapters||[])){
  const m=(sub.title||'').match(/ff\.(\d+\.\d+)/); if(!m||!want.has(m[1])) continue;
  console.log('\n===== ff.'+m[1]+' | issue:', issue.title||issue.id, '| date:', issue.date||'?');
  console.log('TITLE:', (sub.title||'').replace(/\s+/g,' '));
  console.log((sub.content||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim());
}

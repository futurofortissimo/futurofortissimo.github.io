import {rawData} from './data.js';
const want = process.argv.slice(2);
for (const issue of rawData) for (const sub of (issue.subchapters||[])) {
  const m=(sub.title||'').match(/ff\.(\d+\.\d+)/);
  if (m && want.includes(m[1])) {
    console.log('\n===== ff.'+m[1]+' | '+sub.title+' =====');
    console.log(sub.content||'(no content)');
  }
}

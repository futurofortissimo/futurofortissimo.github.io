import {rawData} from './data.js';
import fs from 'fs';
const usedFile = fs.readFileSync('used_codes_book.txt','utf8')
  .split(/\r?\n/).map(s=>s.trim().replace(/^ff\./,'')).filter(Boolean);
const openPR = ['8.5','31.1','24.4','71.4','67.3','149.3','139.3','137.2'];
const used = new Set([...usedFile, ...openPR]);
const out=[];
for (const issue of rawData) for (const sub of (issue.subchapters||[])) {
  const m = (sub.title||'').match(/ff\.(\d+\.\d+)/);
  if (m && !used.has(m[1])) out.push({code:'ff.'+m[1], num:parseInt(m[1]), title:sub.title, len:(sub.content||'').length});
}
out.sort((a,b)=>a.num-b.num);
console.log('TOTAL UNUSED:', out.length);
for (const o of out) console.log(o.code+'\t'+o.len+'\t'+o.title.slice(0,70));

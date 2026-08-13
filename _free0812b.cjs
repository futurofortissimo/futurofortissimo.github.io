const {execSync}=require('child_process'); const fs=require('fs');
const files=execSync('git ls-tree -r --name-only origin/main book/',{maxBuffer:1e8}).toString().split('\n').filter(f=>f.endsWith('.html'));
const used=new Set(); const inMobilita=new Set();
for(const f of files){ let t=''; try{t=execSync(`git show origin/main:"${f}"`,{maxBuffer:1e8}).toString();}catch(e){continue;}
  for(const m of t.matchAll(/ff\.(\d+)\.(\d+)/g)){ const c='ff.'+m[1]+'.'+m[2]; used.add(c); if(/chapter-01-1-1|chapter-01-mobilita/.test(f)) inMobilita.add(c); } }
fs.writeFileSync('_usedmain0812.json',JSON.stringify([...used].sort()));
console.log('MAIN_USED',used.size,'IN_TARGET',inMobilita.size,[...inMobilita].join(' '));

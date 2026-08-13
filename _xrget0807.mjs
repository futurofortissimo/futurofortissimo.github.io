import fs from 'fs';
const src = fs.readFileSync('data.js','utf8');
const mod = await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
for (const post of mod.rawData) for (const sc of (post.subchapters||[])) {
  const code=(sc.title||'').match(/ff\.\d+\.\d+/)?.[0];
  if(!process.argv.slice(2).includes(code)) continue;
  console.log('==========',code,'| POST:',post.title);
  console.log('TITLE:',JSON.stringify(sc.title));
  const body = sc.content||sc.text||'';
  console.log('BODY:', (typeof body==='string'?body:JSON.stringify(body)).replace(/<[^>]+>/g,'').slice(0,1400));
  console.log();
}

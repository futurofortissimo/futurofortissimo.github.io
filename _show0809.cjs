const fs=require('fs');
const arr=JSON.parse(fs.readFileSync('notes.json','utf8'));
const a=Array.isArray(arr)?arr:(arr.notes||[]);
for(const id of process.argv.slice(2).map(Number)){
  const n=a.find(x=>x.id===id); if(!n){console.log(id,'NOT FOUND');continue;}
  console.log('='.repeat(70));
  console.log('ID',n.id,'| tags',(n.tags||[]).join(''),'| ts',n.source_timestamp||n.date||'');
  console.log('TITLE:',n.title);
  console.log('URL:',n.url);
  console.log('DESC:',n.description);
  if(n.hashtags)console.log('HASH:',n.hashtags);
}

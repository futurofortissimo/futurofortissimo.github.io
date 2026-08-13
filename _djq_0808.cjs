const fs=require('fs');
let src=fs.readFileSync('data.js','utf8');
src=src.replace(/^export const rawData\s*=\s*/,'module.exports = ');
fs.writeFileSync('_data_tmp_0808.cjs',src);
const data=require('./_data_tmp_0808.cjs');
const subs=[];
for(const iss of data){
  for(const s of (iss.subchapters||[])){
    const m=(s.title||'').match(/ff\.(\d+)\.(\d+)/);
    if(!m) continue;
    subs.push({code:m[0],ch:+m[1],title:s.title,content:(s.content||''),link:s.link||''});
  }
}
fs.writeFileSync('_subs_0808.json',JSON.stringify(subs));
console.log('subchapters:',subs.length);
const terms=process.argv.slice(2).map(t=>t.toLowerCase());
const hits=subs.filter(s=>terms.some(t=>(s.title+' '+s.content).toLowerCase().includes(t)));
console.log('hits:',hits.length);
for(const h of hits.slice(0,30)) console.log(h.code,'|',h.title.replace(/\s+/g,' ').slice(0,70),'|',h.content.replace(/\s+/g,' ').slice(0,110));

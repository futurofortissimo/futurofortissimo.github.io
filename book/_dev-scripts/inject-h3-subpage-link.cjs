const fs=require('fs'),path=require('path');
const root='C:/Users/micme/Desktop/micmer/futuro fortissimo/book';
const MAP={
  'chapter-01-mobilita.html':{prefix:'chapter-01-1-',sids:['s1-1','s1-2','s1-3','s1-4']},
  'chapter-01-ambiente.html':{prefix:'chapter-01-2-',sids:['s2-1','s2-2','s2-3','s2-4']},
  'chapter-01-cibo.html':{prefix:'chapter-01-3-',sids:['s3-1','s3-2','s3-3','s3-4']},
  'chapter-02-robotica.html':{prefix:'chapter-02-1-',sids:['s1-1','s1-2','s1-3','s1-4']},
  'chapter-02-metaverso.html':{prefix:'chapter-02-2-',sids:['s2-1','s2-2','s2-3','s2-4']},
  'chapter-02-prodotti.html':{prefix:'chapter-02-3-',sids:['s3-1','s3-2','s3-3','s3-4']},
  'chapter-03-psicologia.html':{prefix:'chapter-03-1-',sids:['s1-1','s1-2','s1-3','s1-4']},
  'chapter-03-alimentazione.html':{prefix:'chapter-03-2-',sids:['s2-1','s2-2','s2-3','s2-4']},
  'chapter-03-cultura.html':{prefix:'chapter-03-3-',sids:['s3-1','s3-2','s3-3','s3-4']},
};
let total=0;
for(const [file,cfg] of Object.entries(MAP)){
  const full=path.join(root,file);
  if(!fs.existsSync(full))continue;
  let txt=fs.readFileSync(full,'utf8');
  let local=0;
  for(const sid of cfg.sids){
    const subnum=sid.split('-')[1];
    const slug=cfg.prefix+subnum+'.html';
    // Find h3 end position
    const h3StartRe=new RegExp('<h3 id="'+sid+'"[^>]*>');
    const h3StartMatch=h3StartRe.exec(txt);
    if(!h3StartMatch)continue;
    const h3End=txt.indexOf('</h3>',h3StartMatch.index)+5;
    if(h3End<5)continue;
    // Check if next 200 chars already contain subpage-link
    const after=txt.substring(h3End,h3End+300);
    if(after.includes('class="subpage-link"'))continue;
    const badge='\n    <p class="subpage-link" style="margin:-0.5em 0 1.2em;font-family:\'IBM Plex Mono\',monospace;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;"><a href="'+slug+'" style="color:var(--accent);text-decoration:none;border-bottom:1px solid var(--accent);">&rarr; Apri come pagina indipendente</a> &mdash; bibliografia + nav dedicata</p>';
    txt=txt.substring(0,h3End)+badge+txt.substring(h3End);
    local++;
  }
  if(local>0){fs.writeFileSync(full,txt,'utf8');console.log(file+': +'+local+' badges');total+=local;}
}
console.log('Total: '+total);

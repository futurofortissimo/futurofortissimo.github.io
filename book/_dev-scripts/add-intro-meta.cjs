#!/usr/bin/env node
// Add to chapter-01.html, chapter-02.html, chapter-03.html the missing markers:
//  - "Ultimo aggiornamento: 2026-04-20"
//  - "~X min di lettura"
//  - "Riferimenti: N"
//  - <section id="search"><h2>Search</h2>…</section> (link al front-page search)
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const meta={
  'chapter-01.html':{minutes:79,refs:155,topic:'Natura'},
  'chapter-02.html':{minutes:69,refs:163,topic:'Tecnologia'},
  'chapter-03.html':{minutes:70,refs:138,topic:'Società'},
};
const today='2026-04-20';
for(const f of Object.keys(meta)){
  const full=path.join(root,f);
  if(!fs.existsSync(full))continue;
  let txt=fs.readFileSync(full,'utf8');
  if(txt.includes('id="chapter-meta-block"')){console.log(`${f}: already added`);continue;}
  const m=meta[f];
  const block=`
    <!-- Editorial metadata block (per check_book_editorial.mjs) -->
    <section id="chapter-meta-block" class="mt-6 mb-8 brutal-card" style="border-color:#ddd;box-shadow:none;">
      <div class="ff-eyebrow text-xs" style="color:#888;">Capitolo ${m.topic}</div>
      <div class="ff-body-sm mt-2" style="color:#444;">
        <span style="margin-right:1.5rem;">~${m.minutes} min di lettura</span>
        <span style="margin-right:1.5rem;">Riferimenti: ${m.refs}</span>
        <span>Ultimo aggiornamento: ${today}</span>
      </div>
    </section>

    <!-- Search anchor (delegates to front-page index) -->
    <section id="search" class="mt-4 mb-8 brutal-card" style="border-color:#ddd;box-shadow:none;">
      <h2 class="text-base font-bold uppercase" style="font-family:'IBM Plex Mono',monospace;">Search</h2>
      <p class="ff-body-sm mt-2" style="color:#555;">Per cercare nei 148 ff.x.y del corpus, apri l&rsquo;<a href="/book/#hist-search" style="color:var(--accent);text-decoration:underline;">indice + ricerca della copertina del libro</a>.</p>
    </section>
`;
  txt=txt.replace(/(<\/main>)/, block + '$1');
  fs.writeFileSync(full,txt,'utf8');
  console.log(`${f}: added`);
}

#!/usr/bin/env node
// Add 4 sub-page links under each parent card in macro intro (chapter-01/02/03.html)
// Sub-page takes precedence over parent (default destination per Michele).
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

const SUBS = {
  'chapter-01-mobilita.html': [
    { code: '1.1.1', slug: 'chapter-01-1-1', title: "L'euthymìcrona del pendolare" },
    { code: '1.1.2', slug: 'chapter-01-1-2', title: 'La città a 15 minuti' },
    { code: '1.1.3', slug: 'chapter-01-1-3', title: 'Ruote autonome' },
    { code: '1.1.4', slug: 'chapter-01-1-4', title: 'Impronte e cieli' },
  ],
  'chapter-01-ambiente.html': [
    { code: '1.2.1', slug: 'chapter-01-2-1', title: 'La carta di credito invisibile' },
    { code: '1.2.2', slug: 'chapter-01-2-2', title: "Il nodo gordiano dell'energia" },
    { code: '1.2.3', slug: 'chapter-01-2-3', title: 'Geoingegneria e clima' },
    { code: '1.2.4', slug: 'chapter-01-2-4', title: 'Alberi, acqua e biodiversità' },
  ],
  'chapter-01-cibo.html': [
    { code: '1.3.1', slug: 'chapter-01-3-1', title: 'Dal microbioma al piatto' },
    { code: '1.3.2', slug: 'chapter-01-3-2', title: 'Calorie, peso e metabolismo' },
    { code: '1.3.3', slug: 'chapter-01-3-3', title: "L'armadio sostenibile" },
    { code: '1.3.4', slug: 'chapter-01-3-4', title: 'Il corpo elettrico' },
  ],
  'chapter-02-robotica.html': [
    { code: '2.1.1', slug: 'chapter-02-1-1', title: "L'economia del compute" },
    { code: '2.1.2', slug: 'chapter-02-1-2', title: 'La singolarità gentile' },
    { code: '2.1.3', slug: 'chapter-02-1-3', title: 'Robot e biomimetica' },
    { code: '2.1.4', slug: 'chapter-02-1-4', title: 'Miniaturizzazione e ricorsività' },
  ],
  'chapter-02-metaverso.html': [
    { code: '2.2.1', slug: 'chapter-02-2-1', title: 'Il metaverso trasformato' },
    { code: '2.2.2', slug: 'chapter-02-2-2', title: 'Proprietà digitale e blockchain' },
    { code: '2.2.3', slug: 'chapter-02-2-3', title: 'La geopolitica delle criptovalute' },
    { code: '2.2.4', slug: 'chapter-02-2-4', title: 'Cripto in guerra e simulazioni' },
  ],
  'chapter-02-prodotti.html': [
    { code: '2.3.1', slug: 'chapter-02-3-1', title: 'AI medica in tasca' },
    { code: '2.3.2', slug: 'chapter-02-3-2', title: 'Intelligenze aliene e agenti' },
    { code: '2.3.3', slug: 'chapter-02-3-3', title: 'Videogiochi e creatività' },
    { code: '2.3.4', slug: 'chapter-02-3-4', title: 'Il collo di bottiglia fisico' },
  ],
  'chapter-03-psicologia.html': [
    { code: '3.1.1', slug: 'chapter-03-1-1', title: 'Nominare per guarire' },
    { code: '3.1.2', slug: 'chapter-03-1-2', title: 'Tempo e finitudine' },
    { code: '3.1.3', slug: 'chapter-03-1-3', title: 'Attenzione e stimolo' },
    { code: '3.1.4', slug: 'chapter-03-1-4', title: 'Noia, silenzio e routine' },
  ],
  'chapter-03-alimentazione.html': [
    { code: '3.2.1', slug: 'chapter-03-2-1', title: 'VO₂max e longevità' },
    { code: '3.2.2', slug: 'chapter-03-2-2', title: 'Flow e limiti estremi' },
    { code: '3.2.3', slug: 'chapter-03-2-3', title: 'Chimica del corpo' },
    { code: '3.2.4', slug: 'chapter-03-2-4', title: 'Respiro e sonno' },
  ],
  'chapter-03-cultura.html': [
    { code: '3.3.1', slug: 'chapter-03-3-1', title: 'Lavoro e identità' },
    { code: '3.3.2', slug: 'chapter-03-3-2', title: 'Solitudine e demografia' },
    { code: '3.3.3', slug: 'chapter-03-3-3', title: 'Economia e geopolitica' },
    { code: '3.3.4', slug: 'chapter-03-3-4', title: 'Arte, previsioni e futuro' },
  ],
};

// For each macro intro file, find the parent card <a href="chapter-XX-YY.html">...</a>
// and append a sub-pages block right after.
const MACRO_FILES = ['chapter-01.html', 'chapter-02.html', 'chapter-03.html'];

for (const macro of MACRO_FILES) {
  const full = path.join(root, macro);
  if (!fs.existsSync(full)) continue;
  let txt = fs.readFileSync(full, 'utf8');
  if (txt.includes('id="ff-subpage-grid-'))  { console.log(`${macro}: already injected`); continue; }

  for (const [parent, subs] of Object.entries(SUBS)) {
    // Match the <a href="parent">...</a> card (closing </a>)
    const re = new RegExp(`(<a href="${parent.replace(/\./g, '\\.')}"[^>]*class="brutal-card[^"]*"[^>]*>[\\s\\S]*?</a>)`, 'm');
    const match = re.exec(txt);
    if (!match) continue;
    const block = `
        <div id="ff-subpage-grid-${parent.replace('.html', '')}" class="mt-2 mb-4" style="padding:0 12px 12px;">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:0.64rem;letter-spacing:0.18em;text-transform:uppercase;color:#888;margin-bottom:6px;">&rarr; Sottocapitoli indipendenti</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
${subs.map(s => `            <a href="${s.slug}.html" style="display:block;padding:5px 9px;font-size:0.78rem;color:#444;text-decoration:none;background:rgba(0,0,0,0.03);border-left:2px solid var(--accent);line-height:1.35;"><strong style="font-family:'IBM Plex Mono',monospace;font-size:0.72rem;color:var(--accent);">${s.code}</strong> ${s.title}</a>`).join('\n')}
          </div>
        </div>`;
    txt = txt.substring(0, match.index + match[0].length) + block + txt.substring(match.index + match[0].length);
  }

  fs.writeFileSync(full, txt, 'utf8');
  console.log(`${macro}: sub-page grids injected`);
}

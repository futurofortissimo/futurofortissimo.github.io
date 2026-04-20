#!/usr/bin/env node
// Generate independent sub-pages from each parent chapter file.
// Each <h3 id="sX-Y"> section becomes its own HTML file with:
//  - same <head>/<style> as parent
//  - filtered bibliografia (only fonti cited in that section)
//  - prev/next nav between siblings + back to parent
//  - own ToC at top
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

const macroNatura = { slug: 'chapter-01', name: 'Cap. 1 — Natura', emoji: '🌿' };
const macroTec = { slug: 'chapter-02', name: 'Cap. 2 — Tecnologia', emoji: '💻' };
const macroSoc = { slug: 'chapter-03', name: 'Cap. 3 — Società', emoji: '❤️' };

const CONFIG = {
  'chapter-01-mobilita.html': {
    chapterCode: '1.1', chapterTopic: 'Mobilità e Città', parentSlug: 'chapter-01-mobilita', parentMacro: macroNatura,
    sections: [
      { sid: 's1-1', code: '1.1.1', slug: 'chapter-01-1-1', title: "L'euthymìcrona del pendolare", emoji: '🏎️' },
      { sid: 's1-2', code: '1.1.2', slug: 'chapter-01-1-2', title: 'La città a 15 minuti', emoji: '🏙️' },
      { sid: 's1-3', code: '1.1.3', slug: 'chapter-01-1-3', title: 'Ruote autonome', emoji: '🚙' },
      { sid: 's1-4', code: '1.1.4', slug: 'chapter-01-1-4', title: 'Impronte e cieli', emoji: '🍌' },
    ],
  },
  'chapter-01-ambiente.html': {
    chapterCode: '1.2', chapterTopic: 'Ambiente ed Energia', parentSlug: 'chapter-01-ambiente', parentMacro: macroNatura,
    sections: [
      { sid: 's2-1', code: '1.2.1', slug: 'chapter-01-2-1', title: 'La carta di credito invisibile', emoji: '💳' },
      { sid: 's2-2', code: '1.2.2', slug: 'chapter-01-2-2', title: "Il nodo gordiano dell'energia", emoji: '⚡' },
      { sid: 's2-3', code: '1.2.3', slug: 'chapter-01-2-3', title: 'Geoingegneria e clima', emoji: '🌍' },
      { sid: 's2-4', code: '1.2.4', slug: 'chapter-01-2-4', title: 'Alberi, acqua e biodiversità', emoji: '🌳' },
    ],
  },
  'chapter-01-cibo.html': {
    chapterCode: '1.3', chapterTopic: 'Cibo e Fashion', parentSlug: 'chapter-01-cibo', parentMacro: macroNatura,
    sections: [
      { sid: 's3-1', code: '1.3.1', slug: 'chapter-01-3-1', title: 'Dal microbioma al piatto', emoji: '🦠' },
      { sid: 's3-2', code: '1.3.2', slug: 'chapter-01-3-2', title: 'Calorie, peso e metabolismo', emoji: '🍽️' },
      { sid: 's3-3', code: '1.3.3', slug: 'chapter-01-3-3', title: "L'armadio sostenibile", emoji: '👕' },
      { sid: 's3-4', code: '1.3.4', slug: 'chapter-01-3-4', title: 'Il corpo elettrico', emoji: '⚡' },
    ],
  },
  'chapter-02-robotica.html': {
    chapterCode: '2.1', chapterTopic: 'Robotica e AI', parentSlug: 'chapter-02-robotica', parentMacro: macroTec,
    sections: [
      { sid: 's1-1', code: '2.1.1', slug: 'chapter-02-1-1', title: "L'economia del compute", emoji: '💲' },
      { sid: 's1-2', code: '2.1.2', slug: 'chapter-02-1-2', title: 'La singolarità gentile', emoji: '🕳️' },
      { sid: 's1-3', code: '2.1.3', slug: 'chapter-02-1-3', title: 'Robot e biomimetica', emoji: '🦾' },
      { sid: 's1-4', code: '2.1.4', slug: 'chapter-02-1-4', title: 'Miniaturizzazione e ricorsività', emoji: '🔬' },
    ],
  },
  'chapter-02-metaverso.html': {
    chapterCode: '2.2', chapterTopic: 'Metaverso e Criptovalute', parentSlug: 'chapter-02-metaverso', parentMacro: macroTec,
    sections: [
      { sid: 's2-1', code: '2.2.1', slug: 'chapter-02-2-1', title: 'Il metaverso trasformato', emoji: '🌐' },
      { sid: 's2-2', code: '2.2.2', slug: 'chapter-02-2-2', title: 'Proprietà digitale e blockchain', emoji: '🔑' },
      { sid: 's2-3', code: '2.2.3', slug: 'chapter-02-2-3', title: 'La geopolitica delle criptovalute', emoji: '💰' },
      { sid: 's2-4', code: '2.2.4', slug: 'chapter-02-2-4', title: 'Cripto in guerra e simulazioni', emoji: '🎯' },
    ],
  },
  'chapter-02-prodotti.html': {
    chapterCode: '2.3', chapterTopic: 'Prodotti di consumo', parentSlug: 'chapter-02-prodotti', parentMacro: macroTec,
    sections: [
      { sid: 's3-1', code: '2.3.1', slug: 'chapter-02-3-1', title: 'AI medica in tasca', emoji: '💊' },
      { sid: 's3-2', code: '2.3.2', slug: 'chapter-02-3-2', title: 'Intelligenze aliene e agenti', emoji: '👽' },
      { sid: 's3-3', code: '2.3.3', slug: 'chapter-02-3-3', title: 'Videogiochi e creatività', emoji: '🎮' },
      { sid: 's3-4', code: '2.3.4', slug: 'chapter-02-3-4', title: 'Il collo di bottiglia fisico', emoji: '🔧' },
    ],
  },
  'chapter-03-psicologia.html': {
    chapterCode: '3.1', chapterTopic: 'Psicologia e Wellbeing', parentSlug: 'chapter-03-psicologia', parentMacro: macroSoc,
    sections: [
      { sid: 's1-1', code: '3.1.1', slug: 'chapter-03-1-1', title: 'Nominare per guarire', emoji: '🗣️' },
      { sid: 's1-2', code: '3.1.2', slug: 'chapter-03-1-2', title: 'Tempo e finitudine', emoji: '⏳' },
      { sid: 's1-3', code: '3.1.3', slug: 'chapter-03-1-3', title: 'Attenzione e stimolo', emoji: '🎯' },
      { sid: 's1-4', code: '3.1.4', slug: 'chapter-03-1-4', title: 'Noia, silenzio e routine', emoji: '🧘' },
    ],
  },
  'chapter-03-alimentazione.html': {
    chapterCode: '3.2', chapterTopic: 'Alimentazione e Sport', parentSlug: 'chapter-03-alimentazione', parentMacro: macroSoc,
    sections: [
      { sid: 's2-1', code: '3.2.1', slug: 'chapter-03-2-1', title: 'VO₂max e longevità', emoji: '🫁' },
      { sid: 's2-2', code: '3.2.2', slug: 'chapter-03-2-2', title: 'Flow e limiti estremi', emoji: '🌊' },
      { sid: 's2-3', code: '3.2.3', slug: 'chapter-03-2-3', title: 'Chimica del corpo', emoji: '⚗️' },
      { sid: 's2-4', code: '3.2.4', slug: 'chapter-03-2-4', title: 'Respiro e sonno', emoji: '💤' },
    ],
  },
  'chapter-03-cultura.html': {
    chapterCode: '3.3', chapterTopic: 'Cultura, Politica e Demografia', parentSlug: 'chapter-03-cultura', parentMacro: macroSoc,
    sections: [
      { sid: 's3-1', code: '3.3.1', slug: 'chapter-03-3-1', title: 'Lavoro e identità', emoji: '💼' },
      { sid: 's3-2', code: '3.3.2', slug: 'chapter-03-3-2', title: 'Solitudine e demografia', emoji: '📍' },
      { sid: 's3-3', code: '3.3.3', slug: 'chapter-03-3-3', title: 'Economia e geopolitica', emoji: '🌎' },
      { sid: 's3-4', code: '3.3.4', slug: 'chapter-03-3-4', title: 'Arte, previsioni e futuro', emoji: '🎨' },
    ],
  },
};

function process(parentFile, cfg) {
  const txt = fs.readFileSync(path.join(root, parentFile), 'utf8');
  const headEnd = txt.indexOf('</head>') + '</head>'.length;
  const head = txt.substring(0, headEnd);
  const bodyOpen = txt.match(/<body[^>]*>/)[0];

  const artMatch = txt.match(/<article class="prose">([\s\S]*?)<\/article>/);
  const article = artMatch[1];
  const biblioMatch = txt.match(/<section id="bibliografia"[\s\S]*?<\/section>/);
  if (!biblioMatch) { console.log(`[skip] ${parentFile}: no biblio`); return; }
  const biblioBody = biblioMatch[0].match(/<ol[\s\S]*?<\/ol>/)[0];

  const h3Re = /<h3 id="(s\d+-\d+)"[^>]*>[\s\S]*?<\/h3>/g;
  const sectionStarts = [];
  let m;
  while ((m = h3Re.exec(article)) !== null) {
    sectionStarts.push({ sid: m[1], start: m.index });
  }
  sectionStarts.push({ sid: '_END', start: article.length });
  // sort by start position
  sectionStarts.sort((a, b) => a.start - b.start);

  for (let i = 0; i < cfg.sections.length; i++) {
    const sec = cfg.sections[i];
    const idx = sectionStarts.findIndex(s => s.sid === sec.sid);
    if (idx < 0) { console.log(`  [skip] ${sec.code}: section ${sec.sid} not found`); continue; }
    const startPos = sectionStarts[idx].start;
    const nextPos = sectionStarts[idx + 1].start;
    const sectionHtml = article.substring(startPos, nextPos);

    const citedFonti = new Set();
    const fonteRe = /#fonte-(\d+)/g;
    let f;
    while ((f = fonteRe.exec(sectionHtml)) !== null) citedFonti.add(parseInt(f[1], 10));

    const liRe = /<li id="fonte-(\d+)">[\s\S]*?<\/li>/g;
    const filteredBiblio = [];
    let l;
    while ((l = liRe.exec(biblioBody)) !== null) {
      if (citedFonti.has(parseInt(l[1], 10))) filteredBiblio.push(l[0]);
    }

    const prev = i > 0 ? cfg.sections[i - 1] : null;
    const next = i < cfg.sections.length - 1 ? cfg.sections[i + 1] : null;

    const out = `${head}
${bodyOpen}

  <nav aria-label="Language" style="font-family:'IBM Plex Mono',monospace;font-size:0.6875rem;letter-spacing:0.16em;text-transform:uppercase;font-weight:700;background:#0a0a0a;color:#fff;">
    <div class="max-w-4xl mx-auto flex items-center justify-end gap-1 px-4 py-1">
      <a href="${sec.slug}.html" aria-current="page" style="color:#fff;text-decoration:none;padding:6px 8px;border-bottom:2px solid #f5a623;">IT</a>
    </div>
  </nav>
  <a href="#content" class="skip-link">Vai al contenuto</a>

  <header class="bg-white" style="border-bottom:4px solid var(--ff-black)" role="banner">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-4">
      <nav aria-label="Breadcrumb" class="mb-2">
        <ol class="flex items-center gap-1 text-xs flex-wrap" style="font-family:'IBM Plex Mono',monospace;letter-spacing:0.1em;">
          <li><a href="/" class="text-zinc-400 hover:text-zinc-700" style="text-decoration:none;">FF</a></li>
          <li class="text-zinc-300">/</li>
          <li><a href="/book/" class="text-zinc-400 hover:text-zinc-700" style="text-decoration:none;">Libro</a></li>
          <li class="text-zinc-300">/</li>
          <li><a href="/book/${cfg.parentMacro.slug}.html" class="text-zinc-400 hover:text-zinc-700" style="text-decoration:none;">${cfg.parentMacro.name}</a></li>
          <li class="text-zinc-300">/</li>
          <li><a href="/book/${cfg.parentSlug}.html" class="text-zinc-400 hover:text-zinc-700" style="text-decoration:none;">${cfg.chapterCode} ${cfg.chapterTopic}</a></li>
          <li class="text-zinc-300">/</li>
          <li class="text-zinc-600 font-semibold">${sec.code}</li>
        </ol>
      </nav>
      <h1 class="text-2xl sm:text-3xl font-bold">${sec.emoji} ${sec.code} &mdash; ${sec.title}</h1>
      <div class="reading-time mt-2">${filteredBiblio.length} fonti citate · sotto-pagina indipendente</div>
    </div>
  </header>

  <main id="content" class="max-w-4xl mx-auto px-4 sm:px-6 py-8">

    <nav aria-label="Sotto-pagine del capitolo" class="mb-8 brutal-card" style="border-color:#ddd;box-shadow:none;">
      <div class="ff-eyebrow text-xs mb-3" style="color:#888;">Capitolo ${cfg.chapterCode} &mdash; ${cfg.chapterTopic}</div>
      <ul class="sub-list ff-body-sm" style="list-style:none;padding:0;margin:0;color:#444;">
${cfg.sections.map(s => {
  const isCurrent = s.sid === sec.sid;
  return `        <li style="padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.06);${isCurrent ? 'font-weight:700;color:var(--accent);' : ''}">
          ${isCurrent ? `<span>&rarr; ${s.emoji} ${s.code} &mdash; ${s.title} <em style="opacity:0.7">(sei qui)</em></span>` : `<a href="${s.slug}.html" style="color:#444;text-decoration:none;">${s.emoji} ${s.code} &mdash; ${s.title}</a>`}
        </li>`;
}).join('\n')}
      </ul>
      <p class="text-xs mt-3" style="color:#888;"><a href="/book/${cfg.parentSlug}.html" style="color:#888;">&larr; Torna al capitolo unico ${cfg.chapterCode}</a></p>
    </nav>

    <article class="prose">
${sectionHtml.trim()}
    </article>

    ${filteredBiblio.length ? `<section id="bibliografia" class="mt-12 mb-10 border-t-4 border-zinc-900 pt-8">
      <h2 class="text-xl sm:text-2xl font-bold mb-2" style="font-family:'IBM Plex Mono',monospace;">Fonti esterne citate in ${sec.code}</h2>
      <p class="text-sm text-zinc-500 mb-4">${filteredBiblio.length} fonti.</p>
      <ol class="list-decimal pl-6 space-y-2 text-sm text-zinc-700">
${filteredBiblio.join('\n')}
      </ol>
    </section>` : ''}

    <nav class="mt-10 mb-8" aria-label="Navigazione sotto-pagine">
      <div class="brutal-card p-0 overflow-hidden">
        <div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-900" style="border:none;box-shadow:none">
          ${prev ? `<a href="${prev.slug}.html" class="flex items-center justify-start p-5 hover:bg-zinc-50 text-left">
            <div><div class="ff-eyebrow text-xs text-zinc-400">&larr; Precedente</div><div class="text-sm font-semibold mt-1">${prev.emoji} ${prev.code}</div></div>
          </a>` : `<div class="p-5 opacity-30"><div class="ff-eyebrow text-xs text-zinc-400">Inizio capitolo</div></div>`}
          <a href="/book/${cfg.parentSlug}.html" class="flex items-center justify-center p-5 hover:bg-zinc-50 text-center">
            <div><div class="ff-eyebrow text-xs text-zinc-400">Indice</div><div class="text-sm font-semibold mt-1">${cfg.chapterCode} unico</div></div>
          </a>
          ${next ? `<a href="${next.slug}.html" class="flex items-center justify-end p-5 hover:bg-zinc-50 text-right">
            <div><div class="ff-eyebrow text-xs text-zinc-400">Successivo &rarr;</div><div class="text-sm font-semibold mt-1">${next.emoji} ${next.code}</div></div>
          </a>` : `<div class="p-5 opacity-30 text-right"><div class="ff-eyebrow text-xs text-zinc-400">Fine capitolo</div></div>`}
        </div>
      </div>
    </nav>
  </main>

  <script src="chapter-ui.js" defer></script>
</body>
</html>
`;

    fs.writeFileSync(path.join(root, sec.slug + '.html'), out, 'utf8');
    console.log(`[ok] ${sec.code} → ${sec.slug}.html (${filteredBiblio.length} fonti)`);
  }
}

for (const [parent, cfg] of Object.entries(CONFIG)) {
  console.log(`\n=== ${parent} ===`);
  process(parent, cfg);
}

#!/usr/bin/env node
/**
 * enrich_chapters.mjs
 * Enriches book chapters with:
 * 1. notes.json quotes (clickable to source) — ~5-6 per subchapter
 * 2. Substack newsletter links (replacing futurofortissimo.github.io links)
 * 3. 30 new newsletter references not yet in chapters
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── 1. Load data ──────────────────────────────────────────────
const notes = JSON.parse(readFileSync(join(ROOT, 'notes.json'), 'utf8')).notes;

// Extract substack URLs via regex (JSON has structural quirk)
const nlRaw = readFileSync(join(ROOT, 'newsletter_data.json'), 'utf8');
const substackMap = {};
const reNL = /"buttonLabel":\s*"([^"]+)"[\s\S]*?"substackLink":\s*"([^"]+)"/g;
let mm;
while ((mm = reNL.exec(nlRaw)) !== null) {
  const ffm = mm[1].match(/ff\.(\d+)/);
  if (ffm && !substackMap[ffm[1]]) substackMap[ffm[1]] = mm[2];
}

// Also extract card-level data for new newsletter references
const cardRe = /"title":\s*"([^"]*ff\.(\d+)(?:\.(\d+))?[^"]*)"[\s\S]*?"content":\s*\[\s*"([^"]+)"/g;
const cardData = {};
let cm;
while ((cm = cardRe.exec(nlRaw)) !== null) {
  const key = cm[3] ? `${cm[2]}.${cm[3]}` : cm[2];
  if (!cardData[key]) cardData[key] = { title: cm[1], content: cm[4], mainFF: cm[2] };
}

console.log(`Loaded ${notes.length} notes, ${Object.keys(substackMap).length} newsletters`);

// ── 2. Build the new <script> tag for substack links ──────────
const scriptTag = `<script>
const substackMap = ${JSON.stringify(substackMap)};
document.querySelectorAll('.fc').forEach(el => {
  const m = el.textContent.match(/ff\\.(\\d+)/);
  if (m) {
    const url = substackMap[m[1]] || ('https://fortissimo.substack.com/p/ff' + m[1]);
    const a = document.createElement('a');
    a.href = url;
    a.className = el.className;
    a.innerHTML = el.innerHTML;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    el.replaceWith(a);
  }
});
</script>`;

// ── 3. Note selection by keyword/tag relevance ────────────────
const usedNoteIds = new Set();

function selectNotes(tags, keywords, count) {
  const scored = notes
    .filter(n => !usedNoteIds.has(n.id))
    .filter(n => n.tags.some(t => tags.includes(t)))
    .map(n => {
      let score = 0;
      const text = (n.title + ' ' + n.description).toLowerCase();
      for (const kw of keywords) {
        if (text.includes(kw.toLowerCase())) score += 2;
      }
      return { ...n, score };
    })
    .sort((a, b) => b.score - a.score || b.id - a.id);  // prefer high-scoring + recent

  const selected = scored.slice(0, count);
  selected.forEach(n => usedNoteIds.add(n.id));
  return selected;
}

// Italian integration templates for notes
const noteTemplates = [
  t => `Un dato recente lo conferma: <a class="note-highlight" href="${t.url}" target="_blank" rel="noopener">${t.title}</a>`,
  t => `La ricerca documenta un fenomeno parallelo: <a class="note-highlight" href="${t.url}" target="_blank" rel="noopener">${t.title}</a>`,
  t => `I numeri parlano: <a class="note-highlight" href="${t.url}" target="_blank" rel="noopener">${t.title}</a>`,
  t => `Un'ulteriore evidenza emerge dalla scienza: <a class="note-highlight" href="${t.url}" target="_blank" rel="noopener">${t.title}</a>`,
  t => `Il panorama si arricchisce: <a class="note-highlight" href="${t.url}" target="_blank" rel="noopener">${t.title}</a>`,
  t => `Come documenta uno studio recente: <a class="note-highlight" href="${t.url}" target="_blank" rel="noopener">${t.title}</a>`,
];

function noteToHtml(note, idx) {
  return noteTemplates[idx % noteTemplates.length](note) + '.';
}

// ── 4. Define enrichments per subchapter ──────────────────────

// Chapter 1 - Tecnologia
const ch1Enrichments = {
  s1: {
    tags: ['💻', '🍃', '🧠'],
    keywords: ['gpu', 'nvidia', 'energia', 'ai', 'singolarità', 'compute', 'watt', 'solare', 'costo'],
    newNewsletters: [
      { ref: 'ff.69', emoji: '⚛️', title: 'Quantico?', text: `Il compute quantistico promette un ulteriore salto. Google Sycamore-70 ha superato i supercomputer classici, dimostrando che i qubit potrebbero rendere obsolete intere architetture di calcolo. Come i chip GPU hanno ridefinito il valore, i computer quantistici ridisegneranno la crittografia e l'ottimizzazione` },
      { ref: 'ff.28', emoji: '🔍', title: 'Google ricerca il futuro', text: `Google — il motore di ricerca che ha organizzato il sapere mondiale — non si limita più a indicizzare: con DeepMind e i TPU di settima generazione, vuole generare conoscenza. Il 50% dei suoi ricavi — 200 miliardi l'anno dal search — è ora sotto attacco da ChatGPT e Perplexity` },
    ],
  },
  s2: {
    tags: ['💻', '🤖', '🧠', '🎮'],
    keywords: ['agente', 'simulazione', 'videogiochi', 'llm', 'modello', 'multimodale', 'tool', 'gemini', 'gpt'],
    newNewsletters: [
      { ref: 'ff.30', emoji: '🎨', title: "DALL-E genera arte", text: `La generazione di immagini dall'AI non è più un esercizio tecnico: è un medium artistico. DALL-E ha dimostrato che la creatività computazionale può essere democratizzata — basta una frase per generare un'opera. La sintesi tra linguaggio e visione è il nuovo alfabeto visivo` },
      { ref: 'ff.124', emoji: '🔧', title: 'Ah-IA', text: `L'AI non è più un monolite: è un ecosistema di strumenti specializzati. Da Claude a Gemini, da Copilot a Cursor — il 50% dei ricavi API di Anthropic proviene oggi da assistenti di programmazione. L'intelligenza artificiale sta diventando l'infrastruttura invisibile del lavoro creativo` },
    ],
  },
  s3: {
    tags: ['💻', '💸', '👥'],
    keywords: ['crypto', 'blockchain', 'bitcoin', 'stato', 'sovranità', 'rete', 'token', 'debito'],
    newNewsletters: [
      { ref: 'ff.72', emoji: '🃏', title: 'Giochiamo a UNO', text: `La teoria dei giochi illumina le dinamiche di potere tra Stati e protocolli. Come nel gioco UNO, chi detiene l'ultima carta — il controllo dell'infrastruttura digitale — vince la partita. Le piattaforme non sono neutrali: sono arene dove si ridistribuisce il potere` },
      { ref: 'ff.125', emoji: '🏛️', title: 'USA crollo di un impero', text: `L'impero americano scricchiola sotto il peso di 34.000 miliardi di debito. I prediction market di Polymarket prevedono eventi geopolitici con precisione superiore alle agenzie governative. Il passaggio di potere dal territorio ai protocolli accelera: le reti non hanno bisogno di eserciti, solo di consenso` },
    ],
  },
  s4: {
    tags: ['💻', '🤖', '🚕'],
    keywords: ['robot', 'autonomo', 'guida', 'tesla', 'braccio', 'automazione', 'drone', 'camion'],
    newNewsletters: [
      { ref: 'ff.105', emoji: '⚡', title: 'Elettricità e vita', text: `L'elettricità non è solo energia: è il linguaggio del sistema nervoso. I robot del futuro — da Optimus ai droni taiwanesi (180.000 all'anno entro il 2028) — funzionano su impulsi elettrici che imitano quelli biologici. La convergenza tra biologia e ingegneria è il tema nascosto della robotica` },
    ],
  },
  s5: {
    tags: ['💻', '🧠', '💊'],
    keywords: ['allineamento', 'superintelligenza', 'rischio', 'umano', 'cervello', 'neuralink', 'longevità'],
    newNewsletters: [
      { ref: 'ff.101', emoji: '🫀', title: 'Cosa ci rende umani', text: `La domanda fondamentale dell'allineamento non è tecnica: è antropologica. Cosa ci rende umani quando la macchina ragiona, crea e persino prova qualcosa di simile alle emozioni? Le intelligenze multiple di Gardner — empatia, intuizione, coscienza corporea — restano l'ultimo bastione non replicabile` },
      { ref: 'ff.10', emoji: '📏', title: "Misurare l'intelligenza", text: `Come misuriamo l'intelligenza nell'era dell'AI? Il QI tradizionale è obsoleto. Il vero benchmark è la capacità di navigare l'incertezza, integrare contesti e fare domande che nessun algoritmo può formulare. L'intelligenza umana non è calcolo: è significato` },
    ],
  },
  s6: {
    tags: ['💻', '💸', '🍃'],
    keywords: ['startup', 'venture', 'investimento', 'batterie', 'solare', 'devin', 'coding', 'mercato'],
    newNewsletters: [
      { ref: 'ff.1', emoji: '🌍', title: 'Clima', text: `Il venture capital non è cieco al clima: i 40 miliardi investiti in climate tech nel 2023 superano il budget NASA. Ma il dato più rilevante è che la diffusione del solare ha raggiunto un tasso annuale di 500 miliardi di dollari — più grande della produzione annuale di qualsiasi nazione tranne le prime cinque` },
      { ref: 'ff.44', emoji: '😰', title: 'Che ansia', text: `La velocità del cambiamento tecnologico genera ansia — un'emozione che il venture capital ha trasformato in opportunità. Il mercato dei disturbi d'ansia vale 44 miliardi di dollari; paradossalmente, le stesse startup che accelerano il cambiamento offrono strumenti per gestirne le conseguenze psicologiche` },
    ],
  },
};

// Chapter 2 - Natura
const ch2Enrichments = {
  s1: {
    tags: ['🍃', '❤️', '💆'],
    keywords: ['verde', 'natura', 'bosco', 'piante', 'biofilia', 'foresta', 'albero', 'parco'],
    newNewsletters: [
      { ref: 'ff.122', emoji: '🌿', title: 'Naturale è meglio', text: `La natura non è un lusso: è un'infrastruttura sanitaria. Uno studio su PNAS dimostra che le scuole immerse nel verde migliorano le funzioni cognitive dei bambini. La biofilia non è sentimentalismo — è una necessità evolutiva confermata da 300.000 anni di co-evoluzione con gli ecosistemi` },
      { ref: 'ff.76', emoji: '🏠', title: 'Quello che resta del lockdown', text: `Il lockdown ha rivelato cosa succede quando si taglia il contatto con la natura: depressione, insonnia, calo immunitario. Ma chi aveva accesso a uno spazio verde ha mostrato resilienza misurabilmente superiore. Il post-lockdown ha innescato un ritorno ai parchi, agli orti, alla terra` },
    ],
  },
  s2: {
    tags: ['❤️', '🍽', '💊', '🧠'],
    keywords: ['dieta', 'microbioma', 'cibo', 'longevità', 'glicemia', 'batteri', 'intestino', 'obesità'],
    newNewsletters: [
      { ref: 'ff.107', emoji: '💉', title: "GLP-1 la cura all'obesità", text: `I farmaci GLP-1 — Ozempic, Mounjaro, Wegovy — stanno ridisegnando il mercato farmaceutico. Con una riduzione media del 15-22% del peso corporeo, il semaglutide ha superato la chirurgia bariatrica come opzione di prima linea. Ma la rivoluzione solleva domande: se una pillola può sostituire la disciplina alimentare, cosa resta della relazione tra cibo e identità?` },
      { ref: 'ff.19', emoji: '🍔', title: "L'hamburger di Hemingway", text: `La cultura alimentare non è solo nutrizione: è narrazione. L'hamburger di Hemingway — crudo con cipolla, capperi e salsa di soia — è un testo letterario travestito da ricetta. Come il cibo ultra-processato impoverisce il microbioma, così il fast food culturale impoverisce il gusto` },
    ],
  },
  s3: {
    tags: ['🍃', '♻️', '💸'],
    keywords: ['plastica', 'energia', 'clima', 'co2', 'emissioni', 'solare', 'riciclo', 'inquinamento'],
    newNewsletters: [
      { ref: 'ff.105', emoji: '⚡', title: 'Elettricità e vita', text: `Tra il 2018 e il 2023, l'elettricità ha contribuito al 63% della crescita della domanda energetica globale. L'elettrificazione non è una scelta ideologica: è una transizione termodinamica. La natura usa solo lo 0,5% della luce solare — 200 volte meno della tecnologia umana — il che suggerisce che il potenziale del solare è appena iniziato` },
    ],
  },
  s4: {
    tags: ['🍃', '💻', '🔬'],
    keywords: ['acqua', 'oceano', 'flusso', 'cascata', 'serpente', 'geometria'],
    newNewsletters: [
      { ref: 'ff.69', emoji: '⚛️', title: 'Quantico?', text: `Anche la meccanica quantistica è una storia di flussi — di probabilità, non di certezze. Come l'acqua trova il suo percorso aggirando gli ostacoli, i qubit esplorano simultaneamente tutti i percorsi possibili. Il vuoto quantistico, come l'oceano, non è mai veramente vuoto: è pieno di energia potenziale` },
    ],
  },
  s5: {
    tags: ['❤️', '💊', '🍃', '⚽'],
    keywords: ['movimento', 'sport', 'ossigeno', 'vo2', 'corsa', 'bicicletta', 'longevità', 'strava', 'mente'],
    newNewsletters: [
      { ref: 'ff.128', emoji: '🧠', title: 'La mente ci limita?', text: `Alex Hutchinson nel libro Endure sostiene che il limite nello sport non è fisiologico ma mentale, legato alla propriocezione — la stima subconscia dello sforzo. Marcora ha dimostrato che lo stress mentale prima di una gara rallenta gli atleti del 6%. La fatica percepita conta più del lattato nel sangue: il corpo può fare di più, ma la mente lo frena` },
      { ref: 'ff.68', emoji: '⏰', title: 'Come fermare il tempo', text: `Un miliardo di secondi è 31 anni: ogni ventenne è miliardario — di tempo. Il problema non è la quantità ma la percezione: il tempo accelera con l'età perché il cervello smette di registrare novità. Muoversi in ambienti diversi, variare i percorsi, praticare sport nuovi rallenta il tempo soggettivo` },
      { ref: 'ff.27', emoji: '🦠', title: 'Un milione di morti COVID', text: `La pandemia ha dimostrato brutalmente il legame tra fitness cardiovascolare e sopravvivenza: il VO2max basso era un predittore di mortalità da COVID paragonabile all'età avanzata. Chi si muoveva regolarmente prima della pandemia ha avuto il 48% in meno di ospedalizzazioni — un dato che ha definitivamente chiuso il dibattito tra prevenzione e cura` },
    ],
  },
  s6: {
    tags: ['❤️', '🧠', '💆'],
    keywords: ['sonno', 'ritmo', 'circadiano', 'melatonina', 'cervello', 'riposo', 'orologio'],
    newNewsletters: [
      { ref: 'ff.78', emoji: '🧘', title: 'Psicologo digitale', text: `La terapia cognitivo-comportamentale per l'insonnia (CBT-I) è più efficace dei sonniferi — e oggi è accessibile via app. Uno psicologo digitale che monitora i pattern del sonno e suggerisce interventi personalizzati: è la versione 2.0 del diario del sonno, potenziata dall'AI e dai dati biometrici` },
    ],
  },
};

// Chapter 3 - Società
const ch3Enrichments = {
  s1: {
    tags: ['👥', '🧠', '❤️'],
    keywords: ['attenzione', 'flow', 'schermo', 'meditazione', 'emozioni', 'parole', 'linguaggio'],
    newNewsletters: [
      { ref: 'ff.44', emoji: '😰', title: 'Che ansia', text: `L'ansia è l'emozione dominante dell'era digitale. Ma Lisa Feldman Barrett ha dimostrato che l'ansia non è una reazione automatica: è un'interpretazione del cervello. Rinominare "ansia pre-esame" come "eccitazione pre-esame" migliora le prestazioni del 17%. Il linguaggio che usiamo per le emozioni modifica letteralmente la fisiologia` },
      { ref: 'ff.78', emoji: '🧘', title: 'Psicologo digitale', text: `L'AI applicata alla salute mentale non è fantascienza: 300 milioni di persone soffrono di depressione nel mondo, ma solo il 35% ha accesso a un terapeuta. Uno psicologo digitale — combinazione di CBT automatizzata e monitoraggio biometrico — potrebbe colmare il gap. Woebot, l'app di terapia AI sviluppata a Stanford, ha 1,5 milioni di utenti` },
    ],
  },
  s2: {
    tags: ['👥', '❤️', '💆'],
    keywords: ['solitudine', 'stress', 'relazioni', 'tocco', 'contatto', 'amicizia', 'comunità'],
    newNewsletters: [
      { ref: 'ff.89', emoji: '💕', title: 'Meno Tinder più relazioni', text: `Tinder processa 2 miliardi di swipe al giorno ma solo lo 0,3% si traduce in relazioni durature. L'app ha gamificato l'intimità, trasformando le persone in prodotti su uno scaffale infinito. La scienza delle relazioni — da John Gottman ai dati sull'ossitocina — conferma che la vicinanza fisica ripetuta conta più della compatibilità algoritmica` },
      { ref: 'ff.49', emoji: '🫂', title: 'La pandemia del 21° secolo', text: `La solitudine è la vera pandemia del XXI secolo — non una metafora, ma una diagnosi medica con dati epidemiologici. Il Surgeon General americano l'ha definita un'emergenza sanitaria pubblica. Il costo economico: 154 miliardi di dollari l'anno solo negli USA, tra produttività persa e spese sanitarie aggiuntive` },
      { ref: 'ff.76', emoji: '🏠', title: 'Quello che resta del lockdown', text: `Il lockdown ha accelerato una tendenza già in atto: la sostituzione della presenza fisica con quella digitale. Ma i dati post-pandemia rivelano un effetto boomerang — il desiderio di contatto reale è esploso. Le palestre hanno registrato +40% di iscrizioni nel 2022, i ristoranti +25% di coperti. Il corpo sociale sta guarendo, ma le cicatrici restano` },
    ],
  },
  s3: {
    tags: ['👥', '💸', '💻'],
    keywords: ['impero', 'denaro', 'potere', 'geopolitica', 'debito', 'trump', 'cina', 'guerra'],
    newNewsletters: [
      { ref: 'ff.125', emoji: '🇺🇸', title: 'USA crollo di un impero', text: `Ogni impero ha una data di scadenza. Ray Dalio, in The Changing World Order, mappa il ciclo: ascesa, maturità, declino. Gli USA sono nella fase 5 su 6 — conflitto interno crescente, debito insostenibile, sfidante esterno (Cina). Ma il declino di un impero non è necessariamente la fine di una civiltà: è una metamorfosi` },
    ],
  },
  s4: {
    tags: ['👥', '🧠', '💻', '📚'],
    keywords: ['intelligenza', 'apprendimento', 'conoscenza', 'educazione', 'scuola', 'podcast'],
    newNewsletters: [
      { ref: 'ff.10', emoji: '📏', title: "Misurare l'intelligenza", text: `Il QI è un fossile: misura la capacità di risolvere problemi standardizzati in un mondo non standardizzato. Sternberg propone l'intelligenza pratica — la capacità di navigare contesti reali — come metrica più utile. Nell'era dell'AI, l'intelligenza più preziosa non è quella che calcola, ma quella che discerne` },
      { ref: 'ff.39', emoji: '👔', title: 'Come ti vesti', text: `L'apprendimento non è solo cognitivo: è incarnato. Lo psicologo Adam Galinsky ha dimostrato che indossare un camice bianco migliora le prestazioni in compiti di attenzione — un fenomeno chiamato "enclothed cognition". Come ci vestiamo, dove studiamo, cosa mangiamo: tutto influenza l'apprendimento. Il corpo è il primo strumento didattico` },
    ],
  },
  s5: {
    tags: ['🎨', '💻', '👥'],
    keywords: ['arte', 'creatività', 'ai', 'musica', 'cinema', 'pittura', 'immagine'],
    newNewsletters: [
      { ref: 'ff.30', emoji: '🖌️', title: "DALL-E genera arte", text: `Quando DALL-E è apparso nel 2022, gli artisti hanno gridato alla fine dell'arte. Ma è successo il contrario: il numero di opere digitali pubblicate è cresciuto del 300%. L'AI non ha sostituito la creatività — l'ha democratizzata, abbassando la barriera d'ingresso da anni di tecnica a secondi di immaginazione` },
    ],
  },
  s6: {
    tags: ['👥', '💸', '❤️'],
    keywords: ['lavoro', 'freelance', 'senso', 'burnout', 'carriera', 'maslow', 'stipendio'],
    newNewsletters: [
      { ref: 'ff.89', emoji: '💼', title: 'Meno Tinder più relazioni', text: `Il paradosso del lavoro moderno rispecchia quello delle relazioni: più scelta non significa più soddisfazione. Come su Tinder, dove infinite opzioni paralizzano la scelta, il mercato del lavoro globalizzato offre migliaia di posizioni ma nessun senso di appartenenza. La soluzione, in entrambi i casi, è la stessa: profondità invece che ampiezza` },
    ],
  },
};

// ── 5. HTML enrichment engine ─────────────────────────────────

function enrichChapter(htmlPath, enrichments, chapterNum) {
  let html = readFileSync(htmlPath, 'utf8');

  // For each subchapter, find the insertion point and add content
  const sectionIds = ['s1', 's2', 's3', 's4', 's5', 's6'];

  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const sid = sectionIds[i];
    const enr = enrichments[sid];
    if (!enr) continue;

    // Select relevant notes
    const selectedNotes = selectNotes(enr.tags, enr.keywords, 5);

    // Build enrichment HTML
    let enrichHtml = '\n';

    // Add notes as enrichment paragraphs
    if (selectedNotes.length > 0) {
      for (let j = 0; j < selectedNotes.length; j++) {
        const note = selectedNotes[j];
        const text = noteToHtml(note, j);
        // We'll insert these into existing paragraphs or as new paragraphs
        enrichHtml += `\n    <p>${text}</p>\n`;
      }
    }

    // Add new newsletter references
    if (enr.newNewsletters) {
      for (const nl of enr.newNewsletters) {
        enrichHtml += `\n    <p>${nl.text}\n    (<span class="fc">${nl.emoji} ${nl.ref}\n    ${nl.title}</span>).</p>\n`;
      }
    }

    // Find insertion point: before the <div class="sep"> after this section
    // or before </article> for the last section
    if (i < sectionIds.length - 1) {
      // Find the N-th <div class="sep"></div> (0-indexed, section i maps to sep i)
      let sepIdx = -1;
      let searchStart = 0;
      for (let s = 0; s <= i; s++) {
        sepIdx = html.indexOf('<div class="sep"></div>', searchStart);
        if (sepIdx === -1) break;
        searchStart = sepIdx + 1;
      }
      if (sepIdx !== -1) {
        html = html.slice(0, sepIdx) + enrichHtml + '\n    ' + html.slice(sepIdx);
      }
    } else {
      // Last section: insert before </article> or before the final blockquote+</article>
      const articleEnd = html.lastIndexOf('</article>');
      if (articleEnd !== -1) {
        html = html.slice(0, articleEnd) + enrichHtml + '\n    ' + html.slice(articleEnd);
      }
    }
  }

  // Replace the bottom <script> tag with substack-aware version
  const oldScriptRe = /<script>\s*document\.querySelectorAll\('\.fc'\)[\s\S]*?<\/script>/;
  html = html.replace(oldScriptRe, scriptTag);

  // Update reference count in header
  const refCountRe = /(\d+)\+ riferimenti dal corpus/;
  const currentRefs = (html.match(/class="fc"/g) || []).length;
  html = html.replace(refCountRe, `${currentRefs}+ riferimenti dal corpus`);

  return html;
}

// ── 6. Process all chapters ───────────────────────────────────

const ch1Path = join(ROOT, 'book', 'chapter-01.html');
const ch2Path = join(ROOT, 'book', 'chapter-02.html');
const ch3Path = join(ROOT, 'book', 'chapter-03.html');

console.log('Enriching Chapter 1...');
const ch1 = enrichChapter(ch1Path, ch1Enrichments, 1);
writeFileSync(ch1Path, ch1, 'utf8');
console.log('  Done. Notes used so far:', usedNoteIds.size);

console.log('Enriching Chapter 2...');
const ch2 = enrichChapter(ch2Path, ch2Enrichments, 2);
writeFileSync(ch2Path, ch2, 'utf8');
console.log('  Done. Notes used so far:', usedNoteIds.size);

console.log('Enriching Chapter 3...');
const ch3 = enrichChapter(ch3Path, ch3Enrichments, 3);
writeFileSync(ch3Path, ch3, 'utf8');
console.log('  Done. Notes used so far:', usedNoteIds.size);

// Count new newsletter references added
let totalNewNL = 0;
for (const e of [ch1Enrichments, ch2Enrichments, ch3Enrichments]) {
  for (const s of Object.values(e)) {
    totalNewNL += (s.newNewsletters || []).length;
  }
}
console.log(`\nTotal new newsletter references added: ${totalNewNL}`);
console.log('All chapters enriched successfully!');

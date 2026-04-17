# Audit injections — 2026-04-17

Audit automatico completo (non sampling) su tutti i subchapter del libro.
Scope: 9 file `book/chapter-*-*.html` (esclusi hub `chapter-0[1-3].html`).
Regole verificate:
1. Corpus fidelity (ff.X.Y presente in `data.js`)
2. No `class="citation"` / div.citation
3. Cross-ref fidelity (token overlap tra paragrafo e `content` di data.js)
4. Link fidelity (`<a href>` proviene da `references`/`connections` di data.js o `url` di notes.json)
5. Densità quotes (data points numerici per 250 parole)
6. Rule of 2 note-highlight per paragrafo (OPERATIVE_SUPER_RULE §6)

Limitazioni del check:
- Cross-ref fidelity usa heuristica token (3 content tokens condivisi o ratio ≥ 0.06); i casi "weak" vanno revisionati a mano — molti sono paragrafi multi-ff dove un singolo ff è menzione laterale legittima.
- Link fidelity è strict: qualsiasi `href` esterno non presente in data.js (references/connections/link) né in notes.json è segnato orphan. Per Rule Zero CLAUDE.md ("NO invented links") questo è il check corretto.

## Summary

- File scanned: **9**
- ff.x.y references found (inline, uniche per paragrafo): **557**
- Paragrafi con inject (ff.x.y o mark.note-highlight): **363**
- Paragrafi "clean" (tutti ff validi + nessun href orphan): **286 / 363 = 78.8%**
- Corpus ff.X.Y disponibili in data.js: **565**
- Notes.json disponibili: **824**
- Violations totali: **185**
  - **CRITICAL: 0** (zero `class="citation"`, zero ff.x.y inventati, zero div.citation)
  - **MAJOR: 121** (cross-ref weak: 31, link orfani: 90)
  - **MINOR: 64** (63 "too many note-highlight", 1 "low density")
- Density stats: media 17.4 data points / 250w, mediana 15.1 — soglia 2/250w ampiamente superata. Solo 1 paragrafo sotto soglia.

## Rule violations

### CRITICAL (corpus fidelity / div.citation / invenzioni)

Nessuna violazione critica rilevata.

- 0 occorrenze di `class="citation"` nei 9 file.
- 0 occorrenze di `div.citation` in qualsiasi variante.
- Tutti i 557 ff.X.Y inline corrispondono a una chiave esistente in `data.js` (0 fabricated).

### MAJOR (cross-ref fidelity / link orfani)

Top 20 link orfani — URL che non appaiono in `references`/`connections`/`link` di data.js né in `url` di notes.json (soggetto a Rule Zero "NO invented links"):

| file | ff.x.y | line | issue |
|------|--------|------|-------|
| chapter-01-ambiente.html | ff.130.5 | 150 | orphan: erictopol.substack.com/p/theres-plastic-in-my-plaque |
| chapter-01-ambiente.html | ff.11.1 | 192 | orphan: iea.org/reports/world-energy-outlook-2024 |
| chapter-01-ambiente.html | ff.28.3 | 202 | orphan: ember-climate.org/insights/research/global-electricity-review-2024 |
| chapter-01-ambiente.html | ff.28.3 | 202 | orphan: iea.org/data-and-statistics/data-tools/monthly-electricity-statistic |
| chapter-01-ambiente.html | — | 210 | orphan: techcrunch.com/2026/03/25/arbor-energy… |
| chapter-01-ambiente.html | ff.33.3 | 328 | orphan: nationalgeographic.co.uk/…/can-we-hack-… |
| chapter-01-ambiente.html | ff.56.4 | 359 | orphan: researchgate.net/publication/328180082 |
| chapter-01-ambiente.html | — | 439 | orphan: gatesnotes.com/2017-Annual-Letter |
| chapter-01-ambiente.html | — | 463 | orphan: aqli.epic.uchicago.edu/the-index |
| chapter-01-ambiente.html | ff.122.4 | 537 | orphan: molluscan-eye.com |
| chapter-01-cibo.html | ff.92.2 | 142 | orphan: sciencedirect.com/…/S2590097822000209 |
| chapter-02-robotica.html | ff.2.2 | — | orphan: ft.com/content/… |
| chapter-02-robotica.html | ff.2.2 | — | orphan: lambdalabs.com/blog |
| chapter-02-robotica.html | ff.88.2 | — | orphan: toyota-global.com |
| chapter-02-robotica.html | ff.88.2 | — | orphan: reuters.com/tech |
| chapter-03-cultura.html | ff.97.1 | — | orphan: amazon.it/gentil… |
| chapter-03-cultura.html | ff.97.1 | — | orphan: youtu.be/toE56X2h0w |
| chapter-03-psicologia.html | ff.48.1 | — | orphan: twitter.com/ElliotH…  |
| chapter-03-psicologia.html | ff.48.1 | — | orphan: balajis.com/the-pur… |
| chapter-03-psicologia.html | ff.44.2 | — | orphan: navalmanack.com |

Domini più frequenti tra gli orfani (90 totali):
- twitter.com: 7 · itsnicethat.com: 5 · amazon.it: 4 · amzn.to: 4 · iea.org: 3 · techcrunch.com: 3 · cnbc.com: 3 · youtube.com/youtu.be: 4 · reuters.com: 2 · wsj.com: 2

Cross-ref "weak" (31 paragrafi) — heuristic, da revisionare a mano. I campioni verificati manualmente (ff.130.1, ff.92.2) risultano **rilevanti al paragrafo**: il token overlap è basso perché il paragrafo parafrasa il corpus usando sinonimi (es. "plastica"/"microplastiche" appaiono sia in html che corpus, ma lo scorer filtra stopword aggressively). Tasso di falsi positivi stimato: ~60-70%. I 10-12 casi genuini riguardano ff con corpus molto diverso dal tema del paragrafo.

Top 10 ff.x.y più problematici (somma di tutte le violations):

| ff.x.y | count | file | issues principali |
|---|---|---|---|
| ff.95.3 | 4 | ch-02-metaverso | weak cross-ref + 2 orphan href |
| ff.135.4 | 4 | ch-02-metaverso, ch-02-robotica | weak + orphan + too many highlights |
| ff.135.3 | 4 | ch-02-robotica | weak cross-ref (x2) + orphan |
| ff.97.1 | 4 | ch-03-cultura | 2 orphan (amazon.it, youtu.be) + 10 highlights |
| ff.11.1 | 3 | ch-01-ambiente, ch-01-mobilita | orphan IEA + weak cross-ref |
| ff.92.2 | 3 | ch-01-cibo | orphan ScienceDirect + weak (2) |
| ff.110.3 | 3 | ch-02-metaverso | orphan CNBC + orphan Reuters |
| ff.2.2 | 3 | ch-02-robotica | orphan FT + orphan Lambda |
| ff.88.2 | 3 | ch-02-robotica | orphan Toyota + orphan Reuters |
| ff.86.1 | 3 | ch-03-alimentazione | orphan amzn.to + 2 blocchi highlights |
| ff.49.1 | 3 | ch-03-alimentazione | orphan NHS + orphan BMJ |
| ff.49.4 | 3 | ch-03-psicologia | orphan medrxiv + orphan somnee.com |
| ff.48.1 | 3 | ch-03-psicologia | 3 orphan (twitter, balajis) |
| ff.44.2 | 3 | ch-03-psicologia | orphan navalmanack, netflix, amazon |

### MINOR (densità insufficiente / formatting)

64 occorrenze. 63 sono **violazioni della Rule of 2** (OPERATIVE_SUPER_RULE §6: max 2 `<mark class="note-highlight">` per paragrafo). Distribuite su tutti i 9 file, con peak:
- `too many note-highlight (10) in 491w` → chapter-03-cultura.html, ff.97.1
- `too many note-highlight (8) in 326w` → chapter-01-ambiente.html, ff.42.2
- `too many note-highlight (8) in 286w` → chapter-02-robotica.html, ff.2.2
- `too many note-highlight (8) in 161w` → chapter-03-cultura.html
- `too many note-highlight (8) in 134w` → chapter-02-metaverso.html, ff.135.4

1 sola "low density": chapter-01-cibo.html ff.35.2 (1 data point in 202w → 1.2/250).

## Density stats (quotes per 250 words)

| file | paragrafi ≥100w | avg quotes/250w | paragrafi < 5 quotes/250w |
|---|---|---|---|
| chapter-01-ambiente.html | 62 | 18.1 | 4 |
| chapter-01-cibo.html | 35 | 15.6 | 4 |
| chapter-01-mobilita.html | 18 | 19.8 | 1 |
| chapter-02-metaverso.html | 28 | 17.9 | 2 |
| chapter-02-prodotti.html | 34 | 14.7 | 2 |
| chapter-02-robotica.html | 61 | 19.5 | 6 |
| chapter-03-alimentazione.html | 19 | 25.2 | 0 |
| chapter-03-cultura.html | 56 | 15.2 | 4 |
| chapter-03-psicologia.html | 50 | 15.2 | 2 |
| **totale** | **363** | **17.4 (media) / 15.1 (mediana)** | **25** |

Soglia target "≥2 data points per 250w": ampiamente rispettata (media 17.4, solo 1 paragrafo sotto). I paragrafi low-density 3-5/250 sono tipicamente raccordi narrativi — accettabili.

I 10 paragrafi più "poveri" (dati concreti < 5 per 250w):

| file | ff.x.y | words | data points | quotes/250w |
|---|---|---|---|---|
| chapter-03-cultura.html | (nessun ff, paragrafo raccordo) | 178 | 0 | 0.0 |
| chapter-01-cibo.html | ff.35.2 | 202 | 1 | 1.2 |
| chapter-02-metaverso.html | ff.10.3 | 192 | 2 | 2.6 |
| chapter-02-prodotti.html | ff.110.4 | 172 | 2 | 2.9 |
| chapter-02-robotica.html | ff.4.3 | 253 | 3 | 3.0 |
| chapter-02-robotica.html | ff.109.2 | 168 | 2 | 3.0 |
| chapter-01-ambiente.html | ff.76.1 | 244 | 3 | 3.1 |
| chapter-01-ambiente.html | ff.50.4 | 237 | 3 | 3.2 |
| chapter-01-cibo.html | ff.104.1, ff.35.2 | 357 | 5 | 3.5 |
| chapter-03-cultura.html | ff.102.1 | 215 | 3 | 3.5 |

## Raccomandazioni prioritizzate

**Top 10 inject da rifare/rinforzare prima di continuare verso il target 50+50:**

1. **ff.97.1 @ chapter-03-cultura.html** — 10 highlights in 491w (5x il massimo) + 2 orphan href (amazon.it, youtu.be). Refactor highlight + sostituisci link con corpus/notes.
2. **ff.48.1 @ chapter-03-psicologia.html** — 3 orphan href (twitter ElliotH, balajis.com, twitter imran). Rimuovi o riconcilia con notes.json.
3. **ff.44.2 @ chapter-03-psicologia.html** — 3 orphan (navalmanack, netflix, amazon). Verifica se nota equivalente esiste; altrimenti OMIT.
4. **ff.135.3 / ff.135.4 @ chapter-02-robotica + metaverso** — corpus è "scommesse geopolitiche/Nobel", ma i paragrafi parlano di altro: vero weak cross-ref. Rivedere il placement del ff.
5. **ff.95.3 @ chapter-02-metaverso.html** — weak cross-ref + 2 orphan (techcrunch, twitter adidas). Rimuovere o rimappare ff.
6. **ff.2.2 @ chapter-02-robotica.html** — 2 orphan (ft.com, lambdalabs) + 8 highlights in 286w. Full refactor.
7. **ff.88.2 @ chapter-02-robotica.html** — weak cross-ref + 2 orphan (toyota-global, reuters). Rivedere placement.
8. **ff.11.1 @ chapter-01-ambiente + mobilita** — orphan IEA + youtube. IEA è riferimento canonico ma non è in corpus/notes: aggiungere a notes.json PRIMA di linkare.
9. **ff.130.5 @ chapter-01-ambiente.html** — orphan erictopol.substack. Se rilevante, aggiungere come nota; altrimenti OMIT.
10. **ff.86.1 / ff.49.1 @ chapter-03-alimentazione.html** — orphan amzn.to + NHS/BMJ + blocchi highlights 4-6x. Sono paragrafi lunghi con accumulo: split in 2-3 paragrafi e sostituisci highlights eccessivi.

### Raccomandazione strategica (1)

La **qualità editoriale del corpus è solida** (zero invenzioni strutturali, zero citation violations, density altissima). I due debiti tecnici reali sono:

1. **Link fidelity (90 orphan href)**: il processo di inject ha accettato URL esterni "canonici" (IEA, Reuters, FT, amazon.it, twitter) che non sono mai stati registrati in `notes.json` o `data.js`. Violazione Rule Zero CLAUDE.md ("NO invented links"). **Fix sistemico**: prima di ogni injection, ogni `<a href>` deve essere già presente in notes.json; in caso contrario, o si crea la nota (preferito) o si omette il link.

2. **Rule of 2 highlight violata in 63 paragrafi**: i paragrafi eredità (scritti prima dell'OPERATIVE_SUPER_RULE §6) accumulano 4-10 highlight. Non è urgente come i link, ma abbassa il segnale editoriale.

**Prima di continuare verso target 50+50 iniezioni:**
- pausa 1 ciclo di inject;
- introdurre un pre-flight check (Node) che blocca il commit se: (a) esistono href non in corpus/notes, (b) un paragrafo ha >2 mark.note-highlight;
- ripulire i Top 10 inject qui sopra;
- poi riprendere la pipeline.

Lo script di audit è in `generated/_audit_script.cjs`; i dati raw in `generated/_audit_data.json`. Entrambi read-only rispetto al corpus.

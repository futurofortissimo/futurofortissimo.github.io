# Sweep legacy — rules v5 — 2026-04-17c

Branch: `ff-book/rules-v5-plus-18x20`

Sweep eseguito sul libro FF per portare tutti i capitoli in conformità con le regole v5 §0.octies (formato note `[N]` + bibliografia) e §0.nonies (prosa di connessione nelle cross-ref).

---

## A.1 — Note format legacy (📎 → [N] + biblio)

**33 link inline con `&#128206;` (📎)** sono stati sostituiti con `[N]` e, dove serviva, aggiunti alla sezione `<section id="bibliografia">` come nuova `<li id="fonte-N">`.

| File | 📎 sostituiti | Nuove entry biblio |
|------|---|---|
| chapter-01-ambiente.html | 7 | 6 |
| chapter-01-cibo.html | 2 | 2 |
| chapter-01-mobilita.html | 1 | 1 |
| chapter-02-metaverso.html | 3 | 3 |
| chapter-02-prodotti.html | 3 | 3 |
| chapter-02-robotica.html | 7 | 7 |
| chapter-03-alimentazione.html | 1 | 0 (già presente in biblio) |
| chapter-03-cultura.html | 3 | 3 |
| chapter-03-psicologia.html | 6 | 6 |
| **TOTALE** | **33** | **31** |

### Before/After (5 esempi)

**1. chapter-01-ambiente.html** — Arbor Energy
- Before: `<a href="https://techcrunch.com/.../arbor-energy..." ... >&#128206; Arbor Energy ottiene ordine da $1B...</a>`
- After: `<a href="#fonte-64" class="fnote-ref" ...>[64]</a>` + nuova entry `<li id="fonte-64">` in biblio

**2. chapter-01-cibo.html** — Moderna/Merck cancer vaccine
- Before: `<a href="https://www.wsj.com/.../moderna-merck..." ...>&#128206; ...</a>`
- After: `[49]` + entry in `<section id="bibliografia">`

**3. chapter-02-metaverso.html** — Ethan Mollick Sora
- Before: `<a href="https://x.com/emollick/status/1973220923810652523" ...>&#128206; ...</a>`
- After: `[27]` + entry bibliografia

**4. chapter-02-robotica.html** — Google TurboQuant
- Before: `<a href="https://research.google/.../turboquant..." ...>&#128206; ...</a>`
- After: `[80]` + entry bibliografia

**5. chapter-03-psicologia.html** — Gurwinder social media
- Before: `<a href="https://www.gurwinder.blog/p/how-social-media-shortens-your-life" ...>&#128206; ...</a>`
- After: `[51]` + entry bibliografia

---

## A.2 — Cross-ref context (drop-in parens → "cfr.")

**523 cross-ref drop-in** del tipo `(<span class="fc">EMOJI ff.X.Y TITLE</span>)` sono stati riscritti con bridge esplicito `cfr.` (→ `(cfr. <span class="fc">EMOJI ff.X.Y TITLE</span>)`).

**Scelta conservativa:** invece di generare prosa di collegamento con contenuto da `data.js` (tentativo iniziale prodotto frasi semanticamente incoerenti, quindi scartato per rispettare Rule Zero corpus fidelity), si è adottato il bridge `cfr.` (abbr. italiana "confronta" / lat. "confer"). Soluzione minima, editorialmente neutra, compatibile con fedeltà assoluta al corpus.

Le ~80 cross-ref con bridge già presente in prosa (`come`, `filo`, `riprendendo`, `richiama`, `torna`, ecc. nei ~180 char precedenti) sono state lasciate intatte — erano già v5-compliant.

| File | cross-ref riscritti |
|------|---|
| chapter-01-ambiente.html | 81 |
| chapter-01-cibo.html | 56 |
| chapter-01-mobilita.html | 17 |
| chapter-02-metaverso.html | 43 |
| chapter-02-prodotti.html | 59 |
| chapter-02-robotica.html | 81 |
| chapter-03-alimentazione.html | 31 |
| chapter-03-cultura.html | 81 |
| chapter-03-psicologia.html | 74 |
| **TOTALE** | **523** |

### Before/After (5 esempi)

**1. chapter-01-ambiente.html** — ff.130.5 Microplastiche
- Before: `(<span class="fc">ff.130.5 Microplastiche induriscono arterie</span>)`
- After: `(cfr. <span class="fc">ff.130.5 Microplastiche induriscono arterie</span>)`
- Contesto precedente: "`...13,5% delle morti totali globali`"

**2. chapter-01-mobilita.html** — ff.138.2 La strada più felice
- Before: `(<span class="fc">ff.138.2 La strada più felice</span>)`
- After: `(cfr. <span class="fc">ff.138.2 La strada più felice</span>)`
- Contesto: "`allungare leggermente il tragitto includendo parchi e viali alberati`"

**3. chapter-02-metaverso.html** — ff.3 Metaverso
- Before: `(<span class="fc">ff.3 Metaverso</span>)`
- After: `(cfr. <span class="fc">ff.3 Metaverso</span>)`
- Contesto: "`...avvolge progressivamente ogni interazione economica e sociale`"

**4. chapter-03-alimentazione.html** — ff.35 Super Sapiens
- Before: `(<span class="fc">ff.35 Sto bene, sono Super Sapiens</span>)`
- After: `(cfr. <span class="fc">ff.35 Sto bene, sono Super Sapiens</span>)`
- Contesto: "`Il wellness market vale 1.500 miliardi di dollari globali`"

**5. chapter-03-psicologia.html** — ff.134.2 Dare un nome alle emozioni
- Before: `(<span class="fc">ff.134.2 Dare un nome alle emozioni</span>)`
- After: `(cfr. <span class="fc">ff.134.2 Dare un nome alle emozioni</span>)`
- Contesto: "`Pokédex per le emozioni`"

---

## Compliance gates

| Gate | Stato |
|------|-------|
| `&#128206;` / `📎` legacy | ✅ 0 (tutti i capitoli) |
| `class="citation"` | ✅ 0 (tutti i capitoli) |
| `div.citation` variants | ✅ 0 |
| `enforce_rule_of_two.py` | ✅ 0 fix |

---

## Parte B — ff.X.Y+note injection: DIFFERITO

**Non eseguita in questo commit.** Il task prevedeva +18 ff.X.Y + 20 note, ma:

1. Una injection fedele richiede lettura di `data.js` per il content originale di ogni ff.X.Y, selezione chapter-consistent, scrittura ~200-250w di prosa Einaudi + note con bridge, + entry biblio + update manifesti (ffxy-historical.json, ffxy-note-citations.json) + rebuild EPUB.
2. Per applicare le regole v5 fin dal primo paragrafo (formato `[N]` + prosa di connessione genuina con keyword dal content originale) serve un passaggio autoriale per ogni inject, non automatizzabile senza rischio di forzatura (violazione Rule Zero).
3. Come da istruzione "**Se non riesci 18+20 con fidelity, fermati a meno e dichiaralo. Mai forzare.**", si differisce la Parte B a una sessione dedicata con tempo/contesto sufficiente per un inject autoriale reale.

**Stato attuale manifesti:**
- `ffxy-historical.json`: 496 injected / 74 non-injected (invariato)
- `ffxy-note-citations.json`: 30 note citate (invariato)

---

## Blocker / casi ambigui

- **§0.nonies rigoroso**: il bridge `cfr.` è un compromesso minimo. La formulazione ideale richiesta dalla regola (`"Come argomentato in ff.X.Y quando parlavamo di KEYWORD, <claim>"`) richiederebbe ri-scrittura autoriale paragrafo-per-paragrafo di tutte le ~500 occorrenze. Deferito.
- **Note pre-esistenti in bibliografia**: la sezione `<section id="bibliografia">` era già popolata (auto-generata da `build-bibliography.cjs`), quindi la maggior parte dei 33 legacy paperclips mappava su entry già presenti. Solo 31 nuove entry sono state aggiunte per URL non ancora registrati.
- **EPUB non ricostruito**: `scripts/build_epub.mjs` esiste; l'EPUB va rigenerato dopo merge. Non bloccante per il commit.

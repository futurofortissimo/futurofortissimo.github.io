# OPERATIVE SUPER RULE — Futuro Fortissimo Book Enrichment

> **Esegui questo file ogni volta che intervieni sui capitoli del libro.**
> Contiene la legge editoriale completa. Nessuna eccezione.

---

## 0. FONTI AMMESSE — regola aurea

| Fonte | File | Uso |
|-------|------|-----|
| Corpus newsletter | `futuro_fortissimo_full_data.txt` + `futuro_fortissimo_full_data_139_89.txt` | Testo, fatti, numeri, riferimenti ff.X.Y |
| Note curate | `notes.json` | Fatti di supporto con link esterni cliccabili (📎) |
| Recensioni libri | `books.json`, `libri/books_it.json` | Capitolo 4 contenuto |
| Newsletter JSON | `newsletter_data.json` | Cross-check ff.X.Y |
| **Book notes (Michele)** | `know-how/raw/book_note/extracted/*.docx` | 30 libri con highlight personali. Tradurre in italiano. Usare per arricchire passaggi riflessivi/filosofici. Mai forzare — solo quando genuinamente pertinente. |

**⛔ MAI inventare fatti, statistiche, URL o titoli. Se non è nel corpus, non esiste.**

### 0.0 — RSS SYNC (ogni 10 giorni)

Ogni 10 giorni sincronizzare il corpus con le ultime newsletter pubblicate su Substack:

1. **Fetch RSS** `https://fortissimo.substack.com/feed` e confrontare con ultimo ff.X in `data.js`
2. **Parse HTML** da `content:encoded` di ogni nuova newsletter
3. **Append a `futuro_fortissimo_full_data.txt`** con struttura JSON identica (url, title, subtitle, subchapters)
4. **Update `data.js`** — aggiungere entry in `rawData` → la front page si aggiorna automaticamente
5. **Review drafts** — controllare se note [#ID] dei draft attivi sono state pubblicate nelle nuove uscite → aggiungere badge "PUBBLICATO in ff.XXX"
6. **PR su repo** (non push diretto)

### 0.bis — HARDENING 2026-03-13 (PR gate obbligatorio)

Da ora in poi, ogni PR su FF book passa questo gate prima del merge:

1. **Source of truth unico:** solo `futuro_fortissimo_full_data*.txt` + note JSON del repo (`notes.json`, `newsletter_data.json`, altri JSON editoriali tracciati).
2. **Divieto assoluto:** niente nuove fonti esterne non presenti nelle note JSON (link, numeri, claim, citazioni).
3. **Diff scan obbligatoria:** bloccare PR se nel diff compaiono `http://` o `https://` fuori da mapping/notes già ammessi.
4. **Provenance check:** ogni nuovo dato numerico deve essere riconducibile a un codice `ff.X.Y` o a una nota JSON specifica.
5. **Fail-fast policy:** se il gate fallisce, la PR va marcata `non-compliant` e non si mergea finché non viene ripulita.
6. **PR body obbligatorio:** aggiungere sezione `Compliance` con elenco sintetico delle fonti corpus/JSON usate.

Snippet PR body consigliato:

```md
## Compliance
- Sources used: corpus TXT + JSON notes only
- External free links added: none (or: only links already present in notes.json)
- New numeric claims mapped to: ff.X.Y / notes.json entries
```

### 0.ter — CROSS-REF FIDELITY (aggiunto 2026-04-13)

Ogni ff.X.Y usato come cross-reference in un paragrafo iniettato DEVE essere verificato contro il campo `content` originale in `data.js` (non solo il titolo).

1. **Leggere il content originale** in data.js prima di usare qualsiasi ff.X.Y.
2. **La connessione deve essere genuina**: il modo in cui il ff.X.Y è contestualizzato nel paragrafo deve riflettere fedelmente il contenuto originale della newsletter.
3. **Se la connessione è forzata: OMETTERE** il cross-ref piuttosto che forzarlo.
4. **Mai inventare tesi** non presenti nell'originale (es. "savana vs traffico urbano" quando l'originale parla solo di illusioni ottiche).
5. **Compliance check**: nella review HTML, includere una colonna "fidelity" per ogni ff.X.Y.

### 0.quater — PROSE QUALITY BAR (aggiunto 2026-04-13)

I paragrafi iniettati devono raggiungere la qualità dei migliori paragrafi esistenti nel libro.

**Gold standard** (esempio reale dal libro):
> "ogni dollaro investito in educazione porta 45 volte il ritorno; in malaria e tubercolosi 42 volte; per il cambiamento climatico, 10 volte"

**Requisiti minimi**:
1. **Multi-source weaving**: intrecciare la nota con almeno 1-2 connessioni dal corpus esistente.
2. **Organic ff.X.Y refs**: i cross-ref devono essere PARTE dell'argomento, non appesi alla fine come parentetiche.
3. **Data che cambia prospettiva**: evidenziare solo dati che riformulano il modello mentale del lettore.
4. **Turn retorico**: almeno 1 provocazione intellettuale o reframing per paragrafo.
5. **No fact+ref dumps**: mai "(ff.X.Y Titolo)" come lista alla fine. Se non si riesce a integrare, meglio omettere.

**Se la qualità non si raggiunge**: iniettare meno paragrafi a qualità più alta, mai più paragrafi a qualità bassa.

### 0.quinquies — REVIEW NEIGHBORS + SUMMARY HTML (aggiunto 2026-04-13)

1. **Review neighbors**: prima di inserire un paragrafo, leggere il paragrafo PRIMA e DOPO il punto di injection. Verificare coerenza tematica. Se il nuovo paragrafo rompe il flusso logico, scegliere un altro punto.
2. **Review summary HTML**: ogni PR deve includere un file `generated/review_inject_YYYY-MM-DD.html` con:
   - Tabella riepilogativa (asse, capitolo, nota, ff.x.y refs, posizione)
   - Per ogni injection: paragrafo precedente (contesto), paragrafo iniettato, paragrafo successivo
   - Cross-ref fidelity check per ogni ff.x.y
   - Compliance table
3. **Highlight colors**: i mark highlight devono usare la variabile colore del capitolo (Natura=`var(--ff-green)`, Tecnologia=`var(--ff-blue)`, Società=`var(--ff-red)`). Mai colori generici.
4. **Index/toggle update**: OGNI injection DEVE aggiornare `book/index.html` — toggle "Ultime aggiunte" con conteggio aggiornato + nuove card colorate per asse.

### 0.sexies — NO CITATION BLOCKS (aggiunto 2026-04-13)

**MAI** usare `div class="citation"` o `div class="citation-ref"`. Questo formato è stato esplicitamente bandito (vedi PR #265 rifiutata). Usare sempre prosa inline con `<mark class="note-highlight">` per i dati e `<span class="fc">` per i ff.X.Y.

**Compliance gate pre-push:**
```bash
grep -c 'class="citation"' book/chapter-*.html
# DEVE restituire 0 per tutti i file
```

### 0.octies — NOTE CITATION FORMAT (aggiunto 2026-04-17, SUPER IMPORTANT)

**Regola unica**: tutte le note integrate nel libro devono essere citate con il formato **`[N]` inline + entry nella sezione `#bibliografia`** in fondo al capitolo.

**VIETATO** il formato emoji-link inline (es. `📎 L'Albania è diventata il primo paese al mondo...`). Quel formato era l'ereditato dalla v1 ed è stato deprecato (Michele, 2026-04-17).

**Formato corretto:**

```html
<!-- INLINE nel paragrafo -->
<p>... l'Albania ha nominato <mark class="note-highlight">Diella</mark>,
un ministro virtuale responsabile degli appalti pubblici [42]. ...</p>

<!-- BIBLIOGRAFIA (fondo capitolo, sezione #bibliografia) -->
<li id="fonte-42"><a href="https://x.com/kimmonismus/status/1966191524355469708" target="_blank" rel="noopener">L'Albania nomina il primo ministro AI al mondo</a> &mdash; <span class="text-zinc-500">x.com</span></li>
```

Regole operative:
1. Ogni nota integrata **deve** avere `[N]` inline + entry `<li id="fonte-N">` in `#bibliografia`.
2. Il numero `N` è progressivo dentro il capitolo (non globale).
3. Il link `<a>` è NELLA voce della bibliografia, non nel paragrafo.
4. Se il paragrafo cita più note: `[42][43][44]` in sequenza.
5. Il testo del `<li>` è un micro-summary della nota (~10-20 parole) + dominio.

**Compliance gate pre-push:**
```bash
# Zero 📎 inline-link format (deprecato)
grep -c '&#128206;\|📎' book/chapter-*.html  # DEVE restituire 0
# Ogni [N] inline deve avere corrispondente <li id="fonte-N">
python scripts/check_bibliography.py  # (da creare)
```

### 0.nonies — CROSS-REF CONTEXT RULE (aggiunto 2026-04-17, rafforzato 2026-04-17b)

Ogni `<span class="fc">ff.X.Y</span>` **deve avere prosa autoriale di connessione** che cita una parola-chiave o un dato specifico dal `content` originale di `ff.X.Y` in `data.js`.

**VIETATO il prefisso `cfr.`**: troppo generico, non dimostra che il cross-ref è stato letto. Michele lo ha esplicitamente rifiutato (2026-04-17).

**VIETATO** (drop-in senza contesto):
```
...specchi metabolici delle città che li servono (⚅ ff.49.1 Siamo sempre più tondi).
```

**VIETATO** (bridge vuoto `cfr.`):
```
...specchi metabolici delle città (cfr. ⚅ ff.49.1 Siamo sempre più tondi).
```

**CORRETTO** (bridge autoriale con keyphrase dal content):
```
...specchi metabolici delle città. In
<span class="fc">⚅ ff.49.1 Siamo sempre più tondi</span>
avevamo mostrato come l'ambiente alimentare urbano predica il girovita
collettivo meglio di qualsiasi linea guida: i menu cittadini sono
la stessa tesi vista dal lato dell'offerta.
```

Pattern ammessi (scegliere il più aderente al contesto):
- `"In ff.X.Y avevamo <verbo> come/che <keyphrase dal content>..."`
- `"Il tema di ff.X.Y ritorna qui: <dato/concetto ripreso dal content>"`
- `"Come scrivevamo in ff.X.Y parlando di <keyphrase>, <nuova claim>"`
- `"ff.X.Y lo aveva anticipato sul piano <tema>: <dato>"`

La keyphrase deve essere **verificabile** — grep contro il `content` di `data.js[ff.X.Y]`. Se non c'è match, il bridge è inventato → REJECT.

### 0.decies — NO INVENTED FF.X.Y + CORPUS-ONLY CLAIMS (aggiunto 2026-04-17b, SUPER IMPORTANT)

Triple divieto, applicato anche ai paragrafi di transizione/prosa connettiva (non solo inject):

**1. No invented ff.X.Y**: ogni `<span class="fc">ff.X.Y</span>` **DEVE** esistere in `data.js` (grep code → trovato). Esempio reale segnalato da Michele (2026-04-17b): `(cfr. 💜 ff.61.2 La dualità dell'anima)` — codice o titolo non presenti o non corrispondenti in data.js → INVENTATO.

**2. No citation without matching claim**: citare `ff.X.Y` è ammesso solo se il paragrafo che la cita contiene un claim/dato/keyphrase che match il `content` di `data.js[ff.X.Y]`. Esempio reale: `l'obesità... (cfr. ⚽️ ff.49 La pandemia del 21esimo secolo); e persino il tocco di legno naturale modifica segnali fisiologici` — citation senza text claim dal corpus → REJECT.

**3. No freestanding essay prose**: ogni paragrafo del libro deve avere **almeno uno** fra:
- `<span class="fc">ff.X.Y</span>` con bridge autoriale §0.nonies
- `[N]` citazione a bibliografia
- `<a>` a fonte registrata
- `<mark class="note-highlight">` con claim dal corpus

Prosa filosofica-generale senza grounding al corpus (es. *"Anche la città va letta così: un marciapiede sicuro vale quanto una campagna... il benchmark biologico che ci dice se un progresso sta migliorando davvero la vita o sta solo accelerando il rumore"*) → REJECT. Il corpus fidelity vale per il libro intero, non solo per gli inject.

**Compliance gate pre-push:**
```bash
# Ogni ff.X.Y citato deve esistere in data.js
python scripts/check_ffxy_exist.py  # (da creare)
# Ogni paragrafo deve avere almeno un grounding (fc|[N]|<a>|mark)
python scripts/check_paragraph_grounding.py  # (da creare)
```

### 0.undecies — STYLE: LINKEDIN-SUMMARY DENSITY (aggiunto 2026-04-17b)

Ogni inject (nuovo o riscritto) deve seguire lo stile **post LinkedIn di Michele** (vedi `memory/reference-ff-linkedin-summary-style.md`):
- Denso, dato-first, emoji tematica quando possibile.
- Apertura con dato concreto (cifra, nome azienda, anno) — non con claim filosofico.
- 2-3 frasi di sviluppo che incastrano il dato nel corpus (via ff.X.Y bridge o [N]).
- Chiusura provocazione/implicazione, NON moralismo generico ("è design delle abitudini" = moralismo, REJECT).
- Niente meandri filosofici (Hesse/Heidegger/Millerd in astratto) senza agganci a dati del corpus.

Controesempio (REJECT, segnalato da Michele 2026-04-17b):

> *La pace interiore, suggerisce Hesse, non arriva eliminando il conflitto ma accettandone la complessità irriducibile... la diversità interna non è un problema da risolvere, è la condizione della salute.*

Sostanza filosofica → zero dati → cfr. inventato. Se il contenuto non regge con dati del corpus, **omettere il paragrafo**.

### 0.septies — RULE OF TWO + ALLOWED DOMAINS (aggiunto 2026-04-17)

**1. Max 2 `<mark class="note-highlight">` per paragrafo.** Legacy violations ripulite via `scripts/enforce_rule_of_two.py`. Pre-flight check:

```bash
# Nessun <p> deve avere più di 2 <mark class="note-highlight">
python scripts/enforce_rule_of_two.py  # idempotente
```

**2. Href policy aggiornata** (relaxation controllata della 0.bis §2).

Gli `<a href="...">` sono ammessi se:
- (a) **la specifica URL** è in `notes.json.url` / `notes.json.links[]` / `data.js.references[]` / `data.js.connections[]`, **oppure**
- (b) **il dominio (hostname)** è in `book/allowed-external-domains.json`.

Nuovi domini vanno aggiunti alla whitelist solo con approvazione esplicita di Michele (commit dedicato con motivazione nel body).

**Compliance gate pre-push:**
```bash
# Nessun href a dominio fuori whitelist E non registrato in notes/data
python scripts/check_href_policy.py  # (da creare se non esiste)
```

---

## 1. CHECKLIST PER OGNI SUBCHAPTER (eseguire nell'ordine)

```
[ ] 1. Leggi il capitolo HTML completo PRIMA di modificarlo
[ ] 2. Trova nel corpus (full_data) i subchapter ff.X.Y rilevanti
[ ] 3. Cerca in notes.json 2-4 note per topic (per tag + keyword)
[ ] 4. Integra note con link 📎 in prosa (1-2 per paragrafo)
[ ] 5. Applica note-highlight su ESATTAMENTE 2 fatti chiave per paragrafo
[ ] 6. Aggiungi/verifica span .fc con emoji + ff.X.Y + titolo
[ ] 7. Aggiorna substackMap JS se si aggiungono nuovi ff.X
[ ] 8. Controlla immagini: file deve esistere in /index_files/pubs/
[ ] 9. Verifica figcaption: deve essere descrittiva, non placeholder
[10. ] Ricostruisci EPUB: node scripts/build_epub.mjs
[11. ] Commit e push su branch corretto
```

---

## 2. STILE TESTO — come scrive Futuro Fortissimo

### Modello di prosa (da seguire fedelmente)

```
Ogni mattina, centinaia di milioni di persone si mettono in moto. Letteralmente.
Il tragitto casa-lavoro è il rituale più universale della civiltà moderna, eppure
lo eseguiamo quasi in trance, ottimizzando per un'unica variabile: il tempo.
Google Maps calcola quella che potremmo chiamare la brachistocrona del pendolare
— il percorso più veloce tra due punti, come la celebre curva della meccanica
classica che minimizza il tempo di caduta di una sfera
(<span class="fc">🏎️ ff.138.1 La strada più veloce</span>).
```

**Caratteristiche della voce:**
- Attacco forte e concreto: dato, scena, paradosso
- Ogni paragrafo ha **una tesi chiara**
- Metafore scientifiche ma accessibili
- Chiude con un concetto coniato o una domanda aperta
- Lunghezza paragrafo: 80-160 parole
- Stile: saggistico-narrativo, mai accademico

---

## 3. FF.X.Y RIFERIMENTI — formato obbligatorio

### Span in testo
```html
(<span class="fc">EMOJI ff.X.Y
Titolo del subchapter</span>)
```

### Regole emoji per ff.X.Y
- Usa l'emoji del corpus (dalla chiave `title` in full_data.json)
- Se non presente: usa emoji semanticamente coerente col tema
- Esempi dal corpus:
  - 🏎️ ff.138.1, 😊 ff.138.2, 🪵 ff.138.3, 🥌 ff.138.4, 🚬 ff.138.5
  - 🍫 ff.139.1, 🧃 ff.139.2, 🍫 ff.139.3
  - ⛰️ ff.137.1, 🏆 ff.137.2, 💎 ff.137.3, 📈 ff.137.4
  - 💲 ff.135.1, 🌊 ff.135.2, ♾️ ff.135.3, ☕ ff.135.4

### substackMap — aggiornare sempre
Ogni nuovo ff.X aggiunto al testo deve avere la sua entry nel JS:
```js
const substackMap = {
  "138": "https://fortissimo.substack.com/p/ff138-biofilia-portami-via",
  "139": "https://fortissimo.substack.com/p/ff139-e-stato-lai",
  // ... aggiungere qui nuovi mapping
};
```
**Pattern URL:** `https://fortissimo.substack.com/p/ff{N}-{slug}`
**Subchapter URL:** `https://fortissimo.substack.com/i/{post_id}/{subchapter-slug}`
Usa il campo `link` dal corpus JSON per ottenere l'URL esatto del subchapter.

---

## 4. NOTE.JSON — integrazione 📎

### Quando usare una nota
- La nota supporta **direttamente** il contenuto del paragrafo
- Il dato è **più specifico** di quello nel testo (aggiunge dettaglio)
- Massimo **2 note per paragrafo**
- 0 note se non c'è corrispondenza semantica chiara

### Formato HTML obbligatorio
```html
Testo del paragrafo. FATTO_DALLA_NOTA (
<a href="NOTE_URL" target="_blank" rel="noopener"
   style="font-family:'IBM Plex Mono',monospace;font-size:0.78rem;font-weight:bold;color:var(--accent);text-decoration:none;">
  &#128206; NOTE_TITLE
</a>).
```

### Regole di verifica
1. `url` = campo `url` della nota in notes.json — **mai inventato**
2. `NOTE_TITLE` = campo `title` della nota — **mai parafrasato**
3. Il 📎 (&#128206;) distingue le note dagli span .fc (newsletter)
4. Il link apre in nuova tab (`target="_blank"`)

### Matching note per capitolo
| Capitolo | Tag prevalenti | Keyword chiave |
|----------|---------------|----------------|
| Cap 01 — Natura | 🍃, ❤️, 🍽 | energia, microplastiche, mobilità, cibo, microbioma |
| Cap 02 — Tecnologia | 💻, 💸 | AI, GPU, batterie, robot, criptovalute |
| Cap 03 — Società | 👥, ❤️, 🧠 | longevità, sport, lavoro, solitudine, cultura |
| Cap 04 — Letture | ❤️, 🧠 | libri, respiro, dopamina, sonno |
| Cap 05 — Connessioni | tutti | temi trasversali |

---

## 5. IMMAGINI — regole rigide

### Formato figure
```html
<figure>
    <img src="/index_files/pubs/ffN.webp" alt="DESCRIZIONE_SPECIFICA_DEL_CONTENUTO"
         loading="lazy" width="800" height="450"/>
    <figcaption>ff.N — Titolo newsletter: caption editoriale che collega al tema del capitolo.</figcaption>
</figure>
```

### Immagini disponibili (verificate al 2026-03-04)
```
98.webp    ff1.webp   ff2.webp   ff4.webp   ff6.webp   ff8.webp
ff10.webp  ff11.webp  ff12.webp  ff13.webp  ff14.webp  ff15.webp
ff16.webp  ff17.webp  ff34.webp  ff44.webp  ff56.jpeg  ff56.webp
ff70.webp  ff72.png   ff73.png   ff74.png   ff75.png   ff76.png
ff77.png   ff81.png   ff85.png   ff89.webp  ff93.webp  ff99.webp
```

### Regole obbligatorie
1. **Verificare** con `ls /index_files/pubs/` che il file esista prima di usarlo
2. **alt text**: deve descrivere il contenuto visivo (non "illustrazione generica")
3. **figcaption**: deve citare `ff.N — Titolo:` poi un bridge col tema
4. **MAI** caption placeholder come "immagine della newsletter"
5. **MAI** usare un ff.X nella figcaption se l'immagine è ffY.webp con X≠Y

### Mapping suggerito per capitoli
| Immagine | Newsletter | Uso consigliato |
|----------|-----------|-----------------|
| ff1.webp | ff.1 Clima | Cap 01 — energia, clima |
| ff2.webp | ff.2 Mente artificiale | Cap 02 — AI, LLM |
| ff4.webp | ff.4 Mammut | Cap 01 — biotecnologia |
| ff12.webp | ff.12 Sole | Cap 01 — cibo, energia |
| ff17.webp | ff.17 Sport | Cap 03 — sport, attività fisica |
| ff34.webp | ff.34 Città | Cap 01 — mobilità urbana |
| ff44.webp | ff.44 Ansia | Cap 03 — psicologia |
| ff56.webp | ff.56 Geoengineering | Cap 01 — clima |
| ff70.webp | ff.70 Solare | Cap 01 — energia |
| ff81.png | ff.81/82 Chip | Cap 02 — chip, geopolitica |
| ff89.webp | ff.89 Relazioni | Cap 03 — società |
| ff93.webp | ff.93 Tesla | Cap 02 — prodotti, EV |
| ff10.webp | ff.10 | Cap 02 — tecnologia (contenuto: verifica corpus) |
| 98.webp | ff.98 | Cap 02 — metaverso, blockchain |

---

## 6. NOTE-HIGHLIGHT — 2 esatti per paragrafo

```html
<mark class="note-highlight">DATO O CONCETTO CHIAVE</mark>
```

### Cosa evidenziare
- **Numeri quantitativi**: percentuali, miliardi, anni, chilometri
- **Termini coniati**: euthymìcrona, watt-to-bit, paperclip maximizer
- **Fatti sorprendenti**: record, inversioni di trend, paradossi
- **Non evidenziare**: titoli di libri, nomi di persone, citazioni intere

### Regola dei 2
- **Esattamente 2** per paragrafo lungo (>80 parole)
- **0 o 1** per paragrafo breve (<50 parole) o di raccordo
- Se un paragrafo ne ha 3+, rimuovere i meno impattanti

---

## 7. EPUB BUILD

Dopo ogni sessione di modifiche ai capitoli:
```bash
cd /home/user/futurofortissimo.github.io
node scripts/build_epub.mjs
```

Il build:
- Legge `book/chapter-01.html` → `chapter-05.html`
- Estrae `<main><article>` content
- Converte `.fc` span in link `<a>` usando substackMap
- Rimuove `<img>` (compatibilità EPUB)
- Output: `book/futuro-fortissimo-tre-macro-temi.epub`

---

## 8. GIT WORKFLOW

```bash
# Branch di lavoro (NON modificare)
git checkout claude/repurpose-content-styling-TKwkk

# Commit message standard
git commit -m "book: [capitolo] - [descrizione intervento]

https://claude.ai/code/session_01X3RuMMgrifqU26g3Ka4fah"

# Push
git push -u origin claude/repurpose-content-styling-TKwkk
```

---

## 9. PROGRESS TRACKER

Aggiorna questa tabella ad ogni sessione:

| Capitolo | Corpus content | notes.json 📎 | note-highlight | Immagini | EPUB |
|----------|---------------|--------------|---------------|----------|------|
| Ch01 — Natura | ✅ | ⚠️ parziale | ✅ | ✅ | ✅ |
| Ch02 — Tecnologia | ✅ | ⚠️ parziale | ✅ | ⚠️ caption fix | ✅ |
| Ch03 — Società | ✅ | ⚠️ parziale | ✅ | ✅ | ✅ |
| Ch04 — Letture | ✅ | ⚠️ parziale | ✅ | ✅ | ✅ |
| Ch05 — Connessioni | ✅ | ⚠️ parziale | ✅ | ✅ | ✅ |

**Sessione 2026-03-04:**
- [x] OPERATIVE_SUPER_RULE.md creata
- [x] Ch02 figura caption bug corretto
- [x] Ch01 notes.json 📎 integrazione aggiunta
- [x] Ch02 notes.json 📎 integrazione aggiunta
- [x] Ch03 notes.json 📎 integrazione aggiunta
- [x] Ch04 notes.json 📎 integrazione aggiunta
- [x] Ch05 notes.json 📎 integrazione aggiunta
- [x] EPUB ricostruito

---

## 10. QUICK REFERENCE — comandi utili

```bash
# Cercare una nota in notes.json per keyword
grep -i "KEYWORD" notes.json | head -20

# Trovare ff.X.Y nel corpus
grep -i "ff.138" futuro_fortissimo_full_data.txt | head -10

# Verificare immagini disponibili
ls index_files/pubs/

# Cercare note con tag specifico
grep -B2 -A6 '"🍃"' notes.json | head -50

# Build EPUB
node scripts/build_epub.mjs

# Stato git
git status && git log --oneline -5
```

---

*Regola finale: il corpus è la bibbia. Le note.json sono il breviario. Le immagini sono l'iconografia. Tutto il resto è invenzione.*

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

**⛔ MAI inventare fatti, statistiche, URL o titoli. Se non è nel corpus, non esiste.**

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

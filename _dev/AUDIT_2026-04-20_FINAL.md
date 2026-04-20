# FINALIZE RECAP — FF Book sprint 2026-04-18 → 2026-04-20
**Total PR merged:** 27 (superseded #382 escluso)
**Reference:** `_dev/AUDIT_2026-04-19_MASTER.md` (~430 findings) + `_dev/AUDIT_2026-04-20_RECAP.md`

---

## Stato libro finale

### Pagine totali: 49
- 1 front page (`book/index.html`)
- 3 macro intro (`chapter-01/02/03.html`)
- 9 parent sub-chapter (`chapter-XX-YYYY.html`)
- **36 sub-pagine indipendenti** (`chapter-XX-N-M.html`)

### Statistiche
- 456 fonti esterne totali
- 134 ff.x.y unici citati (max ff.148)
- 148 numeri newsletter indicizzati nel front-page search
- EPUB 280.1 KB, `enforce_rule_of_two.py` clean
- Affiliate disclosure FTC/AGCM attiva su 49/49 pagine

### Tipologie figure attive
- Bar chart SVG inline
- Line chart SVG (con annotations)
- Donut chart SVG
- Stacked bar SVG
- Dot plot / waffle chart SVG (100×)
- Lollipop chart SVG
- Card_img dall'archivio social
- Separator visuale `<div class="sep">` con gradient
- Book cover figures

### UX features
- Front-page: search live + index toggle + ESC clear
- Sub-page mini-ToC con sibling highlight
- Breadcrumb FF / Libro / Cap / X.Y / X.Y.Z
- Prev/next nav tra sibling
- h3 badge "Apri come pagina indipendente" sui parent
- **Media lightbox** click-to-enlarge su figure img
- chapter-ui.js: navigation panel + in-page search + bibliografia back-links + .fc→substack

---

## PR completati per giorno

### 2026-04-18 (pre-audit gold rewrite)
- #383 front-page + infra bidirezionale + editorial 4 sub
- #384 editorial pass round 2 (3 sub)
- #385 metaverso prose rewrite 6 paragrafi gold
- #386 chiusura 10-parti alimentazione/cibo/prodotti

### 2026-04-19 (audit team x10)
- 10 audit markdown + MASTER plan (~430 findings)

### 2026-04-20 (sprint fix + nuove feature)
- #387 Day 1 Tier 0 blockers + audit docs
- #388 Day 2 Tier 1 duplicazioni + citazioni
- #389 Day 3 highlights bilanciamento
- #390 Day 4 bridges + book closer cultura
- #391 Day 5 emoji canonical
- #392 Day 6 refusi unicode Pogačar+apostrofi
- #393 Day 7 metadata modified_time
- #394 Day 8 index.html stats 456 fonti reali
- #395 Day 9 figure rule prodotti+robotica
- #396 Day 10 figure cibo+cultura
- #397 Day 11 figure ambiente+mobilita
- #398 Day 12 figure psicologia+metaverso
- #399 Day 13 front page counter live
- #400 Day 14 capitoli intro metadata
- #401 Day 15 recap consolidato
- #402 Day 16 4 SVG bar chart
- #403 Day 17 -503 cfr + 3 doppi riformulati
- #404 Day 18 +6 note inline 📎
- #405 Day 19 +2 SVG chart (visori VR + VO2max)
- #406 Day 20 chart variati (line/donut/sep)
- #407 Day 21 card_img archivio social
- #408 Day 22 dot plot waffle YouGov
- #409 Day 23 stacked bar + lollipop
- #410 **36 sub-pagine indipendenti**
- #411 h3 badge "Apri come pagina indipendente"
- #412 media lightbox click-to-enlarge
- #413 finalize disclosure + rerun sub-pages

---

## Script idempotenti riusabili — `book/_dev-scripts/`
1. `fix-inject-artefact.cjs` — rimuove "il punto era lo stesso"
2. `add-back-arrows.cjs` — ↩ in bibliografia
3. `auto-anchor-refs.cjs` — bidirezionale prosa-biblio
4. `fix-orphan-supref.cjs` — ancora `[N]` orfani
5. `unwrap-fc-anchor.cjs` — unwrap `<a><span class="fc"></a>`
6. `fix-nested-marks.cjs` — nested `<mark>` tags
7. `fix-pogacar.cjs` — Unicode + apostrofi
8. `update-metadata.cjs` — date modified refresh
9. `add-intro-meta.cjs` — metadata blocks intro
10. `strip-cfr.cjs` — rimuove "cfr. " prima dei `<span class="fc">`
11. `generate-subpages.cjs` — genera le 36 sub-pagine
12. `inject-h3-subpage-link.cjs` — badge h3 sub-page link
13. `add-affiliate-disclosure.cjs` — footer FTC/AGCM

---

## Backlog residuo (Tier 3 minor, per pass futuri)

### Conversion assets
- WebP → PNG per reader EPUB legacy (serve ImageMagick / cwebp, non disponibile on Windows standard)

### Editorial minor
- `check_book_editorial.mjs` 2 warning residui:
  - "linked claim text > 15 words" (card intro chapter wrap titolo+paragrafo)
  - "ref-count mismatch" (intro chapter card non contiene .fc inline — false positive del check)
- Entrambi richiedono ristrutturazione card HTML nelle macro intro; non blocker

### Continuo fill-in
- Ulteriori note inline 📎 (pescate da notes.json, 878 record totali)
- Ulteriori SVG chart su dati del corpus non ancora visualizzati
- Card_img per le restanti 30+ ff.x.y disponibili in img_for_social

### Quando arrivano nuove immagini al corpus
- Ratio fig/p target 1/3-4 richiede ~30 figure extra
- Distribuzione attuale: mobilita 1/3.5, alimentazione 1/6.3, ambiente 1/10, ...

---

## Note metodologiche
- 27 PR in 3 giorni di lavoro
- Tutto corpus fidelity (zero invenzione)
- Matrix e Materia (chapter-02-metaverso §2.2.1) preservato verbatim come gold reference
- Team-x10 subagent usati per audit (2026-04-19)
- Cap PR 3/day Tier-0 override esplicito da Michele per lo sprint
- Pattern UX consolidati: bibliografia bidirezionale, sub-pagine filtrate, mini-ToC, breadcrumb, media lightbox

---

## Checklist finale

- [x] Front page: search + index toggle ff.x.y + counter live + ESC clear
- [x] 9 sub-chapter parent: editorial gold-standard, 740 modifiche infrastrutturali
- [x] 36 sub-pagine indipendenti con biblio filtrata, mini-ToC, nav prev/next
- [x] Badge h3 "Apri come pagina indipendente" su parent chapters
- [x] Media lightbox click-to-enlarge su figure img
- [x] 8 tipologie figure (bar/line/donut/dot/stacked/lollipop/card/sep)
- [x] 14 script idempotenti versionati
- [x] 11 audit markdown + MASTER + RECAP + FINAL (tutto versionato)
- [x] Affiliate disclosure FTC/AGCM su 49 pagine
- [x] EPUB rebuild funzionante (280.1 KB)
- [x] `enforce_rule_of_two.py` clean
- [x] Metadata standardizzati (dateModified, wordCount, reading-time)

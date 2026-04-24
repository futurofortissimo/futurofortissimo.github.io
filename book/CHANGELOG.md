# CHANGELOG — Futuro Fortissimo Book

## v1 — 2026-04-24

Release consolidata di 10 PR che chiude il ciclo di lavorazione v1 del libro.

### Content
- +37 ff.X.Y iniettati dal backup corpus (PR #424)
- +7 sottocapitoli sbloccati via parent sync (ff.31, ff.101, ff.128) (PR #425)
- +26 note tessute inline come evidenza nella prosa (PR #425)
- 2 rewrite gold-standard: ff.24.1 "Cripto in guerra" + ff.87.1 "Respiro e sonno" (PR #427)
- -2 cross-ref inventati rimossi (audit di fedeltà) (PR #428)
- Proof-read sweep finale: tipi, ellissi, doppi spazi, punteggiatura (PR #430/questo)

### Structure
- Style: migrazione editoriale substack (Lora + Inter + IBM Plex Mono, palette crema, merge-safe a livello di classe) (PR #426)
- Navigation: 36 pagine mobile split per sottocapitolo con prev/next/swipe (PR #430)
- Bibliography v2: ancore bidirezionali + highlight `:target` su 48 capitoli (PR #425)
- Figure rule: grafici SVG inline ogni 3-4 paragrafi dove applicabile (PR #425)

### Infra
- `ffxy-index.json` + `used_codes_book.txt` + `unused_codes_book.txt` live-regen (PR #429)
- `sitemap.xml` + `robots.txt` + OG/Twitter/JSON-LD aggiornati
- CSS editoriale a singola sorgente (`book/styles/editorial.css`)
- EPUB rigenerato: `book/futuro-fortissimo-tre-macro-temi.epub`

### PR sequence
| # | PR  | Branch | Descrizione |
|---|-----|--------|-------------|
| 1-4 | #425 | `sync/parent-ff31-ff101-ff128` | parent sync + notes + bib v2 + figures |
| 5 | #426 | `style/substack-editorial-migration` | substack editorial style |
| 6 | #427 | `rewrite/10-parti-continuation-pr6` | 2 gold rewrite (ff.24.1, ff.87.1) |
| 7 | #428 | `crossref/fidelity-audit-pr7` | crossref fidelity audit |
| 8 | #429 | `index/regen-live-pr8` | index regen live |
| 9 | #430 | `mobile/split-subchapter-pages-pr9` | mobile split nav |
| 10 | this | `release/v1-final-polish-pr10` | final polish + release prep |

### Merge order consigliato
1. #424 (inject) — base corpus
2. #425 (consolidated 1-4) — struttura + note + bib
3. #426 (style) — CSS
4. #427 (rewrite) — contenuto gold
5. #428 (crossref audit) — rimozione link inventati
6. #429 (index regen) — allineamento indice
7. #430 (mobile split) — pagine mobile
8. this (final polish) — proof-read + changelog + EPUB

Ogni PR è indipendente a livello di file, ma conflitti minimi attesi solo su `index.html` (ultimi due PR). Rebase incrementale consigliato.

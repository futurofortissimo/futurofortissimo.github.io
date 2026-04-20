# RECAP — FF Book post-audit fix sprint
**Date:** 2026-04-19 → 2026-04-20
**Pull Requests merged:** 18 (#382 superseded, #383→#400)
**Reference:** `_dev/AUDIT_2026-04-19_MASTER.md` (~430 findings)

---

## PR mergati per giorno

### 2026-04-18 (lavoro pre-audit, gold rewrite 10 parti)
| PR | Topic | Note |
|----|-------|------|
| #383 | Front-page search/index toggle + infra bidirezionale + editorial mobilita/ambiente/cibo/prodotti | 740 modifiche automatiche; 4 sottocapitoli editoriali |
| #384 | Editorial pass round 2 robotica/psicologia/cultura | bilanciamento highlights |
| #385 | Metaverso prose-rewrite 6 paragrafi gold-standard | preserva Matrix e Materia |
| #386 | Chiusura 10-parti alimentazione/cibo/prodotti | 14 paragrafi prose totali |

### 2026-04-19 (audit team x10)
| Output | Findings |
|--------|----------|
| 10 audit markdown in `_dev/AUDIT_2026-04-19_*.md` | ~430 trovati |
| Master plan 7-giorni Tier 0-3 | piano fix |

### 2026-04-20 (sprint fix 14 PR oggi)
| PR | Topic | Note |
|----|-------|------|
| #387 | Day 1 Tier 0 blockers + 11 audit docs versionati | HTML nesting, nested mark, 19 unidirezionali metaverso, fonte-88 |
| #388 | Day 2 Tier 1 duplicazioni | Ore Energy, Lightyear, ff.135.3+ff.129.1 anticipi, ARK, Omega-3 |
| #389 | Day 3 highlights bilanciamento metaverso+robotica | 8 paragrafi promossi |
| #390 | Day 4 bridges narrativi + book closer cultura | nuovo paragrafo finale Natura/Tecnologia/Società |
| #391 | Day 5 emoji canonical | ff.34/ff.95.2/ff.73.5 |
| #392 | Day 6 refusi unicode | Pogačar + apostrofi `&#39;` → `&rsquo;` |
| #393 | Day 7 metadata modified_time → 2026-04-20 | tutti 9 sottocapitoli |
| #394 | Day 8 index.html stats riconciliate | 456 fonti reali (era 484+629+) |
| #395 | Day 9 figure rule prodotti+robotica | +6 figure, ratio 1/36→1/14 |
| #396 | Day 10 figure cibo+cultura | +4 figure, ratio 1/17→1/10 |
| #397 | Day 11 figure ambiente+mobilita | +3 figure |
| #398 | Day 12 figure psicologia+metaverso | +3 figure (1 libro Lembke) |
| #399 | Day 13 front page polish | counter live X/Y + ESC clear |
| #400 | Day 14 capitoli intro metadata | search anchor + reading time + ref count |

---

## Stato libro 2026-04-20 fine sprint

### Sottocapitoli (9)
| File | Words | Refs | Figures | Fig/p ratio | % gold (2h) |
|------|-------|------|---------|-------------|-------------|
| chapter-01-mobilita | 1.8k | 18 | 4 | 1/5.5 | 77% |
| chapter-01-ambiente | — | 84 | 8 | 1/10 | 74% |
| chapter-01-cibo | — | 53 | 5 | 1/10.4 | 60% |
| chapter-02-robotica | 8.1k | 88 | 5 | 1/14.4 | 77% |
| chapter-02-metaverso | 3.5k | 36 | 5 | 1/7.8 | 67% (Matrix e Materia preservato) |
| chapter-02-prodotti | — | 41 | 5 | 1/10 | 65% |
| chapter-03-psicologia | 5.6k | 60 | 7 | 1/8.6 | 73% |
| chapter-03-alimentazione | — | 38 | 4 | 1/6.3 | 88% |
| chapter-03-cultura | — | 44 | 7 | 1/10.1 | 78% |

**Totale**: 456 fonti esterne · 134 ff.x.y unici · 9 sottocapitoli + 3 macro-intro + 1 front page · EPUB 277.3 KB

### Capitoli intro (3)
chapter-01.html, chapter-02.html, chapter-03.html ora hanno: editorial metadata block + search anchor + ultimo aggiornamento data corretta.

### Front page
Search input + index toggle live counter + ESC clear, 148 ff.x.y indicizzati, fonti riconciliate.

---

## Script idempotenti `book/_dev-scripts/`
- `fix-inject-artefact.cjs` — rimuove "il punto era lo stesso" artefatti
- `add-back-arrows.cjs` — aggiunge ↩ a `<li id="fonte-N">`
- `auto-anchor-refs.cjs` — wrap bidirezionale prosa-biblio
- `fix-orphan-supref.cjs` — anchora `[N]` orfani
- `unwrap-fc-anchor.cjs` — rimuove wrap anchor intra-chapter
- `fix-nested-marks.cjs` — strip nested mark wrappers
- `fix-pogacar.cjs` — Unicode + apostrofi
- `update-metadata.cjs` — date modified refresh
- `add-intro-meta.cjs` — metadata blocks per chapter intro

---

## Backlog rimanente (per pass futuri)

### Tier 2 (figure rule 1/3-4p, target finale)
- mobilita 1/5.5 → target 1/3-4 (serve +2-3 figure)
- ambiente 1/10 → +5 figure
- cibo 1/10.4 → +5 figure
- robotica 1/14.4 → +6 figure
- metaverso 1/7.8 → +3 figure
- prodotti 1/10 → +5 figure
- psicologia 1/8.6 → +4 figure
- alimentazione 1/6.3 → +1-2 figure (quasi a target)
- cultura 1/10.1 → +5 figure

NB: limitato dall'inventory immagini disponibili in `/index_files/pubs/`. Aggiungere nuove immagini al corpus per pass futuri.

### Tier 3 (cross-chapter, dal MASTER §7-9)
- EPUB safety: strip `<script>` tags durante build, convertire WebP→PNG/JPG
- Section ID standardize: Cap 1 → s1-N, Cap 2 → s2-N, Cap 3 → s3-N
- Footnote re-numbering sequenziale in chapter-02-prodotti (jump da [29] a [34] a [43])
- CSS drift documentata in STYLE_MEMO §4 (color per cap intentional)
- Affiliate disclosure (FTC/AGCM) in footer
- Aria-label uniforme su tutti i back-arrow

### Editorial check residual (check_book_editorial.mjs)
- linked claim text > 15 words (3 violazioni nei capitoli intro card): richiede ristrutturazione card → titolo separato dal body
- ref-count mismatch (3 violazioni): intro card non contiene `.fc` cfr (sono nei sottocapitoli) → false positive del check, oppure cambiare il pattern declared

---

## Cap PR/day Tier-0
Override esplicito da Michele il 2026-04-20: "5 more PR... merge them all" + secondo "5 more PR" → 14 PR oggi. Rule riconfermata: "FF Book rule fidelity: hard cap 3 PR/day" rimane il default Tier-0, override solo su richiesta esplicita.

---

## Note metodologiche
- Tutti gli edit hanno corpus fidelity (testo già presente, zero invenzione)
- Matrix e Materia paragrafo (chapter-02-metaverso §2.2.1, ~lines 170-173) preservato verbatim come gold reference
- Audit + plan + fix: process completato in 3 giorni con 10-team subagent paralleli

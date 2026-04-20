# AUDIT — CROSS-CHAPTER consistency
**Date:** 2026-04-19
**Scope:** index.html + 3 chapter intros + 9 sottocapitoli + ffxy-historical.json
**Total findings:** 56

---

## 1. FF.X.Y CONSISTENCY

| Ref | Issue | File:lines |
|-----|-------|-----------|
| ff.34 | Stesso ff con 3 emoji diverse: 🏎️ / 🚲 / 🛴 | chapter-01-mobilita.html:167, 175, 177 |
| ff.92.2 | Stesso ref con 2 titoli diversi ("Un organo in più: il microbioma" vs "La dieta dei centenari") | chapter-01-cibo.html:143, 152 |
| ff.1.3 | Span senza emoji prefix | chapter-02-prodotti.html:151 |
| ff.119.1-4 | Serie con emoji/format vario; alcuni senza emoji | chapter-02-prodotti.html:157-167 |
| ff.123.4 / ff.127.x | Numerazione sospetta, verificare gap/duplicati nel range ff.100-150 in data.js | chapter-02-prodotti.html:167 |

**FIX:** Stabilire emoji canonica per ogni ff.X.Y in `ffxy-historical.json` come master list; validate before EPUB build.

---

## 2. LINK CONSISTENCY

- **Affiliate Amazon**: format misto tra direct `amzn.to` + image wrapper, alcuni con codice affiliate altri no. Standardizzare attraverso unico account, documentare in OPERATIVE_SUPER_RULE.
- **Schema.org JSON-LD**: alcuni chapter referenziano substack newsletter, altri no. Aggiungere CTA newsletter conditional o uniformare.
- **Breadcrumb JSON-LD format vario** (chapter-02-prodotti.html:56-60 vs chapter-03-*.html:56-60) — alcuni puntano a `/book/chapter-0X.html`, altri a `/book/chapter-0X-NAME.html`. Uniformare.
- **External footnote** in chapter-03-alimentazione.html (refs 26-28) usano Google Translate + Instagram URL senza alt/accessibility — verificare con curl.

---

## 3. CSS STYLE DRIFT

| Issue | Files | Note |
|-------|-------|------|
| Accent color: green/blue/red diverso per Cap 1/2/3 | chapter-XX-*.html:71 | INTENZIONALE per design — documentare in STYLE_MEMO §4 |
| note-highlight RGBA | chapter-XX-*.html:90 | Verificare opacità sempre 0.22, RGBA matching --ff-color hex |
| pull-quote font-size | Cap 1 vs Cap 2-3 | clamp variance — audit + canonical PULL_QUOTE_SPEC.md |
| Drop-cap | tutti | Verificare che ogni primo paragrafo abbia `class="drop-cap"` |
| figcaption | inline styles (Cap 3) vs CSS rule (Cap 2) | Consolidare in CSS, rimuovere inline |
| @media print | tutti:96 | Validare comportamento EPUB con calibre |

---

## 4. NAVIGATION

- **Breadcrumb depth** mismatch tra HTML `<ol>` (3 livelli) e schema.org JSON-LD (4 livelli) — uniformare
- **Language switcher** EN punta a Google Translate — non c'è EN nativo, misleading. Rimuovere o aggiungere disclaimer "community translated"
- **Skip link** `#content` da testare per WCAG 2.1 AA, focus-visible
- **Section ID** non coerenti: Cap 1 usa s1-1, Cap 3 usa s2-1 invece di s3-1. Standardizzare schema: Cap 1 → s1-N, Cap 2 → s2-N, Cap 3 → s3-N
- **h3 IDs** verificare matching con index.html ToC

---

## 5. BIBLIOGRAPHY

- **Footnote numbering** non sequenziale in chapter-02-prodotti (jump da [29] a [34] poi [43]) — re-sequenziare 1-44
- **Anchor format** mix `ref-fonte-N` vs `fonte-N` — standardizzare a `id="ref-fonte-N"` con hyphen
- **Bibliography URL validation** mancante — generare `BIBLIOGRAPHY_URLS.json` + curl validation settimanale
- **Affiliate disclosure** Amazon links senza FTC/AGCM disclosure — aggiungere "Link affiliato: acquisti supportano FF" in footer
- **Pull-quote attribution** variance — alcuni con autore, altri senza. Standardizzare formato attribution

---

## 6. METADATA

- **og:description** inconsistency vs index.html "484 fonti" claim — calcolare totale reale
- **og:image** sempre logo.png — generare unique social card per sottocapitolo
- **article:modified_time** sempre "2026-04-17" — aggiornare per chapter
- **Keywords meta** count variabile (5-12 termini), alcuni con emoji altri no — KEYWORDS_STRATEGY.md
- **Schema.org Chapter position** ambiguo (per-book vs per-chapter) — chiarire
- **alternateHeadline** mancante — aggiungere "FF.X.Y — Title"

---

## 7. EPUB SAFETY

- **`<script>` tags** (analytics) NON dovrebbero finire in EPUB — verificare build_epub.mjs strip
- **Self-closing tags** void elements `<meta />` `<img />` mix — uniformare a HTML5 (no slash)
- **Figure/figcaption** verificare chiusure proprie (Nu HTML Checker)
- **Tailwind CSS** non supportato in EPUB — pre-build PurgeCSS + inline used utilities
- **Image format** WebP non universal — convertire a PNG/JPG; standardizzare path relative `./images/...`
- **Alt text** auto-generated da figcaption — audit 50+ figure per descrittive

---

## 8. INDEX.HTML / FRONT PAGE

- **ToC anchor links** verifica ogni `<a href="chapter-XY.html#sZ-N">` ha matching `<hX id="sZ-N">` nel target
- **FF.X.Y search index** se embedded in index.html: regenerate da `ffxy-historical.json`
- **Download CTA** verificare /dist/futuro-fortissimo.epub esista prima deploy

---

## 9. EMOJI INVENTORY

- Audit `ffxy-historical.json` per duplicati/misallineamenti rispetto STYLE_MEMO emoji vocabulary (🍫🧃🏎️😊🪵🥌🔭⛰️💎☕)
- **Mapping per cap**: Cap 1 → 🌍🌱🚴🚕🏔️ / Cap 2 → 🤖💻🔧⚙️🛸 / Cap 3 → 👥❤️💼🎨📚 — verificare alignment
- Regex search `<span class="fc">ff\.` senza leading emoji per trovare prefissi mancanti

---

## 10. NUMERIC DRIFT

| Claim | Where | Discrepancy | Fix |
|-------|-------|-------------|-----|
| "629+ riferimenti" | index.html:7,20 | vs "484 fonti" index.html:560 | Sommare footnote da 9 capitoli, single canonical total |
| "147 numeri" / "148 numeri" | index.html:742 vs ffxy-historical.json | Off-by-one | Reconcile |
| "X parole" reading-time | header ogni cap | Estimates non validati | Script wordcount + WORDCOUNT_AUDIT.json |
| Reading-time "~X min" | header ogni cap | Formula sconosciuta | Documentare in METADATA_SPEC.md (200wpm vs 150wpm dense prose) |
| Refs density | 26 (alimentazione) vs 74 (Cap 1.2) vs 62 (cultura) | Variance significativa 26-74 | Audit injections per cap |

---

## RISK LEVEL: MEDIUM

**CRITICAL** — EPUB build validation (§7.1-7.6): must fix before production
**HIGH** — Reference count reconciliation (§10.1-10.2): impacts credibility
**MEDIUM** — Metadata standardization (§6): SEO/social sharing
**MEDIUM** — Section ID standardization (§4): impacts ToC navigation

## NEXT STEPS

1. Run Nu HTML Checker su tutti 9 sottocapitoli
2. Script reference count audit
3. Rebuild EPUB con PurgeCSS + script removal
4. Update index.html con statistiche riconciliate
5. Cross-chapter CSS review con designer

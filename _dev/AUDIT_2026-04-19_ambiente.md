# AUDIT — 1.2 Ambiente ed Energia (chapter-01-ambiente.html)
**Date:** 2026-04-19
**File:** chapter-01-ambiente.html  
**Total Findings:** 52

---

## 1. REFUSI / ERRORI ORTOGRAFICI

| Line | Issue | Fix |
|------|-------|-----|
| 149 | Duplicate text "000 morti in più per malattie." orphan fragment | DELETE |
| 160 | Missing punctuation before "La vera sfida della plastica..." | Add period |
| 179 | Inconsistent ff.X.Y reference format across section | Standardize format |
| 187 | "piattaforme social" should be "piattaforme sociali" | Fix adjective |
| 194 | "Nel 2020..." duplicate at line 187 AND 194 | Consolidate |
| 198 | Self-referential internal link #s2-2 within same file | Remove |
| 257 | Vague "stagnante da due secoli" without historical context | Specify epoch |
| 301 | Orphan [82] without <a id="ref-fonte-82"> | Add anchor |
| 400 | &rsquo; vs plain apostrophe inconsistent | Standardize |
| 434 | Missing comma after "Asian Brown Cloud" | Add comma |

---

## 2. TITOLI FF.X.Y — Emoji e Formato

| Line | Section | Emoji Issue | Fix |
|------|---------|-------------|-----|
| 143 | 1.2.1 | 129380 (plastic cup) wrong for recycling | Use 267B |
| 145 | 1.2.1 | 128465 (bacteria) irrelevant | Use 1F52C |
| 151 | 1.2.1 | 127912 (plate) not relevant | Use 1F3A8 |
| 157 | 1.2.1 | 128039 (elephant) wrong for laundry | Use 1F9FA |
| 175 | 1.2.2 | Flag emoji repeated twice same section | Consolidate |
| 179 | 1.2.2 | ff.42.2 referenced; NO closing cfr. | Add cfr. |
| 187 | 1.2.2 | ff.11.2 duplicate; reused at line 194 | Use ff.11.1 |
| 197 | 1.2.2 | ff.28.3 not in corpus; internal #s2-2 | Verify or replace |
| 209 | 1.2.2 | Paragraph ends with NO cfr. closure | Add cfr. |
| 530 | 1.3.1 | ff.25.3 format consistency issue | Verify |

---

## 3. LINK — Verifiche e Ancore

| Line | Issue | Fix |
|------|-------|-----|
| 142 | x.company domain unusual | Verify canonical source |
| 160 | Missing title attribute | Add title |
| 186 | Self-reference #s2-2 within same file | Remove |
| 197 | Another self-reference #s2-2 | Delete |
| 198 | 2024 IEA report may expire 2026 | Check 2025 version |
| 202 | EMBER + IEA dual links redundant | Keep EMBER only |
| 430 | X/Twitter link may be deleted | Archive or replace |
| 460 | molluscan-eye.com inactive? | Test; replace if down |

---

## 4. STILE PROSA — Narrative Bridges & Thesis

Missing narrative bridges at: 160-161 (plastic trade), 199-200 (electricity access), 509-525 (xenotrapiants)

Missing (cfr. ff.X.Y) closures at: 160, 209, 463

Academic phrasing vs FF voice: lines 172, 186, 207 need FF rewording

---

## 5. HIGHLIGHT (mark.note-highlight) — 2 per Paragrafo

Over-highlighted (3+):
- Line 179: 4 markers (remove editorial phrases)
- Line 181-183: 4+ markers (consolidate to 2)
- Line 186-188: 3 markers (reduce to 2 strongest)

Under-highlighted (0-1 in long para):
- Line 190-191: 0 markers in 220 words (add 2)
- Line 456-459: 1 marker in 240 words (add 2nd)

---

## 6. FOOTNOTE BIDIREZIONALI

Orphan anchors:
- Line 179: [82] cited; no ref anchor
- Line 198: [81] cited; fonte-81 missing from bibliography

Suspicious entries not in text:
- fonte-18: "Lowercarbon Capital"
- fonte-32: "The Planet Remade"

---

## 7. UNIFORMITA — Heading, Blockquote, Figcaption, span.fc

✅ Heading hierarchy: correct
✅ Blockquote: 1x at line 439; consistent
✅ Figure captions: all correct format
✅ span.fc styling: consistent
⚠️ HTML entities: 95% entities, 5% Unicode — standardize choice

---

## 8. ALTRO — Content Duplication & Structure

Duplicate content:
- Lines 142-144 vs 196-197: Renewable stats repeat
- Lines 503-505 vs 173-174: Ore Energy battery paragraph identical
- Lines 186-187 vs 172: "Nel 2020..." content repeats

Structural issues:
- Line 165: 1.2.2 heading; content flows from 1.2.1 without clear break
- Line 599: <!-- ===== 1.3 ===== --> with no content (incomplete)

---

## SUMMARY

| Category | Count | Severity |
|----------|-------|----------|
| Refusi/Ortografia | 10 | MEDIUM |
| FF.X.Y Titoli | 10 | MEDIUM |
| Link | 8 | MEDIUM |
| Stile Prosa | 8 | MEDIUM-HIGH |
| Highlight | 6 | LOW-MEDIUM |
| Footnote | 3 | MEDIUM |
| Uniformita | 1 | LOW |
| Altro | 6 | MEDIUM-HIGH |
| **TOTAL** | **52** | **Actionable** |

---

## PRIORITY ACTIONS

1. **CRITICAL:** Remove Ore Energy duplicate (499-505), fix orphan text (149), verify ff.28.3 & ff.82
2. **HIGH:** Consolidate renewable stats, add missing cfr., fix emoji
3. **MEDIUM:** Add narrative bridges, rebalance highlights, verify URLs
4. **LOW:** Standardize HTML, enhance alt-text, consider 2nd blockquote

# Futuro Fortissimo — Style Memo for Book Enrichment

## Purpose
This memo codifies the editorial patterns used to enrich the book "Futuro Fortissimo — Cinque Macro Temi" so that future integrations follow the same style consistently.

---

## 1. Source Integration from notes.json

### Pattern
Every subchapter should have **2–4 supporting notes** from `notes.json` integrated directly into the prose. Notes are injected as brief factual phrases with inline source links.

### Format
```html
Sentence from existing text. FACT_FROM_NOTE (
  <a href="NOTE_URL" target="_blank" rel="noopener"
     style="font-family:'IBM Plex Mono',monospace;font-size:0.78rem;font-weight:bold;color:var(--accent);text-decoration:none;">
    &#128206; NOTE_TITLE
  </a>
).
```

### Rules
- The fact **must come verbatim or be a faithful paraphrase** from the note's `title` or `description` field
- The URL must be the note's actual `url` field — never invented
- The link uses the monospace font to match the existing `fc` class styling
- The 📎 (&#128206;) icon distinguishes note sources from newsletter references (which use `<span class="fc">`)

### Matching Notes to Subchapters
- Match by **tag overlap** (e.g., 🍃 notes for Natura chapter, 💻 for Tecnologia)
- Match by **keyword relevance** in title/description to subchapter topic
- Prefer notes with **specific data points** (numbers, study results, named entities)

---

## 2. Key Fact Highlights

### Pattern
Each paragraph should highlight **exactly 2 key facts** using the `note-highlight` class.

### Format
```html
<mark class="note-highlight">KEY FACT OR NUMBER</mark>
```

### What to Highlight
- **Quantitative data**: percentages, dollar amounts, population figures
- **Memorable phrases**: coined terms, metaphors, named concepts
- **Surprising facts**: counterintuitive statistics, record-breaking achievements

### CSS (already defined)
```css
.note-highlight {
  background: linear-gradient(180deg, transparent 60%, rgba(46,204,113,0.22) 60%);
  padding: 0 2px;
  font-style: normal;
  color: inherit;
}
```

---

## 3. Newsletter References (FF.x)

### Existing Pattern (preserve)
```html
(<span class="fc">EMOJI ff.NUMBER.SUB
TITLE</span>)
```
These get converted to Substack links via the `substackMap` JavaScript object at the bottom of each chapter.

### When Adding New FF.x References
1. Add the `<span class="fc">` tag in the text at the relevant paragraph
2. Add the FF number → Substack URL mapping to the `substackMap` object
3. Update `outline.json` with the new `ff.X.Y` refs in the appropriate subchapter

### Fallback Rule
If a subchapter link (ff.X.Y) doesn't have its own Substack URL, use the parent newsletter URL (ff.X). The substackMap JS already handles this: if the key isn't found, it falls back to `https://fortissimo.substack.com/p/ffX`.

---

## 4. New FF.x Subchapters

### When Selecting New FF.x to Add
- Choose newsletters **NOT already in outline.json** refs
- Ensure topical fit with the target chapter/subchapter
- Prefer newsletters with **3+ cards** (richer content to draw from)
- Distribute evenly: ~3 per chapter across all subchapters

### Integration Template
New FF.x content should be a **1-paragraph prose block** that:
1. Opens with a topic sentence connecting to the surrounding text
2. Includes 2-3 key facts from the newsletter's cards
3. Highlights 1-2 numbers with `note-highlight`
4. Closes with the `<span class="fc">` reference

---

## 5. Images with Captions

### Pattern
Each subchapter should have **1 image** from the corpus (`/index_files/pubs/ffN.webp` or `.png`).

### Format
```html
<figure>
    <img src="/index_files/pubs/ffN.webp" alt="DESCRIPTIVE_ALT_TEXT"
         loading="lazy" width="800" height="450"/>
    <figcaption>ff.N — TITLE: brief editorial caption connecting to chapter theme.</figcaption>
</figure>
```

### Rules
- Use images that **exist** in `/index_files/pubs/` — check with `ls` first
- Alt text should be descriptive for accessibility (not just "image")
- Caption follows pattern: `ff.N — Newsletter Title: editorial bridge to chapter content`
- Place figures **between subchapters** or after blockquotes for visual pacing

---

## 6. EPUB Build

After enriching chapters, always rebuild the EPUB:
```bash
node scripts/build_epub.mjs
```

The build script:
- Reads `book/chapter-01.html` through `chapter-05.html`
- Extracts `<main><article>` content
- Converts `.fc` spans to inline `<a>` links using the substackMap
- Removes `<img>` tags (EPUB compatibility)
- Outputs `book/futuro-fortissimo-tre-macro-temi.epub`

---

## 7. Data Sources — What's Allowed

| Source | File | Use |
|--------|------|-----|
| Newsletter summaries | `newsletter_data.json` | FF.x references, prose content |
| Curated notes | `notes.json` | Supporting facts with external URLs |
| Book reviews | `books.json`, `libri/books_it.json` | Chapter 4 content |
| Full corpus text | `futuro_fortissimo_full_data.txt` | Cross-referencing, verification |

**CRITICAL**: Never invent facts, URLs, or statistics. Every claim must trace back to one of these data sources. When in doubt, omit rather than fabricate.

---

## 8. Checklist for Future Enrichment

- [ ] Read target chapter HTML completely before editing
- [ ] Search notes.json for 2-4 matching notes per subchapter (by tag + keyword)
- [ ] Inject note phrases with source links (📎 format)
- [ ] Add `note-highlight` to exactly 2 key facts per paragraph
- [ ] Check if any unused FF.x newsletters fit the subchapter (from newsletter_data.json)
- [ ] If adding FF.x: update text, substackMap, and outline.json
- [ ] If adding images: verify file exists in /index_files/pubs/
- [ ] Rebuild EPUB: `node scripts/build_epub.mjs`
- [ ] Verify no broken references or missing files

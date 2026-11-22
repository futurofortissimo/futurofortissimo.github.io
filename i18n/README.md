# Futuro Fortissimo — trilingual archive (it · en · hi)

Italian is the source and default language. English and Hindi live next to it as **versioned data**:

| File | What |
|---|---|
| `i18n/en.json`, `i18n/hi.json` | Translations keyed by issue slug (`ff-158`) and section index (`"0"`, `"1"`…). Each entry stores short hashes of the Italian it was translated from (`h` = title/subtitle/keypoints, `th` = section title, `ch` = section body), so edits to the Italian are detected as *stale* automatically. |
| `i18n/books.json` | Original / official English titles of the books cited (for `/en/books/`, `/hi/books/`) + theme names. |
| `i18n/status.json` | Coverage report (`node scripts/i18n_status.mjs`). |
| `i18n/build-status.json` | What the last build generated (full vs partial pages, sitemap counts). |

## URLs

| | Italian | English | Hindi |
|---|---|---|---|
| Home (SPA) | `/` | `/en/` | `/hi/` |
| Archive index | `/archivio/` | `/en/archive/` | `/hi/archive/` |
| Issue | `/archivio/ff-158.html` | `/en/archive/ff-158.html` | `/hi/archive/ff-158.html` |
| Books | `/libri/` | `/en/books/` | `/hi/books/` |

Every page has `lang`, a translated title/description, canonical, translated OG/Twitter tags, JSON-LD with `inLanguage` (+ `translationOfWork` / `workTranslation`) and a `BreadcrumbList`, plus a language switcher (IT · EN · हिं) that keeps the current page.

## Full vs partial pages

* **full** — title, key points, every section title *and* every section body translated from the current Italian → indexed, listed in `sitemap-archive.xml`, linked with `hreflang` it/en/hi + `x-default` (Italian).
* **partial** — metadata and section titles translated, bodies still Italian (marked `lang="it"`, with a notice) → `noindex, follow`, left out of sitemap and hreflang so search engines never see a half-translated page as a translation.

## Pipeline

```
python scripts/rss_sync_data.py --apply     # new issues from Substack → data.js
node scripts/translate_missing.mjs          # only if TRANSLATE_API_KEY is set (GitHub secret)
node scripts/build_i18n_data.mjs            # data.en.js / data.hi.js for the SPA homes (import map)
node scripts/build_archive_seo.mjs          # it/en/hi static pages, books pages, sitemaps
node scripts/i18n_status.mjs                # coverage report
python scripts/validate_i18n.py             # JSON-LD, links, hreflang reciprocity, leftover Italian
```

The daily `rss-sync` workflow runs all of this. Without the `TRANSLATE_API_KEY` secret, new issues simply appear in en/hi as **partial** pages (Italian fallback, noindex) until translated. With it (any OpenAI-compatible API; optional repo variables `TRANSLATE_API_BASE`, `TRANSLATE_MODEL`), up to 3 issues per run are translated newest-first, guarded by structure checks, and marked `"mt": true` for review.

Manual translations: write `### ff-N/i` blocks and import with `node scripts/i18n_import_bodies.mjs <lang> <file>` (metadata: `scripts/i18n_import_meta.mjs`).

`/assets/ff-archive.css` is a prebuilt Tailwind stylesheet for the static pages (no runtime Tailwind JS):
`npx -y tailwindcss@3 -c tailwind.archive.config.cjs -i assets/ff-archive.src.css -o assets/ff-archive.css --minify`

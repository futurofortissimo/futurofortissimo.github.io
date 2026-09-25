---
name: futuro-fortissimo-draft-review
description: Review, fact-check, correct, and finalize Futuro Fortissimo Substack drafts. Use when Michele asks to inspect a bozza or uscita, fix Italian or English copy, improve title/subtitle/social text/SEO/GEO/slug/tags, compare the latest RSS covers, prepare a cover brief, save the draft, or run the complete pre-publication workflow. Do not publish unless the user explicitly asks.
---

# Futuro Fortissimo Draft Review

Use the authenticated Substack editor when the draft is already open or the user asks for browser work. Treat a visible draft as editable only after the user asks for changes. Keep the post unpublished unless publication is explicit.

## Review order

1. Read the whole draft, including title, subtitle, body, captions, links, social preview, SEO fields, slug, and tags.
2. Fix copy and factual claims before touching the cover image.
3. Preserve Michele's compact, playful voice. Cut padding, keep real accents, and avoid AI-style antitheses or decorative conclusions.
4. Verify unstable, medical, scientific, financial, and numerical claims with current primary or authoritative sources. Soften claims when evidence is preliminary.
5. Improve metadata with one clear Italian editorial promise and a small number of useful English entity terms. Avoid keyword stuffing.
6. Save the draft and verify the editor reports it as saved. Never press Publish unless requested.

Read [references/editorial-checklist.md](references/editorial-checklist.md) for the detailed quality gate and metadata limits.

## Body editing

- Correct Italian and English typos, grammar, punctuation, capitalization, and product or organization names.
- Preserve headings, images, links, quotations, lists, and section order unless a structural edit is clearly beneficial.
- For risky facts, prefer precise language such as "sperimentale", "fase 3", "ha aggiunto capitalizzazione", or "ha accelerato lo sviluppo" over stronger causal or approval claims.
- Keep links attached to the relevant phrase when the editor permits it. If a rich-text replacement would remove media or links, undo it and use a narrower edit.
- After each substantial edit, inspect the surrounding section. Before finishing, compare the figure count and link count with the starting draft.

## SEO, GEO, and tags

- Keep the visible title editorial; use the hidden SEO title for explicit entities and search intent.
- Target an SEO title under 60 characters and a description of 50-160 characters.
- Make the slug short, lowercase, hyphenated, and entity-rich without repeating filler.
- Use at most three tags. Choose the three strongest concepts, not synonyms.
- For bilingual reach, keep the sentence readable in Italian and add only recognized English query terms such as `AI mind viruses` or `personalized mRNA cancer vaccine`.
- GEO means answer-engine clarity: name entities, relationships, study phase, and status in complete language. It does not mean hiding keyword lists.

## RSS and visual context

Run `python scripts/read_substack_feed.py --limit 5` to inspect recent issues. Treat each RSS `<enclosure>` as the authoritative issue cover; do not infer the cover from the first inline `<img>`.

Only work on a new image after body and metadata are stable. Inspect the last five enclosure images first. When Michele asks for the established mixed style, combine:

- three simple raw SVG-like Mercatorum illustrations; and
- one background style chosen from the new issue's dominant idea.

Generate nothing if the requested references have not been inspected. Do not upload a weak first pass merely to complete the checklist.

## Final verification

Confirm all of the following:

- the draft remains unpublished;
- the editor says saved;
- corrected body passages are present;
- existing intended figures and links remain present;
- SEO title, description, slug, social description, and three tags are saved;
- any medical or scientific status is explicit;
- the final handoff states what changed and what still needs a human decision.


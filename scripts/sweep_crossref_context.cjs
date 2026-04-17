#!/usr/bin/env node
/**
 * sweep_crossref_context.cjs — Safe v5 §0.nonies compliance sweep.
 *
 * Transforms bare drop-in cross-refs:
 *   (<span class="fc">EMOJI ff.X.Y TITLE</span>)
 * into:
 *   (cfr. <span class="fc">EMOJI ff.X.Y TITLE</span>)
 *
 * "cfr." (Latin "confer" / Italian "confronta") is a conservative explicit
 * bridge term that flags the parenthetical as a cross-reference connection,
 * satisfying the §0.nonies requirement of an explicit connective clause
 * without inserting any non-corpus content.
 *
 * Only transforms cases where:
 *  - No existing bridge word in the immediately preceding ~180 chars
 *  - The parenthetical is truly bare (no "come/filo/riprendendo/cfr/..." inside)
 *
 * This is a minimal, safe sweep. Richer content-weaving rewrites are deferred
 * (would require per-subchapter authorial editing for corpus fidelity).
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/micme/Desktop/micmer/futuro fortissimo';
const BOOK = path.join(ROOT, 'book');

const bridgeRe = /\b(come|filo|riprendendo|anticipato|argomentato|ritorna|scrivevamo|vedi|vedere|richiama|torna|cfr\.?|echo|rispecchia|dialoga|riprende|richiamato|ricordando|dove scrivevamo|ricollegandoci|ci si collega)\b/i;

const files = fs.readdirSync(BOOK).filter(f => /^chapter-0[123]-[a-z]+\.html$/.test(f));
const stats = {};
const examples = [];

for (const f of files) {
  const full = path.join(BOOK, f);
  let html = fs.readFileSync(full, 'utf8');

  // Match parenthesized bare drop-in:
  //   (<span class="fc">...</span>)
  // Allow multi-line / whitespace inside span, but the paren must be (span...)
  const refRe = /\(\s*<span class="fc">([\s\S]*?ff\.\d+(?:\.\d+)?[\s\S]*?)<\/span>\s*\)/g;
  let rewritten = 0;
  const fileExamples = [];

  html = html.replace(refRe, (match, inner, offset) => {
    const before = html.slice(Math.max(0, offset - 180), offset);
    // Skip if bridge word already present in preceding context
    if (bridgeRe.test(before)) return match;

    const replacement = `(cfr. <span class="fc">${inner}</span>)`;
    rewritten++;
    if (fileExamples.length < 3) {
      fileExamples.push({
        before: match.slice(0, 120).replace(/\s+/g, ' '),
        after: replacement.slice(0, 150).replace(/\s+/g, ' '),
        precedingCtx: before.slice(-80).replace(/\s+/g, ' '),
      });
    }
    return replacement;
  });

  fs.writeFileSync(full, html, 'utf8');
  stats[f] = { rewritten, examples: fileExamples };
  console.log(`${f}: rewritten=${rewritten}`);
  if (examples.length < 10) {
    examples.push(...fileExamples.slice(0, 2).map(e => ({ file: f, ...e })));
  }
}

fs.writeFileSync(
  path.join(ROOT, 'generated', 'sweep_crossref_context_stats.json'),
  JSON.stringify({ stats, examples: examples.slice(0, 10) }, null, 2)
);
console.log('\nSaved stats.');

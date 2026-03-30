#!/usr/bin/env node
/**
 * build-bibliography.cjs — Builds internal bibliography sections for each subchapter page.
 * Each entry links to the section anchor where the ff.X.Y reference appears.
 */
const fs = require('fs');

const files = fs.readdirSync('.').filter(f => /^chapter-0[123]-[a-z]+\.html$/.test(f)).sort();

for (const file of files) {
  let html = fs.readFileSync(file, 'utf-8');

  // 1. Extract all h2/h3 section anchors with their line positions
  const sections = [];
  const lines = html.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/<h[23] id="(s[\d-]+)"[^>]*>([\s\S]*?)<\/h[23]>/);
    if (m) {
      sections.push({ id: m[1], title: m[2].replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, c => {
        const map = {'&mdash;':'—','&agrave;':'à','&egrave;':'è','&igrave;':'ì','&ograve;':'ò','&ugrave;':'ù','&rsquo;':"'",'&lsquo;':"'",'&nbsp;':' '};
        return map[c] || c;
      }).trim(), line: i });
    }
  }

  // 2. Extract all fc spans with their line positions
  const refs = [];
  for (let i = 0; i < lines.length; i++) {
    // Match <span class="fc">CONTENT</span> — may span multiple lines
    const lineBlock = lines.slice(i, Math.min(i + 3, lines.length)).join('\n');
    const fcMatches = [...lineBlock.matchAll(/<span class="fc">([\s\S]*?)<\/span>/g)];
    for (const fm of fcMatches) {
      const raw = fm[1].replace(/<[^>]*>/g, '').trim();
      // Extract emoji, ff code, and title
      // Pattern: EMOJI ff.X.Y\nTitle or EMOJI ff.X.Y Title
      const codeMatch = raw.match(/([\s\S]*?)(ff\.\d+(?:\.\d+)?)\s*([\s\S]*)/);
      if (codeMatch) {
        let emoji = codeMatch[1].trim();
        const code = codeMatch[2];
        let title = codeMatch[3].replace(/^\n/, '').trim();

        // Decode HTML entities in emoji
        emoji = emoji.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n)))
                     .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));

        // Decode entities in title
        title = title.replace(/&[a-z]+;/g, c => {
          const map = {'&mdash;':'—','&agrave;':'à','&egrave;':'è','&igrave;':'ì','&ograve;':'ò','&ugrave;':'ù','&rsquo;':"'",'&lsquo;':"'",'&eacute;':'é','&nbsp;':' '};
          return map[c] || c;
        });

        // Find which section this ref belongs to
        let sectionId = sections.length > 0 ? sections[0].id : 's1';
        for (const sec of sections) {
          if (sec.line <= i) sectionId = sec.id;
        }

        // Avoid duplicates
        if (!refs.find(r => r.code === code)) {
          refs.push({ emoji, code, title, sectionId, line: i });
        }
      }
    }
  }

  // Also extract note refs: note XXXX
  for (let i = 0; i < lines.length; i++) {
    const lineBlock = lines.slice(i, Math.min(i + 3, lines.length)).join('\n');
    const noteMatches = [...lineBlock.matchAll(/<span class="fc">([\s\S]*?)<\/span>/g)];
    for (const nm of noteMatches) {
      const raw = nm[1].replace(/<[^>]*>/g, '').trim();
      const noteMatch = raw.match(/([\s\S]*?)(note \d+)\s*([\s\S]*)/i);
      if (noteMatch && !refs.find(r => r.code === noteMatch[2])) {
        let emoji = noteMatch[1].trim()
          .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n)));
        const code = noteMatch[2];
        let title = noteMatch[3].replace(/^\n/, '').trim()
          .replace(/&[a-z]+;/g, c => ({'&mdash;':'—','&agrave;':'à','&egrave;':'è','&rsquo;':"'"}[c] || c));
        let sectionId = sections.length > 0 ? sections[0].id : 's1';
        for (const sec of sections) {
          if (sec.line <= i) sectionId = sec.id;
        }
        refs.push({ emoji, code, title, sectionId, line: i });
      }
    }
  }

  // Sort refs by line number
  refs.sort((a, b) => a.line - b.line);

  console.log(`\n${file}: ${refs.length} unique refs, ${sections.length} sections`);
  for (const r of refs.slice(0, 5)) {
    console.log(`  ${r.emoji} ${r.code} — ${r.title} → #${r.sectionId}`);
  }
  if (refs.length > 5) console.log(`  ... and ${refs.length - 5} more`);

  // 3. Build bibliography HTML
  let bibHtml = `\n    <!-- ===== Note del capitolo ===== -->
    <section id="note-capitolo" class="mt-12 brutal-card accent-bar">
      <h2 class="text-lg font-bold uppercase mb-4" style="font-family:'IBM Plex Mono',monospace;letter-spacing:0.12em;">Note del capitolo</h2>
      <p class="text-sm text-zinc-500 mb-4">${refs.length} riferimenti in questa sezione. Clicca per navigare al paragrafo.</p>
      <ol style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;">\n`;

  for (let ri = 0; ri < refs.length; ri++) {
    const r = refs[ri];
    const displayEmoji = r.emoji || '🎼';
    // HTML-encode the emoji for safety
    bibHtml += `        <li id="nota-${ri + 1}" style="border-left:3px solid var(--accent);padding:6px 12px;transition:background 0.2s;">
          <a href="#${r.sectionId}" style="text-decoration:none;color:inherit;display:block;">
            <span style="font-size:1.1em;">${displayEmoji}</span>
            <strong style="font-family:'IBM Plex Mono',monospace;font-size:0.82rem;color:var(--accent);">${r.code}</strong>
            <span style="font-size:0.88rem;color:#444;margin-left:4px;">${r.title}</span>
          </a>
        </li>\n`;
  }

  bibHtml += `      </ol>
    </section>\n`;

  // 4. Remove old bibliography if exists
  html = html.replace(/\n\s*<!-- ===== Note del capitolo ===== -->[\s\S]*?<\/section>\s*\n/g, '\n');
  // Also remove old Fonti esterne bibliography
  html = html.replace(/\n\s*<section id="bibliografia"[\s\S]*?<\/section>\s*\n/g, '\n');

  // 5. Insert new bibliography before the navigation section
  const navInsertPoint = html.indexOf('<!-- Navigation -->');
  if (navInsertPoint > 0) {
    html = html.slice(0, navInsertPoint) + bibHtml + '\n    ' + html.slice(navInsertPoint);
  } else {
    // Fallback: insert before </article>
    const articleEnd = html.lastIndexOf('</article>');
    if (articleEnd > 0) {
      html = html.slice(0, articleEnd) + bibHtml + '\n    ' + html.slice(articleEnd);
    }
  }

  fs.writeFileSync(file, html, 'utf-8');
}

console.log('\nDone — all bibliographies rebuilt as internal navigation.');

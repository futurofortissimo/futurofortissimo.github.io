#!/usr/bin/env node
// Add FTC/AGCM-style affiliate disclosure footer note to every book page.
// Idempotent: skips if marker already present.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

const DISCLOSURE = `
    <aside id="ff-affiliate-disclosure" class="max-w-4xl mx-auto px-4 sm:px-6 mt-12 mb-6" role="note">
      <p style="font-family:'IBM Plex Mono',monospace;font-size:0.68rem;letter-spacing:0.04em;color:#888;border-top:1px dashed #ddd;padding-top:1rem;line-height:1.55;">
        <strong style="color:#444;">Nota trasparenza</strong> &mdash; Alcuni link a libri (es. amzn.to/&hellip;) sono <em>affiliate</em>: se acquisti tramite quei link, Futuro Fortissimo riceve una piccola commissione senza alcun costo extra per te. Le segnalazioni editoriali restano indipendenti dal ritorno economico.
      </p>
    </aside>`;

function process(filename) {
  const full = path.join(root, filename);
  if (!fs.existsSync(full)) return false;
  let txt = fs.readFileSync(full, 'utf8');
  if (txt.includes('id="ff-affiliate-disclosure"')) return false;
  // Insert before </body> (or last </main> / </footer>)
  const closingBody = txt.lastIndexOf('</body>');
  if (closingBody < 0) return false;
  txt = txt.substring(0, closingBody) + DISCLOSURE + '\n' + txt.substring(closingBody);
  fs.writeFileSync(full, txt, 'utf8');
  return true;
}

// All book pages: front, macro intros, parent subchapters, sub-pages
const files = fs.readdirSync(root).filter(f => /^(index|chapter-\d+.*)\.html$/.test(f));
let count = 0;
for (const f of files) if (process(f)) count++;
console.log(`Disclosure added to ${count} / ${files.length} pages`);

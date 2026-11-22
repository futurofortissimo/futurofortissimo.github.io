/**
 * build_covers.mjs — self-hosts the covers of the latest issues shown on the home rail (LCP image),
 * as small WebP files in assets/covers/ + a ~300-byte blurred placeholder, listed in assets/covers/covers.json.
 * Uses Substack's image CDN to resize/convert. Safe to re-run; network failures keep the previous files.
 * Run before build_static_pages.mjs (rss-sync workflow).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'assets', 'covers');
const N = 6;
const WIDTHS = [480, 800];
const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets', 'site-index-it.json'), 'utf-8'));
const latest = index.filter((r) => r.img).slice(0, N);
const cdn = (src, w, h, extra = 'q_auto:good') => `https://substackcdn.com/image/fetch/w_${w},h_${h},c_fill,f_webp,${extra}/${encodeURIComponent(src)}`;

async function get(url) {
  const r = await fetch(url, { headers: { 'user-agent': 'futurofortissimo.github.io build' } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

fs.mkdirSync(DIR, { recursive: true });
const prev = fs.existsSync(path.join(DIR, 'covers.json')) ? JSON.parse(fs.readFileSync(path.join(DIR, 'covers.json'), 'utf-8')) : {};
const out = {};
for (const r of latest) {
  try {
    const files = {};
    for (const w of WIDTHS) {
      const name = `${r.s}-${w}.webp`;
      const file = path.join(DIR, name);
      if (!fs.existsSync(file) || prev[r.s]?.src !== r.img) fs.writeFileSync(file, await get(cdn(r.img, w, Math.round((w * 9) / 16))));
      files[w] = `/assets/covers/${name}`;
    }
    const lqip = prev[r.s]?.src === r.img && prev[r.s]?.lqip ? prev[r.s].lqip
      : `data:image/webp;base64,${(await get(cdn(r.img, 48, 27))).toString('base64')}`;
    out[r.s] = { src: r.img, files, lqip };
  } catch (e) {
    console.warn(`⚠️ cover ${r.s}: ${e.message}`);
    if (prev[r.s]) out[r.s] = prev[r.s];
  }
}
// drop covers that left the rail
for (const f of fs.readdirSync(DIR)) {
  if (f.endsWith('.webp') && !Object.values(out).some((c) => Object.values(c.files).some((u) => u.endsWith(`/${f}`)))) fs.unlinkSync(path.join(DIR, f));
}
fs.writeFileSync(path.join(DIR, 'covers.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`✅ covers: ${Object.keys(out).length} self-hosted (${fs.readdirSync(DIR).filter((f) => f.endsWith('.webp')).length} webp)`);

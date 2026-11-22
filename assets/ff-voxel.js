/* ff-voxel.js — one tiny 3D voxel object per issue (pixel-art, canvas 2D, no dependencies).
   Placeholders: <span class="ff-vox" data-ff-vox="model" data-ff-slug="ff-158" data-label="…">.
   Enhanced into <button aria-expanded> + <canvas>; click/Enter → the object explodes and the issue unfolds in a sheet
   (sections with a first-paragraph preview, links). Esc closes. Idle slow rotation only while visible; static with
   prefers-reduced-motion. Loaded lazily by ff-app.js, never on the LCP path. */
(() => {
  'use strict';
  if (window.__ffVox) return; window.__ffVox = 1;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LANG = (document.documentElement.lang || 'it').slice(0, 2);
  const T = {
    it: { read: 'Leggi la sezione', issue: 'Apri il numero', sub: 'Originale su Substack ↗', th: 'Temi', rel: 'Correlati', close: 'Chiudi', load: 'Apro…', err: 'Anteprima non disponibile.', secs: 'sezioni' },
    en: { read: 'Read the section', issue: 'Open the issue', sub: 'Original on Substack ↗', th: 'Themes', rel: 'Related', close: 'Close', load: 'Opening…', err: 'Preview not available.', secs: 'sections' },
    hi: { read: 'खंड पढ़ें', issue: 'अंक खोलें', sub: 'Substack पर मूल ↗', th: 'थीम', rel: 'संबंधित', close: 'बंद करें', load: 'खुल रहा है…', err: 'पूर्वावलोकन उपलब्ध नहीं।', secs: 'खंड' },
  }[LANG] || null;
  const S = T || { read: 'Leggi la sezione', issue: 'Apri il numero', sub: 'Originale su Substack ↗', th: 'Temi', rel: 'Correlati', close: 'Chiudi', load: 'Apro…', err: 'Anteprima non disponibile.', secs: 'sezioni' };

  /* ── model builder: a sparse voxel grid, y up ── */
  function builder() {
    const m = new Map();
    const col = (c, x, y, z) => (typeof c === 'function' ? c(x, y, z) : c);
    const set = (x, y, z, c) => { x = Math.round(x); y = Math.round(y); z = Math.round(z); const k = x + ',' + y + ',' + z; if (c == null) m.delete(k); else m.set(k, [x, y, z, c]); };
    const b = {
      set: (x, y, z, c) => set(x, y, z, col(c, x, y, z)),
      box(x0, y0, z0, x1, y1, z1, c) { for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) set(x, y, z, col(c, x, y, z)); },
      ell(cx, cy, cz, rx, ry, rz, c) {
        for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
          const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2; if (d <= 1.04) set(x, y, z, col(c, x, y, z));
        }
      },
      sph(cx, cy, cz, r, c) { b.ell(cx, cy, cz, r, r, r, c); },
      cyl(cx, cz, y0, y1, r, c) { for (let y = y0; y <= y1; y++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++) if ((x - cx) ** 2 + (z - cz) ** 2 <= r * r + .3) set(x, y, z, col(c, x, y, z)); },
      cylx(cy, cz, x0, x1, r, c) { for (let x = x0; x <= x1; x++) for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) for (let z = Math.floor(cz - r); z <= Math.ceil(cz + r); z++) if ((y - cy) ** 2 + (z - cz) ** 2 <= r * r + .3) set(x, y, z, col(c, x, y, z)); },
      cylz(cx, cy, z0, z1, r, c) { for (let z = z0; z <= z1; z++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r + .3) set(x, y, z, col(c, x, y, z)); },
      ring(cx, cy, z, r, c, w = .7, z1 = z) { for (let zz = z; zz <= z1; zz++) for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x++) for (let y = Math.floor(cy - r - 1); y <= Math.ceil(cy + r + 1); y++) { const d = Math.hypot(x - cx, y - cy); if (Math.abs(d - r) <= w) set(x, y, zz, col(c, x, y, zz)); } },
      line(a, z2, c) { const [x0, y0, z0] = a, [x1, y1, zz1] = z2; const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(zz1 - z0), 1); for (let i = 0; i <= n; i++) { const t = i / n; set(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, z0 + (zz1 - z0) * t, col(c, 0, 0, 0)); } },
      /* rows top→bottom, extruded along z; pal maps characters to colours */
      spr(rows, pal, z0 = 0, depth = 2, x0 = 0, y0 = 0) { rows.forEach((row, r) => [...row].forEach((ch, x) => { const c = pal[ch]; if (c) for (let z = z0; z < z0 + depth; z++) set(x0 + x, y0 + rows.length - 1 - r, z, c); })); },
      del: (x, y, z) => set(x, y, z, null),
      get: (x, y, z) => m.get(x + ',' + y + ',' + z),
    };
    return [b, m];
  }
  const C = { red: '#e23b3b', blue: '#4a90e2', yel: '#f5b731', grn: '#3cc77a', wht: '#f3f1ea', gry: '#9aa1ab', dgy: '#5f6672', ink: '#3a4150', brn: '#9a6434', dbr: '#6e4524', org: '#f08a24', pnk: '#f29bb8', pur: '#9b6bd6', cya: '#5bd0e6', gold: '#e7b43a', lgr: '#7fdc8f', sky: '#a8d8ff', skin: '#f2c79b', crm: '#f4e6c3' };
  const hashN = (x, y, z) => { let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

  const MODELS = {
    microscope(b) {
      b.box(2, 0, 4, 13, 1, 11, C.ink); b.box(10, 2, 6, 12, 11, 8, C.dgy); b.box(4, 6, 4, 11, 6, 11, C.gry); b.box(6, 7, 6, 9, 7, 9, C.sky);
      for (let i = 0; i < 7; i++) b.cyl(7.5 + i * .25, 7.5, 9 + i, 9 + i, 1.6, C.blue);
      b.cyl(9.2, 7.5, 16, 17, 1.3, C.ink); b.cyl(7.5, 7.5, 8, 8, 1, C.wht); b.box(12, 8, 6, 13, 9, 8, C.red);
      // prime spiral dots on the slide
      [[5, 5], [6, 10], [10, 4], [11, 10]].forEach(([x, z]) => b.set(x, 7, z, C.yel));
    },
    walnut(b) { b.ell(8, 7, 8, 6.5, 5.5, 6, (x, y, z) => ((x + y * 2 + z) % 4 === 0 ? C.dbr : C.brn)); for (let y = 2; y <= 12; y++) b.set(8, y, 1.6, C.dbr); b.cyl(8, 8, 13, 13, .6, C.dbr); },
    lamp(b) {
      b.ell(8, 4, 8, 5.5, 2.6, 4, C.gold); b.box(4, 1, 6, 12, 1, 10, C.gold); b.ell(8, 7, 8, 2, 1.4, 2, C.gold); b.set(8, 9, 8, C.red);
      for (let i = 0; i < 5; i++) b.set(13 + i, 4 + i * .5, 8, C.gold); b.ring(2, 5, 8, 2, C.gold, .6);
      [[18, 8], [17, 10], [18, 12], [19, 14], [18, 15]].forEach(([x, y], i) => b.sph(x, y, 8, i ? 1 : .6, C.pur));
    },
    virus(b) {
      b.sph(8, 8, 8, 5, (x, y, z) => (hashN(x, y, z) > .8 ? C.lgr : C.grn));
      [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1], [.7, .7, 0], [-.7, .7, 0], [.7, -.7, 0], [-.7, -.7, 0], [0, .7, .7], [0, -.7, -.7], [.7, 0, -.7], [-.7, 0, .7]]
        .forEach(([dx, dy, dz]) => { for (let r = 5; r <= 7; r++) b.set(8 + dx * r, 8 + dy * r, 8 + dz * r, r === 7 ? C.red : C.grn); });
    },
    bicycle(b) {
      b.ring(4, 4, 7, 3.6, C.ink, .55); b.ring(16, 4, 7, 3.6, C.ink, .55); b.set(4, 4, 7, C.gry); b.set(16, 4, 7, C.gry);
      b.line([4, 4, 7], [9, 4, 7], C.red); b.line([9, 4, 7], [7, 9, 7], C.red); b.line([7, 9, 7], [14, 9, 7], C.red); b.line([14, 9, 7], [9, 4, 7], C.red);
      b.line([14, 9, 7], [16, 4, 7], C.red); b.line([4, 4, 7], [7, 9, 7], C.red); b.box(6, 10, 7, 8, 10, 7, C.ink); b.line([14, 9, 7], [15, 11, 7], C.gry); b.box(14, 11, 5, 15, 11, 9, C.ink);
    },
    token(b) { b.cylz(8, 8, 7, 8, 6.5, C.gold); b.ring(8, 8, 9, 5.6, C.org, .5); b.spr(['TTTTT', '..T..', '..T..', '..T..', '..T..'], { T: C.org }, 9, 1, 6, 6); b.spr(['TTTTT', '..T..', '..T..', '..T..', '..T..'], { T: C.org }, 6, 1, 6, 6); },
    pawn(b) { b.cyl(7, 7, 0, 1, 5, C.wht); b.cyl(7, 7, 2, 2, 4, C.crm); b.cyl(7, 7, 3, 8, 2.2, C.wht); b.cyl(7, 7, 9, 9, 3.2, C.crm); b.sph(7, 12, 7, 3, C.wht); b.set(7, 15, 7, C.red); },
    bulb(b) {
      b.sph(8, 10, 8, 5.2, (x, y, z) => (hashN(x, y, z) > .85 ? C.wht : C.yel)); b.cyl(8, 8, 2, 5, 2.4, (x, y) => (y % 2 ? C.gry : C.dgy)); b.cyl(8, 8, 1, 1, 1.2, C.ink);
      b.line([7, 6, 8], [8, 10, 8], C.org); b.line([9, 6, 8], [8, 10, 8], C.org);
    },
    brain(b) {
      b.ell(8, 8, 8, 7, 5, 5.5, (x, y, z) => (x === 8 ? '#c4627f' : ((x * 3 + y * 5 + z * 7) % 6 < 1 ? '#d86f8c' : C.pnk)));
      b.cyl(9, 8, 1, 3, 1.4, '#d86f8c');
    },
    sunglasses(b) {
      b.box(1, 6, 8, 17, 6, 8, C.red); b.box(2, 2, 8, 7, 6, 8, C.blue); b.box(11, 2, 8, 16, 6, 8, C.blue); b.box(8, 5, 8, 10, 5, 8, C.red);
      b.set(3, 5, 9, C.sky); b.set(4, 4, 9, C.sky); b.set(12, 5, 9, C.sky); b.set(13, 4, 9, C.sky); b.box(1, 6, 1, 1, 6, 7, C.red); b.box(17, 6, 1, 17, 6, 7, C.red);
      b.sph(9, 13, 4, 2.4, C.yel);
    },
    temple(b) {
      b.box(0, 0, 0, 16, 0, 10, C.gry); b.box(1, 1, 1, 15, 1, 9, C.wht);
      for (const x of [2, 6, 10, 14]) for (const z of [2, 8]) b.cyl(x, z, 2, 8, 1, C.wht);
      b.box(1, 9, 1, 15, 9, 9, C.crm); for (let i = 0; i < 4; i++) b.box(1 + i * 2, 10 + i, 1, 15 - i * 2, 10 + i, 9, i % 2 ? C.wht : C.crm);
    },
    fish(b) {
      b.ell(8, 7, 6, 6.5, 4, 2.4, (x, y) => (y < 6 ? C.wht : (x % 3 === 0 ? C.org : C.yel)));
      b.spr(['TT..', 'TTT.', '.TTT', 'TTT.', 'TT..'], { T: C.org }, 5, 2, 15, 5); b.set(3, 8, 8, C.ink); b.set(3, 8, 4, C.ink); b.set(1, 6, 6, C.red);
      b.spr(['.F.', 'FFF'], { F: C.org }, 6, 1, 7, 11);
      [[0, 11], [-1, 13], [0, 15]].forEach(([x, y]) => b.set(x, y, 6, C.sky));
    },
    ghost(b) {
      b.spr(['...WWWWW...', '..WWWWWWW..', '.WWWWWWWWW.', '.WWBWWWBWW.', '.WWBWWWBWW.', 'WWWWWWWWWWW', 'WWWWPPPWWWW', 'WWWWWWWWWWW', 'WWWWWWWWWWW', 'WWWWWWWWWWW', 'WW.WWW.WWW.', 'W...W...W..'],
        { W: C.wht, B: C.blue, P: C.pnk }, 4, 5, 3, 1);
    },
    bone(b) { b.cylx(6, 7, 4, 14, 1.6, C.crm); for (const x of [3, 15]) { b.sph(x, 4.5, 7, 2, C.crm); b.sph(x, 7.5, 7, 2, C.crm); } b.box(7, 9, 6, 11, 10, 8, '#c98b4a'); b.box(7, 11, 6, 11, 11, 8, C.org); },
    lobster(b) {
      b.ell(9, 4, 8, 5, 2.4, 2.6, C.red); b.ell(15, 4, 8, 2, 1.6, 2, '#c42a2a'); b.ell(2, 7, 4, 2.4, 2, 1.6, C.red); b.ell(2, 7, 12, 2.4, 2, 1.6, C.red);
      b.line([5, 4, 6], [3, 6, 4], C.red); b.line([5, 4, 10], [3, 6, 12], C.red); b.line([5, 6, 7], [0, 12, 6], C.org); b.line([5, 6, 9], [1, 13, 11], C.org);
      for (const x of [8, 10, 12]) { b.set(x, 2, 5, '#c42a2a'); b.set(x, 2, 11, '#c42a2a'); } b.set(6, 6, 7, C.ink); b.set(6, 6, 9, C.ink);
    },
    watch(b) {
      b.box(6, 1, 6, 10, 15, 6, C.dgy); b.cylz(8, 8, 6, 9, 5, C.gold); b.cylz(8, 8, 10, 10, 4, C.wht);
      b.line([8, 8, 11], [8, 12, 11], C.ink); b.line([8, 8, 11], [11, 8, 11], C.red); b.set(13.5, 8, 8, C.gold);
      for (const [x, y] of [[8, 12], [12, 8], [8, 4], [4, 8]]) b.set(x, y, 11, C.dgy);
    },
    ufo(b) {
      b.ell(9, 5, 9, 8, 1.6, 8, (x, y, z) => (y === 5 && (x + z) % 4 === 0 ? C.yel : C.gry)); b.ell(9, 7.5, 9, 3.6, 3, 3.6, C.cya); b.set(9, 8, 6, C.grn);
      for (const [x, z] of [[5, 5], [13, 5], [5, 13], [13, 13]]) b.line([x, 3, z], [x + (x < 9 ? -1 : 1), 0, z + (z < 9 ? -1 : 1)], C.dgy); b.cyl(9, 9, 3, 3, 2, C.yel);
    },
    floppy(b) {
      b.box(1, 0, 6, 15, 14, 7, C.blue); b.box(4, 9, 8, 12, 14, 8, C.gry); b.box(9, 10, 8, 10, 13, 8, C.ink); b.box(3, 1, 8, 13, 7, 8, C.wht);
      for (const y of [3, 5]) b.box(4, y, 9, 12, y, 9, C.gry); b.del(1, 14, 7); b.del(1, 14, 6);
    },
    phone(b) {
      b.box(3, 0, 6, 12, 18, 7, C.ink); b.box(4, 2, 8, 11, 16, 8, (x, y) => (y > 13 ? C.blue : C.sky));
      [[5, 11, C.red], [7, 11, C.yel], [9, 11, C.grn], [5, 8, C.pur], [7, 8, C.org], [9, 8, C.pnk], [5, 5, C.cya], [7, 5, C.red]].forEach(([x, y, c]) => b.set(x, y, 9, c));
      b.box(7, 1, 8, 8, 1, 8, C.gry);
    },
    chip(b) {
      b.box(1, 0, 1, 15, 0, 15, '#2f7d4f'); b.box(4, 1, 4, 12, 2, 12, C.dgy); b.box(6, 3, 6, 10, 3, 10, C.gry); b.set(8, 4, 8, C.grn);
      for (let i = 5; i <= 11; i += 2) { b.set(i, 1, 3, C.gold); b.set(i, 1, 13, C.gold); b.set(3, 1, i, C.gold); b.set(13, 1, i, C.gold); }
      for (let i = 2; i <= 14; i += 3) { b.set(i, 1, 1, C.gold); b.set(1, 1, i, C.gold); }
    },
    tree(b) { b.cyl(8, 8, 0, 6, 1.4, C.brn); b.sph(8, 10, 8, 4.6, (x, y, z) => (hashN(x, y, z) > .7 ? C.lgr : C.grn)); b.sph(5, 8, 7, 2.8, C.grn); b.sph(11, 9, 9, 3, C.grn); b.sph(8, 14, 8, 2.6, C.lgr); b.set(10, 12, 12, C.red); b.set(5, 10, 10, C.red); },
    mountain(b) {
      for (let y = 0; y < 13; y++) { const r = 8 - y * .62; for (let x = Math.floor(8 - r); x <= Math.ceil(8 + r); x++) for (let z = Math.floor(8 - r); z <= Math.ceil(8 + r); z++) if (Math.abs(x - 8) + Math.abs(z - 8) * .8 <= r + .5) b.set(x, y, z, y > 9 ? C.wht : y > 7 && hashN(x, y, z) > .5 ? C.wht : (hashN(x, y, z) > .8 ? C.dgy : C.gry)); }
      b.cyl(1, 13, 0, 2, 1, C.grn); b.cyl(15, 2, 0, 3, 1.2, C.grn); b.set(8, 13, 8, C.red); b.set(8, 14, 8, C.red);
    },
    wave(b) {
      for (let x = 0; x < 16; x++) for (let z = 0; z < 10; z++) { const h = Math.round(3 + 2.2 * Math.sin(x / 2.2 + z * .3) + (x > 9 ? (x - 9) * .9 : 0)); for (let y = 0; y <= Math.min(h, 10); y++) b.set(x, y, z, y === Math.min(h, 10) ? C.wht : y > h - 2 ? C.cya : C.blue); }
      for (let z = 0; z < 10; z++) { b.set(14, 11, z, C.wht); b.set(13, 12, z, C.wht); b.set(12, 12, z, C.cya); }
    },
    dice(b) {
      b.box(1, 0, 1, 11, 10, 11, C.wht); const p = (pts, f) => pts.forEach(([u, v]) => f(u, v));
      p([[6, 5]], (u, v) => b.set(u, v, 12, C.red)); p([[3, 8], [9, 2], [6, 5]], (u, v) => b.set(u, 11, v + 1, C.ink)); p([[3, 8], [9, 2], [3, 2], [9, 8]], (u, v) => b.set(12, v, u, C.ink));
      b.box(14, 0, 10, 19, 5, 15, C.red); b.set(16, 6, 12, C.wht); b.set(18, 6, 14, C.wht);
    },
    robot(b) {
      b.box(4, 0, 6, 5, 3, 9, C.dgy); b.box(10, 0, 6, 11, 3, 9, C.dgy); b.box(3, 4, 5, 12, 10, 10, C.gry); b.box(6, 6, 11, 9, 8, 11, C.blue);
      b.box(1, 6, 7, 2, 10, 8, C.dgy); b.box(13, 6, 7, 14, 10, 8, C.dgy); b.box(4, 11, 5, 11, 16, 10, C.wht); b.box(5, 13, 11, 6, 14, 11, C.yel); b.box(9, 13, 11, 10, 14, 11, C.yel);
      b.box(6, 12, 11, 9, 12, 11, C.dgy); b.line([7, 17, 7], [7, 19, 7], C.dgy); b.sph(7, 20, 7, 1, C.red);
    },
    sun(b) { b.sph(8, 8, 8, 5, (x, y, z) => (hashN(x, y, z) > .75 ? C.org : C.yel)); for (let a = 0; a < 8; a++) { const dx = Math.cos(a * Math.PI / 4), dy = Math.sin(a * Math.PI / 4); for (let r = 6.5; r <= 8.5; r++) b.set(8 + dx * r, 8 + dy * r, 8, C.org); } },
    globe(b) {
      const land = (x, y, z) => { const n = Math.sin(x * .9) + Math.sin(y * 1.1 + z * .5) + Math.cos(z * .8 - x * .3); return n > .9 ? C.grn : C.blue; };
      b.sph(8, 8, 8, 6, land); b.ring(8, 8, 8, 7.6, C.gold, .45); b.cyl(8, 8, 0, 0, 3, C.dgy); b.box(8, 1, 8, 8, 1, 8, C.dgy);
    },
    heart(b) { b.spr(['.RR...RR.', 'RRRR.RRRR', 'RRRRRRRRR', 'RRRRRRRRR', '.RRRRRRR.', '..RRRRR..', '...RRR...', '....R....'], { R: C.red }, 4, 4, 2, 2); b.set(3, 8, 8, C.wht); b.set(4, 9, 8, C.wht); },
    apple(b) { b.sph(8, 7, 8, 5.6, (x, y, z) => (hashN(x, y, z) > .86 ? '#ff6b5e' : C.red)); b.del(8, 13, 8); b.cyl(8, 8, 12, 14, .5, C.dbr); b.ell(10.5, 14, 8, 2, .8, 1, C.grn); },
    banana(b) { for (let i = 0; i <= 16; i++) { const a = -1.2 + i * .15; const x = 9 + Math.sin(a) * 8, y = 9 - Math.cos(a) * 7; b.sph(x, y, 7, i < 2 || i > 15 ? .8 : 1.8, i < 2 || i > 15 ? C.dbr : C.yel); } },
    coffee(b) {
      b.cyl(7, 7, 0, 0, 4.6, C.wht); b.cyl(7, 7, 1, 9, 4, C.red); b.cyl(7, 7, 9, 9, 3.2, C.dbr); b.cyl(7, 7, 1, 1, 4, C.wht);
      b.ring(12, 5, 7, 1.8, C.red, .5); b.del(11, 5, 7); [[6, 11], [7, 12], [6, 13], [8, 14]].forEach(([x, y]) => b.set(x, y, 7, C.wht));
    },
    book(b) {
      b.box(1, 0, 2, 14, 2, 12, C.blue); b.box(2, 1, 3, 14, 1, 11, C.wht); b.box(2, 3, 1, 13, 5, 11, C.red); b.box(3, 4, 2, 13, 4, 10, C.crm); b.box(3, 6, 3, 12, 8, 12, C.yel); b.box(4, 7, 4, 12, 7, 11, C.wht);
      b.box(6, 9, 5, 9, 9, 10, C.grn);
    },
    clef(b) {
      b.ell(4, 3, 7, 2.6, 1.8, 2, C.blue); b.ell(13, 1.5, 7, 2.6, 1.8, 2, C.blue); b.box(6, 3, 6, 6, 14, 7, C.ink); b.box(15, 2, 6, 15, 13, 7, C.ink);
      for (let x = 6; x <= 15; x++) { const y = Math.round(14 - (x - 6) / 9); b.box(x, y, 6, x, y + 1, 8, C.red); }
    },
    rocket(b) {
      b.cyl(7, 7, 3, 13, 2.6, C.wht); for (let y = 14; y <= 18; y++) b.cyl(7, 7, y, y, 2.6 - (y - 13) * .5, C.red); b.cylz(7, 10, 9, 10, 1.1, C.cya);
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) b.box(7 + dx * 3, 2, 7 + dz * 3, 7 + dx * 4, 6, 7 + dz * 4, C.red);
      b.cyl(7, 7, 1, 2, 1.6, C.org); b.cyl(7, 7, 0, 0, .8, C.yel);
    },
    atom(b) { b.sph(8, 8, 8, 2, C.red); b.ring(8, 8, 8, 6.4, C.blue, .45); for (let a = 0; a < 64; a++) { const t = a / 64 * Math.PI * 2; b.set(8 + Math.cos(t) * 6.4, 8 + Math.sin(t) * 6.4 * .5, 8 + Math.sin(t) * 6.4 * .86, C.cya); b.set(8 + Math.cos(t) * 6.4 * .5, 8 + Math.sin(t) * 6.4, 8 - Math.cos(t) * 6.4 * .86, C.pur); } b.set(14, 8, 8, C.yel); b.set(8, 14, 8, C.yel); },
    dna(b) { for (let y = 0; y <= 18; y++) { const t = y * .45; const x1 = 7 + Math.cos(t) * 4, z1 = 7 + Math.sin(t) * 4, x2 = 7 - Math.cos(t) * 4, z2 = 7 - Math.sin(t) * 4; b.sph(x1, y, z1, .8, C.blue); b.sph(x2, y, z2, .8, C.red); if (y % 3 === 0) b.line([x1, y, z1], [x2, y, z2], y % 2 ? C.yel : C.grn); } },
    coin(b) { b.cylz(8, 8, 7, 8, 6.5, C.org); b.ring(8, 8, 9, 5.6, C.yel, .5); b.spr(['.B.B.', 'BBBB.', 'B...B', 'BBBB.', 'B...B', 'BBBB.', '.B.B.'], { B: C.wht }, 9, 1, 6, 5); b.spr(['.B.B.', 'BBBB.', 'B...B', 'BBBB.', 'B...B', 'BBBB.', '.B.B.'], { B: C.wht }, 6, 1, 6, 5); },
    eye(b) { b.sph(8, 8, 8, 6, C.wht); b.cylz(8, 8, 13, 14, 3, C.blue); b.cylz(8, 8, 14, 15, 1.6, C.ink); b.set(9, 9, 15, C.wht); for (let x = 3; x <= 13; x++) b.set(x, 13.5 - Math.abs(x - 8) * .25, 12, C.pnk); },
    car(b) {
      b.box(0, 2, 2, 17, 5, 10, C.red); b.box(4, 6, 3, 12, 9, 9, C.red); b.box(5, 7, 2, 11, 8, 2, C.sky); b.box(5, 7, 10, 11, 8, 10, C.sky); b.box(13, 7, 3, 13, 8, 9, C.sky); b.box(3, 7, 3, 3, 8, 9, C.sky);
      for (const x of [3, 14]) for (const z of [1, 11]) b.cylz(x, 2, z, z, 1.8, C.ink); b.box(18, 3, 3, 18, 4, 4, C.yel); b.box(18, 3, 8, 18, 4, 9, C.yel);
    },
    house(b) { b.box(1, 0, 2, 13, 7, 12, C.crm); for (let i = 0; i <= 6; i++) b.box(0 + i, 8 + i, 1, 14 - i, 8 + i, 13, i === 6 ? C.dbr : C.red); b.box(6, 0, 13, 8, 4, 13, C.brn); b.box(2, 4, 13, 4, 6, 13, C.sky); b.box(10, 4, 13, 12, 6, 13, C.sky); b.box(10, 11, 9, 11, 16, 10, C.dgy); },
    mushroom(b) { b.cyl(8, 8, 0, 6, 2.4, C.crm); b.ell(8, 8, 8, 7, 4, 7, (x, y, z) => (y < 8 ? null : (hashN(x, y, z) > .78 ? C.wht : C.red))); b.cyl(8, 8, 7, 7, 6, C.crm); },
    plane(b) {
      b.cylx(6, 8, 1, 17, 1.8, C.wht); b.ell(18, 6, 8, 1.5, 1.5, 1.5, C.wht); b.box(7, 6, 0, 11, 6, 16, C.blue); b.box(2, 6, 5, 4, 6, 11, C.blue); b.box(1, 7, 8, 3, 11, 8, C.red);
      for (let x = 5; x <= 15; x += 2) { b.set(x, 7, 6, C.sky); b.set(x, 7, 10, C.sky); } b.set(18, 7, 8, C.ink);
    },
    cloud(b) { b.sph(5, 9, 7, 3.2, C.wht); b.sph(9, 11, 7, 4, C.wht); b.sph(13, 9, 7, 3, C.wht); b.box(4, 6, 5, 14, 8, 9, C.wht); b.spr(['..YY', '.YY.', 'YYYY', '..YY', '.YY.', 'YY..'], { Y: C.yel }, 6, 2, 7, 0); },
    flame(b) { [[0, 5, C.red], [2, 4.6, C.red], [4, 4, C.org], [6, 3.2, C.org], [8, 2.4, C.yel], [10, 1.6, C.yel], [12, .9, C.wht]].forEach(([y, r, c]) => b.cyl(7 + Math.sin(y) * .6, 7, y, y + 1, r, c)); b.box(2, 0, 4, 12, 0, 10, C.brn); },
    gamepad(b) {
      b.box(2, 0, 3, 17, 3, 10, C.gry); b.ell(3, 2, 8, 3, 2, 3.4, C.gry); b.ell(16, 2, 8, 3, 2, 3.4, C.gry);
      b.box(4, 4, 5, 6, 4, 5, C.ink); b.box(5, 4, 4, 5, 4, 6, C.ink); [[13, 4, C.red], [15, 6, C.grn], [15, 4, C.blue], [17, 5, C.yel]].forEach(([x, z, c]) => b.set(x, 4, z, c)); b.box(9, 4, 6, 10, 4, 6, C.dgy);
    },
    shell(b) {
      for (let r = 0; r <= 9; r += .5) for (let a = -1.25; a <= 1.25; a += .06) { const x = 9 + r * Math.sin(a), y = 1 + r * Math.cos(a), rib = Math.round((a + 1.25) / .25) % 2; for (let z = 7 - Math.round(r * .25 * Math.cos(a * 1.2)); z <= 7; z++) b.set(x, y, z, rib ? C.pnk : C.crm); }
      b.box(6, 0, 6, 12, 1, 8, C.pnk); b.set(7, 13, 4, C.wht);
    },
    pill(b) { b.cylx(7, 7, 4, 9, 3, C.red); b.cylx(7, 7, 10, 15, 3, C.wht); b.sph(4, 7, 7, 3, C.red); b.sph(15, 7, 7, 3, C.wht); b.set(6, 10, 6, '#ff8a8a'); b.sph(8, 1, 14, 1.4, C.yel); b.sph(12, 1, 15, 1.2, C.blue); },
    lungs(b) { b.ell(4.5, 7, 7, 3.6, 6, 3, C.pnk); b.ell(12.5, 7, 7, 3.6, 6, 3, C.pnk); b.cyl(8.5, 7, 9, 16, 1, C.wht); b.line([8.5, 9, 7], [5, 7, 7], C.red); b.line([8.5, 9, 7], [12, 7, 7], C.red); },
  };

  /* ── compile: cull hidden voxels, centre, palette ── */
  const cache = new Map();
  function compile(key) {
    if (cache.has(key)) return cache.get(key);
    const [b, m] = builder(); (MODELS[key] || MODELS.clef)(b);
    const has = (x, y, z) => m.has(x + ',' + y + ',' + z);
    const vs = [...m.values()].filter(([x, y, z]) => !(has(x + 1, y, z) && has(x - 1, y, z) && has(x, y + 1, z) && has(x, y - 1, z) && has(x, y, z + 1) && has(x, y, z - 1)));
    let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9];
    for (const v of vs) for (let i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], v[i]); hi[i] = Math.max(hi[i], v[i]); }
    const c = [0, 1, 2].map((i) => (lo[i] + hi[i]) / 2);
    const pal = [], pIdx = new Map();
    const n = vs.length, X = new Float32Array(n), Y = new Float32Array(n), Z = new Float32Array(n), P = new Uint8Array(n), D = new Float32Array(n * 3);
    let rad = 1;
    vs.forEach(([x, y, z, col], i) => {
      if (!pIdx.has(col)) { pIdx.set(col, pal.length); pal.push([parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)]); }
      X[i] = x - c[0]; Y[i] = y - c[1]; Z[i] = z - c[2]; P[i] = pIdx.get(col);
      rad = Math.max(rad, Math.hypot(X[i], Y[i], Z[i]) + .9);
      const r = Math.hypot(X[i], Y[i], Z[i]) || 1, j = hashN(x, y, z) - .5;   // explode direction: outward + jitter
      D[i * 3] = X[i] / r + j; D[i * 3 + 1] = Y[i] / r + .6 + j * .5; D[i * 3 + 2] = Z[i] / r - j;
    });
    const out = { n, X, Y, Z, P, D, pal, rad };
    cache.set(key, out); return out;
  }

  /* ── render: orthographic, yaw θ + fixed pitch, painter's sort, 3 visible faces per cube ── */
  const FACES = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  const CORN = FACES.map(([a, b2, c]) => {
    const ax = a ? [[a * .5, -.5, -.5], [a * .5, .5, -.5], [a * .5, .5, .5], [a * .5, -.5, .5]] : b2 ? [[-.5, b2 * .5, -.5], [.5, b2 * .5, -.5], [.5, b2 * .5, .5], [-.5, b2 * .5, .5]] : [[-.5, -.5, c * .5], [.5, -.5, c * .5], [.5, .5, c * .5], [-.5, .5, c * .5]];
    return ax;
  });
  const PITCH = .52, CP = Math.cos(PITCH), SP = Math.sin(PITCH);
  const LIGHT = (() => { const l = [-.45, .8, .55]; const k = Math.hypot(...l); return l.map((v) => v / k); })();
  function draw(ctx, md, W, H, th, ex = 0, bob = 0) {
    ctx.clearRect(0, 0, W, H);
    const s = (Math.min(W, H) * .5) / md.rad * (1 - ex * .25), cx = W / 2, cy = H / 2 + bob;
    const ct = Math.cos(th), st = Math.sin(th);
    const rot = (x, y, z) => { const x1 = x * ct + z * st, z1 = -x * st + z * ct; return [x1, y * CP - z1 * SP, y * SP + z1 * CP]; };
    // per frame: rotated face normals, visibility, shade, projected corner offsets
    // dark theme: lift near-black voxels so nothing is dark-on-dark
    const dk = document.documentElement.getAttribute('data-ff-theme') === 'dark';
    const pal = dk ? md.pal.map((c) => (Math.max(...c) < 100 ? c.map((v) => v * .45 + 160 * .55) : c)) : md.pal;
    const vis = [];
    FACES.forEach((f, fi) => {
      const n = rot(...f); if (n[2] <= .02) return;
      const sh = .5 + .55 * Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
      vis.push({ off: CORN[fi].map((c) => { const r = rot(...c); return [r[0] * s, -r[1] * s]; }), cols: pal.map(([r, g, b]) => `rgb(${Math.min(255, r * sh) | 0},${Math.min(255, g * sh) | 0},${Math.min(255, b * sh) | 0})`) });
    });
    const n = md.n, SX = new Float32Array(n), SY = new Float32Array(n), DZ = new Float32Array(n), ord = new Uint16Array(n);
    const e = ex * ex * 22;
    for (let i = 0; i < n; i++) {
      const p = rot(md.X[i] + md.D[i * 3] * e, md.Y[i] + md.D[i * 3 + 1] * e - ex * ex * 4, md.Z[i] + md.D[i * 3 + 2] * e);
      SX[i] = cx + p[0] * s; SY[i] = cy - p[1] * s; DZ[i] = p[2]; ord[i] = i;
    }
    ord.sort((a, b) => DZ[a] - DZ[b]);
    // soft contact shadow
    if (ex < .5 && !md.noShadow) { ctx.globalAlpha = .16 * (1 - ex * 2); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(cx, cy + md.rad * s * .78, md.rad * s * .6, md.rad * s * .13, 0, 0, 7); ctx.fill(); }
    ctx.globalAlpha = ex > .55 ? Math.max(0, 1 - (ex - .55) / .45) : 1;
    for (let k = 0; k < n; k++) {
      const i = ord[k], x = SX[i], y = SY[i], p = md.P[i];
      for (const f of vis) {
        const o = f.off; ctx.fillStyle = f.cols[p]; ctx.beginPath();
        ctx.moveTo(x + o[0][0], y + o[0][1]); ctx.lineTo(x + o[1][0], y + o[1][1]); ctx.lineTo(x + o[2][0], y + o[2][1]); ctx.lineTo(x + o[3][0], y + o[3][1]); ctx.closePath(); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ── instances: idle rotation only while on screen ── */
  const live = new Set();
  const inst = new WeakMap();
  let raf = 0, last = 0;
  function tick(t) {
    raf = 0; const dt = Math.min(.1, (t - (last || t)) / 1000); last = t;
    for (const it of live) {
      it.th += dt * (it.hover ? 2.4 : .55); it.acc += dt;
      if (it.ex) { it.exT += dt; it.exV = it.exDir > 0 ? Math.min(1, it.exT / .75) : Math.max(0, 1 - it.exT / .9); if ((it.exDir > 0 && it.exV >= 1) || (it.exDir < 0 && it.exV <= 0)) { it.ex = 0; if (it.exDone) it.exDone(); } }
      if (it.acc >= it.step || it.ex) { it.acc = 0; draw(it.ctx, it.md, it.W, it.H, it.th, easeEx(it.exV), Math.sin(t / 700 + it.seed) * it.W * .015); }
    }
    if (live.size && !document.hidden) raf = requestAnimationFrame(tick);
  }
  const easeEx = (v) => 1 - (1 - v) * (1 - v);
  const kick = () => { if (!raf && live.size && !RM) { last = 0; raf = requestAnimationFrame(tick); } };
  document.addEventListener('visibilitychange', kick);
  const all = new Set();
  const paint = (it) => { it.drawn = 1; draw(it.ctx, it.md, it.W, it.H, it.th, easeEx(it.exV)); };
  // first paint happens only when an object comes near the viewport (161 objects on the archive page)
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => {
    const it = inst.get(e.target); if (!it) return;
    if (e.isIntersecting) { if (!it.drawn) paint(it); if (!RM) { live.add(it); kick(); } } else if (!it.pin) live.delete(it);
  }), { rootMargin: '120px' }) : null;
  // theme switch: repaint (the dark palette lifts near-black voxels)
  new MutationObserver(() => all.forEach((it) => it.drawn && paint(it))).observe(document.documentElement, { attributes: true, attributeFilter: ['data-ff-theme'] });

  function makeCanvas(el, px) {
    const cv = document.createElement('canvas');
    const css = el.getBoundingClientRect().width || 64;
    const W = Math.max(32, Math.round(css / px));   // low-res backing store, upscaled with image-rendering:pixelated
    cv.width = W; cv.height = W; cv.setAttribute('aria-hidden', 'true');
    return cv;
  }
  function mount(cv, key, opts = {}) {
    const md = compile(key), ctx = cv.getContext('2d');
    const it = { cv, ctx, md, W: cv.width, H: cv.height, th: opts.th ?? -.7 + (hashN(cv.width, md.n, 3) - .5), acc: 1, step: opts.step || 1 / 12, seed: md.n % 7, ex: 0, exV: 0, hover: false, pin: !!opts.pin };
    inst.set(cv, it); all.add(it);
    if (opts.pin || !io) { paint(it); if (!RM) { live.add(it); kick(); } } else io.observe(cv);
    return it;
  }
  function explode(it, dir, done) {
    if (RM) { it.exV = dir > 0 ? 1 : 0; draw(it.ctx, it.md, it.W, it.H, it.th, dir > 0 ? 1 : 0); done && done(); return; }
    it.ex = 1; it.exDir = dir; it.exT = 0; it.exDone = done; live.add(it); kick();
  }

  /* ── the sheet ── */
  let dlg, curBtn, sheetIt;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const jsonCache = new Map();
  const load = (slug) => { if (!jsonCache.has(slug)) jsonCache.set(slug, fetch(`/assets/pv/${LANG}/${slug}.json`).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))); return jsonCache.get(slug); };
  function sheet() {
    if (dlg) return dlg;
    dlg = document.createElement('dialog');
    dlg.className = 'ff-vsheet'; dlg.id = 'ff-vsheet'; dlg.setAttribute('aria-labelledby', 'ff-vs-t');
    dlg.addEventListener('close', () => {
      document.body.classList.remove('ff-vs-lock');
      if (sheetIt) { live.delete(sheetIt); all.delete(sheetIt); sheetIt = null; }
      if (curBtn) { curBtn.setAttribute('aria-expanded', 'false'); const it = inst.get(curBtn.querySelector('canvas')); if (it) { it.cv.style.visibility = ''; it.exV = 1; explode(it, -1); } curBtn.focus({ preventScroll: true }); }
    });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    document.body.appendChild(dlg);
    return dlg;
  }
  function render(d, key) {
    const lg = (x) => (x && x.lg && LANG !== 'it' ? ' lang="it"' : '');
    const num = d.n >= 0 ? `ff.${d.n}` : '';
    let i = 0;
    return `<div class="ff-vs-in">
      <div class="ff-vs-top"><canvas class="ff-vs-cv" width="64" height="64" aria-hidden="true"></canvas>
        <div><p class="ff-eyebrow">${esc([num, d.d].filter(Boolean).join(' · '))}</p><h2 id="ff-vs-t"${lg(d)}>${esc(d.t)}</h2></div>
        <button type="button" class="ff-vs-x" aria-label="${esc(S.close)}">×</button></div>
      ${d.st ? `<p class="ff-vs-st" style="--i:${i++}"${lg(d)}>${esc(d.st)}</p>` : ''}
      <ol class="ff-vs-secs" aria-label="${esc(`${d.sec.length} ${S.secs}`)}">${d.sec.map((x, k) => `<li style="--i:${i++}"${lg(x)}>
        ${/^ff\.\d/.test(x.t) ? '' : `<span class="ff-vs-n">${d.n >= 0 ? `ff.${d.n}.${k + 1}` : k + 1}</span>`}
        <h3>${esc(x.t)}</h3>${x.p ? `<p>${esc(x.p)}</p>` : ''}
        <a href="${esc(d.u)}#${esc(x.a)}" aria-label="${esc(`${S.read}: ${x.t}`)}">${esc(S.read)} →</a></li>`).join('')}</ol>
      <div class="ff-vs-foot" style="--i:${i++}"><a class="ff-btn ff-btn-primary" href="${esc(d.u)}">${esc(S.issue)} →</a>${d.o ? `<a href="${esc(d.o)}" target="_blank" rel="noopener noreferrer">${esc(S.sub)}</a>` : ''}</div>
      ${d.th && d.th.length ? `<p class="ff-vs-meta" style="--i:${i++}"><b>${esc(S.th)}</b>${d.th.map(([l, h]) => `<a href="${esc(h)}">${esc(l)}</a>`).join(' · ')}</p>` : ''}
      ${d.rel && d.rel.length ? `<p class="ff-vs-meta" style="--i:${i++}"><b>${esc(S.rel)}</b>${d.rel.map(([l, h]) => `<a href="${esc(h)}">${esc(l)}</a>`).join(' · ')}</p>` : ''}
    </div>`;
  }
  async function open(btn) {
    const key = btn.dataset.key, slug = btn.dataset.slug;
    curBtn = btn; btn.setAttribute('aria-expanded', 'true');
    const it = inst.get(btn.querySelector('canvas'));
    const d = sheet();
    const p = load(slug);
    const show = async () => {
      d.innerHTML = `<div class="ff-vs-in"><p class="ff-vs-load">${esc(S.load)}</p></div>`;
      if (!d.open) { d.showModal(); document.body.classList.add('ff-vs-lock'); }
      let data; try { data = await p; } catch { d.innerHTML = `<div class="ff-vs-in"><div class="ff-vs-top"><p class="ff-vs-load">${esc(S.err)}</p><button type="button" class="ff-vs-x" aria-label="${esc(S.close)}">×</button></div></div>`; d.querySelector('.ff-vs-x').onclick = () => d.close(); return; }
      d.innerHTML = render(data, key);
      d.querySelector('.ff-vs-x').onclick = () => d.close();
      const cv = d.querySelector('.ff-vs-cv');
      sheetIt = mount(cv, key, { pin: true, step: 1 / 30, th: it ? it.th : -.7 });
      sheetIt.exV = 1; explode(sheetIt, -1);   // voxels fly in and re-assemble at the top of the sheet
      d.querySelector('.ff-vs-x').focus({ preventScroll: true });
    };
    if (!it || RM) { show(); return; }
    // burst: the object explodes on a larger transparent layer above the page, so the voxels really fly out
    const r = btn.getBoundingClientRect(), size = Math.max(220, r.width * 3.2);
    const px = r.width / it.W;
    const cv = document.createElement('canvas');
    cv.className = 'ff-vox-burst'; cv.setAttribute('aria-hidden', 'true');
    cv.width = cv.height = Math.round(size / px);
    Object.assign(cv.style, { left: `${r.left + r.width / 2 - size / 2}px`, top: `${r.top + r.height / 2 - size / 2}px`, width: `${size}px`, height: `${size}px` });
    document.body.appendChild(cv);
    const b = mount(cv, key, { pin: true, step: 1 / 60, th: it.th });
    b.md = { ...b.md, rad: b.md.rad * (size / r.width), noShadow: 1 };   // same on-screen scale as the small object
    it.cv.style.visibility = 'hidden'; it.exV = 1;
    explode(b, 1, () => { live.delete(b); all.delete(b); cv.remove(); });
    setTimeout(show, 330);
  }

  /* ── enhance placeholders ── */
  function enhance(el) {
    if (el.dataset.on) return; el.dataset.on = '1';
    const key = el.dataset.ffVox, slug = el.dataset.ffSlug;
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'ff-vox-btn';
    btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'ff-vsheet'); btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-label', el.dataset.label || slug); btn.title = el.dataset.label || '';
    btn.dataset.key = key; btn.dataset.slug = slug;
    el.appendChild(btn);
    const cv = makeCanvas(el, el.classList.contains('ff-vox-lg') ? 2.2 : 1.6);
    btn.appendChild(cv);
    const it = mount(cv, key);
    btn.addEventListener('pointerenter', () => { it.hover = true; load(slug); live.add(it); kick(); });
    btn.addEventListener('pointerleave', () => { it.hover = false; });
    btn.addEventListener('focus', () => load(slug));
    btn.addEventListener('click', (e) => { e.preventDefault(); open(btn); });
  }
  const enhanceAll = () => { const els = document.querySelectorAll('.ff-vox[data-ff-vox]:not([data-on])'); if (els.length) sheet(); els.forEach(enhance); };
  enhanceAll();
  window.ffVoxEnhance = enhanceAll;
  window.ffVoxModels = Object.keys(MODELS);
  window.ffVoxDraw = (cv, key, th = -.7, ex = 0) => draw(cv.getContext('2d'), compile(key), cv.width, cv.height, th, ex);
})();

/* ff-app.js — progressive enhancement for every page: global search ('/' or Ctrl/⌘+K),
   menus, language switch that keeps the position, reading progress, share / copy link,
   sticky subscribe, active table of contents, offline service worker. No dependencies. */
(function () {
  'use strict';
  var d = document, html = d.documentElement, lang = (html.lang || 'it').slice(0, 2);
  if (['it', 'en', 'hi'].indexOf(lang) < 0) lang = 'it';
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  function toast(msg) {
    var t = d.createElement('div'); t.className = 'ff-toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    d.body.appendChild(t); setTimeout(function () { t.remove(); }, 1800);
  }

  // ── language switch keeps ?q= and #anchor ──
  $$('[data-keep-state]').forEach(function (a) {
    a.addEventListener('click', function () { a.href = a.getAttribute('href').split(/[?#]/)[0] + location.search + location.hash; });
  });

  // ── "more" menus: close on outside click / Esc ──
  d.addEventListener('click', function (e) {
    $$('details.ff-more[open]').forEach(function (m) { if (!m.contains(e.target)) m.removeAttribute('open'); });
  });

  // ── global search ──
  var dlg = $('#ff-search'), input = dlg && $('input', dlg), list = dlg && $('ul', dlg), data = null, sel = -1;
  var norm = function (s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
  function load() {
    if (data) return Promise.resolve(data);
    return fetch('/assets/site-index-' + lang + '.json').then(function (r) { return r.json(); }).then(function (j) {
      data = j.map(function (r) { r._k = norm(r.t + ' ' + r.st + ' ' + r.s.replace('-', '.')); r.sec.forEach(function (x) { x._k = norm(x.t); }); return r; });
      return data;
    });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hl(s, terms) {
    var out = esc(s);
    terms.forEach(function (t) { if (t.length > 1) out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); });
    return out;
  }
  function render(q) {
    var terms = norm(q).split(/\s+/).filter(Boolean), res = [];
    if (!terms.length) {
      res = data.slice(0, 8).map(function (r) { return { r: r }; });
    } else {
      data.forEach(function (r) {
        var hit = terms.every(function (t) { return r._k.indexOf(t) >= 0 || r.sec.some(function (x) { return x._k.indexOf(t) >= 0; }); });
        if (!hit) return;
        var secs = r.sec.filter(function (x) { return terms.some(function (t) { return x._k.indexOf(t) >= 0; }); });
        var score = terms.reduce(function (a, t) { return a + (norm(r.t).indexOf(t) >= 0 ? 3 : 0) + (r._k.indexOf(t) >= 0 ? 1 : 0); }, 0) + secs.length;
        res.push({ r: r, secs: secs, score: score });
      });
      res.sort(function (a, b) { return b.score - a.score || b.r.n - a.r.n; });
      res = res.slice(0, 20);
    }
    sel = res.length ? 0 : -1;
    var it = function (r) { return r.it ? ' lang="it"' : ''; };
    list.innerHTML = res.length ? res.map(function (x, i) {
      var r = x.r, sec = (x.secs || [])[0];
      var href = sec ? r.u + '#' + sec.a : r.u;
      return '<li><a href="' + href + '" role="option" id="ff-r' + i + '"' + (i === 0 ? ' aria-selected="true"' : '') + '><span class="ff-r-t"' + it(r) + '>' + hl(r.t, terms) + '</span>' +
        '<span class="ff-r-s"' + it(r) + '>' + (sec ? '§ ' + hl(sec.t, terms) : hl(r.st || '', terms)) + (r.d ? ' · ' + r.d.slice(0, 7) : '') + '</span></a></li>';
    }).join('') : '<li class="ff-r-none" style="padding:14px">' + esc(dlg.dataset.empty) + '</li>';
    var all = $('[data-ff-all]', dlg);
    if (all) all.href = all.dataset.base + (q ? '?q=' + encodeURIComponent(q) : '');
  }
  function openSearch(prefill) {
    if (!dlg) return;
    var local = $('[data-ff-local-search]');
    if (local && !prefill) { local.focus(); local.scrollIntoView({ block: 'center' }); return; }
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    if (prefill) input.value = prefill;
    input.focus(); input.select();
    load().then(function () { render(input.value); }).catch(function () { list.innerHTML = '<li style="padding:14px">offline</li>'; });
  }
  if (dlg) {
    $$('[data-ff-search]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openSearch(); }); });
    input.addEventListener('input', function () { if (data) render(input.value); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    $('[data-ff-close]', dlg).addEventListener('click', function () { dlg.close(); });
    $('form', dlg).addEventListener('submit', function (e) {
      e.preventDefault();
      var a = $('a[aria-selected="true"]', list); if (a) location.href = a.href;
    });
    input.addEventListener('keydown', function (e) {
      var items = $$('a', list); if (!items.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items.forEach(function (a, i) { a.setAttribute('aria-selected', i === sel ? 'true' : 'false'); });
        items[sel].scrollIntoView({ block: 'nearest' }); input.setAttribute('aria-activedescendant', items[sel].id);
      }
    });
  }
  d.addEventListener('keydown', function (e) {
    var t = e.target, typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape') $$('details.ff-more[open]').forEach(function (m) { m.removeAttribute('open'); });
  });

  // ── reading progress ──
  var bar = $('.ff-progress span'), article = $('article[data-ff-article]');
  var sticky = $('.ff-sticky-sub'), endCta = $('[data-ff-end-cta]');
  var dismissed = false;
  try { dismissed = Number(localStorage.getItem('ff-sub-x') || 0) > Date.now(); } catch (e) {}
  function onScroll() {
    var h = d.documentElement, max = h.scrollHeight - h.clientHeight, p = max > 0 ? h.scrollTop / max : 0;
    if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
    if (sticky && !dismissed) {
      var nearEnd = endCta && endCta.getBoundingClientRect().top < h.clientHeight;
      sticky.classList.toggle('is-on', p > 0.25 && !nearEnd);
    }
  }
  var ticking = false;
  function onScrollRaf() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); } }
  if (bar || sticky) d.addEventListener('scroll', onScrollRaf, { passive: true });
  if (sticky) $('[data-ff-dismiss]', sticky).addEventListener('click', function () {
    dismissed = true; sticky.classList.remove('is-on');
    try { localStorage.setItem('ff-sub-x', String(Date.now() + 14 * 864e5)); } catch (e) {}
  });

  // ── share / copy link ──
  $$('[data-ff-share]').forEach(function (b) {
    b.addEventListener('click', function () {
      var url = b.dataset.url || location.href.split('#')[0], title = d.title;
      if (navigator.share) navigator.share({ title: title, url: url }).catch(function () {});
      else copy(url, b);
    });
  });
  function copy(url, b) {
    var done = function () { toast(b.dataset.done || 'OK'); b.classList.add('is-done'); setTimeout(function () { b.classList.remove('is-done'); }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { prompt('', url); });
    else { prompt('', url); }
  }
  $$('[data-ff-copy]').forEach(function (b) { b.addEventListener('click', function () { copy(b.dataset.url || location.href.split('#')[0], b); }); });

  // ── table of contents: highlight the section being read ──
  var tocLinks = $$('.ff-toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {}; tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting && map[en.target.id]) { tocLinks.forEach(function (a) { a.classList.remove('is-active'); }); map[en.target.id].classList.add('is-active'); } });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { var el = d.getElementById(id); if (el) io.observe(el); });
  }

  // ── light / dark theme: saved choice wins, otherwise follow the system; circular reveal where supported ──
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function saved() { try { return localStorage.getItem('ff-theme'); } catch (e) { return null; } }
  function applyTheme(t) {
    html.setAttribute('data-ff-theme', t);
    $$('meta[name="theme-color"]').forEach(function (m) { if (!m.media) m.content = t === 'dark' ? '#0f1013' : '#f8f6f1'; });
    $$('[data-ff-theme-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false'); });
  }
  applyTheme(html.getAttribute('data-ff-theme') || (mq && mq.matches ? 'dark' : 'light'));
  if (mq && mq.addEventListener) mq.addEventListener('change', function (e) { if (!saved()) applyTheme(e.matches ? 'dark' : 'light'); });
  $$('[data-ff-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      var next = html.getAttribute('data-ff-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('ff-theme', next); } catch (err) {}
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!d.startViewTransition || reduce) { applyTheme(next); return; }
      var r = b.getBoundingClientRect();
      html.style.setProperty('--ff-vt-x', Math.round(r.left + r.width / 2) + 'px');
      html.style.setProperty('--ff-vt-y', Math.round(r.top + r.height / 2) + 'px');
      html.classList.add('ff-theme-vt');
      var vt = d.startViewTransition(function () { applyTheme(next); });
      vt.finished.finally(function () { html.classList.remove('ff-theme-vt'); });
    });
  });

  // ── cover images: fade in over their blurred placeholder once decoded ──
  $$('img.ff-card-img').forEach(function (img) {
    if (img.complete && img.naturalWidth) return;
    img.classList.add('is-loading');
    var done = function () { img.classList.remove('is-loading'); };
    img.addEventListener('load', done); img.addEventListener('error', done);
  });

  // ── 3D voxel objects: the renderer loads only after the page is idle and one is near the viewport (never on the LCP path) ──
  (function () {
    var spots = d.querySelectorAll('.ff-vox[data-ff-vox]');
    if (!spots.length) return;
    var loaded = false;
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 300); };
    function go() { if (loaded) return; loaded = true; var s = d.createElement('script'); s.src = '/assets/ff-voxel.js?v=4'; s.async = true; d.head.appendChild(s); }
    function start() {
      if (!('IntersectionObserver' in window)) { idle(go); return; }
      var o = new IntersectionObserver(function (es) {
        for (var i = 0; i < es.length; i++) if (es[i].isIntersecting) { o.disconnect(); idle(go, { timeout: 2000 }); return; }
      }, { rootMargin: '300px' });
      spots.forEach(function (s) { o.observe(s); });
    }
    if (d.readyState === 'complete') start(); else window.addEventListener('load', start);
  })();

  // ── offline reading of visited pages ──
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
  }
})();

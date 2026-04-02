/**
 * chapter-ui.js — Shared UI for FF book subchapter pages
 * Features: full book navigation, in-page search with highlight, bibliography back-links
 * Self-contained: injects its own CSS, no external dependencies
 */
(function () {
  'use strict';
  if (window.__ffChapterUI) return;
  window.__ffChapterUI = true;

  // ─── Book structure ─────────────────────────────────────────────
  var BOOK = [
    { n:1, emoji:'🌿', title:'Natura', color:'#2ecc71', subs:[
      { num:'1.1', title:'Mobilità e Città', slug:'mobilita' },
      { num:'1.2', title:'Ambiente ed Energia', slug:'ambiente' },
      { num:'1.3', title:'Cibo e Fashion', slug:'cibo' }
    ]},
    { n:2, emoji:'💻', title:'Tecnologia', color:'#4a90e2', subs:[
      { num:'2.1', title:'Robotica e AI', slug:'robotica' },
      { num:'2.2', title:'Metaverso e Criptovalute', slug:'metaverso' },
      { num:'2.3', title:'Prodotti di consumo', slug:'prodotti' }
    ]},
    { n:3, emoji:'❤️', title:'Società', color:'#d0021b', subs:[
      { num:'3.1', title:'Psicologia e Wellbeing', slug:'psicologia' },
      { num:'3.2', title:'Alimentazione e Sport', slug:'alimentazione' },
      { num:'3.3', title:'Cultura e Demografia', slug:'cultura' }
    ]}
  ];

  // Detect current page
  var currentSlug = location.pathname.replace(/.*chapter-0\d-/, '').replace('.html', '');
  var currentChapter = location.pathname.match(/chapter-0(\d)/);
  var currentChNum = currentChapter ? parseInt(currentChapter[1]) : 0;

  // ─── CSS ────────────────────────────────────────────────────────
  var css = `
    .ff-panel{position:fixed;top:0;left:0;width:320px;height:100vh;background:#0a0a0a;color:#fff;transform:translateX(-100%);transition:transform .3s ease;z-index:50;overflow-y:auto;box-sizing:border-box;display:flex;flex-direction:column}
    .ff-panel.is-open{transform:translateX(0)}
    .ff-panel__header{padding:1rem 1rem 0.5rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.1)}
    .ff-panel__close{background:none;border:none;color:rgba(255,255,255,0.5);font-size:1.4rem;cursor:pointer;padding:4px 8px;line-height:1}
    .ff-panel__close:hover{color:#fff}
    .ff-panel__brand{font-family:"IBM Plex Mono",monospace;font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35)}
    .ff-panel__search{padding:0.75rem 1rem;border-bottom:1px solid rgba(255,255,255,0.08)}
    .ff-panel__search input{width:100%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;padding:8px 12px;font-size:0.85rem;font-family:"Inter",sans-serif;box-sizing:border-box;outline:none;border-radius:4px}
    .ff-panel__search input:focus{border-color:var(--accent,#2ecc71)}
    .ff-panel__search input::placeholder{color:rgba(255,255,255,0.3)}
    .ff-panel__nav{flex:1;overflow-y:auto;padding:0.5rem 0}
    .ff-panel__chapter{padding:0.5rem 1rem}
    .ff-panel__chapter-title{font-family:"IBM Plex Mono",monospace;font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:0 0 0.3rem;display:flex;align-items:center;gap:6px}
    .ff-panel__chapter-title span{font-size:1.1em}
    .ff-panel__sub{display:block;color:rgba(255,255,255,0.7);text-decoration:none;padding:6px 8px 6px 16px;font-size:0.85rem;border-left:2px solid transparent;transition:all .15s;line-height:1.35}
    .ff-panel__sub:hover{color:#fff;border-left-color:rgba(255,255,255,0.3);background:rgba(255,255,255,0.04)}
    .ff-panel__sub.is-current{color:#fff;border-left-color:var(--accent,#2ecc71);font-weight:600}
    .ff-panel__sub .ff-sub-num{font-family:"IBM Plex Mono",monospace;font-size:0.75rem;color:rgba(255,255,255,0.4);margin-right:4px}
    .ff-panel__heading{display:block;color:rgba(255,255,255,0.5);text-decoration:none;padding:3px 8px 3px 32px;font-size:0.78rem;transition:color .15s;line-height:1.3}
    .ff-panel__heading:hover,.ff-panel__heading.is-active{color:rgba(255,255,255,0.9)}
    .ff-panel__heading.is-active{border-left:2px solid var(--accent,#2ecc71);margin-left:-2px}
    .ff-panel__divider{height:1px;background:rgba(255,255,255,0.06);margin:0.3rem 1rem}
    .ff-toggle{position:fixed;left:0;top:50%;transform:translateY(-50%);width:40px;height:52px;background:#0a0a0a;color:#fff;border:none;border-radius:0 8px 8px 0;cursor:pointer;z-index:49;font-size:1.2rem;display:flex;align-items:center;justify-content:center;transition:background .2s;box-shadow:2px 0 8px rgba(0,0,0,0.15)}
    .ff-toggle:hover{background:var(--accent,#2ecc71)}
    .ff-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:48;opacity:0;pointer-events:none;transition:opacity .3s}
    .ff-backdrop.is-open{opacity:1;pointer-events:auto}

    /* Search results in panel */
    .ff-search-results{padding:0 1rem;max-height:60vh;overflow-y:auto}
    .ff-search-result{display:block;padding:8px 10px;margin-bottom:4px;background:rgba(255,255,255,0.04);border-left:3px solid var(--accent,#2ecc71);color:rgba(255,255,255,0.8);text-decoration:none;font-size:0.8rem;line-height:1.4;transition:background .15s}
    .ff-search-result:hover{background:rgba(255,255,255,0.08)}
    .ff-search-result mark{background:rgba(46,204,113,0.35);color:#fff;padding:0 2px;font-style:normal}
    .ff-search-no-results{color:rgba(255,255,255,0.3);font-size:0.8rem;padding:1rem;text-align:center}

    /* In-page search highlight */
    .ff-search-match{background:rgba(245,166,35,0.35);border-radius:2px;scroll-margin-top:80px}

    /* Flash for bibliography */
    @keyframes ff-flash-bg{0%{background:rgba(74,144,226,0.25)}100%{background:transparent}}
    .flash-highlight{animation:ff-flash-bg 1.5s ease-out}

    /* Mobile */
    @media(max-width:768px){
      .ff-toggle{top:auto;bottom:20px;left:auto;right:16px;transform:none;width:52px;height:52px;border-radius:50%;box-shadow:0 2px 12px rgba(0,0,0,0.35);font-size:1.4rem;z-index:51}
      .ff-panel{width:88vw}
    }
    @media(prefers-reduced-motion:reduce){.ff-panel,.ff-backdrop,.flash-highlight{transition-duration:0.01ms!important;animation-duration:0.01ms!important}}
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  function init() {
    buildPanel();
    buildBibliographyLinks();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  // ═══════════════════════════════════════════════════════════════════
  // 1. NAVIGATION PANEL with search
  // ═══════════════════════════════════════════════════════════════════
  function buildPanel() {
    // Backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'ff-backdrop';
    document.body.appendChild(backdrop);

    // Panel
    var panel = document.createElement('aside');
    panel.className = 'ff-panel';
    panel.setAttribute('role', 'navigation');
    panel.setAttribute('aria-label', 'Navigazione libro');

    // Header
    var header = document.createElement('div');
    header.className = 'ff-panel__header';
    header.innerHTML = '<span class="ff-panel__brand">Futuro Fortissimo</span>';
    var closeBtn = document.createElement('button');
    closeBtn.className = 'ff-panel__close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Chiudi');
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // Search box
    var searchDiv = document.createElement('div');
    searchDiv.className = 'ff-panel__search';
    var searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = 'Cerca nel libro...';
    searchInput.setAttribute('aria-label', 'Cerca');
    searchDiv.appendChild(searchInput);
    panel.appendChild(searchDiv);

    // Search results container
    var searchResults = document.createElement('div');
    searchResults.className = 'ff-search-results';
    searchResults.style.display = 'none';
    panel.appendChild(searchResults);

    // Nav
    var nav = document.createElement('div');
    nav.className = 'ff-panel__nav';

    // Home link
    var homeLink = document.createElement('a');
    homeLink.href = '/book/';
    homeLink.className = 'ff-panel__sub';
    homeLink.style.cssText = 'padding-left:1rem;margin-bottom:0.5rem;font-weight:600;';
    homeLink.textContent = '📖 Indice del libro';
    nav.appendChild(homeLink);

    // Build chapter structure
    BOOK.forEach(function (ch) {
      var div = document.createElement('div');
      div.className = 'ff-panel__chapter';

      var title = document.createElement('div');
      title.className = 'ff-panel__chapter-title';
      title.innerHTML = '<span>' + ch.emoji + '</span> Cap. ' + ch.n + ' — ' + ch.title;
      div.appendChild(title);

      ch.subs.forEach(function (sub) {
        var a = document.createElement('a');
        a.href = '/book/chapter-0' + ch.n + '-' + sub.slug + '.html';
        a.className = 'ff-panel__sub';
        if (ch.n === currentChNum && sub.slug === currentSlug) {
          a.classList.add('is-current');
        }
        a.innerHTML = '<span class="ff-sub-num">' + sub.num + '</span> ' + sub.title;
        div.appendChild(a);
      });

      nav.appendChild(div);

      // Add in-page headings for current subchapter
      if (ch.n === currentChNum) {
        ch.subs.forEach(function (sub) {
          if (sub.slug === currentSlug) {
            var headings = document.querySelectorAll('h3[id]');
            headings.forEach(function (h) {
              var ha = document.createElement('a');
              ha.href = '#' + h.id;
              ha.className = 'ff-panel__heading';
              ha.textContent = h.textContent.replace(/^\s+|\s+$/g, '');
              ha.setAttribute('data-target', h.id);
              ha.addEventListener('click', function (e) {
                e.preventDefault();
                document.getElementById(h.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (window.innerWidth <= 768) closePanel();
              });
              div.appendChild(ha);
            });
          }
        });
      }

      var divider = document.createElement('div');
      divider.className = 'ff-panel__divider';
      nav.appendChild(divider);
    });

    panel.appendChild(nav);
    document.body.appendChild(panel);

    // Toggle button
    var toggle = document.createElement('button');
    toggle.className = 'ff-toggle';
    toggle.innerHTML = '&#9776;';
    toggle.setAttribute('aria-label', 'Menu libro');
    document.body.appendChild(toggle);

    // Open/close
    function openPanel() {
      panel.classList.add('is-open');
      backdrop.classList.add('is-open');
      searchInput.focus();
    }
    function closePanel() {
      panel.classList.remove('is-open');
      backdrop.classList.remove('is-open');
    }
    toggle.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);
    backdrop.addEventListener('click', closePanel);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
    });

    // Active heading tracking
    var headingLinks = nav.querySelectorAll('.ff-panel__heading');
    if ('IntersectionObserver' in window && headingLinks.length) {
      var currentActive = null;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (currentActive) currentActive.classList.remove('is-active');
            var match = nav.querySelector('.ff-panel__heading[data-target="' + entry.target.id + '"]');
            if (match) { match.classList.add('is-active'); currentActive = match; }
          }
        });
      }, { rootMargin: '-10% 0px -80% 0px', threshold: 0 });
      document.querySelectorAll('h3[id]').forEach(function (h) { observer.observe(h); });
    }

    // ─── SEARCH ──────────────────────────────────────────────────
    var debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () { doSearch(searchInput.value.trim()); }, 250);
    });

    function doSearch(query) {
      // Clear previous highlights
      document.querySelectorAll('.ff-search-match').forEach(function (el) {
        var parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
      });

      if (query.length < 2) {
        searchResults.style.display = 'none';
        nav.style.display = '';
        return;
      }

      nav.style.display = 'none';
      searchResults.style.display = '';
      searchResults.innerHTML = '';

      // Search in current page prose
      var paragraphs = document.querySelectorAll('article.prose p, article.prose blockquote');
      var results = [];
      var re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');

      paragraphs.forEach(function (p) {
        var text = p.textContent;
        if (re.test(text)) {
          // Find nearest heading
          var heading = '';
          var prev = p;
          while (prev = prev.previousElementSibling) {
            if (prev.tagName === 'H3' || prev.tagName === 'H2') { heading = prev.textContent.trim(); break; }
          }

          // Create snippet
          var idx = text.toLowerCase().indexOf(query.toLowerCase());
          var start = Math.max(0, idx - 40);
          var end = Math.min(text.length, idx + query.length + 60);
          var snippet = (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');

          results.push({ el: p, heading: heading, snippet: snippet, query: query });

          // Highlight in text
          highlightInElement(p, re);
        }
        re.lastIndex = 0;
      });

      if (results.length === 0) {
        searchResults.innerHTML = '<div class="ff-search-no-results">Nessun risultato per "' + query + '"</div>';
        return;
      }

      results.slice(0, 20).forEach(function (r) {
        var a = document.createElement('a');
        a.className = 'ff-search-result';
        a.href = '#';
        var highlighted = r.snippet.replace(re, '<mark>$1</mark>');
        a.innerHTML = (r.heading ? '<strong style="font-size:0.7rem;color:rgba(255,255,255,0.4);display:block;margin-bottom:2px;">' + r.heading + '</strong>' : '') + highlighted;
        a.addEventListener('click', function (e) {
          e.preventDefault();
          r.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          r.el.classList.remove('flash-highlight');
          void r.el.offsetWidth;
          r.el.classList.add('flash-highlight');
          setTimeout(function () { r.el.classList.remove('flash-highlight'); }, 1500);
          if (window.innerWidth <= 768) closePanel();
        });
        searchResults.appendChild(a);
      });

      if (results.length > 20) {
        var more = document.createElement('div');
        more.className = 'ff-search-no-results';
        more.textContent = '+ ' + (results.length - 20) + ' altri risultati';
        searchResults.appendChild(more);
      }
    }

    function highlightInElement(el, regex) {
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
      var textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      textNodes.forEach(function (node) {
        if (!regex.test(node.textContent)) { regex.lastIndex = 0; return; }
        regex.lastIndex = 0;
        var parts = node.textContent.split(regex);
        if (parts.length <= 1) return;
        var frag = document.createDocumentFragment();
        parts.forEach(function (part, i) {
          if (i % 2 === 0) {
            frag.appendChild(document.createTextNode(part));
          } else {
            var mark = document.createElement('mark');
            mark.className = 'ff-search-match';
            mark.textContent = part;
            frag.appendChild(mark);
          }
        });
        node.parentNode.replaceChild(frag, node);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // 2. BIBLIOGRAPHY BACK-LINKS
  // ═══════════════════════════════════════════════════════════════════
  function buildBibliographyLinks() {
    var fonti = document.querySelectorAll('[id^="fonte-"]');
    if (!fonti.length) return;

    var contentLinks = document.querySelectorAll('article.prose a[href]');

    function normalizeUrl(url) {
      try { var u = new URL(url, location.href); return u.origin + u.pathname.replace(/\/+$/, '') + u.search; }
      catch (e) { return url.replace(/\/+$/, ''); }
    }

    fonti.forEach(function (li) {
      var fonteAnchor = li.querySelector('a');
      if (!fonteAnchor) return;
      var fonteUrl = fonteAnchor.getAttribute('href');
      if (!fonteUrl || fonteUrl.startsWith('#')) return;

      var normalizedFonte = normalizeUrl(fonteUrl);
      var match = null;

      for (var i = 0; i < contentLinks.length; i++) {
        var href = contentLinks[i].getAttribute('href');
        if (!href || href.startsWith('#')) continue;
        if (href === fonteUrl || normalizeUrl(href) === normalizedFonte) {
          match = contentLinks[i];
          break;
        }
      }
      if (!match) return;

      var para = match.closest('p') || match.closest('blockquote');
      if (!para) return;

      var fonteId = li.id;
      var refId = 'ref-' + fonteId;
      if (!para.id) para.id = refId;
      else refId = para.id;

      // Back-link ↩ in bibliography
      var backLink = document.createElement('a');
      backLink.href = '#' + refId;
      backLink.textContent = ' \u21A9';
      backLink.style.cssText = 'color:var(--accent,#2ecc71);text-decoration:none;font-size:0.85rem;margin-left:6px;cursor:pointer;';
      backLink.addEventListener('click', function (e) {
        e.preventDefault();
        var t = document.getElementById(refId);
        if (!t) return;
        t.scrollIntoView({ behavior: 'smooth', block: 'center' });
        t.classList.remove('flash-highlight'); void t.offsetWidth;
        t.classList.add('flash-highlight');
        setTimeout(function () { t.classList.remove('flash-highlight'); }, 1500);
      });
      li.appendChild(backLink);

      // Superscript [N] in prose
      var refLink = document.createElement('a');
      refLink.href = '#' + fonteId;
      refLink.textContent = ' [' + fonteId.replace('fonte-', '') + ']';
      refLink.style.cssText = 'color:var(--accent,#2ecc71);text-decoration:none;font-size:0.65rem;font-family:"IBM Plex Mono",monospace;margin-left:2px;cursor:pointer;vertical-align:super;';
      refLink.addEventListener('click', function (e) {
        e.preventDefault();
        var t = document.getElementById(fonteId);
        if (!t) return;
        t.scrollIntoView({ behavior: 'smooth', block: 'center' });
        t.classList.remove('flash-highlight'); void t.offsetWidth;
        t.classList.add('flash-highlight');
        setTimeout(function () { t.classList.remove('flash-highlight'); }, 1500);
      });
      if (match.nextSibling) match.parentNode.insertBefore(refLink, match.nextSibling);
      else match.parentNode.appendChild(refLink);
    });
  }

  // ─── .fc click handler — convert ff.x.y spans to Substack links ──
  (function initFcLinks() {
    var fcSpans = document.querySelectorAll('.fc');
    if (!fcSpans.length) return;

    // Resolve paths relative to book/ parent
    var canonicalUrl = (window.location.pathname.indexOf('/book/') !== -1)
      ? '../canonical_substack_map.json'
      : 'canonical_substack_map.json';
    var nlUrl = (window.location.pathname.indexOf('/book/') !== -1)
      ? '../newsletter_data.json'
      : 'newsletter_data.json';

    // Load canonical map (proven sitemap URLs), then newsletter_data as fallback
    Promise.all([
      fetch(canonicalUrl).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }),
      fetch(nlUrl).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; })
    ]).then(function (results) {
      var canonical = results[0] || {};
      var nlData = results[1] || [];

      // Build fallback map from newsletter_data.json
      var nlMap = {};
      (Array.isArray(nlData) ? nlData : []).forEach(function (entry) {
        var bl = entry.buttonLabel || '';
        var sl = entry.substackLink || '';
        var m = bl.match(/ff\.(\d+)/);
        if (m && sl && !nlMap[m[1]]) nlMap[m[1]] = sl;
      });

      // Canonical wins, then newsletter_data, then generic fallback
      convertFcSpans(canonical, nlMap);
    });

    function convertFcSpans(canonical, nlMap) {
      document.querySelectorAll('.fc').forEach(function (el) {
        var text = el.textContent || '';
        var m = text.match(/ff\.(\d+)/);
        if (!m) return;

        var num = m[1];
        var url = canonical[num] || nlMap[num] || ('https://fortissimo.substack.com/p/ff' + num);
        var a = document.createElement('a');
        a.href = url;
        a.className = el.className;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = text.trim();
        a.style.cursor = 'pointer';
        el.replaceWith(a);
      });
    }
  })();

})();

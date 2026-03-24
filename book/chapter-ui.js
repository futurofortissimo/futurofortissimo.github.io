/**
 * chapter-ui.js — Shared UI enhancements for FF book chapters
 * Features: side panel navigation, sticky search, bibliography back-links
 * Self-contained: injects its own CSS, no external dependencies
 */
(function () {
  'use strict';

  // Idempotency guard
  if (window.__ffChapterUI) return;
  window.__ffChapterUI = true;

  // ─── CSS injection ───────────────────────────────────────────────
  var css = [
    /* Side panel */
    '.ff-side-panel{position:fixed;top:0;left:0;width:280px;height:100vh;background:rgba(10,10,10,0.96);color:#fff;transform:translateX(-100%);transition:transform .3s ease;z-index:50;overflow-y:auto;padding:1.5rem;box-sizing:border-box}',
    '.ff-side-panel.is-open{transform:translateX(0)}',
    '.ff-side-panel__close{position:absolute;top:12px;right:14px;background:none;border:none;color:rgba(255,255,255,0.6);font-size:1.3rem;cursor:pointer;padding:4px 8px;line-height:1;transition:color .15s}',
    '.ff-side-panel__close:hover{color:#fff}',
    '.ff-side-panel__title{font-family:"IBM Plex Mono",monospace;font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin:0 0 1rem 0;padding-bottom:0.5rem;border-bottom:1px solid rgba(255,255,255,0.1)}',
    '.ff-side-panel__nav a{color:rgba(255,255,255,0.7);text-decoration:none;display:block;padding:6px 0 6px 8px;font-size:0.85rem;transition:color .15s,border-left-color .15s;border-left:2px solid transparent;line-height:1.4}',
    '.ff-side-panel__nav a:hover,.ff-side-panel__nav a.is-active{color:#fff;border-left-color:var(--accent,#2ecc71)}',
    '.ff-side-panel__nav a[data-level="3"]{padding-left:20px;font-size:0.8rem;color:rgba(255,255,255,0.5)}',
    '.ff-side-panel__nav a[data-level="3"]:hover,.ff-side-panel__nav a[data-level="3"].is-active{color:rgba(255,255,255,0.9)}',
    '.ff-side-panel__toggle{position:fixed;left:0;top:50%;transform:translateY(-50%);width:36px;height:48px;background:var(--ff-black,#0a0a0a);color:#fff;border:none;border-radius:0 6px 6px 0;cursor:pointer;z-index:49;font-size:1.1rem;display:flex;align-items:center;justify-content:center;transition:background .2s}',
    '.ff-side-panel__toggle:hover{background:var(--accent,#2ecc71)}',
    '.ff-side-panel__backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:48;opacity:0;pointer-events:none;transition:opacity .3s}',
    '.ff-side-panel__backdrop.is-open{opacity:1;pointer-events:auto}',

    /* Sticky search */
    '.ff-sticky-search{position:fixed;top:0;left:0;right:0;height:48px;background:rgba(253,253,253,0.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:40;display:flex;align-items:center;padding:0 1rem;border-bottom:2px solid var(--ff-black,#0a0a0a);transform:translateY(-100%);transition:transform .25s ease;box-sizing:border-box}',
    '.ff-sticky-search.is-visible{transform:translateY(0)}',
    '.ff-sticky-search input{flex:1;max-width:600px;margin:0 auto;border:2px solid var(--ff-black,#0a0a0a);padding:6px 12px;font-size:0.875rem;font-family:"Inter",sans-serif;box-sizing:border-box;outline:none}',
    '.ff-sticky-search input:focus{border-color:var(--accent,#2ecc71)}',
    '.ff-sticky-search__count{font-family:"IBM Plex Mono",monospace;font-size:0.7rem;color:#888;margin-left:8px;white-space:nowrap}',

    /* Flash highlight */
    '@keyframes ff-flash-bg{0%{background:rgba(74,144,226,0.25)}100%{background:transparent}}',
    '.flash-highlight{animation:ff-flash-bg 1.5s ease-out}',

    /* Mobile: hide toggle, panel goes full-width */
    '@media(max-width:768px){.ff-side-panel__toggle{display:none}.ff-side-panel{width:85vw}}',

    /* Reduced motion */
    '@media(prefers-reduced-motion:reduce){.ff-side-panel,.ff-side-panel__backdrop,.ff-sticky-search,.flash-highlight{transition-duration:0.01ms!important;animation-duration:0.01ms!important}}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ─── Wait for DOM ────────────────────────────────────────────────
  function init() {
    buildSidePanel();
    buildStickySearch();
    buildBibliographyLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ═══════════════════════════════════════════════════════════════════
  // 1. SIDE PANEL — Subchapter navigation
  // ═══════════════════════════════════════════════════════════════════
  function buildSidePanel() {
    // Collect headings
    var headings = document.querySelectorAll('h2[id], h3[id]');
    if (!headings.length) return;

    // Create backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'ff-side-panel__backdrop';
    document.body.appendChild(backdrop);

    // Create panel
    var panel = document.createElement('aside');
    panel.className = 'ff-side-panel';
    panel.setAttribute('role', 'navigation');
    panel.setAttribute('aria-label', 'Navigazione capitolo');

    var closeBtn = document.createElement('button');
    closeBtn.className = 'ff-side-panel__close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Chiudi pannello');
    panel.appendChild(closeBtn);

    var title = document.createElement('div');
    title.className = 'ff-side-panel__title';
    title.textContent = 'Indice';
    panel.appendChild(title);

    var nav = document.createElement('nav');
    nav.className = 'ff-side-panel__nav';

    var links = [];
    headings.forEach(function (h) {
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.replace(/^\s+|\s+$/g, '');
      var level = h.tagName === 'H3' ? '3' : '2';
      a.setAttribute('data-level', level);
      a.setAttribute('data-target', h.id);
      nav.appendChild(a);
      links.push({ el: a, target: h });
    });

    panel.appendChild(nav);
    document.body.appendChild(panel);

    // Create toggle button
    var toggle = document.createElement('button');
    toggle.className = 'ff-side-panel__toggle';
    toggle.innerHTML = '&#8801;';
    toggle.setAttribute('aria-label', 'Apri indice capitolo');
    document.body.appendChild(toggle);

    // Open/close logic
    function openPanel() {
      panel.classList.add('is-open');
      backdrop.classList.add('is-open');
      panel.querySelector('a')?.focus();
    }

    function closePanel() {
      panel.classList.remove('is-open');
      backdrop.classList.remove('is-open');
    }

    toggle.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);
    backdrop.addEventListener('click', closePanel);

    // Escape key closes panel
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) {
        closePanel();
      }
    });

    // Click nav link: scroll + close on mobile
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;
      e.preventDefault();
      var targetId = link.getAttribute('data-target');
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (window.innerWidth <= 768) {
        closePanel();
      }
    });

    // Active section tracking via IntersectionObserver
    if ('IntersectionObserver' in window) {
      var currentActive = null;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            if (currentActive) currentActive.classList.remove('is-active');
            var match = nav.querySelector('a[data-target="' + id + '"]');
            if (match) {
              match.classList.add('is-active');
              currentActive = match;
            }
          }
        });
      }, {
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0
      });

      headings.forEach(function (h) {
        observer.observe(h);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // 2. STICKY SEARCH BAR
  // ═══════════════════════════════════════════════════════════════════
  function buildStickySearch() {
    var originalInput = document.getElementById('chapterSearch');
    if (!originalInput) return;

    var originalSection = originalInput.closest('section') || originalInput.parentElement;

    // Create sticky bar
    var stickyBar = document.createElement('div');
    stickyBar.className = 'ff-sticky-search';

    var stickyInput = document.createElement('input');
    stickyInput.type = 'search';
    stickyInput.placeholder = originalInput.placeholder || 'Cerca...';
    stickyBar.appendChild(stickyInput);

    var countSpan = document.createElement('span');
    countSpan.className = 'ff-sticky-search__count';
    stickyBar.appendChild(countSpan);

    document.body.appendChild(stickyBar);

    // Sync between the two inputs
    var syncing = false;

    function syncInputs(source, target) {
      if (syncing) return;
      syncing = true;
      target.value = source.value;
      // Dispatch input event so existing search handler picks it up
      var evt = new Event('input', { bubbles: true });
      target.dispatchEvent(evt);
      syncing = false;
    }

    stickyInput.addEventListener('input', function () {
      syncInputs(stickyInput, originalInput);
      updateCount();
    });

    originalInput.addEventListener('input', function () {
      syncInputs(originalInput, stickyInput);
      updateCount();
    });

    // Count visible results
    function updateCount() {
      var query = originalInput.value.trim();
      if (!query) {
        countSpan.textContent = '';
        return;
      }
      // Count visible prose blocks
      var blocks = document.querySelectorAll('article.prose p, article.prose blockquote');
      var visible = 0;
      blocks.forEach(function (b) {
        if (b.style.display !== 'none' && b.offsetParent !== null) {
          visible++;
        }
      });
      countSpan.textContent = visible + ' risultat' + (visible === 1 ? 'o' : 'i');
    }

    // Show/hide sticky bar based on scroll position
    var isVisible = false;

    function checkScroll() {
      var rect = originalSection.getBoundingClientRect();
      var shouldShow = rect.bottom < 0;

      if (shouldShow && !isVisible) {
        stickyBar.classList.add('is-visible');
        isVisible = true;
      } else if (!shouldShow && isVisible) {
        stickyBar.classList.remove('is-visible');
        isVisible = false;
      }
    }

    // Throttled scroll handler
    var scrollTick = false;
    window.addEventListener('scroll', function () {
      if (!scrollTick) {
        scrollTick = true;
        requestAnimationFrame(function () {
          checkScroll();
          scrollTick = false;
        });
      }
    }, { passive: true });

    // Initial check
    checkScroll();
  }

  // ═══════════════════════════════════════════════════════════════════
  // 3. BIBLIOGRAPHY ANCHOR LINKS
  // ═══════════════════════════════════════════════════════════════════
  function buildBibliographyLinks() {
    var fonti = document.querySelectorAll('[id^="fonte-"]');
    if (!fonti.length) return;

    fonti.forEach(function (li) {
      var fonteAnchor = li.querySelector('a');
      if (!fonteAnchor) return;

      var fonteUrl = fonteAnchor.getAttribute('href');
      if (!fonteUrl) return;

      // Find matching link in article content
      var match = document.querySelector('article.prose a[href="' + CSS.escape ? fonteUrl : fonteUrl + '"]');
      // Fallback: try matching by href attribute directly
      if (!match) {
        var contentLinks = document.querySelectorAll('article.prose a');
        for (var i = 0; i < contentLinks.length; i++) {
          if (contentLinks[i].getAttribute('href') === fonteUrl) {
            match = contentLinks[i];
            break;
          }
        }
      }

      if (!match) return;

      var para = match.closest('p') || match.closest('blockquote');
      if (!para) return;

      var fonteId = li.id;
      var refId = 'ref-' + fonteId;

      // Set id on the paragraph (don't overwrite existing id)
      if (!para.id) {
        para.id = refId;
      } else {
        refId = para.id;
      }

      // Add ↩ back-link to the fonte li
      var backLink = document.createElement('a');
      backLink.href = '#' + refId;
      backLink.textContent = ' \u21A9';
      backLink.style.cssText = 'color:var(--accent,#2ecc71);text-decoration:none;font-size:0.8rem;margin-left:4px;cursor:pointer;';
      backLink.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(refId);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.remove('flash-highlight');
        // Force reflow to restart animation
        void target.offsetWidth;
        target.classList.add('flash-highlight');
        setTimeout(function () { target.classList.remove('flash-highlight'); }, 1500);
      });
      li.appendChild(backLink);

      // Add a small fonte reference link on the paragraph pointing back to the fonte
      var refLink = document.createElement('a');
      refLink.href = '#' + fonteId;
      refLink.textContent = ' [' + fonteId.replace('fonte-', '') + ']';
      refLink.style.cssText = 'color:var(--accent,#2ecc71);text-decoration:none;font-size:0.7rem;font-family:"IBM Plex Mono",monospace;margin-left:2px;cursor:pointer;vertical-align:super;';
      refLink.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(fonteId);
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.remove('flash-highlight');
        void target.offsetWidth;
        target.classList.add('flash-highlight');
        setTimeout(function () { target.classList.remove('flash-highlight'); }, 1500);
      });
      // Append ref link after the matching anchor in the paragraph
      if (match.nextSibling) {
        match.parentNode.insertBefore(refLink, match.nextSibling);
      } else {
        match.parentNode.appendChild(refLink);
      }
    });
  }

})();

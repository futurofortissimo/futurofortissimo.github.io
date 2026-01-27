// Lightweight analytics + interaction tracking.
// Note: this file is loaded as type=module (see index.html).
// This file is safe even if no analytics provider is configured.
//
// To enable Plausible:
// 1) Create a Plausible site for your domain.
// 2) Add to each page head (or here via HTML):
//    <script defer data-domain="YOUR_DOMAIN" src="https://plausible.io/js/script.js"></script>
//
// Events tracked (if provider exists):
// - nav_click
// - outbound_click
// - topic_open
// - connection_open

(function () {
  function safe(fn) {
    try { fn(); } catch (_) {}
  }

  // unified tracker
  window.ffTrack = function (event, props) {
    safe(() => {
      if (typeof window.plausible === 'function') {
        window.plausible(event, { props: props || {} });
      }
      // Add other providers here if needed.
    });
  };

  function isOutbound(a) {
    if (!a || !a.href) return false;
    try {
      const u = new URL(a.href, location.href);
      return u.origin !== location.origin;
    } catch (_) {
      return false;
    }
  }

  document.addEventListener('click', (e) => {
    const a = e.target && (e.target.closest ? e.target.closest('a') : null);
    if (!a) return;

    const label = (a.getAttribute('data-track') || a.textContent || '').trim().slice(0, 80);

    if (a.getAttribute('data-nav') === '1') {
      window.ffTrack('nav_click', { label, href: a.getAttribute('href') });
      return;
    }

    if (isOutbound(a)) {
      window.ffTrack('outbound_click', { label, href: a.href });
    }
  }, { capture: true });
})();

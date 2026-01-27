// Provider-agnostic analytics + interaction tracking.
// Safe to include even with no analytics provider configured.
//
// Supported providers (auto-detected if present):
// - Plausible (window.plausible)
// - Google Analytics / gtag (window.gtag)
// - dataLayer push (window.dataLayer)
// - Custom adapter (window.ffAnalyticsAdapter)
//
// Events tracked by default (via click delegation):
// - nav_click
// - outbound_click
//
// Pages can add explicit tracking attributes:
// - data-track="event_name" (any clickable element)

(function () {
  function safe(fn) {
    try {
      fn();
    } catch (_) {
      // no-op
    }
  }

  function asPlainObject(props) {
    if (!props || typeof props !== 'object') return {};
    const out = {};
    for (const [k, v] of Object.entries(props)) {
      if (v === undefined) continue;
      out[k] = typeof v === 'string' ? v : v;
    }
    return out;
  }

  function trackPlausible(event, props) {
    if (typeof window.plausible !== 'function') return;
    window.plausible(event, { props: props || {} });
  }

  function trackGtag(event, props) {
    if (typeof window.gtag !== 'function') return;
    // GA4 custom events: https://developers.google.com/analytics/devguides/collection/ga4/events
    window.gtag('event', event, props || {});
  }

  function trackDataLayer(event, props) {
    if (!window.dataLayer || !Array.isArray(window.dataLayer)) return;
    window.dataLayer.push({ event, ...(props || {}) });
  }

  function trackCustomAdapter(event, props) {
    if (typeof window.ffAnalyticsAdapter !== 'function') return;
    window.ffAnalyticsAdapter({ type: 'event', event, props: props || {} });
  }

  // Unified tracker.
  window.ffTrack = function ffTrack(event, props) {
    const cleanProps = asPlainObject(props);
    safe(() => trackPlausible(event, cleanProps));
    safe(() => trackGtag(event, cleanProps));
    safe(() => trackDataLayer(event, cleanProps));
    safe(() => trackCustomAdapter(event, cleanProps));
  };

  // Page view helper (call from any page).
  window.ffTrackPage = function ffTrackPage(extraProps) {
    const props = asPlainObject(extraProps);
    props.path = props.path || location.pathname;
    props.title = props.title || document.title;

    // Plausible has a dedicated pageview API; but custom event keeps it provider-agnostic.
    window.ffTrack('page_view', props);

    // Plausible: also trigger native pageview when available.
    safe(() => {
      if (typeof window.plausible === 'function') {
        window.plausible('pageview');
      }
    });

    // GA4: page_view is automatically collected when configured; keeping custom call as backup.
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

  // Click delegation: supports <a> and any element with data-track.
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target;
      if (!target || !target.closest) return;

      const explicit = target.closest('[data-track]');
      if (explicit) {
        const event = (explicit.getAttribute('data-track') || '').trim();
        if (event) {
          const label = (explicit.getAttribute('data-label') || explicit.textContent || '')
            .trim()
            .slice(0, 120);
          const href = explicit.getAttribute('href') || undefined;
          window.ffTrack(event, { label, href });
          return;
        }
      }

      const a = target.closest('a');
      if (!a) return;

      const label = (a.textContent || '').trim().slice(0, 120);

      if (a.getAttribute('data-nav') === '1') {
        window.ffTrack('nav_click', { label, href: a.getAttribute('href') });
        return;
      }

      if (isOutbound(a)) {
        window.ffTrack('outbound_click', { label, href: a.href });
      }
    },
    { capture: true }
  );

  // Fire one page view on initial load.
  safe(() => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      window.ffTrackPage();
      return;
    }
    window.addEventListener('DOMContentLoaded', () => window.ffTrackPage(), { once: true });
  });
})();

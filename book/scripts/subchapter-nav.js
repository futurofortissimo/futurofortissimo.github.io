/* Futuro Fortissimo — Subchapter Navigation (PR 9/10)
 * Mobile-first swipe + keyboard navigation for chapter-0X-Y-Z.html pages.
 * Idempotent: safe to include multiple times (guarded by data attribute).
 */
(function () {
  "use strict";
  if (document.documentElement.dataset.ffSubchapterNav === "ready") return;
  document.documentElement.dataset.ffSubchapterNav = "ready";

  // Flat ordered list of the 36 split subchapters (9 parent chapters × 4)
  var PAGES = [];
  for (var x = 1; x <= 3; x++) {
    for (var y = 1; y <= 3; y++) {
      for (var z = 1; z <= 4; z++) {
        PAGES.push("chapter-0" + x + "-" + y + "-" + z + ".html");
      }
    }
  }

  function currentIndex() {
    var path = (location.pathname || "").split("/").pop();
    return PAGES.indexOf(path);
  }

  var idx = currentIndex();
  if (idx < 0) return;

  var prev = idx > 0 ? PAGES[idx - 1] : null;
  var next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;

  // Swipe handler (left = next, right = prev)
  var t0x = null, t0y = null, t0t = 0;
  var TH = 60;        // min px
  var MAX_T = 700;    // ms
  var RATIO = 1.5;    // horizontal vs vertical

  function onStart(e) {
    if (!e.touches || e.touches.length !== 1) return;
    t0x = e.touches[0].clientX;
    t0y = e.touches[0].clientY;
    t0t = Date.now();
  }
  function onEnd(e) {
    if (t0x == null) return;
    var ch = e.changedTouches && e.changedTouches[0];
    if (!ch) { t0x = null; return; }
    var dx = ch.clientX - t0x;
    var dy = ch.clientY - t0y;
    var dt = Date.now() - t0t;
    t0x = null;
    if (dt > MAX_T) return;
    if (Math.abs(dx) < TH) return;
    if (Math.abs(dx) < Math.abs(dy) * RATIO) return;
    if (dx < 0 && next) location.href = next;
    else if (dx > 0 && prev) location.href = prev;
  }
  document.addEventListener("touchstart", onStart, { passive: true });
  document.addEventListener("touchend", onEnd, { passive: true });

  // Keyboard arrow navigation (desktop readers)
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    var tag = (e.target && e.target.tagName) || "";
    if (/^(INPUT|TEXTAREA|SELECT)$/i.test(tag)) return;
    if (e.key === "ArrowRight" && next) location.href = next;
    else if (e.key === "ArrowLeft" && prev) location.href = prev;
  });

  // Expose for debugging
  window.__ffSubNav = { idx: idx, prev: prev, next: next, pages: PAGES };
})();

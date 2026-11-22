/** Tailwind config for the prebuilt SPA stylesheet (/assets/ff-tw.css) that replaces the Tailwind Play CDN
 *  on the home, libri, connections and note pages (no runtime JIT → less main-thread work, faster LCP).
 *  Rebuild: npx -y tailwindcss@3.4.17 -c tailwind.app.config.cjs -i assets/ff-archive.src.css -o assets/ff-tw.css --minify */
module.exports = {
  content: [
    './index.html', './en/index.html', './hi/index.html', './libri/index.html', './en/books/index.html', './hi/books/index.html',
    './connections.html', './en/connections.html', './hi/connections.html', './note.html', './en/note.html', './hi/note.html',
    './App.js', './NavigationContext.js', './components/*.js', './utils.js', './types.js', './i18n.js', './analytics.js',
    './scripts/build_static_pages.mjs', './scripts/site_chrome.mjs', './scripts/i18n_strings.mjs', './scripts/seo_strings.mjs',
  ],
  theme: { extend: {} },
};

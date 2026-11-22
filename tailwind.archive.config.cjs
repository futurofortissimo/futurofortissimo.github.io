/** Tailwind config for the prebuilt static-archive stylesheet (/assets/ff-archive.css).
 *  Rebuild: npx -y tailwindcss@3 -c tailwind.archive.config.cjs -i assets/ff-archive.src.css -o assets/ff-archive.css --minify */
module.exports = {
  content: ['./scripts/build_archive_seo.mjs', './scripts/build_static_pages.mjs', './scripts/site_chrome.mjs', './scripts/i18n_strings.mjs', './scripts/seo_strings.mjs'],
  theme: { extend: {} },
};

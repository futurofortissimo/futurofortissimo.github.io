/** Tailwind config for the prebuilt static-archive stylesheet (/assets/ff-archive.css).
 *  Rebuild: npx -y tailwindcss@3 -c tailwind.archive.config.cjs -i assets/ff-archive.src.css -o assets/ff-archive.css --minify */
module.exports = {
  content: ['./scripts/build_archive_seo.mjs', './scripts/i18n_strings.mjs'],
  theme: { extend: {} },
};

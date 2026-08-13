// RSS -> data.js entry extractor for futuro fortissimo
// Parses content:encoded of a Substack item into the rawData schema.
const fs = require('fs');

const ENT = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  laquo: '«', raquo: '»', hellip: '…', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘',
  ldquo: '“', rdquo: '”', deg: '°', eacute: 'é', egrave: 'è', agrave: 'à',
  igrave: 'ì', ograve: 'ò', ugrave: 'ù', euro: '€', times: '×', middot: '·', bull: '•',
};

function decode(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, n) => (ENT[n] !== undefined ? ENT[n] : m));
}

function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|blockquote|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]+>/g, '');
}

function clean(text) {
  return decode(stripTags(text)).replace(/\s+/g, ' ').trim();
}

// Blocks we never want in `content`: subscribe widgets, share buttons, footers.
function dropChrome(html) {
  return html
    .replace(/<div class="pullquote"[\s\S]*?<\/div>/gi, ' ')
    .replace(/<p class="button-wrapper"[\s\S]*?<\/p>/gi, ' ')
    .replace(/<div class="subscription-widget[\s\S]*?<\/div>/gi, ' ')
    .replace(/<div class="digest-post-embed"[\s\S]*?<\/div>/gi, ' ');
}

function extractImages(sectionHtml) {
  const out = [];
  const figRe = /<figure>([\s\S]*?)<\/figure>/gi;
  let m;
  while ((m = figRe.exec(sectionHtml))) {
    const fig = m[1];
    const src = (fig.match(/https:\/\/substack-post-media\.s3\.amazonaws\.com\/public\/images\/[^"'?\s<>]+/) || [])[0];
    if (!src) continue;
    const capRaw = (fig.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i) || [])[1] || '';
    out.push({ src: decode(src), caption: clean(capRaw) });
  }
  return out;
}

function extractLinks(sectionHtml) {
  const conns = [];
  const refs = [];
  const seen = new Set();
  const aRe = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = aRe.exec(sectionHtml))) {
    const url = decode(m[1]);
    const text = clean(m[2]);
    if (!text || !/^https?:\/\//.test(url)) continue;
    if (/substackcdn\.com\/image|substack-post-media|\/subscribe|\/comments|translate\.goog/.test(url)) continue;
    const key = url + '|' + text;
    if (seen.has(key)) continue;
    seen.add(key);
    if (/fortissimo\.substack\.com|futurofortissimo\.github\.io/.test(url)) conns.push({ text, url });
    else refs.push({ text, url });
  }
  return { connections: conns, references: refs };
}

function parseItem(itemXml) {
  const title = decode((itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || [])[1] || '');
  const url = (itemXml.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
  const subtitle = decode((itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || [])[1] || '');
  const enc = (itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/) || [])[1] || '';

  const code = (title.match(/ff\.(\d+)/) || [])[1];

  // Split on the h4 headers that carry an ff.X.Y code.
  const parts = enc.split(/(?=<h4>)/g);
  const intro = parts[0];

  // keypoints = the bullet list in the intro block
  const keypoints = [];
  const ulm = intro.match(/<ul>([\s\S]*?)<\/ul>/i);
  if (ulm) {
    const liRe = /<li>([\s\S]*?)<\/li>/gi;
    let lm;
    while ((lm = liRe.exec(ulm[1]))) {
      const t = clean(lm[1]);
      if (t) keypoints.push(t);
    }
  }

  const subchapters = [];
  for (const part of parts.slice(1)) {
    const hm = part.match(/<h4>([\s\S]*?)<\/h4>/i);
    if (!hm) continue;
    const subTitle = clean(hm[1]);
    if (!new RegExp(`ff\\.${code}\\.\\d+`).test(subTitle)) continue;
    const body = dropChrome(part.slice(part.indexOf('</h4>') + 5));
    subchapters.push({
      title: subTitle,
      _bodyHtml: body,
      content: clean(body),
      images: extractImages(body),
      ...extractLinks(body),
    });
  }

  return { url, title, subtitle, keypoints, subchapters };
}

const xml = fs.readFileSync(process.argv[2] || '_rss_feed.xml', 'utf8');
const items = xml.split('<item>').slice(1);
const want = (process.argv[3] || 'ff.150,ff.151').split(',');
const out = [];
for (const it of items) {
  const t = (it.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || [])[1] || '';
  if (want.some((w) => t.includes(w + ' '))) out.push(parseItem(it));
}
fs.writeFileSync('_rss_parsed.json', JSON.stringify(out, null, 2), 'utf8');
for (const e of out) {
  console.log('===', e.title, '|', e.subtitle);
  console.log('keypoints:', JSON.stringify(e.keypoints));
  e.subchapters.forEach((s) =>
    console.log('  ', s.title, '| len', s.content.length, '| img', s.images.length, '| conn', s.connections.length, '| ref', s.references.length)
  );
}

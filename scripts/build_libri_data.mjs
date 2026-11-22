#!/usr/bin/env node
/**
 * build_libri_data.mjs — Extracts ONLY books actually cited in data.js issues,
 * maps verified metadata + Amazon affiliate links (tag: micmeramazon-21),
 * and writes libri/books_cited.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { rawData } from '../data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const AFFILIATE_TAG = 'micmeramazon-21';

// Verified non-book Amazon product links in data.js (supplements, foods, board game)
const NON_BOOK_SHORTCODES = new Set([
  '3yO5tEM', // Elettroliti
  '4dHBHjX', // Straccetti di soia
  '3Bjzz3x', // Glicina
  '3yWFOcZ', // Germe di grano
  '3UOT1N2', // Omega-3 integratore
  '3sUMQMj', // 5 kg di avena
  '3Ggd13d', // Taco Gatto Capra Cacio Pizza
]);

// Canonical book metadata keyed by normalized URL or shortcode (facts strictly from corpus/Amazon links)
const BOOK_META = {
  'amazon:8842832693': {
    id: 'awe-keltner',
    title: 'Awe: la scienza della meraviglia quotidiana',
    author: 'Dacher Keltner',
    theme: 'Società & Mente',
  },
  'amzn:4iAcRI1': {
    id: 'universo-guscio-noce',
    title: "L'universo in un guscio di noce",
    author: 'Stephen Hawking',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:3UfyCmx': {
    id: 'food-for-life',
    title: 'Food for Life',
    author: 'Tim Spector',
    theme: 'Natura & Cibo',
  },
  'amzn:4bCYgHI': {
    id: 'guida-galattica',
    title: 'Guida galattica per gli autostoppisti',
    author: 'Douglas Adams',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:3S3VQez': {
    id: 'giochi-finiti-infiniti',
    title: 'Giochi finiti e infiniti',
    author: 'James P. Carse',
    theme: 'Società & Mente',
  },
  'amzn:4dXNRsa': {
    id: 'societa-stanchezza',
    title: 'La società della stanchezza',
    author: 'Byung-Chul Han',
    theme: 'Società & Mente',
  },
  'amzn:3QdDTcp': {
    id: 'aut-aut',
    title: 'Aut-Aut',
    author: 'Søren Kierkegaard',
    theme: 'Società & Mente',
  },
  'amzn:4cZj2Cg': {
    id: 'esistenzialisti-mistici',
    title: 'Esistenzialisti e mistici',
    author: 'Iris Murdoch',
    theme: 'Società & Mente',
  },
  'amzn:4mJbGGp': {
    id: 'albero-conoscenza',
    title: "L'albero della conoscenza",
    author: 'Humberto Maturana, Francisco Varela',
    theme: 'Società & Mente',
  },
  'amzn:4cAr2Kf': {
    id: 'food-designing',
    title: 'Food Designing',
    author: 'Martí Guixé',
    theme: 'Natura & Cibo',
  },
  'amzn:4kHiJyw': {
    id: 'glucose-revolution',
    title: 'Glucose Revolution',
    author: 'Jessie Inchauspé',
    theme: 'Natura & Cibo',
  },
  'amzn:402meGh': {
    id: 'grassi-dolci-salati',
    title: 'Grassi dolci e salati',
    author: 'Michael Moss',
    theme: 'Natura & Cibo',
  },
  'amzn:4oE3TZG': {
    id: 'come-non-fare-niente',
    title: 'Come non fare niente. Resistere all’economia dell’attenzione',
    author: 'Jenny Odell',
    theme: 'Società & Mente',
  },
  'amzn:3KFTezU': {
    id: 'come-non-fare-niente',
    title: 'Come non fare niente. Resistere all’economia dell’attenzione',
    author: 'Jenny Odell',
    theme: 'Società & Mente',
  },
  'amzn:4s3luNB': {
    id: 'lion-trackers-guide',
    title: "The Lion Tracker's Guide to Life",
    author: 'Boyd Varty',
    theme: 'Società & Mente',
  },
  'amzn:3YMKPcR': {
    id: 'four-thousand-weeks',
    title: 'Four Thousand Weeks (Come fare per avere più tempo)',
    author: 'Oliver Burkeman',
    theme: 'Società & Mente',
  },
  'amzn:3uFBCvr': {
    id: 'four-thousand-weeks',
    title: 'Four Thousand Weeks (Come fare per avere più tempo)',
    author: 'Oliver Burkeman',
    theme: 'Società & Mente',
  },
  'amzn:46DJbjz': {
    id: 'four-thousand-weeks',
    title: 'Four Thousand Weeks (Come fare per avere più tempo)',
    author: 'Oliver Burkeman',
    theme: 'Società & Mente',
    isAltEdition: true,
  },
  'amzn:3YKDgP8': {
    id: 'factfulness',
    title: 'Factfulness',
    author: 'Hans Rosling',
    theme: 'Società & Mente',
  },
  'amzn:3LE4InR': {
    id: 'ministero-futuro',
    title: 'Il ministero per il futuro',
    author: 'Kim Stanley Robinson',
    theme: 'Natura & Cibo',
  },
  'amzn:4thTmqK': {
    id: 'accelerando',
    title: 'Accelerando',
    author: 'Charles Stross',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:4ouHFKs': {
    id: 'natura-che-cura',
    title: 'La natura che cura',
    author: 'Kathy Willis',
    theme: 'Natura & Cibo',
  },
  'amzn:4o4L7ej': {
    id: 'dealing-with-feeling',
    title: 'Dealing with Feeling: Harness Your Emotions to Create the Life You Want',
    author: 'Marc Brackett',
    theme: 'Società & Mente',
  },
  'amazon:8867008870': {
    id: 'saggezza-del-tao',
    title: 'La saggezza del Tao',
    author: 'Wayne W. Dyer',
    theme: 'Società & Mente',
  },
  'amzn:3A2r5ha': {
    id: 'saggezza-del-tao',
    title: 'La saggezza del Tao',
    author: 'Wayne W. Dyer',
    theme: 'Società & Mente',
  },
  'amzn:4lHE7mQ': {
    id: 'tao-te-ching',
    title: 'Tao Te Ching',
    author: 'Lao Tzu',
    theme: 'Società & Mente',
  },
  'amazon:0358567092': {
    id: 'die-with-zero',
    title: 'Die with Zero',
    author: 'Bill Perkins',
    theme: 'Società & Mente',
  },
  'amzn:459DBId': {
    id: 'time-and-soul',
    title: 'Time and Soul',
    author: 'Jacob Needleman',
    theme: 'Società & Mente',
  },
  'amzn:3SBldB7': {
    id: 'le-due-culture',
    title: 'Le due culture',
    author: 'C.P. Snow',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:4l5Sqks': {
    id: 'stato-innovatore',
    title: 'Lo Stato innovatore',
    author: 'Mariana Mazzucato',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:3DVYHzh': {
    id: 'rise-of-superman',
    title: 'The Rise of Superman',
    author: 'Steven Kotler',
    theme: 'Società & Mente',
  },
  'amazon:8804735821': {
    id: 'brave-new-world',
    title: 'Brave New World (Il mondo nuovo)',
    author: 'Aldous Huxley',
    theme: 'Società & Mente',
  },
  'amazon:0008604282': {
    id: 'good-energy',
    title: 'Good Energy',
    author: 'Casey Means',
    theme: 'Natura & Cibo',
  },
  'amzn:4fYC5ec': {
    id: 'mineral-fix',
    title: 'The Mineral Fix',
    author: 'James DiNicolantonio, Siim Land',
    theme: 'Natura & Cibo',
  },
  'amzn:3YjL7Mh': {
    id: 'nexus',
    title: 'Nexus',
    author: 'Yuval Noah Harari',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:3SVM4sy': {
    id: 'we-are-electric',
    title: 'We Are Electric',
    author: 'Sally Adee',
    theme: 'Natura & Cibo',
  },
  'amzn:3R5XWXN': {
    id: 'out-of-touch',
    title: 'Out of Touch',
    author: 'Michelle Drouin',
    theme: 'Società & Mente',
  },
  'amzn:4ajzk4k': {
    id: 'read-write-own',
    title: 'Read Write Own',
    author: 'Chris Dixon',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:3V3ybtM': {
    id: 'blue-zones',
    title: 'The Blue Zones',
    author: 'Dan Buettner',
    theme: 'Natura & Cibo',
  },
  'amzn:47MBGrm': {
    id: 'contengo-moltitudini',
    title: 'Contengo moltitudini',
    author: 'Ed Yong',
    theme: 'Natura & Cibo',
  },
  'amzn:3TGxpC6': {
    id: 'singolarita-vicina',
    title: 'La singolarità è vicina',
    author: 'Ray Kurzweil',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:3IHjhlF': {
    id: 'singolarita-piu-vicina',
    title: 'La singolarità è più vicina (The Singularity Is Nearer)',
    author: 'Ray Kurzweil',
    theme: 'Scienza & Tecnologia',
  },
  'amazon:0399562761': {
    id: 'singolarita-piu-vicina',
    title: 'La singolarità è più vicina (The Singularity Is Nearer)',
    author: 'Ray Kurzweil',
    theme: 'Scienza & Tecnologia',
    isAltEdition: true,
  },
  'amzn:3TaqBMP': {
    id: 'arte-di-respirare',
    title: "L'arte di respirare (Breath)",
    author: 'James Nestor',
    theme: 'Società & Mente',
    summaryPage: '/libri/breath.html',
    coverImage: '/libri/breath.png',
  },
  'amzn:48aph1t': {
    id: 'uomo-in-cerca-di-senso',
    title: "L'uomo in cerca di senso",
    author: 'Viktor E. Frankl',
    theme: 'Società & Mente',
  },
  'amzn:46RlgNG': {
    id: 'chip-war',
    title: 'Chip War',
    author: 'Chris Miller',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:47OZDi9': {
    id: 'subtract',
    title: 'Subtract',
    author: 'Leidy Klotz',
    theme: 'Società & Mente',
  },
  'amzn:3QvJI2c': {
    id: 'master-of-change',
    title: 'Master of Change',
    author: 'Brad Stulberg',
    theme: 'Società & Mente',
  },
  'amazon:1509530576': {
    id: 'down-to-earth',
    title: 'Down to Earth: Politics in the New Climatic Regime',
    author: 'Bruno Latour',
    theme: 'Natura & Cibo',
  },
  'amzn:49ssUAR': {
    id: 'exponential',
    title: 'Exponential',
    author: 'Azeem Azhar',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:3M9DBhO': {
    id: 'peak-performance',
    title: 'Peak Performance',
    author: 'Brad Stulberg, Steve Magness',
    theme: 'Società & Mente',
  },
  'amazon:8806251090': {
    id: 'le-non-cose',
    title: 'Le non cose. Come abbiamo smesso di vivere il reale',
    author: 'Byung-Chul Han',
    theme: 'Società & Mente',
  },
  'amzn:40LSU4A': {
    id: 'pathless-path',
    title: 'The Pathless Path',
    author: 'Paul Millerd',
    theme: 'Società & Mente',
  },
  'amazon:0077123247': {
    id: 'happier',
    title: 'Happier: Can You Learn to Be Happy?',
    author: 'Tal Ben-Shahar',
    theme: 'Società & Mente',
  },
  'amzn:3npkxmo': {
    id: 'tribu',
    title: 'Tribù. Ritorno a casa e appartenenza',
    author: 'Sebastian Junger',
    theme: 'Società & Mente',
  },
  'amzn:41bkCJ6': {
    id: 'come-saremo',
    title: 'Come saremo',
    author: 'Telmo Pievani, Luca De Biase',
    theme: 'Scienza & Tecnologia',
    overrideUrl: `https://www.amazon.it/Come-saremo-Luca-Biase/dp/8875786208?tag=${AFFILIATE_TAG}`,
  },
  'amzn:40SWtqq': {
    id: 'how-bad-are-bananas',
    title: 'How Bad Are Bananas?',
    author: 'Mike Berners-Lee',
    theme: 'Natura & Cibo',
  },
  'amzn:3IXlMBb': {
    id: 'planet-remade',
    title: 'The Planet Remade',
    author: 'Oliver Morton',
    theme: 'Natura & Cibo',
  },
  'amzn:3ZFX3XZ': {
    id: 'technological-revolutions',
    title: 'Technological Revolutions and Financial Capital',
    author: 'Carlota Perez',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:3XnTRP1': {
    id: 'otto-montagne',
    title: 'Le otto montagne',
    author: 'Paolo Cognetti',
    theme: 'Natura & Cibo',
  },
  'amzn:3VOylCt': {
    id: 'dark-green-religion',
    title: 'Dark Green Religion',
    author: 'Bron Taylor',
    theme: 'Natura & Cibo',
  },
  'amzn:3Ib7rQ8': {
    id: 'false-alarm',
    title: 'False Alarm',
    author: 'Bjørn Lomborg',
    theme: 'Natura & Cibo',
  },
  'amzn:3jAJKrZ': {
    id: 'great-stagnation',
    title: 'The Great Stagnation',
    author: 'Tyler Cowen',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:3YU3xlX': {
    id: 'growth-smil',
    title: 'Growth: From Microorganisms to Megacities',
    author: 'Vaclav Smil',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:3vi7qDR': {
    id: 'numeri-non-mentono',
    title: 'I numeri non mentono',
    author: 'Vaclav Smil',
    theme: 'Scienza & Tecnologia',
  },
  'amzn:4cdnAlA': {
    id: 'come-disintossicarti',
    title: 'Come disintossicarti dal tuo cellulare',
    author: 'Catherine Price',
    theme: 'Società & Mente',
  },
  'amazon:0735211736': {
    id: 'daily-stoic',
    title: 'The Daily Stoic',
    author: 'Ryan Holiday, Stephen Hanselman',
    theme: 'Società & Mente',
  },
  'amazon:8807884437': {
    id: 'nudge',
    title: 'Nudge: la spinta gentile',
    author: 'Richard H. Thaler, Cass R. Sunstein',
    theme: 'Società & Mente',
  },
  'amazon:8836000185': {
    id: 'mutevole-ordine',
    title: 'Il mutevole ordine del mondo',
    author: 'Ray Dalio',
    theme: 'Società & Mente',
  },
};

function cleanUrl(rawUrl) {
  let u = (rawUrl || '').trim();
  // Fix concatenated duplicate shortlink like https://amzn.to/3vi7qDRhttps://amzn.to/3vi7qDR
  u = u.replace(/^(https:\/\/amzn\.to\/[A-Za-z0-9]+)\1+$/, '$1');
  return u;
}

function getLookupKey(url) {
  const shortMatch = url.match(/amzn\.to\/([A-Za-z0-9]+)/i);
  if (shortMatch) return `amzn:${shortMatch[1]}`;
  const dpMatch = url.match(/\/dp\/([A-Z0-9]{10})/i);
  if (dpMatch) return `amazon:${dpMatch[1]}`;
  return url;
}

function normalizeAffiliateUrl(url, meta) {
  if (meta?.overrideUrl) return meta.overrideUrl;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'amzn.to') return url;
    if (parsed.hostname.endsWith('amazon.it')) {
      parsed.searchParams.set('tag', AFFILIATE_TAG);
      // Clean bloated tracking params while preserving dp path and tag
      const dpMatch = parsed.pathname.match(/\/dp\/([A-Z0-9]{10})/i);
      if (dpMatch) {
        return `https://www.amazon.it/dp/${dpMatch[1]}?tag=${AFFILIATE_TAG}`;
      }
      return parsed.toString();
    }
    return url;
  } catch {
    return url;
  }
}

function issueSlugOf(ch, idx) {
  const m = /ff\.(\d+)/i.exec(ch.title || '');
  if (m) return `ff-${m[1]}`;
  const slug = (ch.url || '').replace(/\/$/, '').split('/').pop();
  return slug || `issue-${idx}`;
}

function buildExcerpt(content = '') {
  const clean = (content || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  if (clean.length <= 190) return clean;
  const cut = clean.slice(0, 187);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

// Deduplicate rawData by URL
const seenChapterUrls = new Set();
const issues = rawData.filter((ch) => {
  const u = (ch?.url || '').replace(/\/$/, '');
  if (!u || seenChapterUrls.has(u)) return false;
  seenChapterUrls.add(u);
  return true;
});

const booksMap = new Map();

issues.forEach((ch, chIdx) => {
  const ffMatch = /ff\.(\d+)/i.exec(ch.title || '');
  const ffNum = ffMatch ? Number(ffMatch[1]) : 0;
  const issueSlug = issueSlugOf(ch, chIdx);

  (ch.subchapters || []).forEach((sub) => {
    const subMatch = /ff\.(\d+)\.(\d+)/i.exec(sub.title || '');
    const subCode = subMatch ? `ff.${subMatch[1]}.${subMatch[2]}` : (ffNum ? `ff.${ffNum}` : issueSlug);
    const subAnchor = subMatch ? `ff-${subMatch[1]}-${subMatch[2]}` : issueSlug;

    (sub.references || []).forEach((ref) => {
      const rawUrl = cleanUrl(ref?.url || '');
      if (!rawUrl || !/amzn\.|amazon\./i.test(rawUrl) || rawUrl.includes('link.amazon/')) return;
      const sc = rawUrl.match(/amzn\.to\/([A-Za-z0-9]+)$/i)?.[1];
      if (sc && NON_BOOK_SHORTCODES.has(sc)) return;

      const lookupKey = getLookupKey(rawUrl);
      const meta = BOOK_META[lookupKey];
      const bookId = meta?.id || lookupKey;
      const amazonUrl = normalizeAffiliateUrl(rawUrl, meta);

      if (!booksMap.has(bookId)) {
        booksMap.set(bookId, {
          id: bookId,
          title: meta?.title || (ref.text || sub.title).trim(),
          author: meta?.author || '',
          theme: meta?.theme || 'Altro',
          amazonUrl,
          altAmazonUrl: null,
          summaryPage: meta?.summaryPage || null,
          coverImage: meta?.coverImage || null,
          maxFfNum: ffNum,
          citations: [],
          sourceUrls: [],
          _citeKeys: new Set(),
        });
      }

      const book = booksMap.get(bookId);
      if (!book.sourceUrls.includes(rawUrl)) book.sourceUrls.push(rawUrl);
      if (meta?.isAltEdition && book.amazonUrl !== amazonUrl) {
        book.altAmazonUrl = amazonUrl;
      } else if (!meta?.isAltEdition && !book.amazonUrl) {
        book.amazonUrl = amazonUrl;
      }
      if (ffNum > book.maxFfNum) book.maxFfNum = ffNum;

      const citeKey = `${issueSlug}::${subCode}`;
      if (!book._citeKeys.has(citeKey)) {
        book._citeKeys.add(citeKey);
        book.citations.push({
          ffNum,
          ffCode: subCode,
          issueTitle: ch.title,
          issueSlug,
          issueUrl: `/archivio/${issueSlug}.html#${subAnchor}`,
          substackIssueUrl: ch.url,
          subTitle: sub.title,
          subLink: sub.link || ch.url,
          excerpt: buildExcerpt(sub.content),
        });
      }
    });
  });
});

const books = Array.from(booksMap.values())
  .map(({ _citeKeys, ...rest }) => rest)
  .sort((a, b) => b.maxFfNum - a.maxFfNum || a.title.localeCompare(b.title, 'it'));

const totalCitations = books.reduce((sum, b) => sum + b.citations.length, 0);

const out = {
  meta: {
    affiliateTag: AFFILIATE_TAG,
    disclosure: `Link affiliati Amazon (tag: ${AFFILIATE_TAG}). Ogni libro elencato è stato effettivamente citato nei numeri di Futuro Fortissimo.`,
    totalBooks: books.length,
    totalCitations,
    issuesScanned: issues.length,
    generatedAt: new Date().toISOString(),
  },
  books,
};

const outPath = path.join(ROOT, 'libri', 'books_cited.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf-8');
console.log(`✅ libri/books_cited.json written: ${books.length} books, ${totalCitations} citations across ${issues.length} issues`);

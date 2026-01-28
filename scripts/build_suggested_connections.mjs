import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, 'futuro_fortissimo_full_data.txt');
const OUT_DIR = path.join(ROOT, 'generated');
fs.mkdirSync(OUT_DIR, { recursive: true });

const issues = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

function norm(s) {
  return (s || '').toString().toLowerCase();
}

function extractSubId(title) {
  const m = /ff\.(\d+)\.(\d+)/i.exec(title || '');
  if (!m) return null;
  return `ff.${m[1]}.${m[2]}`;
}

function extractIssueId(issueTitle) {
  const m = /ff\.(\d+)/i.exec(issueTitle || '');
  if (!m) return null;
  return `ff.${m[1]}`;
}

// Flatten all subchapters
const subs = [];
for (const issue of issues) {
  const issueId = extractIssueId(issue.title);
  for (const sub of issue.subchapters || []) {
    const id = extractSubId(sub.title);
    const body = [issue.title, issue.subtitle, ...(issue.keypoints || []), sub.title, sub.content].filter(Boolean).join('\n');
    subs.push({
      issueId,
      issueTitle: issue.title,
      issueUrl: issue.url,
      id,
      title: sub.title,
      url: sub.link || issue.url,
      body,
    });
  }
}

function score(body, terms) {
  const t = norm(body);
  let s = 0;
  for (const term of terms) {
    if (t.includes(term)) s += 1;
  }
  return s;
}

// Seed: ff.90.3 (alghe + data center + CO2) — find by id or keyword
const seedId = 'ff.90.3';
let seed = subs.find((s) => s.id === seedId);
if (!seed) {
  seed = subs
    .filter((s) => (s.issueId === 'ff.90'))
    .sort((a, b) => (norm(a.title).includes('alg') ? -1 : 0) - (norm(b.title).includes('alg') ? -1 : 0))[0];
}

const packs = [
  {
    key: 'energy_datacenter_co2',
    title: 'Energia · data center · CO₂',
    seed: seed?.id || null,
    terms: ['data center', 'datacenter', 'server', 'raffredd', 'energia', 'co2', 'emission', 'clima', 'elettric', 'rete'],
    bridgeTemplates: [
      'Se i data center diventano l\'infrastruttura del XXI secolo, allora energia e CO₂ non sono “side note”: sono il conto.',
      'Il filo rosso: dal calcolo (data center) al clima (CO₂) passando da energia e raffreddamento.',
      'Quando l\'AI cresce, cresce anche la domanda di energia: qui si vede il ponte tra modelli e mondo fisico.'
    ]
  },
];

function pickBridgeText(template, from, to) {
  const base = template || 'Connessione fortissima.';
  return base
    .replaceAll('{from}', from?.id || '')
    .replaceAll('{to}', to?.id || '');
}

const suggestions = [];
for (const p of packs) {
  const scored = subs
    .filter((s) => s.id && s.id !== p.seed)
    .map((s) => ({ s, score: score(s.body, p.terms) }))
    .filter((x) => x.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  const top = scored.slice(0, 8).map((x, idx) => {
    const bridge = pickBridgeText(p.bridgeTemplates[idx % p.bridgeTemplates.length], seed, x.s);
    return {
      from: { id: p.seed, title: seed?.title || 'ff.90.3', url: seed?.url || null },
      to: { id: x.s.id, title: x.s.title, url: x.s.url },
      strength: x.score,
      bridge,
      tags: ['suggested', 'auto'],
    };
  });

  suggestions.push({
    key: p.key,
    title: p.title,
    seed: p.seed,
    items: top,
  });
}

const out = {
  generatedAt: new Date().toISOString(),
  totals: {
    issues: issues.length,
    subchapters: subs.length,
    packs: suggestions.length,
    suggestions: suggestions.reduce((a, p) => a + p.items.length, 0),
  },
  suggestions,
};

fs.writeFileSync(path.join(OUT_DIR, 'suggested_connections.json'), JSON.stringify(out, null, 2));
console.log('Wrote:', path.join('generated', 'suggested_connections.json'));

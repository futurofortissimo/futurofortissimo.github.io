import {rawData} from './data.js';

// All used codes: from content files + DONE PRs + unmerged branches
const used = new Set([
  // From DONE section + content files
  '1.4','33.1','33.2','34.1','36.1','37.3','43.1','46.1','47.3','48.1',
  '49.3','50.1','50.3','55.1','56.1','56.3','59.3','60.4','64.2','68.4',
  '69.1','70.3','78.1','79.2','81.3','82.1','82.2','83.5','85.1','87.2',
  '88.1','89.2','92.1','92.3','94.2','97.2','98.1','98.3','99.1','99.2',
  '99.4','103.2','105.3','105.4','106.3','109.1','109.4','110.1','113.3',
  '113.4','115.1','115.2','120.1','120.2','123.3','126.3','126.4','127.1',
  '129.2','132.1','134.3','134.4','137.4','139.3','140.1','140.2','140.3',
  '141.1','141.2','141.3','142.1','142.2','143.1','143.3','143.4','144.1',
  '144.2','144.3','13.1','23.4','29.1','9.1',
  // From unmerged branches
  '26.3','87.3','120.5','5.1','61.1','1.3','111.1',
  '38.2','89.3','137.2','8.5','64.1','143.2',
  '42.3','98.2','123.2','2.1','63.1','112.1',
  // Original content files (approximate from agent results)
  '122.1','122.2','122.3','122.4','122.5','19.1','19.2','19.3','19.4','19.5',
  '25.1','25.2','25.3','25.4','39.1','39.2','39.3','58.1','58.2','58.4',
  '1.2','1.3','11.1','11.2','11.3','10.4','11.5','16.1','16.2','16.3','16.4',
  '32.1','32.2','32.3','32.4','32.5','50.2','50.4','56.2','56.5',
  '125.1','125.2','125.3','125.4','124.1','124.2','124.3','124.4',
  '119.1','119.2','119.3','119.4','116.1','116.2','116.3','116.4',
  '115.3','112.2','112.3','112.4','112.5',
  '110.2','110.3','110.4','106.1','106.2','106.4',
  '105.1','105.2','2.2','2.3','2.5','9.2','9.4',
  '12.1','12.2','12.3','12.4','12.5','37.1','37.2','37.4',
  '18.1','18.2','18.3','18.4','18.5',
  '101.1','101.2','101.3','101.4','101.5',
  '102.1','102.2','102.3','102.4','102.5',
  '103.1','103.3','103.4','60.1','60.2','60.3','60.5',
  '69.2','69.3','69.4','82.3','82.4','88.2','88.3',
  '30.1','30.2','30.3',
  '121.1','121.2','120.3','120.4','120.5',
  '118.1','118.2','118.3','117.1','117.2','117.3','117.4',
  '113.1','113.2','109.2','109.3','108.1','108.2','108.3','108.4',
  '107.1','107.2','107.3','107.4','107.5',
  '44.1','44.2','44.3','44.4','44.5','62.1','62.2','62.3','62.4','62.5',
  '68.1','68.2','68.3','72.1','72.2','72.3','72.4',
  '75.1','75.2','75.3','75.4','78.2','78.3','78.4','78.5',
  '89.1','89.3','89.4','4.1','4.2','4.3','4.4','4.5',
  '27.1','27.2','27.3','28.2','28.4',
  '76.1','76.2','76.3','76.4','87.1','87.3','87.4',
  '90.1','90.2','90.3','90.4','17.1','17.2','17.3',
  '22.1','22.2','22.3','22.4','22.5',
  '35.1','35.2','35.3','35.4','35.5','49.1','49.2','49.4',
]);

const all = [];
for (const issue of rawData) {
  for (const sub of (issue.subchapters || [])) {
    const m = sub.title.match(/ff\.(\d+)\.(\d+)/);
    if (m && !used.has(m[1] + '.' + m[2]) && (sub.content || '').length > 200) {
      all.push({
        code: 'ff.' + m[1] + '.' + m[2],
        num: parseInt(m[1]),
        emoji: sub.title.split(' ')[0],
        title: sub.title,
        content: sub.content
      });
    }
  }
}

console.error('Total truly unused with content > 200 chars:', all.length);

// Categorize
const nat_kw = /co2|carbon|clima|energia|solar|batter|ambient|pianta|albero|dieta|cibo|nutri|salut|calor|acqua|microbioma|longevit|invecchia|cellul|foresta|biodiver|animali|agricol|emissio|inquin|ricicl|green|rinnovab|nuclear|eolico|mare|oceano|ghiacci|farmac|medic|gene(?!ra)|vitamina|minerale|muscol|sonno|metabol|protei|grasso|ecolog|plastica|rifiut|tossic|aria.*qual/i;
const tech_kw = /\bai\b|intelligen.*artific|robot|chip|quantum|deep.?learn|neural|gpt|llm|agenti.*autonom|coding|programm|modello.*lingua|chatbot|gemini|claude|nvidia|openai|startup|silicon|comput|cyber|blockchain|crypto|autono.*guid|waymo|tesla.*auto|dall.?e|stable.?diff|algoritm/i;
const soc_kw = /societ|econom|diseguag|povert|ricchezz|scuol|educa|politic|democr|urban|demograf|lavoro|giovan|pensio|welfare|diritti|inflaz|pil|capital|consumism|migr|libert|privacy|etica|filosof|psicol|depress|felicit|stress|anzian|cultura|arte(?!fic)|mond.*nuovo|distop/i;

function categorize(item) {
  const txt = (item.title + ' ' + item.content).toLowerCase();
  if (nat_kw.test(txt)) return 'natura';
  if (tech_kw.test(txt)) return 'tech';
  if (soc_kw.test(txt)) return 'societa';
  return 'other';
}

const cats = { natura: [], tech: [], societa: [], other: [] };
for (const item of all) {
  cats[categorize(item)].push(item);
}

function pick3(arr) {
  const old = arr.filter(x => x.num < 60);
  const mid = arr.filter(x => x.num >= 60 && x.num < 120);
  const rec = arr.filter(x => x.num >= 120);
  const picks = [];
  if (old.length > 0) picks.push(old[Math.floor(Math.random() * Math.min(3, old.length))]);
  if (mid.length > 0) picks.push(mid[Math.floor(Math.random() * Math.min(3, mid.length))]);
  if (rec.length > 0) picks.push(rec[Math.floor(Math.random() * Math.min(3, rec.length))]);
  return picks;
}

console.log('=== NATURA (' + cats.natura.length + ' available) ===');
const np = pick3(cats.natura);
np.forEach(x => {
  console.log('CODE:', x.code, x.emoji);
  console.log('TITLE:', x.title);
  console.log('CONTENT:', x.content);
  console.log('---');
});

console.log('=== TECNOLOGIA (' + cats.tech.length + ' available) ===');
const tp = pick3(cats.tech);
tp.forEach(x => {
  console.log('CODE:', x.code, x.emoji);
  console.log('TITLE:', x.title);
  console.log('CONTENT:', x.content);
  console.log('---');
});

console.log('=== SOCIETA (' + cats.societa.length + ' available) ===');
const sp = pick3(cats.societa);
sp.forEach(x => {
  console.log('CODE:', x.code, x.emoji);
  console.log('TITLE:', x.title);
  console.log('CONTENT:', x.content);
  console.log('---');
});

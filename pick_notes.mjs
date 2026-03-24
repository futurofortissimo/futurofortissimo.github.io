import {rawData} from './data.js';

const used = new Set([
  '1.4','33.1','33.2','34.1','36.1','37.3','43.1','46.1','47.3','48.1',
  '49.3','50.1','50.3','55.1','56.1','56.3','59.3','60.4','64.2','68.4',
  '69.1','70.3','78.1','79.2','81.3','82.1','82.2','83.5','85.1','87.2',
  '88.1','89.2','92.1','92.3','94.2','97.2','98.1','98.3','99.1','99.2',
  '99.4','103.2','105.3','105.4','106.3','109.1','109.4','110.1','113.3',
  '113.4','115.1','115.2','120.1','120.2','123.3','126.3','126.4','127.1',
  '129.2','132.1','134.3','134.4','137.4','139.3','140.1','140.2','140.3',
  '141.1','141.2','141.3','142.1','142.2','143.1','143.3','143.4','144.1',
  '144.2','144.3','13.1','23.4','29.1','9.1'
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

// Hand-picked codes for each axis
const picks = ['49.1', '99.3', '135.3', '40.4', '98.2', '139.1', '38.2', '118.1', '137.2'];
for (const p of picks) {
  const found = all.find(x => x.code === 'ff.' + p);
  if (found) {
    console.log('=== ' + found.code + ' ' + found.emoji + ' ===');
    console.log('TITLE: ' + found.title);
    console.log('CONTENT: ' + found.content);
    console.log('---');
  }
}

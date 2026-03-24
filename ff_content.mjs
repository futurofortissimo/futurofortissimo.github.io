import {rawData} from './data.js';

const targets = [
  'ff.5.1','ff.11.1','ff.26.3','ff.33.3','ff.51.1','ff.56.2','ff.56.4','ff.61.1','ff.61.3',
  'ff.73.4','ff.76.3','ff.87.3','ff.87.4','ff.92.4','ff.94.1','ff.99.3','ff.104.1',
  'ff.109.2','ff.112.4','ff.113.2','ff.120.5','ff.129.4','ff.132.4','ff.143.2',
  'ff.2.1','ff.2.4','ff.30.3','ff.30.5','ff.40.5','ff.42.3','ff.48.3','ff.54.4',
  'ff.63.3','ff.69.2','ff.69.3','ff.75.1','ff.83.1','ff.84.3','ff.98.2','ff.98.4',
  'ff.103.4','ff.105.2','ff.106.2','ff.110.4','ff.115.3','ff.117.3','ff.123.2',
  'ff.126.2','ff.137.2',
  'ff.9.2','ff.9.3','ff.13.2','ff.13.3','ff.22.2','ff.22.3','ff.23.1','ff.29.2',
  'ff.38.2','ff.52.2','ff.55.3','ff.58.1','ff.58.5','ff.59.1','ff.59.2',
  'ff.65.1','ff.72.4','ff.73.6','ff.74.1','ff.76.4','ff.77.1','ff.77.5',
  'ff.82.3','ff.82.4','ff.89.3','ff.94.3','ff.97.4','ff.102.5',
  'ff.108.2','ff.111.1','ff.111.3','ff.112.1','ff.112.2','ff.131.1'
];

const targetSet = new Set(targets);
const results = {};

rawData.forEach(ch => {
  if (ch.subchapters) {
    ch.subchapters.forEach(sc => {
      const m = sc.title.match(/ff\.(\d+)\.(\d+)/);
      if (m) {
        const code = 'ff.' + m[1] + '.' + m[2];
        if (targetSet.has(code) && results[code] === undefined) {
          results[code] = {title: sc.title, content: sc.content};
        }
      }
    });
  }
});

for (const code of targets) {
  if (results[code]) {
    console.log('=== ' + code + ' === ' + results[code].title);
    console.log(results[code].content);
    console.log('---END---');
  }
}

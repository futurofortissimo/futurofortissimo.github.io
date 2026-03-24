import {rawData} from './data.js';

const usedList = 'ff.1.4,ff.4.1,ff.9.1,ff.13.1,ff.16.4,ff.18.3,ff.18.5,ff.19.1,ff.19.2,ff.19.3,ff.19.4,ff.19.5,ff.22.1,ff.23.4,ff.25.1,ff.25.2,ff.29.1,ff.33.1,ff.33.2,ff.34.1,ff.36.1,ff.36.2,ff.36.3,ff.36.4,ff.37.2,ff.37.3,ff.43.1,ff.44.1,ff.44.2,ff.45.3,ff.46.1,ff.47.3,ff.48.1,ff.49.3,ff.50.1,ff.50.3,ff.55.1,ff.56.1,ff.56.3,ff.59.3,ff.60.4,ff.62.1,ff.62.2,ff.62.3,ff.62.4,ff.64.2,ff.68.4,ff.69.1,ff.70.3,ff.71.2,ff.78.1,ff.79.2,ff.81.3,ff.82.1,ff.82.2,ff.83.5,ff.85.1,ff.86.1,ff.86.2,ff.86.3,ff.87.1,ff.87.2,ff.88.1,ff.88.2,ff.88.3,ff.88.5,ff.89.2,ff.90.3,ff.92.1,ff.92.2,ff.92.3,ff.94.2,ff.95.1,ff.95.2,ff.95.3,ff.95.5,ff.97.1,ff.97.2,ff.98.1,ff.98.3,ff.99.1,ff.99.2,ff.99.4,ff.99.5,ff.102.3,ff.103.2,ff.103.3,ff.104.3,ff.105.3,ff.105.4,ff.106.1,ff.106.3,ff.108.1,ff.109.1,ff.109.4,ff.110.1,ff.110.3,ff.111.2,ff.111.4,ff.112.5,ff.113.1,ff.113.3,ff.113.4,ff.115.1,ff.115.2,ff.116.1,ff.116.2,ff.117.1,ff.117.2,ff.118.1,ff.118.2,ff.118.3,ff.119.1,ff.119.2,ff.119.3,ff.119.4,ff.120.1,ff.120.2,ff.120.3,ff.120.4,ff.121.1,ff.121.2,ff.122.1,ff.122.2,ff.122.3,ff.122.4,ff.122.5,ff.123.1,ff.123.3,ff.124.1,ff.124.2,ff.124.3,ff.124.4,ff.125.1,ff.125.2,ff.125.3,ff.125.4,ff.126.1,ff.126.3,ff.126.4,ff.127.1,ff.127.2,ff.127.3,ff.129.1,ff.129.2,ff.130.1,ff.130.2,ff.130.3,ff.130.4,ff.130.5,ff.131.3,ff.131.4,ff.132.1,ff.132.2,ff.132.3,ff.134.1,ff.134.2,ff.134.3,ff.134.4,ff.135.1,ff.135.2,ff.135.3,ff.135.4,ff.135.5,ff.137.1,ff.137.3,ff.137.4,ff.138.1,ff.138.2,ff.138.3,ff.138.4,ff.138.5,ff.139.1,ff.139.2,ff.139.3,ff.140.1,ff.140.2,ff.140.3,ff.141.1,ff.141.2,ff.141.3,ff.142.1,ff.142.2,ff.143.1,ff.143.3,ff.143.4,ff.144.1,ff.144.2,ff.144.3';
const used = new Set(usedList.split(','));

const unused = [];
const seen = new Set();
rawData.forEach(ch => {
  if (ch.subchapters) {
    ch.subchapters.forEach(sc => {
      const m = sc.title.match(/ff\.(\d+)\.(\d+)/);
      if (m) {
        const code = 'ff.' + m[1] + '.' + m[2];
        if (used.has(code) === false && seen.has(code) === false) {
          seen.add(code);
          unused.push({code, num: parseInt(m[1]), title: sc.title});
        }
      }
    });
  }
});

unused.sort((a,b) => a.num - b.num);
unused.forEach(u => console.log(u.code + ' | ' + u.title));

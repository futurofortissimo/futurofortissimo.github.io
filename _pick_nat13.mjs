import {readFileSync} from 'fs';
const notes = JSON.parse(readFileSync('./notes.json','utf8')).notes;
const used = new Set(`1579 1589 1416 1596 1381 1634 1411 1590 1297 1623 1615 1413 1415 1621 1378 1609 1294 1406 1629 1412 1631 1220 1606 1618 1388 1619 1676 1351 1372 1661 1375 1488 1602 1611 1410 1613 1460 1401 1591 1600 1669 1452 1644 1384`.split(/\s+/).map(Number));
const bookUsed = new Set(readFileSync('./_bookids.txt','utf8').split(/\s+/).filter(Boolean).map(Number));
const nat = notes.filter(n=>!used.has(n.id) && !bookUsed.has(n.id) && (n.tags||[]).some(t=>['🍃','🍽','⚡','🌍'].includes(t)));
nat.sort((a,b)=>b.id-a.id);
for (const n of nat.slice(0,40)) console.log(n.id, '|', (n.tags||[]).join(''), '|', n.title.slice(0,110));
console.log('TOT', nat.length, 'of', notes.length);

import {rawData} from './data.js';
const nums=rawData.map(i=>{const m=/ff\.(\d+)/.exec(i.title||'');return m?+m[1]:null}).filter(Boolean).sort((a,b)=>a-b);
console.log('range:',nums[0],'->',nums[nums.length-1],'count',nums.length);
const set=new Set(nums);
console.log('has 4?',set.has(4),'has 53?',set.has(53),'has 132?',set.has(132));
console.log('first 15:',nums.slice(0,15).join(','));

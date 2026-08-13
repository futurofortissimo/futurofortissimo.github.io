import io,sys,re,json
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8',errors='replace')
d=open('data.js',encoding='utf-8').read()
start=d.index('['); txt=d[start:].rstrip()
while txt and txt[-1]!=']': txt=txt[:-1]
data=json.loads(txt)
subs=[]
def walk(n):
    if isinstance(n,dict):
        if isinstance(n.get('subchapters'),list):
            for s in n['subchapters']:
                if isinstance(s,dict) and 'title' in s: subs.append(s)
        for v in n.values(): walk(v)
    elif isinstance(n,list):
        for v in n: walk(v)
walk(data)
codes={}
for s in subs:
    m=re.match(r'.*?ff\.(\d+)\.(\d+)',s.get('title',''))
    if m: codes[f'{m.group(1)}.{m.group(2)}']=s
nums=sorted({int(k.split('.')[0]) for k in codes})
print('max chapter code:',nums[-1],'| min:',nums[0],'| total codes:',len(codes))
for c in sys.argv[1:]:
    s=codes.get(c)
    if not s: print('MISSING',c); continue
    print('='*70)
    print('TITLE:',s['title'])
    print(re.sub(r'\s+',' ',(s.get('content') or ''))[:900])

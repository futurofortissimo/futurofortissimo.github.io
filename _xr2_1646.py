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
used=set()
for f in ['book/chapter-02-3-2.html','book/chapter-02-prodotti.html']:
    used |= set(re.findall(r'ff\.(\d+\.\d+)',open(f,encoding='utf-8').read()))
terms=sys.argv[1:]
for s in subs:
    t=s.get('title','');c=(s.get('content') or '')
    m=re.match(r'.*?ff\.(\d+\.\d+)',t)
    if not m: continue
    code=m.group(1)
    low=(t+' '+c).lower()
    hits=[w for w in terms if w in low]
    if hits:
        flag='USED' if code in used else 'free'
        print(f'[{flag}] ff.{code} | {t} | hits={hits}')

import io,sys,re,json
sys.stdout=io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8',errors='replace')
d=open('data.js',encoding='utf-8').read()
start=d.index('[')
txt=d[start:].rstrip()
while txt and txt[-1] != ']': txt=txt[:-1]
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
print('subchapters:',len(subs))
# already used in target files
used=set()
for f in ['book/chapter-02-3-2.html','book/chapter-02-prodotti.html']:
    h=open(f,encoding='utf-8').read()
    used |= set(re.findall(r'ff\.(\d+\.\d+)',h))
print('already used in target files:',len(used))
kwsets={
 'finanza':['hedge fund','investitor','finanz','analista','trading','borsa','mercati'],
 'specializ':['fine-tun','open source','modello specializz','distillaz','piccoli modelli','open-source','llama','mistral'],
 'costo':['costo per token','inferenza','costo dei modelli','prezzo dei modelli','compute'],
 'giudizio':['giudizio','esperto','expertise','competenza','professionist','white collar','colletti bianchi'],
}
for s in subs:
    t=s.get('title','');c=(s.get('content') or '')
    m=re.match(r'.*?ff\.(\d+\.\d+)',t)
    if not m: continue
    code=m.group(1)
    if code in used: continue
    low=(t+' '+c).lower()
    score={k:[w for w in ws if w in low] for k,ws in kwsets.items()}
    tot=sum(len(v) for v in score.values())
    cats=sum(1 for v in score.values() if v)
    if cats>=2 and tot>=3:
        print(f'--- ff.{code} | {t} | cats={cats} tot={tot} | {score}')
        print('   ', re.sub(r'\s+',' ',c)[:300])

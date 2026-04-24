import re, json, sys

datajs = open('data.js', encoding='utf-8', errors='ignore').read()

target = ['ff.10.5','ff.12.5','ff.15.5','ff.15.6','ff.21.4','ff.24.2','ff.24.3','ff.24.4','ff.24.5','ff.25.4','ff.26.4','ff.28.4','ff.3.7','ff.30.2','ff.40.4','ff.41.1','ff.41.2','ff.41.3','ff.41.4','ff.41.6','ff.43.3','ff.43.4','ff.47.4','ff.54.3','ff.54.5','ff.55.4','ff.63.4','ff.67.3','ff.7.4','ff.7.6','ff.71.4','ff.79.1','ff.8.4','ff.8.5','ff.128.1']

extracted = {}
for t in target:
    code_esc = re.escape(t)
    pat = re.compile(r'\{\s*"title"\s*:\s*"([^"]*' + code_esc + r'[^"]*)"[^}]*?"content"\s*:\s*"((?:[^"\\]|\\.)*)"', re.DOTALL)
    m = pat.search(datajs)
    if not m:
        extracted[t] = {'title': None, 'content': None}
        continue
    title = m.group(1)
    content = m.group(2)
    content = content.replace('\\n','\n').replace('\\"','"').replace("\\\\","\\")
    link_m = re.search(r'"link"\s*:\s*"([^"]+)"', datajs[m.start():m.start()+6000])
    link = link_m.group(1) if link_m else None
    extracted[t] = {'title': title, 'content': content, 'link': link}

with open('generated/_extracted_content_2026-04-24.json','w',encoding='utf-8') as f:
    json.dump(extracted, f, ensure_ascii=False, indent=2)

for t, v in extracted.items():
    title = v.get('title')
    ok = 'OK' if v.get('content') else 'MISS'
    cl = len(v.get('content') or '')
    print(f'{ok} {t} [{cl}ch] {(title or "MISSING")[:70]}')

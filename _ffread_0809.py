import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
subs = json.load(open('_ffidx_0809.json', encoding='utf-8'))
by = {}
for s in subs:
    by.setdefault(s['code'], s)
for c in sys.argv[1:]:
    s = by.get(c)
    if not s:
        print('### %s NOT FOUND' % c)
        continue
    print('### %s | %s' % (c, s['title']))
    print('issue:', s['issue'])
    print('link:', s['link'])
    print('content:', s['content'][:1100].replace('\n', ' '))
    print()

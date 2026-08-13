import re, json, sys

s = open('data.js', encoding='utf-8').read()
data = json.loads(s[s.index('['):s.rindex(']') + 1])

subs = {}
for issue in data:
    for sub in issue.get('subchapters', []):
        t = sub.get('title', '')
        m = re.search(r'ff\.(\d+)\.(\d+)', t)
        if m:
            subs['ff.%s.%s' % (m.group(1), m.group(2))] = sub

mode = sys.argv[1]

if mode == 'show':
    for code in sys.argv[2:]:
        sub = subs[code]
        print('===', code, '|', repr(sub['title']))
        print('LINK:', sub.get('link'))
        print(re.sub(r'\s+', ' ', sub.get('content', ''))[:1100])
        print()
elif mode == 'grep':
    pat = re.compile(sys.argv[2], re.I)
    for code, sub in subs.items():
        c = sub.get('content', '') or ''
        for m in pat.finditer(c):
            print(code, '|', sub['title'], '|', re.sub(r'\s+', ' ', c[max(0, m.start() - 120):m.start() + 180]))
            break

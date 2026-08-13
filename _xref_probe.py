import io, re, os, sys, json

base = os.path.dirname(os.path.abspath(__file__))
src = io.open(os.path.join(base, 'data.js'), encoding='utf-8').read()

# find subchapter blocks: look for "ff.X.Y" codes and nearby titles
terms = sys.argv[1:] or ['alzheimer', 'psichedel', 'psilocib', 'demenza', 'neurodegener', 'plasticit']

# Build index of code -> (title, span start)
code_re = re.compile(r'"code"\s*:\s*"(ff\.\d+\.\d+)"')
positions = [(m.group(1), m.start()) for m in code_re.finditer(src)]
print('codes found', len(positions))

def code_at(pos):
    prev = None
    for c, p in positions:
        if p > pos:
            break
        prev = (c, p)
    return prev

out = []
for t in terms:
    for m in re.finditer(re.escape(t), src, re.I):
        ca = code_at(m.start())
        if not ca:
            continue
        ctx = src[max(0, m.start() - 260):m.start() + 260].replace('\n', ' ')
        out.append('### %s [%s]\n%s\n' % (ca[0], t, ctx))

io.open(os.path.join(base, '_xref_probe.txt'), 'w', encoding='utf-8').write('\n'.join(out))
print('matches', len(out))

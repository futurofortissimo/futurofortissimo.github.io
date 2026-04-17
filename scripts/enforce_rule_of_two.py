#!/usr/bin/env python3
"""
OPERATIVE_SUPER_RULE §6 enforcement: max 2 <mark class="note-highlight">
per paragrafo. Per ogni <p> con N > 2 highlight, mantiene i primi 2 e
sostituisce gli altri con il loro testo interno.

Input:  tutti i book/chapter-*.html (esclude chapter-0N.html intro)
Output: file modificati in-place + log dei cambiamenti

Idempotente: rieseguibile.
"""
import re
from pathlib import Path

BOOK = Path(__file__).resolve().parent.parent / "book"

MARK_PATTERN = re.compile(
    r'<mark class="note-highlight">(.*?)</mark>',
    re.DOTALL
)
# Match a single <p> ... </p> block (non-greedy, no nesting <p>)
PARA_PATTERN = re.compile(r'<p\b[^>]*>(.*?)</p>', re.DOTALL | re.IGNORECASE)

def fix_paragraph(para_body: str, limit: int = 2):
    """Keep first `limit` <mark> intact, unwrap the rest."""
    count = 0
    def repl(m):
        nonlocal count
        count += 1
        if count <= limit:
            return m.group(0)
        return m.group(1)  # Strip the <mark>, keep inner text
    new_body = MARK_PATTERN.sub(repl, para_body)
    return new_body, count

def process_file(path: Path):
    html = path.read_text(encoding="utf-8")
    changes = []
    def para_repl(m):
        body = m.group(1)
        n_marks = len(MARK_PATTERN.findall(body))
        if n_marks <= 2:
            return m.group(0)
        new_body, orig_count = fix_paragraph(body, limit=2)
        changes.append((orig_count, orig_count - 2))
        # Reconstruct <p> with original opening tag
        opening = m.group(0)[:m.start(1) - m.start(0)]
        closing = "</p>"
        return opening + new_body + closing
    new_html = PARA_PATTERN.sub(para_repl, html)
    if new_html != html:
        path.write_text(new_html, encoding="utf-8")
    return changes

if __name__ == "__main__":
    total_paras_fixed = 0
    total_marks_removed = 0
    per_file = {}
    for p in sorted(BOOK.glob("chapter-*.html")):
        # Skip chapter intros (chapter-01.html, chapter-02.html, chapter-03.html) if they have no injected prose
        # Actually we process all; the audit didn't distinguish.
        changes = process_file(p)
        if changes:
            per_file[p.name] = (len(changes), sum(c[1] for c in changes))
            total_paras_fixed += len(changes)
            total_marks_removed += sum(c[1] for c in changes)
    for f, (paras, marks) in sorted(per_file.items()):
        print(f"  {f:40s}  {paras} paragraphs fixed  ({marks} marks unwrapped)")
    print(f"\nTotale: {total_paras_fixed} paragrafi sistemati · {total_marks_removed} highlight rimossi")

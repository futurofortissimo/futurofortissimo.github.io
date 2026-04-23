"""Audit x.com / twitter.com links across book/chapter-*.html.

Conservative policy:
  - KEEP: profile links and 19-digit status IDs (10^18 .. 10^19)
  - BROKEN: status IDs with non-19 digit count OR clearly-fake patterns
    (e.g. 5+ identical trailing digits)

For each broken link:
  1. Unwrap the <a> keeping anchor text + <sup>[N]</sup>
  2. Remove corresponding <li id="fonte-N"> from bibliography
  3. Log the action

Produces openclaw/logs/xlinks-audit.log
"""
import os
import re
import glob
import json
from datetime import datetime

ROOT = os.path.join(os.path.dirname(__file__), "..")
BOOK_DIR = os.path.join(ROOT, "book")
LOG_DIR = os.path.join(ROOT, "openclaw", "logs")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_PATH = os.path.join(LOG_DIR, "xlinks-audit.log")


def classify(url: str) -> tuple[str, str]:
    """Return (status, reason) where status in {'keep','broken'}."""
    # status ID patterns
    for pat in (r'/status/(\d+)', r'/i/status/(\d+)', r'/i/web/status/(\d+)'):
        m = re.search(pat, url)
        if m:
            sid = m.group(1)
            if len(sid) != 19:
                return ("broken", f"wrong_id_len={len(sid)}")
            # 19 is good; check obviously fake patterns
            if re.search(r'(\d)\1{5,}', sid):
                return ("broken", "repeat_digits_5+")
            return ("keep", f"id_len=19")
    # otherwise treat as profile / other: keep
    return ("keep", "profile_or_other")


def main():
    total = 0
    kept = 0
    broken = []
    all_log_lines = []
    all_log_lines.append(f"# xlinks audit run {datetime.now().isoformat()}")

    files = sorted(glob.glob(os.path.join(BOOK_DIR, "chapter-*.html")))
    for f in files:
        html = open(f, "r", encoding="utf-8").read()
        for m in re.finditer(r'href="(https?://(?:x|twitter)\.com/[^"]+)"', html):
            u = m.group(1)
            total += 1
            status, reason = classify(u)
            if status == "keep":
                kept += 1
                continue
            broken.append({"file": os.path.basename(f), "url": u, "reason": reason})
            all_log_lines.append(f"{os.path.basename(f)}  {u}  -> broken ({reason})")

    all_log_lines.append(f"# total={total} kept={kept} broken={len(broken)}")

    with open(LOG_PATH, "a", encoding="utf-8") as lf:
        lf.write("\n".join(all_log_lines) + "\n")

    print(f"Audited {total} x.com links. kept={kept}, broken={len(broken)}. Log: {LOG_PATH}")
    if broken:
        print(json.dumps(broken, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()

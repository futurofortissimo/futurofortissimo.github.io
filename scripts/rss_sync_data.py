#!/usr/bin/env python3
"""RSS sync: fetch the Substack feed and append missing newsletters to data.js.

Recurring task [ff-rss-sync]: every 10 days, pull https://fortissimo.substack.com/feed
and materialise any published ff.N that is not yet in data.js, using the exact
schema already in the file (url/title/subtitle/keypoints/subchapters[]).

Subchapter fields:
  title       <h4> text, e.g. "🐺 ff.150.1 Lupi, virus e neuroni"
  link        canonical /i/<post-slug>/<anchor> permalink
  content     prose (p + blockquote) with entities decoded, whitespace collapsed
  images      underlying s3 sources (the substackcdn /image/fetch/ wrapper is unwrapped)
  references  external links
  connections links back into fortissimo.substack.com (ff cross-refs)

Usage:
  python scripts/rss_sync_data.py --check      # report the gap, write nothing
  python scripts/rss_sync_data.py --apply      # append missing entries to data.js
"""

import argparse
import json
import re
import sys
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

# FF titles are emoji-first and the Windows console defaults to cp1252, which
# turns every progress line into a UnicodeEncodeError. Force UTF-8 on our own
# streams so an unattended run reports instead of dying on a print().
for _stream in (sys.stdout, sys.stderr):
    if hasattr(_stream, "reconfigure"):
        _stream.reconfigure(encoding="utf-8", errors="replace")

FEED_URL = "https://fortissimo.substack.com/feed"
REPO = Path(__file__).resolve().parent.parent
DATA_JS = REPO / "data.js"
CONTENT_NS = "{http://purl.org/rss/1.0/modules/content/}encoded"

# Substack wraps images as /image/fetch/<transforms>/<url-encoded original>.
CDN_FETCH = re.compile(r"https://substackcdn\.com/image/fetch/[^/]+/(https?%3A%2F%2F\S+)")
FF_CODE = re.compile(r"\bff\.(\d+)")


def load_data(path=DATA_JS):
    """Parse data.js (an `export const rawData = [...]` module) into a list."""
    src = path.read_text(encoding="utf-8")
    prefix = src[: src.index("[")]
    body = src[src.index("[") :].rstrip().rstrip(";").rstrip()
    return prefix, json.loads(body)


def dump_data(prefix, data, path=DATA_JS):
    """Write data.js back with the same 4-space indentation as the original."""
    body = json.dumps(data, ensure_ascii=False, indent=4)
    path.write_text(prefix + body + ";\n", encoding="utf-8")


def chapter_of(title):
    m = FF_CODE.search(title or "")
    return int(m.group(1)) if m else None


def clean(text):
    """Collapse whitespace and normalise the NBSP/narrow-space soup Substack emits."""
    text = unicodedata.normalize("NFC", text or "")
    text = text.replace("\xa0", " ").replace(" ", " ").replace("​", "")
    return re.sub(r"\s+", " ", text).strip()


def unwrap_image(url):
    m = CDN_FETCH.match(url or "")
    return urllib.parse.unquote(m.group(1)) if m else url


def slug_of(post_url):
    return post_url.rstrip("/").rsplit("/", 1)[-1]


def anchor_of(heading):
    """Fallback slug rule: accents folded, punctuation dropped, ff.150.1 -> ff1501.

    Substack strips punctuation rather than replacing it with a separator
    ("Prophetic(a) Paprika" -> "prophetica-paprika"), so only whitespace and
    emoji become dashes. live_anchors() is authoritative; this is the backstop
    for when the post page cannot be fetched.
    """
    text = unicodedata.normalize("NFKD", heading)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"ff\.(\d+)\.(\d+)", r"ff\1\2", text)
    text = re.sub(r"[^\x00-\x7f]", " ", text)  # emoji -> separator
    text = "".join(c for c in text if c.isalnum() or c.isspace())  # punctuation dropped
    return re.sub(r"\s+", "-", text.strip().lower())


def live_permalinks(post_url):
    """Real subchapter permalinks, in document order, read from the published post.

    The slug form /i/<post-slug>/<anchor> that anchor_of() implies is NOT valid:
    Substack answers it with 400. The only working shape is
    /i/<numeric-post-id>/<anchor>, and the numeric id appears nowhere in the RSS
    feed - it has to come from the rendered page, where each heading carries a
    data-href with the canonical permalink already assembled.
    """
    try:
        req = urllib.request.Request(post_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            html = r.read().decode("utf-8", "replace")
    except Exception as exc:  # noqa: BLE001 - network is best-effort
        print(f"  ! could not fetch {post_url} ({exc}); falling back to derived slugs")
        return []

    # One data-href per heading, in document order; dedupe keeping first sight.
    found, seen = [], set()
    for url in re.findall(r'data-href="(https://fortissimo\.substack\.com/i/\d+/ff\d+-[^"]+)"', html):
        if url not in seen:
            seen.add(url)
            found.append(url)
    return found


def parse_post(title, link, subtitle, html):
    """Turn one feed item into a data.js entry."""
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, "lxml")
    slug = slug_of(link)
    permalinks = live_permalinks(link)

    # Keypoints: the intro bullet list, before the first subchapter heading.
    keypoints = []
    first_h = soup.find(["h3", "h4"])
    for li in soup.find_all("li"):
        if first_h and li.sourceline and first_h.sourceline and li.sourceline > first_h.sourceline:
            continue
        kp = clean(li.get_text(" "))
        if kp and kp not in keypoints:
            keypoints.append(kp)

    subchapters = []
    for h in soup.find_all(["h3", "h4"]):
        heading = clean(h.get_text(" "))
        if not re.search(r"ff\.\d+\.\d+", heading):
            continue

        prose, images, references, connections = [], [], [], []
        seen_ref, seen_conn, seen_img = set(), set(), set()

        for node in h.next_siblings:
            if getattr(node, "name", None) in ("h3", "h4") and re.search(
                r"ff\.\d+\.\d+", clean(node.get_text(" "))
            ):
                break  # next subchapter starts here
            if not getattr(node, "name", None):
                continue

            # Skip the recurring subscribe/pullquote boilerplate block.
            classes = node.get("class") or []
            if "subscription-widget-wrap" in classes or "button-wrapper" in classes:
                continue

            for img in node.find_all("figure"):
                a = img.find("a", href=True)
                src = unwrap_image(a["href"]) if a else None
                if not src:
                    tag = img.find("img")
                    src = unwrap_image(tag.get("src")) if tag else None
                if src and src not in seen_img:
                    seen_img.add(src)
                    cap = img.find("figcaption")
                    images.append({"src": src, "caption": clean(cap.get_text(" ")) if cap else ""})

            for a in node.find_all("a", href=True):
                href, text = a["href"], clean(a.get_text(" "))
                if not text or "/subscribe" in href or "translate.goog" in href:
                    continue
                if "fortissimo.substack.com" in href or "futurofortissimo.github.io" in href:
                    if FF_CODE.search(text) and href not in seen_conn:
                        seen_conn.add(href)
                        connections.append({"text": text, "url": href})
                elif href not in seen_ref:
                    seen_ref.add(href)
                    references.append({"text": text, "url": href})

            if node.name in ("p", "blockquote", "ul", "ol"):
                txt = clean(node.get_text(" "))
                if txt and "futuro fortissimo raccoglie" not in txt:
                    prose.append(txt)

        # Headings and data-hrefs share document order, so index alignment holds.
        idx = len(subchapters)
        permalink = (
            permalinks[idx]
            if idx < len(permalinks)
            else f"https://fortissimo.substack.com/i/{slug}/{anchor_of(heading)}"
        )

        subchapters.append(
            {
                "title": heading,
                "link": permalink,
                "content": " ".join(prose),
                "images": images,
                "references": references,
                "connections": connections,
            }
        )

    return {
        "url": link,
        "title": clean(title),
        "subtitle": clean(subtitle),
        "keypoints": keypoints,
        "subchapters": subchapters,
    }


def fetch_feed():
    req = urllib.request.Request(FEED_URL, headers={"User-Agent": "ff-rss-sync/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="write the missing entries to data.js")
    ap.add_argument("--check", action="store_true", help="report the gap only")
    ap.add_argument("--feed", help="local feed XML instead of fetching")
    args = ap.parse_args()

    import xml.etree.ElementTree as ET

    raw = Path(args.feed).read_bytes() if args.feed else fetch_feed()
    root = ET.fromstring(raw)

    prefix, data = load_data()
    have = {chapter_of(e["title"]) for e in data} - {None}

    missing = []
    for item in root.iter("item"):
        title = item.findtext("title") or ""
        n = chapter_of(title)
        if n is None or n in have:
            continue
        missing.append(
            parse_post(
                title,
                item.findtext("link"),
                item.findtext("description") or "",
                item.findtext(CONTENT_NS) or "",
            )
        )

    missing.sort(key=lambda e: chapter_of(e["title"]))
    if not missing:
        print(f"data.js up to date (latest ff.{max(have)}) — nothing to sync")
        return 0

    for e in missing:
        print(f"MISSING ff.{chapter_of(e['title'])}: {e['title']} — {len(e['subchapters'])} subchapters")
        for sc in e["subchapters"]:
            print(
                f"   {sc['title']}  [{len(sc['content'])} chars, "
                f"{len(sc['images'])} img, {len(sc['references'])} ref, {len(sc['connections'])} conn]"
            )

    if args.apply:
        # data.js is newest-first.
        data = sorted(missing, key=lambda e: chapter_of(e["title"]), reverse=True) + data
        dump_data(prefix, data)
        print(f"\napplied: {len(missing)} entries prepended to data.js ({len(data)} total)")
    else:
        print("\ndry run — pass --apply to write")
    return 0


if __name__ == "__main__":
    sys.exit(main())

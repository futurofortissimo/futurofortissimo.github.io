#!/usr/bin/env python3
"""List authoritative Substack RSS enclosure URLs for recent issues."""

from __future__ import annotations

import argparse
import json
import sys
import urllib.request
import xml.etree.ElementTree as ET


DEFAULT_FEED = "https://fortissimo.substack.com/feed"
USER_AGENT = "Mozilla/5.0 (compatible; FuturoFortissimoDraftReview/1.0)"


def fetch(url: str) -> bytes:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def text(item: ET.Element, tag: str) -> str:
    value = item.findtext(tag)
    return value.strip() if value else ""


def parse_items(payload: bytes, limit: int) -> list[dict[str, str]]:
    root = ET.fromstring(payload)
    rows: list[dict[str, str]] = []
    for item in root.findall("./channel/item")[:limit]:
        enclosure = item.find("enclosure")
        rows.append(
            {
                "title": text(item, "title"),
                "link": text(item, "link"),
                "published": text(item, "pubDate"),
                "enclosure_url": enclosure.get("url", "") if enclosure is not None else "",
                "enclosure_type": enclosure.get("type", "") if enclosure is not None else "",
                "enclosure_length": enclosure.get("length", "") if enclosure is not None else "",
            }
        )
    return rows


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(
        description="Read recent Futuro Fortissimo RSS items and their enclosure URLs."
    )
    parser.add_argument("--feed", default=DEFAULT_FEED, help="RSS feed URL")
    parser.add_argument("--limit", type=int, default=5, help="Number of recent items")
    parser.add_argument("--json", action="store_true", help="Print JSON")
    args = parser.parse_args()

    if args.limit < 1:
        parser.error("--limit must be at least 1")

    try:
        rows = parse_items(fetch(args.feed), args.limit)
    except (OSError, ET.ParseError) as exc:
        print(f"feed error: {exc}", file=sys.stderr)
        return 1

    if args.json:
        print(json.dumps(rows, ensure_ascii=False, indent=2))
        return 0

    for index, row in enumerate(rows, start=1):
        print(f"{index}. {row['title']}")
        print(f"   post: {row['link']}")
        print(f"   enclosure: {row['enclosure_url'] or '[missing]'}")
        if row["enclosure_type"]:
            print(f"   type: {row['enclosure_type']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

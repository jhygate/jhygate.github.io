#!/usr/bin/env python3
"""Download the cover for every book in books.json into covers/<isbn>.jpg so the site
serves them itself. Skips covers already on disk. Run it after adding a book."""
import json, sys, time, urllib.request, pathlib

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / 'covers'; OUT.mkdir(exist_ok=True)
books = json.loads((ROOT / 'books.json').read_text())
todo = [b for k in ('reading', 'read') for b in books.get(k, []) if b.get('isbn') and not b.get('cover')]
missing = []
for b in todo:
    dest = OUT / f"{b['isbn']}.jpg"
    if dest.exists() and dest.stat().st_size > 1000: continue
    got = False
    for size in ('L', 'M'):
        url = f"https://covers.openlibrary.org/b/isbn/{b['isbn']}-{size}.jpg?default=false"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'jackhygate.co.uk bookshelf (jhygate@gmail.com)'})
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
            if len(data) > 1000:
                dest.write_bytes(data); got = True
                print(f"  {b['title']:<40} {size} {len(data)//1024}k"); break
        except Exception as e:
            pass
        time.sleep(0.4)
    if not got: missing.append(b['title'])
print(f"{len(todo) - len(missing)} covers in {OUT.relative_to(ROOT)}/")
if missing: print("no cover found for: " + ", ".join(missing))

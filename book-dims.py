#!/usr/bin/env python3
"""Record each book's image proportions in books.json so the shelf can lay everything out
before the pictures load. Run after adding covers or spines: python3 book-dims.py"""
import json, pathlib
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent
d = json.loads((ROOT / 'books.json').read_text())
n = 0
for b in d.get('reading', []) + d.get('read', []):
    dims = {}
    for key in ('cover', 'spine'):
        p = b.get(key)
        if p and not p.startswith('http') and (ROOT / p).exists():
            w, h = Image.open(ROOT / p).size; dims[key] = round(w / h, 4)
    if not b.get('cover') and b.get('isbn') and (ROOT / 'covers' / f"{b['isbn']}.jpg").exists():
        w, h = Image.open(ROOT / 'covers' / f"{b['isbn']}.jpg").size; dims['cover'] = round(w / h, 4)
    if dims: b['ratio'] = dims; n += 1
    elif 'ratio' in b: del b['ratio']
(ROOT / 'books.json').write_text(json.dumps(d, indent=2, ensure_ascii=False) + '\n')
print(f'{n} books measured')

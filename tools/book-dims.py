#!/usr/bin/env python3
"""Record each book's image proportions in data/books.json so the shelf can lay everything out
before the pictures load. Run after adding covers or spines: python3 tools/book-dims.py"""
import json, pathlib
from PIL import Image
ROOT = pathlib.Path(__file__).resolve().parent.parent
BOOKS = ROOT / 'data' / 'books.json'
d = json.loads(BOOKS.read_text())
n = 0
for b in d.get('reading', []) + d.get('read', []):
    dims = {}
    for key in ('cover', 'spine'):
        p = b.get(key)
        if p and not p.startswith('http') and (ROOT / p.lstrip('/')).exists():
            w, h = Image.open(ROOT / p.lstrip('/')).size; dims[key] = round(w / h, 4)
    if dims: b['ratio'] = dims; n += 1
    elif 'ratio' in b: del b['ratio']
BOOKS.write_text(json.dumps(d, indent=2, ensure_ascii=False) + '\n')
print(f'{n} books measured')

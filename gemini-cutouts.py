#!/usr/bin/env python3
"""Turn hand-held photos of books into clean cut-outs with Gemini, then crop to the book's edges.

  GEMINI_API_KEY=... python3 gemini-cutouts.py photos/ manifest.json

manifest.json maps each photo to a book and a side:
  { "PXL_....jpg": { "slug": "steppenwolf", "kind": "front" }, ... }
Fronts land in covers/<slug>.png and spines in spines/<slug>.png, both transparent. Point books.json at them with "cover" / "spine" fields."""
import base64, json, os, sys, time, pathlib, urllib.request, concurrent.futures
from PIL import Image, ImageOps, ImageFilter

KEY = os.environ.get('GEMINI_API_KEY') or sys.exit('set GEMINI_API_KEY')
MODEL = os.environ.get('GEMINI_IMAGE_MODEL', 'gemini-2.5-flash-image')
ROOT = pathlib.Path(__file__).resolve().parent
photos = pathlib.Path(sys.argv[1]); manifest = json.loads(pathlib.Path(sys.argv[2]).read_text())
(ROOT / 'covers').mkdir(exist_ok=True); (ROOT / 'spines').mkdir(exist_ok=True)

PROMPTS = {
  'front': ("Edit this photo: remove the background and the hand completely and keep only the paperback book. "
            "Show the whole front cover flat-on and straightened, filling the frame, reconstructing any part hidden by the fingers. "
            "Keep the cover's real artwork, text and wear exactly as they are; do not redesign anything. Flat, even lighting with no shadow anywhere on or around the book. Plain pure white background."),
  'spine': ("Edit this photo: remove the background and the hand completely and keep only the paperback book's spine. "
            "Show the whole spine flat-on and perfectly vertical, filling the frame top to bottom, reconstructing any part hidden by the fingers. "
            "Keep the spine's real text, colours and wear exactly as they are; do not redesign anything. Flat, even lighting with no shadow anywhere. Plain pure white background."),
}

def prep(path):                      # phone photos are huge; 1600px is plenty for the model
    im = ImageOps.exif_transpose(Image.open(path)).convert('RGB'); im.thumbnail((1600, 1600))
    import io; buf = io.BytesIO(); im.save(buf, 'JPEG', quality=90); return base64.b64encode(buf.getvalue()).decode()

def generate(path, kind):
    body = {"contents": [{"parts": [{"text": PROMPTS[kind]}, {"inline_data": {"mime_type": "image/jpeg", "data": prep(path)}}]}],
            "generationConfig": {"responseModalities": ["IMAGE"]}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
                                 data=json.dumps(body).encode(), headers={"content-type": "application/json", "x-goog-api-key": KEY})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=180) as r: res = json.load(r)
            for part in res["candidates"][0]["content"]["parts"]:
                if "inlineData" in part: return base64.b64decode(part["inlineData"]["data"])
            raise RuntimeError("no image in response: " + json.dumps(res)[:300])
        except Exception as e:
            if attempt == 2: raise
            time.sleep(4 * (attempt + 1))

def trim_rect(im, frac=0.5):
    """Crop to the book's rectangle: rows and columns where most pixels are clearly not the
    white backdrop or its soft shadow. A straight crop leaves any shadow outside."""
    rgb = im.convert('RGB'); W, H = rgb.size; px = rgb.load()
    def strong(x, y):
        r, g, b = px[x, y]; mx, mn = max(r, g, b), min(r, g, b)
        return (mx < 205) or (mx - mn > 12)          # darker than a soft shadow, or has any colour (shadows are neutral)
    cols = [sum(1 for y in range(0, H, 2) if strong(x, y)) for x in range(W)]
    rows = [sum(1 for x in range(0, W, 2) if strong(x, y)) for y in range(H)]
    cx = [x for x, c in enumerate(cols) if c >= max(cols) * frac]; ry = [y for y, c in enumerate(rows) if c >= max(rows) * frac]
    return rgb.crop((min(cx) + 2, min(ry) + 2, max(cx) - 1, max(ry) - 1)).convert('RGBA')

def run(item):
    name, meta = item; kind, slug = meta['kind'], meta['slug']
    png = generate(photos / name, kind)
    import io; im = Image.open(io.BytesIO(png))
    cut = trim_rect(im)
    dest = ROOT / ('covers' if kind == 'front' else 'spines') / f'{slug}.png'; cut.save(dest)
    return f"{slug:<28} {kind:<6} {cut.size[0]}x{cut.size[1]}  → {dest.relative_to(ROOT)}"

with concurrent.futures.ThreadPoolExecutor(4) as ex:
    for line in ex.map(run, manifest.items()): print(line)

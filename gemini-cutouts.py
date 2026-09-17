#!/usr/bin/env python3
"""Turn hand-held photos of books into clean cut-outs with Gemini, then key the white away.

  GEMINI_API_KEY=... python3 gemini-cutouts.py photos/ manifest.json

manifest.json maps each photo to a book and a side:
  { "PXL_....jpg": { "slug": "steppenwolf", "kind": "front" }, ... }
Fronts land in covers/<slug>.jpg (opaque, on white) and spines in spines/<slug>.png
(transparent). Point books.json at them with "cover" / "spine" fields."""
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
            "Keep the cover's real artwork, text and wear exactly as they are; do not redesign anything. Plain pure white background."),
  'spine': ("Edit this photo: remove the background and the hand completely and keep only the paperback book's spine. "
            "Show the whole spine flat-on and perfectly vertical, filling the frame top to bottom, reconstructing any part hidden by the fingers. "
            "Keep the spine's real text, colours and wear exactly as they are; do not redesign anything. Plain pure white background."),
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

def key_white(im):                  # the plain backdrop → transparent: flood from the corners, whatever shade it came back
    from PIL import ImageDraw
    im = im.convert('RGB'); W, H = im.size
    work = im.copy(); KEYC = (255, 0, 255)
    for seed in [(2, 2), (W-3, 2), (2, H-3), (W-3, H-3), (W//2, 2), (W//2, H-3), (2, H//2), (W-3, H//2)]:
        r, g, b = work.getpixel(seed)
        if max(r, g, b) - min(r, g, b) < 30 and (r + g + b) > 360 and work.getpixel(seed) != KEYC: ImageDraw.floodfill(work, seed, KEYC, thresh=34)
    wp = work.load(); a = Image.new('L', (W, H), 255); ap = a.load()
    for y in range(H):
        for x in range(W):
            if wp[x, y] == KEYC: ap[x, y] = 0
    a = a.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    out = im.convert('RGBA'); out.putalpha(a)
    return out.crop(a.point(lambda v: 255 if v > 10 else 0).getbbox())

def run(item):
    name, meta = item; kind, slug = meta['kind'], meta['slug']
    png = generate(photos / name, kind)
    import io; im = Image.open(io.BytesIO(png))
    cut = key_white(im)
    if kind == 'front':
        flat = Image.new('RGB', cut.size, (255, 255, 255)); flat.paste(cut, mask=cut.split()[3])
        dest = ROOT / 'covers' / f'{slug}.jpg'; flat.save(dest, quality=90)
    else:
        dest = ROOT / 'spines' / f'{slug}.png'; cut.save(dest)
    return f"{slug:<28} {kind:<6} {cut.size[0]}x{cut.size[1]}  → {dest.relative_to(ROOT)}"

with concurrent.futures.ThreadPoolExecutor(4) as ex:
    for line in ex.map(run, manifest.items()): print(line)

#!/usr/bin/env python3
"""Turn hand-held photos of books into clean cut-outs with Gemini, then remove the backdrop.

  GEMINI_API_KEY=... python3 gemini-cutouts.py photos/ manifest.json

manifest.json maps each photo to a book and a side:
  { "PXL_....jpg": { "slug": "steppenwolf", "kind": "front" }, ... }
Fronts land in covers/<slug>.webp and spines in spines/<slug>.webp, both transparent, no taller than 900px. Point books.json at them with "cover" / "spine" fields."""
import base64, json, os, sys, time, pathlib, urllib.request, concurrent.futures, threading
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
            cand = (res.get("candidates") or [{}])[0]
            for part in cand.get("content", {}).get("parts", []):
                if "inlineData" in part: return base64.b64decode(part["inlineData"]["data"])
            raise RuntimeError("no image in response (" + str(cand.get("finishReason")) + "): " + json.dumps(res)[:200])
        except Exception as e:
            if attempt == 2: raise
            time.sleep(4 * (attempt + 1))

def cut_out(im):
    """Remove the backdrop, keeping the book's real outline. rembg (pip install "rembg[cpu]") does
    this cleanly on a flat white background; without it, near-white connected to the border is keyed."""
    im = im.convert('RGBA')
    try:
        from rembg import remove
        out = remove(im, alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=20, alpha_matting_erode_size=4)
    except ImportError:
        from PIL import ImageDraw
        rgb = im.convert('RGB'); W, H = rgb.size; work = rgb.copy(); KEYC = (255, 0, 255)
        for seed in [(2, 2), (W-3, 2), (2, H-3), (W-3, H-3), (W//2, 2), (W//2, H-3), (2, H//2), (W-3, H//2)]:
            if sum(work.getpixel(seed)) > 690: ImageDraw.floodfill(work, seed, KEYC, thresh=24)
        wp = work.load(); a = Image.new('L', (W, H), 255); ap = a.load()
        for y in range(H):
            for x in range(W):
                if wp[x, y] == KEYC: ap[x, y] = 0
        a = a.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7)); out = rgb.convert('RGBA'); out.putalpha(a)
    bbox = out.split()[3].point(lambda v: 255 if v > 8 else 0).getbbox()
    return out.crop(bbox)

SEGMENT_LOCK = threading.Lock()

def run(item):
    name, meta = item; kind, slug = meta['kind'], meta['slug']
    png = generate(photos / name, kind)
    import io; im = Image.open(io.BytesIO(png))
    with SEGMENT_LOCK: cut = cut_out(im)      # rembg's matting is not thread-safe; the API calls still overlap
    if cut.height > 900: cut = cut.resize((round(cut.width * 900 / cut.height), 900), Image.LANCZOS)
    dest = ROOT / ('covers' if kind == 'front' else 'spines') / f'{slug}.webp'; cut.save(dest, 'WEBP', quality=84, method=6)
    return f"{slug:<28} {kind:<6} {cut.size[0]}x{cut.size[1]}  → {dest.relative_to(ROOT)}"

def safe(item):
    try: return run(item)
    except Exception as e: return f"FAILED {item[1]['slug']} {item[1]['kind']}: {e}"
with concurrent.futures.ThreadPoolExecutor(4) as ex:
    for line in ex.map(safe, manifest.items()): print(line, flush=True)

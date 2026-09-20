# adding books to the shelf

Every book on the shelf is two photographs: its front cover and its spine, cut out of hand-held
phone photos by Gemini's image model and then segmented locally. A book without both images
is left off the shelf (the console names it), so this is the whole process.

## 1. Photograph

Hold each book up against a plain-ish background and take two photos: the front cover square-on,
and the spine held vertically. Phone photos straight from the camera are fine; the scripts
downscale them. Fifteen to sixty books per batch is comfortable.

## 2. Map photos to books

Write a manifest that says which photo is which:

```json
{
  "PXL_20260917_153807.jpg": { "slug": "love-in-the-time-of-cholera", "kind": "front" },
  "PXL_20260917_153813.jpg": { "slug": "love-in-the-time-of-cholera", "kind": "spine" }
}
```

The slug becomes the file name under `assets/books/`. Building a contact sheet of the photos with
numbers on it and reading off which is which is the quickest way to write this.

## 3. Generate the cut-outs

```
python3 -m venv ~/.venv-books && ~/.venv-books/bin/pip install "rembg[cpu]" pillow
GEMINI_API_KEY=... ~/.venv-books/bin/python tools/gemini-cutouts.py photos/ manifest.json
```

For each photo the script sends Gemini (`gemini-2.5-flash-image`) the photo and one of two
prompts, then removes the plain backdrop with rembg and saves a transparent WebP no taller than
900px into `assets/books/covers/` or `assets/books/spines/`.

**The prompts that work** (in `tools/gemini-cutouts.py`):

> Edit this photo: remove the background and the hand completely and keep only the paperback
> book. Show the whole front cover flat-on and straightened, filling the frame, reconstructing any
> part hidden by the fingers. Keep the cover's real artwork, text and wear exactly as they are; do
> not redesign anything. Flat, even lighting with no shadow anywhere on or around the book. Plain
> pure white background.

> Edit this photo: remove the background and the hand completely and keep only the paperback
> book's spine. Show the whole spine flat-on and perfectly vertical, filling the frame top to
> bottom, reconstructing any part hidden by the fingers. Keep the spine's real text, colours and
> wear exactly as they are; do not redesign anything. Flat, even lighting with no shadow anywhere.
> Plain pure white background.

Things learned the hard way:

- Ask for **no shadow**. Without it Gemini adds a soft grey drop shadow that no background remover
  separates cleanly from a pale book edge.
- **Segment, don't key or crop.** Keying "white" eats pale spines; cropping to a rectangle loses
  worn corners and any slight tilt. rembg on Gemini's flat-white output keeps the real outline.
- **Gemini refuses some covers.** Anything with a photograph of a real person comes back
  `IMAGE_OTHER` (Feynman, Grayson Perry), and Winnie-the-Pooh came back `PROHIBITED_CONTENT`.
  Retrying and rewording didn't help. For those, photograph the cover flat on a plain surface and
  cut it out locally with rembg alone (`rembg i -a in.jpg out.png`).
- rembg's matting isn't thread-safe. The script runs the Gemini calls four at a time but
  serialises segmentation; leave that alone.
- Expect the odd empty response (`no image in response`). The script reports it and carries on;
  rerun just those entries with a smaller manifest.
- Costs are trivial: a batch of sixty photos is well inside the free tier.

## 4. Record the proportions

```
python3 tools/book-dims.py
```

This writes each image's width÷height into `data/books.json` as `ratio.cover` / `ratio.spine`,
so the shelf can size every book before the pictures arrive.

## 5. Add the book to data/books.json

```json
{
  "title": "Love in the Time of Cholera",
  "author": "Gabriel García Márquez",
  "finished": "2026-09",
  "rating": 4,
  "note": "",
  "cover": "/assets/books/covers/love-in-the-time-of-cholera.webp",
  "spine": "/assets/books/spines/love-in-the-time-of-cholera.webp"
}
```

Add `"height": 198` (millimetres, measured with a ruler) if you want it to stand taller or shorter than
its neighbours; without it a book is drawn as a 198mm B-format paperback.

`read` is newest first; the first entry is the most recent finish. `reading` holds the current
book (use `started` instead of `finished`). Run `tools/book-dims.py` after adding entries and the
`ratio` field fills itself in.

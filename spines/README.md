# custom spines and covers

Every book in books.json points at its own images: `"cover": "covers/<slug>.webp"` and
`"spine": "spines/<slug>.webp"`, both transparent WebP no taller than 900px. The shelf draws a
photographed spine as-is, with nothing written over it, at the image's own proportions.

Two scripts keep this honest:

- `gemini-cutouts.py <photos/> <manifest.json>` turns hand-held photos into cut-outs. The
  manifest maps each photo to `{ "slug", "kind": "front" | "spine" }`. Needs GEMINI_API_KEY and,
  for clean edges, `pip install "rembg[cpu]"`.
- `book-dims.py` records each image's proportions in books.json (`ratio`) so the shelf can lay
  out before the pictures arrive. Run it after adding or replacing any image.

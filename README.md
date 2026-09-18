# jackhygate.co.uk

A cork board with a hand-painted Philips telly on it. Static HTML, no build step: push to `main`
and the workflow publishes the repo root to the `deploy` branch, which GitHub Pages serves.

## Layout

| Path | What it is |
|---|---|
| `index.html` | The board: telly, pinned photos, cassette player, bookshelf, clippings folder, A-Z atlas, webring. Styles and the page's own script are inline. |
| `books.html` | The whole bookshelf, every plank. Shares `shelf.css` / `shelf.js` with the front page. |
| `shelf.js`, `shelf.css` | The bookshelf: `renderBookshelf(root, data, { limit })`. |
| `atlas.js`, `atlas.css` | The A-Z atlas: `createAtlas(root, { images, venues })`. |
| `books.json` | The books. One entry per book: title, author, finished (YYYY-MM), note, cover, spine, ratio. |
| `articles.json` | The clippings folder: title, author, source, url, date, minutes, blurb. |
| `recent.json` | Fallback playlist for the cassette player when the rack is unreachable. |
| `covers/`, `spines/` | Book images, transparent WebP. See `spines/README.md`. |
| `pins/`, `logos/`, `images/` | Photos pinned to the board, employer logos, the folder texture. |
| `gemini-cutouts.py`, `book-dims.py` | Helpers for adding books. |

## Live data

- Recently played tracks: `jacks-cassettes.jackhygate.co.uk/api/public/recent` (the cassette rack).
- Venues and the atlas page scans: `venues.jackhygate.co.uk/api/public/venues` and `/atlas/`
  (the venues service, repo `jhygate/venues`). Both are read-only and need no login.

## Working on it

Serve the folder locally, e.g. `python3 -m http.server 8731`, and open `http://localhost:8731/`.
The shared files carry a `?v=N` query in the HTML; bump it when you change `shelf.*` or `atlas.*`
so browsers and the Pages cache pick the change up. The old prototypes (CSS-only telly, desk
scene) live in `~/CodeFun/crt-site-archive`.

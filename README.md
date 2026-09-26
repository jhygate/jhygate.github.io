# jackhygate.co.uk

A cork board with a hand-painted Philips telly on it. Static HTML, no build step: push to `main`
and the workflow publishes the repo root to the `deploy` branch, which GitHub Pages serves.

## Layout

```
index.html            the board                   books.html   the whole bookshelf
                                                  thoughts.html  every random thought, by title
site/                 base.css (type, cork, tape titles, boot), init.js (wires the sections up)
components/           one folder per thing on the board, a .css and a .js each
  telly/              the set: channels, front-panel buttons, sounds, boot screen, clock
  pinned/             the paintings, polaroid and magnets around the set
  projects/           things i've built, as pinned polaroids
  player/             the cassette player and the recently played tape
  shelf/              the bookshelf
  scrapbook/          the folder of clippings
  notebook/           the pocket notebook of random thoughts, and thoughts.html
  atlas/              the A-Z atlas of venues
  wall/               the whiteboard and the visitors' noticeboard
  webring/            the two stickers at the foot
assets/               every image, by what it is: icons/ textures/ telly/ pinned/ projects/ player/ shelf/ books/{covers,spines}
data/                 projects.json, books.json, articles.json, recent.json
tools/                gemini-cutouts.py, book-dims.py and README.md: how books get onto the shelf
```

Each component script is plain JS that leaves one function on `window` (`createAtlas`,
`renderBookshelf`, …); `site/init.js` calls them. Paths are root-relative (`/assets/…`), so the
site must be served from the repo root, which is what Pages and `python3 -m http.server` both do.

## Data

| File | Shape |
|---|---|
| `data/projects.json` | Things I've built, in pinned order: title, blurb, url, photo (a square screenshot in `assets/projects/`). A project with no url isn't out yet and shows as an undeveloped polaroid. |
| `data/books.json` | `reading` (the current book) and `read` (newest first). Every book needs `cover`, `spine` and `ratio`; see `tools/README.md`. Optional `height` in mm sets how tall it stands beside the others. |
| `data/articles.json` | Clippings: title, author, source, url, date, minutes, blurb. |
| `data/thoughts.json` | Random thoughts, newest first: slug, title, date, body. Paragraphs are split by a blank line; `— ` starts a fragment, `![caption](src)` on its own line is a photo and `!sketch[caption](src)` a drawing. Pictures live in `assets/thoughts/`. |
| `data/recent.json` | Fallback playlist when the cassette rack is unreachable. |

## Live data

- Recently played: `jacks-cassettes.jackhygate.co.uk/api/public/recent` (repo `jhygate/cassette-rack`).
- Venues and atlas scans: `venues.jackhygate.co.uk/api/public/venues` and `/atlas/` (repo `jhygate/venues`).
- Whiteboard and notes: `wall.jackhygate.co.uk` (repo `jhygate/wall`), live over server-sent events.

## Working on it

```
python3 -m http.server 8731      # then http://localhost:8731/
```

Stylesheets and scripts are linked with a `?v=<date>` query; change it in both HTML files when you
change any of them so browsers and the Pages cache pick the change up. Work in this repo directly;
the old prototypes (CSS-only telly, desk scene) are archived in `~/CodeFun/crt-site-archive`.

/* wire the sections up. Every component is a plain script that leaves one function on window. */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
addEventListener('load', () => { if (!location.hash || /^#(about|work)$/.test(location.hash)) scrollTo(0, 0); });

createWall({ api: 'https://wall.jackhygate.co.uk', notes: document.getElementById('wall'), board: document.getElementById('whiteboard') });
createAtlas(document.getElementById('atlas'), { images: 'https://venues.jackhygate.co.uk/atlas/', venues: 'https://venues.jackhygate.co.uk/api/public/venues' });
fetch('/data/books.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject())
  .then(d => renderBookshelf(document.querySelector('.books'), d, { limit: 'plank' }))
  .catch(() => renderBookshelf(document.querySelector('.books'), { reading: [], read: [] }, {}));
fetch('/data/articles.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject())
  .then(list => createScrapbook(document.getElementById('reading-scrapbook'), list, { newTab: true }))
  .catch(() => createScrapbook(document.getElementById('reading-scrapbook'), [], { newTab: true }));

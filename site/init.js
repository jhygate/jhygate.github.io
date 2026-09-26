/* wire the sections up. Every component is a plain script that leaves one function on window. */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
addEventListener('load', () => { if (!location.hash || /^#(about|work)$/.test(location.hash)) scrollTo(0, 0); });

createWall({ api: 'https://wall.jackhygate.co.uk', notes: document.getElementById('wall'), board: document.getElementById('whiteboard') });
createAtlas(document.getElementById('atlas'), { images: 'https://venues.jackhygate.co.uk/atlas/', venues: 'https://venues.jackhygate.co.uk/api/public/venues' });
fetch('/data/projects.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject())
  .then(list => createProjects(document.getElementById('projects'), list))
  .catch(() => createProjects(document.getElementById('projects'), []));
fetch('/data/books.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject())
  .then(d => renderBookshelf(document.querySelector('.books'), d, { limit: 'plank' }))
  .catch(() => renderBookshelf(document.querySelector('.books'), { reading: [], read: [] }, {}));
fetch('/data/articles.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject())
  .then(list => createScrapbook(document.getElementById('reading-scrapbook'), list, { newTab: true }))
  .catch(() => createScrapbook(document.getElementById('reading-scrapbook'), [], { newTab: true }));
fetch('/data/thoughts.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject())
  .then(list => createNotebook(document.getElementById('notebook'), list))
  .catch(() => createNotebook(document.getElementById('notebook'), []));

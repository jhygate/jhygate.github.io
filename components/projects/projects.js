/* =====================================================================
   THINGS I'VE BUILT — createProjects(rootElement, projects, options)

   projects: [{ title, blurb, url, photo }] in the order they're pinned
     no url: the project isn't out yet, so its polaroid hasn't developed
     photo: a square-ish screenshot, shown cropped to a square from the top
   options (all optional):
     newTab   open project links in a new tab   (default true)
   ===================================================================== */
(function () {
  'use strict';

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const PINS = ['#d8322a', '#2b62c9', '#e9b520', '#2f9e44'];

  // Seeded from the title so each polaroid keeps the same tilt and pin on every visit
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  function createProjects(root, projects, options = {}) {
    const o = Object.assign({ newTab: true }, options);
    const target = o.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';

    root.innerHTML = projects.map((p, i) => {
      const h = hash(p.title || String(i));
      const tilt = ((h % 90) / 10 - 4.5) * (i % 2 ? 1 : -1) || 1.5;
      const style = `--r:${tilt.toFixed(1)}deg; --pin:${PINS[(h >>> 8) % PINS.length]}`;
      const photo = p.url && p.photo ? `<img src="${esc(p.photo)}" alt="screenshot of ${esc(p.title)}" loading="lazy">` : '';
      const inner = `<span class="pj-photo">${photo}</span>
        <b>${esc(p.title)}</b><span class="pj-blurb">${esc(p.url ? p.blurb : 'still developing…')}</span>`;
      return p.url
        ? `<a class="pj" style="${style}" href="${esc(p.url)}"${target}>${inner}</a>`
        : `<div class="pj developing" style="${style}">${inner}</div>`;
    }).join('');
    (root.closest('section') || root).hidden = !projects.length;
  }

  window.createProjects = createProjects;
})();

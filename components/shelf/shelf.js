/* the bookshelf: data/books.json → the current read face-out on the top plank, finished books as
   photographed spines on the planks below. Shared by index.html (one plank) and books.html (all).
   Every book needs a cover, a spine and their proportions (tools/gemini-cutouts.py, tools/book-dims.py);
   a book missing any of them is left off the shelf and named in the console. An optional height in
   millimetres sets how tall it stands next to the others. */
(() => {
  'use strict';
  const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const stars = n => n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '';
  const monthName = ym => { if (!ym) return ''; const [y, m] = ym.split('-'); return ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'][+m - 1] + ' ' + y; };
  const complete = b => !!(b.cover && b.spine && b.ratio && b.ratio.cover && b.ratio.spine);
  const DEFAULT_MM = 198;                               // a B-format paperback, for books without a measured height
  const mm = b => b.height || DEFAULT_MM;

  window.renderBookshelf = function (root, data, opts = {}) {
    const planksEl = root.querySelector('.planks');
    const readingEl = root.querySelector('#reading');
    const panel = root.querySelector('#opened');
    const seeAll = root.querySelector('#see-all');
    let books = [], reading = null, openIdx = -1;

    function coverHTML(b) {
      return `<div class="cover" style="aspect-ratio:${b.ratio.cover}"><img src="${b.cover}" alt=""></div>`;
    }
    function bookHTML(b, i, k) {
      return `<button class="book" role="listitem" data-i="${i}" style="--h:${(mm(b) * k).toFixed(1)}px;--w:${(mm(b) * b.ratio.spine * k).toFixed(1)}px" title="${esc(b.title)}">
        <img class="side" src="${b.spine}" alt="${esc(b.title)}, ${esc(b.author)}"></button>`;
    }
    function makePlank() {
      const plank = document.createElement('div'); plank.className = 'plank plank-bottom';
      plank.innerHTML = `<img class="wood" src="/assets/shelf/plank.png" alt=""><div class="spines" role="list"></div>`;
      return plank;
    }

    function render(data) {
      const skipped = [...(data.reading || []), ...(data.read || [])].filter(b => !complete(b));
      if (skipped.length) console.warn('bookshelf: left off for want of a cover, spine or ratio:', skipped.map(b => b.title));
      books = (data.read || []).filter(complete);
      const now = reading = (data.reading || []).find(complete);
      if (readingEl) readingEl.innerHTML = now ? `${coverHTML(now)}
        <div class="tape"><div class="tape-note"><b>reading now</b>${esc(now.title)}, ${esc(now.author)}. ${esc(now.note || '')}</div></div>` : '';
      layout();
    }

    // the current read stands face out at the same scale as the spines below; planks fill left to right with as many books as their spines allow; the tallest book stands
    // at 90% of the gap to the plank above and the rest keep their proportions to it; full planks
    // spread their books to use the whole width
    function layout() {
      planksEl.querySelectorAll('.plank-bottom').forEach(el => el.remove());
      const probe = makePlank(); planksEl.appendChild(probe);
      const row = probe.querySelector('.spines'), above = probe.previousElementSibling;
      const rowW = row.clientWidth, em = parseFloat(getComputedStyle(row).fontSize);
      const gap = above ? row.getBoundingClientRect().bottom - above.getBoundingClientRect().bottom : 0;
      probe.remove();
      const tallestPx = gap > 0 ? Math.min(30 * em, gap * .9) : 12 * em;
      const k = tallestPx / Math.max(DEFAULT_MM, ...books.map(mm), reading ? mm(reading) : 0);   // px per mm
      const cover = readingEl && readingEl.querySelector('.cover');
      if (cover) cover.style.width = (mm(reading) * reading.ratio.cover * k).toFixed(1) + 'px';
      const f = tallestPx / (12 * em);                                 // shelf scale for gaps and hover lifts
      const between = .22 * em * f;
      const width = b => mm(b) * b.ratio.spine * k;
      const planks = []; let cur = [], used = 0, overflow = false;
      books.forEach((b, i) => {
        const w = width(b);
        if (cur.length && used + between + w > rowW) {
          if (opts.limit === 'plank') { overflow = true; return; }
          planks.push(cur); cur = []; used = 0;
        }
        if (overflow) return;
        cur.push(i); used += (cur.length > 1 ? between : 0) + w;
      });
      if (cur.length) planks.push(cur);
      const shown = planks.reduce((n, p) => n + p.length, 0);
      if (seeAll) { seeAll.hidden = shown >= books.length; seeAll.querySelector('span').textContent = `all ${books.length} books →`; }
      if (!planks.length) planks.push([]);
      planks.forEach((chunk, p) => {
        const plank = makePlank(); planksEl.appendChild(plank);
        const el = plank.querySelector('.spines'); el.style.setProperty('--fit', f.toFixed(3) + 'em');
        const full = p < planks.length - 1 || overflow;
        if (full && chunk.length > 1) {
          const slack = rowW - chunk.reduce((n, i) => n + width(books[i]), 0);
          el.style.gap = (slack / (chunk.length - 1)).toFixed(2) + 'px';
        }
        el.innerHTML = chunk.map(i => bookHTML(books[i], i, k)).join('') || '<div class="shelf-empty">nothing on the shelf yet</div>';
      });
      root.querySelectorAll('.book').forEach(el => el.addEventListener('click', () => openBook(+el.dataset.i)));
      if (openIdx >= 0 && !root.querySelector(`.book[data-i="${openIdx}"]`)) closeBook();
    }
    let relayout;
    addEventListener('resize', () => { clearTimeout(relayout); relayout = setTimeout(layout, 120); });

    function openBook(i) {
      if (i === openIdx) return closeBook();
      openIdx = i;
      const b = books[i];
      root.querySelectorAll('.book').forEach(el => el.classList.toggle('out', +el.dataset.i === i));
      planksEl.after(panel);                              // always beneath the shelves, never between planks
      panel.hidden = false;
      panel.innerHTML = `${coverHTML(b)}
        <div class="card"><button class="close" aria-label="put it back">✕</button>
          <h3>${esc(b.title)}</h3>
          <div class="by"><span>${esc(b.author)}${b.finished ? ' · finished ' + monthName(b.finished) : ''}</span><span class="stars">${stars(b.rating)}</span></div>
          <p>${esc(b.note || 'no notes on this one.')}</p></div>`;
      panel.querySelector('.close').addEventListener('click', closeBook);
      if (matchMedia('(max-width: 900px)').matches) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    function closeBook() {
      openIdx = -1; panel.hidden = true;
      root.querySelectorAll('.book.out').forEach(el => el.classList.remove('out'));
    }

    render(data);
    return { open: openBook, close: closeBook, count: books.length };
  };
})();

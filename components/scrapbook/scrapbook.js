/* =====================================================================
   READING SCRAPBOOK — createScrapbook(rootElement, articles, options)

   articles: [{ title, author, source, url, date: "YYYY-MM-DD", minutes, blurb }]
     a YouTube url gets its thumbnail printed on the clipping and "min watch" in the byline
   options (all optional):
     perPage        clippings per page on wide screens      (default 5)
     perPageNarrow  clippings per page on phones            (default 3)
     narrowQuery    media query for "phone"                 (default "(max-width: 600px)")
     tabCount       number of tabs; the last one becomes
                    "N+" and holds every older page         (default 5)
     tabTints       colours for the inactive tabs
     newTab         open article links in a new tab         (default false)
     keyboard       ← → turn pages while the folder is on screen (default true)
   ===================================================================== */
(function () {
  'use strict';

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const parts = iso => { const [y, m, d] = iso.split('-').map(Number); return { y, m, d }; };
  const shortDate = iso => { const { m, d } = parts(iso); return `${d} ${MONTHS[m - 1]}`; };
  const youtubeId = url => (String(url ?? '').match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/) || [])[1];

  // "11–15 Sep 2026", "14 Aug – 3 Sep 2026", "30 Dec 2025 – 4 Jan 2026"
  function rangeLabel(newestIso, oldestIso) {
    const n = parts(newestIso), o = parts(oldestIso);
    if (newestIso === oldestIso) return `${n.d} ${MONTHS[n.m - 1]} ${n.y}`;
    if (n.y === o.y && n.m === o.m) return `${o.d}–${n.d} ${MONTHS[n.m - 1]} ${n.y}`;
    if (n.y === o.y) return `${o.d} ${MONTHS[o.m - 1]} – ${n.d} ${MONTHS[n.m - 1]} ${n.y}`;
    return `${o.d} ${MONTHS[o.m - 1]} ${o.y} – ${n.d} ${MONTHS[n.m - 1]} ${n.y}`;
  }

  // Small seeded random so each clipping keeps the same tilt, tape and torn edge on every visit
  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  // Torn-paper outline as a clip-path polygon
  function tornEdge(r) {
    const pts = [], j = () => (r() * 4).toFixed(1);
    for (let x = 0; x <= 100; x += 4) pts.push(`${x}% ${j()}px`);
    for (let y = 4; y <= 96; y += 6) pts.push(`calc(100% - ${j()}px) ${y}%`);
    for (let x = 100; x >= 0; x -= 4) pts.push(`${x}% calc(100% - ${j()}px)`);
    for (let y = 96; y >= 4; y -= 6) pts.push(`${j()}px ${y}%`);
    return `polygon(${pts.join(',')})`;
  }

  function createScrapbook(root, articles, options = {}) {
    const o = Object.assign({
      perPage: 5, perPageNarrow: 3, narrowQuery: '(max-width: 600px)', tabCount: 5,
      tabTints: ['#e7c9a0', '#c9d7b8', '#e3b9ad', '#bcd0dc'], newTab: false, keyboard: true
    }, options);

    const items = [...articles].sort((a, b) => b.date.localeCompare(a.date)); // newest first
    const narrow = matchMedia(o.narrowQuery);
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let pages = [], current = 0, anchor = 0, busy = false;

    root.classList.add('sb');
    root.innerHTML = `
      <div class="sb-tabs" role="tablist" aria-label="Reading list pages"></div>
      <div class="sb-book"><div class="sb-page" role="tabpanel"></div></div>
      <span class="sb-status" aria-live="polite" hidden></span>`;
    const tabsEl = root.querySelector('.sb-tabs');
    const book = root.querySelector('.sb-book');
    const page = root.querySelector('.sb-page');
    const status = root.querySelector('.sb-status');   // screen-reader announcement only

    const perPage = () => (narrow.matches ? o.perPageNarrow : o.perPage);
    const tabFor = i => Math.min(i, o.tabCount - 1);

    function paginate() {
      const n = perPage();
      pages = [];
      for (let i = 0; i < items.length; i += n) pages.push(items.slice(i, i + n));
    }

    function renderTabs() {
      const n = pages.length, overflow = n > o.tabCount;
      tabsEl.innerHTML = pages.slice(0, o.tabCount).map((pg, i) => {
        const isMore = overflow && i === o.tabCount - 1;
        const range = isMore ? rangeLabel(pg[0].date, items[items.length - 1].date) : rangeLabel(pg[0].date, pg[pg.length - 1].date);
        const label = isMore ? `Pages ${i + 1} to ${n}` : `Page ${i + 1}`;
        return `<button type="button" role="tab" class="sb-tab${isMore ? ' sb-tab--more' : ''}" data-sb-tab="${i}"
          style="--sb-tab-tint:${o.tabTints[i % o.tabTints.length]}" title="${range}" aria-label="${label}, ${range}">${isMore ? `${i + 1}+` : i + 1}</button>`;
      }).join('');
    }

    function clipHTML(a, isFeature) {
      const r = rng(hash(`${a.title}|${a.date}`));
      const tilt = (r() * 3 - 1.5).toFixed(2), tapeTilt = (r() * 10 - 5).toFixed(1), aged = r() > 0.55;
      const video = youtubeId(a.url);
    const byline = [a.author && `By ${esc(a.author)}`, a.minutes && `${esc(a.minutes)} min ${video ? 'watch' : 'read'}`].filter(Boolean).join(' · ');
    const photo = video ? `<figure class="sb-photo">
            <img src="https://i.ytimg.com/vi/${video}/sddefault.jpg" alt="" width="640" height="480" loading="lazy" decoding="async">
            <span class="sb-play" aria-hidden="true"></span>
          </figure>` : '';
      const target = o.newTab ? ' target="_blank" rel="noopener"' : '';
      return `<a class="sb-clip${isFeature ? ' sb-clip--feature' : ''}" href="${esc(a.url || '#')}"${target} style="--sb-r:${tilt}deg">
        <span class="sb-tape" style="--sb-tr:${tapeTilt}deg" aria-hidden="true"></span>
        <div class="sb-paper${aged ? ' sb-paper--aged' : ''}" style="clip-path:${tornEdge(r)}">
          <div class="sb-kicker"><span>${esc(a.source)}</span><span>${shortDate(a.date)}</span></div>
          <h3 class="sb-title">${esc(a.title)}</h3>
          ${byline ? `<div class="sb-by">${byline}</div>` : ''}
          ${photo}
          ${a.blurb ? `<p class="sb-blurb">${esc(a.blurb)}</p>` : ''}
        </div>
      </a>`;
    }

    function pageHTML(i) {
      const pg = pages[i], n = pages.length;
      return `<div class="sb-head">
          <span class="sb-label">${rangeLabel(pg[0].date, pg[pg.length - 1].date)}</span>
          <span class="sb-count">Page ${i + 1} of ${n}</span>
        </div>
        <div class="sb-clips">${pg.map((a, j) => clipHTML(a, j === 0)).join('')}</div>
        ${i > 0 ? `<button type="button" class="sb-turn sb-turn--prev" data-sb-step="-1">← <span class="sb-long">previous page</span><span class="sb-short">back</span></button>` : ''}
        ${i < n - 1 ? `<button type="button" class="sb-turn sb-turn--next" data-sb-step="1"><span class="sb-long">continued overleaf</span><span class="sb-short">overleaf</span> →</button>
                       <button type="button" class="sb-curl" data-sb-step="1" aria-label="Next page"></button>` : ''}`;
    }

    function syncControls() {
      const n = pages.length;
      tabsEl.querySelectorAll('.sb-tab').forEach((t, i) => t.setAttribute('aria-selected', String(i === tabFor(current))));
      page.classList.toggle('sb-page--more', current < n - 1);
      status.textContent = `Page ${current + 1} of ${n}`;
    }

    function goTo(i) {
      if (busy || i < 0 || i >= pages.length || i === current) return;
      const dir = i > current ? 1 : -1;
      const oldHTML = page.innerHTML, oldHeight = page.offsetHeight;
      current = i;
      anchor = i * perPage(); // remember the first article shown, so resizing keeps your place

      // Don't let the folder shrink while browsing, so the controls below stay put
      page.style.minHeight = Math.max(oldHeight, parseFloat(page.style.minHeight) || 0) + 'px';
      const top = root.getBoundingClientRect().top;
      if (top < 0) window.scrollBy({ top: top - 24, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      syncControls();

      if (reducedMotion.matches) { page.innerHTML = pageHTML(i); return; }

      // Page turn: a copy of a sheet swings around the left edge
      busy = true;
      const leaf = document.createElement('div');
      leaf.className = 'sb-page sb-page--leaf';
      leaf.setAttribute('aria-hidden', 'true');
      leaf.inert = true;
      if (dir > 0) {               // forward: current sheet lifts away, revealing the next one
        leaf.innerHTML = oldHTML;
        leaf.style.minHeight = oldHeight + 'px';
        page.innerHTML = pageHTML(i);
      } else {                     // back: previous sheet swings back over the top
        leaf.innerHTML = pageHTML(i);
        leaf.style.transform = 'rotateY(-180deg)';
      }
      book.appendChild(leaf);
      leaf.getBoundingClientRect(); // commit the start position before animating
      requestAnimationFrame(() => { leaf.style.transform = dir > 0 ? 'rotateY(-180deg)' : 'rotateY(0deg)'; });

      let done = false;
      const finish = () => {
        if (done) return; done = true;
        if (dir < 0) page.innerHTML = pageHTML(i);
        leaf.remove();
        busy = false;
      };
      leaf.addEventListener('transitionend', e => { if (e.target === leaf && e.propertyName === 'transform') finish(); });
      setTimeout(finish, 1200); // safety net if transitionend never fires
    }
    const step = d => goTo(current + d);

    // Tabs: the last "N+" tab jumps to page N, but does nothing if you're already inside it
    tabsEl.addEventListener('click', e => {
      const t = e.target.closest('[data-sb-tab]'); if (!t) return;
      const i = Number(t.dataset.sbTab);
      if (i === o.tabCount - 1 && tabFor(current) === i) return;
      goTo(i);
    });
    // "continued overleaf", "previous page", the curled corner
    root.addEventListener('click', e => {
      const s = e.target.closest('[data-sb-step]');
      if (s) step(Number(s.dataset.sbStep));
    });
    // Swipe left/right on touch screens
    let touch = null;
    book.addEventListener('touchstart', e => { touch = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
    book.addEventListener('touchend', e => {
      if (!touch) return;
      const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
      touch = null;
    });
    // Arrow keys, only while the folder is mostly on screen
    let onScreen = false;
    const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }, { threshold: 0.35 });
    observer.observe(book);
    const onKey = e => {
      if (!o.keyboard || !onScreen || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight') { step(1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { step(-1); e.preventDefault(); }
    };
    document.addEventListener('keydown', onKey);
    // Re-paginate when crossing the phone breakpoint, staying on the same articles
    const onBreakpoint = () => {
      if (!items.length) return;
      paginate(); renderTabs();
      current = Math.min(Math.floor(anchor / perPage()), pages.length - 1);
      page.style.minHeight = '';
      page.innerHTML = pageHTML(current);
      syncControls();
    };
    narrow.addEventListener('change', onBreakpoint);

    // First render
    if (!items.length) {
      page.innerHTML = `<div class="sb-empty">Nothing clipped yet</div>`;
    } else {
      paginate(); renderTabs();
      page.innerHTML = pageHTML(0);
      syncControls();
    }

    return {
      goTo, next: () => step(1), prev: () => step(-1),
      destroy() { document.removeEventListener('keydown', onKey); narrow.removeEventListener('change', onBreakpoint); observer.disconnect(); root.innerHTML = ''; root.classList.remove('sb'); }
    };
  }

  window.createScrapbook = createScrapbook;
})();

/* the games: data/games.json → what I'm playing now in a handheld, standing on one plank with the cartridges
   played most recently (createGames), or every game a plank at a time on games.html ({ all: true }).
   games: [{ title, by, url, store, image, wide, tagline, tags, platforms, browser, status, played: "YYYY-MM",
   hours, stars, note }], newest first. status is playing, finished or dropped; the handheld holds the newest
   game still being played, or the newest game when nothing is. Each cartridge's plastic takes the main colour of its cover. */
(() => {
  'use strict';
  const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const monthName = ym => { if (!ym) return ''; const [y, m] = ym.split('-'); return `${MONTHS[+m - 1]} ${y}`; };
  const hoursLabel = h => h == null || h === '' ? '' : h < 1 ? `${Math.round(h * 60)} min` : `${+(+h).toFixed(1)} h`;
  const STORE = { 'itch.io': 'itch.io', steam: 'Steam' };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const CART_W = 6.6, GAP = .7, HH_W = 9.4;   /* in the row's ems, matching games.css */

  function labelHTML(g) {
    return g.image ? `<span class="gm-label${g.wide ? ' wide' : ''}" style="background-image:url('${esc(g.image)}')"></span>`
      : `<span class="gm-label blank"><span>${esc(g.title)}</span></span>`;
  }
  function cartHTML(g, i, extra = '') {
    return `<button class="gm-cart ${esc(g.status)}${extra}" data-i="${i}"${g.image ? ` data-src="${esc(g.image)}"` : ''} title="${esc(g.title)}" aria-label="${esc(g.title)}, ${esc(g.status)}">
      <span class="gm-body"></span><span class="gm-grip"></span>${labelHTML(g)}
      <span class="gm-ttl">${esc(g.title)}</span><span class="gm-arrow"></span></button>`;
  }
  function screenHTML(g) {
    if (!g) return '<span class="gm-nocart">no cartridge</span>';
    return g.image ? `<img class="${g.wide ? 'wide' : ''}" src="${esc(g.image)}" alt="${esc(g.title)}">` : `<span class="gm-nocart">${esc(g.title)}</span>`;
  }
  function cardHTML(g, withImage) {
    const go = g.browser ? 'play it in your browser →' : `on ${STORE[g.store] || 'its page'} →`;
    const facts = [`<b>${esc(g.status)}</b>`, monthName(g.played), hoursLabel(g.hours), g.stars ? '★'.repeat(g.stars) + '☆'.repeat(5 - g.stars) : ''].filter(Boolean).join(' · ');
    return `${withImage && g.image ? `<div class="gm-shot${g.wide ? ' wide' : ''}"><img src="${esc(g.image)}" alt=""></div>` : ''}
      <div class="gm-words"><h3>${esc(g.title)}</h3>
        <p class="gm-by">${g.by ? `by ${esc(g.by)}` : ''}${g.by && g.tagline ? ' · ' : ''}${g.tagline ? `<i>${esc(g.tagline)}</i>` : ''}</p>
        ${g.note ? `<p class="gm-note">${esc(g.note)}</p>` : ''}
        <p class="gm-facts">${facts}</p>
        ${g.tags && g.tags.length ? `<p class="gm-tags">${g.tags.map(t => `<span>${esc(t)}</span>`).join('')}</p>` : ''}
        ${g.url ? `<a class="gm-go" href="${esc(g.url)}" target="_blank" rel="noopener">${go}</a>` : ''}</div>`;
  }
  /* the cover's most common colourful hue, made into plastic: never too dark, too pale or too loud */
  const tints = new Map();
  function tintOf(src) {
    if (!tints.has(src)) tints.set(src, new Promise(res => {
      const img = new Image();
      img.onload = () => {
        try {
          const n = 32, cv = document.createElement('canvas');
          cv.width = cv.height = n;
          const ctx = cv.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0, n, n);
          const px = ctx.getImageData(0, 0, n, n).data, bins = Array.from({ length: 12 }, () => [0, 0, 0, 0]), all = [0, 0, 0];
          for (let k = 0; k < px.length; k += 4) {
            const [r, g, b] = [px[k], px[k + 1], px[k + 2]], [h, sat, l] = hsl(r, g, b);
            all[0] += r; all[1] += g; all[2] += b;
            if (sat < .25 || l < .12 || l > .9) continue;
            const w = sat * (1 - Math.abs(l - .5)), bin = bins[Math.floor(h * 12) % 12];
            bin[0] += r * w; bin[1] += g * w; bin[2] += b * w; bin[3] += w;
          }
          const best = bins.reduce((a, b) => (b[3] > a[3] ? b : a));
          const [r, g, b] = best[3] > n * n * .02 ? best.slice(0, 3).map(v => v / best[3]) : all.map(v => v / (n * n));
          let [h, sat, l] = hsl(r, g, b);
          sat = Math.min(sat, .62); l = Math.min(Math.max(l, .42), .68);
          res({ shell: `hsl(${h * 360} ${sat * 100}% ${l * 100}%)`, dark: `hsl(${h * 360} ${sat * 100}% ${(l - .13) * 100}%)`, light: l < .58 });
        } catch { res(null); }
      };
      img.onerror = () => res(null);
      img.src = src;
    }));
    return tints.get(src);
  }
  function hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
    if (!d) return [0, 0, l];
    const s = d / (1 - Math.abs(2 * l - 1));
    const h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h / 6, s, l];
  }
  function tint(root) {
    root.querySelectorAll('.gm-cart[data-src]:not([style*="--shell"])').forEach(c => tintOf(c.dataset.src).then(t => {
      if (!t) return;
      c.style.setProperty('--shell', t.shell);
      c.style.setProperty('--shell-d', t.dark);
      c.classList.toggle('on-dark', t.light);
    }));
  }

  const handheldHTML = `<div class="gm-hh on"><div class="gm-slot"></div><div class="gm-hh-body">
      <div class="gm-bezel"><div class="gm-led"><i></i>power</div><div class="gm-screen"></div></div>
      <div class="gm-brand"><b>jack</b> boy colour</div>
      <div class="gm-ctrls"><span class="gm-dpad"></span><span class="gm-ab"><button class="b" aria-label="previous game">B</button><button class="a" aria-label="next game">A</button></span></div>
      <span class="gm-grill"><i></i><i></i><i></i><i></i></span></div></div>`;
  const plankHTML = inner => `<div class="gm-plank"><img class="wood" src="/assets/shelf/plank.png" alt=""><div class="gm-row">${inner}</div></div>`;

  window.createGames = function (root, games, opts = {}) {
    games = (games || []).filter(g => g && g.title);
    root.classList.add('gm');
    return opts.all ? backlog(root, games) : frontPlank(root, games, opts);
  };

  function frontPlank(root, games, opts) {
    const href = opts.href || '/games.html';
    let cur = games.findIndex(g => g.status === 'playing');
    if (cur < 0) cur = games.length ? 0 : -1;
    let shown = [], fits = 0, busy = false;
    root.innerHTML = `<div class="gm-stage">${plankHTML(handheldHTML + '<div class="gm-carts" role="list"></div>')}
        <a class="gm-all" href="${href}" ${games.length ? '' : 'hidden'}><b>the backlog</b><span>every game →</span></a></div>
      <div class="gm-card" aria-live="polite"></div>`;
    const row = root.querySelector('.gm-row'), carts = root.querySelector('.gm-carts'), slot = root.querySelector('.gm-slot');
    const screen = root.querySelector('.gm-screen'), card = root.querySelector('.gm-card'), hh = root.querySelector('.gm-hh');

    function seat(boot) {
      const g = games[cur];
      slot.innerHTML = g ? cartHTML(g, cur, ' in') : '';
      tint(slot);
      screen.innerHTML = screenHTML(g) + (boot && !reduced.matches ? '<span class="gm-boot"><b>jack®</b></span>' : '');
      if (boot) setTimeout(() => screen.querySelector('.gm-boot')?.remove(), 1300);
      card.innerHTML = g ? cardHTML(g, false) : '';
      card.hidden = !g;
    }
    function lay() {
      const em = parseFloat(getComputedStyle(row).fontSize);
      const n = Math.max(0, Math.floor((row.clientWidth / em - HH_W - GAP + GAP) / (CART_W + GAP)));
      if (n === fits && shown.length) return;
      fits = n;
      const rest = games.map((_, i) => i).filter(i => i !== cur);
      const keep = shown.filter(i => i !== cur).slice(0, n);
      shown = keep.concat(rest.filter(i => !keep.includes(i))).slice(0, n);
      carts.innerHTML = shown.map(i => cartHTML(games[i], i)).join('');
      tint(carts);
    }
    async function play(pos, how) {
      if (busy || pos < 0 || pos >= shown.length) return;
      busy = true;
      const j = shown[pos], from = carts.children[pos], out = slot.firstElementChild;
      if (!reduced.matches) {
        const a = from.getBoundingClientRect(), b = slot.getBoundingClientRect();
        const fly = from.cloneNode(true); fly.classList.add('flying');
        Object.assign(fly.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
        document.body.append(fly);
        from.style.visibility = 'hidden';
        if (out) await out.animate([{ transform: 'none' }, { transform: 'translateY(-60%)', opacity: 0 }], { duration: 220, easing: 'ease-in', fill: 'forwards' }).finished;
        screen.innerHTML = ''; hh.classList.remove('on');
        const dx = b.left + (b.width - a.width) / 2 - a.left, dy = b.top - a.top;
        await fly.animate([{ transform: 'none' }, { transform: `translate(${dx}px, ${dy - a.height * .7}px) rotate(-4deg)`, offset: .7 }, { transform: `translate(${dx}px, ${dy}px)` }],
          { duration: 600, easing: 'cubic-bezier(.4,.1,.3,1)', fill: 'forwards' }).finished;
        fly.remove();
      }
      const was = cur;
      if (how === 'next') shown = [...shown.slice(1), was];
      else if (how === 'prev') shown = [was, ...shown.slice(0, -1)];
      else shown[pos] = was;
      cur = j;
      carts.innerHTML = shown.map(i => cartHTML(games[i], i)).join('');
      tint(carts);
      const back = carts.querySelector(`[data-i="${was}"]`);
      if (back && !reduced.matches) back.animate([{ transform: 'translateY(-1.2em)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: 'ease-out' });
      hh.classList.add('on');
      seat(true);
      busy = false;
    }

    carts.addEventListener('click', e => { const c = e.target.closest('.gm-cart'); if (c) play([...carts.children].indexOf(c)); });
    root.querySelector('.gm-ab .a').addEventListener('click', () => play(0, 'next'));
    root.querySelector('.gm-ab .b').addEventListener('click', () => play(shown.length - 1, 'prev'));
    seat(false);
    lay();
    const ro = new ResizeObserver(() => lay());
    ro.observe(row);
    return { count: games.length, destroy() { ro.disconnect(); root.innerHTML = ''; } };
  }

  function backlog(root, games) {
    const counts = { all: games.length };
    games.forEach(g => (counts[g.status] = (counts[g.status] || 0) + 1));
    let filter = 'all', open = -1, fits = 0;
    root.innerHTML = `<div class="gm-filters" role="group" aria-label="show">${['all', 'playing', 'finished', 'dropped'].map(f =>
        `<button class="${f}" data-f="${f}" aria-pressed="${f === filter}">${f === 'all' ? 'everything' : f}<span>${counts[f] || 0}</span></button>`).join('')}</div>
      <div class="gm-years"></div>`;
    const years = root.querySelector('.gm-years');

    function render() {
      const em = parseFloat(getComputedStyle(years).fontSize);
      fits = Math.max(1, Math.floor((years.clientWidth * .94 / em + GAP) / (CART_W + GAP)));
      const list = games.map((g, i) => [g, i]).filter(([g]) => filter === 'all' || g.status === filter);
      const byYear = new Map();
      list.forEach(([g, i]) => { const y = (g.played || '').slice(0, 4) || 'undated'; byYear.set(y, [...(byYear.get(y) || []), i]); });
      years.innerHTML = [...byYear].map(([y, idx]) => {
        const hours = Math.round(idx.reduce((a, i) => a + (+games[i].hours || 0), 0));
        const planks = [];
        for (let k = 0; k < idx.length; k += fits) planks.push(idx.slice(k, k + fits));
        return `<div class="gm-year"><span class="gm-yr">${y} · ${idx.length} game${idx.length === 1 ? '' : 's'}${hours ? ` · ${hours} hours` : ''}</span>
          ${planks.map(p => plankHTML(`<div class="gm-carts" role="list">${p.map(i => cartHTML(games[i], i, i === open ? ' lifted' : '')).join('')}</div>`) +
            (p.includes(open) ? `<div class="gm-card">${cardHTML(games[open], true)}</div>` : '')).join('')}</div>`;
      }).join('') || '<p class="gm-empty">nothing here yet</p>';
      tint(years);
    }
    root.addEventListener('click', e => {
      const f = e.target.closest('[data-f]');
      if (f) { filter = f.dataset.f; root.querySelectorAll('[data-f]').forEach(b => b.setAttribute('aria-pressed', b === f)); open = -1; return render(); }
      const c = e.target.closest('.gm-cart');
      if (!c) return;
      open = +c.dataset.i === open ? -1 : +c.dataset.i;
      render();
      root.querySelector('.gm-card')?.scrollIntoView({ block: 'nearest', behavior: reduced.matches ? 'auto' : 'smooth' });
    });
    render();
    let last = years.clientWidth;
    const ro = new ResizeObserver(() => { if (years.clientWidth !== last) { last = years.clientWidth; render(); } });
    ro.observe(years);
    return { count: games.length, destroy() { ro.disconnect(); root.innerHTML = ''; } };
  }
})();

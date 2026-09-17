/* the bookshelf: books.json → the current read face-out on the top plank, finished books as
   spines on the planks below. Shared by index.html (most recent only) and books.html (all). */
(() => {
  'use strict';
  const hash = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); };
  const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const lum = c => { const m = c.match(/^#([0-9a-f]{6})$/i); if (!m) return .5; const n = parseInt(m[1], 16); return (.2126 * (n >> 16 & 255) + .7152 * (n >> 8 & 255) + .0722 * (n & 255)) / 255; };
  const fmt = n => `${Math.floor(n / 60)}:${String(Math.round(n % 60)).padStart(2, '0')}`;
  const FALLBACK = ['#8c7c5c', '#efe8d6', '#332c1e'];
  const toHex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v | 0)).toString(16).padStart(2, '0')).join('');
  const sat = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx === 0 ? 0 : (mx - mn) / mx; };
  const diff = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
  const palCache = {};
  function loadImage(src) { return new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = rej; i.src = src; }); }
  async function computePalette(url) {
    if (!url) return FALLBACK.slice();
    if (palCache[url]) return palCache[url];
    try { const c = localStorage.getItem('pal3:' + url); if (c) return (palCache[url] = JSON.parse(c)); } catch (e) {}
    try {
      const img = await loadImage(url);
      const n = 32, cv = document.createElement('canvas'); cv.width = n; cv.height = n;
      const ctx = cv.getContext('2d'); ctx.drawImage(img, 0, 0, n, n);
      const d = ctx.getImageData(0, 0, n, n).data, buckets = new Map();
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2]; if (d[i + 3] < 125) continue;
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b); if (mx < 40 || (mn > 228 && mx - mn < 18)) continue;
        const key = (r >> 4) << 8 | (g >> 4) << 4 | (b >> 4);
        let e = buckets.get(key); if (!e) { e = { r: 0, g: 0, b: 0, c: 0 }; buckets.set(key, e); }
        e.r += r; e.g += g; e.b += b; e.c++;
      }
      const reps = [...buckets.values()].map(e => { const r = e.r / e.c, g = e.g / e.c, b = e.b / e.c; return { rgb: [r, g, b], score: e.c * (.25 + sat(r, g, b)) }; }).sort((x, y) => y.score - x.score);
      const chosen = []; for (const rp of reps) { if (chosen.every(c => diff(c, rp.rgb) > 46)) chosen.push(rp.rgb); if (chosen.length === 3) break; }
      const pal = chosen.map(c => toHex(...c)); while (pal.length < 3) pal.push(FALLBACK[pal.length]);
      palCache[url] = pal; try { localStorage.setItem('pal3:' + url, JSON.stringify(pal)); } catch (e) {}
      return pal;
    } catch (e) { return FALLBACK.slice(); }
  }

  window.renderBookshelf = function (root, data, opts = {}) {
    // covers are served from covers/<isbn>.jpg (see fetch-covers.py); Open Library is the fallback
    const apiCover = (b, size) => b.isbn ? `https://covers.openlibrary.org/b/isbn/${b.isbn}-${size}.jpg?default=false` : '';
    const coverUrl = (b, size = 'L') => b.cover || (b.isbn ? `covers/${b.isbn}.jpg` : '');
    const BOOK_INK = ['#f4efe4', '#181410'];
    function bookPalette(b) {
      const h = hash(b.title + b.author);
      const hue = h % 360, sat2 = 28 + (h >> 3) % 30, lit = 26 + (h >> 7) % 30;
      return [`hsl(${hue} ${sat2}% ${lit}%)`, `hsl(${(hue + 40) % 360} ${sat2 + 20}% ${Math.min(80, lit + 35)}%)`, lit < 45 ? BOOK_INK[0] : BOOK_INK[1]];
    }
    function genCover(b, pal) {
      return `<div class="gen" style="--c1:${pal[0]};--c2:${pal[1]};--ink:${pal[2]}"><span>${esc(b.author)}</span><div><i></i><b>${esc(b.title)}</b></div></div>`;
    }
    function coverHTML(b, pal, size = 'L') {
      const u = coverUrl(b, size);
      if (!u) return genCover(b, pal);
      const alts = b.cover ? '' : `data-alt="${apiCover(b, size)}|${apiCover(b, 'M')}"`;
      return `${genCover(b, pal)}<img src="${u}" alt="" loading="lazy" ${alts} onerror="const a=(this.dataset.alt||'').split('|').filter(Boolean);if(a.length){this.src=a.shift();this.dataset.alt=a.join('|')}else{this.remove()}">`;
    }
    const stars = n => n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '';
    const monthName = ym => { if (!ym) return ''; const [y, m] = ym.split('-'); return ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'][+m - 1] + ' ' + y; };
    let shelf = { reading: [], read: [] }, openIdx = -1;

    function renderShelf(data) {
      shelf = data;
      const now = data.reading && data.reading[0];
      const readingEl = document.getElementById('reading');
      if (readingEl && now) {
        const pal = bookPalette(now);
        readingEl.innerHTML = `<div class="cover">${coverHTML(now, pal, 'M')}</div>
          <div class="tape"><div class="tape-note"><b>reading now</b>${esc(now.title)}, ${esc(now.author)}. ${esc(now.note || '')}</div></div>`;
      } else if (readingEl) readingEl.innerHTML = '';
      const all = data.read || [];
      const list = opts.limit ? all.slice(0, opts.limit) : all;
      const seeAll = document.getElementById('see-all');
      if (seeAll) { seeAll.hidden = !(opts.limit && all.length > opts.limit); seeAll.querySelector('span').textContent = `all ${all.length} books →`; }
      const per = opts.perPlank || list.length || 1;
      const planksEl = root.querySelector('.planks');
      planksEl.querySelectorAll('.plank-bottom').forEach(el => el.remove());
      const chunks = []; for (let i = 0; i < list.length; i += per) chunks.push(list.slice(i, i + per));
      if (!chunks.length) chunks.push([]);
      chunks.forEach((chunk, c) => {
        const plank = document.createElement('div'); plank.className = 'plank plank-bottom';
        plank.innerHTML = `<img class="wood" src="pins/plank.png" alt=""><div class="spines" role="list" data-plank="${c}"></div>`;
        planksEl.appendChild(plank);
        plank.querySelector('.spines').innerHTML = chunk.map((b, k) => { const i = c * per + k;
        const h = hash(b.author + b.title), pal = bookPalette(b);
        const height = 11 + (h % 7) * .45, width = 1.7 + ((h >> 4) % 6) * .18;
        const face = ['', 'serif', 'caps'][(h >> 9) % 3], bands = (h >> 11) % 3 === 0 ? 1 : 0;
        const art = coverUrl(b, 'M');
        const side = b.spine || (b.isbn ? `spines/${b.isbn}.jpg` : '');
        return `<button class="book ${face}" role="listitem" data-i="${i}" style="--h:${height}em;--w:${width}em;--c1:${pal[0]};--c2:${pal[1]};--ink:${pal[2]};--bands:${bands};${art ? `--art:url('${art}')` : ''}" title="${esc(b.title)}">
          ${side ? `<img class="side" src="${side}" alt="" onload="this.parentElement.classList.add('has-side');this.parentElement.style.setProperty('--w','max(calc(var(--h) * ' + (this.naturalWidth / this.naturalHeight).toFixed(4) + '), 1.6em)');window.dispatchEvent(new Event('resize'))" onerror="this.remove()">` : ''}
          <span class="t">${esc(b.title)}</span><span class="a">${esc(b.author)}</span></button>`;
        }).join('') || '<div class="shelf-empty">nothing on the shelf yet</div>';
      });
      fitSpines();
      root.querySelectorAll('.book').forEach(el => {
        el.addEventListener('click', () => openBook(+el.dataset.i));
        const b = list[+el.dataset.i], art = coverUrl(b, 'M');
        if (art) computePalette(art).then(pal => {
          if (el.classList.contains('has-side') || pal === FALLBACK || pal.join() === FALLBACK.join()) return;
          el.style.setProperty('--c1', pal[0]); el.style.setProperty('--c2', pal[1]);
          el.style.setProperty('--ink', lum(pal[0]) < .5 ? '#f4efe4' : '#181410');
        });
      });
    }
    function fitSpines() {
      root.querySelectorAll('.spines').forEach(el => {
        el.style.setProperty('--fit', '1em');
        let f = 1;
        const total = () => [...el.children].reduce((w, c) => w + c.offsetWidth, 0) + parseFloat(getComputedStyle(el).columnGap || 0) * Math.max(0, el.children.length - 1);
        while (f > .45 && total() > el.clientWidth + 1) { f -= .03; el.style.setProperty('--fit', f.toFixed(2) + 'em'); }
      });
    }
    addEventListener('resize', fitSpines);
    function openBook(i) {
      const panel = document.getElementById('opened');
      if (i === openIdx) return closeBook();
      openIdx = i;
      const b = shelf.read[i], pal = bookPalette(b);
      root.querySelectorAll('.book').forEach(el => el.classList.toggle('out', +el.dataset.i === i));
      const spine = root.querySelector(`.book[data-i="${i}"]`), plank = spine.closest('.plank');
      panel.style.setProperty('--ph', `calc(${spine.style.getPropertyValue('--h') || '12em'} * 1.45)`);
      plank.after(panel);
      panel.hidden = false;
      panel.innerHTML = `<div class="cover">${coverHTML(b, pal)}</div>
        <div class="card"><button class="close" aria-label="put it back">✕</button>
          <h3>${esc(b.title)}</h3>
          <div class="by"><span>${esc(b.author)}${b.finished ? ' · finished ' + monthName(b.finished) : ''}</span><span class="stars">${stars(b.rating)}</span></div>
          <p>${esc(b.note || 'no notes on this one.')}</p></div>`;
      panel.querySelector('.close').addEventListener('click', closeBook);
      if (matchMedia('(max-width: 900px)').matches) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    function closeBook() {
      openIdx = -1;
      document.getElementById('opened').hidden = true;
      root.querySelectorAll('.book.out').forEach(el => el.classList.remove('out'));
    }

    renderShelf(data);
    return { open: openBook, close: closeBook };
  };
})();

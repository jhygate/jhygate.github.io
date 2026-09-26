/* random thoughts: data/thoughts.json → a pocket notebook you leaf through (createNotebook), and
   every piece by title on thoughts.html (createThoughtsIndex).
   thoughts: [{ slug, title, date: "YYYY-MM-DD", body }], newest first; body is plain text, a blank
   line between paragraphs. A paragraph starting "—" is a fragment and gets a line to itself;
   ![caption](src) on its own is a photo taped in, !sketch[caption](src) a drawing on the page.
   Opening the cover shows the real inside cover and flyleaf, with the contents written under the
   "in case of loss" block. Every piece starts on a fresh page and runs onto as many as it needs,
   paginated at the size it's drawn. Two pages open on wide screens, one on phones.
   With { only: true } it's just those pieces' pages, already open: how thoughts.html shows one piece. */
(() => {
  'use strict';
  const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const dateLabel = iso => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
  const IMG = /^!(sketch)?\[(.*?)\]\((\S+?)\)$/;
  const paras = body => String(body || '').split(/\n\s*\n/).map(s => s.trim()).filter(Boolean).map(text => {
    const m = text.match(IMG);
    if (m) return { img: m[3], caption: m[2], sketch: !!m[1] };
    return { text, cls: /^placeholder/i.test(text) ? 'note' : /^[—–-]\s/.test(text) ? 'frag' : '' };
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const LH = 1.55;                       // one ruled line, in page ems; matches --lh in notebook.css

  window.createNotebook = function (root, thoughts, opts = {}) {
    const href = opts.href || '/thoughts.html', only = !!opts.only, first = only ? 1 : 0;
    root.classList.add('nb');
    root.innerHTML = `<div class="nb-stage"><div class="nb-book${only ? '' : ' closed'}">
        <div class="nb-board"></div><div class="nb-slot l"></div><div class="nb-slot r"></div>
        <div class="nb-leaf"><div class="nb-face front"></div><div class="nb-face back"></div></div>
        <div class="nb-ribbon"></div><div class="nb-hit prev" aria-hidden="true"></div><div class="nb-hit next" aria-hidden="true"></div>
      </div></div>
      <div class="nb-bar"><div class="nb-flip"><button class="nb-prev" aria-label="previous page">‹</button><span class="nb-label" aria-live="polite"></span><button class="nb-next" aria-label="next page">›</button></div>
        ${only ? '' : `<a class="nb-all" href="${href}">everything, by title →</a>`}</div>`;
    const $ = s => root.querySelector(s);
    const stage = $('.nb-stage'), book = $('.nb-book'), slotL = $('.nb-slot.l'), slotR = $('.nb-slot.r'), leaf = $('.nb-leaf'),
      front = $('.nb-face.front'), back = $('.nb-face.back'), label = $('.nb-label'), prevBtn = $('.nb-prev'), nextBtn = $('.nb-next');

    let pages = [], single = false, fs = 0, view = first, busy = false;
    const aspects = new Map();

    // ---------- pagination: fill a hidden page until the rules run out ----------
    function paginate() {
      const probe = document.createElement('div'); probe.className = root.className; probe.style.cssText = `position:absolute;left:-9999px;top:0;visibility:hidden;font-size:${fs}px`;
      probe.innerHTML = '<div class="nb-slot"><div class="nb-page"><div class="nb-text"></div></div></div>';
      document.body.appendChild(probe);
      const box = probe.querySelector('.nb-text'), fits = () => box.scrollHeight <= box.clientHeight + 1, lh = LH * fs;
      const out = only ? [] : [{ kind: 'inside' }, { kind: 'flyleaf' }];
      for (const t of thoughts) {
        box.innerHTML = `<div class="nb-head"><h3><a href="${href}#${esc(t.slug)}">${esc(t.title)}</a></h3><time datetime="${esc(t.date)}">${dateLabel(t.date)}</time></div>`;
        let lead = true, start = true;
        const flush = () => { out.push({ kind: 'text', html: box.innerHTML, slug: t.slug, title: t.title, start }); start = false; box.innerHTML = ''; };
        for (const p of paras(t.body)) {
          if (p.img) {
            // a picture takes whole lines: as many as its shape wants, up to a third of the page, plus one for the caption
            const ar = aspects.get(p.img) || 4 / 3, cw = box.clientWidth;
            const k = Math.max(3, Math.min(p.sketch ? 6 : 7, Math.floor(cw * .9 / ar / lh))), h = k * lh, w = Math.min(cw * .9, h * ar);
            const fig = gap => `<figure class="nb-fig${p.sketch ? ' sketch' : ''}" style="margin-top:${gap ? lh : 0}px;height:${(k + 1) * lh}px"><img src="${esc(p.img)}" alt="${esc(p.caption)}" style="width:${w.toFixed(1)}px;height:${h.toFixed(1)}px"><figcaption style="line-height:${lh}px">${esc(p.caption)}</figcaption></figure>`;
            box.insertAdjacentHTML('beforeend', fig(box.childElementCount > 0));
            if (!fits()) { box.lastElementChild.remove(); flush(); box.insertAdjacentHTML('beforeend', fig(false)); }
            lead = true; continue;
          }
          const cls = [p.cls, lead && !p.cls ? 'first' : ''].filter(Boolean).join(' ');
          const para = document.createElement('p'); para.className = cls; para.textContent = p.text; box.appendChild(para); lead = false;
          if (fits()) continue;
          if (p.cls === 'frag' && box.childElementCount > 1) { para.remove(); flush(); para.classList.add('cont'); box.appendChild(para); if (fits()) continue; }
          // split the paragraph at the last word that still fits, and carry the rest over
          let words = p.text.split(/\s+/), cont = false;
          while (true) {
            let lo = 0, hi = words.length;
            while (lo < hi) { const mid = (lo + hi + 1) >> 1; para.textContent = words.slice(0, mid).join(' '); if (fits()) lo = mid; else hi = mid - 1; }
            if (lo === 0) para.remove(); else para.textContent = words.slice(0, lo).join(' ');
            flush(); words = words.slice(lo);
            const next = document.createElement('p'); next.className = lo || cont ? [p.cls, 'cont'].filter(Boolean).join(' ') : cls;
            next.textContent = words.join(' '); box.appendChild(next); cont = true;
            if (fits()) break;
            box.removeChild(next); box.appendChild(para); para.className = next.className;
          }
        }
        flush();
      }
      if (out.length % 2 && !only) out.push({ kind: 'end' });
      probe.remove();
      return out;
    }

    const folio = i => only ? i + 1 : i - 1;
    function tocHTML() {
      const starts = pages.map((p, i) => p.start ? { t: p, i } : null).filter(Boolean);
      const room = 9, shown = starts.slice(0, starts.length > room ? room - 1 : room);
      if (!starts.length) return '<div class="nb-toc"><h4>contents</h4><ul><li class="more">nothing yet</li></ul></div>';
      return `<div class="nb-toc"><h4>contents</h4><ul>${shown.map(({ t, i }) => `<li><a href="#" data-page="${i}"><span class="t">${esc(t.title)}</span><span class="d"></span><span class="n">${folio(i)}</span></a></li>`).join('')}
        ${starts.length > shown.length ? `<li class="more"><a href="${href}">and ${starts.length - shown.length} more, in the index →</a></li>` : ''}</ul></div>`;
    }

    function pageHTML(i) {
      const p = pages[i], verso = i % 2 === 0;
      if (!p) return `<div class="nb-page ${verso ? 'verso' : ''} blank"></div>`;
      if (p.kind === 'inside') return `<div class="nb-page verso scan inside" role="img" aria-label="the inside cover"></div>`;
      if (p.kind === 'flyleaf') return `<div class="nb-page scan flyleaf"><p class="sr-only">In case of loss, please return to Jack Hygate, jhygate@gmail.com. As a reward: love and money.</p>${tocHTML()}</div>`;
      const inner = p.kind === 'end' ? '<div class="nb-end">the rest is blank, for now</div>' : p.html;
      return `<div class="nb-page ${verso ? 'verso' : ''}"><div class="nb-text">${inner}</div><span class="nb-folio">${folio(i)}</span></div>`;
    }
    const coverHTML = () => `<div class="nb-cover" role="img" aria-label="a navy pocket notebook, closed"></div>`;
    const blankBack = () => `<div class="nb-page verso blank"></div>`;

    // ---------- views: 0 is the closed book; then a spread each, or a page each on phones (where the inside cover is only ever the back of the cover) ----------
    const lastView = () => Math.max(first, single ? (only ? pages.length : pages.length - 1) : Math.ceil(pages.length / 2));
    const leftOf = v => 2 * v - 2, rightOf = v => 2 * v - 1, onlyPage = v => only ? v - 1 : v;
    const viewOfPage = i => single ? (only ? i + 1 : Math.max(1, i)) : Math.floor(i / 2) + 1;
    const pagesIn = v => v === 0 ? [] : single ? [onlyPage(v)] : [leftOf(v), rightOf(v)];

    function show(v) {
      view = v; book.classList.toggle('closed', v === 0);
      if (single) { slotL.innerHTML = ''; slotR.innerHTML = v === 0 ? coverHTML() : pageHTML(onlyPage(v)); }
      else { slotL.innerHTML = v === 0 ? '' : pageHTML(leftOf(v)); slotR.innerHTML = v === 0 ? coverHTML() : pageHTML(rightOf(v)); }
      prevBtn.disabled = v === first; nextBtn.disabled = v === lastView();
      root.classList.toggle('one', lastView() === first);
      label.textContent = labelFor(v);
    }

    function labelFor(v) {
      if (v === 0) return 'closed · open it';
      const idx = pagesIn(v).filter(i => pages[i]);
      if (only) { const n = idx.map(folio); return (n.length > 1 ? `pp. ${n[0]}–${n[1]}` : `p. ${n[0]}`) + ` of ${pages.length}`; }
      const on = idx.map(i => pages[i]).filter(p => p.kind === 'text');
      if (!on.length) return idx.some(i => pages[i].kind === 'flyleaf') ? 'contents' : 'the end';
      const nums = idx.filter(i => i > 1).map(folio);
      return (nums.length > 1 ? `pp. ${nums[0]}–${nums[1]}` : `p. ${nums[0]}`) + ' · ' + on[on.length - 1].title;
    }

    async function turnTo(v) {
      if (busy || v === view || v < first || v > lastView()) return;
      busy = true;
      const a = view, fwd = v > a;
      if (single) {
        const lo = fwd ? a : v;          // the page that swings over; its back is the inside cover if it's the cover
        front.innerHTML = lo === 0 ? coverHTML() : pageHTML(onlyPage(lo)); back.innerHTML = lo === 0 ? pageHTML(0) : blankBack();
        if (fwd) slotR.innerHTML = pageHTML(onlyPage(v));
        book.classList.toggle('closed', v === 0);
      } else {
        front.innerHTML = fwd ? (a === 0 ? coverHTML() : pageHTML(rightOf(a))) : (v === 0 ? coverHTML() : pageHTML(rightOf(v)));
        back.innerHTML = pageHTML(fwd ? leftOf(v) : leftOf(a));
        if (fwd) slotR.innerHTML = pageHTML(rightOf(v)); else slotL.innerHTML = v === 0 ? '' : pageHTML(leftOf(v));
        book.classList.toggle('closed', v === 0);
      }
      const face = front.firstElementChild, rear = back.firstElementChild;
      [face, rear].forEach(el => el && el.insertAdjacentHTML('beforeend', '<div class="shade"></div>'));
      leaf.classList.add('on');
      const dur = reduced.matches ? 1 : 750, ease = 'cubic-bezier(.45,.05,.3,1)';
      const [from, to] = fwd ? ['rotateY(0deg)', 'rotateY(-180deg)'] : ['rotateY(-180deg)', 'rotateY(0deg)'];
      const anims = [leaf.animate([{ transform: from }, { transform: to }], { duration: dur, easing: ease, fill: 'forwards' })];
      const fs1 = face && face.querySelector(':scope > .shade'), rs1 = rear && rear.querySelector(':scope > .shade');
      if (fs1) anims.push(fs1.animate([{ opacity: fwd ? 0 : .7 }, { opacity: fwd ? .7 : 0 }], { duration: dur / 2, easing: 'ease-in', fill: 'forwards', delay: fwd ? 0 : dur / 2 }));
      if (rs1) anims.push(rs1.animate([{ opacity: fwd ? .7 : 0 }, { opacity: fwd ? 0 : .7 }], { duration: dur / 2, easing: 'ease-out', fill: 'forwards', delay: fwd ? dur / 2 : 0 }));
      await Promise.all(anims.map(x => x.finished.catch(() => {})));
      show(v);
      leaf.classList.remove('on'); anims.forEach(x => x.cancel());
      busy = false;
    }
    const step = d => turnTo(view + d);

    // ---------- size: two pages if they fit, one if not; repaginate when the type size changes ----------
    function fit() {
      const w = stage.clientWidth || root.clientWidth, h = innerHeight;
      const nextSingle = w < 36 * 16;
      const across = nextSingle ? 21 : 41.4;
      const nextFs = Math.max(11, Math.min(opts.maxSize || 16, (w - 24) / across, h * .8 / 33));
      const rounded = Math.round(nextFs * 2) / 2;
      if (rounded === fs && nextSingle === single && pages.length) return;
      const anchor = view > 0 ? (pagesIn(view).map(i => pages[i]).reverse().find(p => p && p.slug) || {}).slug : null;
      fs = rounded; single = nextSingle;
      root.style.fontSize = fs + 'px'; root.classList.toggle('single', single);
      pages = paginate();
      const at = anchor ? pages.findIndex(p => p.slug === anchor && p.start) : -1;
      show(view === 0 ? 0 : at >= 0 ? viewOfPage(at) : Math.min(view, lastView()));
    }

    // ---------- turning: buttons, page edges, contents, arrow keys while it's on screen, swipes ----------
    prevBtn.addEventListener('click', () => step(-1));
    nextBtn.addEventListener('click', () => step(1));
    $('.nb-hit.prev').addEventListener('click', () => step(-1));
    $('.nb-hit.next').addEventListener('click', () => step(1));
    root.addEventListener('click', e => { const a = e.target.closest('[data-page]'); if (!a) return; e.preventDefault(); turnTo(viewOfPage(+a.dataset.page)); });
    let onScreen = false;
    const io = new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; }, { threshold: .5 }); io.observe(stage);
    const onKey = e => {
      if (!onScreen || e.altKey || e.metaKey || e.ctrlKey || /input|textarea|select/i.test(e.target.tagName)) return;
      if (e.key === 'ArrowRight') { step(1); e.preventDefault(); } else if (e.key === 'ArrowLeft') { step(-1); e.preventDefault(); }
    };
    document.addEventListener('keydown', onKey);
    let sx = null, sy = 0;
    stage.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; } });
    stage.addEventListener('pointerup', e => {
      if (sx == null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    });
    let rt; const onResize = () => { clearTimeout(rt); rt = setTimeout(fit, 150); };
    addEventListener('resize', onResize);

    // pagination needs the type and every picture's shape before it can measure anything
    const fontsIn = ['700 20px Caveat', '400 16px "Libre Caslon Text"', '500 12px "IBM Plex Mono"'].map(f => document.fonts.load(f).catch(() => {}));
    const shapesIn = [...new Set(thoughts.flatMap(t => paras(t.body).filter(p => p.img).map(p => p.img)))].map(src => new Promise(res => {
      const im = new Image(); im.onload = () => { aspects.set(src, im.naturalWidth / im.naturalHeight); res(); }; im.onerror = res; im.src = src;
    }));
    Promise.all([...fontsIn, ...shapesIn]).then(fit);

    return { turnTo, destroy() { document.removeEventListener('keydown', onKey); removeEventListener('resize', onResize); io.disconnect(); root.innerHTML = ''; root.classList.remove('nb', 'single'); } };
  };

  window.createThoughtsIndex = function (root, thoughts) {
    root.classList.add('th');
    const years = [...new Set(thoughts.map(t => t.date.slice(0, 4)))];
    root.innerHTML = `<nav class="th-list" aria-label="every piece"><h2>index <span>${thoughts.length} ${thoughts.length === 1 ? 'entry' : 'entries'}</span></h2>
      ${thoughts.length ? years.map(y => `<div class="th-year">${y}</div><ol>${thoughts.filter(t => t.date.startsWith(y)).map(t => {
        const [, m, d] = t.date.split('-').map(Number);
        return `<li><a href="#${esc(t.slug)}" data-slug="${esc(t.slug)}"><time datetime="${esc(t.date)}">${d} ${MONTHS[m - 1]}</time><b>${esc(t.title)}</b></a></li>`; }).join('')}</ol>`).join('') : '<p class="th-none">nothing written yet.</p>'}
      </nav><div class="th-read"><div class="th-book"></div><nav class="th-nav"></nav></div>`;
    const bookEl = root.querySelector('.th-book'), nav = root.querySelector('.th-nav');
    let book = null;
    function open(slug, scroll) {
      const i = Math.max(0, thoughts.findIndex(t => t.slug === slug)), t = thoughts[i], newer = thoughts[i - 1], older = thoughts[i + 1];
      if (book) { book.destroy(); book = null; }
      if (!t) return;
      document.title = `${t.title} · jack hygate`;
      book = createNotebook(bookEl, [t], { only: true, href: location.pathname });
      nav.innerHTML = `${older ? `<a href="#${esc(older.slug)}">← ${esc(older.title)}</a>` : '<span></span>'}${newer ? `<a href="#${esc(newer.slug)}">${esc(newer.title)} →</a>` : ''}`;
      root.querySelectorAll('.th-list a').forEach(a => a.setAttribute('aria-current', String(a.dataset.slug === t.slug)));
      if (scroll && matchMedia('(max-width: 820px)').matches) bookEl.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth' });
    }
    const route = scroll => open(decodeURIComponent(location.hash.slice(1)) || (thoughts[0] && thoughts[0].slug), scroll);
    addEventListener('hashchange', () => route(true));
    route(false);
  };
})();

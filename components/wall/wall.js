/* the wall: a whiteboard anyone can draw on and a stretch of cork anyone can stick a note to.
   Both talk to the wall service (repo jhygate/wall) and stay live over server-sent events. */
window.createWall = function (opts) {
  'use strict';
  const API = opts.api.replace(/\/$/, '');
  const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const notesRoot = opts.notes, boardRoot = opts.board;
  let colours = ['yellow', 'pink', 'blue', 'green', 'orange'], inks = ['#1d1d1f', '#c62828', '#1565c0', '#2e7d32', '#ffffff'];
  const strokes = [], noteIds = new Set();

  /* ---------- post-its ---------- */
  notesRoot.innerHTML = `
    <div class="wall-cork" aria-live="polite"></div>
    <form class="wall-form">
      <label><span>your name <em class="wall-count" data-for="name">0 / 40</em></span><input name="name" maxlength="40" placeholder="who's this?" autocomplete="nickname"></label>
      <label><span>your note <em class="wall-count" data-for="text">0 / 280</em></span><textarea name="text" maxlength="280" rows="4" placeholder="say hello. keep it short, it's a small square of paper." required></textarea></label>
      <div class="wall-colours" role="radiogroup" aria-label="paper colour"></div>
      <button type="submit" class="wall-stick">write it</button>
      <p class="wall-hint">then drag it somewhere on the cork and click it to pin it.</p>
      <p class="wall-err" role="alert"></p>
    </form>`;
  const cork = notesRoot.querySelector('.wall-cork'), form = notesRoot.querySelector('.wall-form'), err = notesRoot.querySelector('.wall-err');
  const swatches = notesRoot.querySelector('.wall-colours');
  let colour = colours[0];
  function renderSwatches() {
    swatches.innerHTML = colours.map(c => `<button type="button" class="wall-sw" data-c="${c}" role="radio" aria-checked="${c === colour}" aria-label="${c} paper" style="--paper:var(--postit-${c})"></button>`).join('');
  }
  swatches.addEventListener('click', e => { const b = e.target.closest('.wall-sw'); if (!b) return; colour = b.dataset.c; renderSwatches(); if (draft) draft.el.dataset.colour = colour; });
  renderSwatches();
  const LIMITS = { name: 40, text: 280 };
  function counts() {
    for (const [k, max] of Object.entries(LIMITS)) {
      const el = form.elements[k], c = form.querySelector(`.wall-count[data-for="${k}"]`);
      if (el.value.length > max) el.value = el.value.slice(0, max);
      c.textContent = `${el.value.length} / ${max}`; c.classList.toggle('full', el.value.length >= max);
    }
  }
  form.addEventListener('input', counts);
  form.addEventListener('reset', () => setTimeout(counts));

  function noteEl(n, isDraft) {
    const el = document.createElement('div');
    el.className = 'wall-note' + (isDraft ? ' draft' : '');
    el.dataset.colour = n.colour; el.dataset.id = n.id || '';
    el.style.setProperty('--x', (n.x * 100) + '%'); el.style.setProperty('--y', (n.y * 100) + '%'); el.style.setProperty('--r', n.rot + 'deg');
    el.innerHTML = `<span class="pin"></span><b>${esc(n.name)}</b><p>${esc(n.text)}</p>${isDraft ? '<span class="tag">drag me, then click to pin</span>' : `<time>${new Date(n.ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</time>`}`;
    return el;
  }
  function addNote(n) {
    if (noteIds.has(n.id)) return; noteIds.add(n.id);
    cork.appendChild(noteEl(n, false));
  }

  // one draft at a time; it follows the pointer until it's pinned
  let draft = null;
  form.addEventListener('submit', e => {
    e.preventDefault(); err.textContent = '';
    const fd = new FormData(form), text = (fd.get('text') || '').trim();
    if (!text) { err.textContent = 'write something first.'; return; }
    if (draft) draft.el.remove();
    const n = { name: (fd.get('name') || '').trim().slice(0, LIMITS.name) || 'anon', text: text.slice(0, LIMITS.text), colour, x: .2 + Math.random() * .6, y: .2 + Math.random() * .6, rot: Math.round((Math.random() * 10 - 5) * 10) / 10 };
    const el = noteEl(n, true); cork.appendChild(el); draft = { n, el };
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
  let drag = null;
  cork.addEventListener('pointerdown', e => {
    if (!draft || !e.target.closest('.wall-note.draft')) return;
    const r = cork.getBoundingClientRect();
    drag = { moved: false, dx: e.clientX - (r.left + draft.n.x * r.width), dy: e.clientY - (r.top + draft.n.y * r.height) };
    draft.el.setPointerCapture(e.pointerId);
  });
  cork.addEventListener('pointermove', e => {
    if (!drag || !draft) return;
    const r = cork.getBoundingClientRect();
    const x = Math.min(.98, Math.max(.02, (e.clientX - drag.dx - r.left) / r.width)), y = Math.min(.98, Math.max(.02, (e.clientY - drag.dy - r.top) / r.height));
    if (Math.abs(x - draft.n.x) * r.width + Math.abs(y - draft.n.y) * r.height > 3) drag.moved = true;
    draft.n.x = x; draft.n.y = y; draft.el.style.setProperty('--x', (x * 100) + '%'); draft.el.style.setProperty('--y', (y * 100) + '%');
  });
  cork.addEventListener('pointerup', async e => {
    if (!drag || !draft) return;
    const wasMoved = drag.moved; drag = null;
    if (wasMoved) return;                                   // a drag ends here; a plain click pins it
    const d = draft; draft = null; d.el.classList.add('pinning');
    try {
      const r = await fetch(API + '/api/notes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(d.n) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || r.status);
      d.el.remove(); addNote(j); form.reset(); colour = colours[0]; renderSwatches();
    } catch (ex) { err.textContent = String(ex.message || ex); d.el.classList.remove('pinning'); draft = d; }
  });
  cork.addEventListener('pointercancel', () => { drag = null; });

  /* ---------- whiteboard ---------- */
  boardRoot.innerHTML = `
    <div class="wb-frame"><canvas class="wb-canvas" aria-label="a shared whiteboard. draw with the mouse or a finger."></canvas><div class="wb-glare"></div></div>
    <div class="wb-tray" role="radiogroup" aria-label="marker"></div>
    <p class="wb-hint">everyone sees the same board. be nice.</p>`;
  const canvas = boardRoot.querySelector('.wb-canvas'), ctx = canvas.getContext('2d'), tray = boardRoot.querySelector('.wb-tray');
  let ink = inks[0], width = 3;
  function renderTray() {
    tray.innerHTML = inks.map(c => c === '#ffffff'
      ? `<button type="button" class="wb-rubber${ink === c ? ' on' : ''}" data-c="${c}" role="radio" aria-checked="${ink === c}" aria-label="rubber"></button>`
      : `<button type="button" class="wb-marker${ink === c ? ' on' : ''}" data-c="${c}" role="radio" aria-checked="${ink === c}" aria-label="${c} marker" style="--ink:${c}"></button>`).join('');
  }
  tray.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; ink = b.dataset.c; width = ink === '#ffffff' ? 26 : 3; renderTray(); });
  renderTray();

  function size() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    redraw();
  }
  function paint(s) {
    const W = canvas.width, H = canvas.height, k = W / 1000;      // widths are in thousandths of the board's width
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = s.c; ctx.lineWidth = Math.max(1, s.w * k);
    ctx.beginPath();
    s.p.forEach(([x, y], i) => { i ? ctx.lineTo(x * W, y * H) : ctx.moveTo(x * W, y * H); });
    if (s.p.length === 1) ctx.lineTo(s.p[0][0] * W + .01, s.p[0][1] * H);
    ctx.stroke();
  }
  function redraw() { ctx.clearRect(0, 0, canvas.width, canvas.height); strokes.forEach(paint); }
  addEventListener('resize', size);

  let cur = null;
  const pt = e => { const r = canvas.getBoundingClientRect(); return [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))]; };
  canvas.addEventListener('pointerdown', e => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    canvas.setPointerCapture(e.pointerId);
    cur = { c: ink, w: width, p: [pt(e)] }; paint(cur);
  });
  canvas.addEventListener('pointermove', e => {
    if (!cur) return;
    const q = pt(e), last = cur.p[cur.p.length - 1];
    if (Math.hypot(q[0] - last[0], q[1] - last[1]) < .002) return;
    cur.p.push(q); if (cur.p.length > 600) { finish(); cur = { c: ink, w: width, p: [q] }; }
    const W = canvas.width, H = canvas.height, k = W / 1000;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = cur.c; ctx.lineWidth = Math.max(1, cur.w * k);
    ctx.beginPath(); ctx.moveTo(last[0] * W, last[1] * H); ctx.lineTo(q[0] * W, q[1] * H); ctx.stroke();
  });
  async function finish() {
    if (!cur) return; const s = cur; cur = null;
    strokes.push(s);
    try {
      const r = await fetch(API + '/api/strokes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(s) });
      const j = await r.json(); if (r.ok) s.id = j.id;
    } catch (e) {}
  }
  canvas.addEventListener('pointerup', finish); canvas.addEventListener('pointercancel', finish);

  /* ---------- load + live ---------- */
  function applyEvent(ev) {
    if (ev.type === 'note') addNote(ev.note);
    else if (ev.type === 'stroke') { if (!strokes.some(s => s.id === ev.stroke.id)) { strokes.push(ev.stroke); paint(ev.stroke); } }
    else if (ev.type === 'delete') { noteIds.delete(ev.id); const el = cork.querySelector(`.wall-note[data-id="${ev.id}"]`); if (el) el.remove(); }
    else if (ev.type === 'clear') { strokes.length = 0; redraw(); }
    else if (ev.type === 'clearnotes') { noteIds.clear(); cork.querySelectorAll('.wall-note:not(.draft)').forEach(el => el.remove()); }
  }
  let es = null;
  function listen() {
    if (es) es.close();
    es = new EventSource(API + '/api/stream');
    es.onmessage = e => { try { applyEvent(JSON.parse(e.data)); } catch (x) {} };
    es.onerror = () => { es.close(); es = null; setTimeout(listen, 5000); };
  }
  fetch(API + '/api/wall', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(d => {
    if (Array.isArray(d.colours) && d.colours.length) { colours = d.colours; colour = colours[0]; renderSwatches(); }
    if (Array.isArray(d.inks) && d.inks.length) { inks = d.inks; ink = inks[0]; renderTray(); }
    (d.notes || []).forEach(addNote);
    strokes.push(...(d.strokes || [])); size(); listen();
    notesRoot.classList.add('ready'); boardRoot.classList.add('ready');
  }).catch(() => { size(); notesRoot.classList.add('offline'); boardRoot.classList.add('offline'); err.textContent = 'the wall is offline just now.'; });
};

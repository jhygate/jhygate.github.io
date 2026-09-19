/* the cassette player: the recently played tape from the rack, the yellow key, and the spine label in the rack's five styles */
(() => {
  /* ---------- the tape: recent.json → inlay rows + the player caption ---------- */
  const fmt = n => `${Math.floor(n / 60)}:${String(Math.round(n % 60)).padStart(2, '0')}`;
  const ago = iso => {
    if (!iso) return '';
    const m = Math.round((Date.now() - new Date(iso)) / 60000);
    if (m < 60) return `${m} min ago`;
    if (m < 60 * 24) return `${Math.round(m / 60)} hours ago`;
    return `${Math.round(m / 60 / 24)} days ago`;
  };
  const inlay = document.getElementById('inlay');
  const RACK = 'https://jacks-cassettes.jackhygate.co.uk';
  const player = document.querySelector('.player');
  const yellow = document.getElementById('yellow');
  const state = document.getElementById('np-state');
  const audio = new Audio(); audio.preload = 'none';
  let tracks = [], at = 0, playing = false;

  function showState() {
    const t = tracks[at];
    player.classList.toggle('playing', playing);
    state.textContent = playing ? '▶ playing' : (t && t.stream ? 'the yellow button plays it' : 'no tape for this one');
  }
  async function play() {
    const t = tracks[at]; if (!t || !t.stream) { playing = false; showState(); return; }
    if (audio.dataset.id !== t.id) { audio.src = t.stream; audio.dataset.id = t.id; }
    try { await audio.play(); playing = true; } catch (e) { playing = false; }
    showState();
  }
  function pause() { audio.pause(); playing = false; showState(); }
  yellow.addEventListener('click', () => { if (window.telly) window.telly.sfx.clunk(); playing ? pause() : play(); });
  audio.addEventListener('ended', () => { cue(at + 1); play(); });
  audio.addEventListener('error', () => { playing = false; showState(); });

  function cue(i) {
    at = (i + tracks.length) % tracks.length;
    const t = tracks[at]; if (!t) return;
    document.getElementById('np-song').textContent = t.title;
    document.getElementById('np-album').textContent = `${t.album || ''}${t.album ? ' · ' : ''}${t.artist}`;
    document.getElementById('np-when').textContent = t.playedAt ? `· ${ago(t.playedAt)}` : '';
    inlay.querySelectorAll('.ilr').forEach((r, k) => r.classList.toggle('on', k === at));
    paintSpine(t);
    showState();
  }
  /* ---------- the spine: the rack's five labels, palette from the cover ---------- */
  const TEMPLATES = ['bold', 'strip', 'typed', 'art', 'band'];
  const FALLBACK = ['#8c7c5c', '#efe8d6', '#332c1e'];
  const hash = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); };
  const lum = hex => { const n = parseInt(hex.slice(1), 16); const r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255; return .2126 * r + .7152 * g + .0722 * b; };
  const catNo = (title, artist) => { const h = hash(title + artist); return ['TC', 'ZC', 'MC', 'CS'][h % 4] + '-' + (1000 + h % 8999); };
  const esc = v => String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
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
      const d = ctx.getImageData(0, 0, n, n).data;
      const buckets = new Map();
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        if (d[i + 3] < 125) continue;
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        if (mx < 40 || (mn > 228 && mx - mn < 18)) continue;
        const key = (r >> 4) << 8 | (g >> 4) << 4 | (b >> 4);
        let e = buckets.get(key); if (!e) { e = { r: 0, g: 0, b: 0, c: 0 }; buckets.set(key, e); }
        e.r += r; e.g += g; e.b += b; e.c++;
      }
      const reps = [...buckets.values()].map(e => { const r = e.r / e.c, g = e.g / e.c, b = e.b / e.c; return { rgb: [r, g, b], score: e.c * (.25 + sat(r, g, b)) }; }).sort((x, y) => y.score - x.score);
      const chosen = [];
      for (const rp of reps) { if (chosen.every(c => diff(c, rp.rgb) > 46)) chosen.push(rp.rgb); if (chosen.length === 3) break; }
      const pal = chosen.map(c => toHex(...c)); while (pal.length < 3) pal.push(FALLBACK[pal.length]);
      palCache[url] = pal; try { localStorage.setItem('pal3:' + url, JSON.stringify(pal)); } catch (e) {}
      return pal;
    } catch (e) { return FALLBACK.slice(); }
  }
  function computeSpine(t, palette) {
    const [c1, c2, c3] = palette;
    const name = t.album || t.title, artist = t.artist || '';
    const tpl = TEMPLATES[hash(artist + name) % TEMPLATES.length];
    const dark = lum(c1) < .42;
    let base = c1, ink = dark ? '#fdfbf6' : '#181410', accent = dark ? c2 : c3;
    if (tpl === 'strip') { base = 'linear-gradient(180deg,#3a3936,#232120)'; ink = '#e8e2d6'; const bright = palette.slice().sort((x, y) => lum(y) - lum(x))[0]; accent = lum(bright) > .55 ? bright : '#e8e2d6'; }
    if (tpl === 'typed') { base = 'linear-gradient(180deg,#faf6ea,#ece5d2)'; ink = '#1d1913'; accent = c1; }
    if (tpl === 'art') { base = c2; ink = lum(c2) < .42 ? '#fbf8f2' : '#171310'; accent = c3; }
    if (tpl === 'band') { base = 'linear-gradient(180deg,#fbf9f2,#eae5d8)'; ink = '#191510'; accent = c1; }
    return { tpl, base, ink, accent, base2: dark ? c1 : '#ffffff', onAccent: lum(accent) < .5 ? '#ffffff' : '#151210',
      title: name, artist, len: t.secs ? fmt(t.secs) : '--:--', stock: 'Type IV', cat: catNo(name, artist), art: t.cover || '' };
  }
  function templateHTML(d) {
    const ti = esc(d.title), ar = esc(d.artist);
    const cover = `<div class="sp-cover" style="${d.art ? `background-image:url('${d.art}')` : ''}"></div>`;
    switch (d.tpl) {
      case 'bold': return `<div class="tpl tpl-bold">${cover}<div class="b-body"><div class="b-title" style="color:${d.ink}">${ti}</div><div class="b-artist" style="color:${d.ink}">${ar}</div><div class="b-right"><div class="b-cat" style="color:${d.ink}">${d.cat}</div><div class="b-side" style="background:${d.ink};color:${d.base2}">A</div></div></div></div>`;
      case 'strip': return `<div class="tpl tpl-strip">${cover}<div class="s-bar" style="background:${d.accent}"></div><div class="s-mid"><div class="s-artist" style="color:${d.accent}">${ar}</div><div class="s-strip"><div class="s-title">${ti}</div></div></div><div class="s-rail" style="color:${d.ink}"><span>${d.len}</span><span>${d.stock}</span></div></div>`;
      case 'typed': return `<div class="tpl tpl-typed">${cover}<div class="ty-body"><div class="ty-mid"><div class="ty-title" style="color:${d.ink}">${ti}</div><div class="ty-sub" style="color:${d.ink}">${ar}</div></div><div class="ty-right"><div class="ty-rule" style="background:${d.accent}"></div><div class="ty-side" style="color:${d.ink}">SIDE A</div></div></div></div>`;
      case 'art': return `<div class="tpl tpl-art"><div class="ar-crop" style="${d.art ? `background-image:url('${d.art}')` : `background:${d.accent}`}"></div><div class="ar-mid"><div class="ar-title" style="color:${d.ink}">${ti}</div><div class="ar-artist" style="color:${d.ink}">${ar}</div></div><div class="ar-bar" style="background:${d.accent}"></div></div>`;
      default: return `<div class="tpl tpl-band">${cover}<div class="bd-col"><div class="bd-band" style="background:${d.accent}"><div class="bd-artist" style="color:${d.onAccent}">${ar}</div><div class="bd-cat" style="color:${d.onAccent}">${d.cat}</div></div><div class="bd-low"><div class="bd-title" style="color:${d.ink}">${ti}</div><div class="bd-len" style="color:${d.ink}">A · ${d.len}</div></div></div></div>`;
    }
  }
  let spineSeq = 0;
  async function paintSpine(t) {
    const seq = ++spineSeq;
    const pal = await computePalette(t.cover);
    if (seq !== spineSeq) return;
    const d = computeSpine(t, pal);
    const insert = document.getElementById('sp-insert');
    insert.style.background = d.base;
    insert.innerHTML = templateHTML(d) + '<div class="shade"></div>';
  }

  function render(list) {
    tracks = list;
    inlay.style.setProperty('--rows', Math.max(1, Math.ceil(list.length / 2)));
    inlay.innerHTML = list.map((t, i) => `<div class="ilr" role="listitem" data-i="${i}">
      <span class="ilr-n">${i + 1}</span>
      <span class="ilr-main"><span class="ilr-nm">${t.title}</span><span class="ilr-src">${t.artist}</span></span>
      <span class="ilr-d">${t.secs ? fmt(t.secs) : ''}</span></div>`).join('');
    inlay.querySelectorAll('.ilr').forEach(r => r.addEventListener('click', () => { const was = playing; cue(+r.dataset.i); if (was) play(); }));
    document.getElementById('inlay-count').textContent = `${list.length} songs · ${fmt(list.reduce((a, t) => a + (t.secs || 0), 0))}`;
    cue(0);
  }
  const fromRack = fetch(RACK + '/api/public/recent', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(d => (d.tracks || []).map(t => ({ ...t, stream: t.stream ? RACK + t.stream : null, cover: t.cover ? RACK + t.cover + '?size=120' : null })))
    .then(list => list.length ? list : Promise.reject());
  const fromFile = () => fetch('/data/recent.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject()).then(d => Array.isArray(d) ? d : d.tracks || []);
  fromRack.catch(fromFile).then(render).catch(() => render([]));

})();

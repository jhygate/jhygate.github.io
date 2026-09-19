(() => {
  const telly = document.getElementById('telly');
  const phosphor = document.getElementById('phosphor');
  const osd = document.getElementById('osd');
  const channels = [...document.querySelectorAll('.channel')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let zoom = 1;

  /* ---------- sounds: a few oscillators and noise bursts, nothing downloaded ---------- */
  let ac = null, sfxOn = true;
  try { sfxOn = localStorage.getItem('sfx') !== 'off'; } catch (e) {}
  const sfxBtn = document.getElementById('sfx');
  const reflectSfx = () => { sfxBtn.setAttribute('aria-pressed', String(sfxOn)); sfxBtn.textContent = sfxOn ? 'sound on' : 'sound off'; };
  reflectSfx();
  function ctx() { if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); return ac; }
  function noise(dur) {
    const c = ctx(), buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = buf; return src;
  }
  function env(node, t0, peak, attack, decay) {
    const g = ctx().createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + attack); g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
    node.connect(g); g.connect(ctx().destination); return g;
  }
  const sfx = {
    tick() {                                  // a small plastic button
      if (!sfxOn) return; const c = ctx(), t = c.currentTime, n = noise(.04), f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800; n.connect(f); env(f, t, .25, .002, .035); n.start(t);
    },
    clunk() {                                 // the yellow key: heavier, lower
      if (!sfxOn) return; const c = ctx(), t = c.currentTime;
      const n = noise(.08), f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900; n.connect(f); env(f, t, .5, .003, .07); n.start(t);
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(60, t + .09); env(o, t, .35, .002, .09); o.start(t); o.stop(t + .12);
    },
    zap() {                                   // channel change: click, then a burst of static
      if (!sfxOn) return; const c = ctx(), t = c.currentTime; sfx.tick();
      const n = noise(.22), f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = .6; n.connect(f); env(f, t + .02, .22, .005, .18); n.start(t + .02);
    },
    on() {                                    // power on: degauss thump, then the line whine rising
      if (!sfxOn) return; const c = ctx(), t = c.currentTime;
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(28, t + .3); env(o, t, .9, .004, .32); o.start(t); o.stop(t + .4);
      const n = noise(.35), f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(3000, t); f.frequency.exponentialRampToValueAtTime(300, t + .3); n.connect(f); env(f, t, .35, .005, .3); n.start(t);
      const w = c.createOscillator(); w.type = 'sine'; w.frequency.setValueAtTime(6000, t + .25); w.frequency.exponentialRampToValueAtTime(9800, t + .8); env(w, t + .25, .06, .3, .5); w.start(t + .25); w.stop(t + 1.2);
    },
    off() {                                   // power off: click, the whine falling away, a soft thump
      if (!sfxOn) return; const c = ctx(), t = c.currentTime; sfx.tick();
      const w = c.createOscillator(); w.type = 'sine'; w.frequency.setValueAtTime(7000, t); w.frequency.exponentialRampToValueAtTime(180, t + .45); env(w, t, .08, .01, .42); w.start(t); w.stop(t + .5);
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(90, t + .05); o.frequency.exponentialRampToValueAtTime(35, t + .3); env(o, t + .05, .5, .004, .3); o.start(t + .05); o.stop(t + .4);
    },
  };
  sfxBtn.addEventListener('click', () => { sfxOn = !sfxOn; try { localStorage.setItem('sfx', sfxOn ? 'on' : 'off'); } catch (e) {} reflectSfx(); if (sfxOn) sfx.tick(); });

  const flash = (cls, ms) => {
    telly.classList.remove(cls); void telly.offsetWidth; telly.classList.add(cls);
    setTimeout(() => telly.classList.remove(cls), ms);
  };

  function showOsd(text, sub) {
    osd.innerHTML = text + (sub ? `<small>${sub}</small>` : '');
    osd.classList.remove('show'); void osd.offsetWidth; osd.classList.add('show');
  }

  function tune(i, { quiet = false } = {}) {
    if (telly.classList.contains('off')) return;
    current = (i + channels.length) % channels.length;
    channels.forEach((c, k) => c.classList.toggle('on', k === current));
    phosphor.scrollTop = 0;
    fit();
    history.replaceState(null, '', '#' + channels[current].id.slice(3));
    if (!quiet) {
      sfx.zap();
      if (!reduced) flash('zap', 220);
      showOsd(channels[current].dataset.n, channels[current].querySelector('h1').textContent);
    }
  }

  // at the default size the screen never scrolls: step the type down until the channel fits
  const phone = matchMedia('(max-width: 640px)');
  function fit() {
    let f = 1;
    phosphor.style.setProperty('--fit', f);
    if (phone.matches) return;
    while (f > .7 && phosphor.scrollHeight > phosphor.clientHeight) {
      f -= .03;
      phosphor.style.setProperty('--fit', f.toFixed(2));
    }
  }
  addEventListener('resize', fit);

  function setZoom(z) {
    zoom = Math.min(1.6, Math.max(.7, +z.toFixed(2)));
    document.documentElement.style.setProperty('--zoom', zoom);
    sfx.tick();
    showOsd('vol', '▮'.repeat(Math.round((zoom - .7) / .9 * 10)).padEnd(10, '▯'));
  }

  const acts = {
    'ch+': () => tune(current + 1),
    'ch-': () => tune(current - 1),
    'vol+': () => setZoom(zoom + .1),
    'vol-': () => setZoom(zoom - .1),
    'rew': () => phosphor.scrollBy({ top: -phosphor.clientHeight * .7, behavior: 'smooth' }),
    'play': () => phosphor.scrollBy({ top: phosphor.clientHeight * .7, behavior: 'smooth' }),
    'stop': () => phosphor.scrollTo({ top: 0, behavior: 'smooth' }),
  };

  document.querySelectorAll('.btn[data-act]').forEach(b => {
    b.addEventListener('click', () => {
      b.classList.add('pressed'); setTimeout(() => b.classList.remove('pressed'), 140);
      acts[b.dataset.act]();
    });
  });

  document.getElementById('power').addEventListener('click', () => {
    const off = telly.classList.toggle('off');
    off ? sfx.off() : sfx.on();
    if (!off && !reduced) flash('warm', 900);
  });

  // remote-ish keyboard: digits tune, arrows step, space toggles power
  addEventListener('keydown', e => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target && e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
    const r = telly.getBoundingClientRect();
    if (r.bottom < innerHeight * .25 || r.top > innerHeight * .75) return;   // the remote only works when the set is on screen
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= channels.length) return tune(n - 1);
    if (e.key === 'ArrowRight') acts['ch+']();
    if (e.key === 'ArrowLeft') acts['ch-']();
    if (e.key === '+' || e.key === '=') acts['vol+']();
    if (e.key === '-') acts['vol-']();
  });

  const start = channels.findIndex(c => c.id === 'ch-' + location.hash.slice(1));
  tune(start >= 0 ? start : 0, { quiet: true });
  // hold the boot screen until the set, the cork and the type are in, three seconds at most
  const boot = document.getElementById('boot');
  const loaded = src => new Promise(res => { const im = new Image(); im.onload = im.onerror = () => res(); im.src = src; });
  const tellyImg = telly.querySelector('img');
  const ready = Promise.all([tellyImg.complete ? Promise.resolve() : loaded(tellyImg.src), loaded('/assets/textures/cork.jpg'), document.fonts ? document.fonts.ready : Promise.resolve()]);
  Promise.race([ready, new Promise(r => setTimeout(r, 3000))]).then(() => {
    boot.classList.add('off');
    if (!reduced) flash('warm', 900);
    setTimeout(() => boot.remove(), 900);
  });
  const clock = document.getElementById('clock');
  const tick = () => { const d = new Date(); clock.textContent = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; };
  tick(); setInterval(tick, 15000);
  window.telly = { sfx, tune };
})();

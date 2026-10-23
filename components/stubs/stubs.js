/* =====================================================================
   TICKET STUBS — createStubs(rootElement, events)
   events: [{ title, date: "YYYY-MM-DD", venue, url, note }]
   Things i've been to, as torn ticket stubs pinned up newest first. The list lives on the
   listings (calendar.jackhygate.co.uk): tick "went" there, or add one in the back room.
   ===================================================================== */
(function () {
  const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const SHOW = 12;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  // the same event always gets the same colour, tilt and serial number
  const hash = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };

  function stub(e) {
    const h = hash(e.title + e.date), [y, m, d] = e.date.split('-');
    const tag = e.url ? 'a' : 'div';
    const link = e.url ? ` href="${esc(e.url)}" target="_blank" rel="noopener noreferrer"` : '';
    return `<${tag} class="st st-c${h % 5}"${link} style="--tilt:${((h >> 3) % 70) / 10 - 3.5}deg">
      <span class="st-side"><b>${+d}</b><i>${MON[+m - 1]}</i><i>${y}</i></span>
      <span class="st-body">
        <span class="st-admit">admit one · no. ${String(h % 100000).padStart(5, '0')}</span>
        <strong class="st-title">${esc(e.title)}</strong>
        ${e.venue ? `<span class="st-venue">${esc(e.venue)}</span>` : ''}
        ${e.note ? `<span class="st-note">${esc(e.note)}</span>` : ''}
      </span>
    </${tag}>`;
  }

  function createStubs(root, events) {
    const list = (events || []).filter(e => e && e.title && /^\d{4}-\d{2}-\d{2}$/.test(e.date)).sort((a, b) => b.date.localeCompare(a.date));
    const section = root.closest('section');
    if (!list.length) { if (section) section.hidden = true; return; }
    if (section) section.hidden = false;
    let all = false;
    const draw = () => {
      root.innerHTML = `<div class="st-wall">${(all ? list : list.slice(0, SHOW)).map(stub).join('')}</div>` +
        (list.length > SHOW ? `<button class="st-more" type="button">${all ? 'fewer' : `all ${list.length} →`}</button>` : '');
      const more = root.querySelector('.st-more');
      if (more) more.onclick = () => { all = !all; draw(); };
    };
    draw();
  }

  window.createStubs = createStubs;
})();

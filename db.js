// ── Supabase REST client (no npm needed) ────────────────────────────────────
const DB = {
  url: TRIP.supabase_url,
  key: TRIP.supabase_key,

  headers() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
    };
  },

  async insert(table, rows) {
    const res = await fetch(`${this.url}/rest/v1/${table}`, {
      method: 'POST',
      headers: { ...this.headers(), 'Prefer': 'return=minimal' },
      body: JSON.stringify(Array.isArray(rows) ? rows : [rows]),
    });
    if (!res.ok) throw new Error(`Insert failed: ${res.status}`);
  },

  async select(table, params = '') {
    const res = await fetch(`${this.url}/rest/v1/${table}?${params}&order=created_at.desc`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`Select failed: ${res.status}`);
    return res.json();
  },

  async delete(table, id) {
    const res = await fetch(`${this.url}/rest/v1/${table}?id=eq.${id}`, {
      method: 'DELETE',
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  },
};

// ── Shared UI helpers ────────────────────────────────────────────────────────
function toast(msg, duration = 2200) {
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id='toast'; el.className='toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), duration);
}

function currentUser() {
  return localStorage.getItem('island_user') || '';
}
function setUser(name) {
  localStorage.setItem('island_user', name);
}

// ── Name picker (bottom sheet) ───────────────────────────────────────────────
function openNamePicker() {
  if (document.getElementById('name-picker-modal')) return;
  const cur = currentUser();
  const overlay = document.createElement('div');
  overlay.id = 'name-picker-modal';
  overlay.innerHTML = `
    <div class="picker-backdrop"></div>
    <div class="picker-sheet">
      <div style="font-family:'Playfair Display',serif;font-size:1.15rem;text-align:center;margin-bottom:.3rem">Wer bist du?</div>
      <div style="font-size:.8rem;color:var(--muted);text-align:center;margin-bottom:1rem">Auswahl wird gespeichert</div>
      <div class="chips" id="picker-chips" style="justify-content:center;margin-bottom:1rem"></div>
      <button class="btn btn-secondary" id="picker-cancel" style="width:100%">Abbrechen</button>
    </div>`;
  document.body.appendChild(overlay);

  const chipsEl = document.getElementById('picker-chips');
  TRIP.people.forEach(name => {
    const c = document.createElement('div');
    c.className = 'chip' + (name === cur ? ' selected' : '');
    c.textContent = name;
    c.onclick = () => {
      setUser(name);
      const badge = document.getElementById('user-badge');
      if (badge) badge.textContent = name;
      closeNamePicker();
      toast(`👋 Hallo ${name}!`);
      setTimeout(() => location.reload(), 450);
    };
    chipsEl.appendChild(c);
  });
  overlay.querySelector('.picker-backdrop').onclick = closeNamePicker;
  document.getElementById('picker-cancel').onclick = closeNamePicker;
}
function closeNamePicker() {
  const m = document.getElementById('name-picker-modal');
  if (m) m.remove();
}

// Mark active nav item + restore badge + wire badge click
document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop().replace('.html','') || 'index';
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  const u = currentUser();
  const badge = document.getElementById('user-badge');
  if (badge) {
    if (u) badge.textContent = u;
    badge.style.cursor = 'pointer';
    badge.title = 'Tippen um Namen zu ändern';
    badge.addEventListener('click', openNamePicker);
  }
});

// ── Road status (road.is / Vegagerðin) ──────────────────────────────────────
function roadCardHTML(variant) {
  const legend = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem .8rem;font-size:.75rem;margin-bottom:.85rem">
      <div style="display:flex;align-items:center;gap:.45rem"><span style="width:.65rem;height:.65rem;background:#5ade8a;border-radius:50%;flex-shrink:0"></span>Grün — befahrbar</div>
      <div style="display:flex;align-items:center;gap:.45rem"><span style="width:.65rem;height:.65rem;background:#f0c060;border-radius:50%;flex-shrink:0"></span>Gelb — Vorsicht</div>
      <div style="display:flex;align-items:center;gap:.45rem"><span style="width:.65rem;height:.65rem;background:#f08a3a;border-radius:50%;flex-shrink:0"></span>Orange — schwierig</div>
      <div style="display:flex;align-items:center;gap:.45rem"><span style="width:.65rem;height:.65rem;background:#f06060;border-radius:50%;flex-shrink:0"></span>Rot — gesperrt</div>
    </div>`;
  const note = variant === 'full'
    ? `<div style="font-size:.78rem;color:var(--muted);line-height:1.5;margin-bottom:.85rem">Vor jeder langen Fahrt road.is checken. Bei gelb+ Vorsicht, bei rot nicht fahren. F-Strassen sind oft erst ab Ende Juni befahrbar.</div>`
    : '';
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.7rem">
      <span style="font-weight:600;font-size:.95rem">🛣 Strassenstatus</span>
      <span id="road-live" style="display:none;font-size:.7rem;color:var(--ice);background:rgba(74,143,168,.15);border-radius:99px;padding:.15rem .55rem"></span>
    </div>
    ${note}
    ${legend}
    <a href="https://umferd.is/" target="_blank" rel="noopener" class="btn btn-secondary" style="text-decoration:none;width:100%;justify-content:center;font-size:.85rem">→ road.is öffnen</a>`;
}

async function tryLiveRoadStatus() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 3000);
  try {
    const res = await fetch('https://gagnaveita.vegagerdin.is/api/roadcondition', { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return;
    const data = await res.json();
    const el = document.getElementById('road-live');
    if (!el || !data) return;
    const segments = Array.isArray(data) ? data.length : (data.features?.length || null);
    if (segments) { el.textContent = `Live · ${segments} Strecken`; el.style.display = 'inline-block'; }
  } catch(e) { clearTimeout(t); /* silently keep static card */ }
}

// Shared nav HTML (top, centered)
function navHTML(activePage) {
  return `
  <div class="top-nav-wrap">
    <nav class="top-nav">
      <a class="nav-item${activePage==='index'?' active':''}" href="index.html" data-page="index">
        <span class="nav-icon">🏠</span><span>Übersicht</span>
      </a>
      <a class="nav-item${activePage==='aktivitaeten'?' active':''}" href="aktivitaeten.html" data-page="aktivitaeten">
        <span class="nav-icon">✅</span><span>Aktivitäten</span>
      </a>
      <a class="nav-item${activePage==='fahren'?' active':''}" href="fahren.html" data-page="fahren">
        <span class="nav-icon">🚗</span><span>Fahren</span>
      </a>
      <a class="nav-item" href="https://splid.net/j/4PCL5HT9L" target="_blank" rel="noopener">
        <span class="nav-icon">💸</span><span>Splid</span>
      </a>
    </nav>
  </div>`;
}

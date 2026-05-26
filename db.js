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

// Mark active nav item based on current page
document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop().replace('.html','') || 'index';
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // Restore user badge
  const u = currentUser();
  const badge = document.getElementById('user-badge');
  if (badge && u) badge.textContent = u;
});

// Shared nav HTML
function navHTML(activePage) {
  return `
  <nav class="bottom-nav">
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
  </nav>`;
}

/* script.js — HGAFMI Prophecies front-end (no backend)
   Features:
   - Visual login (no auth)
   - Prophecy storage in localStorage
   - Add prophecy side panel with HH:MM:SS fields
   - Render list and empty state handling
*/

(function () {
  // DOM elements
  const screenLogin = document.getElementById('screen-login');
  const screenProphecies = document.getElementById('screen-prophecies');

  const loginForm = document.getElementById('loginForm');
  const btnBackToLogin = document.getElementById('btn-back-to-login');

  const panel = document.getElementById('panel-add');
  const btnOpenAdd = document.getElementById('btn-open-add');
  const btnFabAdd = document.getElementById('fabAdd');
  const btnEmptyAdd = document.getElementById('btn-empty-add');
  const panelClose = document.getElementById('panel-close');
  const addForm = document.getElementById('addForm');
  const btnCancel = document.getElementById('btnCancel');
  const prophecyListEl = document.getElementById('prophecyList');
  const emptyState = document.getElementById('emptyState');
  const btnRefresh = document.getElementById('btn-refresh');

  const LS_KEY = 'hgafmi_prophecies_v1';

  // Utility: read localStorage
  function loadProphecies() {
    const raw = localStorage.getItem(LS_KEY);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to parse prophecies from storage', e);
      return [];
    }
  }

  // Utility: save localStorage
  function saveProphecies(list) {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  }

  // Render functions
  function renderList() {
    const list = loadProphecies();
    prophecyListEl.innerHTML = '';

    if (!list.length) {
      emptyState.classList.remove('d-none');
      return;
    }
    emptyState.classList.add('d-none');

    // Create cards
    list.slice().reverse().forEach((item, idx) => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4';

      const card = document.createElement('div');
      card.className = 'prophecy-card';
      card.setAttribute('data-aos', 'zoom-in');

      const title = document.createElement('div');
      title.className = 'card-title-small';
      title.textContent = item.title || 'Untitled';

      const meta = document.createElement('div');
      meta.className = 'prophecy-meta mt-1';
      meta.textContent = `${item.date || ''} • ${item.time || ''}`;

      const desc = document.createElement('div');
      desc.className = 'prophecy-desc mt-2';
      desc.textContent = item.desc || '';

      // action row
      const actions = document.createElement('div');
      actions.className = 'mt-3 d-flex justify-content-between align-items-center';

      const idStr = item.id || idx;
      const delBtn = document.createElement('button');
      delBtn.className = 'btn btn-outline-danger btn-sm';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', function () {
        if (!confirm('Delete this prophecy?')) return;
        deleteProphecy(idStr);
      });

      actions.appendChild(delBtn);

      card.appendChild(title);
      card.appendChild(meta);
      card.appendChild(desc);
      card.appendChild(actions);

      col.appendChild(card);
      prophecyListEl.appendChild(col);
    });

    // Re-init AOS refresh so newly added elements animate
    if (window.AOS) AOS.refresh();
  }

  // Delete by id (id stored when added)
  function deleteProphecy(id) {
    let list = loadProphecies();
    list = list.filter(item => String(item.id) !== String(id));
    saveProphecies(list);
    renderList();
  }

  // Open/close panel
  function openPanel() {
    panel.setAttribute('aria-hidden', 'false');
    // focus first input
    setTimeout(() => {
      const first = panel.querySelector('#propTitle');
      if (first) first.focus();
    }, 220);
  }
  function closePanel() {
    panel.setAttribute('aria-hidden', 'true');
    addForm.reset();
  }

  // Simple single-page navigation
  function showPropheciesScreen() {
    screenLogin.classList.add('d-none');
    screenProphecies.classList.remove('d-none');
    renderList();
  }
  function showLoginScreen() {
    screenLogin.classList.remove('d-none');
    screenProphecies.classList.add('d-none');
  }

  // Form handling: Add prophecy
  addForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // gather values
    const title = document.getElementById('propTitle').value.trim();
    const date = document.getElementById('propDate').value;
    let hh = (document.getElementById('timeHH').value || '').trim();
    let mm = (document.getElementById('timeMM').value || '').trim();
    let ss = (document.getElementById('timeSS').value || '').trim();
    const desc = document.getElementById('propDesc').value.trim();

    // basic validation
    if (!title || !date || desc.length < 3) {
      alert('Please fill Title, Date and full Prophecy text.');
      return;
    }

    // normalize time fields to two digits
    hh = String(Math.max(0, Math.min(parseInt(hh || '0', 10) || 0, 23))).padStart(2, '0');
    mm = String(Math.max(0, Math.min(parseInt(mm || '0', 10) || 0, 59))).padStart(2, '0');
    ss = String(Math.max(0, Math.min(parseInt(ss || '0', 10) || 0, 59))).padStart(2, '0');
    const time = `${hh}:${mm}:${ss}`;

    // create item
    const item = {
      id: Date.now(),
      title,
      date,
      time,
      desc
    };

    const list = loadProphecies();
    list.push(item);
    saveProphecies(list);

    closePanel();
    renderList();

    // scroll to top of list briefly so user sees newly added item (because we push then reverse)
    setTimeout(() => {
      const container = document.querySelector('#screen-prophecies .container');
      if (container) container.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  });

  // login: visual only
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    // visual login — immediately show prophecies screen
    showPropheciesScreen();
  });

  // nav & panel events
  btnOpenAdd.addEventListener('click', openPanel);
  btnFabAdd.addEventListener('click', openPanel);
  btnEmptyAdd.addEventListener('click', openPanel);
  panelClose.addEventListener('click', closePanel);
  btnCancel.addEventListener('click', closePanel);

  // back to login / logout (visual)
  btnBackToLogin.addEventListener('click', function () {
    if (!confirm('Logout and return to login screen?')) return;
    showLoginScreen();
  });

  const scanTextBtn = document.getElementById("scanTextBtn");

scanTextBtn.addEventListener("click", () => {
  alert("Scan Text feature coming soon!");
});


  // refresh button simply re-renders
  btnRefresh.addEventListener('click', function () { renderList(); });

  // keyboard: ESC closes panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const hidden = panel.getAttribute('aria-hidden');
      if (hidden === 'false') closePanel();
    }
  });


    // Optional: Automatically redirect once online
    window.addEventListener('online', () => {
      window.location.href = '/';
    });


  // initial render (if user reloads while logged out we show login)
  // but if there are items and user wants to jump directly to prophecies you can check here
  (function init(){
    // default: show login screen first (visual login)
    showLoginScreen();
    // Preload any existing list for debugging in console
    console.log('Loaded prophecies:', loadProphecies());
  }());

})();

const catClass = { Entertainment: 'cat-ent', Restaurants: 'cat-res', 'Spa & Beauty': 'cat-spa', 'Medical Checkups': 'cat-med' };
let currentUser = null;
let currentOffer = null;
let activeCategory = "All";

async function api(path, opts = {}) {
  const res = await fetch(path, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Something went wrong.');
  return json;
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function showNotice(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = 'inline-notice ' + (type === 'error' ? 'show-error' : 'show-success');
}
function clearNotice(id) {
  const el = document.getElementById(id);
  el.className = 'inline-notice';
  el.textContent = '';
}

/* ---------- Auth ---------- */
function setAuthTab(tab) {
  document.querySelectorAll('#authTabs button').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-authtab="${tab}"]`).classList.add('active');
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
}

async function refreshAuth() {
  const { user } = await api('/api/auth/me');
  currentUser = user;
  renderAuthArea();
}

function renderAuthArea() {
  const el = document.getElementById('authArea');
  const walletBtn = document.getElementById('walletNavBtn');
  const adminBtn = document.getElementById('adminNavBtn');
  if (currentUser) {
    el.innerHTML = `<span class="user-pill">Hi, ${currentUser.name.split(' ')[0]}</span><button onclick="doLogout()">Log out</button>`;
    walletBtn.style.display = 'inline-block';
    adminBtn.style.display = currentUser.isAdmin ? 'inline-block' : 'none';
  } else {
    el.innerHTML = `<button onclick="openModal('authModal')">Log in</button>`;
    walletBtn.style.display = 'none';
    adminBtn.style.display = 'none';
  }
}

async function doLogin() {
  clearNotice('loginNotice');
  try {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const { user } = await api('/api/auth/login', { method: 'POST', body: { email, password } });
    currentUser = user;
    renderAuthArea();
    closeModal('authModal');
    if (user.isAdmin) switchView('admin'); else switchView('customer');
  } catch (e) {
    showNotice('loginNotice', e.message, 'error');
  }
}

async function doRegister() {
  clearNotice('registerNotice');
  try {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    if (!name || !email || !password) { showNotice('registerNotice', 'Fill in name, email and password.', 'error'); return; }
    const { user } = await api('/api/auth/register', { method: 'POST', body: { name, email, phone, password } });
    currentUser = user;
    renderAuthArea();
    closeModal('authModal');
  } catch (e) {
    showNotice('registerNotice', e.message, 'error');
  }
}

async function doLogout() {
  await api('/api/auth/logout', { method: 'POST' });
  currentUser = null;
  renderAuthArea();
  switchView('customer');
}

/* ---------- Nav ---------- */
function switchView(view) {
  document.querySelectorAll('.topnav button').forEach(b => b.classList.remove('active'));
  const navBtn = document.querySelector(`.topnav [data-view="${view}"]`);
  if (navBtn) navBtn.classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  if (view === 'wallet') renderWallet();
  if (view === 'admin') renderAdmin();
}

document.getElementById('topnav').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const view = btn.dataset.view;
  if ((view === 'wallet' || view === 'admin') && !currentUser) {
    openModal('authModal');
    return;
  }
  switchView(view);
});

/* ---------- Offers ---------- */
function renderChips() {
  const el = document.getElementById('categoryChips');
  const cats = ["All", "Entertainment", "Restaurants", "Spa & Beauty", "Medical Checkups"];
  el.innerHTML = cats.map(c => `<button class="chip ${c === activeCategory ? 'active' : ''}" onclick="setCategory('${c}')">${c}</button>`).join('');
}

function setCategory(c) { activeCategory = c; renderChips(); renderOffers(); }

async function renderOffers() {
  const search = document.getElementById('searchInput').value;
  const params = new URLSearchParams();
  if (activeCategory !== 'All') params.set('category', activeCategory);
  if (search) params.set('search', search);
  const { offers } = await api('/api/offers?' + params.toString());
  const grid = document.getElementById('offerGrid');
  if (offers.length === 0) { grid.innerHTML = `<div class="empty">No offers match your search.</div>`; return; }
  window.__offersCache = offers;
  grid.innerHTML = offers.map(o => {
    const pct = Math.round((1 - o.price / o.original) * 100);
    return `
    <div class="offer-card">
      <div class="offer-thumb ${catClass[o.category] || ''}"><span class="thumb-badge">${o.merchantInitials || '??'}</span></div>
      <div class="offer-body">
        <div class="offer-cat">${o.category}</div>
        <div class="offer-title">${o.title}</div>
        <div class="offer-merchant">${o.merchantName}</div>
        <div class="offer-price-row">
          <span class="price-now">$${o.price}</span>
          <span class="price-was">$${o.original}</span>
          <span class="discount-badge">${pct}% off</span>
        </div>
        <button class="view-btn" onclick="openOffer(${o.id})">View offer</button>
      </div>
    </div>`;
  }).join('');
}

function openOffer(id) {
  currentOffer = window.__offersCache.find(o => o.id === id);
  const pct = Math.round((1 - currentOffer.price / currentOffer.original) * 100);
  document.getElementById('offerModalBody').innerHTML = `
    <div class="offer-cat">${currentOffer.category}</div>
    <h3>${currentOffer.title}</h3>
    <div class="offer-merchant">${currentOffer.merchantName}</div>
    <div class="offer-price-row" style="margin:14px 0;">
      <span class="price-now" style="font-size:24px;">$${currentOffer.price}</span>
      <span class="price-was">$${currentOffer.original}</span>
      <span class="discount-badge">${pct}% off</span>
    </div>
    <div class="terms-box"><strong>Terms:</strong> ${currentOffer.terms}</div>
    <div class="btn-row">
      <button class="btn btn-primary" style="flex:1;" onclick="startPurchase()">Buy for myself</button>
      <button class="btn btn-secondary" style="flex:1;" onclick="startGift()">Send as gift</button>
    </div>
  `;
  openModal('offerModal');
}

function startPurchase() {
  if (!currentUser) { closeModal('offerModal'); openModal('authModal'); return; }
  closeModal('offerModal');
  document.getElementById('purchaseSummary').innerHTML = `<strong>${currentOffer.title}</strong> — $${currentOffer.price}`;
  openModal('purchaseModal');
}

function startGift() {
  if (!currentUser) { closeModal('offerModal'); openModal('authModal'); return; }
  closeModal('offerModal');
  document.getElementById('giftSummary').innerHTML = `<strong>${currentOffer.title}</strong> — $${currentOffer.price}`;
  document.getElementById('giftContact').value = '';
  clearNotice('giftNotice');
  openModal('giftModal');
}

async function completePurchase() {
  try {
    await api('/api/vouchers/purchase', { method: 'POST', body: { offerId: currentOffer.id } });
    closeModal('purchaseModal');
    renderOffers();
    alert('Payment confirmed. Check "My vouchers" for your code.');
  } catch (e) {
    alert(e.message);
  }
}

async function completeGift() {
  clearNotice('giftNotice');
  const recipientContact = document.getElementById('giftContact').value.trim();
  const message = document.getElementById('giftMessage').value.trim();
  try {
    const { recipientName } = await api('/api/vouchers/gift', { method: 'POST', body: { offerId: currentOffer.id, recipientContact, message } });
    closeModal('giftModal');
    renderOffers();
    alert(`Gift sent to ${recipientName}.`);
  } catch (e) {
    showNotice('giftNotice', e.message, 'error');
  }
}

/* ---------- Wallet ---------- */
async function renderWallet() {
  const { vouchers } = await api('/api/vouchers/mine');
  const el = document.getElementById('walletList');
  if (vouchers.length === 0) { el.innerHTML = `<div class="empty">No vouchers yet. Buy an offer to see it here.</div>`; return; }
  el.innerHTML = vouchers.map(v => `
    <div class="voucher-card">
      <div class="voucher-left">
        <h4>${v.offerTitle}${v.giftedTo ? ' <span style="font-weight:400;color:var(--muted);font-size:12px;">(gift)</span>' : ''}</h4>
        <div class="voucher-meta">${v.merchantName} &middot; $${v.price} &middot; <span class="voucher-code">${v.code}</span></div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="status-pill status-${v.status}">${v.status}</span>
        ${v.status === 'active' ? `<button class="btn btn-secondary" onclick="showQR('${v.code}', ${JSON.stringify(v.offerTitle)})">Show QR</button>` : ''}
      </div>
    </div>
  `).join('');
}

function showQR(code, title) {
  document.getElementById('qrTitle').textContent = title;
  document.getElementById('qrCode').textContent = code;
  const pattern = document.getElementById('qrPattern');
  pattern.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('span');
    cell.style.background = Math.random() > 0.42 ? '#F7F1E4' : '#16241F';
    pattern.appendChild(cell);
  }
  openModal('qrModal');
}

/* ---------- Merchant redeem ---------- */
async function redeemVoucher() {
  const input = document.getElementById('redeemInput');
  try {
    const { voucher } = await api('/api/vouchers/redeem', { method: 'POST', body: { code: input.value } });
    showNotice('redeemNotice', `Voucher ${voucher.code} redeemed successfully for "${voucher.offerTitle}".`, 'success');
    input.value = '';
  } catch (e) {
    showNotice('redeemNotice', e.message, 'error');
  }
}

/* ---------- Admin ---------- */
async function renderAdmin() {
  const stats = await api('/api/admin/stats');
  document.getElementById('aGMV').textContent = '$' + stats.gmv;
  document.getElementById('aMerchants').textContent = stats.merchants;
  document.getElementById('aVouchers').textContent = stats.soldCount;
  document.getElementById('aRedeemed').textContent = stats.redeemed;

  const { merchants } = await api('/api/admin/merchants');
  document.getElementById('adminMerchantTable').innerHTML = merchants.map(m =>
    `<tr><td>${m.name}</td><td>${m.category}</td><td>${m.contact}</td></tr>`
  ).join('') || `<tr><td colspan="3" class="empty">No merchants yet.</td></tr>`;

  const { offers } = await api('/api/admin/offers');
  document.getElementById('adminOfferTable').innerHTML = offers.map(o => `
    <tr>
      <td>${o.title}</td><td>${o.merchantName}</td><td>$${o.price}</td><td>${o.sold}</td><td>${o.status}</td>
      <td><button class="row-btn" onclick="toggleOfferStatus(${o.id})">${o.status === 'Live' ? 'Pause' : 'Resume'}</button></td>
    </tr>
  `).join('') || `<tr><td colspan="6" class="empty">No offers yet.</td></tr>`;
}

async function toggleOfferStatus(id) {
  await api(`/api/admin/offers/${id}/toggle`, { method: 'PATCH' });
  renderAdmin();
}

async function createMerchant() {
  clearNotice('merchantNotice');
  const name = document.getElementById('nmName').value.trim();
  const category = document.getElementById('nmCategory').value;
  const contact = document.getElementById('nmContact').value.trim();
  try {
    await api('/api/admin/merchants', { method: 'POST', body: { name, category, contact } });
    document.getElementById('nmName').value = '';
    document.getElementById('nmContact').value = '';
    closeModal('newMerchantModal');
    renderAdmin();
  } catch (e) {
    showNotice('merchantNotice', e.message, 'error');
  }
}

async function openNewOfferModal() {
  const { merchants } = await api('/api/admin/merchants');
  document.getElementById('noMerchant').innerHTML = merchants.map(m => `<option value="${m.id}">${m.name} (${m.category})</option>`).join('');
  openModal('newOfferModal');
}

async function createOfferAdmin() {
  clearNotice('offerNotice');
  const merchantId = document.getElementById('noMerchant').value;
  const title = document.getElementById('noTitle').value.trim();
  const original = document.getElementById('noOriginal').value;
  const price = document.getElementById('noPrice').value;
  const terms = document.getElementById('noTerms').value.trim();
  try {
    await api('/api/admin/offers', { method: 'POST', body: { merchantId, title, original, price, terms } });
    ['noTitle', 'noOriginal', 'noPrice', 'noTerms'].forEach(id => document.getElementById(id).value = '');
    closeModal('newOfferModal');
    renderAdmin();
    renderOffers();
  } catch (e) {
    showNotice('offerNotice', e.message, 'error');
  }
}

document.getElementById('searchInput').addEventListener('keyup', renderOffers);

/* ---------- Init ---------- */
(async function init() {
  await refreshAuth();
  renderChips();
  renderOffers();
})();

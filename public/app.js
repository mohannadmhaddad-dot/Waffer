const countryCodes = [
  ['+961','Lebanon'],['+965','Kuwait'],['+966','Saudi Arabia'],['+971','UAE'],['+974','Qatar'],
  ['+973','Bahrain'],['+968','Oman'],['+962','Jordan'],['+20','Egypt'],['+1','US/Canada'],
  ['+44','UK'],['+33','France'],['+49','Germany'],['+90','Turkey'],['+91','India'],
  ['+61','Australia'],['+81','Japan'],['+86','China'],['+7','Russia'],['+27','South Africa'],
  ['+55','Brazil'],['+52','Mexico'],['+34','Spain'],['+39','Italy'],['+31','Netherlands']
];

const catIcons = {
  'Entertainment': '<svg class="thumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8h16M4 8v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8M4 8l2-4h3l-2 4m4 0l2-4h3l-2 4m4 0l2-4h2l-2 4"/></svg>',
  'Restaurants': '<svg class="thumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 3v7a2 2 0 0 0 4 0V3M9 10v11M17 3c-1.5 0-3 1.5-3 4s1.5 4 3 4v10"/></svg>',
  'Spa & Beauty': '<svg class="thumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21c4-2 7-6 7-11a7 7 0 0 0-7-4 7 7 0 0 0-7 4c0 5 3 9 7 11z"/><path d="M12 21V8"/></svg>',
  'Medical Checkups': '<svg class="thumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v18M3 12h18" stroke-linecap="round"/></svg>'
};
const defaultCatIcon = '<svg class="thumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l2.5 6.5L21 9l-5 4.5 1.5 7L12 17l-5.5 3.5L8 13.5 3 9l6.5-0.5L12 2z"/></svg>';

let allCategories = [];

let currentUser = null;
let currentMerchant = null;
let currentOffer = null;
let activeCategory = "All";
let purchaseQty = 1;

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

function esc(s) { return String(s == null ? '' : s).replace(/'/g, "\\'").replace(/"/g, '&quot;'); }

function toast(msg, type) {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast ' + (type === 'error' ? 'toast-error' : type === 'success' ? 'toast-success' : '');
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 4200);
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

function fmtDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ---------- Customer auth ---------- */
function setAuthTab(tab) {
  document.querySelectorAll('#authTabs button').forEach(b => b.classList.remove('active'));
  const tabBtn = document.querySelector(`[data-authtab="${tab}"]`);
  if (tabBtn) tabBtn.classList.add('active');
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('forgotForm').style.display = 'none';
}

function showForgotForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('forgotForm').style.display = 'block';
  document.querySelectorAll('#authTabs button').forEach(b => b.classList.remove('active'));
}

async function doForgotPassword() {
  clearNotice('forgotNotice');
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email) { showNotice('forgotNotice', 'Enter your email.', 'error'); return; }
  try {
    const { message } = await api('/api/auth/forgot-password', { method: 'POST', body: { email } });
    showNotice('forgotNotice', message, 'success');
  } catch (e) {
    showNotice('forgotNotice', e.message, 'error');
  }
}

async function doResetPassword() {
  clearNotice('resetNotice');
  const token = window.__resetToken;
  const newPassword = document.getElementById('resetNewPassword').value;
  if (!newPassword || newPassword.length < 6) { showNotice('resetNotice', 'Enter a new password (at least 6 characters).', 'error'); return; }
  try {
    await api('/api/auth/reset-password', { method: 'POST', body: { token, newPassword } });
    closeModal('resetPasswordModal');
    toast('Password updated. You can log in with your new password now.', 'success');
    openModal('authModal');
    setAuthTab('login');
    history.replaceState({}, '', location.pathname);
  } catch (e) {
    showNotice('resetNotice', e.message, 'error');
  }
}

function populateCountryCodes() {
  const sel = document.getElementById('regCountryCode');
  sel.innerHTML = countryCodes.map(([code, name]) => `<option value="${code}">${code} ${name}</option>`).join('');
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
  const banner = document.getElementById('verifyBanner');
  if (currentUser) {
    el.innerHTML = `<button class="user-pill-btn" onclick="openProfile()">Hi, ${currentUser.name.split(' ')[0]}</button><button onclick="doLogout()">Log out</button>`;
    walletBtn.style.display = 'inline-block';
    adminBtn.style.display = currentUser.isAdmin ? 'inline-block' : 'none';
    banner.style.display = (!currentUser.emailVerified && !currentUser.isAdmin) ? 'block' : 'none';
  } else {
    el.innerHTML = `<button onclick="openModal('authModal')">Log in</button>`;
    walletBtn.style.display = 'none';
    adminBtn.style.display = 'none';
    banner.style.display = 'none';
  }
}

async function resendVerification() {
  try {
    const { message } = await api('/api/auth/resend-verification', { method: 'POST' });
    toast(message, 'success');
  } catch (e) {
    toast(e.message, 'error');
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
    const countryCode = document.getElementById('regCountryCode').value;
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    if (!name || !email || !phone || !password) { showNotice('registerNotice', 'Fill in name, email, mobile number and password.', 'error'); return; }
    const { user, claimedGifts } = await api('/api/auth/register', { method: 'POST', body: { name, email, phone, countryCode, password } });
    currentUser = user;
    renderAuthArea();
    closeModal('authModal');
    if (claimedGifts > 0) {
      toast(`Welcome! You had ${claimedGifts} gift voucher${claimedGifts > 1 ? 's' : ''} waiting for you — check "My vouchers".`, 'success');
    } else {
      toast('Account created. Check your email to verify your address.', 'success');
    }
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

/* ---------- Profile ---------- */
function openProfile() {
  document.getElementById('profName').value = currentUser.name || '';
  document.getElementById('profEmail').value = currentUser.email || '';
  document.getElementById('profPhone').value = currentUser.phone || '';
  document.getElementById('profGender').value = currentUser.gender || '';
  document.getElementById('profBirthday').value = currentUser.birthday || '';
  clearNotice('profileNotice');
  openModal('profileModal');
}

async function saveProfile() {
  clearNotice('profileNotice');
  const name = document.getElementById('profName').value.trim();
  const phone = document.getElementById('profPhone').value.trim();
  const gender = document.getElementById('profGender').value;
  const birthday = document.getElementById('profBirthday').value;
  try {
    const { user } = await api('/api/auth/profile', { method: 'PATCH', body: { name, phone, gender, birthday } });
    currentUser = user;
    renderAuthArea();
    showNotice('profileNotice', 'Saved.', 'success');
  } catch (e) {
    showNotice('profileNotice', e.message, 'error');
  }
}

async function changeMyPassword() {
  clearNotice('passwordNotice');
  const currentPassword = document.getElementById('profCurrentPassword').value;
  const newPassword = document.getElementById('profNewPassword').value;
  try {
    await api('/api/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } });
    document.getElementById('profCurrentPassword').value = '';
    document.getElementById('profNewPassword').value = '';
    showNotice('passwordNotice', 'Password updated.', 'success');
  } catch (e) {
    showNotice('passwordNotice', e.message, 'error');
  }
}

/* ---------- Merchant auth ---------- */
async function refreshMerchantAuth() {
  const { merchant } = await api('/api/merchant/me');
  currentMerchant = merchant;
  renderMerchantArea();
}

function renderMerchantArea() {
  const loggedOut = document.getElementById('merchantLoggedOut');
  const loggedIn = document.getElementById('merchantLoggedIn');
  const merchantNavBtn = document.getElementById('merchantNavBtn');
  const customerNavBtn = document.getElementById('customerNavBtn');
  const merchantAuthArea = document.getElementById('merchantAuthArea');

  if (currentMerchant) {
    loggedOut.style.display = 'none';
    loggedIn.style.display = 'block';
    merchantNavBtn.style.display = 'inline-block';
    customerNavBtn.style.display = 'none';
    document.getElementById('walletNavBtn').style.display = 'none';
    merchantAuthArea.innerHTML = `<span class="merchant-badge">${currentMerchant.merchantName}${currentMerchant.location ? ' — ' + currentMerchant.location : ''}</span>`;
    if (currentMerchant.role === 'manager') {
      renderManagerDashboard();
    } else {
      renderFrontDeskView();
    }
    const activeView = document.querySelector('.view.active');
    if (activeView && activeView.id === 'view-customer') switchView('merchant');
  } else {
    loggedOut.style.display = 'block';
    loggedIn.style.display = 'none';
    merchantNavBtn.style.display = 'none';
    customerNavBtn.style.display = 'inline-block';
    merchantAuthArea.innerHTML = `<button class="merchant-login-link" onclick="switchView('merchant')">Merchant login</button>`;
  }
}

function renderFrontDeskView() {
  const el = document.getElementById('merchantLoggedInContent');
  el.innerHTML = `
    <h2>${currentMerchant.merchantName}</h2>
    <p class="note" style="margin-bottom:20px;">Front desk account — ${currentMerchant.location || 'this branch'}. You can look up and redeem vouchers. Sales figures aren't shown here.</p>
    <div class="panel">
      <h3 style="margin-bottom:14px;">Look up a voucher</h3>
      <div class="two-col">
        <div class="field" style="margin-bottom:0;"><label>Voucher code</label><input id="lookupInput" placeholder="e.g. WQ-8F2K91" /></div>
        <div style="display:flex;align-items:flex-end;"><button class="btn btn-secondary" style="height:41px;" onclick="lookupVoucher()">Check</button></div>
      </div>
      <div id="lookupResult"></div>
    </div>
    <div class="panel">
      <h3 style="margin-bottom:14px;">Redeem a voucher</h3>
      <div class="two-col">
        <div class="field" style="margin-bottom:0;"><label>Voucher code</label><input id="redeemInput" placeholder="e.g. WQ-8F2K91" /></div>
        <div style="display:flex;align-items:flex-end;"><button class="btn btn-primary" style="height:41px;" onclick="redeemVoucher()">Verify &amp; redeem</button></div>
      </div>
      <div class="inline-notice" id="redeemNotice"></div>
    </div>
  `;
}

async function lookupVoucher() {
  const code = document.getElementById('lookupInput').value.trim();
  const resultEl = document.getElementById('lookupResult');
  if (!code) return;
  try {
    const { voucher } = await api('/api/merchant/voucher-lookup?code=' + encodeURIComponent(code));
    resultEl.innerHTML = `
      <div class="inline-notice show-success">
        <strong>${voucher.offerTitle}</strong> &middot; $${voucher.price}<br/>
        Status: <span class="status-pill status-${voucher.status}">${voucher.status}</span> &middot; Valid until: ${voucher.expiryDate || 'no expiry set'}
      </div>`;
  } catch (e) {
    resultEl.innerHTML = `<div class="inline-notice show-error">${e.message}</div>`;
  }
}

function renderManagerDashboard() {
  const el = document.getElementById('merchantLoggedInContent');
  el.innerHTML = `
    <h2>${currentMerchant.merchantName} — Dashboard</h2>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-label">Vouchers sold</div><div class="stat-value" id="mdSold">0</div></div>
      <div class="stat-card"><div class="stat-label">Redeemed</div><div class="stat-value" id="mdRedeemed">0</div></div>
      <div class="stat-card"><div class="stat-label">Sales volume</div><div class="stat-value" id="mdRevenue">$0</div></div>
      <div class="stat-card"><div class="stat-label">Your payout</div><div class="stat-value" id="mdPayout">$0</div></div>
    </div>
    <p class="note" id="mdCommissionNote" style="margin-bottom:20px;"></p>
    <div class="panel">
      <h3 style="margin-bottom:14px;">Your offers</h3>
      <table><thead><tr><th>Offer</th><th>Status</th><th>Sold</th><th>Redeemed</th><th>Revenue</th></tr></thead><tbody id="mdOffersTable"></tbody></table>
    </div>
    <div class="panel">
      <h3 style="margin-bottom:14px;">Recent sales</h3>
      <table><thead><tr><th>Voucher</th><th>Buyer</th><th>Price</th><th>Status</th><th>Date</th></tr></thead><tbody id="mdRecentTable"></tbody></table>
    </div>
    <div class="panel">
      <h3 style="margin-bottom:14px;">Redeem a voucher</h3>
      <div class="two-col">
        <div class="field" style="margin-bottom:0;"><label>Voucher code</label><input id="redeemInput" placeholder="e.g. WQ-8F2K91" /></div>
        <div style="display:flex;align-items:flex-end;"><button class="btn btn-primary" style="height:41px;" onclick="redeemVoucher()">Verify &amp; redeem</button></div>
      </div>
      <div class="inline-notice" id="redeemNotice"></div>
    </div>
  `;
  loadMerchantDashboard();
}

async function loadMerchantDashboard() {
  try {
    const d = await api('/api/merchant/dashboard');
    document.getElementById('mdSold').textContent = d.sold;
    document.getElementById('mdRedeemed').textContent = d.redeemed;
    document.getElementById('mdRevenue').textContent = '$' + d.revenue;
    document.getElementById('mdPayout').textContent = '$' + d.payout;
    document.getElementById('mdCommissionNote').textContent = `Waffer commission (${Math.round(d.commissionRate * 100)}%): $${d.commission} deducted from sales volume.`;
    document.getElementById('mdOffersTable').innerHTML = d.offers.map(o =>
      `<tr><td>${o.title}</td><td>${o.status}</td><td>${o.sold}</td><td>${o.redeemed}</td><td>$${o.revenue}</td></tr>`
    ).join('') || `<tr><td colspan="5" class="empty">No offers yet.</td></tr>`;
    document.getElementById('mdRecentTable').innerHTML = d.recent.map(v =>
      `<tr><td class="voucher-code">${v.code}</td><td>${v.buyerName}</td><td>$${v.price}</td><td><span class="status-pill status-${v.status}">${v.status}</span></td><td>${fmtDate(v.createdAt)}</td></tr>`
    ).join('') || `<tr><td colspan="5" class="empty">No sales yet.</td></tr>`;
  } catch (e) {
    console.log('dashboard load failed', e.message);
  }
}

async function doMerchantLogin() {
  clearNotice('merLoginNotice');
  try {
    const username = document.getElementById('merUsername').value.trim();
    const password = document.getElementById('merPassword').value;
    const { merchant } = await api('/api/merchant/login', { method: 'POST', body: { username, password } });
    currentMerchant = merchant;
    renderMerchantArea();
  } catch (e) {
    showNotice('merLoginNotice', e.message, 'error');
  }
}

async function doMerchantLogout() {
  await api('/api/merchant/logout', { method: 'POST' });
  currentMerchant = null;
  renderMerchantArea();
  switchView('customer');
}

async function changeMerchantPassword() {
  clearNotice('merPasswordNotice');
  const currentPassword = document.getElementById('merCurrentPassword').value;
  const newPassword = document.getElementById('merNewPassword').value;
  try {
    await api('/api/merchant/change-password', { method: 'POST', body: { currentPassword, newPassword } });
    document.getElementById('merCurrentPassword').value = '';
    document.getElementById('merNewPassword').value = '';
    showNotice('merPasswordNotice', 'Password updated.', 'success');
  } catch (e) {
    showNotice('merPasswordNotice', e.message, 'error');
  }
}

/* ---------- Nav ---------- */
function switchView(view) {
  if (currentMerchant && (view === 'customer' || view === 'wallet')) {
    view = 'merchant';
  }
  document.querySelectorAll('.topnav button').forEach(b => b.classList.remove('active'));
  const navBtn = document.querySelector(`.topnav [data-view="${view}"]`);
  if (navBtn) navBtn.classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (view === 'wallet') renderWallet();
  if (view === 'admin') renderAdmin();
  if (view === 'merchant') renderMerchantArea();
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

/* ---------- AI offer finder ---------- */
async function askAI() {
  const input = document.getElementById('aiQuery');
  const resultEl = document.getElementById('aiResult');
  const query = input.value.trim();
  if (!query) return;
  resultEl.innerHTML = `<div class="ai-result">Thinking...</div>`;
  try {
    const { offerId, message } = await api('/api/ai/recommend', { method: 'POST', body: { query } });
    if (offerId) {
      resultEl.innerHTML = `<div class="ai-result"><span>${message}</span><button class="btn btn-secondary" onclick="openOfferById(${offerId})">View this offer</button></div>`;
    } else {
      resultEl.innerHTML = `<div class="ai-result">${message}</div>`;
    }
  } catch (e) {
    resultEl.innerHTML = `<div class="ai-result ai-error">${e.message}</div>`;
  }
}

async function openOfferById(id) {
  if (!window.__offersCache || !window.__offersCache.find(o => o.id === id)) {
    await renderOffers();
  }
  const found = (window.__offersCache || []).find(o => o.id === id);
  if (found) openOffer(id);
}

/* ---------- Offers ---------- */
async function loadCategories() {
  const { categories } = await api('/api/categories');
  allCategories = categories;
}

function renderChips() {
  const el = document.getElementById('categoryChips');
  const cats = ["All", ...allCategories];
  el.innerHTML = cats.map(c => `<button class="chip ${c === activeCategory ? 'active' : ''}" onclick="setCategory('${c}')">${c}</button>`).join('');
}

function setCategory(c) { activeCategory = c; renderChips(); renderOffers(); }

function thumbContent(o) {
  if (o.imageUrl) {
    return `<img class="offer-photo" src="${o.imageUrl}" alt="${o.title}" />`;
  }
  if (o.merchantLogoUrl) {
    return `<img class="merchant-logo" src="${o.merchantLogoUrl}" alt="${o.merchantName} logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><span class="thumb-badge" style="display:none;">${o.merchantInitials || '??'}</span>`;
  }
  return `${catIcons[o.category] || defaultCatIcon}<span class="thumb-badge">${o.merchantInitials || '??'}</span>`;
}

function starString(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function ratingRow(o) {
  if (!o.reviewCount) return `<span class="rating-row">No reviews yet</span>`;
  return `<span class="rating-row"><span class="stars">${starString(o.avgRating)}</span> ${o.avgRating} (${o.reviewCount})</span>`;
}

async function renderOffers() {
  const search = document.getElementById('searchInput').value;
  const params = new URLSearchParams();
  if (activeCategory !== 'All') params.set('category', activeCategory);
  if (search) params.set('search', search);
  const minPrice = document.getElementById('minPrice').value;
  const maxPrice = document.getElementById('maxPrice').value;
  const sort = document.getElementById('sortSelect').value;
  if (minPrice) params.set('minPrice', minPrice);
  if (maxPrice) params.set('maxPrice', maxPrice);
  if (sort) params.set('sort', sort);
  const { offers } = await api('/api/offers?' + params.toString());
  const grid = document.getElementById('offerGrid');
  if (offers.length === 0) { grid.innerHTML = `<div class="empty">No offers match your search.</div>`; return; }
  window.__offersCache = offers;
  grid.innerHTML = offers.map(o => {
    const pct = Math.round((1 - o.price / o.original) * 100);
    return `
    <div class="offer-card">
      <div class="offer-thumb">${thumbContent(o)}</div>
      <div class="offer-body">
        <div class="offer-cat">${o.category}</div>
        <div class="offer-title">${o.title}</div>
        <div class="offer-merchant">${o.merchantName}</div>
        ${ratingRow(o)}
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
  purchaseQty = 1;
  const pct = Math.round((1 - currentOffer.price / currentOffer.original) * 100);
  document.getElementById('offerModalBody').innerHTML = `
    ${currentOffer.imageUrl ? `<img class="offer-hero-img" src="${currentOffer.imageUrl}" alt="${currentOffer.title}" />` : ''}
    <div class="offer-cat">${currentOffer.category}</div>
    <h3>${currentOffer.title}</h3>
    <div class="offer-merchant">${currentOffer.merchantName}</div>
    ${ratingRow(currentOffer)}
    <div class="offer-price-row" style="margin:14px 0;">
      <span class="price-now" style="font-size:24px;">$${currentOffer.price}</span>
      <span class="price-was">$${currentOffer.original}</span>
      <span class="discount-badge">${pct}% off</span>
    </div>
    <div class="terms-box"><strong>Terms:</strong> ${currentOffer.terms}</div>
    <div class="qty-row">
      <label>Quantity</label>
      <div class="qty-stepper">
        <button onclick="changeQty(-1)">−</button>
        <span id="qtyValue">1</span>
        <button onclick="changeQty(1)">+</button>
      </div>
      <span class="qty-total">Total: $<span id="qtyTotal">${currentOffer.price}</span></span>
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" style="flex:1;" onclick="startPurchase()">Buy for myself</button>
      <button class="btn btn-secondary" style="flex:1;" onclick="startGift()">Send as gift</button>
    </div>
    <hr class="modal-divider" />
    <h3 style="font-size:15px;">Reviews</h3>
    <div id="reviewsList">Loading...</div>
    ${currentUser ? `
      <div style="margin-top:14px;">
        <div class="field"><label>Your rating</label>
          <select id="reviewRating"><option value="5">★★★★★ (5)</option><option value="4">★★★★☆ (4)</option><option value="3">★★★☆☆ (3)</option><option value="2">★★☆☆☆ (2)</option><option value="1">★☆☆☆☆ (1)</option></select>
        </div>
        <div class="field"><label>Comment (optional)</label><textarea id="reviewComment" placeholder="How was it?"></textarea></div>
        <div class="inline-notice" id="reviewNotice"></div>
        <button class="btn btn-secondary" onclick="submitReview(${id})">Submit review</button>
        <p class="note">You can only review offers you've actually redeemed.</p>
      </div>
    ` : ''}
  `;
  openModal('offerModal');
  loadReviews(id);
}

async function loadReviews(offerId) {
  try {
    const { reviews } = await api(`/api/offers/${offerId}/reviews`);
    const el = document.getElementById('reviewsList');
    if (!el) return;
    el.innerHTML = reviews.length === 0 ? `<div class="empty">No reviews yet.</div>` : reviews.map(r => `
      <div class="review-item">
        <span class="review-stars">${starString(r.rating)}</span>
        ${r.comment ? `<div>${r.comment}</div>` : ''}
        <div class="review-meta">${r.userName} &middot; ${fmtDate(r.createdAt)}</div>
      </div>
    `).join('');
  } catch (e) { /* ignore */ }
}

async function submitReview(offerId) {
  clearNotice('reviewNotice');
  const rating = document.getElementById('reviewRating').value;
  const comment = document.getElementById('reviewComment').value.trim();
  try {
    await api(`/api/offers/${offerId}/reviews`, { method: 'POST', body: { rating, comment } });
    toast('Review posted. Thanks!', 'success');
    document.getElementById('reviewComment').value = '';
    loadReviews(offerId);
    renderOffers();
  } catch (e) {
    showNotice('reviewNotice', e.message, 'error');
  }
}

function changeQty(delta) {
  purchaseQty = Math.max(1, Math.min(20, purchaseQty + delta));
  document.getElementById('qtyValue').textContent = purchaseQty;
  document.getElementById('qtyTotal').textContent = (currentOffer.price * purchaseQty).toFixed(2).replace(/\.00$/, '');
}

function startPurchase() {
  if (!currentUser) { closeModal('offerModal'); openModal('authModal'); return; }
  closeModal('offerModal');
  const total = (currentOffer.price * purchaseQty).toFixed(2).replace(/\.00$/, '');
  document.getElementById('purchaseSummary').innerHTML = `<strong>${currentOffer.title}</strong> — ${purchaseQty} × $${currentOffer.price} = $${total}`;
  openModal('purchaseModal');
}

function startGift() {
  if (!currentUser) { closeModal('offerModal'); openModal('authModal'); return; }
  closeModal('offerModal');
  document.getElementById('giftSummary').innerHTML = `<strong>${currentOffer.title}</strong> — $${currentOffer.price}`;
  document.getElementById('giftEmail').value = '';
  document.getElementById('giftPhone').value = '';
  document.getElementById('giftMessage').value = '';
  clearNotice('giftNotice');
  openModal('giftModal');
}

async function completePurchase() {
  try {
    const { vouchers, total } = await api('/api/vouchers/purchase', { method: 'POST', body: { offerId: currentOffer.id, quantity: purchaseQty } });
    closeModal('purchaseModal');
    renderOffers();
    document.getElementById('purchaseSuccessSummary').textContent = `${currentOffer.title} — $${total} total. A receipt has been emailed to you.`;
    document.getElementById('purchaseSuccessCodes').innerHTML = vouchers.map(v => `<div class="purchase-code-row">${v.code}</div>`).join('');
    openModal('purchaseSuccessModal');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function completeGift() {
  clearNotice('giftNotice');
  const recipientEmail = document.getElementById('giftEmail').value.trim();
  const recipientPhone = document.getElementById('giftPhone').value.trim();
  const message = document.getElementById('giftMessage').value.trim();
  if (!recipientEmail && !recipientPhone) {
    showNotice('giftNotice', "Enter the recipient's email or phone number.", 'error');
    return;
  }
  try {
    const { claimed, recipientName } = await api('/api/vouchers/gift', { method: 'POST', body: { offerId: currentOffer.id, recipientEmail, recipientPhone, message } });
    closeModal('giftModal');
    renderOffers();
    if (claimed) {
      toast(`Gift sent to ${recipientName}.`, 'success');
    } else {
      toast(`Gift sent! They don't have a Waffer account yet, so we've emailed them to sign up and claim their voucher.`, 'success');
    }
  } catch (e) {
    showNotice('giftNotice', e.message, 'error');
  }
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function expiryBadge(v) {
  if (v.status !== 'active' || !v.expiryDate) return '';
  const days = daysUntil(v.expiryDate);
  if (days == null || days > 14) return '';
  if (days < 0) return `<span class="expiry-badge urgent">Expired</span>`;
  return `<span class="expiry-badge ${days <= 3 ? 'urgent' : ''}">Expires in ${days} day${days === 1 ? '' : 's'}</span>`;
}

/* ---------- Wallet ---------- */
async function renderWallet() {
  const { vouchers } = await api('/api/vouchers/mine');
  const el = document.getElementById('walletList');
  if (vouchers.length === 0) { el.innerHTML = `<div class="empty">No vouchers yet. Buy an offer to see it here.</div>`; }
  else {
    el.innerHTML = vouchers.map(v => `
      <div class="voucher-card">
        <div class="voucher-left">
          <h4>${v.offerTitle}${v.giftedTo ? ' <span style="font-weight:400;color:var(--muted);font-size:12px;">(gift)</span>' : ''}</h4>
          <div class="voucher-meta">${v.merchantName} &middot; ${v.discountPct != null ? v.discountPct + '% off' : ''} &middot; $${v.price}${v.expiryDate ? ' &middot; valid until ' + v.expiryDate : ''}</div>
          <div class="voucher-code-row">Code: <span class="voucher-code">${v.code}</span> ${expiryBadge(v)}</div>
          ${v.status === 'redeemed' && !v.hasReviewed ? `<div style="margin-top:8px;"><button class="btn btn-secondary" onclick="openWalletReview(${v.offerId}, ${JSON.stringify(v.offerTitle)})">Rate this experience</button></div>` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="status-pill status-${v.status}">${v.status}</span>
          ${v.status === 'active' ? `<button class="btn btn-secondary" onclick="showQR('${v.code}')">Show QR</button>` : ''}
        </div>
      </div>
    `).join('');
  }

  const { vouchers: sent } = await api('/api/vouchers/sent');
  const sentEl = document.getElementById('sentList');
  if (sent.length === 0) { sentEl.innerHTML = `<div class="empty">You haven't sent any gifts yet.</div>`; return; }
  sentEl.innerHTML = sent.map(v => `
    <div class="voucher-card">
      <div class="voucher-left">
        <h4>${v.offerTitle}</h4>
        <div class="voucher-meta">To ${v.giftedTo || v.recipientEmail || v.recipientPhone || 'pending'} &middot; $${v.price}</div>
        <div class="voucher-code-row">Code: <span class="voucher-code">${v.code}</span></div>
      </div>
      <span class="status-pill status-${v.status}">${v.status === 'pending-claim' ? 'awaiting sign-up' : v.status}</span>
    </div>
  `).join('');
}

function openWalletReview(offerId, offerTitle) {
  document.getElementById('wrOfferId').value = offerId;
  document.getElementById('walletReviewOfferTitle').textContent = offerTitle;
  document.getElementById('wrComment').value = '';
  clearNotice('wrNotice');
  openModal('walletReviewModal');
}

async function submitWalletReview() {
  clearNotice('wrNotice');
  const offerId = document.getElementById('wrOfferId').value;
  const rating = document.getElementById('wrRating').value;
  const comment = document.getElementById('wrComment').value.trim();
  try {
    await api(`/api/offers/${offerId}/reviews`, { method: 'POST', body: { rating, comment } });
    closeModal('walletReviewModal');
    toast('Review posted. Thanks!', 'success');
    renderWallet();
  } catch (e) {
    showNotice('wrNotice', e.message, 'error');
  }
}

function showQR(code) {
  document.getElementById('qrTitle').textContent = 'Voucher QR';
  document.getElementById('qrCode').textContent = code;
  const container = document.getElementById('qrPattern');
  container.innerHTML = '';
  new QRCode(container, { text: code, width: 160, height: 160, colorDark: '#1E293B', colorLight: '#FFFFFF' });
  openModal('qrModal');
}

/* ---------- Merchant redeem ---------- */
async function redeemVoucher() {
  const input = document.getElementById('redeemInput');
  try {
    const { voucher } = await api('/api/vouchers/redeem', { method: 'POST', body: { code: input.value } });
    showNotice('redeemNotice', `Voucher ${voucher.code} redeemed successfully for "${voucher.offerTitle}".`, 'success');
    input.value = '';
    if (currentMerchant && currentMerchant.role === 'manager') loadMerchantDashboard();
  } catch (e) {
    showNotice('redeemNotice', e.message, 'error');
  }
}

/* ---------- Admin ---------- */
async function renderCategoryManageList() {
  const { categories } = await api('/api/admin/categories');
  window.__categoriesCache = categories;
  document.getElementById('categoryManageList').innerHTML = categories.map(c =>
    `<div class="category-row"><span>${c.name}</span><button class="row-btn danger" onclick="deleteCategory(${c.id}, '${c.name.replace(/'/g, "\\'")}')">Delete</button></div>`
  ).join('') || `<div class="empty">No categories yet.</div>`;
  const options = categories.map(c => `<option>${c.name}</option>`).join('');
  document.getElementById('nmCategory').innerHTML = options;
  document.getElementById('eoCategory').innerHTML = options;
}

async function addCategory() {
  clearNotice('categoryNotice');
  const input = document.getElementById('newCategoryName');
  const name = input.value.trim();
  if (!name) { showNotice('categoryNotice', 'Enter a category name.', 'error'); return; }
  try {
    await api('/api/admin/categories', { method: 'POST', body: { name } });
    input.value = '';
    renderCategoryManageList();
    loadCategories().then(renderChips);
    toast('Category added.', 'success');
  } catch (e) {
    showNotice('categoryNotice', e.message, 'error');
  }
}

async function deleteCategory(id, name) {
  if (!confirm(`Delete "${name}"? Offers already using this category will keep it, but it won't be selectable for new ones.`)) return;
  try {
    const { wasInUse } = await api(`/api/admin/categories/${id}`, { method: 'DELETE' });
    renderCategoryManageList();
    loadCategories().then(renderChips);
    toast(wasInUse ? 'Deleted. Some existing offers still reference it.' : 'Category deleted.', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

function setAdminTab(tab) {
  document.querySelectorAll('[data-admintab]').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-admintab="${tab}"]`).classList.add('active');
  document.querySelectorAll('.admin-tab-panel').forEach(p => p.style.display = 'none');
  document.getElementById('admin-tab-' + tab).style.display = 'block';
  if (tab === 'finance') loadFinance();
}

async function renderAdmin() {
  const stats = await api('/api/admin/stats');
  document.getElementById('aGMV').textContent = '$' + stats.gmv;
  document.getElementById('aMerchants').textContent = stats.merchants;
  document.getElementById('aVouchers').textContent = stats.soldCount;
  document.getElementById('aRedeemed').textContent = stats.redeemed;

  await renderCategoryManageList();

  const { merchants } = await api('/api/admin/merchants');
  document.getElementById('adminMerchantTable').innerHTML = merchants.map(m => `
    <tr>
      <td>${m.logoUrl ? `<img class="mini-logo" src="${m.logoUrl}" alt="" />` : `<div class="mini-logo-placeholder">${m.initials || '??'}</div>`}</td>
      <td>${m.name}</td>
      <td>${m.category}</td>
      <td><span class="commission-tag" onclick="editCommission(${m.id}, ${m.commissionRate == null ? 'null' : m.commissionRate})">${m.commissionRate != null ? Math.round(m.commissionRate * 100) + '%' : 'Default (8%)'}</span></td>
      <td>
        <input type="file" accept="image/*" style="display:none" id="logoFile-${m.id}" onchange="uploadLogo(${m.id}, this)" />
        <button class="row-btn" onclick="document.getElementById('logoFile-${m.id}').click()">Upload logo</button>
      </td>
      <td><button class="row-btn" onclick="openAccountsModal(${m.id}, '${m.name.replace(/'/g, "\\'")}')">Manage accounts</button></td>
    </tr>
  `).join('') || `<tr><td colspan="6" class="empty">No merchants yet.</td></tr>`;

  window.__adminOffersCache = (await api('/api/admin/offers')).offers;
  document.getElementById('adminOfferTable').innerHTML = window.__adminOffersCache.map(o => `
    <tr>
      <td>
        ${o.imageUrl ? `<img class="mini-photo" src="${o.imageUrl}" alt="" />` : `<div class="mini-photo-placeholder"></div>`}
        <input type="file" accept="image/*" style="display:none" id="offerImg-${o.id}" onchange="uploadOfferImage(${o.id}, this)" />
        <button class="row-btn" style="margin-top:4px;" onclick="document.getElementById('offerImg-${o.id}').click()">Upload</button>
      </td>
      <td><a href="#" class="offer-link" onclick="openOfferDetail(${o.id});return false;">${o.title}</a></td>
      <td>${o.merchantName}</td><td>$${o.price}</td>
      <td>${o.reviewCount ? starString(o.avgRating) + ' (' + o.reviewCount + ')' : '—'}</td>
      <td>${o.sold}</td><td>${o.status}</td>
      <td>
        <button class="row-btn" onclick="openEditOffer(${o.id})">Edit</button>
        <button class="row-btn" onclick="toggleOfferStatus(${o.id})">${o.status === 'Live' ? 'Pause' : 'Resume'}</button>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="8" class="empty">No offers yet.</td></tr>`;
}

async function uploadOfferImage(offerId, input) {
  const file = input.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('image', file);
  try {
    const res = await fetch(`/api/admin/offers/${offerId}/image-upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Upload failed.');
    renderAdmin();
    renderOffers();
    toast('Photo uploaded.', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function toggleOfferStatus(id) {
  await api(`/api/admin/offers/${id}/toggle`, { method: 'PATCH' });
  renderAdmin();
}

function openEditOffer(id) {
  const o = (window.__adminOffersCache || []).find(x => x.id === id);
  if (!o) return;
  document.getElementById('eoId').value = o.id;
  document.getElementById('eoCategory').value = o.category;
  document.getElementById('eoTitle').value = o.title;
  document.getElementById('eoOriginal').value = o.original;
  document.getElementById('eoPrice').value = o.price;
  document.getElementById('eoExpiry').value = o.expiryDate || '';
  document.getElementById('eoTerms').value = o.terms;
  clearNotice('editOfferNotice');
  openModal('editOfferModal');
}

async function saveOfferEdit() {
  clearNotice('editOfferNotice');
  const id = document.getElementById('eoId').value;
  const body = {
    category: document.getElementById('eoCategory').value,
    title: document.getElementById('eoTitle').value.trim(),
    original: document.getElementById('eoOriginal').value,
    price: document.getElementById('eoPrice').value,
    expiryDate: document.getElementById('eoExpiry').value,
    terms: document.getElementById('eoTerms').value.trim()
  };
  try {
    await api(`/api/admin/offers/${id}`, { method: 'PATCH', body });
    closeModal('editOfferModal');
    renderAdmin();
  } catch (e) {
    showNotice('editOfferNotice', e.message, 'error');
  }
}

async function openOfferDetail(id) {
  try {
    const d = await api(`/api/admin/offers/${id}/detail`);
    const pct = Math.round((1 - d.offer.price / d.offer.original) * 100);
    document.getElementById('offerDetailBody').innerHTML = `
      <h3>${d.offer.title}</h3>
      <div class="offer-merchant" style="margin-bottom:16px;">${d.merchantName} &middot; ${d.offer.category} &middot; ${pct}% off ($${d.offer.price} of $${d.offer.original})</div>
      <div class="stat-grid" style="margin-bottom:20px;">
        <div class="stat-card"><div class="stat-label">Sold</div><div class="stat-value">${d.sold}</div></div>
        <div class="stat-card"><div class="stat-label">Redeemed</div><div class="stat-value">${d.redeemed}</div></div>
        <div class="stat-card"><div class="stat-label">Revenue</div><div class="stat-value">$${d.revenue}</div></div>
        <div class="stat-card"><div class="stat-label">Commission (${Math.round(d.commissionRate * 100)}%)</div><div class="stat-value">$${d.commission}</div></div>
      </div>
      <p class="note" style="margin-bottom:14px;">Merchant payout: <strong>$${d.payout}</strong></p>
      <table><thead><tr><th>Code</th><th>Buyer</th><th>Status</th><th>Purchased</th><th>Redeemed</th></tr></thead><tbody>
        ${d.vouchers.map(v => `<tr><td class="voucher-code">${v.code}</td><td>${v.buyerName}${v.isGift ? ' (gift)' : ''}</td><td><span class="status-pill status-${v.status}">${v.status}</span></td><td>${fmtDate(v.createdAt)}</td><td>${fmtDate(v.redeemedAt)}</td></tr>`).join('') || '<tr><td colspan="5" class="empty">No sales yet.</td></tr>'}
      </tbody></table>
    `;
    openModal('offerDetailModal');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function editCommission(merchantId, currentRate) {
  const input = prompt('Commission rate as a percentage (e.g. 8 for 8%). Leave blank to use the default 8%.', currentRate != null ? Math.round(currentRate * 100) : '');
  if (input === null) return;
  const trimmed = input.trim();
  const rate = trimmed === '' ? null : Number(trimmed) / 100;
  try {
    await api(`/api/admin/merchants/${merchantId}/commission`, { method: 'PATCH', body: { rate } });
    renderAdmin();
    toast('Commission rate updated.', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

/* ---------- Finance ---------- */
async function loadFinance() {
  const from = document.getElementById('finFrom').value;
  const to = document.getElementById('finTo').value;
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);

  const ov = await api('/api/admin/finance/overview?' + params.toString());
  document.getElementById('finGMV').textContent = '$' + ov.gmv;
  document.getElementById('finCommission').textContent = '$' + ov.commissionTotal;
  document.getElementById('finPayoutOwed').textContent = '$' + ov.payoutOwedForPeriod;
  document.getElementById('finOutstanding').textContent = '$' + ov.totalOutstandingAllTime;

  document.getElementById('finTopMerchants').innerHTML = ov.topMerchants.map(m =>
    `<tr><td>${m.name}</td><td>$${m.revenue}</td></tr>`
  ).join('') || `<tr><td colspan="2" class="empty">No sales in this period.</td></tr>`;

  document.getElementById('finCategoryTable').innerHTML = ov.categoryBreakdown.map(c =>
    `<tr><td>${c.category}</td><td>$${c.revenue}</td></tr>`
  ).join('') || `<tr><td colspan="2" class="empty">No sales in this period.</td></tr>`;

  const mv = await api('/api/admin/finance/merchants?' + params.toString());
  document.getElementById('finMerchantTable').innerHTML = mv.merchants.map(m => `
    <tr>
      <td>${m.name}</td>
      <td>${Math.round(m.commissionRate * 100)}%</td>
      <td>$${m.periodRevenue}</td>
      <td>$${m.periodCommission}</td>
      <td>$${m.periodPayout}</td>
      <td>$${m.lifetimeOutstanding}</td>
      <td>
        <button class="row-btn" onclick="openLogPayout(${m.id}, '${m.name.replace(/'/g, "\\'")}', ${m.lifetimeOutstanding})">Log payout</button>
        <a class="row-btn" style="text-decoration:none;display:inline-block;" href="/api/admin/merchants/${m.id}/invoice${from || to ? '?' + params.toString() : ''}" target="_blank">Invoice PDF</a>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="7" class="empty">No merchants yet.</td></tr>`;
}

function openLogPayout(merchantId, merchantName, outstanding) {
  document.getElementById('lpMerchantId').value = merchantId;
  document.getElementById('logPayoutTitle').textContent = 'Log a payout — ' + merchantName;
  document.getElementById('lpOutstandingNote').textContent = `Currently outstanding: $${outstanding}`;
  document.getElementById('lpAmount').value = '';
  document.getElementById('lpNote').value = '';
  clearNotice('lpNotice');
  openModal('logPayoutModal');
}

async function submitPayout() {
  clearNotice('lpNotice');
  const merchantId = document.getElementById('lpMerchantId').value;
  const amount = document.getElementById('lpAmount').value;
  const note = document.getElementById('lpNote').value.trim();
  try {
    await api(`/api/admin/merchants/${merchantId}/payouts`, { method: 'POST', body: { amount, note } });
    closeModal('logPayoutModal');
    loadFinance();
    toast('Payout logged.', 'success');
  } catch (e) {
    showNotice('lpNotice', e.message, 'error');
  }
}

async function uploadLogo(merchantId, input) {
  const file = input.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('logo', file);
  try {
    const res = await fetch(`/api/admin/merchants/${merchantId}/logo-upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Upload failed.');
    renderAdmin();
    renderOffers();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function createMerchant() {
  clearNotice('merchantNotice');
  const name = document.getElementById('nmName').value.trim();
  const category = document.getElementById('nmCategory').value;
  const contact = document.getElementById('nmContact').value.trim();
  const logoUrl = document.getElementById('nmLogoUrl').value.trim();
  try {
    const { merchant, managerUsername, tempPassword } = await api('/api/admin/merchants', { method: 'POST', body: { name, category, contact, logoUrl } });
    document.getElementById('nmName').value = '';
    document.getElementById('nmContact').value = '';
    document.getElementById('nmLogoUrl').value = '';
    closeModal('newMerchantModal');
    renderAdmin();
    document.getElementById('credentialsBox').innerHTML = `Business: <strong>${merchant.name}</strong><br/>Role: <strong>Manager</strong><br/>Username: <strong>${managerUsername}</strong><br/>Password: <strong>${tempPassword}</strong>`;
    openModal('credentialsModal');
  } catch (e) {
    showNotice('merchantNotice', e.message, 'error');
  }
}

/* ---------- Merchant staff accounts (admin) ---------- */
let currentAccountsMerchantId = null;

async function openAccountsModal(merchantId, merchantName) {
  currentAccountsMerchantId = merchantId;
  document.getElementById('accountsModalTitle').textContent = merchantName + ' — Staff accounts';
  document.getElementById('newLocationName').value = '';
  clearNotice('accountsNotice');
  await renderAccountsList();
  openModal('accountsModal');
}

async function renderAccountsList() {
  const { accounts } = await api(`/api/admin/merchants/${currentAccountsMerchantId}/accounts`);
  document.getElementById('accountsList').innerHTML = accounts.map(a => `
    <div class="account-row">
      <span>
        ${a.username}${a.location ? ' — ' + a.location : ''}<span class="account-role-badge ${a.role}">${a.role === 'manager' ? 'Manager' : 'Front desk'}</span>
        <div class="note" style="margin-top:2px;">Password: <span class="voucher-code">${a.plainPassword || '—'}</span></div>
      </span>
      <span>
        <button class="row-btn" onclick="openEditAccount(${currentAccountsMerchantId}, ${a.id}, '${a.username}')">Edit</button>
        ${a.role === 'frontdesk' ? `<button class="row-btn danger" onclick="deleteFrontDeskAccount(${a.id})">Remove</button>` : ''}
      </span>
    </div>
  `).join('') || `<div class="empty">No accounts yet.</div>`;
}

function openEditAccount(merchantId, accountId, username) {
  document.getElementById('eaMerchantId').value = merchantId;
  document.getElementById('eaAccountId').value = accountId;
  document.getElementById('eaUsername').value = username;
  document.getElementById('eaPassword').value = '';
  clearNotice('editAccountNotice');
  openModal('editAccountModal');
}

async function saveAccountEdit() {
  clearNotice('editAccountNotice');
  const merchantId = document.getElementById('eaMerchantId').value;
  const accountId = document.getElementById('eaAccountId').value;
  const username = document.getElementById('eaUsername').value.trim();
  const password = document.getElementById('eaPassword').value.trim();
  try {
    await api(`/api/admin/merchants/${merchantId}/accounts/${accountId}`, { method: 'PATCH', body: { username, password } });
    closeModal('editAccountModal');
    renderAccountsList();
    toast('Account updated.', 'success');
  } catch (e) {
    showNotice('editAccountNotice', e.message, 'error');
  }
}

async function regenerateAccountPassword() {
  clearNotice('editAccountNotice');
  const merchantId = document.getElementById('eaMerchantId').value;
  const accountId = document.getElementById('eaAccountId').value;
  try {
    const { account } = await api(`/api/admin/merchants/${merchantId}/accounts/${accountId}`, { method: 'PATCH', body: { regenerate: true } });
    closeModal('editAccountModal');
    renderAccountsList();
    document.getElementById('credentialsBox').innerHTML = `Username: <strong>${account.username}</strong><br/>New password: <strong>${account.plainPassword}</strong>`;
    openModal('credentialsModal');
  } catch (e) {
    showNotice('editAccountNotice', e.message, 'error');
  }
}

async function addFrontDeskAccount() {
  clearNotice('accountsNotice');
  const location = document.getElementById('newLocationName').value.trim();
  if (!location) { showNotice('accountsNotice', 'Enter a branch/location name.', 'error'); return; }
  try {
    const { account, tempPassword } = await api(`/api/admin/merchants/${currentAccountsMerchantId}/accounts`, { method: 'POST', body: { location } });
    document.getElementById('newLocationName').value = '';
    await renderAccountsList();
    document.getElementById('credentialsBox').innerHTML = `Location: <strong>${account.location}</strong><br/>Role: <strong>Front desk</strong><br/>Username: <strong>${account.username}</strong><br/>Password: <strong>${tempPassword}</strong>`;
    closeModal('accountsModal');
    openModal('credentialsModal');
  } catch (e) {
    showNotice('accountsNotice', e.message, 'error');
  }
}

async function deleteFrontDeskAccount(accountId) {
  if (!confirm('Remove this front desk account? They will no longer be able to log in.')) return;
  try {
    await api(`/api/admin/merchants/${currentAccountsMerchantId}/accounts/${accountId}`, { method: 'DELETE' });
    renderAccountsList();
    toast('Account removed.', 'success');
  } catch (e) {
    toast(e.message, 'error');
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
  const expiryDate = document.getElementById('noExpiry').value;
  const terms = document.getElementById('noTerms').value.trim();
  try {
    await api('/api/admin/offers', { method: 'POST', body: { merchantId, title, original, price, expiryDate, terms } });
    ['noTitle', 'noOriginal', 'noPrice', 'noExpiry', 'noTerms'].forEach(id => document.getElementById(id).value = '');
    closeModal('newOfferModal');
    renderAdmin();
    renderOffers();
  } catch (e) {
    showNotice('offerNotice', e.message, 'error');
  }
}

document.getElementById('searchInput').addEventListener('keyup', renderOffers);
document.getElementById('aiQuery').addEventListener('keyup', (e) => { if (e.key === 'Enter') askAI(); });

/* ---------- Init ---------- */
(async function init() {
  populateCountryCodes();
  await refreshAuth();
  await refreshMerchantAuth();
  await loadCategories();
  renderChips();
  renderOffers();

  const params = new URLSearchParams(location.search);
  const resetToken = params.get('resetToken');
  const verifyToken = params.get('verifyToken');
  if (resetToken) {
    window.__resetToken = resetToken;
    openModal('resetPasswordModal');
  } else if (verifyToken) {
    try {
      const { user } = await api('/api/auth/verify-email', { method: 'POST', body: { token: verifyToken } });
      if (currentUser && currentUser.id === user.id) { currentUser = user; renderAuthArea(); }
      toast('Email verified. Thanks!', 'success');
    } catch (e) {
      toast(e.message, 'error');
    }
    history.replaceState({}, '', location.pathname);
  }
})();

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

let currentUser = null;
let currentMerchant = null;
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

/* ---------- Customer auth ---------- */
function setAuthTab(tab) {
  document.querySelectorAll('#authTabs button').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-authtab="${tab}"]`).classList.add('active');
  document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
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
    const countryCode = document.getElementById('regCountryCode').value;
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    if (!name || !email || !phone || !password) { showNotice('registerNotice', 'Fill in name, email, mobile number and password.', 'error'); return; }
    const { user, claimedGifts } = await api('/api/auth/register', { method: 'POST', body: { name, email, phone, countryCode, password } });
    currentUser = user;
    renderAuthArea();
    closeModal('authModal');
    if (claimedGifts > 0) {
      alert(`Welcome! You had ${claimedGifts} gift voucher${claimedGifts > 1 ? 's' : ''} waiting for you — check "My vouchers".`);
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

/* ---------- Merchant auth ---------- */
async function refreshMerchantAuth() {
  const { merchant } = await api('/api/merchant/me');
  currentMerchant = merchant;
  renderMerchantArea();
}

function renderMerchantArea() {
  const loggedOut = document.getElementById('merchantLoggedOut');
  const loggedIn = document.getElementById('merchantLoggedIn');
  if (currentMerchant) {
    loggedOut.style.display = 'none';
    loggedIn.style.display = 'block';
    document.getElementById('merchantWelcome').textContent = `Logged in as ${currentMerchant.name}. Codes verified here only redeem vouchers for your business.`;
  } else {
    loggedOut.style.display = 'block';
    loggedIn.style.display = 'none';
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

/* ---------- Offers ---------- */
function renderChips() {
  const el = document.getElementById('categoryChips');
  const cats = ["All", "Entertainment", "Restaurants", "Spa & Beauty", "Medical Checkups"];
  el.innerHTML = cats.map(c => `<button class="chip ${c === activeCategory ? 'active' : ''}" onclick="setCategory('${c}')">${c}</button>`).join('');
}

function setCategory(c) { activeCategory = c; renderChips(); renderOffers(); }

function thumbContent(o) {
  if (o.merchantLogoUrl) {
    return `<img class="merchant-logo" src="${o.merchantLogoUrl}" alt="${o.merchantName} logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><span class="thumb-badge" style="display:none;">${o.merchantInitials || '??'}</span>`;
  }
  return `${catIcons[o.category] || ''}<span class="thumb-badge">${o.merchantInitials || '??'}</span>`;
}

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
      <div class="offer-thumb">${thumbContent(o)}</div>
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
  document.getElementById('giftEmail').value = '';
  document.getElementById('giftPhone').value = '';
  document.getElementById('giftMessage').value = '';
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
      alert(`Gift sent to ${recipientName}.`);
    } else {
      alert(`Gift sent! They don't have a Waffer account yet, so we'll prompt them to sign up with this email or phone to claim their voucher.`);
    }
  } catch (e) {
    showNotice('giftNotice', e.message, 'error');
  }
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
          <div class="voucher-meta">${v.merchantName} &middot; $${v.price} &middot; <span class="voucher-code">${v.code}</span></div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="status-pill status-${v.status}">${v.status}</span>
          ${v.status === 'active' ? `<button class="btn btn-secondary" onclick="showQR('${v.code}', ${JSON.stringify(v.offerTitle)})">Show QR</button>` : ''}
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
        <div class="voucher-meta">To ${v.giftedTo || v.recipientEmail || v.recipientPhone || 'pending'} &middot; $${v.price} &middot; <span class="voucher-code">${v.code}</span></div>
      </div>
      <span class="status-pill status-${v.status}">${v.status === 'pending-claim' ? 'awaiting sign-up' : v.status}</span>
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
    cell.style.background = Math.random() > 0.42 ? '#FAFAFA' : '#1E293B';
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
    `<tr><td>${m.name}</td><td>${m.category}</td><td>${m.username || '—'}</td><td>${m.logoUrl ? 'Yes' : 'Default icon'}</td></tr>`
  ).join('') || `<tr><td colspan="4" class="empty">No merchants yet.</td></tr>`;

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
  const logoUrl = document.getElementById('nmLogoUrl').value.trim();
  try {
    const { merchant, tempPassword } = await api('/api/admin/merchants', { method: 'POST', body: { name, category, contact, logoUrl } });
    document.getElementById('nmName').value = '';
    document.getElementById('nmContact').value = '';
    document.getElementById('nmLogoUrl').value = '';
    closeModal('newMerchantModal');
    renderAdmin();
    alert(`Merchant added. Their login: username "${merchant.username}", password "${tempPassword}" — share this with them.`);
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
  populateCountryCodes();
  await refreshAuth();
  await refreshMerchantAuth();
  renderChips();
  renderOffers();
})();

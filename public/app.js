const countryCodes = [
  ['+961','Lebanon'],['+965','Kuwait'],['+966','Saudi Arabia'],['+971','UAE'],['+974','Qatar'],
  ['+973','Bahrain'],['+968','Oman'],['+962','Jordan'],
  ['+93','Afghanistan'],['+355','Albania'],['+213','Algeria'],['+1684','American Samoa'],['+376','Andorra'],
  ['+244','Angola'],['+1264','Anguilla'],['+1268','Antigua and Barbuda'],['+54','Argentina'],['+374','Armenia'],
  ['+297','Aruba'],['+61','Australia'],['+43','Austria'],['+994','Azerbaijan'],['+1242','Bahamas'],
  ['+880','Bangladesh'],['+1246','Barbados'],['+375','Belarus'],['+32','Belgium'],['+501','Belize'],
  ['+229','Benin'],['+1441','Bermuda'],['+975','Bhutan'],['+591','Bolivia'],['+387','Bosnia and Herzegovina'],
  ['+267','Botswana'],['+55','Brazil'],['+673','Brunei'],['+359','Bulgaria'],['+226','Burkina Faso'],
  ['+257','Burundi'],['+855','Cambodia'],['+237','Cameroon'],['+1','Canada'],['+238','Cape Verde'],
  ['+1345','Cayman Islands'],['+236','Central African Republic'],['+235','Chad'],['+56','Chile'],['+86','China'],
  ['+57','Colombia'],['+269','Comoros'],['+242','Congo'],['+243','Congo (DRC)'],['+682','Cook Islands'],
  ['+506','Costa Rica'],['+385','Croatia'],['+53','Cuba'],['+357','Cyprus'],['+420','Czech Republic'],
  ['+45','Denmark'],['+253','Djibouti'],['+1767','Dominica'],['+1809','Dominican Republic'],['+593','Ecuador'],
  ['+20','Egypt'],['+503','El Salvador'],['+240','Equatorial Guinea'],['+291','Eritrea'],['+372','Estonia'],
  ['+268','Eswatini'],['+251','Ethiopia'],['+679','Fiji'],['+358','Finland'],['+33','France'],
  ['+241','Gabon'],['+220','Gambia'],['+995','Georgia'],['+49','Germany'],['+233','Ghana'],
  ['+350','Gibraltar'],['+30','Greece'],['+1473','Grenada'],['+1671','Guam'],['+502','Guatemala'],
  ['+224','Guinea'],['+245','Guinea-Bissau'],['+592','Guyana'],['+509','Haiti'],['+504','Honduras'],
  ['+852','Hong Kong'],['+36','Hungary'],['+354','Iceland'],['+91','India'],['+62','Indonesia'],
  ['+98','Iran'],['+964','Iraq'],['+353','Ireland'],['+972','Israel'],['+39','Italy'],
  ['+225','Ivory Coast'],['+1876','Jamaica'],['+81','Japan'],['+254','Kenya'],['+686','Kiribati'],
  ['+850','North Korea'],['+82','South Korea'],['+996','Kyrgyzstan'],['+856','Laos'],['+371','Latvia'],
  ['+266','Lesotho'],['+231','Liberia'],['+218','Libya'],['+423','Liechtenstein'],['+370','Lithuania'],
  ['+352','Luxembourg'],['+853','Macau'],['+389','North Macedonia'],['+261','Madagascar'],['+265','Malawi'],
  ['+60','Malaysia'],['+960','Maldives'],['+223','Mali'],['+356','Malta'],['+692','Marshall Islands'],
  ['+222','Mauritania'],['+230','Mauritius'],['+52','Mexico'],['+691','Micronesia'],['+373','Moldova'],
  ['+377','Monaco'],['+976','Mongolia'],['+382','Montenegro'],['+212','Morocco'],['+258','Mozambique'],
  ['+95','Myanmar'],['+264','Namibia'],['+674','Nauru'],['+977','Nepal'],['+31','Netherlands'],
  ['+64','New Zealand'],['+505','Nicaragua'],['+227','Niger'],['+234','Nigeria'],['+683','Niue'],
  ['+47','Norway'],['+92','Pakistan'],['+680','Palau'],['+970','Palestine'],['+507','Panama'],
  ['+675','Papua New Guinea'],['+595','Paraguay'],['+51','Peru'],['+63','Philippines'],['+48','Poland'],
  ['+351','Portugal'],['+1787','Puerto Rico'],['+40','Romania'],['+7','Russia'],['+250','Rwanda'],
  ['+1869','Saint Kitts and Nevis'],['+1758','Saint Lucia'],['+1784','Saint Vincent and the Grenadines'],['+685','Samoa'],['+378','San Marino'],
  ['+239','Sao Tome and Principe'],['+221','Senegal'],['+381','Serbia'],['+248','Seychelles'],['+232','Sierra Leone'],
  ['+65','Singapore'],['+421','Slovakia'],['+386','Slovenia'],['+677','Solomon Islands'],['+252','Somalia'],
  ['+27','South Africa'],['+211','South Sudan'],['+34','Spain'],['+94','Sri Lanka'],['+249','Sudan'],
  ['+597','Suriname'],['+46','Sweden'],['+41','Switzerland'],['+963','Syria'],['+886','Taiwan'],
  ['+992','Tajikistan'],['+255','Tanzania'],['+66','Thailand'],['+670','Timor-Leste'],['+228','Togo'],
  ['+676','Tonga'],['+1868','Trinidad and Tobago'],['+216','Tunisia'],['+90','Turkey'],['+993','Turkmenistan'],
  ['+688','Tuvalu'],['+256','Uganda'],['+380','Ukraine'],['+44','United Kingdom'],['+1','United States'],
  ['+598','Uruguay'],['+998','Uzbekistan'],['+678','Vanuatu'],['+379','Vatican City'],['+58','Venezuela'],
  ['+84','Vietnam'],['+967','Yemen'],['+260','Zambia'],['+263','Zimbabwe']
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
function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

function fmtDateTime(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  const datePart = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const timePart = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${datePart}, ${timePart}`;
}

/* Shared trend chart used by both admin overview and merchant dashboard.
   No charting library — a plain set of bars scaled to the highest value in range. */
function renderTrendChart(containerId, data, valueKey) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!data || data.length === 0) {
    el.innerHTML = `<div class="trend-chart-empty">No sales in this period.</div>`;
    return;
  }
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  el.innerHTML = `<div class="trend-chart">${data.map(d => {
    const pct = Math.max((d[valueKey] / max) * 100, 2);
    const shortDate = new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return `<div class="trend-bar-wrap" title="${shortDate}: ${d[valueKey]}"><div class="trend-bar" style="height:${pct}%;"></div></div>`;
  }).join('')}</div>`;
}

function renderTopList(containerId, items, labelKey, valueKey, valuePrefix) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!items || items.length === 0) {
    el.innerHTML = `<div class="empty">No data in this period.</div>`;
    return;
  }
  el.innerHTML = items.map((item, i) => `
    <div class="top-list-row"><span><span class="top-list-rank">${i + 1}</span>${escapeHtml(item[labelKey])}</span><strong>${valuePrefix || ''}${item[valueKey]}</strong></div>
  `).join('');
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
  const options = countryCodes.map(([code, name]) => `<option value="${code}">${code} ${name}</option>`).join('');
  document.getElementById('regCountryCode').innerHTML = options;
  const giftSel = document.getElementById('giftCountryCode');
  if (giftSel) giftSel.innerHTML = options;
}

async function refreshAuth() {
  const { user } = await api('/api/auth/me');
  currentUser = user;
  renderAuthArea();
}

function renderAuthArea() {
  const walletBtn = document.getElementById('walletNavBtn');
  const adminBtn = document.getElementById('adminNavBtn');
  const banner = document.getElementById('verifyBanner');
  if (currentUser) {
    walletBtn.style.display = 'inline-block';
    adminBtn.style.display = currentUser.isAdmin ? 'inline-block' : 'none';
    banner.style.display = (!currentUser.emailVerified && !currentUser.isAdmin) ? 'block' : 'none';
  } else {
    walletBtn.style.display = 'none';
    adminBtn.style.display = 'none';
    banner.style.display = 'none';
  }
  renderTopAuthPill();
}

function renderTopAuthPill() {
  const el = document.getElementById('authArea');
  if (currentUser) {
    el.innerHTML = `<button class="user-pill-btn" onclick="openProfile()">Hi, ${escapeHtml(currentUser.name.split(' ')[0])}</button><button onclick="doLogout()">Log out</button>`;
  } else if (currentMerchant) {
    el.innerHTML = `<button onclick="doMerchantLogout()">Log out</button>`;
  } else {
    el.innerHTML = `<button onclick="openModal('authModal')">Log in</button>`;
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
    const gender = document.getElementById('regGender').value;
    const birthday = document.getElementById('regBirthday').value;
    if (!name || !email || !phone || !password) { showNotice('registerNotice', 'Fill in name, email, mobile number and password.', 'error'); return; }
    const { user, claimedGifts } = await api('/api/auth/register', { method: 'POST', body: { name, email, phone, countryCode, password, gender, birthday } });
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

  const initials = (currentUser.name || '??').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  document.getElementById('profAvatar').textContent = initials;
  document.getElementById('profHeaderName').textContent = currentUser.name || '';

  const birthdayNoteEl = document.getElementById('profBirthdayNote');
  if (currentUser.birthday) {
    const bMonth = new Date(currentUser.birthday + 'T00:00:00').getMonth();
    const nowMonth = new Date().getMonth();
    birthdayNoteEl.innerHTML = bMonth === nowMonth ? `<div class="profile-birthday-note">🎂 Happy birthday month!</div>` : '';
  } else {
    birthdayNoteEl.innerHTML = '';
  }

  openModal('profileModal');
  loadProfileStats();
}

async function loadProfileStats() {
  try {
    const { totalBought, totalSaved, memberSince } = await api('/api/users/me/stats');
    document.getElementById('profHeaderSince').textContent = 'Member since ' + fmtDate(memberSince);
    document.getElementById('profStats').innerHTML = `
      <div class="profile-stat-card"><div class="profile-stat-value">${totalBought}</div><div class="profile-stat-label">Vouchers bought</div></div>
      <div class="profile-stat-card"><div class="profile-stat-value">$${totalSaved}</div><div class="profile-stat-label">Total saved</div></div>
    `;
  } catch (e) {
    console.log('profile stats load failed', e.message);
  }
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
  renderTopAuthPill();
}

function renderFrontDeskView() {
  const el = document.getElementById('merchantLoggedInContent');
  el.innerHTML = opRedeemPanel(`${currentMerchant.location || 'front desk'}`);
  loadRecentRedemptions();
}

function opRedeemPanel(subLabel) {
  return `
    <div class="op-redeem-wrap">
      <div class="op-redeem-head">
        <div class="op-redeem-title-row">
          <img src="logo.png" alt="Waffer" />
          <div><div class="op-redeem-title">Redeem</div><div class="op-redeem-sub">${currentMerchant.merchantName} · ${subLabel}</div></div>
        </div>
        <div class="op-redeem-badges">
          <span class="op-count-badge" id="opTodayCount">Today: 0 redeemed</span>
        </div>
      </div>
      <div class="op-grid-2">
        <div class="op-scan-panel">
          <div class="op-scan-label">Type or paste the code</div>
          <input class="op-code-input" id="opCodeInput" placeholder="WQ-8F2K91" autocomplete="off" />
          <button class="op-check-btn" onclick="opCheckCode()">Check</button>
          <div class="op-cam-row">📷 Camera scan — coming soon</div>
          <button class="tk-cancel-link" style="color:rgba(255,255,255,0.65);margin-top:10px;" onclick="toggleBulkRedeem()">A group with multiple tickets? Redeem several at once →</button>
          <div id="opBulkPanel" style="display:none;margin-top:14px;">
            <div class="op-scan-label">One code per line</div>
            <textarea class="op-code-input" id="opBulkCodes" style="font-size:14px;letter-spacing:1px;text-align:left;height:100px;padding:12px;" placeholder="WQ-8F2K91&#10;WQ-9K3L02&#10;WQ-7H1M55"></textarea>
            <button class="op-check-btn" onclick="opBulkRedeem()">Redeem all</button>
            <div id="opBulkResults" style="margin-top:12px;"></div>
          </div>
        </div>
        <div class="op-result-col">
          <div id="opResultArea"><div class="op-result-empty">Enter a code to see voucher details here.</div></div>
          <div class="op-log-panel">
            <div class="op-log-label">Last redeemed here</div>
            <div id="opRedeemLog"><div style="font-size:12.5px;color:rgba(255,255,255,0.5);">No redemptions yet.</div></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

let opCurrentLookupVoucher = null;

async function opCheckCode() {
  const code = document.getElementById('opCodeInput').value.trim();
  const resultEl = document.getElementById('opResultArea');
  if (!code) return;
  resultEl.innerHTML = `<div class="op-result-empty">Checking…</div>`;
  try {
    const { voucher } = await api('/api/merchant/voucher-lookup?code=' + encodeURIComponent(code));
    opCurrentLookupVoucher = voucher;
    if (voucher.status === 'redeemed') {
      resultEl.innerHTML = `
        <div class="op-result-card error">
          <div class="op-result-eyebrow">Already redeemed</div>
          <div class="op-result-title">${voucher.offerTitle}</div>
          <div class="op-result-meta">${escapeHtml(voucher.buyerName)} · redeemed ${fmtDateTime(voucher.redeemedAt)}</div>
        </div>`;
      return;
    }
    if (voucher.status === 'pending-claim') {
      resultEl.innerHTML = `
        <div class="op-result-card error">
          <div class="op-result-eyebrow">Not claimed yet</div>
          <div class="op-result-title">${voucher.offerTitle}</div>
          <div class="op-result-meta">This gift hasn't been claimed by its recipient yet.</div>
        </div>`;
      return;
    }
    const expired = voucher.expiryDate && new Date(voucher.expiryDate) < new Date();
    if (expired) {
      resultEl.innerHTML = `
        <div class="op-result-card error">
          <div class="op-result-eyebrow">Expired</div>
          <div class="op-result-title">${voucher.offerTitle}</div>
          <div class="op-result-meta">${escapeHtml(voucher.buyerName)} · expired ${voucher.expiryDate}</div>
        </div>`;
      return;
    }
    resultEl.innerHTML = `
      <div class="op-result-card valid">
        <div class="op-result-eyebrow">Valid · not used before</div>
        <div class="op-result-title">${voucher.offerTitle}</div>
        <div class="op-result-meta">${escapeHtml(voucher.buyerName)} · bought ${fmtDate(voucher.createdAt)}${voucher.expiryDate ? ' · expires ' + fmtDate(voucher.expiryDate) : ''}</div>
        ${voucher.terms ? `<div class="op-result-terms">${voucher.terms}</div>` : ''}
        <button class="op-redeem-confirm-btn" onclick="opConfirmRedeem('${voucher.code}')">Mark as redeemed</button>
      </div>`;
  } catch (e) {
    resultEl.innerHTML = `
      <div class="op-result-card error">
        <div class="op-result-eyebrow">Not found</div>
        <div class="op-result-title" style="font-size:17px;">${e.message}</div>
      </div>`;
  }
}

async function opConfirmRedeem(code) {
  const resultEl = document.getElementById('opResultArea');
  try {
    const { voucher } = await api('/api/vouchers/redeem', { method: 'POST', body: { code } });
    toast(`Redeemed: ${voucher.offerTitle}`, 'success');
    document.getElementById('opCodeInput').value = '';
    resultEl.innerHTML = `<div class="op-result-empty">Enter a code to see voucher details here.</div>`;
    loadRecentRedemptions();
    if (currentMerchant.role === 'manager') loadMerchantDashboard();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function loadRecentRedemptions() {
  try {
    const { redemptions } = await api('/api/merchant/recent-redemptions');
    const today = new Date().toDateString();
    const todayCount = redemptions.filter(r => new Date(r.redeemedAt).toDateString() === today).length;
    const countEl = document.getElementById('opTodayCount');
    if (countEl) countEl.textContent = `Today: ${todayCount} redeemed`;
    const logEl = document.getElementById('opRedeemLog');
    if (!logEl) return;
    logEl.innerHTML = redemptions.length === 0
      ? `<div style="font-size:12.5px;color:rgba(255,255,255,0.5);">No redemptions yet.</div>`
      : redemptions.map(r => `
        <div class="op-log-row">
          <span class="op-log-code">${r.code}</span>
          <span class="op-log-meta">${new Date(r.redeemedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}${r.redeemedByUsername ? ' · ' + r.redeemedByUsername : ''}</span>
        </div>
      `).join('');
  } catch (e) { /* ignore */ }
}

function toggleBulkRedeem() {
  const panel = document.getElementById('opBulkPanel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

async function opBulkRedeem() {
  const raw = document.getElementById('opBulkCodes').value;
  const codes = raw.split(/[\n,]/).map(c => c.trim()).filter(Boolean);
  const resultsEl = document.getElementById('opBulkResults');
  if (codes.length === 0) return;
  resultsEl.innerHTML = `<div style="font-size:12.5px;color:rgba(255,255,255,0.6);">Redeeming ${codes.length}…</div>`;
  const results = [];
  for (const code of codes) {
    try {
      const { voucher } = await api('/api/vouchers/redeem', { method: 'POST', body: { code } });
      results.push({ code, ok: true, title: voucher.offerTitle });
    } catch (e) {
      results.push({ code, ok: false, error: e.message });
    }
  }
  const successCount = results.filter(r => r.ok).length;
  resultsEl.innerHTML = `
    <div style="font-size:12.5px;color:rgba(255,255,255,0.85);margin-bottom:8px;font-weight:700;">${successCount} of ${results.length} redeemed</div>
    ${results.map(r => `
      <div class="op-log-row">
        <span class="op-log-code">${r.code}</span>
        <span class="op-log-meta" style="color:${r.ok ? '#86EFAC' : '#FCA5A5'};">${r.ok ? 'Redeemed' : r.error}</span>
      </div>
    `).join('')}
  `;
  if (successCount > 0) {
    document.getElementById('opBulkCodes').value = '';
    loadRecentRedemptions();
    if (currentMerchant.role === 'manager') loadMerchantOverview();
  }
}

function renderManagerDashboard() {
  const el = document.getElementById('merchantLoggedInContent');
  el.innerHTML = `
    <h2>${currentMerchant.merchantName} — Dashboard</h2>
    <div class="mini-tabs" style="max-width:640px;flex-wrap:wrap;">
      <button class="active" data-mtab="overview" onclick="setMerchantTab('overview')">Overview</button>
      <button data-mtab="offers" onclick="setMerchantTab('offers')">Offers</button>
      <button data-mtab="sales" onclick="setMerchantTab('sales')">Sales</button>
      <button data-mtab="payouts" onclick="setMerchantTab('payouts')">Payouts</button>
      <button data-mtab="branches" onclick="setMerchantTab('branches')">Branches</button>
      <button data-mtab="profile" onclick="setMerchantTab('profile')">Profile</button>
      <button data-mtab="redeem" onclick="setMerchantTab('redeem')">Redeem</button>
    </div>

    <div id="mtab-overview" class="admin-tab-panel">
      <div class="panel">
        <div class="two-col">
          <div class="field" style="margin-bottom:0;"><label>From</label><input id="mdFrom" type="date" /></div>
          <div class="field" style="margin-bottom:0;"><label>To</label><input id="mdTo" type="date" /></div>
        </div>
        <button class="btn btn-secondary" style="margin-top:12px;" onclick="loadMerchantOverview()">Apply</button>
        <button class="btn btn-secondary" style="margin-top:12px;" onclick="document.getElementById('mdFrom').value='';document.getElementById('mdTo').value='';loadMerchantOverview();">Clear (all time)</button>
      </div>
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-label">Vouchers sold</div><div class="stat-value" id="mdSold">0</div></div>
        <div class="stat-card"><div class="stat-label">Redeemed</div><div class="stat-value" id="mdRedeemed">0</div></div>
        <div class="stat-card"><div class="stat-label">Sales volume</div><div class="stat-value" id="mdRevenue">$0</div></div>
        <div class="stat-card"><div class="stat-label">Your payout</div><div class="stat-value" id="mdPayout">$0</div></div>
      </div>
      <p class="note" id="mdCommissionNote" style="margin-bottom:20px;"></p>
      <div class="trend-chart-wrap">
        <div class="trend-chart-head"><h3 style="margin:0;font-size:15px;">Sales (GMV) by day</h3></div>
        <div id="mdTrendChart"></div>
      </div>
    </div>

    <div id="mtab-offers" class="admin-tab-panel" style="display:none;">
      <div class="panel">
        <h3 style="margin-bottom:14px;">Your offers</h3>
        <table><thead><tr><th>Offer</th><th>Status</th><th>Sold</th><th>Redeemed</th><th>Revenue</th><th>Rating</th></tr></thead><tbody id="mdOffersTable"></tbody></table>
      </div>
    </div>

    <div id="mtab-sales" class="admin-tab-panel" style="display:none;">
      <div class="panel">
        <h3 style="margin-bottom:14px;">Recent sales</h3>
        <table><thead><tr><th>Voucher</th><th>Buyer</th><th>Price</th><th>Status</th><th>Purchased</th><th>Redeemed</th><th>Branch</th></tr></thead><tbody id="mdRecentTable"></tbody></table>
      </div>
    </div>

    <div id="mtab-payouts" class="admin-tab-panel" style="display:none;">
      <div class="panel">
        <h3 style="margin-bottom:14px;">Payouts from Waffer</h3>
        <div class="stat-grid" style="margin-bottom:16px;">
          <div class="stat-card"><div class="stat-label">Outstanding balance</div><div class="stat-value" id="mpOutstanding">$0</div></div>
          <div class="stat-card"><div class="stat-label">Total paid to date</div><div class="stat-value" id="mpTotalPaid">$0</div></div>
        </div>
        <table><thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Reference</th></tr></thead><tbody id="mpHistoryTable"></tbody></table>
      </div>
    </div>

    <div id="mtab-branches" class="admin-tab-panel" style="display:none;">
      <div class="panel">
        <h3 style="margin-bottom:14px;">Branches &amp; staff</h3>
        <p class="note" style="margin-top:0;">Front desk accounts can look up and redeem vouchers, but can't see sales figures.</p>
        <div id="mBranchesList"></div>
      </div>
    </div>

    <div id="mtab-profile" class="admin-tab-panel" style="display:none;">
      <div class="panel">
        <h3 style="margin-bottom:14px;">Business profile</h3>
        <div class="field"><label>Business name</label><input id="mpName" /></div>
        <div class="field"><label>Contact / WhatsApp</label><input id="mpContact" /></div>
        <div class="field"><label>Business email</label><input id="mpEmail" type="email" placeholder="finance@yourbusiness.com" /></div>
        <div class="field"><label>Logo</label>
          <div style="display:flex;align-items:center;gap:12px;">
            <div id="mpLogoPreview"></div>
            <input type="file" accept="image/*" style="display:none" id="mpLogoFile" onchange="uploadMerchantLogo(this)" />
            <button class="btn btn-secondary" onclick="document.getElementById('mpLogoFile').click()">Upload logo</button>
          </div>
        </div>
        <div class="inline-notice" id="mpProfileNotice"></div>
        <button class="btn btn-primary" onclick="saveMerchantProfile()">Save changes</button>
      </div>
      <div class="panel">
        <h3 style="margin-bottom:14px;">Change your password</h3>
        <div class="two-col">
          <div class="field"><label>Current password</label><input id="merCurrentPassword" type="password" /></div>
          <div class="field"><label>New password</label><input id="merNewPassword" type="password" /></div>
        </div>
        <div class="inline-notice" id="merPasswordNotice"></div>
        <button class="btn btn-secondary" onclick="changeMerchantPassword()">Update password</button>
      </div>
    </div>

    <div id="mtab-redeem" class="admin-tab-panel" style="display:none;">
      ${opRedeemPanel('manager view')}
    </div>
  `;
  loadMerchantOverview();
}

function setMerchantTab(tab) {
  document.querySelectorAll('[data-mtab]').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-mtab="${tab}"]`).classList.add('active');
  document.querySelectorAll('#merchantLoggedInContent .admin-tab-panel').forEach(p => p.style.display = 'none');
  document.getElementById('mtab-' + tab).style.display = 'block';
  if (tab === 'payouts') loadMerchantPayouts();
  if (tab === 'branches') loadMerchantBranches();
  if (tab === 'profile') loadMerchantProfile();
  if (tab === 'redeem') loadRecentRedemptions();
}

async function loadMerchantOverview() {
  const from = document.getElementById('mdFrom').value;
  const to = document.getElementById('mdTo').value;
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  try {
    const d = await api('/api/merchant/dashboard?' + params.toString());
    window.__merchantDashboardCache = d;
    document.getElementById('mdSold').textContent = d.sold;
    document.getElementById('mdRedeemed').textContent = d.redeemed;
    document.getElementById('mdRevenue').textContent = '$' + d.revenue;
    document.getElementById('mdPayout').textContent = '$' + d.payout;
    document.getElementById('mdCommissionNote').textContent = `Your current commission rate is ${Math.round(d.commissionRate * 100)}%. Total commission deducted (at the rate active for each sale): $${d.commission}.`;
    renderTrendChart('mdTrendChart', d.dailyTrend, 'gmv');
    document.getElementById('mdOffersTable').innerHTML = d.offers.map(o =>
      `<tr><td>${escapeHtml(o.title)}</td><td>${o.status}</td><td>${o.sold}</td><td>${o.redeemed}</td><td>$${o.revenue}</td><td>${o.reviewCount ? starString(o.avgRating) + ' (' + o.reviewCount + ')' : '—'}</td></tr>`
    ).join('') || `<tr><td colspan="6" class="empty">No offers yet.</td></tr>`;
    document.getElementById('mdRecentTable').innerHTML = d.recent.map(v =>
      `<tr><td class="voucher-code">${v.code}</td><td>${escapeHtml(v.buyerName)}</td><td>$${v.price}</td><td><span class="status-pill status-${v.status}">${v.status}</span></td><td>${fmtDateTime(v.createdAt)}</td><td>${fmtDateTime(v.redeemedAt)}</td><td>${v.redeemedByLocation || '—'}</td></tr>`
    ).join('') || `<tr><td colspan="7" class="empty">No sales yet.</td></tr>`;
  } catch (e) {
    console.log('dashboard load failed', e.message);
  }
}

async function loadMerchantPayouts() {
  try {
    const d = await api('/api/merchant/payouts');
    document.getElementById('mpOutstanding').textContent = '$' + d.outstanding;
    document.getElementById('mpTotalPaid').textContent = '$' + d.totalPaid;
    document.getElementById('mpHistoryTable').innerHTML = d.payouts.map(p =>
      `<tr><td>${fmtDateTime(p.createdAt)}</td><td>$${p.amount}</td><td>${p.method || 'Other'}</td><td>${escapeHtml(p.note) || '—'}</td></tr>`
    ).join('') || `<tr><td colspan="4" class="empty">No payouts logged yet.</td></tr>`;
  } catch (e) {
    console.log('payouts load failed', e.message);
  }
}

async function loadMerchantBranches() {
  const el = document.getElementById('mBranchesList');
  try {
    const { accounts } = await api('/api/merchant/accounts');
    el.innerHTML = accounts.map(a => `
      <div class="account-row">
        <span>
          ${escapeHtml(a.username)}${a.location ? ' — ' + escapeHtml(a.location) : ''}<span class="account-role-badge ${a.role}">${a.role === 'manager' ? 'Manager' : 'Front desk'}</span>
          <div class="note" style="margin-top:2px;">Password: <span class="voucher-code">${escapeHtml(a.plainPassword || '—')}</span></div>
        </span>
        <span>
          ${a.role === 'frontdesk' ? `
            <button class="row-btn" onclick="regenerateMyBranchPassword(${a.id})">New password</button>
            <button class="row-btn danger" onclick="deleteMyBranchAccount(${a.id})">Remove</button>
          ` : ''}
        </span>
      </div>
    `).join('') || `<div class="empty">No branch accounts yet — ask Waffer to add one.</div>`;
  } catch (e) {
    el.innerHTML = `<div class="empty">${e.message}</div>`;
  }
}

async function regenerateMyBranchPassword(accountId) {
  try {
    await api(`/api/merchant/accounts/${accountId}`, { method: 'PATCH', body: { regenerate: true } });
    loadMerchantBranches();
    toast('New password generated.', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function deleteMyBranchAccount(accountId) {
  if (!confirm('Remove this branch account? They will no longer be able to log in.')) return;
  try {
    await api(`/api/merchant/accounts/${accountId}`, { method: 'DELETE' });
    loadMerchantBranches();
    toast('Branch account removed.', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function loadMerchantProfile() {
  try {
    const { merchant } = await api('/api/merchant/profile');
    document.getElementById('mpName').value = merchant.name || '';
    document.getElementById('mpContact').value = merchant.contact || '';
    document.getElementById('mpEmail').value = merchant.email || '';
    document.getElementById('mpLogoPreview').innerHTML = merchant.logoUrl
      ? `<img src="${merchant.logoUrl}" style="width:44px;height:44px;border-radius:8px;object-fit:contain;background:#fff;border:1px solid var(--border);" />`
      : `<div class="mini-logo-placeholder" style="width:44px;height:44px;">${(merchant.name || '??').slice(0,2).toUpperCase()}</div>`;
  } catch (e) {
    console.log('profile load failed', e.message);
  }
}

async function saveMerchantProfile() {
  clearNotice('mpProfileNotice');
  const body = {
    name: document.getElementById('mpName').value.trim(),
    contact: document.getElementById('mpContact').value.trim(),
    email: document.getElementById('mpEmail').value.trim()
  };
  try {
    await api('/api/merchant/profile', { method: 'PATCH', body });
    showNotice('mpProfileNotice', 'Saved.', 'success');
    currentMerchant.merchantName = body.name;
    renderMerchantArea();
  } catch (e) {
    showNotice('mpProfileNotice', e.message, 'error');
  }
}

async function uploadMerchantLogo(input) {
  const file = input.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('logo', file);
  try {
    const res = await fetch('/api/merchant/profile/logo-upload', { method: 'POST', credentials: 'include', body: formData });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Upload failed.');
    loadMerchantProfile();
    toast('Logo updated.', 'success');
  } catch (e) {
    toast(e.message, 'error');
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
  document.querySelectorAll('.tk-tabbar-item').forEach(b => b.classList.remove('active'));
  const tabBtn = document.querySelector(`.tk-tabbar-item[data-tab="${view === 'customer' ? 'customer' : view}"]`);
  if (tabBtn) tabBtn.classList.add('active');
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.querySelector('main.container').classList.toggle('customer-flow', view === 'customer' || view === 'wallet');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (view === 'wallet') renderWallet();
  if (view === 'admin') renderAdmin();
  if (view === 'merchant') renderMerchantArea();
}

function tabBarGo(tab) {
  if (tab === 'customer') { switchView('customer'); return; }
  if (tab === 'ask') {
    switchView('customer');
    setTimeout(() => { const el = document.getElementById('aiQuery'); if (el) el.focus(); }, 300);
    document.querySelectorAll('.tk-tabbar-item').forEach(b => b.classList.remove('active'));
    document.querySelector('.tk-tabbar-item[data-tab="ask"]').classList.add('active');
    return;
  }
  if (tab === 'wallet') {
    if (!currentUser) { openModal('authModal'); return; }
    switchView('wallet');
    return;
  }
  if (tab === 'you') {
    if (!currentUser) { openModal('authModal'); return; }
    openProfile();
    document.querySelectorAll('.tk-tabbar-item').forEach(b => b.classList.remove('active'));
    document.querySelector('.tk-tabbar-item[data-tab="you"]').classList.add('active');
    return;
  }
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

async function renderDealOfDay() {
  try {
    const { offers } = await api('/api/offers');
    const slot = document.getElementById('dealOfDaySlot');
    if (!slot) return;
    if (!offers.length) { slot.innerHTML = ''; return; }
    const best = offers.find(o => o.featured) || [...offers].sort((a, b) => (1 - a.price / a.original) < (1 - b.price / b.original) ? 1 : -1)[0];
    const pct = Math.round((1 - best.price / best.original) * 100);
    slot.innerHTML = `
      <div class="deal-of-day">
        <div class="dod-eyebrow"><span>Deal of the day</span><span>${best.category}</span></div>
        <div class="dod-title">${best.title}</div>
        <div class="dod-merchant">${best.merchantName}</div>
        <div class="dod-perf"></div>
        <div class="dod-bottom">
          <div><div class="dod-price">$${best.price}</div><div class="dod-was">$${best.original}</div></div>
          <div class="dod-cta" onclick="openOfferById(${best.id})">Grab it${pct ? ` · ${pct}% off` : ''}</div>
        </div>
      </div>`;
  } catch (e) { /* ignore */ }
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
      <div class="offer-perforation"></div>
      <div class="offer-body">
        <div class="offer-cat">${o.category}</div>
        <div class="offer-title">${o.title}</div>
        <div class="offer-merchant">${o.merchantName}</div>
        ${ratingRow(o)}
        <div class="offer-price-row">
          <span class="price-now">$${o.price}</span>
          <span class="price-was">$${o.original}</span>
          <span class="discount-badge">${o.soldOut ? 'Sold out' : pct + '% off'}</span>
        </div>
        <button class="view-btn" ${o.soldOut ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : `onclick="openOffer(${o.id})"`}>${o.soldOut ? 'Sold out' : 'View offer'}</button>
      </div>
    </div>`;
  }).join('');
}

function termsToBullets(terms) {
  if (!terms) return [];
  const parts = terms.split(/(?<=[.;])\s+/).map(s => s.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [terms];
}

function openOffer(id) {
  currentOffer = window.__offersCache.find(o => o.id === id);
  purchaseQty = 1;
  const pct = Math.round((1 - currentOffer.price / currentOffer.original) * 100);
  const saved = (currentOffer.original - currentOffer.price).toFixed(2).replace(/\.00$/, '');
  document.getElementById('offerModalBody').innerHTML = `
    <div class="tk-crumb"><strong onclick="closeModal('offerModal')" style="cursor:pointer;">← ${currentOffer.category}</strong><span>/</span><span>${currentOffer.merchantName}</span></div>
    <div class="tk-detail-body">
      <div>
        <div class="tk-hero-img">${currentOffer.imageUrl ? `<img src="${currentOffer.imageUrl}" alt="${currentOffer.title}" />` : 'Offer photo'}</div>
        <div class="tk-eyebrow">${currentOffer.category} · ${currentOffer.merchantName}</div>
        <h2 class="tk-title">${currentOffer.title}</h2>
        <div class="tk-merchant-row">
          <span class="tk-avatar">${currentOffer.merchantInitials || '??'}</span>
          ${currentOffer.merchantName}
          ${currentOffer.reviewCount ? `<span class="stars">${starString(currentOffer.avgRating)}</span><strong>${currentOffer.avgRating}</strong>(${currentOffer.reviewCount})` : '<span style="color:var(--ink-faint);">No reviews yet</span>'}
        </div>
        <div class="tk-perf-h">
          <div class="tk-eyebrow" style="margin-top:0;">The fine print</div>
          <div class="tk-terms-list">
            ${termsToBullets(currentOffer.terms).map(t => `<div><span>·</span>${t}</div>`).join('')}
          </div>
        </div>
        <div class="tk-perf-h">
          <div class="tk-eyebrow" style="margin-top:0;">What people said</div>
          <div class="tk-review-grid" id="reviewsList">Loading...</div>
        </div>
      </div>
      <div class="tk-panel tk-panel-sticky">
        <div class="tk-panel-eyebrow"><span>Voucher</span><span>${currentOffer.merchantName}</span></div>
        <div class="tk-panel-price"><span class="now">$${currentOffer.price}</span><span class="was">$${currentOffer.original}</span></div>
        <div class="tk-save-chip">You save $${saved} · ${pct}% off</div>
        <div class="tk-panel-perf"></div>
        <div class="tk-qty-row">
          <div class="tk-panel-eyebrow" style="font-size:10.5px;">Quantity</div>
          <div class="tk-qty-stepper">
            <button onclick="changeQty(-1)">−</button>
            <span id="qtyValue">1</span>
            <button onclick="changeQty(1)">+</button>
          </div>
        </div>
        <div class="tk-total-row">Total<span class="fig" id="qtyTotal">$${currentOffer.price}</span></div>
        <button class="tk-pill" onclick="startPurchase()">Buy voucher</button>
        <button class="tk-pill-ghost" onclick="startGift()">Send as a gift</button>
        <div class="tk-legal">Paid via simulated checkout for this build. Lands in your wallet instantly. Gift recipients need a Waffer account — we check the email before you pay.</div>
      </div>
    </div>
  `;
  openModal('offerModal');
  loadReviews(id);
}

async function loadReviews(offerId) {
  try {
    const { reviews } = await api(`/api/offers/${offerId}/reviews`);
    const el = document.getElementById('reviewsList');
    if (!el) return;
    el.innerHTML = reviews.length === 0 ? `<div style="color:var(--ink-faint);font-size:13.5px;">No reviews yet — be the first to redeem and share one.</div>` : reviews.map(r => `
      <div class="tk-review-card">
        <div class="stars">${starString(r.rating)}</div>
        ${r.comment ? `<p>${escapeHtml(r.comment)}</p>` : ''}
        <div class="meta">${escapeHtml(r.userName)} · ${fmtDate(r.createdAt)}</div>
      </div>
    `).join('');
  } catch (e) { /* ignore */ }
}

function changeQty(delta) {
  purchaseQty = Math.max(1, Math.min(20, purchaseQty + delta));
  document.getElementById('qtyValue').textContent = purchaseQty;
  document.getElementById('qtyTotal').textContent = '$' + (currentOffer.price * purchaseQty).toFixed(2).replace(/\.00$/, '');
}

function startPurchase() {
  if (!currentUser) { closeModal('offerModal'); openModal('authModal'); return; }
  closeModal('offerModal');
  window.__purchaseIdempotencyKey = crypto.randomUUID ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2));
  const total = (currentOffer.price * purchaseQty).toFixed(2).replace(/\.00$/, '');
  document.getElementById('purchaseSummary').innerHTML = `
    <div class="tk-line-item">
      <div class="tk-avatar">${currentOffer.merchantInitials || '??'}</div>
      <div class="info"><div class="t">${currentOffer.title}</div><div class="m">${currentOffer.merchantName} · qty ${purchaseQty}</div></div>
      <strong>$${total}</strong>
    </div>`;
  document.getElementById('purchaseTotalFig').textContent = '$' + total;
  document.getElementById('purchasePayBtn').textContent = 'Pay $' + total;
  document.getElementById('purchasePayBtn').disabled = false;
  openModal('purchaseModal');
}

const GIFT_OCCASIONS = [
  { id: 'birthday', emoji: '🎂', label: 'Birthday', c1: '#EC4899', c2: '#9D174D', defaultMsg: 'Happy birthday! Go treat yourself.' },
  { id: 'anniversary', emoji: '💜', label: 'Anniversary', c1: '#7C3AED', c2: '#4C1D95', defaultMsg: "Happy anniversary — here's to many more." },
  { id: 'congratulations', emoji: '🎉', label: 'Congrats', c1: '#F5A623', c2: '#B45309', defaultMsg: 'Congratulations! You earned this.' },
  { id: 'thankyou', emoji: '🙏', label: 'Thank You', c1: '#16A34A', c2: '#14532D', defaultMsg: 'Just a small thank you.' },
  { id: 'justbecause', emoji: '💛', label: 'Just Because', c1: '#EAB308', c2: '#854D0E', defaultMsg: 'Thinking of you — enjoy this!' },
  { id: 'newjob', emoji: '🎓', label: 'New Job / Grad', c1: '#2563EB', c2: '#1E3A8A', defaultMsg: 'So proud of you — congrats on this new chapter!' },
  { id: 'wedding', emoji: '💍', label: 'Wedding', c1: '#DB2777', c2: '#831843', defaultMsg: 'Wishing you both a lifetime of happiness.' }
];
let selectedOccasion = null;

function renderOccasionPicker() {
  document.getElementById('occasionPicker').innerHTML = GIFT_OCCASIONS.map(o => `
    <div class="occasion-card ${selectedOccasion === o.id ? 'active' : ''}" style="--c1:${o.c1};--c2:${o.c2};" onclick="selectOccasion('${o.id}')">
      <div class="occasion-emoji">${o.emoji}</div>
      <div class="occasion-label">${o.label}</div>
    </div>
  `).join('');
}

function selectOccasion(id) {
  selectedOccasion = selectedOccasion === id ? null : id;
  renderOccasionPicker();
  const occasion = GIFT_OCCASIONS.find(o => o.id === selectedOccasion);
  const msgBox = document.getElementById('giftMessage');
  if (occasion && !msgBox.value.trim()) msgBox.placeholder = occasion.defaultMsg;
  updateGiftPreview();
}

function startGift() {
  if (!currentUser) { closeModal('offerModal'); openModal('authModal'); return; }
  closeModal('offerModal');
  window.__giftIdempotencyKey = crypto.randomUUID ? crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(36).slice(2));
  document.getElementById('giftSummary').innerHTML = `
    <div class="tk-line-item">
      <div class="tk-avatar">${currentOffer.merchantInitials || '??'}</div>
      <div class="info"><div class="t">${currentOffer.title}</div><div class="m">${currentOffer.merchantName}</div></div>
      <strong>$${currentOffer.price}</strong>
    </div>`;
  document.getElementById('giftTotalFig').textContent = '$' + currentOffer.price;
  document.getElementById('giftEmail').value = '';
  document.getElementById('giftPhone').value = '';
  document.getElementById('giftMessage').value = '';
  document.getElementById('giftMessage').placeholder = 'Happy birthday!';
  document.getElementById('giftLookupNote').textContent = '';
  document.getElementById('giftPreviewPanel').style.display = 'none';
  document.getElementById('giftPayBtn').disabled = false;
  selectedOccasion = null;
  renderOccasionPicker();
  clearNotice('giftNotice');
  openModal('giftModal');
}

let giftLookupTimer = null;
async function checkGiftRecipient() {
  clearTimeout(giftLookupTimer);
  const email = document.getElementById('giftEmail').value.trim();
  const input = document.getElementById('giftEmail');
  const note = document.getElementById('giftLookupNote');
  input.classList.remove('valid');
  if (!email || !email.includes('@')) { note.textContent = ''; updateGiftPreview(); return; }
  giftLookupTimer = setTimeout(async () => {
    try {
      const { exists, name, isSelf } = await api('/api/users/lookup?email=' + encodeURIComponent(email));
      if (isSelf) {
        note.innerHTML = `<span style="color:var(--danger);font-weight:700;">You can't gift a voucher to yourself.</span>`;
      } else if (exists) {
        input.classList.add('valid');
        note.innerHTML = `<span style="color:var(--success);font-weight:700;">${name} has an account — good to go.</span>`;
      } else {
        note.innerHTML = `<span style="color:var(--gold-ink);font-weight:700;">No account yet — we'll email them to sign up and claim it.</span>`;
      }
      updateGiftPreview();
    } catch (e) { /* ignore */ }
  }, 400);
}

function updateGiftPreview() {
  const email = document.getElementById('giftEmail').value.trim();
  const panel = document.getElementById('giftPreviewPanel');
  if (!email) { panel.style.display = 'none'; return; }
  const message = document.getElementById('giftMessage').value.trim();
  const occasion = GIFT_OCCASIONS.find(o => o.id === selectedOccasion);
  panel.style.display = 'block';
  panel.style.background = occasion ? `linear-gradient(135deg, ${occasion.c1} 0%, ${occasion.c2} 100%)` : '';
  panel.innerHTML = `
    <div class="label">${occasion ? occasion.emoji + ' ' + occasion.label : "They'll see"}</div>
    <div class="headline">${currentUser ? escapeHtml(currentUser.name.split(' ')[0]) : 'You'} sent them ${escapeHtml(currentOffer.title)}</div>
    ${message ? `<div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:8px;font-style:italic;">"${message}"</div>` : ''}
    <div class="rule"></div>
    <div class="note">If they don't have an account yet, it sits as <strong>Pending claim</strong> until they sign up — cancel any time before then.</div>
  `;
}

async function completePurchase() {
  const payBtn = document.getElementById('purchasePayBtn');
  if (payBtn.disabled) return;
  payBtn.disabled = true;
  try {
    const { vouchers, total } = await api('/api/vouchers/purchase', { method: 'POST', body: { offerId: currentOffer.id, quantity: purchaseQty, idempotencyKey: window.__purchaseIdempotencyKey } });
    closeModal('purchaseModal');
    renderOffers();
    document.getElementById('purchaseSuccessTitle').textContent = vouchers.length > 1 ? `${vouchers.length} tickets, in your wallet` : 'One ticket, in your wallet';
    document.getElementById('purchaseSuccessSummary').textContent = `Show either code at ${currentOffer.merchantName}. Each one works once.`;
    document.getElementById('purchaseSuccessCodes').innerHTML = vouchers.map(v => `<div class="tk-code-chip">${v.code}</div>`).join('');
    document.getElementById('purchaseReceiptLine').textContent = currentUser ? `Receipt sent to ${currentUser.email}` : '';
    openModal('purchaseSuccessModal');
  } catch (e) {
    toast(e.message, 'error');
    payBtn.disabled = false;
  }
}

async function completeGift() {
  clearNotice('giftNotice');
  const recipientEmail = document.getElementById('giftEmail').value.trim();
  const phoneDigits = document.getElementById('giftPhone').value.trim();
  const giftCountryCode = document.getElementById('giftCountryCode').value;
  const recipientPhone = phoneDigits ? `${giftCountryCode}${phoneDigits}` : '';
  const message = document.getElementById('giftMessage').value.trim();
  if (!recipientEmail && !recipientPhone) {
    showNotice('giftNotice', "Enter the recipient's email or phone number.", 'error');
    return;
  }
  const payBtn = document.getElementById('giftPayBtn');
  if (payBtn.disabled) return;
  payBtn.disabled = true;
  try {
    const { claimed, recipientName } = await api('/api/vouchers/gift', { method: 'POST', body: { offerId: currentOffer.id, recipientEmail, recipientPhone, message, occasion: selectedOccasion, idempotencyKey: window.__giftIdempotencyKey } });
    closeModal('giftModal');
    renderOffers();
    if (claimed) {
      toast(`Gift sent to ${recipientName}.`, 'success');
    } else {
      toast(`Gift sent! They don't have a Waffer account yet, so we've emailed them to sign up and claim their voucher.`, 'success');
    }
  } catch (e) {
    showNotice('giftNotice', e.message, 'error');
    payBtn.disabled = false;
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
let walletFilter = 'all';
function setWalletFilter(f) { walletFilter = f; renderWalletList(); }

async function renderWallet() {
  const { vouchers, totalSaved } = await api('/api/vouchers/mine');
  window.__myVouchersCache = vouchers;
  const banner = document.getElementById('walletSavedBanner');
  if (totalSaved > 0) {
    banner.style.display = 'block';
    banner.innerHTML = `You've saved <span class="amount">$${totalSaved}</span> with Waffer so far 🎉`;
  } else {
    banner.style.display = 'none';
  }
  renderWalletList();

  const { vouchers: sent } = await api('/api/vouchers/sent');
  const sentEl = document.getElementById('sentList');
  if (sent.length === 0) { sentEl.innerHTML = `<div class="tk-empty"><p>You haven't sent any gifts yet.</p></div>`; return; }
  sentEl.innerHTML = sent.map(v => `
    <div class="tk-ticket-card">
      <div class="tk-ticket-top">
        <div class="tk-avatar">${(v.merchantName || '??').slice(0, 2).toUpperCase()}</div>
        <div class="info"><div class="t">${v.offerTitle}</div><div class="m">To ${escapeHtml(v.giftedTo || v.recipientEmail || v.recipientPhone || 'pending')} · $${v.price}</div></div>
        <span class="tk-state-badge ${v.status === 'pending-claim' ? 'tk-state-expiring' : 'tk-state-ready'}">${v.status === 'pending-claim' ? 'awaiting sign-up' : v.status}</span>
      </div>
      <div class="tk-ticket-bottom"><span class="code">${v.code}</span></div>
    </div>
  `).join('');
}

function isExpiringSoon(v) {
  if (v.status !== 'active' || !v.expiryDate) return false;
  const days = daysUntil(v.expiryDate);
  return days != null && days <= 14;
}

function renderWalletList() {
  const allVouchers = window.__myVouchersCache || [];
  const search = (document.getElementById('walletSearch').value || '').toLowerCase();
  let vouchers = search
    ? allVouchers.filter(v => v.offerTitle.toLowerCase().includes(search) || (v.merchantName || '').toLowerCase().includes(search))
    : allVouchers;

  const activeCount = vouchers.filter(v => v.status === 'active').length;
  const usedCount = vouchers.filter(v => v.status === 'redeemed').length;
  const expiringCount = vouchers.filter(isExpiringSoon).length;
  document.getElementById('walletFilterPills').innerHTML = `
    <span class="tk-filter-pill ${walletFilter === 'all' ? 'active' : ''}" onclick="setWalletFilter('all')">All ${vouchers.length}</span>
    <span class="tk-filter-pill ${walletFilter === 'active' ? 'active' : ''}" onclick="setWalletFilter('active')">Active ${activeCount}</span>
    <span class="tk-filter-pill ${walletFilter === 'expiring' ? 'active' : ''}" onclick="setWalletFilter('expiring')">Expiring soon ${expiringCount}</span>
    <span class="tk-filter-pill ${walletFilter === 'used' ? 'active' : ''}" onclick="setWalletFilter('used')">Used ${usedCount}</span>
  `;
  let filtered = vouchers;
  if (walletFilter === 'active') filtered = vouchers.filter(v => v.status === 'active');
  else if (walletFilter === 'used') filtered = vouchers.filter(v => v.status === 'redeemed');
  else if (walletFilter === 'expiring') filtered = vouchers.filter(isExpiringSoon);

  const sortMode = document.getElementById('walletSort').value;
  if (sortMode === 'expiry') {
    filtered = [...filtered].sort((a, b) => {
      const da = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
      const db = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
      return da - db;
    });
  } else {
    filtered = [...filtered].sort((a, b) => b.createdAt - a.createdAt);
  }

  const el = document.getElementById('walletList');
  if (filtered.length === 0) {
    el.innerHTML = `<div class="tk-empty"><p>${allVouchers.length === 0 ? 'No tickets yet.' : 'Nothing in this filter.'}</p><button class="tk-pill" style="max-width:200px;" onclick="switchView('customer')">Browse offers</button></div>`;
    return;
  }
  el.innerHTML = filtered.map(v => {
    if (v.status === 'redeemed') {
      return `
        <div class="tk-used-card">
          <div class="tile">${(v.merchantName || '??').slice(0, 2).toUpperCase()}</div>
          <div class="info"><div class="t" style="font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--ink);">${v.offerTitle}</div><div class="m" style="font-size:11.5px;color:var(--ink-faint);">Redeemed ${fmtDate(v.redeemedAt)}</div></div>
          <span class="tk-state-badge tk-state-used">Used</span>
          ${!v.hasReviewed ? `<button class="tk-cancel-link" onclick="openWalletReview(${v.offerId})">Rate it</button>` : ''}
        </div>`;
    }
    const badge = expiryBadge(v);
    return `
      <div class="tk-ticket-card">
        <div class="tk-ticket-top">
          <div class="tk-avatar">${(v.merchantName || '??').slice(0, 2).toUpperCase()}</div>
          <div class="info"><div class="t">${v.offerTitle}${v.giftedTo ? ' <span style="font-weight:400;color:var(--ink-faint);font-size:11px;">(gift)</span>' : ''}</div><div class="m">${v.merchantName}${v.expiryDate ? ' · until ' + v.expiryDate : ''}</div></div>
          ${badge ? `<span class="tk-state-badge tk-state-expiring">${badge}</span>` : `<span class="tk-state-badge tk-state-ready">Ready</span>`}
        </div>
        <div class="tk-ticket-bottom">
          <span class="code">${v.code}</span>
          <button class="tk-show-btn" onclick="showQR('${v.code}')">Show ticket</button>
        </div>
      </div>`;
  }).join('');
}

function openWalletReview(offerId) {
  const v = (window.__myVouchersCache || []).find(x => x.offerId === offerId);
  document.getElementById('wrOfferId').value = offerId;
  document.getElementById('walletReviewOfferTitle').textContent = v ? v.offerTitle : '';
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
  const v = (window.__myVouchersCache || []).find(x => x.code === code);
  document.getElementById('qrVoucherNo').textContent = v ? 'No. ' + v.code.replace(/[^0-9]/g, '').slice(-5) : '';
  document.getElementById('qrTitle').textContent = v ? v.offerTitle : 'Voucher';
  document.getElementById('qrMerchantLine').textContent = v ? v.merchantName : '';
  document.getElementById('qrCode').textContent = code;
  const container = document.getElementById('qrPattern');
  container.innerHTML = '';
  new QRCode(container, { text: code, width: 160, height: 160, colorDark: '#22063E', colorLight: '#FFFFFF' });
  openModal('qrModal');
}

/* ---------- Merchant redeem ---------- */
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
  document.getElementById('aMerchants').textContent = stats.merchants;
  loadOverview();

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
      <td><button class="row-btn" onclick='openEditMerchant(${m.id}, ${JSON.stringify(m.name)}, ${JSON.stringify(m.category)}, ${JSON.stringify(m.contact || "")}, ${JSON.stringify(m.email || "")})'>Edit</button></td>
    </tr>
  `).join('') || `<tr><td colspan="7" class="empty">No merchants yet.</td></tr>`;

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
      <td>${o.sold}</td><td>${o.status}${o.featured ? ' <span title="Deal of the day" style="color:var(--accent);">★</span>' : ''}</td>
      <td>
        <button class="row-btn" onclick="openEditOffer(${o.id})">Edit</button>
        <button class="row-btn" onclick="toggleOfferStatus(${o.id})">${o.status === 'Live' ? 'Pause' : 'Resume'}</button>
        <button class="row-btn" onclick="toggleFeatured(${o.id})">${o.featured ? 'Unfeature' : 'Feature'}</button>
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

async function toggleFeatured(id) {
  try {
    const { offer } = await api(`/api/admin/offers/${id}/feature`, { method: 'PATCH' });
    renderAdmin();
    toast(offer.featured ? 'Set as Deal of the Day.' : 'Removed from Deal of the Day.', 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
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
  document.getElementById('eoStartDate').value = o.startDate || '';
  document.getElementById('eoMaxInventory').value = o.maxInventory || '';
  document.getElementById('eoPerCustomerLimit').value = o.perCustomerLimit || '';
  document.querySelectorAll('.eo-redemption-day').forEach(el => {
    el.checked = Array.isArray(o.redemptionDays) && o.redemptionDays.includes(Number(el.value));
  });
  document.getElementById('eoHoursFrom').value = (o.redemptionHours && o.redemptionHours.from) || '';
  document.getElementById('eoHoursTo').value = (o.redemptionHours && o.redemptionHours.to) || '';
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
    terms: document.getElementById('eoTerms').value.trim(),
    startDate: document.getElementById('eoStartDate').value,
    maxInventory: document.getElementById('eoMaxInventory').value,
    perCustomerLimit: document.getElementById('eoPerCustomerLimit').value,
    redemptionDays: Array.from(document.querySelectorAll('.eo-redemption-day:checked')).map(el => Number(el.value)),
    redemptionHoursFrom: document.getElementById('eoHoursFrom').value,
    redemptionHoursTo: document.getElementById('eoHoursTo').value
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
      <table><thead><tr><th>Code</th><th>Buyer</th><th>Status</th><th>Purchased</th><th>Redeemed</th><th>Branch</th></tr></thead><tbody>
        ${d.vouchers.map(v => `<tr><td class="voucher-code">${v.code}</td><td>${escapeHtml(v.buyerName)}${v.isGift ? ' (gift)' : ''}</td><td><span class="status-pill status-${v.status}">${v.status}</span></td><td>${fmtDateTime(v.createdAt)}</td><td>${fmtDateTime(v.redeemedAt)}</td><td>${v.redeemedByLocation || '—'}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">No sales yet.</td></tr>'}
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
async function loadOverview() {
  const from = document.getElementById('ovFrom').value;
  const to = document.getElementById('ovTo').value;
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const ov = await api('/api/admin/finance/overview?' + params.toString());
  document.getElementById('aGMV').textContent = '$' + ov.gmv;
  document.getElementById('aVouchers').textContent = ov.vouchersSold;
  document.getElementById('aRedeemed').textContent = ov.vouchersRedeemed;
  renderTrendChart('ovTrendChart', ov.dailyTrend, 'gmv');
  renderTopList('ovTopOffers', ov.topOffers, 'title', 'revenue', '$');
  renderTopList('ovTopMerchants', ov.topMerchants, 'name', 'revenue', '$');
}

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
  const payoutMethod = document.getElementById('lpMethod').value;
  const note = document.getElementById('lpNote').value.trim();
  try {
    await api(`/api/admin/merchants/${merchantId}/payouts`, { method: 'POST', body: { amount, method: payoutMethod, note } });
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
  const email = document.getElementById('nmEmail').value.trim();
  const logoUrl = document.getElementById('nmLogoUrl').value.trim();
  try {
    const { merchant, managerUsername, tempPassword } = await api('/api/admin/merchants', { method: 'POST', body: { name, category, contact, email, logoUrl } });
    document.getElementById('nmName').value = '';
    document.getElementById('nmContact').value = '';
    document.getElementById('nmEmail').value = '';
    document.getElementById('nmLogoUrl').value = '';
    closeModal('newMerchantModal');
    renderAdmin();
    document.getElementById('credentialsBox').innerHTML = `Business: <strong>${merchant.name}</strong><br/>Role: <strong>Manager</strong><br/>Username: <strong>${managerUsername}</strong><br/>Password: <strong>${tempPassword}</strong>`;
    openModal('credentialsModal');
  } catch (e) {
    showNotice('merchantNotice', e.message, 'error');
  }
}

function openEditMerchant(id, name, category, contact, email) {
  document.getElementById('emId').value = id;
  document.getElementById('emName').value = name;
  document.getElementById('emCategory').innerHTML = (window.__categoriesCache || []).map(c => `<option ${c.name === category ? 'selected' : ''}>${c.name}</option>`).join('');
  document.getElementById('emContact').value = contact || '';
  document.getElementById('emEmail').value = email || '';
  clearNotice('editMerchantNotice');
  openModal('editMerchantModal');
}

async function saveMerchantEdit() {
  clearNotice('editMerchantNotice');
  const id = document.getElementById('emId').value;
  const body = {
    name: document.getElementById('emName').value.trim(),
    category: document.getElementById('emCategory').value,
    contact: document.getElementById('emContact').value.trim(),
    email: document.getElementById('emEmail').value.trim()
  };
  try {
    await api(`/api/admin/merchants/${id}`, { method: 'PATCH', body });
    closeModal('editMerchantModal');
    renderAdmin();
    toast('Merchant updated.', 'success');
  } catch (e) {
    showNotice('editMerchantNotice', e.message, 'error');
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
  const startDate = document.getElementById('noStartDate').value;
  const maxInventory = document.getElementById('noMaxInventory').value;
  const perCustomerLimit = document.getElementById('noPerCustomerLimit').value;
  const redemptionDays = Array.from(document.querySelectorAll('.no-redemption-day:checked')).map(el => Number(el.value));
  const redemptionHoursFrom = document.getElementById('noHoursFrom').value;
  const redemptionHoursTo = document.getElementById('noHoursTo').value;
  try {
    await api('/api/admin/offers', { method: 'POST', body: { merchantId, title, original, price, expiryDate, terms, startDate, maxInventory, perCustomerLimit, redemptionDays, redemptionHoursFrom, redemptionHoursTo } });
    ['noTitle', 'noOriginal', 'noPrice', 'noExpiry', 'noTerms', 'noStartDate', 'noMaxInventory', 'noPerCustomerLimit', 'noHoursFrom', 'noHoursTo'].forEach(id => document.getElementById(id).value = '');
    document.querySelectorAll('.no-redemption-day').forEach(el => el.checked = false);
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
  renderDealOfDay();

  const params = new URLSearchParams(location.search);
  const resetToken = params.get('resetToken');
  const verifyToken = params.get('verifyToken');
  const claimEmail = params.get('claimEmail');
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
  } else if (claimEmail && !currentUser) {
    openModal('authModal');
    setAuthTab('register');
    document.getElementById('regEmail').value = decodeURIComponent(claimEmail);
    toast('Create your account with this email to claim your gift!', 'success');
    history.replaceState({}, '', location.pathname);
  }
})();

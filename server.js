const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const DEFAULT_COMMISSION_RATE = 0.08;

function commissionRateFor(merchant) {
  return (merchant && typeof merchant.commissionRate === 'number') ? merchant.commissionRate : DEFAULT_COMMISSION_RATE;
}

const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
      cb(null, Date.now() + '-' + safe);
    }
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed.'));
    cb(null, true);
  }
});

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'waffer-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));
app.use(express.static(path.join(__dirname, 'public')));

const data = db.load();

/* ---------- Helpers ---------- */
function genVoucherCode() {
  const id = db.nextId('voucher');
  const rand = Math.random().toString(36).substr(2, 4).toUpperCase();
  return 'WQ-' + id.toString(36).toUpperCase() + rand;
}

function slugify(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 20) || 'merchant';
}

function generatePassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function money(n) {
  return Math.round(n * 100) / 100;
}

function reviewStats(offerId) {
  const list = data.reviews.filter(r => r.offerId === offerId);
  if (list.length === 0) return { avgRating: null, reviewCount: 0 };
  const avg = list.reduce((a, r) => a + r.rating, 0) / list.length;
  return { avgRating: Math.round(avg * 10) / 10, reviewCount: list.length };
}

function emailTemplate(heading, bodyHtml) {
  return `
  <div style="background:#FAFAFA;padding:30px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
      <div style="background:#00A86B;padding:22px 28px;">
        <span style="font-size:20px;font-weight:800;color:#FFFFFF;letter-spacing:-0.02em;">Waffer</span>
      </div>
      <div style="padding:28px;color:#1E293B;font-size:14px;line-height:1.6;">
        <h2 style="margin:0 0 14px;font-size:18px;color:#1E293B;">${heading}</h2>
        ${bodyHtml}
      </div>
      <div style="padding:18px 28px;background:#FAFAFA;border-top:1px solid #E5E7EB;font-size:11.5px;color:#64748B;">
        Waffer — discount vouchers from local businesses in Lebanon.<br/>
        This is an automated message, please don't reply directly to this email.
      </div>
    </div>
  </div>`;
}

function emailButton(text, link) {
  return `<div style="margin:22px 0;"><a href="${link}" style="background:#FF5722;color:#FFFFFF;text-decoration:none;padding:12px 26px;border-radius:8px;font-weight:700;font-size:14px;display:inline-block;">${text}</a></div>`;
}

async function sendEmail(to, subject, html) {
  if (!process.env.RESEND_API_KEY || !to) {
    console.log('Email skipped (no RESEND_API_KEY or recipient):', subject, '->', to);
    return;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from: 'Waffer <noreply@getwaffer.com>', to: [to], subject, html })
    });
    if (!res.ok) {
      const text = await res.text();
      console.log('Resend error:', res.status, text);
    }
  } catch (e) {
    console.log('Email send failed:', e.message);
  }
}

function currentUser(req) {
  if (!req.session.userId) return null;
  return data.users.find(u => u.id === req.session.userId) || null;
}

function currentMerchantAccount(req) {
  if (!req.session.merchantAccountId) return null;
  return data.merchantAccounts.find(a => a.id === req.session.merchantAccountId) || null;
}

function requireAuth(req, res, next) {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: 'Please log in first.' });
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  const user = currentUser(req);
  if (!user || !user.isAdmin) return res.status(403).json({ error: 'Admin access required.' });
  req.user = user;
  next();
}

function requireMerchant(req, res, next) {
  const account = currentMerchantAccount(req);
  if (!account) return res.status(401).json({ error: 'Please log in with your business account first.' });
  const business = data.merchants.find(m => m.id === account.merchantId);
  if (!business) return res.status(401).json({ error: 'Business account not found.' });
  req.merchantAccount = account;
  req.merchant = business;
  next();
}

function requireMerchantManager(req, res, next) {
  requireMerchant(req, res, () => {
    if (req.merchantAccount.role !== 'manager') {
      return res.status(403).json({ error: 'This area is only available to managerial accounts.' });
    }
    next();
  });
}

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, gender: u.gender || null, birthday: u.birthday || null, isAdmin: u.isAdmin, emailVerified: u.emailVerified !== false };
}

function publicMerchant(m) {
  return { id: m.id, name: m.name, category: m.category, contact: m.contact, logoUrl: m.logoUrl || null };
}

function publicMerchantAccount(a, business) {
  return { accountId: a.id, merchantId: a.merchantId, merchantName: business ? business.name : null, role: a.role, location: a.location || null, username: a.username };
}

function originOf(req) {
  return `${req.protocol}://${req.get('host')}`;
}

/* ---------- Customer auth ---------- */
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, countryCode, password } = req.body;
  const fullPhone = phone ? `${countryCode || ''}${phone}`.trim() : '';
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: 'Name, email, phone and password are required.' });
  }
  if (data.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'An account with that email already exists.' });
  }
  const id = db.nextId('user');
  const passwordHash = bcrypt.hashSync(password, 8);
  const verifyToken = crypto.randomBytes(24).toString('hex');
  const user = {
    id, name, email, phone: fullPhone, passwordHash, isAdmin: false, createdAt: Date.now(),
    gender: null, birthday: null, resetToken: null, resetTokenExpiry: null,
    emailVerified: false, verifyToken
  };
  data.users.push(user);

  const claimEmail = email.toLowerCase();
  const claimPhone = fullPhone.toLowerCase();
  let claimedCount = 0;
  data.vouchers.forEach(v => {
    if (v.status === 'pending-claim' &&
      ((v.recipientEmail && v.recipientEmail === claimEmail) ||
       (v.recipientPhone && claimPhone && v.recipientPhone === claimPhone))) {
      v.ownerId = id;
      v.status = 'active';
      v.giftedTo = name;
      v.recipientEmail = null;
      v.recipientPhone = null;
      claimedCount++;
    }
  });
  db.save();
  req.session.userId = id;

  const verifyLink = `${originOf(req)}/?verifyToken=${verifyToken}`;
  sendEmail(email, 'Verify your Waffer email',
    emailTemplate('Welcome to Waffer!', `<p>Hi ${name},</p><p>Thanks for signing up. Please confirm your email address to get full access to your account.</p>${emailButton('Verify my email', verifyLink)}<p style="color:#64748B;font-size:12.5px;">If the button doesn't work, copy this link: ${verifyLink}</p>`));

  res.json({ user: publicUser(user), claimedGifts: claimedCount });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = data.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user || !bcrypt.compareSync(password || '', user.passwordHash)) {
    return res.status(400).json({ error: 'Incorrect email or password.' });
  }
  req.session.userId = user.id;
  res.json({ user: publicUser(user) });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.userId = null;
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  const user = currentUser(req);
  res.json({ user: user ? publicUser(user) : null });
});

app.patch('/api/auth/profile', requireAuth, (req, res) => {
  const { name, phone, gender, birthday } = req.body;
  if (name) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;
  if (gender !== undefined) req.user.gender = gender;
  if (birthday !== undefined) req.user.birthday = birthday;
  db.save();
  res.json({ user: publicUser(req.user) });
});

app.post('/api/auth/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Enter your current and new password.' });
  if (!bcrypt.compareSync(currentPassword, req.user.passwordHash)) return res.status(400).json({ error: 'Current password is incorrect.' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  req.user.passwordHash = bcrypt.hashSync(newPassword, 8);
  db.save();
  res.json({ ok: true });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = data.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (user) {
    const token = crypto.randomBytes(24).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000;
    db.save();
    const link = `${originOf(req)}/?resetToken=${token}`;
    await sendEmail(user.email, 'Reset your Waffer password',
      emailTemplate('Reset your password', `<p>Hi ${user.name},</p><p>We got a request to reset your Waffer password. This link expires in 1 hour.</p>${emailButton('Reset my password', link)}<p style="color:#64748B;font-size:12.5px;">If you didn't request this, you can safely ignore this email.</p>`));
  }
  res.json({ ok: true, message: 'If that email is registered, a reset link has been sent.' });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Missing token or new password.' });
  const user = data.users.find(u => u.resetToken === token && u.resetTokenExpiry && u.resetTokenExpiry > Date.now());
  if (!user) return res.status(400).json({ error: 'This reset link is invalid or has expired.' });
  user.passwordHash = bcrypt.hashSync(newPassword, 8);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  db.save();
  res.json({ ok: true });
});

app.post('/api/auth/verify-email', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Missing verification token.' });
  const user = data.users.find(u => u.verifyToken === token);
  if (!user) return res.status(400).json({ error: 'This verification link is invalid or has already been used.' });
  user.emailVerified = true;
  user.verifyToken = null;
  db.save();
  res.json({ ok: true, user: publicUser(user) });
});

app.post('/api/auth/resend-verification', requireAuth, async (req, res) => {
  if (req.user.emailVerified) return res.json({ ok: true, message: 'Your email is already verified.' });
  const token = crypto.randomBytes(24).toString('hex');
  req.user.verifyToken = token;
  db.save();
  const verifyLink = `${originOf(req)}/?verifyToken=${token}`;
  await sendEmail(req.user.email, 'Verify your Waffer email',
    emailTemplate('Confirm your email', `<p>Hi ${req.user.name},</p><p>Please confirm your email address to get full access to your Waffer account.</p>${emailButton('Verify my email', verifyLink)}`));
  res.json({ ok: true, message: 'Verification email sent.' });
});

/* ---------- Merchant auth ---------- */
app.post('/api/merchant/login', (req, res) => {
  const { username, password } = req.body;
  const account = data.merchantAccounts.find(a => a.username && a.username.toLowerCase() === (username || '').toLowerCase());
  if (!account || !bcrypt.compareSync(password || '', account.passwordHash)) {
    return res.status(400).json({ error: 'Incorrect username or password.' });
  }
  const business = data.merchants.find(m => m.id === account.merchantId);
  req.session.merchantAccountId = account.id;
  res.json({ merchant: publicMerchantAccount(account, business) });
});

app.post('/api/merchant/logout', (req, res) => {
  req.session.merchantAccountId = null;
  res.json({ ok: true });
});

app.get('/api/merchant/me', (req, res) => {
  const account = currentMerchantAccount(req);
  const business = account ? data.merchants.find(m => m.id === account.merchantId) : null;
  res.json({ merchant: account ? publicMerchantAccount(account, business) : null });
});

app.post('/api/merchant/change-password', requireMerchant, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Enter your current and new password.' });
  if (!bcrypt.compareSync(currentPassword, req.merchantAccount.passwordHash)) return res.status(400).json({ error: 'Current password is incorrect.' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  req.merchantAccount.passwordHash = bcrypt.hashSync(newPassword, 8);
  req.merchantAccount.plainPassword = newPassword;
  db.save();
  res.json({ ok: true });
});

app.get('/api/merchant/voucher-lookup', requireMerchant, (req, res) => {
  const code = (req.query.code || '').trim().toUpperCase();
  if (!code) return res.status(400).json({ error: 'Enter a voucher code.' });
  const voucher = data.vouchers.find(v => v.code === code);
  if (!voucher) return res.status(404).json({ error: 'No voucher found with that code.' });
  const offer = data.offers.find(o => o.id === voucher.offerId);
  if (!offer || offer.merchantId !== req.merchant.id) {
    return res.status(403).json({ error: 'This voucher was not issued for your business.' });
  }
  res.json({
    voucher: {
      code: voucher.code, offerTitle: voucher.offerTitle, price: voucher.price,
      status: voucher.status, expiryDate: voucher.expiryDate, redeemedAt: voucher.redeemedAt
    }
  });
});

app.get('/api/merchant/dashboard', requireMerchantManager, (req, res) => {
  const myOffers = data.offers.filter(o => o.merchantId === req.merchant.id);
  const myOfferIds = myOffers.map(o => o.id);
  const myVouchers = data.vouchers.filter(v => myOfferIds.includes(v.offerId));
  const sold = myVouchers.length;
  const redeemed = myVouchers.filter(v => v.status === 'redeemed').length;
  const revenue = money(myVouchers.reduce((a, v) => a + v.price, 0));
  const rate = commissionRateFor(req.merchant);
  const commission = money(revenue * rate);
  const payout = money(revenue - commission);
  const offerBreakdown = myOffers.map(o => {
    const ov = myVouchers.filter(v => v.offerId === o.id);
    return { id: o.id, title: o.title, status: o.status, sold: ov.length, redeemed: ov.filter(v => v.status === 'redeemed').length, revenue: money(ov.length * o.price) };
  });
  const recent = myVouchers.map(v => {
    const buyer = data.users.find(u => u.id === v.buyerId);
    return { code: v.code, offerTitle: v.offerTitle, buyerName: buyer ? buyer.name : 'Unknown', price: v.price, status: v.status, createdAt: v.createdAt, redeemedAt: v.redeemedAt };
  }).sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
  res.json({ sold, redeemed, revenue, commission, payout, commissionRate: rate, offers: offerBreakdown, recent });
});

/* ---------- Categories (public read) ---------- */
app.get('/api/categories', (req, res) => {
  res.json({ categories: data.categories.map(c => c.name) });
});

/* ---------- Offers (public read) ---------- */
app.get('/api/offers', (req, res) => {
  const { category, search, minPrice, maxPrice, sort } = req.query;
  let list = data.offers.filter(o => o.status === 'Live');
  if (category && category !== 'All') list = list.filter(o => o.category === category);
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(o => {
      const merchant = data.merchants.find(m => m.id === o.merchantId);
      return o.title.toLowerCase().includes(s) || (merchant && merchant.name.toLowerCase().includes(s));
    });
  }
  if (minPrice) list = list.filter(o => o.price >= Number(minPrice));
  if (maxPrice) list = list.filter(o => o.price <= Number(maxPrice));

  if (sort === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
  else if (sort === 'newest') list = [...list].sort((a, b) => b.id - a.id);
  else if (sort === 'popular') list = [...list].sort((a, b) => b.sold - a.sold);

  const withMerchant = list.map(o => {
    const m = data.merchants.find(m => m.id === o.merchantId) || {};
    return { ...o, merchantName: m.name || 'Unknown', merchantInitials: m.initials || '??', merchantLogoUrl: m.logoUrl || null, ...reviewStats(o.id) };
  });
  res.json({ offers: withMerchant });
});

app.get('/api/offers/:id', (req, res) => {
  const offer = data.offers.find(o => o.id === Number(req.params.id));
  if (!offer) return res.status(404).json({ error: 'Offer not found.' });
  const merchant = data.merchants.find(m => m.id === offer.merchantId) || {};
  res.json({ offer: { ...offer, merchantName: merchant.name || 'Unknown', merchantInitials: merchant.initials || '??', merchantLogoUrl: merchant.logoUrl || null, ...reviewStats(offer.id) } });
});

/* ---------- Reviews ---------- */
app.get('/api/offers/:id/reviews', (req, res) => {
  const list = data.reviews.filter(r => r.offerId === Number(req.params.id)).sort((a, b) => b.createdAt - a.createdAt);
  res.json({ reviews: list, ...reviewStats(Number(req.params.id)) });
});

app.post('/api/offers/:id/reviews', requireAuth, (req, res) => {
  const offerId = Number(req.params.id);
  const offer = data.offers.find(o => o.id === offerId);
  if (!offer) return res.status(404).json({ error: 'Offer not found.' });
  const { rating, comment } = req.body;
  const r = Number(rating);
  if (!r || r < 1 || r > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  const hasRedeemed = data.vouchers.some(v => v.offerId === offerId && v.ownerId === req.user.id && v.status === 'redeemed');
  if (!hasRedeemed) return res.status(403).json({ error: 'You can only review offers you have actually redeemed.' });
  if (data.reviews.some(rv => rv.offerId === offerId && rv.userId === req.user.id)) {
    return res.status(400).json({ error: "You've already reviewed this offer." });
  }
  const id = db.nextId('review');
  const review = { id, offerId, userId: req.user.id, userName: req.user.name, rating: r, comment: (comment || '').trim().slice(0, 500), createdAt: Date.now() };
  data.reviews.push(review);
  db.save();
  res.json({ review, ...reviewStats(offerId) });
});

/* ---------- AI offer finder ---------- */
app.post('/api/ai/recommend', async (req, res) => {
  const { query } = req.body;
  if (!query || !query.trim()) return res.status(400).json({ error: "Tell us what you're looking for." });
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI search is not configured yet.' });
  }
  const liveOffers = data.offers.filter(o => o.status === 'Live').map(o => {
    const m = data.merchants.find(m => m.id === o.merchantId) || {};
    return { id: o.id, title: o.title, category: o.category, merchant: m.name, price: o.price, original: o.original, terms: (o.terms || '').slice(0, 80) };
  });
  const prompt = `You are Waffer's offer-matching assistant for a Lebanese discount voucher marketplace. Given this list of live offers as JSON:\n${JSON.stringify(liveOffers)}\n\nA user says: "${query}"\n\nPick the single best matching offer id. Respond with ONLY compact JSON, no markdown formatting, no text outside the JSON: {"offerId": <id or null>, "message": "<one short friendly sentence>"}. If nothing matches well, set offerId to null and briefly suggest what categories are available instead.`;
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const json = await resp.json();
    if (json.error) return res.status(502).json({ error: 'AI search failed: ' + json.error.message });
    let text = (json.content && json.content[0] && json.content[0].text) || '{}';
    text = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim();
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { offerId: null, message: "I couldn't quite match that — try browsing by category instead." }; }
    const matched = liveOffers.find(o => o.id === parsed.offerId);
    res.json({ offerId: matched ? matched.id : null, message: parsed.message || '' });
  } catch (e) {
    res.status(502).json({ error: 'AI search failed. Try again in a moment.' });
  }
});

/* ---------- Vouchers ---------- */
app.post('/api/vouchers/purchase', requireAuth, (req, res) => {
  const { offerId, quantity } = req.body;
  const qty = Math.max(1, Math.min(20, Number(quantity) || 1));
  const offer = data.offers.find(o => o.id === Number(offerId));
  if (!offer || offer.status !== 'Live') return res.status(400).json({ error: 'Offer is not available.' });
  const merchant = data.merchants.find(m => m.id === offer.merchantId) || {};
  const discountPct = Math.round((1 - offer.price / offer.original) * 100);
  const vouchers = [];
  for (let i = 0; i < qty; i++) {
    const code = genVoucherCode();
    const voucher = {
      id: code, code, offerId: offer.id, offerTitle: offer.title, price: offer.price, original: offer.original,
      merchantName: merchant.name, discountPct, expiryDate: offer.expiryDate || null,
      ownerId: req.user.id, buyerId: req.user.id, status: 'active',
      giftedTo: null, recipientEmail: null, recipientPhone: null, createdAt: Date.now(), redeemedAt: null
    };
    data.vouchers.push(voucher);
    vouchers.push(voucher);
  }
  offer.sold += qty;
  db.save();

  const codeList = vouchers.map(v => `<div style="background:#FAFAFA;border-radius:8px;padding:10px 14px;margin-bottom:8px;font-family:'Courier New',monospace;font-weight:700;font-size:15px;text-align:center;letter-spacing:1px;color:#1E293B;">${v.code}</div>`).join('');
  sendEmail(req.user.email, 'Your Waffer purchase confirmation',
    emailTemplate('Payment confirmed', `
      <p>Hi ${req.user.name},</p>
      <p>Thanks for your purchase! Here's your receipt:</p>
      <table style="width:100%;margin:16px 0;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#64748B;">Offer</td><td style="padding:6px 0;text-align:right;font-weight:700;">${offer.title}</td></tr>
        <tr><td style="padding:6px 0;color:#64748B;">Merchant</td><td style="padding:6px 0;text-align:right;">${merchant.name || 'the merchant'}</td></tr>
        <tr><td style="padding:6px 0;color:#64748B;">Quantity</td><td style="padding:6px 0;text-align:right;">${qty} &times; $${offer.price}</td></tr>
        <tr><td style="padding:8px 0;color:#1E293B;font-weight:700;border-top:1px solid #E5E7EB;">Total</td><td style="padding:8px 0;text-align:right;font-weight:800;border-top:1px solid #E5E7EB;">$${money(offer.price * qty)}</td></tr>
      </table>
      <p style="margin-bottom:8px;">Your voucher code${qty > 1 ? 's' : ''}:</p>
      ${codeList}
      <p style="color:#64748B;font-size:12.5px;">Valid until: ${offer.expiryDate || 'no expiry set'}. Find these anytime in your Waffer wallet.</p>
    `));

  res.json({ vouchers, total: money(offer.price * qty) });
});

app.post('/api/vouchers/gift', requireAuth, async (req, res) => {
  const { offerId, recipientEmail, recipientPhone, message } = req.body;
  const offer = data.offers.find(o => o.id === Number(offerId));
  if (!offer || offer.status !== 'Live') return res.status(400).json({ error: 'Offer is not available.' });
  const email = (recipientEmail || '').trim().toLowerCase();
  const phone = (recipientPhone || '').trim().toLowerCase();
  if (!email && !phone) return res.status(400).json({ error: "Enter the recipient's email or phone number." });

  const recipient = data.users.find(u =>
    (email && u.email && u.email.toLowerCase() === email) ||
    (phone && u.phone && u.phone.toLowerCase() === phone)
  );
  if (recipient && recipient.id === req.user.id) {
    return res.status(400).json({ error: "You can't gift a voucher to yourself." });
  }

  const merchant = data.merchants.find(m => m.id === offer.merchantId) || {};
  const discountPct = Math.round((1 - offer.price / offer.original) * 100);
  const code = genVoucherCode();
  const voucher = {
    id: code, code, offerId: offer.id, offerTitle: offer.title, price: offer.price, original: offer.original,
    merchantName: merchant.name, discountPct, expiryDate: offer.expiryDate || null,
    ownerId: recipient ? recipient.id : null,
    buyerId: req.user.id,
    status: recipient ? 'active' : 'pending-claim',
    giftedTo: recipient ? recipient.name : null,
    recipientEmail: recipient ? null : (email || null),
    recipientPhone: recipient ? null : (phone || null),
    giftMessage: message || null, createdAt: Date.now(), redeemedAt: null
  };
  data.vouchers.push(voucher);
  offer.sold += 1;
  db.save();

  if (recipient && recipient.email) {
    sendEmail(recipient.email, 'You received a Waffer gift!',
      emailTemplate('You got a gift! 🎁', `
        <p>Hi ${recipient.name},</p>
        <p><strong>${req.user.name}</strong> sent you a voucher:</p>
        <p style="font-size:16px;font-weight:700;margin:14px 0 4px;">${offer.title}</p>
        <p style="color:#64748B;margin-top:0;">from ${voucher.merchantName}</p>
        ${voucher.giftMessage ? `<div style="background:#FAFAFA;border-radius:8px;padding:12px 16px;margin:14px 0;font-style:italic;color:#1E293B;">"${voucher.giftMessage}"</div>` : ''}
        <div style="background:#FAFAFA;border-radius:8px;padding:10px 14px;margin:14px 0;font-family:'Courier New',monospace;font-weight:700;font-size:15px;text-align:center;letter-spacing:1px;">${code}</div>
        <p style="color:#64748B;font-size:12.5px;">Find it anytime in your Waffer wallet.</p>
      `));
  } else if (email) {
    sendEmail(email, "You've received a gift on Waffer!",
      emailTemplate('Someone sent you a gift! 🎁', `
        <p><strong>${req.user.name}</strong> sent you a voucher:</p>
        <p style="font-size:16px;font-weight:700;margin:14px 0 4px;">${offer.title}</p>
        <p style="color:#64748B;margin-top:0;">from ${voucher.merchantName}</p>
        ${voucher.giftMessage ? `<div style="background:#FAFAFA;border-radius:8px;padding:12px 16px;margin:14px 0;font-style:italic;color:#1E293B;">"${voucher.giftMessage}"</div>` : ''}
        <p>Create a free Waffer account using this email address to claim it:</p>
        ${emailButton('Create my account', originOf(req))}
      `));
  }

  res.json({ voucher, claimed: !!recipient, recipientName: recipient ? recipient.name : null });
});

app.get('/api/vouchers/mine', requireAuth, (req, res) => {
  const mine = data.vouchers.filter(v => v.ownerId === req.user.id).map(v => ({
    ...v,
    hasReviewed: data.reviews.some(r => r.offerId === v.offerId && r.userId === req.user.id)
  }));
  res.json({ vouchers: mine });
});

app.get('/api/vouchers/sent', requireAuth, (req, res) => {
  const sent = data.vouchers.filter(v => v.buyerId === req.user.id && v.ownerId !== req.user.id);
  res.json({ vouchers: sent });
});

app.post('/api/vouchers/redeem', requireMerchant, (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Enter a voucher code.' });
  const voucher = data.vouchers.find(v => v.code === code.trim().toUpperCase());
  if (!voucher) return res.status(404).json({ error: 'No voucher found with that code.' });
  const offer = data.offers.find(o => o.id === voucher.offerId);
  if (!offer || offer.merchantId !== req.merchant.id) {
    return res.status(403).json({ error: 'This voucher was not issued for your business.' });
  }
  if (voucher.status === 'redeemed') return res.status(400).json({ error: 'This voucher has already been redeemed.' });
  if (voucher.status === 'pending-claim') return res.status(400).json({ error: 'This voucher has not been claimed by its recipient yet.' });
  voucher.status = 'redeemed';
  voucher.redeemedAt = Date.now();
  db.save();
  res.json({ ok: true, voucher });
});

/* ---------- Admin ---------- */
app.get('/api/admin/categories', requireAdmin, (req, res) => {
  res.json({ categories: data.categories });
});

app.post('/api/admin/categories', requireAdmin, (req, res) => {
  const { name } = req.body;
  const trimmed = (name || '').trim();
  if (!trimmed) return res.status(400).json({ error: 'Enter a category name.' });
  if (data.categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
    return res.status(400).json({ error: 'That category already exists.' });
  }
  const id = db.nextId('category');
  const category = { id, name: trimmed };
  data.categories.push(category);
  db.save();
  res.json({ category });
});

app.delete('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const category = data.categories.find(c => c.id === Number(req.params.id));
  if (!category) return res.status(404).json({ error: 'Category not found.' });
  const inUse = data.offers.some(o => o.category === category.name) || data.merchants.some(m => m.category === category.name);
  data.categories = data.categories.filter(c => c.id !== category.id);
  db.save();
  res.json({ ok: true, wasInUse: inUse });
});

app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const gmv = data.offers.reduce((a, o) => a + o.sold * o.price, 0);
  const soldCount = data.offers.reduce((a, o) => a + o.sold, 0);
  const redeemed = data.vouchers.filter(v => v.status === 'redeemed').length;
  res.json({ gmv, merchants: data.merchants.length, soldCount, redeemed });
});

app.get('/api/admin/merchants', requireAdmin, (req, res) => {
  res.json({ merchants: data.merchants });
});

app.post('/api/admin/merchants', requireAdmin, (req, res) => {
  const { name, category, contact, logoUrl } = req.body;
  if (!name || !category || !contact) return res.status(400).json({ error: 'Name, category and contact are required.' });
  const id = db.nextId('merchant');
  const merchant = { id, name, category, contact, initials: name.slice(0, 2).toUpperCase(), logoUrl: logoUrl || null };
  data.merchants.push(merchant);

  let username = slugify(name);
  let base = username, n = 1;
  while (data.merchantAccounts.some(a => a.username === username)) { username = base + n; n++; }
  const tempPassword = generatePassword();
  const accountId = db.nextId('merchantAccount');
  const account = { id: accountId, merchantId: id, role: 'manager', location: null, username, passwordHash: bcrypt.hashSync(tempPassword, 8), plainPassword: tempPassword };
  data.merchantAccounts.push(account);

  db.save();
  res.json({ merchant, managerUsername: username, tempPassword });
});

app.get('/api/admin/merchants/:id/accounts', requireAdmin, (req, res) => {
  const merchantId = Number(req.params.id);
  const accounts = data.merchantAccounts.filter(a => a.merchantId === merchantId).map(a => ({ ...a, passwordHash: undefined }));
  res.json({ accounts });
});

app.post('/api/admin/merchants/:id/accounts', requireAdmin, (req, res) => {
  const merchantId = Number(req.params.id);
  const merchant = data.merchants.find(m => m.id === merchantId);
  if (!merchant) return res.status(404).json({ error: 'Merchant not found.' });
  const { location } = req.body;
  if (!location || !location.trim()) return res.status(400).json({ error: 'Enter a branch/location name.' });

  let username = slugify(merchant.name) + '-' + slugify(location);
  let base = username, n = 1;
  while (data.merchantAccounts.some(a => a.username === username)) { username = base + n; n++; }
  const tempPassword = generatePassword();
  const accountId = db.nextId('merchantAccount');
  const account = { id: accountId, merchantId, role: 'frontdesk', location: location.trim(), username, passwordHash: bcrypt.hashSync(tempPassword, 8), plainPassword: tempPassword };
  data.merchantAccounts.push(account);
  db.save();
  res.json({ account: { ...account, passwordHash: undefined }, tempPassword });
});

app.patch('/api/admin/merchants/:merchantId/accounts/:accountId', requireAdmin, (req, res) => {
  const account = data.merchantAccounts.find(a => a.id === Number(req.params.accountId) && a.merchantId === Number(req.params.merchantId));
  if (!account) return res.status(404).json({ error: 'Account not found.' });
  const { username, password, regenerate } = req.body;
  if (username && username.trim()) {
    const newUsername = username.trim().toLowerCase();
    if (data.merchantAccounts.some(a => a.id !== account.id && a.username === newUsername)) {
      return res.status(400).json({ error: 'That username is already taken.' });
    }
    account.username = newUsername;
  }
  let newPlainPassword = null;
  if (regenerate) {
    newPlainPassword = generatePassword();
  } else if (password && password.trim()) {
    if (password.trim().length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    newPlainPassword = password.trim();
  }
  if (newPlainPassword) {
    account.passwordHash = bcrypt.hashSync(newPlainPassword, 8);
    account.plainPassword = newPlainPassword;
  }
  db.save();
  res.json({ account: { ...account, passwordHash: undefined } });
});

app.delete('/api/admin/merchants/:merchantId/accounts/:accountId', requireAdmin, (req, res) => {
  const account = data.merchantAccounts.find(a => a.id === Number(req.params.accountId) && a.merchantId === Number(req.params.merchantId));
  if (!account) return res.status(404).json({ error: 'Account not found.' });
  if (account.role === 'manager') return res.status(400).json({ error: "The manager account can't be deleted here." });
  data.merchantAccounts = data.merchantAccounts.filter(a => a.id !== account.id);
  db.save();
  res.json({ ok: true });
});

app.patch('/api/admin/merchants/:id/commission', requireAdmin, (req, res) => {
  const merchant = data.merchants.find(m => m.id === Number(req.params.id));
  if (!merchant) return res.status(404).json({ error: 'Merchant not found.' });
  const { rate } = req.body;
  if (rate === null || rate === '' || rate === undefined) {
    merchant.commissionRate = null;
  } else {
    const r = Number(rate);
    if (isNaN(r) || r < 0 || r > 0.5) return res.status(400).json({ error: 'Commission rate must be between 0% and 50%.' });
    merchant.commissionRate = r;
  }
  db.save();
  res.json({ merchant });
});

app.patch('/api/admin/merchants/:id/logo', requireAdmin, (req, res) => {
  const merchant = data.merchants.find(m => m.id === Number(req.params.id));
  if (!merchant) return res.status(404).json({ error: 'Merchant not found.' });
  merchant.logoUrl = req.body.logoUrl || null;
  db.save();
  res.json({ merchant });
});

app.post('/api/admin/merchants/:id/logo-upload', requireAdmin, (req, res) => {
  upload.single('logo')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Upload failed.' });
    const merchant = data.merchants.find(m => m.id === Number(req.params.id));
    if (!merchant) return res.status(404).json({ error: 'Merchant not found.' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    merchant.logoUrl = '/uploads/' + req.file.filename;
    db.save();
    res.json({ merchant });
  });
});

app.post('/api/admin/offers/:id/image-upload', requireAdmin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Upload failed.' });
    const offer = data.offers.find(o => o.id === Number(req.params.id));
    if (!offer) return res.status(404).json({ error: 'Offer not found.' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    offer.imageUrl = '/uploads/' + req.file.filename;
    db.save();
    res.json({ offer });
  });
});

app.get('/api/admin/offers', requireAdmin, (req, res) => {
  const withMerchant = data.offers.map(o => ({
    ...o, merchantName: (data.merchants.find(m => m.id === o.merchantId) || {}).name
  }));
  res.json({ offers: withMerchant });
});

app.get('/api/admin/offers/:id/detail', requireAdmin, (req, res) => {
  const offer = data.offers.find(o => o.id === Number(req.params.id));
  if (!offer) return res.status(404).json({ error: 'Offer not found.' });
  const merchant = data.merchants.find(m => m.id === offer.merchantId) || {};
  const vouchers = data.vouchers.filter(v => v.offerId === offer.id);
  const sold = vouchers.length;
  const redeemed = vouchers.filter(v => v.status === 'redeemed').length;
  const revenue = money(vouchers.reduce((a, v) => a + v.price, 0));
  const rate = commissionRateFor(merchant);
  const commission = money(revenue * rate);
  const payout = money(revenue - commission);
  const buyerRows = vouchers.map(v => {
    const buyer = data.users.find(u => u.id === v.buyerId);
    return {
      code: v.code, buyerName: buyer ? buyer.name : 'Unknown', buyerEmail: buyer ? buyer.email : '',
      status: v.status, createdAt: v.createdAt, redeemedAt: v.redeemedAt,
      isGift: !!v.giftedTo || !!v.recipientEmail || !!v.recipientPhone
    };
  }).sort((a, b) => b.createdAt - a.createdAt);
  res.json({ offer, merchantName: merchant.name, sold, redeemed, revenue, commission, payout, commissionRate: rate, vouchers: buyerRows });
});

app.post('/api/admin/offers', requireAdmin, (req, res) => {
  const { merchantId, title, category, original, price, terms, expiryDate } = req.body;
  if (!merchantId || !title || !price) return res.status(400).json({ error: 'Merchant, title and price are required.' });
  const merchant = data.merchants.find(m => m.id === Number(merchantId));
  if (!merchant) return res.status(400).json({ error: 'Merchant not found.' });
  const id = db.nextId('offer');
  const offer = {
    id, merchantId: merchant.id, title, category: category || merchant.category,
    original: Number(original) || Number(price), price: Number(price),
    sold: 0, status: 'Live', terms: terms || 'Terms to be confirmed with merchant.',
    expiryDate: expiryDate || null
  };
  data.offers.push(offer);
  db.save();
  res.json({ offer });
});

app.patch('/api/admin/offers/:id', requireAdmin, (req, res) => {
  const offer = data.offers.find(o => o.id === Number(req.params.id));
  if (!offer) return res.status(404).json({ error: 'Offer not found.' });
  const { title, category, original, price, terms, expiryDate } = req.body;
  if (title) offer.title = title;
  if (category) offer.category = category;
  if (original) offer.original = Number(original);
  if (price) offer.price = Number(price);
  if (terms) offer.terms = terms;
  if (expiryDate !== undefined) offer.expiryDate = expiryDate || null;
  db.save();
  res.json({ offer });
});

app.patch('/api/admin/offers/:id/toggle', requireAdmin, (req, res) => {
  const offer = data.offers.find(o => o.id === Number(req.params.id));
  if (!offer) return res.status(404).json({ error: 'Offer not found.' });
  offer.status = offer.status === 'Live' ? 'Paused' : 'Live';
  db.save();
  res.json({ offer });
});

/* ---------- Finance ---------- */
function inRange(ts, from, to) {
  if (from && ts < new Date(from).getTime()) return false;
  if (to && ts > new Date(to).getTime() + 24 * 60 * 60 * 1000 - 1) return false;
  return true;
}

function merchantOutstanding(merchantId) {
  const myOffers = data.offers.filter(o => o.merchantId === merchantId);
  const myOfferIds = myOffers.map(o => o.id);
  const merchant = data.merchants.find(m => m.id === merchantId);
  const rate = commissionRateFor(merchant);
  const lifetimeRevenue = money(data.vouchers.filter(v => myOfferIds.includes(v.offerId)).reduce((a, v) => a + v.price, 0));
  const lifetimeCommission = money(lifetimeRevenue * rate);
  const lifetimeNetOwed = money(lifetimeRevenue - lifetimeCommission);
  const totalPaid = money(data.payouts.filter(p => p.merchantId === merchantId).reduce((a, p) => a + p.amount, 0));
  return { lifetimeRevenue, lifetimeCommission, lifetimeNetOwed, totalPaid, outstanding: money(lifetimeNetOwed - totalPaid) };
}

app.get('/api/admin/finance/overview', requireAdmin, (req, res) => {
  const { from, to } = req.query;
  const vouchersInRange = data.vouchers.filter(v => inRange(v.createdAt, from, to));
  let gmv = 0, commissionTotal = 0;
  vouchersInRange.forEach(v => {
    const offer = data.offers.find(o => o.id === v.offerId);
    const merchant = offer ? data.merchants.find(m => m.id === offer.merchantId) : null;
    const rate = commissionRateFor(merchant);
    gmv += v.price;
    commissionTotal += v.price * rate;
  });
  gmv = money(gmv);
  commissionTotal = money(commissionTotal);
  const payoutOwedForPeriod = money(gmv - commissionTotal);
  const totalOutstandingAllTime = money(data.merchants.reduce((a, m) => a + merchantOutstanding(m.id).outstanding, 0));

  const byCategory = {};
  vouchersInRange.forEach(v => {
    const offer = data.offers.find(o => o.id === v.offerId);
    const cat = offer ? offer.category : 'Unknown';
    byCategory[cat] = (byCategory[cat] || 0) + v.price;
  });
  const categoryBreakdown = Object.entries(byCategory).map(([category, revenue]) => ({ category, revenue: money(revenue) })).sort((a, b) => b.revenue - a.revenue);

  const merchantTotals = {};
  vouchersInRange.forEach(v => {
    const offer = data.offers.find(o => o.id === v.offerId);
    if (!offer) return;
    merchantTotals[offer.merchantId] = (merchantTotals[offer.merchantId] || 0) + v.price;
  });
  const topMerchants = Object.entries(merchantTotals)
    .map(([id, revenue]) => ({ id: Number(id), name: (data.merchants.find(m => m.id === Number(id)) || {}).name || 'Unknown', revenue: money(revenue) }))
    .sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  res.json({
    gmv, commissionTotal, payoutOwedForPeriod, totalOutstandingAllTime,
    vouchersSold: vouchersInRange.length,
    vouchersRedeemed: vouchersInRange.filter(v => v.status === 'redeemed').length,
    categoryBreakdown, topMerchants
  });
});

app.get('/api/admin/finance/merchants', requireAdmin, (req, res) => {
  const { from, to } = req.query;
  const rows = data.merchants.map(merchant => {
    const myOfferIds = data.offers.filter(o => o.merchantId === merchant.id).map(o => o.id);
    const periodVouchers = data.vouchers.filter(v => myOfferIds.includes(v.offerId) && inRange(v.createdAt, from, to));
    const rate = commissionRateFor(merchant);
    const periodRevenue = money(periodVouchers.reduce((a, v) => a + v.price, 0));
    const periodCommission = money(periodRevenue * rate);
    const periodPayout = money(periodRevenue - periodCommission);
    const outstanding = merchantOutstanding(merchant.id);
    return {
      id: merchant.id, name: merchant.name, commissionRate: rate,
      periodRevenue, periodCommission, periodPayout,
      lifetimeOutstanding: outstanding.outstanding, totalPaid: outstanding.totalPaid
    };
  }).sort((a, b) => b.periodRevenue - a.periodRevenue);
  res.json({ merchants: rows });
});

app.get('/api/admin/merchants/:id/payouts', requireAdmin, (req, res) => {
  const merchantId = Number(req.params.id);
  const payouts = data.payouts.filter(p => p.merchantId === merchantId).sort((a, b) => b.createdAt - a.createdAt);
  res.json({ payouts, ...merchantOutstanding(merchantId) });
});

app.post('/api/admin/merchants/:id/payouts', requireAdmin, (req, res) => {
  const merchantId = Number(req.params.id);
  const merchant = data.merchants.find(m => m.id === merchantId);
  if (!merchant) return res.status(404).json({ error: 'Merchant not found.' });
  const { amount, note } = req.body;
  const amt = Number(amount);
  if (!amt || amt <= 0) return res.status(400).json({ error: 'Enter a valid payout amount.' });
  const id = db.nextId('payout');
  const payout = { id, merchantId, amount: money(amt), note: (note || '').trim().slice(0, 200), createdAt: Date.now() };
  data.payouts.push(payout);
  db.save();
  res.json({ payout, ...merchantOutstanding(merchantId) });
});

app.get('/api/admin/merchants/:id/invoice', requireAdmin, (req, res) => {
  const merchantId = Number(req.params.id);
  const merchant = data.merchants.find(m => m.id === merchantId);
  if (!merchant) return res.status(404).json({ error: 'Merchant not found.' });
  const { from, to } = req.query;
  const myOffers = data.offers.filter(o => o.merchantId === merchantId);
  const myOfferIds = myOffers.map(o => o.id);
  const vouchers = data.vouchers.filter(v => myOfferIds.includes(v.offerId) && inRange(v.createdAt, from, to));
  const rate = commissionRateFor(merchant);

  const perOffer = {};
  vouchers.forEach(v => {
    if (!perOffer[v.offerId]) perOffer[v.offerId] = { title: v.offerTitle, qty: 0, revenue: 0 };
    perOffer[v.offerId].qty += 1;
    perOffer[v.offerId].revenue += v.price;
  });
  const lineItems = Object.values(perOffer);
  const revenue = money(vouchers.reduce((a, v) => a + v.price, 0));
  const commission = money(revenue * rate);
  const netPayout = money(revenue - commission);
  const outstanding = merchantOutstanding(merchantId);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Waffer-Invoice-${merchant.name.replace(/[^a-zA-Z0-9]+/g, '-')}.pdf"`);

  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  doc.pipe(res);

  doc.rect(0, 0, doc.page.width, 90).fill('#00A86B');
  doc.fillColor('#FFFFFF').fontSize(24).font('Helvetica-Bold').text('Waffer', 50, 30);
  doc.fontSize(11).font('Helvetica').text('Merchant Payout Invoice', 50, 60);

  doc.fillColor('#1E293B').fontSize(11).font('Helvetica').moveDown(3);
  doc.font('Helvetica-Bold').text('Billed to:', 50, 115);
  doc.font('Helvetica').text(merchant.name, 50, 132);
  doc.text(merchant.contact || '', 50, 148);

  const periodLabel = (from || to) ? `${from || 'start'} to ${to || 'today'}` : 'All time';
  doc.font('Helvetica-Bold').text('Period:', 350, 115);
  doc.font('Helvetica').text(periodLabel, 350, 132);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 350, 148);

  let y = 190;
  doc.moveTo(50, y).lineTo(545, y).strokeColor('#E5E7EB').stroke();
  y += 12;
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#64748B');
  doc.text('Offer', 50, y);
  doc.text('Qty sold', 320, y, { width: 80, align: 'right' });
  doc.text('Revenue', 440, y, { width: 105, align: 'right' });
  y += 18;
  doc.moveTo(50, y).lineTo(545, y).strokeColor('#E5E7EB').stroke();
  y += 10;

  doc.font('Helvetica').fontSize(10).fillColor('#1E293B');
  if (lineItems.length === 0) {
    doc.text('No sales in this period.', 50, y);
    y += 20;
  } else {
    lineItems.forEach(item => {
      doc.text(item.title, 50, y, { width: 260 });
      doc.text(String(item.qty), 320, y, { width: 80, align: 'right' });
      doc.text(`$${money(item.revenue)}`, 440, y, { width: 105, align: 'right' });
      y += 20;
    });
  }

  y += 10;
  doc.moveTo(50, y).lineTo(545, y).strokeColor('#E5E7EB').stroke();
  y += 16;

  function summaryRow(label, value, bold) {
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(11).fillColor('#1E293B');
    doc.text(label, 350, y, { width: 100 });
    doc.text(value, 440, y, { width: 105, align: 'right' });
    y += 20;
  }
  summaryRow('Total revenue', `$${revenue}`);
  summaryRow(`Waffer commission (${Math.round(rate * 100)}%)`, `-$${commission}`);
  summaryRow('Net payout (this period)', `$${netPayout}`, true);
  y += 8;
  doc.moveTo(350, y).lineTo(545, y).strokeColor('#E5E7EB').stroke();
  y += 12;
  summaryRow('Already paid (lifetime)', `$${outstanding.totalPaid}`);
  summaryRow('Outstanding balance', `$${outstanding.outstanding}`, true);

  doc.fontSize(9).fillColor('#94A3B8').text(
    'This invoice reflects vouchers sold through the Waffer platform. Payment is settled outside the platform. Contact Waffer support with any questions.',
    50, 720, { width: 495 }
  );

  doc.end();
});

app.listen(PORT, () => {
  console.log(`Waffer server running on http://localhost:${PORT}`);
});

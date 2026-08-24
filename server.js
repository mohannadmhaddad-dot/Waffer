const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'waffer-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));
app.use(express.static(path.join(__dirname, 'public')));

const data = db.load();

function genVoucherCode() {
  const id = db.nextId('voucher');
  const rand = Math.random().toString(36).substr(2, 4).toUpperCase();
  return 'WQ-' + id.toString(36).toUpperCase() + rand;
}

function currentUser(req) {
  if (!req.session.userId) return null;
  return data.users.find(u => u.id === req.session.userId) || null;
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

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, isAdmin: u.isAdmin };
}

/* ---------- Auth ---------- */
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required.' });
  if (data.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'An account with that email already exists.' });
  }
  const id = db.nextId('user');
  const passwordHash = bcrypt.hashSync(password, 8);
  const user = { id, name, email, phone: phone || null, passwordHash, isAdmin: false, createdAt: Date.now() };
  data.users.push(user);
  db.save();
  req.session.userId = id;
  res.json({ user: publicUser(user) });
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
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/auth/me', (req, res) => {
  const user = currentUser(req);
  res.json({ user: user ? publicUser(user) : null });
});

/* ---------- Offers (public read) ---------- */
app.get('/api/offers', (req, res) => {
  const { category, search } = req.query;
  let list = data.offers.filter(o => o.status === 'Live');
  if (category && category !== 'All') list = list.filter(o => o.category === category);
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(o => {
      const merchant = data.merchants.find(m => m.id === o.merchantId);
      return o.title.toLowerCase().includes(s) || (merchant && merchant.name.toLowerCase().includes(s));
    });
  }
  const withMerchant = list.map(o => ({
    ...o,
    merchantName: (data.merchants.find(m => m.id === o.merchantId) || {}).name || 'Unknown',
    merchantInitials: (data.merchants.find(m => m.id === o.merchantId) || {}).initials || '??'
  }));
  res.json({ offers: withMerchant });
});

app.get('/api/offers/:id', (req, res) => {
  const offer = data.offers.find(o => o.id === Number(req.params.id));
  if (!offer) return res.status(404).json({ error: 'Offer not found.' });
  const merchant = data.merchants.find(m => m.id === offer.merchantId);
  res.json({ offer: { ...offer, merchantName: merchant ? merchant.name : 'Unknown', merchantInitials: merchant ? merchant.initials : '??' } });
});

/* ---------- Vouchers ---------- */
app.post('/api/vouchers/purchase', requireAuth, (req, res) => {
  const { offerId } = req.body;
  const offer = data.offers.find(o => o.id === Number(offerId));
  if (!offer || offer.status !== 'Live') return res.status(400).json({ error: 'Offer is not available.' });
  const code = genVoucherCode();
  const voucher = {
    id: code, code, offerId: offer.id, offerTitle: offer.title, price: offer.price,
    merchantName: (data.merchants.find(m => m.id === offer.merchantId) || {}).name,
    ownerId: req.user.id, buyerId: req.user.id, status: 'active',
    giftedTo: null, createdAt: Date.now(), redeemedAt: null
  };
  data.vouchers.push(voucher);
  offer.sold += 1;
  db.save();
  res.json({ voucher });
});

app.post('/api/vouchers/gift', requireAuth, (req, res) => {
  const { offerId, recipientContact, message } = req.body;
  const offer = data.offers.find(o => o.id === Number(offerId));
  if (!offer || offer.status !== 'Live') return res.status(400).json({ error: 'Offer is not available.' });
  if (!recipientContact) return res.status(400).json({ error: "Enter the recipient's phone or email." });
  const contact = recipientContact.trim().toLowerCase();
  const recipient = data.users.find(u =>
    (u.email && u.email.toLowerCase() === contact) || (u.phone && u.phone.toLowerCase() === contact)
  );
  if (!recipient) {
    return res.status(404).json({ error: "This contact doesn't match a registered Waffer account. The recipient needs to create an account first — gifts can't be claimed as a guest." });
  }
  if (recipient.id === req.user.id) {
    return res.status(400).json({ error: "You can't gift a voucher to yourself." });
  }
  const code = genVoucherCode();
  const voucher = {
    id: code, code, offerId: offer.id, offerTitle: offer.title, price: offer.price,
    merchantName: (data.merchants.find(m => m.id === offer.merchantId) || {}).name,
    ownerId: recipient.id, buyerId: req.user.id, status: 'active',
    giftedTo: recipient.name, giftMessage: message || null, createdAt: Date.now(), redeemedAt: null
  };
  data.vouchers.push(voucher);
  offer.sold += 1;
  db.save();
  res.json({ voucher, recipientName: recipient.name });
});

app.get('/api/vouchers/mine', requireAuth, (req, res) => {
  const mine = data.vouchers.filter(v => v.ownerId === req.user.id);
  res.json({ vouchers: mine });
});

app.post('/api/vouchers/redeem', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Enter a voucher code.' });
  const voucher = data.vouchers.find(v => v.code === code.trim().toUpperCase());
  if (!voucher) return res.status(404).json({ error: 'No voucher found with that code.' });
  if (voucher.status === 'redeemed') return res.status(400).json({ error: 'This voucher has already been redeemed.' });
  voucher.status = 'redeemed';
  voucher.redeemedAt = Date.now();
  db.save();
  res.json({ ok: true, voucher });
});

/* ---------- Admin ---------- */
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
  const { name, category, contact } = req.body;
  if (!name || !category || !contact) return res.status(400).json({ error: 'Name, category and contact are required.' });
  const id = db.nextId('merchant');
  const merchant = { id, name, category, contact };
  data.merchants.push(merchant);
  db.save();
  res.json({ merchant });
});

app.get('/api/admin/offers', requireAdmin, (req, res) => {
  const withMerchant = data.offers.map(o => ({
    ...o, merchantName: (data.merchants.find(m => m.id === o.merchantId) || {}).name
  }));
  res.json({ offers: withMerchant });
});

app.post('/api/admin/offers', requireAdmin, (req, res) => {
  const { merchantId, title, category, original, price, terms } = req.body;
  if (!merchantId || !title || !price) return res.status(400).json({ error: 'Merchant, title and price are required.' });
  const merchant = data.merchants.find(m => m.id === Number(merchantId));
  if (!merchant) return res.status(400).json({ error: 'Merchant not found.' });
  const id = db.nextId('offer');
  const offer = {
    id, merchantId: merchant.id, title, category: category || merchant.category,
    original: Number(original) || Number(price), price: Number(price),
    sold: 0, status: 'Live', terms: terms || 'Terms to be confirmed with merchant.'
  };
  data.offers.push(offer);
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

app.listen(PORT, () => {
  console.log(`Waffer server running on http://localhost:${PORT}`);
});

const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

const MERCHANT_DEFAULT_PASSWORD_HASH = '$2b$08$9pQ2IX1HsRdmazCaKERE3ObiYUGGRp.wDkjURAUADGMAQfD2BxKJm';

function seed() {
  const adminHash = bcrypt.hashSync('admin123', 8);
  const laylaHash = bcrypt.hashSync('demo1234', 8);
  const karimHash = bcrypt.hashSync('demo1234', 8);
  const mh = MERCHANT_DEFAULT_PASSWORD_HASH;
  const defaultExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const baseUser = { gender: null, birthday: null, resetToken: null, resetTokenExpiry: null, emailVerified: true, verifyToken: null };

  return {
    nextIds: { user: 4, merchant: 3, offer: 3, voucher: 1000, category: 5, review: 1, merchantAccount: 3, payout: 1 },
    categories: [
      { id: 1, name: 'Entertainment' },
      { id: 2, name: 'Restaurants' },
      { id: 3, name: 'Spa & Beauty' },
      { id: 4, name: 'Medical Checkups' },
    ],
    users: [
      { id: 1, name: 'Waffer Admin', email: 'admin@waffer.com', phone: null, passwordHash: adminHash, isAdmin: true, createdAt: Date.now(), ...baseUser },
      { id: 2, name: 'Layla Khoury', email: 'layla@example.com', phone: '+96170123456', passwordHash: laylaHash, isAdmin: false, createdAt: Date.now(), ...baseUser },
      { id: 3, name: 'Karim Aoun', email: 'karim@example.com', phone: '+96176554433', passwordHash: karimHash, isAdmin: false, createdAt: Date.now(), ...baseUser },
    ],
    merchants: [
      { id: 1, name: 'Grand Cinemas Hazmieh', category: 'Entertainment', contact: '+961 76 111 222', initials: 'GC', logoUrl: null, commissionRate: null },
      { id: 2, name: 'Em Sherif', category: 'Restaurants', contact: '+961 1 200 100', initials: 'ES', logoUrl: null, commissionRate: null },
    ],
    merchantAccounts: [
      { id: 1, merchantId: 1, role: 'manager', location: null, username: 'grandcinemas', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 2, merchantId: 2, role: 'manager', location: null, username: 'emsherif', passwordHash: mh, plainPassword: 'merchant123' },
    ],
    offers: [
      { id: 1, merchantId: 1, title: 'IMAX movie night for two', category: 'Entertainment', original: 40, price: 22, sold: 0, status: 'Live', terms: 'Valid on any standard screening, excludes premieres. Book at least 2 hours ahead.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 2, merchantId: 2, title: '3-course Lebanese dinner for two', category: 'Restaurants', original: 90, price: 55, sold: 0, status: 'Live', terms: 'Reservation required. Excludes beverages.', expiryDate: defaultExpiry, imageUrl: null },
    ],
    vouchers: [],
    reviews: [],
    payouts: [],
  };
}

let state = null;
let pendingSave = Promise.resolve();

async function ensureTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY, data JSONB NOT NULL)`);
}

async function load() {
  if (state) return state;
  await ensureTable();
  const res = await pool.query('SELECT data FROM app_state WHERE id = 1');
  if (res.rows.length > 0) {
    state = res.rows[0].data;
    console.log('Loaded existing data from Postgres.');
  } else {
    state = seed();
    await pool.query('INSERT INTO app_state (id, data) VALUES (1, $1)', [JSON.stringify(state)]);
    console.log('No existing data found — seeded fresh database.');
  }
  return state;
}

function save() {
  const snapshot = JSON.stringify(state);
  pendingSave = pendingSave
    .then(() => pool.query('UPDATE app_state SET data = $1 WHERE id = 1', [snapshot]))
    .catch(e => console.log('Database save failed:', e.message));
  return pendingSave;
}

async function flush() {
  await pendingSave;
}

function nextId(kind) {
  const id = state.nextIds[kind]++;
  save();
  return id;
}

module.exports = { load, save, nextId, flush, MERCHANT_DEFAULT_PASSWORD_HASH };

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

function seed() {
  const adminHash = bcrypt.hashSync('admin123', 8);
  const laylaHash = bcrypt.hashSync('demo1234', 8);
  const karimHash = bcrypt.hashSync('demo1234', 8);

  return {
    nextIds: { user: 4, merchant: 5, offer: 5, voucher: 1000 },
    users: [
      { id: 1, name: 'Waffer Admin', email: 'admin@waffer.com', phone: null, passwordHash: adminHash, isAdmin: true, createdAt: Date.now() },
      { id: 2, name: 'Layla Khoury', email: 'layla@example.com', phone: '+96170123456', passwordHash: laylaHash, isAdmin: false, createdAt: Date.now() },
      { id: 3, name: 'Karim Aoun', email: 'karim@example.com', phone: '+96176554433', passwordHash: karimHash, isAdmin: false, createdAt: Date.now() },
    ],
    merchants: [
      { id: 1, name: 'Grand Cinemas Hazmieh', category: 'Entertainment', contact: '+961 76 111 222' },
      { id: 2, name: 'Locked In Beirut', category: 'Entertainment', contact: '+961 71 222 333' },
      { id: 3, name: 'Sakura Beirut', category: 'Restaurants', contact: '+961 3 444 555' },
      { id: 4, name: 'Tawlet Souk el Tayeb', category: 'Restaurants', contact: '+961 1 555 666' },
    ],
    offers: [
      { id: 1, merchantId: 1, title: 'IMAX movie night for two', category: 'Entertainment', original: 40, price: 22, sold: 0, status: 'Live', terms: 'Valid on any standard screening, excludes premieres. Book at least 2 hours ahead.' },
      { id: 2, merchantId: 2, title: 'Escape room for 4 players', category: 'Entertainment', original: 80, price: 48, sold: 0, status: 'Live', terms: 'Advance booking required. Valid any day except public holidays.' },
      { id: 3, merchantId: 3, title: 'Sushi omakase for two', category: 'Restaurants', original: 90, price: 49, sold: 0, status: 'Live', terms: 'Reservation required. Valid Sun-Thu only. Excludes drinks.' },
      { id: 4, merchantId: 4, title: '3-course dinner for two', category: 'Restaurants', original: 65, price: 38, sold: 0, status: 'Live', terms: 'Excludes beverages. Not valid with other promotions.' },
    ],
    vouchers: [],
  };
}

let state = null;

function load() {
  if (state) return state;
  if (fs.existsSync(DB_PATH)) {
    state = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } else {
    state = seed();
    save();
  }
  return state;
}

function save() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2));
}

function nextId(kind) {
  const id = state.nextIds[kind]++;
  save();
  return id;
}

module.exports = { load, save, nextId, DB_PATH };

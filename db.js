const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'data', 'db.json');
const MERCHANT_DEFAULT_PASSWORD_HASH = '$2b$08$9pQ2IX1HsRdmazCaKERE3ObiYUGGRp.wDkjURAUADGMAQfD2BxKJm';

function seed() {
  const adminHash = bcrypt.hashSync('admin123', 8);
  const laylaHash = bcrypt.hashSync('demo1234', 8);
  const karimHash = bcrypt.hashSync('demo1234', 8);
  const mh = MERCHANT_DEFAULT_PASSWORD_HASH;

  return {
    nextIds: { user: 4, merchant: 25, offer: 25, voucher: 1000 },
    users: [
      { id: 1, name: 'Waffer Admin', email: 'admin@waffer.com', phone: null, passwordHash: adminHash, isAdmin: true, createdAt: Date.now() },
      { id: 2, name: 'Layla Khoury', email: 'layla@example.com', phone: '+96170123456', passwordHash: laylaHash, isAdmin: false, createdAt: Date.now() },
      { id: 3, name: 'Karim Aoun', email: 'karim@example.com', phone: '+96176554433', passwordHash: karimHash, isAdmin: false, createdAt: Date.now() },
    ],
    merchants: [
      { id: 1, name: 'Grand Cinemas Hazmieh', category: 'Entertainment', contact: '+961 76 111 222', initials: 'GC', username: 'grandcinemas', passwordHash: mh, logoUrl: null },
      { id: 2, name: 'VOX Cinemas City Centre', category: 'Entertainment', contact: '+961 71 222 333', initials: 'VX', username: 'voxcinemas', passwordHash: mh, logoUrl: null },
      { id: 3, name: 'Codex Adventures', category: 'Entertainment', contact: '+961 3 333 444', initials: 'CX', username: 'codexadventures', passwordHash: mh, logoUrl: null },
      { id: 4, name: 'Funscape Sin El Fil', category: 'Entertainment', contact: '+961 1 444 555', initials: 'FS', username: 'funscape', passwordHash: mh, logoUrl: null },
      { id: 5, name: 'Colonel Karting', category: 'Entertainment', contact: '+961 76 555 666', initials: 'CK', username: 'colonelkarting', passwordHash: mh, logoUrl: null },
      { id: 6, name: 'Element For Adventure', category: 'Entertainment', contact: '+961 71 666 777', initials: 'EA', username: 'elementadventure', passwordHash: mh, logoUrl: null },
      { id: 7, name: 'Em Sherif', category: 'Restaurants', contact: '+961 1 200 100', initials: 'ES', username: 'emsherif', passwordHash: mh, logoUrl: null },
      { id: 8, name: 'BeBabel', category: 'Restaurants', contact: '+961 1 200 200', initials: 'BB', username: 'bebabel', passwordHash: mh, logoUrl: null },
      { id: 9, name: 'Liza', category: 'Restaurants', contact: '+961 1 200 300', initials: 'LZ', username: 'liza', passwordHash: mh, logoUrl: null },
      { id: 10, name: 'T-Marbouta', category: 'Restaurants', contact: '+961 1 200 400', initials: 'TM', username: 'tmarbouta', passwordHash: mh, logoUrl: null },
      { id: 11, name: 'Mayrig', category: 'Restaurants', contact: '+961 1 200 500', initials: 'MY', username: 'mayrig', passwordHash: mh, logoUrl: null },
      { id: 12, name: 'Le Chef', category: 'Restaurants', contact: '+961 1 200 600', initials: 'LC', username: 'lechef', passwordHash: mh, logoUrl: null },
      { id: 13, name: 'Kimantra Spas', category: 'Spa & Beauty', contact: '+961 4 300 100', initials: 'KM', username: 'kimantraspas', passwordHash: mh, logoUrl: null },
      { id: 14, name: 'The Royal Spa', category: 'Spa & Beauty', contact: '+961 4 300 200', initials: 'RS', username: 'royalspa', passwordHash: mh, logoUrl: null },
      { id: 15, name: 'Jolie et Co', category: 'Spa & Beauty', contact: '+961 4 300 300', initials: 'JC', username: 'jolieetco', passwordHash: mh, logoUrl: null },
      { id: 16, name: 'Smallville Spa & Beauty', category: 'Spa & Beauty', contact: '+961 4 300 400', initials: 'SV', username: 'smallvillespa', passwordHash: mh, logoUrl: null },
      { id: 17, name: 'Vim & Vigor Badaro', category: 'Spa & Beauty', contact: '+961 4 300 500', initials: 'VV', username: 'vimvigor', passwordHash: mh, logoUrl: null },
      { id: 18, name: 'Movenpick Spa', category: 'Spa & Beauty', contact: '+961 4 300 600', initials: 'MP', username: 'movenpickspa', passwordHash: mh, logoUrl: null },
      { id: 19, name: 'St. Marc Medical & Diagnostic Center', category: 'Medical Checkups', contact: '+961 1 566 222', initials: 'SM', username: 'stmarclab', passwordHash: mh, logoUrl: null },
      { id: 20, name: 'MedLab', category: 'Medical Checkups', contact: '+961 1 700 100', initials: 'ML', username: 'medlab', passwordHash: mh, logoUrl: null },
      { id: 21, name: 'PHD Labs', category: 'Medical Checkups', contact: '+961 1 700 200', initials: 'PD', username: 'phdlabs', passwordHash: mh, logoUrl: null },
      { id: 22, name: 'Saint Michel Medical Laboratories', category: 'Medical Checkups', contact: '+961 4 521 601', initials: 'SM', username: 'saintmichel', passwordHash: mh, logoUrl: null },
      { id: 23, name: 'Fontana Laboratories', category: 'Medical Checkups', contact: '+961 1 700 400', initials: 'FL', username: 'fontanalab', passwordHash: mh, logoUrl: null },
      { id: 24, name: 'ABC Laboratories', category: 'Medical Checkups', contact: '+961 1 700 500', initials: 'AB', username: 'abclabs', passwordHash: mh, logoUrl: null },
    ],
    offers: [
      { id: 1, merchantId: 1, title: 'IMAX movie night for two', category: 'Entertainment', original: 40, price: 22, sold: 0, status: 'Live', terms: 'Valid on any standard screening, excludes premieres. Book at least 2 hours ahead.' },
      { id: 2, merchantId: 2, title: 'Gold Class movie experience for two', category: 'Entertainment', original: 50, price: 29, sold: 0, status: 'Live', terms: 'Valid Sun-Thu. Subject to availability, book online in advance.' },
      { id: 3, merchantId: 3, title: 'Escape room for 4 players', category: 'Entertainment', original: 80, price: 48, sold: 0, status: 'Live', terms: 'Advance booking required. Valid any day except public holidays.' },
      { id: 4, merchantId: 4, title: 'Bowling and laser tag combo for 4', category: 'Entertainment', original: 70, price: 42, sold: 0, status: 'Live', terms: 'Valid weekdays only. One hour of each activity included.' },
      { id: 5, merchantId: 5, title: '3 karting sessions', category: 'Entertainment', original: 45, price: 27, sold: 0, status: 'Live', terms: 'Sessions must be used within the same visit. Minimum age applies.' },
      { id: 6, merchantId: 6, title: 'Paintball session for 4', category: 'Entertainment', original: 60, price: 36, sold: 0, status: 'Live', terms: 'Includes gear rental. Booking required 24h in advance.' },
      { id: 7, merchantId: 7, title: '3-course Lebanese dinner for two', category: 'Restaurants', original: 90, price: 55, sold: 0, status: 'Live', terms: 'Reservation required. Excludes beverages.' },
      { id: 8, merchantId: 8, title: 'Dinner for two', category: 'Restaurants', original: 70, price: 42, sold: 0, status: 'Live', terms: 'Valid Sun-Thu only. Not valid with other promotions.' },
      { id: 9, merchantId: 9, title: '3-course dinner for two', category: 'Restaurants', original: 85, price: 52, sold: 0, status: 'Live', terms: 'Reservation required. Excludes beverages and service charge.' },
      { id: 10, merchantId: 10, title: 'Mezze feast for four', category: 'Restaurants', original: 80, price: 48, sold: 0, status: 'Live', terms: 'Valid any day. Group booking recommended.' },
      { id: 11, merchantId: 11, title: 'Armenian mezze dinner for two', category: 'Restaurants', original: 65, price: 39, sold: 0, status: 'Live', terms: 'Reservation required. Excludes beverages.' },
      { id: 12, merchantId: 12, title: 'Lunch for two', category: 'Restaurants', original: 30, price: 19, sold: 0, status: 'Live', terms: 'Valid for lunch service only, 12-4pm.' },
      { id: 13, merchantId: 13, title: '60-minute massage', category: 'Spa & Beauty', original: 70, price: 38, sold: 0, status: 'Live', terms: 'Booking required 24h in advance. Valid for one person.' },
      { id: 14, merchantId: 14, title: 'Spa day access with massage', category: 'Spa & Beauty', original: 100, price: 59, sold: 0, status: 'Live', terms: 'Includes access to pool, sauna and steam room.' },
      { id: 15, merchantId: 15, title: 'Facial treatment', category: 'Spa & Beauty', original: 60, price: 34, sold: 0, status: 'Live', terms: 'Valid for first-time clients. Patch test may be required.' },
      { id: 16, merchantId: 16, title: 'Couples massage', category: 'Spa & Beauty', original: 120, price: 69, sold: 0, status: 'Live', terms: 'Booking required. Valid for two people together.' },
      { id: 17, merchantId: 17, title: 'Monthly gym membership', category: 'Spa & Beauty', original: 90, price: 55, sold: 0, status: 'Live', terms: 'Valid from date of first visit. Non-transferable.' },
      { id: 18, merchantId: 18, title: 'Wellness day pass', category: 'Spa & Beauty', original: 85, price: 49, sold: 0, status: 'Live', terms: 'Includes access to relaxation lounge and one treatment.' },
      { id: 19, merchantId: 19, title: 'Full body checkup package', category: 'Medical Checkups', original: 150, price: 85, sold: 0, status: 'Live', terms: 'Fasting required. Results within 48 hours.' },
      { id: 20, merchantId: 20, title: 'Comprehensive blood panel', category: 'Medical Checkups', original: 90, price: 55, sold: 0, status: 'Live', terms: 'Fasting required. Walk-in or by appointment.' },
      { id: 21, merchantId: 21, title: 'Executive health screening', category: 'Medical Checkups', original: 130, price: 75, sold: 0, status: 'Live', terms: 'Includes consultation. Booking required.' },
      { id: 22, merchantId: 22, title: 'Home sample blood test', category: 'Medical Checkups', original: 60, price: 35, sold: 0, status: 'Live', terms: 'Home collection within Beirut and suburbs only.' },
      { id: 23, merchantId: 23, title: 'Vitamin and hormone panel', category: 'Medical Checkups', original: 80, price: 45, sold: 0, status: 'Live', terms: 'Fasting required. Results within 72 hours.' },
      { id: 24, merchantId: 24, title: 'Full checkup with cardiology consult', category: 'Medical Checkups', original: 160, price: 95, sold: 0, status: 'Live', terms: 'Includes ECG and consultation. Booking required.' },
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

module.exports = { load, save, nextId, DB_PATH, MERCHANT_DEFAULT_PASSWORD_HASH };

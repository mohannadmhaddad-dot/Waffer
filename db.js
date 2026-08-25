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
  const defaultExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const baseUser = { gender: null, birthday: null, resetToken: null, resetTokenExpiry: null, emailVerified: true, verifyToken: null };

  return {
    nextIds: { user: 4, merchant: 25, offer: 25, voucher: 1000, category: 5, review: 1, merchantAccount: 25, payout: 1 },
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
      { id: 2, name: 'VOX Cinemas City Centre', category: 'Entertainment', contact: '+961 71 222 333', initials: 'VX', logoUrl: null, commissionRate: null },
      { id: 3, name: 'Codex Adventures', category: 'Entertainment', contact: '+961 3 333 444', initials: 'CX', logoUrl: null, commissionRate: null },
      { id: 4, name: 'Funscape Sin El Fil', category: 'Entertainment', contact: '+961 1 444 555', initials: 'FS', logoUrl: null, commissionRate: null },
      { id: 5, name: 'Colonel Karting', category: 'Entertainment', contact: '+961 76 555 666', initials: 'CK', logoUrl: null, commissionRate: null },
      { id: 6, name: 'Element For Adventure', category: 'Entertainment', contact: '+961 71 666 777', initials: 'EA', logoUrl: null, commissionRate: null },
      { id: 7, name: 'Em Sherif', category: 'Restaurants', contact: '+961 1 200 100', initials: 'ES', logoUrl: null, commissionRate: null },
      { id: 8, name: 'BeBabel', category: 'Restaurants', contact: '+961 1 200 200', initials: 'BB', logoUrl: null, commissionRate: null },
      { id: 9, name: 'Liza', category: 'Restaurants', contact: '+961 1 200 300', initials: 'LZ', logoUrl: null, commissionRate: null },
      { id: 10, name: 'T-Marbouta', category: 'Restaurants', contact: '+961 1 200 400', initials: 'TM', logoUrl: null, commissionRate: null },
      { id: 11, name: 'Mayrig', category: 'Restaurants', contact: '+961 1 200 500', initials: 'MY', logoUrl: null, commissionRate: null },
      { id: 12, name: 'Le Chef', category: 'Restaurants', contact: '+961 1 200 600', initials: 'LC', logoUrl: null, commissionRate: null },
      { id: 13, name: 'Kimantra Spas', category: 'Spa & Beauty', contact: '+961 4 300 100', initials: 'KM', logoUrl: null, commissionRate: null },
      { id: 14, name: 'The Royal Spa', category: 'Spa & Beauty', contact: '+961 4 300 200', initials: 'RS', logoUrl: null, commissionRate: null },
      { id: 15, name: 'Jolie et Co', category: 'Spa & Beauty', contact: '+961 4 300 300', initials: 'JC', logoUrl: null, commissionRate: null },
      { id: 16, name: 'Smallville Spa & Beauty', category: 'Spa & Beauty', contact: '+961 4 300 400', initials: 'SV', logoUrl: null, commissionRate: null },
      { id: 17, name: 'Vim & Vigor Badaro', category: 'Spa & Beauty', contact: '+961 4 300 500', initials: 'VV', logoUrl: null, commissionRate: null },
      { id: 18, name: 'Movenpick Spa', category: 'Spa & Beauty', contact: '+961 4 300 600', initials: 'MP', logoUrl: null, commissionRate: null },
      { id: 19, name: 'St. Marc Medical & Diagnostic Center', category: 'Medical Checkups', contact: '+961 1 566 222', initials: 'SM', logoUrl: null, commissionRate: null },
      { id: 20, name: 'MedLab', category: 'Medical Checkups', contact: '+961 1 700 100', initials: 'ML', logoUrl: null, commissionRate: null },
      { id: 21, name: 'PHD Labs', category: 'Medical Checkups', contact: '+961 1 700 200', initials: 'PD', logoUrl: null, commissionRate: null },
      { id: 22, name: 'Saint Michel Medical Laboratories', category: 'Medical Checkups', contact: '+961 4 521 601', initials: 'SM', logoUrl: null, commissionRate: null },
      { id: 23, name: 'Fontana Laboratories', category: 'Medical Checkups', contact: '+961 1 700 400', initials: 'FL', logoUrl: null, commissionRate: null },
      { id: 24, name: 'ABC Laboratories', category: 'Medical Checkups', contact: '+961 1 700 500', initials: 'AB', logoUrl: null, commissionRate: null },
    ],
    merchantAccounts: [
      { id: 1, merchantId: 1, role: 'manager', location: null, username: 'grandcinemas', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 2, merchantId: 2, role: 'manager', location: null, username: 'voxcinemas', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 3, merchantId: 3, role: 'manager', location: null, username: 'codexadventures', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 4, merchantId: 4, role: 'manager', location: null, username: 'funscape', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 5, merchantId: 5, role: 'manager', location: null, username: 'colonelkarting', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 6, merchantId: 6, role: 'manager', location: null, username: 'elementadventure', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 7, merchantId: 7, role: 'manager', location: null, username: 'emsherif', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 8, merchantId: 8, role: 'manager', location: null, username: 'bebabel', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 9, merchantId: 9, role: 'manager', location: null, username: 'liza', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 10, merchantId: 10, role: 'manager', location: null, username: 'tmarbouta', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 11, merchantId: 11, role: 'manager', location: null, username: 'mayrig', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 12, merchantId: 12, role: 'manager', location: null, username: 'lechef', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 13, merchantId: 13, role: 'manager', location: null, username: 'kimantraspas', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 14, merchantId: 14, role: 'manager', location: null, username: 'royalspa', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 15, merchantId: 15, role: 'manager', location: null, username: 'jolieetco', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 16, merchantId: 16, role: 'manager', location: null, username: 'smallvillespa', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 17, merchantId: 17, role: 'manager', location: null, username: 'vimvigor', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 18, merchantId: 18, role: 'manager', location: null, username: 'movenpickspa', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 19, merchantId: 19, role: 'manager', location: null, username: 'stmarclab', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 20, merchantId: 20, role: 'manager', location: null, username: 'medlab', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 21, merchantId: 21, role: 'manager', location: null, username: 'phdlabs', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 22, merchantId: 22, role: 'manager', location: null, username: 'saintmichel', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 23, merchantId: 23, role: 'manager', location: null, username: 'fontanalab', passwordHash: mh, plainPassword: 'merchant123' },
      { id: 24, merchantId: 24, role: 'manager', location: null, username: 'abclabs', passwordHash: mh, plainPassword: 'merchant123' },
    ],
    offers: [
      { id: 1, merchantId: 1, title: 'IMAX movie night for two', category: 'Entertainment', original: 40, price: 22, sold: 0, status: 'Live', terms: 'Valid on any standard screening, excludes premieres. Book at least 2 hours ahead.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 2, merchantId: 2, title: 'Gold Class movie experience for two', category: 'Entertainment', original: 50, price: 29, sold: 0, status: 'Live', terms: 'Valid Sun-Thu. Subject to availability, book online in advance.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 3, merchantId: 3, title: 'Escape room for 4 players', category: 'Entertainment', original: 80, price: 48, sold: 0, status: 'Live', terms: 'Advance booking required. Valid any day except public holidays.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 4, merchantId: 4, title: 'Bowling and laser tag combo for 4', category: 'Entertainment', original: 70, price: 42, sold: 0, status: 'Live', terms: 'Valid weekdays only. One hour of each activity included.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 5, merchantId: 5, title: '3 karting sessions', category: 'Entertainment', original: 45, price: 27, sold: 0, status: 'Live', terms: 'Sessions must be used within the same visit. Minimum age applies.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 6, merchantId: 6, title: 'Paintball session for 4', category: 'Entertainment', original: 60, price: 36, sold: 0, status: 'Live', terms: 'Includes gear rental. Booking required 24h in advance.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 7, merchantId: 7, title: '3-course Lebanese dinner for two', category: 'Restaurants', original: 90, price: 55, sold: 0, status: 'Live', terms: 'Reservation required. Excludes beverages.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 8, merchantId: 8, title: 'Dinner for two', category: 'Restaurants', original: 70, price: 42, sold: 0, status: 'Live', terms: 'Valid Sun-Thu only. Not valid with other promotions.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 9, merchantId: 9, title: '3-course dinner for two', category: 'Restaurants', original: 85, price: 52, sold: 0, status: 'Live', terms: 'Reservation required. Excludes beverages and service charge.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 10, merchantId: 10, title: 'Mezze feast for four', category: 'Restaurants', original: 80, price: 48, sold: 0, status: 'Live', terms: 'Valid any day. Group booking recommended.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 11, merchantId: 11, title: 'Armenian mezze dinner for two', category: 'Restaurants', original: 65, price: 39, sold: 0, status: 'Live', terms: 'Reservation required. Excludes beverages.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 12, merchantId: 12, title: 'Lunch for two', category: 'Restaurants', original: 30, price: 19, sold: 0, status: 'Live', terms: 'Valid for lunch service only, 12-4pm.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 13, merchantId: 13, title: '60-minute massage', category: 'Spa & Beauty', original: 70, price: 38, sold: 0, status: 'Live', terms: 'Booking required 24h in advance. Valid for one person.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 14, merchantId: 14, title: 'Spa day access with massage', category: 'Spa & Beauty', original: 100, price: 59, sold: 0, status: 'Live', terms: 'Includes access to pool, sauna and steam room.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 15, merchantId: 15, title: 'Facial treatment', category: 'Spa & Beauty', original: 60, price: 34, sold: 0, status: 'Live', terms: 'Valid for first-time clients. Patch test may be required.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 16, merchantId: 16, title: 'Couples massage', category: 'Spa & Beauty', original: 120, price: 69, sold: 0, status: 'Live', terms: 'Booking required. Valid for two people together.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 17, merchantId: 17, title: 'Monthly gym membership', category: 'Spa & Beauty', original: 90, price: 55, sold: 0, status: 'Live', terms: 'Valid from date of first visit. Non-transferable.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 18, merchantId: 18, title: 'Wellness day pass', category: 'Spa & Beauty', original: 85, price: 49, sold: 0, status: 'Live', terms: 'Includes access to relaxation lounge and one treatment.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 19, merchantId: 19, title: 'Full body checkup package', category: 'Medical Checkups', original: 150, price: 85, sold: 0, status: 'Live', terms: 'Fasting required. Results within 48 hours.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 20, merchantId: 20, title: 'Comprehensive blood panel', category: 'Medical Checkups', original: 90, price: 55, sold: 0, status: 'Live', terms: 'Fasting required. Walk-in or by appointment.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 21, merchantId: 21, title: 'Executive health screening', category: 'Medical Checkups', original: 130, price: 75, sold: 0, status: 'Live', terms: 'Includes consultation. Booking required.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 22, merchantId: 22, title: 'Home sample blood test', category: 'Medical Checkups', original: 60, price: 35, sold: 0, status: 'Live', terms: 'Home collection within Beirut and suburbs only.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 23, merchantId: 23, title: 'Vitamin and hormone panel', category: 'Medical Checkups', original: 80, price: 45, sold: 0, status: 'Live', terms: 'Fasting required. Results within 72 hours.', expiryDate: defaultExpiry, imageUrl: null },
      { id: 24, merchantId: 24, title: 'Full checkup with cardiology consult', category: 'Medical Checkups', original: 160, price: 95, sold: 0, status: 'Live', terms: 'Includes ECG and consultation. Booking required.', expiryDate: defaultExpiry, imageUrl: null },
    ],
    vouchers: [],
    reviews: [],
    payouts: [],
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

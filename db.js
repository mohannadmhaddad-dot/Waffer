const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

function seed() {
  const adminHash = bcrypt.hashSync('admin123', 8);
  const laylaHash = bcrypt.hashSync('demo1234', 8);
  const karimHash = bcrypt.hashSync('demo1234', 8);

  return {
    nextIds: { user: 4, merchant: 25, offer: 25, voucher: 1000 },
    users: [
      { id: 1, name: 'Waffer Admin', email: 'admin@waffer.com', phone: null, passwordHash: adminHash, isAdmin: true, createdAt: Date.now() },
      { id: 2, name: 'Layla Khoury', email: 'layla@example.com', phone: '+96170123456', passwordHash: laylaHash, isAdmin: false, createdAt: Date.now() },
      { id: 3, name: 'Karim Aoun', email: 'karim@example.com', phone: '+96176554433', passwordHash: karimHash, isAdmin: false, createdAt: Date.now() },
    ],
    merchants: [
      { id: 1, name: 'Grand Cinemas Hazmieh', category: 'Entertainment', contact: '+961 76 111 222', initials: 'GC' },
      { id: 2, name: 'VOX Cinemas City Centre', category: 'Entertainment', contact: '+961 71 222 333', initials: 'VX' },
      { id: 3, name: 'Codex Adventures', category: 'Entertainment', contact: '+961 3 333 444', initials: 'CX' },
      { id: 4, name: 'Funscape Sin El Fil', category: 'Entertainment', contact: '+961 1 444 555', initials: 'FS' },
      { id: 5, name: 'Colonel Karting', category: 'Entertainment', contact: '+961 76 555 666', initials: 'CK' },
      { id: 6, name: 'Element For Adventure', category: 'Entertainment', contact: '+961 71 666 777', initials: 'EA' },
      { id: 7, name: 'Em Sherif', category: 'Restaurants', contact: '+961 1 200 100', initials: 'ES' },
      { id: 8, name: 'BeBabel', category: 'Restaurants', contact: '+961 1 200 200', initials: 'BB' },
      { id: 9, name: 'Liza', category: 'Restaurants', contact: '+961 1 200 300', initials: 'LZ' },
      { id: 10, name: 'T-Marbouta', category: 'Restaurants', contact: '+961 1 200 400', initials: 'TM' },
      { id: 11, name: 'Mayrig', category: 'Restaurants', contact: '+961 1 200 500', initials: 'MY' },
      { id: 12, name: 'Le Chef', category: 'Restaurants', contact: '+961 1 200 600', initials: 'LC' },
      { id: 13, name: 'Kimantra Spas', category: 'Spa & Beauty', contact: '+961 4 300 100', initials: 'KM' },
      { id: 14, name: 'The Royal Spa', category: 'Spa & Beauty', contact: '+961 4 300 200', initials: 'RS' },
      { id: 15, name: 'Jolie et Co', category: 'Spa & Beauty', contact: '+961 4 300 300', initials: 'JC' },
      { id: 16, name: 'Smallville Spa & Beauty', category: 'Spa & Beauty', contact: '+961 4 300 400', initials: 'SV' },
      { id: 17, name: 'Vim & Vigor Badaro', category: 'Spa & Beauty', contact: '+961 4 300 500', initials: 'VV' },
      { id: 18, name: 'Movenpick Spa', category: 'Spa & Beauty', contact: '+961 4 300 600', initials: 'MP' },
      { id: 19, name: 'St. Marc Medical & Diagnostic Center', category: 'Medical Checkups', contact: '+961 1 566 222', initials: 'SM' },
      { id: 20, name: 'MedLab', category: 'Medical Checkups', contact: '+961 1 700 100', initials: 'ML' },
      { id: 21, name: 'PHD Labs', category: 'Medical Checkups', contact: '+961 1 700 200', initials: 'PD' },
      { id: 22, name: 'Saint Michel Medical Laboratories', category: 'Medical Checkups', contact: '+961 4 521 601', initials: 'SM' },
      { id: 23, name: 'Fontana Laboratories', category: 'Medical Checkups', contact: '+961 1 700 400', initials: 'FL' },
      { id: 24, name: 'ABC Laboratories', category: 'Medical Checkups', contact: '+961 1 700 500', initials: 'AB' },
    ],
    offers: [
      { id: 1, merchantId: 1, title: 'IMAX movie night for two', category: 'Entertainment', original: 40, price: 22, sold: 0, status: 'Live', terms: 'Valid on any standard screening, excludes premieres. Book at least 2 hours ahead.' },
      { id: 2, merchantId: 2, title: 'Gold Class movie experience for two', category: 'Entertainment', original: 50, price: 29, sold: 0, status: 'Live', terms: 'Valid Sun-Thu. Subject to availability, book online in advance.' },
      { id: 3, merchantId: 3, title: 'Escape room for 4 players', category: 'Entertainment', original: 80, price: 48, sold: 0, status: 'Live', terms: 'Advance booking required. Valid any day except public holidays.' },
      { id: 4, merchantId: 4, title: 'Bowling and laser tag combo for 4', category: 'Entertainment', original: 70, price:

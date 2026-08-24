# Waffer — voucher marketplace (working build)

A real, functional version of the app: Node.js/Express backend, JSON-file database
(persists to `data/db.json`), real user accounts with hashed passwords, and a
frontend that talks to the backend over a real API — not an in-memory demo.

## What's real vs. what's still simulated

**Real:**
- User registration/login with hashed passwords and sessions
- Persistent database (survives server restarts)
- Offer browsing, purchase, and gift flows hitting real endpoints
- Gift-requires-existing-account enforcement, checked server-side
- Voucher codes, wallet, and redemption (single-use, enforced server-side)
- Admin panel: add merchants, create/pause offers, live stats — all persisted

**Still simulated (by design, for this budget/stage):**
- Payment — checkout doesn't call a real processor yet. This is where Whish's
  integration goes once you have a merchant account with them.
- Merchant redemption screen has no login — it's a shared tool, matching the
  lean scope we agreed on (no merchant self-serve portal yet).

## Run it locally

Requires Node.js (v18 or newer).

```bash
npm install
node server.js
```

Then open **http://localhost:3000** in your browser.

Demo accounts (already seeded):
- Customer: `layla@example.com` / `demo1234`
- Customer: `karim@example.com` / `demo1234`
- Admin: `admin@waffer.com` / `admin123`

Try gifting a voucher to `karim@example.com` while logged in as Layla — it'll
work. Try gifting to a made-up email — it'll correctly refuse.

To reset all data back to the seed state, stop the server and delete `data/db.json`,
then restart — it will regenerate automatically.

## Project structure

```
waffer/
  server.js       Express app + all API routes
  db.js           JSON-file database layer (read/write data/db.json)
  data/db.json    The actual data (created on first run)
  public/
    index.html    Page shell
    styles.css    All styling
    app.js        Frontend logic, calls the API with fetch()
```

## Going live — what's still needed

This runs correctly right now on your machine. To put it on a real domain for
real customers, you (or a freelancer) need to:

1. **Swap the database.** `data/db.json` is fine for development and a small
   pilot, but move to a real database (PostgreSQL is the natural choice) before
   real transaction volume — JSON-file writes aren't safe under concurrent load.
2. **Connect Whish (or another gateway).** Replace the simulated checkout in
   `completePurchase()` (public/app.js) and `/api/vouchers/purchase` (server.js)
   with a real payment call, only marking a voucher as purchased after payment
   confirms.
3. **Host it.** Any Node-friendly host works (Railway, Render, DigitalOcean,
   a VPS). Point a domain at it once deployed.
4. **Move the session secret out of the code.** `server.js` currently has a
   placeholder session secret — set it via an environment variable in production.
5. **Add a merchant PIN or lightweight login** on the redeem screen before
   launch, so anyone with the link can't redeem vouchers.

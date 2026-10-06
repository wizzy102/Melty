# Melty — online ordering prototype

A working prototype of online ordering for **Melty** (sweets, fries and chicken; Cairo). Customers browse the menu, customise items, check out for delivery and get a confirmation; staff manage incoming orders in an admin area and update customers on WhatsApp in one click.

English and Arabic (right-to-left) throughout. **All menu items, prices, delivery areas and fees are placeholders**: see [ASSUMPTIONS.md](ASSUMPTIONS.md) for what is a placeholder and what is confirmed. The full brief and build log are in [IMPLEMENTATION.md](IMPLEMENTATION.md).

**Stack:** React 19 + TypeScript + Vite (client) · Node + Express 5 + TypeScript + Mongoose (API) · MongoDB.

---

## Run it locally

You need **Node.js 20+** (developed on 24) and a **MongoDB** database (MongoDB Atlas, or a local `mongodb://localhost:27017`).

```bash
# 1. Install everything (root, server and client)
npm run install:all

# 2. Configure the API
cp server/.env.example server/.env
#    then fill in server/.env:
#    - MONGODB_URI     your connection string
#    - ADMIN_PASSWORD_HASH   generate with:  npm run hash-password --prefix server -- "choose-a-password"
#                            (wrap the hash in single quotes in .env)
#    - JWT_SECRET      generate with:  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

# 3. Load the placeholder menu, delivery areas and 6 demo orders
npm run seed --prefix server -- --sample-orders

# 4. Start the API (port 4000) and the site (port 5173) together
npm run dev
```

| URL | What |
| --- | --- |
| http://localhost:5173 | Customer site |
| http://localhost:5173/admin | Staff admin (not linked from the customer site) |
| http://localhost:5173/ui | Internal component gallery (not linked) |

> **Atlas tip:** if the API can't connect with a `mongodb+srv://` URI ("querySrv" DNS errors), use the standard `mongodb://host1,host2,host3/?tls=true&replicaSet=…` form from Atlas → Connect → Drivers.

### Seeding options

```bash
npm run seed --prefix server                                   # replace menu + areas, keep orders
npm run seed --prefix server -- --sample-orders                # …and add 6 demo orders
npm run seed --prefix server -- --reset-orders --sample-orders # delete ALL orders, then add the demo ones
```

Re-seeding replaces products with new IDs, so carts saved in a browser from before will show those items as "no longer on the menu".

---

## Where to put Melty's real details

| What | File |
| --- | --- |
| Menu, categories, prices, options/add-ons, delivery areas + fees | `server/src/seed/data.ts`, then run the seed |
| Product photos | `image` field per product in `data.ts` (until then, illustrated placeholders are shown) |
| Instagram link, currency labels, "prototype" footer notice | `client/src/config/business.ts` |
| WhatsApp message wording (per order status, English + Arabic) | `client/src/config/whatsapp.ts` |
| Website text in English / Arabic | `client/src/i18n/en.ts`, `client/src/i18n/ar.ts` |
| Logo (currently an SVG recreation) | `client/src/components/Logo.tsx`, `client/public/favicon.svg` |
| Admin username / password | `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` in `server/.env` |

---

## Checks

```bash
npm run typecheck     # TypeScript, server + client
npm run test:api      # 36 end-to-end API checks — needs `npm run dev` running and seeded data
```

`test:api` covers server-side pricing (tampered prices/fees are ignored), every invalid order case (missing name, bad phone, empty cart, invalid/unavailable products, bad options and quantities, NoSQL injection), admin authentication (no session, forged token, wrong password, cookie flags), status changes and the availability toggle. It places a few test orders, so use it on development data only.

---

## How it's put together

```
server/src
  config/env.ts        all settings + secrets, validated at startup
  models/              Category, Product (generic option groups), DeliveryArea, Order (price snapshot), Counter
  services/pricing.ts  the only place prices are calculated — clients send IDs + quantities, never prices
  services/orderInput.ts  input validation (zod), Egyptian phone normalisation, text clean-up
  routes/public.ts     /api/menu, /api/delivery-areas, /api/orders/quote, /api/orders
  routes/admin/*       login/logout/me, orders + status, product availability (all behind requireAdmin)
  seed/                placeholder data + seed script

client/src
  pages/               Home, Menu, Product, Cart, Checkout, Review, OrderConfirmed
  admin/               Login, Orders dashboard (10 s polling), Order detail, Products — separate lazy bundle
  store/               menu, cart (localStorage: IDs only), checkout draft (sessionStorage)
  i18n/                en + ar dictionaries, RTL switching
  config/              business settings, WhatsApp templates
```

**Security notes:** the admin session is a signed JWT in an `httpOnly`, `SameSite=Strict` cookie; the password is stored only as a bcrypt hash; login is rate-limited (10 failed attempts / 15 min); all input is validated with zod before touching the database; responses never include internal fields; customer text is stripped of invisible/bidi-override characters; `helmet` security headers are on.

---

## Before going live

Deployment isn't set up yet. When it is:

1. **Rotate the database password** (the development one was shared in chat) and use a fresh `JWT_SECRET` and admin password.
2. Set `NODE_ENV=production` (secure cookies, order rate limiting), `CLIENT_ORIGIN` to the real site address, and `TRUST_PROXY=1` if the API runs behind one reverse proxy / load balancer.
3. Build: `npm run build --prefix client` (static files in `client/dist`) and `npm run build --prefix server` then `npm start --prefix server`. Serve the site and the API under the **same domain** (site at `/`, API at `/api`) so the admin cookie keeps working.
4. Put the database in a region close to the API server (most of the local slowness is the distance to Atlas).

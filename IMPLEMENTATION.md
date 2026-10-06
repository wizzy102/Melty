# Melty Online Ordering System — Prototype Implementation Plan

> **Build status:** Phases 1–5 done, Phase 6 (Polish & testing) next. See [§29 Build Progress](#29-build-progress) at the end of this document.

## 1. Project Context

Build a polished prototype for **Melty**, a new sweets/dessert business opening inside a mall in Egypt.

The owner is directly involved in the project and has already seen and expressed strong interest in the concept. This is therefore a **serious sales prototype for a likely client**, not a generic demo.

The business is expected to have a relatively large and varied product catalog consisting of sweets/desserts and potentially drinks or other related products.

The prototype should feel like a real Melty ordering system, not a generic restaurant template.

### Important business context

* Melty is currently preparing to open.
* The owner expects to start selling in approximately four days and will have an opening ceremony.
* The owner is interested in an online ordering system.
* I have direct contact with the owner and can clarify requirements with him.
* Money/pricing has **not** been discussed yet. Do not introduce pricing into the application or prototype.
* The prototype will be used to demonstrate the concept to the owner before final production requirements and commercial terms are agreed.
* Do not imply that integrations or production infrastructure already exist.
* Do not overbuild features that have not been requested.

---

# 2. Primary Objective

Create a high-quality **mobile-first online ordering prototype** for Melty.

The main customer journey should be:

**Open Melty → Browse menu → Select product → Customize → Add to cart → Checkout → Enter delivery information → Review order → Confirm order → Order confirmation**

The prototype should demonstrate how a real customer could order Melty products from their phone.

There should also be an **admin interface** demonstrating how Melty staff could receive and manage incoming orders.

The goal is to make the owner look at the prototype and immediately understand:

> "A customer can scan/access this, browse Melty's products, place an order, and we can manage that order."

---

# 3. Prototype Scope

## Customer-facing application

Build the following:

### Home page

Include:

* Melty branding
* Strong visual hero section
* Short description/tagline
* CTA to browse menu
* Featured/popular products
* Product categories
* Visually appealing dessert imagery
* Mobile-first layout
* Clear navigation to menu/cart

The design should feel like a premium modern dessert brand.

Avoid making it look like a generic food-delivery clone.

---

## Menu

The menu should support many products and categories.

Example categories can include realistic dessert categories such as:

* Pancakes
* Waffles
* Crepes
* Desserts
* Chocolate
* Cakes
* Drinks
* Other relevant categories

These are **prototype examples only**. Structure the application so the actual categories/products can easily be replaced when the owner provides the real Melty menu.

Requirements:

* Category navigation
* Product cards
* Product image
* Product name
* Short description
* Price
* Availability state
* Add/view button
* Responsive grid/list
* Mobile-friendly scrolling

Do not hardcode the architecture around only a few products.

---

# 4. Product Details

This is an important part of the Melty prototype.

Dessert products may have customization and add-ons, so the product model should support:

* Product name
* Description
* Base price
* Image
* Category
* Availability
* Options/variants
* Add-ons
* Additional prices for options
* Quantity

Example:

**Lotus Pancake — 180 EGP**

Size:

* Regular
* Large +40 EGP

Add-ons:

* Lotus +30 EGP
* Nutella +30 EGP
* Kinder +40 EGP

The actual examples are placeholders.

Build the data structure so products can support different combinations of options without requiring custom frontend code for every product.

The customer should be able to clearly see how the selected options affect the total price.

---

# 5. Cart

Cart must display:

* Product
* Selected options
* Quantity
* Unit price
* Item subtotal
* Remove item
* Change quantity
* Edit customization
* Cart subtotal
* Delivery fee
* Final total

The cart should persist during navigation.

Do not require customer registration/login.

---

# 6. Checkout

For the initial prototype, the primary ordering model is **delivery**.

Do NOT implement pickup yet.

Pickup should remain an open requirement that will be discussed with the owner.

Checkout should collect:

### Customer information

* Full name
* Phone number

### Delivery information

* City
* Area
* Full address
* Additional delivery instructions/details

The application should be structured so delivery areas and fees can eventually be configured rather than hardcoded throughout the frontend.

Use realistic Egyptian/Melty-style prototype data where needed, but clearly treat it as placeholder data until the owner confirms the actual delivery areas and pricing.

---

# 7. Delivery Fee

The system should support delivery fees based on the selected delivery area.

Do NOT assume one universal delivery fee.

Prototype architecture should support:

```text
Area A → fee
Area B → fee
Area C → fee
Area D → fee
```

The actual areas and fees are not confirmed yet.

Do not claim these prototype values are Melty's real delivery policy.

For the prototype, use realistic placeholder areas/fees purely to demonstrate the functionality.

---

# 8. Order Review

Before final submission, show a complete order summary:

* Customer name
* Phone
* Delivery city
* Delivery area
* Address
* Additional instructions
* Ordered products
* Selected options/add-ons
* Quantities
* Subtotal
* Delivery fee
* Total

Provide a clear final confirmation action.

---

# 9. Order Confirmation

After submitting an order, show a polished confirmation screen.

The prototype should communicate that:

> The order has been received and Melty will contact the customer shortly.

Do NOT implement a WhatsApp API or payment gateway in this prototype unless specifically requested later.

Do not create a fake production integration.

The confirmation screen should simply demonstrate the intended customer experience.

---

# 10. Admin Interface

An admin interface is an important part of the prototype.

Create a separate admin area that is not part of the normal customer navigation.

The customer should never see admin links in the public ordering experience.

For the prototype, use a simple admin login.

No need for:

* Multiple employee accounts
* Roles/permissions
* Complex authentication architecture
* Employee management

unless specifically required later.

---

# 11. Admin Dashboard

The admin dashboard should demonstrate how Melty staff would manage incoming orders.

Show:

* New orders
* Order number
* Customer name
* Phone
* Order time
* Order total
* Delivery area
* Order status

Example statuses:

```text
New
Confirmed
Preparing
Out for Delivery
Completed
Rejected
```

Staff should be able to open an order and view its complete details.

The dashboard should feel practical and usable rather than being a collection of decorative statistics.

---

# 12. Admin Order Details

An order details page should show:

### Customer

* Name
* Phone

### Delivery

* City
* Area
* Full address
* Additional instructions

### Order

* Products
* Options
* Quantities
* Prices
* Subtotal
* Delivery fee
* Total

### Management

Allow the admin to change the order status.

The prototype may include buttons/actions representing future communication workflows, but do not implement external APIs unless explicitly requested.

---

# 13. Menu/Product Administration

The architecture should account for eventual menu management.

The long-term system should allow Melty staff to:

* Add products
* Edit products
* Change prices
* Change descriptions
* Upload/change images
* Enable/disable products
* Manage categories
* Manage product options
* Manage add-ons

However, **do not turn this prototype into a massive CMS unless needed**.

For the first prototype, prioritize demonstrating the customer ordering experience and order management.

Build the data model in a way that will not make future menu management difficult.

---

# 14. QR Code Use Case

The physical Melty location makes QR ordering particularly relevant.

The prototype should be designed with the eventual use case in mind:

**Customer scans a QR code → Melty ordering page opens → Customer orders from phone.**

The actual QR code generation/integration does not need to be implemented unless useful for the prototype.

The application should simply be designed so a QR code can eventually point directly to the public Melty ordering page.

---

# 15. Pickup

Do NOT implement pickup in the initial prototype.

This is an open requirement to discuss with the owner.

If the owner later wants pickup, the architecture should make it possible to add:

```text
Delivery
Pickup
```

without rebuilding checkout from scratch.

---

# 16. Payments

Do NOT implement online payment in the prototype.

Do not integrate:

* Payment gateways
* Card payments
* Wallet payments
* Cash collection APIs

The prototype should demonstrate the ordering workflow only.

Payment options can be discussed with the owner after the prototype is reviewed.

---

# 17. WhatsApp

Do NOT implement WhatsApp API integration in the prototype.

Do not pay for or configure external WhatsApp services.

The system should nevertheless be designed cleanly enough that WhatsApp communication can be added later if required.

For now:

**Customer submits order → Melty receives/manages order → Melty contacts customer as needed.**

---

# 18. Technology

Use:

* React
* Node.js
* Express
* MongoDB
* JavaScript/TypeScript as appropriate for the project
* Modern responsive CSS/UI system

Use a clean MERN architecture.

Separate:

```text
Frontend
Backend/API
Database
Authentication
Admin
Public customer ordering
```

Keep the project maintainable.

---

# 19. Data Models

Design appropriate models for at least:

### Product

Possible fields:

```text
_id
name
description
price
image
category
available
options
addOns
createdAt
updatedAt
```

### Category

```text
_id
name
description
image
displayOrder
active
```

### Option / Variant

Support concepts such as:

```text
name
choices
required
priceModifier
```

### Order

Include:

```text
_id
orderNumber
customer
items
delivery
subtotal
deliveryFee
total
status
createdAt
updatedAt
```

### Customer information

At minimum:

```text
name
phone
```

### Delivery

At minimum:

```text
city
area
address
additionalInstructions
```

Do not over-engineer the schema before the actual business requirements are confirmed.

---

# 20. Security Requirements

Even though this is a prototype, follow proper security practices.

### Admin

* Admin routes must be protected.
* Customer users must not be able to access admin functionality.
* Never expose passwords in source code.
* Use environment variables for secrets.
* Never commit `.env` files.
* Passwords must be hashed if stored.
* Validate authentication server-side.
* Do not rely only on frontend route protection.

### API

Validate all incoming data server-side.

Do not trust:

* Prices sent by the client
* Delivery fees sent by the client
* Product availability sent by the client
* Order totals sent by the client

The server should calculate authoritative order totals from database data.

Prevent customers from manipulating prices through browser requests.

Validate:

* Phone number
* Required fields
* Product IDs
* Quantities
* Options
* Delivery area
* Order totals

Avoid exposing unnecessary database fields through API responses.

---

# 21. UX Requirements

The customer experience is extremely important.

The system should be:

* Mobile-first
* Fast
* Clean
* Visually attractive
* Easy to navigate
* Designed around food/dessert imagery
* Simple enough for a first-time customer
* Clear about prices
* Clear about customization
* Clear about the final order total

Do not create a generic dashboard-looking customer website.

Melty should feel like a real consumer brand.

Use:

* Strong typography
* Good spacing
* High-quality product presentation
* Clear CTAs
* Smooth transitions where appropriate
* Persistent cart access
* Good empty states
* Loading states
* Error states
* Responsive desktop/tablet/mobile layouts

Avoid excessive animations that hurt usability.

---

# 22. Prototype Content

Since the real menu may not yet be fully finalized, use realistic placeholder Melty content.

However:

* Make it look intentional.
* Do not use "Product 1", "Product 2", etc.
* Do not use obviously fake placeholder categories.
* Use realistic Egyptian prices.
* Use realistic dessert names.
* Use suitable product images/placeholders.
* Make the content easy to replace later.

The owner should be able to imagine this as his actual business.

---

# 23. Important Requirement: Do Not Invent Business Decisions

There are currently several things that have NOT been confirmed with the owner.

Do not silently turn assumptions into requirements.

Open questions include:

* Exact menu
* Exact prices
* Exact categories
* Delivery areas
* Delivery fees
* Pickup availability
* Payment methods
* WhatsApp workflow
* Order communication workflow
* Staff/admin requirements
* Final branding
* Opening hours
* Business contact information

Use sensible placeholder values for the prototype, but keep these values easy to replace.

Clearly separate:

**Prototype assumptions**

from

**Confirmed business requirements.**

---

# 24. Scope Boundaries

Do NOT implement these unless explicitly requested later:

* Customer accounts
* Loyalty program
* Coupons
* Advanced promotions
* Online payments
* WhatsApp API
* Messenger integration
* AI chatbot
* Delivery driver application
* Live driver tracking
* GPS tracking
* Complex inventory management
* POS integration
* Multiple employee roles
* Advanced analytics
* Accounting
* Automated marketing
* SMS gateway
* Subscription system

The goal is a convincing ordering prototype, not a complete enterprise platform.

---

# 25. Build Order

Follow this implementation order:

### Phase 1 — Project foundation

1. Create MERN project structure.
2. Configure frontend.
3. Configure backend.
4. Configure MongoDB.
5. Configure environment variables.
6. Establish API structure.
7. Establish basic authentication structure.

### Phase 2 — UI foundation

1. Establish Melty visual identity.
2. Create responsive layout.
3. Create navigation.
4. Create reusable product cards.
5. Create category components.
6. Create buttons/forms/modals.
7. Create responsive mobile experience.

### Phase 3 — Customer menu

1. Create categories.
2. Create product data.
3. Create menu page.
4. Create product detail page.
5. Implement options/add-ons.
6. Implement availability.
7. Implement cart.

### Phase 4 — Checkout

1. Customer information.
2. Delivery information.
3. Delivery-area selection.
4. Delivery fee calculation.
5. Server-side order total calculation.
6. Order review.
7. Order submission.
8. Confirmation screen.

### Phase 5 — Admin

1. Admin login.
2. Protected admin routes.
3. Dashboard.
4. Orders list.
5. Order details.
6. Status updates.
7. Basic menu/product management foundation if appropriate.

### Phase 6 — Polish

1. Mobile testing.
2. Desktop testing.
3. Empty states.
4. Loading states.
5. Error handling.
6. Form validation.
7. Security review.
8. UX refinement.
9. Visual polish.
10. Test complete ordering flow.

---

# 26. Testing Requirements

Test the complete flow:

```text
Customer opens Melty
→ browses categories
→ opens product
→ selects options
→ adds to cart
→ changes quantity
→ proceeds to checkout
→ enters customer information
→ selects delivery area
→ sees correct delivery fee
→ reviews order
→ submits order
→ receives confirmation
```

Then verify:

```text
Admin logs in
→ sees new order
→ opens order
→ sees exact customer information
→ sees exact products/options
→ sees correct totals
→ changes order status
```

Also test invalid cases:

* Missing customer name
* Invalid phone
* Missing address
* Invalid product ID
* Invalid quantity
* Unavailable product
* Manipulated price
* Manipulated delivery fee
* Unauthorized admin access
* Expired/invalid authentication
* Empty cart

---

# 27. Final Prototype Standard

The prototype should be good enough that I can put it in front of the Melty owner and say:

> "This is how your online ordering system could work."

It should not look like a coding exercise.

It should look like an early version of a real product.

Prioritize:

**1. Visual quality**
**2. Customer ordering experience**
**3. Product customization**
**4. Clear delivery workflow**
**5. Admin order management**
**6. Security**
**7. Maintainable architecture**

Do not sacrifice the prototype's polish by implementing unnecessary features.

---

# 28. Claude Instructions

Work incrementally.

Before writing large amounts of code:

1. Establish the architecture.
2. Establish the data models.
3. Establish the routes/API structure.
4. Establish the page/component structure.
5. Then implement in the build order above.

When a requirement is ambiguous, do NOT invent a complex business rule.

Choose the simplest reasonable prototype behavior and clearly identify it as a placeholder.

Keep all business-specific values easy to replace.

The application must be functional, not merely a static UI mockup.

At the end of each major phase, verify that the existing functionality still works before proceeding.

The final result should be a polished, functional Melty online ordering prototype ready to demonstrate to the business owner.

---

# 29. Build Progress

_Last updated: 2026-10-06. Each phase is reviewed before the next one starts._

| Phase | Status |
| --- | --- |
| 1 — Project foundation | ✅ Done |
| 2 — UI foundation | ✅ Done |
| 3 — Customer menu | ✅ Done |
| 4 — Checkout | ✅ Done |
| 5 — Admin | ✅ Done |
| 6 — Polish & testing | ⏳ Next |

## Decisions confirmed with the owner's contact

* All menu items, prices, delivery areas and fees are **placeholders**. Melty sells sweets plus chicken and fries, so the placeholder menu mixes both.
* The interface is **bilingual**: English plus Egyptian Arabic, with right-to-left layout. Numbers use Western digits, and currency shows as "EGP" in English and "جنيه" in Arabic.
* **Branding** comes from the storefront photo and the logo: navy, fry-yellow, cyan and warm amber. The logo is currently an SVG recreation.
* Delivery covers **one city with a few areas**, each with its own fee. There is no pickup or online payment.
* **WhatsApp status messages** (confirmed 2026-10-06): on an order, staff press one button to open WhatsApp with a prefilled message for its status (accepted, preparing, out for delivery, delivered, rejected…) and send it themselves. This uses WhatsApp's free click-to-chat link (`wa.me`), not the WhatsApp API, so §17 still holds: no paid service, account setup or automatic sending.
* The **admin** area has a single login, a polling dashboard and a product availability toggle only. Full menu management could be offered later as a paid extra.
* Everything runs **locally** until deployment is decided.

## Done

### Phase 1 — Project foundation
* **Project structure:** `server/` (Express 5 + TypeScript + Mongoose) and `client/` (React 19 + TypeScript + Vite + React Router). From the root, `npm run dev` starts both, `npm run seed` reloads the data and `npm run typecheck` checks both projects.
* **Database:** MongoDB Atlas, connected with the standard (non-SRV) URI because Node on this machine can't resolve SRV DNS records.
* **Data models:**
  * Category and Product. Products use one generic options structure that covers both sizes and add-ons.
  * DeliveryArea, with a fee per area.
  * Order, which stores a snapshot of names and prices at order time and has a `fulfillmentType` field ready for adding pickup later.
  * Counter, which generates order numbers starting at #1001.
* **Pricing:** the server recalculates every price, fee and total from the database, and the client only sends IDs and quantities. Egyptian mobile numbers are validated and normalized, and all input is checked with zod.
* **Public API:**
  * `GET /api/menu`
  * `GET /api/delivery-areas`
  * `POST /api/orders/quote`
  * `POST /api/orders`
* **Admin API:** login, logout and session check; order list with status counts; order detail; status change; product availability toggle. All of it is protected on the server (JWT in an httpOnly, SameSite=Strict cookie; bcrypt-hashed password; rate-limited login).
* **Secrets:** they live only in `server/.env`, which git ignores. `.env.example` documents each value.
* **Placeholder data:** everything business-specific is in one file, `server/src/seed/data.ts`: 8 categories, 25 products, 3 Cairo areas and 4 optional sample orders.
* **Tests:** a 33-check API suite passes. It covers the full order flow, price and fee tampering, every invalid case in §26, NoSQL injection, forged or expired tokens and wrong passwords.

### Phase 2 — UI foundation
* **Theme:** design tokens, plus a home-page header that recreates the storefront: a crown of glowing fries over a fluted wood band.
* **Bilingual interface:** English and Arabic dictionaries with a language toggle that switches right-to-left layout. API error codes are translated.
* **Layout:** sticky header with a cart badge, a floating "View cart" bar that persists across pages, and a footer with the Instagram link and a prototype notice (it can be turned off in `client/src/config/business.ts`).
* **Shared components:** buttons, form fields, quantity stepper, bottom sheet, toasts, and loading, empty and error states.
* **Placeholder art:** one illustration per category. A product shows a real photo automatically once it has an image URL.
* **Home page:** opening section, categories, Melty favorites, "Ordering is simple" steps and a closing call to action.
* **UI kit:** an internal page at `/ui` showing every component. It isn't linked from the site.

### Phase 3 — Customer menu
* **Menu page:** a sticky category bar that highlights the section on screen, sections per category, search in both languages, and sold-out states.
* **Product page:**
  * Option groups come entirely from the data (required or optional, choose one or several, maximum limits).
  * A live price breakdown shows how each choice changes the price, with a fixed "Add to cart" bar at the bottom.
  * Edit mode updates a cart item in place.
  * Sold-out and not-found screens.
* **Cart:**
  * It persists across pages and reloads (`localStorage`, IDs and quantities only).
  * Each line shows its options, unit price, quantity, line total, edit and remove.
  * Identical items merge into one line.
  * Items that sell out or leave the menu are flagged and block checkout.
  * A delivery area picker shows the exact fee and total, and the chosen area carries into checkout.
  * It has its own empty state.

### Phase 4 — Checkout
* **Three steps** with a progress bar: Details (`/checkout`) → Review (`/checkout/review`) → Done (`/order/confirmed`).
* **Details form:** name, phone, city, area (with its fee), full address and optional instructions.
  * Client-side checks use the same rules and error codes as the server; errors show in both languages, and focus jumps to the first problem.
  * Phone numbers are accepted as 010…, +20…, 0020… or in Arabic digits, and saved as 11 digits.
  * Details are kept for the browser tab only (`sessionStorage`) and cleared once the order is placed.
* **Review screen:** every detail from §8. Totals come from the server (`/api/orders/quote`), not the browser. Each section has an Edit link.
* **Placing the order:** the button can't be double-submitted. The cart and details are cleared afterwards.
* **Confirmation:** order number, time, delivery area, items and totals, a "What happens next" list, and links back to the menu and home page. It survives a page refresh; there is still no public order lookup.
* **Problem handling:**
  * An item or option that sells out mid-checkout sends the customer back to the cart with the item flagged.
  * A deactivated area sends them back to the details form with a message.
  * Network errors offer a retry; a failed submission warns that the order may not have been sent.
  * Opening checkout or review directly with an empty cart redirects to the cart.
* **Tested in the browser:** the full flow in English on desktop and Arabic on mobile, an item selling out mid-checkout, and direct links. Orders were read back through the admin API, and the 33-check API suite still passes.

### Phase 5 — Admin
* **Separate staff area** at `/admin`, not linked anywhere on the customer site. It has its own header and is a separate code bundle that customers never download. English and Arabic both work.
* **Login:** `/admin/login` with clear messages for a wrong password, rate-limit lockout, an expired session and logging out. Any admin page opened while logged out redirects to the login page; the server enforces access regardless.
* **Orders dashboard:**
  * Status tabs with live counts; the selected tab is kept in the URL.
  * One row per order: number, time ("12:09 · 5 minutes ago"), customer name and phone, area, item count, total and status.
  * Refreshes every 10 seconds and immediately when staff return to the tab. A "Connection lost — retrying…" state appears if the server can't be reached.
  * New orders get a yellow alert, a "Just in" highlight, a count in the browser-tab title such as "(3) Melty Admin", and an optional chime (off by default).
* **Order detail:**
  * One-tap next step (Confirm → Start preparing → Send out for delivery → Mark as delivered), plus a manual status picker for corrections.
  * Rejecting asks for confirmation and reminds staff that the customer isn't notified automatically.
  * Call and copy buttons for the phone, copy for the address, items with options and prices, totals, and the status history with times.
* **WhatsApp message to the customer:**
  * On every order there's a WhatsApp button with a preview of the message for the order's current status, written in the language the customer ordered in.
  * One click opens WhatsApp (app on phones, WhatsApp Web or desktop on computers) with the chat and message ready; staff can edit before sending.
  * After any status change the box lights up to remind staff to send the update.
  * All wording lives in `client/src/config/whatsapp.ts` so the owner can change it.
* **Products:** sold-out toggles grouped by category, with search. Changes reach the customer menu straight away. A note says full product editing comes later.
* **Tested in the browser** (21 checks, English on desktop and Arabic on mobile):
  * login and wrong password
  * a live order placed while the dashboard was open (alert in about 5 seconds)
  * status tabs and order detail
  * status change and reject confirmation
  * the detail page staying loaded across refreshes
  * sold-out toggle reaching the public menu
  * expired session
  * logout lock-out
* **Notes:**
  * The dashboard loads the latest 200 orders, so with more than that the oldest drop out of the tabs. That's fine for a prototype; a real launch would add paging.
  * Login lockout (10 failed tries per 15 minutes) blocks even the correct password until it expires. That is deliberate brute-force protection.

## Left to do

### Phase 6 — Polish & testing (next)
* A complete pass on mobile, desktop and right-to-left layouts; empty, loading and error states; and accessibility.
* The full customer and admin flows plus every invalid case in §26, tested in the browser.
* A security review.
* `ASSUMPTIONS.md` separating placeholder values from confirmed requirements, and a `README.md` with run instructions.

## Open questions for the owner (unchanged from §23)
Exact menu, prices and categories · delivery areas and fees · pickup · payment methods · the wording of the WhatsApp messages, and whether a full WhatsApp API (automatic sending) is ever wanted · staff/admin needs · final branding assets (official logo file and product photos) · opening hours · contact information.

## Notes
* Change the Atlas database password before any real deployment, because it was shared in chat.
* The demo admin login is `admin` / `melty-demo-2026`. To change it, run `npm run hash-password -- "<new password>"` inside `server/`.

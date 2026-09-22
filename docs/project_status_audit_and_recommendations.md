# 🌿 Bazar-Bio Project Status Audit & Strategic Roadmap

**Audit Date:** September 2026  
**Architecture:** Next.js 16 + React 19 + Tailwind v4 (Frontend) | Ruby on Rails 7.2 API + PostgreSQL (Backend)  
**Primary Reference:** `docs/master_architecture_and_roadmap.md`

---

## 📊 1. Executive Summary Matrix

| Domain | Done | Half Done | Hanging | To Be Done |
| :--- | :---: | :---: | :---: | :---: |
| **Backend Relational Data & Migrations** | 90% | 10% | — | — |
| **Order Processing & Inventory Locking** | 95% | — | 5% | — |
| **Storefront & Catalog Browsing** | 100% | — | — | — |
| **Cart & Mobile Shopping Experience** | 100% | — | — | — |
| **3-Step Checkout & Fulfillment Engine** | 95% | — | 5% | — |
| **Auth & Role-Based Access Control (RBAC)**| 20% | — | 80% | — |
| **Portals (Admin & Vendor)** | 10% | 20% | 20% | 50% |
| **WhatsApp Automation & Recurring Drops** | 40% | 10% | 20% | 30% |

---

## 2. ✅ What is Done (Fully Implemented & Functional)

### Backend (Rails 7.2 API & PostgreSQL)
* **Complete Relational Schema & Geography**:
  * 14 tables created and migrated: `products`, `categories`, `units`, `seasons`, `delivery_zones`, `orders`, `order_items`, `customers`, `users`, `artisans`, `coupons`, `payment_methods`, `payment_webhooks`, and `transactions`.
  * Realistic database seeds (`backend/db/seeds.rb`) populated with Yaoundé neighborhoods (Bastos, Odza, Omnisports, Mendong, Melen, etc.), realistic agricultural units (`kg`, `botte`, `tas`, `paquet`, `pc`), bio crops, local artisans (*Mama Jeanne*, *Papa Mbele*), and promo coupons.
* **Pessimistic Locking & Real-Time Stock Depletion**:
  * In `OrdersController#create`, orders run inside database transactions using `Product.lock("FOR UPDATE")` to prevent overselling on flash drops.
  * Decrements stock quantity immediately upon order confirmation.
* **Order Cancellation with Inventory Restoration**:
  * `OrdersController#cancel` and `Order#cancel!` automatically restore stock quantities (`increment!(:stock_quantity)`).
* **Delivery Slots & Minimum Order Enforcement**:
  * Enforces the 3 000 FCFA minimum order threshold in the backend to ensure courier economic viability across Yaoundé.
  * Validates morning (`08h30-12h00`) vs. afternoon (`14h00-18h00`) delivery slots.
* **Active Coupon Engine**:
  * `CouponsController#validate` supports percentage and fixed discounts, minimum cart spend, expiry dates, and maximum discount caps.
* **Automated Backend Test Suite**:
  * 8 Minitest integration tests in `api_endpoints_test.rb` covering product listings, zone fees, server calculations, coupon validations, minimum spend constraints, and stock restoration — **all passing (0 failures)**.

### Frontend (Next.js 16 + React 19)
* **Production Build Integrity**:
  * Next.js build (`next build`) runs cleanly with zero TypeScript or compilation errors.
* **Contextual Image Fallbacks (`<SafeImage>`)**:
  * Implemented in `SafeImage.tsx` adhering to Directive 3. Provides a resilient 2-tier fallback: primary image $\rightarrow$ category photography $\rightarrow$ 100% offline SVG data-URI.
* **Cart State Management & Eco-Impact Engine**:
  * `CartContext.tsx` synchronizes with `localStorage`, calculating plastic avoided (grams), $CO_2$ saved (kg), and local farming families supported in real time.
* **Mobile Responsive Cart UI**:
  * Slide-over `CartDrawer.tsx` with quantity adjustments and weekly subscription (-10%) toggles.
  * Floating one-thumb `MobileCartBar.tsx` shown whenever items are in the cart.
* **Marketplace Catalog & Filters**:
  * `frontend/src/app/products/page.tsx` connects to `getProducts()` with search query, category selection, distance slider, price slider, and sorting.
* **Product Detail Page**:
  * `frontend/src/app/products/[id]/page.tsx` with gallery thumbnails, eco-score breakdown, origin badge, and subscription toggle.

---

## 3. ⚠️ What is Half Done (Partially Implemented / Hybrid Mock-Live / Needs Polish)

* **Checkout Step 3 (Order Review)**:
  * *What's working:* Step 1 collects address and slot; Step 2 handles payment & coupon via API; Step 4 confirms order, calls backend `submitOrder`, and generates the WhatsApp dispatch link.
  * *What's half done:* In `frontend/src/app/checkout/page.tsx`, Step 3 does not show the itemized product review table (images, quantities, line totals) or the customer delivery address recap before the user clicks "Valider et Placer la Commande".
* **Minimum Order Threshold (3 000 FCFA) in Frontend UX**:
  * Handled strictly in the backend. If a user has < 3 000 FCFA in cart, there is no visual warning or progress bar in `CartDrawer` or `checkout/page.tsx` until the backend throws an error upon final submission.
* **Homepage Live Integration**:
  * `frontend/src/app/page.tsx` renders a layout, but uses `const featuredProducts = PRODUCTS.slice(0, 4)` directly from local mock data instead of calling the live API.
* **Admin Dashboard UI**:
  * `frontend/src/app/admin/page.tsx` has rich Figma-styled inventory tables and sales analytics, but it operates purely on in-memory React state (`useState(PRODUCTS)`). Adding, editing, or deleting products does not persist to the database.
* **Customer Account Dashboard**:
  * `frontend/src/app/dashboard/page.tsx` uses hardcoded orders (`INITIAL_ORDERS`). Clicking "Recommander ce panier" merely adds two hardcoded products rather than restoring actual past order line items.
* **Bilingual Translation Parity Violations**:
  * Several raw text strings remain hardcoded in `Navbar.tsx` (mobile search placeholder `"Rechercher à Yaoundé..."`), `Footer.tsx` (hardcoded French category names, logistics, and delivery notes), and `ProductCard.tsx` (titles and aria-labels).

---

## 4. ⏳ What is Still Hanging (Architected / Models Exist, but Disconnected)

* **Authentication & RBAC (Role-Based Access Control)**:
  * Models `User` (`admin`, `vendor`, `staff`) and `Customer` exist with `has_secure_password`, and `bcrypt` is installed.
  * However, there are no authentication controllers or session/JWT endpoints (`/api/v1/auth/*`), and no frontend login/register pages (`/login`, `/register`).
  * Right now, `/admin` and `/dashboard` are completely unprotected.
* **Post-Purchase Guest-to-Customer 1-Click Conversion**:
  * Planned in roadmap Section 8.6 (prompting guests on `/checkout/success` with a single password field to create an account), but the UI form and backend conversion endpoint are missing.
* **In-Card Steppers on Product Cards**:
  * Roadmap Phase 3 specifies that adding a product transforms the card button into a quantity stepper `[ − ] [ 2 kg ] [ + ]`. In `ProductCard.tsx`, it remains a static single-click button.
* **Horizontal Category Navigation Sub-Bar**:
  * Specified in Phase 2 / Section 5.2 as a persistent horizontal scroll bar with pill buttons for quick category switching, but currently missing from `Navbar.tsx`.
* **Navigation IA Cleanup**:
  * Roadmap Section 5.2 explicitly called for removing "Espace Vendeur" from the retail consumer header to keep customer focus on the shop. It is still in `Navbar.tsx`.
* **Payment Webhooks**:
  * The `PaymentWebhook` model and table exist, but there is no webhook endpoint or controller to receive provider callbacks.

---

## 5. 🚀 What is Still to be Done (Not Started Yet)

* **The Dedicated Vendor Portal (`/vendor`)**:
  * No frontend route exists for vetted farmers/artisans.
  * Missing: Stock toggles for vendor's own harvests, add new harvest form, and drop morning "Feuille de Récolte" (Harvest Prep Sheet) for cross-docking logistics.
* **Admin Master Data CRUD Endpoints**:
  * Admin controllers for managing Selling Units (`kg`, `botte`, `tas`), Categories, Seasons, Coupons, Delivery Zones, and Homepage Featured Flags.
  * Curation endpoint `GET /api/v1/homepage`.
* **Phase 6: WhatsApp Scheduled Drop Automation**:
  * Solid Queue background job scheduled for 08:00 AM every Tuesday, Thursday, and Saturday (`0 8 * * 2,4,6`) to compile drops and broadcast to consented customers (`whatsapp_opt_in: true`).
* **Cameroonian Mobile Money USSD Push Integration**:
  * Real NotchPay or Campay API integration for MTN MoMo and Orange Money USSD prompt dispatch.
* **Consignment System & 2-Hour Photo Guarantee**:
  * Glass jar consignment credit (300 FCFA) return flow.
  * "Garantie Fraîcheur 2h" photo claim flow on WhatsApp.

---

## 🎯 Strategic Implementation Roadmap

### Sprint 1: Storefront, Pickup Hub & Conversion Polish (✅ COMPLETED)
1. **Interactive In-Card Steppers (✅ Completed)**:
   * Replaced `[ + Ajouter au panier ]` with responsive `[ − ] [ X kg ] [ + ]` (44×44px touch targets) on product cards when an item is in the cart.
2. **Complete Step 3 Review & Itemized Order Summary (✅ Completed)**:
   * Displays full itemized order table (photo `<SafeImage>`, name, unit, qty, line total) and full delivery address / recipient recap on `/checkout`.
3. **Store Pickup / Collection Point & Delivery Threshold Policy (✅ Completed)**:
   * **Store Pickup Hub (Bastos)**: Free (0 FCFA fee), **zero minimum purchase required**. Any customer can purchase items of any amount (e.g. 500, 1 500 FCFA) and pick up in-store.
   * **Home Delivery**: Minimum order threshold of 3 000 FCFA strictly applies to courier delivery across Yaoundé.
   * Dynamic progress meters and friendly toggle switch (`Passer en Retrait Boutique Gratuit`) implemented in `CartDrawer`, `CartPage`, and `CheckoutPage`.
   * Backend (`OrdersController#create`) permits `fulfillment_type`, validates threshold only on delivery, enforces 0 FCFA fee for pickup, and formats WhatsApp receipt accordingly. Integration tests passing (`api_endpoints_test.rb`).
4. **Bilingual Parity & Translation Integrity (✅ Completed)**:
   * 100% FR/EN dual keys in `frontend/src/lib/i18n.ts`. All raw strings in `Navbar.tsx`, `Footer.tsx`, and `ProductCard.tsx` internationalized.
5. **Horizontal Category Navigation Bar & Header Cleanup (✅ Completed)**:
   * Added persistent horizontal scrolling category pill bar under Navbar. Removed "Espace Vendeur" from consumer header per spec.
6. **Homepage Live Integration (✅ Completed)**:
   * Dynamic fetching with `getProducts()` and `getCategories()` in `frontend/src/app/page.tsx` with resilient fallbacks.

### Sprint 2: Authentication & Role Gateways
1. Build Rails `/api/v1/auth` endpoints (session/JWT) for Customer, Vendor, and Admin.
2. Build frontend `/login`, `/register`, and post-purchase 1-click guest conversion on `/checkout/success`.
3. Protect `/admin` and `/dashboard` with auth middleware/guards.

### Sprint 3: Dedicated Portals (Vendor & Admin)
1. Build `/vendor` with stock toggles and drop morning "Feuille de Récolte".
2. Connect `/admin` to real backend CRUD endpoints (products, units, categories, delivery zones, coupons).

### Sprint 4: WhatsApp Scheduled Automation & Payments
1. Solid Queue recurring jobs for Tuesday/Thursday/Saturday morning drop digests.
2. Live NotchPay/Campay USSD push integration.

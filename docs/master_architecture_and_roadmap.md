# 🌿 Bazar-Bio: Master Architecture, Workflows & Implementation Roadmap

## 📋 1. Executive Vision & Philosophy

**Bazar-Bio** is an online agro-ecological and artisanal marketplace based in Yaoundé, Cameroon. It connects health-conscious urban consumers directly to verified local smallholder farmers and craft artisans (from Mfou, Obala, Bafia, Foumban, and Yaoundé Centre).

### Core Realities & Market Specifics
1. **Dynamic Master Data:** Bio produce strictly obeys agro-ecological seasons and local measurement units (`kg`, `botte`, `tas`, `paquet`, `pièce`). All categories, units, and seasons must be administered dynamically by the platform—never hardcoded.
2. **Curated Storefront vs. Full Marketplace:** The homepage is an editorial showcase of admin-selected fresh harvests, active seasons, and featured artisans. The `/products` marketplace is the comprehensive directory with facet filters.
3. **Strict Role Separation (RBAC):** Vendors cannot self-register openly to protect organic integrity; they are vetted and created by Admins. Admins have master oversight. Registered customers have self-service hubs. Guests can place quick orders with zero friction.
4. **WhatsApp-First Conversion:** In Cameroon, WhatsApp is the primary commercial channel. Traditional email newsletters are replaced with a dual-layer WhatsApp model (Public WhatsApp Channel + 3x weekly curated morning drop digests + direct transactional courier dispatch).

---

## 🏛️ 2. Master Functional Architecture

```
                                  ┌───────────────────────────────────────────────┐
                                  │           ADMIN MASTER CONTROL CENTER         │
                                  │                  (`/admin`)                   │
                                  └───────┬───────────────┬───────────────┬───────┘
                                          │               │               │
                     ┌────────────────────┘               │               └────────────────────┐
                     ▼                                    ▼                                    ▼
       ┌───────────────────────────┐        ┌───────────────────────────┐        ┌───────────────────────────┐
       │   MASTER DATA & CURATION  │        │     VENDOR REGISTRATION   │        │     LOGISTICS & DROPS     │
       ├───────────────────────────┤        ├───────────────────────────┤        ├───────────────────────────┤
       │ • Selling Units (kg, tas) │        │ • Vet & create farmers    │        │ • Delivery zones & fees   │
       │ • Categories & Slugs      │        │ • Assign login accounts   │        │ • Promo coupons engine    │
       │ • Seasons (Rainy/Dry)     │        │ • Moderate crops & crafts │        │ • Preview 3x weekly drop  │
       │ • Homepage Featured Items │        │ • Set vendor spotlight    │        │ • Order dispatch monitor  │
       └─────────────┬─────────────┘        └─────────────┬─────────────┘        └─────────────┬─────────────┘
                     │                                    │                                    │
═════════════════════╪════════════════════════════════════╪════════════════════════════════════╪═════════════════════
                     │                                    │                                    │
                     ▼                                    ▼                                    ▼
       ┌───────────────────────────┐        ┌───────────────────────────┐        ┌───────────────────────────┐
       │   PUBLIC STOREFRONT       │        │   VENDOR PORTAL (`/vendor`)│       │   CUSTOMER & GUEST CHECKOUT│
       ├───────────────────────────┤        ├───────────────────────────┤        ├───────────────────────────┤
       │ • Curated Homepage Drops  │        │ • Only own harvests/stock │        │ • In-card quantity stepper│
       │ • Category Sub-bar        │        │ • Instant stock toggle    │        │ • Auto-open Cart Drawer   │
       │ • Full Market (`/products`)│       │ • Add new harvest form    │        │ • Full Step 3 Order Review│
       │ • Artisan stories         │        │ • Crop prep sheet         │        │ • WhatsApp Channel & MoMo │
       └───────────────────────────┘        └───────────────────────────┘        └───────────────────────────┘
```

---

## 📦 3. Master Data & Curation Engine (Admin Controlled)

### 3.1 Selling Units (`units`)
Bio produce and artisanal creations cannot rely on generic e-commerce assumptions:
* **Admin creates and manages units:** 
  * `kg` (Kilogramme — tubers, carrots, onions)
  * `botte` (Bunched greens, waterleaf, spinach, mint)
  * `tas` (Traditional Cameroonian heap — tomatoes, fresh peppers)
  * `paquet` (Packaged dried spices, chips, teas)
  * `pièce` (Single units — pineapple, papaya, handmade brass jewelry)
  * `pot / bocal` (Honey, traditional condiments in reusable glass jars)
  * `litre` (Cold-pressed avocado oil, shea butter)
  * `panier bio` (Curated weekly harvest basket)
* Vendors must choose from active, admin-approved units when listing items.

### 3.2 Categories (`categories`)
* Admin defines categories, descriptions, slug identifiers, and eco-icon pairings.
* **Homepage Feature Flag:** Admin toggles `is_featured_homepage: boolean`. Only categories explicitly flagged by the admin appear on the homepage visual category grid.

### 3.3 Agro-Ecological Seasons (`seasons`)
* Cameroon's produce strictly adheres to nature's calendar:
  * *Grande saison des pluies* (Heavy rains)
  * *Petite saison des pluies* (Light rains)
  * *Grande saison sèche* (Main dry season)
  * *Petite saison sèche* (Short dry spell)
  * *Toute l'année* (Perennial)
* Admin selects the **Current Active Season** in the platform, which automatically contextualizes catalog badges and prevents out-of-season synthetic greenhouse produce.

### 3.4 Delivery Zones & Fees (`delivery_zones`)
* Specific to Yaoundé neighborhoods: *Bastos, Odza, Omnisports, Mendong, Mvan, Biyem-Assi, Melen, Ekounou, Nsimeyong, Santa Barbara*.
* Admin adjusts delivery fees (e.g., 1,000 to 2,000 FCFA), delivery lead times (e.g., 2h to 4h), and active status based on weather and courier capacity.

### 3.5 Promotional Coupons (`coupons`)
* Admin creates codes (`code`, `discount_type: percent/fixed`, `discount_value`, `min_order_amount`, `max_discount`, `starts_at`, `expires_at`, `is_active`).
* System validates codes during checkout and recalculates the final payable total.

### 3.6 Homepage Curation vs. Marketplace Catalog
* **The Homepage is an Editorial Showcase:**
  * **Hero Banner:** Active seasonal headline + quick link to the curated harvest basket.
  * **Curated Harvest Grid:** Strictly items with `is_featured_homepage: true` (Admin-selected highest-freshness crops).
  * **Artisan Spotlight:** Admin-curated producer profile (e.g., Mama Jeanne, Papa Mbele) with direct story quote and featured products.
  * **Trust & Impact Badges:** Real-time impact calculations.
* **The Marketplace (`/products`):**
  * The exhaustive directory containing all active items across all approved vendors, searchable and filterable by price, distance radius, season, eco-score, and category.

---

## 👥 4. The 4 User Roles & Security Gateways (RBAC)

```
┌─────────────────┬─────────────────┬───────────────────────────┬─────────────────────────┐
│ 1. VISITOR/GUEST│ 2. CUSTOMER     │ 3. VENDOR (PRODUCER)      │ 4. ADMIN MASTER         │
├─────────────────┼─────────────────┼───────────────────────────┼─────────────────────────┤
│ • Anonymous     │ • Self-register │ • Vetted by Admin only    │ • Master platform auth  │
│ • Full catalog  │ • Saved address │ • Only own products       │ • Create vendors        │
│ • Stepper add   │ • Order history │ • 1-Click stock toggles   │ • Manage master data    │
│ • Drawer cart   │ • Re-order drop │ • Add harvest form        │ • Curate homepage       │
│ • Quick checkout│ • WhatsApp pref │ • Drop prep list          │ • Manage 3x drop digest │
│ • WhatsApp link │                 │                           │ • Order central dispatch│
└─────────────────┴─────────────────┴───────────────────────────┴─────────────────────────┘
```

### Detailed Permissions Matrix:

| Capability | Visitor (Guest) | Registered Customer | Vendor (Farmer/Artisan) | Admin |
| :--- | :---: | :---: | :---: | :---: |
| Browse Homepage & Marketplace | ✅ | ✅ | ✅ | ✅ |
| Adjust In-Card Steppers & Cart | ✅ | ✅ | ✅ | ✅ |
| Checkout with WhatsApp Opt-in | ✅ (Guest) | ✅ (Auto-filled) | — | — |
| View Past Orders & Reorder | ❌ | ✅ | ❌ | ✅ (All orders) |
| Manage Delivery Addresses | ❌ | ✅ | ❌ | — |
| Login / Authentication | ❌ | `/login` | `/login` $\rightarrow$ `/vendor` | `/login` $\rightarrow$ `/admin` |
| Create / Edit Own Products | ❌ | ❌ | ✅ | ✅ (Any product) |
| Toggle Stock Availability | ❌ | ❌ | ✅ (Own items) | ✅ (Any item) |
| Set `is_featured_homepage` | ❌ | ❌ | ❌ | ✅ |
| Set `is_featured_drop` (3x/wk) | ❌ | ❌ | ❌ (Request only) | ✅ |
| Manage Units & Categories | ❌ | ❌ | ❌ | ✅ |
| Manage Delivery Zones & Coupons| ❌ | ❌ | ❌ | ✅ |
| Trigger WhatsApp Drops | ❌ | ❌ | ❌ | ✅ |

---

## 🎨 5. Information Architecture & Navigation Layout

### 5.1 Geometry & Visual Hierarchy
* Container standard: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` applied consistently across Header, Main Content, and Footer to eliminate alignment disconnects.

### 5.2 Header & Navigation Stack
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP NOTICE: 🌿 Récoltes bio de Mfou livrées à Yaoundé en 2h  |  Canal WhatsApp  | FR/EN│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [🌿 Bazar-Bio]         [🔍 Rechercher un légume bio, épice...]       [Marché] [👤] [🛒]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Tous les rayons] [Légumes & Tubercules] [Fruits] [Épices Penja] [Soins] [Artisanat]   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
1. **Top Notice Bar (Utility):**
   * Left: Delivery promise (*Récoltes du matin de Mfou livrées en 2h*).
   * Center: Direct link to official WhatsApp Channel.
   * Right: Language switcher (`FR | EN`).
2. **Main Header (Consumer Retail):**
   * Logo: `🌿 Bazar-Bio` with subtitle *Yaoundé • 100% Naturel*.
   * Centered Search Bar with instant autocomplete dropdown.
   * Consumer Navigation: `Marché` (Products), `Producteurs` (Stories).
   * Customer Actions: Profile icon (dropdown for Login/Account) and Cart Trigger with active item counter `[🛒 3]`.
   *(Notice: "Espace Vendeur" is deliberately removed from the retail header to avoid cluttering shoppers).*
3. **Category Sub-Header (Horizontal Scroll Bar):**
   * Persistent horizontal bar with pill buttons for quick category switching.
4. **Footer (Portals & Logistics):**
   * Brand mission & bio charter.
   * Category directory.
   * Yaoundé delivery neighborhoods list.
   * WhatsApp direct courier link + Official WhatsApp Channel card.
   * **Portal Access Link:** *"Espace Partenaires & Producteurs (Connexion Vendeur & Admin)"*.

---

## 🛒 6. Conversion Engine: Quick Add, Cart & Complete Checkout

### 6.1 Interactive In-Card Steppers
* On all product cards (Homepage & Marketplace):
  * **Initial State:** `[ + Ajouter au panier ]`
  * **Active State (When in cart):** Transforms smoothly into a numeric quantity stepper:
    `[ − ]  [ 2 kg ]  [ + ]`
  * Changes sync instantly with cart state without jarring page jumps.

### 6.2 Cart Access & Zero-Friction Navigation
1. **Auto-Opening Slide-Over Drawer:**
   * Adding an item slides open the right drawer showing:
     * Line items with photo, unit price, quantity steppers, and delete button.
     * Environmental impact meter (*Total plastique et CO₂ évité*).
     * Subtotal, active subscription discount (-10% if selected), and estimated delivery fee.
     * Primary action: **`Passer la commande (Checkout) →`**
2. **Sticky Mobile Cart Bar:**
   * On mobile viewports (majority of users), whenever `cartCount > 0`, a floating bottom pill appears:
     `[ 🛒 3 articles • 6 500 FCFA | Voir mon panier → ]`

### 6.3 Complete 3-Step Checkout (`/checkout`) with Full Order Review

```
[ Étape 1 : Coordonnées & Livraison ] ──> [ Étape 2 : Paiement & Coupon ] ──> [ Étape 3 : Récapitulatif & Validation ]
                                                                                               │
                                                                                               ▼
                                                                              [ Étape 4 : Succès & Dispatch WhatsApp ]
```

* **Étape 1 : Coordonnées & Livraison**
  * Nom et Prénom.
  * Numéro de téléphone WhatsApp (+237 obligatoire).
  * Quartier de Yaoundé (Dropdown avec frais de livraison transparents).
  * Adresse précise & Repères de livraison (*ex: Carrefour Bastos, face pharmacie, portail vert*).
  * Checkbox : `[✓] Recevoir les alertes récoltes fraîches sur WhatsApp (3x par semaine max)`.
* **Étape 2 : Mode de Paiement & Code Promo**
  * **Champ Code Promo / Coupon :** Saisie et validation instantanée (ex: `BIOPRIMEUR` déduit -10%).
  * Sélection du paiement : MTN MoMo, Orange Money, ou Paiement en espèces / MoMo à la livraison.
* **Étape 3 : Récapitulatif Complet & Confirmation (True Review Step)**
  * **Bloc Livraison :** Nom, téléphone, quartier choisi, repère d'accès.
  * **Tableau des Produits :** Liste complète avec photo, nom, quantité (`2 kg`, `3 bottes`), et total par ligne.
  * **Décompte Financier :** Sous-total + Frais de livraison − Remise coupon = **Total net à payer**.
  * Bouton d'action : **`Valider et Placer la Commande`**.
* **Étape 4 : Confirmation & Dispatch Logistique**
  * Référence unique de commande (ex: `BB-20260904-948A`).
  * Bouton WhatsApp principal : **`Transmettre ma commande au livreur sur WhatsApp →`**
  * Carte VIP WhatsApp Channel : **`Rejoindre notre Canal WhatsApp Officiel (Gratuit)`**.

---

## 📲 7. Dual-Layer WhatsApp Strategy

1. **Layer 1: Public WhatsApp Channel ("Canal Bazar-Bio Yaoundé"):**
   * 100% free, zero Meta phone ban risk, unlimited audience.
   * High-resolution harvest photography, prices in FCFA, and direct purchase links.
   * Promoted in header, footer, and checkout confirmation.
2. **Layer 2: Curated 3x Weekly Drop Digest (Direct WhatsApp Broadcast):**
   * Scheduled at **08:00 AM every Tuesday, Thursday, and Saturday**.
   * Aggregates items where `is_featured_drop = true` or `last_broadcasted_at` is null/stale.
   * Sent only to customers and guest visitors who explicitly checked the 3x weekly consent box.
3. **Layer 3: Transactional Courier Link:**
   * Pre-fills order receipt details directly into WhatsApp for smooth local delivery dispatch.

---

---

## ⚙️ 8. Core E-Commerce Operational Directives & Business Logic

To operate reliably in Yaoundé's local retail and agricultural context, the system enforces the following 7 operational pillars:

### 8.1 Real-Time Stock Depletion & Pessimistic Locking
* **Over-Selling Prevention:** Orders must use database pessimistic row locking (`product.with_lock`) inside the order creation transaction.
* **Validation:** If `product.stock_quantity < requested_quantity`, rollback immediately with:  
  `"Stock insuffisant pour [Produit] (disponible : [X] [Unité])"`.
* **Depletion:** Automatically decrement `product.decrement!(:stock_quantity, item.quantity)` upon successful order persistence.
* **Restoration on Cancellation:** If an order transitions to `cancelled`, automatically restore inventory (`product.increment!(:stock_quantity, item.quantity)`).

### 8.2 The Central Hub & Cross-Docking Logistics Model
* **The Challenge:** A customer cart frequently contains spinach from Mfou, fruits from Obala, and jewelry from Yaoundé. Individual vendor direct-shipping would cause 3 separate delivery fees and courier chaos.
* **The Standard (Cross-Docking Hub):**
  * Bazar-Bio operates a central logistics hub in Yaoundé (e.g., Bastos / Melen).
  * On drop mornings (Tuesday, Thursday, Saturday by 07:00 AM), partner farmers deliver bulk harvest quantities to the hub.
  * Bazar-Bio quality-inspects produce, packs the unified customer orders in 100% plastic-free kraft/banana leaf packaging, and dispatches a single courier per customer address.
  * The Vendor Portal (`/vendor`) provides a **"Feuille de Récolte" (Harvest Prep Sheet)** summarizing total bulk units to harvest.

### 8.3 Delivery Cycles, Cut-Off Deadlines & Minimum Cart Threshold
* **Order Cut-Off Deadlines:**
  * For Tuesday Harvest $\rightarrow$ Orders close **Monday 18:00 (6:00 PM)**.
  * For Thursday Harvest $\rightarrow$ Orders close **Wednesday 18:00**.
  * For Saturday Bio Market $\rightarrow$ Orders close **Friday 18:00**.
* **Delivery Slots at Checkout:**
  * Customer selects preferred delivery window:
    * `[ Matin : 08h30 - 12h00 ]` (Priorité fraîcheur légumes & fruits)
    * `[ Après-midi : 14h00 - 18h00 ]`
* **Minimum Order Threshold:**
  * Minimum cart total of **3 000 FCFA** enforced to guarantee courier economic viability across Yaoundé topography.

### 8.4 Cameroonian Mobile Money Payment Flows (MTN MoMo & Orange Money)
* **Automated USSD Push (NotchPay / Campay API):**
  * System triggers a USSD prompt to the customer's phone requesting PIN validation.
  * Webhook listener receives confirmation and flips `orders.payment_status` from `pending` to `paid`.
* **Cash on Delivery / MoMo to Courier:**
  * Customer verifies fresh produce at the gate, then pays cash or transfers via MoMo directly to the courier's phone.
  * Courier/Admin marks order as `paid` and `delivered` via mobile admin sheet.

### 8.5 5-Stage Order Lifecycle & Event-Driven WhatsApp Alerts
* **Lifecycle State Machine:**
  ```
  [ pending ] ──> [ confirmed ] ──> [ preparing ] ──> [ out_for_delivery ] ──> [ delivered ]
       │
       └──> [ cancelled ] (Restores stock automatically!)
  ```
* **Automated WhatsApp Dispatches:**
  * When status reaches `out_for_delivery`: Automated notification with courier contact and landmark confirmation.
  * When status reaches `delivered`: Confirmation text + invitation to review and return empty consignment jars.

### 8.6 Frictionless Post-Purchase Guest-to-Account Conversion
* Forcing registration prior to checkout increases cart abandonment by >40% on mobile.
* **Conversion Flow:**
  1. Guests checkout seamlessly with Name, Phone, and Neighborhood.
  2. On `/checkout/success`, the page presents a single field:  
     `"Créez un mot de passe pour sauvegarder cette adresse et suivre votre commande en temps réel"`
  3. One tap creates a registered `Customer` record, attaches the order reference, and saves their delivery zone for next time.

### 8.7 Eco-Packaging Consignment & "Garantie Fraîcheur 2h" Policy
* **Glass Jar Consignment (Consigne Bocaux):**
  * Honey and pure shea butter in reusable glass jars earn a **300 FCFA credit** when returned during the next delivery.
* **Garantie Fraîcheur (2-Hour Photo Guarantee):**
  * Stated clearly on cards and checkout: If any fruit or leafy vegetable is bruised during motorcycle transit, sending a photo via WhatsApp within 2 hours of delivery guarantees immediate replacement or store credit.

---

## 🛠️ 9. Phased Technical Implementation Roadmap

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        BAZAR-BIO MASTER EXECUTION ROADMAP                              │
├────────────────────────────────┬───────────────────────────────────────────────────────┤
│ PHASE 1: Backend API, Auth &   │ • Pessimistic row locking & stock decrement logic.    │
│          Master Data Core      │ • Database migrations for Auth, Roles, and Curation.  │
│                                │ • JWT/Session auth endpoints (`/api/v1/auth/*`).      │
│                                │ • Admin CRUD for Units, Categories, Seasons, Coupons. │
│                                │ • Curation endpoint (`GET /api/v1/homepage`).         │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ PHASE 2: Navigation & Geometry │ • Aligned Header with centered search & clean margins.│
│          Overhaul (Frontend)   │ • Horizontal Category Navigation sub-bar.             │
│                                │ • Portals moved to footer links; consumer nav cleaned.│
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ PHASE 3: Cart & Marketplace    │ • In-card `[ - Qty + ]` steppers on product cards.    │
│          Conversion Engine     │ • Interactive sliding Cart Drawer on item add.        │
│                                │ • Floating mobile cart pill for one-thumb checkout.   │
│                                │ • Minimum order threshold validation (3 000 FCFA).    │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ PHASE 4: Full Checkout &       │ • Delivery slots (Matin / Après-midi) & cut-off rules.│
│          Order Review Step     │ • Coupon validation API & frontend input field.       │
│                                │ • True Step 3 Order Review (Address, items, totals).  │
│                                │ • Post-checkout 1-click guest-to-customer conversion. │
│                                │ • Dual WhatsApp confirmation (Courier link + Channel).│
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ PHASE 5: Dedicated Portals     │ • `/vendor` Portal: Stock toggles, add crop form,     │
│          (Vendor & Admin)      │   and "Feuille de Récolte" bulk drop-off sheet.       │
│                                │ • `/admin` Portal: Vendor onboarding, catalog         │
│                                │   moderation, delivery zones, coupon creator.         │
├────────────────────────────────┼───────────────────────────────────────────────────────┤
│ PHASE 6: WhatsApp Scheduled    │ • Rails 7.2 Solid Queue recurring job (`0 8 * * 2,4,6`)│
│          Drop Automation       │   for Tuesday, Thursday, and Saturday morning drops.  │
│                                │ • Event-driven WhatsApp status triggers (En route).   │
└────────────────────────────────┴───────────────────────────────────────────────────────┘
```

---

*This master document is maintained in `docs/master_architecture_and_roadmap.md` as the definitive functional specification for the Bazar-Bio engineering team.*


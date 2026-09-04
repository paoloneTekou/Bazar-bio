# Bazar-Bio: WhatsApp-First Notification System & User Roles Plan

## 🌿 1. Overview & Strategy

Unlike conventional e-commerce platforms that rely heavily on email newsletters, **Bazar-Bio** implements a **WhatsApp-first communication model** optimized for the local market in Yaoundé, Cameroon.

### Why WhatsApp-First?
* **High Engagement:** In Yaoundé, everyday consumers check WhatsApp multiple times a day; email open rates for grocery shopping are negligible (<15%).
* **Direct Logistics:** Orders, delivery address coordination (carrefours, repères), and Mobile Money payments (MTN MoMo, Orange Money) naturally happen via WhatsApp.
* **3x Weekly Cadence:** Organic produce is seasonal and highly perishable. Sending updates **3 times a week** aligns perfectly with fresh farm harvest arrivals without overwhelming subscribers.

---

## 👥 2. System User Types & Their Roles in the WhatsApp Loop

```
┌─────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│   Admin Users   │        │ Vendors/Artisans │        │ Customers/Guests │
│                 │        │                  │        │                  │
│ • Vets vendors  │        │ • Adds produce   │        │ • Opts into 3x   │
│ • Manages drops │───────>│ • Updates stock  │───────>│   weekly alerts  │
│ • Reviews digest│        │ • Flags harvest  │        │ • Joins Channel  │
└─────────────────┘        └──────────────────┘        └──────────────────┘
```

| User Type | DB Entity | WhatsApp & Platform Role |
| :--- | :--- | :--- |
| **1. Admin Users** | `users` (`role: 'admin'`) | • Registers and approves vendor profiles.<br>• Oversees automated 3x weekly drop digests.<br>• Maintains official WhatsApp Channel links and broadcast templates. |
| **2. Vendors (Artisans/Producers)** | `artisans` (associated with catalog items) | • Registered by administrators.<br>• Publishes fresh organic crops, handmade jewelry, and natural cosmetics.<br>• Updates stock quantities and harvest dates (`available_from`). |
| **3. Registered Customers** | `customers` | • Has user credentials, delivery history, and saved neighborhood.<br>• Consents to WhatsApp updates via profile toggle or checkout (`whatsapp_opt_in: true`).<br>• Can unsubscribe or pause updates at any time. |
| **4. Simple Visitors (Passers-by / Guests)** | `orders` (`customer_id: null`) | • Discovers platform and orders as a guest without creating a password.<br>• Opts into the 3x weekly WhatsApp alerts directly on the checkout form.<br>• Invited to join the public **Bazar-Bio WhatsApp Channel** on the order confirmation screen. |

---

## 📅 3. The 3x Weekly Broadcast Schedule

To maximize conversion and minimize message fatigue, updates are batched into **three distinct morning drops**:

| Day | Target Time | Focus / Drop Theme | Typical Content |
| :--- | :--- | :--- | :--- |
| **Tuesday** | 08:00 AM | **Midweek Farm Harvest** | Fresh leafy greens, seasonal vegetables, roots & tubers harvested Monday. |
| **Thursday** | 08:00 AM | **Pantry & Artisan Restock** | Pure honey, shea butter, artisanal jewelry, eggs, spices, and dried goods. |
| **Saturday** | 07:30 AM | **Weekend Bio Market** | Fresh fruits, weekend family baskets, fast weekend same-day delivery slots. |

> [!IMPORTANT]
> **Anti-Spam Policy:** No instant messages are sent when an individual vendor updates a single product. All updates are aggregated into the scheduled 3x weekly drop digest.

---

## 📲 4. Dual-Layer WhatsApp Architecture

To guarantee 100% deliverability, minimize Meta messaging fees, and prevent spam bans:

```
                                  ┌──────────────────────────────────────────────┐
                                  │           Bazar-Bio Update Trigger           │
                                  └──────────────────────┬───────────────────────┘
                                                         │
                             ┌───────────────────────────┴───────────────────────────┐
                             ▼                                                       ▼
            ┌─────────────────────────────────┐                     ┌─────────────────────────────────┐
            │ Layer A: Public WhatsApp Channel│                     │ Layer B: Scheduled Broadcast    │
            │   ("Canal Bazar-Bio Yaoundé")   │                     │  (Direct to Opted-in Contacts)  │
            ├─────────────────────────────────┤                     ├─────────────────────────────────┤
            │ • 1-Click join (Zero friction)  │                     │ • Requires explicit consent     │
            │ • 100% Free, Zero Meta ban risk │                     │ • Official WhatsApp Cloud API   │
            │ • High-res photos + buy links   │                     │ • Personalized delivery digest  │
            │ • Displayed in Header & Checkout│                     │ • 3x weekly automated schedule  │
            └─────────────────────────────────┘                     └─────────────────────────────────┘
```

### Layer A: Official Public WhatsApp Channel
1. Create an official WhatsApp Channel: **"🌿 Bazar-Bio — Récoltes & Terroir Yaoundé"**.
2. Place visible badges on the frontend:
   * **Header Banner:** *"Rejoignez notre Canal WhatsApp pour les alertes récoltes fraîches (3x/semaine) →"*
   * **Post-Checkout Page:** Large green button allowing visitors to join with one click.
   * **Footer:** Persistent community link.

### Layer B: Direct 1-to-1 Scheduled Notifications (Opted-in Customers)
* Outbound message sent using the official **WhatsApp Business Platform / Cloud API**.
* Targets customers with `whatsapp_opt_in = true`.
* Formatted with interactive quick-reply buttons (e.g., `[Voir le panier bio]`, `[Se désabonner]`).

---

## 🗄️ 5. Required Database Schema Enhancements

### 1. `customers` Table Additions
```ruby
add_column :customers, :whatsapp_opt_in, :boolean, default: true, null: false
add_column :customers, :whatsapp_opt_in_at, :datetime
add_column :customers, :last_whatsapp_sent_at, :datetime
```

### 2. `orders` Table Additions (For Guest Visitors)
```ruby
add_column :orders, :whatsapp_opt_in, :boolean, default: true, null: false
```

### 3. `products` Table Additions
```ruby
add_column :products, :last_broadcasted_at, :datetime
add_column :products, :is_featured_drop, :boolean, default: false
```

---

## ⚙️ 6. Rails Backend Implementation Blueprint

### 6.1 Background Scheduler (Rails 7.2 Solid Queue / Cron)
Configure the scheduled job to run at **08:00 AM every Tuesday, Thursday, and Saturday**:

```yaml
# config/recurring.yml (or whenever / sidekiq-cron)
whatsapp_weekly_drop_digest:
  class: "WhatsappDigestJob"
  schedule: "0 8 * * 2,4,6" # At 08:00 on Tuesday, Thursday, and Saturday
```

### 6.2 The Digest Job Workflow (`WhatsappDigestJob`)
1. **Fetch Eligible Products:**
   ```ruby
   fresh_products = Product.where(is_active: true)
                           .where("stock_quantity > 0")
                           .where("updated_at >= ? OR is_featured_drop = true", 2.days.ago)
                           .order(updated_at: :desc)
                           .limit(5)
   ```
2. **Build Message Payload:**
   ```text
   🌿 Arrivage Frais Bazar-Bio du Mardi !
   Direct de nos producteurs locaux à Yaoundé :
   
   • Avocats Bio de Mfou - 1 500 FCFA / kg
   • Épinards sauvages sans pesticides - 800 FCFA / botte
   • Miel Pur Artisanal - 3 500 FCFA
   
   📦 Livraison aujourd'hui à Bastos, Omnisports, Odza & environs.
   Commandez vite avant rupture : https://bazar-bio.cm/shop
   ```
3. **Dispatch to Background Queue:**
   Iterates through verified opted-in numbers with rate-limiting (e.g., 20 messages/second) to respect API quotas.

---

## 🎨 7. Frontend User Experience (Next.js)

1. **Guest Checkout Checkbox:**
   ```tsx
   <label className="flex items-center space-x-2 text-sm text-stone-700">
     <input
       type="checkbox"
       name="whatsapp_opt_in"
       defaultChecked={true}
       className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
     />
     <span>
       M'informer des nouveaux arrivages par WhatsApp (3x par semaine max, sans spam).
     </span>
   </label>
   ```

2. **Customer Account Dashboard:**
   * Toggle switch under *Paramètres de notification*:
     `[ON] Mises à jour WhatsApp (Mardi, Jeudi, Samedi matin)`

3. **WhatsApp Channel CTA Card (Post-Checkout & Home):**
   * High-contrast card with WhatsApp brand icon inviting one-click subscription.

---

## 📋 8. Action Checklist for Implementation

- [ ] **Step 1: DB Migration**
  - Add `whatsapp_opt_in` to `customers` and `orders`.
  - Add `last_broadcasted_at` to `products`.
- [ ] **Step 2: WhatsApp Channel Setup**
  - Create the official Bazar-Bio Channel and retrieve the permanent invite URL.
  - Add channel CTA buttons to the frontend header, footer, and checkout confirmation.
- [ ] **Step 3: Opt-in UI Integration**
  - Add the 3x weekly consent checkbox to Next.js checkout and registration forms.
- [ ] **Step 4: Background Job Implementation**
  - Configure Solid Queue / Cron schedule in Rails backend (`0 8 * * 2,4,6`).
  - Create `WhatsappDigestJob` and batch message formatter.
- [ ] **Step 5: Admin Drop Preview**
  - Provide an admin UI to preview the 3x weekly message before automated dispatch.

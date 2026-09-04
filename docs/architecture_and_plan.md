# Bazar-Bio: Project Architecture & Roadmap

> [!IMPORTANT]
> **Definitive Master Blueprint:** The complete system architecture, workflows, RBAC matrix, curation engine, and phased execution roadmap are maintained in [master_architecture_and_roadmap.md](./master_architecture_and_roadmap.md).

This document outlines the decoupled architectural design and implementation plan for **Bazar-Bio**, a mobile-first organic produce and handcrafted jewelry e-commerce platform in Yaoundé, Cameroon.

---

## 🛠️ Technology Stack & Best Practices

| Layer | Technology | Role | Best Practice Standard |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (React) + Tailwind CSS | UI/UX & Catalog | TypeScript type safety, App Router directory, React Server Components (RSC) for initial page loads, client-side state for the Shopping Cart, responsive mobile-first layouts. |
| **Backend** | [Ruby on Rails](https://rubyonrails.org/) (API Mode) | Business Logic & API | API-only configuration (`--api`), strict routing namespace (`/api/v1/`), JSON serializers for output formatting, strong parameters filtering, transaction safety, and CORS controls. |
| **Database** | MySQL | Data Storage | Normalization, explicit index constraints, foreign key referential integrity, decimal storage for money, and `utf8mb4` encoding to support emojis and French accents. |
| **Integrations** | WhatsApp Web/App Link | Checkout Dispatch | Clean URL query encoding, structured template text formatting, fallback mechanisms for missing desktop applications. |

---

## 📂 Directory Layout

We will organize the repository as a monorepo with separate root folders for frontend and backend:

```text
Bazar-bio/
├── backend/            # Ruby on Rails API
│   ├── app/
│   │   ├── controllers/api/v1/  # Versioned controllers
│   │   ├── models/
│   │   └── serializers/         # JSON serializers (e.g. Alba or FastJSON)
│   ├── config/
│   └── db/
├── frontend/           # Next.js Application
│   ├── src/
│   │   ├── app/        # Next.js App Router (pages & layouts)
│   │   ├── components/ # Reusable UI components (Cart, ProductCard)
│   │   ├── hooks/      # Custom React hooks (e.g. useCart)
│   │   └── lib/        # API calling utilities (Axios/Fetch wrappers)
│   └── package.json
└── docs/               # System documentation
└── README.md
```

---

## 🔒 Security & Data Integrity Rules

To ensure industry-standard security and consistency, the system enforces the following rules:

### 1. Backend Price Verification (Critical)
* **Rule:** The frontend **must never** dictate the product price or order total.
* **Flow:** The frontend sends only `product_id` and `quantity`. The Rails backend queries the database for active prices, calculates the subtotal, adds the delivery fee based on the database record, and writes the calculated totals. This prevents users from tampering with cart prices (e.g. changing a 10,000 FCFA jewelry piece to 100 FCFA in the browser).

### 2. Transaction Integrity & DB Locking
* Orders and transactions must use database transactions (`ActiveRecord::Base.transaction`). If saving the order fails, the transaction is rolled back, preventing orphaned database entries.

### 3. Cross-Origin Resource Sharing (CORS)
* The Rails app will use the `rack-cors` gem to allow access strictly from the frontend domain (configured via `FRONTEND_URL` environment variable), preventing unauthorized third-party requests.

### 4. Versioned API Contracts
* All API endpoints are prefixed with `/api/v1/`. If the database schema or requirements change in the future, versioning allows us to support old apps (e.g. mobile apps) while deploying newer APIs.

---

## 🔌 API Endpoints (Rails Backend)

All endpoints output standardized JSON envelopes and appropriate HTTP status codes (e.g., `200 OK`, `201 Created`, `422 Unprocessable Entity`, `404 Not Found`).

| Verb | Endpoint | Controller Action | Purpose |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/products` | `api/v1/products#index` | List active products, filtered by season |
| **GET** | `/api/v1/products/:id` | `api/v1/products#show` | Detailed product card view |
| **POST** | `/api/v1/orders` | `api/v1/orders#create` | Validate & save order, generate order ref |
| **GET** | `/api/v1/orders/:id` | `api/v1/orders#show` | Customer order receipt view |
| **GET** | `/api/v1/delivery_zones`| `api/v1/delivery_zones#index`| Retrieve active Yaoundé zones and fees |

---

## 🚀 Implementation Roadmap

### Phase 1: Environment Setup & Project Generation
* **Task 1.1:** Generate Rails API: `rails new backend --api --database=mysql`
* **Task 1.2:** Generate Next.js App: `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
* **Task 1.3:** Setup environment variables (`.env` files) and configure Git exclusions.

### Phase 2: Database Schema & API Setup
* **Task 2.1:** Execute database migrations with proper indexing and foreign keys.
* **Task 2.2:** Seed lookup tables (`units`, `seasons`, `payment_methods`, `order_statuses`, `delivery_zones`) and test items.
* **Task 2.3:** Build API controllers with JSON serializers (e.g., hiding password digests, formatting currency).

### Phase 3: Frontend Catalog & Cart
* **Task 3.1:** Implement mobile-first responsive catalog grid using Next.js client/server components.
* **Task 3.2:** Build LocalStorage-persisted cart state with add/remove/quantity functions.
* **Task 3.3:** Integrate real-time API queries for product listings.

### Phase 4: Order Dispatch & WhatsApp Link
* **Task 4.1:** Build checkout validation forms (name, WhatsApp number, delivery neighborhood selection).
* **Task 4.2:** Post checkout form payload to `/api/v1/orders`. On success, clear the cart.
* **Task 4.3:** Generate and redirect to encoded WhatsApp URL with structured template for Cameroonian delivery logistics.

### Phase 5: WhatsApp Channel & 3x Weekly Drop System
* **Task 5.1:** Update database schema for WhatsApp consent flags on customers and guest orders.
* **Task 5.2:** Add WhatsApp Channel join badges across header, footer, and checkout confirmation.
* **Task 5.3:** Implement Rails background digest job (scheduled 3x weekly: Tue, Thu, Sat morning).
* *(See detailed architecture in [whatsapp_newsletter_and_roles_plan.md](./whatsapp_newsletter_and_roles_plan.md))*


# 📱 AGENTS.md — Mandatory Agent Rules & Guidelines for Bazar-Bio

## 🚨 CRITICAL DIRECTIVE: MOBILE-FIRST RESPONSIVE ARCHITECTURE

Bazar-Bio is an e-commerce platform built for **Yaoundé, Cameroon**, where **over 85% of consumers browse, order, and pay exclusively on mobile smartphones** (predominantly mid-range Android and iOS devices over 3G/4G connections).

**EVERY TIME a page, layout, modal, card, or component is designed, edited, or reviewed, the agent MUST enforce and verify mobile-first responsiveness.** Desktop view is strictly a progressive enhancement of the mobile foundation.

---

### 📏 1. Viewport Standards & Breakpoint Hierarchy

All UI code must be built from the smallest viewport upwards:

| Device Class | Viewport Range | Tailwind Prefix | Requirement |
| :--- | :--- | :--- | :--- |
| **Small Mobile** | **360px – 389px** | (Default / no prefix) | **Primary design target.** Compact Android screens (Tecno, Infinix, Samsung A-series). Everything must fit with zero overflow. |
| **Standard Mobile** | **390px – 430px** | `sm:` (640px+) | Modern iPhones & larger Androids. Generous breathing room, sticky one-thumb navigation. |
| **Tablet / Foldable**| **768px – 1023px** | `md:`, `lg:` | 2-column catalog grids, collapsible drawer sidebars. |
| **Desktop / Laptop** | **1024px+** | `lg:`, `xl:` | Multi-column layouts, expanded filter sidebars, generous editorial white space. |

---

### 📐 2. Strict Coding Rules for All Components & Pages

#### Rule 2.1: Mobile-First CSS (Tailwind Standard)
* **Always code the base classes for mobile first:**
  ```tsx
  // ✅ CORRECT: Mobile-first
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

  // ❌ FORBIDDEN: Desktop-first thinking
  <div className="grid grid-cols-3 max-sm:grid-cols-1">
  ```

#### Rule 2.2: Zero Horizontal Scrolling (Absolute Prohibition)
* No element, table, modal, or container may ever exceed the screen width or cause horizontal viewport scrolling.
* Always enforce `w-full max-w-full overflow-x-hidden` on main containers.
* Tables (e.g. order history, vendor inventory) must be wrapped in `overflow-x-auto` or transformed into stacked mobile cards on screens `< 640px`.

#### Rule 2.3: Touch Ergonomics & Thumb Targets
* **Minimum touch target size:** `44px × 44px` (or `py-3 px-4`, `p-3`).
* Stepper buttons `[ − ]` and `[ + ]` must have distinct padding so users never mis-tap.
* Inputs must have minimum `text-base` (16px) on mobile viewports to prevent iOS Safari and Android browsers from auto-zooming and breaking page scale.

#### Rule 2.4: Mobile Sticky Shopping Actions
* When `cartCount > 0`, a mobile floating cart bar must remain visible at the bottom of the screen above the phone navigation bar:
  > `[ 🛒 2 articles • 4 500 FCFA | Voir mon panier → ]`
* The Cart Drawer must occupy **`w-full (100vw)`** on mobile and `max-w-md` on desktop.
* Checkout step buttons ("Continuer", "Valider la commande") must be full-width on mobile (`w-full py-4 rounded-xl`).

#### Rule 2.5: Modal & Drawer Responsiveness
* Modals must never be taller than `100dvh`. Use `max-h-[90dvh] overflow-y-auto` and bottom sheet patterns on mobile rather than rigid floating desktop boxes.

---

### 📋 3. Agent Pre-Commit Responsive Checklist

Before declaring any page or component complete, the agent MUST run through this checklist:
- [ ] **Tested at 360px width:** Does the page fit without horizontal scrollbars?
- [ ] **Touch friendly:** Are all buttons, steppers, and links easy to tap with a thumb?
- [ ] **Input font size:** Are all `<input>` and `<select>` font sizes at least 16px (`text-base` or `text-sm sm:text-base`) to avoid mobile browser auto-zoom?
- [ ] **Sticky mobile elements:** Are sticky bars (cart pill, bottom CTAs) properly padded?
- [ ] **Modals & Drawers:** Do popups, menus, and drawers scroll smoothly without clipping on short mobile screens?
- [ ] **Data Tables:** Are tables responsive or replaced with mobile card lists on small screens?

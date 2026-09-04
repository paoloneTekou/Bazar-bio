---
trigger: always_on
description: "Mandatory Mobile-First Responsive Design standards for Bazar-Bio"
---

# Mobile-First Responsive Architecture Standard

Bazar-Bio is an e-commerce platform built for Yaoundé, Cameroon, where over 85% of users browse and purchase on mobile devices.

## Core Directives for Every Page and Component:

1. **Base-First Tailwind:**
   - Always write base styles for small mobile screens first (360px - 389px).
   - Use `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px) strictly for progressive enhancement.

2. **Zero Horizontal Overflow:**
   - Never allow horizontal page scrolling on viewports >= 360px.
   - Use `w-full max-w-full`, `truncate`, and responsive grids (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).

3. **Touch Targets (44px Minimum):**
   - Buttons, steppers, and interactive elements must have minimum touch targets of 44x44px.
   - Inputs must use `text-base` (16px) on mobile to prevent automatic viewport zoom.

4. **Mobile Cart & CTAs:**
   - Show a floating bottom cart bar whenever items are in the cart on mobile.
   - Full-width action buttons on mobile screens (`w-full py-4`).

5. **Tables and Modals:**
   - Never show overflowing desktop tables on mobile; wrap with `overflow-x-auto` or use stacked cards.
   - Modals must fit within `max-h-[90dvh] overflow-y-auto`.

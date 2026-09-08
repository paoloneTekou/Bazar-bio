---
trigger: always_on
description: "Mandatory Bilingual (FR/EN) Translation rule for all Bazar-Bio UI components"
---

# 🌐 Mandatory Bilingual (FR/EN) Translation Architecture

Bazar-Bio serves **Yaoundé, Cameroon**, an officially bilingual country (French & English).

## 🚨 Absolute Rule: Zero Hardcoded User-Facing Strings

**EVERY SINGLE USER-FACING TEXT, BUTTON, LABEL, PLACEHOLDER, MODAL, AND ERROR MESSAGE MUST BE TRANSLATED.** No raw string literals are allowed in any JSX or TSX component.

---

### 📐 Strict Implementation Rules

1. **Use the `useLanguage()` Hook:**
   Every component rendering user-facing text must import and use the translation function:
   ```tsx
   import { useLanguage } from '@/context/LanguageContext';

   export function MyComponent() {
     const { t } = useLanguage();
     return <button>{t('checkout_cta')}</button>;
   }
   ```

2. **100% Bilingual Parity in `frontend/src/lib/i18n.ts`:**
   * Whenever a key is created, it **MUST be defined in BOTH `translations.fr` AND `translations.en`**.
   * Missing an English or French counterpart breaks TypeScript typing (`TranslationKey = keyof typeof translations.fr`).

3. **Dynamic Values & Interpolation:**
   * Use parameter interpolation rather than string concatenation:
     ```tsx
     // ✅ CORRECT:
     t('view_all_catalog', { count: products.length })

     // ❌ FORBIDDEN:
     t('view_all') + ' (' + products.length + ') ' + t('products')
     ```

4. **Form Placeholders & Accessibility:**
   * `<input placeholder={t('search_placeholder')} />`
   * `<label>{t('whatsapp_phone_label')}</label>`
   * `<p className="helper">{t('whatsapp_helper_notice')}</p>`
   * `aria-label={t('close_modal')}`

---

### 📋 Agent Pre-Commit Translation Checklist
Before marking any UI task complete, the agent MUST verify:
- [ ] No raw English or French text in JSX tags
- [ ] All `<input placeholder="...">` use `t('...')`
- [ ] Both `translations.fr` and `translations.en` contain the new keys in `frontend/src/lib/i18n.ts`
- [ ] Language toggle works seamlessly between FR and EN

# 🖼️ Mandatory Contextual Default Image Fallbacks Architecture

Bazar-Bio is an e-commerce platform built for Yaoundé, Cameroon. Over 85% of traffic is mobile over variable 3G/4G connections. Broken image icons (`[x]`), blank empty boxes, or generic gray placeholders damage trust and ruin the mobile shopping experience.

## 🚨 Absolute Rule: Zero Broken or Unrepresentative Images

**NEVER RENDER A RAW `<img>` TAG WITHOUT CONTEXTUAL CATEGORY FALLBACK HANDLING.**

Whenever an image URL is missing (`null`, `undefined`, `""`) or fails to load over the network (`onError`), the UI **MUST** automatically display a default visual that accurately represents the category, product type, or content context.

---

### 🎨 1. Category & Context Fallback Matrix

| Context / Category | Visual Representation | Key Identifiers |
| :--- | :--- | :--- |
| **News, Announcements & Harvest Drops** | **Loudspeaker / Megaphone banner** with announcement broadcast badge | `news`, `announcement`, `drop`, `broadcast`, `communique` |
| **Cassava & Tubers (Manioc, Macabo, Ignames)** | **Authentic Cassava / Root Crop** harvest visual & vector icon | `cassava`, `manioc`, `tubercule`, `macabo`, `patate`, `yam`, `taro` |
| **Légumes Bio du Terroir** | **Fresh green vegetables** (Ndolé leaves, fresh organic greens) | `cat-legumes`, `legumes-bio`, `vegetables`, `ndole`, `folong` |
| **Fruits Tropicaux de Saison** | **Tropical fruits** (Sun-ripened pineapple, papaya, plantains) | `cat-fruits`, `fruits-de-saison`, `fruits`, `ananas`, `papaye` |
| **Épices & Aromates Locaux** | **Local spices** (Penja white/black pepper, ginger, djansang) | `cat-epices`, `epices-et-aromates`, `spices`, `poivre`, `penja` |
| **Soins & Cosmétiques Naturels** | **Natural skincare** (Pure shea butter, organic cold-pressed oils) | `cat-soins`, `cosmetiques-naturels`, `skincare`, `karite` |
| **Bijoux & Artisanat Local** | **Cameroonian crafts** (Handcrafted trade beads, bronze, raffia) | `cat-bijoux`, `bijoux-artisanaux`, `jewelry`, `artisanat` |
| **Artisans & Maraîchers** | **Authentic producer portrait** (Local farmer in the field) | `artisan`, `producteur`, `farmer`, `maraicher` |
| **Platform Default** | **Organic harvest basket & leaf emblem** | `default` |

---

### 📐 2. Strict Coding Standards

#### Rule 2.1: Always Use `<SafeImage>`
Never use standard `<img src={...} />` in any component or page. Always import and use `<SafeImage>`:
```tsx
import { SafeImage } from '@/components/ui/SafeImage';

// In a Product Card or Catalog Listing:
<SafeImage
  src={product.imageUrl}
  alt={product.name}
  category={product.categoryId}
  fallbackType={product.categoryId || product.category}
  className="w-full h-full object-cover"
/>

// In a News / Drop Banner:
<SafeImage
  src={announcement.bannerUrl}
  alt={announcement.title}
  fallbackType="news"
  className="w-full h-48 object-cover rounded-2xl"
/>

// In an Artisan Profile:
<SafeImage
  src={artisan.imageUrl}
  alt={artisan.name}
  fallbackType="artisan"
  className="w-14 h-14 rounded-full object-cover"
/>
```

#### Rule 2.2: Two-Tier Resilient Fallback Hierarchy
`SafeImage` automatically implements a 2-tier safety fallback:
1. **Tier 1 (High-Res Photography):** Curated photographic asset matched to the category (`CATEGORY_PHOTO_FALLBACKS`).
2. **Tier 2 (Guaranteed Offline SVG):** If the network drops or the CDN is unreachable, falls back to an inline SVG Data-URI (`SVG_FALLBACKS`) containing the category icon (Megaphone, Cassava, Leaf, etc.) and category label. Zero network request required.

#### Rule 2.3: Context Resolution Helper
When retrieving image URLs in non-React contexts or email/WhatsApp message generators, always use:
```ts
import { getFallbackImage } from '@/lib/placeholders';

const imageUrl = product.imageUrl || getFallbackImage(product.categoryId);
```

---

### 📋 3. Agent Pre-Commit Image Checklist

Before declaring any page or component complete, the agent MUST verify:
- [ ] No raw `<img src={...} />` tags without fallback handling.
- [ ] All image renderings use `<SafeImage>` with `alt` and `category` / `fallbackType` props.
- [ ] Tested with missing or invalid URL: Does it render the correct category visual (e.g., loudspeaker for news, cassava for manioc)?
- [ ] Zero broken image icon or layout shift on image load failure.

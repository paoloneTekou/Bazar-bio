/**
 * Centralized Category-Specific & Contextual Fallback Placeholders for Bazar-Bio.
 * 
 * Enforces Zero-Broken-Image directive across all pages and components.
 * When an image is missing or fails to load:
 * - News / Announcements -> Loudspeaker / Megaphone visual + broadcast banner
 * - Cassava / Tubers -> Root crop / Cassava / Manioc visual
 * - Légumes -> Fresh organic greens / market vegetables
 * - Fruits -> Tropical Cameroonian fruits (Pineapple, Papaya, Plantain)
 * - Épices -> Penja pepper, ginger, local seasonings
 * - Soins & Cosmétiques -> Shea butter, pure organic oils
 * - Bijoux & Artisanat -> Handcrafted beads, bronze, local crafts
 * - Artisan / Farmer -> Local producer portrait
 */

export const CATEGORY_PHOTO_FALLBACKS: Record<string, string> = {
  // 1. Manioc & Tubercules (Cassava, Macabo, Yam, Sweet Potato)
  'cassava': 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80',
  'manioc': 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80',
  'tubercules': 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80',

  // 2. Légumes Bio (Fresh greens, Ndolé, organic garden produce)
  'cat-legumes': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  'legumes-bio': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  'vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',

  // 3. Fruits Tropicaux de Saison (Pineapple, papaya, plantains, citrus)
  'cat-fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  'fruits-de-saison': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  'fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',

  // 4. Épices & Aromates du Terroir (Poivre de Penja, ginger, local spices)
  'cat-epices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
  'epices-et-aromates': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
  'spices': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',

  // 5. Cosmétiques & Soins Naturels (Beurre de karité, pure oils)
  'cat-soins': 'https://images.unsplash.com/photo-1608248597359-548970e30370?auto=format&fit=crop&w=800&q=80',
  'cosmetiques-naturels': 'https://images.unsplash.com/photo-1608248597359-548970e30370?auto=format&fit=crop&w=800&q=80',
  'skincare': 'https://images.unsplash.com/photo-1608248597359-548970e30370?auto=format&fit=crop&w=800&q=80',

  // 6. Bijoux & Artisanat Local (Beads, bronze, wood carvings, crafts)
  'cat-bijoux': 'https://images.unsplash.com/photo-1611591475143-be232935f458?auto=format&fit=crop&w=800&q=80',
  'bijoux-artisanaux': 'https://images.unsplash.com/photo-1611591475143-be232935f458?auto=format&fit=crop&w=800&q=80',
  'jewelry': 'https://images.unsplash.com/photo-1611591475143-be232935f458?auto=format&fit=crop&w=800&q=80',

  // 7. News, Announcements & Harvest Drops (Loudspeaker / Megaphone / Broadcast banner)
  'news': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
  'announcement': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
  'drop': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
  'broadcast': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',

  // 8. Artisans & Farmer Profiles (Authentic Cameroonian agricultural portraits)
  'artisan': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  'producer': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'farmer': 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',

  // 9. Generic Default (Organic leaves & harvest texture)
  'default': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
};

export const DEFAULT_PLACEHOLDERS = CATEGORY_PHOTO_FALLBACKS;

/**
 * Bulletproof SVG Data-URIs rendered offline with category icon & text.
 * Never fails even without internet connection or CDN availability.
 */
function createSvgDataUri(
  title: string,
  subtitle: string,
  bgColor: string,
  accentColor: string,
  iconSvgPath: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450" fill="none">
    <rect width="600" height="450" fill="${bgColor}"/>
    <circle cx="300" cy="180" r="70" fill="${accentColor}" fill-opacity="0.15"/>
    <g transform="translate(268, 148)" stroke="${accentColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">
      ${iconSvgPath}
    </g>
    <text x="300" y="290" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="24" fill="${accentColor}">
      ${title}
    </text>
    <text x="300" y="325" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="14" fill="${accentColor}" fill-opacity="0.8">
      ${subtitle}
    </text>
    <rect x="250" y="350" width="100" height="3" rx="1.5" fill="${accentColor}" fill-opacity="0.3"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Vector Icon Paths for SVG Fallbacks
const SVG_ICONS = {
  // Megaphone / Loudspeaker for News & Drops
  loudspeaker: `
    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  `,
  // Cassava / Root Crop / Tubercule
  cassava: `
    <path d="M6 3c5 2 12 7 14 14-4 2-11 1-16-4-3-3-4-7 2-10z"/>
    <path d="M2 19l4-4"/>
    <path d="M18 5l3-3"/>
    <path d="M9 11c2 0 4 2 4 4"/>
  `,
  // Leaves / Vegetables
  leaf: `
    <path d="M11 20A7 7 0 0 1 4 13C4 7 11 2 20 2c0 9-5 16-11 18z"/>
    <path d="M4 13c7 0 12-4 16-11"/>
  `,
  // Tropical Fruit (Pineapple/Fruit)
  fruit: `
    <ellipse cx="12" cy="14" rx="7" ry="8"/>
    <path d="M12 2v4"/>
    <path d="M8 3c1 2 2 3 4 3s3-1 4-3"/>
    <path d="M9 11l6 6"/>
    <path d="M15 11l-6 6"/>
  `,
  // Spices (Mortar / Pepper)
  spice: `
    <path d="M4 10a8 8 0 0 0 16 0H4z"/>
    <path d="M12 2l-2 8"/>
    <path d="M2 20h20"/>
  `,
  // Cosmetics (Lotion bottle & sparkle)
  cosmetic: `
    <rect x="7" y="8" width="10" height="13" rx="3"/>
    <path d="M10 4h4v4h-4z"/>
    <path d="M12 2v2"/>
  `,
  // Jewelry / Artisanat (Gem / Beads)
  jewelry: `
    <path d="M6 3h12l4 6-10 12L2 9l4-6z"/>
    <path d="M2 9h20"/>
    <path d="M10 3l-2 6 4 12 4-12-2-6"/>
  `,
  // Farmer / Artisan Silhouette
  artisan: `
    <circle cx="12" cy="8" r="4"/>
    <path d="M6 21v-2a6 6 0 0 1 12 0v2"/>
    <path d="M3 8h18"/>
  `,
  // Generic Brand Sprout
  sprout: `
    <path d="M7 20h10"/>
    <path d="M12 20v-8"/>
    <path d="M12 12c-3-4-8-3-8 3 4 0 7-1 8-3z"/>
    <path d="M12 9c3-4 8-3 8 3-4 0-7-1-8-3z"/>
  `,
};

export const SVG_FALLBACKS: Record<string, string> = {
  // 1. News & Drops (Megaphone / Loudspeaker)
  news: createSvgDataUri(
    'Bazar-Bio Actualité',
    'Annonces & Nouveaux Arrivages',
    '#FEF3C7',
    '#B45309',
    SVG_ICONS.loudspeaker
  ),
  drop: createSvgDataUri(
    'Nouveau Drop Récolte',
    'Mardi • Jeudi • Samedi',
    '#FEF3C7',
    '#B45309',
    SVG_ICONS.loudspeaker
  ),

  // 2. Manioc & Tubercules (Cassava)
  cassava: createSvgDataUri(
    'Manioc & Tubercules',
    'Culture Biologique Locale',
    '#F7FEE7',
    '#3F6212',
    SVG_ICONS.cassava
  ),

  // 3. Légumes Bio
  'legumes-bio': createSvgDataUri(
    'Légumes Bio du Terroir',
    'Récolte Fraîche du Jour',
    '#F0FDF4',
    '#166534',
    SVG_ICONS.leaf
  ),

  // 4. Fruits de Saison
  'fruits-de-saison': createSvgDataUri(
    'Fruits Tropicaux de Saison',
    'Mûris Naturellement au Soleil',
    '#FFFBEB',
    '#D97706',
    SVG_ICONS.fruit
  ),

  // 5. Épices & Aromates
  'epices-et-aromates': createSvgDataUri(
    'Épices & Aromates Locaux',
    'Poivre de Penja & Saveurs d\'Afrique',
    '#FEF2F2',
    '#991B1B',
    SVG_ICONS.spice
  ),

  // 6. Soins & Cosmétiques
  'cosmetiques-naturels': createSvgDataUri(
    'Soins & Cosmétiques Bio',
    'Karité Pur & Huiles Naturelles',
    '#F0FDFA',
    '#0F766E',
    SVG_ICONS.cosmetic
  ),

  // 7. Bijoux & Artisanat
  'bijoux-artisanaux': createSvgDataUri(
    'Artisanat & Bijoux Locaux',
    'Fait Main par Nos Artisans',
    '#FDF4FF',
    '#86198F',
    SVG_ICONS.jewelry
  ),

  // 8. Artisan / Maraîcher
  artisan: createSvgDataUri(
    'Artisan / Maraîcher',
    'Partenaire Vérifié Bazar-Bio',
    '#F5F5F4',
    '#292524',
    SVG_ICONS.artisan
  ),

  // 9. Generic Default
  default: createSvgDataUri(
    'Bazar-Bio Yaoundé',
    '100% Naturel & Équitable',
    '#F5F5F0',
    '#2D4A34',
    SVG_ICONS.sprout
  ),
};

/**
 * Normalizes context key (category ID, name, or content type) to canonical key.
 */
export function resolveContextKey(contextKey?: string): string {
  if (!contextKey) return 'default';
  const normalized = contextKey.toLowerCase().trim();

  if (normalized in CATEGORY_PHOTO_FALLBACKS || normalized in SVG_FALLBACKS) {
    return normalized;
  }

  // News, Broadcasts, Loudspeaker
  if (
    normalized.includes('news') ||
    normalized.includes('actualite') ||
    normalized.includes('annonce') ||
    normalized.includes('drop') ||
    normalized.includes('broadcast') ||
    normalized.includes('communique')
  ) {
    return 'news';
  }

  // Cassava, Manioc, Tubercules
  if (
    normalized.includes('cassava') ||
    normalized.includes('manioc') ||
    normalized.includes('tubercule') ||
    normalized.includes('macabo') ||
    normalized.includes('patate') ||
    normalized.includes('yam') ||
    normalized.includes('taro')
  ) {
    return 'cassava';
  }

  // Vegetables / Légumes
  if (
    normalized.includes('legume') ||
    normalized.includes('vegetable') ||
    normalized.includes('ndole') ||
    normalized.includes('folong') ||
    normalized.includes('salade') ||
    normalized.includes('tomate') ||
    normalized.includes('aubergine')
  ) {
    return 'legumes-bio';
  }

  // Fruits
  if (
    normalized.includes('fruit') ||
    normalized.includes('ananas') ||
    normalized.includes('papaye') ||
    normalized.includes('banane') ||
    normalized.includes('mangue') ||
    normalized.includes('orange') ||
    normalized.includes('citron')
  ) {
    return 'fruits-de-saison';
  }

  // Spices / Épices
  if (
    normalized.includes('epice') ||
    normalized.includes('spice') ||
    normalized.includes('poivre') ||
    normalized.includes('penja') ||
    normalized.includes('gingembre') ||
    normalized.includes('ail') ||
    normalized.includes('djansang')
  ) {
    return 'epices-et-aromates';
  }

  // Skincare / Cosmetics
  if (
    normalized.includes('soin') ||
    normalized.includes('karite') ||
    normalized.includes('cosmetique') ||
    normalized.includes('huile') ||
    normalized.includes('savon') ||
    normalized.includes('creme') ||
    normalized.includes('baume')
  ) {
    return 'cosmetiques-naturels';
  }

  // Jewelry / Crafts
  if (
    normalized.includes('bijou') ||
    normalized.includes('jewelry') ||
    normalized.includes('perle') ||
    normalized.includes('bronze') ||
    normalized.includes('sculpture') ||
    normalized.includes('panier') ||
    normalized.includes('craft')
  ) {
    return 'bijoux-artisanaux';
  }

  // Artisans / Producers
  if (
    normalized.includes('artisan') ||
    normalized.includes('producteur') ||
    normalized.includes('farmer') ||
    normalized.includes('maraicher') ||
    normalized.includes('cultivateur')
  ) {
    return 'artisan';
  }

  return 'default';
}

/**
 * Returns a curated photographic fallback for the given category or context.
 */
export function getFallbackImage(contextKey?: string): string {
  const canonical = resolveContextKey(contextKey);
  return CATEGORY_PHOTO_FALLBACKS[canonical] || CATEGORY_PHOTO_FALLBACKS.default;
}

/**
 * Returns a guaranteed inline SVG fallback with category icon and label (works 100% offline).
 */
export function getSvgFallback(contextKey?: string): string {
  const canonical = resolveContextKey(contextKey);
  return SVG_FALLBACKS[canonical] || SVG_FALLBACKS.default;
}

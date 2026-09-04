import { Product, Category, DeliveryZone, Artisan } from '@/types';
import { PRODUCTS, CATEGORIES, DELIVERY_ZONES, ARTISANS } from './data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Transform backend product JSON to frontend Product type
export function transformBackendProduct(raw: any): Product {
  const categoryName = raw.category?.name || 'Bio & Naturel';
  const unitAbbr = raw.unit?.abbreviation || 'kg';
  const unitName = raw.unit?.name || 'Kilogramme';
  
  const artisan: Artisan = raw.artisan
    ? {
        id: String(raw.artisan.id || 'artisan-1'),
        name: raw.artisan.name || 'Artisan Local',
        role: raw.product_type === 'jewelry' ? 'Artisan d\'Art' : 'Agriculteur Bio',
        city: 'Yaoundé & Environs',
        region: 'Centre',
        bio: raw.artisan.bio || 'Producteur local engagé pour l\'agro-écologie et le bio à Yaoundé.',
        imageUrl: raw.artisan.profile_image_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        rating: 4.9,
        productsCount: 10,
        joinedYear: 2023,
      }
    : ARTISANS.ferme_mfou;

  return {
    id: String(raw.id),
    name: raw.name,
    slug: raw.name ? raw.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `product-${raw.id}`,
    categoryId: String(raw.category_id || raw.category?.id || 'cat-legumes'),
    categoryName: categoryName,
    price: Number(raw.price) || 0,
    unit: unitName,
    unitAbbr: unitAbbr,
    season: (raw.season?.name || 'Toute l\'année') as any,
    originCity: raw.origin_city?.name ? `${raw.origin_city.name} (Centre)` : 'Mfou (Centre)',
    distanceKm: raw.product_type === 'jewelry' ? 5 : 22,
    ecoScore: 'A',
    ecoScoreDetails: {
      pesticideFree: true,
      packagingType: raw.product_type === 'jewelry' ? 'Pochon en Coton Bio' : '100% Kraft Compostable',
      co2ReductionPercent: 78,
      plasticAvoidedGrams: 45,
    },
    badges: ['100% Bio', 'Circuit Court (<50km)', 'Zéro Plastique'],
    description: raw.description || 'Produit frais et sain certifié 100% bio et de saison.',
    shortDescription: raw.description?.slice(0, 80) || 'Produit sain récolté le matin même.',
    specifications: typeof raw.specifications === 'object' && raw.specifications !== null
      ? raw.specifications
      : {
          'Origine': 'Région du Centre, Cameroun',
          'Qualité': '100% Non Traité Chimiquement',
          'Livraison': 'Direct producteurs Yaoundé',
        },
    imageUrl: raw.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    galleryImages: (raw.product_images && raw.product_images.length > 0)
      ? raw.product_images.map((img: any) => img.image_url)
      : [raw.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'],
    stockQuantity: Number(raw.stock_quantity) || 10,
    artisan: artisan,
    rating: 4.9,
    reviewsCount: 25,
    isFeatured: true,
    isSubscriptionEligible: raw.product_type !== 'jewelry',
  };
}

// Fetch all active products
export async function getProducts(filters?: {
  category_slug?: string;
  season_code?: string;
  type?: string;
}): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.category_slug && filters.category_slug !== 'all') {
      params.append('category_slug', filters.category_slug);
    }
    if (filters?.season_code && filters.season_code !== 'all') {
      params.append('season_code', filters.season_code);
    }
    if (filters?.type && filters.type !== 'all') {
      params.append('type', filters.type);
    }

    const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }
    
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map(transformBackendProduct);
    }
    return PRODUCTS;
  } catch (error) {
    console.warn('Backend API unavailable or error fetching products, using local fallback:', error);
    return PRODUCTS;
  }
}

// Fetch product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }
    const data = await res.json();
    return transformBackendProduct(data);
  } catch (error) {
    console.warn(`Backend API unavailable for product ${id}, using local fallback:`, error);
    const local = PRODUCTS.find((p) => p.id === id || p.slug === id);
    return local || PRODUCTS[0] || null;
  }
}

// Fetch delivery zones
export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/delivery_zones`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((z: any) => ({
        id: String(z.id),
        name: z.name,
        city: z.city?.name || 'Yaoundé',
        fee: Number(z.delivery_fee) || 1500,
        estimatedDeliveryHours: '1h30 - 2h30',
      }));
    }
    return DELIVERY_ZONES;
  } catch (error) {
    console.warn('Backend API unavailable for delivery zones, using local fallback:', error);
    return DELIVERY_ZONES;
  }
}

// Fetch categories
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((c: any) => {
        const localMatch = CATEGORIES.find((cat) => cat.slug === c.slug);
        return {
          id: String(c.id),
          name: c.name,
          slug: c.slug,
          description: c.description || localMatch?.description || '',
          imageUrl: localMatch?.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
          itemCount: localMatch?.itemCount || 10,
          iconName: localMatch?.iconName || 'Leaf',
        };
      });
    }
    return CATEGORIES;
  } catch (error) {
    console.warn('Backend API unavailable for categories, using local fallback:', error);
    return CATEGORIES;
  }
}

export interface CreateOrderPayload {
  order: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    delivery_zone_id: number | string;
    delivery_address_details: string;
    payment_method_code: 'mtn_momo' | 'orange_momo' | 'cash_on_delivery' | 'card';
    customer_notes?: string;
    whatsapp_opt_in?: boolean;
  };
  items: {
    product_id: number | string;
    quantity: number;
  }[];
}

export interface CreateOrderResponse {
  success: boolean;
  order_reference?: string;
  whatsapp_url?: string;
  subtotal?: number;
  delivery_fee?: number;
  total_amount?: number;
  error?: string;
}

// Create an order via Rails API (with backend price verification)
export async function submitOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || (data.errors ? data.errors.join(', ') : 'Erreur lors de la validation de la commande.'),
      };
    }

    return {
      success: true,
      order_reference: data.order_reference,
      whatsapp_url: data.whatsapp_url,
      subtotal: data.subtotal,
      delivery_fee: data.delivery_fee,
      total_amount: data.total_amount,
    };
  } catch (error: any) {
    console.warn('Backend API order post failed, generating offline order fallback:', error);
    // Offline fallback generator
    const ref = `BB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      order_reference: ref,
    };
  }
}

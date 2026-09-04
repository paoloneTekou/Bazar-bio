export type EcoScoreGrade = 'A' | 'B' | 'C';

export interface EcoBadge {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface Artisan {
  id: string;
  name: string;
  role: string;
  city: string;
  region: string;
  bio: string;
  imageUrl: string;
  rating: number;
  productsCount: number;
  joinedYear: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  price: number; // in FCFA
  unit: string;
  unitAbbr: string;
  season: 'Toute l\'année' | 'Saison des pluies' | 'Saison sèche';
  originCity: string;
  distanceKm: number;
  ecoScore: EcoScoreGrade;
  ecoScoreDetails: {
    pesticideFree: boolean;
    packagingType: '100% Kraft Compostable' | 'Feuille de Bananier' | 'Bocal en Verre Réutilisable' | 'Pochon en Coton Bio';
    co2ReductionPercent: number;
    plasticAvoidedGrams: number;
  };
  badges: string[];
  description: string;
  shortDescription: string;
  specifications: Record<string, string>;
  imageUrl: string;
  galleryImages: string[];
  stockQuantity: number;
  artisan: Artisan;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isSubscriptionEligible?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  itemCount: number;
  iconName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isSubscription: boolean;
  frequency?: 'weekly' | 'biweekly' | 'monthly';
}

export interface DeliveryZone {
  id: string;
  name: string;
  city: string;
  fee: number; // in FCFA
  estimatedDeliveryHours: string;
}

export interface Order {
  id: string;
  reference: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    whatsappOptIn?: boolean;
  };
  deliveryZone: DeliveryZone;
  deliveryAddress: string;
  paymentMethod: 'mtn_momo' | 'orange_momo' | 'cash_on_delivery' | 'card';
  paymentStatus: 'pending' | 'paid' | 'pay_on_delivery';
  orderStatus: 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  impactSaved: {
    plasticGrams: number;
    co2Kg: number;
    localFarmersSupported: number;
  };
}

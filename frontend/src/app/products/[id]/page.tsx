'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/data';
import { getProductById } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { EcoScoreBadge } from '@/components/products/EcoScoreBadge';
import { Product } from '@/types';
import {
  LeafIcon,
  MapPinIcon,
  PackageIcon,
  ShieldCheckIcon,
  TruckIcon,
  StarIcon,
  SparklesIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
} from '@/components/ui/Icons';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const productId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const initialProduct = PRODUCTS.find((p) => p.id === productId || p.slug === productId) || PRODUCTS[0];
  
  const [product, setProduct] = useState<Product>(initialProduct);
  const [selectedImage, setSelectedImage] = useState(initialProduct.imageUrl);
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (productId) {
        const live = await getProductById(productId);
        if (live) {
          setProduct(live);
          setSelectedImage(live.imageUrl);
        }
      }
    }
    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(product, quantity, isSubscription);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const finalUnitPrice = isSubscription ? product.price * 0.9 : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-[#78716C] flex items-center gap-2">
        <Link href="/" className="hover:text-[#3A5A40]">Accueil</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#3A5A40]">Marché</Link>
        <span>/</span>
        <span className="text-[#1C1917] font-semibold">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-white border border-[#E7E5E4] shadow-xs">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <EcoScoreBadge grade={product.ecoScore} size="md" showDetails />
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#1C1917] flex items-center gap-1.5 shadow-xs">
              <MapPinIcon className="w-3.5 h-3.5 text-[#3A5A40]" />
              <span>{product.originCity} • à {product.distanceKm} km de Yaoundé</span>
            </div>
          </div>

          {/* Thumbnails */}
          {product.galleryImages.length > 1 && (
            <div className="flex gap-3">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-[#3A5A40] scale-95 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details, Eco-Score & Purchasing (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#588157]">
                {product.categoryName}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1 text-[#D97706] text-xs font-bold">
                <StarIcon className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating}</span>
                <span className="text-[#A8A29E] font-normal">({product.reviewsCount} avis)</span>
              </div>
            </div>

            <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1B3A24]">
              {product.name}
            </h1>

            <p className="text-sm text-[#57534E] leading-relaxed mt-2">
              {product.description}
            </p>
          </div>

          {/* Pricing & Subscription Option */}
          <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-bold text-[#1B3A24]">
                  {finalUnitPrice.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-[#57534E] ml-1.5">FCFA</span>
                <span className="text-xs text-[#78716C] ml-1">/ {product.unitAbbr}</span>
              </div>

              {isSubscription && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E5EDE6] text-[#2D4732]">
                  -10% appliqué
                </span>
              )}
            </div>

            {/* Subscribe & Save Toggle */}
            {product.isSubscriptionEligible && (
              <div
                onClick={() => setIsSubscription(!isSubscription)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSubscription
                    ? 'bg-[#E5EDE6]/60 border-[#3A5A40] text-[#2D4732]'
                    : 'bg-[#FAF8F5] border-[#E7E5E4] hover:bg-[#F5EFE6]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    isSubscription ? 'bg-[#3A5A40] border-[#3A5A40] text-white' : 'border-[#A8A29E] bg-white'
                  }`}>
                    {isSubscription && <CheckIcon className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <SparklesIcon className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>S'abonner chaque semaine (Économisez 10%)</span>
                    </div>
                    <p className="text-[11px] text-[#78716C]">
                      Livraison automatique à Yaoundé. Annulable sans frais en 1 clic.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-[#E7E5E4] rounded-xl bg-[#FAF8F5] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#57534E] hover:bg-white rounded-lg transition-colors"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-[#1C1917]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#57534E] hover:bg-white rounded-lg transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isAdded
                    ? 'bg-[#2D4732] text-white'
                    : 'bg-[#3A5A40] hover:bg-[#2D4732] text-white hover:scale-[1.02]'
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Ajouté au panier avec succès !</span>
                  </>
                ) : (
                  <>
                    <span>Ajouter au panier • {(finalUnitPrice * quantity).toLocaleString()} FCFA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RADICAL TRANSPARENCY: ECO-SCORE BREAKDOWN */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E7E5E4] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LeafIcon className="w-4 h-4 text-[#3A5A40]" />
                <h3 className="font-bold text-xs text-[#1B3A24] uppercase tracking-wider">
                  Fiche de Transparence Écologique
                </h3>
              </div>
              <EcoScoreBadge grade={product.ecoScore} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#E7E5E4]">
                <span className="text-[#78716C] block text-[11px]">Intrants & Culture</span>
                <strong className="text-[#1C1917] font-semibold">100% Zéro Pesticide</strong>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E7E5E4]">
                <span className="text-[#78716C] block text-[11px]">Emballage Garanti</span>
                <strong className="text-[#1C1917] font-semibold">{product.ecoScoreDetails.packagingType}</strong>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E7E5E4]">
                <span className="text-[#78716C] block text-[11px]">Empreinte Carbone</span>
                <strong className="text-[#3A5A40] font-semibold">-{product.ecoScoreDetails.co2ReductionPercent}% vs Importé</strong>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E7E5E4]">
                <span className="text-[#78716C] block text-[11px]">Plastique Évité</span>
                <strong className="text-[#3A5A40] font-semibold">+{product.ecoScoreDetails.plasticAvoidedGrams}g préservés</strong>
              </div>
            </div>
          </div>

          {/* Producer Profile Box (Meet the Farmer / Artisan) */}
          <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] flex items-start gap-4">
            <img
              src={product.artisan.imageUrl}
              alt={product.artisan.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#3A5A40] shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#588157] uppercase tracking-wider">
                  Producteur / Artisan
                </span>
                <span className="text-xs text-[#A8A29E]">• {product.artisan.city}</span>
              </div>
              <h4 className="font-serif-title font-bold text-sm text-[#1C1917]">
                {product.artisan.name} ({product.artisan.role})
              </h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                "{product.artisan.bio}"
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Specifications & Traceability Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E5E4] space-y-4">
        <h3 className="font-serif-title text-xl font-bold text-[#1B3A24]">
          Spécifications & Traçabilité du Lot
        </h3>
        <div className="divide-y divide-[#F5F5F4] text-xs">
          {Object.entries(product.specifications).map(([key, val], idx) => (
            <div key={idx} className="py-2.5 flex justify-between">
              <span className="text-[#78716C]">{key}</span>
              <span className="font-semibold text-[#1C1917]">{val}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

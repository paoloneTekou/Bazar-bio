'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { CheckIcon, MapPinIcon, LeafIcon, HeartIcon } from '@/components/ui/Icons';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const producerName = product.artisan?.name || product.originCity || 'Producteur Local';

  return (
    <div className="group bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden shadow-xs hover:shadow-md hover:border-[#3A5A40]/40 transition-all flex flex-col h-full">
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="relative aspect-4/3 overflow-hidden bg-[#FAF8F5] block">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top-Right Circular Floating Action Badges (Matches Figma Mockup) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <div
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#3A5A40] shadow-xs"
            title="Produit 100% Bio & Écologique"
          >
            <LeafIcon className="w-3.5 h-3.5" />
          </div>

          <button
            onClick={handleToggleFavorite}
            className={`w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-colors shadow-xs ${
              isFavorited ? 'text-[#DC2626]' : 'text-[#78716C] hover:text-[#DC2626]'
            }`}
            title="Wishlist"
          >
            <HeartIcon className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* Top-Left Eco-Score Pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1B3A24]/85 text-white backdrop-blur-xs shadow-xs">
            Score {product.ecoScore}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          {/* Title */}
          <Link href={`/products/${product.id}`} className="block group-hover:text-[#3A5A40] transition-colors">
            <h3 className="font-serif-title font-bold text-lg text-[#1C1917] leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Producer / Farm Origin */}
          <p className="text-xs text-[#78716C] font-normal line-clamp-1">
            {producerName}
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {/* Price & Distance (Matches Figma Mockup) */}
          <div className="flex items-baseline justify-between text-xs">
            <div className="text-lg font-bold text-[#1C1917]">
              {product.price.toLocaleString()} <span className="text-xs font-semibold text-[#57534E]">FCFA</span>
            </div>
            <div className="text-xs text-[#78716C] font-medium flex items-center gap-1">
              <MapPinIcon className="w-3 h-3 text-[#588157]" />
              <span>{product.distanceKm}km</span>
            </div>
          </div>

          {/* Full Width Quick Add Button (Matches Figma Mockup) */}
          <button
            onClick={handleQuickAdd}
            disabled={isAdded}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
              isAdded
                ? 'bg-[#2D4732] text-white shadow-none'
                : 'bg-[#3A5A40] hover:bg-[#2D4732] text-white active:scale-[0.98]'
            }`}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            {isAdded ? (
              <>
                <CheckIcon className="w-4 h-4" />
                <span>{t('added_to_cart')}</span>
              </>
            ) : (
              <span>{t('quick_add')}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


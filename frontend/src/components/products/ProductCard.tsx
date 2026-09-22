'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { CheckIcon, MapPinIcon, LeafIcon, HeartIcon, PlusIcon, MinusIcon } from '@/components/ui/Icons';
import { SafeImage } from '@/components/ui/SafeImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { t } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const cartItem = cartItems.find((item) => item.product.id === product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
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
        <SafeImage
          src={product.imageUrl}
          alt={product.name}
          category={product.categoryId}
          fallbackType={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top-Right Circular Floating Action Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <div
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#3A5A40] shadow-xs"
            title={t('card_pesticide_free')}
          >
            <LeafIcon className="w-3.5 h-3.5" />
          </div>

          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-colors shadow-xs ${
              isFavorited ? 'text-[#DC2626]' : 'text-[#78716C] hover:text-[#DC2626]'
            }`}
            title={t('card_wishlist')}
            aria-label={t('card_wishlist')}
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
          {/* Price & Distance */}
          <div className="flex items-baseline justify-between text-xs">
            <div className="text-lg font-bold text-[#1C1917]">
              {product.price.toLocaleString()} <span className="text-xs font-semibold text-[#57534E]">FCFA</span>
            </div>
            <div className="text-xs text-[#78716C] font-medium flex items-center gap-1">
              <MapPinIcon className="w-3 h-3 text-[#588157]" />
              <span>{product.distanceKm}km</span>
            </div>
          </div>

          {/* Stepper vs Add to Cart Action */}
          {cartItem && cartItem.quantity > 0 ? (
            <div className="w-full flex items-center justify-between bg-[#FAF8F5] border border-[#3A5A40]/40 rounded-xl p-1 shadow-xs animate-in fade-in">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(product.id, cartItem.quantity - 1);
                }}
                className="min-w-[44px] min-h-[44px] rounded-lg bg-white border border-[#E7E5E4] hover:bg-[#E5EDE6] text-[#1C1917] flex items-center justify-center transition-colors shadow-xs active:scale-95"
                aria-label={t('stepper_decrease')}
                title={t('stepper_decrease')}
              >
                <MinusIcon className="w-4 h-4 text-[#3A5A40]" />
              </button>

              <div className="flex flex-col items-center justify-center px-2">
                <span className="font-bold text-sm text-[#1B3A24]">
                  {cartItem.quantity} {product.unitAbbr || 'kg'}
                </span>
                <span className="text-[10px] text-[#588157] font-medium leading-none">
                  {t('stepper_in_cart')}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(product.id, cartItem.quantity + 1);
                }}
                className="min-w-[44px] min-h-[44px] rounded-lg bg-[#3A5A40] hover:bg-[#2D4732] text-white flex items-center justify-center transition-colors shadow-xs active:scale-95"
                aria-label={t('stepper_increase')}
                title={t('stepper_increase')}
              >
                <PlusIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isAdded}
              className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
                isAdded
                  ? 'bg-[#2D4732] text-white shadow-none'
                  : 'bg-[#3A5A40] hover:bg-[#2D4732] text-white active:scale-[0.98]'
              }`}
              aria-label={t('card_add_to_cart_aria', { name: product.name })}
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
          )}
        </div>
      </div>
    </div>
  );
}

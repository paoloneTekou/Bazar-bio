'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShoppingCartIcon,
  LeafIcon,
  PackageIcon,
  UsersIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowRightIcon,
} from '@/components/ui/Icons';
import { SafeImage } from '@/components/ui/SafeImage';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    toggleSubscription,
    clearCart,
    cartSubtotal,
    cartTotal,
    cartImpact,
  } = useCart();
  const { t } = useLanguage();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#E5EDE6] text-[#3A5A40] flex items-center justify-center mx-auto shadow-xs">
          <ShoppingCartIcon className="w-10 h-10 opacity-70" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1B3A24]">
            {t('empty_cart')}
          </h1>
          <p className="text-xs text-[#78716C] max-w-sm mx-auto leading-relaxed">
            {t('empty_cart_desc')}
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3A5A40] text-white text-xs font-bold hover:bg-[#2D4732] transition-colors shadow-md"
        >
          <span>{t('visit_market')}</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title (Matches Figma: "Shopping Cart") */}
      <div>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1B3A24]">
          {t('cart_page_title')}
        </h1>
      </div>

      {/* Main Grid: Left Cart Items (8 cols), Right Sidebar Cards (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => {
            const linePrice = item.isSubscription
              ? item.product.price * item.quantity * 0.9
              : item.product.price * item.quantity;

            return (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl border border-[#E7E5E4] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs hover:border-[#3A5A40]/30 transition-all"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E7E5E4] shrink-0">
                    <SafeImage
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      category={item.product.categoryId}
                      fallbackType={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-start justify-between sm:justify-start gap-2">
                      <div>
                        <h3 className="font-semibold text-base text-[#1C1917] leading-snug">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-[#78716C]">
                          {item.product.artisan?.name || item.product.originCity}
                        </p>
                      </div>

                      {/* Delete button (on mobile view) */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#A8A29E] hover:text-[#DC2626] p-2 sm:hidden transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subscribe & Save 10% Checkbox */}
                    {item.product.isSubscriptionEligible && (
                      <label className="inline-flex items-center gap-2 cursor-pointer pt-1 group min-h-[32px]">
                        <input
                          type="checkbox"
                          checked={item.isSubscription}
                          onChange={() => toggleSubscription(item.product.id)}
                          className="w-4 h-4 rounded border-[#D6D3D1] text-[#3A5A40] focus:ring-[#3A5A40] accent-[#3A5A40]"
                        />
                        <span className="text-xs text-[#57534E] group-hover:text-[#1C1917] select-none font-medium">
                          {t('cart_subscribe_discount_label')}
                        </span>
                      </label>
                    )}

                    {/* Quantity Stepper & Desktop Trash Button */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="inline-flex items-center border border-[#E7E5E4] rounded-lg bg-[#FAF8F5] p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#57534E] hover:bg-white rounded transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#1C1917]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#57534E] hover:bg-white rounded transition-colors"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Desktop Delete button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="hidden sm:inline-flex text-[#A8A29E] hover:text-[#DC2626] p-2 rounded-lg hover:bg-[#FAF8F5] transition-colors"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Line Price Aligned to Right */}
                <div className="text-right sm:self-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5F5F4]">
                  <span className="text-lg font-bold text-[#1C1917]">
                    {linePrice.toLocaleString()} FCFA
                  </span>
                  {item.isSubscription && (
                    <span className="block text-[11px] text-[#3A5A40] font-medium">
                      {t('cart_weekly_sub_notice')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Clear Cart Link */}
          <div className="pt-2">
            <button
              onClick={clearCart}
              className="text-xs text-[#57534E] hover:text-[#DC2626] underline transition-colors py-2"
            >
              {t('cart_empty_button')}
            </button>
          </div>
        </div>

        {/* Right Sidebar: 2 Cards (Your Impact & Order Summary) */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          
          {/* Card 1: Your Impact (Matches Figma Screenshot) */}
          <div className="bg-white rounded-2xl border border-[#E7E5E4] p-6 shadow-xs space-y-5">
            <h2 className="font-serif-title text-xl font-bold text-[#1B3A24]">
              {t('cart_impact_card_title')}
            </h2>

            <div className="space-y-4 text-xs">
              {/* Plastic Saved */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#3A5A40] flex items-center justify-center border border-[#E7E5E4]">
                  <PackageIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1C1917]">
                    {cartImpact.totalPlasticGrams}g
                  </div>
                  <div className="text-[#78716C]">{t('cart_impact_plastic')}</div>
                </div>
              </div>

              {/* CO2 Saved */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#3A5A40] flex items-center justify-center border border-[#E7E5E4]">
                  <LeafIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1C1917]">
                    {Math.round(cartImpact.totalCo2Kg * 1000)}g
                  </div>
                  <div className="text-[#78716C]">{t('cart_impact_co2')}</div>
                </div>
              </div>

              {/* Local Farmers Supported */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#3A5A40] flex items-center justify-center border border-[#E7E5E4]">
                  <UsersIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#1C1917]">
                    {cartImpact.uniqueFarmersCount}
                  </div>
                  <div className="text-[#78716C]">{t('cart_impact_farmers')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Order Summary (Matches Figma Screenshot) */}
          <div className="bg-white rounded-2xl border border-[#E7E5E4] p-6 shadow-xs space-y-5">
            <h2 className="font-serif-title text-xl font-bold text-[#1B3A24]">
              {t('cart_summary_title')}
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#57534E]">
                <span>{t('cart_subtotal_row')}</span>
                <span className="font-medium text-[#1C1917]">
                  {cartSubtotal.toLocaleString()} FCFA
                </span>
              </div>

              <div className="flex justify-between text-[#57534E]">
                <span>{t('cart_shipping_row')}</span>
                <span className="text-[#78716C]">{t('cart_shipping_calc_note')}</span>
              </div>

              <div className="border-t border-[#E7E5E4] pt-3 flex justify-between items-baseline">
                <span className="font-serif-title text-base font-bold text-[#1C1917]">{t('cart_total_row')}</span>
                <span className="text-xl font-bold text-[#1B3A24]">
                  {cartTotal.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 px-4 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] min-h-[48px]"
            >
              <span>{t('cart_checkout_cta')}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>

            <div className="text-center pt-1">
              <Link
                href="/products"
                className="text-xs text-[#57534E] hover:text-[#1C1917] transition-colors py-2 inline-block"
              >
                {t('cart_continue_cta')}
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

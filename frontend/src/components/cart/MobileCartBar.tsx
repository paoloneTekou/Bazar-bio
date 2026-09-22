'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { ShoppingCartIcon, ArrowRightIcon } from '@/components/ui/Icons';

export function MobileCartBar() {
  const { cartCount, cartTotal, setIsCartOpen } = useCart();
  const { t } = useLanguage();
  const pathname = usePathname();

  if (cartCount === 0 || pathname === '/checkout') {
    return null;
  }

  return (
    <div className="sm:hidden fixed bottom-4 inset-x-4 z-40 animate-in slide-in-from-bottom-5 duration-300">
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-full bg-[#1B3A24] text-white py-3.5 px-5 rounded-2xl shadow-xl border border-[#3A5A40]/40 flex items-center justify-between active:scale-[0.98] transition-transform min-h-[48px]"
        aria-label={t('cart_floating_bar_action')}
      >
        <div className="flex items-center gap-2.5 text-xs font-semibold">
          <div className="w-8 h-8 rounded-full bg-[#3A5A40] flex items-center justify-center text-white shrink-0">
            <ShoppingCartIcon className="w-4 h-4" />
          </div>
          <span>
            {t('dashboard_items_count_badge', { count: cartCount })} • {cartTotal.toLocaleString()} FCFA
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-[#A3C0A6]">
          <span>{t('cart_floating_bar_action')}</span>
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
}

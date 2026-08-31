'use client';

import React from 'react';
import Link from 'next/link';
import { ARTISANS, PRODUCTS } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  LeafIcon,
  PackageIcon,
  RotateCcwIcon,
  HeartIcon,
  SparklesIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  StarIcon,
} from '@/components/ui/Icons';

export default function UserDashboardPage() {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const handleReorderPastBasket = () => {
    // Reorder 3 staple items into the cart
    addToCart(PRODUCTS[0], 2, false);
    addToCart(PRODUCTS[1], 1, false);
    addToCart(PRODUCTS[2], 1, false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Profile Banner */}
      <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E7E5E4] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#3A5A40] text-white flex items-center justify-center font-serif-title text-2xl font-bold shadow-xs">
            P
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E5EDE6] text-[#2D4732] mb-1">
              {t('dashboard_tag')}
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1B3A24]">
              {t('dashboard_title')}
            </h1>
            <p className="text-xs text-[#78716C]">
              {t('dashboard_sub')}
            </p>
          </div>
        </div>

        <Link
          href="/products"
          className="px-5 py-2.5 rounded-full bg-[#3A5A40] hover:bg-[#2D4732] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
        >
          <span>{t('shop_bio_btn')}</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>

      {/* GAMIFIED PERSONAL IMPACT TRACKER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-title text-xl font-bold text-[#1B3A24] flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-[#D97706]" />
            <span>{t('impact_tracker_title')}</span>
          </h2>
          <span className="text-xs text-[#588157] font-semibold">{t('impact_level')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#E5EDE6] text-[#3A5A40] flex items-center justify-center">
              <LeafIcon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-[#1B3A24]">34.5 kg</div>
            <p className="text-xs text-[#78716C]">{t('stat_produce_consumed')}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <PackageIcon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-[#1B3A24]">182 sacs</div>
            <p className="text-xs text-[#78716C]">{t('stat_plastic_avoided')}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-[#1B3A24]">48.2 kg</div>
            <p className="text-xs text-[#78716C]">{t('stat_co2_saved')}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FCE7F3] text-[#BE185D] flex items-center justify-center">
              <HeartIcon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-[#1B3A24]">5 Familles</div>
            <p className="text-xs text-[#78716C]">{t('stat_producers_supported')}</p>
          </div>

        </div>
      </div>

      {/* ORDER HISTORY WITH "REORDER ALL" BUTTON */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E5E4] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#F5F5F4] gap-3">
          <div>
            <h2 className="font-serif-title text-xl font-bold text-[#1B3A24]">
              {t('orders_history_title')}
            </h2>
            <p className="text-xs text-[#78716C]">
              {t('orders_history_sub')}
            </p>
          </div>

          <button
            onClick={handleReorderPastBasket}
            className="px-4 py-2.5 rounded-xl bg-[#E5EDE6] hover:bg-[#3A5A40] text-[#2D4732] hover:text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
          >
            <RotateCcwIcon className="w-4 h-4" />
            <span>{t('reorder_staple_btn')}</span>
          </button>
        </div>

        {/* Orders Table */}
        <div className="divide-y divide-[#F5F5F4] text-xs">
          
          <div className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#1C1917]">BB-892410</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E5EDE6] text-[#2D4732] text-[10px] font-semibold">
                  ✓ {t('delivered_to')} Bastos
                </span>
                <span className="text-[#A8A29E]">• Il y a 5 jours</span>
              </div>
              <p className="text-[#78716C]">
                Carottes de Mfou (2kg), Poivrons d'Obala (1kg), Ananas Pain de Sucre (2pcs)
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-bold text-[#1B3A24] text-sm">6 700 FCFA</span>
              <button
                onClick={handleReorderPastBasket}
                className="px-3 py-1.5 rounded-lg border border-[#3A5A40] text-[#3A5A40] hover:bg-[#FAF8F5] font-semibold text-xs transition-colors"
              >
                {t('reorder_btn')}
              </button>
            </div>
          </div>

          <div className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#1C1917]">BB-741208</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E5EDE6] text-[#2D4732] text-[10px] font-semibold">
                  ✓ {t('delivered_to')} Bastos
                </span>
                <span className="text-[#A8A29E]">• Il y a 12 jours</span>
              </div>
              <p className="text-[#78716C]">
                Poivre Blanc de Penja (1 bocal), Baume Karité & Cacao (1 pot)
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-bold text-[#1B3A24] text-sm">7 500 FCFA</span>
              <button
                onClick={handleReorderPastBasket}
                className="px-3 py-1.5 rounded-lg border border-[#3A5A40] text-[#3A5A40] hover:bg-[#FAF8F5] font-semibold text-xs transition-colors"
              >
                {t('reorder_btn')}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* FAVORITE PRODUCERS & ARTISANS */}
      <div className="space-y-4">
        <h2 className="font-serif-title text-xl font-bold text-[#1B3A24]">
          {t('fav_producers_title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(ARTISANS).slice(0, 2).map((artisan) => (
            <div
              key={artisan.id}
              className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs flex items-center justify-between gap-4 hover:border-[#3A5A40]/40 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={artisan.imageUrl}
                  alt={artisan.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#3A5A40]"
                />
                <div>
                  <h4 className="font-serif-title font-bold text-sm text-[#1C1917]">
                    {artisan.name}
                  </h4>
                  <p className="text-xs text-[#588157] font-medium">{artisan.role}</p>
                  <p className="text-[11px] text-[#78716C]">{artisan.city}</p>
                </div>
              </div>

              <Link
                href={`/products?artisan=${artisan.id}`}
                className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#E5EDE6] text-[#3A5A40] text-xs font-semibold transition-colors shrink-0"
              >
                {t('see_harvests')}
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


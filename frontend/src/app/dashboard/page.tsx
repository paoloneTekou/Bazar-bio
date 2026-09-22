'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { cancelOrder } from '@/lib/api';
import { SafeImage } from '@/components/ui/SafeImage';
import {
  LeafIcon,
  PackageIcon,
  RotateCcwIcon,
  UsersIcon,
  ArrowUpRightIcon,
  AwardIcon,
  XCircleIcon,
} from '@/components/ui/Icons';

interface DashboardOrder {
  id: string;
  reference: string;
  date: string;
  total: number;
  status: 'pending' | 'delivered' | 'cancelled';
  itemsCount: number;
  co2SavedGrams: number;
  plasticSavedGrams: number;
  thumbnails: { src: string; alt: string; category?: string }[];
}

const INITIAL_ORDERS: DashboardOrder[] = [
  {
    id: 'ord-1',
    reference: 'ORD-001',
    date: '3 Février 2026',
    total: 28500,
    status: 'delivered',
    itemsCount: 3,
    co2SavedGrams: 570,
    plasticSavedGrams: 95,
    thumbnails: [
      { src: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=120&q=80', alt: 'Carottes', category: 'legumes-bio' },
      { src: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=120&q=80', alt: 'Poivrons', category: 'legumes-bio' },
      { src: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=120&q=80', alt: 'Ananas', category: 'fruits-de-saison' },
    ],
  },
  {
    id: 'ord-2',
    reference: 'ORD-002',
    date: '18 Janvier 2026',
    total: 16300,
    status: 'delivered',
    itemsCount: 2,
    co2SavedGrams: 340,
    plasticSavedGrams: 80,
    thumbnails: [
      { src: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=120&q=80', alt: 'Poivre', category: 'epices-et-aromates' },
      { src: 'https://images.unsplash.com/photo-1608248597359-548970e30370?auto=format&fit=crop&w=120&q=80', alt: 'Baume Karité', category: 'cosmetiques-naturels' },
    ],
  },
  {
    id: 'ord-3',
    reference: 'BB-202609-8492',
    date: 'Aujourd\'hui',
    total: 8200,
    status: 'pending',
    itemsCount: 2,
    co2SavedGrams: 420,
    plasticSavedGrams: 75,
    thumbnails: [
      { src: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=120&q=80', alt: 'Tomates', category: 'legumes-bio' },
      { src: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=120&q=80', alt: 'Foléré', category: 'epices-et-aromates' },
    ],
  },
];

export default function UserDashboardPage() {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'impact' | 'producers'>('orders');
  const [orders, setOrders] = useState<DashboardOrder[]>(INITIAL_ORDERS);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleReorderPastBasket = (order?: DashboardOrder) => {
    if (order?.thumbnails && order.thumbnails.length > 0) {
      addToCart(PRODUCTS[0], 1, false);
      addToCart(PRODUCTS[1], 1, false);
    } else {
      addToCart(PRODUCTS[0], 1, false);
    }
    alert(t('dashboard_reorder_toast'));
  };

  const handleCancelOrder = async (order: DashboardOrder) => {
    const confirmMessage = t('dashboard_cancel_confirm', { ref: order.reference });
    if (!window.confirm(confirmMessage)) return;

    setCancellingId(order.id);
    await cancelOrder(order.reference);
    setCancellingId(null);

    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'cancelled' } : o))
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 overflow-x-hidden">
      
      {/* Title */}
      <div>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1B3A24]">
          {t('dashboard_hub_title')}
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] mt-1">
          {t('dashboard_sub')}
        </p>
      </div>

      {/* 4 Colorful Top Summary Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Tile 1: Total Orders */}
        <div className="bg-[#3A5A40] text-white p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <PackageIcon className="w-7 h-7 text-[#E5EDE6]" />
            <ArrowUpRightIcon className="w-5 h-5 text-[#A3C0A6]" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight">12</div>
            <p className="text-xs text-[#E5EDE6] font-medium mt-1">{t('dashboard_metric_orders')}</p>
          </div>
        </div>

        {/* Tile 2: CO2 Saved */}
        <div className="bg-[#00C853] text-white p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <LeafIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight">3.2kg</div>
            <p className="text-xs text-white/90 font-medium mt-1">{t('dashboard_metric_co2')}</p>
          </div>
        </div>

        {/* Tile 3: Plastic Saved */}
        <div className="bg-[#0070F3] text-white p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <PackageIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight">0.6kg</div>
            <p className="text-xs text-white/90 font-medium mt-1">{t('dashboard_metric_plastic')}</p>
          </div>
        </div>

        {/* Tile 4: Farmers Supported */}
        <div className="bg-[#8B5A2B] text-white p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <UsersIcon className="w-7 h-7 text-[#F5EFE6]" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight">8</div>
            <p className="text-xs text-[#F5EFE6] font-medium mt-1">{t('dashboard_metric_farmers')}</p>
          </div>
        </div>

      </div>

      {/* Main Container with 3 Tabs */}
      <div className="bg-white rounded-3xl border border-[#E7E5E4] overflow-hidden shadow-xs">
        
        {/* Tabs Navigation Header */}
        <div className="grid grid-cols-3 border-b border-[#E7E5E4] text-center text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 transition-all relative min-h-[44px] ${
              activeTab === 'orders'
                ? 'text-[#1B3A24] font-bold bg-[#FAF8F5]'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]/50'
            }`}
          >
            <span>{t('dashboard_orders_tab')}</span>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3A5A40]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`py-4 transition-all relative min-h-[44px] ${
              activeTab === 'impact'
                ? 'text-[#1B3A24] font-bold bg-[#FAF8F5]'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]/50'
            }`}
          >
            <span>{t('dashboard_impact_tab')}</span>
            {activeTab === 'impact' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3A5A40]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('producers')}
            className={`py-4 transition-all relative min-h-[44px] ${
              activeTab === 'producers'
                ? 'text-[#1B3A24] font-bold bg-[#FAF8F5]'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]/50'
            }`}
          >
            <span>{t('dashboard_producers_tab')}</span>
            {activeTab === 'producers' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3A5A40]" />
            )}
          </button>
        </div>

        {/* TAB 1 CONTENT: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-8 space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#E7E5E4] p-5 sm:p-6 space-y-5 shadow-xs transition-all hover:border-[#3A5A40]/30"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif-title font-bold text-lg sm:text-xl text-[#1C1917]">
                      {order.reference}
                    </h3>
                    <p className="text-xs text-[#78716C] mt-0.5">
                      {order.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-lg sm:text-xl font-bold text-[#1C1917]">
                      {order.total.toLocaleString()} FCFA
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'delivered'
                        ? 'bg-[#E5EDE6] text-[#2D4732]'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status === 'delivered'
                        ? t('dashboard_delivered_status')
                        : order.status === 'cancelled'
                        ? t('dashboard_cancelled_status')
                        : t('dashboard_pending_status')}
                    </span>
                  </div>
                </div>

                {/* Middle Metrics Row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#57534E] py-2 border-y border-[#F5F5F4]">
                  <div className="flex items-center gap-1.5">
                    <PackageIcon className="w-4 h-4 text-[#3A5A40]" />
                    <span>{t('dashboard_items_count_badge', { count: order.itemsCount })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <LeafIcon className="w-4 h-4 text-[#3A5A40]" />
                    <span>{order.co2SavedGrams}g {t('co2_saved_text')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PackageIcon className="w-4 h-4 text-[#3A5A40]" />
                    <span>{order.plasticSavedGrams}g {t('plastic_saved_text')}</span>
                  </div>
                </div>

                {/* Bottom Row: Thumbnails + Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                  <div className="flex items-center -space-x-2">
                    {order.thumbnails.map((thumb, idx) => (
                      <div
                        key={idx}
                        className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0 bg-[#FAF8F5]"
                      >
                        <SafeImage
                          src={thumb.src}
                          alt={thumb.alt}
                          category={thumb.category}
                          fallbackType={thumb.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order)}
                        disabled={cancellingId === order.id}
                        className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[44px]"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        <span>{cancellingId === order.id ? '...' : t('dashboard_cancel_order_btn')}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleReorderPastBasket(order)}
                      className="px-4 py-2 rounded-xl border border-[#D6D3D1] hover:border-[#3A5A40] text-[#1C1917] hover:text-[#3A5A40] text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs min-h-[44px]"
                    >
                      <RotateCcwIcon className="w-3.5 h-3.5" />
                      <span>{t('dashboard_reorder_basket')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2 CONTENT: IMPACT TRACKER */}
        {activeTab === 'impact' && (
          <div className="p-6 sm:p-10 space-y-8 animate-in fade-in">
            <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-12 text-center border border-[#E7E5E4] space-y-8">
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1B3A24]">
                {t('impact_tracker_title')}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-[#E5EDE6] text-[#00C853] flex items-center justify-center shadow-xs">
                    <LeafIcon className="w-10 sm:w-12 h-10 sm:h-12" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#1C1917]">3.2 kg</div>
                    <div className="text-xs text-[#78716C] font-medium">{t('dashboard_metric_co2')}</div>
                    <div className="text-[11px] text-[#A8A29E] mt-0.5">{t('stat_co2_saved')}</div>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-[#E0E7FF] text-[#0070F3] flex items-center justify-center shadow-xs">
                    <PackageIcon className="w-10 sm:w-12 h-10 sm:h-12" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-[#1C1917]">0.6 kg</div>
                    <div className="text-xs text-[#78716C] font-medium">{t('dashboard_metric_plastic')}</div>
                    <div className="text-[11px] text-[#A8A29E] mt-0.5">{t('stat_plastic_avoided')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-xs text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#8B5A2B] flex items-center justify-center mx-auto">
                  <AwardIcon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-title font-bold text-lg text-[#1C1917]">
                  {t('impact_level')}
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  {t('stat_produce_consumed')}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-xs text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#3A5A40] flex items-center justify-center mx-auto">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-title font-bold text-lg text-[#1C1917]">
                  8 {t('dashboard_metric_farmers')}
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  {t('stat_producers_supported')}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-xs text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#00C853] flex items-center justify-center mx-auto">
                  <LeafIcon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-title font-bold text-lg text-[#1C1917]">
                  100% Circuit Court
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  {t('footer_circuit_court')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3 CONTENT: FAVORITE PRODUCERS */}
        {activeTab === 'producers' && (
          <div className="p-4 sm:p-8 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Producer Card 1 */}
              <div className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#3A5A40]/40 transition-all">
                <div>
                  <div className="h-44 overflow-hidden bg-[#FAF8F5]">
                    <SafeImage
                      src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                      alt="Ferme Bio de Mfou"
                      fallbackType="artisan"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif-title font-bold text-lg text-[#1C1917]">
                      Ferme Bio de Mfou
                    </h3>
                    <p className="text-xs text-[#78716C]">
                      Mfou, Yaoundé (Centre)
                    </p>
                    <p className="text-xs text-[#57534E] leading-relaxed pt-1">
                      Agro-écologie familiale. Zéro engrais chimiques de synthèse, 100% compost naturel.
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href="/products"
                    className="w-full py-3 px-4 rounded-xl border border-[#D6D3D1] hover:border-[#3A5A40] text-[#1C1917] hover:text-[#3A5A40] text-xs font-semibold transition-colors block text-center shadow-xs min-h-[44px] flex items-center justify-center"
                  >
                    {t('dashboard_view_products')}
                  </Link>
                </div>
              </div>

              {/* Producer Card 2 */}
              <div className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#3A5A40]/40 transition-all">
                <div>
                  <div className="h-44 overflow-hidden bg-[#FAF8F5]">
                    <SafeImage
                      src="https://images.unsplash.com/photo-1608248597359-548970e30370?auto=format&fit=crop&w=800&q=80"
                      alt="Cosmétiques Bio Yaoundé"
                      fallbackType="cosmetiques-naturels"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif-title font-bold text-lg text-[#1C1917]">
                      Cosmétiques Purs du Terroir
                    </h3>
                    <p className="text-xs text-[#78716C]">
                      Yaoundé (Atelier Essos)
                    </p>
                    <p className="text-xs text-[#57534E] leading-relaxed pt-1">
                      Soins naturels artisanaux préparés à partir de beurre de karité sauvage et cacao pur.
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href="/products"
                    className="w-full py-3 px-4 rounded-xl border border-[#D6D3D1] hover:border-[#3A5A40] text-[#1C1917] hover:text-[#3A5A40] text-xs font-semibold transition-colors block text-center shadow-xs min-h-[44px] flex items-center justify-center"
                  >
                    {t('dashboard_view_products')}
                  </Link>
                </div>
              </div>

              {/* Producer Card 3 */}
              <div className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#3A5A40]/40 transition-all">
                <div>
                  <div className="h-44 overflow-hidden bg-[#FAF8F5]">
                    <SafeImage
                      src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
                      alt="Mama Jeanne & Papa Mbele"
                      fallbackType="bijoux-artisanaux"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif-title font-bold text-lg text-[#1C1917]">
                      Papa Mbele & Mama Jeanne
                    </h3>
                    <p className="text-xs text-[#78716C]">
                      Foumban & Briqueterie (Yaoundé)
                    </p>
                    <p className="text-xs text-[#57534E] leading-relaxed pt-1">
                      Sculpture sur bois, perles enfilées main et trésors artisanaux du patrimoine camerounais.
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href="/products"
                    className="w-full py-3 px-4 rounded-xl border border-[#D6D3D1] hover:border-[#3A5A40] text-[#1C1917] hover:text-[#3A5A40] text-xs font-semibold transition-colors block text-center shadow-xs min-h-[44px] flex items-center justify-center"
                  >
                    {t('dashboard_view_products')}
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}

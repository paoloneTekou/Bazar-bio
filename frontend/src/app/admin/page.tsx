'use client';

import React, { useState } from 'react';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';
import { SafeImage } from '@/components/ui/SafeImage';
import {
  PackageIcon,
  UsersIcon,
  TrendingUpIcon,
  PlusIcon,
  Edit3Icon,
  TrashIcon,
} from '@/components/ui/Icons';

export default function AdminDashboardPage() {
  const [productList, setProductList] = useState(PRODUCTS);
  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics'>('inventory');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { t } = useLanguage();

  const handleStockChange = (id: string, delta: number) => {
    setProductList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + delta) } : p
      )
    );
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm(t('admin_confirm_delete'))) {
      setProductList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header: Title & "Add New Product" Button (Matches Figma Mockup) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#588157] uppercase tracking-wider block mb-1">
            {t('admin_tag')}
          </span>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1B3A24]">
            {t('admin_title')}
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
        >
          <PlusIcon className="w-4 h-4" />
          <span>{t('add_harvest_btn')}</span>
        </button>
      </div>

      {/* 4 Colorful Top Summary Metric Tiles (Matches Figma Screenshots) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Tile 1: Total Products (Dark Green) */}
        <div className="bg-[#3A5A40] text-white p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <PackageIcon className="w-7 h-7 text-[#E5EDE6]" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight">
              {productList.length}
            </div>
            <p className="text-xs text-[#E5EDE6] font-medium mt-1">{t('total_warehouse_stock')}</p>
          </div>
        </div>

        {/* Tile 2: Total Revenue (Emerald Green) */}
        <div className="bg-[#00C853] text-white p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-bold text-2xl">FCFA</span>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight">
              8 150 000
            </div>
            <p className="text-xs text-white/90 font-medium mt-1">{t('weekly_revenue')}</p>
          </div>
        </div>

        {/* Tile 3: Active Customers (Vibrant Blue) */}
        <div className="bg-[#0070F3] text-white p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <UsersIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight">
              342
            </div>
            <p className="text-xs text-white/90 font-medium mt-1">{t('admin_active_customers')}</p>
          </div>
        </div>

        {/* Tile 4: Growth (Warm Earth Brown) */}
        <div className="bg-[#8B5A2B] text-white p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <TrendingUpIcon className="w-7 h-7 text-[#F5EFE6]" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight">
              +23%
            </div>
            <p className="text-xs text-[#F5EFE6] font-medium mt-1">{t('admin_growth_label')}</p>
          </div>
        </div>

      </div>

      {/* Main Container with 2 Tabs (Inventory Management | Sales Analytics) */}
      <div className="bg-white rounded-3xl border border-[#E7E5E4] overflow-hidden shadow-xs">
        
        {/* Tabs Header */}
        <div className="grid grid-cols-2 border-b border-[#E7E5E4] text-center text-sm font-semibold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-4 transition-all relative ${
              activeTab === 'inventory'
                ? 'text-[#1B3A24] font-bold bg-[#FAF8F5]'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]/50'
            }`}
          >
            <span>{t('admin_tab_inventory')}</span>
            {activeTab === 'inventory' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3A5A40]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 transition-all relative ${
              activeTab === 'analytics'
                ? 'text-[#1B3A24] font-bold bg-[#FAF8F5]'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]/50'
            }`}
          >
            <span>{t('admin_tab_analytics')}</span>
            {activeTab === 'analytics' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3A5A40]" />
            )}
          </button>
        </div>

        {/* TAB 1: INVENTORY MANAGEMENT (Matches Figma Screenshot 3) */}
        {activeTab === 'inventory' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[#78716C] font-semibold text-xs border-b border-[#E7E5E4] pb-3">
                  <tr>
                    <th className="py-3 px-4">{t('col_product')}</th>
                    <th className="py-3 px-4">{t('col_category')}</th>
                    <th className="py-3 px-4">{t('col_price')}</th>
                    <th className="py-3 px-4">{t('col_stock')}</th>
                    <th className="py-3 px-4">{t('col_ecoscore')}</th>
                    <th className="py-3 px-4 text-right">{t('col_actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F4]">
                  {productList.map((p, idx) => {
                    const scoreNum = p.ecoScore === 'A' ? 95 - (idx % 4) : 88;

                    return (
                      <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        {/* Product Column */}
                        <td className="py-4 px-4 flex items-center gap-3">
                          <SafeImage
                            src={p.imageUrl}
                            alt={p.name}
                            category={p.categoryId}
                            fallbackType={p.categoryId}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E7E5E4]"
                          />
                          <div>
                            <div className="font-semibold text-sm text-[#1C1917]">{p.name}</div>
                            <span className="text-[11px] text-[#78716C]">
                              {p.artisan?.name || p.originCity}
                            </span>
                          </div>
                        </td>

                        {/* Category Column */}
                        <td className="py-4 px-4 text-[#57534E] font-medium">
                          {p.categoryName}
                        </td>

                        {/* Price Column */}
                        <td className="py-4 px-4 font-bold text-[#1C1917]">
                          {p.price.toLocaleString()} FCFA
                        </td>

                        {/* Stock Column */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#E5EDE6] text-[#2D4732]">
                            {t('admin_units', { count: p.stockQuantity })}
                          </span>
                        </td>

                        {/* Eco-Score Column with Progress Bar */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3 min-w-[120px]">
                            <div className="flex-1 h-2 rounded-full bg-[#E5EDE6] overflow-hidden">
                              <div
                                className="h-full bg-[#3A5A40] rounded-full"
                                style={{ width: `${scoreNum}%` }}
                              />
                            </div>
                            <span className="font-semibold text-xs text-[#1C1917]">{scoreNum}</span>
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleStockChange(p.id, 5)}
                            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-1.5 text-[#57534E] hover:text-[#3A5A40] rounded-lg hover:bg-[#FAF8F5] transition-colors"
                            title="Edit Stock"
                          >
                            <Edit3Icon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center p-1.5 text-[#A8A29E] hover:text-[#DC2626] rounded-lg hover:bg-[#FAF8F5] transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SALES ANALYTICS (Matches Figma Screenshots 1 & 2) */}
        {activeTab === 'analytics' && (
          <div className="p-6 sm:p-10 space-y-10 animate-in fade-in">
            
            {/* Sales by Category Bar Chart Section */}
            <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E7E5E4] space-y-6">
              <h2 className="font-serif-title text-2xl font-bold text-[#1B3A24]">
                {t('admin_sales_by_category')}
              </h2>

              {/* Responsive Bar Chart Graphic */}
              <div className="relative pt-6 pb-2">
                {/* Y-Axis lines */}
                <div className="space-y-8 text-[11px] text-[#A8A29E]">
                  {[6000, 4500, 3000, 1500, 0].map((val) => (
                    <div key={val} className="flex items-center gap-3">
                      <span className="w-8 text-right">{val}</span>
                      <div className="flex-1 h-px bg-[#E7E5E4]" />
                    </div>
                  ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 left-12 right-4 bottom-5 flex items-end justify-around gap-4 sm:gap-8 px-4">
                  
                  {/* Bar 1: Vegetables (4500) */}
                  <div className="flex-1 flex flex-col items-center gap-2 max-w-[120px]">
                    <div
                      className="w-full bg-[#588157] rounded-t-lg transition-all hover:bg-[#3A5A40]"
                      style={{ height: '75%' }}
                      title={`${t('admin_cat_veg')}: 2 950 000 FCFA`}
                    />
                    <span className="text-xs font-semibold text-[#1C1917] text-center">{t('admin_cat_veg')}</span>
                  </div>

                  {/* Bar 2: Skincare (3200) */}
                  <div className="flex-1 flex flex-col items-center gap-2 max-w-[120px]">
                    <div
                      className="w-full bg-[#588157] rounded-t-lg transition-all hover:bg-[#3A5A40]"
                      style={{ height: '53%' }}
                      title={`${t('admin_cat_skin')}: 2 100 000 FCFA`}
                    />
                    <span className="text-xs font-semibold text-[#1C1917] text-center">{t('admin_cat_skin')}</span>
                  </div>

                  {/* Bar 3: Bulk Store (2800) */}
                  <div className="flex-1 flex flex-col items-center gap-2 max-w-[120px]">
                    <div
                      className="w-full bg-[#588157] rounded-t-lg transition-all hover:bg-[#3A5A40]"
                      style={{ height: '46%' }}
                      title={`${t('admin_cat_bulk')}: 1 830 000 FCFA`}
                    />
                    <span className="text-xs font-semibold text-[#1C1917] text-center">{t('admin_cat_bulk')}</span>
                  </div>

                  {/* Bar 4: Dairy (3600) */}
                  <div className="flex-1 flex flex-col items-center gap-2 max-w-[120px]">
                    <div
                      className="w-full bg-[#588157] rounded-t-lg transition-all hover:bg-[#3A5A40]"
                      style={{ height: '60%' }}
                      title={`${t('admin_cat_dairy')}: 2 350 000 FCFA`}
                    />
                    <span className="text-xs font-semibold text-[#1C1917] text-center">{t('admin_cat_dairy')}</span>
                  </div>

                </div>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-2 pt-4 text-xs font-medium text-[#57534E]">
                <span className="w-3 h-3 rounded bg-[#588157]" />
                <span>{t('sales_distribution')}</span>
              </div>
            </div>

            {/* 3 Analytics Cards (Top Selling, Low Stock, Category Performance) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Top Selling Products */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-4">
                <h3 className="font-serif-title font-bold text-lg text-[#1B3A24]">
                  {t('sales_distribution')}
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center text-[#1C1917]">
                    <span>#1 Tomates Fraîches de Mfou</span>
                    <span className="font-bold">104 000 FCFA</span>
                  </div>
                  <div className="flex justify-between items-center text-[#1C1917]">
                    <span>#2 Baume Pur Karité</span>
                    <span className="font-bold">342 000 FCFA</span>
                  </div>
                  <div className="flex justify-between items-center text-[#1C1917]">
                    <span>#3 Poivre Blanc de Penja</span>
                    <span className="font-bold">328 000 FCFA</span>
                  </div>
                  <div className="flex justify-between items-center text-[#1C1917]">
                    <span>#4 Miel Sauvage d&apos;Obala</span>
                    <span className="font-bold">372 000 FCFA</span>
                  </div>
                  <div className="flex justify-between items-center text-[#1C1917]">
                    <span>#5 Feuilles de Morelle Noire</span>
                    <span className="font-bold">219 000 FCFA</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Low Stock Alert */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-4">
                <h3 className="font-serif-title font-bold text-lg text-[#1B3A24]">
                  {t('low_stock_alerts')}
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[#1C1917]">Tomates Fraîches</span>
                    <span className="font-bold text-[#DC2626]">{t('admin_left_stock', { count: 45 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#1C1917]">Poivre de Penja IGP</span>
                    <span className="font-bold text-[#DC2626]">{t('admin_left_stock', { count: 28 })}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#1C1917]">Baume Pur Karité</span>
                    <span className="font-bold text-[#DC2626]">{t('admin_left_stock', { count: 20 })}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Category Performance */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-4">
                <h3 className="font-serif-title font-bold text-lg text-[#1B3A24]">
                  {t('admin_cat_perf')}
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-[#1C1917] font-medium mb-1">
                      <span>{t('admin_cat_veg')}</span>
                      <span className="font-bold">2 950 000 FCFA</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E5EDE6] overflow-hidden">
                      <div className="h-full bg-[#3A5A40] rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#1C1917] font-medium mb-1">
                      <span>{t('admin_cat_skin')}</span>
                      <span className="font-bold">2 100 000 FCFA</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E5EDE6] overflow-hidden">
                      <div className="h-full bg-[#3A5A40] rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#1C1917] font-medium mb-1">
                      <span>{t('admin_cat_bulk')}</span>
                      <span className="font-bold">1 830 000 FCFA</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E5EDE6] overflow-hidden">
                      <div className="h-full bg-[#3A5A40] rounded-full" style={{ width: '55%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[#1C1917] font-medium mb-1">
                      <span>{t('admin_cat_dairy')}</span>
                      <span className="font-bold">2 350 000 FCFA</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E5EDE6] overflow-hidden">
                      <div className="h-full bg-[#3A5A40] rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Add New Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90dvh] overflow-y-auto">
            <h2 className="font-serif-title text-2xl font-bold text-[#1B3A24]">
              {t('admin_add_modal_title')}
            </h2>
            <p className="text-xs text-[#78716C]">
              {t('admin_add_modal_desc')}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(t('admin_add_success'));
                setIsAddModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-semibold text-[#1C1917] block mb-1">{t('admin_product_name')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('admin_placeholder_name')}
                  className="w-full px-3 py-2 border border-[#E7E5E4] rounded-xl text-base sm:text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">{t('admin_category')}</label>
                  <select className="w-full px-3 py-2 border border-[#E7E5E4] rounded-xl bg-white text-base sm:text-xs">
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">{t('admin_price_fcfa')}</label>
                  <input
                    type="number"
                    required
                    placeholder={t('admin_placeholder_price')}
                    className="w-full px-3 py-2 border border-[#E7E5E4] rounded-xl text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">{t('admin_stock_qty')}</label>
                  <input
                    type="number"
                    required
                    placeholder={t('admin_placeholder_stock')}
                    className="w-full px-3 py-2 border border-[#E7E5E4] rounded-xl text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">{t('admin_ecoscore')}</label>
                  <select className="w-full px-3 py-2 border border-[#E7E5E4] rounded-xl bg-white text-base sm:text-xs">
                    <option value="A">Grade A (95/100)</option>
                    <option value="B">Grade B (85/100)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 border border-[#E7E5E4] rounded-xl text-[#57534E] hover:bg-[#FAF8F5]"
                >
                  {t('admin_cancel')}
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#3A5A40] text-white font-bold hover:bg-[#2D4732]"
                >
                  {t('admin_save_btn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}



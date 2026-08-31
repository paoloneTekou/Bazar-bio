'use client';

import React, { useState } from 'react';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import { EcoScoreBadge } from '@/components/products/EcoScoreBadge';
import { useLanguage } from '@/context/LanguageContext';
import {
  BarChart3Icon,
  LayersIcon,
  TrendingUpIcon,
  PackageIcon,
  CheckCircle2Icon,
  PlusIcon,
  SparklesIcon,
  AlertCircleIcon,
} from '@/components/ui/Icons';

export default function AdminDashboardPage() {
  const [productList, setProductList] = useState(PRODUCTS);
  const [filterCategory, setFilterCategory] = useState('all');
  const { t } = useLanguage();

  const handleStockChange = (id: string, delta: number) => {
    setProductList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + delta) } : p
      )
    );
  };

  const filteredProducts = filterCategory === 'all'
    ? productList
    : productList.filter((p) => p.categoryId === filterCategory);

  const totalStockUnits = productList.reduce((sum, p) => sum + p.stockQuantity, 0);
  const lowStockCount = productList.filter((p) => p.stockQuantity <= 10).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border border-[#E7E5E4] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E5EDE6] text-[#2D4732] mb-1">
            {t('admin_tag')}
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1B3A24]">
            {t('admin_title')}
          </h1>
          <p className="text-xs text-[#78716C]">
            {t('admin_sub')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-[#3A5A40] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#2D4732] transition-colors shadow-xs">
            <PlusIcon className="w-4 h-4" />
            <span>{t('add_harvest_btn')}</span>
          </button>
        </div>
      </div>

      {/* SALES & IMPACT ANALYTICS WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span>{t('weekly_revenue')}</span>
            <TrendingUpIcon className="w-4 h-4 text-[#3A5A40]" />
          </div>
          <div className="text-2xl font-bold text-[#1B3A24]">485 000 FCFA</div>
          <p className="text-[11px] text-[#588157] font-semibold">{t('revenue_growth')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span>{t('orders_processed')}</span>
            <CheckCircle2Icon className="w-4 h-4 text-[#3A5A40]" />
          </div>
          <div className="text-2xl font-bold text-[#1B3A24]">74 Paniers</div>
          <p className="text-[11px] text-[#78716C]">{t('zero_plastic_delivered')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span>{t('total_warehouse_stock')}</span>
            <PackageIcon className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-2xl font-bold text-[#1B3A24]">{totalStockUnits} Unités</div>
          <p className="text-[11px] text-[#78716C]">{t('partner_coops')}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span>{t('low_stock_alerts')}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-ping" />
          </div>
          <div className="text-2xl font-bold text-[#DC2626]">{lowStockCount} Produits</div>
          <p className="text-[11px] text-[#78716C]">{t('restock_required')}</p>
        </div>

      </div>

      {/* SALES DISTRIBUTION BY CATEGORY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E5E4] shadow-xs space-y-6">
        <h2 className="font-serif-title text-lg font-bold text-[#1B3A24] flex items-center gap-2">
          <BarChart3Icon className="w-5 h-5 text-[#3A5A40]" />
          <span>{t('sales_distribution')}</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between font-semibold text-[#1C1917] mb-1">
              <span>Légumes & Tubercules Bio (Mfou & Obala)</span>
              <span>42% des ventes (203 700 FCFA)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#FAF8F5] overflow-hidden">
              <div className="h-full bg-[#3A5A40] rounded-full" style={{ width: '42%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-[#1C1917] mb-1">
              <span>Fruits Tropicaux de Saison</span>
              <span>28% des ventes (135 800 FCFA)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#FAF8F5] overflow-hidden">
              <div className="h-full bg-[#588157] rounded-full" style={{ width: '28%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-[#1C1917] mb-1">
              <span>Poivre de Penja & Épices Sauvages</span>
              <span>18% des ventes (87 300 FCFA)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#FAF8F5] overflow-hidden">
              <div className="h-full bg-[#D97706] rounded-full" style={{ width: '18%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-[#1C1917] mb-1">
              <span>Cosmétiques & Bijoux Artisanaux</span>
              <span>12% des ventes (58 200 FCFA)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#FAF8F5] overflow-hidden">
              <div className="h-full bg-[#8B5A2B] rounded-full" style={{ width: '12%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* INVENTORY MANAGEMENT DATA TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E5E4] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#F5F5F4] gap-3">
          <div>
            <h2 className="font-serif-title text-xl font-bold text-[#1B3A24]">
              {t('inventory_title')}
            </h2>
            <p className="text-xs text-[#78716C]">
              {t('inventory_sub')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[#78716C]">Filtrer :</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#FAF8F5] border border-[#E7E5E4] rounded-lg px-2.5 py-1 text-xs text-[#1C1917]"
            >
              <option value="all">Tous les rayons</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#57534E] uppercase text-[10px] tracking-wider border-b border-[#E7E5E4]">
              <tr>
                <th className="py-3 px-4">{t('col_product')}</th>
                <th className="py-3 px-4">{t('col_category')}</th>
                <th className="py-3 px-4">{t('col_ecoscore')}</th>
                <th className="py-3 px-4">{t('col_price')}</th>
                <th className="py-3 px-4">{t('col_stock')}</th>
                <th className="py-3 px-4 text-right">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F4]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#1C1917] flex items-center gap-3">
                    <img src={p.imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover" />
                    <div>
                      <div>{p.name}</div>
                      <span className="text-[10px] text-[#78716C]">{p.originCity} ({p.distanceKm} km)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#57534E]">{p.categoryName}</td>
                  <td className="py-3.5 px-4">
                    <EcoScoreBadge grade={p.ecoScore} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1B3A24]">
                    {p.price.toLocaleString()} FCFA
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      p.stockQuantity <= 10
                        ? 'bg-[#FEE2E2] text-[#B91C1C]'
                        : 'bg-[#E5EDE6] text-[#2D4732]'
                    }`}>
                      {p.stockQuantity} {p.unitAbbr}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleStockChange(p.id, -5)}
                      className="px-2 py-1 bg-white border border-[#E7E5E4] rounded hover:bg-[#FAF8F5] text-[#57534E]"
                      title="Réduire de 5"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => handleStockChange(p.id, +10)}
                      className="px-2 py-1 bg-[#3A5A40] text-white rounded hover:bg-[#2D4732] font-semibold"
                      title="Ajouter 10"
                    >
                      +10
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}


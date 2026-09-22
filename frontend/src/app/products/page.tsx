'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES as INITIAL_CATEGORIES, PRODUCTS as INITIAL_PRODUCTS } from '@/lib/data';
import { getProducts, getCategories } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/products/ProductCard';
import {
  RotateCcwIcon,
  SearchIcon,
  LeafIcon,
  PackageIcon,
  MapPinIcon,
  HeartIcon,
  SparklesIcon,
} from '@/components/ui/Icons';
import { Product, Category } from '@/types';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const { t } = useLanguage();

  const [productsList, setProductsList] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedEcoLabels, setSelectedEcoLabels] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState<number>(1000);
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [liveProducts, liveCategories] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        if (liveProducts && liveProducts.length > 0) {
          setProductsList(liveProducts);
        }
        if (liveCategories && liveCategories.length > 0) {
          setCategoriesList(liveCategories);
        }
      } catch (err) {
        console.warn('Error loading live catalog data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedEcoLabels([]);
    setMaxDistance(1000);
    setMaxPrice(20000);
    setSearchQuery('');
    setSortBy('featured');
  };

  const toggleEcoLabel = (label: string) => {
    setSelectedEcoLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.categoryId !== selectedCategory && product.categoryName !== selectedCategory) {
        return false;
      }
      // Distance filter
      if (product.distanceKm > maxDistance) {
        return false;
      }
      // Price filter
      if (product.price > maxPrice) {
        return false;
      }
      // Search query
      if (
        searchQuery.trim() !== '' &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.badges?.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'distance-asc') return a.distanceKm - b.distanceKm;
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      return 0; // Default featured
    });
  }, [productsList, selectedCategory, maxDistance, maxPrice, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header (Matches Figma Mockup: "Organic Marketplace", "7 sustainable products available") */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E7E5E4] gap-4">
        <div className="space-y-1">
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1B3A24]">
            {t('marketplace_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C]">
            {t('marketplace_subtitle', { count: filteredProducts.length })}
          </p>
        </div>

        {/* Quick Search */}
        <div className="w-full sm:w-80">
          <div className="relative">
            <input
              type="text"
              placeholder={t('search_catalog_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E7E5E4] rounded-full text-base sm:text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
            />
            <SearchIcon className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar (1 col) + Products Grid (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Filter Sidebar (Matches Figma Mockups) */}
        <aside className="lg:col-span-4 xl:col-span-3 bg-white p-6 rounded-3xl border border-[#E7E5E4] space-y-6 sticky top-28 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F5F5F4] pb-3">
            <h2 className="font-serif-title text-xl font-bold text-[#1B3A24]">
              {t('filters')}
            </h2>
            <button
              onClick={resetFilters}
              className="text-xs text-[#78716C] hover:text-[#3A5A40] flex items-center gap-1 font-medium min-h-[44px] min-w-[44px] justify-end"
              title={t('reset_filters')}
            >
              <RotateCcwIcon className="w-3.5 h-3.5" />
              <span>{t('reset')}</span>
            </button>
          </div>

          {/* 1. Category Checkboxes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
              {t('category')}
            </h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer group min-h-[36px]">
                <input
                  type="checkbox"
                  checked={selectedCategory === 'all'}
                  onChange={() => setSelectedCategory('all')}
                  className="w-4 h-4 rounded border-[#D6D3D1] text-[#3A5A40] focus:ring-[#3A5A40] accent-[#3A5A40]"
                />
                <span className="text-[#57534E] group-hover:text-[#1C1917]">{t('all_categories')}</span>
              </label>

              {categoriesList.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                    className="w-4 h-4 rounded border-[#D6D3D1] text-[#3A5A40] focus:ring-[#3A5A40] accent-[#3A5A40]"
                  />
                  <span className="text-[#57534E] group-hover:text-[#1C1917] truncate">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Eco-Label Checkboxes with Icons */}
          <div className="space-y-3 pt-4 border-t border-[#F5F5F4]">
            <h3 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
              {t('eco_label')}
            </h3>
            <div className="space-y-2.5 text-xs">
              {[
                { id: 'organic', label: t('filter_organic'), icon: <LeafIcon className="w-3.5 h-3.5 text-[#3A5A40]" /> },
                { id: 'local', label: t('filter_local'), icon: <MapPinIcon className="w-3.5 h-3.5 text-[#0070F3]" /> },
                { id: 'score_a', label: t('filter_score_a'), icon: <SparklesIcon className="w-3.5 h-3.5 text-[#00C853]" /> },
                { id: 'score_b', label: t('filter_score_b'), icon: <SparklesIcon className="w-3.5 h-3.5 text-[#D97706]" /> },
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-2.5 cursor-pointer group min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={selectedEcoLabels.includes(item.id)}
                    onChange={() => toggleEcoLabel(item.id)}
                    className="w-4 h-4 rounded border-[#D6D3D1] text-[#3A5A40] focus:ring-[#3A5A40] accent-[#3A5A40]"
                  />
                  <span className="flex items-center gap-2 text-[#57534E] group-hover:text-[#1C1917]">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Price Range Slider (Matches Figma Screenshot) */}
          {/* 3. Price Range Slider */}
          <div className="space-y-2 pt-4 border-t border-[#F5F5F4]">
            <div className="flex justify-between text-xs font-bold text-[#1C1917]">
              <span>{t('price_range')}</span>
              <span className="text-[#3A5A40]">{maxPrice.toLocaleString()} FCFA</span>
            </div>
            <input
              type="range"
              min="500"
              max="20000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#3A5A40] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#78716C]">
              <span>500 FCFA</span>
              <span>20 000 FCFA</span>
            </div>
          </div>

          {/* 4. Distance (km) Slider */}
          <div className="space-y-2 pt-4 border-t border-[#F5F5F4]">
            <div className="flex justify-between text-xs font-bold text-[#1C1917]">
              <span>{t('distance_label')}</span>
              <span className="text-[#3A5A40]">≤ {maxDistance} km</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-[#3A5A40] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#78716C]">
              <span>{t('distance_ultra_local')}</span>
              <span>{t('distance_max')}</span>
            </div>
          </div>
        </aside>

        {/* Right: Products Grid */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          
          {/* Top Sort Bar */}
          <div className="bg-white px-5 py-3.5 rounded-2xl border border-[#E7E5E4] flex items-center justify-between text-xs shadow-xs">
            <span className="text-[#57534E]">
              <strong className="text-[#1C1917]">{filteredProducts.length}</strong> {t('products_found')}
            </span>

            <div className="flex items-center gap-2">
              <label className="text-[#78716C]">{t('sort_by')}</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FAF8F5] border border-[#E7E5E4] rounded-lg px-2.5 py-1 text-base sm:text-xs text-[#1C1917] focus:outline-none"
              >
                <option value="featured">{t('sort_featured')}</option>
                <option value="price-asc">{t('sort_price_asc')}</option>
                <option value="price-desc">{t('sort_price_desc')}</option>
                <option value="distance-asc">{t('sort_distance')}</option>
                <option value="rating-desc">{t('sort_rating')}</option>
              </select>
            </div>
          </div>

          {/* Loading or Product Cards Grid */}
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-[#3A5A40] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#78716C]">{t('loading_products')}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E7E5E4] space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FAF8F5] text-[#78716C] flex items-center justify-center mx-auto">
                <SearchIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif-title text-lg font-bold text-[#1C1917]">
                {t('no_products_found')}
              </h3>
              <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                {t('no_products_desc')}
              </p>
              <button
                onClick={resetFilters}
                className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#3A5A40] text-white text-xs font-semibold hover:bg-[#2D4732] transition-colors shadow-xs"
              >
                {t('reset_filters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs text-[#78716C]">Chargement du marché...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}


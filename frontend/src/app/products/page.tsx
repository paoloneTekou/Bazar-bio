'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES as INITIAL_CATEGORIES, PRODUCTS as INITIAL_PRODUCTS } from '@/lib/data';
import { getProducts, getCategories } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { ProductCard } from '@/components/products/ProductCard';
import { FilterIcon, RotateCcwIcon, SearchIcon, MapPinIcon, LeafIcon, SparklesIcon } from '@/components/ui/Icons';
import { EcoScoreGrade, Product, Category } from '@/types';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const { t } = useLanguage();

  const [productsList, setProductsList] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [selectedEcoScore, setSelectedEcoScore] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(250);
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
    setSelectedSeason('all');
    setSelectedEcoScore('all');
    setMaxDistance(250);
    setMaxPrice(20000);
    setSearchQuery('');
    setSortBy('featured');
  };

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.categoryId !== selectedCategory && product.categoryName !== selectedCategory) {
        return false;
      }
      // Season filter
      if (selectedSeason !== 'all' && product.season !== selectedSeason) {
        return false;
      }
      // Eco-Score filter
      if (selectedEcoScore !== 'all' && product.ecoScore !== selectedEcoScore) {
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
  }, [productsList, selectedCategory, selectedSeason, selectedEcoScore, maxDistance, maxPrice, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header (Matches Figma Mockup) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#E7E5E4] gap-4">
        <div className="space-y-1">
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1B3A24]">
            {t('marketplace_title')}
          </h1>
          <p className="text-sm text-[#78716C]">
            {t('marketplace_subtitle', { count: filteredProducts.length })}
          </p>
        </div>

        {/* Quick Search in catalog */}
        <div className="w-full sm:w-80">
          <div className="relative">
            <input
              type="text"
              placeholder={t('search_catalog_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E7E5E4] rounded-full text-xs text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/20"
            />
            <SearchIcon className="w-4 h-4 text-[#78716C] absolute left-3.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Filter Sidebar (Matches Figma Mockup) */}
        <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-[#E7E5E4] space-y-6 sticky top-28 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F5F5F4] pb-3">
            <h2 className="font-serif-title text-xl font-bold text-[#1B3A24]">
              {t('filters')}
            </h2>
            <button
              onClick={resetFilters}
              className="text-[11px] text-[#78716C] hover:text-[#3A5A40] flex items-center gap-1 font-medium"
              title="Reset all filters"
            >
              <RotateCcwIcon className="w-3 h-3" />
              <span>{t('reset')}</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
              {t('category')}
            </h3>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#3A5A40] text-white font-semibold shadow-xs'
                    : 'text-[#57534E] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>{t('all_categories')}</span>
                <span className="text-[10px] opacity-80">({productsList.length})</span>
              </button>
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-[#3A5A40] text-white font-semibold shadow-xs'
                      : 'text-[#57534E] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] opacity-75">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Eco-Label Filter */}
          <div className="space-y-3 pt-4 border-t border-[#F5F5F4]">
            <h3 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
              {t('eco_label')}
            </h3>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { label: t('filter_organic'), grade: 'all', icon: '🌿' },
                { label: t('filter_score_a'), grade: 'A', icon: '🌱' },
                { label: t('filter_score_b'), grade: 'B', icon: '🍃' },
                { label: t('filter_local'), grade: 'local', icon: '📍' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.grade === 'local') {
                      setMaxDistance(50);
                    } else {
                      setSelectedEcoScore(item.grade);
                    }
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-left transition-all flex items-center gap-1.5 ${
                    (item.grade === 'local' && maxDistance === 50) || (item.grade !== 'local' && selectedEcoScore === item.grade)
                      ? 'bg-[#E5EDE6] border-[#3A5A40] text-[#2D4732] font-bold shadow-xs'
                      : 'bg-[#FAF8F5] border-[#E7E5E4] text-[#57534E] hover:bg-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="text-[11px] font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
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
            <div className="flex justify-between text-[10px] text-[#78716C]">
              <span>0 FCFA</span>
              <span>20,000 FCFA</span>
            </div>
          </div>

          {/* Distance (km) Slider */}
          <div className="space-y-2 pt-4 border-t border-[#F5F5F4]">
            <div className="flex justify-between text-xs font-bold text-[#1C1917]">
              <span>{t('distance_label')}</span>
              <span className="text-[#3A5A40]">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min="10"
              max="250"
              step="10"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-[#3A5A40] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#78716C]">
              <span>{t('distance_ultra_local')}</span>
              <span>{t('distance_max')}</span>
            </div>
          </div>
        </aside>

        {/* Products Grid & Sorting */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort & Count Bar */}
          <div className="bg-white px-4 py-3 rounded-xl border border-[#E7E5E4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#57534E] font-medium">
              <strong>{filteredProducts.length}</strong> {t('products_found')}
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <label className="text-[#78716C] shrink-0">{t('sort_by')}</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FAF8F5] border border-[#E7E5E4] rounded-lg px-2.5 py-1.5 text-xs text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#3A5A40]"
              >
                <option value="featured">{t('sort_featured')}</option>
                <option value="distance-asc">{t('sort_distance')}</option>
                <option value="price-asc">{t('sort_price_asc')}</option>
                <option value="price-desc">{t('sort_price_desc')}</option>
                <option value="rating-desc">{t('sort_rating')}</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E7E5E4] space-y-4">
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
                className="px-5 py-2.5 rounded-full bg-[#3A5A40] text-white text-xs font-semibold hover:bg-[#2D4732] transition-colors"
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
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs text-[#78716C]">Chargement du catalogue bio...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}


'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES as INITIAL_CATEGORIES, PRODUCTS as INITIAL_PRODUCTS, ARTISANS, IMPACT_GLOBAL_STATS } from '@/lib/data';
import { getProducts, getCategories } from '@/lib/api';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { SafeImage } from '@/components/ui/SafeImage';
import { useLanguage } from '@/context/LanguageContext';
import {
  LeafIcon,
  PackageIcon,
  MapPinIcon,
  TruckIcon,
  SparklesIcon,
  ArrowRightIcon,
  HeartIcon,
  CheckCircle2Icon,
} from '@/components/ui/Icons';

export default function HomePage() {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(INITIAL_PRODUCTS.slice(0, 4));
  const [categoriesList, setCategoriesList] = useState<Category[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    async function loadLiveContent() {
      try {
        const [liveProducts, liveCategories] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        if (liveProducts && liveProducts.length > 0) {
          setFeaturedProducts(liveProducts.slice(0, 4));
        }
        if (liveCategories && liveCategories.length > 0) {
          setCategoriesList(liveCategories);
        }
      } catch (err) {
        console.warn('Could not load live homepage products/categories:', err);
      }
    }
    loadLiveContent();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO SECTION (Matches Figma with rustic harvest visual + local Yaoundé context) */}
      <section className="relative overflow-hidden min-h-[560px] flex items-center justify-center bg-[#1B3A24]">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80"
            alt={t('hero_badge')}
            fallbackType="legumes-bio"
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#1B3A24]/60 to-[#1B3A24]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3A5A40]/80 border border-[#A3C0A6]/40 text-[#E8EFE9] text-xs font-semibold backdrop-blur-md animate-in fade-in slide-in-from-top-3">
            <LeafIcon className="w-3.5 h-3.5 text-[#A3C0A6]" />
            <span>{t('hero_badge')}</span>
          </div>

          <h1 className="font-serif-title text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
            {t('hero_title')}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#E8EFE9] leading-relaxed font-light">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/products"
              className="w-full sm:w-auto min-h-[44px] px-8 py-3.5 rounded-full bg-[#588157] hover:bg-[#3A5A40] text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>{t('hero_cta_products')}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto min-h-[44px] px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-md border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{t('hero_cta_impact')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. LIVE IMPACT TICKER BANNER (Amelioration for Radical Transparency) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl border border-[#E7E5E4] shadow-md p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#F5F5F4]">
          
          <div className="flex items-center gap-4 sm:px-4 pt-2 sm:pt-0">
            <div className="w-12 h-12 rounded-xl bg-[#E5EDE6] text-[#2D4732] flex items-center justify-center shrink-0">
              <LeafIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1B3A24]">
                {IMPACT_GLOBAL_STATS.totalBioProduceKg.toLocaleString()} kg
              </div>
              <p className="text-xs text-[#78716C] font-medium">
                {t('ticker_bio_produce')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:px-4 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center shrink-0">
              <PackageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1B3A24]">
                {IMPACT_GLOBAL_STATS.totalPlasticBagsAvoided.toLocaleString()}
              </div>
              <p className="text-xs text-[#78716C] font-medium">
                {t('ticker_plastic_avoided')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:px-4 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-xl bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center shrink-0">
              <HeartIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1B3A24]">
                {t('ticker_families_count', { count: IMPACT_GLOBAL_STATS.localFarmingFamiliesSupported })}
              </div>
              <p className="text-xs text-[#78716C] font-medium">
                {t('ticker_farmers_supported')}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CATEGORIES SECTION (Shop by Category) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1B3A24]">
            {t('home_categories_title')}
          </h2>
          <p className="text-sm text-[#78716C]">
            {t('home_categories_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoriesList.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-4/5 bg-[#FAF8F5] border border-[#E7E5E4] shadow-xs hover:shadow-md hover:border-[#3A5A40] transition-all flex flex-col justify-end p-4"
            >
              <SafeImage
                src={category.imageUrl}
                alt={category.name}
                category={category.id}
                fallbackType={category.id}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              <div className="relative z-10 space-y-1 text-white">
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2">
                  <LeafIcon className="w-4 h-4" />
                </div>
                <h3 className="font-serif-title font-bold text-base text-white leading-tight">
                  {category.name}
                </h3>
                <span className="text-[11px] text-[#C9DBCB] block">
                  {t('category_in_season', { count: category.itemCount })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FRESH HARVEST PRODUCT SHOWCASE (Amelioration: Immediate E-Commerce loop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#588157] uppercase tracking-wider mb-1">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>{t('home_arrivals_badge')}</span>
            </div>
            <h2 className="font-serif-title text-3xl font-bold text-[#1B3A24]">
              {t('home_arrivals_title')}
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3A5A40] hover:text-[#2D4732] group"
          >
            <span>{t('home_arrivals_view_all')}</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE BAZAR-BIO (Matches Figma Screenshot 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1B3A24]">
            {t('why_choose_title')}
          </h2>
          <p className="text-sm text-[#78716C]">
            {t('why_choose_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Plastic-Free */}
          <div className="bg-white rounded-2xl p-8 border border-[#E7E5E4] shadow-xs text-center space-y-4 hover:border-[#3A5A40]/40 transition-all">
            <div className="w-16 h-16 rounded-full bg-[#E5EDE6] text-[#3A5A40] flex items-center justify-center mx-auto shadow-xs">
              <PackageIcon className="w-8 h-8" />
            </div>
            <h3 className="font-serif-title text-xl font-bold text-[#1B3A24]">
              {t('why_plastic_free_title')}
            </h3>
            <p className="text-xs text-[#78716C] leading-relaxed">
              {t('why_plastic_free_desc')}
            </p>
          </div>

          {/* Card 2: Local Sourcing */}
          <div className="bg-white rounded-2xl p-8 border border-[#E7E5E4] shadow-xs text-center space-y-4 hover:border-[#3A5A40]/40 transition-all">
            <div className="w-16 h-16 rounded-full bg-[#E5EDE6] text-[#3A5A40] flex items-center justify-center mx-auto shadow-xs">
              <MapPinIcon className="w-8 h-8" />
            </div>
            <h3 className="font-serif-title text-xl font-bold text-[#1B3A24]">
              {t('why_local_sourcing_title')}
            </h3>
            <p className="text-xs text-[#78716C] leading-relaxed">
              {t('why_local_sourcing_desc')}
            </p>
          </div>

          {/* Card 3: Carbon Neutral Delivery */}
          <div className="bg-white rounded-2xl p-8 border border-[#E7E5E4] shadow-xs text-center space-y-4 hover:border-[#3A5A40]/40 transition-all">
            <div className="w-16 h-16 rounded-full bg-[#E5EDE6] text-[#3A5A40] flex items-center justify-center mx-auto shadow-xs">
              <TruckIcon className="w-8 h-8" />
            </div>
            <h3 className="font-serif-title text-xl font-bold text-[#1B3A24]">
              {t('why_delivery_title')}
            </h3>
            <p className="text-xs text-[#78716C] leading-relaxed">
              {t('why_delivery_desc')}
            </p>
          </div>

        </div>
      </section>

      {/* 6. YOUR SHOPPING MAKES A DIFFERENCE (Matches Figma Screenshot 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7E5E4] p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#588157]">
                {t('diff_badge')}
              </span>
              <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1B3A24] leading-tight">
                {t('diff_title')}
              </h2>
            </div>

            <p className="text-sm text-[#57534E] leading-relaxed">
              {t('diff_desc')}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E5EDE6] text-[#3A5A40] flex items-center justify-center shrink-0 mt-0.5">
                  <LeafIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1C1917]">{t('diff_pesticide_title')}</h4>
                  <p className="text-xs text-[#78716C]">{t('diff_pesticide_desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E5EDE6] text-[#3A5A40] flex items-center justify-center shrink-0 mt-0.5">
                  <HeartIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1C1917]">{t('diff_support_title')}</h4>
                  <p className="text-xs text-[#78716C]">{t('diff_support_desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E5EDE6] text-[#3A5A40] flex items-center justify-center shrink-0 mt-0.5">
                  <PackageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1C1917]">{t('diff_packaging_title')}</h4>
                  <p className="text-xs text-[#78716C]">{t('diff_packaging_desc')}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-[#3A5A40] hover:bg-[#2D4732] text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>{t('diff_start_shopping')}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-md aspect-4/3 lg:aspect-auto lg:h-[420px] bg-white border border-[#E7E5E4]">
            <SafeImage
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80"
              alt={t('diff_green_pledge_title')}
              fallbackType="news"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#E7E5E4] shadow-xs text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#3A5A40] font-bold">
                <CheckCircle2Icon className="w-4 h-4" />
                <span>{t('diff_green_pledge_title')}</span>
              </div>
              <p className="text-[#78716C] text-[11px]">
                {t('diff_green_pledge_desc')}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 7. MEET OUR LOCAL PRODUCERS & ARTISANS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#588157]">
            {t('artisans_badge')}
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1B3A24]">
            {t('artisans_title')}
          </h2>
          <p className="text-sm text-[#78716C]">
            {t('artisans_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(ARTISANS).slice(0, 3).map((artisan) => (
            <div
              key={artisan.id}
              className="bg-white rounded-2xl p-6 border border-[#E7E5E4] shadow-xs space-y-4 hover:border-[#3A5A40]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <SafeImage
                    src={artisan.imageUrl}
                    alt={artisan.name}
                    fallbackType="artisan"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#3A5A40]"
                  />
                  <div>
                    <h3 className="font-serif-title font-bold text-base text-[#1C1917]">
                      {artisan.name}
                    </h3>
                    <p className="text-xs text-[#588157] font-medium">{artisan.role}</p>
                    <p className="text-[11px] text-[#78716C]">{artisan.city}</p>
                  </div>
                </div>
                <p className="text-xs text-[#57534E] leading-relaxed line-clamp-3">
                  &ldquo;{artisan.bio}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[#F5F5F4] flex items-center justify-between text-xs">
                <span className="text-[#78716C]">{t('artisan_creations_count', { count: artisan.productsCount })}</span>
                <Link
                  href={`/products?artisan=${artisan.id}`}
                  className="font-semibold text-[#3A5A40] hover:underline flex items-center gap-1 min-h-[44px]"
                >
                  <span>{t('artisan_view_products')}</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. SUBSCRIBE & SAVE 10% BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2D4732] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#588157] text-[#FAF8F5]">
              {t('sub_banner_badge')}
            </span>
            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold tracking-tight">
              {t('sub_banner_title')}
            </h2>
            <p className="text-xs sm:text-sm text-[#C9DBCB] leading-relaxed">
              {t('sub_banner_desc')}
            </p>
            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 min-h-[44px] px-8 py-3.5 rounded-full bg-[#FAF8F5] text-[#1B3A24] font-bold text-xs hover:bg-white transition-all shadow-md"
              >
                <span>{t('sub_banner_cta')}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

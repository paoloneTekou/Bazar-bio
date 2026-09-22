'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { LeafIcon, SearchIcon, ShoppingCartIcon, UserIcon, XIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { SafeImage } from '@/components/ui/SafeImage';
import { PRODUCTS, CATEGORIES } from '@/lib/data';

export function Navbar() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();
  const { locale, setLocale, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchResults = searchQuery.trim() === ''
    ? []
    : PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.badges.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 4);

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* Top Notice Bar */}
      <div className="bg-[#1B3A24] text-[#E8EFE9] text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-block w-2 h-2 rounded-full bg-[#588157] animate-pulse" />
        <span>{t('top_notice')}</span>
        <span className="hidden md:inline text-[#A3C0A6]">{t('top_notice_sub')}</span>
        <span className="hidden lg:inline text-[#A3C0A6]">|</span>
        <a
          href="https://whatsapp.com/channel/0029VaBazarBioYaounde"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center gap-1 text-[#25D366] hover:underline font-semibold text-[11px]"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
          <span>{t('whatsapp_channel_notice')}</span>
        </a>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-[#E7E5E4] px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#3A5A40] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <LeafIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-title text-2xl font-bold tracking-tight text-[#1B3A24]">
                Bazar-Bio
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#588157] font-semibold -mt-1">
                {t('tagline')}
              </span>
            </div>
          </Link>

          {/* Search Bar with Live Preview Dropdown */}
          <div className="relative flex-1 max-w-lg hidden sm:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-[#E7E5E4] rounded-full text-sm text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40] transition-all"
              />
              <SearchIcon className="w-4 h-4 text-[#78716C] absolute left-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-[#78716C] hover:text-[#1C1917]"
                  aria-label="Clear search"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E7E5E4] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-3 bg-[#FAF8F5] border-b border-[#E7E5E4] text-xs font-semibold text-[#57534E] flex items-center justify-between">
                  <span>{t('search_results_title')}</span>
                  <span className="text-[#3A5A40]">{searchResults.length} {t('products_found')}</span>
                </div>
                <div className="divide-y divide-[#F5F5F4]">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-[#FAF8F5] transition-colors"
                    >
                      <SafeImage
                        src={product.imageUrl}
                        alt={product.name}
                        category={product.categoryId}
                        fallbackType={product.categoryId}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#1C1917] truncate">{product.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-[#78716C]">
                          <span>{product.originCity}</span>
                          <span>•</span>
                          <span className="text-[#3A5A40] font-semibold">{product.price.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#E5EDE6] text-[#2D4732] font-medium">
                        Score {product.ecoScore}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/products"
                  className="block p-2.5 text-center text-xs font-medium text-[#3A5A40] hover:bg-[#E5EDE6] transition-colors"
                >
                  {t('view_all_catalog', { count: PRODUCTS.length })}
                </Link>
              </div>
            )}
          </div>

          {/* Right Navigation & Actions */}
          <div className="flex items-center gap-3 lg:gap-5">
            
            {/* Language Switcher Pill (FR / EN) */}
            <div className="flex items-center bg-[#FAF8F5] border border-[#E7E5E4] rounded-full p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLocale('fr')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  locale === 'fr'
                    ? 'bg-[#3A5A40] text-white shadow-xs'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
                title="Passer en Français"
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  locale === 'en'
                    ? 'bg-[#3A5A40] text-white shadow-xs'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#44403C]">
              <Link
                href="/products"
                className={`transition-colors hover:text-[#3A5A40] ${
                  pathname === '/products' ? 'text-[#3A5A40] font-semibold' : ''
                }`}
              >
                {t('nav_market')}
              </Link>
              <Link
                href="/dashboard"
                className={`transition-colors hover:text-[#3A5A40] ${
                  pathname === '/dashboard' ? 'text-[#3A5A40] font-semibold' : ''
                }`}
              >
                {t('nav_impact')}
              </Link>
            </div>

            {/* User Account / Dashboard Link */}
            <Link
              href="/dashboard"
              className="p-2 rounded-full text-[#44403C] hover:bg-[#FAF8F5] hover:text-[#3A5A40] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={t('nav_impact')}
              aria-label={t('nav_impact')}
            >
              <UserIcon className="w-5 h-5" />
            </Link>

            {/* Cart Trigger Button with Live Badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-[#1B3A24] hover:bg-[#FAF8F5] transition-colors flex items-center min-h-[44px] min-w-[44px] justify-center"
              aria-label="Cart"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#3A5A40] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar below header */}
        <div className="mt-3 sm:hidden">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={t('mobile_search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-[#FAF8F5] border border-[#E7E5E4] rounded-full text-base sm:text-xs text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
            />
            <SearchIcon className="w-4 h-4 text-[#78716C] absolute left-3 pointer-events-none" />
          </div>
        </div>
      </nav>

      {/* Persistent Horizontal Category Navigation Sub-Bar */}
      <div className="bg-[#FAF8F5] border-b border-[#E7E5E4] py-2 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          <Link
            href="/products"
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all bg-white text-[#57534E] border border-[#E7E5E4] hover:bg-[#E5EDE6] hover:text-[#1B3A24] hover:border-[#3A5A40] min-h-[36px] flex items-center shadow-xs"
          >
            🌿 {t('all_categories')}
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all bg-white text-[#57534E] border border-[#E7E5E4] hover:bg-[#E5EDE6] hover:text-[#1B3A24] hover:border-[#3A5A40] min-h-[36px] flex items-center shadow-xs"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

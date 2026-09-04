'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ARTISANS, PRODUCTS } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  LeafIcon,
  PackageIcon,
  RotateCcwIcon,
  UsersIcon,
  SparklesIcon,
  ArrowUpRightIcon,
  AwardIcon,
} from '@/components/ui/Icons';

export default function UserDashboardPage() {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'impact' | 'producers'>('orders');

  const handleReorderPastBasket = () => {
    addToCart(PRODUCTS[0], 2, false);
    addToCart(PRODUCTS[1], 1, false);
    addToCart(PRODUCTS[2], 1, false);
    alert('Items from Order ORD-001 added to your cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title (Matches Figma: "My Bio Hub") */}
      <div>
        <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#1B3A24]">
          My Bio Hub
        </h1>
      </div>

      {/* 4 Colorful Top Summary Metric Tiles (Matches Figma Screenshots) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Tile 1: Total Orders (Dark Green) */}
        <div className="bg-[#3A5A40] text-white p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <PackageIcon className="w-7 h-7 text-[#E5EDE6]" />
            <ArrowUpRightIcon className="w-5 h-5 text-[#A3C0A6]" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight">12</div>
            <p className="text-xs text-[#E5EDE6] font-medium mt-1">Total Orders</p>
          </div>
        </div>

        {/* Tile 2: CO2 Saved (Emerald Green) */}
        <div className="bg-[#00C853] text-white p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <LeafIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight">3.2kg</div>
            <p className="text-xs text-white/90 font-medium mt-1">CO₂ Saved</p>
          </div>
        </div>

        {/* Tile 3: Plastic Saved (Vibrant Blue) */}
        <div className="bg-[#0070F3] text-white p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <PackageIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight">0.6kg</div>
            <p className="text-xs text-white/90 font-medium mt-1">Plastic Saved</p>
          </div>
        </div>

        {/* Tile 4: Farmers Supported (Warm Earth Brown) */}
        <div className="bg-[#8B5A2B] text-white p-6 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <UsersIcon className="w-7 h-7 text-[#F5EFE6]" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight">8</div>
            <p className="text-xs text-[#F5EFE6] font-medium mt-1">Farmers Supported</p>
          </div>
        </div>

      </div>

      {/* Main Container with 3 Tabs (Matches Figma Screenshots) */}
      <div className="bg-white rounded-3xl border border-[#E7E5E4] overflow-hidden shadow-xs">
        
        {/* Tabs Navigation Header */}
        <div className="grid grid-cols-3 border-b border-[#E7E5E4] text-center text-sm font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 transition-all relative ${
              activeTab === 'orders'
                ? 'text-[#1B3A24] font-bold bg-[#FAF8F5]'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]/50'
            }`}
          >
            <span>Order History</span>
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3A5A40]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`py-4 transition-all relative ${
              activeTab === 'impact'
                ? 'text-[#1B3A24] font-bold bg-[#FAF8F5]'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]/50'
            }`}
          >
            <span>Impact Tracker</span>
            {activeTab === 'impact' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3A5A40]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('producers')}
            className={`py-4 transition-all relative ${
              activeTab === 'producers'
                ? 'text-[#1B3A24] font-bold bg-[#FAF8F5]'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]/50'
            }`}
          >
            <span>Favorite Producers</span>
            {activeTab === 'producers' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3A5A40]" />
            )}
          </button>
        </div>

        {/* TAB 1 CONTENT: ORDER HISTORY (Matches Figma Screenshot) */}
        {activeTab === 'orders' && (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Order Card 1 */}
            <div className="bg-white rounded-2xl border border-[#E7E5E4] p-6 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif-title font-bold text-xl text-[#1C1917]">
                    Order ORD-001
                  </h3>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    February 3, 2026
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xl font-bold text-[#1C1917]">
                    €43.50 <span className="text-xs text-[#78716C] font-normal">(28 500 FCFA)</span>
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E5EDE6] text-[#2D4732]">
                    delivered
                  </span>
                </div>
              </div>

              {/* Middle Metrics Row */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-[#57534E] py-1 border-y border-[#F5F5F4]">
                <div className="flex items-center gap-1.5">
                  <PackageIcon className="w-4 h-4 text-[#3A5A40]" />
                  <span>3 items</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LeafIcon className="w-4 h-4 text-[#3A5A40]" />
                  <span>570g CO₂ saved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PackageIcon className="w-4 h-4 text-[#3A5A40]" />
                  <span>95g plastic saved</span>
                </div>
              </div>

              {/* Bottom Row: Thumbnails + Reorder Button */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="flex items-center -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=120&q=80"
                    alt="Carottes"
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=120&q=80"
                    alt="Poivrons"
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=120&q=80"
                    alt="Ananas"
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                </div>

                <button
                  onClick={handleReorderPastBasket}
                  className="px-4 py-2 rounded-xl border border-[#D6D3D1] hover:border-[#3A5A40] text-[#1C1917] hover:text-[#3A5A40] text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
                >
                  <RotateCcwIcon className="w-3.5 h-3.5" />
                  <span>Reorder All</span>
                </button>
              </div>
            </div>

            {/* Order Card 2 */}
            <div className="bg-white rounded-2xl border border-[#E7E5E4] p-6 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif-title font-bold text-xl text-[#1C1917]">
                    Order ORD-002
                  </h3>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    January 18, 2026
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xl font-bold text-[#1C1917]">
                    €24.90 <span className="text-xs text-[#78716C] font-normal">(16 300 FCFA)</span>
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E5EDE6] text-[#2D4732]">
                    delivered
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-[#57534E] py-1 border-y border-[#F5F5F4]">
                <div className="flex items-center gap-1.5">
                  <PackageIcon className="w-4 h-4 text-[#3A5A40]" />
                  <span>2 items</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LeafIcon className="w-4 h-4 text-[#3A5A40]" />
                  <span>340g CO₂ saved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PackageIcon className="w-4 h-4 text-[#3A5A40]" />
                  <span>80g plastic saved</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="flex items-center -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=120&q=80"
                    alt="Poivre"
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1608248597359-548970e30370?auto=format&fit=crop&w=120&q=80"
                    alt="Baume Karité"
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                </div>

                <button
                  onClick={handleReorderPastBasket}
                  className="px-4 py-2 rounded-xl border border-[#D6D3D1] hover:border-[#3A5A40] text-[#1C1917] hover:text-[#3A5A40] text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
                >
                  <RotateCcwIcon className="w-3.5 h-3.5" />
                  <span>Reorder All</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2 CONTENT: IMPACT TRACKER (Matches Figma Screenshot 1) */}
        {activeTab === 'impact' && (
          <div className="p-6 sm:p-10 space-y-8 animate-in fade-in">
            
            {/* Top Centered Impact Section */}
            <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 text-center border border-[#E7E5E4] space-y-8">
              <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1B3A24]">
                Your Environmental Impact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                
                {/* Highlight Circle 1: CO2 Saved */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-24 h-24 rounded-full bg-[#E5EDE6] text-[#00C853] flex items-center justify-center shadow-xs">
                    <LeafIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#1C1917]">3.2 kg</div>
                    <div className="text-xs text-[#78716C] font-medium">Total CO₂ Saved</div>
                    <div className="text-[11px] text-[#A8A29E] mt-0.5">Equivalent to 6 trees planted</div>
                  </div>
                </div>

                {/* Highlight Circle 2: Plastic Saved */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-24 h-24 rounded-full bg-[#E0E7FF] text-[#0070F3] flex items-center justify-center shadow-xs">
                    <PackageIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#1C1917]">0.6 kg</div>
                    <div className="text-xs text-[#78716C] font-medium">Total Plastic Saved</div>
                    <div className="text-[11px] text-[#A8A29E] mt-0.5">Equivalent to 29 plastic bottles</div>
                  </div>
                </div>

              </div>
            </div>

            {/* 3 Bottom Cards (Matches Figma Mockup) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Eco Warrior */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-xs text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#8B5A2B] flex items-center justify-center mx-auto">
                  <AwardIcon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-title font-bold text-lg text-[#1C1917]">
                  Eco Warrior
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  You're in the top 10% of sustainable shoppers
                </p>
              </div>

              {/* Card 2: 8 Farmers */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-xs text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#3A5A40] flex items-center justify-center mx-auto">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-title font-bold text-lg text-[#1C1917]">
                  8 Farmers
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Supported through your purchases
                </p>
              </div>

              {/* Card 3: 6 Trees */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-xs text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#00C853] flex items-center justify-center mx-auto">
                  <LeafIcon className="w-6 h-6" />
                </div>
                <h3 className="font-serif-title font-bold text-lg text-[#1C1917]">
                  6 Trees
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Planted through our carbon offset program
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3 CONTENT: FAVORITE PRODUCERS (Matches Figma Screenshot 2) */}
        {activeTab === 'producers' && (
          <div className="p-6 sm:p-8 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Producer Card 1 */}
              <div className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#3A5A40]/40 transition-all">
                <div>
                  <div className="h-44 overflow-hidden bg-[#FAF8F5]">
                    <img
                      src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                      alt="Green Valley Farm"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif-title font-bold text-lg text-[#1C1917]">
                      Green Valley Farm
                    </h3>
                    <p className="text-xs text-[#78716C]">
                      Mfou, Yaoundé (Centre)
                    </p>
                    <p className="text-xs text-[#57534E] leading-relaxed pt-1">
                      Family-owned organic farm since 1987. Zero synthetic chemicals, 100% compost-fed soil.
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href="/products"
                    className="w-full py-2.5 px-4 rounded-xl border border-[#D6D3D1] hover:border-[#3A5A40] text-[#1C1917] hover:text-[#3A5A40] text-xs font-semibold transition-colors block text-center shadow-xs"
                  >
                    View Products
                  </Link>
                </div>
              </div>

              {/* Producer Card 2 */}
              <div className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#3A5A40]/40 transition-all">
                <div>
                  <div className="h-44 overflow-hidden bg-[#FAF8F5]">
                    <img
                      src="https://images.unsplash.com/photo-1608248597359-548970e30370?auto=format&fit=crop&w=800&q=80"
                      alt="Pure Earth Cosmetics"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif-title font-bold text-lg text-[#1C1917]">
                      Pure Earth Cosmetics
                    </h3>
                    <p className="text-xs text-[#78716C]">
                      Yaoundé (Atelier Essos)
                    </p>
                    <p className="text-xs text-[#57534E] leading-relaxed pt-1">
                      Zero-waste beauty products handcrafted with raw wild shea butter and pure cacao.
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href="/products"
                    className="w-full py-2.5 px-4 rounded-xl border border-[#D6D3D1] hover:border-[#3A5A40] text-[#1C1917] hover:text-[#3A5A40] text-xs font-semibold transition-colors block text-center shadow-xs"
                  >
                    View Products
                  </Link>
                </div>
              </div>

              {/* Producer Card 3 */}
              <div className="bg-white rounded-2xl border border-[#E7E5E4] overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#3A5A40]/40 transition-all">
                <div>
                  <div className="h-44 overflow-hidden bg-[#FAF8F5]">
                    <img
                      src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
                      alt="Mama Jeanne & Papa Mbele Artisans"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif-title font-bold text-lg text-[#1C1917]">
                      Papa Mbele & Mama Jeanne
                    </h3>
                    <p className="text-xs text-[#78716C]">
                      Foumban & Briqueterie
                    </p>
                    <p className="text-xs text-[#57534E] leading-relaxed pt-1">
                      Traditional woodcraft, recycled glass beads, and sustainable authentic heritage goods.
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href="/products"
                    className="w-full py-2.5 px-4 rounded-xl border border-[#D6D3D1] hover:border-[#3A5A40] text-[#1C1917] hover:text-[#3A5A40] text-xs font-semibold transition-colors block text-center shadow-xs"
                  >
                    View Products
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


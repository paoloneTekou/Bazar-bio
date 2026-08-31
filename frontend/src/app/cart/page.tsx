'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  ShoppingCartIcon,
  LeafIcon,
  PlusIcon,
  MinusIcon,
  XIcon,
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from '@/components/ui/Icons';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    toggleSubscription,
    clearCart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    cartImpact,
  } = useCart();
  const { t } = useLanguage();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#E5EDE6] text-[#3A5A40] flex items-center justify-center mx-auto shadow-xs">
          <ShoppingCartIcon className="w-10 h-10 opacity-70" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif-title text-3xl font-bold text-[#1B3A24]">
            {t('empty_cart')}
          </h1>
          <p className="text-xs text-[#78716C] max-w-sm mx-auto">
            {t('empty_cart_desc')}
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3A5A40] text-white text-xs font-bold hover:bg-[#2D4732] transition-colors shadow-md"
        >
          <span>{t('visit_market')}</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E7E5E4] gap-4">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-[#1B3A24]">
            {t('cart_drawer_title')} ({cartCount} {t('col_product')})
          </h1>
          <p className="text-xs text-[#78716C]">
            Emballage 100% sans plastique garanti et transport local optimisé.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#DC2626] hover:underline font-semibold"
        >
          {t('clear_cart')}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Impact Alert Card */}
          <div className="bg-[#E5EDE6] p-5 rounded-2xl border border-[#C9DBCB] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3A5A40] text-white flex items-center justify-center shrink-0">
                <LeafIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#1B3A24]">
                  {t('impact_box_title')}
                </h4>
                <p className="text-xs text-[#2D4732]">
                  <strong>{cartImpact.totalPlasticGrams}g</strong> {t('plastic_saved_text')} • <strong>{cartImpact.totalCo2Kg}kg</strong> {t('co2_saved_text')} • <strong>{cartImpact.uniqueFarmersCount}</strong> {t('farmers_supported_text')}
                </p>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl border border-[#E7E5E4] divide-y divide-[#F5F5F4] overflow-hidden shadow-xs">
            {cartItems.map((item) => (
              <div key={item.product.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-serif-title font-bold text-sm text-[#1C1917]">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-[#78716C]">
                      {item.product.originCity} • {item.product.price.toLocaleString()} FCFA / {item.product.unitAbbr}
                    </p>
                    {item.isSubscription && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3A5A40] bg-[#E5EDE6] px-2 py-0.5 rounded-md mt-1">
                        <SparklesIcon className="w-3 h-3" />
                        <span>{t('weekly_sub_badge')}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#E7E5E4] rounded-lg bg-[#FAF8F5] p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 text-[#57534E] hover:bg-white rounded-md transition-colors"
                    >
                      <MinusIcon className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#1C1917]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 text-[#57534E] hover:bg-white rounded-md transition-colors"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Price */}
                  <div className="text-right min-w-[100px]">
                    {item.isSubscription ? (
                      <div>
                        <span className="text-xs line-through text-[#A8A29E] block">
                          {(item.product.price * item.quantity).toLocaleString()} FCFA
                        </span>
                        <span className="text-sm font-bold text-[#3A5A40]">
                          {(item.product.price * item.quantity * 0.9).toLocaleString()} FCFA
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-[#1C1917]">
                        {(item.product.price * item.quantity).toLocaleString()} FCFA
                      </span>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[#A8A29E] hover:text-[#DC2626] p-1 transition-colors"
                    title="Retirer"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/products"
              className="text-xs font-bold text-[#3A5A40] hover:underline inline-flex items-center gap-1"
            >
              ← Continuer mes achats sur le marché
            </Link>
          </div>
        </div>

        {/* Right: Summary Card (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-xs space-y-6 sticky top-28">
          <h2 className="font-serif-title text-lg font-bold text-[#1B3A24]">
            Récapitulatif de Commande
          </h2>

          <div className="space-y-3 text-xs divide-y divide-[#F5F5F4]">
            <div className="flex justify-between text-[#57534E] pb-2">
              <span>Articles ({cartCount})</span>
              <span>{cartSubtotal.toLocaleString()} FCFA</span>
            </div>

            {cartDiscount > 0 && (
              <div className="flex justify-between text-[#3A5A40] font-medium py-2">
                <span>Remise Abonnements (-10%)</span>
                <span>-{cartDiscount.toLocaleString()} FCFA</span>
              </div>
            )}

            <div className="flex justify-between text-[#57534E] py-2">
              <span>Livraison estimée (Yaoundé)</span>
              <span>1 500 FCFA</span>
            </div>

            <div className="flex justify-between text-base font-bold text-[#1C1917] pt-3">
              <span>Total Estimé</span>
              <span className="text-[#3A5A40]">{(cartTotal + 1500).toLocaleString()} FCFA</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Passer à la commande (3 étapes)</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>

          <div className="bg-[#FAF8F5] p-3.5 rounded-xl text-[11px] text-[#78716C] space-y-1.5 border border-[#E7E5E4]">
            <div className="flex items-center gap-1.5 text-[#3A5A40] font-bold">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              <span>Garantie Fraîcheur & Confiance</span>
            </div>
            <p>
              Paiement à la livraison par Orange Money, MTN MoMo ou Espèces après vérification de votre panier.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

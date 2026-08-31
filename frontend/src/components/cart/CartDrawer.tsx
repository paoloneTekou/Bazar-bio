'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { XIcon, PlusIcon, MinusIcon, ShoppingCartIcon, LeafIcon, SparklesIcon, ArrowRightIcon } from '@/components/ui/Icons';

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    toggleSubscription,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartTotal,
    cartImpact,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#E7E5E4]">
          
          {/* Header */}
          <div className="px-6 py-4 bg-white border-b border-[#E7E5E4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#3A5A40] text-white flex items-center justify-center">
                <ShoppingCartIcon className="w-4 h-4" />
              </div>
              <h2 className="font-serif-title text-lg font-bold text-[#1B3A24]">
                Votre Panier Bio ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-[#78716C] hover:bg-[#FAF8F5] hover:text-[#1C1917] transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Live Impact Widget Banner */}
          {cartItems.length > 0 && (
            <div className="bg-[#E5EDE6] px-6 py-3 border-b border-[#C9DBCB] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#2D4732]">
                <LeafIcon className="w-4 h-4 text-[#3A5A40] shrink-0" />
                <span>
                  <strong>Impact de ce panier :</strong> {cartImpact.totalPlasticGrams}g plastique évité • {cartImpact.totalCo2Kg}kg CO₂ épargné
                </span>
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E5EDE6] text-[#3A5A40] flex items-center justify-center mx-auto">
                  <ShoppingCartIcon className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-serif-title text-lg font-semibold text-[#1C1917]">
                  Votre panier est vide
                </h3>
                <p className="text-xs text-[#78716C] max-w-xs mx-auto">
                  Découvrez nos récoltes bio du matin à Mfou et nos créations artisanales locales.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3A5A40] text-white text-xs font-semibold hover:bg-[#2D4732] transition-colors shadow-xs"
                >
                  <span>Explorer le Marché</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white p-4 rounded-xl border border-[#E7E5E4] shadow-xs flex gap-3 transition-all hover:border-[#3A5A40]/40"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-18 h-18 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#1C1917] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#A8A29E] hover:text-[#DC2626] transition-colors"
                          title="Supprimer"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#78716C] mt-0.5">
                        {item.product.originCity} • {item.product.price.toLocaleString()} FCFA / {item.product.unitAbbr}
                      </p>
                    </div>

                    {/* Subscription 10% toggle */}
                    {item.product.isSubscriptionEligible && (
                      <div className="my-2">
                        <button
                          onClick={() => toggleSubscription(item.product.id)}
                          className={`text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                            item.isSubscription
                              ? 'bg-[#3A5A40] text-white font-medium'
                              : 'bg-[#FAF8F5] text-[#57534E] border border-[#E7E5E4] hover:bg-[#E5EDE6]'
                          }`}
                        >
                          <SparklesIcon className="w-3 h-3" />
                          <span>
                            {item.isSubscription ? '✓ Abonnement Hebdo (-10%)' : 'Abonner & Économiser 10%'}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Quantity and Line Total */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#F5F5F4] mt-2">
                      <div className="flex items-center border border-[#E7E5E4] rounded-lg bg-[#FAF8F5] overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-[#57534E] hover:bg-white transition-colors"
                        >
                          <MinusIcon className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-[#1C1917]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-[#57534E] hover:bg-white transition-colors"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        {item.isSubscription ? (
                          <div>
                            <span className="text-xs line-through text-[#A8A29E] mr-1.5">
                              {(item.product.price * item.quantity).toLocaleString()} FCFA
                            </span>
                            <span className="text-xs font-bold text-[#3A5A40]">
                              {(item.product.price * item.quantity * 0.9).toLocaleString()} FCFA
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-[#1C1917]">
                            {(item.product.price * item.quantity).toLocaleString()} FCFA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E7E5E4] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#78716C]">
                  <span>Sous-total</span>
                  <span>{cartSubtotal.toLocaleString()} FCFA</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#3A5A40] font-medium">
                    <span>Remise Abonnements (-10%)</span>
                    <span>-{cartDiscount.toLocaleString()} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#1C1917] pt-2 border-t border-[#F5F5F4]">
                  <span>Total Estimé</span>
                  <span className="text-[#3A5A40] text-base">{cartTotal.toLocaleString()} FCFA</span>
                </div>
              </div>

              <p className="text-[11px] text-[#78716C] text-center">
                Livraison calculée à l'étape suivante selon votre quartier à Yaoundé.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-[#3A5A40] text-[#3A5A40] text-xs font-semibold text-center hover:bg-[#FAF8F5] transition-colors"
                >
                  Voir Détails
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Commander</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

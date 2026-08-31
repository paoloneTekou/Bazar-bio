'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface ImpactCalculation {
  totalPlasticGrams: number;
  totalCo2Kg: number;
  uniqueFarmersCount: number;
  treesEquivalent: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, isSubscription?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSubscription: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  cartImpact: ImpactCalculation;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('bazar_bio_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  // Save cart to LocalStorage on change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('bazar_bio_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems, isHydrated]);

  const addToCart = (product: Product, quantity = 1, isSubscription = false) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          isSubscription: isSubscription || updated[existingIndex].isSubscription,
        };
        return updated;
      }
      return [...prev, { product, quantity, isSubscription }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const toggleSubscription = (productId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, isSubscription: !item.isSubscription }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal calculation (includes 10% discount for subscription items)
  const cartSubtotal = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);

  const cartDiscount = cartItems.reduce((sum, item) => {
    if (item.isSubscription) {
      return sum + item.product.price * item.quantity * 0.1; // 10% off for recurring bio staples
    }
    return sum;
  }, 0);

  const cartTotal = cartSubtotal - cartDiscount;

  // Real-time Impact Metrics
  const cartImpact: ImpactCalculation = {
    totalPlasticGrams: cartItems.reduce(
      (sum, item) => sum + (item.product.ecoScoreDetails?.plasticAvoidedGrams || 30) * item.quantity,
      0
    ),
    totalCo2Kg: Number(
      cartItems
        .reduce(
          (sum, item) =>
            sum + (item.product.distanceKm < 50 ? 0.45 : 0.25) * item.quantity,
          0
        )
        .toFixed(2)
    ),
    uniqueFarmersCount: new Set(cartItems.map((item) => item.product.artisan.id)).size,
    treesEquivalent: Number(
      (
        cartItems.reduce(
          (sum, item) => sum + 0.12 * item.quantity,
          0
        )
      ).toFixed(1)
    ),
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSubscription,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        cartImpact,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

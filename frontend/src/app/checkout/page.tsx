'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { DELIVERY_ZONES } from '@/lib/data';
import { getDeliveryZones, submitOrder, validateCoupon } from '@/lib/api';
import { DeliveryZone, CouponValidationResult } from '@/types';
import {
  CheckCircle2Icon,
  CheckIcon,
  CreditCardIcon,
  WhatsAppIcon,
  SparklesIcon,
  TagIcon,
  ClockIcon,
} from '@/components/ui/Icons';

export default function CheckoutPage() {
  const { cartItems, cartTotal, cartImpact, clearCart } = useCart();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [zones, setZones] = useState<DeliveryZone[]>(DELIVERY_ZONES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Yaoundé');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState(DELIVERY_ZONES[0].id);
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState<'morning' | 'afternoon'>('morning');
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);

  // Coupon states
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult['coupon'] | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Payment states
  const [paymentType, setPaymentType] = useState<'card' | 'momo' | 'om' | 'cod'>('momo');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Confirmation state
  const [orderReference, setOrderReference] = useState('');
  const [backendWhatsAppUrl, setBackendWhatsAppUrl] = useState('');

  useEffect(() => {
    async function loadZones() {
      const liveZones = await getDeliveryZones();
      if (liveZones && liveZones.length > 0) {
        setZones(liveZones);
        setSelectedZoneId(liveZones[0].id);
      }
    }
    loadZones();
  }, []);

  const selectedZone = zones.find((z) => String(z.id) === String(selectedZoneId)) || zones[0] || DELIVERY_ZONES[0];
  const couponDiscount = appliedCoupon ? appliedCoupon.calculated_discount : 0;
  const finalTotal = Math.max(cartTotal - couponDiscount, 0) + (selectedZone ? selectedZone.fee : 1500);

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError(null);

    const result = await validateCoupon(couponInput.trim(), cartTotal);
    setIsValidatingCoupon(false);

    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponError(null);
    } else {
      setCouponError(result.error || 'Code promo non reconnu');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !phone || !address) {
      alert(t('checkout_fill_required_alert'));
      return;
    }
    setCurrentStep(2);
  };

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    setApiError(null);

    const paymentMethodCode = paymentType === 'momo'
      ? 'mtn_momo'
      : paymentType === 'om'
      ? 'orange_momo'
      : paymentType === 'cod'
      ? 'cash_on_delivery'
      : 'card';

    const itemsPayload = cartItems.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    const response = await submitOrder({
      order: {
        customer_name: `${firstName} ${lastName}`.trim(),
        customer_phone: phone,
        delivery_zone_id: selectedZoneId,
        delivery_address_details: `${address}, ${city} ${postalCode}`.trim(),
        delivery_time_slot: deliveryTimeSlot,
        payment_method_code: paymentMethodCode,
        customer_notes: '',
        coupon_code: appliedCoupon?.code,
        whatsapp_opt_in: whatsappOptIn,
      },
      coupon_code: appliedCoupon?.code,
      items: itemsPayload,
    });

    setIsSubmitting(false);

    if (!response.success && response.error) {
      setApiError(response.error);
      return;
    }

    if (response.order_reference) {
      setOrderReference(response.order_reference);
    } else {
      setOrderReference(`BB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`);
    }

    if (response.whatsapp_url) {
      setBackendWhatsAppUrl(response.whatsapp_url);
    }

    clearCart();
  };

  const generateWhatsAppUrl = () => {
    if (backendWhatsAppUrl) return backendWhatsAppUrl;

    const slotLabel = deliveryTimeSlot === 'afternoon' ? t('delivery_slot_afternoon') : t('delivery_slot_morning');
    const discountText = appliedCoupon ? `\n🏷️ Code: ${appliedCoupon.code} (-${couponDiscount} FCFA)` : '';

    const message = `🌿 *COMMANDE BAZAR-BIO*\n` +
      `Référence : *${orderReference}*\n` +
      `Client : ${firstName} ${lastName} (${phone})\n` +
      `Quartier : ${selectedZone.name}\n` +
      `Adresse : ${address}, ${city}\n` +
      `Créneau : ${slotLabel}${discountText}\n` +
      `Total à payer : *${finalTotal.toLocaleString()} FCFA*\n\n` +
      `🌱 *Impact :* ${cartImpact.totalPlasticGrams}g plastique économisé, ${cartImpact.totalCo2Kg}kg CO₂ épargné.`;

    return `https://wa.me/237654818121?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 overflow-x-hidden">
      
      {/* 3-Step Stepper Header */}
      <div className="flex items-center justify-between max-w-sm sm:max-w-md mx-auto">
        {/* Step 1: Delivery */}
        <button
          type="button"
          onClick={() => currentStep > 1 && setCurrentStep(1)}
          className="flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            currentStep > 1
              ? 'bg-[#3A5A40] text-white'
              : currentStep === 1
              ? 'bg-[#3A5A40] text-white ring-4 ring-[#E5EDE6]'
              : 'bg-[#E7E5E4] text-[#78716C]'
          }`}>
            {currentStep > 1 ? <CheckIcon className="w-4 h-4" /> : '1'}
          </div>
          <span className="text-xs font-semibold text-[#1C1917]">{t('checkout_stepper_delivery')}</span>
        </button>

        {/* Connector Line 1 */}
        <div className={`h-0.5 flex-1 mx-2 -mt-5 transition-colors ${
          currentStep > 1 ? 'bg-[#3A5A40]' : 'bg-[#E7E5E4]'
        }`} />

        {/* Step 2: Payment */}
        <button
          type="button"
          onClick={() => currentStep > 2 && setCurrentStep(2)}
          className="flex flex-col items-center gap-1.5 focus:outline-none"
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            currentStep > 2
              ? 'bg-[#3A5A40] text-white'
              : currentStep === 2
              ? 'bg-[#3A5A40] text-white ring-4 ring-[#E5EDE6]'
              : 'bg-[#E7E5E4] text-[#78716C]'
          }`}>
            {currentStep > 2 ? <CheckIcon className="w-4 h-4" /> : '2'}
          </div>
          <span className="text-xs font-semibold text-[#1C1917]">{t('checkout_stepper_payment')}</span>
        </button>

        {/* Connector Line 2 */}
        <div className={`h-0.5 flex-1 mx-2 -mt-5 transition-colors ${
          currentStep === 3 ? 'bg-[#3A5A40]' : 'bg-[#E7E5E4]'
        }`} />

        {/* Step 3: Confirm */}
        <div className="flex flex-col items-center gap-1.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            currentStep === 3
              ? 'bg-[#3A5A40] text-white ring-4 ring-[#E5EDE6]'
              : 'bg-[#E7E5E4] text-[#78716C]'
          }`}>
            3
          </div>
          <span className="text-xs font-semibold text-[#1C1917]">{t('checkout_stepper_confirm')}</span>
        </div>
      </div>

      {/* STEP 1: DELIVERY INFORMATION */}
      {currentStep === 1 && (
        <form
          onSubmit={handleProceedToPayment}
          className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E7E5E4] shadow-xs space-y-6 animate-in fade-in"
        >
          <div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1B3A24]">
              {t('delivery_title')}
            </h2>
            <p className="text-xs text-[#78716C] mt-1">
              {t('delivery_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">{t('first_name_label')}</label>
              <input
                type="text"
                required
                placeholder={t('first_name_placeholder')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-[#E7E5E4] rounded-xl text-base text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">{t('last_name_label')}</label>
              <input
                type="text"
                placeholder={t('last_name_placeholder')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-[#E7E5E4] rounded-xl text-base text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1C1917]">{t('checkout_address_label')}</label>
            <input
              type="text"
              required
              placeholder={t('checkout_address_placeholder')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-[#E7E5E4] rounded-xl text-base text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">{t('checkout_city_zone_label')}</label>
              <select
                value={selectedZoneId}
                onChange={(e) => {
                  setSelectedZoneId(e.target.value);
                  const z = zones.find((item) => String(item.id) === String(e.target.value));
                  if (z) setCity(z.name);
                }}
                className="w-full px-4 py-3.5 bg-white border border-[#E7E5E4] rounded-xl text-base text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} (+{zone.fee.toLocaleString()} FCFA)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">{t('checkout_postal_label')}</label>
              <input
                type="text"
                placeholder={t('checkout_postal_placeholder')}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-[#E7E5E4] rounded-xl text-base text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
              />
            </div>
          </div>

          {/* Delivery Time Slot Selector */}
          <div className="space-y-2 pt-1">
            <label className="text-xs sm:text-sm font-semibold text-[#1C1917] flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4 text-[#3A5A40]" />
              <span>{t('delivery_slot_title')}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryTimeSlot('morning')}
                className={`p-4 rounded-2xl border text-left transition-all min-h-[56px] flex flex-col justify-center ${
                  deliveryTimeSlot === 'morning'
                    ? 'bg-[#E5EDE6] border-[#3A5A40] text-[#1B3A24] ring-2 ring-[#3A5A40]/20'
                    : 'bg-[#FAF8F5] border-[#E7E5E4] text-[#57534E] hover:bg-white'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm flex items-center gap-2">
                  <span>🌅 {t('delivery_slot_morning')}</span>
                  {deliveryTimeSlot === 'morning' && <CheckIcon className="w-3.5 h-3.5 text-[#3A5A40]" />}
                </div>
                <p className="text-[11px] text-[#78716C] mt-0.5">
                  {t('delivery_slot_morning_desc')}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryTimeSlot('afternoon')}
                className={`p-4 rounded-2xl border text-left transition-all min-h-[56px] flex flex-col justify-center ${
                  deliveryTimeSlot === 'afternoon'
                    ? 'bg-[#E5EDE6] border-[#3A5A40] text-[#1B3A24] ring-2 ring-[#3A5A40]/20'
                    : 'bg-[#FAF8F5] border-[#E7E5E4] text-[#57534E] hover:bg-white'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm flex items-center gap-2">
                  <span>🌇 {t('delivery_slot_afternoon')}</span>
                  {deliveryTimeSlot === 'afternoon' && <CheckIcon className="w-3.5 h-3.5 text-[#3A5A40]" />}
                </div>
                <p className="text-[11px] text-[#78716C] mt-0.5">
                  {t('delivery_slot_afternoon_desc')}
                </p>
              </button>
            </div>
          </div>

          {/* WhatsApp Phone Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-semibold text-[#1C1917] flex items-center gap-1.5">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>{t('whatsapp_phone_field_label')}</span>
                <span className="text-[#DC2626] font-bold">*</span>
              </label>
              <span className="text-[11px] text-[#588157] font-medium bg-[#E5EDE6] px-2 py-0.5 rounded-md">
                {t('whatsapp_phone_format_badge')}
              </span>
            </div>
            <input
              type="tel"
              required
              placeholder={t('whatsapp_phone_input_placeholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-[#E7E5E4] rounded-xl text-base text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40] transition-colors"
            />
            <p className="text-[11px] sm:text-xs text-[#57534E] leading-relaxed flex items-start gap-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#E7E5E4]">
              <span className="text-sm leading-none shrink-0 mt-0.5">💡</span>
              <span>{t('whatsapp_phone_helper_box')}</span>
            </p>
          </div>

          {/* WhatsApp Drop Notification Consent */}
          <div className="pt-1">
            <label className="flex items-start gap-3 p-3.5 bg-[#FAF8F5] border border-[#E7E5E4] rounded-2xl cursor-pointer hover:bg-white hover:border-[#3A5A40]/40 transition-all">
              <input
                type="checkbox"
                checked={whatsappOptIn}
                onChange={(e) => setWhatsappOptIn(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#3A5A40] border-[#D6D3D1] focus:ring-[#3A5A40] accent-[#3A5A40]"
              />
              <div className="text-xs text-[#44403C] space-y-0.5">
                <span className="font-semibold text-[#1C1917] flex flex-wrap items-center gap-1.5">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>{t('whatsapp_optin_box_title')}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#E5EDE6] text-[#2D4732] rounded-full">
                    {t('whatsapp_optin_box_badge')}
                  </span>
                </span>
                <p className="text-[#78716C] text-[11px] leading-relaxed">
                  {t('whatsapp_optin_box_desc')}
                </p>
              </div>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] text-white font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.99] min-h-[48px]"
            >
              {t('checkout_continue_payment')}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: PAYMENT INFORMATION */}
      {currentStep === 2 && (
        <form
          onSubmit={handleProceedToConfirm}
          className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E7E5E4] shadow-xs space-y-6 animate-in fade-in"
        >
          <div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1B3A24]">
              {t('checkout_payment_title_heading')}
            </h2>
            <p className="text-xs text-[#78716C] mt-1">
              {t('payment_subtitle')}
            </p>
          </div>

          {/* Payment Method Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => setPaymentType('momo')}
              className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
                paymentType === 'momo'
                  ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E] shadow-xs ring-2 ring-[#F59E0B]/30'
                  : 'bg-[#FAF8F5] border-[#E7E5E4] text-[#78716C] hover:bg-white'
              }`}
            >
              <span>{t('checkout_method_momo')}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType('om')}
              className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
                paymentType === 'om'
                  ? 'bg-[#FFEDD5] border-[#EA580C] text-[#C2410C] shadow-xs ring-2 ring-[#EA580C]/30'
                  : 'bg-[#FAF8F5] border-[#E7E5E4] text-[#78716C] hover:bg-white'
              }`}
            >
              <span>{t('checkout_method_om')}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType('cod')}
              className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
                paymentType === 'cod'
                  ? 'bg-[#E5EDE6] border-[#3A5A40] text-[#2D4732] shadow-xs ring-2 ring-[#3A5A40]/30'
                  : 'bg-[#FAF8F5] border-[#E7E5E4] text-[#78716C] hover:bg-white'
              }`}
            >
              <span>{t('checkout_method_cod')}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType('card')}
              className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
                paymentType === 'card'
                  ? 'bg-[#E5EDE6] border-[#3A5A40] text-[#2D4732] shadow-xs ring-2 ring-[#3A5A40]/30'
                  : 'bg-[#FAF8F5] border-[#E7E5E4] text-[#78716C] hover:bg-white'
              }`}
            >
              <CreditCardIcon className="w-3.5 h-3.5" />
              <span>{t('checkout_method_card')}</span>
            </button>
          </div>

          {/* Form Fields: Card Input vs Mobile Money details */}
          {paymentType === 'card' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1917]">{t('checkout_card_number')}</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-[#E7E5E4] rounded-xl text-base text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1C1917]">{t('checkout_card_expiry')}</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-[#E7E5E4] rounded-xl text-base text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1C1917]">{t('checkout_card_cvv')}</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-[#E7E5E4] rounded-xl text-base text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E5E4] space-y-2 text-xs text-[#57534E]">
              <div className="font-bold text-sm text-[#1B3A24]">
                {paymentType === 'momo' && t('momo_name')}
                {paymentType === 'om' && t('om_name')}
                {paymentType === 'cod' && t('checkout_cod_banner_title')}
              </div>
              <p>
                {paymentType === 'cod'
                  ? t('checkout_cod_banner_desc')
                  : t('checkout_ussd_banner_desc', { total: finalTotal.toLocaleString(), phone: phone || '+237 ...' })}
              </p>
            </div>
          )}

          {/* Action Buttons: [ Back ] & [ Continue to Confirm ] */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="py-3.5 px-4 rounded-xl border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] text-[#1C1917] font-semibold text-xs transition-colors text-center min-h-[44px]"
            >
              {t('checkout_back_btn')}
            </button>

            <button
              type="submit"
              className="py-3.5 px-4 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] text-white font-bold text-xs transition-all shadow-md active:scale-[0.99] text-center min-h-[44px]"
            >
              {t('checkout_continue_confirm_btn')}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: CONFIRM YOUR ORDER */}
      {currentStep === 3 && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E7E5E4] shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#1B3A24]">
              {t('checkout_confirm_title_heading')}
            </h2>
            <p className="text-xs text-[#78716C] mt-1">
              {t('checkout_delivery_step_summary')} : {selectedZone.name} • {deliveryTimeSlot === 'afternoon' ? t('delivery_slot_afternoon') : t('delivery_slot_morning')}
            </p>
          </div>

          {/* Promotional Coupon Input Box */}
          <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E5E4] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1B3A24]">
              <TagIcon className="w-4 h-4 text-[#3A5A40]" />
              <span>{t('checkout_coupon_title')}</span>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-[#E5EDE6] rounded-xl border border-[#C9DBCB] text-xs">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-[#3A5A40]" />
                  <span className="font-semibold text-[#1B3A24]">
                    {t('checkout_coupon_applied_badge', { code: appliedCoupon.code })}
                  </span>
                  <span className="font-bold text-[#2D4732]">
                    -{appliedCoupon.calculated_discount.toLocaleString()} FCFA
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-[#DC2626] font-semibold hover:underline text-xs"
                >
                  {t('checkout_coupon_remove_btn')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder={t('checkout_coupon_placeholder')}
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 bg-white border border-[#E7E5E4] rounded-xl text-base text-[#1C1917] uppercase placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon || !couponInput.trim()}
                  className="py-3 px-5 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] disabled:opacity-50 text-white font-bold text-xs transition-colors min-h-[44px]"
                >
                  {isValidatingCoupon ? '...' : t('checkout_coupon_apply_btn')}
                </button>
              </div>
            )}

            {couponError && (
              <p className="text-xs text-[#DC2626]">
                ⚠️ {couponError}
              </p>
            )}
          </div>

          {/* Order Impact Box */}
          <div className="bg-[#FAF8F5] p-5 sm:p-7 rounded-2xl border border-[#E7E5E4] space-y-4">
            <h3 className="font-serif-title text-lg sm:text-xl font-bold text-[#1B3A24]">
              {t('checkout_order_impact_heading')}
            </h3>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center py-2">
              <div>
                <div className="text-xl sm:text-3xl font-bold text-[#1B3A24]">
                  {cartImpact.totalPlasticGrams}g
                </div>
                <div className="text-[11px] sm:text-xs text-[#78716C] mt-1">{t('checkout_plastic_saved_counter')}</div>
              </div>

              <div>
                <div className="text-xl sm:text-3xl font-bold text-[#1B3A24]">
                  {Math.round(cartImpact.totalCo2Kg * 1000)}g
                </div>
                <div className="text-[11px] sm:text-xs text-[#78716C] mt-1">{t('checkout_co2_saved_counter')}</div>
              </div>

              <div>
                <div className="text-xl sm:text-3xl font-bold text-[#1B3A24]">
                  {cartImpact.uniqueFarmersCount}
                </div>
                <div className="text-[11px] sm:text-xs text-[#78716C] mt-1">{t('checkout_farmers_counter')}</div>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown Row */}
          <div className="border-t border-[#E7E5E4] pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-[#78716C]">
              <span>{t('cart_subtotal_row')}</span>
              <span>{cartTotal.toLocaleString()} FCFA</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-[#3A5A40] font-semibold">
                <span>{t('checkout_coupon_title')} ({appliedCoupon.code})</span>
                <span>-{couponDiscount.toLocaleString()} FCFA</span>
              </div>
            )}

            <div className="flex justify-between text-[#78716C]">
              <span>{t('cart_shipping_row')} ({selectedZone.name})</span>
              <span>+{selectedZone.fee.toLocaleString()} FCFA</span>
            </div>

            <div className="border-t border-[#E7E5E4] pt-2 flex justify-between items-baseline">
              <span className="font-medium text-base text-[#1C1917]">{t('checkout_total_row')}</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#1B3A24]">
                {finalTotal.toLocaleString()} FCFA
              </span>
            </div>
            <p className="text-[11px] text-[#78716C]">
              {t('checkout_carbon_neutral_note')}
            </p>
          </div>

          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              ⚠️ {apiError}
            </div>
          )}

          {/* Order Placed Confirmation Screen */}
          {orderReference ? (
            <div className="p-5 sm:p-7 bg-[#E5EDE6] rounded-2xl border border-[#C9DBCB] space-y-5 text-center">
              <div className="w-12 h-12 rounded-full bg-[#3A5A40] text-white flex items-center justify-center mx-auto">
                <CheckCircle2Icon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-serif-title font-bold text-xl text-[#1B3A24]">
                  {t('checkout_success_header')}
                </h4>
                <p className="text-xs text-[#2D4732] mt-1">
                  {t('checkout_order_reference_is')} <strong className="font-mono text-sm">{orderReference}</strong>
                </p>
                <p className="text-xs text-[#57534E] mt-0.5">
                  {t('checkout_selected_slot')} <strong>{deliveryTimeSlot === 'afternoon' ? t('delivery_slot_afternoon') : t('delivery_slot_morning')}</strong>
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm inline-flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.99] min-h-[48px]"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                  <span>{t('whatsapp_dispatch_btn_title')}</span>
                </a>
                <p className="text-[11px] text-[#57534E]">
                  {t('whatsapp_dispatch_btn_explainer')} (#<strong>{orderReference}</strong>)
                </p>
              </div>

              {/* WhatsApp Channel Card */}
              <div className="p-4 bg-white rounded-2xl border border-[#C9DBCB] text-left space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E5EDE6] text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1B3A24] flex items-center gap-1.5">
                      <span>{t('whatsapp_channel_card_heading')}</span>
                      <span className="text-[9px] bg-[#25D366]/20 text-[#1B3A24] px-1.5 py-0.5 rounded font-bold">
                        {t('whatsapp_channel_card_badge')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#57534E] mt-0.5 leading-relaxed">
                      {t('whatsapp_channel_card_text')}
                    </p>
                  </div>
                </div>

                <a
                  href="https://whatsapp.com/channel/0029VaBazarBioYaounde"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#FAF8F5] hover:bg-[#E5EDE6] text-[#1B3A24] border border-[#C9DBCB] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <SparklesIcon className="w-3.5 h-3.5 text-[#3A5A40]" />
                  <span>{t('whatsapp_channel_join_action')}</span>
                </a>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 text-xs">
                <Link
                  href="/dashboard"
                  className="px-4 py-3 rounded-xl bg-white text-[#3A5A40] font-semibold hover:bg-[#FAF8F5] transition-colors border border-[#C9DBCB] text-center min-h-[44px] flex items-center justify-center"
                >
                  {t('checkout_view_hub')}
                </Link>
                <Link
                  href="/products"
                  className="px-4 py-3 rounded-xl bg-[#3A5A40] text-white font-semibold hover:bg-[#2D4732] transition-colors text-center min-h-[44px] flex items-center justify-center"
                >
                  {t('checkout_shop_more')}
                </Link>
              </div>
            </div>
          ) : (
            /* Action Buttons: [ Back ] & [ Place Order ] */
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={isSubmitting}
                className="py-3.5 px-4 rounded-xl border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] text-[#1C1917] font-semibold text-xs transition-colors text-center min-h-[44px]"
              >
                {t('checkout_back_btn')}
              </button>

              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="py-3.5 px-4 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] text-white font-bold text-xs transition-all shadow-md active:scale-[0.99] text-center min-h-[44px]"
              >
                {isSubmitting ? t('checkout_placing_order_btn') : t('checkout_place_order_btn')}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

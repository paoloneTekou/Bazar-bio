'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { DELIVERY_ZONES } from '@/lib/data';
import { getDeliveryZones, submitOrder } from '@/lib/api';
import { DeliveryZone } from '@/types';
import {
  CheckCircle2Icon,
  TruckIcon,
  ShieldCheckIcon,
  LeafIcon,
  PhoneIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckIcon,
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
  const [phone, setPhone] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState(DELIVERY_ZONES[0].id);
  const [addressDetails, setAddressDetails] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mtn_momo' | 'orange_momo' | 'cash_on_delivery'>('mtn_momo');

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
  const finalTotal = cartTotal + (selectedZone ? selectedZone.fee : 1500);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !phone || !addressDetails) {
      alert('Veuillez renseigner votre nom, téléphone et repère de livraison à Yaoundé.');
      return;
    }
    setCurrentStep(2);
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    setApiError(null);

    const itemsPayload = cartItems.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    const response = await submitOrder({
      order: {
        customer_name: `${firstName} ${lastName}`.trim(),
        customer_phone: phone,
        delivery_zone_id: selectedZoneId,
        delivery_address_details: addressDetails,
        payment_method_code: paymentMethod,
        customer_notes: customerNotes,
      },
      items: itemsPayload,
    });

    setIsSubmitting(false);

    if (!response.success && response.error) {
      setApiError(response.error);
      return;
    }

    if (response.order_reference) {
      setOrderReference(response.order_reference);
    }
    if (response.whatsapp_url) {
      setBackendWhatsAppUrl(response.whatsapp_url);
    }
    setCurrentStep(3);
    clearCart();
  };

  // WhatsApp Preformatted URL
  const generateWhatsAppUrl = () => {
    if (backendWhatsAppUrl) {
      return backendWhatsAppUrl;
    }

    const paymentLabel = {
      mtn_momo: 'MTN Mobile Money',
      orange_momo: 'Orange Money',
      cash_on_delivery: 'Paiement à la livraison',
    }[paymentMethod];

    const message = `🌿 *NOUVELLE COMMANDE BAZAR-BIO*\n` +
      `Référence : *${orderReference}*\n` +
      `Client : ${firstName} ${lastName} (${phone})\n` +
      `Quartier : *${selectedZone.name}* (${addressDetails})\n` +
      `Paiement : ${paymentLabel}\n` +
      `Total : *${finalTotal.toLocaleString()} FCFA*\n\n` +
      `🌱 *Impact écologique :* ${cartImpact.totalPlasticGrams}g plastique évité, ${cartImpact.totalCo2Kg}kg CO₂ épargné.`;

    return `https://wa.me/237654818121?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 3-Step Progress Stepper (Matches Figma Specifications) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-xs">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep >= 1 ? 'bg-[#3A5A40] text-white shadow-xs' : 'bg-[#F5F5F4] text-[#78716C]'
            }`}>
              {currentStep > 1 ? <CheckIcon className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-[11px] font-semibold text-[#1C1917]">{t('checkout_step1')}</span>
          </div>

          <div className={`flex-1 h-0.5 mx-3 ${currentStep >= 2 ? 'bg-[#3A5A40]' : 'bg-[#E7E5E4]'}`} />

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep >= 2 ? 'bg-[#3A5A40] text-white shadow-xs' : 'bg-[#F5F5F4] text-[#78716C]'
            }`}>
              {currentStep > 2 ? <CheckIcon className="w-4 h-4" /> : '2'}
            </div>
            <span className="text-[11px] font-semibold text-[#1C1917]">{t('checkout_step2')}</span>
          </div>

          <div className={`flex-1 h-0.5 mx-3 ${currentStep === 3 ? 'bg-[#3A5A40]' : 'bg-[#E7E5E4]'}`} />

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep === 3 ? 'bg-[#3A5A40] text-white shadow-xs' : 'bg-[#F5F5F4] text-[#78716C]'
            }`}>
              3
            </div>
            <span className="text-[11px] font-semibold text-[#1C1917]">{t('checkout_step3')}</span>
          </div>

        </div>
      </div>

      {/* STEP 1: DELIVERY FORM */}
      {currentStep === 1 && (
        <form onSubmit={handleProceedToPayment} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E5E4] shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif-title text-2xl font-bold text-[#1B3A24]">
              {t('delivery_title')}
            </h2>
            <p className="text-xs text-[#78716C]">
              {t('delivery_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">{t('first_name_label')}</label>
              <input
                type="text"
                required
                placeholder={t('first_name_placeholder')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E7E5E4] rounded-xl text-xs text-[#1C1917] focus:ring-2 focus:ring-[#3A5A40]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">{t('last_name_label')}</label>
              <input
                type="text"
                placeholder={t('last_name_placeholder')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E7E5E4] rounded-xl text-xs text-[#1C1917] focus:ring-2 focus:ring-[#3A5A40]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">{t('phone_label')}</label>
              <input
                type="tel"
                required
                placeholder={t('phone_placeholder')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E7E5E4] rounded-xl text-xs text-[#1C1917] focus:ring-2 focus:ring-[#3A5A40]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">{t('neighborhood_label')}</label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#E7E5E4] rounded-xl text-xs text-[#1C1917] focus:ring-2 focus:ring-[#3A5A40]/20 font-medium"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} (+{zone.fee.toLocaleString()} FCFA • {zone.estimatedDeliveryHours})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1C1917]">{t('landmark_label')}</label>
            <input
              type="text"
              required
              placeholder={t('landmark_placeholder')}
              value={addressDetails}
              onChange={(e) => setAddressDetails(e.target.value)}
              className="w-full p-2.5 bg-[#FAF8F5] border border-[#E7E5E4] rounded-xl text-xs text-[#1C1917] focus:ring-2 focus:ring-[#3A5A40]/20"
            />
          </div>

          <div className="pt-4 border-t border-[#F5F5F4] flex items-center justify-between">
            <div className="text-xs text-[#57534E]">
              {t('total_with_delivery')} <strong className="text-[#3A5A40] text-sm">{finalTotal.toLocaleString()} FCFA</strong>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>{t('continue_to_payment')}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: PAYMENT METHOD */}
      {currentStep === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E5E4] shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif-title text-2xl font-bold text-[#1B3A24]">
              {t('payment_title')}
            </h2>
            <p className="text-xs text-[#78716C]">
              {t('payment_subtitle')}
            </p>
          </div>

          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              ⚠️ {apiError}
            </div>
          )}

          <div className="space-y-3">
            {/* MTN MoMo */}
            <div
              onClick={() => setPaymentMethod('mtn_momo')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === 'mtn_momo'
                  ? 'bg-[#FEF3C7]/40 border-[#F59E0B] shadow-xs'
                  : 'bg-[#FAF8F5] border-[#E7E5E4] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center font-bold text-xs">
                  MoMo
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1C1917]">{t('momo_name')}</h4>
                  <p className="text-[11px] text-[#78716C]">{t('momo_desc')}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'mtn_momo' ? 'border-[#F59E0B] bg-[#F59E0B]' : 'border-[#D6D3D1]'
              }`}>
                {paymentMethod === 'mtn_momo' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {/* Orange Money */}
            <div
              onClick={() => setPaymentMethod('orange_momo')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === 'orange_momo'
                  ? 'bg-[#FFEDD5]/40 border-[#EA580C] shadow-xs'
                  : 'bg-[#FAF8F5] border-[#E7E5E4] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EA580C] text-white flex items-center justify-center font-bold text-xs">
                  OM
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1C1917]">{t('om_name')}</h4>
                  <p className="text-[11px] text-[#78716C]">{t('om_desc')}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'orange_momo' ? 'border-[#EA580C] bg-[#EA580C]' : 'border-[#D6D3D1]'
              }`}>
                {paymentMethod === 'orange_momo' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {/* Cash on Delivery */}
            <div
              onClick={() => setPaymentMethod('cash_on_delivery')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                paymentMethod === 'cash_on_delivery'
                  ? 'bg-[#E5EDE6]/60 border-[#3A5A40] shadow-xs'
                  : 'bg-[#FAF8F5] border-[#E7E5E4] hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3A5A40] text-white flex items-center justify-center font-bold text-xs">
                  💵
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1C1917]">{t('cod_name')}</h4>
                  <p className="text-[11px] text-[#78716C]">{t('cod_desc')}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'cash_on_delivery' ? 'border-[#3A5A40] bg-[#3A5A40]' : 'border-[#D6D3D1]'
              }`}>
                {paymentMethod === 'cash_on_delivery' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F5F5F4] flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              disabled={isSubmitting}
              className="text-xs font-semibold text-[#78716C] hover:text-[#1C1917]"
            >
              {t('edit_delivery')}
            </button>

            <button
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
              className="px-7 py-3 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              {isSubmitting ? (
                <span>{t('validating_btn')}</span>
              ) : (
                <>
                  <span>{t('confirm_order_btn', { total: finalTotal.toLocaleString() })}</span>
                  <CheckCircle2Icon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ORDER CONFIRMED & WHATSAPP DISPATCH */}
      {currentStep === 3 && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E7E5E4] shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#E5EDE6] text-[#2D4732] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2Icon className="w-8 h-8 text-[#3A5A40]" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="text-xs font-bold text-[#588157] uppercase tracking-wider">
              {t('order_success_title')}
            </span>
            <h2 className="font-serif-title text-3xl font-bold text-[#1B3A24]">
              {t('thank_you_title', { name: firstName })}
            </h2>
            <p className="text-xs text-[#78716C]">
              {t('order_ref_label')} <strong className="text-[#1C1917] font-mono text-sm">{orderReference}</strong>
            </p>
          </div>

          {/* Environmental Impact Recap Badge */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E7E5E4] max-w-lg mx-auto text-left space-y-3">
            <div className="flex items-center gap-2 text-[#3A5A40] font-bold text-xs">
              <LeafIcon className="w-4 h-4" />
              <span>{t('impact_recap_title')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#E7E5E4]">
                <span className="text-[#78716C] block text-[11px]">{t('plastic_avoided_label')}</span>
                <strong className="text-[#3A5A40]">{cartImpact.totalPlasticGrams}g</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E7E5E4]">
                <span className="text-[#78716C] block text-[11px]">{t('co2_saved_label')}</span>
                <strong className="text-[#3A5A40]">{cartImpact.totalCo2Kg} kg</strong>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Dispatch Button */}
          <div className="pt-2 max-w-md mx-auto space-y-3">
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <PhoneIcon className="w-4 h-4" />
              <span>{t('send_whatsapp_btn')}</span>
            </a>
            <p className="text-[11px] text-[#78716C]">
              {t('whatsapp_dispatch_note')}
            </p>
          </div>

          <div className="pt-6 border-t border-[#F5F5F4] flex justify-center gap-4 text-xs">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-[#3A5A40] text-[#3A5A40] font-semibold hover:bg-[#FAF8F5] transition-colors"
            >
              {t('view_dashboard_btn')}
            </Link>
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] text-[#57534E] font-semibold hover:bg-[#E7E5E4] transition-colors"
            >
              {t('back_to_market_btn')}
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}


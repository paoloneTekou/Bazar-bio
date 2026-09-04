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
  LeafIcon,
  PhoneIcon,
  CheckIcon,
  CreditCardIcon,
  WhatsAppIcon,
  SparklesIcon,
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
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);

  // Payment states
  const [paymentType, setPaymentType] = useState<'card' | 'momo' | 'om' | 'cod'>('card');
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
  const finalTotal = cartTotal + (selectedZone ? selectedZone.fee : 1500);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !phone || !address) {
      alert('Please provide your name, address, and contact number.');
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
        payment_method_code: paymentMethodCode,
        customer_notes: '',
        whatsapp_opt_in: whatsappOptIn,
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
    } else {
      setOrderReference(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
    }

    if (response.whatsapp_url) {
      setBackendWhatsAppUrl(response.whatsapp_url);
    }

    clearCart();
  };

  const generateWhatsAppUrl = () => {
    if (backendWhatsAppUrl) return backendWhatsAppUrl;

    const message = `🌿 *COMMANDE BAZAR-BIO*\n` +
      `Référence : *${orderReference}*\n` +
      `Client : ${firstName} ${lastName} (${phone})\n` +
      `Adresse : ${address}, ${city}\n` +
      `Total : *${finalTotal.toLocaleString()} FCFA*\n\n` +
      `🌱 *Impact :* ${cartImpact.totalPlasticGrams}g plastique économisé, ${cartImpact.totalCo2Kg}kg CO₂ épargné.`;

    return `https://wa.me/237654818121?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* 3-Step Stepper Header (Matches Figma Mockups) */}
      <div className="flex items-center justify-center max-w-md mx-auto">
        {/* Step 1: Delivery */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            currentStep > 1
              ? 'bg-[#3A5A40] text-white'
              : currentStep === 1
              ? 'bg-[#3A5A40] text-white ring-4 ring-[#E5EDE6]'
              : 'bg-[#E7E5E4] text-[#78716C]'
          }`}>
            {currentStep > 1 ? <CheckIcon className="w-4 h-4" /> : '1'}
          </div>
          <span className="text-xs font-medium text-[#1C1917]">Delivery</span>
        </div>

        {/* Connector Line 1 */}
        <div className={`h-0.5 w-16 -mt-5 transition-colors ${
          currentStep > 1 ? 'bg-[#3A5A40]' : 'bg-[#E7E5E4]'
        }`} />

        {/* Step 2: Payment */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            currentStep > 2
              ? 'bg-[#3A5A40] text-white'
              : currentStep === 2
              ? 'bg-[#3A5A40] text-white ring-4 ring-[#E5EDE6]'
              : 'bg-[#C9DBCB] text-[#2D4732]'
          }`}>
            {currentStep > 2 ? <CheckIcon className="w-4 h-4" /> : '2'}
          </div>
          <span className="text-xs font-medium text-[#1C1917]">Payment</span>
        </div>

        {/* Connector Line 2 */}
        <div className={`h-0.5 w-16 -mt-5 transition-colors ${
          currentStep === 3 ? 'bg-[#3A5A40]' : 'bg-[#E7E5E4]'
        }`} />

        {/* Step 3: Confirm */}
        <div className="flex flex-col items-center gap-1.5 flex-1">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            currentStep === 3
              ? 'bg-[#3A5A40] text-white ring-4 ring-[#E5EDE6]'
              : 'bg-[#C9DBCB] text-[#2D4732]'
          }`}>
            3
          </div>
          <span className="text-xs font-medium text-[#1C1917]">Confirm</span>
        </div>
      </div>

      {/* STEP 1: DELIVERY INFORMATION (Matches Figma Screenshot 1) */}
      {currentStep === 1 && (
        <form
          onSubmit={handleProceedToPayment}
          className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E5E4] shadow-xs space-y-6 animate-in fade-in"
        >
          <div>
            <h2 className="font-serif-title text-3xl font-bold text-[#1B3A24]">
              Delivery Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">First Name</label>
              <input
                type="text"
                required
                placeholder="Jean"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#E7E5E4] rounded-xl text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">Last Name</label>
              <input
                type="text"
                placeholder="Dupont"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#E7E5E4] rounded-xl text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1C1917]">Address</label>
            <input
              type="text"
              required
              placeholder="123 Rue de la Paix / Quartier & Repère"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E7E5E4] rounded-xl text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">City / Neighborhood</label>
              <select
                value={selectedZoneId}
                onChange={(e) => {
                  setSelectedZoneId(e.target.value);
                  const z = zones.find((item) => String(item.id) === String(e.target.value));
                  if (z) setCity(z.name);
                }}
                className="w-full px-4 py-3 bg-white border border-[#E7E5E4] rounded-xl text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} (+{zone.fee.toLocaleString()} FCFA)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1C1917]">Postal Code / Zone ID</label>
              <input
                type="text"
                placeholder="75001 / BP Yaoundé"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#E7E5E4] rounded-xl text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1C1917]">Phone</label>
            <input
              type="tel"
              required
              placeholder="+237 654 81 81 21 / +33 1 23 45 67 89"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E7E5E4] rounded-xl text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
            />
          </div>

          {/* WhatsApp 3x Weekly Drop Notification Consent */}
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
                  <span>Recevoir les alertes récoltes fraîches sur WhatsApp</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#E5EDE6] text-[#2D4732] rounded-full">
                    3x / semaine max
                  </span>
                </span>
                <p className="text-[#78716C] text-[11px] leading-relaxed">
                  Soyez informé en priorité des récoltes bio du Mardi, Jeudi et Samedi matin (Mfou, Obala, etc.). Zéro spam, désinscription en 1 clic.
                </p>
              </div>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] text-white font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.99]"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: PAYMENT INFORMATION (Matches Figma Screenshot 2) */}
      {currentStep === 2 && (
        <form
          onSubmit={handleProceedToConfirm}
          className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E5E4] shadow-xs space-y-6 animate-in fade-in"
        >
          <div>
            <h2 className="font-serif-title text-3xl font-bold text-[#1B3A24]">
              Payment Information
            </h2>
          </div>

          {/* Payment Method Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => setPaymentType('card')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                paymentType === 'card'
                  ? 'bg-[#E5EDE6] border-[#3A5A40] text-[#2D4732] shadow-xs'
                  : 'bg-[#FAF8F5] border-[#E7E5E4] text-[#78716C] hover:bg-white'
              }`}
            >
              <CreditCardIcon className="w-3.5 h-3.5" />
              <span>Credit Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType('momo')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                paymentType === 'momo'
                  ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E] shadow-xs'
                  : 'bg-[#FAF8F5] border-[#E7E5E4] text-[#78716C] hover:bg-white'
              }`}
            >
              <span>MTN MoMo</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType('om')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                paymentType === 'om'
                  ? 'bg-[#FFEDD5] border-[#EA580C] text-[#C2410C] shadow-xs'
                  : 'bg-[#FAF8F5] border-[#E7E5E4] text-[#78716C] hover:bg-white'
              }`}
            >
              <span>Orange Money</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentType('cod')}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                paymentType === 'cod'
                  ? 'bg-[#E5EDE6] border-[#3A5A40] text-[#2D4732] shadow-xs'
                  : 'bg-[#FAF8F5] border-[#E7E5E4] text-[#78716C] hover:bg-white'
              }`}
            >
              <span>Cash on Delivery</span>
            </button>
          </div>

          {/* Form Fields: Card Input (Matches Figma Screenshot) */}
          {paymentType === 'card' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1917]">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#E7E5E4] rounded-xl text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1C1917]">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#E7E5E4] rounded-xl text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1C1917]">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#E7E5E4] rounded-xl text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#3A5A40]/30 focus:border-[#3A5A40]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-[#E7E5E4] space-y-2 text-xs text-[#57534E]">
              <div className="font-bold text-sm text-[#1B3A24]">
                {paymentType === 'momo' && 'Paiement instantané MTN MoMo'}
                {paymentType === 'om' && 'Paiement instantané Orange Money'}
                {paymentType === 'cod' && 'Paiement en espèces ou MoMo à la livraison'}
              </div>
              <p>
                {paymentType === 'cod'
                  ? 'Vous paierez directement à l\'arrivée du livreur après vérification de vos produits bio.'
                  : `Le montant exact de ${finalTotal.toLocaleString()} FCFA sera débité via notification USSD sur votre téléphone (${phone || 'numéro renseigné'}).`}
              </p>
            </div>
          )}

          {/* Action Buttons: [ Back ] & [ Continue to Confirm ] */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="py-3.5 px-6 rounded-xl border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] text-[#1C1917] font-semibold text-xs transition-colors text-center"
            >
              Back
            </button>

            <button
              type="submit"
              className="py-3.5 px-6 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] text-white font-bold text-xs transition-all shadow-md active:scale-[0.99] text-center"
            >
              Continue to Confirm
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: CONFIRM YOUR ORDER (Matches Figma Screenshot 3) */}
      {currentStep === 3 && (
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E7E5E4] shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h2 className="font-serif-title text-3xl font-bold text-[#1B3A24]">
              Confirm Your Order
            </h2>
          </div>

          {/* Order Impact Box (3 Columns - Matches Figma Screenshot 3) */}
          <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-[#E7E5E4] space-y-4">
            <h3 className="font-serif-title text-xl font-bold text-[#1B3A24]">
              Order Impact
            </h3>

            <div className="grid grid-cols-3 gap-4 text-center py-2">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1B3A24]">
                  {cartImpact.totalPlasticGrams}g
                </div>
                <div className="text-xs text-[#78716C] mt-1">Plastic Saved</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1B3A24]">
                  {Math.round(cartImpact.totalCo2Kg * 1000)}g
                </div>
                <div className="text-xs text-[#78716C] mt-1">CO₂ Saved</div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#1B3A24]">
                  {cartImpact.uniqueFarmersCount}
                </div>
                <div className="text-xs text-[#78716C] mt-1">Farmers Supported</div>
              </div>
            </div>
          </div>

          {/* Total Row */}
          <div className="border-t border-[#E7E5E4] pt-4 space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-base text-[#1C1917]">Total</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#1B3A24]">
                {finalTotal.toLocaleString()} FCFA
              </span>
            </div>
            <p className="text-xs text-[#78716C]">
              Including carbon-neutral delivery
            </p>
          </div>

          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              ⚠️ {apiError}
            </div>
          )}

          {/* If already submitted */}
          {orderReference ? (
            <div className="p-5 bg-[#E5EDE6] rounded-2xl border border-[#C9DBCB] space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#3A5A40] text-white flex items-center justify-center mx-auto">
                <CheckCircle2Icon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-serif-title font-bold text-lg text-[#1B3A24]">
                  Order Placed Successfully!
                </h4>
                <p className="text-xs text-[#2D4732] mt-1">
                  Reference: <strong className="font-mono">{orderReference}</strong>
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Send Confirmation on WhatsApp</span>
                </a>
              </div>

              {/* WhatsApp Channel Community Card */}
              <div className="p-4 bg-white rounded-2xl border border-[#C9DBCB] text-left space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E5EDE6] text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1B3A24] flex items-center gap-1.5">
                      <span>Canal WhatsApp Officiel Bazar-Bio</span>
                      <span className="text-[9px] bg-[#25D366]/20 text-[#1B3A24] px-1.5 py-0.5 rounded font-bold">
                        GRATUIT
                      </span>
                    </div>
                    <p className="text-[11px] text-[#57534E] mt-0.5 leading-relaxed">
                      Rejoignez notre chaîne WhatsApp pour découvrir les photos des récoltes du matin et les alertes avant rupture de stock (Mardi, Jeudi & Samedi).
                    </p>
                  </div>
                </div>

                <a
                  href="https://whatsapp.com/channel/0029VaBazarBioYaounde"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-[#FAF8F5] hover:bg-[#E5EDE6] text-[#1B3A24] border border-[#C9DBCB] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <SparklesIcon className="w-3.5 h-3.5 text-[#3A5A40]" />
                  <span>Rejoindre le Canal WhatsApp →</span>
                </a>
              </div>

              <div className="pt-2 flex justify-center gap-3 text-xs">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg bg-white text-[#3A5A40] font-semibold hover:bg-[#FAF8F5] transition-colors border border-[#C9DBCB]"
                >
                  View My Bio Hub
                </Link>
                <Link
                  href="/products"
                  className="px-4 py-2 rounded-lg bg-[#3A5A40] text-white font-semibold hover:bg-[#2D4732] transition-colors"
                >
                  Shop More
                </Link>
              </div>
            </div>
          ) : (
            /* Action Buttons: [ Back ] & [ Place Order ] */
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={isSubmitting}
                className="py-3.5 px-6 rounded-xl border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] text-[#1C1917] font-semibold text-xs transition-colors text-center"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="py-3.5 px-6 rounded-xl bg-[#3A5A40] hover:bg-[#2D4732] text-white font-bold text-xs transition-all shadow-md active:scale-[0.99] text-center"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}



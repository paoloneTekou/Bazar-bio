'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { LeafIcon, PhoneIcon, MailIcon, MapPinIcon, ShieldCheckIcon, HeartIcon } from '@/components/ui/Icons';

export function Footer() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <footer className="bg-[#1B3A24] text-[#E8EFE9] pt-16 pb-12 border-t border-[#2D4732]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 3 Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#2D4732]">
          <div className="flex items-center gap-4 bg-[#243828]/50 p-4 rounded-xl border border-[#3A5A40]/40">
            <div className="w-12 h-12 rounded-full bg-[#3A5A40] text-white flex items-center justify-center shrink-0">
              <LeafIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t('trust_badge_1_title')}</h4>
              <p className="text-xs text-[#A3C0A6]">{t('trust_badge_1_desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#243828]/50 p-4 rounded-xl border border-[#3A5A40]/40">
            <div className="w-12 h-12 rounded-full bg-[#3A5A40] text-white flex items-center justify-center shrink-0">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t('trust_badge_2_title')}</h4>
              <p className="text-xs text-[#A3C0A6]">{t('trust_badge_2_desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#243828]/50 p-4 rounded-xl border border-[#3A5A40]/40">
            <div className="w-12 h-12 rounded-full bg-[#3A5A40] text-white flex items-center justify-center shrink-0">
              <HeartIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{t('trust_badge_3_title')}</h4>
              <p className="text-xs text-[#A3C0A6]">{t('trust_badge_3_desc')}</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#3A5A40] text-white flex items-center justify-center">
                <LeafIcon className="w-5 h-5" />
              </div>
              <span className="font-serif-title text-2xl font-bold text-white">
                Bazar-Bio
              </span>
            </div>
            <p className="text-xs text-[#C9DBCB] leading-relaxed">
              {t('footer_mission')}
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-[#2D4732] text-[#A3C0A6]">
                {t('footer_impact_label')}
              </span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('footer_sections_title')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C9DBCB]">
              <li>
                <Link href="/products?category=cat-legumes" className="hover:text-white transition-colors">
                  Légumes & Tubercules Frais
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat-fruits" className="hover:text-white transition-colors">
                  Fruits Tropicaux de Saison
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat-epices" className="hover:text-white transition-colors">
                  Poivre de Penja & Épices Locales
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat-soins" className="hover:text-white transition-colors">
                  Beurres Purs de Karité & Cacao
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat-bijoux" className="hover:text-white transition-colors">
                  Bijoux & Artisanat Bamiléké
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation & Impact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('footer_hub_title')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#C9DBCB]">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  {t('nav_impact')}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  {t('nav_vendor')}
                </Link>
              </li>
              <li>
                <span className="text-[#A3C0A6]">Livraisons : Bastos, Odza, Omnisports, Mendong</span>
              </li>
              <li>
                <span className="text-[#A3C0A6]">Emballages : Feuilles de Bananier & Kraft</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Local Logistics */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('footer_contact_title')}
            </h4>
            <ul className="space-y-3 text-xs text-[#C9DBCB]">
              <li className="flex items-start gap-2.5">
                <MapPinIcon className="w-4 h-4 text-[#789F7D] shrink-0 mt-0.5" />
                <span>Yaoundé, Région du Centre, Cameroun (Livraisons à domicile)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="w-4 h-4 text-[#789F7D] shrink-0" />
                <a
                  href="https://wa.me/237654818121"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  +237 654 81 81 21 (WhatsApp Direct)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MailIcon className="w-4 h-4 text-[#789F7D] shrink-0" />
                <span>contact@bazar-bio.cm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Language Switcher */}
        <div className="pt-8 mt-8 border-t border-[#2D4732] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A3C0A6] gap-4">
          <p>{t('footer_copyright_text')}</p>
          <div className="flex items-center gap-4">
            <span>{t('footer_circuit_court')}</span>
            <span>•</span>
            <span>{t('footer_mobile_first')}</span>
            <span>•</span>
            <div className="inline-flex items-center gap-1.5 bg-[#243828] px-2 py-0.5 rounded-md border border-[#3A5A40]/40">
              <span className="text-[10px] uppercase text-[#789F7D]">{t('lang_switch')}:</span>
              <button
                onClick={() => setLocale('fr')}
                className={`text-[10px] font-bold ${locale === 'fr' ? 'text-white underline' : 'text-[#A3C0A6]'}`}
              >
                FR
              </button>
              <span>|</span>
              <button
                onClick={() => setLocale('en')}
                className={`text-[10px] font-bold ${locale === 'en' ? 'text-white underline' : 'text-[#A3C0A6]'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CaucasusCinemaScroll from '@/components/cinematic/CaucasusCinemaScroll';
import ExpeditionsShowcase from '@/components/homepage/ExpeditionsShowcase';
import InternationalTrustBento from '@/components/homepage/InternationalTrustBento';
import AcclimatizationProfile from '@/components/homepage/AcclimatizationProfile';
import BarrelsSection from '@/components/homepage/BarrelsSection';
import GearChecklist from '@/components/homepage/GearChecklist';
import LogisticsSection from '@/components/homepage/LogisticsSection';
import SchedulePreview from '@/components/homepage/SchedulePreview';
import ScrollReveal from '@/components/homepage/ScrollReveal';
import Logo from '@/components/Logo';
import defaultSettings from '@/data/siteSettings.json';
import {
  Mountain,
  ShieldCheck,
  Compass,
  Phone,
  Mail,
  Send,
  MessageCircle,
} from 'lucide-react';

export default function HomePage() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    // Only attempt dynamic settings query in development; static build uses siteSettings.json
    if (process.env.NODE_ENV === 'development') {
      fetch('/api/settings')
        .then((r) => r.json())
        .then((data) => {
          if (data.settings) {
            setSettings((prev: any) => ({ ...prev, ...data.settings }));
          }
        })
        .catch(() => {});
    }
  }, []);

  return (
    <main className="w-full max-w-full min-h-[100dvh] overflow-x-hidden bg-[#060B12] text-slate-100 selection:bg-[#FF6A00]/30 selection:text-white font-sans antialiased">
      {/* =========================================================================
          1. CINEMATIC HERO SECTION (Zero-Lag, Full-Bleed Authentic Mountain Stages)
      ========================================================================= */}
      <CaucasusCinemaScroll />

      {/* =========================================================================
          2. EXPEDITIONS SHOWCASE (TOUR CATALOG DIRECTLY UNDER HERO)
      ========================================================================= */}
      <div id="expeditions" className="scroll-mt-20">
        <ExpeditionsShowcase />
      </div>

      {/* =========================================================================
          3. INTERNATIONAL TRUST SIGNALS & GUARANTEES BENTO SECTION
      ========================================================================= */}
      <InternationalTrustBento />

      {/* =========================================================================
          4. ELEVATION ACCLIMATIZATION PROFILE
      ========================================================================= */}
      {settings.showAcclimatization !== false && (
        <section id="acclimatization" className="py-24 sm:py-32 bg-[#060B12] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold text-[#FF6A00] mb-2">
                    <Mountain className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
                    Atmospheric Physiology &amp; Route Profile
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                    High-Altitude Acclimatization
                  </h2>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed font-sans">
                  Reaching 5,642 meters safely requires gradual exposure to thinning atmosphere. Our rotation strategy guarantees proper hemoglobin adaptation.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={50}>
              <AcclimatizationProfile />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* =========================================================================
          5. BARRELS-GARABASHI 3,800 M REFUGE SHOWCASE
      ========================================================================= */}
      <BarrelsSection />

      {/* =========================================================================
          6. GEAR CHECKLIST
      ========================================================================= */}
      {settings.showGearRental !== false && (
        <section id="gear" className="py-24 sm:py-32 bg-[#060B12] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold text-emerald-400 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
                    Mountaineering Readiness
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                    Alpine Gear &amp; Legal Checklist
                  </h2>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed font-sans">
                  Track your gear preparations online. Missing equipment can be rented upon arrival at our Terskol alpine warehouse.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={50}>
              <GearChecklist />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* =========================================================================
          7. SCHEDULE 2026 TIMETABLE
      ========================================================================= */}
      <SchedulePreview />

      {/* =========================================================================
          8. EXPEDITION LOGISTICS & SAFETY
      ========================================================================= */}
      <LogisticsSection />

      {/* =========================================================================
          9. FOOTER
      ========================================================================= */}
      <footer className="bg-[#060B12] border-t border-white/[0.06] text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            {/* Column 1: Company Profile with Logo */}
            <div className="space-y-4">
              <Logo />
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Высокогорные восхождения, ски-альпинизм и треккинг по Главному Кавказскому хребту. Организуем экспедиции с 2006 года с собственным базовым лагерем на Гарабаши, Эльбрус (3 800 м).
              </p>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-300 bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 rounded-full">
                <Compass className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
                Стандарты ФАР &bull; Аттестованные гиды
              </div>
            </div>

            {/* Column 2: Quick Navigation */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-white mb-4">
                Маршруты и Экспедиции
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#expeditions" className="hover:text-[#FF6A00] transition-colors">
                    Восхождение на Эльбрус с юга (8 дней)
                  </a>
                </li>
                <li>
                  <a href="#expeditions" className="hover:text-[#FF6A00] transition-colors">
                    Восхождение на Эльбрус с севера (8 дней)
                  </a>
                </li>
                <li>
                  <a href="#expeditions" className="hover:text-[#FF6A00] transition-colors">
                    Ски-тур на Эльбрусе и фрирайд (8 дней)
                  </a>
                </li>
                <li>
                  <a href="#expeditions" className="hover:text-[#FF6A00] transition-colors">
                    Эльбрус через ущелье Ирикчат (10 дней)
                  </a>
                </li>
                <li>
                  <a href="#expeditions" className="hover:text-[#FF6A00] transition-colors">
                    Восхождение на Казбек (9 дней)
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Operational Bases & Legal Requisites */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-white mb-4">
                Базы и Реквизиты
              </div>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2">
                  <img src="/img/geotag.svg" alt="Location" className="w-3.5 h-3.5 object-contain mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Организатор:</span>
                    <div className="text-slate-400">ООО «КавказСкиТур» &bull; КБР, г. Нальчик, ул. Горького, д. 74</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Mountain className="w-3.5 h-3.5 text-[#FF6A00] mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <span className="font-semibold text-white">Высотный приют:</span>
                    <div className="text-slate-400">«Бочки» (Гарабаши, 3 800 м, Эльбрус)</div>
                  </div>
                </li>
                <li className="text-[11px] text-slate-500 pt-1">
                  Обязательная регистрация всех групп в ГУ МЧС России по КБР за 10 дней до выхода.
                </li>
              </ul>
            </div>

            {/* Column 4: Communications */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-white mb-4">
                Прямая Связь с Базой
              </div>
              <ul className="space-y-3 text-xs">
                <li>
                  <a
                    href="tel:+79280828413"
                    className="flex items-center gap-2 hover:text-[#FF6A00] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
                    <span className="font-mono text-[11px]">+7 (928) 082-84-13</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@kavkazskitur.com"
                    className="flex items-center gap-2 hover:text-[#FF6A00] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                    <span className="font-mono text-[11px]">info@kavkazskitur.com</span>
                  </a>
                </li>
                <li className="flex items-center gap-3 pt-1">
                  <a
                    href="https://wa.me/79280828413"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-lg shadow-green-950/30 transition-colors min-h-[44px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="https://t.me/kavkazskitur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 text-xs font-semibold transition-colors min-h-[44px]"
                  >
                    <Send className="w-3.5 h-3.5 strokeWidth={1.5}" />
                    <span>Telegram</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Sub-footer Copyright & Legal Links */}
          <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              &copy; 2026 ООО «КавказСкиТур». Все права защищены. Безопасность сертифицирована.
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4 text-center md:text-right">
              <Link href="/privacy" className="hover:text-[#FF6A00] underline transition-colors">
                Политика конфиденциальности (152-ФЗ)
              </Link>
              <span className="text-white/20">&bull;</span>
              <Link href="/offer" className="hover:text-[#FF6A00] underline transition-colors">
                Публичная оферта (ст. 437 ГК РФ)
              </Link>
              <span className="text-white/20">&bull;</span>
              <Link href="/safety" className="hover:text-white transition-colors">
                Безопасность и МЧС
              </Link>
              <span className="text-white/20">&bull;</span>
              <Link href="/about" className="hover:text-white transition-colors">
                О компании
              </Link>
              <span className="text-white/20">&bull;</span>
              <Link href="/partners" className="hover:text-white transition-colors">
                Партнерам
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

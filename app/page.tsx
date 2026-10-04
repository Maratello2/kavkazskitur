'use client';

import React, { useState, useEffect } from 'react';
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
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setSettings((prev: any) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});
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
                Alpine expeditions, ski mountaineering, and high-altitude climbs across the Greater Caucasus Range. Operating since 2006 with our own base camp at Garabashi, Mt. Elbrus (3,800 m).
              </p>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-300 bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 rounded-full">
                <Compass className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
                UIAGM / KMGA Protocols
              </div>
            </div>

            {/* Column 2: Quick Navigation */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-white mb-4">
                Expedition Routes
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#expeditions" className="hover:text-[#FF6A00] transition-colors">
                    Elbrus Climb South Side (8 Days)
                  </a>
                </li>
                <li>
                  <a href="#expeditions" className="hover:text-[#FF6A00] transition-colors">
                    Climbing Elbrus From North Route (8 Days)
                  </a>
                </li>
                <li>
                  <a href="#expeditions" className="hover:text-[#FF6A00] transition-colors">
                    Elbrus Ski-Tour &amp; Freeride (8 Days)
                  </a>
                </li>
                <li>
                  <a href="#expeditions" className="hover:text-[#FF6A00] transition-colors">
                    Climbing Elbrus + Irikchat Gorge (10 Days)
                  </a>
                </li>
                <li>
                  <a href="#expeditions" className="hover:text-[#FF6A00] transition-colors">
                    Mount Kazbek Climb (South Route — 9 Days)
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Operational Bases */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-white mb-4">
                Operational Bases
              </div>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2">
                  <img src="/img/geotag.svg" alt="Location" className="w-3.5 h-3.5 object-contain mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Headquarters:</span>
                    <div className="text-slate-400">{settings.address || 'Gorkogo St., 74, Nalchik, KBR, Russian Federation'}</div>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Mountain className="w-3.5 h-3.5 text-[#FF6A00] mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div>
                    <span className="font-semibold text-white">High Base Camp:</span>
                    <div className="text-slate-400">Barrels-Garabashi 3,800 m, Mt. Elbrus</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4: Communications */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-white mb-4">
                Direct Inquiries
              </div>
              <ul className="space-y-3 text-xs">
                <li>
                  <a
                    href={`tel:${settings.phone || '+79280828413'}`}
                    className="flex items-center gap-2 hover:text-[#FF6A00] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
                    <span className="font-mono text-[11px]">{settings.phone || '+7 (928) 082-84-13'}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${settings.email || 'info@kavkazskitur.com'}`}
                    className="flex items-center gap-2 hover:text-[#FF6A00] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                    <span className="font-mono text-[11px]">{settings.email || 'info@kavkazskitur.com'}</span>
                  </a>
                </li>
                <li className="flex items-center gap-3 pt-1">
                  <a
                    href={settings.whatsappLink || 'https://wa.me/79280828413'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-lg shadow-green-950/30 transition-colors min-h-[44px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={settings.telegramChannel || 'https://t.me/kavkazskitur'}
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

          {/* Sub-footer Copyright */}
          <div className="border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              &copy; 2026 KavKazSkiTur (20 years of expeditions • Nalchik). All rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4 text-center sm:text-right">
              <span>UIAA &amp; FAR Alpine Safety Standards</span>
              <span className="hidden sm:inline">&bull;</span>
              <span>FSB Border Clearance Reg.</span>
              <span className="hidden sm:inline">&bull;</span>
              <a href="/privacy" className="hover:text-[#FF6A00] underline transition-colors">
                Privacy Policy (152-FZ)
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

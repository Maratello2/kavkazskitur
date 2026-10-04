'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  FileCheck2,
  Activity,
  Coins,
  CheckCircle2,
  Compass,
  Radio,
  Sparkles,
  Lock,
  ArrowRight,
  Globe2,
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';

type Currency = 'EUR' | 'USD' | 'RUB';

interface PriceBenchmark {
  tour: string;
  days: string;
  eur: number;
  usd: number;
  rub: number;
}

const BENCHMARKS: PriceBenchmark[] = [
  {
    tour: 'Elbrus South Classic (Standard 8-Day)',
    days: '8 DAYS',
    eur: 1850,
    usd: 2000,
    rub: 185000,
  },
  {
    tour: 'Elbrus Wild North (Expedition 9-Day)',
    days: '9 DAYS',
    eur: 2150,
    usd: 2350,
    rub: 215000,
  },
  {
    tour: 'Kazbek + Elbrus Traverse (12-Day Double)',
    days: '12 DAYS',
    eur: 2950,
    usd: 3200,
    rub: 295000,
  },
];

export default function InternationalTrustBento() {
  const [currency, setCurrency] = useState<Currency>('EUR');

  const formatPrice = (benchmark: PriceBenchmark) => {
    switch (currency) {
      case 'EUR':
        return `€${benchmark.eur.toLocaleString('de-DE')}`;
      case 'USD':
        return `$${benchmark.usd.toLocaleString('en-US')}`;
      case 'RUB':
        return `${benchmark.rub.toLocaleString('ru-RU')} ₽`;
    }
  };

  return (
    <section
      id="international-trust"
      className="py-24 sm:py-32 bg-[#060B12] text-white relative overflow-hidden"
    >
      {/* Subtle ambient warm alpine glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full w-[320px] sm:w-[600px] h-[350px] bg-orange-500/[0.03] rounded-full blur-[100px] pointer-events-none overflow-hidden" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold text-[#FF6A00] mb-3">
                <Globe2 className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
                International Alpinist Assurances • 2026 Protocol
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Global Standards &amp; Bureaucracy-Free Access
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed font-sans">
              Climbing in the Caucasus as a foreign citizen requires specialized government clearances, border permits, and certified high-altitude emergency safety. We manage 100% of the administrative workflow directly from Nalchik.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid: 4 Core International Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* =========================================================================
              CELL 1: Official FSB Border Permits (Span 7 on LG)
          ========================================================================= */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={30}>
              <div className="h-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-8 hover:border-[#FF6A00]/40 transition-colors flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#FF6A00]">
                      <ShieldCheck className="w-5 h-5 text-[#FF6A00]" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF6A00] font-semibold">
                      FSB CLEARANCE 100% HANDLED
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                    Official FSB Border Zone Permits
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-sans">
                    The Greater Caucasus crest forms the Russian state frontier with Georgia. Ascents in Kabardino-Balkaria (KBR), North Ossetia-Alania, and the technical Bezengi wall require formal security clearances from the Federal Security Service (FSB).
                  </p>

                  {/* Clean 3-station route strip (No nested card boxes) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] border-t border-b border-white/[0.08] py-4 mb-6">
                    <div className="sm:pr-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF6A00] block mb-1">
                        KBR Frontline
                      </span>
                      <p className="text-xs font-semibold text-white">Elbrus &amp; Terskol Gorges</p>
                      <span className="text-[11px] text-slate-400 font-sans">Pre-issued entry passes</span>
                    </div>

                    <div className="sm:px-4 pt-3 sm:pt-0">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF6A00] block mb-1">
                        Bezengi Wall
                      </span>
                      <p className="text-xs font-semibold text-white">5,000 m Technical Valleys</p>
                      <span className="text-[11px] text-slate-400 font-sans">Strict border zone clearance</span>
                    </div>

                    <div className="sm:pl-4 pt-3 sm:pt-0">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF6A00] block mb-1">
                        RSO-Alania
                      </span>
                      <p className="text-xs font-semibold text-white">Mount Kazbek Approaches</p>
                      <span className="text-[11px] text-slate-400 font-sans">Direct Karmadon pass</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 font-sans">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={1.5} />
                    <span>Foreign nationals: 30–45 day quota filing included</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 shrink-0">Nalchik Registry HQ</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* =========================================================================
              CELL 2: Russian Visa Support (Span 5 on LG)
          ========================================================================= */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={60}>
              <div className="h-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-8 hover:border-[#FF6A00]/40 transition-colors flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#FF6A00]">
                      <FileCheck2 className="w-5 h-5 text-[#FF6A00]" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF6A00] font-semibold">
                      24H ISSUANCE
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                    Russian Visa Support
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-sans">
                    Every confirmed participant receives an official Tourist Voucher and Confirmation of Acceptance with an accredited Ministry of Foreign Affairs (MFA) reference number.
                  </p>

                  <ul className="space-y-3 mb-6 font-sans">
                    <li className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" strokeWidth={1.5} />
                      <span>Electronic tourist voucher delivered in PDF within 24 hours of deposit</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" strokeWidth={1.5} />
                      <span>Valid for all Russian embassies, consulates &amp; VFS centers globally</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" strokeWidth={1.5} />
                      <span>Mandatory regional migration registration at Nalchik hotel included</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px] text-[#FF6A00]">Accredited Russian DMC</span>
                  <span className="text-slate-500 font-sans">MFA Registered</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* =========================================================================
              CELL 3: Safety & High-Altitude Protocol (Span 6 on LG)
          ========================================================================= */}
          <div className="lg:col-span-6">
            <ScrollReveal delay={90}>
              <div className="h-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-8 hover:border-[#FF6A00]/40 transition-colors flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#FF6A00]">
                      <Activity className="w-5 h-5 text-[#FF6A00]" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400 font-semibold">
                      RMGA / FAR CERTIFIED
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                    Safety &amp; High-Altitude Protocol
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-sans">
                    Our safety infrastructure mirrors Alpine Chamonix standards, designed for extreme high-altitude weather shifts above 5,000 meters.
                  </p>

                  {/* Open 2x2 Telemetry Checklist (No nested card boxes) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <span className="text-xs font-bold text-white block">Summit O2 Backup</span>
                        <span className="text-[11px] text-slate-400 font-sans">POISK cylinders &amp; masks on push</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Activity className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <span className="text-xs font-bold text-white block">Pulse Oximetry</span>
                        <span className="text-[11px] text-slate-400 font-sans">Twice-daily SpO2 &amp; pulse monitoring</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Radio className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <span className="text-xs font-bold text-white block">Garmin inReach SOS</span>
                        <span className="text-[11px] text-slate-400 font-sans">24/7 Iridium beacon linked to MCHS</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Compass className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <span className="text-xs font-bold text-white block">1:3 Guide Ratio</span>
                        <span className="text-[11px] text-slate-400 font-sans">Strict safety cap on summit night</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-400 font-sans">
                  <span>Emergency VHF to Terskol Rescue post</span>
                  <span className="font-mono text-[11px] text-emerald-400 shrink-0">98% Summit Record</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* =========================================================================
              CELL 4: Transparent All-Inclusive Pricing (Span 6 on LG)
          ========================================================================= */}
          <div className="lg:col-span-6">
            <ScrollReveal delay={120}>
              <div className="h-full bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-8 hover:border-[#FF6A00]/40 transition-colors flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#FF6A00]">
                      <Coins className="w-5 h-5 text-[#FF6A00]" strokeWidth={1.5} />
                    </div>

                    {/* Interactive Currency Switcher */}
                    <div className="flex items-center p-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                      {(['EUR', 'USD', 'RUB'] as Currency[]).map((cur) => (
                        <button
                          key={cur}
                          type="button"
                          onClick={() => setCurrency(cur)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer min-h-[32px] ${
                            currency === cur
                              ? 'bg-[#FF6A00] text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                    Transparent Pricing &amp; Multi-Currency
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-5 font-sans">
                    Fixed all-inclusive tariffs with zero hidden surcharges. Private Barrels refuge, 3 meals/day from chef, 4x4 airport transfers, and state park passes are completely covered.
                  </p>

                  {/* Benchmark List: Hairline Unified Table (No nested card boxes) */}
                  <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06] mb-6">
                    {BENCHMARKS.map((bm) => (
                      <div
                        key={bm.tour}
                        className="flex items-center justify-between gap-3 py-3 hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="min-w-0 pr-1">
                          <div className="text-xs font-semibold text-white truncate sm:whitespace-normal">{bm.tour}</div>
                          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mt-0.5">
                            {bm.days} • Full Board &amp; Permits
                          </span>
                        </div>
                        <span className="font-mono text-sm font-bold text-[#FF6A00] shrink-0">
                          {formatPrice(bm)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-400 font-sans">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={1.5} />
                    <span>SWIFT, IBAN, Foreign Cards &amp; Crypto</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">No Hidden Fees</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}

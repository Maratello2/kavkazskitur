'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, Clock, ChevronDown, ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
import { EXPEDITIONS, type Expedition } from '@/src/data/tours';
import ScrollReveal from './ScrollReveal';
import Card3DTilt from '@/components/motion/Card3DTilt';

const FILTER_TABS = [
  { key: 'all', label: 'All Routes' },
  { key: 'elbrus-south', label: 'South Classic' },
  { key: 'elbrus-north', label: 'North Wild' },
  { key: 'skitour', label: 'Ski Touring' },
  { key: 'trekking', label: 'Irikchat Trek' },
  { key: 'kazbek', label: 'Mount Kazbek' },
] as const;

function waBookingLink(tourTitle: string, priceRub: number) {
  const text = `Expedition Inquiry\nTour: ${tourTitle}\nDates: Season 2026\nGroup: 1 climber\nPrice: ${priceRub.toLocaleString('ru-RU')} RUB\n\nHello! I would like to check availability and book this expedition.`;
  return `https://wa.me/79280828413?text=${encodeURIComponent(text)}`;
}

function difficultyClass(difficulty: Expedition['difficulty']) {
  switch (difficulty) {
    case 'Moderate':
      return 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40';
    case 'Demanding':
      return 'bg-sky-950/90 text-sky-300 border-sky-500/40';
    case 'Extreme':
      return 'bg-blue-950/90 text-blue-300 border-blue-500/50';
    default:
      return 'bg-slate-900/90 text-slate-300 border-slate-500/40';
  }
}

export default function ExpeditionsShowcase() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedItinerary, setExpandedItinerary] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return EXPEDITIONS;
    return EXPEDITIONS.filter((e) => e.category === activeFilter);
  }, [activeFilter]);

  const toggleItinerary = (id: string) => {
    setExpandedItinerary((current) => (current === id ? null : id));
  };

  return (
    <section className="pt-10 pb-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold text-[#FF6A00] mb-3">
              <Mountain className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
              Caucasus Climbing &amp; Ski Touring • 2026 Season
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Featured 2026 Expeditions
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed font-sans">
            All expeditions include private high-camp accommodation at our Barrels refuge (3,800 m), certified UIAGM/RMGA lead guides, cook service, and mandatory FSB border clearance.
          </p>
        </div>
      </ScrollReveal>

      {/* Fluid Filter Tabs with Fast Spring Layout */}
      <ScrollReveal delay={50}>
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 mb-8 sm:mb-10 pb-3 border-b border-white/[0.08] overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`relative shrink-0 px-4 py-2 rounded-xl min-h-[40px] flex items-center text-xs font-semibold tracking-wide transition-colors cursor-pointer select-none ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeExpeditionTab"
                    className="absolute inset-0 rounded-xl bg-[#FF6A00] shadow-md shadow-orange-950/40"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Zero-Lag 3D Bento Grid: Hardware-Accelerated 3D Tilt with Floating Depth */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {filtered.map((exp, idx) => {
          const isItineraryOpen = expandedItinerary === exp.id;
          const cleanAltitude = exp.altitude.split('/')[0].trim();
          const cleanDuration = exp.duration.split('/')[0].trim().toUpperCase();

          return (
            <ScrollReveal key={exp.id} delay={idx * 40}>
              <Card3DTilt depth={8} className="h-full">
                <div className="group relative h-full flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#070F1C]/90 transition-colors duration-300 hover:border-[#FF6A00]/50 overflow-hidden [transform-style:preserve-3d]">
                  <div>
                    {/* Visual Image Container with Zoom and Explicit Aspect Ratio */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050A10] [transform-style:preserve-3d]">
                      <img
                        src={exp.image}
                        alt={exp.title}
                        width={800}
                        height={500}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      {/* Multi-layer Cinematic Vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070F1C] via-transparent to-black/40 pointer-events-none" />

                      {/* Top Badges: Clean, Non-Crowded Telemetry */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 [transform-style:preserve-3d]">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${difficultyClass(
                              exp.difficulty
                            )}`}
                          >
                            {exp.difficulty}
                          </span>

                          {exp.badge && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#FF6A00]/25 text-[10px] uppercase tracking-wider font-bold text-[#FF6A00] border border-[#FF6A00]/40">
                              {exp.badge}
                            </span>
                          )}
                        </div>

                        {/* Clean Altitude Watermark (Solid Alpha without backdrop blur for 60 FPS GPU rasterization) */}
                        <div
                          style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#060D17]/95 border border-white/10 text-white font-mono text-[11px] font-bold"
                        >
                          <Mountain className="w-3 h-3 text-[#FF6A00]" strokeWidth={1.5} />
                          <span>{cleanAltitude}</span>
                        </div>
                      </div>

                      {/* Single Integrated Telemetry Line on Photo (Duration + Summit) */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-300 z-10">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-200">
                          <Clock className="w-3 h-3 text-[#FF6A00]" strokeWidth={1.5} />
                          {cleanDuration}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded">
                          98% SUMMIT
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1 [transform-style:preserve-3d]">
                      <div className="flex items-center justify-between gap-3 text-xs text-slate-400 mb-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] font-semibold text-[#FF6A00]">
                          {exp.categoryLabel}
                        </span>
                        <span className="text-slate-400 text-[11px] font-mono">
                          {exp.season.split('2026')[0].trim()}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        style={{ transform: 'translateZ(14px)', transformStyle: 'preserve-3d' }}
                        className="text-lg font-bold text-white tracking-tight mb-3 leading-snug"
                      >
                        <Link
                          href={`/tours/${exp.slug}`}
                          className="hover:text-[#FF6A00] transition-colors"
                        >
                          {exp.title}
                        </Link>
                      </h3>

                      {/* Key Highlights */}
                      <div className="space-y-1.5 mb-5 font-sans">
                        {exp.highlights.slice(0, 3).map((hl) => (
                          <div
                            key={hl}
                            className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] mt-1.5 shrink-0" />
                            <span className="line-clamp-2">{hl}</span>
                          </div>
                        ))}
                      </div>

                      {/* Expandable Itinerary Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleItinerary(exp.id)}
                        className="w-full flex items-center justify-between py-2 border-t border-b border-white/[0.06] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer mb-3 select-none"
                      >
                        <span>
                          {isItineraryOpen
                            ? 'Hide Itinerary'
                            : `View Daily Route (${exp.itinerarySummary.length} Days)`}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            isItineraryOpen ? 'rotate-180 text-[#FF6A00]' : ''
                          }`}
                          strokeWidth={1.5}
                        />
                      </button>

                      {/* Fast Hardware-Composite Itinerary Drawer */}
                      <AnimatePresence initial={false}>
                        {isItineraryOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden mb-4 transform-gpu"
                          >
                            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5 font-sans">
                              <div className="font-mono text-[9px] uppercase tracking-[0.22em] font-semibold text-[#FF6A00] mb-1">
                                Route Progression
                              </div>
                              {exp.itinerarySummary.map((item) => (
                                <div
                                  key={item.day}
                                  className="flex items-start justify-between gap-2 text-xs border-b border-white/[0.04] pb-1 last:border-b-0 last:pb-0"
                                >
                                  <div>
                                    <span className="font-mono font-bold text-[#FF6A00] mr-1.5">{item.day}:</span>
                                    <span className="text-slate-300 text-[11px]">{item.title}</span>
                                  </div>
                                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                                    {item.alt}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Card Pricing & Booking Action */}
                  <div className="p-5 sm:p-6 pt-0 mt-auto [transform-style:preserve-3d]">
                    <div
                      style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
                      className="pt-4 border-t border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                    >
                      <div className="flex items-baseline justify-between sm:block">
                        <div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400 font-semibold mb-0.5">
                            All-Inclusive From
                          </div>
                          <div className="text-base sm:text-lg font-black font-mono text-white tracking-tight">
                            ${exp.priceUsd} / €{Math.round(exp.priceUsd * 0.92)}
                          </div>
                        </div>
                        <div className="text-[11px] font-mono text-[#FF6A00] font-semibold sm:mt-0.5">
                          ≈ {exp.priceRub.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>

                      {/* Pricing & Booking Buttons: full-width grid on mobile, min-h-[44px] Apple HIG */}
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                        <Link
                          href={`/tours/${exp.slug}`}
                          className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1 bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-[background-color,transform] border border-white/[0.08]"
                        >
                          <span>Details</span>
                        </Link>

                        <a
                          href={waBookingLink(exp.title, exp.priceRub)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-[#FF6A00] hover:bg-[#E05D00] active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-[background-color,transform] shadow-lg shadow-orange-950/40 border border-orange-400/30 group/btn"
                        >
                          <span>Inquire</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white stroke-[2.5] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Card3DTilt>
            </ScrollReveal>
          );
        })}
      </div>

      <ScrollReveal delay={100}>
        <div className="mt-14 text-center">
          <Link
            href="/expeditions"
            className="inline-flex items-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.08] active:scale-98 text-white font-bold text-xs uppercase tracking-[0.18em] px-8 py-4 rounded-xl border border-white/[0.08] hover:border-[#FF6A00]/40 hover:shadow-[0_0_25px_rgba(255,106,0,0.12)] transition-all shadow-xl"
          >
            <span>View All Expeditions &amp; Catalog</span>
            <ArrowUpRight className="w-4 h-4 text-[#FF6A00]" />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

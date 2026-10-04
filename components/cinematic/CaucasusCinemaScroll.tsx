'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  ArrowRight, 
  MessageCircle, 
  Activity,
  Wind,
  Thermometer
} from 'lucide-react';

interface CaucasusRealm {
  id: string;
  realmNum: string;
  shortName: string;
  title: string;
  badge: string;
  tagline: string;
  altitudeMeters: number;
  altitudeStr: string;
  po2: string;
  tempRating: string;
  coordinates: string;
  keyFeature: string;
  shortFeature: string;
  imageSrc: string;
  imageMobileSrc: string;
  altText: string;
}

const CAUCASUS_REALMS: CaucasusRealm[] = [
  {
    id: 'realm-elbrus',
    realmNum: '01',
    shortName: 'Mt. Elbrus',
    title: 'Mount Elbrus Supreme Apex',
    badge: 'ROOF OF EUROPE • 5,642 M',
    tagline: 'The Supreme Summit of the European Continent & Seven Summits Crown',
    altitudeMeters: 5642,
    altitudeStr: '5,642 M',
    po2: 'pO2 50%',
    tempRating: '-15°C',
    coordinates: '43°21\'18" N, 42°26\'21" E',
    keyFeature: 'Seven Summits • Permanent Glaciers • 360° Continental Horizon',
    shortFeature: 'Seven Summits Apex',
    imageSrc: '/hero/summit_apex_5642.webp',
    imageMobileSrc: '/hero/summit_apex_5642_mobile.webp',
    altText: 'Mount Elbrus Supreme Apex 5,642m panoramic summit vista',
  },
  {
    id: 'realm-garabashi',
    realmNum: '02',
    shortName: 'Gara-Bashi',
    title: 'Gara-Bashi Snowfields',
    badge: 'GLACIER KINGDOM • 3,800 M',
    tagline: 'Boundless High Glacier Snowfields Positioned Above Cloud Inversions',
    altitudeMeters: 3800,
    altitudeStr: '3,800 M',
    po2: 'pO2 64%',
    tempRating: '-5°C',
    coordinates: '43°18\'40" N, 42°27\'32" E',
    keyFeature: 'Heated Barrels Base • Acclimatization • Starlight Nights',
    shortFeature: 'Heated Glacier Base',
    imageSrc: '/hero/stage_2026_plateau.webp',
    imageMobileSrc: '/hero/stage_2026_plateau_mobile.webp',
    altText: 'Gara-Bashi high glacier station at 3,800m above cloud inversions',
  },
  {
    id: 'realm-dombai',
    realmNum: '03',
    shortName: 'Dombai Horn',
    title: 'Dombai Alpine Gorges',
    badge: 'ANCIENT BASALT CRAGS • 3,040 M',
    tagline: 'Towering Granite Horns, Alpine Meadows & Roaring Glacial Rivers',
    altitudeMeters: 3040,
    altitudeStr: '3,040 M',
    po2: 'pO2 72%',
    tempRating: '+6°C',
    coordinates: '43°17\'24" N, 41°37\'48" E',
    keyFeature: 'Wild Wilderness • Pure Glacial Water • Pristine Pine Forests',
    shortFeature: 'Wild Granite Gorges',
    imageSrc: '/layers/dombai_alpine.webp',
    imageMobileSrc: '/layers/dombai_alpine_mobile.webp',
    altText: 'Dombai alpine peaks rising majestically above mountain meadows',
  },
  {
    id: 'realm-saddle',
    realmNum: '04',
    shortName: 'High Saddle',
    title: 'The High Saddle Glacier',
    badge: 'SUMMIT ASSAULT COL • 5,300 M',
    tagline: 'Serene Glacial Amphitheater Nestled Between Twin Volcanic Domes',
    altitudeMeters: 5300,
    altitudeStr: '5,300 M',
    po2: 'pO2 53%',
    tempRating: '-12°C',
    coordinates: '43°20\'55" N, 42°26\'45" E',
    keyFeature: 'Summit Headwall • Sub-Zero Windbreak • Fixed Safety Lines',
    shortFeature: 'Summit Assault Col',
    imageSrc: '/hero/stage_2026_saddle.webp',
    imageMobileSrc: '/hero/stage_2026_saddle_mobile.webp',
    altText: 'The High Saddle Glacier at 5,300m between twin Elbrus volcanic peaks',
  },
];

function AltitudeCounter({ target }: { target: number }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef(target);

  useEffect(() => {
    const start = currentRef.current;
    if (start === target) return;

    const duration = 380;
    const startTime = performance.now();

    const updateAltitude = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * ease);
      currentRef.current = current;
      if (spanRef.current) {
        spanRef.current.textContent = `${current.toLocaleString('en-US')} M`;
      }
      if (progress < 1) {
        requestAnimationFrame(updateAltitude);
      }
    };

    const animId = requestAnimationFrame(updateAltitude);
    return () => cancelAnimationFrame(animId);
  }, [target]);

  return (
    <span ref={spanRef} className="font-black text-sky-400">
      {target.toLocaleString('en-US')} M
    </span>
  );
}

export default function CaucasusCinemaScroll() {
  const [activeRealmIdx, setActiveRealmIdx] = useState(0);

  // Swipe gesture tracking for mobile touch
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentRealm = CAUCASUS_REALMS[activeRealmIdx];

  const prevRealm = useCallback(() => {
    setActiveRealmIdx((prev) => (prev > 0 ? prev - 1 : CAUCASUS_REALMS.length - 1));
  }, []);

  const nextRealm = useCallback(() => {
    setActiveRealmIdx((prev) => (prev < CAUCASUS_REALMS.length - 1 ? prev + 1 : 0));
  }, []);

  const handleSelectRealm = useCallback((index: number) => {
    setActiveRealmIdx(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextRealm();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevRealm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextRealm, prevRealm]);

  // Mobile Touch Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        nextRealm();
      } else {
        prevRealm();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // WhatsApp concierge prefilled link
  const whatsAppUrl = `https://wa.me/79280828413?text=${encodeURIComponent(
    `Hello KavKazSkiTur! I would like to inquire about joining a 2026 Greater Caucasus Expedition, specifically regarding ${currentRealm.title} (${currentRealm.altitudeStr}). Please share available itinerary dates, guide credentials, and booking details.`
  )}`;

  return (
    <section 
      className="relative w-full max-w-full bg-[#060B12] text-white overflow-hidden flex flex-col justify-between min-h-[100dvh] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* =========================================================================
          LAYER 0: 60 FPS GPU-COMPOSITED 2.5D SPATIAL MOUNTAIN PANORAMA
      ========================================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#060B12]">
        
        {/* Deep Horizon Sky Base */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#060E1A] via-[#091526] to-[#060B12]" />

        {/* 4 Active Mountain Realm Vistas (Pure CSS Hardware Compositor Scale & Crossfade) */}
        {CAUCASUS_REALMS.map((realm, idx) => {
          const isActive = idx === activeRealmIdx;
          return (
            <div
              key={realm.id}
              className={`absolute inset-0 w-full h-full transition-[opacity,transform] duration-700 ease-out will-change-[opacity,transform] ${
                isActive 
                  ? 'opacity-100 scale-100 z-10' 
                  : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
              style={{
                transformOrigin: '50% 40%',
              }}
            >
              <picture className="w-full h-full">
                <source media="(max-width: 768px)" srcSet={realm.imageMobileSrc} />
                <img
                  src={realm.imageSrc}
                  alt={realm.altText}
                  className="w-full h-full object-cover object-[50%_35%] select-none pointer-events-none"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              </picture>
            </div>
          );
        })}

        {/* Cinematic Vignettes: Natural High-Dynamic-Range Contrast (Zero GPU Overdraw) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B12] via-[#060B12]/50 to-transparent pointer-events-none z-[14]" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#060B12]/90 via-[#060B12]/40 to-transparent pointer-events-none z-[14]" />
      </div>

      {/* =========================================================================
          TOP MISSION CONTROL HUD (PRECISION ALPINE EXPEDITION TELEMETRY)
      ========================================================================= */}
      <div className="relative z-20 w-full pt-24 sm:pt-28 lg:pt-24 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto flex flex-col pointer-events-auto">
        <div className="w-full flex items-center justify-between gap-2.5 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-2xl bg-[#070F1C]/92 border border-white/[0.08] shadow-2xl backdrop-blur-none">
          
          {/* Coordinates & Location Tag */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-mono text-[9px] xs:text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.2em] text-slate-300 uppercase font-semibold truncate">
              <span className="text-sky-400 font-bold">{currentRealm.coordinates}</span>
              <span className="hidden md:inline text-slate-400"> • GREATER CAUCASUS</span>
            </span>
          </div>

          {/* Live Telemetry Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Live Altitude */}
            <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] font-mono text-[10px] sm:text-[11px]">
              <Activity className="w-3 h-3 text-sky-400 shrink-0" strokeWidth={1.5} />
              <span className="text-slate-400 text-[9px] sm:text-[10px] uppercase">ALT:</span>
              <AltitudeCounter target={currentRealm.altitudeMeters} />
            </div>

            {/* Oxygen Partial Pressure */}
            <div className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] font-mono text-[10px] sm:text-[11px]">
              <Wind className="w-3 h-3 text-emerald-400 shrink-0" strokeWidth={1.5} />
              <span className="text-emerald-400 font-bold">{currentRealm.po2}</span>
            </div>

            {/* Temperature */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] font-mono text-[10px] sm:text-[11px]">
              <Thermometer className="w-3 h-3 text-amber-400 shrink-0" strokeWidth={1.5} />
              <span className="text-amber-400 font-bold">{currentRealm.tempRating}</span>
            </div>

            {/* Quick Realm Indicator Dots */}
            <div className="flex items-center gap-1 pl-1">
              {CAUCASUS_REALMS.map((realm, idx) => (
                <button
                  key={realm.id}
                  onClick={() => handleSelectRealm(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center ${
                    idx === activeRealmIdx 
                      ? 'w-4 sm:w-5 h-1.5 bg-[#FF6A00] shadow-sm shadow-orange-500/50' 
                      : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Switch to ${realm.title}`}
                  title={`${realm.title} (${realm.altitudeStr})`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          CENTER HERO: WELCOME TO THE CAUCASUS (MONUMENTAL ALPINE EDITORIAL)
      ========================================================================= */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 my-auto py-4 sm:py-6 max-w-4xl mx-auto w-full pointer-events-auto">
        
        {/* Top Luxury Horizon Label (Unboxed, Sleek Tracking) */}
        <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.22em] text-[#FF6A00] font-semibold uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse shrink-0" />
          <span>The Greater Caucasus • 2026 Expeditions</span>
        </div>

        {/* Monumental Editorial Headline (Razor-Sharp, Clean & High-Contrast) */}
        <h1 className="font-serif tracking-[0.05em] sm:tracking-[0.08em] text-white text-3xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] uppercase leading-[1.04] font-black select-none text-center drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
          WELCOME TO <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent">
            THE CAUCASUS
          </span>
        </h1>

        {/* Dynamic Realm Highlight Subtitle */}
        <div className="mt-3 sm:mt-4 max-w-2xl mx-auto text-center px-2">
          <p className="text-xs sm:text-sm md:text-base text-slate-200 font-light leading-relaxed drop-shadow-md max-w-xl mx-auto">
            <span className="font-mono text-[11px] sm:text-xs text-sky-300 font-semibold uppercase tracking-wider mr-1.5">
              {currentRealm.badge} &bull;
            </span>
            {currentRealm.tagline}. Europe&apos;s wildest glaciated frontier, guided by certified mountaineers.
          </p>
        </div>

        {/* Luxury Action CTA Group */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6">
          <a
            href="#expeditions"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] active:scale-95 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-orange-950/50 border border-orange-400/40 cursor-pointer min-h-[48px]"
          >
            <span>EXPLORE EXPEDITIONS</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl border border-white/15 hover:border-sky-400/40 cursor-pointer min-h-[48px]"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WHATSAPP CONCIERGE</span>
          </a>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM REALM SELECTOR DOCK (ERGONOMIC, NON-STRETCHING, SOLID OBSIDIAN)
      ========================================================================= */}
      <div 
        className="relative z-20 w-full px-3 sm:px-6 max-w-5xl mx-auto flex flex-col items-center pointer-events-auto pb-4 sm:pb-5"
        style={{
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className="w-full bg-[#070F1C]/94 border border-white/[0.12] rounded-2xl p-2 sm:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.92)]">
          
          {/* Desktop & Tablet Realm Selector Tabs (4 Clean Columns) */}
          <div className="hidden sm:grid grid-cols-4 gap-2 mb-2">
            {CAUCASUS_REALMS.map((realm, idx) => {
              const isActive = idx === activeRealmIdx;
              return (
                <button
                  key={realm.id}
                  onClick={() => handleSelectRealm(idx)}
                  className={`min-w-0 flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 cursor-pointer min-h-[44px] ${
                    isActive 
                      ? 'bg-[#FF6A00] text-white shadow-md shadow-orange-500/40 font-bold' 
                      : 'bg-black/30 hover:bg-white/[0.06] text-slate-300 hover:text-white border border-white/[0.05]'
                  }`}
                  title={`${realm.title} (${realm.altitudeStr})`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`font-mono text-[10px] font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {realm.realmNum}
                    </span>
                    <span className="text-xs font-bold truncate">
                      {realm.shortName}
                    </span>
                  </div>
                  <span className={`font-mono text-[10px] font-black shrink-0 ${isActive ? 'text-white' : 'text-sky-400'}`}>
                    {realm.altitudeStr}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Ergonomic Segmented Control (Single Row, 44px min tap target) */}
          <div className="grid sm:hidden grid-cols-4 gap-1.5 mb-2">
            {CAUCASUS_REALMS.map((realm, idx) => {
              const isActive = idx === activeRealmIdx;
              return (
                <button
                  key={realm.id}
                  onClick={() => handleSelectRealm(idx)}
                  className={`min-h-[44px] px-1 py-1.5 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FF6A00] text-white shadow-sm'
                      : 'bg-black/40 text-slate-300 border border-white/[0.06]'
                  }`}
                >
                  <span className="font-mono text-[9px] font-bold opacity-80">{realm.realmNum}</span>
                  <span className="text-[11px] font-bold truncate w-full">{realm.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Active Realm Details & Quick Prev/Next Navigation Controls */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/[0.06] px-1">
            {/* Left: Active Realm Info */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-mono text-[11px] font-bold text-[#FF6A00] uppercase shrink-0">
                REALM {currentRealm.realmNum}/04
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[11px] sm:text-xs font-medium text-slate-300 truncate">
                <span className="sm:hidden">{currentRealm.shortFeature} ({currentRealm.altitudeStr})</span>
                <span className="hidden sm:inline">{currentRealm.keyFeature}</span>
              </span>
            </div>

            {/* Right: Prev/Next Arrow Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={prevRealm}
                className="min-w-[40px] min-h-[40px] w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/15 text-white transition-all active:scale-95 cursor-pointer"
                aria-label="Previous Caucasus Realm"
                title="Previous Caucasus Realm"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2} />
              </button>
              <button
                onClick={nextRealm}
                className="min-w-[40px] min-h-[40px] w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/15 text-white transition-all active:scale-95 cursor-pointer"
                aria-label="Next Caucasus Realm"
                title="Next Caucasus Realm"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

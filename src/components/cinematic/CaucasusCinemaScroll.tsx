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
  image480Src?: string;
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
    image480Src: '/hero/summit_apex_5642_480.webp',
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

interface CaucasusCinemaScrollProps {
  settings?: {
    heroTitle?: string;
    heroSubtitle?: string;
    promoBadgeText?: string;
    whatsapp?: string;
    whatsappLink?: string;
    [key: string]: any;
  };
}

export default function CaucasusCinemaScroll({ settings }: CaucasusCinemaScrollProps = {}) {
  const [activeRealmIdx, setActiveRealmIdx] = useState(0);
  const [renderedRealms, setRenderedRealms] = useState<number[]>([0]);

  // Swipe gesture tracking for mobile touch
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const realms: CaucasusRealm[] = (settings?.heroRealms && Array.isArray(settings.heroRealms) && settings.heroRealms.length > 0)
    ? settings.heroRealms
    : CAUCASUS_REALMS;

  const currentRealm = realms[activeRealmIdx] || realms[0] || CAUCASUS_REALMS[0];

  const customTitle = settings?.heroTitle?.trim();
  let titleLine1 = 'WELCOME TO';
  let titleLine2 = 'THE CAUCASUS';

  if (customTitle) {
    if (customTitle.includes('\n')) {
      const parts = customTitle.split('\n').map(p => p.trim()).filter(Boolean);
      titleLine1 = parts[0] || '';
      titleLine2 = parts.slice(1).join(' ') || '';
    } else if (customTitle.toUpperCase().includes('WELCOME TO')) {
      titleLine1 = 'WELCOME TO';
      titleLine2 = customTitle.replace(/welcome\s+to\s*/i, '').trim() || 'THE CAUCASUS';
    } else {
      const words = customTitle.split(' ');
      if (words.length > 2) {
        const mid = Math.ceil(words.length / 2);
        titleLine1 = words.slice(0, mid).join(' ');
        titleLine2 = words.slice(mid).join(' ');
      } else if (words.length === 2) {
        titleLine1 = words[0];
        titleLine2 = words[1];
      } else {
        titleLine1 = customTitle;
        titleLine2 = '';
      }
    }
  }

  // Lazily hydrate non-active realms only after initial render is idle
  useEffect(() => {
    const timer = setTimeout(() => {
      setRenderedRealms(realms.map((_, i) => i));
    }, 2500);
    return () => clearTimeout(timer);
  }, [realms.length]);

  const prevRealm = useCallback(() => {
    setActiveRealmIdx((prev) => {
      const target = prev > 0 ? prev - 1 : realms.length - 1;
      setRenderedRealms((r) => (r.includes(target) ? r : [...r, target]));
      return target;
    });
  }, [realms.length]);

  const nextRealm = useCallback(() => {
    setActiveRealmIdx((prev) => {
      const target = prev < realms.length - 1 ? prev + 1 : 0;
      setRenderedRealms((r) => (r.includes(target) ? r : [...r, target]));
      return target;
    });
  }, [realms.length]);

  const handleSelectRealm = useCallback((index: number) => {
    setRenderedRealms((r) => (r.includes(index) ? r : [...r, index]));
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
  const customPhone = (settings?.whatsapp || '+7 (928) 082-84-13').replace(/\D/g, '');
  const whatsAppUrl = settings?.whatsappLink || `https://wa.me/${customPhone}?text=${encodeURIComponent(
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

        {/* Active Mountain Realm Vistas (Pure CSS Hardware Compositor Scale & Crossfade) */}
        {realms.map((realm, idx) => {
          const isActive = idx === activeRealmIdx;
          const shouldRender = renderedRealms.includes(idx);
          if (!shouldRender) return null;

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
                {realm.image480Src && (
                  <source media="(max-width: 480px)" srcSet={realm.image480Src} width={480} height={854} />
                )}
                <source media="(max-width: 768px)" srcSet={realm.imageMobileSrc} width={640} height={1138} />
                <img
                  src={realm.imageSrc}
                  alt={realm.altText}
                  width={1920}
                  height={1080}
                  className="w-full h-full object-cover object-[50%_35%] select-none pointer-events-none"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  fetchPriority={idx === 0 ? 'high' : 'low'}
                  decoding={idx === 0 ? 'sync' : 'async'}
                  draggable={false}
                />
              </picture>
            </div>
          );
        })}

        {/* Cinematic Vignettes: Natural High-Dynamic-Range Contrast (Zero GPU Overdraw) */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none z-[13]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B12] via-[#060B12]/60 to-[#060B12]/30 pointer-events-none z-[14]" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#060B12]/90 via-[#060B12]/40 to-transparent pointer-events-none z-[14]" />
      </div>

      {/* =========================================================================
          TOP MISSION CONTROL HUD (PRECISION ALPINE EXPEDITION TELEMETRY)
      ========================================================================= */}
      <div className="relative z-20 w-full pt-28 sm:pt-32 lg:pt-32 scroll-mt-32 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto flex flex-col pointer-events-auto">
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
            <div className="flex items-center gap-0.5 pl-1">
              {realms.map((realm, idx) => (
                <button
                  key={realm.id}
                  type="button"
                  onClick={() => handleSelectRealm(idx)}
                  className="p-1 sm:p-1.5 cursor-pointer flex items-center justify-center focus:outline-none"
                  aria-label={`Switch to ${realm.title}`}
                  title={`${realm.title} (${realm.altitudeStr})`}
                >
                  <span
                    className={`block transition-all duration-300 rounded-full ${
                      idx === activeRealmIdx 
                        ? 'w-4 sm:w-5 h-1.5 bg-[#FF6A00] shadow-sm shadow-orange-500/50' 
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          CENTER HERO: WELCOME TO THE CAUCASUS (MONUMENTAL ALPINE EDITORIAL)
      ========================================================================= */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 my-auto py-4 max-w-5xl mx-auto w-full pointer-events-auto">
        
        {/* Top Luxury Horizon Label (Unboxed, Sleek Tracking) */}
        <div className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#FF6A00] font-bold uppercase mb-3 sm:mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse shrink-0" />
          <span>{settings?.promoBadgeText || 'The Greater Caucasus • 2026 Expeditions'}</span>
        </div>

        {/* Monumental Editorial Headline (Pure Luxury Typography, Solid White & High-Contrast Razor-Sharp Shadows) */}
        <h1 
          className="font-serif tracking-[0.05em] sm:tracking-[0.07em] text-white text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] uppercase leading-[1.03] font-black select-none text-center"
          style={{
            textShadow: '0 4px 28px rgba(0,0,0,0.95), 0 2px 10px rgba(0,0,0,0.85)',
          }}
        >
          <span className="block text-white">
            {titleLine1}
          </span>
          {titleLine2 && (
            <span 
              className="block mt-1 sm:mt-1.5 text-white sm:text-slate-100"
              style={{
                textShadow: '0 6px 32px rgba(0,0,0,0.98), 0 2px 12px rgba(0,0,0,0.9)',
              }}
            >
              {titleLine2}
            </span>
          )}
        </h1>

        {/* Dynamic Realm Highlight Subtitle */}
        <div className="mt-4 sm:mt-5 max-w-2xl mx-auto text-center px-2">
          <p 
            className="text-xs sm:text-sm md:text-base text-slate-200 font-normal leading-relaxed max-w-xl mx-auto"
            style={{
              textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.8)',
            }}
          >
            <span className="font-mono text-[11px] sm:text-xs text-sky-300 font-bold uppercase tracking-wider mr-1.5">
              {currentRealm.badge} &bull;
            </span>
            {settings?.heroSubtitle || `${currentRealm.tagline}. Europe's wildest glaciated frontier, guided by certified mountaineers.`}
          </p>
        </div>

        {/* Luxury Action CTA Group */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <a
            href={settings?.heroPrimaryCtaLink || '#expeditions'}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] active:scale-95 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-2xl shadow-black/80 border border-orange-400/40 cursor-pointer min-h-[48px]"
          >
            <span>{settings?.heroPrimaryCtaText || 'EXPLORE EXPEDITIONS'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href={settings?.heroSecondaryCtaLink || whatsAppUrl}
            target={(settings?.heroSecondaryCtaLink || whatsAppUrl).startsWith('http') ? '_blank' : undefined}
            rel={(settings?.heroSecondaryCtaLink || whatsAppUrl).startsWith('http') ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 rounded-xl bg-black/40 hover:bg-black/60 active:scale-95 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-2xl shadow-black/80 border border-white/20 hover:border-sky-400/50 backdrop-blur-sm cursor-pointer min-h-[48px]"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>{settings?.heroSecondaryCtaText || 'WHATSAPP CONCIERGE'}</span>
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
          
          {/* Desktop & Tablet Realm Selector Tabs */}
          <div 
            className="hidden sm:grid gap-2 mb-2"
            style={{
              gridTemplateColumns: `repeat(${realms.length}, minmax(0, 1fr))`
            }}
          >
            {realms.map((realm, idx) => {
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
          <div 
            className="grid sm:hidden gap-1.5 mb-2"
            style={{
              gridTemplateColumns: `repeat(${Math.min(realms.length, 4)}, minmax(0, 1fr))`
            }}
          >
            {realms.map((realm, idx) => {
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

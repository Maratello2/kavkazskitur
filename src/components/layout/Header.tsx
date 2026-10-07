'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mountain,
  ChevronDown,
  ChevronRight,
  Phone,
  ArrowRight,
  ShieldCheck,
  Compass,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { NAVIGATION_DATA, NavCategory } from '@/src/data/navigation';
import MorphingMenuIcon from '@/components/motion/MorphingMenuIcon';
import TourSearchWithHints from '@/components/interactive/TourSearchWithHints';
import BookingModalClient from '@/components/BookingModalClient';
import Logo from '@/components/Logo';
import defaultSettings from '@/data/siteSettings.json';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [settings, setSettings] = useState(defaultSettings);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>('elbrus');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Close menus on path navigation
  useEffect(() => {
    setActiveCategory(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close desktop mega menu & mobile drawer on Escape key or desktop resize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCategory(null);
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      } else {
        setActiveCategory(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Lock body scroll when mobile menu is active (Apple HIG / Mobile-First standard)
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [mobileMenuOpen]);

  // Clean debounce handlers for buttery-smooth Mega Menu hover interactions
  const handleMouseEnter = (categoryId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveCategory(categoryId);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 180);
  };

  const handleMenuMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const toggleCategory = (categoryId: string) => {
    setActiveCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const toggleMobileCategory = (categoryId: string) => {
    setExpandedMobileCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  // Do not render public header on admin paths or standalone showcase
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/maratello'))) {
    return null;
  }

  const activeCategoryData = NAVIGATION_DATA.find((c) => c.id === activeCategory);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 transition-all select-none">
        {/* Dynamic Urgent Announcement Banner (Fixed with Header, Brand Orange) */}
        {settings.announcementActive && settings.announcementText && (
          <div className="w-full bg-gradient-to-r from-[#FF6A00] to-[#E05D00] text-white text-[11px] sm:text-xs font-bold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 border-b border-orange-400/40 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />
            <span>{settings.announcementText}</span>
          </div>
        )}

        {/* Main Navigation Bar */}
        <div className="w-full h-20 bg-[#091422]/98 border-b border-white/[0.08] shadow-2xl">
          <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 relative">
            
            {/* 1. BRAND LOGO - Official Company Emblem & Identity */}
            <Logo variant="full" className="shrink-0" />

            {/* 2. DESKTOP NAVIGATION (>= 1024px) - Adventure Peaks Mega Menu */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {NAVIGATION_DATA.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onMouseEnter={() => handleMouseEnter(cat.id)}
                    onMouseLeave={handleMouseLeave}
                    className="relative"
                  >
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      aria-expanded={isActive}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl uppercase text-xs tracking-[0.14em] font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'text-white bg-white/[0.08]'
                          : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span>{cat.title}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isActive ? 'rotate-180 text-[#FF6A00]' : 'text-slate-400'
                        }`}
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>
                );
              })}
            </nav>

            {/* 3. RIGHT CTA AREA (WhatsApp + Book Tour + Mobile Hamburger) */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Direct WhatsApp Chat (+7 928 082-84-13) */}
              <a
                href="https://wa.me/79280828413?text=Expedition%20Inquiry%0AHello!%20I%20would%20like%20to%20inquire%20about%20climbing%20and%20expeditions."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-all min-h-[44px]"
                title="Direct WhatsApp: +7 (928) 082-84-13"
              >
                <img src="/img/wp.svg" alt="WhatsApp" className="w-4 h-4 object-contain shrink-0" />
                <span className="font-mono text-[11px] text-emerald-400">+7 (928) 082-84-13</span>
              </a>

              {/* Accent "Book Tour" Button - Approved Brand Color #FF6A00 (Visible on >= 640px) */}
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-[#E05D00] active:scale-95 text-white text-xs font-bold uppercase tracking-[0.16em] px-4 py-2.5 rounded-xl shadow-lg shadow-orange-950/40 border border-orange-400/30 transition-all min-h-[44px] shrink-0 cursor-pointer"
              >
                <Mountain className="w-4 h-4 text-white" strokeWidth={1.5} />
                <span>Book Tour</span>
              </button>

              {/* Mobile Hamburger Button (Instant zero-delay click, 44x44 Apple HIG, GPU-accelerated) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 border border-white/[0.08] text-slate-200 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/50 shrink-0"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
              >
                <MorphingMenuIcon isOpen={mobileMenuOpen} className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* 4. MEGA MENU DROPDOWN POPOVER (Zero-Lag Fast Hardware Composite) */}
            <AnimatePresence>
              {activeCategory && activeCategoryData && (
                <motion.div
                  key="mega-menu-popover"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  onMouseEnter={handleMenuMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="hidden lg:block absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[760px] xl:w-[840px] max-w-[calc(100vw-32px)] bg-[#0B1524] border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.95)] rounded-2xl p-6 z-50 text-white"
                >
                  <div key={activeCategoryData.id} className="transition-opacity duration-150">
                    {/* Header bar inside Mega Menu */}
                    <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse" />
                        <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#FF6A00]">
                          {activeCategoryData.title}
                        </span>
                      </div>
                      <Link
                        href={activeCategoryData.href || '/expeditions'}
                        onClick={() => setActiveCategory(null)}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#FF6A00] transition-colors"
                      >
                        <span>View all expeditions</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* 2 or 3 Columns for Sections */}
                    <div
                      className={`grid gap-6 ${
                        activeCategoryData.sections.length > 2 ? 'grid-cols-3' : 'grid-cols-2'
                      }`}
                    >
                      {activeCategoryData.sections.map((section) => (
                        <div key={section.title} className="space-y-2.5">
                          <h4 className="text-[10px] tracking-[0.22em] text-[#FF6A00] font-bold uppercase pb-1.5 border-b border-white/[0.06]">
                            {section.title}
                          </h4>
                          <div className="space-y-1">
                            {section.items.map((item) => (
                              <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setActiveCategory(null)}
                                className="group/item flex flex-col p-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-semibold text-slate-200 group-hover/item:text-[#FF6A00] transition-colors">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30 font-mono">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-[11px] text-slate-400 group-hover/item:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                                    {item.description}
                                  </p>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </header>

      {/* 5. MOBILE DRAWER (< 1024px) - Instant 60 FPS GPU-accelerated Slide */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-[#091422] flex-col justify-between overflow-y-auto min-h-[100dvh] transition-transform duration-250 ease-out transform-gpu will-change-transform ${
          mobileMenuOpen ? 'flex translate-x-0 pointer-events-auto' : 'hidden translate-x-full pointer-events-none'
        }`}
        style={{
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
          paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        }}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Top Bar inside Drawer */}
        <div className="px-5 sm:px-8 pb-3.5 border-b border-white/[0.08] flex items-center justify-between">
          <Logo
            variant="full"
            className="shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:scale-95 border border-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close Menu"
          >
            <MorphingMenuIcon isOpen={true} className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Quick Tour Search with Micro-Hints */}
        <div className="px-5 sm:px-8 pt-3 pb-1">
          <TourSearchWithHints
            value={searchQuery}
            onChange={(q) => {
              setSearchQuery(q);
              if (q.trim()) {
                setMobileMenuOpen(false);
                router.push(`/expeditions?q=${encodeURIComponent(q)}`);
              }
            }}
            hints={['Elbrus South Classic', 'Traverse Expedition', 'Bezengi Wall', 'Mount Kazbek']}
            placeholderPrefix="Explore routes: "
          />
        </div>

        {/* Accordion List for the 5 High-Altitude Categories */}
        <div className="px-5 sm:px-8 py-4 space-y-2.5 flex-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-[#FF6A00] mb-1 px-1">
            Expedition Programs &amp; Regions
          </div>

          {NAVIGATION_DATA.map((cat) => {
            const isExpanded = expandedMobileCategory === cat.id;
            return (
              <div
                key={cat.id}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleMobileCategory(cat.id)}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Mountain className="w-3.5 h-3.5 text-[#FF6A00] shrink-0" strokeWidth={1.5} />
                    <span>{cat.title}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-[#FF6A00]' : ''
                    }`}
                    strokeWidth={1.5}
                  />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="px-3.5 pb-3 pt-1 border-t border-white/[0.04] space-y-3 overflow-hidden transform-gpu"
                    >
                      {cat.sections.map((section) => (
                        <div key={section.title} className="space-y-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-[0.22em] font-bold text-slate-300 block">
                            {section.title}
                          </span>
                          <div className="space-y-1">
                            {section.items.map((item) => (
                              <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-colors min-h-[44px]"
                              >
                                <div className="flex flex-col pr-2">
                                  <span className="text-xs font-medium text-slate-200">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="text-[9px] uppercase font-bold text-[#FF6A00] tracking-wider mt-0.5 font-mono">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Sticky Action Area (Thumb Zone: WhatsApp + Book Tour) */}
        <div className="px-5 sm:px-8 pt-3 border-t border-white/[0.08] space-y-2.5">
          <a
            href="https://wa.me/79280828413?text=Expedition%20Inquiry%0AHello!%20I%20would%20like%20to%20inquire%20about%20climbing%20and%20expeditions."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white py-3 rounded-xl font-bold uppercase text-xs tracking-[0.16em] shadow-xl shadow-green-950/30 transition-all"
          >
            <img src="/img/wp.svg" alt="WhatsApp" className="w-4 h-4 object-contain" />
            <span>Direct WhatsApp (+7 928 082-84-13)</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsBookingModalOpen(true);
            }}
            className="w-full min-h-[46px] flex items-center justify-center gap-2 bg-[#FF6A00] hover:bg-[#E05D00] active:scale-95 text-white py-2.5 rounded-xl font-bold uppercase text-xs tracking-[0.16em] shadow-lg shadow-orange-950/40 border border-orange-400/30 transition-all cursor-pointer"
          >
            <Mountain className="w-4 h-4 text-white" strokeWidth={1.5} />
            <span>Book Tour Online</span>
          </button>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1 pb-1">
            <a
              href="tel:+79286914405"
              className="flex items-center gap-2 text-slate-300 hover:text-white py-1 min-h-[44px]"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
              <span className="font-mono text-[11px]">+7 (928) 691-44-05</span>
            </a>
            <span className="text-[10px] font-mono uppercase text-slate-500">
              Nalchik Base 24/7
            </span>
          </div>
        </div>

      </div>

      {/* 6. CONTROLLED BOOKING MODAL WITH SKELETON LOADERS & 10 UX RULES */}
      <BookingModalClient
        tourName="Mount Elbrus & Caucasus Expedition"
        isOpenControlled={isBookingModalOpen}
        onCloseControlled={() => setIsBookingModalOpen(false)}
      />
    </>
  );
}

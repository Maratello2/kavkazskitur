'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Compass, Mountain, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';
import Logo from './Logo';

const NAV_LINKS = [
  { href: '/expeditions', label: 'Expeditions', icon: Mountain },
  { href: '/schedule', label: '2026 Schedule', icon: Calendar },
  { href: '/barrels', label: 'Barrels 3,800m', icon: Compass },
  { href: '/acclimatization', label: 'Acclimatization', icon: Mountain },
  { href: '/safety', label: 'Safety & Permits', icon: ShieldCheck },
  { href: '/cabinet', label: 'Climber Portal', icon: ShieldCheck },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not render public header on admin pages
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on Esc key or when resizing to desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Lock body scroll when mobile menu is open (Apple HIG requirement)
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-16 sm:h-20 z-50 bg-[#091422]/95 backdrop-blur-md border-b border-white/[0.08] shadow-2xl">
        <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center shrink-0 max-h-10">
            <Logo className="shrink-0 max-h-10" />
          </div>

          {/* Desktop Navigation (>= 1024px) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-bold uppercase tracking-[0.22em] text-slate-300">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#FF6A00] transition-colors py-1 relative group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF6A00] transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions: Phone + WhatsApp + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Phone (desktop & tablet) */}
            <a
              href="tel:+79286914405"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-2 rounded-xl border border-white/[0.08] transition-colors min-h-[44px]"
              title="Call Central Caucasus Base: +7 (928) 691-44-05"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
              <span className="hidden xl:inline">+7 (928) 691-44-05</span>
              <span className="inline xl:hidden">Call Base</span>
            </a>

            {/* WhatsApp Inquiry Button (desktop) */}
            <a
              href="https://wa.me/79280828413?text=Expedition%20Inquiry%0ATour:%20General%20Caucasus%20Expedition%0ADates:%20Season%202026%0AGroup:%201%20climber%0A%0AHello!%20I%20would%20like%20to%20inquire%20about%20climbing%20Mt.%20Elbrus."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-[#E05D00] text-white text-xs font-bold uppercase tracking-[0.18em] px-4 py-2.5 rounded-xl shadow-lg shadow-orange-950/40 border border-orange-400/20 transition-all hover:scale-[1.02] active:scale-95 min-h-[44px]"
            >
              <img src="/img/wp.svg" alt="WhatsApp" className="w-4 h-4 object-contain shrink-0" />
              <span>WhatsApp</span>
            </a>

            {/* Accessible Mobile Hamburger Button (Strict min 44x44px tap target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.08] text-slate-200 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/50"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5 text-slate-200" strokeWidth={1.5} />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Full-Screen Dimmed Mobile Overlay Drawer (Apple HIG & Safe-Area compliant) */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-[#091422]/98 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300"
          style={{
            paddingTop: 'max(1.25rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          }}
        >
          {/* Top Bar inside Drawer */}
          <div className="px-5 sm:px-8 pb-4 border-b border-white/[0.08] flex items-center justify-between">
            <Logo className="shrink-0" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Navigation Links with large, comfortable touch targets (min 48px) */}
          <div className="px-5 sm:px-8 py-6 space-y-2 flex-1">
            <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#FF6A00] mb-3 px-2">
              Expedition Routes &amp; Base
            </div>

            <div className="space-y-1.5">
              {NAV_LINKS.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] active:bg-white/[0.1] border border-white/[0.04] text-slate-200 hover:text-white transition-all active:scale-[0.98] min-h-[48px]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#FF6A00] shrink-0">
                        <IconComponent className="w-4 h-4" strokeWidth={1.5} />
                      </div>
                      <span className="tracking-wider uppercase text-xs font-bold">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" strokeWidth={1.5} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Sticky Action Area (Thumb Zone: WhatsApp + Phone) */}
          <div className="px-5 sm:px-8 pt-4 border-t border-white/[0.08] space-y-3">
            <a
              href="https://wa.me/79280828413?text=Expedition%20Inquiry%0ATour:%20General%20Inquiry%0ADates:%20Season%202026%0A%0AHello!%20I%20would%20like%20to%20inquire%20about%20climbing%20Mt.%20Elbrus."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[50px] flex items-center justify-center gap-2.5 bg-[#FF6A00] hover:bg-[#E05D00] active:scale-[0.98] text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-[0.18em] shadow-xl shadow-orange-950/60 border border-orange-400/30 transition-all"
            >
              <img src="/img/wp.svg" alt="WhatsApp" className="w-5 h-5 object-contain" />
              <span>Direct WhatsApp Inquiry</span>
            </a>

            <div className="flex items-center justify-between text-xs text-slate-400 px-2 pt-1">
              <a
                href="tel:+79286914405"
                className="flex items-center gap-2 text-slate-300 hover:text-white py-2 min-h-[44px]"
              >
                <Phone className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
                <span className="font-mono">+7 (928) 691-44-05</span>
              </a>

              <span className="text-[10px] font-mono uppercase text-slate-500">
                Nalchik Base 24/7
              </span>
            </div>
          </div>

        </div>
      )}
    </>
  );
}

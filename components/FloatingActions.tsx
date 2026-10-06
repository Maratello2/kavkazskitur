'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

export default function FloatingActions() {
  const pathname = usePathname();
  const [showTopBtn, setShowTopBtn] = useState(false);

  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/maratello'))) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5 sm:gap-3 select-none pointer-events-none"
      style={{
        bottom: 'max(1rem, env(safe-area-inset-bottom))',
        right: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      
      {/* Scroll to top button (44x44 tap target) */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="pointer-events-auto min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[#091422]/98 border border-white/[0.08] text-slate-300 hover:text-[#FF6A00] hover:border-[#FF6A00]/50 flex items-center justify-center shadow-xl transition-all active:scale-90 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 text-[#FF6A00]" strokeWidth={1.5} />
        </button>
      )}


      {/* WhatsApp Main Floating Button (shown after scrolling past hero on homepage, always on subpages) */}
      {(pathname !== '/' || showTopBtn) && (
        <a
          href="https://wa.me/79280828413?text=Expedition%20Inquiry%0ATour:%20General%20Caucasus%20Expedition%0ADates:%20Season%202026%0AGroup:%201%20climber%0A%0AHello!%20I%20would%20like%20to%20inquire%20about%20climbing%20Mt.%20Elbrus."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="pointer-events-auto group relative flex items-center justify-center min-w-[48px] min-h-[48px] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white border border-sky-400/30 shadow-2xl shadow-sky-950/70 transition-all active:scale-95"
        >
          <img src="/img/wp.svg" alt="WhatsApp" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />

          {/* Tooltip on desktop hover */}
          <span className="hidden sm:block absolute right-16 px-3 py-1.5 rounded-lg bg-[#091422] border border-white/[0.08] text-xs font-mono font-medium text-slate-200 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Fast WhatsApp Inquiry
          </span>
        </a>
      )}
    </div>
  );
}

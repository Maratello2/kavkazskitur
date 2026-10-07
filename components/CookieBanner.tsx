'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/maratello'))) {
    return null;
  }

  useEffect(() => {
    const consent = localStorage.getItem('kavkaz_cookie_consent');
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('kavkaz_cookie_consent', 'accepted');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-sm z-50 bg-[#070F1C]/96 backdrop-blur-md border border-white/15 p-3.5 rounded-xl shadow-2xl flex flex-col gap-2.5 animate-in fade-in duration-300"
    >
      <div className="flex items-start gap-2.5">
        <Cookie className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-300 leading-snug">
          We use cookies to deliver 3D topographic modules, telemetry, and analytics.{' '}
          <Link href="/privacy" className="text-[#FF6A00] underline hover:text-orange-300 font-semibold">
            Privacy Policy
          </Link>.
        </p>
      </div>
      <div className="flex items-center justify-end">
        <button
          onClick={accept}
          className="min-h-[36px] px-4 py-1.5 bg-[#FF6A00] hover:bg-[#E05D00] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shrink-0 cursor-pointer shadow-md flex items-center justify-center active:scale-95"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

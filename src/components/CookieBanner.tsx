'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname && pathname.startsWith('/admin')) {
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
      className="fixed bottom-3 inset-x-3 sm:bottom-auto sm:top-24 sm:right-6 sm:left-auto sm:max-w-xs z-50 bg-[#070F1C]/96 backdrop-blur-md border border-white/15 p-3 rounded-xl shadow-2xl flex flex-col gap-2.5 animate-in fade-in duration-300"
    >
      <div className="flex items-start gap-2.5">
        <Cookie className="w-4 h-4 text-[#FF6A00] shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-300 leading-snug">
          We use cookies to analyze performance and provide booking features.{' '}
          <Link href="/privacy" className="text-sky-400 underline hover:text-sky-300 font-semibold">
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

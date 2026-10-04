'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'emblem' | 'vector';
  className?: string;
  size?: number;
  subtitle?: string;
  onClick?: () => void;
}

export default function Logo({
  variant = 'full',
  className = '',
  subtitle = 'High Caucasus Expeditions',
  onClick,
}: LogoProps) {
  if (variant === 'emblem' || variant === 'vector') {
    return (
      <Link
        href="/"
        onClick={onClick}
        className={`inline-flex items-center select-none shrink-0 group focus:outline-none ${className}`}
        title="KavKazSkiTur — 20 Years of High Caucasus Expeditions"
      >
        <div 
          className="relative w-10 h-10 max-w-[40px] max-h-[40px] shrink-0 overflow-hidden rounded-xl border border-[#FF6A00]/40 bg-[#091422] flex items-center justify-center p-1 shadow-md group-hover:border-[#FF6A00] transition-colors"
          style={{ width: '40px', height: '40px', maxWidth: '40px', maxHeight: '40px' }}
        >
          <img
            src="/brand/logo_kst.svg"
            alt="KavKazSkiTur Emblem"
            width={40}
            height={40}
            style={{ width: '40px', height: '40px', maxWidth: '40px', maxHeight: '40px' }}
            className="w-10 h-10 max-w-[40px] max-h-[40px] object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      onClick={onClick}
      className={`inline-flex items-center gap-2 sm:gap-3 select-none shrink-0 group focus:outline-none ${className}`}
      title="KavKazSkiTur — 20 Years of High Caucasus Expeditions"
    >
      <div 
        className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 overflow-hidden rounded-xl border border-[#FF6A00]/40 bg-[#091422] flex items-center justify-center p-1 shadow-md group-hover:border-[#FF6A00] group-hover:shadow-[0_0_15px_rgba(255,106,0,0.25)] transition-all"
      >
        <img
          src="/brand/logo_kst.svg"
          alt="KavKazSkiTur Emblem"
          width={40}
          height={40}
          className="w-full h-full object-contain shrink-0 group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm xs:text-base sm:text-lg font-black tracking-tight text-white leading-none group-hover:text-[#FF6A00] transition-colors whitespace-nowrap">
          KAVKAZ<span className="text-[#FF6A00]">SKI</span>TUR
        </span>
        <span className="hidden sm:block text-[9px] uppercase tracking-[0.24em] font-semibold text-slate-400 mt-1 whitespace-nowrap">
          {subtitle}
        </span>
      </div>
    </Link>
  );
}

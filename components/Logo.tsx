'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'emblem' | 'vector';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'header' | number;
  subtitle?: string;
  onClick?: () => void;
}

export default function Logo({
  variant = 'full',
  className = '',
  size = 'md',
  subtitle = 'High Caucasus Expeditions',
  onClick,
}: LogoProps) {
  let emblemClasses = 'w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15';
  let titleClasses = 'text-xl sm:text-2xl md:text-[1.7rem] font-black';
  let subtitleClasses = 'text-[10px] sm:text-xs font-bold';
  let customStyle: React.CSSProperties | undefined = undefined;

  if (typeof size === 'number') {
    customStyle = { width: `${size}px`, height: `${size}px` };
    emblemClasses = '';
  } else if (size === 'header' || size === 'lg') {
    emblemClasses = 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16';
    titleClasses = 'text-xl sm:text-2xl md:text-[1.85rem] font-black';
    subtitleClasses = 'text-[10px] sm:text-[11.5px] font-bold';
  } else if (size === 'xl') {
    emblemClasses = 'w-16 h-16 sm:w-20 sm:h-20';
    titleClasses = 'text-2xl sm:text-3xl md:text-4xl font-black';
    subtitleClasses = 'text-xs sm:text-sm font-bold';
  } else if (size === 'sm') {
    emblemClasses = 'w-10 h-10';
    titleClasses = 'text-base sm:text-lg font-black';
    subtitleClasses = 'text-[9px] font-bold';
  }

  if (variant === 'emblem' || variant === 'vector') {
    return (
      <Link
        href="/"
        onClick={onClick}
        className={`inline-flex items-center select-none shrink-0 group focus:outline-none ${className}`}
        title="KavKazSkiTur — 20 Years of High Caucasus Expeditions"
      >
        <div 
          className={`relative shrink-0 overflow-hidden rounded-2xl border-2 border-[#FF6A00]/50 bg-[#091422] flex items-center justify-center p-1.5 shadow-lg shadow-black/60 group-hover:border-[#FF6A00] group-hover:shadow-[0_0_20px_rgba(255,106,0,0.4)] transition-all ${emblemClasses}`}
          style={customStyle}
        >
          <img
            src="/brand/logo_kst.svg"
            alt="KavKazSkiTur Emblem"
            width={64}
            height={64}
            className="w-full h-full object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      onClick={onClick}
      className={`inline-flex items-center gap-3 sm:gap-3.5 select-none shrink-0 group focus:outline-none ${className}`}
      title="KavKazSkiTur — 20 Years of High Caucasus Expeditions"
    >
      <div 
        className={`relative shrink-0 overflow-hidden rounded-2xl border-2 border-[#FF6A00]/50 bg-[#091422] flex items-center justify-center p-1.5 shadow-lg shadow-black/60 group-hover:border-[#FF6A00] group-hover:shadow-[0_0_22px_rgba(255,106,0,0.45)] transition-all ${emblemClasses}`}
        style={customStyle}
      >
        <img
          src="/brand/logo_kst.svg"
          alt="KavKazSkiTur Emblem"
          width={64}
          height={64}
          className="w-full h-full object-contain shrink-0 group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="flex flex-col min-w-0 justify-center">
        <span className={`tracking-tight text-white leading-none group-hover:text-[#FF6A00] transition-colors whitespace-nowrap ${titleClasses}`}>
          KAVKAZ<span className="text-[#FF6A00]">SKI</span>TUR
        </span>
        <span className={`hidden xs:block uppercase tracking-[0.24em] text-slate-300 mt-1 sm:mt-1.5 whitespace-nowrap ${subtitleClasses}`}>
          {subtitle}
        </span>
      </div>
    </Link>
  );
}

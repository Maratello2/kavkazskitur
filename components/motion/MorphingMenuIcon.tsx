'use client';

import React from 'react';

interface MorphingMenuIconProps {
  isOpen: boolean;
  className?: string;
  strokeWidth?: number;
}

/**
 * MorphingMenuIcon
 * Ultra-fast 60 FPS GPU-accelerated hamburger-to-cross transformation.
 * Uses native CSS transforms and opacity to completely eliminate JS thread blocking on mobile.
 */
export default function MorphingMenuIcon({
  isOpen,
  className = 'w-5 h-5 text-white',
}: MorphingMenuIconProps) {
  return (
    <div 
      className={`relative flex flex-col justify-center items-center w-5 h-5 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <span
        className={`block h-[2px] w-5 bg-current rounded-full transition-transform duration-200 ease-out transform-gpu will-change-transform ${
          isOpen ? 'translate-y-[6px] rotate-45' : '-translate-y-1'
        }`}
      />
      <span
        className={`block h-[2px] w-5 bg-current rounded-full transition-all duration-150 ease-out transform-gpu will-change-transform ${
          isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 my-0.5'
        }`}
      />
      <span
        className={`block h-[2px] w-5 bg-current rounded-full transition-transform duration-200 ease-out transform-gpu will-change-transform ${
          isOpen ? '-translate-y-[6px] -rotate-45' : 'translate-y-1'
        }`}
      />
    </div>
  );
}

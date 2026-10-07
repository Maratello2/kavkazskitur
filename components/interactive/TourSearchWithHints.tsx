'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TourSearchWithHintsProps {
  value: string;
  onChange: (value: string) => void;
  hints?: string[];
  placeholderPrefix?: string;
  showChips?: boolean;
  className?: string;
  inputClassName?: string;
}

const DEFAULT_HINTS = [
  'Elbrus South Classic',
  'Northern Wilderness Traverse',
  'Mount Kazbek 5,033m',
  'Bezengi Alpine Wall',
  'Spring Ski-Tour Expedition',
];

export default function TourSearchWithHints({
  value,
  onChange,
  hints = DEFAULT_HINTS,
  placeholderPrefix = 'Search expeditions: ',
  showChips = true,
  className = '',
  inputClassName = '',
}: TourSearchWithHintsProps) {
  const [hintIndex, setHintIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Cycle animated placeholder hints when search input is empty and not actively focused
  useEffect(() => {
    if (value.trim().length > 0) return;

    const timer = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % hints.length);
    }, 2800);

    return () => clearInterval(timer);
  }, [value, hints.length]);

  const activeHint = hints[hintIndex] || hints[0];

  const handleSelectHint = (hint: string) => {
    onChange(hint);
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {/* Search Input Container */}
      <div className="relative w-full flex items-center">
        <Search 
          className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-[#FF6A00]" 
          strokeWidth={1.75} 
        />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={`${placeholderPrefix}${activeHint}...`}
          className={`w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.08] focus:border-[#FF6A00] focus:ring-1 focus:ring-[#FF6A00]/50 text-base sm:text-sm min-h-[44px] text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner ${inputClassName}`}
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X size={14} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Interactive Micro-Hints Chips */}
      {showChips && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 select-none mr-0.5">
            <Sparkles className="w-3 h-3 text-[#FF6A00]" strokeWidth={1.75} />
            <span>Quick hints:</span>
          </div>

          {hints.map((hint) => {
            const isSelected = value.toLowerCase().trim() === hint.toLowerCase().trim();
            return (
              <button
                key={hint}
                type="button"
                onClick={() => handleSelectHint(hint)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer select-none active:scale-95 font-medium ${
                  isSelected
                    ? 'bg-[#FF6A00]/20 text-[#FF6A00] border-[#FF6A00]/40 shadow-sm'
                    : 'bg-white/[0.03] text-slate-300 hover:text-white border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.07]'
                }`}
              >
                {hint}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug?: string | null;
  count: number;
}

export default function CategoryBar({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams ? searchParams.get('category') : null;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const safeCategories = categories || [];
  const totalTours = safeCategories.reduce((acc, cat) => acc + (cat.count || 0), 0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
      checkScroll();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="relative group bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-md dark:shadow-xl border border-slate-200 dark:border-white/5 p-2 sm:p-3">
        {/* Scroll Left Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white hover:bg-[#C85A32] hover:text-white shadow-lg border border-slate-200 dark:border-white/10 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Categories Strip */}
        <div 
          ref={scrollRef}
          onWheel={handleWheel}
          onScroll={checkScroll}
          className="flex items-center gap-2 overflow-x-auto pb-2.5 pt-1 px-2 scroll-smooth custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#C85A32 rgba(30, 41, 59, 0.6)',
          }}
        >
          <Link 
            href="/tours" 
            className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              !currentCategory 
                ? 'bg-[#C85A32] text-white shadow-lg shadow-orange-500/25' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            All Destinations ({totalTours})
          </Link>
          {safeCategories.map((cat) => {
            const catSlug = cat.slug || cat.name;
            const isActive = currentCategory === catSlug || currentCategory === cat.name;
            return (
              <Link 
                key={cat.id} 
                href={`/tours?category=${encodeURIComponent(catSlug)}`} 
                className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#C85A32] text-white shadow-lg shadow-orange-500/25' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat.name} ({cat.count})
              </Link>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-white hover:bg-[#C85A32] hover:text-white shadow-lg border border-slate-200 dark:border-white/10 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

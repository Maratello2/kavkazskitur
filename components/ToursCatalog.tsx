'use client';

import { useState, useMemo, useEffect } from 'react';
import { Tour, Category } from '@/types';
import TourCard from '@/components/TourCard';
import TourFilters, { FilterState, defaultFilterState } from '@/components/TourFilters';
import { Sparkles } from 'lucide-react';

function parsePrice(price: string | number | null | undefined): number {
  if (price === null || price === undefined) return 0;
  if (typeof price === 'number') return price;
  const cleaned = price.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export default function ToursCatalog({
  initialTours,
  categories,
  initialCategory,
}: {
  initialTours: Tour[];
  categories: Category[];
  initialCategory?: string;
}) {
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilterState,
    category: initialCategory || 'all',
  }));

  const INITIAL_COUNT = 8;
  const [displayCount, setDisplayCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      const s = params.get('search');
      if (cat || s) {
        setFilters((prev) => ({
          ...prev,
          category: cat || prev.category,
          search: s || prev.search,
        }));
      }
    }
  }, []);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setDisplayCount(INITIAL_COUNT);
  };

  const handleReset = () => {
    setFilters(defaultFilterState);
    setDisplayCount(INITIAL_COUNT);
  };

  const filteredTours = useMemo(() => {
    return initialTours.filter((t) => {
      // 1. Search
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchName = t.name.toLowerCase().includes(query);
        const matchDesc = t.description ? t.description.toLowerCase().includes(query) : false;
        if (!matchName && !matchDesc) return false;
      }

      // 2. Category
      if (filters.category !== 'all') {
        const catFilter = filters.category.toLowerCase();
        const catObj = categories.find(
          (c) =>
            c.name.toLowerCase() === catFilter ||
            (c.slug && c.slug.toLowerCase() === catFilter) ||
            String(c.id) === catFilter
        );
        const targetName = catObj ? catObj.name.toLowerCase() : catFilter;
        const tourCat = (t.category || '').toLowerCase();
        if (tourCat !== targetName && !tourCat.includes(targetName) && !targetName.includes(tourCat)) {
          return false;
        }
      }

      // 3. Date
      if (filters.date) {
        if (t.start_date) {
          const tourDate = t.start_date.split('T')[0];
          if (tourDate < filters.date) return false;
        }
      }

      // 4. Price
      const numPrice = parsePrice(t.price);
      if (filters.minPrice) {
        const min = Number(filters.minPrice);
        if (numPrice > 0 && numPrice < min) return false;
      }
      if (filters.maxPrice) {
        const max = Number(filters.maxPrice);
        if (numPrice > 0 && numPrice > max) return false;
      }

      // 5. Duration
      if (filters.duration !== 'all') {
        const d = t.duration || 1;
        if (filters.duration === '1' && d !== 1) return false;
        if (filters.duration === '2-3' && (d < 2 || d > 3)) return false;
        if (filters.duration === '4-7' && (d < 4 || d > 7)) return false;
        if (filters.duration === '8+' && d < 8) return false;
      }

      // 6. Difficulty
      if (filters.difficulty !== 'all') {
        const text = `${t.name} ${t.description || ''} ${t.program || ''}`.toLowerCase();
        if (filters.difficulty === 'easy') {
          const isEasy = text.includes('easy') || text.includes('walk') || text.includes('excursion') || (t.duration === 1);
          if (!isEasy) return false;
        } else if (filters.difficulty === 'medium') {
          const isMedium = text.includes('medium') || text.includes('moderate') || text.includes('jeep') || text.includes('trekking');
          if (!isMedium) return false;
        } else if (filters.difficulty === 'hard') {
          const isHard = text.includes('hard') || text.includes('extreme') || text.includes('climb') || text.includes('elbrus') || text.includes('kazbek');
          if (!isHard) return false;
        }
      }

      return true;
    });
  }, [initialTours, filters, categories]);

  const sortedTours = useMemo(() => {
    const list = [...filteredTours];
    if (filters.sort === 'price_asc') {
      list.sort((a, b) => {
        const pA = parsePrice(a.price);
        const pB = parsePrice(b.price);
        if (pA === 0) return 1;
        if (pB === 0) return -1;
        return pA - pB;
      });
    } else if (filters.sort === 'price_desc') {
      list.sort((a, b) => {
        const pA = parsePrice(a.price);
        const pB = parsePrice(b.price);
        return pB - pA;
      });
    } else {
      list.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return (b.photo_urls?.length || 0) - (a.photo_urls?.length || 0);
      });
    }
    return list;
  }, [filteredTours, filters.sort]);

  const visibleTours = sortedTours.slice(0, displayCount);

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Catalog Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C85A32]/15 text-[#C85A32] mb-3">
          <Sparkles className="w-4 h-4" /> KavKazSkiTur Expeditions
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          All Caucasus Expeditions & Tours
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl">
          Signature climbing itineraries, UIAGM guides, and transparent pricing directly from the operator.
        </p>
      </div>

      {/* Filter Component */}
      <div className="mb-10">
        <TourFilters
          categories={categories}
          values={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          totalFound={sortedTours.length}
        />
      </div>

      {/* Tours Grid */}
      <div className="lazy-section">
        {visibleTours.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {visibleTours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg p-8 max-w-xl mx-auto">
            <p className="text-slate-700 dark:text-slate-300 text-lg mb-4">
              No tours found matching your filter criteria.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#C85A32] hover:bg-[#A84726] transition-all cursor-pointer shadow-lg shadow-orange-500/25"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {sortedTours.length > 0 && (
          <div className="flex flex-col items-center justify-center gap-3 mt-12">
            {displayCount < sortedTours.length && (
              <button
                type="button"
                onClick={() => setDisplayCount((prev) => Math.min(prev + 8, sortedTours.length))}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#C85A32] to-[#D97748] text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 hover:scale-[1.02] hover:shadow-orange-500/40 transition-all cursor-pointer"
              >
                <span>Load More Expeditions</span>
              </button>
            )}
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Showing {visibleTours.length} of {sortedTours.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

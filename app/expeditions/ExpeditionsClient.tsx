'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mountain, Clock, ChevronRight, Flame, Shield, Users, Search, Compass, MapPin } from 'lucide-react';
import { TourData } from '@/data/toursData';
import defaultCategories from '@/data/categories.json';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  headerGroup?: string;
  description?: string;
  badge?: string;
  showInHeader?: boolean;
}

interface Props {
  tours: TourData[];
}

function ExpeditionsContent({ tours }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<CategoryItem[]>(defaultCategories as CategoryItem[]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync category and search query from URL parameters
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam.toLowerCase());
    } else {
      setSelectedCategory('all');
    }

    const qParam = searchParams.get('q') || searchParams.get('search');
    if (qParam) {
      setSearchQuery(qParam);
    }
  }, [searchParams]);

  // Fetch dynamic categories
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.categories) ? data.categories : (Array.isArray(data) ? data : []);
        if (list.length > 0) {
          setCategories(list);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(window.location.search);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    const newQuery = params.toString();
    router.replace(`/expeditions${newQuery ? '?' + newQuery : ''}`, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    const params = new URLSearchParams(window.location.search);
    if (val.trim()) {
      params.set('q', val.trim());
    } else {
      params.delete('q');
      params.delete('search');
    }
    const newQuery = params.toString();
    router.replace(`/expeditions${newQuery ? '?' + newQuery : ''}`, { scroll: false });
  };

  const filteredTours = tours.filter((tour) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      tour.category?.toLowerCase() === selectedCategory ||
      tour.categoryLabel?.toLowerCase().includes(selectedCategory) ||
      ((tour as any).categories && Array.isArray((tour as any).categories) && (tour as any).categories.includes(selectedCategory));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      tour.title.toLowerCase().includes(q) ||
      tour.description.toLowerCase().includes(q) ||
      (tour.altitude && tour.altitude.toLowerCase().includes(q)) ||
      (tour.categoryLabel && tour.categoryLabel.toLowerCase().includes(q)) ||
      (tour.difficulty && tour.difficulty.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* FILTER TABS AND SEARCH */}
      <div className="flex flex-col gap-5 bg-[#0E1F33]/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search expeditions by name, altitude, or region..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-[#08101A] border border-white/10 focus:border-[#C2410C] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#C2410C] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  const params = new URLSearchParams(window.location.search);
                  params.delete('q');
                  params.delete('search');
                  router.replace(`/expeditions${params.toString() ? '?' + params.toString() : ''}`, { scroll: false });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-slate-400 font-mono flex items-center gap-2 self-end md:self-auto">
            <span>Showing:</span>
            <span className="font-bold text-white bg-white/[0.06] px-2.5 py-1 rounded-lg border border-white/5">
              {filteredTours.length} of {tours.length} routes
            </span>
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={() => handleSelectCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-[#C2410C] text-white shadow-lg shadow-orange-950/40 border border-orange-400/30'
                : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/5'
            }`}
          >
            <span>All Routes</span>
            <span className="text-[10px] opacity-75 font-mono">({tours.length})</span>
          </button>

          {categories.map((cat) => {
            const count = tours.filter(
              (t) =>
                t.category?.toLowerCase() === cat.slug.toLowerCase() ||
                t.categoryLabel?.toLowerCase().includes(cat.slug.toLowerCase()) ||
                ((t as any).categories && Array.isArray((t as any).categories) && (t as any).categories.includes(cat.slug))
            ).length;
            const isSelected = selectedCategory === cat.slug.toLowerCase();

            return (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => handleSelectCategory(cat.slug.toLowerCase())}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#C2410C] text-white shadow-lg shadow-orange-950/40 border border-orange-400/30'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/5'
                }`}
              >
                <span>{cat.name}</span>
                {count > 0 && <span className="text-[10px] opacity-75 font-mono">({count})</span>}
                {cat.badge && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-orange-300 font-mono ml-0.5">
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ROUTE CARDS GRID */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-20 bg-[#0E1F33]/40 rounded-3xl border border-white/5">
          <Mountain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-lg font-bold text-slate-300">No Routes Found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search query or choosing another category.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              router.replace('/expeditions', { scroll: false });
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#C2410C] text-white text-xs font-bold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="group flex flex-col bg-[#0E1F33] rounded-2xl border border-white/10 overflow-hidden hover:border-[#C2410C]/60 hover:shadow-2xl hover:shadow-orange-950/20 transition-all duration-300"
            >
              {/* TOUR PHOTO */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                <img
                  src={tour.image || '/tours/elbrus-south.webp'}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1F33] via-transparent to-black/30" />

                {/* BADGES */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#08101A]/85 backdrop-blur-md text-[#C2410C] border border-[#C2410C]/30">
                    {tour.categoryLabel || 'Expedition'}
                  </span>
                  {tour.badge && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-md">
                      {tour.badge}
                    </span>
                  )}
                </div>

                {/* ALTITUDE TOP RIGHT */}
                {tour.altitude && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                    <Mountain className="w-3.5 h-3.5 text-[#C2410C]" />
                    <span>{tour.altitude}</span>
                  </div>
                )}

                {/* DIFFICULTY BOTTOM */}
                <div className="absolute bottom-3 left-3 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      tour.difficulty === 'Extreme' ? 'bg-red-500' : 'bg-amber-400'
                    }`}
                  />
                  <span>Difficulty: {tour.difficulty || 'Demanding'}</span>
                </div>
              </div>

              {/* CARD BODY */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-[#C2410C] transition-colors line-clamp-2 mb-2">
                    {tour.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {tour.description}
                  </p>
                </div>

                {/* SPECS */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C2410C] shrink-0" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#C2410C] shrink-0" />
                    <span>Guide 1:3 on summit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#C2410C] shrink-0" />
                    <span>EMERCOM Registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#C2410C] shrink-0" />
                    <span>Barrels Refuge</span>
                  </div>
                </div>

                {/* PRICE & ACTION */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Package Price</div>
                    <div className="text-xl sm:text-2xl font-black text-white">
                      {(tour.priceRub || 0).toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      ≈ ${tour.priceUsd || Math.round((tour.priceRub || 0) / 92.5)} USD
                    </div>
                  </div>

                  <Link
                    href={`/tours/${tour.slug}`}
                    className="inline-flex items-center gap-2 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-orange-950/30 transition-all group-hover:translate-x-0.5"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExpeditionsClient({ tours }: Props) {
  return (
    <Suspense fallback={<div className="text-slate-400 text-sm py-12 text-center">Loading expeditions catalog...</div>}>
      <ExpeditionsContent tours={tours} />
    </Suspense>
  );
}

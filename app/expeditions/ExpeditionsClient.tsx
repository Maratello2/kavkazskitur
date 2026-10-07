'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mountain, Clock, ChevronRight, Flame, Shield, Users } from 'lucide-react';
import { TourData } from '@/data/toursData';
import TourSearchWithHints from '@/components/interactive/TourSearchWithHints';

interface Props {
  tours: TourData[];
}

export default function ExpeditionsClient({ tours }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'climbing' | 'skitour' | 'trekking'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) setSearchQuery(q);
    }
  }, []);

  const filteredTours = tours.filter((tour) => {
    const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tour.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* FILTER TABS AND SEARCH */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.02] p-3 sm:p-4 rounded-2xl border border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#FF6A00] text-white shadow-lg shadow-orange-950/40'
                : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            All Routes ({tours.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('climbing')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'climbing'
                ? 'bg-[#FF6A00] text-white shadow-lg shadow-orange-950/40'
                : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Expeditions
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('skitour')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'skitour'
                ? 'bg-[#FF6A00] text-white shadow-lg shadow-orange-950/40'
                : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Ski-Tour
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('trekking')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'trekking'
                ? 'bg-[#FF6A00] text-white shadow-lg shadow-orange-950/40'
                : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            Trekking
          </button>
        </div>

        <div className="w-full md:w-96">
          <TourSearchWithHints
            value={searchQuery}
            onChange={setSearchQuery}
            hints={['Mt. Elbrus South', 'Traverse', 'Bezengi Wall', 'Kazbek']}
            placeholderPrefix="Search: "
            showChips={true}
          />
        </div>
      </div>

      {/* ROUTE CARDS GRID */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/[0.06]">
          <Mountain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-lg font-bold text-slate-300">No Routes Found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="group flex flex-col bg-white/[0.02] rounded-2xl border border-white/[0.08] overflow-hidden hover:border-[#FF6A00]/50 hover:bg-white/[0.03] transition-all duration-300 transform-gpu"
            >
              {/* TOUR PHOTO */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B12] via-transparent to-black/30" />

                {/* BADGES */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#060D17]/95 text-[#FF6A00] border border-[#FF6A00]/30 shadow-md">
                    {tour.categoryLabel}
                  </span>
                  {tour.badge && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FF6A00] text-white shadow-md">
                      {tour.badge}
                    </span>
                  )}
                </div>

                {/* ALTITUDE TOP RIGHT */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-[#060D17]/95 text-white border border-[#FF6A00]/30 flex items-center gap-1.5 shadow-md">
                  <Mountain className="w-3.5 h-3.5 text-[#FF6A00]" />
                  <span>{tour.altitude}</span>
                </div>

                {/* DIFFICULTY BOTTOM */}
                <div className="absolute bottom-3 left-3 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    tour.difficulty === 'Extreme' ? 'bg-red-500' : 'bg-amber-400'
                  }`} />
                  <span>Difficulty: {tour.difficulty}</span>
                </div>
              </div>

              {/* CARD BODY */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-[#FF6A00] transition-colors line-clamp-2 mb-2">
                    {tour.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {tour.description}
                  </p>
                </div>

                {/* SPECS */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/[0.06] text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FF6A00] shrink-0" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#FF6A00] shrink-0" />
                    <span>Guide 1:3 on summit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#FF6A00] shrink-0" />
                    <span>EMERCOM Registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FF6A00] shrink-0" />
                    <span>Barrels Refuge</span>
                  </div>
                </div>

                {/* PRICE & ACTION */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Package Price</div>
                    <div className="text-xl sm:text-2xl font-black text-white">
                      {tour.priceRub.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      ≈ \${tour.priceUsd} USD
                    </div>
                  </div>

                  <Link
                    href={`/tours/${tour.slug}`}
                    className="min-h-[44px] inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-[#E05D00] text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-orange-950/40 transition-all group-hover:translate-x-0.5 shrink-0"
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

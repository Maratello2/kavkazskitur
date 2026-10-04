'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mountain, Clock, ChevronRight, Flame, Shield, Users } from 'lucide-react';
import { TourData } from '@/data/toursData';

interface Props {
  tours: TourData[];
}

export default function ExpeditionsClient({ tours }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'climbing' | 'skitour' | 'trekking'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTours = tours.filter((tour) => {
    const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tour.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* FILTER TABS AND SEARCH */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0E1F33]/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#C2410C] text-white shadow-lg shadow-orange-950/40'
                : 'bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1]'
            }`}
          >
            All Routes ({tours.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('climbing')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'climbing'
                ? 'bg-[#C2410C] text-white shadow-lg shadow-orange-950/40'
                : 'bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1]'
            }`}
          >
            Expeditions
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('skitour')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'skitour'
                ? 'bg-[#C2410C] text-white shadow-lg shadow-orange-950/40'
                : 'bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1]'
            }`}
          >
            Ski-Tour
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('trekking')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'trekking'
                ? 'bg-[#C2410C] text-white shadow-lg shadow-orange-950/40'
                : 'bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1]'
            }`}
          >
            Trekking
          </button>
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search expedition routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#08101A] border border-white/10 focus:border-[#C2410C] rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#C2410C] transition-all"
          />
        </div>
      </div>

      {/* ROUTE CARDS GRID */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-20 bg-[#0E1F33]/40 rounded-3xl border border-white/5">
          <Mountain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-lg font-bold text-slate-300">No Routes Found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search query or category filter.</p>
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
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1F33] via-transparent to-black/30" />

                {/* BADGES */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#08101A]/85 backdrop-blur-md text-[#C2410C] border border-[#C2410C]/30">
                    {tour.categoryLabel}
                  </span>
                  {tour.badge && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-md">
                      {tour.badge}
                    </span>
                  )}
                </div>

                {/* ALTITUDE TOP RIGHT */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-[#C2410C]" />
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
                      {tour.priceRub.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      ≈ \${tour.priceUsd} USD
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

'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Users, ArrowRight, Search, Flame } from 'lucide-react';

export interface ScheduleTourItem {
  id: string;
  category: string;
  dates: string;
  month: string; // 'all' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october'
  days: string;
  program: string;
  price: string;
  seatsLeft: number;
  tourId?: number | string | null;
}

interface ScheduleClientProps {
  initialItems: ScheduleTourItem[];
}

const months = [
  { id: 'all', label: 'All Months' },
  { id: 'may', label: 'May' },
  { id: 'june', label: 'June' },
  { id: 'july', label: 'July' },
  { id: 'august', label: 'August' },
  { id: 'september', label: 'September' },
  { id: 'october', label: 'October' },
];

export default function ScheduleClient({ initialItems }: ScheduleClientProps) {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialItems.forEach((i) => set.add(i.category));
    return ['all', ...Array.from(set)];
  }, [initialItems]);

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      if (selectedMonth !== 'all' && item.month !== selectedMonth) {
        return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchProg = item.program.toLowerCase().includes(q);
        const matchDates = item.dates.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchProg && !matchDates && !matchCat) return false;
      }
      return true;
    });
  }, [initialItems, selectedMonth, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Filter controls */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 lg:p-8 shadow-lg dark:shadow-none space-y-6">
        {/* Month buttons */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            <Calendar size={14} className="text-[#C85A32]" />
            <span>Select Departure Month (2026 Season)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {months.map((m) => {
              const active = selectedMonth === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMonth(m.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#C85A32] text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/50'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by route title or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C85A32] cursor-pointer"
            >
              <option value="all">All Destinations ({categories.length - 1})</option>
              {categories
                .filter((c) => c !== 'all')
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expeditions list */}
      {filteredItems.length > 0 ? (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isLowSeats = item.seatsLeft <= 3;
            const linkHref = item.tourId ? `/tours/${item.tourId}` : '/tours';

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 hover:border-orange-500/40 rounded-2xl p-5 sm:p-6 shadow-md dark:shadow-none transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Dates and Category */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-[#C85A32]">
                      <Calendar size={13} />
                      <span>{item.dates}</span>
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {item.days}
                    </span>
                  </div>

                  <Link href={linkHref}>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#C85A32] transition-colors leading-snug pt-0.5">
                      {item.program}
                    </h3>
                  </Link>
                </div>

                {/* Status, Price, and Booking Button */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/5">
                  {/* Seat status */}
                  <div className="text-left md:text-right">
                    <div
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                        isLowSeats
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {isLowSeats ? (
                        <>
                          <Flame size={13} />
                          <span>Only {item.seatsLeft} {item.seatsLeft === 1 ? 'seat' : 'seats'} left</span>
                        </>
                      ) : (
                        <>
                          <Users size={13} />
                          <span>Open for Registration</span>
                        </>
                      )}
                    </div>
                    <div className="text-base sm:text-lg font-black text-[#C85A32] mt-1">
                      {item.price}
                    </div>
                  </div>

                  {/* Direct WhatsApp booking */}
                  <a
                    href={`https://wa.me/79286914405?text=${encodeURIComponent(
                      `Hello! I would like to book the expedition: ${item.program} (Dates: ${item.dates})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-[#C85A32] hover:bg-[#A84726] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Book Now</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-white/10 p-8 max-w-md mx-auto">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-700 dark:text-slate-300 font-bold mb-2">No expeditions found for this month</p>
          <button
            type="button"
            onClick={() => {
              setSelectedMonth('all');
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs font-bold text-[#C85A32] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

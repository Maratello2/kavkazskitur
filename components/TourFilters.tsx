'use client';

import React from 'react';
import { Calendar, SlidersHorizontal, RotateCcw } from 'lucide-react';
import TourSearchWithHints from './interactive/TourSearchWithHints';

export interface FilterState {
  search: string;
  category: string;
  date: string;
  minPrice: string;
  maxPrice: string;
  duration: string; // 'all' | '1' | '2-3' | '4-7' | '8+'
  difficulty: string; // 'all' | 'easy' | 'medium' | 'hard'
  sort: string; // 'popular' | 'price_asc' | 'price_desc'
}

interface TourFiltersProps {
  categories: { id: string | number; name: string; slug?: string | null; count?: number }[];
  values: FilterState;
  onChange: (newValues: FilterState) => void;
  onReset: () => void;
  totalFound?: number;
}

export const defaultFilterState: FilterState = {
  search: '',
  category: 'all',
  date: '',
  minPrice: '',
  maxPrice: '',
  duration: 'all',
  difficulty: 'all',
  sort: 'popular',
};

export default function TourFilters({
  categories,
  values,
  onChange,
  onReset,
  totalFound,
}: TourFiltersProps) {
  const updateField = (field: keyof FilterState, val: string) => {
    onChange({ ...values, [field]: val });
  };

  const hasActiveFilters =
    Boolean(values.search) ||
    values.category !== 'all' ||
    Boolean(values.date) ||
    Boolean(values.minPrice) ||
    Boolean(values.maxPrice) ||
    values.duration !== 'all' ||
    values.difficulty !== 'all' ||
    values.sort !== 'popular';

  const handleCatWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  const durations = [
    { id: 'all', label: 'Any' },
    { id: '1', label: '1 Day' },
    { id: '2-3', label: '2–3 Days' },
    { id: '4-7', label: '4–7 Days' },
    { id: '8+', label: '8+ Days' },
  ];

  const difficulties = [
    { id: 'all', label: 'All' },
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Moderate' },
    { id: 'hard', label: 'Challenging' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-3xl p-6 lg:p-8 shadow-lg dark:shadow-none mb-6">
      {/* Header, Search, Sort & Reset */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#C85A32]/15 text-[#C85A32]">
            <SlidersHorizontal size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
              Expedition Filters
            </h3>
            {totalFound !== undefined && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Routes Found: <span className="font-semibold text-[#C85A32]">{totalFound}</span>
              </p>
            )}
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-1 lg:max-w-xl">
          <div className="flex-1 min-w-[240px]">
            <TourSearchWithHints
              value={values.search}
              onChange={(val) => updateField('search', val)}
              hints={['Эльбрус с юга', 'Траверс', 'Безенги', 'Казбек', 'Джилы-Су']}
              placeholderPrefix="Поиск маршрута: "
              showChips={true}
              inputClassName="bg-slate-100 dark:bg-slate-800 border-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#C85A32]"
            />
          </div>

          {/* Sort */}
          <select
            value={values.sort}
            onChange={(e) => updateField('sort', e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-[#C85A32] text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer transition-all"
          >
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer shrink-0"
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="w-full mb-6">
        <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
          Route Category
        </span>
        <div
          onWheel={handleCatWheel}
          className="flex items-center gap-2 overflow-x-auto pb-2 scroll-smooth touch-pan-x"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#C85A32 rgba(30, 41, 59, 0.5)',
          }}
        >
          <button
            type="button"
            onClick={() => updateField('category', 'all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              values.category === 'all'
                ? 'bg-[#C85A32] text-white shadow-md shadow-orange-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Destinations
          </button>
          {categories.map((cat) => {
            const isSelected =
              values.category.toLowerCase() === cat.name.toLowerCase() ||
              (cat.slug && values.category.toLowerCase() === cat.slug.toLowerCase()) ||
              values.category === String(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateField('category', cat.slug || cat.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#C85A32] text-white shadow-md shadow-orange-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.name}</span>
                {cat.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                      isSelected ? 'bg-black/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Duration, Difficulty, Departure Date, Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Duration */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
            Duration
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            {durations.map((d) => {
              const active = values.duration === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => updateField('duration', d.id)}
                  className={`py-1.5 text-[11px] font-semibold rounded-xl transition-all cursor-pointer text-center ${
                    active
                      ? 'bg-[#C85A32] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
            Difficulty
          </label>
          <div className="grid grid-cols-4 gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            {difficulties.map((d) => {
              const active = values.difficulty === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => updateField('difficulty', d.id)}
                  className={`py-1.5 text-[11px] font-semibold rounded-xl transition-all cursor-pointer text-center ${
                    active
                      ? 'bg-[#C85A32] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Departure Date */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5 flex items-center gap-1">
            <Calendar size={13} className="text-[#C85A32]" />
            <span>Not Earlier Than</span>
          </label>
          <input
            type="date"
            value={values.date}
            onChange={(e) => updateField('date', e.target.value)}
            className="w-full px-3.5 py-2 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
            Budget (₽)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="From"
              value={values.minPrice}
              onChange={(e) => updateField('minPrice', e.target.value)}
              className="w-1/2 px-3 py-2 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
            />
            <span className="text-slate-400 text-xs">—</span>
            <input
              type="number"
              placeholder="To"
              value={values.maxPrice}
              onChange={(e) => updateField('maxPrice', e.target.value)}
              className="w-1/2 px-3 py-2 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

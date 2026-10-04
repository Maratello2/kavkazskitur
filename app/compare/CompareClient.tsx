'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tour } from '@/types';
import { useWonderStore } from '@/lib/store/useWonderStore';
import { getImageUrl } from '@/lib/imageUrl';
import { Scale, X, ArrowRight } from 'lucide-react';

export default function CompareClient({ allTours }: { allTours: Tour[] }) {
  const { comparison, removeFromCompare, clearCompare } = useWonderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const compareTours = allTours.filter((t) => comparison.includes(String(t.id)));

  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-100 pt-24 sm:pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase flex items-center">
              <Scale className="w-8 h-8 text-[#FF6A00] inline mr-3 shrink-0" />
              <span>Compare Expeditions</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 font-sans">
              Compare key expedition parameters to choose your ideal Caucasus mountain route
            </p>
          </div>

          {compareTours.length > 0 && (
            <button
              type="button"
              onClick={clearCompare}
              className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 cursor-pointer w-fit"
            >
              Clear Comparison List
            </button>
          )}
        </div>

        {/* Empty state */}
        {compareTours.length === 0 ? (
          <div className="max-w-md mx-auto text-center p-8 sm:p-12 bg-white/[0.02] border border-white/[0.08] rounded-2xl">
            <Scale className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Comparison list is empty
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
              Click the comparison icon on any expedition card in the catalog to evaluate routes side by side.
            </p>
            <Link
              href="/expeditions"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-950/40 transition-all"
            >
              <span>Explore Expeditions</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full min-w-[700px] border-collapse bg-white/[0.015] rounded-2xl overflow-hidden border border-white/[0.08]">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="p-4 sm:p-6 text-left text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest w-1/4">
                    Parameter
                  </th>
                  {compareTours.map((t) => (
                    <th key={t.id} className="p-4 sm:p-6 text-center w-1/3 min-w-[220px] relative">
                      <button
                        type="button"
                        onClick={() => removeFromCompare(String(t.id))}
                        className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-rose-500 hover:text-white text-slate-300 transition-colors cursor-pointer"
                        title="Remove from comparison"
                      >
                        <X size={14} />
                      </button>
                      <img
                        src={getImageUrl(t.image_url)}
                        alt={t.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-32 object-cover rounded-xl mb-3 shadow-md"
                      />
                      <div className="text-sm font-bold text-white line-clamp-2">
                        {t.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs sm:text-sm">
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-300">Price</td>
                  {compareTours.map((t) => (
                    <td key={t.id} className="p-4 sm:p-6 text-center font-black text-lg text-[#FF6A00]">
                      {t.price ? `${t.price} ₽` : 'On request'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-300">Duration</td>
                  {compareTours.map((t) => {
                    const d = t.duration ? `${t.duration} ${t.duration === 1 ? 'day' : 'days'}` : '1 day';
                    return (
                      <td key={t.id} className="p-4 sm:p-6 text-center text-slate-200">
                        {d}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-300">Category</td>
                  {compareTours.map((t) => (
                    <td key={t.id} className="p-4 sm:p-6 text-center text-slate-200">
                      {t.category || 'Mountain Expedition'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-300">Max Climbers</td>
                  {compareTours.map((t) => (
                    <td key={t.id} className="p-4 sm:p-6 text-center text-slate-200">
                      {t.capacity ? `up to ${t.capacity} climbers` : 'up to 10 climbers'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-slate-300">Action</td>
                  {compareTours.map((t) => (
                    <td key={t.id} className="p-4 sm:p-6 text-center">
                      <Link
                        href={`/tours/${t.slug || t.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                      >
                        <span>View Route</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Tour } from '@/types';
import { useWonderStore } from '@/lib/store/useWonderStore';
import TourCard from '@/components/TourCard';
import { Heart, ArrowRight } from 'lucide-react';

export default function FavoritesClient({ allTours }: { allTours: Tour[] }) {
  const { favorites } = useWonderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const favoriteTours = allTours.filter((t) => favorites.includes(String(t.id)));

  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-100 pt-24 sm:pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 pb-6 border-b border-white/[0.08]">
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase flex items-center">
            <Heart className="w-8 h-8 text-[#FF6A00] inline mr-3 shrink-0 fill-[#FF6A00]" />
            <span>Saved Expeditions</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 font-sans">
            Mountain routes and expeditions you have saved for your upcoming adventure
          </p>
        </div>

        {/* Empty state */}
        {favoriteTours.length === 0 ? (
          <div className="max-w-md mx-auto text-center p-8 sm:p-12 bg-white/[0.02] border border-white/[0.08] rounded-2xl">
            <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Your favorites list is empty
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
              Click the heart icon on any tour card to bookmark expeditions for later planning and booking.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {favoriteTours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

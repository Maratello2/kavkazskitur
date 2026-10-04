import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, History, MapPin } from 'lucide-react';
import BarrelsClient from './BarrelsClient';
import CaucasusMap from '@/components/CaucasusMap';

export const metadata: Metadata = {
  title: 'Barrels High-Altitude Refuge (Gara-Bashi 3,800 m) | KavKazSkiTur',
  description: 'Legendary high-altitude Barrels Refuge on the south slope of Mount Elbrus. Insulated cabins, 220V power, chef-prepared meals, radio communications, and acclimatization protocols.',
};

export default function BarrelsPage() {
  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-100 pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 font-mono">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#FF6A00]">Barrels Refuge (3,800 m)</span>
        </div>

        {/* HERO BANNER */}
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] mb-12 shadow-2xl bg-[#060B12]">
          <div className="relative h-80 sm:h-96 md:h-[480px] w-full">
            <img
              src="/tours/barrels_garabashi.webp"
              alt="High-Altitude Barrels Refuge Gara-Bashi 3800m"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060B12] via-[#060B12]/60 to-black/30" />
          </div>

          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.22em] bg-[#FF6A00]/20 text-[#FF6A00] border border-[#FF6A00]/30 shadow-lg">
                Altitude 3,800 m
              </span>
              <span className="px-3.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.22em] bg-[#060D17]/95 text-slate-200 border border-white/15 shadow-md">
                Gara-Bashi Station • Mount Elbrus
              </span>
              <span className="px-3.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.22em] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                KavKazSkiTur Private Base
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight max-w-4xl">
              Barrels High-Altitude Refuge
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-sans">
              The premier assault camp for classic ascents of the Western Peak of Elbrus (5,642 m). A warm haven perched amidst perpetual glaciers with 24/7 electricity, hot kitchen, and direct mountain rescue communications.
            </p>
          </div>
        </div>

        {/* HISTORY & CONTEXT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-sky-400/90">
              <History className="w-4 h-4 text-sky-400" strokeWidth={1.5} />
              <span>History of the Legendary Camp</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              From Soviet Cylindrical Shelters to a Modern Alpine Hub
            </h2>
            <div className="text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
              <p>
                The first cylindrical barrel cabins appeared on the rocky ridge of Gara-Bashi in the 1980s as an intermediate base for Soviet mountaineers and glaciologists. The aerodynamic cylindrical shape was engineered specifically to withstand fierce Elbrus winds that frequently exceed 40 m/s (90 mph).
              </p>
              <p>
                The <strong className="text-white">KavKazSkiTur</strong> team modernised the living modules: installed state-of-the-art basalt wool insulation, electric convectors, a spacious mess hall dining cabin, and a high-capacity drying facility for boots and crampons.
              </p>
              <p>
                Today, the Barrels represent the benchmark of safety and comfort on Elbrus slopes. Here, our climbers recover strength before the summit push while enjoying home-style Caucasian meals above the clouds.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] h-48 bg-white/[0.02]">
              <img
                src="/tours/real_el009b.jpg"
                alt="View of Elbrus from Gara-Bashi"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] h-48 bg-white/[0.02]">
              <img
                src="/tours/elbrus_south_orig.jpg"
                alt="Summit slopes of Mount Elbrus"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="col-span-2 rounded-2xl overflow-hidden border border-white/[0.08] h-56 bg-white/[0.02]">
              <img
                src="/tours/real_IMG_1999-scaled.jpg"
                alt="Camp at Gara-Bashi"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* INTERACTIVE AMENITIES, ACCLIMATIZATION RULES & BOOKING */}
        <BarrelsClient />

        {/* INTERACTIVE LOGISTICS MAP */}
        <div className="mt-20 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-sky-400/90">
              <MapPin className="w-4 h-4 text-sky-400" strokeWidth={1.5} />
              <span>Interactive Ascent Cartography</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Expedition Line: From Nalchik HQ to Europe’s Summit
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
              Track the full progression of our climbers from the initial gear briefing at Nalchik HQ (512 m) through Azau Base Camp (2,350 m), the assault shelter at Barrels Refuge (3,800 m), Priyut 11 (4,050 m), up to the Western Peak of Mount Elbrus (5,642 m).
            </p>
          </div>

          <CaucasusMap />
        </div>

      </div>
    </main>
  );
}

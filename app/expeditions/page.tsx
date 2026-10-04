import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTours } from '@/data/toursData';
import ExpeditionsClient from './ExpeditionsClient';
import CaucasusMap from '@/components/CaucasusMap';
import { Compass, ShieldCheck, ChevronRight, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Expeditions & Mount Elbrus Climbs 2026 | KavKazSkiTur',
  description: 'Full catalog of signature expeditions, Mount Elbrus and Kazbek climbs, ski-touring and high-altitude trekking for the 2026 season by official tour operator KavKazSkiTur.',
};

export default function ExpeditionsPage() {
  const tours = getAllTours();

  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-100 pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 font-mono">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#FF6A00]">Expeditions 2026</span>
        </div>

        {/* PAGE HEADER */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.07] font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF6A00] font-bold">
            <Compass className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
            <span>Season 2026 • Central Caucasus</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
            Expeditions &amp; Climbs
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Professional high-altitude mountaineering on Mount Elbrus (5,642 m) and Mount Kazbek (5,033 m) backed by 20+ years of expedition pedigree. Private high camp Barrels Refuge at 3,800 m, UIAGM/FAR-certified mountain guides, dedicated snowcats, and strict EMERCOM mountain rescue protocols.
          </p>
        </div>

        {/* CLIENT CATALOG WITH FILTERS */}
        <ExpeditionsClient tours={tours} />

        {/* INTERACTIVE EXPEDITION BASES MAP */}
        <div className="mt-20 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF6A00] font-bold">
              <Compass className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
              <span>Caucasus Staging Cartography</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Expedition Infrastructure &amp; Staging Bases
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
              Explore the critical operational stages of our Mount Elbrus ascents: from registration and logistics at Nalchik HQ to the acclimatization rotations and summit pushes from Barrels Refuge and Priyut 11.
            </p>
          </div>

          <CaucasusMap />
        </div>

        {/* SAFETY & CONSULTATION BANNER */}
        <div className="mt-20 bg-white/[0.02] rounded-2xl border border-white/[0.08] p-8 sm:p-12 relative overflow-hidden hover:border-white/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/[0.03] rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-[#FF6A00]">
                <ShieldCheck className="w-4 h-4 text-[#FF6A00]" strokeWidth={1.5} />
                <span>Expert Consultation with Lead Guide</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Unsure Which Route Fits Your Experience?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Connect directly with our senior expedition director in Nalchik. We evaluate your fitness level, recommend the optimal route (South Classic, North Wild, or Ski-Tour), and provide full equipment checklists.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <a
                href="https://wa.me/79286914405?text=Hello!%20I%20would%20like%20guidance%20on%20choosing%20the%20best%20Elbrus/Kazbek%20route."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2.5 bg-[#FF6A00] hover:bg-[#E05D00] text-white font-bold text-xs uppercase tracking-[0.16em] px-6 py-3.5 rounded-xl shadow-xl shadow-orange-950/40 border border-orange-400/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                <img src="/img/wp.svg" alt="WhatsApp" className="w-4 h-4 object-contain" />
                <span>Inquire on WhatsApp</span>
              </a>

              <a
                href="tel:+79286914405"
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#FF6A00]" strokeWidth={1.5} />
                <span className="font-mono text-[11px]">+7 (928) 691-44-05</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

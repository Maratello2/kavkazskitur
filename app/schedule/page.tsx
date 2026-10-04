import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTours } from '@/data/toursData';
import ScheduleClient2026 from './ScheduleClient2026';
import { Calendar, ChevronRight, ShieldCheck, Users, Flame, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Expedition Schedule & Departures 2026 | KavKazSkiTur',
  description: 'Official schedule of Mount Elbrus (South, North, Ski-Tour) and Mount Kazbek climbs for the May — October 2026 season. Guaranteed departures, reserve your spot.',
};

export default function SchedulePage() {
  const tours = getAllTours();

  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-100 pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 font-mono">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#FF6A00]">Schedule 2026</span>
        </div>

        {/* PAGE HEADER */}
        <div className="max-w-3xl mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.07] font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF6A00] font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
            <span>Season May — October 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
            2026 Expedition Timetable
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Scheduled group departures with guaranteed dates. All programs include private accommodation at our high-altitude Barrels Refuge (3,800 m), 3 chef-prepared meals daily, and certified UIAGM/FAR mountain guides.
          </p>
        </div>

        {/* HIGHLIGHT BADGES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.08] flex items-center gap-3.5 hover:border-white/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#FF6A00]" strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Guaranteed Departure</div>
              <div className="text-sm font-bold text-white">From 3 Climbers</div>
            </div>
          </div>

          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.08] flex items-center gap-3.5 hover:border-white/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[#FF6A00]" strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Guide Ratio</div>
              <div className="text-sm font-bold text-white">1:3 on Summit Push</div>
            </div>
          </div>

          <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.08] flex items-center gap-3.5 hover:border-white/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-400/20 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-[#FF6A00]" strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Private High Camp</div>
              <div className="text-sm font-bold text-white">Heated Barrels Refuge 3,800 m</div>
            </div>
          </div>
        </div>

        {/* SCHEDULE TABLE */}
        <ScheduleClient2026 tours={tours} />

        {/* CUSTOM DATES HELP */}
        <div className="mt-16 p-6 sm:p-8 bg-white/[0.02] rounded-2xl border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all duration-300">
          <div>
            <h3 className="text-lg font-bold text-white">Need Custom or Corporate Dates?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-sans">
              We arrange private VIP expeditions and corporate ascents tailored to your specific schedule.
            </p>
          </div>
          <a
            href="https://wa.me/79286914405?text=Hello!%20I%20am%20interested%20in%20custom%20dates%20for%20a%20private%20Elbrus%20expedition."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-[#E05D00] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-3 rounded-xl border border-orange-400/30 transition-all shrink-0 min-h-[44px]"
          >
            <Phone className="w-4 h-4 text-white" strokeWidth={1.5} />
            <span>Inquire for Custom Dates</span>
          </a>
        </div>

      </div>
    </main>
  );
}

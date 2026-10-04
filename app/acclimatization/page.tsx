import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Activity } from 'lucide-react';
import AcclimatizationClient from './AcclimatizationClient';

export const metadata: Metadata = {
  title: 'Acclimatization & Altitude Safety Guide | KavKazSkiTur',
  description: 'How to acclimatize properly for Mount Elbrus (5,642 m). Stepped altitude rotation, Acute Mountain Sickness (AMS) prevention, hydration protocols, and pre-trip training guidelines.',
};

export default function AcclimatizationPage() {
  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-100 pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 font-mono">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#FF6A00]">Acclimatization Guide</span>
        </div>

        {/* PAGE HEADER */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.07] font-mono text-[10px] uppercase tracking-[0.22em] text-sky-400/90 font-bold">
            <Activity className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
            <span>High-Altitude Physiology &amp; Safety</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
            Acclimatization Guide
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Success and safety when climbing Mount Elbrus depend over 90% on systematic physiological adaptation. Here is the distilled essence of 20+ years of high-altitude medical protocols and expedition experience from KavKazSkiTur guides.
          </p>
        </div>

        {/* INTERACTIVE GUIDE */}
        <AcclimatizationClient />

      </div>
    </main>
  );
}

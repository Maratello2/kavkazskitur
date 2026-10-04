import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import SafetyClient from './SafetyClient';

export const metadata: Metadata = {
  title: 'Expedition Safety & Border Security Passes | KavKazSkiTur',
  description: 'KavKazSkiTur safety protocols: official FSB border security permits, EMERCOM high-mountain rescue registry, UIAGM/FAR certified guides, Garmin InReach satellite tracking, and helicopter rescue fund.',
};

export default function SafetyPage() {
  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-100 pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 font-mono">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#FF6A00]">Safety &amp; Border Passes</span>
        </div>

        {/* PAGE HEADER */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.07] font-mono text-[10px] uppercase tracking-[0.22em] text-sky-400/90 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
            <span>KavKazSkiTur Safety Standards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
            Safety Protocols &amp; Border Permits
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Mountains forgive no recklessness. Over 20 years of operations, KavKazSkiTur has perfected a multi-layered safety standard: from official state border security passes to on-call helicopter evacuation agreements and continuous satellite telemetry for every team.
          </p>
        </div>

        {/* INTERACTIVE SAFETY CONTENT */}
        <SafetyClient />

      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mountain, Activity, ArrowRight, ShieldCheck, Thermometer, ChevronLeft, ChevronRight } from 'lucide-react';

interface StageInfo {
  step: number;
  label: string;
  name: string;
  meters: number;
  feet: number;
  stageType: string;
  oxygenPct: string;
  nightTemp: string;
  description: string;
  protocol: string;
}

const ALTITUDE_STAGES: StageInfo[] = [
  {
    step: 1,
    label: 'Nalchik',
    name: 'Nalchik Headquarters',
    meters: 512,
    feet: 1680,
    stageType: 'Lowland Hub',
    oxygenPct: '100% Sea-Level Equivalent',
    nightTemp: '+15°C .. +22°C',
    description: 'Expedition headquarters, mandatory FSB border security pass verification, gear inspection, and team briefing.',
    protocol: 'Final equipment inspection, medical screening, and transfer in 4x4 expedition vehicles to Baksan Valley.'
  },
  {
    step: 2,
    label: 'Terskol',
    name: 'Terskol Valley Base',
    meters: 2150,
    feet: 7054,
    stageType: 'Valley Base',
    oxygenPct: '78% Effective O₂',
    nightTemp: '+5°C .. +12°C',
    description: 'Valley staging hotel. Initial acclimatization hikes to Mt. Cheget (3,100 m) and Terskol Peak observatory.',
    protocol: 'Climbers begin conscious hydration (4 liters/day) and low-intensity aerobic climbing to trigger natural EPO production.'
  },
  {
    step: 3,
    label: 'Barrels',
    name: 'Gara-Bashi Barrels Refuge',
    meters: 3800,
    feet: 12467,
    stageType: 'High Base Camp',
    oxygenPct: '64% Effective O₂',
    nightTemp: '-2°C .. +5°C',
    description: 'KavKazSkiTur private high camp. Insulated barrel cabins, private chef, 220V power, and direct glacier access.',
    protocol: 'Primary residential base for 4 nights. Pulse oximeter readings taken morning and evening by lead guides.'
  },
  {
    step: 4,
    label: 'Pastukhov',
    name: 'Pastukhov Rocks',
    meters: 4700,
    feet: 15420,
    stageType: 'Acclimatization Benchmark',
    oxygenPct: '57% Effective O₂',
    nightTemp: '-12°C .. -4°C',
    description: 'Day 5 high-point rotation. Steep 30-degree ice fields where climbers learn crampon and ice axe arrest techniques.',
    protocol: 'Touch 4,700 m and immediately descend back to Barrels (3,800 m) to sleep. "Climb high, sleep low" golden rule.'
  },
  {
    step: 5,
    label: 'Saddle Col',
    name: 'Elbrus Saddle Refuge',
    meters: 5300,
    feet: 17388,
    stageType: 'Summit Staging Pass',
    oxygenPct: '52% Effective O₂',
    nightTemp: '-18°C .. -8°C',
    description: 'Glacier plateau between East and West peaks. Emergency shelter location and mandatory guide turnaround assessment point.',
    protocol: 'Final pulse oximeter check. Guides enforce strict 11:00 AM turnaround time regardless of team distance to summit.'
  },
  {
    step: 6,
    label: 'Summit',
    name: 'West Peak Apex',
    meters: 5642,
    feet: 18510,
    stageType: 'Supreme European Apex',
    oxygenPct: '49% Effective O₂',
    nightTemp: '-22°C .. -10°C',
    description: 'The highest summit in Europe and the Caucasus. 360-degree panorama encompassing the Greater Caucasus Ridge and Black Sea horizon.',
    protocol: '15-20 minute maximum summit duration before roped descent to ensure safe return before afternoon weather deterioration.'
  }
];

export default function AcclimatizationProfile() {
  const [activeIdx, setActiveIdx] = useState<number>(2); // Default to Barrels
  const activeStage = ALTITUDE_STAGES[activeIdx];
  const maxMeters = 5642;

  return (
    <div className="w-full">
      {/* Telemetry Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#FF6A00]" strokeWidth={1.5} />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-200 font-semibold">
            Interactive Route Elevation Telemetry (512 M &mdash; 5,642 M)
          </span>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Select milestone station to inspect telemetry
        </div>
      </div>

      {/* DESKTOP VIEW: 6-Column Altitude Bar Visualization (hidden sm:block) */}
      <div className="hidden sm:block relative pt-4 pb-2">
        <div className="flex items-end gap-3 sm:gap-5 h-44 sm:h-52 border-b border-white/[0.08] pb-1">
          {ALTITUDE_STAGES.map((st, i) => {
            const heightPercent = Math.max(16, Math.round((st.meters / maxMeters) * 100));
            const isSelected = activeIdx === i;

            return (
              <button
                key={st.label}
                type="button"
                onClick={() => setActiveIdx(i)}
                className="group flex-1 h-full flex flex-col justify-end items-center cursor-pointer transition-transform"
                aria-label={`${st.name}: ${st.meters} meters`}
              >
                <div className="text-[10px] sm:text-xs font-mono font-semibold text-slate-400 mb-2 group-hover:text-white transition-colors">
                  {st.meters.toLocaleString('en-US')}m
                </div>

                <div
                  className={`w-full rounded-t-xl transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#FF6A00] shadow-[0_0_30px_rgba(255,106,0,0.35)] ring-1 ring-orange-400/60'
                      : 'bg-white/[0.05] group-hover:bg-white/[0.12]'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                <div className="mt-3 text-center w-full">
                  <div
                    className={`font-mono text-[10px] sm:text-[11px] font-bold truncate transition-colors uppercase tracking-[0.16em] ${
                      isSelected ? 'text-[#FF6A00]' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {st.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MOBILE VIEW: Touch Elevation Ladder & Milestone Navigator (block sm:hidden) */}
      <div className="block sm:hidden space-y-3.5 pt-1 pb-1">
        {/* Visual Ascent Gauge (512m -> 5642m) */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Altitude Progress:</span>
            <span className="text-[#FF6A00] font-bold">
              {activeStage.meters.toLocaleString('en-US')} m <span className="text-slate-500 font-normal">({Math.round((activeStage.meters / maxMeters) * 100)}% to Summit)</span>
            </span>
          </div>

          {/* Progress bar track */}
          <div className="relative w-full h-2 rounded-full bg-white/[0.06] overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-600 via-orange-500 to-[#FF6A00] transition-all duration-500 shadow-sm shadow-orange-500/40"
              style={{ width: `${Math.max(10, Math.round((activeStage.meters / maxMeters) * 100))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>512m Base</span>
            <span className="text-[#FF6A00] font-bold">Station 0{activeStage.step}: {activeStage.label}</span>
            <span>5,642m Apex</span>
          </div>
        </div>

        {/* Milestone Station Strip with touch-friendly cards */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
          {ALTITUDE_STAGES.map((st, i) => {
            const isSelected = activeIdx === i;
            return (
              <button
                key={st.step}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-left shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#FF6A00] text-white border-orange-400/50 shadow-lg shadow-orange-950/60 scale-[1.02]'
                    : 'bg-white/[0.04] text-slate-300 border-white/[0.06] hover:bg-white/[0.08]'
                }`}
              >
                <div className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  0{st.step} &bull; {st.meters}m
                </div>
                <div className="text-xs font-bold whitespace-nowrap font-mono">
                  {st.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Prev / Next Quick Stepper Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setActiveIdx(prev => Math.max(0, prev - 1))}
            disabled={activeIdx === 0}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] text-xs font-mono text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 border border-white/[0.06] min-h-[44px] active:scale-95"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev Station</span>
          </button>
          <span className="text-[10px] font-mono text-slate-400">
            {activeIdx + 1} of {ALTITUDE_STAGES.length}
          </span>
          <button
            type="button"
            onClick={() => setActiveIdx(prev => Math.min(ALTITUDE_STAGES.length - 1, prev + 1))}
            disabled={activeIdx === ALTITUDE_STAGES.length - 1}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] text-xs font-mono text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 border border-white/[0.06] min-h-[44px] active:scale-95"
          >
            <span>Next Station</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Detailed Selected Stage Panel: Integrated Editorial Layout directly on canvas */}
      <div className="mt-8 pt-6 border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30 font-bold text-xs font-mono">
              0{activeStage.step}
            </span>
            <div>
              <h4 className="text-xl font-bold text-white tracking-tight">
                {activeStage.name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-white font-mono">
                  {activeStage.meters.toLocaleString('en-US')} m / {activeStage.feet.toLocaleString('en-US')} ft
                </span>
                <span>&bull;</span>
                <span className="text-[#FF6A00] font-mono uppercase tracking-[0.16em] text-[10px]">{activeStage.stageType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
              <span className="text-slate-400">Night:</span>
              <span className="text-white font-semibold">{activeStage.nightTemp}</span>
            </div>

            <div className="flex items-center gap-1.5 pl-3 border-l border-white/[0.08]">
              <Activity className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
              <span className="text-slate-400">O₂ Level:</span>
              <span className="text-emerald-400 font-semibold">{activeStage.oxygenPct}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm mb-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] font-semibold text-[#FF6A00] mb-2">
              Role in Acclimatization
            </div>
            <p className="text-slate-400 leading-relaxed text-xs sm:text-sm font-sans">
              {activeStage.description}
            </p>
          </div>

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] font-semibold text-[#FF6A00] mb-2">
              Safety &amp; Medical Protocol
            </div>
            <p className="text-slate-400 leading-relaxed text-xs sm:text-sm font-sans">
              {activeStage.protocol}
            </p>
          </div>
        </div>

        {/* CTA to full page */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-4">
          <span className="font-mono text-xs text-slate-400">
            Certified UIAGM acclimatization schedules &amp; pulse oximetry tracking
          </span>
          <Link
            href="/acclimatization"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-[#FF6A00] hover:text-white text-slate-200 text-xs font-bold uppercase tracking-[0.16em] border border-white/10 hover:border-[#FF6A00]/50 transition-all group active:scale-95 min-h-[44px]"
          >
            <span>Full Acclimatization Guide &amp; Protocols</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}

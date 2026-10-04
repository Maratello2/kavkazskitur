'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, CheckCircle2, Thermometer } from 'lucide-react';

const STAGES = [
  {
    id: 'nalchik',
    alt: '512 m',
    title: 'Nalchik HQ & Briefing',
    day: 'Day 1',
    temp: '+22°C',
    desc: 'Equipment inspection, border permit validation, safety briefing, and team transfer to the Baksan Valley.',
    badge: 'Logistics Hub',
  },
  {
    id: 'azau',
    alt: '2,350 m',
    title: 'Azau Glade Base',
    day: 'Day 2',
    temp: '+14°C',
    desc: 'Acclimatization trek to Mt. Cheget (3,100 m). First views of Donguz-Orun glaciers and oxygen adaptation.',
    badge: 'Trek & Acclimatization',
  },
  {
    id: 'barrels',
    alt: '3,800 m',
    title: 'High Base Camp (Gara-Bashi)',
    day: 'Days 3–5',
    temp: '-2°C',
    desc: 'Cable car ascent to the glaciated realm. Training on crampon technique, self-arrest with ice axes, and snow shelters.',
    badge: 'Glacier Training',
  },
  {
    id: 'pastukhov',
    alt: '4,700 m',
    title: 'Pastukhov Rocks',
    day: 'Day 6',
    temp: '-10°C',
    desc: 'Key acclimatization push. Testing breathing rhythm, alpine clothing layering, and metabolic reserve.',
    badge: 'Altitude Test',
  },
  {
    id: 'summit',
    alt: '5,642 m',
    title: 'West Elbrus Summit',
    day: 'Day 7 (Summit Push)',
    temp: '-20°C',
    desc: 'Alpine start at 01:00 AM. Traversing the saddle (5,300 m), fixed ropes to the highest point in Europe.',
    badge: 'European Rooftop',
  },
];

export function AltitudeTimeline() {
  const [active, setActive] = useState(STAGES[2]);

  return (
    <section className="relative my-16 rounded-3xl border border-white/10 bg-[#070D18] p-6 sm:p-10 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-orange-400 uppercase mb-2">
            <Mountain size={15} />
            <span>Summit Acclimatization Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How You Reach 5,642 M Safely.
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-sm">
          A proven altitude ladder engineered to guarantee 98% summit success without acute mountain sickness.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
        {STAGES.map((st) => {
          const isSelected = active.id === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setActive(st)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/15'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15'
              }`}
            >
              <div className="text-[11px] font-mono text-slate-400">{st.day}</div>
              <div className={`text-lg font-black ${isSelected ? 'text-orange-400' : 'text-white'}`}>
                {st.alt}
              </div>
              <div className="text-xs text-slate-300 truncate mt-0.5">{st.title}</div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-white/10 bg-[#0B1523] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {active.badge}
              </span>
              <span className="text-xs font-mono text-slate-400">{active.day} Schedule</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {active.title} — <span className="text-orange-400">{active.alt}</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{active.desc}</p>
          </div>

          <div className="flex sm:flex-col gap-4 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6 shrink-0 w-full sm:w-auto justify-around sm:justify-start">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Thermometer size={14} className="text-blue-400" /> Avg. Temp
              </div>
              <div className="text-xl font-bold text-white mt-0.5">{active.temp}</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <CheckCircle2 size={14} className="text-emerald-400" /> Medical
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-0.5">O2 Pulse Check</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

export default AltitudeTimeline;

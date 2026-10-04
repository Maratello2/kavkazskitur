'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Flame, UtensilsCrossed, Zap, Mountain, ShieldCheck, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const BARRELS_FEATURES = [
  {
    icon: Flame,
    title: 'Heated Cylindrical Cabins',
    desc: 'Insulated alpine refuge units engineered specifically for severe sub-zero weather, equipped with thermal heaters and clean bunk beds.'
  },
  {
    icon: UtensilsCrossed,
    title: 'Private Expedition Chef',
    desc: 'Hot 3-course Caucasian meals, fresh alpine breakfast, mineral soups, and unlimited hot mountain herbal tea in our dedicated dining hall.'
  },
  {
    icon: Zap,
    title: '220V Generator Electricity',
    desc: 'Daily power runs to recharge camera gear, smartphones, headlamps, GPS navigators, and avalanche transceivers at 3,800 m.'
  },
  {
    icon: Mountain,
    title: 'Direct Glacier Access',
    desc: 'Immediate ski-in / ski-out and roped glacier staging from the cabin entrance, eliminating reliance on commercial cableway schedules.'
  },
  {
    icon: ShieldCheck,
    title: 'Dedicated Safety & Radio Post',
    desc: 'High-frequency VHF radio communication directly linked to the Terskol rescue detachment and Elbrus search-and-rescue team.'
  },
  {
    icon: MapPin,
    title: 'Optimal Acclimatization Staging',
    desc: 'Positioned at 3,800 m, saving 1,500 vertical meters of effort on summit push day and allowing your body to adapt safely over 4 nights.'
  }
];

export default function BarrelsSection() {
  return (
    <section id="barrels" className="py-24 sm:py-32 bg-[#060B12] relative overflow-hidden text-white">
      {/* Subtle ambient alpine glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold text-[#FF6A00] mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
              Private High-Altitude Refuge • 3,800 M
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              The Barrels-Garabashi Base Camp
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans max-w-2xl">
              Unlike operators who rely on crowded public huts, KavKazSkiTur operates its own private high-altitude refuge compound on the southern glacier slopes of Mount Elbrus. Rest deeply in warm bunks before the midnight summit push.
            </p>
          </div>
        </ScrollReveal>

        {/* Hero split: Visual + Technical Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          {/* Main Visual Frame */}
          <div className="lg:col-span-7">
            <ScrollReveal delay={50}>
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#050A10] group">
                <img
                  src="/tours/barrels_garabashi.webp"
                  alt="High-Altitude Refuge Barrels-Garabashi 3800m, Mount Elbrus"
                  width={1000}
                  height={625}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B12] via-transparent to-transparent opacity-85" />

                {/* Sleek integrated telemetry bar */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="flex items-center gap-1.5 bg-[#060B12]/80 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
                    Gara-Bashi Slopes, 3,800 m
                  </span>
                  <span className="bg-[#060B12]/80 px-3 py-1.5 rounded-lg border border-white/10 text-[#FF6A00] font-bold backdrop-blur-sm">
                    1,842 m from West Summit
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Technical Protocol Spec Sheet */}
          <div className="lg:col-span-5">
            <ScrollReveal delay={100}>
              <div className="border-l-2 border-[#FF6A00]/60 pl-6 sm:pl-8 py-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] font-semibold text-[#FF6A00] mb-2">
                  Alpine Advantage
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  Guaranteed 94% Summit Success Rate
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6 font-sans">
                  Quality sleep at 3,800 meters is the single most decisive factor on summit day. Our heated wooden bunks and private chef catering allow climbers to preserve glycogen stores and minimize altitude sickness.
                </p>

                <div className="divide-y divide-white/[0.08] text-xs">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-400 font-sans">Heating System</span>
                    <span className="font-semibold text-slate-200">Continuous thermal heating units</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-400 font-sans">Catering Protocol</span>
                    <span className="font-semibold text-slate-200">Private chef &amp; hot 3-course meals</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-400 font-sans">Electricity</span>
                    <span className="font-semibold text-slate-200">220V evening generator charging</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-400 font-sans">Emergency Protocol</span>
                    <span className="font-semibold text-slate-200">Direct MCHS VHF frequency link</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Feature Grid: Open Architectural Specs (No heavy card boxes) */}
        <div className="pt-12 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {BARRELS_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <ScrollReveal key={feat.title} delay={idx * 40}>
                <div className="flex flex-col group">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-4 text-[#FF6A00] group-hover:border-[#FF6A00]/40 group-hover:bg-[#FF6A00]/5 transition-colors">
                    <Icon className="w-5 h-5 text-[#FF6A00]" strokeWidth={1.5} />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2 tracking-tight group-hover:text-[#FF6A00] transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                    {feat.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={100}>
          <div className="mt-14 text-center">
            <motion.div
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="inline-block"
            >
              <Link
                href="/barrels"
                className="inline-flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-xs uppercase tracking-[0.18em] px-7 py-3.5 rounded-xl border border-white/[0.12] hover:border-[#FF6A00]/50 transition-all shadow-lg min-h-[44px]"
              >
                <span>Explore Barrels Refuge &amp; Living Conditions</span>
                <ArrowRight className="w-4 h-4 text-[#FF6A00]" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

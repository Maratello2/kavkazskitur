'use client';

import { ShieldCheck, Radio, Plane, Users, CheckCircle2, FileCheck2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const SAFETY_PILLARS = [
  {
    icon: FileCheck2,
    title: 'FSB Border Zone Pass Clearance',
    subtitle: '100% Handled in Nalchik',
    desc: 'The central Caucasus lies along the international border zone with Georgia. Our office directly submits and secures the official FSB security permits for all domestic and foreign team members, eliminating bureaucratic delays.'
  },
  {
    icon: Radio,
    title: 'Satellite SOS & MCHS Registration',
    subtitle: 'Active 24/7 Tracking',
    desc: 'Every expedition carries two-way satellite emergency communicators (Garmin inReach / Iridium) and VHF radios. All groups are formally registered with the Elbrus Mountain Search and Rescue Detachment of EMERCOM (MCHS).'
  },
  {
    icon: Plane,
    title: 'Airport Logistics & 4x4 Expedition Fleet',
    subtitle: 'MRV & NAL Airport Pickup',
    desc: 'Door-to-door transport from Mineralnye Vody (MRV) and Nalchik (NAL) airports directly to our base hotels and high trailheads in specialized heavy-duty 4WD expedition vehicles.'
  },
  {
    icon: Users,
    title: '1:3 to 1:4 Guide-to-Climber Ratio',
    subtitle: 'Certified Mountain Masters',
    desc: 'Summit bids are conducted under strict low client-to-guide ratios. Our senior UIAGM/KMGA certified guides have completed hundreds of ascents across the Caucasus, Pamirs, and Tien Shan.'
  }
];

export default function LogisticsSection() {
  return (
    <section id="safety" className="py-24 sm:py-32 bg-[#060B12] relative text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold text-[#FF6A00] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
              Safety Protocols &amp; Legal Staging
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Comprehensive Alpine Logistics &amp; Safety
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans max-w-2xl">
              High-altitude mountaineering demands rigorous operational safety. Before you step on the glacial ice, every legal permit, emergency frequency, and transport route is locked down by our operational headquarters in Nalchik.
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Pillars: Open Architectural Station Layout (No heavy card boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {SAFETY_PILLARS.map((p, idx) => {
            const Icon = p.icon;
            const stationNum = `0${idx + 1}`;
            return (
              <ScrollReveal key={p.title} delay={idx * 40}>
                <div className="pt-6 border-t border-white/[0.08] flex flex-col h-full group">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="font-mono text-xs font-bold text-[#FF6A00] tracking-widest">
                      {stationNum}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#FF6A00] transition-colors" strokeWidth={1.5} />
                  </div>

                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400 mb-2">
                    {p.subtitle}
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 tracking-tight group-hover:text-[#FF6A00] transition-colors leading-snug">
                    {p.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans mt-auto">
                    {p.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Operational Credentials Strip: Seamless Hairline Integration */}
        <ScrollReveal delay={100}>
          <div className="pt-8 pb-4 border-t border-white/[0.08] flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Official Registry &amp; Alpine Accreditation
                </div>
                <div className="text-xs text-slate-400 mt-0.5 font-sans">
                  Registered Russian Tour Operator • Accredited with Russian Mountaineering Federation (FAR)
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-sans">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
                <span>Zero Bureaucracy for Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
                <span>Direct Satellite Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
                <span>Comprehensive Acclimatization</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Mountain, Compass, Wine, Waves, Users, Bus, MapPin, ChevronRight, ShieldCheck, Award, Phone } from 'lucide-react';
import AboutCompany from '@/src/components/AboutCompany';

export const metadata: Metadata = {
  title: 'About KavKazSkiTur — Mountain Guides & Caucasus Expeditions',
  description: 'Certified alpine mountain guiding company based in Nalchik, Kabardino-Balkaria. Organizing high-altitude ascents on Mt. Elbrus (5,642m), Mount Kazbek, and the Bezengi Wall since 2012.',
};

export default function AboutPage() {
  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-100 pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 font-mono">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#FF6A00]">About Us</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12 pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF6A00] mb-2">
            <Mountain size={14} />
            <span>Nalchik Headquarters • Est. 2012</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-4">
            About KavKazSkiTur
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Professional mountain guides, alpine logistics specialists, and high-altitude expedition outfitters. We operate private infrastructure at Mount Elbrus (Barrels Refuge 3,800m), maintain certified Russian Mountaineering Federation guide accreditation, and lead over 350 climbers safely to the highest summit in Europe each season.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-white font-mono">14+</span>
              <h3 className="text-sm font-bold text-[#FF6A00] mt-1 mb-2">Years of Expeditions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Operating continuous high-altitude mountaineering and backcountry freeride programs across the Greater Caucasus since 2012.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-white font-mono">3,800m</span>
              <h3 className="text-sm font-bold text-[#FF6A00] mt-1 mb-2">Garabashi Base Camp</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct ownership and year-round maintenance of heated mountain barrel shelters at the foot of Mount Elbrus.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-white font-mono">1:3</span>
              <h3 className="text-sm font-bold text-[#FF6A00] mt-1 mb-2">Guide-to-Climber Ratio</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maximum 3 climbers per certified lead guide on summit push night, with satellite communication and medical oxygen kits.
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <span className="text-2xl font-black text-white font-mono">100%</span>
              <h3 className="text-sm font-bold text-[#FF6A00] mt-1 mb-2">Official Border Passes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct clearance with FSB KBR for all alpine border zones, including Kazbek, Bezengi, and Adyr-Su valleys.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Directions Component */}
        <div className="mb-16">
          <AboutCompany />
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Ready to Plan Your Summit?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Talk directly to our lead expedition dispatchers in Nalchik to choose the optimal acclimatization schedule, dates, and gear rental.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/expeditions"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-950/40 transition-all cursor-pointer"
            >
              <span>Explore Expeditions</span>
            </Link>
            <a
              href="https://wa.me/79280828413?text=Hello!%20I%20would%20like%20to%20learn%20more%20about%20KavKazSkiTur%20and%20upcoming%20expeditions."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
            >
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

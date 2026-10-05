import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Handshake, ChevronRight, ShieldCheck, Bus, Mountain, MessageCircle, Mail, Phone, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'B2B Partners & DMC Ground Handling | KavKazSkiTur',
  description: 'Inbound ground operator and logistics handling in the Caucasus for international travel agencies, corporate clients, and mountaineering clubs. 4x4 transfers, refuge booking, and certified guiding.',
};

export default function PartnersPage() {
  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-100 pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 font-mono">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#FF6A00]">B2B & DMC Partners</span>
        </div>

        {/* Hero Section */}
        <div className="mb-12 pb-8 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF6A00] mb-2">
            <Handshake size={14} />
            <span>Destination Management Company • B2B Services</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-4">
            Partnership & Ground Handling
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            KavKazSkiTur serves as the premier Caucasus DMC for domestic and international tour operators, corporate clients, and mountaineering clubs. We handle all end-to-end ground services: high-altitude refuge allocations, 4x4 off-road logistics, certified mountain guiding, and FSB border zone clearances.
          </p>
        </div>

        {/* B2B Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/30 flex items-center justify-center text-[#FF6A00] mb-4">
                <Mountain size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Refuge & Accommodation Block Booking</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Guaranteed high-season bed blocks at Barrels Refuge (3,800m), LeapRus eco-hotel, and Valley base hotels in Terskol, Cheget, and Nalchik.
              </p>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-4 border-t border-white/[0.06]">
              <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Heated barrel units</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Full-board mountain chef service</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/30 flex items-center justify-center text-[#FF6A00] mb-4">
                <Bus size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Private 4x4 Fleet & Airport Transfers</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Dedicated Mercedes Sprinter and rugged 4WD mountain vehicles providing seamless transfers from Mineralnye Vody (MRV) and Nalchik (NAL) airports.
              </p>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-4 border-t border-white/[0.06]">
              <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> 24/7 airport dispatch</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Mountain baggage trailers</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/30 flex items-center justify-center text-[#FF6A00] mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Legal, Permits & Certified Guides</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Expedited FSB border clearance, EMERCOM (MCHSS) expedition registration, and English/Russian-speaking certified lead mountain guides.
              </p>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-4 border-t border-white/[0.06]">
              <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Group border permits</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={13} className="text-emerald-400" /> Satellite tracker provisions</li>
            </ul>
          </div>
        </div>

        {/* Contact Partner Dispatch */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Become a Partner / Request Agent Rates
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            We provide commissionable rates, net tariffs, and white-label operations for licensed tour agencies and international outfitters.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/79280828413?text=B2B%20Partnership%20Inquiry%0AHello!%20We%20are%20interested%20in%20partnering%20with%20KavKazSkiTur%20for%20Caucasus%20ground%20handling."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-950/40 transition-all cursor-pointer"
            >
              <MessageCircle size={16} />
              <span>WhatsApp B2B Desk</span>
            </a>
            <a
              href="mailto:info@kavkazskitur.com?subject=B2B%20Partnership%20Proposal"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
            >
              <Mail size={16} />
              <span>info@kavkazskitur.com</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

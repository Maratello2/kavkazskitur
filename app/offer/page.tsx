import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  CreditCard, 
  HeartHandshake, 
  PhoneCall, 
  Plane
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Public Offer & Expedition Safety Regulations | KavKazSkiTur',
  description: 'Official terms of service for mountaineering, ski-touring, and high-altitude trekking in the Caucasus. Lead guide authority, cancellation policies, mandatory alpine rescue insurance, and EMERCOM registration.',
};

export default function OfferPage() {
  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-200 pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FF6A00] hover:text-orange-300 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="border border-white/[0.08] rounded-2xl bg-[#08101A] p-6 sm:p-10 shadow-2xl space-y-10">
          {/* Header */}
          <div className="border-b border-white/[0.08] pb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#FF6A00] text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Article 437 Civil Code RF &bull; Expedition Regulations
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Public Offer &amp; Expedition Regulations
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Operator: LLC &quot;KavKazSkiTur&quot; &bull; Nalchik, KBR &bull; Season 2026 Terms
            </p>
          </div>

          {/* 1. SCOPE & ACCEPTANCE */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#FF6A00]" />
              <span>1. Subject of Agreement &amp; Offer Acceptance</span>
            </h2>
            <p>
              1.1. This document constitutes an official public offer (in accordance with Article 437 of the Civil Code of the Russian Federation) by <strong>LLC &quot;KavKazSkiTur&quot;</strong> (hereinafter referred to as the &quot;Operator&quot;) to conclude a service agreement for organizing high-altitude expeditions, mountaineering ascents, ski-touring, and trekking in the Caucasus mountains (Elbrus 5,642 m, Kazbek 5,033 m, Cheget, Bezengi).
            </p>
            <p>
              1.2. Unconditional acceptance of this offer occurs upon any of the following actions by the Client: submitting an advance deposit for the selected expedition, confirming a booking via official WhatsApp / Telegram support channels, or submitting a reservation form on this website. Upon acceptance, the agreement is legally binding.
            </p>
          </section>

          {/* 2. LEAD GUIDE AUTHORITY & SAFETY */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-amber-500/5 border border-amber-500/20 p-5 sm:p-6 rounded-2xl">
            <h2 className="text-base sm:text-lg font-bold text-amber-400 flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <span>2. Lead Guide Authority &amp; Mountain Safety Protocols</span>
            </h2>
            <p>
              High-altitude mountaineering entails inherent environmental risks: severe weather shifts, gale-force winds, avalanche hazard, rockfalls, crevasses, sub-zero temperatures, and Acute Mountain Sickness (hypoxia).
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 pl-1">
              <li>
                <strong>Absolute Guide Authority:</strong> The Operator&apos;s certified Lead Guide holds sole discretionary authority to make operational safety decisions: modifying the route, postponing summit push to a reserve day, or terminating the ascent.
              </li>
              <li>
                <strong>Mandatory Turnback Protocol:</strong> The Lead Guide is obligated to turn back the entire group or dispatch an individual participant back down accompanied by an assistant guide in cases of: severe storm forecasts, sheet ice conditions, exceeding turnaround cutoff times, or onset of mountain sickness (HAPE, HACE, loss of motor control).
              </li>
              <li>
                <strong>Disciplinary Regulations:</strong> The consumption of alcohol or psychoactive substances during active route segments, or venturing onto glaciers without safety rope and helmet, results in immediate expulsion without refund.
              </li>
            </ul>
          </section>

          {/* 3. BOOKING & CANCELLATION */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-[#FF6A00]" />
              <span>3. Booking, Payment &amp; Cancellation Policy</span>
            </h2>
            <p>
              3.1. To secure a place in the expedition team, the Client pays an advance deposit of 20% of the program fee. The remaining balance is payable prior to route departure during the organizational briefing in Terskol / Nalchik.
            </p>
            <p>
              3.2. Pursuant to <strong>Article 32 of the Consumer Protection Act</strong>, the Client may cancel the agreement at any time subject to reimbursing actual documented expenses incurred by the Operator:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
              <li><strong>Cancellation 30+ days prior to start:</strong> Deposit is 100% refunded (less banking processing fees), or can be rescheduled to any available 2026/2027 date without penalty.</li>
              <li><strong>Cancellation between 14 and 29 days prior:</strong> Non-refundable shelter hut reservations (Garabashi/Barrels) and advance team catering provisions are deducted; the remaining balance is refunded.</li>
              <li><strong>Cancellation within 14 days or no-show:</strong> Deposit is retained to cover non-refundable pre-booked alpine shelter beds, retained mountain guide contracts, and mountain logistics.</li>
            </ul>
          </section>

          {/* 4. INSURANCE & EMERCOM */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0A1424] border border-white/10 p-5 sm:p-6 rounded-2xl">
            <h2 className="text-base sm:text-lg font-bold text-cyan-300 flex items-center gap-2.5">
              <Plane className="w-5 h-5 text-cyan-400" />
              <span>4. Mandatory Alpine Insurance &amp; EMERCOM Rescue Registration</span>
            </h2>
            <p>
              4.1. Each participant joining an expedition operating above 3,500 m <strong>must hold specialized mountaineering/climbing insurance</strong> covering Search and Rescue (SAR), medical transport, and helicopter evacuation up to 5,642 m with coverage of not less than $30,000 / €30,000 (or equivalent in RUB).
            </p>
            <p>
              4.2. The Operator guarantees <strong>official registration of each team with EMERCOM Russia (KBR Search and Rescue Service)</strong> 10 business days prior to departure. Teams are equipped with VHF mountain radio communications, Garmin inReach satellite tracking beacons, and comprehensive expedition trauma medical kits.
            </p>
          </section>

          {/* 5. MEDICAL DECLARATION */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <HeartHandshake className="w-5 h-5 text-[#FF6A00]" />
              <span>5. Medical Fitness &amp; Technical Equipment</span>
            </h2>
            <p>
              The Client confirms having no medical contraindications for vigorous physical endurance at high altitudes (ischemic heart disease, severe hypertension, thrombosis, acute asthma, epilepsy). The Client agrees to attend the mandatory equipment check with the Lead Guide and rent certified technical gear (crampons, ice axe, double mountaineering boots, climbing harness) if required.
            </p>
          </section>

          {/* 6. OPERATOR DETAILS */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-6">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <PhoneCall className="w-5 h-5 text-[#FF6A00]" />
              <span>6. Operator Information &amp; Official Contacts</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white/[0.02] p-4 rounded-xl border border-white/[0.08]">
              <div>
                <span className="text-slate-400 block mb-0.5">Expedition Operator:</span>
                <strong className="text-white">LLC &quot;KavKazSkiTur&quot;</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Registered Address:</span>
                <strong className="text-white">360000, KBR, Nalchik, Gorky St. 74</strong>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Expedition Dispatch / WhatsApp:</span>
                <a href="https://wa.me/79280828413" className="text-[#FF6A00] font-bold hover:underline">
                  +7 (928) 082-84-13
                </a>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Official Inquiries:</span>
                <span className="text-white font-mono">info@kavkazskitur.com</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


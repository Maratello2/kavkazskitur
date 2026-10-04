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
  title: 'Public Offer & Expedition Service Agreement | KavKazSkiTur',
  description: 'Official terms of mountaineering expedition services, lead guide turnback authority, prepayment rules, mandatory alpine rescue insurance, and emergency evacuation protocols.',
};

export default function OfferPage() {
  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-200 pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* NAVIGATION */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FF6A00] hover:text-orange-300 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="border border-white/[0.08] rounded-2xl bg-white/[0.02] p-6 sm:p-10 shadow-2xl space-y-10">
          {/* HEADER */}
          <div className="border-b border-white/[0.08] pb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#FF6A00] text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Legal Service Contract
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Public Offer &amp; Expedition Regulations
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Operator: KavKazSkiTur LLC (TIN / OGRN Nalchik, KBR) &bull; Caucasus Alpine Service Terms 2026
            </p>
          </div>

          {/* SECTION 1: SUBJECT OF THE OFFER */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#FF6A00]" />
            <span>1. Subject of the Agreement</span>
          </h2>
          <p>
            This document constitutes a public offer in accordance with Article 437 of the Civil Code of the Russian Federation. By booking an expedition through our website (including WhatsApp redirection, email confirmation, or invoice payment), the Client accepts all provisions set forth in this Agreement without reservation.
          </p>
          <p>
            KavKazSkiTur organizes high-altitude guided mountaineering, ski-touring, and trekking expeditions in the Central Caucasus, including Mount Elbrus (5,642 m), Mount Kazbek (5,033 m), and adjacent high-altitude alpine routes.
          </p>
        </section>

        {/* SECTION 2: LEAD GUIDE AUTHORITY & SAFETY PROTOCOLS */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl">
          <h2 className="text-base sm:text-lg font-bold text-amber-400 flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>2. Lead Guide Turnback Authority &amp; Alpine Safety</span>
          </h2>
          <p>
            High-altitude mountaineering involves inherent objective environmental risks (drastic weather changes, lightning strikes, severe blizzards, sub-zero windchills, crevasses, rockfalls, and acute mountain sickness). 
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-1">
            <li>
              <strong>Absolute Authority:</strong> The appointed KavKazSkiTur senior certified guide possesses unconditional authority to make operational safety decisions, including route alteration, postponement, or the immediate termination of an ascent.
            </li>
            <li>
              <strong>Compulsory Turnaround:</strong> The guide may turn back the entire team or require individual climbers to descend under assistant guide escort if weather forecasts predict critical storms, if avalanche danger rises, or if any climber exhibits symptoms of Acute Mountain Sickness (AMS), High-Altitude Pulmonary Edema (HAPE), or High-Altitude Cerebral Edema (HACE).
            </li>
            <li>
              <strong>Zero-Tolerance Discipline:</strong> Alcohol consumption, narcotic use, or intentional disregard of ropes and safety harness commands results in immediate expulsion from the expedition without reimbursement.
            </li>
          </ul>
        </section>

        {/* SECTION 3: PREPAYMENT, DEPOSIT & CANCELLATION */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-[#C2410C]" />
            <span>3. Booking, Prepayment &amp; Cancellation Policies</span>
          </h2>
          <p>
            To secure an expedition slot, a booking deposit of 20% of the total tour price is required upon registration. The remaining balance is payable prior to expedition departure at the briefing in Terskol / Nalchik.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-300">
            <li>Cancellation 30+ days prior to start: Full refund minus banking transaction commissions (or 100% transfer of deposit to any future 2026/2027 date).</li>
            <li>Cancellation 14–29 days prior to start: Deposit retained for actual refuge reservation expenses, or transferable to alternate dates with mutual agreement.</li>
            <li>Cancellation under 14 days or no-show: Deposit non-refundable due to non-refundable lodging reservations at Barrels Refuge and guide reservation fees.</li>
          </ul>
        </section>

        {/* SECTION 4: MANDATORY ALPINE INSURANCE & EMERCOM */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#08101A] border border-white/10 p-5 rounded-2xl">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
            <Plane className="w-5 h-5 text-[#C2410C]" />
            <span>4. Mandatory Mountain Rescue Insurance &amp; Evacuation</span>
          </h2>
          <p>
            Every climber taking part in an ascent above 3,500 m must present valid <strong>Extreme Sports &amp; Mountaineering Accident Insurance</strong> covering search &amp; rescue operations and helicopter medical evacuation up to 5,642 m with minimum coverage of 30,000 EUR (or equivalent).
          </p>
          <p>
            All KavKazSkiTur expeditions are officially registered with the <strong>Main Directorate of EMERCOM of Russia (MCHS) for Kabardino-Balkaria</strong>. Emergency rescue operations are conducted in strict synchronization with regional rescue squads and state aviation.
          </p>
        </section>

        {/* SECTION 5: GEAR & FITNESS DECLARATION */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
            <HeartHandshake className="w-5 h-5 text-[#C2410C]" />
            <span>5. Health Declaration &amp; Equipment Requirements</span>
          </h2>
          <p>
            Climbers affirm they do not suffer from contraindicative cardiovascular conditions, severe respiratory ailments, or unmanaged chronic illnesses. Participants agree to inspect personal mountaineering equipment with the lead guide before departure and rent any certified gear (boots, crampons, ice axe, harness) missing from their inventory.
          </p>
        </section>

        {/* SECTION 6: CONTACTS & LEGAL DISPUTES */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-6">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
            <PhoneCall className="w-5 h-5 text-[#C2410C]" />
            <span>6. Company Details &amp; Operational Contacts</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white/[0.02] p-4 rounded-xl border border-white/[0.08]">
            <div>
              <span className="text-slate-400 block mb-0.5">Expedition Operator:</span>
              <strong className="text-white">KavKazSkiTur LLC</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Headquarters Address:</span>
              <strong className="text-white">Gorkogo St., 74, Nalchik, KBR, Russia</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Direct WhatsApp / Duty Guide:</span>
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

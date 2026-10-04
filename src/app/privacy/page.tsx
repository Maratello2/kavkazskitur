import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock, FileText, CheckCircle2, Cookie, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Personal Data Protection (152-FZ) | KavKazSkiTur',
  description: 'Policy regarding personal data processing, cookie usage, and privacy compliance under Federal Law No. 152-FZ for KavKazSkiTur expeditions.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#08101A] text-slate-200 pt-28 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C2410C] hover:text-[#9A3412] mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="border border-white/10 rounded-3xl bg-[#0E1F33] p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C2410C]/10 border border-[#C2410C]/30 text-[#C2410C] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" />
            Official Compliance Statement
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Personal Data Processing Policy &amp; Cookie Notice
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Operator: KavKazSkiTur LLC / Expedition Center &bull; Nalchik, Kabardino-Balkar Republic &bull; Effective: 2026
          </p>
        </div>

        {/* 1. GENERAL PROVISIONS */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C2410C]" />
            1. General Provisions &amp; Legal Basis
          </h2>
          <p>
            This Policy sets forth the principles, conditions, and procedures for processing personal data in accordance with
            <strong> Federal Law of the Russian Federation No. 152-FZ &quot;On Personal Data&quot;</strong>, as well as applicable international standards.
          </p>
          <p>
            The operator of personal data is <strong>KavKazSkiTur LLC</strong> (operating address: Gorkogo St., 74, Nalchik, Kabardino-Balkarian Republic, Russian Federation).
          </p>
        </section>

        {/* 2. SCOPE OF DATA */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#C2410C]" />
            2. Scope of Collected Data
          </h2>
          <p>We only collect and process personal data necessary to organize high-altitude expeditions, alpine safety protocols, and border permits:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li><strong>Name and Contact Information:</strong> Full name, phone number, WhatsApp identifier, and email address;</li>
            <li><strong>Expedition Preferences:</strong> Selected route, preferred dates, gear rental requests, and dietary needs;</li>
            <li><strong>Official Permit Details:</strong> Date of birth, passport details (strictly for FSB border zone permits and EMERCOM / MCHS registration);</li>
            <li><strong>Emergency Information:</strong> Emergency contact phone and personal medical self-declarations for high-altitude fitness (3,800 m &ndash; 5,642 m).</li>
          </ul>
        </section>

        {/* 3. COOKIE USAGE */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#08101A] p-5 rounded-2xl border border-white/10">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cookie className="w-4 h-4 text-[#C2410C]" />
            3. Cookie Usage &amp; Analytical Technologies
          </h2>
          <p>
            Our website utilizes session and persistent cookies to enhance navigation, analyze site performance, and remember user preferences (such as cookie consent and filter settings).
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
            <li><strong>Strictly Necessary Cookies:</strong> Required for secure authentication, form submissions, and administrative sessions;</li>
            <li><strong>Performance &amp; Analytics:</strong> Aggregated anonymous statistics regarding page load speeds and visitor flow;</li>
            <li><strong>Consent Management:</strong> Stored via <code>kavkaz_cookie_consent</code> in your browser&apos;s local storage.</li>
          </ul>
          <p className="text-slate-400 text-xs">
            You may disable or delete cookies via your browser settings at any time, although certain interactive features of the website may function with limited efficiency.
          </p>
        </section>

        {/* 4. PURPOSES OF PROCESSING */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#C2410C]" />
            4. Purposes of Data Processing
          </h2>
          <p>Your data is processed strictly for:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
            <li>Promptly processing booking inquiries, WhatsApp customer support, and expedition slot reservation;</li>
            <li>Mandatory registration of groups with the Main Directorate of EMERCOM of Russia (MCHS) for Kabardino-Balkaria;</li>
            <li>Filing official border zone access permits with the Border Guard Service of the FSB of Russia;</li>
            <li>Reserving high-altitude accommodation at Barrels Refuge (Gara-Bashi, 3,800 m) and providing logistical transfers.</li>
          </ul>
        </section>

        {/* 5. DATA SECURITY & RIGHTS */}
        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#C2410C]" />
            5. User Rights, Security &amp; Contact
          </h2>
          <p>
            The Operator does not sell, lease, or transfer personal data to unauthorized third parties. All communications are protected using SSL/TLS encryption. You possess the unconditional right to request information on stored data, update records, or request complete deletion of personal records.
          </p>
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs space-y-1.5">
            <div><strong>Data Protection Officer:</strong> KavKazSkiTur Legal Department</div>
            <div><strong>Email:</strong> privacy@kavkazskitur.com &bull; info@kavkazskitur.com</div>
            <div><strong>Address:</strong> Gorkogo St., 74, Nalchik, Kabardino-Balkarian Republic, Russia</div>
            <div><strong>Direct WhatsApp Dispatch:</strong> <a href="https://wa.me/79280828413" className="text-[#C2410C] underline font-bold">+7 (928) 082-84-13</a></div>
          </div>
        </section>
      </div>
    </div>
  );
}

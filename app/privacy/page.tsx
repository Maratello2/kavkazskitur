import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock, FileText, CheckCircle2, Cookie, UserCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Personal Data Protection | KavKazSkiTur',
  description: 'Official privacy policy and personal data protection protocol in accordance with Federal Law No. 152-FZ. Expedition Center KavKazSkiTur, Nalchik, KBR.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-200 pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FF6A00] hover:text-orange-300 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="border border-white/[0.08] rounded-2xl bg-[#08101A] p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Header */}
          <div className="border-b border-white/[0.08] pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#FF6A00] text-[10px] font-mono font-bold uppercase tracking-wider mb-3">
              <Shield className="w-3.5 h-3.5" />
              Data Protection &bull; Federal Law 152-FZ Compliant
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              Personal Data Processing Policy &amp; Cookie Notice
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Operator: LLC &ldquo;KavKazSkiTur&rdquo; &bull; Nalchik, Kabardino-Balkaria &bull; Active Season 2026 Edition
            </p>
          </div>

          {/* 1. GENERAL PROVISIONS */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FF6A00]" />
              1. General Provisions &amp; Legal Basis
            </h2>
            <p>
              1.1. This Personal Data Processing Policy (hereinafter &mdash; the &ldquo;Policy&rdquo;) governs the collection, storage, transfer, and protection of personal data of visitors to <strong>kavkazskitur.com</strong> (hereinafter &mdash; the &ldquo;Website&rdquo;) in compliance with Russian Federal Law No. 152-FZ &ldquo;On Personal Data&rdquo; dated July 27, 2006, and international personal data security standards.
            </p>
            <p>
              1.2. The designated Data Operator is <strong>LLC &ldquo;KavKazSkiTur&rdquo;</strong> (Registered address: Gorkogo St. 74, Nalchik, Kabardino-Balkarian Republic, Russian Federation, 360000).
            </p>
            <p>
              1.3. Using Website services, filling out expedition booking forms, submitting callback requests, or communicating via WhatsApp/Telegram implies unconditional acceptance of this Policy.
            </p>
          </section>

          {/* 2. CATEGORIES OF PROCESSED DATA */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FF6A00]" />
              2. Categories of Processed Personal Data
            </h2>
            <p>
              The Operator processes only personal information strictly necessary for the safe organization of mountaineering ascents, mountain rescue coordination, and client communication:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
              <li><strong>Contact Information:</strong> Full name, telephone number, WhatsApp/Telegram account handle, email address;</li>
              <li><strong>Expedition Booking Parameters:</strong> Selected route (Mt. Elbrus South/North, Kazbek, ski tour), scheduled arrival dates, high-altitude gear rental requirements;</li>
              <li><strong>Official Permit &amp; Safety Registration Data:</strong> Passport details (series, number, issuing authority, date of birth) &mdash; <em>requested exclusively when required for mandatory FSB border zone security clearance and EMERCOM mountain rescue registration</em>;</li>
              <li><strong>Emergency Contact Details:</strong> Emergency contact name and phone number, certification of medical fitness for high-altitude ascents exceeding 3,500 meters.</li>
            </ul>
          </section>

          {/* 3. PURPOSE OF PROCESSING */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF6A00]" />
              3. Purposes of Data Processing
            </h2>
            <p>Personal data is processed strictly for the following purposes:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
              <li>Processing expedition applications, reserving slots in guided climbing groups, and executing direct concierge communication;</li>
              <li><strong>Mandatory Mountain Rescue Registration with EMERCOM</strong> (submitted no later than 10 business days prior to expedition departure pursuant to Federal Law No. 132-FZ and EMERCOM regulations);</li>
              <li>Filing collective or individual border security permits with the Border Guard Service of the FSB of Russia;</li>
              <li>Reserving high-altitude accommodation at mountain refuges (Gara-Bashi Barrels 3,800 m) and arranging 4x4 off-road logistics.</li>
            </ul>
          </section>

          {/* 4. LOCALIZATION & DATA STORAGE */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0A1424] p-5 rounded-2xl border border-white/10">
            <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400" />
              4. Data Localization &amp; Sovereign Storage (Art. 18, Part 5, 152-FZ)
            </h2>
            <p>
              The Operator confirms that during the collection of personal data, recording, systematization, accumulation, storage, clarification, and retrieval are performed using server infrastructure located strictly within certified Russian datacenters.
            </p>
            <p className="text-slate-400 text-xs">
              Cross-border data transfers are not conducted without express prior written consent from the data subject.
            </p>
          </section>

          {/* 5. COOKIE USAGE */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cookie className="w-4 h-4 text-[#FF6A00]" />
              5. Cookie Policy &amp; Web Analytics
            </h2>
            <p>
              The Website uses cookies and telemetry tools to ensure optimal user experience, maintain interactive 3D WebGL components, and evaluate service performance:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
              <li><strong>Technical Cookies:</strong> Required for the proper operation of interactive topographic maps, 3D viewport canvas rendering, and user sessions;</li>
              <li><strong>Analytical Cookies:</strong> Collected anonymously to evaluate page performance, fix errors, and optimize Core Web Vitals;</li>
              <li><strong>Cookie Management:</strong> Users can disable or clear cookies at any time via web browser settings.</li>
            </ul>
          </section>

          {/* 6. USER RIGHTS */}
          <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.08] pt-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#FF6A00]" />
              6. Data Subject Rights &amp; Consent Revocation
            </h2>
            <p>
              Users hold the right to access information regarding the processing of their personal data, to request rectification, blocking, or destruction if data is incomplete, outdated, or unlawfully processed.
            </p>
            <p>
              Consent may be revoked at any time by sending a written notice to: <strong>info@kavkazskitur.com</strong> with the subject line &ldquo;Revocation of Personal Data Processing Consent&rdquo;. The Operator terminates processing within 10 business days from receipt.
            </p>

            {/* Operator Credentials */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs space-y-2 mt-4">
              <div className="font-bold text-white text-sm mb-1">Data Controller Headquarters:</div>
              <div><strong>Operator:</strong> LLC &ldquo;KavKazSkiTur&rdquo; (Expedition Center KavKazSkiTur)</div>
              <div><strong>Legal Address:</strong> Gorkogo St. 74, Nalchik, Kabardino-Balkarian Republic, 360000</div>
              <div><strong>Operations Line:</strong> +7 (928) 082-84-13 / +7 (928) 691-44-05</div>
              <div><strong>Official Email:</strong> info@kavkazskitur.com</div>
              <div><strong>WhatsApp Concierge:</strong> <a href="https://wa.me/79280828413" className="text-[#FF6A00] underline font-bold">+7 (928) 082-84-13</a></div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  FileText, 
  Radio, 
  Users, 
  PhoneCall, 
  LifeBuoy
} from 'lucide-react';

export default function SafetyClient() {
  const [formData, setFormData] = useState({ name: '', phone: '', citizenship: 'International', consent: false });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm consent to personal data processing (152-FZ Privacy Policy).');
      return;
    }
    setIsSubmitting(true);

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          tour_name: 'Border Pass / Insurance / Safety Inquiry',
          comment: `Citizenship: ${formData.citizenship}`,
          consent_152fz: true
        })
      });
    } catch {
      // fallback
    }

    const text = encodeURIComponent(
      `Border Pass & Safety Inquiry:\nName: ${formData.name}\nPhone: ${formData.phone}\nCitizenship: ${formData.citizenship}`
    );
    window.open(`https://wa.me/79286914405?text=${text}`, '_blank');
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-16">
      
      {/* 6 KEY PILLARS OF SAFETY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* 1. BORDER PASSES */}
        <div className="bg-[#0E1F33] p-7 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/15 flex items-center justify-center text-[#C2410C]">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              FSB Border Security Permits
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Many climbing routes in Prielbrusye and Bezengi enter the restricted 5 km frontier zone along the Greater Caucasus crest. We handle all legal paperwork and official FSB border security permits:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-1">
              <li>• International citizens: submitted 30 business days ahead</li>
              <li>• Russian citizens: submitted 15 business days ahead</li>
              <li>• Full coordination handled directly by KavKazSkiTur</li>
            </ul>
          </div>
        </div>

        {/* 2. EMERCOM REGISTRATION */}
        <div className="bg-[#0E1F33] p-7 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              EMERCOM Mountain Rescue Registry
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              10 days prior to launch, every expedition is registered in the official database of the Elbrus High-Mountain Search & Rescue Unit (Terskol).
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-1">
              <li>• Rescuers track exact route, staging camps, and group roster</li>
              <li>• Daily radio check-ins at 08:00 AM and 08:00 PM</li>
              <li>• On-call snowcat and emergency rescue sleds on standby</li>
            </ul>
          </div>
        </div>

        {/* 3. CERTIFIED GUIDES */}
        <div className="bg-[#0E1F33] p-7 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              UIAGM / FAR Certified Mountain Guides
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              KavKazSkiTur lead guides hold certified instructor credentials from the Russian Mountaineering Federation and Association of Mountain Guides, adhering to international standards.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-1">
              <li>• Strict 1:3 guide-to-climber ratio on summit day</li>
              <li>• Certified Wilderness First Aid (WFA) practitioners</li>
              <li>• Regular glacier crevasse rescue and avalanche drills</li>
            </ul>
          </div>
        </div>

        {/* 4. SATELLITE TRACKING */}
        <div className="bg-[#0E1F33] p-7 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 flex items-center justify-center text-sky-400">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Garmin InReach & Iridium Satellite
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In cellular dead zones, the lead guide carries a Garmin InReach GPS tracker and an Iridium Extreme satellite communicator.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-1">
              <li>• Real-time GPS coordinate telemetry updated every 20 min</li>
              <li>• Dedicated SOS beacon triggering instant air rescue response</li>
              <li>• Dual-band VHF radios tuned to EMERCOM emergency channel</li>
            </ul>
          </div>
        </div>

        {/* 5. HELICOPTER EVACUATION */}
        <div className="bg-[#0E1F33] p-7 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 flex items-center justify-center text-purple-400">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Helicopter Rescue & Insurance
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every participant must have mountaineering medical insurance covering high-altitude search and rescue with aviation assets.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-1">
              <li>• Minimum recommended coverage: $30,000–$50,000 USD</li>
              <li>• Direct partner agreement with Heliaction helicopter rescue</li>
              <li>• KavKazSkiTur private emergency contingency fund</li>
            </ul>
          </div>
        </div>

        {/* 6. MEDICAL OXYGEN & TRAUMA KITS */}
        <div className="bg-[#0E1F33] p-7 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-400">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Emergency Oxygen & First Aid
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              At Barrels Refuge (3,800 m) and on the summit push, guides maintain portable medical oxygen cylinders and non-rebreather masks to treat severe hypoxia.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 pt-1">
              <li>• High-altitude injectable medications and hyperbaric bags</li>
              <li>• Daily pulse oximetry monitoring for all climbers</li>
              <li>• SAM Splints and comprehensive trauma kits</li>
            </ul>
          </div>
        </div>

      </div>

      {/* PERMIT APPLICATION FORM WITH 152-FZ */}
      <section className="bg-gradient-to-br from-[#0E1F33] to-[#08101A] rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
            Visa & Frontier Pass Assistance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Complimentary Border Pass Processing
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Submit your details and our visa officer in Nalchik will reach out to collect the required passport copies and file your permit application.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-3 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 p-5">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Request Received!</h4>
              <p className="text-xs text-slate-300">
                We have opened a WhatsApp chat and sent the document checklist for your border security permit.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-[#08101A]/80 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Full Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sergey Ivanov"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0E1F33] border border-white/15 focus:border-[#C2410C] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone / WhatsApp:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0E1F33] border border-white/15 focus:border-[#C2410C] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Citizenship:
                </label>
                <select
                  value={formData.citizenship}
                  onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                  className="w-full bg-[#0E1F33] border border-white/15 focus:border-[#C2410C] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="International">International Citizen (Processed in 30 days)</option>
                  <option value="EAEU / CIS">EAEU / CIS Citizen (Processed in 30 days)</option>
                  <option value="Russian Federation">Russian Citizen (Processed in 15 days)</option>
                </select>
              </div>

              {/* MANDATORY 152-FZ CONSENT */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-white/20 bg-[#08101A] text-[#C2410C] focus:ring-[#C2410C] accent-[#C2410C] w-4 h-4 shrink-0"
                  />
                  <span className="leading-tight">
                    I agree to the processing of personal data in accordance with the{' '}
                    <Link href="/privacy" className="text-[#C2410C] underline hover:text-orange-400" target="_blank">
                      Privacy Policy (152-FZ)
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending...' : 'Request Permit Processing'}</span>
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}

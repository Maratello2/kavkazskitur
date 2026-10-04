'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Send, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Coffee, 
  Compass, 
  ShieldCheck, 
  Droplet,
  Moon
} from 'lucide-react';

export default function BarrelsClient() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dates: '',
    guests: '1',
    consent: false
  });
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
          tour_name: 'Barrels Refuge Booking (3,800 m)',
          comment: `Dates: ${formData.dates}. Guests: ${formData.guests}`,
          consent_152fz: true
        })
      });
    } catch {
      // fallback
    }

    const text = encodeURIComponent(
      `Barrels Refuge Reservation Inquiry (3,800 m):\nDates: ${formData.dates}\nGuests: ${formData.guests}\nName: ${formData.name}\nPhone: ${formData.phone}`
    );
    window.open(`https://wa.me/79286914405?text=${text}`, '_blank');
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-16">
      {/* 4 KEY ADVANTAGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0E1F33] p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center text-[#C2410C]">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Heated up to +22°C</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Electric convectors and heavy basalt thermal insulation. Dry and comfortable even in -30°C blizzard conditions.
          </p>
        </div>

        <div className="bg-[#0E1F33] p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">220V Electric Power</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Full AC wall outlets for charging smartphones, camera batteries, satellite devices, and radios without limitation.
          </p>
        </div>

        <div className="bg-[#0E1F33] p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
            <Coffee className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">High-Altitude Chef</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Three hot, chef-crafted meals daily: hearty soups, fresh meat, vegetables, and high-altitude Caucasian herbal teas.
          </p>
        </div>

        <div className="bg-[#0E1F33] p-6 rounded-2xl border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Rescue Radio & Medical</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Direct EMERCOM radio base station, medical oxygen cylinders, pulse oximetry monitoring, and emergency rescue sleds.
          </p>
        </div>
      </div>

      {/* ACCLIMATIZATION RULES AT 3,800 M */}
      <section className="bg-[#0E1F33] rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl space-y-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#C2410C] mb-2">
            Altitude 3,800 Meters • High-Altitude Medical Guidelines
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Acclimatization Rules at Barrels Refuge
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl mt-2 leading-relaxed">
            The altitude gain from the valley (Terskol, 2,150 m) to Gara-Bashi (3,800 m) takes just 20 minutes by cableway. The human body experiences a rapid reduction in effective atmospheric oxygen pressure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#08101A] p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2.5 text-[#C2410C] font-bold text-sm">
              <Droplet className="w-5 h-5" />
              <span>1. Mandatory Hydration (4–5 L)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              At 3,800 m, humidity drops drastically and breathing rate doubles. Drink warm herbal tea, electrolyte water, and berry infusions even when not thirsty.
            </p>
          </div>

          <div className="bg-[#08101A] p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2.5 text-[#C2410C] font-bold text-sm">
              <Compass className="w-5 h-5" />
              <span>2. Climb High, Sleep Low</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Perform active daytime radial sorties to Pastukhov Rocks (4,800 m) or Refuge 11 (4,050 m), rest at altitude for 30–40 minutes, then descend to sleep at the Barrels (3,800 m).
            </p>
          </div>

          <div className="bg-[#08101A] p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center gap-2.5 text-[#C2410C] font-bold text-sm">
              <Moon className="w-5 h-5" />
              <span>3. Pulse & SpO₂ Monitoring</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Guides measure blood oxygen saturation every morning and evening. Normal day 1 saturation at 3,800 m is 80–88%, stabilizing to 89–93% by day 3.
            </p>
          </div>
        </div>
      </section>

      {/* BOOKING FORM WITH 152-FZ */}
      <section className="bg-gradient-to-br from-[#0E1F33] to-[#08101A] rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
            Direct Outfitter Booking • No Middlemen
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Reserve Beds at Barrels Refuge for 2026
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Submit an inquiry for individual lodging or a full expedition package. We will check availability for your dates within minutes.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {submitted ? (
            <div className="text-center py-8 space-y-3 bg-emerald-950/50 rounded-2xl border border-emerald-500/40 p-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Inquiry Received!</h4>
              <p className="text-xs text-slate-300">
                Our base camp manager will message you via WhatsApp within 10 minutes to confirm bed allocation and dates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-[#08101A]/80 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Requested Dates:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., July 10–15, 2026"
                    value={formData.dates}
                    onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                    className="w-full bg-[#0E1F33] border border-white/15 focus:border-[#C2410C] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Number of Climbers:
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full bg-[#0E1F33] border border-white/15 focus:border-[#C2410C] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                    <option value="3-4">3–4 people</option>
                    <option value="5-8">5–8 people (group)</option>
                    <option value="9+">9+ people (large team)</option>
                  </select>
                </div>
              </div>

              {/* MANDATORY 152-FZ CONSENT */}
              <div className="pt-2">
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
                className="w-full inline-flex items-center justify-center gap-2 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-xl transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Checking Availability...' : 'Request Bed Availability'}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Droplet, 
  Dumbbell, 
  AlertTriangle, 
  CheckCircle2, 
  Send
} from 'lucide-react';

export default function AcclimatizationClient() {
  const [formData, setFormData] = useState({ name: '', phone: '', question: '', consent: false });
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
          tour_name: 'Medical Consultation / Acclimatization Question',
          comment: formData.question,
          consent_152fz: true
        })
      });
    } catch {
      // fallback
    }

    const text = encodeURIComponent(
      `Medical & Acclimatization Inquiry for Elbrus:\nName: ${formData.name}\nPhone: ${formData.phone}\nQuestion: ${formData.question}`
    );
    window.open(`https://wa.me/79286914405?text=${text}`, '_blank');
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-16">
      
      {/* 1. STEPPED ROTATION SCHEDULE ("CLIMB HIGH, SLEEP LOW") */}
      <section className="bg-[#0E1F33] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
              Golden Rule of Mountaineering
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Stepped («Sawtooth») Altitude Rotation Curve
            </h2>
          </div>
          <span className="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 self-start">
            8-Day Classic Rotation Protocol
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-[#08101A] p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="text-xs font-bold text-[#C2410C]">Days 1–2</div>
            <div className="text-lg font-black text-white">2,150 m → 3,100 m</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Overnight in Terskol (2,150 m). Light day treks to Mt. Cheget and Terskol Peak Observatory (3,100 m). Return to sleep low in the valley.
            </p>
          </div>

          <div className="bg-[#08101A] p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="text-xs font-bold text-[#C2410C]">Days 3–4</div>
            <div className="text-lg font-black text-white">3,800 m → 4,050 m</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Move to Barrels Refuge (3,800 m). Glacier crampon drills and hike up to Refuge 11 (4,050 m). Body adapts to sleeping at 3,800 m.
            </p>
          </div>

          <div className="bg-[#08101A] p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="text-xs font-bold text-[#C2410C]">Days 5–6</div>
            <div className="text-lg font-black text-white">4,800 m → Rest Day</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Key acclimatization push to Pastukhov Rocks (4,800 m). Next day: full rest, deep sleep, and glycogen restoration.
            </p>
          </div>

          <div className="bg-[#08101A] p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="text-xs font-bold text-[#C2410C]">Days 7–8</div>
            <div className="text-lg font-black text-white">5,642 m (Summit Push)</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Midnight summit push at the peak of the physiological adaptation window. Descend to 3,800 m and down to valley the same day.
            </p>
          </div>
        </div>
      </section>

      {/* 2. AMS SYMPTOMS & LAKE LOUISE SCORE */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
            Medical Protocols
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Acute Mountain Sickness (AMS) Symptoms
          </h2>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            AMS develops due to reduced partial oxygen pressure. KavKazSkiTur guides monitor every climber’s vitals and SpO₂ twice daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0E1F33] p-6 rounded-2xl border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Mild Adaptation (Normal)</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>• Mild shortness of breath on steep steps</li>
              <li>• Slight evening headache relieved by ibuprofen</li>
              <li>• Elevated resting heart rate (80–95 bpm)</li>
              <li>• SpO₂ blood saturation: 82–89%</li>
            </ul>
          </div>

          <div className="bg-[#0E1F33] p-6 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Moderate AMS (Caution)</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>• Throbbing headache, nausea, appetite loss</li>
              <li>• Insomnia and Cheyne-Stokes periodic breathing</li>
              <li>• Dizziness when standing up</li>
              <li>• <strong>Protocol:</strong> rest, heavy hydration, cease ascent</li>
            </ul>
          </div>

          <div className="bg-[#0E1F33] p-6 rounded-2xl border border-red-500/40 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Severe HAPE / HACE (Emergency)</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li>• Ataxia (loss of physical coordination, drunken gait)</li>
              <li>• Shortness of breath while resting, chest rales</li>
              <li>• Confusion, severe apathy, cyanosis of lips</li>
              <li>• <strong>Mandatory Rule:</strong> IMMEDIATE DESCENT TO VALLEY!</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. HYDRATION & NUTRITION */}
      <section className="bg-[#0E1F33] rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
          <Droplet className="w-6 h-6 text-blue-400" />
          <span>Hydration & Nutrition at Extreme Altitude</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#08101A] p-5 rounded-2xl border border-white/5 space-y-3">
            <h4 className="text-sm font-bold text-[#C2410C] uppercase tracking-wider">
              Hydration: 4–5 Liters Daily
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              At high altitude, blood thickens from rapid breathing and arid glacial air. Thick blood impairs oxygen delivery and dramatically escalates frostbite risk. Drink warm herbal tea, electrolyte solutions, and vitamin C infusions continuously.
            </p>
          </div>

          <div className="bg-[#08101A] p-5 rounded-2xl border border-white/5 space-y-3">
            <h4 className="text-sm font-bold text-[#C2410C] uppercase tracking-wider">
              Carbohydrate-Dense Fueling
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Metabolizing fat requires 30% more oxygen — a scarce resource at 5,000+ meters. Base your expedition nutrition on easily digestible carbohydrates: oatmeal, hot soups, pasta, dried fruits, dark chocolate, and energy gels.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PRE-TRIP PHYSICAL CONDITIONING */}
      <section className="bg-[#0E1F33] rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
          <Dumbbell className="w-6 h-6 text-[#C2410C]" />
          <span>Physical Conditioning Plan (2–3 Months Out)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#08101A] p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="text-xs font-bold text-[#C2410C]">1. Aerobic Base Building</div>
            <div className="text-sm font-bold text-white">Zone 2 Running 10–15 km</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              3 times per week at conversational pace (130–145 bpm) expands cardiac stroke volume and muscular capillary networks.
            </p>
          </div>

          <div className="bg-[#08101A] p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="text-xs font-bold text-[#C2410C]">2. Weighted Stair Climbing</div>
            <div className="text-sm font-bold text-white">50–70 Flights with 12 kg</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stair climbing with a weighted pack directly replicates quadriceps fatigue on steep summit ascents.
            </p>
          </div>

          <div className="bg-[#08101A] p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="text-xs font-bold text-[#C2410C]">3. Medical Checkup</div>
            <div className="text-sm font-bold text-white">Stress ECG & Blood Panel</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Screen hemoglobin and ferritin levels, visit your dentist (subclinical tooth infections flare painfully under low atmospheric pressure).
            </p>
          </div>
        </div>
      </section>

      {/* 5. MEDICAL INQUIRY FORM WITH 152-FZ */}
      <section className="bg-gradient-to-br from-[#0E1F33] to-[#08101A] rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C]">
            Personal Consultation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Ask Our Expedition Medical Officer
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Unsure about fitness levels, blood pressure, or medications? Our senior sports physician answers all medical questions personally.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-3 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 p-5">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Question Sent!</h4>
              <p className="text-xs text-slate-300">
                We have opened a WhatsApp chat with our expedition physician for a personal response.
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
                  placeholder="Ivan Petrov"
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
                  Your Question or Health Conditions:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Past altitude experience, blood pressure concerns, current medications..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full bg-[#0E1F33] border border-white/15 focus:border-[#C2410C] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
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
                <span>{isSubmitting ? 'Sending...' : 'Request Medical Consultation'}</span>
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}

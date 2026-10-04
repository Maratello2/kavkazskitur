'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Mountain,
  ShieldCheck, 
  Send
} from 'lucide-react';
import { TourData, ItineraryDay } from '@/data/toursData';

interface Props {
  tour: TourData;
}

export default function TourDetailClient({ tour }: Props) {
  const [openDays, setOpenDays] = useState<number[]>([1]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    selectedDate: tour.schedule2026[0]?.dates || '',
    comment: '',
    website_hp: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleDay = (dayNum: number) => {
    setOpenDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const expandAll = () => {
    setOpenDays(tour.itinerary.map((item) => item.day));
  };

  const collapseAll = () => {
    setOpenDays([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm consent to the Terms of Service and Privacy Policy.');
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          tourName: tour.title,
          dates: formData.selectedDate,
          comment: formData.comment,
          website_hp: formData.website_hp,
          consent: formData.consent,
        }),
      });

      const data = await res.json();
      if (data.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
      }
      setSubmitted(true);
    } catch {
      const fallbackWa = `https://wa.me/79280828413?text=${encodeURIComponent(
        `Expedition Booking Request\n\nTour: ${tour.title}\nDates: ${formData.selectedDate}\nName: ${formData.name}\nPhone: ${formData.phone}`
      )}`;
      window.open(fallbackWa, '_blank');
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      
      {/* LEFT COLUMN: ROUTE DETAILS (8 COLUMNS) */}
      <div className="lg:col-span-8 space-y-12">
        
        {/* ELEVATION PROFILE - UNBOXED */}
        {tour.elevationProfile && tour.elevationProfile.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                <Mountain className="w-6 h-6 text-[#FF6A00]" />
                <span>Route Elevation Profile</span>
              </h2>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF6A00] bg-white/[0.04] px-3.5 py-1 rounded-full border border-white/[0.08]">
                Max: {tour.altitude}
              </span>
            </div>

            <div className="pt-2 pb-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {tour.elevationProfile.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] relative group hover:border-[#FF6A00]/50 transition-colors"
                  >
                    <div className="font-mono text-base sm:text-lg font-black text-[#FF6A00]">
                      {point.meters.toLocaleString('en-US')} m
                    </div>
                    <div className="text-xs font-bold text-white mt-1 line-clamp-1">
                      {point.label}
                    </div>
                    {point.note && (
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {point.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* DAY-BY-DAY ITINERARY ACCORDION */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                <Clock className="w-7 h-7 text-[#FF6A00]" />
                <span>Day-by-Day Expedition Itinerary</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Detailed summit schedule with elevation points, stages, and overnight stations
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAll}
                className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {tour.itinerary.map((item: ItineraryDay) => {
              const isOpen = openDays.includes(item.day);
              return (
                <div
                  key={item.day}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white/[0.03] border-[#FF6A00]/40 shadow-xl'
                      : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleDay(item.day)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isOpen
                          ? 'bg-[#FF6A00] text-white shadow-md shadow-orange-950/50'
                          : 'bg-white/[0.06] text-slate-300'
                      }`}>
                        D{item.day}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm sm:text-base font-bold text-white truncate">
                          {item.title}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="text-[#FF6A00] font-semibold">Altitude: {item.altitude}</span>
                          <span>•</span>
                          <span>Overnight: {item.overnight}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-slate-400">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#FF6A00]" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 border-t border-white/[0.06]">
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-4">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* INCLUDED / EXCLUDED */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* INCLUDED */}
          <div className="bg-white/[0.02] rounded-2xl p-6 sm:p-8 border border-white/[0.08] space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <span>What Is Included</span>
            </h3>
            <ul className="space-y-3">
              {tour.included.map((inc, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-snug">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* EXCLUDED */}
          <div className="bg-white/[0.02] rounded-2xl p-6 sm:p-8 border border-white/[0.08] space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <XCircle className="w-6 h-6 text-amber-500" />
              <span>Not Included (Excluded)</span>
            </h3>
            <ul className="space-y-3">
              {tour.excluded.map((exc, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-400 leading-snug">
                  <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{exc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* GEAR CHECKLIST - UNBOXED */}
        {tour.gearList && tour.gearList.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-[#FF6A00]" />
                <span>Recommended Technical Gear</span>
              </h3>
              <span className="text-xs text-slate-400">Rental available at Terskol partner outfitter</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tour.gearList.map((category, idx) => (
                <div key={idx} className="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all space-y-3">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF6A00]">
                    {category.category}
                  </h4>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* RIGHT STICKY BOOKING SIDEBAR (4 COLUMNS) */}
      <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
        <div className="bg-white/[0.02] rounded-2xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6A00]/10 rounded-full blur-2xl pointer-events-none" />

          {/* PRICE */}
          <div className="border-b border-white/[0.08] pb-6 space-y-1">
            <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400">Expedition Package Price</div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              {tour.priceRub.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-xs text-slate-400 font-medium">
              ≈ \${tour.priceUsd} USD • per climber
            </div>
          </div>

          {/* BOOKING FORM WITH 152-FZ CONSENT */}
          {submitted ? (
            <div className="text-center py-8 space-y-3 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 p-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Application Received!</h4>
              <p className="text-xs text-slate-300">
                Our lead expedition guide will contact you within 15 minutes to confirm booking and route details.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Full Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#FF6A00] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF6A00]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Phone / WhatsApp:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#FF6A00] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF6A00]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Preferred 2026 Departure:
                </label>
                <select
                  value={formData.selectedDate}
                  onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#FF6A00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF6A00]/50 transition-colors"
                >
                  {tour.schedule2026.map((slot, idx) => (
                    <option key={idx} value={slot.dates} className="bg-[#0A1019] text-white">
                      {slot.dates} ({slot.statusLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Questions or Comments:
                </label>
                <textarea
                  rows={2}
                  placeholder="Mountaineering experience, rental needs, dietary requirements..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 focus:border-[#FF6A00] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF6A00]/50 transition-colors"
                />
              </div>

              {/* HIDDEN HONEYPOT ANTI-SPAM FIELD */}
              <input
                type="text"
                name="website_hp"
                value={formData.website_hp}
                onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* MANDATORY CONSENT (TERMS OF SERVICE + PRIVACY POLICY) */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-white/20 bg-white/[0.03] text-[#FF6A00] focus:ring-[#FF6A00] accent-[#FF6A00] w-4 h-4 shrink-0"
                  />
                  <span className="leading-tight">
                    I agree with the{' '}
                    <Link href="/offer" className="text-[#FF6A00] underline hover:text-orange-400" target="_blank">
                      Terms of Expedition Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-[#FF6A00] underline hover:text-orange-400" target="_blank">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 bg-[#FF6A00] hover:bg-[#E05D00] text-white font-bold text-sm uppercase tracking-wider py-3.5 rounded-xl shadow-xl shadow-orange-950/40 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Book Expedition'}</span>
              </button>
            </form>
          )}

          {/* DIRECT WHATSAPP CHAT */}
          <div className="pt-2 border-t border-white/[0.08] space-y-3">
            <a
              href={`https://wa.me/79280828413?text=${encodeURIComponent(
                `Hello! I am inquiring about the "${tour.title}" expedition. Please let me know current availability for 2026.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-3 rounded-xl shadow-md transition-all"
            >
              <img src="/img/wp.svg" alt="WhatsApp" className="w-4 h-4 object-contain" />
              <span>Direct WhatsApp Inquiry</span>
            </a>

            <div className="text-center text-[11px] text-slate-400">
              Or call headquarters: <a href="tel:+79280828413" className="text-white hover:text-[#FF6A00] font-semibold">+7 (928) 082-84-13</a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

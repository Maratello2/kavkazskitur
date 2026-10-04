'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  CheckCircle2, 
  Flame, 
  Mountain, 
  ChevronRight, 
  Send, 
  X
} from 'lucide-react';
import { TourData } from '@/data/toursData';

interface Props {
  tours: TourData[];
}

interface ScheduleRow {
  id: string;
  tourSlug: string;
  tourTitle: string;
  categoryLabel: string;
  altitude: string;
  duration: string;
  priceRub: number;
  dates: string;
  status: 'available' | 'few_spots' | 'guaranteed';
  statusLabel: string;
  month: 'may' | 'june' | 'july' | 'august' | 'september' | 'other';
}

export default function ScheduleClient2026({ tours }: Props) {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [bookingModal, setBookingModal] = useState<ScheduleRow | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', consent: false });
  const [submitted, setSubmitted] = useState(false);

  // Build flat list of all 2026 departures
  const rows: ScheduleRow[] = [];
  tours.forEach((tour) => {
    tour.schedule2026.forEach((slot, idx) => {
      let month: ScheduleRow['month'] = 'other';
      if (slot.dates.includes('.05.')) month = 'may';
      else if (slot.dates.includes('.06.')) month = 'june';
      else if (slot.dates.includes('.07.')) month = 'july';
      else if (slot.dates.includes('.08.')) month = 'august';
      else if (slot.dates.includes('.09.')) month = 'september';

      rows.push({
        id: `${tour.id}-${idx}`,
        tourSlug: tour.slug,
        tourTitle: tour.title,
        categoryLabel: tour.categoryLabel,
        altitude: tour.altitude,
        duration: tour.duration,
        priceRub: tour.priceRub,
        dates: slot.dates,
        status: slot.status,
        statusLabel: slot.statusLabel,
        month
      });
    });
  });

  const filteredRows = rows.filter((r) => {
    if (selectedMonth === 'all') return true;
    return r.month === selectedMonth;
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert('Please confirm consent to personal data processing (152-FZ Privacy Policy).');
      return;
    }

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          tour_name: bookingModal?.tourTitle,
          comment: `Schedule Reservation: ${bookingModal?.dates}`,
          consent_152fz: true
        })
      });
    } catch {
      // fallback
    }

    const text = encodeURIComponent(
      `Hello! I want to book: ${bookingModal?.tourTitle}\nDates: ${bookingModal?.dates}\nName: ${formData.name}\nPhone: ${formData.phone}`
    );
    window.open(`https://wa.me/79286914405?text=${text}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="space-y-8">
      {/* MONTH TABS */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0E1F33]/80 p-3 rounded-2xl border border-white/10 shadow-lg">
        {[
          { key: 'all', label: 'All Months' },
          { key: 'may', label: 'May' },
          { key: 'june', label: 'June' },
          { key: 'july', label: 'July' },
          { key: 'august', label: 'August' },
          { key: 'september', label: 'September' }
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSelectedMonth(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedMonth === tab.key
                ? 'bg-[#C2410C] text-white shadow-md'
                : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TIMETABLE */}
      <div className="bg-[#0E1F33] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#08101A]/60 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                <th className="p-4 sm:p-5">Departure Dates 2026</th>
                <th className="p-4 sm:p-5">Expedition Route</th>
                <th className="p-4 sm:p-5 hidden md:table-cell">Altitude / Duration</th>
                <th className="p-4 sm:p-5">Status</th>
                <th className="p-4 sm:p-5">Price</th>
                <th className="p-4 sm:p-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredRows.map((row) => {
                let badgeStyle = 'bg-blue-950/60 text-blue-300 border-blue-800/40';
                if (row.status === 'guaranteed') {
                  badgeStyle = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30';
                } else if (row.status === 'few_spots') {
                  badgeStyle = 'bg-amber-950/80 text-amber-300 border-amber-500/30';
                }

                return (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* DATES */}
                    <td className="p-4 sm:p-5 font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#C2410C] shrink-0" />
                        <span>{row.dates}</span>
                      </div>
                    </td>

                    {/* ROUTE */}
                    <td className="p-4 sm:p-5 font-semibold">
                      <Link
                        href={`/tours/${row.tourSlug}`}
                        className="text-white hover:text-[#C2410C] transition-colors flex items-center gap-1.5 group"
                      >
                        <span>{row.tourTitle}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#C2410C] shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {row.categoryLabel}
                      </div>
                    </td>

                    {/* ALTITUDE & DURATION */}
                    <td className="p-4 sm:p-5 hidden md:table-cell text-xs text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mountain className="w-3.5 h-3.5 text-[#C2410C]" />
                        <span>{row.altitude}</span>
                        <span>•</span>
                        <span>{row.duration}</span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-4 sm:p-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
                        {row.status === 'guaranteed' && <CheckCircle2 className="w-3 h-3" />}
                        {row.status === 'few_spots' && <Flame className="w-3 h-3" />}
                        <span>{row.statusLabel}</span>
                      </span>
                    </td>

                    {/* PRICE */}
                    <td className="p-4 sm:p-5 font-black text-white whitespace-nowrap">
                      {row.priceRub.toLocaleString('ru-RU')} ₽
                    </td>

                    {/* RESERVE BUTTON */}
                    <td className="p-4 sm:p-5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setBookingModal(row);
                          setSubmitted(false);
                        }}
                        className="inline-flex items-center gap-1.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs uppercase tracking-wider px-3.5 sm:px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <span>Reserve</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK BOOKING MODAL WITH 152-FZ */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0E1F33] rounded-3xl border border-white/10 p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-6">
            <button
              type="button"
              onClick={() => setBookingModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2410C]">
                Spot Reservation • Season 2026
              </span>
              <h3 className="text-xl font-black text-white">
                {bookingModal.tourTitle}
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-2 pt-1">
                <Calendar className="w-3.5 h-3.5 text-[#C2410C]" />
                <span>{bookingModal.dates}</span>
                <span>•</span>
                <span className="font-bold text-white">{bookingModal.priceRub.toLocaleString('ru-RU')} ₽</span>
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-6 space-y-3 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 p-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Request Sent!</h4>
                <p className="text-xs text-slate-300">
                  We have opened a WhatsApp chat with our lead guide and tentatively reserved your spot.
                </p>
                <button
                  type="button"
                  onClick={() => setBookingModal(null)}
                  className="mt-2 text-xs font-bold text-[#C2410C] underline"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#08101A] border border-white/15 focus:border-[#C2410C] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#C2410C]"
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
                    className="w-full bg-[#08101A] border border-white/15 focus:border-[#C2410C] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#C2410C]"
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
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm Reservation</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

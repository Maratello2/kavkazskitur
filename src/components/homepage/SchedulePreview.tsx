'use client';

import Link from 'next/link';
import { Calendar, ArrowUpRight, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface DepartureSlot {
  dates: string;
  route: string;
  duration: string;
  status: 'Guaranteed Departure' | 'Filling Fast' | 'Open for Booking';
  priceRub: number;
}

const SCHEDULE_2026: DepartureSlot[] = [
  {
    dates: 'May 10 — May 17, 2026',
    route: 'ELBRUS CLIMB SOUTH SIDE (Spring Snow & Ski)',
    duration: '8 Days',
    status: 'Guaranteed Departure',
    priceRub: 85000,
  },
  {
    dates: 'June 07 — June 14, 2026',
    route: 'ELBRUS CLIMB SOUTH SIDE (Prime Season Kickoff)',
    duration: '8 Days',
    status: 'Filling Fast',
    priceRub: 85000,
  },
  {
    dates: 'June 21 — June 28, 2026',
    route: 'CLIMBING ELBRUS FROM THE NORTH ROUTE (1829 Line)',
    duration: '8 Days',
    status: 'Guaranteed Departure',
    priceRub: 85000,
  },
  {
    dates: 'July 12 — July 20, 2026',
    route: 'MOUNT KAZBEK CLIMB (SOUTH ROUTE — 5,033 m)',
    duration: '9 Days',
    status: 'Filling Fast',
    priceRub: 95000,
  },
  {
    dates: 'August 09 — August 16, 2026',
    route: 'ELBRUS CLIMB SOUTH SIDE (Warmest Summit Window)',
    duration: '8 Days',
    status: 'Guaranteed Departure',
    priceRub: 85000,
  },
  {
    dates: 'August 23 — August 30, 2026',
    route: 'CLIMBING ELBRUS + IRIKCHAT GORGE (10 Days Trek)',
    duration: '10 Days',
    status: 'Open for Booking',
    priceRub: 95000,
  },
  {
    dates: 'September 13 — September 20, 2026',
    route: 'ELBRUS CLIMB THROUGH TERSKOL GORGE (Autumn Classic)',
    duration: '8 Days',
    status: 'Open for Booking',
    priceRub: 85000,
  }
];

function statusColor(status: DepartureSlot['status']) {
  switch (status) {
    case 'Guaranteed Departure':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'Filling Fast':
      return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
    case 'Open for Booking':
      return 'bg-blue-600/20 text-blue-300 border-blue-500/30';
  }
}

function waScheduleLink(slot: DepartureSlot) {
  const text = `Hello! I would like to reserve a spot for the ${slot.route} on ${slot.dates} (${slot.priceRub.toLocaleString('ru-RU')} RUB). Please confirm slot availability.`;
  return `https://wa.me/79286914405?text=${encodeURIComponent(text)}`;
}

export default function SchedulePreview() {
  return (
    <section id="schedule" className="py-20 sm:py-28 border-t border-white/[0.08] bg-[#091422]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-[#FF6A00] mb-2">
                <Calendar className="w-3.5 h-3.5 text-[#FF6A00]" />
                Guaranteed Departures
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                2026 Expedition Timetable
              </h2>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md leading-relaxed">
              Early reservation is required for high-season permits, cableway allocations, and Barrels refuge slots. All dates are guaranteed with minimum 2 participants.
            </p>
          </div>
        </ScrollReveal>

        {/* Timetable */}
        <ScrollReveal delay={50}>
          <div className="bg-[#0E1F33] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="p-4 sm:p-5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                Upcoming Windows
              </span>
              <span className="hidden sm:inline text-slate-400 font-mono">May — Oct 2026</span>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {SCHEDULE_2026.map((slot) => (
                <div
                  key={slot.dates + slot.route}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-48 shrink-0 font-mono text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#FF6A00]" />
                      {slot.dates}
                    </div>

                    <div>
                      <div className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {slot.route}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                        <span>Duration: {slot.duration}</span>
                        <span>&bull;</span>
                        <span className="font-semibold text-[#FF6A00]">
                          {slot.priceRub.toLocaleString('ru-RU')} ₽ / person
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start md:self-auto">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${statusColor(
                        slot.status
                      )}`}
                    >
                      {slot.status}
                    </span>

                    <a
                      href={waScheduleLink(slot)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] text-white text-xs font-bold border border-orange-400/20 transition-all shadow-md shadow-orange-950/30 group"
                    >
                      <span>Reserve</span>
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom group note */}
            <div className="p-5 bg-white/[0.01] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF6A00]" />
                <span>Need custom dates or private guide for your team?</span>
              </div>
              <a
                href="https://wa.me/79286914405?text=Hello!%20I%20would%20like%20to%20request%20custom%20dates%20for%20a%20private%20Elbrus/Kazbek%20expedition."
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#FF6A00] hover:text-[#FF8800] transition-colors"
              >
                Inquire for Private Expedition &rarr;
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* CTA to full schedule page */}
        <div className="mt-10 text-center">
          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] text-white text-sm font-bold border border-orange-400/20 transition-all shadow-md shadow-orange-950/30 group"
          >
            View Full 2026 Schedule & Booking
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

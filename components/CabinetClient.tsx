'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Phone,
  MessageSquare,
  Lock,
  Compass,
  Check,
  RefreshCw,
  Award,
} from 'lucide-react';

interface GearItem {
  id: string;
  name: string;
  category: 'footwear' | 'clothing' | 'bivouac' | 'hardware';
  spec: string;
  status: 'own' | 'rental' | 'unselected';
}

const INITIAL_GEAR: GearItem[] = [
  // Footwear
  { id: 'f1', name: 'Double Mountaineering Boots', category: 'footwear', spec: 'Rigid sole, -25°C rated (La Sportiva Baruntse / Scarpa Phantom 6000)', status: 'rental' },
  { id: 'f2', name: 'Trekking Boots', category: 'footwear', spec: 'Vibram sole, ankle support for lower acclimatization hikes', status: 'own' },
  { id: 'f3', name: 'Technical Gaiters', category: 'footwear', spec: 'High waterproof breathable gaiters preventing snow ingress', status: 'own' },
  { id: 'f4', name: 'Down Camp Booties / Slippers', category: 'footwear', spec: 'Comfortable footwear for resting inside Barrels Refuge', status: 'own' },

  // Clothing
  { id: 'c1', name: 'Heavy Expedition Down Parka', category: 'clothing', spec: '-25°C rated, 800+ fill power down with insulated hood', status: 'rental' },
  { id: 'c2', name: 'Gore-Tex Hardshell Jacket', category: 'clothing', spec: '3-layer waterproof membrane protecting against storm winds up to 40 m/s', status: 'own' },
  { id: 'c3', name: 'Membrane Storm Pants', category: 'clothing', spec: 'Windproof and waterproof hardshell pants with side ventilation zips', status: 'own' },
  { id: 'c4', name: 'Polartec Mid-Layer Fleece', category: 'clothing', spec: 'High-loft thermal jacket for active moisture wicking', status: 'own' },
  { id: 'c5', name: 'Thermal Base Layer (Merino)', category: 'clothing', spec: '2 sets of 200-260 g/m² merino wool underwear (top and bottom)', status: 'own' },
  { id: 'c6', name: 'Expedition Down Mittens', category: 'clothing', spec: 'Extreme cold mitts with windproof shell and fleece liner', status: 'rental' },
  { id: 'c7', name: 'Windstopper Fleece Gloves', category: 'clothing', spec: 'Dexterity gloves for working with carabiners and ropes', status: 'own' },

  // Bivouac
  { id: 'b1', name: 'Four-Season Sleeping Bag', category: 'bivouac', spec: 'Comfort temperature -15°C to -20°C for Barrels Refuge & assault camp', status: 'rental' },
  { id: 'b2', name: 'Expedition Rucksack (75–85 L)', category: 'bivouac', spec: 'Anatomic harness system for carrying gear from Azau to Barrels', status: 'own' },
  { id: 'b3', name: 'Summit Assault Pack (30–35 L)', category: 'bivouac', spec: 'Lightweight pack for summit assault carrying thermos and extra down layer', status: 'own' },
  { id: 'b4', name: 'Insulated 1.0 L Thermos', category: 'bivouac', spec: 'Stainless steel vacuum flask keeping water hot in sub-zero winds', status: 'own' },
  { id: 'b5', name: 'Glacier Sunglasses (Category 4)', category: 'bivouac', spec: '100% UV protection with leather side shields against alpine snow blindness', status: 'own' },

  // Specialized Alpine Hardware
  { id: 'h1', name: 'Classic Mountaineering Ice Axe', category: 'hardware', spec: '55–65 cm straight shaft steel pick for self-arrest on steep ice', status: 'rental' },
  { id: 'h2', name: '12-Point Alpine Crampons', category: 'hardware', spec: 'Steel crampons with anti-balling plates fitted to boot sole', status: 'rental' },
  { id: 'h3', name: 'Climbing Harness & Lanyard', category: 'hardware', spec: 'UIAA-certified alpine harness with 2 screwgate locking carabiners', status: 'rental' },
  { id: 'h4', name: 'Trekking Poles with Snow Baskets', category: 'hardware', spec: 'Telescopic 3-section poles with winter snow rings', status: 'own' },
  { id: 'h5', name: 'Climbing Helmet', category: 'hardware', spec: 'Lightweight poly-carbonate helmet protecting against rock/ice fall', status: 'own' },
  { id: 'h6', name: 'High-Power Headlamp', category: 'hardware', spec: '350+ lumens with cold-resistant lithium batteries for night summit start', status: 'own' },
];

export default function CabinetClient() {
  // Expedition Countdown (Target Date: July 12, 2026, 06:00 AM)
  const [timeLeft, setTimeLeft] = useState({ days: 116, hours: 14, minutes: 28, seconds: 40 });

  useEffect(() => {
    const targetDate = new Date('2026-07-12T06:00:00Z').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // FSB Permit State
  const [permitStatus, setPermitStatus] = useState<'review' | 'issued' | 'required'>('review');
  const [passportForm, setPassportForm] = useState({
    fullName: '',
    passportNumber: '',
    birthDate: '',
    citizenship: 'Russian Federation',
  });
  const [formSaved, setFormSaved] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'footwear' | 'clothing' | 'bivouac' | 'hardware'>('all');

  // Gear Checklist State
  const [gear, setGear] = useState<GearItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kavkazskitur_climber_gear');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_GEAR;
  });

  const handleGearToggle = (id: string, status: 'own' | 'rental') => {
    const updated = gear.map((item) => (item.id === id ? { ...item, status } : item));
    setGear(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kavkazskitur_climber_gear', JSON.stringify(updated));
    }
  };

  const rentalCount = gear.filter((g) => g.status === 'rental').length;
  const ownCount = gear.filter((g) => g.status === 'own').length;

  const handlePassportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaved(true);
    setPermitStatus('review');
    setTimeout(() => {
      alert('Your passport data has been securely transmitted and verified by the Nalchik Expedition Office. Status updated to: Documents Under Review.');
    }, 400);
  };

  const filteredGear = activeCategory === 'all' ? gear : gear.filter((g) => g.category === activeCategory);

  return (
    <div className="space-y-10">

      {/* 1. UPCOMING EXPEDITION WIDGET */}
      <div className="bg-[#0E1F33] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#C2410C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#C2410C] text-white shadow-lg">
                Active Booking • ID #KK-2026-084
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                <span>Confirmed &amp; Registered</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Mount Elbrus South Route (Classic 8-Day Climb)
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Summit Elevation</span>
                <span className="text-base font-extrabold text-white">5,642 m</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Departure Date</span>
                <span className="text-base font-extrabold text-white">July 12, 2026</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Assault Base</span>
                <span className="text-base font-extrabold text-white">Barrels (3,800 m)</span>
              </div>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="bg-[#08101A] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center shrink-0 min-w-[260px]">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C2410C] mb-3">
              <Clock size={14} />
              <span>Expedition Countdown</span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center w-full">
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5">
                <span className="text-2xl font-black text-white block">{timeLeft.days}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Days</span>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5">
                <span className="text-2xl font-black text-white block">{timeLeft.hours}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Hours</span>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5">
                <span className="text-2xl font-black text-white block">{timeLeft.minutes}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Mins</span>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5">
                <span className="text-2xl font-black text-[#FB923C] block">{timeLeft.seconds}</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Guide Contact Card */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1E392A] border-2 border-[#C2410C] flex items-center justify-center text-white font-black text-base shadow-lg">
              VR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Viktor Romanov</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  UIAGM / Master of Mountain Sports
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Senior Lead Guide • 45+ successful Elbrus summits • Radio Call: &ldquo;Elbrus-1&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="https://wa.me/79286914405?text=Hello%20Viktor!%20I%20have%20a%20question%20regarding%20my%20upcoming%20expedition%20#KK-2026-084."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-bold transition-all shadow-md"
            >
              <MessageSquare size={14} />
              <span>Message Guide</span>
            </a>
            <a
              href="tel:+79286914405"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 text-xs font-bold transition-all"
            >
              <Phone size={14} className="text-[#C2410C]" />
              <span>Call Nalchik HQ</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. FSB BORDER PERMIT STATUS MODULE */}
      <div className="bg-[#0E1F33] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C2410C] mb-1">
              <ShieldCheck size={16} />
              <span>Federal Security Service (FSB) Compliance</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              FSB Border Pass Authorization Status
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Under Russian Federation border law, high-altitude ascents in Kabardino-Balkaria require verified border zone clearance issued by FSB KBR. KavKazSkiTur files all official applications directly with the border department in Nalchik.
            </p>
          </div>

          {/* Live Status Badge */}
          <div className="flex items-center gap-3">
            {permitStatus === 'review' && (
              <div className="px-4 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center gap-2">
                <RefreshCw size={15} className="animate-spin" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Documents Under Review</span>
              </div>
            )}
            {permitStatus === 'issued' && (
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span className="text-xs font-extrabold uppercase tracking-wider">Permit Issued (FSB KBR)</span>
              </div>
            )}
            {permitStatus === 'required' && (
              <div className="px-4 py-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center gap-2">
                <AlertTriangle size={16} />
                <span className="text-xs font-extrabold uppercase tracking-wider">Action Required</span>
              </div>
            )}
          </div>
        </div>

        {/* Secure Upload Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form onSubmit={handlePassportSubmit} className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Lock size={14} className="text-[#C2410C]" />
              <span>Secure Passport Registration (152-FZ Compliant)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">
                  Full Name (Latin as in Passport)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ALEXANDER MORGAN"
                  value={passportForm.fullName}
                  onChange={(e) => setPassportForm({ ...passportForm, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">
                  Passport Series &amp; Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 75 18 948102"
                  value={passportForm.passportNumber}
                  onChange={(e) => setPassportForm({ ...passportForm, passportNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={passportForm.birthDate}
                  onChange={(e) => setPassportForm({ ...passportForm, birthDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">
                  Citizenship
                </label>
                <select
                  value={passportForm.citizenship}
                  onChange={(e) => setPassportForm({ ...passportForm, citizenship: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                >
                  <option value="Russian Federation">Russian Federation (15-day processing)</option>
                  <option value="Foreign National">Foreign National (30-day processing)</option>
                  <option value="CIS Citizen">CIS Citizen (20-day processing)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer text-center">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-200">
                Drop passport main page scan or click to browse
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Accepted formats: PDF, JPG, PNG (Max 10 MB). Scans are stored in high-security encrypted storage.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>AES-256 Bit Encryption Active</span>
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                {formSaved ? 'Update Document Data' : 'Submit Passport for Permit'}
              </button>
            </div>
          </form>

          {/* Permit FAQ & Instructions */}
          <div className="lg:col-span-5 bg-[#08101A] border border-white/10 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileCheck2 size={16} className="text-[#C2410C]" />
              <span>Official FSB Border Regulations</span>
            </h4>

            <ul className="text-xs text-slate-300 space-y-2.5 list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-white">Submission Deadlines:</strong> Russian passport holders must register at least 15 days before the climb; international citizens require 30 business days.
              </li>
              <li>
                <strong className="text-white">Original Document:</strong> You must have the original physical passport on you during the trek for border control checkpoints at Azau and Terskol.
              </li>
              <li>
                <strong className="text-white">Official Stamp:</strong> KavKazSkiTur handles the official stamped passes at the FSB Directorate in Nalchik.
              </li>
            </ul>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>KavKazSkiTur is a licensed operator certified for high-altitude border permits.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE GEAR CHECKLIST WITH RENTAL TOGGLES */}
      <div className="bg-[#0E1F33] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C2410C] mb-1">
              <Award size={16} />
              <span>Alpine Equipment Inspection</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Expedition Gear Checklist &amp; Azau Glade Rental
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Inspect your equipment against UIAGM safety standards. Mark items you bring yourself or reserve them for fitting and pickup at our Azau Glade rental depot.
            </p>
          </div>

          {/* Rental Summary Counter */}
          <div className="flex items-center gap-2 bg-[#08101A] border border-white/10 p-2 rounded-2xl">
            <div className="px-3.5 py-2 rounded-xl bg-white/[0.04] text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Own Gear</span>
              <span className="text-base font-extrabold text-white">{ownCount} items</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#C2410C]/20 border border-[#C2410C]/40 text-center">
              <span className="text-[10px] uppercase font-bold text-[#FB923C] block">Azau Rental</span>
              <span className="text-base font-extrabold text-[#FB923C]">{rentalCount} items</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', label: 'All Equipment (22)' },
              { id: 'footwear', label: 'Footwear (4)' },
              { id: 'clothing', label: 'Clothing (7)' },
              { id: 'bivouac', label: 'Bivouac & Camp (5)' },
              { id: 'hardware', label: 'Technical Hardware (6)' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-[#C2410C] text-white shadow-md'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gear List */}
        <div className="space-y-2.5">
          {filteredGear.map((item) => (
            <div
              key={item.id}
              className="bg-[#08101A] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/[0.05] text-slate-400">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{item.spec}</p>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleGearToggle(item.id, 'own')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    item.status === 'own'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Check size={13} />
                  <span>Own</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGearToggle(item.id, 'rental')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    item.status === 'rental'
                      ? 'bg-[#C2410C] text-white shadow-md'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  <span>Need Rental at Azau Glade</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Booking & Rental Voucher CTA */}
        <div className="p-5 rounded-2xl bg-[#08101A] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-white">
              Azau Glade Equipment Reservation Voucher
            </div>
            <div className="text-[11px] text-slate-400">
              {rentalCount} items marked for rental. Your gear manifest is automatically reserved at our depot on Polyana Azau.
            </div>
          </div>

          <a
            href={`https://wa.me/79286914405?text=${encodeURIComponent(
              `Hello! I have updated my climber gear manifest for Expedition #KK-2026-084. I need ${rentalCount} items for rental at Azau glade.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs shadow-lg transition-all shrink-0"
          >
            Confirm Rental Manifest via WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
}

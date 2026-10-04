'use client';

import React, { useState } from 'react';
import { Users, Check, Phone, Send, ShieldCheck, Calendar } from 'lucide-react';

interface TourSidebarClientProps {
  tourName: string;
  tourId: string | number;
  basePrice: string | null;
  telegramLink?: string | null;
}

export default function TourSidebarClient({
  tourName,
  tourId,
  basePrice,
}: TourSidebarClientProps) {
  const [personsCount, setPersonsCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState('2026-05-15');
  const [hasTransfer, setHasTransfer] = useState(false);
  const [hasGear, setHasGear] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);

  // Quick order state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const priceNum = basePrice ? parseInt(basePrice.replace(/\D/g, ''), 10) || 0 : 0;

  const calculateTotal = () => {
    if (!priceNum) return { text: basePrice || 'On Request', isNumeric: false, discountPercent: 0 };

    let discountPercent = 0;
    if (personsCount >= 5) discountPercent = 10;
    else if (personsCount >= 3) discountPercent = 5;

    const discountedPricePerPerson = priceNum * (1 - discountPercent / 100);
    let total = discountedPricePerPerson * personsCount;

    if (hasTransfer) total += 1500 * personsCount;
    if (hasGear) total += 1000 * personsCount;
    if (hasInsurance) total += 1000 * personsCount;

    return {
      text: Math.round(total).toLocaleString('ru-RU') + ' ₽',
      isNumeric: true,
      discountPercent,
    };
  };

  const total = calculateTotal();

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tour_id: tourId,
          tour_name: tourName,
          client_name: name || 'Expedition Client',
          phone,
          date: selectedDate,
          persons: personsCount,
          options: { transfer: hasTransfer, gear: hasGear, insurance: hasInsurance },
          total_price: total.text,
        }),
      }).catch(() => null);

      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const waText = encodeURIComponent(
    `Hello! I want to reserve "${tourName}" for ${personsCount} climber(s) on ${selectedDate}. Estimated package: ${total.text}.`
  );

  return (
    <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Price Header */}
      <div className="pb-5 border-b border-slate-100 dark:border-white/10">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Expedition Package
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-3xl sm:text-4xl font-black text-[#C85A32] tracking-tight">
            {basePrice ? `From ${basePrice}` : 'On Request'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ climber</span>
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <Users size={13} />
          <span>Spots Available for 2026</span>
        </div>
      </div>

      {/* Date and Climbers Selector */}
      <div className="space-y-4">
        {/* Date selection */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
            <Calendar size={14} className="text-[#C85A32]" />
            <span>Departure Date (2026 Season)</span>
          </label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#C85A32] outline-none"
          >
            <option value="2026-05-15">May 15 — May 22, 2026</option>
            <option value="2026-06-01">June 1 — June 8, 2026</option>
            <option value="2026-06-20">June 20 — June 27, 2026</option>
            <option value="2026-07-10">July 10 — July 17, 2026</option>
            <option value="2026-08-01">August 1 — August 8, 2026</option>
            <option value="2026-09-05">September 5 — September 12, 2026</option>
          </select>
        </div>

        {/* Climbers counter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Users size={14} className="text-[#C85A32]" />
              <span>Number of Climbers</span>
            </span>
            {personsCount >= 3 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                Discount {personsCount >= 5 ? '10%' : '5%'}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2">
            <button
              type="button"
              onClick={() => setPersonsCount((p) => Math.max(1, p - 1))}
              className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 hover:bg-[#C85A32] hover:text-white text-slate-800 dark:text-white font-black text-lg flex items-center justify-center transition-colors cursor-pointer shadow-sm border border-slate-200 dark:border-transparent"
            >
              −
            </button>
            <div className="text-center">
              <span className="text-xl font-black text-slate-900 dark:text-white">{personsCount}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block -mt-1">
                {personsCount === 1 ? 'person' : 'people'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPersonsCount((p) => Math.min(20, p + 1))}
              className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 hover:bg-[#C85A32] hover:text-white text-slate-800 dark:text-white font-black text-lg flex items-center justify-center transition-colors cursor-pointer shadow-sm border border-slate-200 dark:border-transparent"
            >
              +
            </button>
          </div>
        </div>

        {/* Optional Add-ons */}
        <div className="space-y-2 pt-1">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/40 cursor-pointer transition-colors text-xs text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasTransfer}
                onChange={(e) => setHasTransfer(e.target.checked)}
                className="w-4 h-4 rounded text-[#C85A32] accent-[#C85A32]"
              />
              <span>Airport Transfer (Round Trip)</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold">+1,500 ₽/climber</span>
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/40 cursor-pointer transition-colors text-xs text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasGear}
                onChange={(e) => setHasGear(e.target.checked)}
                className="w-4 h-4 rounded text-[#C85A32] accent-[#C85A32]"
              />
              <span>Mountaineering Gear Rental</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold">+1,000 ₽</span>
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/40 cursor-pointer transition-colors text-xs text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasInsurance}
                onChange={(e) => setHasInsurance(e.target.checked)}
                className="w-4 h-4 rounded text-[#C85A32] accent-[#C85A32]"
              />
              <span>High-Altitude Alpine Insurance</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold">+1,000 ₽/climber</span>
          </label>
        </div>

        {/* Total calculation */}
        <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Calculated Total:</span>
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{total.text}</span>
            {total.discountPercent ? (
              <span className="block text-[11px] text-emerald-500 font-bold">
                {total.discountPercent}% group discount applied
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Book Button */}
      <div>
        <a
          href={`https://wa.me/79286914405?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="w-full bg-[#C85A32] py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:bg-[#A84726] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Book Expedition</span>
        </a>
      </div>

      {/* Messenger Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={`https://t.me/kavkazskitur22?start=book_${tourId}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Send size={15} />
          <span>Telegram</span>
        </a>

        <a
          href={`https://wa.me/79286914405?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Phone size={15} />
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Fast Callback Form */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/10">
        {isSubmitted ? (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Request Received!</p>
              <p className="mt-0.5 text-[11px]">Our manager will call you within 10 minutes.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleQuickSubmit} className="space-y-2.5">
            <input
              type="tel"
              placeholder="+1 (555) 000-0000 *"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-base md:text-xs min-h-[44px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
            />
            <div className="mt-2 mb-2">
              <label className="flex items-start gap-2 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={acceptedPolicy}
                  onChange={(e) => setAcceptedPolicy(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-[#C2410C] focus:ring-[#C2410C] focus:ring-offset-0 transition cursor-pointer"
                  required
                />
                <span className="text-[10px] leading-tight text-slate-400 group-hover:text-slate-300">
                  I agree to{' '}
                  <a href="/privacy" className="text-[#C2410C] underline hover:text-orange-400">
                    152-FZ Data Policy
                  </a>.
                </span>
              </label>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !acceptedPolicy}
              className="w-full py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Sending...' : 'Request Callback'}
            </button>
          </form>
        )}
      </div>

      {/* Guarantees */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#C85A32] shrink-0" />
          <span>Secure Payment via Card & Bank Transfer</span>
        </div>
        <div className="flex items-center gap-2">
          <Check size={14} className="text-[#C85A32] shrink-0" />
          <span>Free Cancellation up to 48h before departure</span>
        </div>
        <div className="flex items-center gap-2">
          <Check size={14} className="text-[#C85A32] shrink-0" />
          <span>Official Contract & Tax Receipt Provided</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#C85A32] shrink-0" />
          <span>Mandatory EMERCOM Rescue Registry</span>
        </div>
      </div>
    </div>
  );
}

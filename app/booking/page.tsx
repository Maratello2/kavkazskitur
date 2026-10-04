'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Loader2, MessageCircle, Mountain, ShieldCheck, Mail, Phone, User, Calendar, Compass, Users } from 'lucide-react';

function BookingForm() {
  const searchParams = useSearchParams();
  const initialTour = searchParams.get('tour') || 'Mount Elbrus Supreme Apex';
  const initialSlug = searchParams.get('slug') || initialTour.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [participants, setParticipants] = useState(1);
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [websiteHp, setWebsiteHp] = useState('');
  const [acceptedPolicy, setAcceptedPolicy] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!phone.trim()) return;

    if (websiteHp) {
      setConfirmedBookingId('hp_filtered');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourSlug: initialSlug || 'elbrus-expedition',
          tourTitle: initialTour,
          clientName: name.trim() || 'Expedition Climber',
          clientEmail: email.trim(),
          clientPhone: phone.trim(),
          participants: Number(participants) || 1,
          preferredDate: preferredDate || undefined,
          experienceLevel,
          consent152: true,
          website_hp: websiteHp,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit reservation');
      }

      setConfirmedBookingId(data.bookingId || 'KKT-' + Date.now().toString(36).toUpperCase());
    } catch (err: any) {
      console.error('[Booking Page] Error:', err);
      setErrorMsg(err.message || 'Connection error. Please try again or use direct WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappDirectUrl = confirmedBookingId
    ? `https://wa.me/79280828413?text=${encodeURIComponent(`Order ${confirmedBookingId}`)}`
    : `https://wa.me/79280828413?text=${encodeURIComponent(`Expedition Inquiry: ${initialTour}`)}`;

  if (confirmedBookingId) {
    return (
      <div className="text-center py-6 sm:py-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-950/40">
          <CheckCircle2 size={36} strokeWidth={1.5} />
        </div>

        <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#FF6A00] uppercase mb-1">
          EXPEDITION RESERVED
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
          Request Logged Successfully
        </h2>

        {/* Order Reference Badge */}
        <div className="my-3 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] font-mono text-xs sm:text-sm text-sky-300 font-semibold tracking-wider">
          ORDER NUMBER: <span className="text-white font-bold">#{confirmedBookingId}</span>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
          Your reservation inquiry for <strong className="text-white">{initialTour}</strong> has been saved. An email confirmation has been dispatched.
        </p>

        {/* Direct WhatsApp Priority Line Button */}
        <div className="w-full space-y-3">
          <a
            href={whatsappDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm uppercase tracking-[0.16em] transition-all shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Direct WhatsApp Priority Line</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setConfirmedBookingId(null);
              setName('');
              setEmail('');
              setPhone('');
            }}
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-xs font-semibold tracking-wider transition-colors cursor-pointer border border-white/[0.06]"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* HIDDEN HONEYPOT ANTI-SPAM FIELD */}
      <input
        type="text"
        name="website_hp"
        value={websiteHp}
        onChange={(e) => setWebsiteHp(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {initialTour && (
        <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#FF6A00] block mb-1">
            Selected Expedition Route
          </label>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Mountain className="w-4 h-4 text-[#FF6A00]" />
            <span>{initialTour}</span>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-mono text-slate-300 block mb-1 flex items-center gap-1.5">
          <User size={13} className="text-[#FF6A00]" />
          <span>Climber Full Name *</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alexander von Humboldt"
          className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF6A00] transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1 flex items-center gap-1.5">
            <Mail size={13} className="text-sky-400" />
            <span>Email Address *</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="climber@alpinemail.com"
            className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF6A00] transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1 flex items-center gap-1.5">
            <Phone size={13} className="text-emerald-400" />
            <span>Phone / WhatsApp *</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+41 22 555 0199"
            className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF6A00] transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1 flex items-center gap-1.5">
            <Calendar size={13} className="text-[#FF6A00]" />
            <span>Target Date</span>
          </label>
          <input
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-[#FF6A00] transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-mono text-slate-300 block mb-1 flex items-center gap-1.5">
            <Users size={13} className="text-[#38BDF8]" />
            <span>Climbers Count</span>
          </label>
          <select
            value={participants}
            onChange={(e) => setParticipants(parseInt(e.target.value, 10))}
            className="w-full px-4 py-2.5 rounded-xl text-base sm:text-sm bg-[#091422] border border-white/[0.08] text-white focus:outline-none focus:border-[#FF6A00] transition-colors"
          >
            <option value={1}>1 Climber (Solo)</option>
            <option value={2}>2 Climbers (Pair)</option>
            <option value={3}>3 Climbers</option>
            <option value={4}>4 Climbers (Group)</option>
            <option value={6}>6 Climbers (Team)</option>
            <option value={8}>8+ Climbers (Full Expedition)</option>
          </select>
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
          <Compass size={13} className="text-amber-400" />
          <span>Mountaineering Experience Level *</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setExperienceLevel(lvl)}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                experienceLevel === lvl
                  ? 'bg-[#FF6A00] text-white border-orange-400/50 shadow-md shadow-orange-950/40'
                  : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 mb-2">
        <label className="flex items-start gap-3 cursor-pointer group select-none">
          <input
            type="checkbox"
            checked={acceptedPolicy}
            onChange={(e) => setAcceptedPolicy(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#FF6A00] focus:ring-[#FF6A00] focus:ring-offset-0 transition cursor-pointer"
            required
          />
          <span className="text-[11px] leading-snug text-slate-400 group-hover:text-slate-300">
            I agree to personal data handling (152-FZ) and{' '}
            <Link href="/privacy" target="_blank" className="text-[#FF6A00] underline hover:text-orange-300">
              Expedition Terms
            </Link>.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={!acceptedPolicy || isSubmitting}
        className="w-full py-4 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-[0.18em] shadow-xl shadow-orange-950/50 border border-orange-400/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing Reservation...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>Confirm Expedition Booking</span>
          </>
        )}
      </button>
    </form>
  );
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[#060B12] text-slate-100 pt-28 pb-20 flex items-center justify-center px-4">
      <div className="max-w-lg w-full mx-auto my-6 sm:my-10 p-6 sm:p-8 bg-white/[0.02] border border-white/[0.08] rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-[#FF6A00]">
            <Mountain className="w-3.5 h-3.5" />
            KavKazSkiTur Expeditions 2026
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Expedition Booking
          </h1>
          <p className="text-xs text-slate-400">
            Reserve your climber slot with UIAGM/RMGA certified lead guides
          </p>
        </div>

        <Suspense fallback={
          <div className="space-y-4 animate-pulse py-2" aria-busy="true">
            <div className="h-3 w-32 bg-white/[0.06] rounded" />
            <div className="h-11 w-full bg-white/[0.04] rounded-2xl border border-white/[0.06]" />
            <div className="h-3 w-28 bg-white/[0.06] rounded" />
            <div className="h-11 w-full bg-white/[0.04] rounded-2xl border border-white/[0.06]" />
            <div className="h-12 w-full bg-white/[0.06] rounded-xl mt-4" />
          </div>
        }>
          <BookingForm />
        </Suspense>
      </div>
    </main>
  );
}

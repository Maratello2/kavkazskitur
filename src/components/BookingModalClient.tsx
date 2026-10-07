'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  X, 
  Mountain, 
  ShieldCheck, 
  CheckCircle2, 
  MessageCircle, 
  Mail, 
  Phone, 
  User, 
  Loader2,
  Compass
} from 'lucide-react';

interface BookingModalClientProps {
  tourName: string;
  tourSlug?: string;
  triggerButtonText?: string;
  triggerClassName?: string;
  isOpenControlled?: boolean;
  onCloseControlled?: () => void;
}

export default function BookingModalClient({ 
  tourName, 
  tourSlug,
  triggerButtonText = 'Book This Expedition',
  triggerClassName,
  isOpenControlled,
  onCloseControlled,
}: BookingModalClientProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isOpenControlled !== undefined ? isOpenControlled : internalIsOpen;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [participants, setParticipants] = useState<number>(1);
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [consent152, setConsent152] = useState(false);
  const [websiteHp, setWebsiteHp] = useState('');

  // Confirmation State
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const derivedSlug = tourSlug || tourName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleOpen = () => {
    setInternalIsOpen(true);
    setErrorMsg(null);
  };

  const handleClose = () => {
    setInternalIsOpen(false);
    if (onCloseControlled) onCloseControlled();
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Silent honeypot drop
    if (websiteHp) {
      setConfirmedBookingId('hp_filtered');
      return;
    }

    if (!consent152) {
      setErrorMsg('Consent to personal data processing is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourSlug: derivedSlug,
          tourTitle: tourName,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          participants: Number(participants) || 1,
          preferredDate: preferredDate || undefined,
          experienceLevel,
          consent152: true,
          website_hp: websiteHp,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit booking inquiry');
      }

      setConfirmedBookingId(data.bookingId || 'KKT-' + Date.now().toString(36).toUpperCase());
    } catch (err: any) {
      console.error('[Booking Modal] Submission error:', err);
      setErrorMsg(err.message || 'Connection error. Please try again or use direct WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappDirectUrl = confirmedBookingId
    ? `https://wa.me/79280828413?text=${encodeURIComponent(`Order ${confirmedBookingId}`)}`
    : `https://wa.me/79280828413?text=${encodeURIComponent(`Expedition Inquiry: ${tourName}`)}`;

  return (
    <>
      {isOpenControlled === undefined && (
        <button 
          type="button"
          onClick={handleOpen}
          className={triggerClassName || "w-full py-4 px-6 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] text-white font-bold text-sm uppercase tracking-[0.18em] transition-all shadow-xl shadow-orange-950/50 border border-orange-400/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"}
        >
          <Mountain className="w-4 h-4" strokeWidth={1.5} />
          <span>{triggerButtonText}</span>
        </button>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-none transition-all"
          onClick={handleClose}
          aria-modal="true"
          role="dialog"
        >
          <div 
            className="bg-[#091422] border border-white/[0.12] rounded-2xl w-full max-w-lg shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden relative text-white flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0E1F33]">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#FF6A00] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
                  Official Expedition Booking
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                  Reserve Climber Slot
                </h3>
              </div>
              <button 
                onClick={handleClose} 
                className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              {confirmedBookingId ? (
                /* =========================================================================
                    CONFIRMATION SCREEN (With Order ID & Direct WhatsApp Priority Line)
                ========================================================================= */
                <div className="py-6 sm:py-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-950/40">
                    <CheckCircle2 size={36} strokeWidth={1.5} />
                  </div>

                  <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#FF6A00] uppercase mb-1">
                    RESERVATION LOGGED
                  </span>

                  <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Expedition Request Confirmed
                  </h4>

                  {/* Order Reference Badge */}
                  <div className="my-3 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] font-mono text-xs sm:text-sm text-sky-300 font-semibold tracking-wider">
                    BOOKING REFERENCE: <span className="text-white font-bold">#{confirmedBookingId}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-6 leading-relaxed">
                    Your climb inquiry for <strong className="text-white">{tourName}</strong> is saved. An email confirmation has been dispatched.
                  </p>

                  {/* Direct WhatsApp Priority Line CTA */}
                  <div className="w-full space-y-3">
                    <a
                      href={whatsappDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm uppercase tracking-[0.16em] transition-all shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Direct WhatsApp Priority Line</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmedBookingId(null);
                        handleClose();
                      }}
                      className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-xs font-semibold tracking-wider transition-colors cursor-pointer border border-white/[0.06]"
                    >
                      Done / Close Window
                    </button>
                  </div>
                </div>
              ) : (
                /* =========================================================================
                    BOOKING FORM INPUTS
                ========================================================================= */
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-medium">
                      {errorMsg}
                    </div>
                  )}

                  {/* Selected Tour Banner */}
                  <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-0.5">
                      Target Expedition
                    </div>
                    <div className="font-bold text-sm text-white">
                      {tourName}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                      <User size={13} className="text-[#FF6A00]" />
                      <span>Full Name *</span>
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Alexander von Humboldt" 
                      className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6A00] transition-colors"
                    />
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                        <Mail size={13} className="text-sky-400" />
                        <span>Email Address *</span>
                      </label>
                      <input 
                        type="email" 
                        required 
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="climber@alpinemail.com" 
                        className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6A00] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                        <Phone size={13} className="text-emerald-400" />
                        <span>Phone / WhatsApp *</span>
                      </label>
                      <input 
                        type="tel" 
                        required 
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+41 22 555 0199" 
                        className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6A00] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Target Date & Participants */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#FF6A00]" />
                        <span>Preferred Date</span>
                      </label>
                      <input 
                        type="date" 
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-[#FF6A00] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                        <Users size={13} className="text-[#38BDF8]" />
                        <span>Team Size</span>
                      </label>
                      <select 
                        value={participants}
                        onChange={(e) => setParticipants(parseInt(e.target.value, 10))}
                        className="w-full px-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#091422] border border-white/[0.08] text-white focus:outline-none focus:border-[#FF6A00] transition-colors"
                      >
                        <option value={1}>1 Climber (Solo)</option>
                        <option value={2}>2 Climbers (Pair)</option>
                        <option value={3}>3 Climbers</option>
                        <option value={4}>4 Climbers (Small Group)</option>
                        <option value={6}>6 Climbers (Team)</option>
                        <option value={8}>8+ Climbers (Full Expedition)</option>
                      </select>
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 flex items-center gap-1.5">
                      <Compass size={13} className="text-amber-400" />
                      <span>Mountaineering Experience *</span>
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

                  {/* Honeypot field (hidden from legitimate users) */}
                  <input 
                    type="text" 
                    name="website_hp" 
                    value={websiteHp}
                    onChange={(e) => setWebsiteHp(e.target.value)}
                    className="hidden" 
                    tabIndex={-1} 
                    autoComplete="off" 
                  />

                  {/* 152-FZ Consent Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consent152}
                        onChange={(e) => setConsent152(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#FF6A00] focus:ring-[#FF6A00] focus:ring-offset-0 transition cursor-pointer"
                        required
                      />
                      <span className="text-[11px] leading-snug text-slate-400">
                        Согласен на{' '}
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF6A00] underline hover:text-orange-300 font-medium"
                        >
                          обработку персональных данных (152-ФЗ)
                        </a>{' '}
                        и с условиями{' '}
                        <a
                          href="/offer"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF6A00] underline hover:text-orange-300 font-medium"
                        >
                          публичной оферты
                        </a>
                        .
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !consent152}
                    className="w-full mt-2 py-3.5 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-[0.18em] shadow-lg shadow-orange-950/40 border border-orange-400/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Reservation...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit Expedition Booking</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

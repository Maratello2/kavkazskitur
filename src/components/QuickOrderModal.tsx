'use client';

import React, { useEffect, useState } from 'react';
import { useWonderStore } from '@/lib/store/useWonderStore';
import { X, Phone, CheckCircle2, Send } from 'lucide-react';
import Logo from './Logo';

export default function QuickOrderModal() {
  const { isQuickOrderOpen, toggleQuickOrder } = useWonderStore();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [websiteHp, setWebsiteHp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQuickOrderOpen) {
        toggleQuickOrder(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickOrderOpen, toggleQuickOrder]);

  if (!mounted || !isQuickOrderOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Anonymous Client',
          phone: phone.trim(),
          comment: note.trim() || 'Callback request from website header modal',
          tourName: note.trim() || 'General Caucasus Expedition Inquiry',
          website_hp: websiteHp,
          consent: acceptedPolicy,
        }),
      });

      const data = await res.json();
      if (data.redirectUrl) {
        window.open(data.redirectUrl, '_blank');
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setName('');
        setPhone('');
        setNote('');
        setWebsiteHp('');
        toggleQuickOrder(false);
      }, 3500);
    } catch {
      const fallbackWa = `https://wa.me/79280828413?text=${encodeURIComponent(
        `Expedition Booking Request\n\nTour: General Inquiry\nName: ${name}\nPhone: ${phone}`
      )}`;
      window.open(fallbackWa, '_blank');
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    toggleQuickOrder(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-slate-900 dark:text-white transition-all transform animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Request Received!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mb-6">
              Our expedition coordinator will contact you within 15 minutes.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <Logo variant="full" />
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-2xl bg-[#FF6A00]/15 text-[#FF6A00]">
                <Phone size={22} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  Request a Callback
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Fast expedition guidance & consultation
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Leave your phone number and our senior guide will help tailor the ideal route to your dates and mountaineering background.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6A00] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6A00] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Preferred Route or Dates (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Elbrus South 8 Days, July 2026"
                  className="w-full px-4 py-3 rounded-xl text-base sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6A00] transition-all"
                />
              </div>

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
                    I agree with the{' '}
                    <a href="/offer" target="_blank" className="text-[#FF6A00] underline hover:text-orange-400">
                      Terms of Expedition Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" className="text-[#FF6A00] underline hover:text-orange-400">
                      Privacy Policy
                    </a>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !acceptedPolicy}
                className="w-full bg-[#FF6A00] hover:bg-[#E05D00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition shadow-lg shadow-orange-950/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Sending...' : 'Request Callback'}</span>
              </button>
            </form>

            {/* Direct WhatsApp */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 text-center">
              <a
                href="https://wa.me/79286914405?text=Hello!%20I%20would%20like%20a%20consultation%20regarding%20Elbrus%20expeditions."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <Send size={13} />
                <span>Or message us directly on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

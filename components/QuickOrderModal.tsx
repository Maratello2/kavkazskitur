'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWonderStore } from '@/lib/store/useWonderStore';
import { X, Phone, CheckCircle2, Check, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function QuickOrderModal() {
  const { isQuickOrderOpen, toggleQuickOrder } = useWonderStore();
  const [mounted, setMounted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [websiteHp, setWebsiteHp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isQuickOrderOpen) {
      setIsInitializing(true);
      const timer = setTimeout(() => setIsInitializing(false), 280);
      return () => clearTimeout(timer);
    }
  }, [isQuickOrderOpen]);

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

  const isNameValid = name.trim().length >= 2;
  const isPhoneValid = phone.replace(/\D/g, '').length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) {
      setTouched((p) => ({ ...p, phone: true }));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Клиент сайта',
          phone: phone.trim(),
          comment: note.trim() || 'Быстрая заявка на консультацию',
          tourName: note.trim() || 'Экспедиции по Кавказу 2026',
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
      }, 3200);
    } catch {
      const fallbackWa = `https://wa.me/79280828413?text=${encodeURIComponent(
        `Заявка на звонок гида\n\nМаршрут: ${note || 'Общая консультация'}\nИмя: ${name}\nТелефон: ${phone}`
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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300"
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="quick-order-title"
    >
      <div
        className="bg-[#091422] border-t sm:border border-white/[0.08] rounded-t-[28px] sm:rounded-3xl p-5 sm:p-7 max-w-md w-full shadow-2xl relative text-white transition-all transform animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
        }}
      >
        {/* Native Bottom Sheet Drag Pill for screens < 768px */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto my-1.5 sm:hidden" />

        {/* Close Button - strictly neutral colors (Zero red) */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer"
          aria-label="Закрыть окно"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-500/30">
              <CheckCircle2 size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Заявка принята!
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mb-6 leading-relaxed">
              Старший координатор экспедиций свяжется с вами в течение 15 минут для консультации по маршруту.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Закрыть окно
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-3">
              <Logo variant="full" />
            </div>

            <div className="flex items-center gap-3 mb-2.5">
              <div className="p-2.5 rounded-xl bg-[#FF6A00]/15 text-[#FF6A00] border border-orange-500/20">
                <Phone size={20} strokeWidth={1.75} />
              </div>
              <div>
                <h2 id="quick-order-title" className="text-lg sm:text-xl font-bold text-white leading-tight">
                  Быстрая связь с гидом
                </h2>
                <span className="text-xs text-slate-400">
                  Подбор маршрута и консультация по экипировке
                </span>
              </div>
            </div>

            {/* SKELETON STATE (Dark Alpine Luxury Skeletons) */}
            {isInitializing ? (
              <div className="space-y-3.5 py-3 animate-pulse" aria-busy="true">
                <div className="h-3 w-40 bg-white/[0.06] rounded" />
                <div className="h-11 w-full bg-white/[0.04] rounded-xl border border-white/[0.06]" />
                <div className="h-3 w-32 bg-white/[0.06] rounded" />
                <div className="h-11 w-full bg-white/[0.04] rounded-xl border border-white/[0.06]" />
                <div className="h-12 w-full bg-white/[0.06] rounded-xl mt-4" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 mt-3">
                {/* Honeypot field */}
                <input
                  type="text"
                  name="website_hp"
                  value={websiteHp}
                  onChange={(e) => setWebsiteHp(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Name Field with Inline Validation */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono text-slate-300">
                      Ваше имя *
                    </label>
                    {touched.name && isNameValid && (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                        <Check size={12} strokeWidth={2.5} />
                        <span>Корректно</span>
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                    placeholder="Например: Иван Смирнов"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-base md:text-sm bg-white/[0.04] border text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      touched.name && !isNameValid
                        ? 'border-amber-400/50 focus:border-amber-400'
                        : 'border-white/[0.08] focus:border-[#FF6A00]'
                    }`}
                  />
                </div>

                {/* Phone Field with Inline Validation */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono text-slate-300">
                      Телефон / WhatsApp *
                    </label>
                    {touched.phone && (
                      isPhoneValid ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                          <Check size={12} strokeWidth={2.5} />
                          <span>Номер подтвержден</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-400 font-mono">
                          Минимум 10 цифр с кодом
                        </span>
                      )
                    )}
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                    placeholder="+7 (928) 000-00-00"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-base md:text-sm bg-white/[0.04] border text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      touched.phone && !isPhoneValid
                        ? 'border-amber-400/60 focus:border-amber-400'
                        : 'border-white/[0.08] focus:border-[#FF6A00]'
                    }`}
                  />
                </div>

                {/* Note Field */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Интересующий маршрут или даты (опционально)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Например: Эльбрус с юга, июль 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl text-base md:text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6A00] transition-colors"
                  />
                </div>

                {/* Consent */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptedPolicy}
                      onChange={(e) => setAcceptedPolicy(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#FF6A00] focus:ring-[#FF6A00] focus:ring-offset-0 transition cursor-pointer"
                      required
                    />
                    <span className="text-[11px] leading-snug text-slate-400">
                      Согласен на{' '}
                      <Link
                        href="/privacy"
                        target="_blank"
                        className="text-[#FF6A00] underline hover:text-orange-300 font-medium"
                      >
                        обработку персональных данных (152-ФЗ)
                      </Link>{' '}
                      и с условиями{' '}
                      <Link
                        href="/offer"
                        target="_blank"
                        className="text-[#FF6A00] underline hover:text-orange-300 font-medium"
                      >
                        публичной оферты
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                {/* Buttons: Primary Orange + Neutral Ghost (Zero Red) */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !acceptedPolicy || !phone.trim()}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-[0.18em] shadow-lg shadow-orange-950/40 border border-orange-400/20 transition-all active:scale-95 cursor-pointer"
                  >
                    {isSubmitting ? 'Отправка...' : 'Запросить консультацию'}
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Позже
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

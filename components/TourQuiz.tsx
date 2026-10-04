'use client';

import { useState } from 'react';
import { Tour } from '@/types';
import Link from 'next/link';
import { 
  Compass, 
  Mountain, 
  Car, 
  Tent, 
  Wine, 
  Ship, 
  Clock, 
  CalendarDays, 
  Plane, 
  Sparkles, 
  RotateCcw, 
  ArrowRight,
  ArrowLeft,
  Smile,
  Activity
} from 'lucide-react';
import { getImageUrl } from '@/lib/imageUrl';

export default function TourQuiz({ tours }: { tours: Tour[] }) {
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(1);
  const [state, setState] = useState<{ cat: string | null; dur: string | null; diff: string | null }>({ cat: null, dur: null, diff: null });
  const [results, setResults] = useState<Tour[]>([]);

  const kwMap: Record<string, string[]> = {
    mountains: ['mountain', 'climb', 'elbrus', 'kazbek', 'summit', 'peak', 'glacier'],
    jeep: ['jeep', '4x4', 'canyon', 'offroad', 'safari'],
    trekking: ['trek', 'hike', 'trail', 'walking', 'backpacking'],
    georgia: ['georgia', 'kazbegi', 'stepantsminda'],
    sea: ['sea', 'beach', 'coast', 'water'],
  };

  function answer(s: number, key: string, val: string) {
    const newState = { ...state, [key]: val };
    setState(newState);
    if (s < 3) {
      setStep(s + 1);
    } else {
      showResults(newState);
    }
  }

  function showResults(st: typeof state) {
    const kw = kwMap[st.cat || ''] || [];
    let matched = tours.filter((t) => {
      const n = t.name.toLowerCase();
      const c = (t.category || '').toLowerCase();
      const matchCat = kw.some((k) => n.includes(k) || c.includes(k));
      let durMatch = true;
      if (st.dur === '1' && t.duration !== 1) durMatch = false;
      if (st.dur === '2-4' && (t.duration == null || t.duration < 2 || t.duration > 4)) durMatch = false;
      if (st.dur === '5-8' && (t.duration == null || t.duration < 5 || t.duration > 8)) durMatch = false;
      if (st.dur === '9+' && (t.duration == null || t.duration < 9)) durMatch = false;
      return matchCat && durMatch;
    });
    if (matched.length === 0) matched = tours.slice(0, 3);
    else matched = matched.slice(0, 3);
    setResults(matched);
    setStep(4);
  }

  function reset() {
    setState({ cat: null, dur: null, diff: null });
    setStep(1);
    setResults([]);
  }

  return (
    <section id="tour-quiz" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 lazy-section">
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#C85A32]/15 rounded-full blur-3xl pointer-events-none" />

        {showIntro ? (
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pr-14 sm:pr-16 lg:pr-24">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#C85A32]/15 text-[#C85A32] mb-3">
                <Compass className="w-4 h-4" /> Route Matchmaker
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">
                Not sure which expedition to choose?
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Answer 3 quick questions to receive personalized Caucasus route recommendations!
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowIntro(false)}
              className="btn-primary shrink-0 px-7 py-3.5 rounded-xl font-bold text-base cursor-pointer shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02]"
              style={{ border: 'none' }}
            >
              Start Matchmaker →
            </button>
          </div>
        ) : (
          <div className="relative z-10">
            {/* Header with step indicators */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-[#C85A32]/20 text-[#C85A32]">
                  <Compass className="w-3.5 h-3.5" /> Step {step <= 3 ? `${step} of 3` : 'Ready'}
                </span>
              </div>
              {step <= 3 && (
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        s === step ? 'w-8 bg-[#C85A32]' : s < step ? 'w-4 bg-[#C85A32]/60' : 'w-4 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {step === 1 && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-white">
                  1. What style of adventure do you prefer?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="group flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C85A32] hover:bg-[#C85A32]/10 text-white transition-all duration-300 shadow-md cursor-pointer text-left font-semibold text-sm md:text-base backdrop-blur-sm"
                    onClick={() => answer(1, 'cat', 'mountains')}
                  >
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-[#C85A32]/20 text-[#C85A32] transition-colors">
                      <Mountain size={20} />
                    </div>
                    <span>Mountains & Summit Ascents</span>
                  </button>

                  <button
                    type="button"
                    className="group flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C85A32] hover:bg-[#C85A32]/10 text-white transition-all duration-300 shadow-md cursor-pointer text-left font-semibold text-sm md:text-base backdrop-blur-sm"
                    onClick={() => answer(1, 'cat', 'jeep')}
                  >
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-[#C85A32]/20 text-[#C85A32] transition-colors">
                      <Car size={20} />
                    </div>
                    <span>4x4 Jeep Expeditions & Canyons</span>
                  </button>

                  <button
                    type="button"
                    className="group flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C85A32] hover:bg-[#C85A32]/10 text-white transition-all duration-300 shadow-md cursor-pointer text-left font-semibold text-sm md:text-base backdrop-blur-sm"
                    onClick={() => answer(1, 'cat', 'trekking')}
                  >
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-[#C85A32]/20 text-[#C85A32] transition-colors">
                      <Tent size={20} />
                    </div>
                    <span>Alpine Trekking & Wild Passes</span>
                  </button>

                  <button
                    type="button"
                    className="group flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C85A32] hover:bg-[#C85A32]/10 text-white transition-all duration-300 shadow-md cursor-pointer text-left font-semibold text-sm md:text-base backdrop-blur-sm"
                    onClick={() => answer(1, 'cat', 'georgia')}
                  >
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-[#C85A32]/20 text-[#C85A32] transition-colors">
                      <Wine size={20} />
                    </div>
                    <span>Kazbek & Georgia Culture</span>
                  </button>

                  <button
                    type="button"
                    className="group flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C85A32] hover:bg-[#C85A32]/10 text-white transition-all duration-300 shadow-md cursor-pointer text-left font-semibold text-sm md:text-base backdrop-blur-sm"
                    onClick={() => answer(1, 'cat', 'sea')}
                  >
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-[#C85A32]/20 text-[#C85A32] transition-colors">
                      <Ship size={20} />
                    </div>
                    <span>Coast & Weekend Getaways</span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-white">
                  2. How many days are you planning for your trip?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button
                    type="button"
                    className="group flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C85A32] hover:bg-[#C85A32]/10 text-white transition-all duration-300 shadow-md cursor-pointer text-left font-semibold text-sm md:text-base backdrop-blur-sm"
                    onClick={() => answer(2, 'dur', '1')}
                  >
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-[#C85A32]/20 text-[#C85A32] transition-colors">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="font-bold">1 Day</div>
                      <div className="text-xs text-slate-300">Single-day excursion</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="group flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C85A32] hover:bg-[#C85A32]/10 text-white transition-all duration-300 shadow-md cursor-pointer text-left font-semibold text-sm md:text-base backdrop-blur-sm"
                    onClick={() => answer(2, 'dur', '2-4')}
                  >
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-[#C85A32]/20 text-[#C85A32] transition-colors">
                      <Compass size={20} />
                    </div>
                    <div>
                      <div className="font-bold">2–4 Days</div>
                      <div className="text-xs text-slate-300">Weekend program</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="group flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C85A32] hover:bg-[#C85A32]/10 text-white transition-all duration-300 shadow-md cursor-pointer text-left font-semibold text-sm md:text-base backdrop-blur-sm"
                    onClick={() => answer(2, 'dur', '5-8')}
                  >
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-[#C85A32]/20 text-[#C85A32] transition-colors">
                      <CalendarDays size={20} />
                    </div>
                    <div>
                      <div className="font-bold">5–8 Days</div>
                      <div className="text-xs text-slate-300">Classic vacation / summit</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="group flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C85A32] hover:bg-[#C85A32]/10 text-white transition-all duration-300 shadow-md cursor-pointer text-left font-semibold text-sm md:text-base backdrop-blur-sm"
                    onClick={() => answer(2, 'dur', '9+')}
                  >
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-[#C85A32]/20 text-[#C85A32] transition-colors">
                      <Plane size={20} />
                    </div>
                    <div>
                      <div className="font-bold">9+ Days</div>
                      <div className="text-xs text-slate-300">Major expedition</div>
                    </div>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-white">
                  3. What is your physical fitness level?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="group flex items-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C85A32] hover:bg-[#C85A32]/10 text-white transition-all duration-300 shadow-md cursor-pointer text-left font-semibold backdrop-blur-sm"
                    onClick={() => answer(3, 'diff', 'easy')}
                  >
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
                      <Smile size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-base">Beginner</div>
                      <div className="text-xs text-slate-300 font-normal">No mountaineering experience</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="group flex items-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C85A32] hover:bg-[#C85A32]/10 text-white transition-all duration-300 shadow-md cursor-pointer text-left font-semibold backdrop-blur-sm"
                    onClick={() => answer(3, 'diff', 'medium')}
                  >
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 group-hover:bg-amber-500/30 transition-colors">
                      <Activity size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-base">Moderate</div>
                      <div className="text-xs text-slate-300 font-normal">Active hiker, good stamina</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="group flex items-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C85A32] hover:bg-[#C85A32]/10 text-white transition-all duration-300 shadow-md cursor-pointer text-left font-semibold backdrop-blur-sm"
                    onClick={() => answer(3, 'diff', 'hard')}
                  >
                    <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 group-hover:bg-red-500/30 transition-colors">
                      <Mountain size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-base">Demanding / Extreme</div>
                      <div className="text-xs text-slate-300 font-normal">High endurance, high-altitude</div>
                    </div>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center">
                  <Sparkles className="w-6 h-6 text-[#C85A32] inline mr-2" />
                  <span>Recommended Expeditions for You:</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                  {results.map((t) => (
                    <div
                      key={t.id}
                      className="bg-slate-800/80 rounded-2xl overflow-hidden shadow-xl border border-white/10 hover:border-[#C85A32]/50 transition-all duration-300 flex flex-col"
                    >
                      <Link href={`/tours/${t.id}`} className="block h-44 relative overflow-hidden group">
                        <img
                          alt={t.name}
                          loading="lazy"
                          decoding="async"
                          src={getImageUrl(t.image_url)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {t.category && (
                          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                            {t.category}
                          </span>
                        )}
                      </Link>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-base text-white mb-2 line-clamp-2 hover:text-[#C85A32] transition-colors">
                            <Link href={`/tours/${t.id}`}>{t.name}</Link>
                          </h4>
                          <div className="text-xs text-slate-300 mb-4">
                            Price: <strong className="text-[#C85A32] text-sm">{t.price || 'On Request'}</strong>
                          </div>
                        </div>
                        <Link
                          href={`/tours/${t.id}`}
                          className="btn-primary text-center text-sm font-semibold py-2.5 px-4 rounded-xl block"
                          style={{ border: 'none', textDecoration: 'none' }}
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm cursor-pointer transition-colors"
                  >
                    <RotateCcw size={16} />
                    <span>Retake Matchmaker</span>
                  </button>
                  <Link
                    href="/expeditions"
                    className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all"
                    style={{ textDecoration: 'none', border: 'none' }}
                  >
                    <span>Browse All Expeditions</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

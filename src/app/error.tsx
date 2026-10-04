'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import Logo from '@/components/Logo';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled expedition exception encountered:', error);
  }, [error]);

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-24 bg-[#08101A] text-slate-100 relative overflow-hidden">
      {/* BACKGROUND WARNING GLOW */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto text-center relative z-10 space-y-6">
        {/* LOGO */}
        <div className="flex justify-center mb-2">
          <Logo variant="full" />
        </div>

        {/* ROCKFALL WARNING ICON */}
        <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-rose-500/15 text-rose-500 border border-rose-500/30 shadow-2xl">
          <AlertOctagon size={56} className="animate-pulse" />
        </div>

        {/* ERROR TITLE */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 inline-block">
            Expedition Route Hazard
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Rockfall Encountered / Technical Error
          </h1>
        </div>

        {/* MESSAGE */}
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          An unforeseen technical obstacle has temporarily blocked this section of the expedition trail. Our mountain tech team has been alerted.
        </p>

        {error.digest && (
          <div className="text-[11px] font-mono text-slate-500 bg-black/40 border border-white/5 py-1 px-3 rounded-lg inline-block">
            Error Digest: {error.digest}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-orange-950/50 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Retry Expedition Attempt</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0E1F33] hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white font-bold text-sm uppercase tracking-wider transition-all cursor-pointer"
          >
            <Home size={16} className="text-[#C2410C]" />
            <span>Return to Base Camp</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

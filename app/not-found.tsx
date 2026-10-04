import Link from 'next/link';
import { Mountain, Compass, ArrowRight, MapPin } from 'lucide-react';
import Logo from '@/components/Logo';

export const metadata = {
  title: 'Lost in the Mist / Route Not Found (404) | KavKazSkiTur',
  description: 'The trail you are looking for does not exist or has been relocated.',
};

export default function NotFound() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-24 bg-[#08101A] text-slate-100 relative overflow-hidden">
      {/* GLOW ATMOSPHERE */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C2410C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl mx-auto text-center relative z-10 space-y-6">
        {/* BRAND LOGO */}
        <div className="flex justify-center mb-4">
          <Logo variant="full" />
        </div>

        {/* MOUNTAIN COMPASS ICON */}
        <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-[#C2410C]/15 text-[#C2410C] border border-[#C2410C]/30 shadow-2xl">
          <Mountain size={64} className="animate-pulse" />
        </div>

        {/* 404 NUMBER & TITLE */}
        <div className="space-y-3">
          <span className="text-7xl sm:text-9xl font-black text-[#C2410C] tracking-tight drop-shadow-lg block font-mono">
            404
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Lost in the Mist / Route Not Found (404)
          </h1>
        </div>

        {/* DESCRIPTION */}
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          The trail you are looking for does not exist or has been relocated.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-orange-950/50 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Return to Base Camp &rarr;</span>
          </Link>

          <Link
            href="/expeditions"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0E1F33] hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white font-bold text-sm uppercase tracking-wider transition-all cursor-pointer"
          >
            <Compass size={16} className="text-[#C2410C]" />
            <span>Explore Expeditions</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

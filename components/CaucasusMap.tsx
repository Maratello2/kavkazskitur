'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const CaucasusMapInner = dynamic(() => import('./CaucasusMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[480px] rounded-3xl bg-[#08101A] border border-white/10 flex flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-[#C2410C]" />
      <span className="text-xs uppercase tracking-widest font-bold text-slate-300">
        Loading Caucasus Alpine Cartography...
      </span>
    </div>
  ),
});

export default function CaucasusMap() {
  return <CaucasusMapInner />;
}

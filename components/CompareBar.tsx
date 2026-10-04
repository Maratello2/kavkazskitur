'use client';
import { useWonderStore } from '@/lib/store/useWonderStore';
import Link from 'next/link';
import { Scale } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CompareBar() {
  const { comparison, clearCompare } = useWonderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || comparison.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 p-4 shadow-2xl z-[1000] flex justify-between items-center text-slate-900 dark:text-white transition-colors">
      <div className="font-semibold text-xs sm:text-sm flex items-center">
        <Scale size={16} className="text-[#C85A32] inline mr-2 shrink-0" />
        <span>Selected for comparison: <strong className="text-[#C85A32]">{comparison.length}</strong>/4 expeditions</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={clearCompare}
          className="text-xs text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 underline cursor-pointer transition-colors"
        >
          Clear
        </button>
        <Link href="/compare" className="btn-primary px-4 py-2 text-xs sm:text-sm">
          Compare Routes →
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Mountain } from 'lucide-react';
import type { ElevationPoint } from '@/lib/toursData';

// Clickable elevation timeline: hovering/tapping a stage highlights it and
// shows its acclimatization note. Bar heights are scaled relative to the
// highest point in the given route.
export default function ElevationProfile({ points }: { points: ElevationPoint[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const maxMeters = Math.max(...points.map((p) => p.meters));

  return (
    <div className="bg-black/20 rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-3">
        <Mountain size={12} /> Elevation Profile
      </div>

      <div className="flex items-end gap-1.5 h-24">
        {points.map((point, i) => {
          const heightPct = Math.max(8, (point.meters / maxMeters) * 100);
          const isActive = activeIndex === i;
          return (
            <button
              key={point.label}
              type="button"
              onMouseEnter={() => setActiveIndex(i)}
              onFocus={() => setActiveIndex(i)}
              onClick={() => setActiveIndex(isActive ? null : i)}
              className="group flex-1 h-full flex flex-col justify-end items-center cursor-pointer"
              aria-label={`${point.label}, ${point.meters} meters`}
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  isActive ? 'bg-[#0284C7]' : 'bg-slate-700 group-hover:bg-[#0284C7]/70'
                }`}
                style={{ height: `${heightPct}%` }}
              />
            </button>
          );
        })}
      </div>

      <div className="flex gap-1.5 mt-1.5">
        {points.map((point, i) => (
          <div key={point.label} className="flex-1 text-center">
            <div className="text-[9px] text-stone-500 truncate">{point.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-white/10 text-xs text-stone-300 min-h-[2.5rem]">
        {activeIndex !== null ? (
          <>
            <span className="font-bold text-white">
              {points[activeIndex].label} — {points[activeIndex].meters.toLocaleString('en-US')} m
            </span>
            {points[activeIndex].note && (
              <span className="text-stone-400"> · {points[activeIndex].note}</span>
            )}
          </>
        ) : (
          <span className="text-stone-500">Hover or tap a stage to see acclimatization details.</span>
        )}
      </div>
    </div>
  );
}

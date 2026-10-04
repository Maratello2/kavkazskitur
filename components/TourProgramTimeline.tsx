'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface ProgramStep {
  dayNum: number | string;
  title: string;
  content: string;
}

interface TourProgramTimelineProps {
  program: string | null | undefined;
}

export default function TourProgramTimeline({ program }: TourProgramTimelineProps) {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (!program || program.trim().length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-lg dark:shadow-none">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="text-[#C85A32]" size={22} />
          <span>Route Itinerary</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          A detailed timeline and hourly schedule are coordinated by the expedition leader with the group prior to departure, taking into account current mountain weather conditions and participant fitness levels.
        </p>
      </div>
    );
  }

  // Parse program into days
  const steps: ProgramStep[] = [];
  const lines = program
    .split(/\r?\n|<br\s*\/?>|<\/p>|<p>/i)
    .map((l) => l.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  let currentDay: ProgramStep | null = null;
  let dayCounter = 1;

  for (const line of lines) {
    const dayMatch =
      line.match(/^(?:day)\s*(\d+)[:\.\s-]*(.*)/i) ||
      line.match(/^(\d+)\s*(?:day|days)[:\.\s-]*(.*)/i);

    if (dayMatch) {
      if (currentDay) {
        steps.push(currentDay);
      }
      const dayNum = parseInt(dayMatch[1], 10);
      let subTitle = dayMatch[2].trim();
      subTitle = subTitle.replace(new RegExp('^(?:day)\\s*' + dayNum + '[:\\s-]*', 'i'), '').trim();

      currentDay = {
        dayNum,
        title: subTitle || `Day ${dayNum} Plan`,
        content: '',
      };
    } else {
      if (currentDay) {
        currentDay.content += (currentDay.content ? '\n\n' : '') + line;
      } else {
        currentDay = {
          dayNum: dayCounter++,
          title: line.length < 60 ? line : `Stage ${dayCounter - 1}`,
          content: line.length >= 60 ? line : '',
        };
      }
    }
  }

  if (currentDay) {
    steps.push(currentDay);
  }

  if (steps.length === 0 || (steps.length === 1 && !steps[0].content)) {
    return (
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-lg dark:shadow-none">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
          <Calendar className="text-[#C85A32]" size={22} />
          <span>Route Itinerary</span>
        </h2>
        <div
          className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: program }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-lg dark:shadow-none">
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Calendar className="text-[#C85A32]" size={22} />
          <span>Day-by-Day Expedition Itinerary</span>
        </h2>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-500/10 text-[#C85A32]">
          {steps.length} {steps.length === 1 ? 'day' : 'days'}
        </span>
      </div>

      <div className="space-y-3.5">
        {steps.map((step, idx) => {
          const isOpen = openItems[idx];
          return (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/40 transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-xl bg-[#C85A32] text-white text-xs font-extrabold flex items-center justify-center shadow-md shadow-orange-500/20">
                    {step.dayNum}
                  </span>
                  <div>
                    <span className="text-xs text-[#C85A32] font-bold block uppercase tracking-wider">
                      Day {step.dayNum}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <div
                  className={`p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#C85A32]' : ''
                  }`}
                >
                  <ChevronDown size={18} />
                </div>
              </button>

              {isOpen && step.content && (
                <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/40 whitespace-pre-line">
                  {step.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

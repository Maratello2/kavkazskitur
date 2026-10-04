'use client';

import { useState, useEffect } from 'react';
import { Check, ShieldCheck, Layers, FileCheck2, RotateCcw, CheckCheck } from 'lucide-react';

interface GearCategory {
  id: string;
  name: string;
  icon: typeof Layers;
  description: string;
  items: {
    id: string;
    label: string;
    requirement: 'Mandatory' | 'Recommended' | 'Included/Rentable';
    note?: string;
  }[];
}

const GEAR_DATA: GearCategory[] = [
  {
    id: 'technical',
    name: 'Technical Mountaineering Gear',
    icon: Layers,
    description: 'Essential alpine hardware tested for steep glacial terrain and ice slopes.',
    items: [
      { id: 'crampons', label: '10–12 point steel crampons', requirement: 'Mandatory', note: 'Adjusted to your double boots with anti-balling plates.' },
      { id: 'ice-axe', label: 'Classic alpine ice axe (55–65 cm)', requirement: 'Mandatory', note: 'Curved pick with wrist leash for self-arrest.' },
      { id: 'harness', label: 'Mountaineering harness & 2 locking carabiners', requirement: 'Mandatory', note: 'Lightweight alpine harness with adjustable leg loops.' },
      { id: 'helmet', label: 'Certified climbing helmet (UIAA/CE)', requirement: 'Mandatory', note: 'Fitted over warm balaclava or beanie.' },
      { id: 'poles', label: 'Telescopic trekking poles', requirement: 'Mandatory', note: 'Fitted with large snow baskets for deep powder.' },
      { id: 'backpack', label: '40–60L expedition backpack', requirement: 'Mandatory', note: 'With external straps for crampons and ice axe.' },
      { id: 'headlamp', label: 'Cold-resistant headlamp (250+ lumens)', requirement: 'Mandatory', note: 'With spare set of lithium batteries for summit night.' },
      { id: 'avalanche', label: 'Avalanche beacon, probe & shovel', requirement: 'Included/Rentable', note: 'Standard equipment for ski tour expeditions.' }
    ]
  },
  {
    id: 'clothing',
    name: 'Warm Layers & Footwear',
    icon: ShieldCheck,
    description: 'Layering system designed to endure summit temperatures down to -25°C with strong winds.',
    items: [
      { id: 'down-parka', label: 'Expedition heavy down parka (-25°C rated)', requirement: 'Mandatory', note: '800+ fill power goose down with windproof outer shell.' },
      { id: 'double-boots', label: 'Double mountaineering boots', requirement: 'Mandatory', note: 'Rigid sole with removable insulated thermal liners.' },
      { id: 'hardshell', label: 'Gore-Tex hardshell storm jacket & pants', requirement: 'Mandatory', note: 'Windproof, waterproof membrane with full side zippers.' },
      { id: 'midlayer', label: 'Polartec fleece / Primaloft mid-layer jacket', requirement: 'Mandatory', note: 'Breathable insulation for continuous uphill trekking.' },
      { id: 'baselayer', label: 'Merino wool thermal base layers (2 sets)', requirement: 'Mandatory', note: '200–260 g/m² wool top and bottoms for moisture control.' },
      { id: 'eyewear', label: 'Category 4 glacier glasses & storm goggles', requirement: 'Mandatory', note: '100% UV protection with side shields against snow blindness.' },
      { id: 'gloves', label: '3-Tier glove system (liner, softshell, mitten)', requirement: 'Mandatory', note: 'Heavy insulated mittens essential for summit push.' },
      { id: 'socks', label: 'Heavyweight merino mountaineering socks (3 pairs)', requirement: 'Mandatory', note: 'Cushioned high-altitude socks to prevent blisters.' }
    ]
  },
  {
    id: 'documents',
    name: 'Documents & Logistics Clearance',
    icon: FileCheck2,
    description: 'Mandatory legal clearances and safety documentation managed with authorities.',
    items: [
      { id: 'passport', label: 'Valid international passport', requirement: 'Mandatory', note: 'Must have at least 6 months validity from departure date.' },
      { id: 'fsb-permit', label: 'FSB Border Zone clearance pass', requirement: 'Mandatory', note: 'Fully submitted and processed in advance by KavKazSkiTur.' },
      { id: 'insurance', label: 'High-altitude mountaineering insurance', requirement: 'Mandatory', note: 'Policy with helicopter rescue evacuation coverage up to 6,000 m.' },
      { id: 'mchs', label: 'MCHS Search & Rescue registration sheet', requirement: 'Included/Rentable', note: 'Registered directly by our lead guide before departure.' }
    ]
  }
];

const STORAGE_KEY = 'kavkazskitur_alpine_checklist_v3';

export default function GearChecklist() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<string>('technical');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCheckedItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const totalCount = GEAR_DATA.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPct = Math.round((checkedCount / totalCount) * 100);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const checkAllCurrent = () => {
    const currentCat = GEAR_DATA.find(c => c.id === activeTab);
    if (!currentCat) return;

    setCheckedItems(prev => {
      const next = { ...prev };
      currentCat.items.forEach(item => {
        next[item.id] = true;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resetAll = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const activeCategoryData = GEAR_DATA.find(c => c.id === activeTab) || GEAR_DATA[0];

  return (
    <div className="w-full">
      {/* Top HUD Strip: Progress & Actions */}
      <div className="pb-5 mb-6 border-b border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-200 font-semibold">
              Alpine Readiness Protocol
            </span>
            <span className="text-white/20">•</span>
            <span className="font-mono text-xs font-bold text-[#FF6A00]">
              {isClient ? checkedCount : 0} of {totalCount} packed ({isClient ? progressPct : 0}%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={checkAllCurrent}
              className="min-h-[38px] inline-flex items-center justify-center gap-1.5 text-xs text-slate-300 hover:text-[#FF6A00] px-3.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer active:scale-95 font-mono"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#FF6A00]" strokeWidth={1.5} />
              <span>Check Section</span>
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="min-h-[38px] inline-flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] transition-colors cursor-pointer active:scale-95 font-mono"
              title="Reset all saved checks"
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Seamless Progress bar */}
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-orange-500 to-[#FF6A00] transition-all duration-300 rounded-full"
            style={{ width: `${isClient ? progressPct : 0}%` }}
          />
        </div>
      </div>

      {/* Underline Category Tabs */}
      <div className="flex border-b border-white/[0.08] overflow-x-auto no-scrollbar gap-1 sm:gap-2 mb-6">
        {GEAR_DATA.map(cat => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          const catChecked = cat.items.filter(i => checkedItems[i.id]).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`min-h-[44px] flex items-center gap-2.5 px-4 sm:px-5 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer select-none active:scale-[0.98] ${
                isActive
                  ? 'border-[#FF6A00] text-white bg-white/[0.04]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6A00]' : 'text-slate-400'}`} strokeWidth={1.5} />
              <span>{cat.name}</span>
              <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300">
                {isClient ? catChecked : 0}/{cat.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Items list directly on canvas */}
      <div className="space-y-4">
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans max-w-3xl">
          {activeCategoryData.description} Missing equipment can be rented upon arrival at our Terskol alpine warehouse.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeCategoryData.items.map(item => {
            const isChecked = Boolean(checkedItems[item.id]);

            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`min-h-[52px] flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none active:scale-[0.99] ${
                  isChecked
                    ? 'bg-[#FF6A00]/10 border-[#FF6A00]/40 text-white'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15 text-slate-300 hover:bg-white/[0.04]'
                }`}
              >
                <div
                  className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-[#FF6A00] border-[#FF6A00]'
                      : 'border-slate-500 bg-transparent'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start sm:items-center justify-between gap-2">
                    <span className={`text-xs sm:text-sm font-semibold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                      {item.label}
                    </span>
                    <span
                      className={`font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shrink-0 ${
                        item.requirement === 'Mandatory'
                          ? 'bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.requirement}
                    </span>
                  </div>
                  {item.note && (
                    <div className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-snug">
                      {item.note}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

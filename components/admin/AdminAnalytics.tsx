'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Compass,
  Users,
  Target,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  Package,
  Activity,
  Mountain,
} from 'lucide-react';

const MONTHLY_TREND = [
  { month: 'May 2026', revenueRub: 1850000, revenueUsd: 20000, bookings: 18 },
  { month: 'Jun 2026', revenueRub: 3420000, revenueUsd: 36970, bookings: 34 },
  { month: 'Jul 2026', revenueRub: 4950000, revenueUsd: 53510, bookings: 48 },
  { month: 'Aug 2026', revenueRub: 3120000, revenueUsd: 33730, bookings: 29 },
  { month: 'Sep 2026', revenueRub: 1480000, revenueUsd: 16000, bookings: 13 },
];

const ROUTE_DISTRIBUTION = [
  { name: 'Elbrus South (Classic)', shortName: 'Elbrus South', climbers: 64, share: 45, color: '#D9530F' },
  { name: 'Elbrus North (Wild)', shortName: 'Elbrus North', climbers: 28, share: 20, color: '#F97316' },
  { name: 'Bezengi Alpine Camp', shortName: 'Bezengi Camp', climbers: 26, share: 18, color: '#38BDF8' },
  { name: 'Mount Kazbek (5,033m)', shortName: 'Mount Kazbek', climbers: 17, share: 12, color: '#10B981' },
  { name: '4x4 Highland Expeditions', shortName: 'Caucasus 4x4', climbers: 7, share: 5, color: '#8B5CF6' },
];

const GEAR_DEMAND = [
  {
    name: 'High-Altitude Double Boots (6,000m)',
    category: 'Footwear & Thermal',
    demandPct: 68,
    requests: 97,
    inStock: 80,
    status: 'High Demand',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  {
    name: 'Technical Mountaineering Crampons',
    category: 'Hardware & Glacier',
    demandPct: 54,
    requests: 77,
    inStock: 95,
    status: 'Optimal',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  {
    name: 'Storm Down Parka (-30°C Arctic Spec)',
    category: 'Outerwear Shell',
    demandPct: 42,
    requests: 60,
    inStock: 50,
    status: 'Limited Stock',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  },
  {
    name: 'Classic Mountaineering Ice Axes',
    category: 'Hardware & Belay',
    demandPct: 38,
    requests: 54,
    inStock: 70,
    status: 'Optimal',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
];

// Custom Dark Glassmorphic Tooltip matching KavKazSkiTur identity
function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#091422]/95 border border-[#C2410C]/40 p-4 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[210px]">
        <div className="font-extrabold text-white text-sm border-b border-white/10 pb-1 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#C2410C]">Telemetry</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-slate-300">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
            Gross Revenue:
          </span>
          <span className="font-extrabold text-[#FB923C]">
            ₽{data.revenueRub.toLocaleString('en-US')}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-slate-400 text-[11px]">
          <span>USD Equivalent:</span>
          <span className="font-semibold text-slate-200">
            ${data.revenueUsd.toLocaleString('en-US')}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-slate-300 pt-1.5 border-t border-white/5">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            Confirmed Climbers:
          </span>
          <span className="font-extrabold text-[#38BDF8]">
            {data.bookings} pax
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function AdminAnalytics() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* SECTION 1: 4 KPI CARDS (Styled matching main site METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Gross Revenue */}
        <div className="bg-[#0E1F33] border border-white/10 rounded-2xl p-6 hover:border-[#C2410C]/50 transition-all duration-300 shadow-xl flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#38BDF8]" />
              Gross Revenue
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              +18.4%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ₽14,820,000
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
              <span>Season to date</span>
              <span className="text-slate-300 font-semibold">~$160,216 USD</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Expeditions */}
        <div className="bg-[#0E1F33] border border-white/10 rounded-2xl p-6 hover:border-[#C2410C]/50 transition-all duration-300 shadow-xl flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
              Active Teams
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              +2 vs last mo
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              8 Groups
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
              <span>On high-altitude routes</span>
              <span className="text-emerald-400 font-semibold">All Guided</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Booked Climbers */}
        <div className="bg-[#0E1F33] border border-white/10 rounded-2xl p-6 hover:border-[#C2410C]/50 transition-all duration-300 shadow-xl flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
              Booked Climbers
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-300 bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              +24 this mo
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              142 Climbers
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
              <span>Target: 200 slots</span>
              <span className="text-slate-300 font-semibold">71% Filled</span>
            </div>
          </div>
        </div>

        {/* Card 4: Lead Conversion Rate */}
        <div className="bg-[#0E1F33] border border-white/10 rounded-2xl p-6 hover:border-[#C2410C]/50 transition-all duration-300 shadow-xl flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#38BDF8]" />
              Inquiry Conversion
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              +3.2% vs target
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              24.6%
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
              <span>Lead-to-deposit ratio</span>
              <span className="text-slate-300 font-semibold">High Margin</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: REVENUE & BOOKINGS TREND (AREA CHART) */}
      <div className="bg-[#0E1F33] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C] mb-1">
              <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
              Peak Season 2026 Telemetry
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Monthly Revenue &amp; Climber Volume
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregate receipts and confirmed expedition participants across Greater Caucasus routes
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]" />
              <span>Gross Receipts (RUB)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
              <span>Climbers (pax)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGradBrand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C2410C" stopOpacity={0.4} />
                    <stop offset="90%" stopColor="#C2410C" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="bookGradBrand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.3} />
                    <stop offset="90%" stopColor="#38BDF8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#ffffff10' }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#ffffff10' }}
                  tickFormatter={(v) => `₽${(v / 1000000).toFixed(1)}M`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#38BDF8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}p`}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenueRub"
                  stroke="#C2410C"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revGradBrand)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#bookGradBrand)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs">
              Initializing Analytics Engine...
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: ROUTE POPULARITY (BAR CHART) & GEAR DEMAND (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Route Popularity & Capacity (7 cols) */}
        <div className="lg:col-span-7 bg-[#0E1F33] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C]">
                  <Mountain className="w-3.5 h-3.5 text-[#38BDF8]" />
                  Summit Route Share
                </div>
                <h3 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
                  Route Popularity &amp; Capacity
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-300 bg-white/[0.04] px-3 py-1 rounded-full border border-white/10">
                142 Climbers Total
              </span>
            </div>

            {/* Recharts BarChart with refined alpine styling */}
            <div className="h-60 w-full mt-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={ROUTE_DISTRIBUTION}
                    margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                    <XAxis
                      type="number"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      domain={[0, 50]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      dataKey="shortName"
                      type="category"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#ffffff10' }}
                      width={95}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-[#091422]/95 border border-[#C2410C]/40 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                              <div className="font-extrabold text-white">{d.name}</div>
                              <div className="text-slate-300">
                                Share: <span className="font-extrabold text-[#FB923C]">{d.share}%</span>
                              </div>
                              <div className="text-slate-400 text-[11px]">
                                Confirmed: <span className="text-[#38BDF8] font-bold">{d.climbers} climbers</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="share" radius={[0, 6, 6, 0]}>
                      {ROUTE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`bar-cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs">
                  Loading Route Data...
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Peak route bottleneck: Elbrus South July slots at 92% capacity</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 size={13} />
              Mountain Guides Assigned
            </span>
          </div>
        </div>

        {/* Right: Gear Rental Demand Widget (5 cols) */}
        <div className="lg:col-span-5 bg-[#0E1F33] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C]">
                  <Package className="w-3.5 h-3.5 text-[#38BDF8]" />
                  Base Camp Stock
                </div>
                <h3 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
                  Gear Rental Demand
                </h3>
              </div>
            </div>

            <div className="space-y-3.5 my-2">
              {GEAR_DEMAND.map((g) => (
                <div
                  key={g.name}
                  className="p-3.5 rounded-xl bg-[#091422]/70 border border-white/5 space-y-2 hover:border-white/15 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">{g.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{g.category}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${g.badgeColor}`}
                    >
                      {g.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        {g.requests} reservations ({g.demandPct}% of climbers)
                      </span>
                      <span className="font-semibold text-slate-300">
                        Stock: {g.inStock}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#08101A] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          g.demandPct > 60
                            ? 'bg-amber-500'
                            : g.demandPct > 40
                            ? 'bg-[#C2410C]'
                            : 'bg-[#38BDF8]'
                        }`}
                        style={{ width: `${g.demandPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-400">
              <ShieldAlert size={14} />
              Double boots pre-allocation recommended
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

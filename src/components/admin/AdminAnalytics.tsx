'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  CheckCircle2,
  Package,
  Activity,
  Mountain,
} from 'lucide-react';

export interface AdminAnalyticsProps {
  inquiries?: any[];
  tours?: any[];
  usdRate?: number;
  hideKpis?: boolean;
}

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
            ₽{(data.revenueRub || 0).toLocaleString('ru-RU')}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-slate-400 text-[11px]">
          <span>USD Equivalent:</span>
          <span className="font-semibold text-slate-200">
            ${(data.revenueUsd || 0).toLocaleString('en-US')}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-slate-300 pt-1.5 border-t border-white/5">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            Confirmed Climbers:
          </span>
          <span className="font-extrabold text-[#38BDF8]">
            {data.bookings || 0} pax
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function AdminAnalytics({
  inquiries,
  usdRate = 92.5,
  hideKpis = false,
}: AdminAnalyticsProps) {
  const [mounted, setMounted] = useState(false);
  const [internalInquiries, setInternalInquiries] = useState<any[]>(inquiries || []);

  useEffect(() => {
    setMounted(true);
    if (!inquiries) {
      fetch('/api/admin/leads')
        .then((r) => r.json())
        .then((data) => {
          const list = data.bookings?.length ? data.bookings : data.leads || [];
          setInternalInquiries(list);
        })
        .catch(() => {});
    } else {
      setInternalInquiries(inquiries);
    }
  }, [inquiries]);

  // 1. Confirmed Bookings
  const confirmed = useMemo(() => {
    return internalInquiries.filter(
      (i) => i.status === 'confirmed' || i.status === 'deposit_paid' || i.status === 'paid'
    );
  }, [internalInquiries]);

  // 2. Financial & Volume Metrics
  const totalRevRub = useMemo(() => {
    return confirmed.reduce((acc, curr) => {
      const rub = curr.amountRub || (curr.amountUsd ? curr.amountUsd * usdRate : 0) || 0;
      return acc + rub;
    }, 0);
  }, [confirmed, usdRate]);

  const totalRevUsd = useMemo(() => {
    return confirmed.reduce((acc, curr) => {
      const usd = curr.amountUsd || (curr.amountRub ? Math.round(curr.amountRub / usdRate) : 0) || 0;
      return acc + usd;
    }, 0);
  }, [confirmed, usdRate]);

  const activeTeams = useMemo(() => {
    const tourNames = new Set(confirmed.map((c) => c.tour_name || c.route).filter(Boolean));
    return tourNames.size;
  }, [confirmed]);

  const bookedClimbers = useMemo(() => {
    return confirmed.reduce(
      (acc, curr) => acc + Number(curr.people_count || curr.groupSize || 1),
      0
    );
  }, [confirmed]);

  const conversionRate = useMemo(() => {
    if (internalInquiries.length === 0) return '0.0';
    return ((confirmed.length / internalInquiries.length) * 100).toFixed(1);
  }, [internalInquiries, confirmed]);

  // 3. Real Monthly Trend from confirmed bookings
  const monthlyTrend = useMemo(() => {
    if (confirmed.length === 0) return [];
    const map = new Map<string, { month: string; revenueRub: number; revenueUsd: number; bookings: number }>();
    confirmed.forEach((c) => {
      const dateStr = c.departure_date || c.created_at;
      const d = dateStr ? new Date(dateStr) : new Date();
      const monthKey = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      const current = map.get(monthKey) || { month: monthKey, revenueRub: 0, revenueUsd: 0, bookings: 0 };
      const rub = c.amountRub || (c.amountUsd ? c.amountUsd * usdRate : 0) || 0;
      const usd = c.amountUsd || (c.amountRub ? Math.round(c.amountRub / usdRate) : 0) || 0;
      current.revenueRub += rub;
      current.revenueUsd += usd;
      current.bookings += Number(c.people_count || c.groupSize || 1);
      map.set(monthKey, current);
    });
    return Array.from(map.values());
  }, [confirmed, usdRate]);

  // 4. Real Route Distribution from confirmed bookings
  const routeDistribution = useMemo(() => {
    if (confirmed.length === 0) return [];
    const countMap = new Map<string, number>();
    confirmed.forEach((c) => {
      const r = c.tour_name || c.route || 'General Caucasus Expedition';
      countMap.set(r, (countMap.get(r) || 0) + Number(c.people_count || c.groupSize || 1));
    });
    const colors = ['#D9530F', '#F97316', '#38BDF8', '#10B981', '#8B5CF6', '#EC4899'];
    return Array.from(countMap.entries()).map(([name, climbers], idx) => {
      const share = bookedClimbers > 0 ? Math.round((climbers / bookedClimbers) * 100) : 0;
      return {
        name,
        shortName: name.length > 20 ? name.slice(0, 18) + '...' : name,
        climbers,
        share,
        color: colors[idx % colors.length],
      };
    });
  }, [confirmed, bookedClimbers]);

  // 5. Real Gear Demand from inquiries
  const gearDemand = useMemo(() => {
    const gearCounts: Record<string, number> = {};
    internalInquiries.forEach((inq) => {
      const text = `${inq.gear_requests || ''} ${inq.comment || ''}`.toLowerCase();
      if (!text.trim()) return;
      if (text.includes('boot') || text.includes('ботин')) {
        gearCounts['High-Altitude Double Boots (6,000m)'] = (gearCounts['High-Altitude Double Boots (6,000m)'] || 0) + 1;
      }
      if (text.includes('crampon') || text.includes('кошк')) {
        gearCounts['Technical Mountaineering Crampons'] = (gearCounts['Technical Mountaineering Crampons'] || 0) + 1;
      }
      if (text.includes('axe') || text.includes('ледоруб')) {
        gearCounts['Classic Mountaineering Ice Axes'] = (gearCounts['Classic Mountaineering Ice Axes'] || 0) + 1;
      }
      if (text.includes('parka') || text.includes('пуховик') || text.includes('куртк')) {
        gearCounts['Storm Down Parka (-30°C)'] = (gearCounts['Storm Down Parka (-30°C)'] || 0) + 1;
      }
    });
    return Object.entries(gearCounts).map(([name, count]) => {
      const demandPct = internalInquiries.length > 0 ? Math.round((count / internalInquiries.length) * 100) : 0;
      return {
        name,
        requests: count,
        demandPct,
        status: demandPct > 50 ? 'High Demand' : 'Available',
        badgeColor: demandPct > 50 ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      };
    });
  }, [internalInquiries]);

  return (
    <div className="space-y-8">
      {/* SECTION 1: 4 KPI CARDS (Only when not hidden by parent) */}
      {!hideKpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Gross Revenue */}
          <div className="bg-[#0E1F33] border border-white/10 rounded-2xl p-6 hover:border-[#C2410C]/50 transition-all duration-300 shadow-xl flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#38BDF8]" />
                Gross Revenue
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <ArrowUpRight size={12} />
                Live
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                ₽{totalRevRub.toLocaleString('ru-RU')}
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                <span>Confirmed turnover</span>
                <span className="text-slate-300 font-semibold">${totalRevUsd.toLocaleString('en-US')} USD</span>
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
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-300 bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {activeTeams} Groups
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                <span>On high-altitude routes</span>
                <span className="text-emerald-400 font-semibold">Routes Ready</span>
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
                Season 2026
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {bookedClimbers} Climbers
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                <span>Registered slots</span>
                <span className="text-slate-300 font-semibold">Live Intake</span>
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
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                Telemetry
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {conversionRate}%
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                <span>Lead-to-deposit ratio</span>
                <span className="text-slate-300 font-semibold">Direct Intake</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: REVENUE & BOOKINGS TREND (AREA CHART) */}
      <div className="bg-[#0E1F33] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C] mb-1">
              <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
              Expedition Telemetry
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
          {!mounted ? (
            <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs">
              Initializing Analytics Engine...
            </div>
          ) : monthlyTrend.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl bg-[#091422]/50">
              <Activity className="w-8 h-8 text-slate-500 mb-2" />
              <div className="text-sm font-bold text-white">No Confirmed Telemetry Yet</div>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Real-time receipts and climber volume curves will render automatically once inquiries and client deposits are confirmed.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  tickFormatter={(v) => `₽${(v / 1000).toFixed(0)}k`}
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
                {bookedClimbers} Climbers Total
              </span>
            </div>

            <div className="h-60 w-full mt-2">
              {!mounted ? (
                <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs">
                  Loading Route Data...
                </div>
              ) : routeDistribution.length === 0 ? (
                <div className="h-full w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl bg-[#091422]/50">
                  <Mountain className="w-8 h-8 text-slate-500 mb-2" />
                  <div className="text-sm font-bold text-white">No Route Telemetry Yet</div>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Route distribution and popularity will render dynamically as client bookings are registered.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={routeDistribution}
                    margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                    <XAxis
                      type="number"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                      dataKey="shortName"
                      type="category"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#ffffff10' }}
                      width={110}
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
                      {routeDistribution.map((entry, index) => (
                        <Cell key={`bar-cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Expedition routes open for 2026 season</span>
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

            {gearDemand.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-[#091422]/50 my-2">
                <Package className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <div className="text-sm font-bold text-white">No Gear Requests Yet</div>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  Equipment rental requirements submitted by clients will be tracked here in real time.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 my-2">
                {gearDemand.map((g) => (
                  <div
                    key={g.name}
                    className="p-3.5 rounded-xl bg-[#091422]/70 border border-white/5 space-y-2 hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-bold text-white leading-tight">{g.name}</div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${g.badgeColor}`}
                      >
                        {g.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          {g.requests} requests ({g.demandPct}% of inquiries)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#08101A] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#C2410C]"
                          style={{ width: `${Math.min(100, g.demandPct || 10)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-400">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Base camp rental inventory ready for 2026 season
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mountain, Compass, ShieldCheck, Award } from 'lucide-react';

const stats = [
  { label: 'Highest Point', value: '5,642 M', sub: 'Mt. Elbrus West Peak', icon: Mountain },
  { label: 'Summit Success', value: '98.4%', sub: 'Commercial Expeditions', icon: Award },
  { label: 'Routes Mapped', value: '30+ Paths', sub: 'North & South Caucasus', icon: Compass },
  { label: 'Safety Record', value: '100% EMERCOM', sub: 'Certified Alpine Guides', icon: ShieldCheck },
];

export function Floating3DStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative rounded-2xl border border-white/[0.08] bg-[#09111D]/80 backdrop-blur-xl p-5 shadow-2xl transition-all duration-300 hover:border-orange-500/40 hover:shadow-orange-500/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-lg bg-white/[0.04] p-2 text-orange-400 group-hover:scale-110 transition-transform">
                <Icon size={20} />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500">2026 STAT</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{item.value}</div>
            <div className="text-xs font-semibold text-slate-300 mt-1">{item.label}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{item.sub}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default Floating3DStats;

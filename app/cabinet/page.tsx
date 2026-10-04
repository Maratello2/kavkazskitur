import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, UserCheck } from 'lucide-react';
import CabinetClient from '@/components/CabinetClient';

export const metadata: Metadata = {
  title: 'Climber Expedition Portal & Dashboard | KavKazSkiTur',
  description: 'Manage your active Mount Elbrus and Kazbek expeditions, track FSB border security pass approvals, and organize your Azau Glade mountaineering gear rental manifest.',
};

export default function CabinetPage() {
  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-100 pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8 font-mono">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#FF6A00]">Climber Dashboard</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF6A00] mb-1">
              <UserCheck size={14} />
              <span>Personal Climber Headquarters</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              Expedition Portal
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-300 font-bold">Encrypted Session • ID: #KK-2026-084</span>
          </div>
        </div>

        {/* Client Dashboard Component */}
        <CabinetClient />
      </div>
    </main>
  );
}

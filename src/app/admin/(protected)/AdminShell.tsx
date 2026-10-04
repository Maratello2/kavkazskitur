'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  BarChart3,
  ClipboardList,
  Mountain,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
  Compass,
  Globe,
} from 'lucide-react';
import Logo from '@/components/Logo';

const NAV_TABS = [
  { id: 'analytics', href: '/admin?tab=analytics', label: 'Analytics & Metrics', icon: BarChart3 },
  { id: 'crm', href: '/admin?tab=crm', label: 'Inquiries & CRM', icon: ClipboardList },
  { id: 'tours', href: '/admin?tab=tours', label: 'Expedition Catalog', icon: Mountain },
  { id: 'settings', href: '/admin?tab=settings', label: 'Global Settings', icon: Settings },
  { id: 'users', href: '/admin?tab=users', label: 'Team & Access', icon: Users },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'analytics';

  return (
    <div className="space-y-1.5">
      {NAV_TABS.map(({ id, href, label, icon: Icon }) => {
        const isActive = currentTab === id;
        return (
          <Link
            key={id}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#C2410C]/15 border border-[#C2410C]/40 text-[#FB923C] shadow-lg shadow-orange-950/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <Icon size={16} className={isActive ? 'text-[#C2410C]' : 'text-slate-400'} />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default function AdminShell({
  username,
  role = 'superadmin',
  children,
}: {
  username: string;
  role?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const getRoleBadge = (r: string) => {
    switch (r.toLowerCase()) {
      case 'superadmin':
        return { label: 'SUPERADMIN', class: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
      case 'manager':
        return { label: 'MANAGER', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'editor':
        return { label: 'EDITOR', class: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      default:
        return { label: r.toUpperCase(), class: 'bg-slate-700/50 text-slate-300 border-white/10' };
    }
  };

  const roleInfo = getRoleBadge(role);

  return (
    <div className="min-h-screen bg-[#091422] text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0E1F33] border-b border-white/10 sticky top-0 z-40">
        <Logo className="scale-90 origin-left" />

        <div className="flex items-center gap-2">
          {/* Quick Transition to Website on Mobile */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-[#C2410C] text-xs font-bold text-slate-200 hover:text-white border border-white/10 transition-colors shadow-sm"
          >
            <Globe size={13} className="text-[#38BDF8]" />
            <span>На сайт</span>
            <ExternalLink size={11} className="opacity-70" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E1F33] border-b border-white/10 p-4 space-y-4">
          <Suspense fallback={<div className="text-xs text-slate-500">Loading tabs...</div>}>
            <NavLinks onNavigate={() => setMobileMenuOpen(false)} />
          </Suspense>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Operator: <strong className="text-white font-bold">{username}</strong>
              </span>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${roleInfo.class}`}>
                {roleInfo.label}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-rose-400 hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-68 shrink-0 hidden md:flex flex-col border-r border-white/10 bg-[#0E1F33] min-h-screen sticky top-0 z-30">
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-white/10">
          <Logo />
          <div className="mt-2.5 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-extrabold text-[#C2410C]">
            <Compass className="w-3 h-3 text-[#38BDF8]" />
            <span>HQ COMMAND CONSOLE • 3,800M</span>
          </div>

          {/* Quick Transition to Website Action Button */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-[#C2410C] text-slate-200 hover:text-white border border-white/10 hover:border-[#C2410C]/60 text-xs font-bold transition-all shadow-md group mt-4"
          >
            <span className="flex items-center gap-2">
              <Globe size={14} className="text-[#38BDF8] group-hover:text-white transition-colors" />
              <span>Перейти на сайт</span>
            </span>
            <ExternalLink size={13} className="text-slate-400 group-hover:text-white transition-colors" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] uppercase tracking-[0.22em] font-bold text-slate-400">
            Operation Modules
          </div>
          <Suspense fallback={<div className="px-3 text-xs text-slate-500">Loading modules...</div>}>
            <NavLinks />
          </Suspense>
        </nav>

        {/* Bottom Operator & Utility Section */}
        <div className="px-4 py-5 border-t border-white/10 space-y-3 bg-[#091422]/60">
          {/* Operator Status Card */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate">
                  Operator: <strong className="text-white font-bold">{username}</strong>
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Live
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
              <span className="text-slate-400 font-medium">Access Level:</span>
              <span className={`font-extrabold uppercase px-2 py-0.5 rounded border ${roleInfo.class}`}>
                {roleInfo.label}
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 transition-colors cursor-pointer border border-rose-500/20"
          >
            <LogOut size={14} />
            <span>Sign Out Console</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-10 py-8 bg-[#091422]">
        {children}
      </main>
    </div>
  );
}

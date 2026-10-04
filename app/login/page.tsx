import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';

export const metadata = {
  title: 'Client Portal Login | KavKazSkiTur',
  description: 'Log in to your KavKazSkiTur climber portal to manage expedition bookings, equipment lists, and vouchers.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 pt-24 pb-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full mx-auto my-8 sm:my-16 p-8 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <Logo variant="full" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Climber Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Log in to view your expedition contracts, gear manifests, and permits
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
              Phone or Email
            </label>
            <input
              type="text"
              required
              placeholder="+1 (555) 000-0000 or email@example.com"
              className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C85A32] transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
              <a href="#" className="text-[11px] text-[#C85A32] hover:underline font-medium">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C85A32] transition-all"
            />
          </div>

          <button
            type="button"
            className="w-full py-3.5 rounded-xl bg-[#C85A32] hover:bg-[#A84726] text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Log In to Portal</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 dark:border-white/10 text-center space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            New expedition climber?{' '}
            <a href="https://wa.me/79286914405?text=Hello!%20I%20would%20like%20to%20request%20portal%20access." target="_blank" rel="noreferrer" className="text-[#C85A32] font-bold hover:underline">
              Request Access
            </a>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck size={14} className="text-[#C85A32]" />
            <span>Secure 256-Bit SSL Connection</span>
          </div>
        </div>
      </div>
    </main>
  );
}

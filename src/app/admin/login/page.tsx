import { ShieldCheck, KeyRound } from 'lucide-react';
import Logo from '@/components/Logo';
import LoginForm from './LoginForm';

export const metadata = {
  title: 'Secure Admin Console Login | KavKazSkiTur',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#08101A] text-slate-100 pt-24 pb-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full mx-auto my-8 sm:my-16 p-8 bg-[#0E1F33] border border-white/10 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <Logo variant="full" />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
            Admin Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Protected management portal for KavKazSkiTur operations
          </p>
        </div>

        <LoginForm />

        <div className="pt-4 border-t border-white/10 text-center space-y-2.5">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck size={14} className="text-[#C2410C]" />
            <span>Encrypted administrative session (12h expiration)</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 bg-black/40 border border-white/10 py-1.5 px-3 rounded-xl inline-flex items-center gap-1.5">
            <KeyRound size={12} className="text-[#C2410C]" />
            <span>Login: <strong className="text-white">admin</strong> | Password: <strong className="text-white">admin</strong></span>
          </div>
        </div>
      </div>
    </main>
  );
}

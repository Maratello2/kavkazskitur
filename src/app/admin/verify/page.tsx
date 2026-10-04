import { MessageCircle } from 'lucide-react';
import Logo from '@/components/Logo';
import VerifyForm from './VerifyForm';

export const metadata = {
  title: 'Two-Factor Verification | KavKazSkiTur',
  robots: { index: false, follow: false },
};

export default function AdminVerifyPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C2321] dark:bg-[#0B0F17] dark:text-slate-100 pt-24 pb-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full mx-auto my-8 sm:my-16 p-8 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-3 flex flex-col items-center">
          <Logo />
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Two-Factor Verification</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Enter the 6-digit verification code sent to your Telegram
          </p>
        </div>

        <VerifyForm />

        <div className="pt-4 border-t border-slate-100 dark:border-white/10 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <MessageCircle size={14} className="text-[#C85A32]" />
            <span>Code expires in 5 minutes</span>
          </div>
        </div>
      </div>
    </main>
  );
}

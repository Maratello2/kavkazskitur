'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Load failed attempts from localStorage on mount
  useEffect(() => {
    const savedLock = localStorage.getItem('kavkazskitur_admin_lockout');
    if (savedLock) {
      const lockExpiry = parseInt(savedLock, 10);
      const remaining = Math.ceil((lockExpiry - Date.now()) / 1000);
      if (remaining > 0) {
        setLockoutTime(remaining);
      } else {
        localStorage.removeItem('kavkazskitur_admin_lockout');
      }
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutTime <= 0) return;
    const timer = setInterval(() => {
      setLockoutTime((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('kavkazskitur_admin_lockout');
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);

        if (nextAttempts >= MAX_ATTEMPTS) {
          const lockExpiry = Date.now() + LOCKOUT_SECONDS * 1000;
          localStorage.setItem('kavkazskitur_admin_lockout', lockExpiry.toString());
          setLockoutTime(LOCKOUT_SECONDS);
          setError(`Too many failed login attempts. Security lockout active for ${LOCKOUT_SECONDS}s.`);
        } else {
          setError(`${data.error || 'Invalid credentials'}. (${MAX_ATTEMPTS - nextAttempts} attempts remaining)`);
        }
        return;
      }

      // Reset attempts on success
      setFailedAttempts(0);
      localStorage.removeItem('kavkazskitur_admin_lockout');
      if (data.requiresTwoFactor) {
        router.push('/admin/verify');
      } else {
        window.location.href = '/admin';
      }
    } catch {
      setError('Network error connecting to security server, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockoutTime > 0;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {isLocked && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="block font-bold mb-0.5">Brute-Force Protection Triggered</strong>
            Too many consecutive failed login attempts. Form locked for <strong>{lockoutTime} seconds</strong> to safeguard the administration console.
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
          Administrator Username
        </label>
        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            required
            disabled={isLocked}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm bg-[#08101A] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C2410C] transition-all disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
          Master Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            required
            disabled={isLocked}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm bg-[#08101A] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C2410C] transition-all disabled:opacity-50"
          />
        </div>
      </div>

      {error && !isLocked && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300 flex items-center gap-2">
          <AlertTriangle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || isLocked}
        className="w-full py-3.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <ArrowRight size={16} />
        )}
        <span>
          {loading
            ? 'Validating Credentials...'
            : isLocked
            ? `Locked (${lockoutTime}s)`
            : 'Authenticate & Send 2FA Code'}
        </span>
      </button>
    </form>
  );
}

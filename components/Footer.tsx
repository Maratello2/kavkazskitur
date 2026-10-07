'use client';
import Link from 'next/link';
import { useWonderStore } from '@/lib/store/useWonderStore';
import { Phone, ShieldCheck, UserCheck, Lock, Mail, MessageCircle, Send } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const { toggleQuickOrder } = useWonderStore();

  return (
    <footer className="bg-[#060B12] text-slate-400 border-t border-white/[0.06]">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="footer-brand space-y-3">
            <div className="mb-3">
              <Logo variant="full" />
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              High-altitude mountaineering ascents on Mt. Elbrus, ski touring, and alpine logistics across the Greater Caucasus since 2006. Private high camp at Barrels-Garabashi (3,800 m).
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <img src="/img/geotag.svg" alt="Location" className="w-3.5 h-3.5 object-contain inline-block" />
              LLC &ldquo;KavKazSkiTur&rdquo; &bull; Gorkogo St. 74, Nalchik, KBR
            </p>
          </div>

          <div className="footer-col space-y-3">
            <div className="text-sm font-bold uppercase tracking-wider text-white">
              Navigation &amp; Legal
            </div>
            <ul className="space-y-2 text-xs">
              <li><Link href="/expeditions" className="hover:text-[#FF6A00] transition-colors">Expeditions &amp; Tours</Link></li>
              <li><Link href="/schedule" className="hover:text-[#FF6A00] transition-colors">2026 Season Schedule</Link></li>
              <li><Link href="/barrels" className="hover:text-[#FF6A00] transition-colors">Barrels Refuge (3,800 m)</Link></li>
              <li><Link href="/acclimatization" className="hover:text-[#FF6A00] transition-colors">Acclimatization Protocol</Link></li>
              <li><Link href="/safety" className="hover:text-[#FF6A00] transition-colors flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#FF6A00]" /> Safety &amp; Rescue</Link></li>
              <li><Link href="/privacy" className="hover:text-[#FF6A00] underline transition-colors">Privacy Policy</Link></li>
              <li><Link href="/offer" className="hover:text-[#FF6A00] underline transition-colors">Public Offer &amp; Terms</Link></li>
            </ul>
          </div>

          <div className="footer-col space-y-3">
            <div className="text-sm font-bold uppercase tracking-wider text-white">
              Expedition Concierge
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="tel:+79280828413" className="flex items-center gap-2 hover:text-[#FF6A00] transition-colors text-white font-mono">
                  <Phone size={14} className="text-[#FF6A00]" /> +7 (928) 082-84-13
                </a>
              </li>
              <li>
                <a href="mailto:info@kavkazskitur.com" className="flex items-center gap-2 hover:text-[#FF6A00] transition-colors">
                  <Mail size={14} className="text-slate-400" /> info@kavkazskitur.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/79280828413" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                  <MessageCircle size={14} /> WhatsApp Concierge
                </a>
              </li>
              <li>
                <a href="https://t.me/kavkazskitur" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors">
                  <Send size={14} /> Telegram Channel
                </a>
              </li>
              <li className="pt-1">
                <button 
                  type="button" 
                  onClick={() => toggleQuickOrder(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#FF6A00]/20 hover:bg-[#FF6A00]/30 border border-[#FF6A00]/40 text-[#FF6A00] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Request Fast Callback
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.06] text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 KavKazSkiTur. All rights reserved. Certified Mountain Rescue Protocol.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#FF6A00] underline transition-colors">Privacy</Link>
            <span>&bull;</span>
            <Link href="/offer" className="hover:text-[#FF6A00] underline transition-colors">Terms</Link>
            <span>&bull;</span>
            <Link href="/admin/login" className="hover:text-white transition-colors flex items-center gap-1"><Lock size={12} /> Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

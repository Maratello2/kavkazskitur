'use client';
import Link from 'next/link';
import { useWonderStore } from '@/lib/store/useWonderStore';
import { Phone, ShieldCheck, UserCheck, Lock } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const { toggleQuickOrder } = useWonderStore();

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="mb-4">
              <Logo variant="full" />
            </div>
            <p>Expedition outfitter and mountain guiding company in the Caucasus. Mount Elbrus ascents, Bezengi mountaineering, ski-touring, and high-altitude logistics.</p>
            <p style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img src="/img/geotag.svg" alt="Location" className="w-4 h-4 object-contain inline-block" /> Gorkogo St. 74, Nalchik, KBR, Russian Federation
            </p>
          </div>
          <div className="footer-col">
            <div className="text-base sm:text-lg font-bold mb-3 text-slate-900 dark:text-white">Navigation</div>
            <ul className="footer-links">
              <li><Link href="/expeditions">Expeditions & Tours</Link></li>
              <li><Link href="/schedule">2026 Timetable</Link></li>
              <li><Link href="/barrels">Barrels Refuge 3,800 m</Link></li>
              <li><Link href="/acclimatization">Acclimatization Guide</Link></li>
              <li><Link href="/safety" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={16} /> Safety & Permits</Link></li>
              <li><Link href="/guides" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><UserCheck size={16} /> Our Mountain Guides</Link></li>
              <li><Link href="/privacy">Privacy Policy (152-FZ)</Link></li>
              <li><Link href="/admin" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={16} /> Staff Login</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="text-base sm:text-lg font-bold mb-3 text-slate-900 dark:text-white">Headquarters & Contact</div>
            <ul className="footer-links">
              <li><a href="tel:+79286914405" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={16} /> +7 (928) 691-44-05</a></li>
              <li><a href="mailto:info@kavkazskitur.com" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><img src="/img/mail.svg" alt="Email" className="w-4 h-4 object-contain inline-block" /> info@kavkazskitur.com</a></li>
              <li><a href="https://t.me/kavkazskitur22" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><img src="/img/tg_.svg" alt="Telegram" className="w-4 h-4 object-contain inline-block" /> Telegram Channel</a></li>
              <li><a href="https://wa.me/79286914405" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><img src="/img/wp.svg" alt="WhatsApp" className="w-4 h-4 object-contain inline-block" /> WhatsApp Inquiry</a></li>
              <li><button type="button" style={{ background: 'none', border: 'none', color: '#C2410C', cursor: 'pointer', padding: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => toggleQuickOrder(true)}><Phone size={16} /> Request Callback</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 KavKazSkiTur. All rights reserved. Licensed North Caucasus Tour Operator. • <Link href="/privacy" className="underline text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">Privacy Policy (152-FZ)</Link> • <Link href="/admin" className="underline text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">Admin Portal</Link></p>
        </div>
      </div>
    </footer>
  );
}

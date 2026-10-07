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
              Высокогорные восхождения на Эльбрус, альпинизм в Безенги, ски-тур и высотная логистика по Кавказу с 2006 года. Собственный лагерь на Гарабаши (3 800 м).
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <img src="/img/geotag.svg" alt="Location" className="w-3.5 h-3.5 object-contain inline-block" />
              ООО «КавказСкиТур» &bull; КБР, г. Нальчик, ул. Горького, д. 74
            </p>
          </div>

          <div className="footer-col space-y-3">
            <div className="text-sm font-bold uppercase tracking-wider text-white">
              Навигация и Документы
            </div>
            <ul className="space-y-2 text-xs">
              <li><Link href="/expeditions" className="hover:text-[#FF6A00] transition-colors">Экспедиции и Туры</Link></li>
              <li><Link href="/schedule" className="hover:text-[#FF6A00] transition-colors">Расписание сезонов 2026</Link></li>
              <li><Link href="/barrels" className="hover:text-[#FF6A00] transition-colors">Приют «Бочки» (3 800 м)</Link></li>
              <li><Link href="/acclimatization" className="hover:text-[#FF6A00] transition-colors">Гид по акклиматизации</Link></li>
              <li><Link href="/safety" className="hover:text-[#FF6A00] transition-colors flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#FF6A00]" /> Безопасность и МЧС</Link></li>
              <li><Link href="/privacy" className="hover:text-[#FF6A00] underline transition-colors">Политика конфиденциальности (152-ФЗ)</Link></li>
              <li><Link href="/offer" className="hover:text-[#FF6A00] underline transition-colors">Публичная оферта (ст. 437 ГК РФ)</Link></li>
            </ul>
          </div>

          <div className="footer-col space-y-3">
            <div className="text-sm font-bold uppercase tracking-wider text-white">
              Связь с Диспетчером
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
                  <MessageCircle size={14} /> WhatsApp чат с гидом
                </a>
              </li>
              <li>
                <a href="https://t.me/kavkazskitur" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors">
                  <Send size={14} /> Telegram канал
                </a>
              </li>
              <li className="pt-1">
                <button 
                  type="button" 
                  onClick={() => toggleQuickOrder(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#FF6A00]/20 hover:bg-[#FF6A00]/30 border border-[#FF6A00]/40 text-[#FF6A00] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Заказать обратный звонок
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.06] text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ООО «КавказСкиТур». Все права защищены. Обязательная регистрация в ГУ МЧС по КБР.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[#FF6A00] underline transition-colors">152-ФЗ</Link>
            <span>&bull;</span>
            <Link href="/offer" className="hover:text-[#FF6A00] underline transition-colors">Оферта</Link>
            <span>&bull;</span>
            <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1"><Lock size={12} /> Вход для гидов</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

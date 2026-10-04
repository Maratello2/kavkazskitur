'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tour } from '@/types';
import { useWonderStore } from '@/lib/store/useWonderStore';
import { getImageUrl } from '@/lib/imageUrl';
import { Heart, Scale, Check, Clock, Users, ArrowUpRight, MessageCircle, ShieldCheck } from 'lucide-react';

export default function TourCard({ tour }: { tour: Tour }) {
  const { toggleFavorite, isFavorite, comparison, addToCompare, removeFromCompare } = useWonderStore();
  
  const tourId = String(tour.id);
  const isFav = isFavorite(tourId);
  const isComp = comparison.includes(tourId);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tourId);
  };

  const toggleComp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isComp) {
      removeFromCompare(tourId);
    } else {
      addToCompare(tourId);
    }
  };

  const imgSrc = getImageUrl(tour.image_url);
  const link = `/tours/${tour.slug || tour.id}`;
  const durationStr = tour.duration
    ? `${tour.duration} ${tour.duration === 1 ? 'day' : 'days'}`
    : '1 day';

  const priceRub = tour.price || 0;
  const eurEst = priceRub > 0 ? Math.round(priceRub / 100) : null;
  const usdEst = priceRub > 0 ? Math.round(priceRub / 92) : null;

  const waInquiryUrl = `https://wa.me/79280828413?text=${encodeURIComponent(
    `Expedition Inquiry\nTour: ${tour.name}\nDates: Season 2026\nGroup: 1 climber\nPrice: ${tour.price ? `${tour.price.toLocaleString('ru-RU')} ₽` : 'On Request'}\n\nHello! I would like to check availability and book this expedition.`
  )}`;

  return (
    <div className="bg-[#091422] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-[#FF6A00]/40 hover:shadow-[0_0_25px_rgba(255,106,0,0.12)] text-white transition-all duration-300 flex flex-col h-full group">
      {/* Photo with explicit aspect ratio to eliminate CLS */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050A10]">
        <Link href={link} className="block w-full h-full" aria-label={tour.name}>
          <img
            src={imgSrc}
            alt={tour.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.endsWith('/tours/elbrus_south_orig.jpg')) {
                target.src = '/tours/elbrus_south_orig.jpg';
              }
            }}
          />
        </Link>

        {/* Category badge with technical telemetry typography */}
        {tour.category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#060D17]/95 border border-[#FF6A00]/30 text-[#FF6A00] font-mono text-[10px] font-bold uppercase tracking-[0.22em] shadow-md">
            {tour.category}
          </span>
        )}

        {/* Actions: Favorite and Compare (Apple HIG min 44x44px tap target) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={toggleFav}
            aria-label="Add to favorites"
            className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isFav
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'bg-[#060D17]/95 hover:bg-sky-500/20 text-white border border-white/10 hover:border-sky-400/40 shadow-md'
            }`}
          >
            <Heart size={16} strokeWidth={1.5} className={isFav ? 'fill-current' : ''} />
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={toggleComp}
            aria-label="Compare"
            className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isComp
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'bg-[#060D17]/95 hover:bg-sky-500/20 text-white border border-white/10 hover:border-sky-400/40 shadow-md'
            }`}
          >
            {isComp ? <Check size={16} strokeWidth={1.5} /> : <Scale size={16} strokeWidth={1.5} />}
          </motion.button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-2 font-mono">
            <span className="flex items-center gap-1">
              <Clock size={13} strokeWidth={1.5} className="text-sky-400" />
              {durationStr}
            </span>
            {tour.capacity && (
              <span className="flex items-center gap-1">
                <Users size={13} strokeWidth={1.5} className="text-slate-400" />
                Max {tour.capacity} climbers
              </span>
            )}
          </div>

          <Link href={link}>
            <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2 leading-snug tracking-tight">
              {tour.name}
            </h3>
          </Link>

          {/* International Trust Assurance Telemetry Tag */}
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-sky-400/90 py-1 px-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] mt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" strokeWidth={1.5} />
            <span>FSB PERMIT &amp; VISA INCL.</span>
          </div>
        </div>

        {/* Price & Action Area with International Currency Benchmark */}
        <div className="pt-4 mt-4 border-t border-white/[0.07] flex items-center justify-between gap-2">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400 block font-bold">
              Expedition Fee
            </span>
            <span className="text-base sm:text-lg font-black font-mono text-white">
              {tour.price ? `${tour.price.toLocaleString('ru-RU')} ₽` : 'On Request'}
            </span>
            {eurEst && usdEst && (
              <span className="font-mono text-[10px] text-sky-400/80 block mt-0.5">
                ≈ €{eurEst.toLocaleString('de-DE')} / ${usdEst.toLocaleString('en-US')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <motion.a
              href={waInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              aria-label={`Inquire via WhatsApp about ${tour.name}`}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-white/[0.04] hover:bg-emerald-500/20 text-emerald-400 border border-white/[0.08] hover:border-emerald-500/30 flex items-center justify-center transition-colors shadow-sm"
              title="Fast WhatsApp Inquiry"
            >
              <MessageCircle size={17} strokeWidth={1.5} />
            </motion.a>

            <motion.div
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Link
                href={link}
                className="min-h-[44px] inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-950/40 border border-orange-400/30"
              >
                <span>Details</span>
                <ArrowUpRight size={14} strokeWidth={1.5} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

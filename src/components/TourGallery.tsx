'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2 
} from 'lucide-react';

interface TourGalleryProps {
  images?: string[];
  title: string;
}

export default function TourGallery({ images = [], title }: TourGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showPrev = useCallback(() => {
    if (lightboxIndex === null || images.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  }, [lightboxIndex, images.length]);

  const showNext = useCallback(() => {
    if (lightboxIndex === null || images.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  }, [lightboxIndex, images.length]);

  // Handle keyboard navigation & scroll lock
  useEffect(() => {
    if (lightboxIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, showPrev, showNext]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="mt-14 sm:mt-16 bg-[#0E1F33] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-2.5 text-[#C2410C] font-bold text-xs uppercase tracking-widest mb-1.5">
            <Camera className="w-4 h-4" />
            <span>Expedition Visuals</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Route Photo Gallery
          </h2>
        </div>
        <div className="text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
          {images.length} High-Resolution Photos
        </div>
      </div>

      {/* RESPONSIVE GRID (2 COLS MOBILE, 3 COLS TABLET, 4 COLS DESKTOP) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {images.map((photoUrl, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-white/10 shadow-lg cursor-pointer hover:border-[#C2410C]/60 hover:shadow-orange-950/30 transition-all duration-300"
          >
            <img
              src={photoUrl}
              alt={`${title} - Expedition photo ${idx + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                View Fullscreen
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#C2410C] text-white flex items-center justify-center shadow-md">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN LIGHTBOX SLIDER */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* TOP BAR */}
          <div
            className="flex items-center justify-between text-white border-b border-white/10 pb-4 max-w-7xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-100 line-clamp-1">
                {title}
              </span>
              <span className="text-xs font-mono font-bold text-[#C2410C] bg-[#C2410C]/15 px-2.5 py-0.5 rounded-full border border-[#C2410C]/30">
                {lightboxIndex + 1} / {images.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-slate-400 font-mono">
                ESC to close &bull; &#8592; / &#8594; to navigate
              </span>
              <button
                onClick={closeLightbox}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                title="Close gallery (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MAIN IMAGE DISPLAY WITH PREV/NEXT ARROWS */}
          <div
            className="relative flex items-center justify-center flex-1 my-4 max-w-7xl mx-auto w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* PREV BUTTON */}
            <button
              onClick={showPrev}
              className="absolute left-2 sm:left-6 z-10 p-3 rounded-2xl bg-black/70 hover:bg-[#C2410C] text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer hover:scale-110 shadow-2xl"
              title="Previous photo (Arrow Left)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* ACTIVE PHOTO */}
            <div className="relative max-h-[72vh] max-w-[92vw] flex items-center justify-center">
              <img
                src={images[lightboxIndex]}
                alt={`${title} - Photo ${lightboxIndex + 1}`}
                className="max-h-[72vh] max-w-[92vw] object-contain rounded-2xl border border-white/10 shadow-2xl transition-all duration-200"
              />
            </div>

            {/* NEXT BUTTON */}
            <button
              onClick={showNext}
              className="absolute right-2 sm:right-6 z-10 p-3 rounded-2xl bg-black/70 hover:bg-[#C2410C] text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer hover:scale-110 shadow-2xl"
              title="Next photo (Arrow Right)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* BOTTOM THUMBNAILS STRIP */}
          <div
            className="flex items-center justify-center gap-2 overflow-x-auto py-2 max-w-4xl mx-auto w-full px-2"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((thumbUrl, idx) => (
              <button
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className={`relative shrink-0 w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                  idx === lightboxIndex
                    ? 'border-[#C2410C] ring-2 ring-[#C2410C] scale-105 opacity-100'
                    : 'border-white/20 opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={thumbUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

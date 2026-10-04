import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllTours, getTourBySlug } from '@/data/toursData';
import TourDetailClient from './TourDetailClient';
import TourGallery from '@/components/TourGallery';
import { Mountain, Clock, Award, Users, ChevronRight } from 'lucide-react';

export async function generateStaticParams() {
  const tours = getAllTours();
  return tours.map((tour) => ({
    slug: tour.slug,
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    return {
      title: 'Expedition Not Found | KavKazSkiTur',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kavkazskitur.com';

  return {
    title: `${tour.title} | KavKazSkiTur Expeditions`,
    description: tour.description.slice(0, 160) + '...',
    openGraph: {
      title: `${tour.title} — Mount Elbrus Expeditions`,
      description: tour.description.slice(0, 160) + '...',
      url: `${siteUrl}/tours/${tour.slug}`,
      siteName: 'KavKazSkiTur',
      images: [
        {
          url: tour.image,
          width: 1200,
          height: 630,
          alt: tour.title,
        },
      ],
      type: 'website',
    },
  };
}

export default async function TourPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const heroCover = tour.coverImage || tour.image;

  return (
    <main className="min-h-[100dvh] bg-[#060B12] text-slate-100 pt-24 sm:pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 flex-wrap font-mono">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/expeditions" className="hover:text-white transition-colors">Expeditions</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-[#FF6A00] truncate max-w-xs sm:max-w-md">{tour.title}</span>
        </div>

        {/* HERO BANNER */}
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] mb-10 shadow-2xl bg-[#060B12] min-h-[380px] sm:min-h-[440px] flex flex-col justify-end">
          <div className="absolute inset-0 w-full h-full">
            <img
              src={heroCover}
              alt={tour.title}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060B12] via-[#060B12]/70 to-black/40" />
          </div>

          <div className="relative z-10 p-5 sm:p-10 space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.22em] bg-[#FF6A00]/20 text-[#FF6A00] border border-[#FF6A00]/30 shadow-lg">
                {tour.categoryLabel}
              </span>
              {tour.badge && (
                <span className="px-3.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.22em] bg-white/10 text-white border border-white/20 shadow-md">
                  {tour.badge}
                </span>
              )}
              <span className="px-3.5 py-1 rounded-full font-mono text-[10px] font-bold bg-[#060D17]/95 text-slate-300 border border-white/10 shadow-md">
                Season: {tour.season}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-tight max-w-4xl">
              {tour.title}
            </h1>

            {/* QUICK METRICS */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-2 text-xs sm:text-sm font-semibold text-slate-200 font-mono">
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-[#FF6A00]" strokeWidth={1.5} />
                <span>Altitude: <strong className="text-white">{tour.altitude}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF6A00]" strokeWidth={1.5} />
                <span>Duration: <strong className="text-white">{tour.duration}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FF6A00]" strokeWidth={1.5} />
                <span>Difficulty: <strong className="text-white">{tour.difficulty}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF6A00]" strokeWidth={1.5} />
                <span>Ratio: <strong className="text-white">1:3 Guide/Climber</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN BODY */}
        <TourDetailClient tour={tour} />

        {/* ROUTE PHOTO GALLERY */}
        {tour.gallery && tour.gallery.length > 0 && (
          <TourGallery images={tour.gallery} title={tour.title} />
        )}

      </div>
    </main>
  );
}

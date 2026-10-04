'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Tour } from '@/types';
import { getImageUrl } from '@/lib/imageUrl';
import {
  MapPin,
  Compass,
  Mountain,
  ArrowRight,
  Clock,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface KeyLocation {
  id: string;
  name: string;
  subtitle: string;
  altitude?: string;
  description: string;
  lat: number;
  lng: number;
  zoom: number;
  keyword: string;
}

const keyLocations: KeyLocation[] = [
  {
    id: 'caucasus',
    name: 'All Caucasus',
    subtitle: 'Overview of all expeditions and routes',
    description: 'All key destinations of KavKazSkiTur: from Mount Elbrus and Kazbek to Cherek Gorge and the Bermamyt Plateau.',
    lat: 43.35,
    lng: 43.0,
    zoom: 8.5,
    keyword: '',
  },
  {
    id: 'elbrus',
    name: 'Mount Elbrus',
    subtitle: 'Highest peak of Europe',
    altitude: '5,642 m',
    description: 'Expeditions via South and North routes, acclimatization treks, and alpine glacier routes.',
    lat: 43.3499,
    lng: 42.4453,
    zoom: 11,
    keyword: 'elbrus',
  },
  {
    id: 'bezengi',
    name: 'Bezengi Alpine Camp',
    subtitle: 'Heart of the Caucasus Himalayas',
    altitude: '2,150 m',
    description: 'The famous 13 km Bezengi Wall, six 5,000m summits, and pristine high-altitude mountain air.',
    lat: 43.1167,
    lng: 43.15,
    zoom: 11.5,
    keyword: 'bezengi',
  },
  {
    id: 'jilysu',
    name: 'Emanuel Glade & Dzhily-Su',
    subtitle: 'Warm mineral springs & Northern Elbrus',
    altitude: '2,400 m',
    description: 'Unique thermal springs, Sultan waterfall, stone castles, and base camp for North Elbrus expeditions.',
    lat: 43.4358,
    lng: 42.5386,
    zoom: 11.5,
    keyword: 'dzhily',
  },
  {
    id: 'chegem',
    name: 'Chegem Waterfalls',
    subtitle: 'Gorges, towers & paragliding',
    altitude: '1,200 m',
    description: 'Picturesque gorge with dramatic cascade waterfalls, ancient El-Tyubyu towers, and Chegem paragliding hub.',
    lat: 43.4167,
    lng: 43.1667,
    zoom: 12,
    keyword: 'chegem',
  },
  {
    id: 'bermamyt',
    name: 'Bermamyt Plateau',
    subtitle: 'The Caucasus Grand Canyon',
    altitude: '2,592 m',
    description: 'Fantastic cliff formations, sunrises above a sea of clouds, and panoramic views of Mount Elbrus.',
    lat: 43.7042,
    lng: 42.4428,
    zoom: 11.5,
    keyword: 'bermamyt',
  },
  {
    id: 'blue-lakes',
    name: 'Blue Lakes & Cherek Gorge',
    subtitle: 'Karst abysses and medieval fortresses',
    altitude: '800 m',
    description: 'One of the deepest karst lakes in the world, medieval ruins of Kyunlyum, and Chateau Erken.',
    lat: 43.2333,
    lng: 43.5833,
    zoom: 11.5,
    keyword: 'cherek',
  },
  {
    id: 'kazbegi',
    name: 'Mount Kazbek & Georgia',
    subtitle: 'Gergeti Trinity Church & Cross Pass',
    altitude: '2,170 m',
    description: 'Gergeti Trinity Church framed by Mount Kazbek (5,033 m), spectacular Darial Gorge, and mountain culture.',
    lat: 42.6586,
    lng: 44.6417,
    zoom: 11,
    keyword: 'kazbek',
  },
];

export default function MapClient({ tours }: { tours: Tour[] }) {
  const [activeLoc, setActiveLoc] = useState<KeyLocation>(keyLocations[0]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Filter tours matching current location keyword
  const filteredTours = useMemo(() => {
    if (!activeLoc.keyword) return tours.slice(0, 16);
    const kw = activeLoc.keyword.toLowerCase();
    const matches = tours.filter((t) => {
      const name = (t.name || '').toLowerCase();
      const desc = (t.description || '').toLowerCase();
      const cat = (t.category || '').toLowerCase();
      return name.includes(kw) || desc.includes(kw) || cat.includes(kw);
    });
    return matches.length > 0 ? matches : tours.slice(0, 8);
  }, [tours, activeLoc]);

  // Tours with coordinates for placemarks
  const toursWithCoords = useMemo(() => {
    return tours.filter((t) => t.latitude && t.longitude);
  }, [tours]);

  // Initialize Yandex Map
  useEffect(() => {
    let isCancelled = false;

    const initMap = () => {
      if (typeof window === 'undefined' || !(window as any).ymaps || !mapContainerRef.current) {
        return;
      }

      (window as any).ymaps.ready(() => {
        if (isCancelled || !mapContainerRef.current) return;

        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.destroy();
          } catch {
            // ignore
          }
          mapInstanceRef.current = null;
        }

        try {
          const map = new (window as any).ymaps.Map(mapContainerRef.current, {
            center: [activeLoc.lat, activeLoc.lng],
            zoom: activeLoc.zoom,
            controls: ['zoomControl', 'fullscreenControl', 'typeSelector'],
          });

          mapInstanceRef.current = map;
          setMapLoaded(true);

          // Add placemarks for key locations
          keyLocations.forEach((loc) => {
            if (loc.id === 'caucasus') return;
            const pm = new (window as any).ymaps.Placemark(
              [loc.lat, loc.lng],
              {
                hintContent: loc.name,
                balloonContentHeader: `<div style="font-weight:800; font-size:15px; color:#1C2321;">${loc.name}</div>`,
                balloonContentBody: `
                  <div style="font-family:system-ui,-apple-system,sans-serif; max-width:240px; padding:4px 0;">
                    <div style="font-size:12px; color:#64748b; margin-bottom:6px;">${loc.subtitle}</div>
                    <div style="font-size:13px; color:#334155; line-height:1.4; margin-bottom:8px;">${loc.description}</div>
                    ${loc.altitude ? `<div style="font-size:12px; font-weight:700; color:#C85A32; margin-bottom:8px;">Altitude: ${loc.altitude}</div>` : ''}
                  </div>
                `,
              },
              {
                preset: 'islands#orangeDotIcon',
              }
            );

            pm.events.add('click', () => {
              setActiveLoc(loc);
            });

            map.geoObjects.add(pm);
          });

          // Add placemarks for tours
          toursWithCoords.forEach((t) => {
            if (!t.latitude || !t.longitude) return;
            const img = getImageUrl(t.image_url);
            const link = `/tours/${t.slug || t.id}`;
            const priceText = t.price ? `${t.price} ₽` : 'On request';

            const tourPm = new (window as any).ymaps.Placemark(
              [t.latitude, t.longitude],
              {
                hintContent: t.name,
                balloonContentHeader: `<div style="font-weight:800; font-size:14px; color:#1C2321;">${t.name}</div>`,
                balloonContentBody: `
                  <div style="font-family:system-ui,-apple-system,sans-serif; max-width:250px; padding:4px 0;">
                    <img src="${img}" style="width:100%; height:110px; object-fit:cover; border-radius:8px; margin-bottom:8px;" />
                    <div style="font-size:11px; font-weight:700; color:#C85A32; text-transform:uppercase; margin-bottom:4px;">${t.category || 'Route'}</div>
                    <div style="font-size:15px; font-weight:800; color:#1C2321; margin-bottom:8px;">${priceText}</div>
                    <a href="${link}" style="display:block; text-align:center; background:#C85A32; color:#ffffff; padding:7px 12px; border-radius:8px; font-weight:700; font-size:12px; text-decoration:none;">View Route Details →</a>
                  </div>
                `,
              },
              {
                preset: 'islands#darkOrangeCircleDotIcon',
              }
            );

            map.geoObjects.add(tourPm);
          });
        } catch (err) {
          console.error('Yandex Map initialization error:', err);
        }
      });
    };

    if (!(window as any).ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=en_US';
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
        } catch {
          // ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, [toursWithCoords]);

  const handleLocationSelect = (loc: KeyLocation) => {
    setActiveLoc(loc);
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.setCenter([loc.lat, loc.lng], loc.zoom, {
          duration: 600,
          checkZoomRange: true,
        });
      } catch (err) {
        console.error('Failed to move map:', err);
      }
    }
  };

  const iframeFallbackUrl = `https://yandex.ru/map-widget/v1/?ll=${activeLoc.lng}%2C${activeLoc.lat}&z=${activeLoc.zoom}&l=map`;

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 min-h-screen transition-colors duration-200 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200 dark:border-white/5">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-[#C85A32] font-bold text-xs sm:text-sm mb-3">
              <Compass size={16} /> Interactive Field Guide · Caucasus 2026
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Interactive Route Map
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Explore key summits, gorges, waterfalls, and alpine passes across the Caucasus. Click any marker to view expedition details and access booking.
            </p>
          </div>

          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-orange-500/50 text-slate-800 dark:text-slate-200 hover:text-[#C85A32] text-sm font-semibold transition-all shadow-sm w-fit"
          >
            <span>All Expeditions</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Interactive Map */}
        <div className="mt-8 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 relative h-[420px] sm:h-[520px] lg:h-[600px]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {!mapLoaded && (
            <iframe
              key={iframeFallbackUrl}
              src={iframeFallbackUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen={true}
              loading="lazy"
              title={`Caucasus Map: ${activeLoc.name}`}
              className="w-full h-full absolute inset-0"
            />
          )}

          {/* Active location overlay */}
          <div className="absolute top-4 right-4 max-w-xs p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl pointer-events-auto hidden sm:block">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C85A32]">
                {activeLoc.name}
              </span>
              {activeLoc.altitude && (
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Mountain size={12} className="text-[#C85A32]" /> {activeLoc.altitude}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {activeLoc.description}
            </p>
          </div>
        </div>

        {/* Location filters strip */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={16} className="text-[#C85A32]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick Focus &amp; Location Filters:
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none">
            {keyLocations.map((loc) => {
              const isSelected = activeLoc.id === loc.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleLocationSelect(loc)}
                  className={`shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-md shadow-orange-500/25 scale-[1.02]'
                      : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:border-orange-500/40 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <MapPin size={14} className={isSelected ? 'text-white' : 'text-[#C85A32]'} />
                  <span>{loc.name}</span>
                  {loc.altitude && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-black/20 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {loc.altitude}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tours in selected location */}
        <div className="mt-12">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Expeditions in &ldquo;{activeLoc.name}&rdquo;
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Found routes: {filteredTours.length}
              </p>
            </div>
            <Link
              href={activeLoc.keyword ? `/tours?search=${encodeURIComponent(activeLoc.keyword)}` : '/tours'}
              className="text-xs sm:text-sm font-bold text-[#C85A32] hover:underline flex items-center gap-1"
            >
              <span>View all in catalog</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTours.map((t) => {
              const img = getImageUrl(t.image_url);
              const link = `/tours/${t.slug || t.id}`;
              const durationStr = t.duration
                ? `${t.duration} ${t.duration === 1 ? 'day' : 'days'}`
                : '1 day';

              return (
                <div
                  key={t.id}
                  className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/40 shadow-md dark:shadow-xl transition-all flex flex-col h-full group"
                >
                  <Link href={link} className="relative h-48 overflow-hidden block bg-slate-100 dark:bg-slate-950">
                    <img
                      src={img}
                      alt={t.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    {t.category && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#C85A32] text-white text-[11px] font-bold shadow-md">
                        {t.category}
                      </span>
                    )}
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                        <Clock size={13} className="text-[#C85A32]" />
                        <span>{durationStr}</span>
                      </div>
                      <Link href={link}>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#C85A32] transition-colors line-clamp-2 leading-snug">
                          {t.name}
                        </h3>
                      </Link>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                          Price
                        </span>
                        <span className="text-base font-extrabold text-[#C85A32]">
                          {t.price ? `${t.price} ₽` : 'On request'}
                        </span>
                      </div>
                      <Link
                        href={link}
                        className="px-3.5 py-2 rounded-xl bg-orange-500/10 hover:bg-[#C85A32] text-[#C85A32] hover:text-white font-bold text-xs transition-colors"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

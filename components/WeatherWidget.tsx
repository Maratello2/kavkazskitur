'use client';

import { useEffect, useState, useRef } from 'react';
import { SunMedium, CloudFog, CloudRain, Snowflake, CloudLightning, Mountain, Wind, Cloud } from 'lucide-react';

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<Record<string, any>>({});
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const locs: Record<string, { lat: number; lon: number }> = {
      azau: { lat: 43.2682, lon: 42.4764 },
      garabashi: { lat: 43.3, lon: 42.45 },
      elbrus: { lat: 43.3499, lon: 42.4453 },
      bezengi: { lat: 43.1167, lon: 43.15 },
    };

    Object.keys(locs).forEach((k) => {
      const l = locs[k];
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${l.lat}&longitude=${l.lon}&current_weather=true`)
        .then((res) => res.json())
        .then((data) => {
          if (data.current_weather) {
            setWeatherData((prev) => ({
              ...prev,
              [k]: data.current_weather,
            }));
          }
        })
        .catch((err) => console.log('Weather err:', err));
    });
  }, [isVisible]);

  function WeatherIcon({ code }: { code?: number }) {
    if (code === undefined || code === 0) return <SunMedium className="w-6 h-6 text-amber-400" />;
    if (code >= 1 && code <= 3) return <Cloud className="w-6 h-6 text-slate-300" />;
    if (code >= 45 && code <= 48) return <CloudFog className="w-6 h-6 text-slate-400" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-6 h-6 text-blue-400" />;
    if (code >= 71 && code <= 77) return <Snowflake className="w-6 h-6 text-sky-200" />;
    if (code >= 80 && code <= 82) return <CloudRain className="w-6 h-6 text-blue-400" />;
    if (code >= 85 && code <= 86) return <Snowflake className="w-6 h-6 text-sky-200" />;
    if (code >= 95) return <CloudLightning className="w-6 h-6 text-amber-300" />;
    return <Cloud className="w-6 h-6 text-slate-300" />;
  }

  const formatTemp = (w?: any) =>
    w ? (w.temperature > 0 ? '+' : '') + Math.round(w.temperature) + ' °C' : 'Loading...';
  const formatWind = (w?: any) =>
    w ? Math.round(w.windspeed * 0.277778) + ' m/s' : '-- m/s';

  return (
    <section ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 lazy-section">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <SunMedium className="w-7 h-7 sm:w-8 sm:h-8 text-[#C85A32]" />
            <span>Mountain Weather & Slope Conditions</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mt-2 font-normal leading-relaxed">
            Real-time high-altitude telemetry (Open-Meteo)
          </p>
          <div className="w-12 h-0.5 bg-[#C85A32] mt-3" />
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0 w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" /> LIVE
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Azau Meadow */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-md dark:shadow-none transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-slate-900 dark:text-white font-bold text-base sm:text-lg leading-tight">Azau Meadow</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">2,300 m • Valley Base</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0">
                <WeatherIcon code={weatherData.azau?.weathercode} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight my-2">
              {formatTemp(weatherData.azau)}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Wind size={14} className="text-[#C85A32]" /> Wind: {formatWind(weatherData.azau)}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Gondolas Operating</span>
          </div>
        </div>

        {/* Garabashi Station */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-md dark:shadow-none transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-slate-900 dark:text-white font-bold text-base sm:text-lg leading-tight">Gara-Bashi Station</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">3,800 m • Barrels Refuge</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0">
                <WeatherIcon code={weatherData.garabashi?.weathercode} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight my-2">
              {formatTemp(weatherData.garabashi)}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Wind size={14} className="text-[#C85A32]" /> Wind: {formatWind(weatherData.garabashi)}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Acclimatization Open</span>
          </div>
        </div>

        {/* Elbrus Summit */}
        <div className="bg-orange-50/70 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/40 border border-[#C85A32]/30 rounded-2xl p-5 shadow-md dark:shadow-none transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-slate-900 dark:text-white font-bold text-base sm:text-lg leading-tight">Mount Elbrus Summit</div>
                <div className="text-xs text-orange-600 dark:text-orange-200/80 mt-0.5 font-medium">5,642 m • West Peak</div>
              </div>
              <div className="p-2 rounded-xl bg-[#C85A32]/15 text-[#C85A32] shrink-0">
                <Mountain size={22} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight my-2">
              {formatTemp(weatherData.elbrus)}
            </div>
          </div>
          <div className="pt-3 border-t border-orange-200/60 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Wind size={14} className="text-[#C85A32]" /> Wind: {formatWind(weatherData.elbrus)}
            </span>
            <span className="text-amber-600 dark:text-amber-300 font-semibold">Summit with Guide Only</span>
          </div>
        </div>

        {/* Bezengi Base Camp */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-md dark:shadow-none transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-slate-900 dark:text-white font-bold text-base sm:text-lg leading-tight">Bezengi Alpine Camp</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">2,200 m • Bezengi Wall</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0">
                <WeatherIcon code={weatherData.bezengi?.weathercode} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight my-2">
              {formatTemp(weatherData.bezengi)}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300 flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <Wind size={14} className="text-[#C85A32]" /> Wind: {formatWind(weatherData.bezengi)}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Trekking Open</span>
          </div>
        </div>
      </div>
    </section>
  );
}

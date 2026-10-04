import Link from 'next/link';
import { Car, Mountain, Footprints, Snowflake } from 'lucide-react';
import { CategoryWithCount } from '@/lib/data';

interface CategoryItemConfig {
  name: string;
  defaultCount: string;
  countUnit: 'routes' | 'objects';
  image: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const categoryConfigs: CategoryItemConfig[] = [
  {
    name: 'Expeditions',
    defaultCount: '4 Routes',
    countUnit: 'routes',
    image: '/tours/elbrus-south.webp',
    href: '/expeditions',
    Icon: Mountain,
  },
  {
    name: 'Trekking',
    defaultCount: '3 Routes',
    countUnit: 'routes',
    image: '/tours/valley-adyr-su-climbing-camps-ullu-tau-and-djailyk.webp',
    href: '/expeditions',
    Icon: Footprints,
  },
  {
    name: 'Jeep Tours',
    defaultCount: '2 Routes',
    countUnit: 'routes',
    image: '/tours/mountainous-kabardino-balkaria.webp',
    href: '/expeditions',
    Icon: Car,
  },
  {
    name: 'Ski Touring',
    defaultCount: '2 Routes',
    countUnit: 'routes',
    image: '/tours/elbrus-ski-tour-8-days.webp',
    href: '/expeditions',
    Icon: Snowflake,
  },
];

function formatCount(count: number, unit: 'routes' | 'objects'): string {
  if (unit === 'objects') {
    return `${count} Destinations`;
  }
  return `${count} ${count === 1 ? 'Route' : 'Routes'}`;
}

export default function CategoryGrid({ categories }: { categories?: CategoryWithCount[] }) {
  const countMap = new Map<string, number>();
  if (categories && Array.isArray(categories)) {
    categories.forEach((c) => {
      countMap.set(c.name, c.count);
    });
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 lazy-section">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          Featured Expedition Styles
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Choose your mountaineering or adventure format across the Caucasus
        </p>
        <div className="w-12 h-0.5 bg-[#C85A32] mt-3" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {categoryConfigs.map((cfg) => {
          const Icon = cfg.Icon;
          const dbCount = countMap.get(cfg.name);
          const displayCount =
            dbCount !== undefined && dbCount > 0
              ? formatCount(dbCount, cfg.countUnit)
              : cfg.defaultCount;

          return (
            <Link
              key={cfg.name}
              href={cfg.href}
              className="group relative h-44 sm:h-56 lg:h-60 rounded-2xl overflow-hidden shadow-xl border border-white/5 hover:border-[#C85A32]/50 transition-all duration-300 flex flex-col justify-end p-3.5 sm:p-5"
            >
              <img
                src={cfg.image}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt={cfg.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 z-10" />
              <div className="relative z-20">
                <div className="flex items-center gap-2 mb-1 text-[#C85A32]">
                  <Icon size={20} className="shrink-0" />
                  <h3 className="text-xs sm:text-base lg:text-lg font-bold text-white line-clamp-1 group-hover:text-[#C85A32] transition-colors">
                    {cfg.name}
                  </h3>
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300">
                  {displayCount}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

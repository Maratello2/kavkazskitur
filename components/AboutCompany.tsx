import { Mountain, Compass, Wine, Waves, Users, Bus, MapPin } from 'lucide-react';

export default function AboutCompany() {
  const directions = [
    {
      icon: Mountain,
      title: 'Climbing & Alpine Trekking',
      desc: 'Safe summit ascents of Mount Elbrus from South and North, ski touring, and high-altitude treks in Bezengi and Ullu-Tau.',
    },
    {
      icon: Compass,
      title: '4x4 Expeditions & Highland Canyons',
      desc: 'Off-road traverses to Bermamyt Plateau, Kanzhol, Aktoprak Pass, Lake Gizhgit, and secluded mountain gorges.',
    },
    {
      icon: Wine,
      title: 'Georgia & Kazbek Expeditions',
      desc: 'Comprehensive alpine and cultural itineraries: Mount Kazbek (5,033 m), Tbilisi, Batumi, and Kakheti wine valleys.',
    },
    {
      icon: Waves,
      title: 'Black Sea Logistics',
      desc: 'Daily express transfers to the Black Sea coast from Nalchik, package excursions, and seaside accommodation.',
    },
    {
      icon: Users,
      title: 'Corporate & Team Expeditions',
      desc: 'Customized team-building ascents, leadership retreats, and organized group programs across the Greater Caucasus.',
    },
    {
      icon: Bus,
      title: 'Highland Lodging & 4x4 Fleet',
      desc: 'Barrels Refuge at 3,800 m, luxury valley hotels, airport transfers, expedition vehicle rentals, and logistics.',
    },
  ];

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 py-16">
      <div className="section-header">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          About KavKazSkiTur
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Nalchik expedition outfitter — your trusted guide across the Caucasus and beyond
        </p>
      </div>

      <div className="w-16 h-0.5 bg-[#C85A32] my-4 rounded-full" />

      <p className="text-slate-700 dark:text-slate-200 text-base leading-relaxed max-w-4xl mb-8">
        We are KavKazSkiTur: a veteran team of local mountain guides, logistics specialists, and passionate mountaineers organizing world-class expeditions across the North Caucasus, Georgia, and Russia. Based in Nalchik with 24/7 mountain dispatch, high-altitude refuge infrastructure, and full insurance compliance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-8">
        {directions.map((d, index) => {
          const Icon = d.icon;
          return (
            <div 
              key={index}
              className="border-l-4 border-[#C85A32] bg-white dark:bg-slate-900/80 border-y border-r border-slate-200 dark:border-white/5 rounded-r-2xl p-5 shadow-sm dark:shadow-lg transition-colors flex flex-col gap-2"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-5 h-5 text-[#C85A32] shrink-0" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {d.title}
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {d.desc}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-6 flex items-center flex-wrap gap-1.5">
        <MapPin className="w-4 h-4 text-rose-500 inline mr-1 shrink-0" />
        <span>Headquarters: Gorkogo St. 74, Nalchik, Kabardino-Balkaria · </span>
        <a 
          href="https://yandex.com/maps/-/CTTleRKK" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#C85A32] hover:underline font-medium"
        >
          View on Yandex Maps
        </a>
      </p>
    </section>
  );
}

export interface Expedition {
  id: string;
  slug: string;
  title: string;
  category: 'elbrus-south' | 'elbrus-north' | 'skitour' | 'kazbek' | 'trekking';
  categoryLabel: string;
  duration: string;
  altitude: string;
  difficulty: 'Moderate' | 'Demanding' | 'Extreme';
  priceRub: number;
  priceUsd: number;
  season: string;
  image: string;
  badge?: string;
  highlights: string[];
  itinerarySummary: { day: string; title: string; alt: string }[];
  included: string[];
}

export const EXPEDITIONS: Expedition[] = [
  {
    id: 'elbrus-south-8d',
    slug: 'elbrus-climb-south-side-8-days',
    title: 'Elbrus Climb South Side (8 Days)',
    category: 'elbrus-south',
    categoryLabel: 'South Route',
    duration: '8 Days / 7 Nights',
    altitude: '5,642 m / 18,510 ft',
    difficulty: 'Demanding',
    priceRub: 85000,
    priceUsd: 920,
    season: 'May — October 2026',
    image: '/tours/elbrus_south.webp',
    badge: 'Most Popular',
    highlights: [
      'Gondola cableway to 3,850 m (Azau — Krugozor — Mir — Garabashi)',
      'Stay at our own high-altitude Barrels Refuge (Gara-Bashi 3,800 m)',
      'Acclimatization hike to Pastukhov Rocks (4,800 m)',
      '1:3 to 1:4 Guide-to-Climber ratio on summit day'
    ],
    itinerarySummary: [
      { day: 'Day 1', title: 'Arrival at Nalchik/MRV, transfer to Terskol base hotel', alt: '2,150 m' },
      { day: 'Day 2', title: 'Acclimatization trek to Mt. Cheget & Terskol Peak', alt: '3,100 m' },
      { day: 'Day 3', title: 'Cableway ascent to Gara-Bashi Barrels base camp', alt: '3,800 m' },
      { day: 'Day 4', title: 'Ice-axe self-arrest training & snow walking practice', alt: '3,850 m' },
      { day: 'Day 5', title: 'Acclimatization ascent to Pastukhov Rocks', alt: '4,800 m' },
      { day: 'Day 6', title: 'Rest & weather window check at the Barrels', alt: '3,800 m' },
      { day: 'Day 7', title: 'Summit Push: Western Peak (5,642 m) & return descent', alt: '5,642 m' },
      { day: 'Day 8', title: 'Reserve weather day / Transfer to Nalchik or MRV airport', alt: '512 m' }
    ],
    included: [
      'All local transfers (Airport Nalchik/MRV to hotel and cableway)',
      'All nights at Terskol hotel + Gara-Bashi Barrels 3,800m',
      'All meals on the mountain (private chef at the Barrels)',
      'Certified mountain guide + safety gear & radio registration'
    ]
  },
  {
    id: 'elbrus-north-8d',
    slug: 'climbing-elbrus-from-the-north-route-8-days-trip',
    title: 'Climbing Elbrus From North Route (8 Days)',
    category: 'elbrus-north',
    categoryLabel: 'North Route',
    duration: '8 Days / 7 Nights',
    altitude: '5,621 m (East) / 5,642 m (West)',
    difficulty: 'Extreme',
    priceRub: 85000,
    priceUsd: 920,
    season: 'June — September 2026',
    image: '/tours/elbrus_north.webp',
    badge: 'Wild & Untouched',
    highlights: [
      'Zero cableways or snowcats — 100% authentic foot ascent',
      'Historical 1829 General Emmanuel expedition route',
      'Lenz Rocks traverse at 4,600 m and wild glacial terrain',
      'Natural Narzan mineral springs in the Dzhily-Su base glade'
    ],
    itinerarySummary: [
      { day: 'Day 1', title: '4x4 transfer from Nalchik to Emmanuel Base Camp', alt: '2,600 m' },
      { day: 'Day 2', title: 'Acclimatization hike to Stone Mushrooms & Moon Glade', alt: '3,200 m' },
      { day: 'Day 3', title: 'Gear carry & ascent to High Moraine Camp', alt: '3,800 m' },
      { day: 'Day 4', title: 'Acclimatization climb to Lower Lenz Rocks', alt: '4,600 m' },
      { day: 'Day 5', title: 'Alpine summit push on Eastern Peak via the North Ridge', alt: '5,621 m' },
      { day: 'Day 6-8', title: 'Weather reserve & descent to Dzhily-Su springs', alt: '2,600 m' }
    ],
    included: [
      'Off-road 4x4 expedition transfer from Nalchik headquarters',
      'High Moraine hut accommodation with generator power',
      'Complete cook service with natural Caucasian meals',
      'Permits and border registry'
    ]
  },
  {
    id: 'elbrus-skitour-8d',
    slug: 'elbrus-ski-tour-8-days',
    title: 'Elbrus Ski-Tour & Freeride (8 Days)',
    category: 'skitour',
    categoryLabel: 'Ski Mountaineering',
    duration: '8 Days / 7 Nights',
    altitude: '5,642 m / 18,510 ft',
    difficulty: 'Extreme',
    priceRub: 85000,
    priceUsd: 920,
    season: 'April — June 2026',
    image: '/tours/skitour_elbrus.webp',
    badge: 'Powder & Steeps',
    highlights: [
      'Epic 3,300 vertical meter ski descent from the summit',
      'Glacier skinning across Garabashi and Pastukhov snowfields',
      'Avalanche safety transceivers (Mammut/Pieps) required',
      'Acclimatization descents in Cheget and Adyl-Su couloirs'
    ],
    itinerarySummary: [
      { day: 'Day 1', title: 'Arrival, gear check (skins, crampons, beacons)', alt: '2,150 m' },
      { day: 'Day 2', title: 'Skinning climb & warm-up descent on Mt. Cheget', alt: '3,100 m' },
      { day: 'Day 3', title: 'Ascent to Barrels 3,800m with touring equipment', alt: '3,800 m' },
      { day: 'Day 4-5', title: 'Glacial skinning to Pastukhov Rocks & Lenz ridge', alt: '4,800 m' },
      { day: 'Day 6', title: 'Summit push on skis + continuous freeride descent', alt: '5,642 m' },
      { day: 'Day 7-8', title: 'Reserve storm day & final celebration in Terskol', alt: '2,150 m' }
    ],
    included: [
      'Expert ski-mountaineering lead guides (UIAGM/KMGA certified)',
      'Full accommodation at Barrels 3,800 m',
      'Avalanche rescue briefing & sat-com tracking'
    ]
  },
  {
    id: 'elbrus-irikchat-10d',
    slug: 'climbing-elbrus-irikchat-gorge-10-days',
    title: 'Climbing Elbrus + Irikchat Gorge (10 Days)',
    category: 'trekking',
    categoryLabel: 'Alpine Trek & Climb',
    duration: '10 Days / 9 Nights',
    altitude: '5,621 m (East Summit)',
    difficulty: 'Demanding',
    priceRub: 95000,
    priceUsd: 1030,
    season: 'June — September 2026',
    image: '/tours/irikchat.webp',
    badge: 'Most Scenic',
    highlights: [
      'Trek through the untouched pine forests and cascades of Irik-Chat Gorge',
      'Acclimatize gradually through pristine subalpine valleys with zero crowds',
      'Camp at the dramatic Sand Castles geological formation',
      'Summit the East Peak (5,621 m) directly from the eastern icefield'
    ],
    itinerarySummary: [
      { day: 'Day 1', title: 'Transfer Nalchik/MRV to Elbrus village, camp preparation', alt: '1,800 m' },
      { day: 'Day 2', title: 'Trek along Irik river through pine forests and waterfalls', alt: '2,400 m' },
      { day: 'Day 3', title: 'Hike to Irik-Chat valley and Sand Castles natural camp', alt: '3,200 m' },
      { day: 'Day 4', title: 'Ascent over Irik-Chat Pass (3,667 m) to Elbrus glacier edge', alt: '3,700 m' },
      { day: 'Day 5', title: 'Establish high camp on the eastern moraine', alt: '4,300 m' },
      { day: 'Day 6', title: 'High acclimatization hike along the Achkeryashkol lava flow', alt: '4,800 m' },
      { day: 'Day 7', title: 'Summit Push: Elbrus East Peak (5,621 m) & return descent', alt: '5,621 m' },
      { day: 'Day 8-10', title: 'Buffer weather days, valley descent, and airport transfer', alt: '512 m' }
    ],
    included: [
      '4x4 expedition logistics from Nalchik headquarters',
      'Full mountain tent camp equipment & pack-horse support in lower valley',
      'Expedition cook & mountain rations',
      'Certified high-altitude guides & border passes'
    ]
  },
  {
    id: 'elbrus-terskol-8d',
    slug: 'elbrus-climb-through-terskol-gorge-8-days',
    title: 'Elbrus Climb Through Terskol Gorge (8 Days)',
    category: 'elbrus-south',
    categoryLabel: 'Scenic South Line',
    duration: '8 Days / 7 Nights',
    altitude: '5,642 m / 18,510 ft',
    difficulty: 'Demanding',
    priceRub: 85000,
    priceUsd: 920,
    season: 'June — September 2026',
    image: '/tours/mountainous-kabardino-balkaria.webp',
    badge: 'Panoramic Route',
    highlights: [
      'Acclimatization trek past the cascading Maiden Hair waterfall',
      'Visit the historic Terskol Peak Astronomical Observatory (3,100 m)',
      'Panoramic vistas of the Donguz-Orun and Nakra-Tau glaciers',
      'Transition to the high Barrels base (3,800 m) for summit push'
    ],
    itinerarySummary: [
      { day: 'Day 1', title: 'Arrival at Nalchik/MRV, transfer to Terskol base lodge', alt: '2,150 m' },
      { day: 'Day 2', title: 'Trek up Terskol Gorge to Maiden Hair waterfall & Observatory', alt: '3,100 m' },
      { day: 'Day 3', title: 'Transfer to Azau and ascent to Barrels Refuge (Gara-Bashi)', alt: '3,800 m' },
      { day: 'Day 4', title: 'Ice-axe self-arrest & crampon safety skills on Garabashi glacier', alt: '3,900 m' },
      { day: 'Day 5', title: 'Acclimatization push to Pastukhov Rocks', alt: '4,800 m' },
      { day: 'Day 6', title: 'Rest day & midnight briefing at the Barrels', alt: '3,800 m' },
      { day: 'Day 7', title: 'Summit push to West Peak (5,642 m) & descent', alt: '5,642 m' },
      { day: 'Day 8', title: 'Contingency weather day and departure to Nalchik/MRV', alt: '512 m' }
    ],
    included: [
      'Round-trip airport transfers from Nalchik / Mineralnye Vody',
      'Lodging at valley base hotel + private Barrels cabin',
      'Chef-prepared meals during high mountain staging',
      'UIAGM/KMGA certified guides + rescue registry'
    ]
  },
  {
    id: 'kazbek-south-9d',
    slug: 'mount-kazbek-climb-south-9-days',
    title: 'Mount Kazbek Climb (South Route — 9 Days)',
    category: 'kazbek',
    categoryLabel: 'Glaciated Stratovolcano',
    duration: '9 Days / 8 Nights',
    altitude: '5,033 m / 16,512 ft',
    difficulty: 'Demanding',
    priceRub: 95000,
    priceUsd: 1030,
    season: 'July — September 2026',
    image: '/tours/kazbek.webp',
    badge: 'Sacred Peak',
    highlights: [
      'Ascent of the legendary Prometheus mountain (Mkinvartsveri)',
      'Trek through Gergeti Glacier & historic Betlemi Hut (Meteostantsia)',
      'Ancient Gergeti Trinity Church visit at 2,170 m',
      'Combined Georgian & North Caucasus alpine experience'
    ],
    itinerarySummary: [
      { day: 'Day 1', title: 'Transfer to Stepantsminda (Kazbegi)', alt: '1,750 m' },
      { day: 'Day 2', title: 'Trek past Gergeti Trinity Church to Sabertse Pass', alt: '3,000 m' },
      { day: 'Day 3', title: 'Glacier crossing to Meteostantsia Mountain Refuge', alt: '3,650 m' },
      { day: 'Day 4', title: 'Glacier skills & high acclimatization hike', alt: '4,300 m' },
      { day: 'Day 5', title: 'Midnight summit bid to Kazbek Peak (5,033 m)', alt: '5,033 m' },
      { day: 'Day 6-9', title: 'Descent, reserve days, and airport transfer', alt: '1,750 m' }
    ],
    included: [
      'Cross-border logistics & permit handling',
      'Refuge lodging & cook support',
      'Roped glacier guide team'
    ]
  }
];

export const COMPANY_CONTACTS = {
  phone: '+7 (928) 691-44-05',
  phoneAlt: '+7 (928) 691-44-05',
  email: 'info@kavkazskitur.com',
  address: 'Gorkogo St., 74, Nalchik, KBR, Russian Federation',
  baseCamp: 'Barrels-Garabashi 3,800 m, Mt. Elbrus',
  whatsappUrl: 'https://wa.me/79286914405'
};

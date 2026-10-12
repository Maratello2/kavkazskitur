export interface NavItem {
  title: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface NavCategory {
  id: string;
  title: string;
  href?: string;
  sections: NavSection[];
}

export const NAVIGATION_DATA: NavCategory[] = [
  {
    id: 'elbrus',
    title: 'ELBRUS 5642M',
    href: '/expeditions',
    sections: [
      {
        title: 'Classic Routes',
        items: [
          {
            title: 'Elbrus South Side Classic',
            href: '/tours/elbrus-south-classic',
            badge: 'Popular',
            description: 'Comfortable cable car access, Garabashi Barrels 3,800m & panoramic summit push.',
          },
          {
            title: 'Elbrus North Side Route',
            href: '/tours/elbrus-north-wild',
            badge: 'Wild',
            description: 'Autonomous wilderness route via historic Emmanuel glade & warm Narzan springs.',
          },
          {
            title: 'Elbrus Traverse Expedition',
            href: '/tours/elbrus-south-classic',
            description: 'Ascend the wild northern glacier and descend via the southern volcanic slopes.',
          },
        ],
      },
      {
        title: 'Specialty & Combos',
        items: [
          {
            title: 'Elbrus Ski-Tour & Freeride',
            href: '/tours/ski-tour-elbrus',
            badge: 'Freeride',
            description: 'Spring ski-mountaineering ascent with 3,000m continuous off-piste descent.',
          },
          {
            title: 'Kazbek + Elbrus Combo',
            href: '/tours/kazbek-climb-south',
            badge: 'Double Summit',
            description: 'Climb two legendary 5,000m Caucasian summits in a single continuous expedition.',
          },
        ],
      },
    ],
  },
  {
    id: 'peaks-trekking',
    title: 'PEAKS & TREKKING',
    href: '/expeditions',
    sections: [
      {
        title: 'Summits & Peaks',
        items: [
          {
            title: 'Mount Kazbek Summit (5,033m)',
            href: '/tours/kazbek-climb-south',
            description: 'Classic ascent from Stepantsminda via Gergeti glacier and the historic Betlemi hut.',
          },
          {
            title: 'Bezengi 5,000m Mountaineering',
            href: '/expeditions?search=bezengi',
            badge: 'Technical 5000m',
            description: 'Technical walls and iconic ridges of Shkhara, Dykhtau, and the Bezengi Wall.',
          },
        ],
      },
      {
        title: 'Alpine Trekking',
        items: [
          {
            title: 'Elbrus High-Altitude Trekking',
            href: '/acclimatization',
            description: 'Scenic multi-day circuit connecting North and South valleys through Irikchat pass.',
          },
          {
            title: 'Central Caucasus High Trails',
            href: '/expeditions',
            description: 'Acclimatization treks past turquoise glacial lakes and dramatic vertical canyons.',
          },
        ],
      },
    ],
  },
  {
    id: 'activities',
    title: 'ACTIVITIES',
    href: '/expeditions',
    sections: [
      {
        title: 'Mountain & Snow',
        items: [
          {
            title: 'Mountaineering Schools',
            href: '/safety',
            description: 'Crampon technique, glacier rope-teams, crevasse self-arrest and safety protocols.',
          },
          {
            title: 'Skiing & Backcountry Snowboard',
            href: '/barrels',
            description: 'Expert freeride guiding across Azau, Cheget and untouched high-altitude bowls.',
          },
          {
            title: 'Winter Snowshoeing Treks',
            href: '/expeditions',
            description: 'Guided wilderness hikes through pine forests to frozen waterfalls and view ridges.',
          },
        ],
      },
      {
        title: 'Exploration & Discovery',
        items: [
          {
            title: 'Trekking & Day Hikes',
            href: '/expeditions',
            description: 'Scenic alpine day hikes across Baksan, Chegem, and Cherek gorge viewpoints.',
          },
          {
            title: 'Off-Road 4x4 Mountain Trips',
            href: '/barrels',
            description: 'Rugged 4WD expeditions reaching high-altitude plateaus and secluded mineral springs.',
          },
          {
            title: 'Cultural & Excursion Tours',
            href: '/expeditions',
            description: 'Medieval defensive towers, Balkar heritage, and healing natural thermal springs.',
          },
        ],
      },
    ],
  },
  {
    id: 'regions',
    title: 'EXPEDITIONS & REGIONS',
    href: '/map',
    sections: [
      {
        title: 'North Caucasus',
        items: [
          {
            title: 'Kabardino-Balkaria',
            href: '/map',
            description: 'Home to Mt. Elbrus (5,642m), Baksan Valley, and the mighty Bezengi Wall.',
          },
          {
            title: 'Karachaevo-Cherkessia',
            href: '/map',
            description: 'Alpine Dombay ridges, Arkhyz glacial valleys, and sapphire Sofia lakes.',
          },
          {
            title: 'North Ossetia-Alania',
            href: '/map',
            description: 'Karmadon gorge, Midagrabin giant waterfalls, and ancient Dargavs stone city.',
          },
          {
            title: 'Ingushetia Republic',
            href: '/map',
            description: 'Dzheyrakh-Assa sanctuary and medieval stone defensive tower complexes.',
          },
          {
            title: 'Chechnya Republic',
            href: '/map',
            description: 'Alpine Lake Kezenoyam, Argun Gorge towers, and dramatic mountain passes.',
          },
          {
            title: 'Dagestan Republic',
            href: '/map',
            description: 'Deepest Sulak Canyon, ancient fortress of Derbent, and high mountain aouls.',
          },
        ],
      },
      {
        title: 'South Caucasus',
        items: [
          {
            title: 'Georgia (Tbilisi & Kazbegi)',
            href: '/map',
            description: 'Gergeti Trinity Church at 2,170m, Kazbegi valley and Georgian Military Highway.',
          },
          {
            title: 'Trips Around Georgia',
            href: '/map',
            description: 'Svaneti stone towers, UNESCO Ushguli settlement, and Kakheti wine traditions.',
          },
          {
            title: 'Armenia (Yerevan & Aragats)',
            href: '/map',
            description: 'Mount Aragats four volcanic peaks, Lake Sevan, and ancient monasteries.',
          },
          {
            title: 'Armenia + Georgia Combo',
            href: '/map',
            description: 'Complete Transcaucasian cultural circuit connecting mountain capitals and passes.',
          },
          {
            title: 'Azerbaijan (Baku & Shahdag)',
            href: '/map',
            description: 'Shahdag alpine resort, ancient Absheron fire temples, and the Caspian coastline.',
          },
          {
            title: 'Trips Around Azerbaijan',
            href: '/map',
            description: 'Gobustan mud volcanoes, historic Sheki Silk Road palaces, and mountain canyons.',
          },
        ],
      },
    ],
  },
  {
    id: 'services',
    title: 'SERVICES & ABOUT',
    href: '/safety',
    sections: [
      {
        title: 'Logistics & Permits',
        items: [
          {
            title: 'Permits & FSB Border Registration',
            href: '/safety',
            description: 'Official border zone clearances, mountaineering registration, and emergency filing.',
          },
          {
            title: 'Visa Support & Invitation Letters',
            href: '/safety',
            description: 'Tourist voucher vouchers, consular registration, and complete entry guidance.',
          },
          {
            title: 'Transport Services (4x4 Fleet)',
            href: '/barrels',
            description: 'Minvody and Nalchik airport transfers, 4WD mountain vans, and snowcat support.',
          },
          {
            title: 'Private Trips & VIP Bespoke',
            href: '/booking',
            description: 'Tailored 1-on-1 expeditions, private mountain barrel huts, and customized dates.',
          },
        ],
      },
      {
        title: 'Company & Advice',
        items: [
          {
            title: 'About KavKazSkiTur',
            href: '/about',
            description: 'Central Caucasus base operating certified alpine expeditions and logistics since 2012.',
          },
          {
            title: 'Partnership & B2B DMC',
            href: '/partners',
            description: 'Professional ground handling, gear logistics, and guiding for international operators.',
          },
          {
            title: 'FAQ & Gear Checklists',
            href: '/schedule',
            description: 'Mandatory expedition equipment, layering systems, boot selection, and rental items.',
          },
        ],
      },
    ],
  },
];

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  headerGroup?: string;
  description?: string;
  badge?: string;
  icon?: string;
  showInHeader?: boolean;
  order?: number;
}

export function buildNavigationWithCategories(categories: CategoryItem[] = []): NavCategory[] {
  if (!categories || categories.length === 0) {
    return NAVIGATION_DATA;
  }

  const groupMap: Record<string, NavItem[]> = {
    'ELBRUS 5642M': [],
    'PEAKS & TREKKING': [],
    'ACTIVITIES': [],
    'EXPEDITIONS & REGIONS': [],
  };

  const activeCategories = categories.filter((c) => c.showInHeader !== false);

  activeCategories.forEach((cat) => {
    const targetGroup = cat.headerGroup || 'ACTIVITIES';
    const item: NavItem = {
      title: cat.name,
      href: `/expeditions?category=${encodeURIComponent(cat.slug)}`,
      description: cat.description || `Explore all ${cat.name} expeditions`,
      badge: cat.badge || undefined,
    };
    if (!groupMap[targetGroup]) {
      groupMap[targetGroup] = [];
    }
    groupMap[targetGroup].push(item);
  });

  return [
    {
      id: 'elbrus',
      title: 'ELBRUS 5642M',
      href: '/expeditions?category=climbing',
      sections: [
        {
          title: 'Summit Routes',
          items: [
            {
              title: 'Elbrus South Side Classic',
              href: '/tours/elbrus-climb-8-days',
              badge: 'Popular',
              description: 'Comfortable cable car access, Garabashi Barrels 3,800m & panoramic summit push.',
            },
            {
              title: 'Elbrus North Side Route',
              href: '/tours/climbing-elbrus-from-the-north-10-days',
              badge: 'Wild',
              description: 'Autonomous wilderness route via historic Emmanuel glade & warm Narzan springs.',
            },
            {
              title: 'Elbrus Traverse North to South',
              href: '/tours/elbrus-traverse-from-north-to-south-climb-trip-or-ski-tour',
              description: 'Ascend the wild northern glacier and descend via southern volcanic slopes.',
            },
          ],
        },
        {
          title: 'Specialty Routes & Categories',
          items: [
            {
              title: 'Elbrus Ski-Tour & Freeride',
              href: '/tours/elbrus-ski-tour-8-days',
              badge: 'Freeride',
              description: 'Spring ski-mountaineering ascent with 3,000m continuous off-piste descent.',
            },
            ...(groupMap['ELBRUS 5642M'] || []),
          ],
        },
      ],
    },
    {
      id: 'peaks-trekking',
      title: 'PEAKS & TREKKING',
      href: '/expeditions?category=trekking',
      sections: [
        {
          title: 'Summits & Peaks',
          items: [
            {
              title: 'Mount Kazbek Summit (5,033m)',
              href: '/tours/mount-kazbek-climb-5033-m-south-route-9-days-trip',
              description: 'Classic ascent from Stepantsminda via Gergeti glacier and the historic Betlemi hut.',
            },
            {
              title: 'Bezengi Alpine Camp & Glaciers',
              href: '/tours/bezengi-gorge',
              description: 'Heart of the Caucasian Himalayas surrounded by six 5,000m peaks.',
            },
          ],
        },
        {
          title: 'Alpine High Trails & Categories',
          items: [
            {
              title: 'Irik-Chat Gorge Trekking',
              href: '/tours/valley-irik-chat-hiking',
              description: 'Scenic pine forests, mineral narzan springs and glacier viewpoints.',
            },
            ...(groupMap['PEAKS & TREKKING'] || []),
          ],
        },
      ],
    },
    {
      id: 'activities',
      title: 'ACTIVITIES',
      href: '/expeditions',
      sections: [
        {
          title: 'Highland Expeditions & Safaris',
          items: [
            {
              title: 'Off-Road 4x4 Jeep Tours',
              href: '/expeditions?category=jeep-tours',
              badge: '4x4 Fleet',
              description: 'Wild highland plateau safaris to Bermamyt, Kanzhol & Digoria.',
            },
            {
              title: 'Scenic Canyons & Excursions',
              href: '/expeditions?category=excursions',
              badge: 'Cultural',
              description: 'Sulak Canyon, Grozny, Blue Lakes, and ancient stone towers.',
            },
          ],
        },
        {
          title: 'Active Programs & Categories',
          items: [
            {
              title: 'Winter Snowshoeing Treks',
              href: '/expeditions?category=snowshoeing',
              badge: 'Winter',
              description: 'Pristine winter valley snowshoe routes in Baksan & Adyl-Su.',
            },
            ...(groupMap['ACTIVITIES'] || []),
          ],
        },
      ],
    },
    {
      id: 'regions',
      title: 'EXPEDITIONS & REGIONS',
      href: '/map',
      sections: [
        {
          title: 'North Caucasus Regions',
          items: [
            {
              title: 'Kabardino-Balkaria (Elbrus & Bezengi)',
              href: '/expeditions?q=Kabardino-Balkaria',
              description: 'Home to Mount Elbrus, Chegem Canyon, and Bezengi Wall.',
            },
            {
              title: 'Karachay-Cherkessia (Dombay & Bermamyt)',
              href: '/expeditions?q=Karachay-Cherkessia',
              description: 'High alpine meadows, Dombay peaks, and panoramic Bermamyt plateau.',
            },
            {
              title: 'Dagestan (Sulak Canyon & Derbent)',
              href: '/expeditions?q=Dagestan',
              description: 'Deepest canyon in Europe, ancient fortress cities, and Caspian coast.',
            },
          ],
        },
        {
          title: 'South Caucasus & Categories',
          items: [
            {
              title: 'Georgia (Kazbegi & Tbilisi)',
              href: '/expeditions?category=georgia',
              description: 'Mount Kazbek expeditions, Gergeti church, Kakheti wine routes, and Tbilisi.',
            },
            ...(groupMap['EXPEDITIONS & REGIONS'] || []),
          ],
        },
      ],
    },
    {
      id: 'services',
      title: 'SERVICES & ABOUT',
      href: '/about',
      sections: [
        {
          title: 'Logistics & Safety',
          items: [
            {
              title: 'Permits & FSB Border Clearance',
              href: '/safety',
              description: 'Full official border zone pass issuance and national park accreditation.',
            },
            {
              title: 'Transport & 4x4 Mountain Fleet',
              href: '/barrels',
              description: 'Minvody and Nalchik airport transfers, 4WD mountain vans, and snowcats.',
            },
            {
              title: 'Private VIP Expeditions',
              href: '/booking',
              description: 'Tailored 1-on-1 expeditions, private mountain barrel huts, and custom dates.',
            },
          ],
        },
        {
          title: 'Company & Contact',
          items: [
            {
              title: 'About KavKazSkiTur',
              href: '/about',
              description: 'Operating certified alpine expeditions and logistics since 2012.',
            },
            {
              title: 'Partnership & B2B DMC',
              href: '/partners',
              description: 'Professional ground handling and guiding for international operators.',
            },
            {
              title: 'FAQ & Equipment Checklists',
              href: '/schedule',
              description: 'Mandatory high-altitude gear lists, boot selection, and rental items.',
            },
          ],
        },
      ],
    },
  ];
}


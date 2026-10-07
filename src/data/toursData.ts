export interface ElevationPoint {
  label: string;
  meters: number;
  note?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  altitude: string;
  overnight: string;
}

export interface TourData {
  id: string;
  slug: string;
  aliases: string[];
  title: string;
  category: 'climbing' | 'skitour' | 'trekking';
  categoryLabel: string;
  durationDays: number;
  duration: string;
  altitudeMeters: number;
  altitude: string;
  priceRub: number;
  priceUsd: number;
  difficulty: 'Moderate' | 'Demanding' | 'Extreme';
  season: string;
  image: string;
  coverImage?: string;
  gallery?: string[];
  badge?: string;
  description: string;
  highlights: string[];
  elevationProfile: ElevationPoint[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  gearList: {
    category: string;
    items: string[];
  }[];
  schedule2026: {
    dates: string;
    status: 'available' | 'few_spots' | 'guaranteed';
    statusLabel: string;
  }[];
}

export const TOURS_DATA: TourData[] = [
  {
    id: 'elbrus-south-8d',
    slug: 'elbrus-south-classic',
    aliases: ['elbrus-climb-south-side-8-days', 'elbrus-climb-8-days'],
    title: 'Elbrus Climb South Side (8 Days)',
    category: 'climbing',
    categoryLabel: 'Expeditions',
    durationDays: 8,
    duration: '8 days / 7 nights',
    altitudeMeters: 5642,
    altitude: '5,642 m',
    priceRub: 85000,
    priceUsd: 920,
    difficulty: 'Demanding',
    season: 'May — October 2026',
    image: '/tours/elbrus_south.webp',
    coverImage: '/tours/elbrus-south.webp',
    gallery: [
      '/tours/barrels_garabashi.webp',
      '/tours/real_IMG_1999-scaled-360x240.webp',
      '/tours/real_el009b-531x354.webp',
      '/tours/real_elbrusclimb-1.webp',
      '/tours/real_GH011480_Moment-531x354.webp',
      '/tours/real_IMG_7496-531x354.webp',
      '/tours/real_IMG_8639-531x354.webp',
      '/tours/real_IMG_9430-e1604387104961-531x354.webp',
      '/tours/real_070-531x354.webp'
    ],
    badge: 'Most Popular',
    description: 'The classic and most reliable route to the Western Summit of Mount Elbrus (5,642 m) via the southern slope. Ascend by modern gondola cableway from Azau Meadow to 3,850 m (Gara-Bashi) with accommodation at our private high-altitude Barrels Refuge. A balanced stepped acclimatization program with radial sorties to Pastukhov Rocks (4,800 m) and Refuge 11 (4,050 m).',
    highlights: [
      'Gondola cableway from Azau Meadow to 3,850 m',
      'Stay at the legendary Barrels Refuge (Gara-Bashi, 3,800 m)',
      'Acclimatization sortie to Pastukhov Rocks (4,800 m)',
      'Guide-to-climber ratio of 1:3 on summit day',
      'Meals prepared by our resident mountain chef at the refuge'
    ],
    elevationProfile: [
      { label: 'Mineralnye Vody / Nalchik', meters: 512, note: 'Airport pickup' },
      { label: 'Terskol Village', meters: 2150, note: 'Base hotel' },
      { label: 'Terskol Peak / Cheget', meters: 3100, note: 'First acclimatization' },
      { label: 'Barrels Refuge (Gara-Bashi)', meters: 3800, note: 'High camp' },
      { label: 'Pastukhov Rocks', meters: 4800, note: 'Acclimatization max' },
      { label: 'West Summit of Elbrus', meters: 5642, note: 'Summit push & triumph' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport pickup in Mineralnye Vody / Nalchik, transfer to Elbrus region',
        description: 'Meet all expedition members with a KavKazSkiTur representative. Comfortable group transfer through Baksan Valley to the village of Terskol (2,150 m). Check into a cozy hotel, attend the expedition briefing with the lead guide, inspect personal gear, and rent any missing equipment from our partner outfitter.',
        altitude: '2,150 m',
        overnight: 'Hotel in Terskol'
      },
      {
        day: 2,
        title: 'Acclimatization trek to Terskol Peak Observatory & Maiden Braids Waterfall',
        description: 'Hike through the scenic Terskol Gorge via conifer forest to the Maiden Braids Waterfall (2,800 m) and the high-altitude astronomical observatory at Terskol Peak (3,100 m). First cardiovascular activation at altitude. Stunning panorama of the Semyorka Glacier on the Donguz-Orun massif. Packed lunch at a scenic viewpoint, descent to the hotel.',
        altitude: '3,100 m',
        overnight: 'Hotel in Terskol'
      },
      {
        day: 3,
        title: 'Cableway ascent to Barrels Refuge (3,800 m)',
        description: 'Transfer to Azau Meadow (2,350 m). Gondola cableway ascent through Old Krugozor and Mir stations to Gara-Bashi station (3,850 m). Check into our signature Barrels Refuge (3,800 m) — insulated living modules with electricity and a drying room. Hot hearty lunch from the mountain chef. Short acclimatization walk on the glacier up to 4,000 m.',
        altitude: '3,800 m',
        overnight: 'Barrels High-Altitude Refuge'
      },
      {
        day: 4,
        title: 'Snow & ice skills training and ascent to Refuge 11',
        description: 'Hands-on safety training on the high-altitude glacier: proper crampon technique, trekking pole and ice axe handling, fundamentals of self-arrest on a firn slope. Ascent to the ruins of the historic Refuge 11 (4,050 m). Return to camp, rest, and Caucasian herbal tea.',
        altitude: '4,050 m',
        overnight: 'Barrels High-Altitude Refuge'
      },
      {
        day: 5,
        title: 'Acclimatization push to Pastukhov Rocks (4,800 m)',
        description: 'Key adaptation stage before the final summit push. Early departure up the Elbrus slopes past Refuge 11 and a rocky ridge to the lower edge of Pastukhov Rocks (4,700–4,800 m). A 1,000 vertical-meter gain in crampons. Check the body\'s response to thin air. Descend to the Barrels for recovery and dinner.',
        altitude: '4,800 m',
        overnight: 'Barrels High-Altitude Refuge'
      },
      {
        day: 6,
        title: 'Rest day, gear check, and acclimatization recovery',
        description: 'Full rest day for glycogen recovery and blood adaptation. Final check of crampons, headlamps, thermoses, and summit shell layers. Detailed briefing by guides on summit timing and tactics. Early lights-out at 18:00.',
        altitude: '3,800 m',
        overnight: 'Barrels High-Altitude Refuge'
      },
      {
        day: 7,
        title: 'Summit push — West Summit of Elbrus (5,642 m) & triumphant descent',
        description: 'Wake at midnight. Light hot carbohydrate breakfast, tea. Depart for the summit at 01:00–02:00 in crampons with headlamps. If needed, a snowcat can take the group to 4,500–4,800 m. Traverse the Diagonal Shelf, reach the Saddle (5,300 m) at sunrise. Fixed ropes on the steep pre-summit pitch. Arrive at the West Summit plateau (5,642 m)! Photo session on the Roof of Europe. Descend to Barrels Refuge, celebratory lunch, then cableway descent to the hotel in Terskol.',
        altitude: '5,642 m',
        overnight: 'Hotel in Terskol'
      },
      {
        day: 8,
        title: 'Reserve weather day / Farewell banquet / Departure',
        description: 'Backup day in case of prolonged blizzard or storm winds on the mountain. If the summit was reached on Day 7 — rest, stroll to Cheget Meadow and the souvenir market, official summit certificates and KavKazSkiTur medals ceremony. Transfer to Mineralnye Vody / Nalchik airport.',
        altitude: '512 m',
        overnight: 'Departure'
      }
    ],
    included: [
      'Airport transfers Mineralnye Vody/Nalchik — Terskol — airport',
      'Comfortable hotel accommodation in Terskol (3 nights) with breakfast',
      'Accommodation at the Barrels High-Altitude Refuge (4 nights)',
      '3 hot meals per day from the chef at Barrels Refuge',
      'All cableway passes Azau — Gara-Bashi',
      'Certified UIAGM/FAR mountain guides (1 guide per 3-4 climbers on summit day)',
      'Group medical kit, pulse oximetry, and emergency oxygen cylinder',
      'Group registration with the Elbrus High-Mountain Search & Rescue (EMERCOM)',
      'Iridium satellite tracker and slope radios',
      'Official KavKazSkiTur summit certificate'
    ],
    excluded: [
      'Flights to Mineralnye Vody or Nalchik',
      'Personal gear rental (crampons, ice axe, mountaineering boots, down jacket)',
      'Mountaineering insurance with helicopter evacuation',
      'Snowcat rental on summit night (optional)',
      'Dinners at cafés in Terskol village'
    ],
    gearList: [
      {
        category: 'Footwear & Crampons',
        items: ['Double mountaineering boots (welt-compatible)', 'Trekking boots for lower days', '10-12 point crampons fitted to summit boots', 'Snow gaiters']
      },
      {
        category: 'Clothing',
        items: ['Waterproof shell jacket (Gore-Tex)', 'Waterproof side-zip shell pants', 'Expedition down jacket with hood (rated to -25°C)', 'Fleece jacket Polartec 200/300', 'Moisture-wicking base layer set (x2)', 'Insulated summit mittens', 'Windproof fleece gloves (2 pairs)']
      },
      {
        category: 'Technical Gear',
        items: ['Ice axe with leash', 'Climbing harness', '2 locking carabiners + personal tether', 'Telescopic trekking poles', 'Climbing helmet']
      },
      {
        category: 'Optics & Accessories',
        items: ['Category 4 glacier sunglasses', 'Ski goggles with UV protection', 'Headlamp with spare lithium batteries', 'Stainless steel thermos 1.0 L', 'Sunscreen SPF 50+']
      }
    ],
    schedule2026: [
      { dates: '01.05.2026 — 08.05.2026', status: 'guaranteed', statusLabel: 'Guaranteed' },
      { dates: '17.05.2026 — 24.05.2026', status: 'available', statusLabel: 'Spots Available' },
      { dates: '07.06.2026 — 14.06.2026', status: 'few_spots', statusLabel: '3 Spots Left' },
      { dates: '21.06.2026 — 28.06.2026', status: 'guaranteed', statusLabel: 'Guaranteed' },
      { dates: '05.07.2026 — 12.07.2026', status: 'guaranteed', statusLabel: 'Guaranteed' },
      { dates: '19.07.2026 — 26.07.2026', status: 'few_spots', statusLabel: '2 Spots Left' },
      { dates: '02.08.2026 — 09.08.2026', status: 'guaranteed', statusLabel: 'Guaranteed' },
      { dates: '16.08.2026 — 23.08.2026', status: 'available', statusLabel: 'Spots Available' },
      { dates: '06.09.2026 — 13.09.2026', status: 'available', statusLabel: 'Spots Available' }
    ]
  },
  {
    id: 'elbrus-north-8d',
    slug: 'elbrus-north-wild',
    aliases: ['climbing-elbrus-from-the-north-route-8-days-trip'],
    title: 'Climbing Elbrus From North Route (8 Days)',
    category: 'climbing',
    categoryLabel: 'Expeditions',
    durationDays: 8,
    duration: '8 days / 7 nights',
    altitudeMeters: 5621,
    altitude: '5,621 m',
    priceRub: 85000,
    priceUsd: 920,
    difficulty: 'Extreme',
    season: 'June — September 2026',
    image: '/tours/elbrus_north.webp',
    coverImage: '/tours/elbrus-north.webp',
    gallery: [
      '/tours/djily_su.webp',
      '/tours/climbing-elbrus-from-the-north-route-8-days-trip.webp',
      '/tours/two-day-trekking-in-north-elbrus-tract-djily-su-and-summit-camps-3800-m.webp',
      '/tours/real_el009b-531x354.webp',
      '/tours/real_070-531x354.webp',
      '/tours/elbrus_north.webp'
    ],
    badge: 'Wild & Self-Sufficient',
    description: 'A fully self-sufficient, wild ascent along the historic 1829 first-ascent route (General Emmanuel\'s expedition). No cableways, hotels, or snowcats. Start from the scenic Dzhily-Su valley with warm mineral hot springs. All transitions are exclusively on foot through the Mushroom Rocks, Moon Meadow, and Lenz Rocks (4,600–4,800 m) to the East Summit of Elbrus (5,621 m).',
    highlights: [
      '100% honest foot ascent — no cableways or snowcats',
      'Historic route of the first Russian expedition in 1829',
      'Healing warm narzan mineral baths at Dzhily-Su',
      'Overnight in the high-altitude assault camp on the North Moraine (3,800 m)',
      'Famous Mushroom Rocks and Moon Meadow'
    ],
    elevationProfile: [
      { label: 'Nalchik', meters: 512, note: 'Off-road jeep transfer' },
      { label: 'Emmanuel Meadow (Dzhily-Su)', meters: 2600, note: 'Base camp' },
      { label: 'Mushroom Rocks', meters: 3250, note: 'Radial sortie' },
      { label: 'North Refuge (Moraine)', meters: 3800, note: 'Assault camp' },
      { label: 'Lenz Rocks', meters: 4800, note: 'Acclimatization' },
      { label: 'East Summit of Elbrus', meters: 5621, note: 'Summit push' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Transfer from Nalchik to Dzhily-Su by expedition off-road vehicles',
        description: 'Meet at the KavKazSkiTur office in Nalchik. Load up 4x4 vehicles and drive across the highland plateau to the Dzhily-Su valley at Emmanuel Meadow (2,600 m). Set up camp or check into permanent wooden cabins. Bathe in the hot narzan thermal springs.',
        altitude: '2,600 m',
        overnight: 'Emmanuel Base Camp'
      },
      {
        day: 2,
        title: 'Acclimatization trek to Mushroom Rocks and German Airfield',
        description: 'Ascend the fantastic volcanic-tuff plateau to the mysterious "German Airfield" (2,900 m) and the Mushroom Rocks formation (3,250 m) — bizarre weathered lava hoodoos. Lunch at altitude, descent to base camp.',
        altitude: '3,250 m',
        overnight: 'Emmanuel Base Camp'
      },
      {
        day: 3,
        title: 'Gear carry and transition to Assault Camp on the North Moraine (3,800 m)',
        description: 'Team moves with personal gear along a rocky trail across the Kyzylkol River onto the moraine ridge of the Ullukol Glacier to the North Assault Refuge (3,800 m). Check into hut cabins. Dinner from the expedition cook.',
        altitude: '3,800 m',
        overnight: 'North Hut 3,800 m'
      },
      {
        day: 4,
        title: 'Glacier skills training and sortie to lower Lenz Rocks',
        description: 'Venture onto the crevassed glacier in rope teams. Practice ice-firn slope movement, crevasse crossing, and ice-axe self-arrest. Gain altitude to 4,600 m at the lower edge of Lenz Rocks. Descend to the 3,800 m camp.',
        altitude: '4,600 m',
        overnight: 'North Hut 3,800 m'
      },
      {
        day: 5,
        title: 'Acclimatization push to upper Lenz Rocks (4,800 m)',
        description: 'Rope-team ascent to the upper towers of Lenz Rocks (4,800 m). The body adapts to thin air. Physical condition monitoring, descent to camp.',
        altitude: '4,800 m',
        overnight: 'North Hut 3,800 m'
      },
      {
        day: 6,
        title: 'Rest day and summit prep',
        description: 'Rest before the summit push. Check crampons, harnesses, headlamps. Prepare thermoses and summit food.',
        altitude: '3,800 m',
        overnight: 'North Hut 3,800 m'
      },
      {
        day: 7,
        title: 'Summit push — East Summit of Elbrus (5,621 m)',
        description: 'Depart at 01:00 AM. Rope-team movement across the glacier, past Lenz Rocks (4,800 m) to the dome of the East Summit (5,621 m). The summit offers a breathtaking 360° panorama of the Caucasus Range and a view into the dormant volcanic crater. Descend to camp at 3,800 m.',
        altitude: '5,621 m',
        overnight: 'North Hut 3,800 m'
      },
      {
        day: 8,
        title: 'Descent to Dzhily-Su, narzan baths, and transfer to Nalchik',
        description: 'Descend from 3,800 m to Emmanuel Meadow (2,600 m). Celebratory lunch with traditional khychiny and barbecue, soak in the Dzhily-Su springs. Transfer to Nalchik, summit certificate ceremony.',
        altitude: '512 m',
        overnight: 'Hotel in Nalchik'
      }
    ],
    included: [
      '4x4 off-road transfer Nalchik — Dzhily-Su — Nalchik',
      'Base camp cabin accommodation in Dzhily-Su (2,600 m)',
      'High-altitude hut accommodation on the moraine (3,800 m)',
      '3 expedition meals per day throughout the route',
      'Certified mountain guides (1 guide per 3 clients)',
      'Group gear (ropes, ice screws, medical kit, radios, satellite tracker)',
      'EMERCOM registration and Elbrus National Park permits'
    ],
    excluded: [
      'Travel/flights to Nalchik / Mineralnye Vody',
      'Personal gear (sleeping bag -15°C, crampons, boots, 75+ L backpack)',
      'Mountaineering medical insurance'
    ],
    gearList: [
      {
        category: 'Bivouac & Carrying',
        items: ['Expedition backpack 75-90 liters', 'Sleeping bag rated to -15°C / -20°C comfort', 'Self-inflating pad or high-density foam mat']
      },
      {
        category: 'Technical Gear',
        items: ['Double mountaineering boots', 'Crampons matched to boots', 'Ice axe', 'Climbing harness and personal tether', 'Climbing helmet', '2 locking carabiners']
      },
      {
        category: 'Clothing & Protection',
        items: ['Gore-Tex wind/waterproof suit', 'Warm down jacket', 'Windproof balaclava and buff', 'Category 4 sunglasses with side shields', 'Headlamp with spare batteries']
      }
    ],
    schedule2026: [
      { dates: '15.06.2026 — 22.06.2026', status: 'available', statusLabel: 'Spots Available' },
      { dates: '29.06.2026 — 06.07.2026', status: 'guaranteed', statusLabel: 'Guaranteed' },
      { dates: '13.07.2026 — 20.07.2026', status: 'few_spots', statusLabel: '2 Spots Left' },
      { dates: '27.07.2026 — 03.08.2026', status: 'guaranteed', statusLabel: 'Guaranteed' },
      { dates: '10.08.2026 — 17.08.2026', status: 'available', statusLabel: 'Spots Available' },
      { dates: '24.08.2026 — 31.08.2026', status: 'few_spots', statusLabel: '4 Spots Left' }
    ]
  },
  {
    id: 'elbrus-skitour-8d',
    slug: 'ski-tour-elbrus',
    aliases: ['elbrus-ski-tour-8-days'],
    title: 'Elbrus Ski-Tour & Freeride (8 Days)',
    category: 'skitour',
    categoryLabel: 'Ski Touring',
    durationDays: 8,
    duration: '8 days / 7 nights',
    altitudeMeters: 5642,
    altitude: '5,642 m',
    priceRub: 85000,
    priceUsd: 920,
    difficulty: 'Extreme',
    season: 'April — June 2026',
    image: '/tours/skitour_elbrus.webp',
    coverImage: '/tours/elbrus-skitour.webp',
    gallery: [
      '/tours/elbrus-ski-tour-8-days.webp',
      '/tours/elbrus-skitour.webp',
      '/tours/skitour_elbrus.webp',
      '/tours/real_2018-04-10_15-57-50-531x354.webp',
      '/tours/real_photo1653975634-6-531x354.webp',
      '/tours/skitour_elbrus.webp'
    ],
    badge: 'Freeride & Ski Mountaineering',
    description: 'A unique ski-mountaineering program — skin up on skis to the summit of Elbrus and enjoy an unbroken, epic descent with over 3,300 vertical meters of drop all the way down to Azau Meadow. Perfect late-spring snow conditions on the Gara-Bashi and Maly Azau glaciers.',
    highlights: [
      'Ski descent from 5,642 m straight to the base of the mountain',
      'Over 3,300 vertical meters of continuous ski descent',
      'Avalanche safety drills with Pieps/Mammut transceivers',
      'Stay at the heated Barrels Refuge (3,800 m)',
      'Acclimatization descents through Cheget couloirs'
    ],
    elevationProfile: [
      { label: 'Terskol Village', meters: 2150, note: 'Base camp' },
      { label: 'Mount Cheget', meters: 3100, note: 'Warm-up descent' },
      { label: 'Barrels Refuge', meters: 3800, note: 'High camp' },
      { label: 'Pastukhov Rocks', meters: 4800, note: 'Skinning ascent' },
      { label: 'West Summit', meters: 5642, note: 'Start of mega descent' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Mineralnye Vody / Nalchik, ski-touring gear check in Terskol',
        description: 'Transfer to Baksan Valley. Check into the hotel. Full inspection of ski-mountaineering kit: skis, skins, ski crampons, avalanche transceivers, probes, and shovels.',
        altitude: '2,150 m',
        overnight: 'Hotel in Terskol'
      },
      {
        day: 2,
        title: 'Ski-touring ascent and descent on Mount Cheget slopes',
        description: 'Skin up the slopes of Mt. Cheget (3,100 m) with breathtaking views of the Donguz-Orun north face. Practice kick-turns on steep sections and fast descent on spring firn snow.',
        altitude: '3,100 m',
        overnight: 'Hotel in Terskol'
      },
      {
        day: 3,
        title: 'Move to Barrels Refuge (3,800 m) and ski-touring sortie to 4,200 m',
        description: 'Cableway ascent to Gara-Bashi, check into Barrels Refuge. Ski-touring on skins up the glacier to the upper edge of the rocky ridge. Ski descent back to the refuge.',
        altitude: '3,800 m',
        overnight: 'Barrels Refuge'
      },
      {
        day: 4,
        title: 'Ski-tour to Pastukhov Rocks (4,800 m) and freeride descent',
        description: 'Early morning skinning ascent to Pastukhov Rocks (4,800 m). High-speed ski descent from 4,800 m to 3,800 m across wide glacial fields.',
        altitude: '4,800 m',
        overnight: 'Barrels Refuge'
      },
      {
        day: 5,
        title: 'Rest day and avalanche training',
        description: 'Multi-burial transceiver search drill, probing, and shoveling exercise. Ski prep (waxing, edge tuning).',
        altitude: '3,800 m',
        overnight: 'Barrels Refuge'
      },
      {
        day: 6,
        title: 'Summit push — West Summit (5,642 m) on skis & mega descent to Azau',
        description: 'Depart on skis at 02:00 AM. Traverse the Diagonal Shelf and the Saddle. Reach the West Summit with skis. Triumph at the top, click into bindings, and enjoy the epic unbroken freeride descent: 5,642 m → 2,350 m (Azau Meadow)!',
        altitude: '5,642 m',
        overnight: 'Hotel in Terskol'
      },
      {
        day: 7,
        title: 'Reserve weather day / Rest',
        description: 'Backup day in case of high winds or fog on the mountain. If summit was successful — sauna, barbecue, rest.',
        altitude: '2,150 m',
        overnight: 'Hotel in Terskol'
      },
      {
        day: 8,
        title: 'Transfer to airport',
        description: 'Transfer to Mineralnye Vody or Nalchik airport.',
        altitude: '512 m',
        overnight: 'Departure'
      }
    ],
    included: [
      'All transfers along the route',
      'Accommodation in Terskol and Barrels Refuge',
      '3 meals per day at the refuge from the chef',
      'Cableway tickets',
      'UIAGM/FAR-certified ski-mountaineering guides',
      'Avalanche safety gear and EMERCOM registration'
    ],
    excluded: [
      'Ski-touring kit rental (skis, skins, boots, poles)',
      'Avalanche transceiver, probe, shovel (available for rent)',
      'Flights'
    ],
    gearList: [
      {
        category: 'Ski-Touring Equipment',
        items: ['Ski-touring skis with TLT/pin bindings', 'Climbing skins matched to ski geometry', 'Ski crampons (binding-mounted)', 'Ski-touring boots with walk/ski mode']
      },
      {
        category: 'Avalanche Kit',
        items: ['Digital avalanche transceiver', 'Avalanche probe (min. 240 cm)', 'Metal avalanche shovel', 'Backpack with ski carry straps']
      }
    ],
    schedule2026: [
      { dates: '18.04.2026 — 25.04.2026', status: 'guaranteed', statusLabel: 'Guaranteed' },
      { dates: '02.05.2026 — 09.05.2026', status: 'few_spots', statusLabel: '3 Spots Left' },
      { dates: '16.05.2026 — 23.05.2026', status: 'available', statusLabel: 'Spots Available' },
      { dates: '30.05.2026 — 06.06.2026', status: 'available', statusLabel: 'Spots Available' }
    ]
  },
  {
    id: 'elbrus-irikchat-10d',
    slug: 'irikchat-gorge-trek',
    aliases: ['climbing-elbrus-irikchat-gorge-10-days'],
    title: 'Climbing Elbrus + Irikchat Gorge (10 Days)',
    category: 'trekking',
    categoryLabel: 'Trekking',
    durationDays: 10,
    duration: '10 days / 9 nights',
    altitudeMeters: 5621,
    altitude: '5,621 m',
    priceRub: 95000,
    priceUsd: 1030,
    difficulty: 'Demanding',
    season: 'June — September 2026',
    image: '/tours/irikchat.webp',
    coverImage: '/tours/irikchat.webp',
    gallery: [
      '/tours/climbing-elbrus-irikchat-gorge-10-days.webp',
      '/tours/irikchat.webp',
      '/tours/irikchat.webp',
      '/tours/real_156719641_183567866586496_7151072296102921295_n-531x354.webp',
      '/tours/real_photo5355277069799501831-531x354.webp'
    ],
    badge: 'Most Scenic',
    description: 'The most beautiful and secluded route to Elbrus from the east via the pristine Irikchat Gorge, sandstone canyons of the Sand Castles, and mountain passes. Ideal smooth natural acclimatization without abrupt altitude jumps.',
    highlights: [
      'Trekking through ancient pine forests and waterfalls along the Irik River',
      'Camp in the secluded Sand Castles formation',
      'Cross the Irikchat Pass (3,667 m)',
      'Summit push to Elbrus East Peak (5,621 m) via the Achkeryakol lava flow',
      'Pack horse support on the lower section of the route'
    ],
    elevationProfile: [
      { label: 'Elbrus Village', meters: 1800, note: 'Route start' },
      { label: 'Irikchat Gorge', meters: 2800, note: 'Tent camp' },
      { label: 'Sand Castles', meters: 3200, note: 'Camp below the pass' },
      { label: 'Irikchat Pass', meters: 3667, note: 'Glacier approach' },
      { label: 'Achkeryakol Assault Camp', meters: 4300, note: 'High camp' },
      { label: 'East Summit', meters: 5621, note: 'Summit triumph' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival and transfer to Elbrus Village (1,800 m)',
        description: 'Meet in Nalchik / Mineralnye Vody. Transfer to Elbrus Village. Check into a guesthouse, gear sorting.',
        altitude: '1,800 m',
        overnight: 'Guesthouse'
      },
      {
        day: 2,
        title: 'Trek along the Irik River through ancient pines to the canyon',
        description: 'Hike with backpacks (main loads can be carried by horses) along the swift Irik River past sandstone canyons to treeline. Set up tent camp (2,400 m).',
        altitude: '2,400 m',
        overnight: 'Tent camp'
      },
      {
        day: 3,
        title: 'Approach to the Sand Castles formation (3,200 m)',
        description: 'Ascent through alpine meadows to the unique natural sandstone hoodoos known as the Sand Castles.',
        altitude: '3,200 m',
        overnight: 'Tent camp'
      },
      {
        day: 4,
        title: 'Climb to Irikchat Pass (3,667 m) and reach the glacier edge',
        description: 'Cross the Irikchat Pass with stunning views of the Elbrus ice fields. Set up camp at 3,700 m.',
        altitude: '3,700 m',
        overnight: 'Tent camp'
      },
      {
        day: 5,
        title: 'Move to assault camp on the lava flow (4,300 m)',
        description: 'Rope-team movement across the gentle closed glacier to the upper assault camp on the Achkeryakol lava ridge (4,300 m).',
        altitude: '4,300 m',
        overnight: 'Assault tents'
      },
      {
        day: 6,
        title: 'High-altitude acclimatization to 4,800 m',
        description: 'Light sortie up the lava rocks to 4,800 m. Gear check and early lights-out.',
        altitude: '4,800 m',
        overnight: 'Assault tents'
      },
      {
        day: 7,
        title: 'Summit push — East Summit of Elbrus (5,621 m)',
        description: 'Depart at 02:00 AM. Ascent along the rocky-snowy ridge to the East Summit crater. Descend to camp at 4,300 m.',
        altitude: '5,621 m',
        overnight: 'Assault tents'
      },
      {
        day: 8,
        title: 'Reserve weather day',
        description: 'Backup day for summit attempt or descent to Sand Castles.',
        altitude: '3,200 m',
        overnight: 'Tent camp'
      },
      {
        day: 9,
        title: 'Descent to Irik River valley and Elbrus Village',
        description: 'Return to Elbrus Village. Sauna, traditional Caucasian feast.',
        altitude: '1,800 m',
        overnight: 'Guesthouse'
      },
      {
        day: 10,
        title: 'Transfer to airport',
        description: 'Transfer to Mineralnye Vody / Nalchik airport.',
        altitude: '512 m',
        overnight: 'Departure'
      }
    ],
    included: [
      'All transfers along the route',
      'Pack horses for communal gear and tents in the gorge',
      'Expedition mountain tents (Red Fox / Bask)',
      '3 hot meals per day on the trek from the cook',
      'Certified mountain guides (1 guide per 3-4 people)',
      'KBR border zone permit and EMERCOM registration'
    ],
    excluded: [
      'Personal gear (sleeping bag -15, boots, crampons)',
      'Medical insurance'
    ],
    gearList: [
      {
        category: 'Bivouac',
        items: ['Sleeping bag -15°C', 'Backpack 80-90 L', 'Thick foam sleeping pad']
      },
      {
        category: 'Mountaineering',
        items: ['Mountaineering boots', 'Crampons', 'Ice axe', 'Helmet', 'Climbing harness']
      }
    ],
    schedule2026: [
      { dates: '20.06.2026 — 29.06.2026', status: 'available', statusLabel: 'Spots Available' },
      { dates: '10.07.2026 — 19.07.2026', status: 'guaranteed', statusLabel: 'Guaranteed' },
      { dates: '01.08.2026 — 10.08.2026', status: 'few_spots', statusLabel: '3 Spots Left' },
      { dates: '20.08.2026 — 29.08.2026', status: 'available', statusLabel: 'Spots Available' }
    ]
  },
  {
    id: 'elbrus-terskol-8d',
    slug: 'terskol-scenic-climb',
    aliases: ['elbrus-climb-through-terskol-gorge-8-days'],
    title: 'Elbrus Climb Through Terskol Gorge (8 Days)',
    category: 'climbing',
    categoryLabel: 'Expeditions',
    durationDays: 8,
    duration: '8 days / 7 nights',
    altitudeMeters: 5642,
    altitude: '5,642 m',
    priceRub: 85000,
    priceUsd: 920,
    difficulty: 'Demanding',
    season: 'June — September 2026',
    image: '/tours/mountainous-kabardino-balkaria.webp',
    coverImage: '/tours/mountainous-kabardino-balkaria.webp',
    gallery: [
      '/tours/mountainous-kabardino-balkaria.webp',
      '/tours/real_070-531x354.webp',
      '/tours/real_070-531x354.webp',
      '/tours/real_IMG_0407-531x354.webp',
      '/tours/real_IMG_20210601_113820-531x354.webp',
      '/tours/valley-adyr-su-climbing-camps-ullu-tau-and-djailyk.webp'
    ],
    badge: 'Panoramic',
    description: 'A signature combined route with in-depth acclimatization through Terskol Gorge, basalt prisms, the Maiden Braids Waterfall, and the Russian Academy of Sciences observatory on Terskol Peak (3,100 m). Followed by ascent to Barrels Refuge and summit push to the West Peak of Elbrus (5,642 m).',
    highlights: [
      'In-depth acclimatization in Terskol Gorge',
      'Maiden Braids Waterfall and basalt columns',
      'High-altitude observatory at Terskol Peak (3,100 m)',
      'Stay at Barrels Refuge (3,800 m)',
      'High success rate (92%)'
    ],
    elevationProfile: [
      { label: 'Terskol', meters: 2150, note: 'Base hotel' },
      { label: 'Maiden Braids Waterfall', meters: 2800, note: 'Trekking' },
      { label: 'Terskol Observatory', meters: 3100, note: 'Glacier panorama' },
      { label: 'Barrels Refuge', meters: 3800, note: 'High camp' },
      { label: 'Pastukhov Rocks', meters: 4800, note: 'Acclimatization' },
      { label: 'West Summit', meters: 5642, note: 'Summit push' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in the Elbrus region, hotel in Terskol',
        description: 'Meet at Nalchik / Mineralnye Vody airport, transfer to Terskol, evening briefing.',
        altitude: '2,150 m',
        overnight: 'Hotel in Terskol'
      },
      {
        day: 2,
        title: 'Trek through Terskol Gorge to the waterfall and observatory',
        description: 'Ascent through Terskol Gorge past a powerful waterfall to the high-altitude astronomical observatory. Panoramic view of the Greater Caucasus Range.',
        altitude: '3,100 m',
        overnight: 'Hotel in Terskol'
      },
      {
        day: 3,
        title: 'Cableway ascent to Barrels Refuge (3,800 m)',
        description: 'Drive to Azau station, gondola ascent to Gara-Bashi station. Check into Barrels Refuge.',
        altitude: '3,800 m',
        overnight: 'Barrels Refuge'
      },
      {
        day: 4,
        title: 'Glacier skills and self-arrest training on snow',
        description: 'Ice-axe self-arrest practice on steep slopes, crampon technique training.',
        altitude: '4,050 m',
        overnight: 'Barrels Refuge'
      },
      {
        day: 5,
        title: 'Push to Pastukhov Rocks (4,800 m)',
        description: 'Light ascent to Pastukhov Rocks for final acclimatization before the summit push.',
        altitude: '4,800 m',
        overnight: 'Barrels Refuge'
      },
      {
        day: 6,
        title: 'Rest day and early sleep',
        description: 'Gear preparation, rest, lights-out at 18:00.',
        altitude: '3,800 m',
        overnight: 'Barrels Refuge'
      },
      {
        day: 7,
        title: 'Summit push — West Summit of Elbrus (5,642 m)',
        description: 'Night departure for the summit. Ascend to 5,642 m. Descend to the refuge and continue down to the hotel in Terskol.',
        altitude: '5,642 m',
        overnight: 'Hotel in Terskol'
      },
      {
        day: 8,
        title: 'Reserve day and transfer to airport',
        description: 'Certificate ceremony and departure.',
        altitude: '512 m',
        overnight: 'Departure'
      }
    ],
    included: [
      'Airport — hotel — airport transfers',
      'Accommodation in Terskol (3 nights) and Barrels Refuge (4 nights)',
      'Meals from the cook at the refuge',
      'Cableway passes Azau — Gara-Bashi',
      'Certified guides at 1:3 ratio on summit day',
      'EMERCOM registration'
    ],
    excluded: [
      'Personal expenses and flights',
      'Equipment rental',
      'Insurance'
    ],
    gearList: [
      {
        category: 'Footwear',
        items: ['Double mountaineering boots', 'Trekking shoes', 'Crampons']
      },
      {
        category: 'Clothing',
        items: ['Waterproof shell', 'Warm down jacket', 'Base layer', 'Gloves and over-mitts']
      }
    ],
    schedule2026: [
      { dates: '10.06.2026 — 17.06.2026', status: 'available', statusLabel: 'Spots Available' },
      { dates: '24.06.2026 — 01.07.2026', status: 'guaranteed', statusLabel: 'Guaranteed' },
      { dates: '15.07.2026 — 22.07.2026', status: 'few_spots', statusLabel: '2 Spots Left' },
      { dates: '05.08.2026 — 12.08.2026', status: 'guaranteed', statusLabel: 'Guaranteed' },
      { dates: '26.08.2026 — 02.09.2026', status: 'available', statusLabel: 'Spots Available' }
    ]
  },
  {
    id: 'kazbek-south-9d',
    slug: 'kazbek-climb-south',
    aliases: ['mount-kazbek-climb-south-9-days', 'kazbek-climb'],
    title: 'Mount Kazbek Climb (South Route — 9 Days)',
    category: 'climbing',
    categoryLabel: 'Expeditions',
    durationDays: 9,
    duration: '9 days / 8 nights',
    altitudeMeters: 5033,
    altitude: '5,033 m',
    priceRub: 95000,
    priceUsd: 1030,
    difficulty: 'Demanding',
    season: 'July — September 2026',
    image: '/tours/kazbek.webp',
    coverImage: '/tours/kazbek.webp',
    gallery: [
      '/tours/mount-kazbek-climb-5033-m-south-route-9-days-trip.webp',
      '/tours/mount-kazbek-ski-tour-8-days.webp',
      '/tours/real_22-kazbek-fromglacier-gergeti-531x354.webp',
      '/tours/real_08-Kazbekfromchurchgergeti-360x240.webp',
      '/tours/real_08-Kazbekfromchurchgergeti-360x240.webp',
      '/tours/kazbek_summit.webp',
      '/tours/kazbek.webp'
    ],
    badge: 'Legendary Peak',
    description: 'Summit the legendary five-thousander Mount Kazbek (5,033 m) via the southern slope, past the ancient 14th-century Gergeti Trinity Church, across the Gergeti Glacier, and through the high-altitude Betlemi Hut meteorological station (3,650 m). Stunning views of the Georgian Military Highway and Caucasus peaks.',
    highlights: [
      'Start at the ancient Trinity Church in Gergeti (2,170 m)',
      'Glacier crossing on the Gergeti Glacier in crampons',
      'Stay at the high-altitude Betlemi Hut (Weather Station, 3,650 m)',
      'Summit push on the classic ice dome of Kazbek (5,033 m)',
      'Authentic Caucasian hospitality'
    ],
    elevationProfile: [
      { label: 'Stepantsminda', meters: 1750, note: 'Expedition start' },
      { label: 'Gergeti Church', meters: 2170, note: 'Ancient landmark' },
      { label: 'Sabertse Pass', meters: 3000, note: 'Transition' },
      { label: 'Weather Station (Betlemi)', meters: 3650, note: 'High-altitude refuge' },
      { label: 'Kazbek Plateau', meters: 4400, note: 'Glacier skills' },
      { label: 'Mount Kazbek Summit', meters: 5033, note: 'Summit push' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport pickup, transfer to Stepantsminda (Kazbegi)',
        description: 'Meet the team, transfer via the Georgian Military Highway to the town of Stepantsminda (1,750 m). Check into the hotel, gear inspection.',
        altitude: '1,750 m',
        overnight: 'Hotel in Stepantsminda'
      },
      {
        day: 2,
        title: 'Ascent past Gergeti Church to Sabertse Pass (3,000 m)',
        description: 'Hike past the famous Sameba (Trinity) Church in Gergeti, then follow the trail through green hills to Sabertse Pass. Panoramic view of the Gergeti Glacier tongue.',
        altitude: '3,000 m',
        overnight: 'Mountain hut / tents'
      },
      {
        day: 3,
        title: 'Glacier crossing to Betlemi Weather Station (3,650 m)',
        description: 'Crampon up and cross the open Gergeti Glacier. Ascend to the Weather Station refuge (Betlemi Hut, 3,650 m). Settle into the hut.',
        altitude: '3,650 m',
        overnight: 'Betlemi Hut (Weather Station)'
      },
      {
        day: 4,
        title: 'Acclimatization sortie to the chapel and plateau up to 4,300 m',
        description: 'Training ascent to the high-altitude chapel and ice slopes of the Kazbek Plateau. Practice rope-team movement on the closed glacier.',
        altitude: '4,300 m',
        overnight: 'Betlemi Hut'
      },
      {
        day: 5,
        title: 'Rest day before summit push',
        description: 'Rest, acclimatization, early lights-out at 18:00.',
        altitude: '3,650 m',
        overnight: 'Betlemi Hut'
      },
      {
        day: 6,
        title: 'Summit push — Mount Kazbek (5,033 m)',
        description: 'Depart at 02:00 AM. Traverse the plateau, ascend the steep firn slope to the saddle and the summit of Kazbek (5,033 m). Descend to the Weather Station.',
        altitude: '5,033 m',
        overnight: 'Betlemi Hut'
      },
      {
        day: 7,
        title: 'Reserve weather day',
        description: 'Backup day in case of bad weather.',
        altitude: '3,650 m',
        overnight: 'Betlemi Hut'
      },
      {
        day: 8,
        title: 'Descent to Stepantsminda, farewell dinner',
        description: 'Descend from the weather station to the Stepantsminda valley. Check into the hotel, sauna, celebratory feast.',
        altitude: '1,750 m',
        overnight: 'Hotel in Stepantsminda'
      },
      {
        day: 9,
        title: 'Transfer to airport',
        description: 'Transfer to airport.',
        altitude: '512 m',
        overnight: 'Departure'
      }
    ],
    included: [
      'All transfers as per the program',
      'Accommodation in Stepantsminda and at the Weather Station',
      'Meals during the active portion of the route',
      'Professional guides (1:3 ratio on summit day)',
      'Group gear (ropes, radios, medical kit)'
    ],
    excluded: [
      'Flights',
      'Personal mountaineering gear rental',
      'Insurance'
    ],
    gearList: [
      {
        category: 'Equipment',
        items: ['Mountaineering boots', 'Semi-rigid / rigid crampons', 'Ice axe', 'Helmet', 'Climbing harness with 2 locking carabiners']
      }
    ],
    schedule2026: [
      { dates: '05.07.2026 — 13.07.2026', status: 'available', statusLabel: 'Spots Available' },
      { dates: '19.07.2026 — 27.07.2026', status: 'guaranteed', statusLabel: 'Guaranteed' },
      { dates: '09.08.2026 — 17.08.2026', status: 'few_spots', statusLabel: '3 Spots Left' },
      { dates: '23.08.2026 — 31.08.2026', status: 'guaranteed', statusLabel: 'Guaranteed' }
    ]
  }
];

export function getAllTours(): TourData[] {
  return TOURS_DATA;
}

export function getTourBySlug(slug: string): TourData | undefined {
  const cleanSlug = slug.toLowerCase().trim();
  return TOURS_DATA.find(
    (t) => t.slug === cleanSlug || t.aliases.some((a) => a.toLowerCase() === cleanSlug)
  );
}

export function getFeaturedTours(): TourData[] {
  return TOURS_DATA.slice(0, 3);
}

export function getToursByCategory(category: 'climbing' | 'skitour' | 'trekking' | 'all'): TourData[] {
  if (category === 'all') return TOURS_DATA;
  return TOURS_DATA.filter((t) => t.category === category);
}

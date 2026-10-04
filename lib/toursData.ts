// Real expedition data migrated from the live kavkazskitur.com (KavkazSkiTur)
// WordPress/WooCommerce site — see scripts/scrape_tours.py for the source
// scraper. Prices, titles and descriptions are taken directly from the
// operator's public tour pages; itineraries are authored from those source
// descriptions. Images were downloaded from the same pages and converted to
// WebP into /public/tours/.
//
// This dataset powers the homepage "Expeditions" showcase and its
// interactive filter tabs, elevation profile and gear checklist — it is
// independent from the Postgres-backed /tours catalog.

export type ExpeditionCategory = 'climbing' | 'ski-tour' | 'trekking' | '4x4-expedition';

export interface ElevationPoint {
  label: string;
  meters: number;
  note?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  desc: string;
  elevationGain: string;
}

export interface Expedition {
  id: number;
  slug: string;
  title: string;
  category: ExpeditionCategory;
  duration: string;
  maxAltitude: string;
  physicalRating: 'Moderate' | 'Demanding' | 'Extreme';
  priceRub: number;
  priceUsd: number;
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  heroImage: string;
  elevationProfile: ElevationPoint[];
  tag: string;
}

export const RUB_TO_USD_RATE = 90;

export const expeditions: Expedition[] = [
  {
    id: 1,
    slug: 'elbrus-climb-8-days',
    title: 'Elbrus Climb — South Side, 8 Days',
    category: 'climbing',
    duration: '8 Days / 7 Nights',
    maxAltitude: '5,642 m / 18,510 ft',
    physicalRating: 'Demanding',
    priceRub: 95000,
    priceUsd: 1056,
    highlights: [
      'Classic route via the Azau–Garabashi cable car and the Pastukhov Rocks',
      'Acclimatization nights at the Garabashi "barrel" camp, 3,800 m',
      'Small groups with a dedicated mountain guide and snowcat support option',
      'The most popular and time-tested way to summit the highest peak in Europe',
    ],
    itinerary: [
      { day: 1, title: 'Arrival & transfer to Cheget', desc: 'Airport pickup in Mineralnye Vody, transfer to a 2–3★ hotel in Cheget glade, gear check.', elevationGain: '+ 2,100 m (transfer)' },
      { day: 2, title: 'Acclimatization hike', desc: 'Warm-up trek around Cheget/Terskol valley to start adapting to altitude.', elevationGain: '~2,700 m' },
      { day: 3, title: 'Move to Garabashi camp', desc: 'Cable car Azau → Mir → Garabashi, settle into the "barrel" huts at 3,800 m.', elevationGain: '3,800 m' },
      { day: 4, title: 'Acclimatization to Pastukhov Rocks', desc: 'Ascent to the Pastukhov Rocks (4,800 m) and back to camp for rest.', elevationGain: '4,800 m' },
      { day: 5, title: 'Rest & equipment day', desc: 'Full gear and weather-window check with your guide ahead of the summit push.', elevationGain: '3,800 m' },
      { day: 6, title: 'Summit day', desc: 'Alpine start at 2–3 a.m., ascent via the Pastukhov Rocks and the saddle to the summit (5,642 m), descent to Garabashi.', elevationGain: '5,642 m' },
      { day: 7, title: 'Reserve / weather day', desc: 'Buffer day for a delayed summit attempt due to weather, or descent to Cheget.', elevationGain: '3,800 m' },
      { day: 8, title: 'Departure', desc: 'Transfer back to Mineralnye Vody airport.', elevationGain: '—' },
    ],
    included: ['Airport transfers', 'Accommodation (hotel + summit camp)', 'Mountain guide', 'Cable car tickets', 'MChS (rescue service) registration'],
    excluded: ['International flights', 'Personal climbing gear (rentable on site)', 'Meals outside the summit camp', 'Travel insurance'],
    heroImage: '/tours/elbrus-climb-8-days.webp',
    elevationProfile: [
      { label: 'Mineralnye Vody', meters: 320 },
      { label: 'Cheget / Terskol', meters: 2100 },
      { label: 'Azau', meters: 2350 },
      { label: 'Garabashi camp', meters: 3800, note: 'Acclimatization base' },
      { label: "Pastukhov Rocks", meters: 4800, note: 'Acclimatization push' },
      { label: 'Elbrus summit', meters: 5642, note: 'Summit day' },
    ],
    tag: 'Small Groups',
  },
  {
    id: 2,
    slug: 'climbing-elbrus-irikchat-gorge-10-days',
    title: 'Elbrus Climb + Irik-Chat Gorge, 10 Days',
    category: 'climbing',
    duration: '10 Days / 9 Nights',
    maxAltitude: '5,642 m / 18,510 ft',
    physicalRating: 'Demanding',
    priceRub: 95000,
    priceUsd: 1056,
    highlights: [
      'Two extra days of trekking through the scenic Irik-Chat valley for acclimatization',
      'One of the most beautiful valleys in the Caucasus — pine forest and alpine meadows',
      'Same proven summit route via Garabashi and the Pastukhov Rocks',
      'Better summit success rate thanks to longer acclimatization',
    ],
    itinerary: [
      { day: 1, title: 'Arrival & transfer', desc: 'Airport pickup, transfer to Cheget/Terskol, gear check.', elevationGain: '~2,100 m' },
      { day: 2, title: 'Irik-Chat valley trek — day 1', desc: 'Trek into the Irik-Chat gorge, camp among alpine meadows.', elevationGain: '~2,600 m' },
      { day: 3, title: 'Irik-Chat valley trek — day 2', desc: 'Continue up-valley toward the glacier tongue, return to base.', elevationGain: '~3,000 m' },
      { day: 4, title: 'Rest & transfer to Garabashi', desc: 'Cable car up to the Garabashi summit camp, 3,800 m.', elevationGain: '3,800 m' },
      { day: 5, title: 'Acclimatization to Pastukhov Rocks', desc: 'Ascend to 4,800 m and back for a night at camp.', elevationGain: '4,800 m' },
      { day: 6, title: 'Rest day', desc: 'Weather and gear check ahead of the summit attempt.', elevationGain: '3,800 m' },
      { day: 7, title: 'Summit day', desc: 'Alpine start, ascent to the summit (5,642 m), descent to Garabashi.', elevationGain: '5,642 m' },
      { day: 8, title: 'Reserve day', desc: 'Weather buffer for a delayed summit attempt.', elevationGain: '3,800 m' },
      { day: 9, title: 'Descent to Cheget', desc: 'Descend, rest, banya and celebration dinner.', elevationGain: '2,100 m' },
      { day: 10, title: 'Departure', desc: 'Transfer to Mineralnye Vody airport.', elevationGain: '—' },
    ],
    included: ['Airport transfers', 'Accommodation (valley + summit camp)', 'Mountain guide', 'Cable car tickets', 'MChS registration'],
    excluded: ['International flights', 'Personal climbing gear', 'Travel insurance'],
    heroImage: '/tours/climbing-elbrus-irikchat-gorge-10-days.webp',
    elevationProfile: [
      { label: 'Terskol', meters: 2100 },
      { label: 'Irik-Chat valley', meters: 3000, note: 'Acclimatization trek' },
      { label: 'Garabashi camp', meters: 3800 },
      { label: 'Pastukhov Rocks', meters: 4800 },
      { label: 'Elbrus summit', meters: 5642, note: 'Summit day' },
    ],
    tag: 'Best Acclimatization',
  },
  {
    id: 3,
    slug: 'elbrus-ski-tour-8-days',
    title: 'Elbrus Ski-Tour, 8 Days',
    category: 'ski-tour',
    duration: '8 Days / 7 Nights',
    maxAltitude: '5,642 m / 18,510 ft',
    physicalRating: 'Extreme',
    priceRub: 95000,
    priceUsd: 1056,
    highlights: [
      'For climbers experienced in both high-altitude mountaineering and ski touring',
      'Skin up from Garabashi camp with a summit descent on skis or a splitboard',
      'Minimal 8-day duration built around a tight acclimatization schedule',
      'Guide-supported, small-group ski mountaineering on Europe\u2019s highest peak',
    ],
    itinerary: [
      { day: 1, title: 'Arrival & gear fitting', desc: 'Transfer to Cheget, ski-touring equipment check.', elevationGain: '2,100 m' },
      { day: 2, title: 'Ski acclimatization tour', desc: 'Short ski-touring outing around the Cheget/Terskol slopes.', elevationGain: '2,700 m' },
      { day: 3, title: 'Move to Garabashi', desc: 'Cable car to Garabashi camp, 3,800 m.', elevationGain: '3,800 m' },
      { day: 4, title: 'Acclimatization ski tour', desc: 'Skin up towards the Pastukhov Rocks and ski back down to camp.', elevationGain: '4,800 m' },
      { day: 5, title: 'Rest day', desc: 'Equipment and weather-window check.', elevationGain: '3,800 m' },
      { day: 6, title: 'Summit ski day', desc: 'Alpine start, skin to the summit (5,642 m), ski descent to Garabashi.', elevationGain: '5,642 m' },
      { day: 7, title: 'Reserve day', desc: 'Weather buffer or free ski touring around Garabashi.', elevationGain: '3,800 m' },
      { day: 8, title: 'Departure', desc: 'Transfer to Mineralnye Vody airport.', elevationGain: '—' },
    ],
    included: ['Airport transfers', 'Accommodation', 'Mountain/ski guide', 'Cable car tickets', 'MChS registration'],
    excluded: ['International flights', 'Ski touring equipment rental', 'Avalanche safety gear rental', 'Travel insurance'],
    heroImage: '/tours/elbrus-ski-tour-8-days.webp',
    elevationProfile: [
      { label: 'Cheget', meters: 2100 },
      { label: 'Garabashi camp', meters: 3800 },
      { label: 'Pastukhov Rocks', meters: 4800, note: 'Ski acclimatization' },
      { label: 'Elbrus summit', meters: 5642, note: 'Ski descent from here' },
    ],
    tag: 'Ski & Avalanche Gear',
  },
  {
    id: 4,
    slug: 'climbing-elbrus-from-the-north-route-8-days-trip',
    title: 'Elbrus Climb — North Route, 8 Days',
    category: 'climbing',
    duration: '8 Days / 7 Nights',
    maxAltitude: '5,642 m / 18,510 ft',
    physicalRating: 'Demanding',
    priceRub: 85000,
    priceUsd: 944,
    highlights: [
      'The wilder, far less crowded North side of Elbrus',
      'Tented camps instead of huts — a genuine backcountry mountaineering feel',
      'Access via the Dzhily-Su thermal springs and volcanic canyon area',
      'Same summit target (5,642 m) reached from the quieter approach',
    ],
    itinerary: [
      { day: 1, title: 'Arrival & transfer to Dzhily-Su', desc: 'Transfer from Mineralnye Vody through the northern approach road to base camp.', elevationGain: '~2,400 m' },
      { day: 2, title: 'Move to Base Camp', desc: 'Trek/4x4 to the North side base camp beneath the Lenz Rocks.', elevationGain: '~3,000 m' },
      { day: 3, title: 'Acclimatization hike', desc: 'Hike toward the Lenz Rocks for altitude adaptation.', elevationGain: '~3,800 m' },
      { day: 4, title: 'Move to High Camp', desc: 'Carry loads up to the high camp beneath the summit slopes.', elevationGain: '~4,100 m' },
      { day: 5, title: 'Acclimatization & rest', desc: 'Short acclimatization push and gear check.', elevationGain: '~4,600 m' },
      { day: 6, title: 'Summit day', desc: 'Alpine start, ascent via the Lenz Rocks route to the summit (5,642 m), descent to High Camp.', elevationGain: '5,642 m' },
      { day: 7, title: 'Descent to Dzhily-Su', desc: 'Descend to base camp, transfer, banya and rest.', elevationGain: '2,400 m' },
      { day: 8, title: 'Departure', desc: 'Transfer to Mineralnye Vody airport.', elevationGain: '—' },
    ],
    included: ['Transfers', 'Camping equipment', 'Mountain guide', 'MChS registration'],
    excluded: ['International flights', 'Personal climbing gear', 'Travel insurance'],
    heroImage: '/tours/climbing-elbrus-from-the-north-route-8-days-trip.webp',
    elevationProfile: [
      { label: 'Dzhily-Su', meters: 2400 },
      { label: 'North Base Camp', meters: 3000 },
      { label: 'Lenz Rocks', meters: 3800 },
      { label: 'High Camp', meters: 4600 },
      { label: 'Elbrus summit', meters: 5642, note: 'Summit day' },
    ],
    tag: 'Wilderness Route',
  },
  {
    id: 5,
    slug: 'mount-kazbek-climb-5033-m-south-route-9-days-trip',
    title: 'Mount Kazbek Climb — South Route, 9 Days',
    category: 'climbing',
    duration: '9 Days / 8 Nights',
    maxAltitude: '5,033 m / 16,512 ft',
    physicalRating: 'Demanding',
    priceRub: 85000,
    priceUsd: 944,
    highlights: [
      'The easternmost 5,000 m+ peak of the Caucasus, and the highest point in Georgia',
      'Approach through the Gergeti glacier with views of the historic Gergeti Trinity Church',
      'Glaciated stratovolcano ascent with classic high-camp acclimatization',
      'Combinable with an Elbrus summit for a double 5,000 m expedition',
    ],
    itinerary: [
      { day: 1, title: 'Arrival & transfer to Stepantsminda', desc: 'Cross into Georgia, transfer to the village of Stepantsminda (Kazbegi).', elevationGain: '~1,740 m' },
      { day: 2, title: 'Acclimatization hike to Gergeti Church', desc: 'Hike up to the Gergeti Trinity Church for the first views of Kazbek.', elevationGain: '~2,170 m' },
      { day: 3, title: 'Move to Meteo Station', desc: 'Trek up to the Meteo high camp beneath the Gergeti glacier.', elevationGain: '~3,700 m' },
      { day: 4, title: 'Acclimatization on the glacier', desc: 'Rope-team travel and glacier technique practice.', elevationGain: '~4,000 m' },
      { day: 5, title: 'Rest & weather day', desc: 'Gear check and weather-window planning with your guide.', elevationGain: '3,700 m' },
      { day: 6, title: 'Summit day', desc: 'Alpine start, ascent via the Gergeti glacier to the summit (5,033 m), descent to Meteo.', elevationGain: '5,033 m' },
      { day: 7, title: 'Reserve day', desc: 'Weather buffer for a delayed summit attempt.', elevationGain: '3,700 m' },
      { day: 8, title: 'Descent to Stepantsminda', desc: 'Descend, banya and celebration dinner.', elevationGain: '1,740 m' },
      { day: 9, title: 'Departure', desc: 'Transfer back across the border.', elevationGain: '—' },
    ],
    included: ['Transfers', 'Accommodation + high camp', 'Mountain guide', 'Glacier travel equipment', 'MChS/border registration'],
    excluded: ['International flights', 'Personal climbing gear', 'Georgian visa fees (if applicable)', 'Travel insurance'],
    heroImage: '/tours/mount-kazbek-climb-5033-m-south-route-9-days-trip.webp',
    elevationProfile: [
      { label: 'Stepantsminda', meters: 1740 },
      { label: 'Gergeti Church', meters: 2170 },
      { label: 'Meteo high camp', meters: 3700, note: 'Acclimatization base' },
      { label: 'Kazbek summit', meters: 5033, note: 'Summit day' },
    ],
    tag: 'Border Permit Required',
  },
  {
    id: 6,
    slug: 'mount-kazbek-ski-tour-8-days',
    title: 'Mount Kazbek Ski-Tour, 8 Days',
    category: 'ski-tour',
    duration: '8 Days / 7 Nights',
    maxAltitude: '5,047 m / 16,558 ft',
    physicalRating: 'Extreme',
    priceRub: 150000,
    priceUsd: 1667,
    highlights: [
      'Ski mountaineering on the highest point in Georgia',
      'Skin up the Gergeti glacier with a summit descent on skis',
      'Spectacular views over the Georgian Military Highway and Devdoraki glacier',
      'Small, guide-led groups only',
    ],
    itinerary: [
      { day: 1, title: 'Arrival & transfer', desc: 'Transfer to Stepantsminda, ski gear check.', elevationGain: '1,740 m' },
      { day: 2, title: 'Ski acclimatization', desc: 'Short ski-touring outing near the Gergeti Church.', elevationGain: '2,170 m' },
      { day: 3, title: 'Move to Meteo camp', desc: 'Skin up to the Meteo high camp beneath the glacier.', elevationGain: '3,700 m' },
      { day: 4, title: 'Glacier ski acclimatization', desc: 'Rope-team ski touring on the lower glacier.', elevationGain: '4,000 m' },
      { day: 5, title: 'Rest day', desc: 'Weather-window planning with your guide.', elevationGain: '3,700 m' },
      { day: 6, title: 'Summit ski day', desc: 'Alpine start, skin to the summit (5,047 m), ski descent to Meteo.', elevationGain: '5,047 m' },
      { day: 7, title: 'Descent', desc: 'Descend to Stepantsminda, banya and rest.', elevationGain: '1,740 m' },
      { day: 8, title: 'Departure', desc: 'Transfer back across the border.', elevationGain: '—' },
    ],
    included: ['Transfers', 'Accommodation + high camp', 'Mountain/ski guide', 'Glacier travel equipment', 'Border registration'],
    excluded: ['International flights', 'Ski touring & avalanche gear rental', 'Travel insurance'],
    heroImage: '/tours/mount-kazbek-ski-tour-8-days.webp',
    elevationProfile: [
      { label: 'Stepantsminda', meters: 1740 },
      { label: 'Gergeti Church', meters: 2170 },
      { label: 'Meteo high camp', meters: 3700 },
      { label: 'Kazbek summit', meters: 5047, note: 'Ski descent from here' },
    ],
    tag: 'Border Permit Required',
  },
  {
    id: 7,
    slug: 'valley-adyr-su-climbing-camps-ullu-tau-and-djailyk',
    title: 'Adyr-Su Valley — Ullu-Tau & Djailyk Camps',
    category: 'trekking',
    duration: '3 Days / 2 Nights',
    maxAltitude: '3,200 m / 10,499 ft',
    physicalRating: 'Moderate',
    priceRub: 20000,
    priceUsd: 222,
    highlights: [
      'Historic Soviet-era alpine camps Ullu-Tau and Djailyk in a dramatic glacial valley',
      'Contrasting slopes — sun-exposed south side, forested north side of bird cherry and pine',
      'The birthplace of Elbrus mountaineering — first climbers set out from here a century ago',
      'A perfect low-altitude warm-up trek before a higher expedition',
    ],
    itinerary: [
      { day: 1, title: 'Nalchik → Upper Baksan → Adyr-Su gorge', desc: 'Drive through Tyrnyauz and the narrowing gorge into Adyr-Su, walk in to camp.', elevationGain: '~2,000 m' },
      { day: 2, title: 'Ullu-Tau & Djailyk camps', desc: 'Day hike past both historic alpine camps with glacier and peak views.', elevationGain: '~2,600 m' },
      { day: 3, title: 'Return to Nalchik', desc: 'Trek out of the valley and transfer back.', elevationGain: '~800 m' },
    ],
    included: ['Transfers from Nalchik', 'Camping equipment', 'Trekking guide', 'Border zone permit assistance'],
    excluded: ['Meals', 'Personal trekking gear', 'Travel insurance'],
    heroImage: '/tours/valley-adyr-su-climbing-camps-ullu-tau-and-djailyk.webp',
    elevationProfile: [
      { label: 'Nalchik', meters: 512 },
      { label: 'Tyrnyauz', meters: 1300 },
      { label: 'Upper Baksan', meters: 1600 },
      { label: 'Adyr-Su gorge', meters: 2000 },
      { label: 'Ullu-Tau / Djailyk', meters: 2600, note: 'Historic alpine camps' },
    ],
    tag: 'Border Permit Required',
  },
  {
    id: 8,
    slug: 'two-day-trekking-in-north-elbrus-tract-djily-su-and-summit-camps-3800-m',
    title: 'Dzhily-Su & North Elbrus Wilderness Trek',
    category: 'trekking',
    duration: '2 Days / 1 Night',
    maxAltitude: '3,800 m / 12,467 ft',
    physicalRating: 'Moderate',
    priceRub: 20000,
    priceUsd: 222,
    highlights: [
      'Thermal springs and volcanic stone formations of the Dzhily-Su tract',
      'Wild, low-traffic northern approach to Elbrus — a real escape from the crowds',
      'Overnight near the Emmanuel glade with panoramic views of the North face',
      'Short, accessible format for travellers with just a couple of free days',
    ],
    itinerary: [
      { day: 1, title: 'Nalchik → Dzhily-Su', desc: 'Drive to the Dzhily-Su tract, visit the thermal springs and stone "castles", hike to the Emmanuel glade camp.', elevationGain: '~2,400 m' },
      { day: 2, title: 'Summit camp viewpoint & return', desc: 'Hike toward the North side summit camp (3,800 m) for panoramic views, then descend and transfer back to Nalchik.', elevationGain: '3,800 m' },
    ],
    included: ['Transfers from Nalchik', 'Overnight accommodation', 'Trekking guide'],
    excluded: ['Meals', 'Personal trekking gear', 'Travel insurance'],
    heroImage: '/tours/two-day-trekking-in-north-elbrus-tract-djily-su-and-summit-camps-3800-m.webp',
    elevationProfile: [
      { label: 'Nalchik', meters: 512 },
      { label: 'Dzhily-Su springs', meters: 2380, note: 'Thermal springs & stone canyons' },
      { label: 'Emmanuel glade', meters: 2600 },
      { label: 'North summit camp', meters: 3800, note: 'Panoramic viewpoint' },
    ],
    tag: 'Wilderness Route',
  },
  {
    id: 9,
    slug: 'mountainous-kabardino-balkaria',
    title: 'Mountainous Kabardino-Balkaria — 4x4 Expedition',
    category: '4x4-expedition',
    duration: '5 Days / 4 Nights',
    maxAltitude: '2,600 m / 8,530 ft',
    physicalRating: 'Moderate',
    priceRub: 22000,
    priceUsd: 244,
    highlights: [
      'Full overland loop through the Baksan, Cherek and Chegem gorges by 4x4',
      'City tour of Nalchik plus off-road access to remote highland villages',
      'Thermal hot springs, the Blue Lakes and the Chegem waterfalls',
      'Airport/rail transfers from Nalchik or Mineralnye Vody included',
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Nalchik city tour', desc: 'Airport or rail station pickup in Nalchik/Mineralnye Vody, hotel check-in, sightseeing tour of Nalchik.', elevationGain: '512 m' },
      { day: 2, title: 'Baksan Gorge & Elbrus area', desc: '4x4 drive up the Baksan gorge towards the foot of Mt. Elbrus.', elevationGain: '~2,100 m' },
      { day: 3, title: 'Cherek Gorge & Upper Balkaria', desc: 'Off-road route through the Cherek canyon to the historic village of Upper Balkaria.', elevationGain: '~1,900 m' },
      { day: 4, title: 'Chegem Gorge & waterfalls', desc: 'Drive through Chegem gorge, visit the Chegem waterfalls and the Blue Lakes.', elevationGain: '~1,800 m' },
      { day: 5, title: 'Departure', desc: 'Transfer back to the airport/rail station.', elevationGain: '—' },
    ],
    included: ['4x4 vehicle & driver-guide', 'Accommodation', 'Airport/rail transfers', 'Entrance fees to sights'],
    excluded: ['Meals', 'Personal expenses', 'Travel insurance'],
    heroImage: '/tours/mountainous-kabardino-balkaria.webp',
    elevationProfile: [
      { label: 'Nalchik', meters: 512 },
      { label: 'Baksan Gorge', meters: 2100 },
      { label: 'Upper Balkaria', meters: 1900 },
      { label: 'Chegem Gorge', meters: 1800 },
    ],
    tag: '4x4 Expedition Vehicle',
  },
];

export const expeditionCategories: { key: 'all' | ExpeditionCategory; label: string }[] = [
  { key: 'all', label: 'All Expeditions' },
  { key: 'climbing', label: 'High-Altitude Summits' },
  { key: 'ski-tour', label: 'Ski Touring & Freeride' },
  { key: 'trekking', label: 'Wilderness Treks' },
  { key: '4x4-expedition', label: '4x4 Overland' },
];

export function formatPrice(exp: Expedition) {
  return {
    rub: `₽${exp.priceRub.toLocaleString('en-US')}`,
    usd: `$${exp.priceUsd.toLocaleString('en-US')}`,
  };
}

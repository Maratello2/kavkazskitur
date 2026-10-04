import { getTours } from '@/lib/data';
import MapClient from '@/components/MapClient';

export const metadata = {
  title: 'Interactive Map of Caucasus Routes & Expeditions | KavKazSkiTur',
  description:
    'Explore key summits, gorges, waterfalls, and passes across the Caucasus on an interactive map: Elbrus, Bezengi, Dzhily-Su, Chegem, and Bermamyt.',
};

export default async function MapPage() {
  const tours = await getTours();
  return <MapClient tours={tours} />;
}

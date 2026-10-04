import { getTours } from '@/lib/data';
import FavoritesClient from './FavoritesClient';

export default async function FavoritesPage() {
  const allTours = await getTours();
  
  return <FavoritesClient allTours={allTours} />;
}

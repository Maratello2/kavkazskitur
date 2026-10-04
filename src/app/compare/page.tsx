import { getTours } from '@/lib/data';
import CompareClient from './CompareClient';

export default async function ComparePage() {
  const allTours = await getTours();
  
  return <CompareClient allTours={allTours} />;
}

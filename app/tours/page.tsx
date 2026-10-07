import { Suspense } from 'react';
import { getTours, getCategories } from '@/lib/data';
import ToursCatalog from '@/components/ToursCatalog';

export const metadata = {
  title: 'Caucasus Tours & Expeditions Catalog 2026 | KavKazSkiTur',
  description: 'Explore signature mountain expeditions and climbs across the Caucasus: Mount Elbrus, Kazbek, Dzhily-Su, and Georgia by direct outfitter KavKazSkiTur.',
};

export default async function ToursPage(props: {
  searchParams?: Promise<{ category?: string; search?: string }>;
}) {
  const searchParams = (process.env.NEXT_EXPORT !== 'true' && props.searchParams) ? await props.searchParams : {};
  const [tours, categories] = await Promise.all([
    getTours(),
    getCategories()
  ]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0B0F17] dark:text-slate-100 pt-24 pb-20">
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 dark:text-slate-400">
          Loading expeditions catalog...
        </div>
      }>
        <ToursCatalog
          initialTours={tours}
          categories={categories}
          initialCategory={searchParams?.category}
        />
      </Suspense>
    </main>
  );
}

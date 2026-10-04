'use client';

import { useEffect, useState } from 'react';
import { Loader2, Check, X } from 'lucide-react';

interface TourRow {
  id: number;
  name: string;
  category_name: string | null;
  price: number;
  is_published: boolean;
  is_featured: boolean;
  start_date: string | null;
  end_date: string | null;
  capacity: number | null;
}

export default function ToursAdminClient() {
  const [tours, setTours] = useState<TourRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/tours')
      .then((r) => r.json())
      .then((data) => setTours(data.tours || []))
      .finally(() => setLoading(false));
  }, []);

  const patchTour = async (id: number, patch: Partial<TourRow>) => {
    setSavingId(id);
    setTours((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    try {
      await fetch('/api/admin/tours', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      });
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500 py-20 justify-center">
        <Loader2 className="animate-spin" size={20} /> Loading expeditions...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Expeditions Management</h1>

      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Expedition</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price, RUB</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Featured</th>
            </tr>
          </thead>
          <tbody>
            {tours.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">No expeditions found. Check database connection.</td>
              </tr>
            )}
            {tours.map((tour) => (
              <tr key={tour.id} className="border-t border-slate-100 dark:border-white/5">
                <td className="px-4 py-3 font-semibold whitespace-nowrap">{tour.name}</td>
                <td className="px-4 py-3 text-slate-500">{tour.category_name || '—'}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={tour.price}
                    onBlur={(e) => {
                      const value = Number(e.target.value);
                      if (!Number.isNaN(value) && value !== tour.price) patchTour(tour.id, { price: value });
                    }}
                    className="w-28 px-2 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={tour.capacity ?? ''}
                    onBlur={(e) => {
                      const value = e.target.value === '' ? null : Number(e.target.value);
                      if (value !== tour.capacity) patchTour(tour.id, { capacity: value as any });
                    }}
                    className="w-20 px-2 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => patchTour(tour.id, { is_published: !tour.is_published })}
                    className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${tour.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}
                  >
                    {tour.is_published ? <Check size={15} /> : <X size={15} />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => patchTour(tour.id, { is_featured: !tour.is_featured })}
                    className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${tour.is_featured ? 'bg-[#C85A32]/15 text-[#C85A32]' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}
                  >
                    {tour.is_featured ? <Check size={15} /> : <X size={15} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {savingId !== null && (
          <div className="px-4 py-2 text-xs text-slate-400 flex items-center gap-1.5">
            <Loader2 className="animate-spin" size={12} /> Saving...
          </div>
        )}
      </div>
    </div>
  );
}

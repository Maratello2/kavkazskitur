'use client';

import { useEffect, useState } from 'react';
import { Loader2, Phone } from 'lucide-react';

interface LeadRow {
  id: number;
  name: string;
  phone: string;
  tour_name: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface BookingRow {
  id: number;
  name: string;
  phone: string;
  tour_name: string | null;
  departure_date: string | null;
  people_count: number;
  comment: string | null;
  status: string;
  created_at: string;
}

const leadStatuses = ['new', 'contacted', 'qualified', 'rejected'];
const bookingStatuses = ['new', 'confirmed', 'paid', 'cancelled', 'completed'];

const statusLabels: Record<string, string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified', rejected: 'Rejected',
  confirmed: 'Confirmed', paid: 'Paid', cancelled: 'Cancelled', completed: 'Completed',
};

export default function LeadsClient() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'leads' | 'bookings'>('leads');

  useEffect(() => {
    fetch('/api/admin/leads')
      .then((r) => r.json())
      .then((data) => {
        setLeads(data.leads || []);
        setBookings(data.bookings || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (type: 'lead' | 'booking', id: number, status: string) => {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id, status }),
    });
    if (type === 'lead') {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } else {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500 py-20 justify-center">
        <Loader2 className="animate-spin" size={20} /> Loading requests...
      </div>
    );
  }

  const rows = tab === 'leads' ? leads : bookings;
  const statuses = tab === 'leads' ? leadStatuses : bookingStatuses;

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Inquiries &amp; Bookings</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('leads')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${tab === 'leads' ? 'bg-[#C85A32] text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
        >
          Inquiries ({leads.length})
        </button>
        <button
          onClick={() => setTab('bookings')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${tab === 'bookings' ? 'bg-[#C85A32] text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
        >
          Bookings ({bookings.length})
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Expedition</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">No inquiries yet</td>
              </tr>
            )}
            {rows.map((row: any) => (
              <tr key={row.id} className="border-t border-slate-100 dark:border-white/5">
                <td className="px-4 py-3 font-semibold">{row.name}</td>
                <td className="px-4 py-3">
                  <a href={`tel:${row.phone}`} className="flex items-center gap-1.5 text-[#C85A32] hover:underline">
                    <Phone size={14} /> {row.phone}
                  </a>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.tour_name || row.message || '—'}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{new Date(row.created_at).toLocaleString('en-US')}</td>
                <td className="px-4 py-3">
                  <select
                    value={row.status}
                    onChange={(e) => updateStatus(tab === 'leads' ? 'lead' : 'booking', row.id, e.target.value)}
                    className="px-2 py-1.5 rounded-lg text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{statusLabels[s] || s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Mountain,
  Settings,
  Phone,
  MessageSquare,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Edit,
  X,
  Megaphone,
  Plus,
  Trash2,
  Eye,
  DollarSign,
  FileSpreadsheet,
  ExternalLink,
  MapPin,
  Clock,
  ShieldCheck,
  Activity,
  Compass,
  Globe,
  KeyRound,
  ShieldAlert,
  UserPlus,
  Lock,
  Mail,
  Layout,
  Layers,
  Search,
  Check,
} from 'lucide-react';
import { TOURS_DATA } from '@/data/toursData';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import TourMediaManager from '@/components/admin/TourMediaManager';

export interface BookingRow {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  tour_name: string | null;
  departure_date: string | null;
  people_count: number;
  comment: string | null;
  gear_requests?: string | null;
  transfer?: string | null;
  manager_notes?: string | null;
  status: string;
  created_at: string;
}

export interface DepartureDateSlot {
  dates: string;
  spotsLeft: number;
  capacity: number;
  status?: 'available' | 'few_spots' | 'guaranteed' | 'sold_out';
}

export interface TourItem {
  id: number;
  slug?: string;
  name: string;
  category_name?: string | null;
  category?: string;
  difficulty?: 'Moderate' | 'Demanding' | 'Extreme' | string;
  altitude?: string;
  duration?: string;
  price: number;
  priceRub?: number;
  priceUsd?: number;
  is_published: boolean;
  is_featured: boolean;
  status: 'Active' | 'Sold Out' | 'Draft';
  start_date?: string | null;
  end_date?: string | null;
  capacity: number | null;
  cover_image?: string | null;
  coverImage?: string | null;
  gallery?: string[] | null;
  description?: string | null;
  schedule2026?: DepartureDateSlot[];
}

export interface SiteSettings {
  // Hero & Branding
  heroTitle: string;
  heroSubtitle: string;
  promoBadgeText: string;
  seasonStatus: string;
  announcementText: string;
  announcementActive: boolean;

  // Commercial & Financial Policies
  usdExchangeRate: number;
  prepaymentPercent: number;
  freeCancellationDays: number;
  paymentDetailsNote: string;

  // Section Visibility Toggles
  showReviews: boolean;
  showGearRental: boolean;
  showMap: boolean;
  showAcclimatization: boolean;
  showCompare: boolean;

  // Communication & Emergency Channels
  phone: string;
  whatsapp: string;
  whatsappLink: string;
  telegramChannel: string;
  email: string;
  address: string;
  workingHours: string;
  rescuePhone: string;
  emergencyContact: string;

  // SEO & Analytics
  yandexMetrikaId: string;
  googleAnalyticsId: string;
  metaTitle: string;
  metaDescription: string;
}

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'superadmin' | 'manager' | 'editor';
  is_active: boolean;
  created_at: string;
  last_login?: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  new: { label: 'New Lead', badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  whatsapp_sent: { label: 'WhatsApp Sent', badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  contacted: { label: 'Contacted', badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  deposit_paid: { label: 'Deposit Paid', badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  paid: { label: 'Full Paid', badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  confirmed: { label: 'Confirmed', badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  cancelled: { label: 'Cancelled', badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
  completed: { label: 'Completed', badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
};

function difficultyBadge(diff?: string) {
  switch (diff) {
    case 'Moderate':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'Extreme':
      return 'bg-blue-600/20 text-blue-300 border-blue-500/40';
    case 'Demanding':
    default:
      return 'bg-sky-500/15 text-sky-300 border-sky-500/30';
  }
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Tab from URL query (?tab=analytics | crm | tours | settings | users)
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'analytics' | 'crm' | 'tours' | 'settings' | 'users'>('analytics');

  useEffect(() => {
    if (tabFromUrl && ['analytics', 'crm', 'tours', 'settings', 'users'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl as any);
    } else {
      setActiveTab('analytics');
    }
  }, [tabFromUrl]);

  // 1. Leads / CRM State
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<BookingRow | null>(null);
  const [leadNotesSaving, setLeadNotesSaving] = useState(false);

  // 2. Tours State
  const [tours, setTours] = useState<TourItem[]>([]);
  const [toursLoading, setToursLoading] = useState(true);
  const [editingTour, setEditingTour] = useState<TourItem | null>(null);
  const [isCreatingTour, setIsCreatingTour] = useState(false);
  const [newDateInput, setNewDateInput] = useState('');
  const [newDateCapacity, setNewDateCapacity] = useState(12);
  const [newDateSpots, setNewDateSpots] = useState(12);

  // 3. Global Settings State
  const [settings, setSettings] = useState<SiteSettings>({
    heroTitle: 'Raw Caucasus. Untamed Peaks.',
    heroSubtitle: 'Backcountry ski touring, high-altitude summits, and wild expeditions led by certified local mountaineering masters. Base camp at Mt. Elbrus, 3,800 m.',
    promoBadgeText: 'CENTRAL CAUCASUS • 20 YEARS OF EXPEDITIONS',
    seasonStatus: 'Active — Booking Summer & Autumn 2026 Expeditions',
    announcementText: 'Early registration for 2026 Mount Elbrus & Kazbek summer expeditions is open with 10% discount.',
    announcementActive: true,
    usdExchangeRate: 92.5,
    prepaymentPercent: 30,
    freeCancellationDays: 14,
    paymentDetailsNote: 'Direct official tour operator contract, bank transfer or online card settlement with instant receipt.',
    showReviews: true,
    showGearRental: true,
    showMap: true,
    showAcclimatization: true,
    showCompare: true,
    phone: '+7 (928) 082-84-13',
    whatsapp: '+7 (928) 082-84-13',
    whatsappLink: 'https://wa.me/79280828413',
    telegramChannel: 'https://t.me/kavkazskitur',
    email: 'info@kavkazskitur.com',
    address: 'Gorkogo St. 74, Nalchik, Kabardino-Balkaria',
    workingHours: '08:00 — 21:00 MSK Daily',
    rescuePhone: '+7 (928) 082-84-13',
    emergencyContact: 'Elbrus Alpine Rescue Post (EMERCOM): +7 (866) 387-14-89',
    yandexMetrikaId: '98451230',
    googleAnalyticsId: 'G-KVZSKT2026',
    metaTitle: 'KavKazSkiTur | Mountain Expeditions & Ski Touring in the Caucasus',
    metaDescription: 'Official tour operator for Mount Elbrus summits, ski touring, and high-altitude adventures in Kabardino-Balkaria.',
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // 4. Team & Access (Users) State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(true);
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> & { password?: string }>({
    username: '',
    name: '',
    email: '',
    role: 'manager',
    is_active: true,
    password: '',
  });
  const [userFormError, setUserFormError] = useState('');
  const [userFormSaving, setUserFormSaving] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUser | null>(null);
  const [currentAdminUser, setCurrentAdminUser] = useState<{ id: number; username: string; role: string } | null>(null);

  // Initial Data Fetching
  useEffect(() => {
    // 1. Fetch Inquiries
    fetch('/api/admin/leads')
      .then((r) => r.json())
      .then((data) => {
        const list = data.bookings?.length ? data.bookings : data.leads || [];
        setBookings(list);
      })
      .catch(() => {
        setBookings([]);
      })
      .finally(() => setBookingsLoading(false));

    // 2. Fetch Tours
    fetch('/api/admin/tours')
      .then((r) => r.json())
      .then((data) => {
        if (data.tours && data.tours.length > 0) {
          setTours(data.tours);
        } else {
          setTours(
            TOURS_DATA.map((t, idx) => ({
              id: idx + 1,
              slug: t.slug,
              name: t.title,
              category_name: t.categoryLabel || 'Expedition',
              price: t.priceRub || 55000,
              priceRub: t.priceRub || 55000,
              priceUsd: t.priceUsd || Math.round((t.priceRub || 55000) / 92.5),
              difficulty: t.difficulty || 'Demanding',
              altitude: t.altitude || '5,642 m',
              duration: t.duration || `${t.durationDays} days`,
              is_published: true,
              is_featured: idx < 3,
              status: idx === 3 ? 'Sold Out' : 'Active',
              start_date: '2026-06-01',
              end_date: '2026-09-30',
              capacity: 12,
              cover_image: t.coverImage,
              coverImage: t.coverImage,
              gallery: t.gallery || [],
              description: t.description,
              schedule2026: [
                { dates: '12 Jun — 19 Jun 2026', spotsLeft: 4, capacity: 12, status: 'few_spots' },
                { dates: '26 Jun — 03 Jul 2026', spotsLeft: 8, capacity: 12, status: 'available' },
                { dates: '10 Jul — 17 Jul 2026', spotsLeft: 0, capacity: 12, status: 'sold_out' },
              ],
            }))
          );
        }
      })
      .catch((err) => console.error('Error loading tours:', err))
      .finally(() => setToursLoading(false));

    // 3. Fetch Settings
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch((err) => console.error('Error loading settings:', err))
      .finally(() => setSettingsLoading(false));
  }, []);

  // Fetch Users when tab switches to 'users'
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && data.users) {
        setAdminUsers(data.users);
        if (data.currentUser) setCurrentAdminUser(data.currentUser);
      }
    } catch (err) {
      console.error('Error loading admin users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  // Lead Status Change
  const handleStatusChange = async (id: number, newStatus: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Save Lead Internal Notes
  const handleSaveLeadNotes = async () => {
    if (!selectedLead) return;
    setLeadNotesSaving(true);
    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLead.id,
          manager_notes: selectedLead.manager_notes,
        }),
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedLead.id ? { ...b, manager_notes: selectedLead.manager_notes } : b
        )
      );
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setLeadNotesSaving(false);
    }
  };

  // Open Direct WhatsApp Chat
  const openWhatsAppChat = (lead: BookingRow) => {
    let cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('8') && cleanPhone.length === 11) {
      cleanPhone = '7' + cleanPhone.slice(1);
    }
    const message = encodeURIComponent(
      `Hello ${lead.name}! This is the KavKazSkiTur expedition team regarding your reservation for "${lead.tour_name || 'Caucasus Expedition'}". We are glad to welcome you to the team!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // Export Filtered Bookings to CSV (with UTF-8 BOM)
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) return;

    const headers = [
      'ID',
      'Client Name',
      'Phone Number',
      'Email',
      'Expedition Route',
      'Departure Date',
      'Participants',
      'Gear Requests',
      'Transfer Details',
      'Comments',
      'Manager Notes',
      'Booking Status',
      'Created At',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const val = String(str).replace(/"/g, '""');
      return `"${val}"`;
    };

    const rows = filteredBookings.map((b) => [
      b.id,
      escapeCsv(b.name),
      escapeCsv(b.phone),
      escapeCsv(b.email || ''),
      escapeCsv(b.tour_name || 'Custom'),
      escapeCsv(b.departure_date || 'TBD'),
      b.people_count || 1,
      escapeCsv(b.gear_requests || ''),
      escapeCsv(b.transfer || ''),
      escapeCsv(b.comment || ''),
      escapeCsv(b.manager_notes || ''),
      escapeCsv(b.status),
      escapeCsv(new Date(b.created_at).toISOString()),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `KavKazSkiTur_Leads_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Tour
  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;

    const updated = {
      ...editingTour,
      priceRub: Number(editingTour.price),
      priceUsd:
        editingTour.priceUsd ||
        Math.round(Number(editingTour.price) / (settings.usdExchangeRate || 92.5)),
    };

    try {
      const res = await fetch('/api/admin/tours', {
        method: isCreatingTour ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        if (isCreatingTour) {
          setTours([updated, ...tours]);
        } else {
          setTours(tours.map((t) => (t.id === updated.id ? updated : t)));
        }
        setEditingTour(null);
        setIsCreatingTour(false);
      }
    } catch (err) {
      console.error('Error saving tour:', err);
    }
  };

  // Add Date Slot to editing tour
  const handleAddDateSlot = () => {
    if (!editingTour || !newDateInput.trim()) return;
    const currentSchedule = editingTour.schedule2026 || [];
    const newSlot: DepartureDateSlot = {
      dates: newDateInput.trim(),
      capacity: Number(newDateCapacity),
      spotsLeft: Number(newDateSpots),
      status: Number(newDateSpots) === 0 ? 'sold_out' : Number(newDateSpots) <= 3 ? 'few_spots' : 'available',
    };
    setEditingTour({
      ...editingTour,
      schedule2026: [...currentSchedule, newSlot],
    });
    setNewDateInput('');
  };

  // Remove Date Slot
  const handleRemoveDateSlot = (idx: number) => {
    if (!editingTour) return;
    const currentSchedule = editingTour.schedule2026 || [];
    setEditingTour({
      ...editingTour,
      schedule2026: currentSchedule.filter((_, i) => i !== idx),
    });
  };

  // Save Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsSavedSuccess(true);
        setTimeout(() => setSettingsSavedSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Error saving site settings:', err);
    } finally {
      setSettingsSaving(false);
    }
  };

  // Save / Create Admin User
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError('');
    setUserFormSaving(true);

    try {
      const method = isCreatingUser ? 'POST' : 'PATCH';
      const res = await fetch('/api/admin/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setUserFormError(data.error || 'Failed to save administrator.');
        return;
      }

      setUserModalOpen(false);
      loadUsers();
    } catch (err: any) {
      setUserFormError(err.message || 'Network error occurred.');
    } finally {
      setUserFormSaving(false);
    }
  };

  // Delete Admin User
  const handleDeleteUser = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to delete administrator.');
        return;
      }
      setDeleteConfirmUser(null);
      loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === 'all' ||
      b.status === statusFilter ||
      (statusFilter === 'new' && b.status === 'new') ||
      (statusFilter === 'whatsapp_sent' && (b.status === 'whatsapp_sent' || b.status === 'contacted')) ||
      (statusFilter === 'deposit_paid' && (b.status === 'deposit_paid' || b.status === 'paid'));

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      (b.tour_name && b.tour_name.toLowerCase().includes(q)) ||
      (b.comment && b.comment.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Header (Refined Alpine Operations Header) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          {/* Micro-header Badge with Vector Icon (Zero Emojis, exact main site format) */}
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C] border border-[#C2410C]/30 bg-[#C2410C]/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-2.5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>CENTRAL CAUCASUS • 20 YEARS OF EXPEDITIONS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Expedition Command Dashboard
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Operational center: client reservations, high-altitude telemetry, expedition rates, and fleet parameters.
          </p>
        </div>

        {/* Operational Telemetry Indicators & Quick Public Site Transition */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
          {/* Prominent Public Site Transition Button */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-orange-950/40 border border-orange-400/30 transition-all cursor-pointer group"
          >
            <Globe size={14} className="text-white" />
            <span>View Live Site</span>
            <ExternalLink size={12} className="opacity-80 group-hover:opacity-100" />
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0E1F33] border border-white/10 text-xs font-semibold text-slate-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Summer 2026 Live</span>
          </div>

          <a
            href={`tel:${settings.phone}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0E1F33] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-slate-300 transition-colors shadow-md"
          >
            <Phone size={13} className="text-[#C2410C]" />
            <span>HQ Hotline</span>
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ANALYTICS & METRICS                                               */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && <AdminAnalytics />}

      {/* ========================================================================= */}
      {/* TAB 2: INQUIRIES & CRM                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'crm' && (
        <div className="space-y-6">
          {/* Controls Bar: Search, Status Filter, Export to CSV */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0E1F33] p-5 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <input
                type="text"
                placeholder="Search by client name, phone, or route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
              />

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 whitespace-nowrap">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C] cursor-pointer"
                >
                  <option value="all">All Inquiries ({bookings.length})</option>
                  <option value="new">New</option>
                  <option value="whatsapp_sent">WhatsApp Sent</option>
                  <option value="deposit_paid">Deposit Paid</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={filteredBookings.length === 0}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet size={15} className="text-[#38BDF8]" />
              <span>Export CSV ({filteredBookings.length})</span>
            </button>
          </div>

          {/* Bookings Table */}
          <div className="bg-[#0E1F33] rounded-2xl border border-white/10 overflow-hidden shadow-2xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#091422]/90 border-b border-white/10 text-[10px] uppercase tracking-[0.22em] font-bold text-slate-400">
                <tr>
                  <th className="px-5 py-4">Client &amp; Contact</th>
                  <th className="px-5 py-4">Expedition Route</th>
                  <th className="px-5 py-4">Dates &amp; Climbers</th>
                  <th className="px-5 py-4">Special Requests</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookingsLoading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C2410C]" />
                      <span>Loading client inquiries...</span>
                    </td>
                  </tr>
                )}
                {!bookingsLoading && filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      No matching inquiries found.
                    </td>
                  </tr>
                )}
                {!bookingsLoading &&
                  filteredBookings.map((b) => {
                    const badge = STATUS_CONFIG[b.status] || STATUS_CONFIG.new;
                    return (
                      <tr
                        key={b.id}
                        onClick={() => setSelectedLead(b)}
                        className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-4">
                          <div className="font-bold text-white text-sm">{b.name}</div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <a
                              href={`tel:${b.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-slate-300 hover:text-[#FB923C] flex items-center gap-1"
                            >
                              <Phone size={12} className="text-[#C2410C]" />
                              <span>{b.phone}</span>
                            </a>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openWhatsAppChat(b);
                              }}
                              className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px] font-bold"
                            >
                              <MessageSquare size={12} />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-200">
                            {b.tour_name || 'Custom Expedition'}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Submitted:{' '}
                            {new Date(b.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                            <Calendar size={13} className="text-[#C2410C]" />
                            <span>{b.departure_date || 'Flexible / TBD'}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {b.people_count || 1} participant{b.people_count > 1 ? 's' : ''}
                          </div>
                        </td>

                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                            {b.comment || b.gear_requests || 'None specified.'}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={b.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer focus:outline-none ${badge.badgeClass}`}
                          >
                            <option value="new">New Lead</option>
                            <option value="whatsapp_sent">WhatsApp Sent</option>
                            <option value="deposit_paid">Deposit Paid</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLead(b);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#C2410C] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                          >
                            <Eye size={12} />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Client Details Modal */}
          {selectedLead && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0E1F33] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 sticky top-0 bg-[#0E1F33] z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C2410C]/20 border border-[#C2410C]/40 flex items-center justify-center text-[#FB923C] font-black text-base">
                      {selectedLead.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-white tracking-tight">
                        {selectedLead.name}
                      </h3>
                      <div className="text-xs text-slate-400">
                        Lead #{selectedLead.id} &bull; Received{' '}
                        {new Date(selectedLead.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Main Action: Open WhatsApp Chat */}
                <div className="p-4 rounded-2xl bg-[#091422] border border-[#C2410C]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C2410C] flex items-center justify-center text-white shrink-0 shadow-lg shadow-orange-950/40">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-white">
                        Direct WhatsApp Briefing
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Prefilled greeting targeting {selectedLead.phone}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openWhatsAppChat(selectedLead)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-950/40 border border-orange-400/20 shrink-0"
                  >
                    <span>Open WhatsApp Chat</span>
                    <ExternalLink size={13} />
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#091422] border border-white/5 space-y-1">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Phone Number</div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <Phone size={14} className="text-[#C2410C]" />
                      <a href={`tel:${selectedLead.phone}`} className="hover:text-[#FB923C]">
                        {selectedLead.phone}
                      </a>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#091422] border border-white/5 space-y-1">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Email Address</div>
                    <div className="font-semibold text-white truncate">
                      {selectedLead.email || 'Not provided'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#091422] border border-white/5 space-y-1">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Expedition Route</div>
                    <div className="font-bold text-[#FB923C]">
                      {selectedLead.tour_name || 'Custom Expedition'}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#091422] border border-white/5 space-y-1">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Dates &amp; Climbers</div>
                    <div className="font-bold text-white">
                      {selectedLead.departure_date || 'Flexible'} &bull; {selectedLead.people_count || 1} participant(s)
                    </div>
                  </div>
                </div>

                {/* Requests & Transfer */}
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-xl bg-[#091422] border border-white/5">
                    <div className="text-slate-400 font-bold uppercase text-[10px] mb-1">
                      Client Comments / Inquiries
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {selectedLead.comment || 'No initial comment entered.'}
                    </p>
                  </div>

                  {selectedLead.gear_requests && (
                    <div className="p-4 rounded-xl bg-[#091422] border border-white/5">
                      <div className="text-slate-400 font-bold uppercase text-[10px] mb-1">
                        Requested Alpine Gear Rental
                      </div>
                      <p className="text-amber-400 font-medium leading-relaxed">
                        {selectedLead.gear_requests}
                      </p>
                    </div>
                  )}

                  {selectedLead.transfer && (
                    <div className="p-4 rounded-xl bg-[#091422] border border-white/5">
                      <div className="text-slate-400 font-bold uppercase text-[10px] mb-1">
                        Airport Transfer &amp; Logistics
                      </div>
                      <p className="text-slate-200">{selectedLead.transfer}</p>
                    </div>
                  )}
                </div>

                {/* Manager Internal Notes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Internal Expedition Notes
                    </label>
                    <span className="text-[10px] text-slate-500">Visible to operators only</span>
                  </div>
                  <textarea
                    rows={3}
                    value={selectedLead.manager_notes || ''}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, manager_notes: e.target.value })
                    }
                    placeholder="Enter notes about passport scans, gear sizes, flight confirmations..."
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveLeadNotes}
                      disabled={leadNotesSaving}
                      className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-[#C2410C] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      {leadNotesSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      <span>Save Notes</span>
                    </button>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <select
                      value={selectedLead.status}
                      onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#091422] border border-white/15 text-white cursor-pointer"
                    >
                      <option value="new">New Lead</option>
                      <option value="whatsapp_sent">WhatsApp Sent</option>
                      <option value="deposit_paid">Deposit Paid</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setSelectedLead(null)}
                    className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EXPEDITION CATALOG                                                */}
      {/* ========================================================================= */}
      {activeTab === 'tours' && (
        <div className="space-y-6">
          {/* Header & Create Tour Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0E1F33] p-6 rounded-2xl border border-white/10 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C] mb-1">
                <Mountain className="w-3.5 h-3.5 text-[#38BDF8]" />
                Expedition Catalog Management
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Caucasus Route Inventory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure ascent pricing (RUB &amp; USD), team capacities, departure windows, and media
              </p>
            </div>

            <button
              onClick={() => {
                setIsCreatingTour(true);
                setEditingTour({
                  id: Date.now(),
                  name: 'New Caucasus Summit Route',
                  category_name: 'High-Altitude Mountaineering',
                  category: 'climbing',
                  difficulty: 'Demanding',
                  altitude: '5,000 m',
                  duration: '8 days',
                  price: 65000,
                  priceRub: 65000,
                  priceUsd: 700,
                  capacity: 12,
                  is_published: true,
                  is_featured: false,
                  status: 'Active',
                  start_date: '2026-07-01',
                  end_date: '2026-09-01',
                  cover_image: '/tours/elbrus-south.webp',
                  gallery: [],
                  description: 'Comprehensive guided ascent in the North Caucasus.',
                  schedule2026: [
                    { dates: '15 Jul — 22 Jul 2026', spotsLeft: 10, capacity: 12, status: 'available' },
                  ],
                });
              }}
              className="px-6 py-3 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-950/40 border border-orange-400/20"
            >
              <Plus size={16} />
              <span>Create Expedition</span>
            </button>
          </div>

          {/* Expeditions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            {toursLoading && (
              <div className="col-span-full py-16 text-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#C2410C]" />
                <span>Loading route inventory...</span>
              </div>
            )}

            {!toursLoading &&
              tours.map((t) => {
                const priceUsd = t.priceUsd || Math.round(t.price / (settings.usdExchangeRate || 92.5));
                const schedules = t.schedule2026 || [];

                return (
                  <article
                    key={t.id}
                    className="bg-[#0E1F33] border border-white/10 rounded-2xl overflow-hidden hover:border-[#C2410C]/50 transition-all duration-300 transform hover:-translate-y-1 shadow-xl flex flex-col h-full group"
                  >
                    <div>
                      {/* Image Container with aspect-[16/10] */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                        <img
                          src={t.cover_image || t.coverImage || '/tours/elbrus-south.webp'}
                          alt={t.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1F33] via-transparent to-black/30" />

                        {/* Badges on Image */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            {t.altitude && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#091422]/85 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-white">
                                <Mountain className="w-3.5 h-3.5 text-[#38BDF8]" />
                                {t.altitude}
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold backdrop-blur-md ${difficultyBadge(t.difficulty)}`}>
                              {t.difficulty || 'Demanding'}
                            </span>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                              t.status === 'Sold Out'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : t.is_published
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-700/50 text-slate-400 border-white/10'
                            }`}
                          >
                            {t.status || (t.is_published ? 'Active' : 'Draft')}
                          </span>
                        </div>

                        {/* Price Pill */}
                        <div className="absolute bottom-3 right-3 bg-[#091422]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-right">
                          <div className="text-sm font-extrabold text-white">
                            ₽{t.price?.toLocaleString('ru-RU')}
                          </div>
                          <div className="text-[10px] text-slate-400 font-semibold">
                            ~${priceUsd} USD
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-3">
                        <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                          <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C]">
                            {t.category_name || 'Expedition'}
                          </span>
                          {t.duration && (
                            <span className="inline-flex items-center gap-1 text-slate-300 text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {t.duration}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-extrabold text-white leading-snug">
                          {t.name}
                        </h3>

                        {/* Departure Schedule Snippet */}
                        <div className="pt-2 border-t border-white/5 space-y-1.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                            <span>2026 Scheduled Slots</span>
                            <span className="text-[#C2410C]">
                              {schedules.length} window{schedules.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {schedules.slice(0, 2).map((s, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-[11px] bg-[#091422]/60 px-3 py-1 rounded-lg border border-white/5"
                              >
                                <span className="text-slate-300 truncate">{s.dates}</span>
                                <span
                                  className={`font-bold shrink-0 ${
                                    s.spotsLeft === 0
                                      ? 'text-rose-400'
                                      : s.spotsLeft <= 3
                                      ? 'text-amber-400'
                                      : 'text-emerald-400'
                                  }`}
                                >
                                  {s.spotsLeft === 0
                                    ? 'SOLD OUT'
                                    : `${s.spotsLeft}/${s.capacity} spots`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-5 pt-0 border-t border-white/5 mt-3">
                      <button
                        onClick={() => {
                          setIsCreatingTour(false);
                          setEditingTour({ ...t });
                        }}
                        className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-[#C2410C] text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/10 cursor-pointer shadow-md"
                      >
                        <Edit size={13} />
                        <span>Edit Route &amp; Media</span>
                      </button>
                    </div>
                  </article>
                );
              })}
          </div>

          {/* Edit / Create Expedition Modal */}
          {editingTour && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0E1F33] border border-white/10 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 sticky top-0 bg-[#0E1F33] z-20">
                  <div>
                    <h3 className="font-extrabold text-xl text-white tracking-tight">
                      {isCreatingTour ? 'Create New Expedition Route' : 'Edit Expedition Parameters'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Configure high-altitude ascent rates, capacity limits, scheduled departures and WebP media
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingTour(null);
                      setIsCreatingTour(false);
                    }}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveTour} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Expedition Route Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editingTour.name}
                        onChange={(e) => setEditingTour({ ...editingTour, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                        <input
                          type="text"
                          value={editingTour.category_name || ''}
                          onChange={(e) =>
                            setEditingTour({ ...editingTour, category_name: e.target.value })
                          }
                          placeholder="Mountaineering / Ski Tour"
                          className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Max Summit Altitude</label>
                        <input
                          type="text"
                          value={editingTour.altitude || ''}
                          onChange={(e) => setEditingTour({ ...editingTour, altitude: e.target.value })}
                          placeholder="5,642 m"
                          className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Duration</label>
                        <input
                          type="text"
                          value={editingTour.duration || ''}
                          onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })}
                          placeholder="8 days / 7 nights"
                          className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Price in RUB (₽)
                        </label>
                        <input
                          type="number"
                          required
                          value={editingTour.price}
                          onChange={(e) =>
                            setEditingTour({
                              ...editingTour,
                              price: Number(e.target.value),
                              priceRub: Number(e.target.value),
                              priceUsd: Math.round(
                                Number(e.target.value) / (settings.usdExchangeRate || 92.5)
                              ),
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Max Climbers per Group
                        </label>
                        <input
                          type="number"
                          value={editingTour.capacity || ''}
                          onChange={(e) =>
                            setEditingTour({ ...editingTour, capacity: Number(e.target.value) })
                          }
                          placeholder="12"
                          className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Route Status
                        </label>
                        <select
                          value={editingTour.status || (editingTour.is_published ? 'Active' : 'Draft')}
                          onChange={(e) =>
                            setEditingTour({
                              ...editingTour,
                              status: e.target.value as any,
                              is_published: e.target.value !== 'Draft',
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C] cursor-pointer"
                        >
                          <option value="Active">Active (Accepting Bookings)</option>
                          <option value="Sold Out">Sold Out</option>
                          <option value="Draft">Draft (Unpublished)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* DEPARTURE DATES MANAGER */}
                  <div className="p-5 rounded-xl bg-[#091422] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                          <Calendar size={14} className="text-[#C2410C]" />
                          <span>Departure Dates &amp; Seats Counter</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Configure scheduled group windows and track real-time spots remaining
                        </div>
                      </div>
                    </div>

                    {/* Existing Date Slots */}
                    <div className="space-y-2">
                      {editingTour.schedule2026 && editingTour.schedule2026.length > 0 ? (
                        editingTour.schedule2026.map((slot, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between p-3 rounded-xl bg-[#0E1F33] border border-white/5 text-xs gap-3"
                          >
                            <span className="font-bold text-white">{slot.dates}</span>
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  slot.spotsLeft === 0
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : slot.spotsLeft <= 3
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {slot.spotsLeft === 0
                                  ? 'Sold Out'
                                  : `${slot.spotsLeft}/${slot.capacity} spots`}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleRemoveDateSlot(sIdx)}
                                className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-500 py-2">
                          No departure dates configured.
                        </div>
                      )}
                    </div>

                    {/* Add New Date Slot */}
                    <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={newDateInput}
                        onChange={(e) => setNewDateInput(e.target.value)}
                        placeholder="e.g. 15 Jul — 22 Jul 2026"
                        className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#0E1F33] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          title="Spots Left"
                          value={newDateSpots}
                          onChange={(e) => setNewDateSpots(Number(e.target.value))}
                          className="w-20 px-3 py-2 rounded-xl text-xs bg-[#0E1F33] border border-white/10 text-white focus:outline-none text-center"
                        />
                        <span className="text-xs text-slate-400">/</span>
                        <input
                          type="number"
                          title="Total Capacity"
                          value={newDateCapacity}
                          onChange={(e) => setNewDateCapacity(Number(e.target.value))}
                          className="w-20 px-3 py-2 rounded-xl text-xs bg-[#0E1F33] border border-white/10 text-white focus:outline-none text-center"
                        />
                        <button
                          type="button"
                          onClick={handleAddDateSlot}
                          className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-[#C2410C] text-white text-xs font-bold transition-colors shrink-0 border border-white/10"
                        >
                          Add Slot
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* INTEGRATED TOUR MEDIA MANAGER */}
                  <div className="p-5 rounded-xl bg-[#091422] border border-white/10 space-y-3">
                    <TourMediaManager
                      coverImage={editingTour.cover_image || editingTour.coverImage || ''}
                      gallery={editingTour.gallery || []}
                      onChange={({ coverImage, gallery }) => {
                        setEditingTour({
                          ...editingTour,
                          cover_image: coverImage,
                          coverImage,
                          gallery,
                        });
                      }}
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingTour.is_published}
                        onChange={(e) =>
                          setEditingTour({ ...editingTour, is_published: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#C2410C]"
                      />
                      <span className="text-xs font-bold text-slate-200">
                        Published on Public Site
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingTour.is_featured}
                        onChange={(e) =>
                          setEditingTour({ ...editingTour, is_featured: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#C2410C]"
                      />
                      <span className="text-xs font-bold text-slate-200">
                        Featured on Hero Showcase
                      </span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTour(null);
                        setIsCreatingTour(false);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer border border-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-orange-950/40 border border-orange-400/20 cursor-pointer"
                    >
                      {isCreatingTour ? 'Create Expedition' : 'Save Parameters'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ADVANCED GLOBAL SETTINGS (More Flexible Site Management)           */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="max-w-5xl space-y-6">
          <form
            onSubmit={handleSaveSettings}
            className="space-y-6"
          >
            {/* Header Box */}
            <div className="bg-[#0E1F33] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C] mb-1">
                  <Settings className="w-3.5 h-3.5 text-[#38BDF8]" />
                  Site-Wide Command Parameters
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Flexible Website Controls
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dynamic headers, section display toggles, commercial deposit terms, and rescue telemetry
                </p>
              </div>

              <button
                type="submit"
                disabled={settingsSaving}
                className="px-6 py-3 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-orange-950/40 border border-orange-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {settingsSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{settingsSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>

            {/* SECTION A: HERO & PROMOTIONAL BRANDING */}
            <div className="bg-[#0E1F33] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-3">
                <Layout size={15} className="text-[#C2410C]" />
                <span>1. Hero Screen &amp; Promotional Copy</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Homepage Authority Headline (H1)
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    placeholder="Raw Caucasus. Untamed Peaks."
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Hero Subtitle &amp; Mission Statement
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    placeholder="Backcountry ski touring, high-altitude summits..."
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Header Micro-Badge Text
                    </label>
                    <input
                      type="text"
                      value={settings.promoBadgeText}
                      onChange={(e) => setSettings({ ...settings, promoBadgeText: e.target.value })}
                      placeholder="CENTRAL CAUCASUS • 20 YEARS OF EXPEDITIONS"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Season Operational Status
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.seasonStatus}
                      onChange={(e) => setSettings({ ...settings, seasonStatus: e.target.value })}
                      placeholder="Active — Booking Summer & Autumn 2026 Expeditions"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                    />
                  </div>
                </div>

                {/* Announcement Bar */}
                <div className="p-4 rounded-xl bg-[#091422] border border-white/10 space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-2">
                      <Megaphone size={14} className="text-[#C2410C]" />
                      <span>Urgent Header Announcement Bar</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={settings.announcementActive}
                        onChange={(e) =>
                          setSettings({ ...settings, announcementActive: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#C2410C]"
                      />
                      <span className="text-xs font-bold text-slate-300">Display Live</span>
                    </label>
                  </div>

                  <textarea
                    rows={2}
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    placeholder="Enter urgent notification text..."
                    className="w-full px-4 py-2 rounded-xl text-xs bg-[#0E1F33] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: SECTION VISIBILITY TOGGLES */}
            <div className="bg-[#0E1F33] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-3">
                <Layers size={15} className="text-[#38BDF8]" />
                <span>2. Homepage Section Layout &amp; Visibility</span>
              </div>
              <p className="text-xs text-slate-400">
                Instantly turn sections on or off without code deployments.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                {[
                  { key: 'showReviews', label: 'Client Reviews & Testimonials', desc: 'Climber reviews & ratings' },
                  { key: 'showGearRental', label: 'Alpine Gear Rental Checklist', desc: 'Equipment catalog & pricing' },
                  { key: 'showMap', label: 'Interactive Caucasus Waypoints Map', desc: 'Leaflet dark map with 5 camps' },
                  { key: 'showAcclimatization', label: 'Acclimatization Elevation Chart', desc: 'Barrels to summit profile' },
                  { key: 'showCompare', label: 'Route Comparison Bar', desc: 'Side-by-side tour comparison' },
                ].map((item) => {
                  const val = (settings as any)[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() => setSettings({ ...settings, [item.key]: !val })}
                      className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                        val
                          ? 'bg-[#091422] border-emerald-500/40 shadow-sm'
                          : 'bg-[#091422]/50 border-white/5 opacity-60'
                      }`}
                    >
                      <div className="pr-2">
                        <div className="text-xs font-bold text-white">{item.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                          val
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'bg-white/5 border-white/10 text-transparent'
                        }`}
                      >
                        <Check size={14} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION C: COMMERCIAL & BOOKING POLICIES */}
            <div className="bg-[#0E1F33] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-3">
                <DollarSign size={15} className="text-[#FB923C]" />
                <span>3. Financial, Currency &amp; Booking Terms</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    USD / RUB Exchange Rate
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={settings.usdExchangeRate}
                    onChange={(e) =>
                      setSettings({ ...settings, usdExchangeRate: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Converts prices across all tours (~${Math.round(55000 / settings.usdExchangeRate)})
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Booking Deposit Required (%)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    required
                    value={settings.prepaymentPercent}
                    onChange={(e) =>
                      setSettings({ ...settings, prepaymentPercent: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Standard booking reservation fee
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Free Cancellation Window (Days)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    required
                    value={settings.freeCancellationDays}
                    onChange={(e) =>
                      setSettings({ ...settings, freeCancellationDays: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    100% refund cutoff before start date
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Payment Details &amp; Settlement Note
                </label>
                <input
                  type="text"
                  value={settings.paymentDetailsNote}
                  onChange={(e) => setSettings({ ...settings, paymentDetailsNote: e.target.value })}
                  placeholder="Official tour operator contract with fiscal receipts..."
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                />
              </div>
            </div>

            {/* SECTION D: RESCUE & EMERGENCY TELEMETRY */}
            <div className="bg-[#0E1F33] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-3">
                <AlertCircle size={15} className="text-amber-400" />
                <span>4. High-Altitude Rescue &amp; Official Dispatch Channels</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Emergency Rescue Hotline
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.rescuePhone}
                    onChange={(e) => setSettings({ ...settings, rescuePhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Alpine Rescue Post Details
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.emergencyContact}
                    onChange={(e) => setSettings({ ...settings, emergencyContact: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Official WhatsApp Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Direct WhatsApp Deep-Link
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.whatsappLink}
                    onChange={(e) => setSettings({ ...settings, whatsappLink: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Official Telegram Channel / Bot
                  </label>
                  <input
                    type="text"
                    value={settings.telegramChannel}
                    onChange={(e) => setSettings({ ...settings, telegramChannel: e.target.value })}
                    placeholder="https://t.me/kavkazskitur"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Official Inquiries Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="info@kavkazskitur.com"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Nalchik HQ Office Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Nalchik Headquarters Address
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION E: SEO & WEB ANALYTICS */}
            <div className="bg-[#0E1F33] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-extrabold text-white uppercase tracking-wider border-b border-white/10 pb-3">
                <Search size={15} className="text-[#38BDF8]" />
                <span>5. SEO &amp; Web Analytics Telemetry</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Yandex Metrika Counter ID
                  </label>
                  <input
                    type="text"
                    value={settings.yandexMetrikaId}
                    onChange={(e) => setSettings({ ...settings, yandexMetrikaId: e.target.value })}
                    placeholder="98451230"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Google Analytics (GA4) Tag ID
                  </label>
                  <input
                    type="text"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                    placeholder="G-KVZSKT2026"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Global SEO Title
                  </label>
                  <input
                    type="text"
                    value={settings.metaTitle}
                    onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                    placeholder="KavKazSkiTur | Mountain Expeditions & Ski Touring in the Caucasus"
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Global Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={settings.metaDescription}
                    onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                    placeholder="Official tour operator for Mount Elbrus summits..."
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Floating Notification & Save Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0E1F33] p-5 rounded-2xl border border-white/10 shadow-xl">
              {settingsSavedSuccess ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  <span>All site parameters &amp; visibility toggles updated live!</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Settings are written to disk and synced across all pages immediately upon saving.
                </span>
              )}

              <button
                type="submit"
                disabled={settingsSaving}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-orange-950/40 border border-orange-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {settingsSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{settingsSaving ? 'Saving...' : 'Save All Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: TEAM & ACCESS (Multi-Admin User Management)                        */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6 max-w-6xl">
          {/* Header & Provision Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0E1F33] p-6 rounded-2xl border border-white/10 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-[#C2410C] mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                Role-Based Operator Access Control
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Team Accounts &amp; Access Levels
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Provision and audit administrative privileges: Superadmins, Booking Managers, and Route Editors
              </p>
            </div>

            <button
              onClick={() => {
                setIsCreatingUser(true);
                setEditingUser({
                  username: '',
                  name: '',
                  email: '',
                  role: 'manager',
                  is_active: true,
                  password: '',
                });
                setUserFormError('');
                setUserModalOpen(true);
              }}
              className="px-6 py-3 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-950/40 border border-orange-400/20"
            >
              <UserPlus size={16} />
              <span>Add Administrator</span>
            </button>
          </div>

          {/* Role Explanatory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0E1F33] p-5 rounded-2xl border border-orange-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
                  Superadmin
                </span>
                <Lock size={14} className="text-[#C2410C]" />
              </div>
              <h4 className="text-xs font-bold text-white">Full System Authority</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Complete access to all operation modules, provision/delete user accounts, modify financial rates and site parameters.
              </p>
            </div>

            <div className="bg-[#0E1F33] p-5 rounded-2xl border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Manager
                </span>
                <MessageSquare size={14} className="text-emerald-400" />
              </div>
              <h4 className="text-xs font-bold text-white">Inquiries &amp; WhatsApp CRM</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Manages client reservations, status pipelines, internal dispatch notes, and launches WhatsApp briefings.
              </p>
            </div>

            <div className="bg-[#0E1F33] p-5 rounded-2xl border border-sky-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  Editor
                </span>
                <Mountain size={14} className="text-[#38BDF8]" />
              </div>
              <h4 className="text-xs font-bold text-white">Route Catalog &amp; Media</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Creates &amp; edits Caucasus route descriptions, scheduled departure seats, and uploads WebP photography.
              </p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[#0E1F33] rounded-2xl border border-white/10 overflow-hidden shadow-2xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#091422]/90 border-b border-white/10 text-[10px] uppercase tracking-[0.22em] font-bold text-slate-400">
                <tr>
                  <th className="px-5 py-4">User &amp; Identity</th>
                  <th className="px-5 py-4">Email Address</th>
                  <th className="px-5 py-4">Access Level</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Provisioned</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersLoading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C2410C]" />
                      <span>Loading team accounts...</span>
                    </td>
                  </tr>
                )}

                {!usersLoading && adminUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      No administrator accounts found.
                    </td>
                  </tr>
                )}

                {!usersLoading &&
                  adminUsers.map((u) => {
                    const isSelf = currentAdminUser && (currentAdminUser.id === u.id || currentAdminUser.username === u.username);
                    return (
                      <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center font-black text-xs text-white">
                              {u.name ? u.name.charAt(0).toUpperCase() : u.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm flex items-center gap-2">
                                <span>{u.name || u.username}</span>
                                {isSelf && (
                                  <span className="text-[9px] font-bold bg-[#C2410C]/20 text-[#FB923C] border border-[#C2410C]/40 px-1.5 py-0.2 rounded">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                @{u.username}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {u.email || <span className="text-slate-500 italic">Not set</span>}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                              u.role === 'superadmin'
                                ? 'bg-orange-500/15 text-orange-300 border-orange-500/30'
                                : u.role === 'manager'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              u.is_active
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                              }`}
                            />
                            <span>{u.is_active ? 'Active' : 'Suspended'}</span>
                          </span>
                        </td>

                        <td className="px-5 py-4 text-slate-400 text-[11px]">
                          {new Date(u.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsCreatingUser(false);
                                setEditingUser({
                                  id: u.id,
                                  username: u.username,
                                  name: u.name,
                                  email: u.email,
                                  role: u.role,
                                  is_active: u.is_active,
                                  password: '',
                                });
                                setUserFormError('');
                                setUserModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-slate-200 transition-colors"
                              title="Edit user parameters"
                            >
                              <Edit size={14} />
                            </button>

                            <button
                              type="button"
                              disabled={Boolean(isSelf)}
                              onClick={() => setDeleteConfirmUser(u)}
                              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title={isSelf ? 'Cannot delete yourself' : 'Remove user'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* User Add / Edit Modal */}
          {userModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0E1F33] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-extrabold text-xl text-white tracking-tight">
                      {isCreatingUser ? 'Provision Administrator' : `Edit Account: @${editingUser.username}`}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Assign operational privileges and security credentials
                    </p>
                  </div>
                  <button
                    onClick={() => setUserModalOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {userFormError && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <ShieldAlert size={15} className="shrink-0" />
                    <span>{userFormError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveUser} className="space-y-4">
                  {/* Username (Locked if editing) */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Login Username
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!isCreatingUser}
                      value={editingUser.username || ''}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, username: e.target.value.toLowerCase() })
                      }
                      placeholder="e.g. elbrus_ops"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C2410C] disabled:opacity-50 font-mono"
                    />
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Full Name / Call Sign
                    </label>
                    <input
                      type="text"
                      value={editingUser.name || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      placeholder="e.g. Full Name"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Notification Email
                    </label>
                    <input
                      type="email"
                      value={editingUser.email || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      placeholder="operator@kavkazskitur.com"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                    />
                  </div>

                  {/* Role Select */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Security Role Level
                    </label>
                    <select
                      value={editingUser.role || 'manager'}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, role: e.target.value as any })
                      }
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C] cursor-pointer"
                    >
                      <option value="superadmin">Superadmin (All privileges &amp; site settings)</option>
                      <option value="manager">Manager (CRM, WhatsApp, bookings, notes)</option>
                      <option value="editor">Editor (Expedition routes, dates, WebP media)</option>
                    </select>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {isCreatingUser ? 'Initial Password' : 'Reset Password (leave blank to keep current)'}
                    </label>
                    <input
                      type="password"
                      required={isCreatingUser}
                      value={editingUser.password || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                      placeholder={isCreatingUser ? 'Minimum 6 characters' : 'Enter new password...'}
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-[#091422] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                    />
                  </div>

                  {/* Active Toggle */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={editingUser.is_active ?? true}
                        onChange={(e) =>
                          setEditingUser({ ...editingUser, is_active: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-[#C2410C]"
                      />
                      <span className="text-xs font-bold text-slate-200">
                        Account is Active &amp; Allowed to Sign In
                      </span>
                    </label>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setUserModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer border border-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={userFormSaving}
                      className="px-6 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-orange-950/40 border border-orange-400/20 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {userFormSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      <span>{isCreatingUser ? 'Provision User' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete User Confirmation Modal */}
          {deleteConfirmUser && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0E1F33] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3 text-rose-400">
                  <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30">
                    <AlertCircle size={22} />
                  </div>
                  <h3 className="font-extrabold text-lg text-white">Delete Administrator?</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Are you sure you want to permanently revoke credentials for{' '}
                  <strong className="text-white">@{deleteConfirmUser.username}</strong> ({deleteConfirmUser.name})? This action is immediate.
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmUser(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(deleteConfirmUser.id)}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-rose-950/40"
                  >
                    Confirm Deletion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

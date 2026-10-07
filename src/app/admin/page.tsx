'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  CalendarDays, 
  DollarSign, 
  Settings, 
  Users,
  ExternalLink, 
  Search, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp, 
  Download, 
  Filter,
  Plus,
  Trash2,
  Eye,
  Edit,
  X,
  Save,
  Phone,
  ShieldCheck,
  Globe,
  Compass,
  Loader2,
  Lock,
  Mail,
  FileSpreadsheet,
  Mountain,
  ChevronRight,
  Menu,
  Sparkles,
  MapPin,
  Check,
  Calendar,
  Layers,
  Activity,
  Sliders,
  LogOut
} from 'lucide-react';
import Logo from '@/components/Logo';
import { TOURS_DATA } from '@/data/toursData';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import TourMediaManager from '@/components/admin/TourMediaManager';

// Types
export interface BookingRow {
  id: string | number;
  name: string;
  phone: string;
  email?: string | null;
  country?: string;
  flag?: string;
  tour_name?: string | null;
  route?: string | null;
  departure_date?: string | null;
  dates?: string | null;
  people_count?: number;
  groupSize?: number;
  comment?: string | null;
  gear_requests?: string | null;
  transfer?: string | null;
  manager_notes?: string | null;
  status: 'new' | 'whatsapp_sent' | 'deposit_paid' | 'confirmed' | 'cancelled' | string;
  amountUsd?: number;
  amountRub?: number;
  created_at: string;
  timeAgo?: string;
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
  title?: string;
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
  status: 'Active' | 'Sold Out' | 'Draft' | string;
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
  heroTitle: string;
  heroSubtitle: string;
  promoBadgeText: string;
  seasonStatus: string;
  announcementText: string;
  announcementActive: boolean;
  usdExchangeRate: number;
  prepaymentPercent: number;
  freeCancellationDays: number;
  paymentDetailsNote: string;
  showReviews: boolean;
  showGearRental: boolean;
  showMap: boolean;
  showAcclimatization: boolean;
  showCompare: boolean;
  phone: string;
  whatsapp: string;
  whatsappLink: string;
  telegramChannel: string;
  email: string;
  address: string;
  workingHours: string;
  rescuePhone: string;
  emergencyContact: string;
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

const INITIAL_INQUIRIES: BookingRow[] = [];

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; iconColor: string }> = {
  new: { label: 'New Inquiry', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20', iconColor: 'text-amber-400' },
  whatsapp_sent: { label: 'WhatsApp Sent', badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20', iconColor: 'text-sky-400' },
  deposit_paid: { label: 'Deposit Paid', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', iconColor: 'text-emerald-400' },
  confirmed: { label: 'Confirmed', badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', iconColor: 'text-emerald-300' },
  cancelled: { label: 'Cancelled', badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20', iconColor: 'text-rose-400' },
};

function difficultyBadge(diff?: string) {
  switch (diff) {
    case 'Moderate':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Extreme':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'Demanding':
    default:
      return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
  }
}

function AdminPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'tours' | 'settings' | 'users'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync tab from URL query if present
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'crm', 'tours', 'settings', 'users'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  // Currency Toggle
  const [isRub, setIsRub] = useState(false);

  // 1. Leads / CRM State
  const [inquiries, setInquiries] = useState<BookingRow[]>(INITIAL_INQUIRIES);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<BookingRow | null>(null);
  const [leadNotesSaving, setLeadNotesSaving] = useState(false);

  // 2. Tours Catalog State
  const [tours, setTours] = useState<TourItem[]>([]);
  const [toursLoading, setToursLoading] = useState(false);
  const [editingTour, setEditingTour] = useState<TourItem | null>(null);
  const [isCreatingTour, setIsCreatingTour] = useState(false);
  const [newDateInput, setNewDateInput] = useState('');
  const [newDateCapacity, setNewDateCapacity] = useState(12);
  const [newDateSpots, setNewDateSpots] = useState(12);

  // 3. Site Settings State
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
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // 4. Users State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    name: '',
    email: '',
    role: 'manager' as 'superadmin' | 'manager' | 'editor',
    password: '',
  });

  // Load Initial Data from APIs
  useEffect(() => {
    // Fetch Leads
    async function fetchLeads() {
      setLeadsLoading(true);
      try {
        const res = await fetch('/api/admin/leads');
        if (res.ok) {
          const data = await res.json();
          const rawList = Array.isArray(data.bookings) ? data.bookings : (Array.isArray(data.leads) ? data.leads : []);
          const mapped = rawList.map((b: any) => ({
            id: b.id || `WW-${Math.floor(1000 + Math.random() * 9000)}`,
            name: b.name || 'Climber',
            phone: b.phone || '',
            email: b.email || null,
            country: b.country || 'International',
            flag: b.flag || '🏔️',
            route: b.tour_name || b.tourName || b.route || 'Caucasus High Alpine',
            tour_name: b.tour_name || b.tourName || b.route,
            dates: b.departure_date || b.dates || 'Summer 2026',
            people_count: b.people_count || 1,
            comment: b.comment || b.gear_requests || '',
            manager_notes: b.manager_notes || '',
            status: b.status || 'new',
            amountUsd: b.amountUsd || 0,
            amountRub: b.amountRub || 0,
            created_at: b.created_at || b.createdAt || new Date().toISOString(),
            timeAgo: 'Recently'
          }));
          setInquiries(mapped);
        } else {
          setInquiries([]);
        }
      } catch (err) {
        console.warn('Leads fetch error, using empty state:', err);
        setInquiries([]);
      } finally {
        setLeadsLoading(false);
      }
    }

    // Fetch Tours
    async function fetchTours() {
      setToursLoading(true);
      try {
        const res = await fetch('/api/admin/tours');
        if (res.ok) {
          const data = await res.json();
          if (data.tours && Array.isArray(data.tours) && data.tours.length > 0) {
            setTours(data.tours);
            return;
          }
        }
      } catch (err) {
        console.warn('Falling back to TOURS_DATA:', err);
      }
      // Fallback
      const defaultTours: TourItem[] = TOURS_DATA.map((t, idx) => ({
        id: idx + 1,
        slug: t.slug,
        name: t.title,
        title: t.title,
        category_name: t.categoryLabel || 'Expedition',
        category: t.category,
        difficulty: t.difficulty || 'Demanding',
        altitude: t.altitude || '5,642 m',
        duration: t.duration || `${t.durationDays} days`,
        price: t.priceRub || 55000,
        priceRub: t.priceRub || 55000,
        priceUsd: t.priceUsd || Math.round((t.priceRub || 55000) / 92.5),
        capacity: 12,
        is_published: true,
        is_featured: idx < 3,
        status: idx === 3 ? 'Sold Out' : 'Active',
        cover_image: t.coverImage || t.image,
        gallery: t.gallery || [],
        description: t.description || '',
        schedule2026: t.schedule2026?.map((s, sIdx) => ({
          dates: s.dates,
          spotsLeft: sIdx === 0 ? 3 : sIdx === 1 ? 0 : 8,
          capacity: 12,
          status: (sIdx === 1 ? 'sold_out' : sIdx === 0 ? 'few_spots' : 'available') as any,
        })) || [
          { dates: '12 Jul — 19 Jul 2026', spotsLeft: 3, capacity: 12, status: 'few_spots' },
          { dates: '02 Aug — 09 Aug 2026', spotsLeft: 0, capacity: 12, status: 'sold_out' },
          { dates: '16 Aug — 23 Aug 2026', spotsLeft: 8, capacity: 12, status: 'available' },
        ],
      }));
      setTours(defaultTours);
      setToursLoading(false);
    }

    // Fetch Settings
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setSettings(prev => ({ ...prev, ...data.settings }));
          }
        }
      } catch (err) {
        console.warn('Default settings used:', err);
      }
    }

    // Fetch Users
    async function fetchUsers() {
      setUsersLoading(true);
      try {
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          const data = await res.json();
          if (data.users && Array.isArray(data.users)) {
            setAdminUsers(data.users);
          }
        }
      } catch (err) {
        console.warn('Users API fallback:', err);
      } finally {
        setUsersLoading(false);
      }
    }

    async function checkAuthAndInit() {
      try {
        const authRes = await fetch('/api/admin/auth');
        if (!authRes.ok) {
          router.push('/admin/login');
          return;
        }
      } catch {
        router.push('/admin/login');
        return;
      }
      fetchLeads();
      fetchTours();
      fetchSettings();
      fetchUsers();
    }

    checkAuthAndInit();
  }, [router]);

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        inq.name.toLowerCase().includes(q) ||
        (inq.route && inq.route.toLowerCase().includes(q)) ||
        (inq.country && inq.country.toLowerCase().includes(q)) ||
        String(inq.id).toLowerCase().includes(q) ||
        (inq.phone && inq.phone.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [inquiries, searchQuery, statusFilter]);

  // Financial Metrics
  const totalInflowRub = useMemo(() => {
    return inquiries
      .filter(i => i.status === 'deposit_paid' || i.status === 'confirmed')
      .reduce((acc, curr) => acc + (curr.amountRub || (curr.amountUsd ? curr.amountUsd * 92.5 : 0)), 0);
  }, [inquiries]);

  const totalInflowUsd = useMemo(() => {
    return inquiries
      .filter(i => i.status === 'deposit_paid' || i.status === 'confirmed')
      .reduce((acc, curr) => acc + (curr.amountUsd || (curr.amountRub ? Math.round(curr.amountRub / 92.5) : 0)), 0);
  }, [inquiries]);

  const formatPrice = (amountUsd: number, amountRub?: number) => {
    if (isRub) {
      const rub = amountRub || Math.round(amountUsd * (settings.usdExchangeRate || 92.5));
      return `₽${rub.toLocaleString('ru-RU')}`;
    }
    return `$${amountUsd.toLocaleString('en-US')}`;
  };

  // Status Change handler
  const handleStatusChange = async (leadId: string | number, newStatus: string) => {
    setInquiries(prev => prev.map(inq => inq.id === leadId ? { ...inq, status: newStatus as any } : inq));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus as any } : null);
    }
    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'booking', id: leadId, status: newStatus })
      });
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  // Manager Notes Save handler
  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setLeadNotesSaving(true);
    try {
      await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'booking', 
          id: selectedLead.id, 
          manager_notes: selectedLead.manager_notes 
        })
      });
      setInquiries(prev => prev.map(inq => inq.id === selectedLead.id ? selectedLead : inq));
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setLeadNotesSaving(false);
    }
  };

  // WhatsApp Launcher
  const openWhatsAppChat = (lead: BookingRow) => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const clientName = lead.name.split(' ')[0] || 'Climber';
    const route = lead.route || lead.tour_name || 'Caucasus Expedition 2026';
    const dates = lead.dates || lead.departure_date || '2026';
    
    const message = `Hello ${clientName}! This is Marat from KavKazSkiTur Headquarters.\n\n` +
      `We received your inquiry for the "${route}" expedition (Dates: ${dates}).\n` +
      `I am reaching out to provide your pre-climb briefing, confirm gear rental sizes, and answer any logistics questions.\n\n` +
      `How can we best assist your summit preparation?`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Inquiry ID', 'Client Name', 'Country', 'Phone', 'Route', 'Dates', 'Climbers', 'Status', 'Amount USD', 'Created At'];
    const rows = filteredInquiries.map(i => [
      i.id,
      `"${i.name}"`,
      `"${i.country || ''}"`,
      `"${i.phone}"`,
      `"${i.route || i.tour_name || ''}"`,
      `"${i.dates || i.departure_date || ''}"`,
      i.people_count || 1,
      i.status,
      i.amountUsd || '',
      `"${i.created_at}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KavKazSkiTur_Manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Tour handler
  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;

    const updatedTour = {
      ...editingTour,
      priceRub: Number(editingTour.price),
      priceUsd: editingTour.priceUsd || Math.round(Number(editingTour.price) / (settings.usdExchangeRate || 92.5))
    };

    try {
      const res = await fetch('/api/admin/tours', {
        method: isCreatingTour ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTour)
      });
      if (res.ok) {
        if (isCreatingTour) {
          setTours([updatedTour, ...tours]);
        } else {
          setTours(tours.map(t => t.id === updatedTour.id ? updatedTour : t));
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
      status: Number(newDateSpots) === 0 ? 'sold_out' : Number(newDateSpots) <= 3 ? 'few_spots' : 'available'
    };
    setEditingTour({
      ...editingTour,
      schedule2026: [...currentSchedule, newSlot]
    });
    setNewDateInput('');
  };

  // Remove Date Slot
  const handleRemoveDateSlot = (idx: number) => {
    if (!editingTour) return;
    const currentSchedule = editingTour.schedule2026 || [];
    setEditingTour({
      ...editingTour,
      schedule2026: currentSchedule.filter((_, i) => i !== idx)
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
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSettingsSavedSuccess(true);
        setTimeout(() => setSettingsSavedSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSettingsSaving(false);
    }
  };

  // Save New Admin User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setAdminUsers([...adminUsers, data.user]);
        setUserModalOpen(false);
        setNewUser({ username: '', name: '', email: '', role: 'manager', password: '' });
      }
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  // Toggle user active status
  const handleToggleUserActive = async (userId: number, currentActive: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, is_active: !currentActive })
      });
      if (res.ok) {
        setAdminUsers(adminUsers.map(u => u.id === userId ? { ...u, is_active: !currentActive } : u));
      }
    } catch (err) {
      console.error('Error toggling user status:', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  const newLeadsCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col md:flex-row antialiased font-sans">
      
      {/* =========================================================================
          MOBILE TOP NAVBAR
      ========================================================================= */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0B101D] border-b border-white/[0.06] sticky top-0 z-40">
        <Logo variant="emblem" className="shrink-0" />
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] text-xs font-semibold text-slate-300 border border-white/[0.08]"
          >
            <Globe size={13} className="text-orange-400" />
            <span>Site</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06]"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B101D] border-b border-white/[0.08] p-4 space-y-2 z-40">
          <button
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'overview' ? 'bg-white/[0.08] text-white border border-white/10' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-orange-400" />
            <span>Overview &amp; Telemetry</span>
          </button>
          <button
            onClick={() => { setActiveTab('crm'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'crm' ? 'bg-white/[0.08] text-white border border-white/10' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>Inquiries &amp; CRM</span>
            {newLeadsCount > 0 && (
              <span className="ml-auto bg-orange-500/20 text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                {newLeadsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('tours'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'tours' ? 'bg-white/[0.08] text-white border border-white/10' : 'text-slate-400'
            }`}
          >
            <Mountain className="w-4 h-4 text-slate-400" />
            <span>Expedition Catalog &amp; 2026 Slots</span>
          </button>
          <button
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'settings' ? 'bg-white/[0.08] text-white border border-white/10' : 'text-slate-400'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Site Settings</span>
          </button>
          <button
            onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'users' ? 'bg-white/[0.08] text-white border border-white/10' : 'text-slate-400'
            }`}
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>Team &amp; Access</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          DESKTOP SIDEBAR (NO ORANGE 'K' - REPLACED WITH OFFICIAL LOGO)
      ========================================================================= */}
      <aside className="w-full md:w-64 bg-[#0B101D] border-r border-white/[0.06] p-5 hidden md:flex flex-col justify-between shrink-0">
        <div>
          {/* Official Vector Logo replacing orange K badge */}
          <div className="flex items-center gap-3 mb-8">
            <Logo variant="emblem" className="shrink-0" />
            <div>
              <div className="font-serif font-black text-sm tracking-wider text-white">
                KAVKAZ<span className="text-[#FF6A00]">SKITUR</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Ops Cockpit 2026</span>
              </div>
            </div>
          </div>

          {/* Navigation Links with Active States */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white/[0.08] text-white border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>Overview</span>
            </button>

            <button 
              onClick={() => setActiveTab('crm')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'crm'
                  ? 'bg-white/[0.08] text-white border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <MessageSquare className={`w-4 h-4 ${activeTab === 'crm' ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>Inquiries &amp; CRM</span>
              {newLeadsCount > 0 && (
                <span className="ml-auto bg-orange-500/20 text-orange-400 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  {newLeadsCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('tours')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'tours'
                  ? 'bg-white/[0.08] text-white border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <Mountain className={`w-4 h-4 ${activeTab === 'tours' ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>Expedition Catalog</span>
              <span className="ml-auto text-slate-500 font-mono text-[10px]">
                {tours.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white/[0.08] text-white border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>Site Settings</span>
            </button>

            <button 
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-white/[0.08] text-white border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === 'users' ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>Team &amp; Access</span>
            </button>
          </nav>
        </div>

        {/* Bottom Operator & Public Link */}
        <div className="pt-6 border-t border-white/[0.06] space-y-3">
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-xs font-semibold text-slate-300 transition group"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>View Live Site</span>
            </span>
            <ExternalLink size={12} className="text-slate-500 group-hover:text-slate-300" />
          </Link>

          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300">
                MA
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">Marat Aliev</div>
                <div className="text-[10px] text-slate-500 font-mono">Expedition Chief</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN OPERATIONS CONTENT VIEWPORT
      ========================================================================= */}
      <main className="flex-1 p-5 md:p-8 overflow-y-auto min-w-0">
        
        {/* Top Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              {activeTab === 'overview' && <span>Expedition Dispatch &amp; Operations</span>}
              {activeTab === 'crm' && <span>Inquiries &amp; Climber CRM Pipeline</span>}
              {activeTab === 'tours' && <span>Expedition Catalog &amp; Schedule 2026</span>}
              {activeTab === 'settings' && <span>Global Site &amp; Expedition Settings</span>}
              {activeTab === 'users' && <span>Team Credentials &amp; Access Controls</span>}
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Season 2026
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'overview' && 'Real-time telemetry of high-altitude operations, gross revenue, and route analytics.'}
              {activeTab === 'crm' && 'Live reservations manifest, WhatsApp consultation conduits, and deposit records.'}
              {activeTab === 'tours' && 'Route itineraries, difficulty tiers, season 2026 departure dates, and media assets.'}
              {activeTab === 'settings' && 'Hero texts, emergency rescue hotline, announcement ticker, and currency exchange rates.'}
              {activeTab === 'users' && 'Administrative operators, roles (Superadmin / Manager / Editor), and authentication.'}
            </p>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-3">
            {/* Currency Switcher */}
            <div className="bg-[#0B101D] border border-white/[0.08] p-1 rounded-xl flex items-center shadow-sm">
              <button
                onClick={() => setIsRub(false)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  !isRub ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                USD $
              </button>
              <button
                onClick={() => setIsRub(true)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  isRub ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                RUB ₽
              </button>
            </div>

            {/* Quick Action Button based on Tab */}
            {activeTab === 'crm' && (
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Manifest</span>
              </button>
            )}

            {activeTab === 'tours' && (
              <button 
                onClick={() => {
                  setEditingTour({
                    id: Date.now(),
                    name: '',
                    slug: '',
                    category: 'Elbrus',
                    category_name: 'Expedition',
                    difficulty: 'Demanding',
                    altitude: '5,642 m',
                    duration: '8 days',
                    price: 65000,
                    priceRub: 65000,
                    priceUsd: 700,
                    capacity: 12,
                    is_published: true,
                    is_featured: false,
                    status: 'Active',
                    cover_image: '/tours/elbrus-south.webp',
                    gallery: [],
                    description: '',
                    schedule2026: [
                      { dates: '12 Jul — 19 Jul 2026', spotsLeft: 10, capacity: 12, status: 'available' }
                    ]
                  });
                  setIsCreatingTour(true);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-orange-500/20"
              >
                <Plus size={14} />
                <span>New Expedition</span>
              </button>
            )}

            {activeTab === 'users' && (
              <button 
                onClick={() => setUserModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-orange-500/20"
              >
                <Plus size={14} />
                <span>Add Operator</span>
              </button>
            )}
          </div>
        </header>

        {/* =========================================================================
            TAB 1: OVERVIEW & ANALYTICS
        ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Bento KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* KPI 1 */}
              <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/[0.06] relative overflow-hidden shadow-sm">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                  <span>Total Booked Inflow</span>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {formatPrice(totalInflowUsd, totalInflowRub)}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>Real-time confirmed turnover</span>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/[0.06] shadow-sm">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                  <span>Active Inquiries</span>
                  <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {inquiries.length}
                </div>
                <div className="text-[11px] text-orange-400 flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3" />
                  <span>{newLeadsCount} awaiting response</span>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/[0.06] shadow-sm">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                  <span>Confirmed Climbers</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {inquiries.filter(i => i.status === 'confirmed' || i.status === 'deposit_paid').reduce((acc, curr) => acc + (curr.people_count || 1), 0)}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-2">
                  <span>{inquiries.filter(i => i.status === 'confirmed' || i.status === 'deposit_paid').length} groups registered</span>
                </div>
              </div>

              {/* KPI 4 */}
              <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/[0.06] shadow-sm">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                  <span>Conversion Rate</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {inquiries.length > 0
                    ? `${((inquiries.filter(i => i.status === 'confirmed' || i.status === 'deposit_paid').length / inquiries.length) * 100).toFixed(1)}%`
                    : '0.0%'}
                </div>
                <div className="text-[11px] text-indigo-400 flex items-center gap-1 mt-2">
                  <span>Direct WhatsApp conduit</span>
                </div>
              </div>
            </div>

            {/* Real-time Telemetry & Charts from AdminAnalytics */}
            <AdminAnalytics />
          </div>
        )}

        {/* =========================================================================
            TAB 2: INQUIRIES & CRM
        ========================================================================= */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            {/* Search & Status Filters */}
            <div className="p-4 rounded-2xl bg-[#0B101D] border border-white/[0.06] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search climber, route, phone or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {(['all', 'new', 'whatsapp_sent', 'deposit_paid', 'confirmed', 'cancelled'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition whitespace-nowrap cursor-pointer ${
                      statusFilter === st
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-white/[0.02] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st === 'all' ? `All (${inquiries.length})` : st.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="rounded-2xl bg-[#0B101D] border border-white/[0.06] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.01] text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Climber</th>
                      <th className="py-3 px-4">Expedition Route</th>
                      <th className="py-3 px-4">Dates</th>
                      <th className="py-3 px-4">Climbers</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Value</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {leadsLoading ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                          <span>Syncing dispatch pipeline...</span>
                        </td>
                      </tr>
                    ) : filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          No inquiries found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((inq) => {
                        const conf = STATUS_CONFIG[inq.status] || STATUS_CONFIG.new;
                        return (
                          <tr 
                            key={inq.id} 
                            onClick={() => setSelectedLead(inq)}
                            className="hover:bg-white/[0.02] transition cursor-pointer"
                          >
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white flex items-center gap-2">
                                <span>{inq.name}</span>
                                {inq.flag && <span className="text-xs">{inq.flag}</span>}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                                <span>{inq.phone}</span>
                                <span className="text-slate-600">&bull;</span>
                                <span>{inq.timeAgo || 'Recent'}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-medium text-slate-200 max-w-[200px] truncate">
                              {inq.route || inq.tour_name || 'Mount Elbrus'}
                            </td>

                            <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                              {inq.dates || inq.departure_date || 'Summer 2026'}
                            </td>

                            <td className="py-3.5 px-4 font-mono text-slate-300">
                              {inq.people_count || inq.groupSize || 1} pax
                            </td>

                            <td className="py-3.5 px-4">
                              <select
                                value={inq.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border cursor-pointer focus:outline-none ${conf.badgeClass}`}
                              >
                                <option value="new" className="bg-[#0B101D] text-amber-400">New Inquiry</option>
                                <option value="whatsapp_sent" className="bg-[#0B101D] text-sky-400">WhatsApp Sent</option>
                                <option value="deposit_paid" className="bg-[#0B101D] text-emerald-400">Deposit Paid</option>
                                <option value="confirmed" className="bg-[#0B101D] text-emerald-300">Confirmed</option>
                                <option value="cancelled" className="bg-[#0B101D] text-rose-400">Cancelled</option>
                              </select>
                            </td>

                            <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                              {formatPrice(inq.amountUsd || 1200, inq.amountRub)}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => openWhatsAppChat(inq)}
                                  title="Launch WhatsApp Consultation"
                                  className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                                >
                                  <MessageSquare size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedLead(inq)}
                                  title="View Full Lead Details"
                                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 transition"
                                >
                                  <Eye size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: EXPEDITIONS & TOURS CATALOG
        ========================================================================= */}
        {activeTab === 'tours' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tours.map((t) => (
                <div 
                  key={t.id}
                  className="rounded-2xl bg-[#0B101D] border border-white/[0.06] overflow-hidden flex flex-col shadow-sm group hover:border-white/10 transition"
                >
                  <div className="h-44 relative bg-slate-900 overflow-hidden">
                    <img
                      src={t.cover_image || t.coverImage || '/tours/elbrus-south.webp'}
                      alt={t.name || t.title || 'Tour cover'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B101D] via-transparent to-black/30" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${difficultyBadge(t.difficulty)}`}>
                        {t.difficulty || 'Demanding'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 text-white border border-white/10">
                        {t.altitude || '5,642 m'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                        t.status === 'Sold Out' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-extrabold text-white group-hover:text-orange-400 transition-colors">
                        {t.name || t.title}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                        {t.description || 'Full support alpine expedition with IFMGA certified guides, base camp accommodation, and gear rental.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-slate-500">Expedition Fee</div>
                        <div className="text-base font-black font-mono text-white">
                          {formatPrice(t.priceUsd || Math.round(t.price / 92.5), t.priceRub || t.price)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          {t.schedule2026?.length || 3} dates in 2026
                        </span>
                        <button
                          onClick={() => {
                            setEditingTour(t);
                            setIsCreatingTour(false);
                          }}
                          className="p-2 rounded-xl bg-white/[0.04] hover:bg-orange-500 text-slate-300 hover:text-white transition cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: GLOBAL SITE SETTINGS
        ========================================================================= */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            {/* Save Status Toast */}
            {settingsSavedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={16} />
                <span>Site parameters updated and synced across all expedition nodes successfully!</span>
              </div>
            )}

            {/* Section 1: Hero & Announcements */}
            <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/[0.06] space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-orange-400 flex items-center gap-2">
                <Sparkles size={16} />
                <span>Hero &amp; Urgent Announcements</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Hero Main Title</label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Promo Badge Micro-Label</label>
                    <input
                      type="text"
                      value={settings.promoBadgeText}
                      onChange={(e) => setSettings({ ...settings, promoBadgeText: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Season Operational Status</label>
                    <input
                      type="text"
                      value={settings.seasonStatus}
                      onChange={(e) => setSettings({ ...settings, seasonStatus: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>

                {/* Announcement Banner Toggle */}
                <div className="pt-3 border-t border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Top Urgent Announcement Ticker</div>
                      <div className="text-[11px] text-slate-500">Displays prominent banner above site header</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.announcementActive}
                        onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    placeholder="Announcement banner text..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Commercial & Financial Policies */}
            <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/[0.06] space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-orange-400 flex items-center gap-2">
                <DollarSign size={16} />
                <span>Commercial &amp; Financial Exchange Parameters</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">USD Exchange Rate (RUB/USD)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.usdExchangeRate}
                    onChange={(e) => setSettings({ ...settings, usdExchangeRate: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Booking Prepayment (%)</label>
                  <input
                    type="number"
                    value={settings.prepaymentPercent}
                    onChange={(e) => setSettings({ ...settings, prepaymentPercent: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Free Cancellation Window (Days)</label>
                  <input
                    type="number"
                    value={settings.freeCancellationDays}
                    onChange={(e) => setSettings({ ...settings, freeCancellationDays: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Communication & Safety Hotline */}
            <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/[0.06] space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-orange-400 flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>Communication &amp; Emergency Rescue Post</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Direct Phone</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">WhatsApp Hotline</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Telegram Channel</label>
                  <input
                    type="text"
                    value={settings.telegramChannel}
                    onChange={(e) => setSettings({ ...settings, telegramChannel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">EMERCOM High-Altitude Rescue Hotline</label>
                  <input
                    type="text"
                    value={settings.emergencyContact}
                    onChange={(e) => setSettings({ ...settings, emergencyContact: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={settingsSaving}
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {settingsSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Save Site Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 5: TEAM & SECURITY ACCESS
        ========================================================================= */}
        {activeTab === 'users' && (
          <div className="space-y-6 max-w-4xl">
            <div className="rounded-2xl bg-[#0B101D] border border-white/[0.06] overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.01] text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Operator</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {adminUsers.length === 0 ? (
                    <tr>
                      <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        admin
                      </td>
                      <td className="py-4 px-4 text-slate-400 font-mono">hq@kavkazskitur.com</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          SUPERADMIN
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-emerald-400 text-[10px] font-mono font-bold uppercase">Active</span>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-500 text-[11px]">Default Root</td>
                    </tr>
                  ) : (
                    adminUsers.map(u => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                          <span>{u.username}</span>
                          <span className="text-slate-500 font-normal">({u.name})</span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 font-mono">{u.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                            u.role === 'superadmin' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleUserActive(u.id, u.is_active)}
                            className={`text-[10px] font-mono font-bold uppercase ${u.is_active ? 'text-emerald-400 hover:underline' : 'text-slate-500 hover:underline'}`}
                          >
                            {u.is_active ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          MODAL 1: INQUIRY DETAILS & WHATSAPP BRIEFING
      ========================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B101D] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black text-base">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {selectedLead.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Inquiry #{selectedLead.id} &bull; {selectedLead.country || 'International'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Direct WhatsApp Launch */}
            <div className="p-4 rounded-xl bg-[#070B14] border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">One-Click WhatsApp Consultation</div>
                  <div className="text-[11px] text-slate-400">Prefilled alpine briefing template targeting {selectedLead.phone}</div>
                </div>
              </div>

              <button
                onClick={() => openWhatsAppChat(selectedLead)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <span>Launch WhatsApp</span>
                <ExternalLink size={12} />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-slate-500 font-mono uppercase text-[10px]">Contact Phone</div>
                <div className="font-bold text-white mt-1">{selectedLead.phone}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-slate-500 font-mono uppercase text-[10px]">Expedition Route</div>
                <div className="font-bold text-orange-400 mt-1">{selectedLead.route || selectedLead.tour_name}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-slate-500 font-mono uppercase text-[10px]">Requested Dates</div>
                <div className="font-bold text-white mt-1">{selectedLead.dates || selectedLead.departure_date}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-slate-500 font-mono uppercase text-[10px]">Group Size</div>
                <div className="font-bold text-white mt-1">{selectedLead.people_count || 1} climber(s)</div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
              <div className="text-slate-500 font-mono uppercase text-[10px] mb-1">Client Requests / Gear Needs</div>
              <p className="text-slate-300 leading-relaxed">
                {selectedLead.comment || selectedLead.gear_requests || 'No specific gear or transfer requirements listed.'}
              </p>
            </div>

            {/* Manager Internal Notes */}
            <div className="space-y-2 text-xs">
              <label className="block text-slate-400 font-bold uppercase text-[10px]">Internal Manager Notes</label>
              <textarea
                rows={3}
                value={selectedLead.manager_notes || ''}
                onChange={(e) => setSelectedLead({ ...selectedLead, manager_notes: e.target.value })}
                placeholder="Log deposit notes, gear sizes reserved, guide assignments..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={leadNotesSaving}
                  className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-orange-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {leadNotesSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  <span>Save Notes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: EDIT / CREATE TOUR & SCHEDULE 2026
      ========================================================================= */}
      {editingTour && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B101D] border border-white/10 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-black text-white">
                {isCreatingTour ? 'Add New Expedition Route' : `Edit: ${editingTour.name || editingTour.title}`}
              </h3>
              <button
                onClick={() => setEditingTour(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTour} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Route Title</label>
                  <input
                    type="text"
                    required
                    value={editingTour.name || editingTour.title || ''}
                    onChange={(e) => setEditingTour({ ...editingTour, name: e.target.value, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={editingTour.slug || ''}
                    onChange={(e) => setEditingTour({ ...editingTour, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Difficulty Tier</label>
                  <select
                    value={editingTour.difficulty || 'Demanding'}
                    onChange={(e) => setEditingTour({ ...editingTour, difficulty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                  >
                    <option value="Moderate">Moderate (Alpine Trekking)</option>
                    <option value="Demanding">Demanding (Glacier &amp; Crampons)</option>
                    <option value="Extreme">Extreme (North Face / Ski Traverse)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Max Altitude</label>
                  <input
                    type="text"
                    value={editingTour.altitude || '5,642 m'}
                    onChange={(e) => setEditingTour({ ...editingTour, altitude: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingTour.duration || '8 days'}
                    onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Price (RUB ₽)</label>
                  <input
                    type="number"
                    value={editingTour.priceRub || editingTour.price || 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEditingTour({ 
                        ...editingTour, 
                        price: val, 
                        priceRub: val, 
                        priceUsd: Math.round(val / (settings.usdExchangeRate || 92.5)) 
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">Expedition Itinerary Overview</label>
                <textarea
                  rows={3}
                  value={editingTour.description || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>

              {/* Media Manager */}
              <div className="pt-2">
                <TourMediaManager
                  coverImage={editingTour.cover_image || editingTour.coverImage || ''}
                  gallery={editingTour.gallery || []}
                  onChange={({ coverImage, gallery }) => {
                    setEditingTour({
                      ...editingTour,
                      cover_image: coverImage,
                      coverImage: coverImage,
                      gallery
                    });
                  }}
                />
              </div>

              {/* SCHEDULE 2026 DEPARTURE SLOTS MANAGER */}
              <div className="p-4 rounded-xl bg-[#070B14] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-xs flex items-center gap-2">
                    <CalendarDays size={14} className="text-orange-400" />
                    <span>Season 2026 Departure Dates &amp; Slots</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {editingTour.schedule2026?.length || 0} departures scheduled
                  </span>
                </div>

                {/* List Slots */}
                <div className="space-y-2">
                  {(editingTour.schedule2026 || []).map((slot, sIdx) => (
                    <div 
                      key={sIdx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs font-mono"
                    >
                      <div>
                        <span className="text-white font-bold">{slot.dates}</span>
                        <span className="text-slate-500 mx-2">&bull;</span>
                        <span className={slot.spotsLeft === 0 ? 'text-rose-400' : 'text-emerald-400'}>
                          {slot.spotsLeft} / {slot.capacity} spots left
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDateSlot(sIdx)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Slot */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="e.g. 12 Jul — 19 Jul 2026"
                    value={newDateInput}
                    onChange={(e) => setNewDateInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-xs font-mono focus:outline-none"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="number"
                      placeholder="Cap"
                      value={newDateCapacity}
                      onChange={(e) => setNewDateCapacity(Number(e.target.value))}
                      className="w-16 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-xs font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Spots"
                      value={newDateSpots}
                      onChange={(e) => setNewDateSpots(Number(e.target.value))}
                      className="w-16 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddDateSlot}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-bold transition cursor-pointer"
                    >
                      Add Slot
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingTour(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-slate-300 text-xs font-semibold hover:bg-white/[0.08] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-lg shadow-orange-500/20"
                >
                  Save Expedition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ADD OPERATOR USER
      ========================================================================= */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B101D] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold text-white">Add Console Operator</h3>
              <button
                onClick={() => setUserModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Role Permission</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#070B14] border border-white/[0.06] text-white focus:outline-none"
                >
                  <option value="manager">Manager (Dispatch &amp; Leads)</option>
                  <option value="editor">Editor (Routes &amp; Media)</option>
                  <option value="superadmin">Superadmin (Full Access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF6A00] border-t-transparent animate-spin" />
        <span>Loading Expedition Command Console...</span>
      </div>
    }>
      <AdminPageContent />
    </React.Suspense>
  );
}

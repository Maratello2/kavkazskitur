'use client';

import React, { useState, useEffect, useMemo, useTransition, useDeferredValue } from 'react';
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
import defaultCategories from '@/data/categories.json';
import defaultSettings from '@/data/siteSettings.json';
import TourEditorModal, { ItineraryDayItem } from '@/components/admin/TourEditorModal';
import HomepageEditor from '@/components/admin/HomepageEditor';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  headerGroup: 'ELBRUS 5642M' | 'PEAKS & TREKKING' | 'ACTIVITIES' | 'EXPEDITIONS & REGIONS' | string;
  description: string;
  badge?: string;
  icon?: string;
  showInHeader: boolean;
  order?: number;
}

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
  durationDays?: number;
  price: number;
  priceRub?: number;
  priceUsd?: number;
  is_published: boolean;
  is_featured: boolean;
  status: 'Active' | 'Sold Out' | 'Draft' | string;
  start_date?: string | null;
  end_date?: string | null;
  capacity?: number | null;
  cover_image?: string | null;
  coverImage?: string | null;
  gallery?: string[] | null;
  description?: string | null;
  full_content?: string | null;
  schedule2026?: DepartureDateSlot[];
  itinerary?: ItineraryDayItem[];
  included?: string[];
  excluded?: string[];
  highlights?: string[];
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
  const [activeTab, setActiveTab] = useState<'homepage' | 'overview' | 'crm' | 'tours' | 'categories' | 'settings' | 'users'>('homepage');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync tab from URL query if present
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['homepage', 'overview', 'crm', 'tours', 'categories', 'settings', 'users'].includes(tab)) {
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
  const [tourSearchQuery, setTourSearchQuery] = useState('');
  const [tourCategoryFilter, setTourCategoryFilter] = useState('all');
  const deferredTourSearch = useDeferredValue(tourSearchQuery);
  const [catalogPage, setCatalogPage] = useState(1);
  const TOURS_PER_PAGE = 18;

  useEffect(() => {
    setCatalogPage(1);
  }, [tourSearchQuery, tourCategoryFilter]);

  // 2b. Categories State
  const [categories, setCategories] = useState<CategoryItem[]>(defaultCategories as CategoryItem[]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categorySaveLoading, setCategorySaveLoading] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<CategoryItem | null>(null);

  // 3. Site Settings State
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings as any);
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
        coverImage: t.coverImage || t.image,
        gallery: t.gallery || [],
        description: t.description || '',
        itinerary: (t as any).itinerary || [],
        included: (t as any).included || [],
        excluded: (t as any).excluded || [],
        highlights: (t as any).highlights || [],
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

    // Fetch Categories
    async function fetchCategories() {
      setCategoriesLoading(true);
      try {
        const res = await fetch('/api/admin/categories');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data.categories) ? data.categories : (Array.isArray(data) ? data : []);
          if (list.length > 0) {
            setCategories(list);
            return;
          }
        }
      } catch (err) {
        console.warn('Categories API fallback:', err);
      } finally {
        setCategoriesLoading(false);
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
      fetchCategories();
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

  // Save Tour Modal handler (saves full tour including itinerary days and dates)
  const handleSaveTourModal = async (updatedTour: TourItem) => {
    try {
      const res = await fetch('/api/admin/tours', {
        method: isCreatingTour ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTour)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Failed to save expedition route');
      }
      if (data.tours && Array.isArray(data.tours)) {
        setTours(data.tours);
      } else if (isCreatingTour) {
        setTours(prev => [updatedTour, ...prev]);
      } else {
        setTours(prev => prev.map(t => (t.id === updatedTour.id || (t.slug && t.slug === updatedTour.slug)) ? updatedTour : t));
      }
      setEditingTour(null);
      setIsCreatingTour(false);
    } catch (err: any) {
      console.error('Error saving tour:', err);
      throw err;
    }
  };

  // Save Tour handler (legacy fallback)
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

  // Delete Tour
  const handleDeleteTour = async (id: number, slug?: string) => {
    if (!confirm('Are you sure you want to delete this expedition route?')) return;
    try {
      const res = await fetch(`/api/admin/tours?id=${id}${slug ? `&slug=${slug}` : ''}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTours(prev => prev.filter(t => t.id !== id));
        setEditingTour(null);
      }
    } catch (err) {
      console.error('Error deleting tour:', err);
    }
  };

  // Save Category (Create or Update)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setCategorySaveLoading(true);
    setCategoryError('');

    try {
      const method = isCreatingCategory ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setCategoryError(data.error || 'Failed to save category');
        return;
      }

      if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else if (isCreatingCategory) {
        setCategories(prev => [...prev, editingCategory]);
      } else {
        setCategories(prev => prev.map(c => c.slug === editingCategory.slug ? editingCategory : c));
      }
      setEditingCategory(null);
      setIsCreatingCategory(false);
    } catch (err: any) {
      setCategoryError(err.message || 'Network error saving category');
    } finally {
      setCategorySaveLoading(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (slug: string) => {
    try {
      const res = await fetch(`/api/admin/categories?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories(prev => prev.filter(c => c.slug !== slug));
        }
        setDeleteConfirmCategory(null);
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  // Quick Toggle Header Visibility for a Category
  const handleToggleHeaderVisibility = async (cat: CategoryItem) => {
    const updated = { ...cat, showInHeader: !cat.showInHeader };
    setCategories(prev => prev.map(c => c.slug === cat.slug ? updated : c));
    try {
      await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Error updating category header visibility:', err);
    }
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
        <Logo variant="emblem" size={46} className="shrink-0" />
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
            onClick={() => { setActiveTab('homepage'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'homepage' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold' : 'text-slate-300 bg-white/[0.02]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>🎨 Homepage &amp; Hero Editor</span>
          </button>
          <button
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'settings' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-300 bg-white/[0.02]'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>⚙️ General Settings &amp; Contacts</span>
          </button>
          <button
            onClick={() => { setActiveTab('tours'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'tours' ? 'bg-white/[0.08] text-white border border-white/10' : 'text-slate-400'
            }`}
          >
            <Mountain className="w-4 h-4 text-slate-400" />
            <span>🏔️ Routes & Pricing</span>
            <span className="ml-auto text-slate-500 font-mono text-[10px]">
              {tours.length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'categories' ? 'bg-white/[0.08] text-white border border-white/10' : 'text-slate-400'
            }`}
          >
            <Layers className="w-4 h-4 text-slate-400" />
            <span>🏷️ Categories & Mega Menu</span>
            <span className="ml-auto text-slate-500 font-mono text-[10px]">
              {categories.length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('crm'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'crm' ? 'bg-white/[0.08] text-white border border-white/10' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>📋 Inquiries & CRM Leads</span>
            {newLeadsCount > 0 && (
              <span className="ml-auto bg-orange-500/20 text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                {newLeadsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'overview' ? 'bg-white/[0.08] text-white border border-white/10' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            <span>📊 Operations & Analytics</span>
          </button>
          <button
            onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
              activeTab === 'users' ? 'bg-white/[0.08] text-white border border-white/10' : 'text-slate-400'
            }`}
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>👥 Team & Access Control</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          DESKTOP SIDEBAR (NO ORANGE 'K' - REPLACED WITH OFFICIAL LOGO)
      ========================================================================= */}
      <aside className="w-full md:w-64 bg-[#0B101D] border-r border-white/[0.06] p-5 hidden md:flex flex-col justify-between shrink-0">
        <div>
          {/* Official Vector Logo replacing orange K badge */}
          <div className="flex items-center gap-3.5 mb-8">
            <Logo variant="emblem" size={54} className="shrink-0" />
            <div>
              <div className="font-serif font-black text-base tracking-wider text-white">
                KAVKAZ<span className="text-[#FF6A00]">SKITUR</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Operations Dashboard 2026</span>
              </div>
            </div>
          </div>

          {/* Navigation Links with Active States */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveTab('homepage')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'homepage'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05] bg-white/[0.02]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="font-bold">🎨 Homepage &amp; Hero Editor</span>
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
              <span>🏔️ Routes & Pricing</span>
              <span className="ml-auto text-slate-500 font-mono text-[10px]">
                {tours.length}
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-white/[0.08] text-white border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <Layers className={`w-4 h-4 ${activeTab === 'categories' ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>🏷️ Categories & Mega Menu</span>
              <span className="ml-auto text-slate-500 font-mono text-[10px]">
                {categories.length}
              </span>
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
              <span>📋 Inquiries & CRM Leads</span>
              {newLeadsCount > 0 && (
                <span className="ml-auto bg-orange-500/20 text-orange-400 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  {newLeadsCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white/[0.08] text-white border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-orange-400' : 'text-slate-400'}`} />
              <span>📊 Operations & Analytics</span>
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
              <span>⚙️ General Settings &amp; Contacts</span>
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
              <span>👥 Team & Access Control</span>
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
              {activeTab === 'settings' && <span>✏️ Site Content, Hero Section & Contacts</span>}
              {activeTab === 'tours' && <span>🏔️ Expeditions Catalog & Pricing ({tours.length})</span>}
              {activeTab === 'categories' && <span>🏷️ Expedition Categories & Header Menu ({categories.length})</span>}
              {activeTab === 'crm' && <span>📋 Inquiries & Client CRM</span>}
              {activeTab === 'overview' && <span>📊 Operations & Analytics</span>}
              {activeTab === 'users' && <span>👥 Team & Access Control</span>}
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Season 2026
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'settings' && 'Customize hero headline, subtitle, WhatsApp and phone lines, announcement banner, and exchange rates.'}
              {activeTab === 'tours' && 'Manage all 88 expedition routes, pricing in RUB/USD, departure schedules, and media.'}
              {activeTab === 'categories' && 'Manage expedition categories and header mega-menu navigation groups.'}
              {activeTab === 'crm' && 'Review incoming expedition requests, WhatsApp direct bookings, and deposit statuses.'}
              {activeTab === 'overview' && 'Real-time telemetry, reservation tracking, and quick system access.'}
              {activeTab === 'users' && 'Manage administrator and expedition manager credentials.'}
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
            {/* Quick Action Navigation Cards for Lyana & Operators */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/30 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <span>⚡ Quick Management Shortcuts</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Jump directly to site sections to edit content, routes, or navigation structure:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="flex flex-col text-left p-4 rounded-xl bg-[#0B101D] hover:bg-[#12192c] border border-orange-500/40 hover:border-orange-500 text-white transition group cursor-pointer shadow-md"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-sm text-orange-400 flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-orange-400" />
                      <span>Site Content & Contacts</span>
                    </span>
                    <span className="text-xs text-orange-400 group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                  <span className="text-[11px] text-slate-400 leading-snug">
                    Hero headline (Welcome to...), subtitle, promo badge, phone & WhatsApp
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('tours')}
                  className="flex flex-col text-left p-4 rounded-xl bg-[#0B101D] hover:bg-[#12192c] border border-white/10 hover:border-sky-400 text-white transition group cursor-pointer shadow-md"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-sm text-sky-400 flex items-center gap-1.5">
                      <Mountain className="w-4 h-4 text-sky-400" />
                      <span>Routes & Pricing ({tours.length})</span>
                    </span>
                    <span className="text-xs text-sky-400 group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                  <span className="text-[11px] text-slate-400 leading-snug">
                    All 88 expeditions, edit descriptions, RUB/USD fees, and departure dates
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('categories')}
                  className="flex flex-col text-left p-4 rounded-xl bg-[#0B101D] hover:bg-[#12192c] border border-white/10 hover:border-emerald-400 text-white transition group cursor-pointer shadow-md"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>Categories & Menu ({categories.length})</span>
                    </span>
                    <span className="text-xs text-emerald-400 group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                  <span className="text-[11px] text-slate-400 leading-snug">
                    Configure header drop-down mega menu items and create new groups
                  </span>
                </button>
              </div>
            </div>

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
            <AdminAnalytics inquiries={inquiries} tours={tours} usdRate={settings.usdExchangeRate} hideKpis={true} />
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
        {activeTab === 'tours' && (() => {
          const filteredToursCatalog = tours.filter((t) => {
            const matchesCat =
              tourCategoryFilter === 'all' ||
              t.category?.toLowerCase() === tourCategoryFilter.toLowerCase() ||
              (t.category_name && t.category_name.toLowerCase().includes(tourCategoryFilter.toLowerCase())) ||
              ((t as any).categories && Array.isArray((t as any).categories) && (t as any).categories.includes(tourCategoryFilter));

            const q = deferredTourSearch.toLowerCase().trim();
            const matchesSearch =
              !q ||
              (t.name && t.name.toLowerCase().includes(q)) ||
              (t.title && t.title.toLowerCase().includes(q)) ||
              (t.description && t.description.toLowerCase().includes(q)) ||
              (t.altitude && t.altitude.toLowerCase().includes(q)) ||
              (t.difficulty && t.difficulty.toLowerCase().includes(q)) ||
              (t.slug && t.slug.toLowerCase().includes(q));

            return matchesCat && matchesSearch;
          });

          const totalPages = Math.ceil(filteredToursCatalog.length / TOURS_PER_PAGE) || 1;
          const currentPage = Math.min(Math.max(1, catalogPage), totalPages);
          const paginatedTours = filteredToursCatalog.slice((currentPage - 1) * TOURS_PER_PAGE, currentPage * TOURS_PER_PAGE);

          return (
            <div className="space-y-6">
              {/* Controls Bar: Search, Category Filter, Create Button */}
              <div className="flex flex-col gap-4 bg-[#0B101D] p-5 rounded-2xl border border-white/[0.06] shadow-sm">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search routes by title, altitude, description, or slug..."
                      value={tourSearchQuery}
                      onChange={(e) => setTourSearchQuery(e.target.value)}
                      className="w-full bg-[#070B14] border border-white/[0.06] focus:border-orange-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                    />
                    {tourSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setTourSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono">
                      Showing: {filteredToursCatalog.length} of {tours.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingTour(true);
                        setEditingTour({
                          id: Date.now(),
                          slug: 'route-' + Date.now(),
                          name: 'New Greater Caucasus Expedition',
                          title: 'New Greater Caucasus Expedition',
                          category: categories[0]?.slug || 'climbing',
                          category_name: categories[0]?.name || 'Mountaineering',
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
                          cover_image: '/tours/elbrus-south.webp',
                          coverImage: '/tours/elbrus-south.webp',
                          gallery: [],
                          description: 'Comprehensive guided alpine expedition with certified IFMGA mountain guides.',
                          itinerary: [
                            { day: 1, title: 'Arrival in Mineralnye Vody & Transfer to Terskol', description: 'Meet group at airport, transfer to base lodge, gear check and safety briefing.', altitude: '2,150 m', overnight: 'Terskol Base Lodge' },
                            { day: 2, title: 'Acclimatization trek on Mt. Cheget slopes', description: 'Hike along Cheget ridges with panoramic vistas of Donguz-Orun glacier and twin Elbrus domes.', altitude: '3,100 m', overnight: 'Terskol Base Lodge' }
                          ],
                          schedule2026: [
                            { dates: '15 Jul — 22 Jul 2026', spotsLeft: 10, capacity: 12, status: 'available' },
                          ],
                          included: ['IFMGA Certified Lead Guide', 'Group transfers', 'Base camp refuge accommodation', 'High-altitude board & hot meals'],
                          excluded: ['International flights', 'Personal mountaineering gear rental', 'Snowcat on summit night', 'Medical insurance']
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20 shrink-0"
                    >
                      <Plus size={15} />
                      <span>+ Add Route</span>
                    </button>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => setTourCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition ${
                      tourCategoryFilter === 'all'
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({tours.length})
                  </button>

                  {categories.map((c) => {
                    const cCount = tours.filter(
                      (t) =>
                        t.category?.toLowerCase() === c.slug.toLowerCase() ||
                        t.category_name?.toLowerCase().includes(c.slug.toLowerCase()) ||
                        ((t as any).categories && Array.isArray((t as any).categories) && (t as any).categories.includes(c.slug))
                    ).length;

                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => setTourCategoryFilter(c.slug)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition ${
                          tourCategoryFilter === c.slug
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-white/[0.03] text-slate-400 hover:text-white'
                        }`}
                      >
                        {c.name} ({cCount})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expeditions Grid */}
              {filteredToursCatalog.length === 0 ? (
                <div className="p-12 text-center text-slate-500 bg-[#0B101D] rounded-2xl border border-white/[0.06]">
                  No expedition routes match the current search or category filter.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {paginatedTours.map((t) => (
                      <div 
                        key={t.id}
                        className="rounded-2xl bg-[#0B101D] border border-white/[0.06] overflow-hidden flex flex-col shadow-sm group hover:border-white/10 transition"
                      >
                        <div className="h-44 relative bg-slate-900 overflow-hidden">
                          <img
                            src={t.cover_image || t.coverImage || '/tours/elbrus-south.webp'}
                            alt={t.name || t.title || 'Tour cover'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B101D] via-transparent to-black/30" />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${difficultyBadge(t.difficulty)}`}>
                              {t.difficulty || 'Demanding'}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 text-white border border-white/10">
                              {t.altitude || '5,642 m'}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                              📅 {t.itinerary?.length || 0} days
                            </span>
                          </div>

                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                              t.status === 'Sold Out' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {t.status || 'Active'}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="text-[10px] font-mono uppercase text-orange-400 font-bold mb-1">
                              {t.category_name || t.category || 'Expedition'}
                            </div>
                            <h3 className="text-base font-extrabold text-white group-hover:text-orange-400 transition-colors line-clamp-2">
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
                                {formatPrice(t.priceUsd || Math.round((t.priceRub || t.price) / 92.5), t.priceRub || t.price)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-slate-400">
                                {t.schedule2026?.length || 0} dates
                              </span>
                              <button
                                onClick={() => {
                                  setEditingTour(t);
                                  setIsCreatingTour(false);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-orange-500/20"
                                title="Edit route and day-by-day itinerary"
                              >
                                <Edit size={13} />
                                <span>Edit Route</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
                      <div className="text-xs text-slate-400 font-mono">
                        Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span> ({filteredToursCatalog.length} routes)
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setCatalogPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition"
                        >
                          ← Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                          if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)) {
                            return (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setCatalogPage(p)}
                                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition ${
                                  p === currentPage
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                                    : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                                }`}
                              >
                                {p}
                              </button>
                            );
                          }
                          if (p === currentPage - 3 || p === currentPage + 3) {
                            return <span key={p} className="text-slate-600 text-xs px-1 font-mono">...</span>;
                          }
                          return null;
                        })}
                        <button
                          type="button"
                          onClick={() => setCatalogPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 transition"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })()}

        {/* =========================================================================
            TAB 3b: CATEGORIES & HEADER MEGA MENU MANAGEMENT
        ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Top Command Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0B101D] p-6 rounded-2xl border border-white/[0.06] shadow-sm">
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-orange-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-orange-400" />
                  Header Mega Menu &amp; Route Taxonomy
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Expedition Categories &amp; Navigation Menu
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Manage tour categories. Active categories toggled with &quot;Visible in Menu&quot; will automatically populate the Header Dropdown Mega Menu and Mobile Drawer under their assigned group.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCreatingCategory(true);
                  setCategoryError('');
                  setEditingCategory({
                    id: 'new-category-' + Date.now(),
                    name: '',
                    slug: '',
                    headerGroup: 'ACTIVITIES',
                    description: '',
                    badge: '',
                    showInHeader: true,
                    order: categories.length + 1,
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/25 shrink-0"
              >
                <Plus size={16} />
                <span>Add Category</span>
              </button>
            </div>

            {/* Quick KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0B101D] border border-white/[0.06] space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Total Categories</div>
                <div className="text-2xl font-black text-white font-mono">{categories.length}</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B101D] border border-white/[0.06] space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Mega Menu Active</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {categories.filter(c => c.showInHeader).length}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B101D] border border-white/[0.06] space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Header Groups</div>
                <div className="text-2xl font-black text-orange-400 font-mono">4</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0B101D] border border-white/[0.06] space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Categorized Tours</div>
                <div className="text-2xl font-black text-sky-400 font-mono">{tours.length}</div>
              </div>
            </div>

            {/* Categories Table */}
            <div className="rounded-2xl bg-[#0B101D] border border-white/[0.06] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.01] text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Category Name &amp; Description</th>
                      <th className="py-3 px-4">Slug &amp; Target URL</th>
                      <th className="py-3 px-4">Header Dropdown Group</th>
                      <th className="py-3 px-4 text-center">Header Mega Menu</th>
                      <th className="py-3 px-4 text-center">Tours Count</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {categoriesLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                          <span>Loading categories taxonomy...</span>
                        </td>
                      </tr>
                    ) : categories.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          No categories configured yet.
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat) => {
                        const tourCount = tours.filter(
                          (t) =>
                            t.category?.toLowerCase() === cat.slug.toLowerCase() ||
                            t.category_name?.toLowerCase().includes(cat.slug.toLowerCase()) ||
                            ((t as any).categories && Array.isArray((t as any).categories) && (t as any).categories.includes(cat.slug))
                        ).length;

                        return (
                          <tr key={cat.id || cat.slug} className="hover:bg-white/[0.02] transition">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{cat.name}</span>
                                {cat.badge && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                    {cat.badge}
                                  </span>
                                )}
                              </div>
                              {cat.description && (
                                <p className="text-[11px] text-slate-400 mt-1 max-w-sm line-clamp-1">
                                  {cat.description}
                                </p>
                              )}
                            </td>

                            <td className="py-4 px-4 font-mono text-[11px]">
                              <span className="text-slate-400">/expeditions?category=</span>
                              <span className="text-orange-400 font-bold">{cat.slug}</span>
                            </td>

                            <td className="py-4 px-4">
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-white/[0.04] text-slate-300 border border-white/5">
                                {cat.headerGroup || 'ACTIVITIES'}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleHeaderVisibility(cat)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition border cursor-pointer ${
                                  cat.showInHeader
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                                    : 'bg-slate-700/30 text-slate-400 border-white/10 hover:bg-slate-700/50'
                                }`}
                              >
                                {cat.showInHeader ? 'Visible in Menu' : 'Hidden'}
                              </button>
                            </td>

                            <td className="py-4 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setTourCategoryFilter(cat.slug);
                                  setActiveTab('tours');
                                }}
                                className="px-2 py-1 rounded bg-white/[0.04] hover:bg-orange-500/20 text-slate-300 hover:text-orange-400 text-xs font-mono font-bold transition"
                                title="Filter tours in catalog"
                              >
                                {tourCount} tour{tourCount !== 1 ? 's' : ''}
                              </button>
                            </td>

                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsCreatingCategory(false);
                                    setCategoryError('');
                                    setEditingCategory({ ...cat });
                                  }}
                                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-orange-500 text-slate-300 hover:text-white transition"
                                  title="Edit category"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmCategory(cat)}
                                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500 text-slate-300 hover:text-white transition"
                                  title="Delete category"
                                >
                                  <Trash2 size={13} />
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
            TAB: HOMEPAGE & HERO VISUAL BUILDER (WORDPRESS-STYLE)
        ========================================================================= */}
        {activeTab === 'homepage' && (
          <HomepageEditor
            settings={settings}
            onSave={async (updated) => {
              setSettings(updated);
              setSettingsSaving(true);
              setSettingsSavedSuccess(false);
              try {
                const res = await fetch('/api/admin/settings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updated),
                });
                if (res.ok) {
                  setSettingsSavedSuccess(true);
                  setTimeout(() => setSettingsSavedSuccess(false), 3500);
                  return true;
                }
              } catch (err) {
                console.error('Error saving settings:', err);
              } finally {
                setSettingsSaving(false);
              }
              return false;
            }}
            saving={settingsSaving}
            savedSuccess={settingsSavedSuccess}
          />
        )}

        {/* =========================================================================
            TAB 4: GLOBAL SITE SETTINGS (BUSINESS SETTINGS, FX & CONTACTS)
        ========================================================================= */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            {/* Save Status Toast */}
            {settingsSavedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center gap-2 shadow-lg animate-fadeIn">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>✅ Site content and contacts successfully saved and updated live on the site!</span>
              </div>
            )}

            {/* Quick Link to Dedicated Homepage Editor */}
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-orange-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Full WordPress-Style Homepage &amp; Hero Editor Available</div>
                  <div className="text-[11px] text-slate-400">Manage 3D mountain slides, backgrounds, hero headings, CTAs, and homepage blocks.</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('homepage')}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition cursor-pointer"
              >
                Open Homepage Editor
              </button>
            </div>

            {/* Quick Helper Note for Lyana */}
            <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-200 text-xs flex items-center gap-3">
              <Sparkles size={18} className="text-sky-400 shrink-0" />
              <span>
                Customize the primary hero headline (Welcome to The Caucasus), subtitle, WhatsApp/phone lines, and announcement banner. Changes take effect live immediately.
              </span>
            </div>

            {/* Section 1: Hero Section & Announcement Banner */}
            <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/[0.06] space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-orange-400 flex items-center gap-2">
                <Sparkles size={16} />
                <span>✏️ Hero Section & Announcement Banner</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-200 font-bold mb-1">
                    Hero Section Headline
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Rendered monumentally in center over mountain vista (default: WELCOME TO THE CAUCASUS).
                  </p>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    placeholder="WELCOME TO THE CAUCASUS"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white font-semibold focus:outline-none focus:border-orange-500/60"
                  />
                </div>

                <div>
                  <label className="block text-slate-200 font-bold mb-1">
                    Hero Section Subtitle
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Explanatory narrative positioned directly under the primary headline.
                  </p>
                  <textarea
                    rows={2}
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    placeholder="Premier alpine expeditions, ski tours, and guided Elbrus ascents led by certified mountain guides..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-orange-500/60 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">
                      Top Horizon Micro-Badge
                    </label>
                    <input
                      type="text"
                      value={settings.promoBadgeText}
                      onChange={(e) => setSettings({ ...settings, promoBadgeText: e.target.value })}
                      placeholder="THE GREATER CAUCASUS • 2026 EXPEDITIONS"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-200 font-bold mb-1">
                      Expedition Season Status
                    </label>
                    <input
                      type="text"
                      value={settings.seasonStatus}
                      onChange={(e) => setSettings({ ...settings, seasonStatus: e.target.value })}
                      placeholder="Active Season — 2026 Expeditions Booking Open"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>

                {/* Announcement Banner Toggle */}
                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">
                        📢 Top Announcement & Privilege Ribbon (Top Banner)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Display prominent privilege notice across the very top bar of the website
                      </div>
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
                    placeholder="e.g. Season 2026: 10% Early Bird Privilege on Greater Caucasus Expeditions!"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Contacts & WhatsApp */}
            <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/[0.06] space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-orange-400 flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>📞 Contacts, WhatsApp & Emergency Lines</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Primary Hotline</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="+7 (928) 082-84-13"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">WhatsApp Concierge Number</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    placeholder="+7 (928) 082-84-13"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Telegram Dispatch Channel</label>
                  <input
                    type="text"
                    value={settings.telegramChannel}
                    onChange={(e) => setSettings({ ...settings, telegramChannel: e.target.value })}
                    placeholder="https://t.me/kavkazskitur"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={settings.email || ''}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="info@kavkazskitur.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Expedition HQ Address</label>
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    placeholder="74 Gorky St, Nalchik, Kabardino-Balkaria"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">High-Altitude Mountain Rescue (EMERCOM Elbrus)</label>
                  <input
                    type="text"
                    value={settings.emergencyContact}
                    onChange={(e) => setSettings({ ...settings, emergencyContact: e.target.value })}
                    placeholder="+7 (866) 387-14-89"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Financial Parameters */}
            <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/[0.06] space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-orange-400 flex items-center gap-2">
                <DollarSign size={16} />
                <span>💰 Financial Parameters & FX Rates</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-200 font-bold mb-1">USD Exchange Rate (RUB / USD)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.usdExchangeRate}
                    onChange={(e) => setSettings({ ...settings, usdExchangeRate: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Reservation Deposit (%)</label>
                  <input
                    type="number"
                    value={settings.prepaymentPercent}
                    onChange={(e) => setSettings({ ...settings, prepaymentPercent: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-200 font-bold mb-1">Free Cancellation Window (Days)</label>
                  <input
                    type="number"
                    value={settings.freeCancellationDays}
                    onChange={(e) => setSettings({ ...settings, freeCancellationDays: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={settingsSaving}
                className="px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 shadow-xl shadow-orange-500/25 transition cursor-pointer disabled:opacity-50"
              >
                {settingsSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>💾 Save Site Content & Settings</span>
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
          MODAL 2: FULL TOUR & ITINERARY DAYS EDITOR (ISOLATED PERFORMANCE MODAL)
      ========================================================================= */}
      {editingTour && (
        <TourEditorModal
          tour={editingTour}
          isCreating={isCreatingTour}
          categories={categories}
          usdExchangeRate={settings.usdExchangeRate || 92.5}
          onSave={handleSaveTourModal}
          onDelete={handleDeleteTour}
          onClose={() => {
            setEditingTour(null);
            setIsCreatingTour(false);
          }}
        />
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT CATEGORY
      ========================================================================= */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B101D] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  {isCreatingCategory ? 'Add New Category' : `Edit Category: ${editingCategory.name}`}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure title, slug, mega menu group and header appearance
                </p>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {categoryError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{categoryError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heliskiing & Freeride"
                  value={editingCategory.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
                    setEditingCategory({
                      ...editingCategory,
                      name: val,
                      slug: isCreatingCategory ? autoSlug : editingCategory.slug
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                  URL Slug (identifier)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. heliskiing"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().trim() })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-mono focus:outline-none focus:border-orange-500/50"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Used in URL: /expeditions?category={editingCategory.slug || '<slug>'}
                </span>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                  Header Dropdown Menu Group
                </label>
                <select
                  value={editingCategory.headerGroup || 'ACTIVITIES'}
                  onChange={(e) => setEditingCategory({ ...editingCategory, headerGroup: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50 cursor-pointer"
                >
                  <option value="ELBRUS 5642M">ELBRUS 5642M</option>
                  <option value="PEAKS & TREKKING">PEAKS &amp; TREKKING</option>
                  <option value="ACTIVITIES">ACTIVITIES</option>
                  <option value="EXPEDITIONS & REGIONS">EXPEDITIONS &amp; REGIONS</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Select which column in the desktop header Mega Menu will display this category
                </span>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                  Short Description (Subtext in Mega Menu)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Helicopter drop backcountry freeride descents from 4,200m"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">
                  Badge Text (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Popular, New, Winter, 5,642m"
                  value={editingCategory.badge || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white focus:outline-none focus:border-orange-500/50"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingCategory.showInHeader}
                    onChange={(e) => setEditingCategory({ ...editingCategory, showInHeader: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500"
                  />
                  <span className="text-xs font-bold text-white">
                    Show in Header Dropdown Mega Menu &amp; Mobile Drawer
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] text-slate-300 text-xs font-semibold hover:bg-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={categorySaveLoading}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {categorySaveLoading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  <span>{isCreatingCategory ? 'Create Category' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DELETE CATEGORY CONFIRMATION
      ========================================================================= */}
      {deleteConfirmCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B101D] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <AlertCircle size={22} />
              </div>
              <h3 className="font-extrabold text-base text-white">Delete Category?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete category <strong className="text-white">&quot;{deleteConfirmCategory.name}&quot;</strong>? 
              This will remove it from the Header Mega Menu and filters. Assigned tours will remain intact.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmCategory(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.04] text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCategory(deleteConfirmCategory.slug)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-950/40"
              >
                Confirm Delete
              </button>
            </div>
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

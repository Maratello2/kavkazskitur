'use client';

import React, { useState } from 'react';
import {
  X,
  Save,
  Trash2,
  Plus,
  CalendarDays,
  Mountain,
  Clock,
  Compass,
  DollarSign,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import TourMediaManager from './TourMediaManager';
import { DepartureDateSlot, CategoryItem } from '@/app/admin/page';

export interface ItineraryDayItem {
  day: number;
  title: string;
  description: string;
  altitude?: string;
  overnight?: string;
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

interface TourEditorModalProps {
  tour: TourItem;
  isCreating: boolean;
  categories: CategoryItem[];
  usdExchangeRate: number;
  onSave: (updatedTour: TourItem) => Promise<void>;
  onDelete?: (id: number, slug?: string) => Promise<void>;
  onClose: () => void;
}

export default function TourEditorModal({
  tour,
  isCreating,
  categories,
  usdExchangeRate = 92.5,
  onSave,
  onDelete,
  onClose,
}: TourEditorModalProps) {
  const [form, setForm] = useState<TourItem>({
    ...tour,
    itinerary: Array.isArray(tour.itinerary) ? [...tour.itinerary] : [],
    schedule2026: Array.isArray(tour.schedule2026) ? [...tour.schedule2026] : [],
    included: Array.isArray(tour.included) ? [...tour.included] : [],
    excluded: Array.isArray(tour.excluded) ? [...tour.excluded] : [],
    gallery: Array.isArray(tour.gallery) ? [...tour.gallery] : [],
  });

  const [activeTab, setActiveTab] = useState<'itinerary' | 'general' | 'dates' | 'inclusions' | 'media'>('itinerary');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Expanded days accordion state
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  // Schedule slot form
  const [newDateInput, setNewDateInput] = useState('');
  const [newDateCapacity, setNewDateCapacity] = useState(12);
  const [newDateSpots, setNewDateSpots] = useState(12);

  // Inclusion inputs
  const [newIncludedText, setNewIncludedText] = useState('');
  const [newExcludedText, setNewExcludedText] = useState('');

  // Toggle Day Accordion
  const toggleDayExpand = (dayNum: number) => {
    setExpandedDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const expandAllDays = () => {
    setExpandedDays((form.itinerary || []).map((d) => d.day));
  };

  const collapseAllDays = () => {
    setExpandedDays([]);
  };

  // Add Day
  const handleAddDay = () => {
    const nextDayNum = (form.itinerary?.length || 0) + 1;
    const newDay: ItineraryDayItem = {
      day: nextDayNum,
      title: `Day ${nextDayNum}: `,
      description: '',
      altitude: form.altitude || '3,800 m',
      overnight: 'Hotel / Base Camp',
    };
    setForm((prev) => ({
      ...prev,
      itinerary: [...(prev.itinerary || []), newDay],
    }));
    setExpandedDays((prev) => [...prev, nextDayNum]);
  };

  // Update Day field
  const handleUpdateDay = (index: number, field: keyof ItineraryDayItem, value: any) => {
    setForm((prev) => {
      const updated = [...(prev.itinerary || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  // Remove Day
  const handleRemoveDay = (index: number) => {
    setForm((prev) => {
      const remaining = (prev.itinerary || []).filter((_, i) => i !== index);
      const renumbered = remaining.map((d, i) => ({ ...d, day: i + 1 }));
      return { ...prev, itinerary: renumbered };
    });
  };

  // Move Day Up/Down
  const handleMoveDay = (index: number, direction: 'up' | 'down') => {
    setForm((prev) => {
      const it = [...(prev.itinerary || [])];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= it.length) return prev;
      const temp = it[index];
      it[index] = it[target];
      it[target] = temp;
      const renumbered = it.map((d, i) => ({ ...d, day: i + 1 }));
      return { ...prev, itinerary: renumbered };
    });
  };

  // Schedule Slot handlers
  const handleAddDateSlot = () => {
    if (!newDateInput.trim()) return;
    const newSlot: DepartureDateSlot = {
      dates: newDateInput.trim(),
      capacity: Number(newDateCapacity),
      spotsLeft: Number(newDateSpots),
      status: Number(newDateSpots) === 0 ? 'sold_out' : Number(newDateSpots) <= 3 ? 'few_spots' : 'available',
    };
    setForm((prev) => ({
      ...prev,
      schedule2026: [...(prev.schedule2026 || []), newSlot],
    }));
    setNewDateInput('');
  };

  const handleRemoveDateSlot = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      schedule2026: (prev.schedule2026 || []).filter((_, i) => i !== idx),
    }));
  };

  // Inclusions handlers
  const handleAddIncluded = () => {
    if (!newIncludedText.trim()) return;
    setForm((prev) => ({
      ...prev,
      included: [...(prev.included || []), newIncludedText.trim()],
    }));
    setNewIncludedText('');
  };

  const handleRemoveIncluded = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      included: (prev.included || []).filter((_, i) => i !== idx),
    }));
  };

  const handleAddExcluded = () => {
    if (!newExcludedText.trim()) return;
    setForm((prev) => ({
      ...prev,
      excluded: [...(prev.excluded || []), newExcludedText.trim()],
    }));
    setNewExcludedText('');
  };

  const handleRemoveExcluded = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      excluded: (prev.excluded || []).filter((_, i) => i !== idx),
    }));
  };

  // Save submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const finalTour: TourItem = {
        ...form,
        name: form.name || form.title || '',
        title: form.title || form.name || '',
        slug: form.slug?.trim() || 'tour-' + form.id,
        price: Number(form.priceRub || form.price || 0),
        priceRub: Number(form.priceRub || form.price || 0),
        priceUsd: Number(form.priceUsd || Math.round(Number(form.priceRub || form.price || 0) / usdExchangeRate)),
      };

      await onSave(finalTour);
      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setSaveError(err.message || 'Error saving expedition');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-[#0B101D] border border-white/10 rounded-2xl max-w-4xl w-full flex flex-col max-h-[94vh] shadow-2xl relative overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-center justify-between gap-4 bg-[#070B14]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-1">
              <Mountain size={14} />
              <span>{isCreating ? 'Create New Expedition Route' : 'Edit Expedition Route'}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">ID #{form.id}</span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white truncate">
              {form.name || form.title || 'New Expedition'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL NAVIGATION TABS */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-3 border-b border-white/[0.06] bg-[#070B14] overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('itinerary')}
            className={`px-3.5 py-2.5 rounded-t-xl transition flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'itinerary'
                ? 'bg-orange-500/10 text-orange-400 border-orange-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/[0.02]'
            }`}
          >
            <Clock size={14} className={activeTab === 'itinerary' ? 'text-orange-400' : 'text-slate-500'} />
            <span>📅 Itinerary Days ({form.itinerary?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-2.5 rounded-t-xl transition flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'general'
                ? 'bg-orange-500/10 text-orange-400 border-orange-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/[0.02]'
            }`}
          >
            <FileText size={14} className={activeTab === 'general' ? 'text-orange-400' : 'text-slate-500'} />
            <span>⚙️ General & Pricing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dates')}
            className={`px-3.5 py-2.5 rounded-t-xl transition flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'dates'
                ? 'bg-orange-500/10 text-orange-400 border-orange-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/[0.02]'
            }`}
          >
            <CalendarDays size={14} className={activeTab === 'dates' ? 'text-orange-400' : 'text-slate-500'} />
            <span>🗓️ Departure Dates ({form.schedule2026?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inclusions')}
            className={`px-3.5 py-2.5 rounded-t-xl transition flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'inclusions'
                ? 'bg-orange-500/10 text-orange-400 border-orange-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/[0.02]'
            }`}
          >
            <CheckCircle2 size={14} className={activeTab === 'inclusions' ? 'text-orange-400' : 'text-slate-500'} />
            <span>Inclusions & Exclusions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`px-3.5 py-2.5 rounded-t-xl transition flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-orange-500/10 text-orange-400 border-orange-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/[0.02]'
            }`}
          >
            <ImageIcon size={14} className={activeTab === 'media' ? 'text-orange-400' : 'text-slate-500'} />
            <span>🖼️ Media & Photos</span>
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {saveError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Expedition successfully saved!</span>
            </div>
          )}

          {/* =========================================================================
              TAB 1: ITINERARY / DAYS PROGRAM EDITOR
          ========================================================================= */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#070B14] border border-white/[0.06]">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <span>📅 Day-by-Day Expedition Itinerary</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-500/20 text-orange-400">
                      {form.itinerary?.length || 0} Days
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Configure stages, altitudes, overnight stations, and descriptions for each day of the expedition.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={expandAllDays}
                    className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllDays}
                    className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold"
                  >
                    Collapse All
                  </button>
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="px-3.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Add Day</span>
                  </button>
                </div>
              </div>

              {(!form.itinerary || form.itinerary.length === 0) ? (
                <div className="p-10 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/10 space-y-3">
                  <Clock className="w-10 h-10 text-slate-600 mx-auto" />
                  <div className="text-sm font-bold text-slate-300">Itinerary days not added yet</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Add itinerary days so travelers can see the day-by-day route with altitudes and overnight stations.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
                  >
                    <Plus size={14} />
                    <span>Add Day 1</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {form.itinerary.map((dayItem, idx) => {
                    const isExpanded = expandedDays.includes(dayItem.day);
                    return (
                      <div
                        key={dayItem.day}
                        className={`rounded-xl border transition-all ${
                          isExpanded
                            ? 'bg-[#070B14] border-orange-500/40 shadow-lg'
                            : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15'
                        }`}
                      >
                        {/* Day Card Header Bar */}
                        <div
                          onClick={() => toggleDayExpand(dayItem.day)}
                          className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 font-black text-xs font-mono flex items-center justify-center shrink-0">
                              D{dayItem.day}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-white text-xs sm:text-sm truncate block">
                                {dayItem.title || `Day ${dayItem.day}`}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                                {dayItem.altitude && (
                                  <span className="text-sky-300 font-semibold">{dayItem.altitude}</span>
                                )}
                                {dayItem.overnight && (
                                  <>
                                    <span>•</span>
                                    <span className="text-slate-400 truncate max-w-xs">{dayItem.overnight}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => handleMoveDay(idx, 'up')}
                              disabled={idx === 0}
                              title="Move up"
                              className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 transition"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveDay(idx, 'down')}
                              disabled={idx === form.itinerary!.length - 1}
                              title="Move down"
                              className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 transition"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveDay(idx)}
                              title="Remove day"
                              className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleDayExpand(dayItem.day)}
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </div>
                        </div>

                        {/* Day Card Expanded Body */}
                        {isExpanded && (
                          <div className="p-4 pt-1 border-t border-white/[0.04] space-y-3.5 text-xs">
                            <div>
                              <label className="block text-slate-300 font-bold mb-1">
                                Day Title / Stage
                              </label>
                              <input
                                type="text"
                                value={dayItem.title}
                                onChange={(e) => handleUpdateDay(idx, 'title', e.target.value)}
                                placeholder="e.g. Trek to Garabashi Refuge (3,800 m), acclimatization"
                                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-orange-500/60"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-slate-300 font-bold mb-1">
                                  Stage Altitude
                                </label>
                                <input
                                  type="text"
                                  value={dayItem.altitude || ''}
                                  onChange={(e) => handleUpdateDay(idx, 'altitude', e.target.value)}
                                  placeholder="e.g. 3,800 m or 5,642 m"
                                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono focus:outline-none focus:border-orange-500/60"
                                />
                              </div>
                              <div>
                                <label className="block text-slate-300 font-bold mb-1">
                                  Overnight Station
                                </label>
                                <input
                                  type="text"
                                  value={dayItem.overnight || ''}
                                  onChange={(e) => handleUpdateDay(idx, 'overnight', e.target.value)}
                                  placeholder="e.g. Barrels Refuge (3,800 m) or Hotel in Terskol"
                                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-orange-500/60"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-slate-300 font-bold mb-1">
                                Day Description (Detailed)
                              </label>
                              <textarea
                                rows={3}
                                value={dayItem.description}
                                onChange={(e) => handleUpdateDay(idx, 'description', e.target.value)}
                                placeholder="Schedule, altitude profile, technical briefings, meals and logistics..."
                                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white leading-relaxed focus:outline-none focus:border-orange-500/60"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={handleAddDay}
                      className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-orange-500 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-white/10"
                    >
                      <Plus size={14} />
                      <span>+ Add Day {(form.itinerary?.length || 0) + 1}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 2: GENERAL INFORMATION (TITLE, PRICING, DIFFICULTY)
          ========================================================================= */}
          {activeTab === 'general' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-200 font-bold mb-1">
                    Expedition Title
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name || form.title || ''}
                    onChange={(e) => setForm({ ...form, name: e.target.value, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white text-sm font-semibold focus:outline-none focus:border-orange-500/60"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={form.slug || ''}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white font-mono focus:outline-none focus:border-orange-500/60"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Expedition Category</label>
                  <select
                    value={form.category || 'climbing'}
                    onChange={(e) => {
                      const sel = e.target.value;
                      const c = categories.find((cat) => cat.slug === sel);
                      setForm({
                        ...form,
                        category: sel,
                        category_name: c ? c.name : sel,
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white focus:outline-none focus:border-orange-500/60 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} — [{c.headerGroup || 'ACTIVITIES'}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Difficulty Tier</label>
                  <select
                    value={form.difficulty || 'Demanding'}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white focus:outline-none focus:border-orange-500/60 cursor-pointer"
                  >
                    <option value="Moderate">Moderate (Alpine Trekking)</option>
                    <option value="Demanding">Demanding (Glacier, Crampons & Ice Axe)</option>
                    <option value="Extreme">Extreme (North Face / Winter Traverses)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Maximum Altitude</label>
                  <input
                    type="text"
                    value={form.altitude || '5,642 m'}
                    onChange={(e) => setForm({ ...form, altitude: e.target.value })}
                    placeholder="5,642 m"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white font-mono focus:outline-none focus:border-orange-500/60"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Duration</label>
                  <input
                    type="text"
                    value={form.duration || '8 days'}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="8 days"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white focus:outline-none focus:border-orange-500/60"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Publishing Status</label>
                  <select
                    value={form.status || (form.is_published ? 'Active' : 'Draft')}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value,
                        is_published: e.target.value !== 'Draft',
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white focus:outline-none focus:border-orange-500/60 cursor-pointer"
                  >
                    <option value="Active">Active (Published, Open for Booking)</option>
                    <option value="Sold Out">Sold Out (Fully Booked)</option>
                    <option value="Draft">Draft (Unpublished)</option>
                  </select>
                </div>

                {/* PRICING BLOCK */}
                <div className="p-4 rounded-xl bg-[#070B14] border border-orange-500/20 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Expedition Fee (RUB ₽)
                    </label>
                    <input
                      type="number"
                      value={form.priceRub || form.price || 0}
                      onChange={(e) => {
                        const rub = Number(e.target.value);
                        setForm({
                          ...form,
                          price: rub,
                          priceRub: rub,
                          priceUsd: Math.round(rub / usdExchangeRate),
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm font-bold focus:outline-none focus:border-orange-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Expedition Fee (USD $) — auto-calculated or manual override
                    </label>
                    <input
                      type="number"
                      value={form.priceUsd || Math.round((form.priceRub || form.price || 0) / usdExchangeRate)}
                      onChange={(e) => setForm({ ...form, priceUsd: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm font-bold focus:outline-none focus:border-orange-500/60"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">
                    Expedition Overview Description
                  </label>
                  <textarea
                    rows={4}
                    value={form.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Comprehensive route overview, highlights, safety guarantees..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070B14] border border-white/10 text-white leading-relaxed focus:outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: DATES 2026 DEPARTURES
          ========================================================================= */}
          {activeTab === 'dates' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#070B14] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <CalendarDays size={16} className="text-orange-400" />
                    <span>Season 2026 Departure Dates & Slots</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {form.schedule2026?.length || 0} departures scheduled
                  </span>
                </div>

                {/* Slots List */}
                <div className="space-y-2">
                  {(form.schedule2026 || []).map((slot, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/[0.06] font-mono"
                    >
                      <div>
                        <span className="text-white font-bold">{slot.dates}</span>
                        <span className="text-slate-500 mx-2">•</span>
                        <span className={slot.spotsLeft === 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                          {slot.spotsLeft} / {slot.capacity} spots left
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDateSlot(sIdx)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Slot */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-white/[0.06]">
                  <input
                    type="text"
                    placeholder="e.g. 12 Jul — 19 Jul 2026"
                    value={newDateInput}
                    onChange={(e) => setNewDateInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono focus:outline-none"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="number"
                      placeholder="Cap"
                      value={newDateCapacity}
                      onChange={(e) => setNewDateCapacity(Number(e.target.value))}
                      className="w-24 px-2 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono"
                    />
                    <input
                      type="number"
                      placeholder="Spots"
                      value={newDateSpots}
                      onChange={(e) => setNewDateSpots(Number(e.target.value))}
                      className="w-24 px-2 py-2 rounded-lg bg-black/40 border border-white/10 text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddDateSlot}
                      className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition cursor-pointer shrink-0"
                    >
                      + Add Slot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: INCLUSIONS / EXCLUSIONS
          ========================================================================= */}
          {activeTab === 'inclusions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Included */}
              <div className="p-4 rounded-xl bg-[#070B14] border border-emerald-500/20 space-y-3">
                <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Included in Expedition Fee</span>
                </h3>

                <div className="space-y-1.5">
                  {(form.included || []).map((inc, iIdx) => (
                    <div key={iIdx} className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/[0.04]">
                      <span className="text-slate-200">{inc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIncluded(iIdx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="e.g. Full alpine board & high-altitude meals"
                    value={newIncludedText}
                    onChange={(e) => setNewIncludedText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddIncluded(); }}}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddIncluded}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500/30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Excluded */}
              <div className="p-4 rounded-xl bg-[#070B14] border border-rose-500/20 space-y-3">
                <h3 className="font-bold text-rose-400 text-sm flex items-center gap-2">
                  <XCircle size={16} />
                  <span>Excluded from Expedition Fee</span>
                </h3>

                <div className="space-y-1.5">
                  {(form.excluded || []).map((exc, eIdx) => (
                    <div key={eIdx} className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/[0.04]">
                      <span className="text-slate-200">{exc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExcluded(eIdx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="e.g. International flights & personal gear rental"
                    value={newExcludedText}
                    onChange={(e) => setNewExcludedText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddExcluded(); }}}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddExcluded}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 font-bold hover:bg-rose-500/30"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: MEDIA & GALLERY
          ========================================================================= */}
          {activeTab === 'media' && (
            <div className="p-4 rounded-xl bg-[#070B14] border border-white/[0.06]">
              <TourMediaManager
                coverImage={form.cover_image || form.coverImage || ''}
                gallery={form.gallery || []}
                onChange={({ coverImage, gallery }) => {
                  setForm({
                    ...form,
                    cover_image: coverImage,
                    coverImage: coverImage,
                    gallery,
                  });
                }}
              />
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] sticky bottom-0 bg-[#0B101D]/95 backdrop-blur-md pb-1">
            {!isCreating && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(form.id, form.slug)}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete Expedition</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-7 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-lg shadow-orange-500/25 disabled:opacity-50"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                <span>💾 Save Expedition Route</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

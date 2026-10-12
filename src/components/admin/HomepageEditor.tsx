'use client';

import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Layers,
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  ExternalLink,
  Save,
  Loader2,
  Mountain,
  ShieldCheck,
  Calendar,
  MapPin,
  Sliders,
  Globe,
  Eye,
  Copy,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Edit3,
  Phone,
  MessageCircle,
  X
} from 'lucide-react';

export interface HeroRealmItem {
  id: string;
  realmNum: string;
  shortName: string;
  title: string;
  badge: string;
  tagline: string;
  altitudeMeters: number;
  altitudeStr: string;
  po2: string;
  tempRating: string;
  coordinates: string;
  keyFeature: string;
  shortFeature: string;
  imageSrc: string;
  imageMobileSrc: string;
  image480Src?: string;
  altText: string;
}

export interface SectionBlockConfig {
  enabled: boolean;
  badge: string;
  title: string;
  subtitle: string;
}

export interface HomepageEditorProps {
  settings: any;
  onSave: (updatedSettings: any) => Promise<boolean | void>;
  saving: boolean;
  savedSuccess: boolean;
}

export default function HomepageEditor({
  settings: initialSettings,
  onSave,
  saving,
  savedSuccess,
}: HomepageEditorProps) {
  // Local working copy to prevent laggy re-renders on parent
  const [settings, setSettings] = useState<any>(initialSettings);
  const [activeSubTab, setActiveSubTab] = useState<'hero_slides' | 'hero_headings' | 'sections' | 'announcement' | 'uploader'>('hero_slides');
  const [expandedSlideIdx, setExpandedSlideIdx] = useState<number | null>(0);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [lastUploadedUrls, setLastUploadedUrls] = useState<string[]>([]);
  const [localDirty, setLocalDirty] = useState(false);

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quickUploaderRef = useRef<HTMLInputElement>(null);

  // Sync when initialSettings change from external fetch
  React.useEffect(() => {
    if (!localDirty) {
      setSettings(initialSettings);
    }
  }, [initialSettings, localDirty]);

  const updateSettingsField = (key: string, val: any) => {
    setLocalDirty(true);
    setSettings((prev: any) => ({ ...prev, [key]: val }));
  };

  const updateSectionField = (sectionKey: string, field: keyof SectionBlockConfig, val: any) => {
    setLocalDirty(true);
    setSettings((prev: any) => {
      const existingSections = prev.homepageSections || {};
      const targetSec = existingSections[sectionKey] || { enabled: true, badge: '', title: '', subtitle: '' };
      return {
        ...prev,
        homepageSections: {
          ...existingSections,
          [sectionKey]: {
            ...targetSec,
            [field]: val,
          },
        },
      };
    });
  };

  const updateRealmField = (idx: number, field: keyof HeroRealmItem, val: any) => {
    setLocalDirty(true);
    setSettings((prev: any) => {
      const realms: HeroRealmItem[] = Array.isArray(prev.heroRealms) ? [...prev.heroRealms] : [];
      if (!realms[idx]) return prev;
      realms[idx] = { ...realms[idx], [field]: val };
      return { ...prev, heroRealms: realms };
    });
  };

  const handleAddSlide = () => {
    setLocalDirty(true);
    setSettings((prev: any) => {
      const realms: HeroRealmItem[] = Array.isArray(prev.heroRealms) ? [...prev.heroRealms] : [];
      const newNum = String(realms.length + 1).padStart(2, '0');
      const newSlide: HeroRealmItem = {
        id: `realm-custom-${Date.now()}`,
        realmNum: newNum,
        shortName: `Peak ${newNum}`,
        title: `Greater Caucasus Summit Realm ${newNum}`,
        badge: 'ALPINE SUMMIT • 4,500 M',
        tagline: 'Untamed High-Altitude Alpine Col Positioned Above Cloud Inversions',
        altitudeMeters: 4500,
        altitudeStr: '4,500 M',
        po2: 'pO2 58%',
        tempRating: '-8°C',
        coordinates: '43°20\'00" N, 42°25\'00" E',
        keyFeature: 'Glacier Field • Certified Guides • Panoramic Vista',
        shortFeature: 'Glacial Ridge',
        imageSrc: '/hero/summit_apex_5642.webp',
        imageMobileSrc: '/hero/summit_apex_5642_mobile.webp',
        altText: 'Caucasus mountain peak panoramic vista',
      };
      const updated = [...realms, newSlide];
      setExpandedSlideIdx(updated.length - 1);
      return { ...prev, heroRealms: updated };
    });
  };

  const handleMoveSlide = (idx: number, direction: 'up' | 'down') => {
    setLocalDirty(true);
    setSettings((prev: any) => {
      const realms: HeroRealmItem[] = Array.isArray(prev.heroRealms) ? [...prev.heroRealms] : [];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= realms.length) return prev;
      const temp = realms[idx];
      realms[idx] = realms[targetIdx];
      realms[targetIdx] = temp;
      setExpandedSlideIdx(targetIdx);
      return { ...prev, heroRealms: realms };
    });
  };

  const handleDeleteSlide = (idx: number) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;
    setLocalDirty(true);
    setSettings((prev: any) => {
      const realms: HeroRealmItem[] = Array.isArray(prev.heroRealms) ? [...prev.heroRealms] : [];
      const updated = realms.filter((_, i) => i !== idx);
      setExpandedSlideIdx(updated.length > 0 ? 0 : null);
      return { ...prev, heroRealms: updated };
    });
  };

  // Upload handler for slide images or quick uploader
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const targetKey = targetField || 'quick';
    setUploadingTarget(targetKey);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        if (targetField && expandedSlideIdx !== null) {
          updateRealmField(expandedSlideIdx, targetField as keyof HeroRealmItem, data.url);
        } else {
          setLastUploadedUrls((prev) => [data.url, ...prev]);
        }
      } else {
        alert(data.error || 'Failed to upload photo. Please verify image format.');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Error uploading file: ' + err.message);
    } finally {
      setUploadingTarget(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const ok = await onSave(settings);
    if (ok !== false) {
      setLocalDirty(false);
    }
  };

  const realms: HeroRealmItem[] = Array.isArray(settings?.heroRealms) ? settings.heroRealms : [];
  const sections = settings?.homepageSections || {};

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Sparkles size={20} />
            </span>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide uppercase">
                Homepage &amp; Hero Editor
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                WordPress-like visual control over hero mountain slides, headlines, CTAs, and homepage blocks. Changes reflect live instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-slate-200 border border-white/10 transition"
          >
            <Eye size={14} className="text-sky-400" />
            <span>Open Website</span>
            <ExternalLink size={12} className="opacity-60" />
          </a>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Homepage changes published successfully! Visit the website to see live updates.</span>
          </div>
          <a href="/" target="_blank" className="underline hover:text-white flex items-center gap-1">
            <span>View Live</span>
            <ExternalLink size={12} />
          </a>
        </div>
      )}

      {/* Secondary Sub-Navigation Pills */}
      <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('hero_slides')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'hero_slides'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white border border-white/[0.05]'
          }`}
        >
          <Mountain size={14} />
          <span>Mountain Banners &amp; Slides</span>
          <span className="font-mono text-[10px] bg-black/30 px-1.5 py-0.5 rounded-md">
            {realms.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('hero_headings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'hero_headings'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white border border-white/[0.05]'
          }`}
        >
          <Edit3 size={14} />
          <span>Hero Headlines &amp; CTA Buttons</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('sections')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'sections'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white border border-white/[0.05]'
          }`}
        >
          <Layers size={14} />
          <span>Homepage Blocks &amp; Sections</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('announcement')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'announcement'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white border border-white/[0.05]'
          }`}
        >
          <Sparkles size={14} />
          <span>Top Ribbon &amp; Season Notice</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('uploader')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'uploader'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
              : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:text-white border border-white/[0.05]'
          }`}
        >
          <Upload size={14} />
          <span>Photo Uploader &amp; Library</span>
        </button>
      </div>

      {/* =========================================================================
          SUB-TAB 1: HERO MOUNTAIN SLIDES BUILDER
      ========================================================================= */}
      {activeSubTab === 'hero_slides' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>🏔️ 3D Mountain Vistas Carousel</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Slides rotate in the hero background. Order determines navigation and telemetry chips.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddSlide}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md shadow-orange-500/20"
            >
              <Plus size={14} />
              <span>Add New Slide</span>
            </button>
          </div>

          {/* Slide List */}
          <div className="space-y-3">
            {realms.map((realm, idx) => {
              const isExpanded = expandedSlideIdx === idx;
              return (
                <div
                  key={realm.id || idx}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? 'bg-[#0B101D] border-orange-500/50 shadow-xl'
                      : 'bg-[#090D18] border-white/[0.07] hover:border-white/20'
                  }`}
                >
                  {/* Slide Summary Row */}
                  <div
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                    onClick={() => setExpandedSlideIdx(isExpanded ? null : idx)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Photo Thumbnail */}
                      <div className="w-14 h-10 rounded-lg overflow-hidden bg-black/60 border border-white/10 shrink-0 relative">
                        {realm.imageSrc ? (
                          <img
                            src={realm.imageSrc}
                            alt={realm.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">
                            No photo
                          </div>
                        )}
                        <span className="absolute bottom-0 right-0 px-1 bg-black/80 font-mono text-[9px] text-white font-bold">
                          {realm.realmNum || String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Text info */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm truncate">
                            {realm.title || 'Untitled Slide'}
                          </span>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-bold shrink-0">
                            {realm.altitudeStr || `${realm.altitudeMeters || 0} M`}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                          {realm.shortName} • {realm.coordinates || 'No coordinates'} • {realm.badge}
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSlide(idx, 'up')}
                        title="Move Up"
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === realms.length - 1}
                        onClick={() => handleMoveSlide(idx, 'down')}
                        title="Move Down"
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(idx)}
                        title="Delete Slide"
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer ml-1"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedSlideIdx(isExpanded ? null : idx)}
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-slate-300 ml-1"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <Edit3 size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Slide Edit Form */}
                  {isExpanded && (
                    <div className="p-5 border-t border-white/[0.08] space-y-4 text-xs bg-black/20">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">
                            Slide Number (e.g. 01)
                          </label>
                          <input
                            type="text"
                            value={realm.realmNum || ''}
                            onChange={(e) => updateRealmField(idx, 'realmNum', e.target.value)}
                            placeholder="01"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono focus:border-orange-500/60 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">
                            Short Name (Tabs &amp; Mobile)
                          </label>
                          <input
                            type="text"
                            value={realm.shortName || ''}
                            onChange={(e) => updateRealmField(idx, 'shortName', e.target.value)}
                            placeholder="Mt. Elbrus"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-orange-500/60 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">
                            Full Slide Title
                          </label>
                          <input
                            type="text"
                            value={realm.title || ''}
                            onChange={(e) => updateRealmField(idx, 'title', e.target.value)}
                            placeholder="Mount Elbrus Supreme Apex"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold focus:border-orange-500/60 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">
                            Slide Badge (e.g. ROOF OF EUROPE • 5,642 M)
                          </label>
                          <input
                            type="text"
                            value={realm.badge || ''}
                            onChange={(e) => updateRealmField(idx, 'badge', e.target.value)}
                            placeholder="ROOF OF EUROPE • 5,642 M"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-orange-500/60 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">
                            Tagline / Subtitle
                          </label>
                          <input
                            type="text"
                            value={realm.tagline || ''}
                            onChange={(e) => updateRealmField(idx, 'tagline', e.target.value)}
                            placeholder="The Supreme Summit of the European Continent & Seven Summits Crown"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-orange-500/60 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Altitude & Telemetry */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">
                            Altitude Meters (numeric)
                          </label>
                          <input
                            type="number"
                            value={realm.altitudeMeters || 0}
                            onChange={(e) => {
                              const num = Number(e.target.value);
                              updateRealmField(idx, 'altitudeMeters', num);
                              updateRealmField(idx, 'altitudeStr', `${num.toLocaleString('en-US')} M`);
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono focus:border-orange-500/60 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">
                            Altitude String
                          </label>
                          <input
                            type="text"
                            value={realm.altitudeStr || ''}
                            onChange={(e) => updateRealmField(idx, 'altitudeStr', e.target.value)}
                            placeholder="5,642 M"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono focus:border-orange-500/60 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">
                            Oxygen Partial (pO2)
                          </label>
                          <input
                            type="text"
                            value={realm.po2 || ''}
                            onChange={(e) => updateRealmField(idx, 'po2', e.target.value)}
                            placeholder="pO2 50%"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono focus:border-orange-500/60 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">
                            Average Temperature
                          </label>
                          <input
                            type="text"
                            value={realm.tempRating || ''}
                            onChange={(e) => updateRealmField(idx, 'tempRating', e.target.value)}
                            placeholder="-15°C"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono focus:border-orange-500/60 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">
                            GPS Coordinates
                          </label>
                          <input
                            type="text"
                            value={realm.coordinates || ''}
                            onChange={(e) => updateRealmField(idx, 'coordinates', e.target.value)}
                            placeholder="43°21'18&quot; N, 42°26'21&quot; E"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono focus:border-orange-500/60 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">
                            Key Features
                          </label>
                          <input
                            type="text"
                            value={realm.keyFeature || ''}
                            onChange={(e) => updateRealmField(idx, 'keyFeature', e.target.value)}
                            placeholder="Seven Summits • Permanent Glaciers • 360° Horizon"
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-orange-500/60 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Desktop Image + Upload */}
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-200 font-bold flex items-center gap-2">
                            <ImageIcon size={14} className="text-sky-400" />
                            <span>Desktop High-Res Background Image URL</span>
                          </label>
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 cursor-pointer font-bold text-[11px] transition">
                            <Upload size={12} />
                            <span>
                              {uploadingTarget === 'imageSrc' ? 'Uploading...' : 'Upload Image'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingTarget !== null}
                              onChange={(e) => handleFileUpload(e, 'imageSrc')}
                            />
                          </label>
                        </div>

                        <div className="flex gap-3 items-center">
                          <input
                            type="text"
                            value={realm.imageSrc || ''}
                            onChange={(e) => updateRealmField(idx, 'imageSrc', e.target.value)}
                            placeholder="/hero/summit_apex_5642.webp or https://..."
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono focus:border-orange-500/60 focus:outline-none"
                          />
                          {realm.imageSrc && (
                            <a
                              href={realm.imageSrc}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 w-10 h-9 rounded-lg overflow-hidden border border-white/10 bg-black block"
                              title="Preview"
                            >
                              <img src={realm.imageSrc} alt="" className="w-full h-full object-cover" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Mobile Image + Upload */}
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-slate-200 font-bold flex items-center gap-2">
                            <ImageIcon size={14} className="text-emerald-400" />
                            <span>Mobile Portrait Background Image URL</span>
                          </label>
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 cursor-pointer font-bold text-[11px] transition">
                            <Upload size={12} />
                            <span>
                              {uploadingTarget === 'imageMobileSrc' ? 'Uploading...' : 'Upload Mobile Photo'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingTarget !== null}
                              onChange={(e) => handleFileUpload(e, 'imageMobileSrc')}
                            />
                          </label>
                        </div>

                        <div className="flex gap-3 items-center">
                          <input
                            type="text"
                            value={realm.imageMobileSrc || ''}
                            onChange={(e) => updateRealmField(idx, 'imageMobileSrc', e.target.value)}
                            placeholder="/hero/summit_apex_5642_mobile.webp or https://..."
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono focus:border-orange-500/60 focus:outline-none"
                          />
                          {realm.imageMobileSrc && (
                            <a
                              href={realm.imageMobileSrc}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 w-8 h-9 rounded-lg overflow-hidden border border-white/10 bg-black block"
                              title="Preview"
                            >
                              <img src={realm.imageMobileSrc} alt="" className="w-full h-full object-cover" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Alt text */}
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">
                          SEO Image Alt Description
                        </label>
                        <input
                          type="text"
                          value={realm.altText || ''}
                          onChange={(e) => updateRealmField(idx, 'altText', e.target.value)}
                          placeholder="Mount Elbrus Supreme Apex 5,642m panoramic summit vista"
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-orange-500/60 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: HERO HEADINGS & CTA BUTTONS
      ========================================================================= */}
      {activeSubTab === 'hero_headings' && (
        <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/[0.08] space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Edit3 size={16} className="text-orange-400" />
              <span>Monumental Hero Headline &amp; Call-To-Action</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Controls the centerpiece typography and primary action buttons overlaying the mountain panoramic view.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Monumental Headline */}
            <div>
              <label className="block text-slate-200 font-bold mb-1">
                Primary Hero Headline
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Use a newline (<kbd className="px-1.5 py-0.5 rounded bg-black/40 text-orange-400 font-mono">Enter</kbd>) to split into two luxury monumental lines.
              </p>
              <textarea
                rows={2}
                value={settings.heroTitle || ''}
                onChange={(e) => updateSettingsField('heroTitle', e.target.value)}
                placeholder={"WELCOME TO\nTHE CAUCASUS"}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white font-serif text-base font-bold focus:border-orange-500/60 focus:outline-none leading-tight"
              />
            </div>

            {/* Micro Badge */}
            <div>
              <label className="block text-slate-200 font-bold mb-1">
                Top Horizon Micro-Badge (Tracking Amber Ribbon)
              </label>
              <input
                type="text"
                value={settings.promoBadgeText || ''}
                onChange={(e) => updateSettingsField('promoBadgeText', e.target.value)}
                placeholder="THE GREATER CAUCASUS • 2026 EXPEDITIONS"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono focus:border-orange-500/60 focus:outline-none"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-slate-200 font-bold mb-1">
                Hero Subtitle Narrative
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                Positioned underneath the main headline, describes your guides, refuge, and safety telemetry.
              </p>
              <textarea
                rows={3}
                value={settings.heroSubtitle || ''}
                onChange={(e) => updateSettingsField('heroSubtitle', e.target.value)}
                placeholder="Premier alpine expeditions, ski tours, and guided Elbrus ascents led by certified mountain guides. Private high-altitude refuge at Garabashi Barrels, 3,800 m."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-orange-500/60 focus:outline-none leading-relaxed"
              />
            </div>

            {/* CTA Group */}
            <div className="pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Primary CTA */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <ArrowRight size={14} className="text-orange-400" />
                  <span>Primary Button (Orange Fill)</span>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={settings.heroPrimaryCtaText || ''}
                    onChange={(e) => updateSettingsField('heroPrimaryCtaText', e.target.value)}
                    placeholder="EXPLORE EXPEDITIONS"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold focus:border-orange-500/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Target Link / Anchor</label>
                  <input
                    type="text"
                    value={settings.heroPrimaryCtaLink || ''}
                    onChange={(e) => updateSettingsField('heroPrimaryCtaLink', e.target.value)}
                    placeholder="#expeditions"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono focus:border-orange-500/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <MessageCircle size={14} className="text-emerald-400" />
                  <span>Secondary Button (Concierge WhatsApp)</span>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={settings.heroSecondaryCtaText || ''}
                    onChange={(e) => updateSettingsField('heroSecondaryCtaText', e.target.value)}
                    placeholder="WHATSAPP CONCIERGE"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold focus:border-orange-500/60 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Custom Link (Leave blank for default WhatsApp)</label>
                  <input
                    type="text"
                    value={settings.heroSecondaryCtaLink || ''}
                    onChange={(e) => updateSettingsField('heroSecondaryCtaLink', e.target.value)}
                    placeholder="https://wa.me/... or leave blank for auto"
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono focus:border-orange-500/60 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: HOMEPAGE BLOCKS & SECTIONS MANAGER
      ========================================================================= */}
      {activeSubTab === 'sections' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers size={16} className="text-orange-400" />
              <span>WordPress Gutenberg-Style Sections Manager</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Toggle any block ON or OFF on the public homepage, and customize its section titles and descriptive narratives.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Block 1: Expeditions Showcase */}
            <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                    <Mountain size={18} />
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm">
                      1. Featured Expeditions Catalog (#expeditions)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Shows the full catalog filter tabs and bookable tour routes directly below hero.
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections.expeditions?.enabled !== false}
                    onChange={(e) => updateSectionField('expeditions', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {sections.expeditions?.enabled !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-white/[0.06]">
                  <div>
                    <label className="block text-slate-400 mb-1">Badge</label>
                    <input
                      type="text"
                      value={sections.expeditions?.badge || ''}
                      onChange={(e) => updateSectionField('expeditions', 'badge', e.target.value)}
                      placeholder="Caucasus Climbing & Ski Touring • 2026 Season"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Headline</label>
                    <input
                      type="text"
                      value={sections.expeditions?.title || ''}
                      onChange={(e) => updateSectionField('expeditions', 'title', e.target.value)}
                      placeholder="Featured 2026 Expeditions"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Description Subtitle</label>
                    <input
                      type="text"
                      value={sections.expeditions?.subtitle || ''}
                      onChange={(e) => updateSectionField('expeditions', 'subtitle', e.target.value)}
                      placeholder="All expeditions include private high-camp accommodation..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Block 2: International Trust Bento */}
            <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                    <Globe size={18} />
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm">
                      2. International Trust &amp; Accreditation Bento
                    </div>
                    <div className="text-[11px] text-slate-400">
                      FSB Border clearance, rescue guarantee, price parity calculator, UIAGM guides.
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections.trustBento?.enabled !== false}
                    onChange={(e) => updateSectionField('trustBento', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {sections.trustBento?.enabled !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-white/[0.06]">
                  <div>
                    <label className="block text-slate-400 mb-1">Badge</label>
                    <input
                      type="text"
                      value={sections.trustBento?.badge || ''}
                      onChange={(e) => updateSectionField('trustBento', 'badge', e.target.value)}
                      placeholder="International Alpinist Assurances • 2026 Protocol"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Headline</label>
                    <input
                      type="text"
                      value={sections.trustBento?.title || ''}
                      onChange={(e) => updateSectionField('trustBento', 'title', e.target.value)}
                      placeholder="Global Standards & Bureaucracy-Free Access"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Description Subtitle</label>
                    <input
                      type="text"
                      value={sections.trustBento?.subtitle || ''}
                      onChange={(e) => updateSectionField('trustBento', 'subtitle', e.target.value)}
                      placeholder="Climbing in the Caucasus as a foreign citizen..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Block 3: High-Altitude Acclimatization Profile */}
            <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Sliders size={18} />
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm">
                      3. High-Altitude Acclimatization Profile
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Scientific multi-stage elevation acclimatization graph and physiological stages.
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections.acclimatization?.enabled !== false && settings.showAcclimatization !== false}
                    onChange={(e) => {
                      updateSectionField('acclimatization', 'enabled', e.target.checked);
                      updateSettingsField('showAcclimatization', e.target.checked);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {sections.acclimatization?.enabled !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-white/[0.06]">
                  <div>
                    <label className="block text-slate-400 mb-1">Badge</label>
                    <input
                      type="text"
                      value={sections.acclimatization?.badge || ''}
                      onChange={(e) => updateSectionField('acclimatization', 'badge', e.target.value)}
                      placeholder="Atmospheric Physiology & Route Profile"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Headline</label>
                    <input
                      type="text"
                      value={sections.acclimatization?.title || ''}
                      onChange={(e) => updateSectionField('acclimatization', 'title', e.target.value)}
                      placeholder="High-Altitude Acclimatization"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Description Subtitle</label>
                    <input
                      type="text"
                      value={sections.acclimatization?.subtitle || ''}
                      onChange={(e) => updateSectionField('acclimatization', 'subtitle', e.target.value)}
                      placeholder="Reaching 5,642 meters safely requires gradual exposure..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Block 4: Barrels-Garabashi 3,800m Base Camp */}
            <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm">
                      4. The Barrels-Garabashi 3,800 M Refuge Showcase
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Heated cylindrical cabins, private chef, 220V generator, direct glacier access.
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections.barrels?.enabled !== false}
                    onChange={(e) => updateSectionField('barrels', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {sections.barrels?.enabled !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-white/[0.06]">
                  <div>
                    <label className="block text-slate-400 mb-1">Badge</label>
                    <input
                      type="text"
                      value={sections.barrels?.badge || ''}
                      onChange={(e) => updateSectionField('barrels', 'badge', e.target.value)}
                      placeholder="Private High-Altitude Refuge • 3,800 M"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Headline</label>
                    <input
                      type="text"
                      value={sections.barrels?.title || ''}
                      onChange={(e) => updateSectionField('barrels', 'title', e.target.value)}
                      placeholder="The Barrels-Garabashi Base Camp"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Description Subtitle</label>
                    <input
                      type="text"
                      value={sections.barrels?.subtitle || ''}
                      onChange={(e) => updateSectionField('barrels', 'subtitle', e.target.value)}
                      placeholder="Unlike operators who rely on crowded public huts..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Block 5: Alpine Gear Checklist & Warehouse */}
            <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck size={18} />
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm">
                      5. Alpine Gear Checklist &amp; Rental
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Interactive gear list and rental equipment prices in Terskol warehouse.
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections.gear?.enabled !== false && settings.showGearRental !== false}
                    onChange={(e) => {
                      updateSectionField('gear', 'enabled', e.target.checked);
                      updateSettingsField('showGearRental', e.target.checked);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {sections.gear?.enabled !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-white/[0.06]">
                  <div>
                    <label className="block text-slate-400 mb-1">Badge</label>
                    <input
                      type="text"
                      value={sections.gear?.badge || ''}
                      onChange={(e) => updateSectionField('gear', 'badge', e.target.value)}
                      placeholder="Mountaineering Readiness"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Headline</label>
                    <input
                      type="text"
                      value={sections.gear?.title || ''}
                      onChange={(e) => updateSectionField('gear', 'title', e.target.value)}
                      placeholder="Alpine Gear & Legal Checklist"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Description Subtitle</label>
                    <input
                      type="text"
                      value={sections.gear?.subtitle || ''}
                      onChange={(e) => updateSectionField('gear', 'subtitle', e.target.value)}
                      placeholder="Track your gear preparations online..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Block 6: Guaranteed Schedule 2026 Timetable */}
            <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                    <Calendar size={18} />
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm">
                      6. Guaranteed Expedition Timetable
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Summary dates list with guaranteed departures and instant inquiry.
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections.schedule?.enabled !== false}
                    onChange={(e) => updateSectionField('schedule', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {sections.schedule?.enabled !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-white/[0.06]">
                  <div>
                    <label className="block text-slate-400 mb-1">Badge</label>
                    <input
                      type="text"
                      value={sections.schedule?.badge || ''}
                      onChange={(e) => updateSectionField('schedule', 'badge', e.target.value)}
                      placeholder="Guaranteed Departures"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Headline</label>
                    <input
                      type="text"
                      value={sections.schedule?.title || ''}
                      onChange={(e) => updateSectionField('schedule', 'title', e.target.value)}
                      placeholder="2026 Expedition Timetable"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Description Subtitle</label>
                    <input
                      type="text"
                      value={sections.schedule?.subtitle || ''}
                      onChange={(e) => updateSectionField('schedule', 'subtitle', e.target.value)}
                      placeholder="Early reservation is required for high-season permits..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Block 7: Comprehensive Logistics & Safety */}
            <div className="p-5 rounded-2xl bg-[#0B101D] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck size={18} />
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm">
                      7. Comprehensive Alpine Logistics &amp; Safety
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Mineralnye Vody transfers, satellite SOS, EMERCOM registration, guide ratios.
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sections.logistics?.enabled !== false}
                    onChange={(e) => updateSectionField('logistics', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {sections.logistics?.enabled !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-white/[0.06]">
                  <div>
                    <label className="block text-slate-400 mb-1">Badge</label>
                    <input
                      type="text"
                      value={sections.logistics?.badge || ''}
                      onChange={(e) => updateSectionField('logistics', 'badge', e.target.value)}
                      placeholder="Safety Protocols & Legal Staging"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Headline</label>
                    <input
                      type="text"
                      value={sections.logistics?.title || ''}
                      onChange={(e) => updateSectionField('logistics', 'title', e.target.value)}
                      placeholder="Comprehensive Alpine Logistics & Safety"
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Description Subtitle</label>
                    <input
                      type="text"
                      value={sections.logistics?.subtitle || ''}
                      onChange={(e) => updateSectionField('logistics', 'subtitle', e.target.value)}
                      placeholder="High-altitude mountaineering demands rigorous operational safety..."
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: TOP ANNOUNCEMENT & SEASON STATUS
      ========================================================================= */}
      {activeSubTab === 'announcement' && (
        <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/[0.08] space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-orange-400" />
              <span>📢 Top Announcement Ribbon &amp; Season Status</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Controls the urgent notice banner across the top header bar and season availability status.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Announcement Ribbon Toggle */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Enable Top Announcement Ribbon</div>
                <div className="text-[11px] text-slate-400">
                  Displays a prominent high-contrast ribbon at the very top of all site pages.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.announcementActive}
                  onChange={(e) => updateSettingsField('announcementActive', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            <div>
              <label className="block text-slate-200 font-bold mb-1">
                Announcement Banner Text
              </label>
              <input
                type="text"
                value={settings.announcementText || ''}
                onChange={(e) => updateSettingsField('announcementText', e.target.value)}
                placeholder="Season 2026: 10% Early Bird Privilege on Greater Caucasus Expeditions!"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-orange-500/60 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-200 font-bold mb-1">
                Expedition Season Status Tag
              </label>
              <input
                type="text"
                value={settings.seasonStatus || ''}
                onChange={(e) => updateSettingsField('seasonStatus', e.target.value)}
                placeholder="Active Season — 2026 Expeditions Booking Open"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-orange-500/60 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 5: QUICK MEDIA UPLOADER & ASSET LIBRARY
      ========================================================================= */}
      {activeSubTab === 'uploader' && (
        <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/[0.08] space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Upload size={16} className="text-orange-400" />
              <span>Direct Photo Uploader &amp; Media Helper</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload photos directly to the server (<code className="text-sky-300">/uploads/</code>). Click any uploaded photo URL to copy it and paste into slides or tours.
            </p>
          </div>

          {/* Upload Drop Area */}
          <div className="p-8 rounded-2xl border-2 border-dashed border-white/15 hover:border-orange-500/50 transition-colors text-center bg-white/[0.01]">
            <input
              ref={quickUploaderRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e)}
            />
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mx-auto">
                {uploadingTarget === 'quick' ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Upload size={24} />
                )}
              </div>
              <div className="text-sm font-bold text-white">
                {uploadingTarget === 'quick' ? 'Uploading to server...' : 'Upload Image to Server'}
              </div>
              <p className="text-xs text-slate-400">
                Supports JPG, PNG, WebP, SVG. Automatically optimized and saved in web root.
              </p>
              <button
                type="button"
                disabled={uploadingTarget !== null}
                onClick={() => quickUploaderRef.current?.click()}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition cursor-pointer disabled:opacity-50"
              >
                Choose Photo from Computer
              </button>
            </div>
          </div>

          {/* Uploaded Photos History */}
          {lastUploadedUrls.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <div className="text-xs font-bold text-slate-200">
                Recently Uploaded in This Session:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {lastUploadedUrls.map((url) => {
                  const isCopied = copiedUrl === url;
                  return (
                    <div
                      key={url}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center gap-3 group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-[10px] text-slate-300 truncate">
                          {url}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(url)}
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 hover:text-orange-300"
                        >
                          {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          <span>{isCopied ? 'Copied URL!' : 'Copy URL'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Save Bar */}
      <div className="sticky bottom-6 z-30 p-4 rounded-2xl bg-[#070D18]/95 border border-white/15 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {localDirty ? (
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>You have unsaved homepage changes</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>All changes saved &amp; synchronized</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-semibold text-slate-200 transition"
          >
            <Eye size={13} className="text-sky-400" />
            <span>Preview Site</span>
          </a>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-xl shadow-orange-500/30 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>{saving ? 'Publishing...' : '💾 Save Homepage Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

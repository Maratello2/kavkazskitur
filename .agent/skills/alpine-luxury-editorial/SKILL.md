---
name: alpine-luxury-editorial
description: Luxury outdoor editorial design system inspired by Arc'teryx Veilance, Moncler Grenoble, and Chamonix Guides.
---
# Luxury Alpine Editorial System

## 1. Strict Zero-Emoji Rule
- Under NO circumstances use Unicode emojis (🏔️, 🔥, 📍, ⛷️, ⚡, etc.) in badges, headings, cards, or buttons.
- Exclusively use monochrome, fine-line vector icons from `lucide-react` (strokeWidth 1.5, size 14px-18px).
  - Location/Base: <MapPin className="w-3.5 h-3.5 text-sky-400" />
  - Elevation/Summit: <Mountain className="w-3.5 h-3.5 text-slate-400" />
  - Safety/Certification: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
  - Route Calendar: <Calendar className="w-3.5 h-3.5 text-slate-400" />

## 2. Color Hierarchy
- Canvas: Deep basalt black `#060B12` and obsidian slate `#0B1220`.
- Hairline Borders: `border-white/[0.08]` and subtle dividers `divide-white/[0.06]`.
- Brand Glacier Blue: Primary `#0284C7`, Hover `#0369A1`, Glow/Highlight `#38BDF8`.
- Accent Orange (Alpine Sunrise): `#C85A32` or `#FF6A00` strictly for urgent micro-badges or live stats.

## 3. Typography & Badges
- Micro-headers & Labels: `text-[10px] uppercase tracking-[0.22em] font-bold text-slate-400`.
- Display Headlines: Tight negative tracking (`tracking-tight font-extrabold text-white`).
- Glass Surfaces: `bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl`.

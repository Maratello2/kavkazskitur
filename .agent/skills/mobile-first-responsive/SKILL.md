---
name: mobile-first-responsive
description: Mobile-first responsive layout, touch ergonomics, iOS Safari dvh viewport fixes, bottom sheets, and touch performance optimization for Tailwind CSS and React.
---
# Mobile-First Responsive Craft & Touch Ergonomics

## 1. Viewport & Layout Geometry (Zero Horizontal Scroll)
- **100dvh over 100vh:** Never use `h-screen` or `h-[100vh]` for mobile hero/full-height sections. Use `min-h-[100dvh]` to account for dynamic mobile address bars (Safari / Chrome).
- **Safe Area Insets:** Floating bars and fixed headers must respect device notches:
  `pb-[max(1rem,env(safe-area-inset-bottom))]` and `pt-[max(1rem,env(safe-area-inset-top))]`.
- **Zero Horizontal Overflow:** Never use `w-screen` when scrollbars exist. Use `w-full max-w-full overflow-x-clip` on layout roots to prevent side-scrolling glitches.

## 2. Touch Ergonomics & Apple HIG Guidelines
- **Minimum Tap Targets:** All interactive triggers (buttons, icons, menu toggles, form fields) must have a minimum clickable area of 44x44px (`min-h-[44px] min-w-[44px]`).
- **Thumb Zone Design:** Critical action buttons (e.g. WhatsApp, Book Now) on mobile screens (< 768px) must be pinned to the bottom as a sticky bar or floating FAB, easily reachable by one hand.
- **Touch State Feedback:** Remove ugly blue highlight taps: `tap-highlight-transparent` (`-webkit-tap-highlight-color: transparent;`). Use instant opacity changes (`active:opacity-75 active:scale-[0.98]`).

## 3. Mobile Navigation & Drawers
- On screens `< 1024px`, collapse horizontal headers into an accessible hamburger triggering either:
  - A clean full-screen frosted glass overlay (`bg-[#060B12]/95 backdrop-blur-2xl`).
  - An iOS-style Bottom Sheet (drawer) with smooth drag-to-dismiss gesture.
- Lock body scroll when mobile menu is open (`document.body.style.overflow = 'hidden'`).

## 4. Mobile GPU & Touch Optimization
- **Disable Mouse Parallax on Touch:** Always wrap 3D cursor tilt and cursor tracking in `@media (hover: hover) and (pointer: fine)`. Do not run expensive mouse-move listeners on touch devices.
- **Three.js Mobile Fallback:** On mobile viewports, reduce WebGL pixel ratio to `1.0` or replace complex 3D meshes with an optimized 2.5D CSS parallax / compressed WebP illustration.
- **Font Sizing:** Prevent iOS Safari auto-zoom on input focus by ensuring all form inputs have `text-base` (minimum 16px) on mobile viewports.

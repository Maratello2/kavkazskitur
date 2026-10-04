---
name: responsive-mobile-craft
description: Production-grade mobile-first responsive layout, touch ergonomics, iOS Safari fixes, and adaptive component transformation.
---
# Mobile-First Responsive Craft

## 1. Core Layout & Safari Geometry
- **Use Dynamic Viewport Units:** Never use `100vh` for full-height heroes or drawers. Always use `min-h-[100dvh]` to handle mobile browser address bars.
- **Safe Area Insets:** Fixed navigation and floating action buttons must include notch clearance:
  - `pb-[max(1rem,env(safe-area-inset-bottom))]`
  - `pt-[max(1rem,env(safe-area-inset-top))]`
- **Zero Horizontal Jitter:** Never apply `w-screen` inside scroll containers. Use `w-full max-w-full overflow-x-clip` on root elements.

## 2. Touch Ergonomics (Apple HIG)
- **Minimum Tap Targets:** All buttons, icons, links, and accordion triggers must have a clickable area of at least 44x44px (`min-h-[44px] min-w-[44px]`).
- **iOS Safari Focus Bug:** Form inputs, selects, and textareas must have `text-base` (>= 16px) on viewports `< 768px` to prevent automatic zoom on focus.
- **Touch State Feedback:** Remove the mobile grey tap overlay using `-webkit-tap-highlight-color: transparent;` (`tap-highlight-transparent`). Use active scale/opacity (`active:scale-[0.98] active:opacity-80`).

## 3. Adaptive Component Transformations
- **Tables to Cards:** On `< 768px`, transform multi-column comparison tables (gear lists, acclimatization charts) into stacked, collapsable card layouts.
- **Dropdowns to Bottom Sheets:** Transform complex desktop navigation menus into swipeable bottom sheets (Drawers) with backdrops rather than floating dropdowns.
- **Thumb-Zone CTAs:** Crucial conversion buttons (e.g., WhatsApp booking) must remain within the thumb reach zone (bottom 25% of the mobile screen).

## 4. Mobile GPU Performance
- **Isolate Mouse Handlers:** Always guard mouse listeners and 3D tilt effects with `@media (hover: hover) and (pointer: fine)`.
- **Image Density:** Deliver modern WebP/AVIF formats with explicit `aspect-ratio` wrappers to eliminate Cumulative Layout Shift (CLS).

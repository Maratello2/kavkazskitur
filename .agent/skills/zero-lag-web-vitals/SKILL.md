---
name: zero-lag-web-vitals
description: Performance optimization eliminating React re-renders, backdrop-blur GPU bottlenecks, and layout shifts.
---
# Web Vitals & 60 FPS Architecture

## 1. Zero-Lag Mouse Tracking
- NEVER store cursor coordinates in React state (`useState`) inside `onMouseMove`.
- Direct DOM mutations only: write coordinates to CSS custom variables (`--mouse-x`, `--mouse-y`) on parent ref.

## 2. GPU Overdraw Elimination
- NEVER place heavy `backdrop-filter: blur(...)` inside elements with active 3D transforms (`rotateX`, `rotateY`, `translateZ`).
- Use solid alpha backgrounds (`bg-[#0B1523]/95`) inside tilted 3D cards to preserve 60 FPS on all GPUs.

## 3. Zero CLS Images
- All images must use explicit aspect-ratio wrappers (`aspect-[16/9]`, `aspect-[4/3]`) or Next.js `Image` with fixed dimensions.
- Convert all uploaded assets to WebP (quality: 82%).

---
name: threejs-mountain-flythrough
description: High-performance 3D camera fly-through through alpine mountain passes and ridges in Three.js and WebGL.
---
# Three.js Mountain Terrain & Fly-Through Rules

## 1. Visual Standards (No Wireframe Cubes / Sci-Fi Rings)
- Render realistic organic ridges or layered low-poly relief with atmospheric exponential fog (`THREE.FogExp2(0x060B12, 0.015)`).
- Use dynamic dual lighting: cool ambient glacier light (`0x38BDF8`) + warm directional sunrise light (`0xFF6A00`).
- If full 3D terrain causes device frame drops, smoothly degrade to multi-layer 2.5D Parallax with canyon split-drift.

## 2. Strict Memory & GPU Leak Prevention
- Always dispose in `useEffect` cleanup:
  - `geometry.dispose()`
  - `material.dispose()`
  - `renderer.dispose()`
  - `renderer.forceContextLoss()`
- Restrict pixel ratio: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))`.
- Isolate Next.js client components: import 3D canvas via `dynamic(() => import(...), { ssr: false })`.

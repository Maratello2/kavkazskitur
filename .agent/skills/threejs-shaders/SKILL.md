---
name: threejs-shaders
description: Custom GLSL shaders for alpine terrains, snow line thresholds, and high-performance WebGL lighting.
---
# Rules
- Use procedural GLSL noise and elevation-based vertex coloring instead of loading heavy multi-megabyte 4K diffuse maps.
- Ensure all custom shaders support fallback to standard WebGL materials if shader compilation fails.
- Cap DPR strictly at Math.min(window.devicePixelRatio, 1.5).

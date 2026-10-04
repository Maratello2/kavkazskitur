---
name: motion-craft
description: Advanced UI animations, interactive micro-states, scroll reveals, and kinetic effects inspired by motionsites.ai.
---
# Motion Craft & Interactive Polish

## Core Animation Patterns
1. **Scroll-Driven Reveals (Staggered Entry):**
   - Use `framer-motion` variants with staggered children (`staggerChildren: 0.08`).
   - Standard reveal: `initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}` with `transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}`.

2. **Magnetic & Fluid Buttons:**
   - Buttons should react slightly to cursor proximity or provide immediate tactile feedback on click (`active:scale-95 transition-transform duration-100`).
   - Floating pill navigation with seamless `layoutId` active indicators.

3. **Spotlight & Glass Hover Effects (Bento Grids):**
   - Cards in grids should track the mouse cursor for subtle radial gradients:
     `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.06), transparent 80%)`.
   - Subtle borders that light up when hovered.

4. **Numeric Stat Tickers (Count-up):**
   - Any metric or expedition stat (e.g. 5,642m, 20 years, 85,000 ₽) should animate smoothly into view upon scrolling using an easing curve.

5. **Smooth Accordions & Modals:**
   - Always wrap expanding containers in `AnimatePresence` with explicit `layout` tags.
   - Use damping physics: `{ type: "spring", stiffness: 300, damping: 28 }`.

## Performance Rule
- Animate strictly `transform` (`x`, `y`, `scale`) and `opacity`. Never animate `width`, `height`, `top`, `left`, or `margin` directly.

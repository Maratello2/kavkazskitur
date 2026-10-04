---
name: emil-design
description: Micro-interactions, spring physics, and craft details inspired by Emil Kowalski.
---

# Emil Kowalski Interaction & Craft Rules
- Springs over Easing: Use physics-based springs instead of linear or cubic-bezier curves (`type: "spring", stiffness: 350, damping: 30`).
- Perceived Snappiness: UI micro-transitions must be fast (120ms to 180ms). Never exceed 250ms for routine actions.
- Tactile Scaling: Interactive cards and buttons should have subtle press states (`active:scale-[0.98] transition-transform duration-150`).
- Layout Transitions: Use Framer Motion `layout` and `layoutId` for tabs, active pills, and floating indicators instead of sudden DOM jumps.
- Visual Balance: Mathematically centered icons often look off-center. Add 0.5px/1px optical compensation when grouping text with icons.

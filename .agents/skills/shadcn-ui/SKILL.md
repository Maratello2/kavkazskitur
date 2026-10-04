---
name: shadcn-ui
description: Component architecture rules following shadcn/ui and Radix UI primitives.
---

# shadcn/ui Architecture Rules
- Primitives First: Base interactive components (Dialog, DropdownMenu, Tooltip, Select, Popover) on Radix UI primitives.
- Class Merging: Always combine classes using `cn()` (`clsx` + `tailwind-merge`) to avoid specificity conflicts.
- State Variants: Use `class-variance-authority` (cva) for button, badge, and input variants.
- Slot Composition: Use `asChild` via Radix Slot so interactive elements can render as Next.js `<Link>` without invalid nested tags.
- Accessibility: Ensure proper keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-sky-500`) and ARIA roles.

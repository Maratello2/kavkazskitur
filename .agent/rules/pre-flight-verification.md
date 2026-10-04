# Pre-Flight Verification & Zero-Regression Rule
> **Master Reference**: См. полную единую базу знаний проекта в [`PROJECT_KNOWLEDGE_BASE.md`](file:///d:/Desktop/kavkazskitur/PROJECT_KNOWLEDGE_BASE.md).

## 1. The Dev Server vs Build Invariant (CRITICAL)
- In Next.js, running `npm run build` writes to `.next/` and deletes the active development chunk manifests.
- If `npm run dev` is running while `npm run build` is executed, the running dev server will immediately serve 404 for all CSS stylesheets (`/_next/static/css/...`), causing the browser to render raw unstyled HTML.
- **MANDATORY PROCEDURE**:
  1. If `npm run build` is ever executed, immediately restart `npm run dev` afterwards.
  2. Clear stale cache if needed.
  3. Never finish a turn without verifying that `http://localhost:3000` serves all CSS stylesheets with `HTTP 200 OK` and size > 200KB.

## 2. Pre-Flight Checklist Before Responding
Before presenting ANY completed work to the user:
- [ ] Run `node scripts/verify-health.js` to verify all routes (`/`, `/expeditions`, `/tours/*`, `/barrels`, `/schedule`, `/acclimatization`, `/safety`).
- [ ] Verify that stylesheets return HTTP 200 with complete CSS payloads.
- [ ] Verify that no 404s appear in the server log.
- [ ] Verify mobile layout ergonomics (no horizontal scroll, 44x44px touch targets).
- [ ] Maintain approved brand color `#FF6A00` across all components.
- [ ] Ensure strict adherence to standards in [`PROJECT_KNOWLEDGE_BASE.md`](file:///d:/Desktop/kavkazskitur/PROJECT_KNOWLEDGE_BASE.md).


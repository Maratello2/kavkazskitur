---
name: engineering-culture
description: Engineering excellence and discipline methodology inspired by Addy Osmani (ex-Google AI Engineering Director). Enforces spec-driven planning, anti-rationalization tables, zero-shortcut verification, and rigorous shipping standards for AI coding agents.
---

# Engineering Culture & Quality Gates (Addy Osmani Methodology)

This skill encodes the standards of senior engineering leadership at scale. AI agents naturally lean toward optimistic shortcuts, rationalizing away edge cases, skipping verification, or delivering incomplete implementations. This skill makes quality gates mandatory and non-negotiable.

---

## 1. The Core Lifecycle Phases

### Phase 1: Spec-Driven Planning (`/spec`)
- **Explicit Invariants**: Before writing any implementation code, specify the exact contract, data types, props, and boundary behaviors.
- **Identify Failure Modes**: Determine how the component, function, or API will fail before deciding how it will succeed.
- **Progressive Disclosure**: Break complex changes into verifiable work packets. Never attempt monolith edits across 10 files simultaneously.

### Phase 2: Surgical Implementation (`/build`)
- **Minimal Working Diff**: Make the smallest correct change that satisfies the spec. Do not touch or refactor unrelated code unless requested.
- **Preserve Documentation & Comments**: Never strip existing architectural notes, license headers, or comments.
- **Zero Mock Data in Production Logic**: If real data or props exist, bind them cleanly. No hidden `// TODO: add later` shortcuts.

### Phase 3: Doubt-Driven Review (`/review`)
- **Self-Interrogation**: Ask: *"What will break if network drops? What if a user enters 100 characters? What happens on mobile 360px?"*
- **Inspect Edge Cases**: Null checks, undefined fallbacks, hydration mismatches, layout shifts (CLS), touch target sizes (minimum 44x44px).

### Phase 4: Shipping Verification (`/ship`)
- **No Done Without Proof**: A task is never marked as done until verified with concrete command execution (`npm run build` or automated test suite).

---

## 2. Anti-Rationalization Table

AI agents frequently generate plausible-sounding justifications for cutting corners. Every agent operating under this skill must evaluate itself against this table:

| Agent Rationalization | Senior Engineer Reality Check | Required Action |
| :--- | :--- | :--- |
| *"The change is trivial, so I don't need to run a build."* | Trivial typos and missing imports cause 70% of build breakages. | Always run `npm run build` or the project linter. |
| *"I'll leave a placeholder or mock here for now."* | Unfinished placeholders in UI break user trust immediately. | Write full, working, functional code. |
| *"It looks good on desktop, mobile should be fine with Tailwind."* | Mobile screens reveal overflow, cut-off drawers, and unreachable tap targets. | Verify mobile viewports (< 768px), drawer gestures, and touch padding. |
| *"The user didn't mention error states, so default error is enough."* | Empty or broken states confuse users. | Provide clear inline feedback, empty states, and recovery actions. |
| *"I should rewrite this entire file to make it cleaner."* | Large unwieldy diffs introduce regressions and destroy subtle edge-case handling. | Make targeted, surgical edits with clear diffs. |

---

## 3. Strict Pre-Flight Checklist Before Responding

Before presenting any finished task to the user:
- [ ] **Type Integrity**: No TypeScript errors (`tsc --noEmit` or `next build`).
- [ ] **Production Build**: Clean `npm run build` exit code 0.
- [ ] **Mobile Ergonomics**: Tested touch ergonomics (< 768px, bottom sheets, safe-area-inset).
- [ ] **Performance & CLS**: No layout shifts, Skeleton loaders used for async states.
- [ ] **Zero Debug Garbage**: No leftover `console.log`, test alerts, or broken comments.

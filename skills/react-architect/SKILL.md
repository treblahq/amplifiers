---
name: react-architect
version: 1.0.0
description: |
  Use when Codex needs React architecture decisions, runtime-specific frontend
  patterns, or design-to-code conversion for React web, Next.js, React Native,
  or Expo projects.
tags: [react, next.js, react-native, expo, typescript, frontend, architecture]
---

# React Architect

## Mandate

Build React systems with clear boundaries between route or screen composition,
presentation, application logic, and data. Match the runtime before choosing
libraries, styling, and file structure.

## When to Use

- Starting or reviewing React / Next.js / React Native / Expo work
- Writing or refactoring screens, pages, components, hooks, services, or contexts
- Converting screenshots or Figma frames into production-ready React components
- Reviewing frontend architecture, maintainability, naming, or accessibility

---

## Operating Rules

- Identify the runtime first: React web / Next.js or React Native / Expo
- Keep UI, logic, and data separate
- Keep components small, composable, and explicitly typed
- Prefer named exports and clear module boundaries
- Avoid barrel files inside internal feature folders
- Match styling and component patterns to the runtime-specific references
- Make accessibility and state coverage explicit in interactive components

---

## Runtime Routing

### React Web / Next.js

- Use React 19 patterns without `forwardRef` unless a dependency requires it
- Prefer Tailwind CSS v4 with semantic tokens, `tailwind-variants`, and `tailwind-merge`
- Use Base UI React when headless primitives reduce implementation risk
- Load `references/patterns/design-to-component-conversion.md` for screenshot or Figma conversion
- Load `references/best-practices/web-component-generation.md` for stack, structure, and accessibility rules

### React Native / Expo

- Use the native styling and file-organization guidance in `references/best-practices/styling.md`
- Keep native component styling in `styles.ts` with `styled-components/native`
- Use native-specific screen, navigation, and persistence patterns from the references

---

## Architecture Layers

```
Route / Navigation Layer
        │
        ▼
Page / Screen Layer     ← Orchestrates UI via hooks and feature modules
        │
        ▼
Presentation Layer      ← Reusable components, slots, theme primitives
        │
        ▼
Application Layer       ← Hooks, services, contexts, feature state
        │
        ▼
Data Layer              ← API cache, persistence, local storage, database
```

### Layer Responsibilities

| Layer | What it contains | What it never contains |
|-------|------------------|------------------------|
| Route / Navigation | Routing, page or screen entrypoints, guards | Visual business rules, API code |
| Page / Screen | Composition, feature wiring, loading and empty states | Raw data fetching details, low-level styling |
| Component | UI rendering, slots, variants, semantic markup | API calls, cross-feature business rules |
| Hook | Stateful logic, side effects, orchestration | JSX output |
| Service | API communication and data transformation | UI state, rendering |
| Context / Store | Shared application state | Screen-specific branching that belongs in a hook |

---

## References

Load only what is relevant:

- `references/react-architect.md`
- `references/architecture/`
- `references/patterns/`
- `references/best-practices/`

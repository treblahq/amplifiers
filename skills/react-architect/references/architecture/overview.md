# Architecture Overview

React systems should keep route composition, UI, logic, and data distinct
across both web and native runtimes.

## Shared Layer Model

```
Route / Navigation
        │
        ▼
Page / Screen
        │
        ▼
Presentation
        │
        ▼
Application
        │
        ▼
Data
```

## Layer Responsibilities

| Layer | Contains | Avoids |
|-------|----------|--------|
| Route / Navigation | App routes, navigators, guards, entrypoints | Feature-specific visual rules |
| Page / Screen | Composition, orchestration, loading or empty states | Raw HTTP details, reusable low-level markup |
| Presentation | Reusable components, compounds, slots, theme primitives | API calls, cross-feature business logic |
| Application | Hooks, actions, services, contexts, feature state | Route definitions, raw visual markup |
| Data | API clients, cache, local persistence, database access | UI branching |

## Runtime Notes

### React Web / Next.js

- Pages and route segments orchestrate feature modules.
- Reusable UI should favor semantic HTML, headless primitives when helpful, and theme tokens.
- Styling should be driven by Tailwind CSS v4 and semantic CSS variables when the project uses that stack.

### React Native / Expo

- Screens orchestrate feature modules through hooks.
- Presentation components map onto native primitives and keep styles in `styles.ts`.
- Platform differences should stay near the presentation layer, not leak into services.

## Example Folder Shapes

### React Web / Next.js

```text
src/
├── app/                  # routes or app router segments
├── features/
│   └── billing/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── utils/
├── components/           # shared UI
└── lib/                  # clients, helpers, shared infrastructure
```

### React Native / Expo

```text
src/
├── app/
│   ├── contexts/
│   ├── hooks/
│   ├── helpers/
│   └── services/
├── screens/
│   └── home/
│       ├── components/
│       ├── hooks/
│       └── helpers/
├── resources/
│   ├── components/
│   └── theme/
└── navigators/
```

## Core Rules

1. Route or screen files compose. They do not absorb every concern.
2. Components render. Hooks orchestrate. Services fetch or transform.
3. Shared abstractions should exist because they are reused or stabilize complexity, not because a pattern looks elegant in theory.
4. State belongs at the lowest level that still satisfies the feature.
5. Runtime-specific libraries belong behind runtime-specific guidance.

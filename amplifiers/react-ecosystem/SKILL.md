---
name: react-ecosystem
version: 1.0.0
source: trebla/co-workers/software-architect/react
description: |
  Architecture, patterns, and naming conventions for React, Next.js, and React Native
  projects. Covers component-based architecture, hooks, services, state management,
  navigation, and clean code principles.
tags: [react, next.js, react-native, expo, typescript, frontend, architecture]
---

# React Ecosystem Architecture

## Mandate

Build React web and React Native applications with a component-based architecture that separates UI, logic, and data into clear, composable layers. Code must be self-documenting, testable, and easy to extend.

## When to Use

- Starting or reviewing a React / Next.js / React Native project
- Writing new screens, components, hooks, or services
- Code review of frontend code

---

## Architecture Layers

```
Navigation Layer
     │
     ▼
Screen Layer          ← Orchestrates UI and logic via hooks
     │
     ▼
Presentation Layer    ← Reusable components + theme
     │
     ▼
Application Layer     ← Hooks, services, contexts
     │
     ▼
Data Layer            ← API cache, local DB, simple KV storage
```

### Layer Responsibilities

| Layer      | What it contains                                      | What it never contains                  |
|------------|-------------------------------------------------------|-----------------------------------------|
| Screen     | Composition of components, calls hooks                | Business logic, inline data fetching    |
| Component  | UI rendering, accepts props                           | Business logic, direct API calls        |
| Hook       | Stateful logic, side effects, data fetching           | UI rendering                            |
| Helper     | Pure functions: calculations, formatting, transforms  | State, side effects                     |
| Service    | API communication, data transformation                | State, UI, direct component calls       |
| Context    | Global shared state (auth, theme, config)             | Complex computation, business logic     |

---

## Folder Structure

```
src/
├── app/
│   ├── constants/         # App-wide constants
│   ├── contexts/          # Global state (auth, theme, etc.)
│   ├── hooks/             # Global custom hooks
│   ├── helpers/           # Pure utility functions
│   ├── services/          # API integrations
│   ├── enums/             # Type-safe enumerations
│   └── entities/          # Shared type definitions
├── screens/
│   └── screen-name/
│       ├── index.tsx      # Main screen component
│       ├── components/    # Screen-specific components
│       ├── hooks/         # Screen-specific hooks
│       ├── helpers/       # Screen-specific helpers
│       └── types/         # Screen-specific types
├── resources/
│   ├── components/        # Global reusable components
│   └── theme/             # Theme configuration
└── navigators/            # Navigation configuration
```

**Key rule:** Always use `@` path aliases. Never use relative imports (`../../`).

---

## Hooks Pattern

Hooks encapsulate **stateful logic and side effects**.

**Rules:**
- One responsibility per hook — no "god hooks"
- Extract all stateful logic out of components
- Use `useCallback`/`useMemo` to prevent unnecessary re-renders
- Never put UI rendering inside a hook
- Use refs for tracking flags (not state)

**Naming:** `use` + PascalCase → `useDiscoverReel`, `useAuth`, `useProductList`
**File:** `entity-name.hook.ts` in kebab-case

```typescript
// screens/discover/hooks/use-discover-reel.hook.ts
export function useDiscoverReel() {
  const { data, isLoading } = useQuery({
    queryKey: [QueryTypes.REELS],
    queryFn: fetchReels,
  });

  return { reels: data ?? [], isLoading };
}
```

---

## Services Pattern

Services handle **API communication only**.

**Rules:**
- One service per API domain
- Transform raw API responses into typed entities
- No state, no side effects beyond the HTTP call
- Always typed return values

**Naming:** `entity.service.ts`

```typescript
// app/services/products.service.ts
export async function fetchProducts(establishmentId: number): Promise<Product[]> {
  const { data } = await api.get(`/products/?establishment=${establishmentId}`);
  return data;
}
```

---

## Components Pattern

Components are **pure UI**.

**Rules:**
- Accept typed props — always define an interface
- No direct API calls or business logic
- Extract logic to hooks when the component needs state
- Small and composable — one visual concern per component

```
user-profile/
├── index.tsx       # Component
├── styles.ts       # Styles
└── types.ts        # Props interface
```

---

## State Management Strategy

| What to store      | Where              |
|--------------------|--------------------|
| Server data / API  | React Query        |
| Auth, preferences  | Context            |
| Offline / local DB | Realm / SQLite     |
| Simple flags/tokens | MMKV / AsyncStorage |
| Component state    | `useState`         |

**React Query** is the default for anything that comes from an API. Do not duplicate server state in a Context.

---

## Naming Conventions

| Element      | Convention         | Example                          |
|--------------|--------------------|----------------------------------|
| Folder       | `kebab-case`       | `user-profile/`, `post-detail/`  |
| Component    | `PascalCase`       | `UserProfile`, `SearchInput`     |
| Hook fn      | `use` + PascalCase | `useAuth`, `useProductList`      |
| Hook file    | `entity.hook.ts`   | `use-auth.hook.ts`               |
| Service file | `entity.service.ts`| `products.service.ts`            |
| Helper file  | `entity.helper.ts` | `string.helper.ts`               |
| Enum file    | `entity.enum.ts`   | `tab-type.enum.ts`               |
| Screen       | `screens/name/index.tsx` | `screens/home/index.tsx`   |

---

## TypeScript Rules

- Enable strict mode
- Type all function arguments and return values
- Use interfaces for props and entity shapes
- Use enums for type-safe categorical values
- No `any` — use `unknown` when the shape is truly unknown

---

## Performance Rules

- Use `FlatList` / `VirtualizedList` for long lists — never `map` in a `ScrollView`
- Memoize expensive computations with `useMemo`
- Stabilize callbacks with `useCallback` when passed as props
- Lazy-load screens on navigation
- Avoid inline object/function creation inside `render` (causes re-renders)

---

## Anti-Patterns to Avoid

- Business logic inside components — extract to hooks
- API calls directly in components — extract to services
- "God hooks" that do everything — split by concern
- Relative imports (`../../components`) — use `@` aliases
- State for tracking booleans that don't trigger renders — use refs
- Duplicating server state in Context — use React Query
- Inline styles on every component — extract to `styles.ts`

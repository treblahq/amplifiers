# Architecture Overview

## Project Architecture

Ailu Mobile follows a **Component-Based Architecture with Clean Code principles** for React Native + Expo.

```
┌─────────────────────────────────────────┐
│        Navigation Layer                 │
│  - Stack Navigator (React Navigation)   │
│  - Deep Linking Configuration           │
│  - Route Guards (useNextBehavior)       │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│         Screen Layer                    │
│  - Screen Components (index.tsx)        │
│  - Screen-specific components/          │
│  - Screen-specific hooks/               │
│  - Screen-specific helpers/             │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│      Presentation Layer                 │
│  - Reusable Components (@components)    │
│  - Styled Components (styles.ts)        │
│  - Theme System (@theme)                │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│       Application Layer                 │
│  - Custom Hooks (@hooks)                │
│  - Services (@services)                 │
│  - Contexts (@contexts)                 │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│         Data Layer                      │
│  - Realm Database (local)               │
│  - React Query (API cache)              │
│  - MMKV/AsyncStorage (simple KV)        │
└─────────────────────────────────────────┘
```

## Core Principles

1. **Separation of Concerns**: UI, Logic, Data are cleanly separated
2. **Component Composition**: Small, reusable components over large monoliths
3. **Clean Code**: Self-documenting code, no inline logic
4. **Extract Logic**: All pure logic goes to helpers, all stateful logic to hooks
5. **Path Aliases**: Always use @ aliases, never relative imports
6. **Type Safety**: TypeScript strict mode, typed everything

## Folder Structure

```
src/
├── app/
│   ├── constants/         # App-wide constants
│   ├── contexts/          # Global state (auth, realm, etc.)
│   ├── hooks/             # Global custom hooks
│   ├── helpers/           # Pure utility functions
│   ├── services/          # API calls and data fetching
│   ├── enums/             # Type-safe enumerations
│   └── entities/          # Type definitions
├── screens/               # Screen components
│   └── screen-name/
│       ├── index.tsx      # Main screen
│       ├── components/    # Screen-specific components
│       ├── hooks/         # Screen-specific hooks
│       ├── helpers/       # Screen-specific helpers
│       └── types/         # Screen-specific types
├── resources/
│   ├── components/        # Global reusable components
│   └── theme/             # Theme configuration
├── navigators/            # Navigation configuration
├── configuration/         # App configuration (Sentry, etc.)
└── databases/             # Realm schemas and queries
```

## Request Flow

### API Request Flow

```
Component → Hook → Service → API → Response
    ↓         ↓        ↓
  Render   State   Transform → React Query Cache
```

### Local Data Flow (Realm)

```
Component → Hook → Realm Method → Database
    ↓         ↓         ↓
  Render   State   realm.write(() => {})
```

## Key Patterns

- **Screen**: Main view component, orchestrates UI and business logic via hooks
- **Component**: Reusable UI element, accepts props, minimal logic
- **Hook**: Encapsulates stateful logic, side effects, data fetching
- **Helper**: Pure functions for calculations, transformations, formatting
- **Service**: API communication, data transformation
- **Context**: Global state accessible throughout the app

## Navigation Architecture

### Stack Navigator

- **Public Stack**: Welcome, SignIn, SignUp, ForgotPassword
- **Private Stack**: Home, Profile, Settings, etc.
- **Common Stack**: Webview (shared between public/private)

### Route Guards

- `useBootstrap()`: Pre-navigation checks (auth, versioning, config)
- `useNextBehavior()`: Priority-based forced flows (updates, onboarding)

### Deep Linking

- Configured in `NavigationProvider`
- Pattern: `ailu://screen-name/:param`
- Handles: Password reset, external links, notifications

## State Management Strategy

### Use Contexts for:

- Authentication state
- User preferences
- App configuration
- Theme
- Navigation reference

### Use React Query for:

- API data fetching
- Server state caching
- Background refetching
- Optimistic updates

### Use Realm for:

- Offline-first data
- Chat messages
- User context
- Persistent local data

### Use MMKV/AsyncStorage for:

- Simple key-value storage
- Tokens, flags
- User preferences

## Performance Considerations

- **Lazy Loading**: Screens loaded on demand
- **Memoization**: `useMemo`, `useCallback` for expensive operations
- **FlatList**: Virtualized lists for large datasets
- **Image Optimization**: Proper resizeMode and caching
- **Bundle Size**: Code splitting, tree shaking

See detailed documentation in the `patterns/` directory for each layer.

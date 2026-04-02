# Contexts Pattern

## Purpose

Contexts provide **global state management** using `use-context-selector`:

- Authentication state
- User preferences
- App configuration
- Theme
- Feature flags

## Critical Rule

**ALWAYS use `use-context-selector`**, never standard React Context (performance issues).

## File Organization

```
src/app/contexts/
└── authentication/
    ├── index.tsx              # Main context provider
    ├── types.ts               # Types and interfaces
    └── helpers/               # Context-specific helpers
        └── auth.helper.ts
```

## Context Structure

```typescript
// @contexts/authentication/index.tsx
import React, { useState, useCallback, useMemo, PropsWithChildren } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { User } from '@entities/user';
import { AuthenticationState, AuthenticationActions } from './types';

type AuthenticationContextType = AuthenticationState & AuthenticationActions;

export const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export const AuthenticationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthenticationState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const signIn = useCallback(async (email: string, password: string) => {
    // Implementation
    setState((prev) => ({ ...prev, loading: true }));
    try {
      // API call
      const user = await authService.signIn(email, password);
      setState({ isAuthenticated: true, user, loading: false });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    setState({ isAuthenticated: false, user: null, loading: false });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      signIn,
      signOut,
    }),
    [state, signIn, signOut]
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

// Custom hooks
export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuthentication must be used within AuthenticationProvider');
  }
  return context;
};

// Selective hooks (better performance)
export const useAuthUser = () =>
  useContextSelector(AuthenticationContext, (state) => state?.user);

export const useIsAuthenticated = () =>
  useContextSelector(AuthenticationContext, (state) => state?.isAuthenticated);

export const useAuthActions = () =>
  useContextSelector(AuthenticationContext, (state) => ({
    signIn: state?.signIn,
    signOut: state?.signOut,
  }));
```

## Types

```typescript
// @contexts/authentication/types.ts
import { User } from "@entities/user";

export interface AuthenticationState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface AuthenticationActions {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}
```

## Usage in Components

```typescript
// Using selective hooks (PREFERRED)
import { useAuthUser, useIsAuthenticated } from '@contexts/authentication';

const MyComponent: React.FC = () => {
  const user = useAuthUser(); // Only re-renders when user changes
  const isAuthenticated = useIsAuthenticated(); // Only re-renders when auth status changes

  return <View>{user?.name}</View>;
};

// Using full context (when you need multiple values)
import { useAuthentication } from '@contexts/authentication';

const MyComponent: React.FC = () => {
  const { user, isAuthenticated, signOut } = useAuthentication();

  return <Button onPress={signOut}>Sign Out</Button>;
};
```

## Realm Context

```typescript
// @contexts/realm/index.tsx
import React, { PropsWithChildren } from 'react';
import { RealmProvider as RealmReactProvider } from '@realm/react';
import { MessageSchema } from '@databases/schemas/message.schema';
import { UserContextSchema } from '@databases/schemas/user-context.schema';

const realmConfig = {
  schema: [MessageSchema, UserContextSchema],
  schemaVersion: 1,
};

export const RealmProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <RealmReactProvider {...realmConfig}>{children}</RealmReactProvider>;
};
```

## Configuration Context

```typescript
// @contexts/configuration/index.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { fetchConfig } from '@services/config.service';

interface ConfigState {
  features: {
    chatEnabled: boolean;
    videosEnabled: boolean;
  };
  loading: boolean;
}

export const ConfigurationContext = createContext<ConfigState | null>(null);

export const ConfigurationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<ConfigState>({
    features: {
      chatEnabled: false,
      videosEnabled: false,
    },
    loading: true,
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await fetchConfig();
      setState({ features: config.features, loading: false });
    } catch (error) {
      console.error('Failed to load config:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const value = useMemo(() => state, [state]);

  return <ConfigurationContext.Provider value={value}>{children}</ConfigurationContext.Provider>;
};

// Selective hooks
export const useChatEnabled = () =>
  useContextSelector(ConfigurationContext, (state) => state?.features.chatEnabled ?? false);

export const useVideosEnabled = () =>
  useContextSelector(ConfigurationContext, (state) => state?.features.videosEnabled ?? false);
```

## Context Composition in App

```typescript
// App.tsx
import { AuthenticationProvider } from '@contexts/authentication';
import { RealmProvider } from '@contexts/realm';
import { ConfigurationProvider } from '@contexts/configuration';
import { NavigationProvider } from '@contexts/navigation';

export default function App() {
  return (
    <RealmProvider>
      <AuthenticationProvider>
        <ConfigurationProvider>
          <NavigationProvider>
            <MainNavigation />
          </NavigationProvider>
        </ConfigurationProvider>
      </AuthenticationProvider>
    </RealmProvider>
  );
}
```

## Best Practices

✅ **Use `use-context-selector`** - For performance
✅ **Memoize context value** - Use `useMemo`
✅ **Memoize callbacks** - Use `useCallback`
✅ **Create selective hooks** - `useAuthUser()` instead of `useAuth().user`
✅ **Separate state and actions** - Clear interface
✅ **Type everything** - Full TypeScript coverage

❌ **Don't use React.createContext** - Use `createContext` from `use-context-selector`
❌ **Don't forget to memoize** - Causes unnecessary re-renders
❌ **Don't put everything in context** - Keep state as local as possible
❌ **Don't access context without provider check** - Always check if context exists

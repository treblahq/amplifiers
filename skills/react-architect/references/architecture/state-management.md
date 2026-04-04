# State Management

## Overview

React applications usually benefit from a layered state management approach:

1. **Contexts** - Shared app state
2. **React Query** - Server state and API caching
3. **Database or offline store** - Realm, SQLite, IndexedDB, or similar when persistence matters
4. **Simple key-value storage** - MMKV, AsyncStorage, localStorage, or cookies for lightweight state

## Contexts

### Use `use-context-selector` for Performance

```typescript
import { createContext, useContextSelector } from "use-context-selector";

// ❌ WRONG - Standard React Context (re-renders on any change)
const MyContext = React.createContext();

// ✅ CORRECT - use-context-selector (selective re-renders)
const MyContext = createContext<MyContextType | null>(null);

// Usage
const user = useContextSelector(AuthContext, (state) => state.user);
const isAuthenticated = useContextSelector(
  AuthContext,
  (state) => state.isAuthenticated,
);
```

### Context Structure

```typescript
// @contexts/authentication/index.tsx
import { createContext, useContextSelector } from 'use-context-selector';

interface AuthenticationState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface AuthenticationActions {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

type AuthenticationContextType = AuthenticationState & AuthenticationActions;

export const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export function AuthenticationProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthenticationState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const signIn = useCallback(async (email: string, password: string) => {
    // Implementation
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      signIn,
      signOut,
      signInWithApple,
      signInWithGoogle,
    }),
    [state, signIn, signOut, signInWithApple, signInWithGoogle]
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}

// Custom hook for easy access
export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuthentication must be used within AuthenticationProvider');
  }
  return context;
};

// Selective hooks
export const useAuthUser = () =>
  useContextSelector(AuthenticationContext, (state) => state?.user);

export const useIsAuthenticated = () =>
  useContextSelector(AuthenticationContext, (state) => state?.isAuthenticated);
```

## React Query

### Configuration

```typescript
// @configuration/react-query.configuration.ts
import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export const mmkvStoragePersister = createAsyncStoragePersister({
  storage: {
    getItem: (key) => storage.getString(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Usage Patterns

```typescript
// In a hook
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query
export const useGetPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(),
    staleTime: 1000 * 60 * 5,
  });
};

// Mutation with optimistic update
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    onMutate: async (newPost) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update
      queryClient.setQueryData(["posts"], (old: Post[]) => [...old, newPost]);

      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      // Rollback on error
      queryClient.setQueryData(["posts"], context?.previousPosts);
    },
    onSuccess: () => {
      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
```

## Realm Database

### Schema Definition

```typescript
// @databases/schemas/message.schema.ts
import { Realm } from "@realm/react";

export class MessageSchema extends Realm.Object<MessageSchema> {
  _id!: Realm.BSON.ObjectId;
  chatId!: string;
  content!: string;
  role!: string;
  createdAt!: Date;

  static schema: Realm.ObjectSchema = {
    name: "Message",
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      chatId: "string",
      content: "string",
      role: "string",
      createdAt: "date",
    },
  };
}
```

### Realm Hooks

```typescript
// @hooks/realm/use-realm-messages.hook.ts
import { useRealm, useQuery } from "@realm/react";

export const useGetMessagesFromRealm = (chatId: string) => {
  const realm = useRealm();

  const messages = useQuery(
    MessageSchema,
    (collection) =>
      collection.filtered("chatId == $0", chatId).sorted("createdAt", false),
    [chatId],
  );

  return {
    items: messages,
    count: messages.length,
  };
};

export const useCreateMessageIntoRealm = () => {
  const realm = useRealm();

  const create = useCallback(
    (data: MessageData) => {
      realm.write(() => {
        realm.create("Message", {
          _id: new Realm.BSON.ObjectId(),
          ...data,
          createdAt: new Date(),
        });
      });
    },
    [realm],
  );

  return { create };
};

export const useDeleteMessageFromRealm = () => {
  const realm = useRealm();

  const deleteMessage = useCallback(
    (messageId: string) => {
      realm.write(() => {
        const message = realm.objectForPrimaryKey(
          "Message",
          new Realm.BSON.ObjectId(messageId),
        );
        if (message) {
          realm.delete(message);
        }
      });
    },
    [realm],
  );

  return { deleteMessage };
};
```

### Critical Rules

**ALWAYS wrap mutations in `realm.write()`:**

```typescript
// ✅ CORRECT
realm.write(() => {
  realm.create("Message", data);
});

// ❌ WRONG - Will crash
realm.create("Message", data);
```

## MMKV Storage

### Simple Key-Value Storage

```typescript
// @constants/storage.constants.ts
export const STORAGE_CONSTANTS = {
  AUTH_TOKEN: "auth_token",
  USER_ID: "user_id",
  HAS_SEEN_ONBOARDING: "has_seen_onboarding",
} as const;

// Usage
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

// Set
storage.set(STORAGE_CONSTANTS.AUTH_TOKEN, token);

// Get
const token = storage.getString(STORAGE_CONSTANTS.AUTH_TOKEN);

// Delete
storage.delete(STORAGE_CONSTANTS.AUTH_TOKEN);

// Check exists
const hasToken = storage.contains(STORAGE_CONSTANTS.AUTH_TOKEN);
```

## When to Use What

### Use Contexts when:

- ✅ Global app state (auth, theme, config)
- ✅ State needed across many unrelated components
- ✅ Infrequent updates
- ✅ Non-serializable data (functions, refs)

### Use React Query when:

- ✅ Fetching data from API
- ✅ Server state that can become stale
- ✅ Need caching and background refetching
- ✅ Optimistic updates

### Use Realm when:

- ✅ Offline-first features
- ✅ Large datasets (chat messages, posts)
- ✅ Complex queries and relationships
- ✅ Persistent local data

### Use MMKV/AsyncStorage when:

- ✅ Simple key-value storage
- ✅ Tokens, flags, preferences
- ✅ Small amounts of data
- ✅ No complex queries needed

## Best Practices

✅ **Selective context updates** - Use `useContextSelector`
✅ **Memoize context values** - Use `useMemo` for context value
✅ **Separate state and actions** - Keep state and setters separate
✅ **Use custom hooks** - Abstract context logic into hooks
✅ **Type everything** - Full TypeScript coverage
✅ **Handle loading states** - Always show loading indicators
✅ **Handle errors** - Proper error boundaries and fallbacks

❌ **Don't use standard React.Context** - Performance issues
❌ **Don't forget realm.write()** - Mutations will crash
❌ **Don't store large data in AsyncStorage** - Use Realm instead
❌ **Don't over-use global state** - Keep state as local as possible
❌ **Don't forget to invalidate queries** - Stale data issues

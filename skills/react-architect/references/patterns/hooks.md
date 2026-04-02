# Hooks Pattern

## Purpose

Hooks encapsulate **stateful logic and side effects**:

- State management
- Side effects (useEffect)
- Data fetching
- Event handlers
- Business logic

## Rules

✅ **DO** extract all stateful logic to hooks
✅ **DO** use one responsibility per hook
✅ **DO** optimize with useCallback/useMemo
✅ **DO** separate concerns (tracking, data, UI state)
✅ **DO** use refs for tracking flags

❌ **DO NOT** put UI rendering in hooks
❌ **DO NOT** create god hooks
❌ **DO NOT** use state for tracking flags
❌ **DO NOT** create infinite loops
❌ **DO NOT** inline business logic

## File Organization

```
# Screen-specific hooks
src/screens/screen-name/hooks/
└── use-screen-data.hook.ts

# Global hooks
src/app/hooks/
└── use-auth.hook.ts
```

**Naming**: `entity-name.hook.ts` (singular, kebab-case)
**Function**: `use` + PascalCase entity name (singular)

## Hook Structure

```typescript
// use-discover-reel.hook.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { QueryTypes } from "@enums/query-type.enum";
import { fetchReels } from "@services/reels.service";

export const useDiscoverReel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasTrackedStartRef = useRef(false);

  const {
    data: reels,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QueryTypes.DiscoverReels],
    queryFn: fetchReels,
  });

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, (reels?.length || 0) - 1));
  }, [reels?.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  return {
    currentReel: reels?.[currentIndex],
    currentIndex,
    totalReels: reels?.length || 0,
    isLoading,
    error,
    handleNext,
    handlePrevious,
  };
};
```

## useEffect Optimization

### Only Include Necessary Dependencies

```typescript
// ❌ BAD - Unnecessary dependencies
useEffect(() => {
  console.info(videos.length);
}, [videos, error, queryClient, perPage]);

// ✅ GOOD - Only necessary dependencies
useEffect(() => {
  console.info(videos.length);
}, [videos.length]);

// ✅ EXCELLENT - Use refs for tracking without re-renders
const hasTrackedRef = useRef(false);
useEffect(() => {
  if (!hasTrackedRef.current) {
    trackEvent();
    hasTrackedRef.current = true;
  }
}, [videoId]); // Only reset when video changes
```

### Use Refs to Prevent Infinite Loops

```typescript
// ❌ BAD - Causes infinite loop
const [hasTracked, setHasTracked] = useState(false);

useEffect(() => {
  if (!hasTracked) {
    trackEvent();
    setHasTracked(true); // Triggers re-render → infinite loop
  }
}, [hasTracked]);

// ✅ GOOD - No re-renders
const hasTrackedRef = useRef(false);

useEffect(() => {
  if (!hasTrackedRef.current) {
    trackEvent();
    hasTrackedRef.current = true; // No re-render
  }
}, []); // Runs once
```

## Refs vs State

**Use `useState` for:**

- Values that affect rendering
- UI state (open/closed, selected/unselected)
- Form inputs

**Use `useRef` for:**

- Tracking flags (has tracked, has loaded)
- Timers, intervals
- Previous values
- Any value that doesn't affect UI

```typescript
// ❌ BAD - Causes unnecessary re-renders
const [hasTrackedStart, setHasTrackedStart] = useState(false);
const [hasTrackedHalfway, setHasTrackedHalfway] = useState(false);

// ✅ GOOD - No re-renders
const hasTrackedStartRef = useRef(false);
const hasTrackedHalfwayRef = useRef(false);
```

## Hook Specialization Pattern

### Separate Tracking Logic

```typescript
// hooks/use-reel-tracking.hook.ts - Dedicated tracking hook
export const useReelTracking = (
  videoId: string,
  videoTitle: string,
  isActive: boolean,
) => {
  const hasTrackedStartRef = useRef(false);
  const hasTrackedHalfwayRef = useRef(false);

  // Reset tracking when video changes
  useEffect(() => {
    hasTrackedStartRef.current = false;
    hasTrackedHalfwayRef.current = false;
  }, [videoId]);

  // Track progress
  const onProgress = useCallback(
    (progress: number) => {
      if (shouldTrackHalfway(progress, hasTrackedHalfwayRef.current)) {
        trackVideoHalfway(videoId, videoTitle);
        hasTrackedHalfwayRef.current = true;
      }
    },
    [videoId, videoTitle],
  );

  return { onProgress };
};

// components/reel-item/index.tsx - Component uses hook
const { onProgress } = useReelTracking(video.id, video.title, isActive);
```

## Data Fetching Hooks

```typescript
// use-get-posts.hook.ts
import { useQuery } from "@tanstack/react-query";
import { QueryTypes } from "@enums/query-type.enum";
import { fetchPosts } from "@services/posts.service";
import { MillisecondsDuration } from "@enums/milliseconds.enum";

export const useGetPosts = (userId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QueryTypes.Posts, userId],
    queryFn: () => fetchPosts(userId),
    staleTime: MillisecondsDuration.FiveMinutes,
  });

  return {
    posts: data || [],
    loading: isLoading,
    error,
    refetch,
  };
};
```

## Mutation Hooks

```typescript
// use-create-post.hook.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@services/posts.service";
import { QueryTypes } from "@enums/query-type.enum";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, error } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryTypes.Posts] });
    },
  });

  return {
    createPost: mutate,
    loading: isLoading,
    error,
  };
};
```

## Gesture Handling Pattern

```typescript
// Detect double-tap with time-based logic
const lastTapRef = useRef(0);

const handlePress = useCallback(() => {
  const now = Date.now();
  const DOUBLE_TAP_DELAY = 400; // 400ms for Android compatibility

  if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
    // Double-tap detected
    handleDoubleTap();
  } else {
    // Single tap
    handleSingleTap();
  }

  lastTapRef.current = now;
}, [handleDoubleTap, handleSingleTap]);
```

## Reset Refs When Dependencies Change

```typescript
const hasTrackedRef = useRef(false);

// Reset when video changes
useEffect(() => {
  hasTrackedRef.current = false;
}, [videoId]);

// Use the ref
useEffect(() => {
  if (!hasTrackedRef.current && isActive) {
    trackVideoStart(videoId);
    hasTrackedRef.current = true;
  }
}, [videoId, isActive]);
```

## Hook Naming

- **File**: `entity-name.hook.ts` (singular, kebab-case)
  - `discover-reel.hook.ts` for `useDiscoverReel`
  - `user-context.hook.ts` for `useUserContext`
- **Function**: `use` + PascalCase entity (singular)
- **Return**: Descriptive object with data and actions

## When to Create a Hook

Create a custom hook when:

✅ Logic is stateful (useState, useEffect)
✅ Logic is reused in multiple components
✅ Complex logic needs extraction
✅ Side effects need encapsulation

Keep inline when:

❌ Simple, one-off logic
❌ No state or effects
❌ Tightly coupled to component

## Hook Examples

### Form Hook

```typescript
export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const reset = useCallback(() => {
    setEmail("");
    setPassword("");
    setErrors({});
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    validate,
    reset,
  };
};
```

## Best Practices

✅ **One hook = one responsibility**
✅ **Extract logic to helpers**
✅ **Use refs for tracking flags**
✅ **Optimize with useCallback/useMemo**
✅ **Separate tracking, data fetching, UI state**
✅ **Reset refs when dependencies change**
✅ **Use platform-specific delays for gestures**

❌ **Don't use state for tracking flags**
❌ **Don't create infinite loops**
❌ **Don't mix concerns in one hook**
❌ **Don't forget to memoize callbacks**
❌ **Don't put UI in hooks**

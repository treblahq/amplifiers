# Performance Best Practices

## React Optimization

### Memoization

```typescript
// ❌ BAD - Re-creates on every render
const MyComponent: React.FC = () => {
  const expensiveValue = calculateExpensiveValue(data);

  return <View>{expensiveValue}</View>;
};

// ✅ GOOD - Only recalculates when data changes
const MyComponent: React.FC = () => {
  const expensiveValue = useMemo(() => calculateExpensiveValue(data), [data]);

  return <View>{expensiveValue}</View>;
};

// ❌ BAD - Re-creates function on every render
const MyComponent: React.FC = () => {
  const handlePress = () => {
    console.log('Pressed');
  };

  return <Button onPress={handlePress} />;
};

// ✅ GOOD - Stable function reference
const MyComponent: React.FC = () => {
  const handlePress = useCallback(() => {
    console.log('Pressed');
  }, []);

  return <Button onPress={handlePress} />;
};
```

### React.memo

```typescript
// Memoize components that receive same props frequently
const PostItem = React.memo<PostItemProps>(({ post, onPress }) => {
  return (
    <TouchableWrapper onPress={() => onPress(post.id)}>
      <Title>{post.title}</Title>
    </TouchableWrapper>
  );
});

// With custom comparison
const PostItem = React.memo<PostItemProps>(
  ({ post, onPress }) => {
    return <View>{/* ... */}</View>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return prevProps.post.id === nextProps.post.id;
  }
);
```

### useEffect Dependencies

```typescript
// ❌ BAD - Too many dependencies
useEffect(() => {
  console.log(videos.length);
}, [videos, error, queryClient, perPage]);

// ✅ GOOD - Only necessary dependencies
useEffect(() => {
  console.log(videos.length);
}, [videos.length]);

// ✅ EXCELLENT - Use refs for tracking
const hasTrackedRef = useRef(false);
useEffect(() => {
  if (!hasTrackedRef.current) {
    trackEvent();
    hasTrackedRef.current = true;
  }
}, [videoId]); // Only reset when video changes
```

## FlatList Optimization

```typescript
// ✅ GOOD - Optimized FlatList
<FlatList
  data={posts}
  renderItem={renderPost}
  keyExtractor={keyExtractor}
  // Performance optimizations
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={21}
  // Better scroll performance
  getItemLayout={getItemLayout}
  // Avoid unnecessary re-renders
  extraData={selectedId}
/>

const renderPost = useCallback(({ item }: { item: Post }) => (
  <PostItem post={item} onPress={handlePress} />
), [handlePress]);

const keyExtractor = useCallback((item: Post) => item.id.toString(), []);

// For fixed height items
const getItemLayout = useCallback(
  (data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }),
  []
);
```

## Image Optimization

```typescript
// Use FastImage for better performance
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: post.imageUrl,
    priority: FastImage.priority.normal,
  }}
  resizeMode={FastImage.resizeMode.cover}
  style={{ width: 100, height: 100 }}
/>

// Preload images
FastImage.preload([
  { uri: 'https://example.com/image1.jpg' },
  { uri: 'https://example.com/image2.jpg' },
]);
```

## Bundle Size

### Tree Shaking

```typescript
// ❌ BAD - Imports entire library
import _ from "lodash";
const result = _.debounce(fn, 300);

// ✅ GOOD - Imports only needed function
import debounce from "lodash/debounce";
const result = debounce(fn, 300);
```

### Dynamic Imports

```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

## React Query Optimization

```typescript
// Configure stale time and cache time
const { data: posts } = useQuery({
  queryKey: [QueryTypes.Posts],
  queryFn: fetchPosts,
  staleTime: MillisecondsDuration.FiveMinutes,
  cacheTime: MillisecondsDuration.ThirtyMinutes,
  // Only refetch when explicitly needed
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

// Use pagination for large lists
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: [QueryTypes.Posts],
  queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
  getNextPageParam: (lastPage, pages) => lastPage.nextPage,
});
```

## Realm Optimization

```typescript
// ✅ GOOD - Query with filter
const messages = useGetMessagesFromRealm(chatId);

// Inside hook
export const useGetMessagesFromRealm = (chatId: string) => {
  const realm = useRealm();

  const items = useMemo(() => {
    return realm
      .objects<Message>("Message")
      .filtered("chatId == $0", chatId)
      .sorted("createdAt", true); // Sorted query, not JS sort
  }, [realm, chatId]);

  return { items };
};

// ❌ BAD - Get all then filter in JS
const allMessages = realm.objects("Message");
const filtered = allMessages.filter((m) => m.chatId === chatId);
```

## Refs vs State

```typescript
// Use state for values that affect rendering
const [count, setCount] = useState(0);

// Use refs for values that don't affect UI
const hasTrackedRef = useRef(false);
const timerRef = useRef<NodeJS.Timeout | null>(null);
const previousValueRef = useRef<string | null>(null);

// ✅ GOOD - Prevents re-renders
const handleScroll = useCallback((event) => {
  const offsetY = event.nativeEvent.contentOffset.y;
  previousValueRef.current = offsetY; // No re-render
}, []);
```

## Gesture Handling

```typescript
// Use refs for gesture state
const isPanningRef = useRef(false);
const lastTapRef = useRef(0);

const handlePanResponderMove = useCallback((event, gestureState) => {
  if (!isPanningRef.current) {
    isPanningRef.current = true;
    trackGestureStart();
  }
  // Handle pan
}, []);

const handlePanResponderEnd = useCallback(() => {
  isPanningRef.current = false;
  trackGestureEnd();
}, []);

// Double-tap detection
const handlePress = useCallback(() => {
  const now = Date.now();
  const DOUBLE_TAP_DELAY = 400; // Platform-specific

  if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
    handleDoubleTap();
  } else {
    handleSingleTap();
  }

  lastTapRef.current = now;
}, [handleDoubleTap, handleSingleTap]);
```

## Avoid Re-renders

```typescript
// ❌ BAD - Creates new object every render
const styles = { flex: 1, backgroundColor: "white" };

// ✅ GOOD - Stable reference
const styles = useMemo(
  () => ({
    flex: 1,
    backgroundColor: "white",
  }),
  [],
);

// ✅ BETTER - Use styled-components
const Container = styled.View`
  flex: 1;
  background-color: white;
`;
```

## Debouncing and Throttling

```typescript
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";

// Debounce search input
const debouncedSearch = useMemo(
  () =>
    debounce((query: string) => {
      performSearch(query);
    }, 300),
  [],
);

// Throttle scroll events
const throttledScroll = useMemo(
  () =>
    throttle((offset: number) => {
      handleScroll(offset);
    }, 100),
  [],
);

// Cleanup on unmount
useEffect(() => {
  return () => {
    debouncedSearch.cancel();
    throttledScroll.cancel();
  };
}, [debouncedSearch, throttledScroll]);
```

## Best Practices Checklist

✅ **Use memoization** - `useMemo` for expensive calculations
✅ **Use callbacks** - `useCallback` for stable function references
✅ **Optimize FlatList** - `removeClippedSubviews`, `getItemLayout`, `maxToRenderPerBatch`
✅ **Use FastImage** - Better image loading and caching
✅ **Tree shake imports** - Import specific functions, not entire libraries
✅ **Use refs for tracking** - Prevent re-renders for non-UI state
✅ **Configure React Query** - Set appropriate `staleTime` and `cacheTime`
✅ **Filter in Realm** - Use Realm queries, not JS `.filter()`
✅ **Debounce/throttle** - Rate-limit expensive operations
✅ **Use React.memo** - For components with stable props

❌ **Don't create objects in render** - Creates new references
❌ **Don't use state for everything** - Use refs for non-UI values
❌ **Don't forget to cleanup** - Cancel debounce/throttle on unmount
❌ **Don't query all then filter** - Use database-level filtering
❌ **Don't add unnecessary dependencies** - Only what triggers the effect

# Performance Best Practices

## Query Optimization

### Eager Loading (Avoid N+1)

```php
// ❌ BAD - N+1 queries (1 + N queries)
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->user->name; // Query per post
}

// ✅ GOOD - 2 queries total
$posts = Post::with('user')->get();
foreach ($posts as $post) {
    echo $post->user->name;
}

// ✅ BETTER - Multiple relationships
$posts = Post::with(['user', 'comments', 'tags'])->get();

// ✅ BEST - Nested relationships
$posts = Post::with(['user', 'comments.user'])->get();

// Laravel 12 - Lazy Eager Loading (load only when needed)
$posts = Post::all();
$posts->loadMissing('user'); // Only loads if not already loaded
```

### Select Only Needed Columns

```php
// ❌ BAD - Fetches all columns
$users = User::where('active', true)->get();

// ✅ GOOD - Only needed columns
$users = User::select('id', 'name', 'email')
    ->where('active', true)
    ->get();

// ✅ GOOD - With relationships
$users = User::select('id', 'name')
    ->with(['profile:id,user_id,avatar'])
    ->get();
```

### Pagination

```php
// ❌ BAD - Loads all records into memory
$users = User::where('active', true)->get();

// ✅ GOOD - Paginate results
$users = User::where('active', true)->paginate(20);

// ✅ BETTER - Simple pagination (no count query)
$users = User::where('active', true)->simplePaginate(20);

// ✅ BEST - Cursor pagination for large datasets
$users = User::where('active', true)->cursorPaginate(20);
```

### Use exists() Instead of count()

```php
// ❌ BAD - Counts all matches
if (User::where('email', $email)->count() > 0) {
    // ...
}

// ✅ GOOD - Stops at first match
if (User::where('email', $email)->exists()) {
    // ...
}

// Laravel 12 - Get single column value directly
$email = User::where('id', $userId)->value('email'); // More efficient than ->first()->email

// Laravel 12 - Ensure exactly one result
$user = User::where('email', $email)->sole(); // Throws if 0 or 2+ results
```

### Chunk Large Datasets

```php
// ❌ BAD - Loads all users into memory
$users = User::where('active', true)->get();
foreach ($users as $user) {
    $this->processUser($user);
}

// ✅ GOOD - Process in chunks
User::where('active', true)->chunk(500, function ($users) {
    foreach ($users as $user) {
        $this->processUser($user);
    }
});

// ✅ BETTER - Use cursor for memory efficiency
User::where('active', true)->cursor()->each(function ($user) {
    $this->processUser($user);
});
```

### Avoid Queries in Loops

```php
// ❌ BAD - N queries
foreach ($users as $user) {
    $count = $user->posts()->count();
}

// ✅ GOOD - Single query with eager loading
$users = User::withCount('posts')->get();
foreach ($users as $user) {
    $count = $user->posts_count;
}
```

### Use whereBelongsTo()

```php
// ❌ BAD - Manual foreign key
$messages = ConversationMessage::where('conversation_id', $conversation->id)->get();

// ✅ GOOD - Type-safe and readable
$messages = ConversationMessage::whereBelongsTo($conversation)->get();
```

## Caching

### Cache Expensive Queries

```php
use Illuminate\Support\Facades\Cache;

// ❌ BAD - Query every time
$popularPosts = Post::where('views', '>', 1000)
    ->orderByDesc('views')
    ->take(10)
    ->get();

// ✅ GOOD - Cache for 1 hour
$popularPosts = Cache::remember('posts.popular', 3600, function () {
    return Post::where('views', '>', 1000)
        ->orderByDesc('views')
        ->take(10)
        ->get();
});
```

### Use Dependency Injection for Cache

```php
use App\Repositories\CacheRepository;

// ✅ GOOD - Inject CacheRepository
final class PostService
{
    public function __construct(
        private readonly CacheRepository $cache
    ) {}

    public function getPopularPosts(): Collection
    {
        return $this->cache->remember('posts.popular', 3600, function () {
            return Post::where('views', '>', 1000)
                ->orderByDesc('views')
                ->take(10)
                ->get();
        });
    }
}
```

### Cache Invalidation

```php
// Clear specific cache
Cache::forget('posts.popular');

// Clear by pattern (with Redis)
Redis::del(Redis::keys('posts:*'));

// Clear on model events (in Observer)
public function created(Post $post): void
{
    Cache::forget('posts.popular');
}
```

## Database Indexing

```php
// In migrations - Index frequently queried columns
$table->index('email');
$table->index('active');
$table->index('created_at');

// Composite index for multiple columns
$table->index(['user_id', 'created_at']);

// Unique index
$table->unique('email');
```

## Queue Heavy Operations

```php
// ❌ BAD - Block request
public function store(Request $request): JsonResponse
{
    $this->processVideo($request->file('video')); // Heavy operation

    return response()->json(['message' => 'Video uploaded']);
}

// ✅ GOOD - Queue in background
public function store(Request $request): JsonResponse
{
    $videoId = $this->saveVideo($request->file('video'));

    dispatch(new ProcessVideoJob($videoId));

    return response()->json(['message' => 'Video uploaded, processing started']);
}
```

## Lazy Loading Collections

```php
// ❌ BAD - Load entire collection
$posts = Post::all()->map(function ($post) {
    return $this->transform($post);
});

// ✅ GOOD - Lazy load with cursor
$posts = Post::cursor()->map(function ($post) {
    return $this->transform($post);
});
```

## Database Transactions

```php
use Illuminate\Support\Facades\DB;

// ✅ GOOD - Wrap related operations in transaction
return DB::transaction(function () use ($data) {
    $post = Post::create($data);
    $post->tags()->attach($data['tags']);
    $post->user->increment('posts_count');

    return $post;
});

// Laravel 12 - Upsert (insert or update)
User::upsert([
    ['email' => 'john@example.com', 'name' => 'John'],
    ['email' => 'jane@example.com', 'name' => 'Jane'],
], ['email'], ['name']); // Match by email, update name
```

## Response Caching

```php
// Cache entire response
public function index(): JsonResponse
{
    return Cache::remember('api.posts.index', 300, function () {
        $posts = Post::with('user')->paginate(20);

        return response()->json(PostResource::collection($posts));
    });
}
```

## Use Scout for Full-Text Search

```php
// ❌ BAD - Slow LIKE queries
$posts = Post::where('title', 'LIKE', "%{$query}%")
    ->orWhere('content', 'LIKE', "%{$query}%")
    ->get();

// ✅ GOOD - Use Laravel Scout
$posts = Post::search($query)->get();
```

## Optimize Images

```php
use Intervention\Image\Facades\Image;

// Resize and optimize on upload
$image = Image::make($file)
    ->resize(800, 600, function ($constraint) {
        $constraint->aspectRatio();
        $constraint->upsize();
    })
    ->encode('jpg', 80);
```

## Rate Limiting

```php
// In routes/api.php
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
});

// Custom rate limiting
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});
```

## Best Practices Checklist

✅ **Eager load relationships** to avoid N+1 queries
✅ **Select only needed columns** instead of `SELECT *`
✅ **Use pagination** for large result sets
✅ **Cache expensive queries** with reasonable TTL
✅ **Index frequently queried columns**
✅ **Queue heavy operations** instead of blocking requests
✅ **Use exists()** instead of `count() > 0`
✅ **Chunk large datasets** to avoid memory issues
✅ **Use transactions** for related operations
✅ **Rate limit API endpoints** to prevent abuse

❌ **Don't load all records** without pagination
❌ **Don't query inside loops**
❌ **Don't forget to index** foreign keys
❌ **Don't block requests** with long-running tasks
❌ **Don't use LIKE** for full-text search on large tables

## Monitoring Performance

```php
// Log slow queries
DB::listen(function ($query) {
    if ($query->time > 100) {
        Log::warning('Slow query detected', [
            'sql' => $query->sql,
            'time' => $query->time,
        ]);
    }
});

// Use Laravel Debugbar (development only)
// composer require barryvdh/laravel-debugbar --dev
```

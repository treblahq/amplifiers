# Services Pattern

## Purpose

Services contain the **application's business logic** and orchestrate:
- Complex workflows
- Business rules and validations
- Coordination between Models, Integrations, and Jobs
- Transaction management

## Rules

✅ **DO** contain business logic and use cases
✅ **DO** orchestrate between Models, Integrations, Jobs
✅ **DO** handle transactions
✅ **DO** inject Models in constructor
✅ **DO** use Model scopes for queries

❌ **DO NOT** handle HTTP concerns (that's Controller's job)
❌ **DO NOT** format responses (that's Resource's job)
❌ **DO NOT** perform database queries without Models

## Structure

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Post\Post;
use App\Models\User\User;
use App\Integrations\Analytics\AnalyticsService;
use App\Jobs\ProcessPostJob;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class PostService
{
    public function __construct(
        private readonly Post $post,
        private readonly User $user,
        private readonly AnalyticsService $mixpanel,
    ) {}

    /**
     * Get all posts for a user.
     */
    public function getUserPosts(int $userId): Collection
    {
        return $this->post->newQuery()
            ->whereUserId($userId)
            ->wherePublished()
            ->with('comments')
            ->get();
    }

    /**
     * Create a new post.
     */
    public function createPost(int $userId, array $data): Post
    {
        return DB::transaction(function () use ($userId, $data) {
            $post = $this->post->newQuery()->create([
                'user_id' => $userId,
                'title' => $data['title'],
                'content' => $data['content'],
                'status' => PostStatus::DRAFT,
            ]);

            // Track event
            $this->mixpanel->track($userId, 'post_created', [
                'post_id' => $post->id,
            ]);

            // Queue processing
            ProcessPostJob::dispatch($post->id);

            return $post;
        });
    }

    /**
     * Find a post by ID for a specific user.
     */
    public function findById(int $postId, int $userId): ?Post
    {
        return $this->post->newQuery()
            ->whereId($postId)
            ->whereUserId($userId)
            ->with('comments')
            ->first();
    }

    /**
     * Delete a post.
     */
    public function deletePost(int $postId, int $userId): void
    {
        $post = $this->findById($postId, $userId);

        if ($post) {
            $post->delete();
        }
    }
}
```

## Key Points

### 1. Constructor Injection

Always inject Models and dependencies:

```php
public function __construct(
    private readonly Post $post,
    private readonly User $user,
    private readonly AnalyticsService $mixpanel,
) {}
```

### 2. Use Model Scopes

Leverage Model scopes instead of raw where() clauses:

```php
// ✅ CORRECT - using scopes
$this->post->newQuery()
    ->whereUserId($userId)
    ->wherePublished()
    ->get();

// ❌ WRONG - raw queries
Post::where('user_id', $userId)
    ->where('status', 'published')
    ->get();
```

### 3. Transactions for Multi-Step Operations

Wrap related operations in transactions:

```php
return DB::transaction(function () use ($data) {
    $post = $this->post->newQuery()->create($data);
    $post->tags()->attach($tagIds);
    return $post;
});
```

### 4. Use newQuery() on Injected Models

Always use `newQuery()` on injected models:

```php
$this->post->newQuery()->where(...)->get();
```

### 5. Call Integrations and Jobs

Services orchestrate external services and async jobs:

```php
// Integration
$this->mixpanel->track($userId, 'event_name', $properties);

// Job
ProcessPostJob::dispatch($postId);
```

## Naming Conventions

- **File**: `{Domain}Service.php` (singular, PascalCase)
- **Class**: `final class {Domain}Service`
- **Methods**: Descriptive action verbs
  - `getUserPosts()`
  - `createPost()`
  - `findById()`
  - `deletePost()`

## Examples

```
Services/
├── PostService.php
├── OrderService.php
├── ConversationService.php
├── UserService.php
└── FeedService.php
```

## When to Create a Service

Create a Service when you have:
- Complex business logic
- Multiple Models coordination
- External API calls
- Background job orchestration
- Transaction management

For simple CRUD, Service might be thin but still centralizes logic.

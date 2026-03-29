# Controllers Pattern

## Purpose

Controllers are **thin HTTP handlers** that:
- Receive HTTP requests
- Delegate to Services
- Return Resources or JsonResponse

## Rules

❌ **DO NOT** put business logic in Controllers
❌ **DO NOT** perform database queries directly
❌ **DO NOT** handle complex calculations or transformations
❌ **DO NOT** call Integrations or Jobs directly

✅ **DO** delegate to Services
✅ **DO** use dependency injection
✅ **DO** return Resources for responses
✅ **DO** handle only HTTP concerns (status codes, headers)

## Structure

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\PostService;
use App\Http\Requests\StorePostRequest;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class PostController extends Controller
{
    public function __construct(
        private readonly PostService $service
    ) {}

    /**
     * List all posts for authenticated user.
     */
    public function index(Request $request): JsonResource
    {
        $posts = $this->service->getUserPosts($request->user()->id);

        return PostResource::collection($posts);
    }

    /**
     * Store a new post.
     */
    public function store(StorePostRequest $request): JsonResource
    {
        $post = $this->service->createPost(
            userId: $request->user()->id,
            data: $request->validated()
        );

        return PostResource::make($post);
    }

    /**
     * Show a specific post.
     */
    public function show(Request $request, int $id): JsonResource
    {
        $post = $this->service->findById($id, $request->user()->id);

        if (!$post) {
            throw new NotFoundHttpException('Post not found');
        }

        return PostResource::make($post);
    }

    /**
     * Delete a post.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->deletePost($id, $request->user()->id);

        return response()->json(null, 204);
    }
}
```

## Key Points

### 1. Always `final`
Controllers should not be extended.

### 2. Constructor Injection
Inject Services, never instantiate manually:

```php
// ✅ CORRECT
public function __construct(
    private readonly PostService $service
) {}

// ❌ WRONG
public function index() {
    $service = new PostService();
}
```

### 3. Type Everything
All parameters and return types must be explicit:

```php
public function index(Request $request): JsonResource
```

### 4. Delegate to Services
Never put logic in controllers:

```php
// ✅ CORRECT - Laravel 12 with named arguments
$posts = $this->service->getUserPosts(
    userId: $userId,
    filters: $request->validated(),
);

// ❌ WRONG
$posts = Post::where('user_id', $userId)
    ->where('status', 'published')
    ->with('comments')
    ->get();
```

### 5. Return Resources
Always format responses via Resources:

```php
// ✅ CORRECT
return PostResource::collection($posts);
return PostResource::make($post);

// ❌ WRONG
return response()->json($posts);
```

## Error Handling

Use HTTP exceptions for errors:

```php
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

if (!$post) {
    throw new NotFoundHttpException('Post not found');
}

if ($invalid) {
    throw new BadRequestHttpException('Invalid data');
}
```

## File Naming

- **File**: `{Model}Controller.php` (singular, PascalCase)
- **Class**: `final class {Model}Controller extends Controller`
- Examples:
  - `PostController.php`
  - `OrderController.php`
  - `FeedController.php`

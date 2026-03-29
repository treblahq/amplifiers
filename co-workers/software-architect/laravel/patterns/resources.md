# Resources Pattern

## Purpose

Resources format API responses:
- Transform Models to JSON
- Hide sensitive data
- Add computed fields
- Consistent response structure
- Prevent exposing internal Models directly

## Structure

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Post\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Post
 */
final class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'content' => $this->resource->content,
            'excerpt' => $this->resource->excerpt, // Accessor
            'status' => $this->resource->status->value,
            'author' => UserResource::make($this->whenLoaded('user')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
        ];
    }
}
```

## Key Points

### 1. Use `$this->resource`

Access the underlying model via `$this->resource`:

```php
'id' => $this->resource->id,
'title' => $this->resource->title,
```

### 2. Conditional Fields

Show fields only when available:

```php
'author' => UserResource::make($this->whenLoaded('user')),
'comments_count' => $this->when(isset($this->comments_count), $this->comments_count),
'meta' => $this->when($this->resource->meta, $this->resource->meta),
```

### 3. Nested Resources

Transform related models:

```php
// Single resource
'author' => UserResource::make($this->whenLoaded('user')),

// Collection
'comments' => CommentResource::collection($this->whenLoaded('comments')),
```

### 4. Enum Values

Always return Enum values:

```php
// ✅ CORRECT
'status' => $this->resource->status->value,

// ❌ WRONG
'status' => $this->resource->status,
```

### 5. Hide Sensitive Data

Never expose sensitive fields:

```php
// ❌ NEVER expose
'password',
'remember_token',
'api_token',

// ✅ Only expose needed fields
'id',
'name',
'email',
```

## Collection Response

```php
public function index(): JsonResource
{
    $posts = $this->service->getUserPosts($userId);

    return PostResource::collection($posts);
}
```

Response:

```json
{
  "data": [
    { "id": 1, "title": "Post 1" },
    { "id": 2, "title": "Post 2" }
  ]
}
```

## Single Resource Response

```php
public function show(int $id): JsonResource
{
    $post = $this->service->findById($id);

    return PostResource::make($post);
}
```

Response:

```json
{
  "data": {
    "id": 1,
    "title": "Post 1",
    "content": "..."
  }
}
```

## Paginated Response

```php
public function index(): JsonResource
{
    $posts = $this->service->getUserPosts($userId);

    return PostResource::collection($posts); // $posts is already paginated
}
```

Response includes meta and links:

```json
{
  "data": [...],
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": "..."
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "to": 20,
    "total": 100,
    "per_page": 20,
    "last_page": 5
  }
}
```

## Additional Data

Add extra data to response:

```php
public function with(Request $request): array
{
    return [
        'meta' => [
            'version' => '2.0',
            'timestamp' => now()->toIso8601String(),
        ],
    ];
}
```

## Conditional Attributes

```php
public function toArray(Request $request): array
{
    return [
        'id' => $this->resource->id,
        'title' => $this->resource->title,

        // Only for authenticated users
        $this->mergeWhen($request->user(), [
            'private_notes' => $this->resource->private_notes,
        ]),

        // Only for admins
        $this->mergeWhen($request->user()?->isAdmin(), [
            'internal_id' => $this->resource->internal_id,
        ]),
    ];
}
```

## Naming

- **File**: `{Model}Resource.php` (singular, PascalCase)
- **Examples**:
  - `PostResource.php`
  - `UserResource.php`
  - `OrderResource.php`
  - `OrderItemResource.php`

## Benefits

✅ Consistent API responses
✅ Hide internal implementation
✅ Easy to modify response structure
✅ Reusable transformations
✅ Type-safe responses

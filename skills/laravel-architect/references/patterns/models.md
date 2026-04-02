# Models Pattern

## Purpose

Models represent **domain entities** and handle:
- Database queries via Eloquent
- Relationships between entities
- Query scopes for reusable filters
- Accessors and mutators for attribute formatting

## File Organization

Models are organized in folders with **traits in the root** (not subfolders):

```
app/Models/
├── Post/
│   ├── Post.php                 # Main model
│   ├── PostRelations.php        # Relationships
│   ├── PostScopes.php           # Query scopes
│   ├── PostAttributes.php       # Accessors/mutators
│   ├── PostFunctions.php        # Helper methods
│   ├── PostObserver.php         # Observer
│   └── PostQueries.php          # Raw SQL subqueries
```

## Model Structure

```php
<?php

declare(strict_types=1);

namespace App\Models\Post;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Post\PostRelations;
use App\Models\Post\PostScopes;
use App\Models\Post\PostAttributes;
use App\Enums\PostStatus;

final class Post extends Model
{
    use HasFactory;
    use PostRelations;
    use PostScopes;
    use PostAttributes;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'status',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'status' => PostStatus::class,
        'published_at' => 'datetime',
        'tags' => 'array', // Laravel 12 - improved JSON casting
    ];
}
```

## Relations Trait

```php
<?php

declare(strict_types=1);

namespace App\Models\Post;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User\User;
use App\Models\Comment\Comment;

trait PostRelations
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
```

## Scopes Trait

```php
<?php

declare(strict_types=1);

namespace App\Models\Post;

use Illuminate\Database\Eloquent\Builder;
use App\Enums\PostStatus;

trait PostScopes
{
    public function scopeWhereUserId(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeWhereId(Builder $query, int $id): Builder
    {
        return $query->where('id', $id);
    }

    public function scopeWherePublished(Builder $query): Builder
    {
        return $query->where('status', PostStatus::PUBLISHED);
    }

    public function scopeWhereStatus(Builder $query, PostStatus $status): Builder
    {
        return $query->where('status', $status);
    }
}
```

## Attributes Trait (with Property Hooks - PHP 8.4)

```php
<?php

declare(strict_types=1);

namespace App\Models\Post;

use Illuminate\Database\Eloquent\Casts\Attribute;

trait PostAttributes
{
    /**
     * Get the post's excerpt.
     */
    protected function excerpt(): Attribute
    {
        return Attribute::make(
            get: fn() => substr($this->content, 0, 100) . '...'
        );
    }

    /**
     * Get the post's full URL.
     */
    protected function url(): Attribute
    {
        return Attribute::make(
            get: fn() => route('posts.show', $this->id)
        );
    }

    /**
     * Using Property Hooks (PHP 8.4) - Alternative approach
     * Define directly in model for simple computed properties
     */
    public string $title
    {
        get => $this->attributes['title'] ?? '';
        set(string $value) => strtolower($value); // Auto-lowercase
    }
}
```

## Functions Trait

```php
<?php

declare(strict_types=1);

namespace App\Models\Post;

use Illuminate\Database\Eloquent\Builder;

trait PostFunctions
{
    /**
     * Base query for listing posts.
     */
    public static function baseListQuery(): Builder
    {
        return self::query()
            ->wherePublished()
            ->with('user')
            ->orderByDesc('created_at');
    }
}
```

## Observer

```php
<?php

declare(strict_types=1);

namespace App\Models\Post;

use App\Models\Post\Post;

final class PostObserver
{
    public function created(Post $post): void
    {
        // Logic after post is created
    }

    public function updated(Post $post): void
    {
        // Logic after post is updated
    }

    public function deleted(Post $post): void
    {
        // Logic after post is deleted
    }
}
```

Register in model:

```php
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy(PostObserver::class)]
final class Post extends Model
{
    // ...
}
```

## Queries Class (Raw SQL)

For complex subqueries:

```php
<?php

declare(strict_types=1);

namespace App\Models\Post;

final class PostQueries
{
    public static function userEngagementSubquery(int $userId): string
    {
        return "(SELECT COUNT(*) FROM comments
                  WHERE comments.post_id = posts.id
                  AND comments.user_id = {$userId})";
    }
}
```

Usage in scope:

```php
use Illuminate\Support\Facades\DB;

public function scopeWithUserEngagement(Builder $query, int $userId): Builder
{
    return $query->addSelect([
        'user_comments' => DB::raw(PostQueries::userEngagementSubquery($userId)),
    ]);
}
```

## Key Rules

### 1. Always `final`

Models should not be extended.

### 2. Use Traits for Organization

- **Relations**: `{Model}Relations.php`
- **Scopes**: `{Model}Scopes.php`
- **Attributes**: `{Model}Attributes.php`
- **Functions**: `{Model}Functions.php`
- **Observer**: `{Model}Observer.php`
- **Queries**: `{Model}Queries.php`

### 3. Traits in Root Folder

Place trait files **directly in the model folder**, not in subfolders:

```
✅ app/Models/Post/PostRelations.php
❌ app/Models/Post/Relations/PostRelations.php
```

### 4. Use Enums for String Columns

```php
// Migration
$table->string('status'); // Store as string

// Model
protected $casts = [
    'status' => PostStatus::class, // Cast to Enum
];
```

### 5. Scopes for Reusable Queries

Create scopes for commonly used filters:

```php
// Instead of:
Post::where('status', 'published')->get();

// Use scope:
Post::wherePublished()->get();
```

### 6. Minimal Business Logic

Keep Models focused on data access, not business rules. Business logic goes in Services.

### 7. Use Property Hooks (PHP 8.4)

For simple computed properties and validation, use property hooks directly in the model:

```php
final class Post extends Model
{
    // Automatic validation on set
    public string $email
    {
        set(string $value) {
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                throw new \InvalidArgumentException('Invalid email');
            }
            return strtolower($value);
        }
    }

    // Computed property with asymmetric visibility
    public private(set) string $fullName
    {
        get => $this->first_name . ' ' . $this->last_name;
    }
}
```

### 8. Asymmetric Visibility (PHP 8.4)

Control read/write access at property level:

```php
final class User extends Model
{
    // Public read, private write
    public private(set) string $hashedPassword;

    // Public read, protected write (can be set by subclasses)
    public protected(set) DateTimeInterface $createdAt;
}
```

## Naming

- **Folder**: Singular, PascalCase (`Post/`, `Order/`)
- **File**: `{Model}.php`
- **Traits**: `{Model}{Trait}.php` (`PostRelations.php`)
- **Observer**: `{Model}Observer.php`
- **Queries**: `{Model}Queries.php`

## Laravel 12 Features

### Lazy Objects

Laravel 12 introduces lazy object initialization for better performance:

```php
use Illuminate\Database\Eloquent\Attributes\Lazy;

final class Post extends Model
{
    #[Lazy]
    public function expensiveComputation(): array
    {
        // Only computed when accessed
        return $this->processData();
    }
}
```

### Improved Casting

Laravel 12 has enhanced casting capabilities:

```php
protected $casts = [
    'metadata' => 'json',
    'options' => AsCollection::class,
    'tags' => AsEnumCollection::class.':'.TagType::class,
];

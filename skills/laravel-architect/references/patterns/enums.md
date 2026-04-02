# Enums Pattern

## Purpose

Enums provide:
- Type-safe constants
- Fixed set of values
- IDE autocomplete
- Better refactoring support

## Structure

```php
<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case USER = 'user';
    case MODERATOR = 'moderator';

    /**
     * Get all enum values.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get enum from value with validation.
     */
    public static function fromValue(string $value): ?self
    {
        return self::tryFrom($value);
    }

    /**
     * Check if value exists.
     */
    public static function hasValue(string $value): bool
    {
        return in_array($value, self::values(), true);
    }
}
```

## Using Traits

Use `EnumTraits` for common methods:

```php
<?php

declare(strict_types=1);

namespace App\Enums;

use App\Components\Enums\EnumTraits;

enum PostStatus: string
{
    use EnumTraits;

    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';
}
```

`EnumTraits` provides:
- `values(): array` - Get all values
- `names(): array` - Get all case names
- `toArray(): array` - Get key-value pairs
- `fromValue(mixed $value): ?self` - Safe value lookup
- `hasValue(mixed $value): bool` - Check if value exists

## Model Integration

### Cast Enum in Model

```php
use App\Enums\PostStatus;

final class Post extends Model
{
    protected $casts = [
        'status' => PostStatus::class,
    ];
}
```

### Query with Enum

```php
// ✅ CORRECT - Use enum value
$posts = Post::where('status', PostStatus::PUBLISHED->value)->get();

// ❌ WRONG - Using enum directly (may work but inconsistent)
$posts = Post::where('status', PostStatus::PUBLISHED)->get();
```

### Scopes with Enum

```php
// In PostScopes trait
public function scopePublished(Builder $query): Builder
{
    return $query->where('status', PostStatus::PUBLISHED->value);
}

// Usage
$posts = Post::published()->get();
```

## Validation

```php
use Illuminate\Validation\Rule;

public function rules(): array
{
    return [
        'status' => ['required', Rule::enum(PostStatus::class)],
    ];
}
```

## Enum Methods

```php
enum UserRole: string
{
    case ADMIN = 'admin';
    case USER = 'user';

    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Administrator',
            self::USER => 'Regular User',
        };
    }

    public function canManageUsers(): bool
    {
        return $this === self::ADMIN;
    }

    public function permissions(): array
    {
        return match($this) {
            self::ADMIN => ['read', 'write', 'delete', 'manage'],
            self::USER => ['read'],
        };
    }
}

// Usage
$role = UserRole::ADMIN;
echo $role->label(); // "Administrator"
if ($role->canManageUsers()) {
    // Allow user management
}
```

## Integer Backed Enums

```php
enum HttpStatus: int
{
    case OK = 200;
    case CREATED = 201;
    case BAD_REQUEST = 400;
    case UNAUTHORIZED = 401;
    case NOT_FOUND = 404;
    case SERVER_ERROR = 500;

    public function isSuccess(): bool
    {
        return $this->value >= 200 && $this->value < 300;
    }

    public function isError(): bool
    {
        return $this->value >= 400;
    }
}
```

## Common Enum Patterns

### Status Enums

```php
enum OrderStatus: string
{
    use EnumTraits;

    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public function canTransitionTo(self $newStatus): bool
    {
        return match($this) {
            self::PENDING => in_array($newStatus, [self::PROCESSING, self::CANCELLED]),
            self::PROCESSING => in_array($newStatus, [self::COMPLETED, self::CANCELLED]),
            self::COMPLETED => false,
            self::CANCELLED => false,
        };
    }
}
```

### Type Enums

```php
enum NotificationType: string
{
    use EnumTraits;

    case EMAIL = 'email';
    case SMS = 'sms';
    case PUSH = 'push';
    case IN_APP = 'in_app';

    public function icon(): string
    {
        return match($this) {
            self::EMAIL => '✉️',
            self::SMS => '📱',
            self::PUSH => '🔔',
            self::IN_APP => '💬',
        };
    }
}
```

## API Resources with Enums

```php
final class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            // ✅ CORRECT - Always use ->value
            'status' => $this->resource->status->value,
        ];
    }
}
```

## Database Migrations

```php
$table->string('status')->default(PostStatus::DRAFT->value);
$table->enum('role', UserRole::values());
```

## Naming

- **File**: `{Name}.php` (PascalCase, no suffix)
- **Examples**:
  - `UserRole.php`
  - `PostStatus.php`
  - `HttpStatus.php`

## Best Practices

✅ **Use backed enums** - Always string or int backed
✅ **Use EnumTraits** - For common helper methods
✅ **Add custom methods** - Domain-specific logic in enum
✅ **Cast in models** - Use `$casts` property
✅ **Validate with Rule::enum()** - Type-safe validation
✅ **Use ->value in queries** - Explicit value access
✅ **Add labels** - User-facing strings via `label()` method

❌ **Don't use plain constants** - Prefer enums over `const`
❌ **Don't use non-backed enums** - Always use `: string` or `: int`
❌ **Don't forget ->value** - Always access `->value` in queries/responses

## Benefits

✅ Type safety
✅ IDE autocomplete
✅ Easy refactoring
✅ Self-documenting code
✅ Compile-time validation

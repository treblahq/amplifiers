# Laravel API Skill - Agent Instructions (Primary)

`AGENTS.md` is the canonical instruction file for AI assistants in this skill.
All other agent-specific files should reference this one to avoid drift.

## Scope

This skill is a domain-agnostic Laravel API playbook focused on architecture,
implementation patterns, and code quality for coding tasks.

## Where to Look

- Architecture and API design: `architecture/`
- Implementation patterns: `patterns/`
- Cross-cutting practices: `best-practices/`
- If anything conflicts, follow `AGENTS.md` first, then the detailed docs

## Knowledge Base

For comprehensive guidance, use:

- **Architecture**: [Overview](architecture/overview.md), [RESTful API](architecture/restful-api.md)
- **Patterns**: [Controllers](patterns/controllers.md), [Services](patterns/services.md), [Models](patterns/models.md), [Requests](patterns/requests.md), [Resources](patterns/resources.md), [Integrations](patterns/integrations.md), [Modules](patterns/modules.md), [Jobs](patterns/jobs.md), [Enums](patterns/enums.md), [Helpers](patterns/helpers.md), [Exceptions](patterns/exceptions.md)
- **Best Practices**: [Performance](best-practices/performance.md), [Naming Conventions](best-practices/naming-conventions.md), [Security](best-practices/security.md)

## Quick Rules

### 1. Strict Types and Type Safety

Use strict typing in PHP files when possible:

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;
```

- Type parameters, return types, and properties
- Prefer `final` for non-extensible classes
- Prefer `readonly` for constructor-injected dependencies
- Use modern PHP 8.4 features when they improve clarity

### 2. Layered Architecture

```text
Request -> Controller -> Service -> Repository/Model -> Database
                                |
                            Resource
```

- **Controllers**: HTTP concerns only
- **Services**: business orchestration
- **Repositories**: complex data access (when needed)
- **Models**: Eloquent entities and query logic
- **Integrations**: external API adapters
- **Modules**: internal reusable workflow blocks

### 3. Model Organization

Use trait-based organization in the model folder:

```text
app/Models/
├── Post/
│   ├── Post.php
│   ├── PostRelations.php
│   ├── PostScopes.php
│   ├── PostFunctions.php
│   ├── PostAttributes.php
│   ├── PostObserver.php
│   └── PostQueries.php
```

### 4. Service Pattern (Not Managers)

```php
final class PostService
{
    public function __construct(
        private readonly Post $post
    ) {}

    public function getUserPosts(int $userId): Collection
    {
        return $this->post->newQuery()
            ->whereUserId($userId)
            ->with('comments')
            ->get();
    }
}
```

### 5. Dependency Injection

Always inject dependencies via constructor:

```php
final class PostController extends Controller
{
    public function __construct(
        private readonly PostService $service
    ) {}

    public function index(Request $request): JsonResource
    {
        return PostResource::collection(
            $this->service->getUserPosts($request->user()->id)
        );
    }
}
```

### 6. API Resources

Use resources for API responses:

```php
final class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'created_at' => $this->resource->created_at,
        ];
    }
}
```

### 7. Enums

Prefer backed enums:

```php
enum PostStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
}

$posts = Post::where('status', PostStatus::PUBLISHED->value)->get();
```

### 8. Naming Conventions

- **Controllers**: `{Model}Controller.php` (e.g., `PostController.php`)
- **Services**: `{Domain}Service.php` (e.g., `PostService.php`)
- **Models**: singular PascalCase (e.g., `Post.php`)
- **Requests**: `{Action}{Model}Request.php` (e.g., `StorePostRequest.php`)
- **Resources**: `{Model}Resource.php` (e.g., `PostResource.php`)
- **Enums**: descriptive names (e.g., `PostStatus.php`)
- **Exceptions**: `{Domain}Exception.php` (e.g., `PostException.php`)
- **Jobs**: `{Action}{Entity}Job.php` (e.g., `ProcessPostJob.php`)

### 9. Clean Code

- Avoid unnecessary comments
- Keep methods small and intention-revealing
- Remove debug leftovers (`dd`, `dump`, `var_dump`)
- Use PHPDoc only when signatures are not enough

### 10. Performance

- Eager load relationships to avoid N+1
- Select only necessary columns
- Paginate large result sets
- Cache expensive queries
- Queue heavy or slow operations

### 11. Security

- Hash passwords (`bcrypt`/`argon2`)
- Validate all input with Form Requests
- Authorize actions with Policies/Gates
- Use parameterized queries (Eloquent/Query Builder)
- Apply rate limiting to public endpoints

## Language

- **Code**: English (`class`, methods, variables, comments)
- **User-facing text**: follow the product locale consistently
- **Commits**: English with conventional commits (`feat:`, `fix:`, `refactor:`)

## Development Commands

Use the commands available in the target project (examples):

```bash
php artisan test
./vendor/bin/pint
./vendor/bin/phpstan analyse
php artisan queue:work
```

## Additional Resources

- Laravel Docs: https://laravel.com/docs/12.x
- PHP 8.4 Features: https://www.php.net/releases/8.4/
- PSR-12: https://www.php-fig.org/psr/psr-12/
- [Full Knowledge Base](README.md)

# Naming Conventions

## General Rules

- **Code**: 100% English
- **User-facing**: Follow the product locale consistently (validation messages, API responses)
- **Comments**: English for code documentation
- **Commits**: English (conventional commits: `feat:`, `fix:`, `refactor:`)

## Controllers

**Pattern**: `{Model}Controller.php`

Examples:
- `UserController.php`
- `PostController.php`
- `OrderController.php`

**Method names** (RESTful):
- `index()` - List resources
- `show(int $id)` - Show single resource
- `store(Request $request)` - Create resource
- `update(Request $request, int $id)` - Update resource
- `destroy(int $id)` - Delete resource

## Services

**Pattern**: `{Domain}Service.php`

Examples:
- `UserService.php`
- `ConversationService.php`
- `OrderService.php`
- `PaymentService.php`

**Method names**:
- Use descriptive verbs: `createUser()`, `findById()`, `updateProfile()`
- Boolean methods: `isActive()`, `canAccess()`, `hasPermission()`

## Models

**Pattern**: Singular PascalCase, no suffix

Examples:
- `User.php`
- `Post.php`
- `Order.php`
- `ConversationMessage.php`

**Table names**: Plural snake_case
- `users`
- `posts`
- `orders`
- `conversation_messages`

**Traits**: `{Model}{Purpose}.php`
- `UserRelations.php`
- `UserScopes.php`
- `UserAttributes.php`
- `UserFunctions.php`

**Observer**: `{Model}Observer.php`
- `UserObserver.php`
- `PostObserver.php`

**Queries**: `{Model}Queries.php`
- `UserQueries.php`
- `PostQueries.php`

## Repositories

**Pattern**: `{Model}Repository.php`

Examples:
- `UserRepository.php`
- `PostRepository.php`
- `ConversationRepository.php`

## Requests

**Pattern**: `{Action}{Model}Request.php`

Examples:
- `StorePostRequest.php`
- `UpdatePostRequest.php`
- `IndexUserRequest.php`
- `DeleteCommentRequest.php`

## Resources

**Pattern**: `{Model}Resource.php`

Examples:
- `UserResource.php`
- `PostResource.php`
- `OrderResource.php`
- `OrderItemResource.php`

## Enums

**Pattern**: Descriptive name, no suffix

Examples:
- `UserRole.php`
- `PostStatus.php`
- `HttpStatus.php`

**Enum cases**: SCREAMING_SNAKE_CASE
```php
enum UserRole: string
{
    case ADMIN = 'admin';
    case USER = 'user';
    case MODERATOR = 'moderator';
}
```

## Helpers

**Pattern**: `{Purpose}Helper.php`

Examples:
- `StringHelper.php`
- `PhoneHelper.php`
- `DateHelper.php`
- `ArrayHelper.php`
- `ConfigHelper.php`

## Exceptions

**Pattern**: `{Domain}Exception.php`

Examples:
- `UserException.php`
- `ConversationException.php`
- `PaymentException.php`
- `AiProviderException.php`

**Factory methods**: Descriptive phrases
```php
UserException::notFound($userId);
UserException::emailAlreadyExists($email);
ConversationException::conversationMustHaveExactlyOneParticipant();
```

## Jobs

**Pattern**: `{Action}{Entity}Job.php`

Examples:
- `SendWelcomeEmailJob.php`
- `ProcessVideoJob.php`
- `GenerateReportJob.php`
- `SyncUserDataJob.php`

## Integrations

**Pattern**: `{Provider}Client.php` or `{Provider}Service.php`

Examples:
- `AiProviderClient.php`
- `StripeClient.php`
- `AnalyticsService.php`
- `AirtableService.php`

## Modules

**Pattern**: `{Module}Executor.php`, `{Module}Context.php`

Examples:
- `WorkflowEngineExecutor.php`
- `WorkflowEngineContext.php`
- `PaymentProcessorExecutor.php`

## Variables

### Local Variables

Use **camelCase**:
```php
$userName = 'John';
$userEmail = 'john@example.com';
$isActive = true;
$postCount = 10;
```

### Boolean Variables

Use **is**, **has**, **can** prefixes:
```php
$isActive = true;
$hasAccess = false;
$canEdit = true;
$shouldNotify = false;
```

### Collections

Use plural names:
```php
$users = User::all();
$posts = Post::where('active', true)->get();
$conversationMessages = ConversationMessage::whereBelongsTo($conversation)->get();
```

### Single Models

Use singular names:
```php
$user = User::find($id);
$post = Post::first();
$message = ConversationMessage::findOrFail($id);
```

## Methods

### CRUD Methods

```php
// Create
public function createUser(array $data): User
public function storePost(array $data): Post

// Read
public function findById(int $id): ?User
public function getUserById(int $id): User
public function getActiveUsers(): Collection

// Update
public function updateUser(int $id, array $data): User
public function updateProfile(User $user, array $data): User

// Delete
public function deleteUser(int $id): bool
public function removePost(Post $post): void
```

### Boolean Methods

```php
public function isActive(): bool
public function hasPermission(string $permission): bool
public function canEdit(User $user): bool
public function shouldNotify(): bool
```

### Query Methods

```php
public function findByEmail(string $email): ?User
public function findActiveUsers(): Collection
public function getPostsByUser(int $userId): Collection
```

## Routes

**Pattern**: kebab-case, plural for resources

```php
// RESTful routes
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Custom actions
Route::post('/users/{id}/activate', [UserController::class, 'activate']);
Route::post('/posts/{id}/publish', [PostController::class, 'publish']);
```

## Database

### Columns

Use **snake_case**:
```php
$table->string('first_name');
$table->string('email_verified_at');
$table->boolean('is_active');
$table->timestamp('deleted_at');
```

### Foreign Keys

Pattern: `{singular_table}_id`
```php
$table->foreignId('user_id')->constrained();
$table->foreignId('order_id')->constrained();
$table->foreignId('conversation_message_id')->constrained();
```

### Pivot Tables

Pattern: `{singular_table1}_{singular_table2}` (alphabetical)
- `post_tag` (not `tag_post`)
- `role_user` (not `user_role`)
- `conversation_user` (not `user_conversation`)

## Constants

Use **SCREAMING_SNAKE_CASE**:
```php
public const MAX_LOGIN_ATTEMPTS = 5;
public const DEFAULT_TIMEOUT = 30;
public const CACHE_TTL = 3600;
```

## Configuration Keys

Use **snake_case** with dots:
```php
config('app.name');
config('services.ai_provider.api_key');
config('cache.default');
```

## Cache Keys

Use descriptive keys with colons:
```php
Cache::remember('posts:popular', 3600, fn() => ...);
Cache::remember('users:active:count', 300, fn() => ...);
Cache::remember('user:1:profile', 600, fn() => ...);
```

## Event Names

Pattern: `{Model}{Action}`
- `UserCreated`
- `PostPublished`
- `PaymentCompleted`

## Best Practices

✅ **Descriptive names** - `getUserById()` not `get()`
✅ **Consistent casing** - camelCase variables, PascalCase classes
✅ **Boolean prefixes** - `isActive()`, `hasAccess()`, `canEdit()`
✅ **Plural for collections** - `$users`, `$posts`
✅ **Singular for models** - `$user`, `$post`
✅ **Verb-first methods** - `createUser()`, `updatePost()`

❌ **Don't abbreviate** - `getUserProfile()` not `getUsrProf()`
❌ **Don't use generic names** - `getData()`, `process()`, `handle()`
❌ **Don't mix languages** - English code, user-facing messages in the product locale
❌ **Don't use single letters** - except in loops: `$i`, `$j`, `$k`

## Language

- **Code**: 100% English (classes, methods, variables, comments)
- **User-facing**: Follow the product locale consistently (validation messages, API responses)
- **Commits**: English (conventional commits: `feat:`, `fix:`, `refactor:`)

## Development Commands

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
- [Full Knowledge Base](../README.md)

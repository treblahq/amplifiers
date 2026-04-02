# Security Best Practices

## Authentication

### Token-Based Authentication (Sanctum, Passport, or JWT)

```php
// ✅ Generate token on login
public function login(Request $request): JsonResponse
{
    $credentials = $request->only('email', 'password');

    if (!Auth::attempt($credentials)) {
        throw ApiException::unauthorized('Invalid credentials');
    }

    $user = Auth::user();
    $token = $user->createToken('api-token')->accessToken;

    return response()->json([
        'token' => $token,
        'user' => UserResource::make($user),
    ]);
}

// ✅ Protect routes with auth middleware
Route::middleware('auth:api')->group(function () {
    Route::get('/user', [UserController::class, 'show']);
});
```

### Password Hashing

```php
use Illuminate\Support\Facades\Hash;

// ✅ Always hash passwords
$user = User::create([
    'name' => $request->name,
    'email' => $request->email,
    'password' => Hash::make($request->password),
]);

// ✅ Verify passwords
if (!Hash::check($request->password, $user->password)) {
    throw UserException::invalidCredentials();
}

// ❌ NEVER store plain text passwords
$user->password = $request->password; // WRONG!

// Laravel 12 - Improved password validation
$request->validate([
    'password' => ['required', Password::min(8)
        ->letters()
        ->mixedCase()
        ->numbers()
        ->symbols()
        ->uncompromised()], // Checks against leaked password databases
]);
```

## Authorization

### Policy Classes

```php
<?php

namespace App\Policies;

use App\Models\User\User;
use App\Models\Post\Post;

final class PostPolicy
{
    public function view(User $user, Post $post): bool
    {
        return $post->is_published || $user->id === $post->user_id;
    }

    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->isAdmin();
    }
}

// Register in AuthServiceProvider
protected $policies = [
    Post::class => PostPolicy::class,
];
```

### Authorization in Controllers

```php
public function update(UpdatePostRequest $request, Post $post): JsonResource
{
    // ✅ Authorize action
    $this->authorize('update', $post);

    $updated = $this->service->updatePost($post->id, $request->validated());

    return PostResource::make($updated);
}

// Or in Request
public function authorize(): bool
{
    $post = $this->route('post');
    return $this->user()->can('update', $post);
}
```

### Gate-Based Authorization

```php
use Illuminate\Support\Facades\Gate;

Gate::define('manage-users', function (User $user) {
    return $user->role === UserRole::ADMIN;
});

// Usage
if (Gate::allows('manage-users')) {
    // User can manage users
}

// In controller
$this->authorize('manage-users');
```

## Input Validation

### Always Validate User Input

```php
// ✅ Use Form Requests
final class StorePostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'status' => ['required', Rule::enum(PostStatus::class)],
            'tags' => ['nullable', 'array', 'max:5'],
            'tags.*' => ['integer', 'exists:tags,id'],
        ];
    }
}
```

### Sanitize Output

```php
// ✅ Use Resources to hide sensitive data
final class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'email' => $this->resource->email,
            // ❌ NEVER expose:
            // 'password',
            // 'remember_token',
            // 'api_token',
        ];
    }
}
```

## SQL Injection Prevention

### Use Query Builder or Eloquent

```php
// ✅ SAFE - Parameterized queries
$users = User::where('email', $email)->get();
$posts = Post::whereIn('id', $ids)->get();

// ❌ UNSAFE - Raw SQL with user input
DB::select("SELECT * FROM users WHERE email = '{$email}'");

// ✅ SAFE - Raw queries with bindings
DB::select('SELECT * FROM users WHERE email = ?', [$email]);
```

### Avoid Mass Assignment Vulnerabilities

```php
// Define fillable or guarded
final class User extends Model
{
    // ✅ Whitelist fillable fields
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    // Or blacklist guarded fields
    protected $guarded = [
        'id',
        'is_admin',
        'created_at',
        'updated_at',
    ];
}

// ❌ NEVER use unguarded
Model::unguard(); // DANGEROUS!
```

## CSRF Protection

### Enable CSRF for Web Routes

```php
// routes/web.php - CSRF automatically applied
Route::post('/form', [FormController::class, 'submit']);

// ✅ Include CSRF token in forms
<form method="POST" action="/form">
    @csrf
    ...
</form>

// ✅ In JavaScript
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;
```

### Exempt API Routes (use token auth instead)

```php
// app/Http/Middleware/VerifyCsrfToken.php
protected $except = [
    'api/*',
];
```

## XSS Prevention

### Always Escape Output

```php
// ✅ In Blade (automatic escaping)
{{ $user->name }}

// ❌ UNSAFE - No escaping
{!! $user->name !!}

// ✅ In JSON responses (automatic)
return response()->json([
    'name' => $user->name, // Automatically escaped
]);
```

## Rate Limiting

### Throttle API Endpoints

```php
// In routes/api.php
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
});

// Custom rate limiting
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});
```

## Environment Variables

### Store Sensitive Data in .env

```php
// ✅ GOOD - Use .env
THIRD_PARTY_API_KEY=sk-xxxxxxxxxxxxx
DB_PASSWORD=secure_password

// ❌ NEVER commit .env to version control
# Add to .gitignore
.env
.env.backup
.env.production
```

### Access via config()

```php
// ✅ Define in config/services.php
'ai_provider' => [
    'api_key' => env('THIRD_PARTY_API_KEY'),
],

// ✅ Access via config
$apiKey = config('services.ai_provider.api_key');

// ❌ Don't use env() directly in code
$apiKey = env('THIRD_PARTY_API_KEY'); // BAD outside config files
```

## File Upload Security

### Validate File Uploads

```php
public function rules(): array
{
    return [
        'avatar' => [
            'required',
            'image',
            'mimes:jpeg,png,jpg',
            'max:2048', // 2MB
        ],
        'document' => [
            'required',
            'file',
            'mimes:pdf,doc,docx',
            'max:10240', // 10MB
        ],
    ];
}
```

### Store Files Securely

```php
use Illuminate\Support\Facades\Storage;

// ✅ Store with generated names
$path = $request->file('avatar')->store('avatars', 'private');

// ✅ Don't use original filename directly
$filename = uniqid() . '.' . $request->file('avatar')->extension();

// ❌ UNSAFE - Using user-supplied filename
Storage::put($request->file('avatar')->getClientOriginalName(), $file);
```

## HTTPS/TLS

### Force HTTPS in Production

```php
// In AppServiceProvider
public function boot(): void
{
    if ($this->app->environment('production')) {
        URL::forceScheme('https');
    }
}
```

## Logging Security Events

```php
use Illuminate\Support\Facades\Log;

// Log authentication attempts
Log::info('User login attempt', [
    'email' => $request->email,
    'ip' => $request->ip(),
]);

// Log authorization failures
Log::warning('Unauthorized access attempt', [
    'user_id' => $user->id,
    'action' => 'update',
    'resource' => 'Post',
    'resource_id' => $post->id,
]);

// Log security exceptions
Log::error('Security exception', [
    'exception' => $e->getMessage(),
    'user_id' => $user->id,
    'ip' => $request->ip(),
]);
```

## API Security Headers

### Add Security Headers

```php
// In middleware
public function handle(Request $request, Closure $next): Response
{
    $response = $next($request);

    $response->headers->set('X-Content-Type-Options', 'nosniff');
    $response->headers->set('X-Frame-Options', 'DENY');
    $response->headers->set('X-XSS-Protection', '1; mode=block');
    $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return $response;
}
```

## CORS Configuration

```php
// config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
    'allowed_origins' => [
        'https://app.example.com',
        'https://admin.example.com',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## Security Checklist

✅ **Hash passwords** with bcrypt/argon2
✅ **Use token-based authentication** (Sanctum, Passport, or JWT) for API authentication
✅ **Implement authorization** with Policies/Gates
✅ **Validate all input** with Form Requests
✅ **Use parameterized queries** (Eloquent/Query Builder)
✅ **Enable CSRF protection** for web routes
✅ **Rate limit** API endpoints
✅ **Store secrets** in .env, never commit
✅ **Validate file uploads** (type, size, extension)
✅ **Force HTTPS** in production
✅ **Log security events**
✅ **Add security headers**
✅ **Configure CORS** properly

❌ **Don't store plain passwords**
❌ **Don't expose sensitive data** in API responses
❌ **Don't use raw SQL** with user input
❌ **Don't disable CSRF** unnecessarily
❌ **Don't commit .env** files
❌ **Don't trust user input** - always validate
❌ **Don't use original filenames** for uploads

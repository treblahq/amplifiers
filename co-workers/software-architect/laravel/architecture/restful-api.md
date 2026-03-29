# RESTful API Design

## API Versioning

All API routes are versioned and prefixed:

```
/api/v2/{resource}
```

## Route Organization

### Public Routes (Guest)
- Accessible without user authentication
- Protected by system token (`guest.api.token`)
- Used for inter-system communication

### Private Routes (Authenticated)
- Require user authentication via tokens (Sanctum, Passport, or JWT)
- Scoped to authenticated user's resources
- Follow `auth:api` middleware

## RESTful Endpoint Structure

### Anatomy of a Route

```
/api/v2/users/posts/alerts/{id}
```

| Part | Description |
|------|-------------|
| `/api` | API prefix (separates web routes from API) |
| `/v2` | API version |
| `/users` | User context (authenticated user) |
| `/posts` | User's posts (sub-resource) |
| `/alerts` | Alerts for posts (nested sub-resource) |
| `/{id}` | Specific alert identifier |

### Resource Hierarchy

Resources follow hierarchical ownership:

```
/users → belongs to authenticated user
  /posts → belongs to user
    /alerts → belongs to post
      /{id} → specific alert
```

## HTTP Methods

| Method | Action | Example |
|--------|--------|---------|
| GET | Retrieve resource(s) | `GET /api/v2/users/posts` |
| POST | Create new resource | `POST /api/v2/users/posts` |
| PUT/PATCH | Update resource | `PUT /api/v2/users/posts/{id}` |
| DELETE | Delete resource | `DELETE /api/v2/users/posts/{id}` |

## Response Format

All API responses use `JsonResource` for consistent formatting:

```php
// Success (200)
{
  "data": {
    "id": 1,
    "name": "Example",
    "created_at": "2026-02-05T10:00:00Z"
  }
}

// Collection (200)
{
  "data": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ],
  "meta": {
    "current_page": 1,
    "total": 2
  }
}

// Error (4xx/5xx)
{
  "message": "Resource not found",
  "errors": {
    "id": ["The selected id is invalid."]
  }
}
```

## Route Naming

Routes are named using dot notation for clarity:

```php
Route::get('/users/posts', [PostController::class, 'index'])
    ->name('users.posts.index');

Route::post('/users/posts', [PostController::class, 'store'])
    ->name('users.posts.store');
```

## Pagination

List endpoints support pagination:

```php
GET /api/v2/users/posts?page=2&per_page=20
```

Response includes meta:

```json
{
  "data": [...],
  "links": {
    "first": "...",
    "last": "...",
    "prev": "...",
    "next": "..."
  },
  "meta": {
    "current_page": 2,
    "from": 21,
    "to": 40,
    "total": 100,
    "per_page": 20,
    "last_page": 5
  }
}
```

## Filtering and Sorting

Support query parameters for filtering:

```php
GET /api/v2/users/posts?status=published&sort=-created_at
```

Implement in Service layer, not Controller.

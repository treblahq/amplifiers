# Requests Pattern

## Purpose

Requests centralize:
- Input validation rules
- Authorization logic
- Data sanitization
- Custom error messages

## Structure

```php
<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Or check user permissions
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'status' => ['required', 'in:draft,published'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['integer', 'exists:tags,id'],
        ];
    }

    /**
     * Get custom error messages for validation.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'O título é obrigatório.',
            'content.required' => 'O conteúdo é obrigatório.',
        ];
    }

    /**
     * Get custom attribute names for error messages.
     */
    public function attributes(): array
    {
        return [
            'title' => 'título',
            'content' => 'conteúdo',
        ];
    }
}
```

## Authorization

Check if user can perform action:

```php
public function authorize(): bool
{
    // Check if user owns the resource
    $post = $this->route('post');
    return $this->user()->id === $post->user_id;
}
```

## Validation Rules

Common patterns:

```php
public function rules(): array
{
    return [
        // Required fields
        'email' => ['required', 'email', 'unique:users'],

        // Optional fields
        'bio' => ['nullable', 'string', 'max:500'],

        // Enums
        'status' => ['required', Rule::enum(PostStatus::class)],

        // Foreign keys
        'category_id' => ['required', 'exists:categories,id'],

        // Arrays
        'tags' => ['nullable', 'array', 'max:5'],
        'tags.*' => ['integer', 'exists:tags,id'],

        // Files
        'avatar' => ['nullable', 'image', 'max:2048'],

        // Dates
        'published_at' => ['nullable', 'date', 'after:today'],

        // Complex validation
        'password' => ['required', 'min:8', 'confirmed'],

        // Laravel 12 - New validation rules
        'url' => ['required', 'url', 'active_url'], // Checks if URL is reachable
        'hex_color' => ['required', 'hex_color'], // Validates hex colors
        'list' => ['required', 'list'], // Ensures array has sequential keys
    ];
}
```

## Custom Validation

```php
use Illuminate\Validation\Rule;

public function rules(): array
{
    return [
        'email' => [
            'required',
            'email',
            Rule::unique('users')->ignore($this->user()->id),
        ],
    ];
}
```

## Dependency Injection

Inject services if needed:

```php
public function __construct(
    private readonly PostService $postService
) {
    parent::__construct();
}

public function authorize(): bool
{
    return $this->postService->canUserEditPost(
        $this->user()->id,
        $this->route('post')->id
    );
}
```

## Naming

- **File**: `{Action}{Model}Request.php` (PascalCase)
- **Examples**:
  - `StorePostRequest.php`
  - `UpdatePostRequest.php`
  - `IndexPostRequest.php`
  - `DeletePostRequest.php`

## Usage in Controller

```php
public function store(StorePostRequest $request): JsonResource
{
    // $request->validated() contains validated data
    $post = $this->service->createPost(
        userId: $request->user()->id,
        data: $request->validated()
    );

    return PostResource::make($post);
}
```

## Benefits

✅ Centralized validation
✅ Reusable rules
✅ Authorization logic
✅ Custom error messages
✅ Type-safe validated data

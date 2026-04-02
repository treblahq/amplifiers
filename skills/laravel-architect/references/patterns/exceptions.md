# Exceptions Pattern

## Purpose

Custom exceptions provide:
- Specific error types
- Custom error messages
- Static factory methods
- Better debugging
- Consistent error handling

## Structure

```php
<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

final class UserException extends Exception
{
    public static function notFound(int $userId): self
    {
        return new self("User with ID {$userId} not found");
    }

    public static function emailAlreadyExists(string $email): self
    {
        return new self("User with email {$email} already exists");
    }

    public static function unauthorized(): self
    {
        return new self('User is not authorized to perform this action');
    }

    public static function accountDeactivated(): self
    {
        return new self('User account has been deactivated');
    }
}
```

## HTTP Exceptions

```php
<?php

declare(strict_types=1);

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\HttpException;

final class ApiException extends HttpException
{
    public static function notFound(string $resource, int $id): self
    {
        return new self(404, "{$resource} with ID {$id} not found");
    }

    public static function unauthorized(string $message = 'Unauthorized'): self
    {
        return new self(401, $message);
    }

    public static function forbidden(string $message = 'Forbidden'): self
    {
        return new self(403, $message);
    }

    public static function badRequest(string $message): self
    {
        return new self(400, $message);
    }

    public static function conflict(string $message): self
    {
        return new self(409, $message);
    }

    public static function serverError(string $message = 'Internal Server Error'): self
    {
        return new self(500, $message);
    }
}
```

## Domain Exceptions

```php
<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

final class ConversationException extends Exception
{
    public static function conversationMustHaveExactlyOneParticipant(): self
    {
        return new self('Automated conversation must have exactly one participant');
    }

    public static function messageNotFound(int $messageId): self
    {
        return new self("Message with ID {$messageId} not found");
    }

    public static function invalidConversationType(string $type): self
    {
        return new self("Invalid conversation type: {$type}");
    }

    public static function tooManyMessages(): self
    {
        return new self('Conversation has exceeded maximum number of messages');
    }
}
```

## Integration Exceptions

```php
<?php

declare(strict_types=1);

namespace App\Integrations\AiProvider\Exceptions;

use Exception;

final class AiProviderException extends Exception
{
    public static function rateLimitExceeded(): self
    {
        return new self('AiProvider rate limit exceeded');
    }

    public static function invalidApiKey(): self
    {
        return new self('Invalid AiProvider API key');
    }

    public static function timeout(): self
    {
        return new self('AiProvider request timed out');
    }

    public static function invalidResponse(string $reason): self
    {
        return new self("Invalid AiProvider response: {$reason}");
    }
}
```

## Validation Exceptions

```php
<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

final class ValidationException extends Exception
{
    public static function invalidEmail(string $email): self
    {
        return new self("Invalid email format: {$email}");
    }

    public static function invalidPhoneNumber(string $phone): self
    {
        return new self("Invalid phone number format: {$phone}");
    }

    public static function fieldRequired(string $field): self
    {
        return new self("Field '{$field}' is required");
    }
}
```

## Usage in Services

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\UserException;
use App\Models\User\User;

final class UserService
{
    public function findById(int $userId): User
    {
        $user = User::find($userId);

        if (!$user) {
            throw UserException::notFound($userId);
        }

        return $user;
    }

    public function createUser(array $data): User
    {
        $existingUser = User::where('email', $data['email'])->first();

        if ($existingUser) {
            throw UserException::emailAlreadyExists($data['email']);
        }

        return User::create($data);
    }
}
```

## Usage in Controllers

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Exceptions\UserException;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

final class UserController extends Controller
{
    public function __construct(
        private readonly UserService $service
    ) {}

    public function show(int $id): JsonResponse
    {
        try {
            $user = $this->service->findById($id);

            return response()->json($user);
        } catch (UserException $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
```

## Exception Handler

Register custom exception rendering in `app/Exceptions/Handler.php`:

```php
use App\Exceptions\UserException;
use App\Exceptions\ApiException;

public function register(): void
{
    $this->renderable(function (UserException $e, Request $request) {
        return response()->json([
            'error' => $e->getMessage(),
        ], 404);
    });

    $this->renderable(function (ApiException $e, Request $request) {
        return response()->json([
            'error' => $e->getMessage(),
        ], $e->getStatusCode());
    });
}
```

## Exception with Context

```php
<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

final class PaymentException extends Exception
{
    public function __construct(
        string $message,
        private readonly ?array $context = null
    ) {
        parent::__construct($message);
    }

    public static function failed(string $reason, array $context = []): self
    {
        return new self("Payment failed: {$reason}", $context);
    }

    public function getContext(): ?array
    {
        return $this->context;
    }
}

// Usage
throw PaymentException::failed('Insufficient funds', [
    'user_id' => $userId,
    'amount' => $amount,
    'balance' => $balance,
]);
```

## Naming

- **File**: `{Domain}Exception.php` (PascalCase with Exception suffix)
- **Examples**:
  - `UserException.php`
  - `ConversationException.php`
  - `PaymentException.php`
  - `AiProviderException.php`

## Best Practices

✅ **Use static factory methods** - Descriptive method names
✅ **Include context** - Add relevant IDs/values to message
✅ **Extend Exception** - Or HttpException for HTTP errors
✅ **Be specific** - Create domain-specific exceptions
✅ **Use final** - All exception classes should be `final`
✅ **Register rendering** - Handle in `app/Exceptions/Handler.php`
✅ **Log exceptions** - Use `report()` method for logging

❌ **Don't use generic exceptions** - Avoid `throw new Exception()`
❌ **Don't expose sensitive data** - No passwords/tokens in messages
❌ **Don't catch all exceptions** - Catch specific exception types
❌ **Don't suppress exceptions** - Always log or re-throw

## Testing

```php
use App\Exceptions\UserException;

test('throws exception when user not found', function () {
    expect(fn() => $this->service->findById(999))
        ->toThrow(UserException::class, 'User with ID 999 not found');
});

test('throws exception when email exists', function () {
    User::factory()->create(['email' => 'test@example.com']);

    expect(fn() => $this->service->createUser(['email' => 'test@example.com']))
        ->toThrow(UserException::class, 'User with email test@example.com already exists');
});
```

## Benefits

✅ Type-safe error handling
✅ Descriptive error messages
✅ Easy to test
✅ Better debugging
✅ Consistent error responses
✅ Self-documenting code

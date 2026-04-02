# Integrations Pattern

## Purpose

Integrations encapsulate:
- External API communication
- Third-party service adapters
- HTTP client configuration
- Response transformation
- Error handling

## Directory Structure

```
app/Integrations/
├── AiProvider/
│   ├── AiProviderClient.php
│   ├── AiProviderConfig.php
│   └── DTOs/
├── Analytics/
│   └── AnalyticsService.php
├── Airtable/
│   └── AirtableService.php
└── Stripe/
    ├── StripeClient.php
    └── StripeWebhookHandler.php
```

## Basic Integration

```php
<?php

declare(strict_types=1);

namespace App\Integrations\AiProvider;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

final class AiProviderClient
{
    private const BASE_URL = 'https://api.provider.com/v1/';

    public function __construct(
        private readonly string $apiKey,
        private readonly Client $http
    ) {}

    public function createCompletion(array $messages, string $model = 'model-v1'): array
    {
        try {
            $response = $this->http->post(self::BASE_URL . 'chat/completions', [
                'headers' => [
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => $model,
                    'messages' => $messages,
                ],
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            Log::error('AiProvider API error', [
                'error' => $e->getMessage(),
                'messages' => $messages,
            ]);

            throw new AiProviderException('Failed to create completion', 0, $e);
        }
    }
}
```

## Service Provider Registration

```php
// app/Providers/IntegrationServiceProvider.php
namespace App\Providers;

use App\Integrations\AiProvider\AiProviderClient;
use GuzzleHttp\Client;
use Illuminate\Support\ServiceProvider;

final class IntegrationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(AiProviderClient::class, function ($app) {
            return new AiProviderClient(
                apiKey: config('services.ai_provider.api_key'),
                http: new Client([
                    'timeout' => 30,
                    'verify' => true,
                ])
            );
        });
    }
}
```

## Configuration

```php
// app/Integrations/AiProvider/AiProviderConfig.php
<?php

declare(strict_types=1);

namespace App\Integrations\AiProvider;

final class AiProviderConfig
{
    public const DEFAULT_MODEL = 'model-v1';
    public const MAX_TOKENS = 2000;
    public const TEMPERATURE = 0.7;

    public static function getModel(): string
    {
        return config('services.ai_provider.model', self::DEFAULT_MODEL);
    }
}
```

## DTOs (Data Transfer Objects)

```php
// app/Integrations/AiProvider/DTOs/CompletionRequest.php
<?php

declare(strict_types=1);

namespace App\Integrations\AiProvider\DTOs;

final readonly class CompletionRequest
{
    public function __construct(
        public array $messages,
        public string $model = 'model-v1',
        public int $maxTokens = 2000,
        public float $temperature = 0.7
    ) {}

    public function toArray(): array
    {
        return [
            'model' => $this->model,
            'messages' => $this->messages,
            'max_tokens' => $this->maxTokens,
            'temperature' => $this->temperature,
        ];
    }
}
```

## Error Handling

```php
// app/Integrations/AiProvider/Exceptions/AiProviderException.php
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
}
```

## Retry Logic

```php
use Illuminate\Support\Facades\Http;

public function createCompletion(array $messages): array
{
    $response = Http::retry(3, 1000) // 3 retries, 1s delay
        ->timeout(30)
        ->withToken($this->apiKey)
        ->post(self::BASE_URL . 'chat/completions', [
            'model' => 'model-v1',
            'messages' => $messages,
        ]);

    if ($response->failed()) {
        throw AiProviderException::rateLimitExceeded();
    }

    return $response->json();
}
```

## Testing

Mock integrations in tests:

```php
use App\Integrations\AiProvider\AiProviderClient;

test('creates provider completion', function () {
    $mock = Mockery::mock(AiProviderClient::class);
    $mock->shouldReceive('createCompletion')
        ->once()
        ->with([['role' => 'user', 'content' => 'Hello']])
        ->andReturn(['choices' => [['message' => ['content' => 'Hi']]]]);

    $this->app->instance(AiProviderClient::class, $mock);

    // Test code...
});
```

## Naming Conventions

- **Client**: For direct API communication (`StripeClient`, `AiProviderClient`)
- **Service**: For business logic wrapper (`AnalyticsService`, `AirtableService`)
- **Handler**: For webhooks (`StripeWebhookHandler`)
- **Config**: For configuration (`AiProviderConfig`)

## Best Practices

✅ **Inject dependencies** - Constructor injection for HTTP clients
✅ **Use DTOs** - Type-safe request/response objects
✅ **Log errors** - Always log external API failures
✅ **Handle timeouts** - Set reasonable timeout values
✅ **Retry transient failures** - Use retry logic for rate limits
✅ **Mock in tests** - Never hit real APIs in tests
✅ **Environment config** - API keys in `.env`, not hardcoded
✅ **Custom exceptions** - Specific exception types for integration errors

## Examples

```php
// Usage in Service
final class ConversationService
{
    public function __construct(
        private readonly AiProviderClient $aiProvider
    ) {}

    public function generateResponse(string $message): string
    {
        $response = $this->aiProvider->createCompletion([
            ['role' => 'user', 'content' => $message],
        ]);

        return $response['choices'][0]['message']['content'];
    }
}
```

# Jobs Pattern

## Purpose

Jobs handle:
- Asynchronous processing
- Queue-based tasks
- Long-running operations
- Retry logic with backoff
- Timeout handling

## Structure

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\User\User;
use App\Services\EmailService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

final class SendWelcomeEmailJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 120;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 60;

    /**
     * Delete the job if its models no longer exist.
     */
    public bool $deleteWhenMissingModels = true;

    public function __construct(
        private readonly int $userId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(EmailService $emailService): void
    {
        $user = User::find($this->userId);

        if (!$user) {
            Log::warning('User not found for welcome email', ['user_id' => $this->userId]);
            return;
        }

        $emailService->sendWelcomeEmail($user);

        Log::info('Welcome email sent', ['user_id' => $this->userId]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Failed to send welcome email', [
            'user_id' => $this->userId,
            'error' => $exception->getMessage(),
        ]);
    }
}
```

## Dispatching Jobs

### Immediate Dispatch

```php
// Dispatch to queue
SendWelcomeEmailJob::dispatch($userId);

// Dispatch with delay (5 minutes)
SendWelcomeEmailJob::dispatch($userId)->delay(now()->addMinutes(5));

// Dispatch to specific queue
SendWelcomeEmailJob::dispatch($userId)->onQueue('emails');

// Dispatch to specific connection
SendWelcomeEmailJob::dispatch($userId)->onConnection('redis');
```

### Conditional Dispatch

```php
SendWelcomeEmailJob::dispatchIf($user->needsWelcomeEmail(), $userId);
SendWelcomeEmailJob::dispatchUnless($user->hasReceivedWelcomeEmail(), $userId);
```

### Sync Dispatch (for testing)

```php
SendWelcomeEmailJob::dispatchSync($userId);
```

## Job Configuration

### Retry Strategy

```php
/**
 * Calculate the number of seconds to wait before retrying.
 */
public function backoff(): array
{
    return [60, 300, 600]; // 1min, 5min, 10min
}
```

### Timeout

```php
public int $timeout = 300; // 5 minutes
```

### Max Attempts

```php
public int $tries = 5;
```

### Max Exceptions

```php
public int $maxExceptions = 3;
```

## Queue Priority

```php
SendWelcomeEmailJob::dispatch($userId)->onQueue('high');
ProcessReportJob::dispatch($reportId)->onQueue('low');
```

Configure queues in `config/queue.php`:

```php
'connections' => [
    'redis' => [
        'driver' => 'redis',
        'queue' => env('REDIS_QUEUE', 'default'),
        'retry_after' => 90,
        'block_for' => null,
    ],
],
```

## Batch Jobs

```php
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;

$batch = Bus::batch([
    new ProcessUserJob($userId1),
    new ProcessUserJob($userId2),
    new ProcessUserJob($userId3),
])->then(function (Batch $batch) {
    // All jobs completed successfully
})->catch(function (Batch $batch, \Throwable $e) {
    // First batch job failure
})->finally(function (Batch $batch) {
    // The batch has finished executing
})->dispatch();
```

## Chain Jobs

```php
use Illuminate\Support\Facades\Bus;

Bus::chain([
    new ProcessPaymentJob($paymentId),
    new SendReceiptJob($paymentId),
    new NotifyAdminJob($paymentId),
])->dispatch();
```

## Job Middleware

```php
use App\Jobs\Middleware\RateLimited;

public function middleware(): array
{
    return [
        new RateLimited('emails', maxAttempts: 10, decayMinutes: 1),
    ];
}
```

## Testing

```php
use Illuminate\Support\Facades\Queue;

test('dispatches welcome email job', function () {
    Queue::fake();

    $user = User::factory()->create();

    // Trigger action that dispatches job
    app(UserService::class)->registerUser($user);

    // Assert job was dispatched
    Queue::assertPushed(SendWelcomeEmailJob::class, function ($job) use ($user) {
        return $job->userId === $user->id;
    });
});

test('handles job execution', function () {
    $user = User::factory()->create();

    // Execute job synchronously
    SendWelcomeEmailJob::dispatchSync($user->id);

    // Assert side effects
    expect($user->fresh()->welcome_email_sent_at)->not->toBeNull();
});
```

## Error Handling

```php
public function handle(EmailService $emailService): void
{
    try {
        $user = User::findOrFail($this->userId);
        $emailService->sendWelcomeEmail($user);
    } catch (\Exception $e) {
        Log::error('Welcome email failed', [
            'user_id' => $this->userId,
            'error' => $e->getMessage(),
        ]);

        // Re-throw to trigger retry
        throw $e;
    }
}

public function failed(\Throwable $exception): void
{
    // Called after max attempts reached
    Log::error('Welcome email permanently failed', [
        'user_id' => $this->userId,
        'error' => $exception->getMessage(),
    ]);

    // Notify admin, mark as failed, etc.
}
```

## Naming

- **File**: `{Action}{Entity}Job.php`
- **Examples**:
  - `SendWelcomeEmailJob.php`
  - `ProcessVideoJob.php`
  - `GenerateReportJob.php`
  - `SyncUserDataJob.php`

## Best Practices

✅ **Use dependency injection** - Inject services in `handle()` method
✅ **Pass IDs, not models** - Serialize IDs, not full models
✅ **Set timeout** - Prevent jobs from running forever
✅ **Configure retries** - Use exponential backoff
✅ **Log failures** - Implement `failed()` method
✅ **Test jobs** - Queue::fake() for unit tests
✅ **Use queues** - Separate high/low priority jobs
✅ **Handle missing models** - Set `$deleteWhenMissingModels = true`

❌ **Don't serialize models** - Pass IDs instead
❌ **Don't use closures** - Use explicit Job classes
❌ **Don't forget timeout** - Jobs can hang without timeout
❌ **Don't ignore failures** - Implement `failed()` method

## Running Queue Workers

```bash
# Start queue worker
php artisan queue:work

# Specific queue
php artisan queue:work --queue=high,default,low

# With timeout
php artisan queue:work --timeout=300

# Restart workers after code changes
php artisan queue:restart
```

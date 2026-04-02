# Helpers Pattern

## Purpose

Helpers are **pure utility functions**:
- Static methods only
- No dependencies on Laravel facades (when possible)
- No side effects
- Reusable across the application

## Structure

```php
<?php

declare(strict_types=1);

namespace App\Helpers;

final class StringHelper
{
    /**
     * Get the first name from a full name.
     */
    public static function firstName(string $fullName): string
    {
        return explode(' ', trim($fullName))[0];
    }

    /**
     * Truncate string to specified length.
     */
    public static function truncate(string $text, int $length = 100, string $suffix = '...'): string
    {
        if (mb_strlen($text) <= $length) {
            return $text;
        }

        return mb_substr($text, 0, $length) . $suffix;
    }

    /**
     * Convert string to slug.
     */
    public static function slug(string $text): string
    {
        $text = mb_strtolower($text);
        $text = preg_replace('/[^a-z0-9\s-]/', '', $text);
        $text = preg_replace('/[\s-]+/', '-', $text);

        return trim($text, '-');
    }

    /**
     * Check if string contains another string (case-insensitive).
     */
    public static function contains(string $haystack, string $needle): bool
    {
        return str_contains(mb_strtolower($haystack), mb_strtolower($needle));
    }
}
```

## Common Helper Categories

### String Helpers

```php
final class StringHelper
{
    public static function firstName(string $fullName): string
    {
        return explode(' ', trim($fullName))[0];
    }

    public static function initials(string $fullName): string
    {
        $parts = explode(' ', trim($fullName));

        if (count($parts) === 1) {
            return mb_substr($parts[0], 0, 2);
        }

        return mb_substr($parts[0], 0, 1) . mb_substr(end($parts), 0, 1);
    }

    public static function mask(string $value, int $visible = 4): string
    {
        $length = mb_strlen($value);

        if ($length <= $visible) {
            return $value;
        }

        return str_repeat('*', $length - $visible) . mb_substr($value, -$visible);
    }
}
```

### Date Helpers

```php
final class DateHelper
{
    public static function isWeekend(\DateTimeInterface $date): bool
    {
        return in_array((int) $date->format('N'), [6, 7], true);
    }

    public static function isWorkday(\DateTimeInterface $date): bool
    {
        return !self::isWeekend($date);
    }

    public static function addWorkdays(\DateTimeInterface $date, int $days): \DateTimeInterface
    {
        $current = clone $date;
        $added = 0;

        while ($added < $days) {
            $current->modify('+1 day');

            if (self::isWorkday($current)) {
                $added++;
            }
        }

        return $current;
    }
}
```

### Phone Helpers

```php
final class PhoneHelper
{
    public static function format(string $phone): string
    {
        $phone = preg_replace('/\D/', '', $phone);

        if (strlen($phone) === 11) {
            return preg_replace('/(\d{2})(\d{5})(\d{4})/', '($1) $2-$3', $phone);
        }

        if (strlen($phone) === 10) {
            return preg_replace('/(\d{2})(\d{4})(\d{4})/', '($1) $2-$3', $phone);
        }

        return $phone;
    }

    public static function stripFormatting(string $phone): string
    {
        return preg_replace('/\D/', '', $phone);
    }

    public static function isValid(string $phone): bool
    {
        $stripped = self::stripFormatting($phone);

        return in_array(strlen($stripped), [10, 11], true);
    }
}
```

### Array Helpers

```php
final class ArrayHelper
{
    public static function pluckRecursive(array $array, string $key): array
    {
        $result = [];

        foreach ($array as $item) {
            if (is_array($item)) {
                if (isset($item[$key])) {
                    $result[] = $item[$key];
                }

                $result = array_merge($result, self::pluckRecursive($item, $key));
            }
        }

        return $result;
    }

    public static function flatten(array $array): array
    {
        $result = [];

        array_walk_recursive($array, function ($value) use (&$result) {
            $result[] = $value;
        });

        return $result;
    }

    public static function groupBy(array $array, string $key): array
    {
        $result = [];

        foreach ($array as $item) {
            $groupKey = $item[$key] ?? 'undefined';
            $result[$groupKey][] = $item;
        }

        return $result;
    }
}
```

### Config Helpers

```php
final class ConfigHelper
{
    public static function isProduction(): bool
    {
        return config('app.env') === 'production';
    }

    public static function isDevelopment(): bool
    {
        return config('app.env') === 'local';
    }

    public static function appUrl(): string
    {
        return config('app.url');
    }

    public static function maxUploadSize(): int
    {
        return config('app.max_upload_size', 10240); // 10MB default
    }
}
```

### URL Helpers

```php
final class UrlHelper
{
    public static function isExternal(string $url): bool
    {
        $host = parse_url($url, PHP_URL_HOST);
        $appHost = parse_url(config('app.url'), PHP_URL_HOST);

        return $host !== $appHost;
    }

    public static function addQueryParams(string $url, array $params): string
    {
        $parsed = parse_url($url);
        $query = $parsed['query'] ?? '';

        parse_str($query, $existingParams);
        $allParams = array_merge($existingParams, $params);

        $newQuery = http_build_query($allParams);

        return $parsed['scheme'] . '://' . $parsed['host'] . ($parsed['path'] ?? '') . '?' . $newQuery;
    }
}
```

### JSON Helpers

```php
final class JsonHelper
{
    public static function isValid(string $json): bool
    {
        json_decode($json);
        return json_last_error() === JSON_ERROR_NONE;
    }

    public static function decode(string $json, bool $associative = true): mixed
    {
        return json_decode($json, $associative, 512, JSON_THROW_ON_ERROR);
    }

    public static function encode(mixed $data, bool $pretty = false): string
    {
        $options = JSON_THROW_ON_ERROR;

        if ($pretty) {
            $options |= JSON_PRETTY_PRINT;
        }

        return json_encode($data, $options);
    }
}
```

## Testing Helpers

```php
use App\Helpers\StringHelper;

test('extracts first name correctly', function () {
    expect(StringHelper::firstName('John Doe'))->toBe('John');
    expect(StringHelper::firstName('Jane'))->toBe('Jane');
    expect(StringHelper::firstName('  Mary Smith  '))->toBe('Mary');
});

test('generates initials correctly', function () {
    expect(StringHelper::initials('John Doe'))->toBe('JD');
    expect(StringHelper::initials('Jane'))->toBe('Ja');
});
```

## Naming

- **File**: `{Purpose}Helper.php` (PascalCase with Helper suffix)
- **Class**: Must be `final`
- **Methods**: All `static`
- **Examples**:
  - `StringHelper.php`
  - `PhoneHelper.php`
  - `DateHelper.php`
  - `ArrayHelper.php`
  - `ConfigHelper.php`

## Best Practices

✅ **Pure functions** - No side effects
✅ **Static methods** - All methods must be static
✅ **Type hints** - Strict parameter and return types
✅ **Single responsibility** - Each helper file has one purpose
✅ **No dependencies** - Avoid Laravel facades when possible
✅ **Testable** - Easy to unit test
✅ **Reusable** - Generic, not tied to specific models

❌ **Don't use instances** - Never `new StringHelper()`
❌ **Don't inject dependencies** - No constructor injection
❌ **Don't use facades** - Avoid `DB::`, `Cache::`, etc. (when possible)
❌ **Don't add business logic** - Pure utility functions only
❌ **Don't mutate input** - Return new values, don't modify inputs

## When to Use Helpers

✅ Use helpers for:
- String manipulation
- Date calculations
- Phone/email formatting
- Array operations
- Pure math functions
- Validation helpers

❌ Don't use helpers for:
- Business logic (use Services)
- Database operations (use Repositories)
- External API calls (use Integrations)
- Complex workflows (use Services/Modules)

## Benefits

✅ Reusable across the entire application
✅ Easy to test (pure functions)
✅ No dependencies
✅ Self-documenting with descriptive names
✅ Centralized utility logic

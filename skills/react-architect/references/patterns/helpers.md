# Helpers Pattern

## Purpose

Helpers are **pure utility functions** that:

- Perform calculations
- Transform data
- Format strings/dates
- Have no side effects
- Return deterministic results

## Rules

✅ **DO** extract all pure logic to helpers
✅ **DO** make functions predictable
✅ **DO** keep functions small and focused
✅ **DO** use TypeScript for type safety
✅ **DO** name descriptively

❌ **DO NOT** use React hooks
❌ **DO NOT** have side effects
❌ **DO NOT** mutate inputs
❌ **DO NOT** make API calls
❌ **DO NOT** access global state

## File Organization

```
# Screen-specific helpers
src/screens/screen-name/helpers/
└── calculation.helper.ts

# Global helpers
src/app/helpers/
└── string.helper.ts
```

**Naming**: Descriptive + `.helper.ts`

## Helper Structure

```typescript
// string.helper.ts

/**
 * Extracts first name from full name
 */
export const getFirstName = (fullName: string): string => {
  return fullName.split(" ")[0] || "";
};

/**
 * Formats phone number (55) 11 99999-9999
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
};

/**
 * Truncates text to max length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
```

## Date/Time Helpers

```typescript
// date.helper.ts
import { format, differenceInDays, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formats date to "DD/MM/YYYY"
 */
export const formatDate = (date: Date): string => {
  return format(date, "dd/MM/yyyy", { locale: ptBR });
};

/**
 * Formats time to "HH:mm"
 */
export const formatTime = (date: Date): string => {
  return format(date, "HH:mm", { locale: ptBR });
};

/**
 * Returns relative time (Today, Yesterday, or date)
 */
export const getRelativeDate = (date: Date): string => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";

  const daysDiff = differenceInDays(new Date(), date);
  if (daysDiff <= 7) {
    return format(date, "EEEE", { locale: ptBR }); // Day of week
  }

  return format(date, "dd/MM/yyyy", { locale: ptBR });
};

/**
 * Gets greeting based on time of day
 */
export const getGreetingByTime = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};
```

## Number/Currency Helpers

```typescript
// number.helper.ts

/**
 * Formats number to Brazilian currency
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Formats number with thousands separator
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("pt-BR").format(value);
};

/**
 * Calculates percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
```

## Validation Helpers

```typescript
// validation.helper.ts

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates Brazilian CPF
 */
export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // CPF validation algorithm
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;

  return true;
};

/**
 * Validates password strength
 */
export const getPasswordStrength = (
  password: string,
): "weak" | "medium" | "strong" => {
  if (password.length < 6) return "weak";

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const score = [
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChars,
  ].filter(Boolean).length;

  if (score >= 3 && password.length >= 8) return "strong";
  if (score >= 2 && password.length >= 6) return "medium";
  return "weak";
};
```

## Array/Object Helpers

```typescript
// array.helper.ts

/**
 * Groups array by key
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
};

/**
 * Removes duplicates from array
 */
export const removeDuplicates = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return Array.from(new Set(array));
  }

  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Sorts array by key
 */
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc",
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};
```

## Tracking Event Helpers

```typescript
// tracking.helper.ts

/**
 * Builds event properties for tracking
 */
export const buildVideoEventProps = (
  videoId: string,
  videoTitle: string,
  progress: number,
) => ({
  video_id: videoId,
  video_title: videoTitle,
  progress_percentage: Math.round(progress * 100),
  timestamp: new Date().toISOString(),
});

/**
 * Checks if halfway point reached
 */
export const shouldTrackHalfway = (
  progress: number,
  hasTracked: boolean,
): boolean => {
  return progress >= 0.5 && !hasTracked;
};

/**
 * Checks if video completed
 */
export const shouldTrackComplete = (
  progress: number,
  hasTracked: boolean,
): boolean => {
  return progress >= 0.95 && !hasTracked;
};
```

## Text Formatting Helpers

```typescript
// text.helper.ts

/**
 * Capitalizes first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Converts to title case
 */
export const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Removes accents from string
 */
export const removeAccents = (text: string): string => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Generates initials from name
 */
export const getInitials = (name: string): string => {
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};
```

## Platform-Specific Helpers

```typescript
// platform.helper.ts
import { Platform } from "react-native";

/**
 * Checks if running on iOS
 */
export const isIOS = (): boolean => {
  return Platform.OS === "ios";
};

/**
 * Checks if running on Android
 */
export const isAndroid = (): boolean => {
  return Platform.OS === "android";
};

/**
 * Gets platform-specific value
 */
export const getPlatformValue = <T>(ios: T, android: T): T => {
  return Platform.select({ ios, android }) as T;
};

/**
 * Gets safe gesture delay (400ms for Android, 300ms for iOS)
 */
export const getDoubleTapDelay = (): number => {
  return isAndroid() ? 400 : 300;
};
```

## Best Practices

✅ **Extract all pure logic** - No business logic in components/hooks
✅ **One function = one purpose** - Single responsibility
✅ **Descriptive names** - `getFirstName()` not `getName()`
✅ **Type everything** - Full TypeScript coverage
✅ **No side effects** - Pure functions only
✅ **Immutable** - Don't mutate input parameters
✅ **Document** - JSDoc comments for complex functions

❌ **Don't use hooks** - No useState, useEffect, etc.
❌ **Don't mutate inputs** - Return new values
❌ **Don't make API calls** - Use services instead
❌ **Don't access global state** - Pass as parameters
❌ **Don't mix concerns** - Keep focused

## When to Use Helpers

✅ Use helpers for:

- String manipulation
- Date/time calculations
- Number formatting
- Validation logic
- Array/object transformations
- Pure calculations

❌ Don't use helpers for:

- Stateful logic (use hooks)
- API calls (use services)
- Side effects (use hooks)
- Component rendering (use components)

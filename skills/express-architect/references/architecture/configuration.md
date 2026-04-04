# Configuration

Configuration should be loaded once, validated once, and imported as a normal
module instead of reading `process.env` throughout handlers and services.

## Core Rules

- read environment variables at startup
- shape them into a typed config object
- group related values hierarchically
- pass config into factories or bootstrap code when it improves testability

## Example

```ts
export const config = {
  app: {
    env: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3000),
  },
  database: {
    url: process.env.DATABASE_URL ?? '',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? '',
  },
}
```

## Why This Matters

- keeps business code pure
- avoids hidden environment dependencies
- reduces copy-pasted config parsing
- makes tests and bootstrap flow easier to reason about

## Anti-Pattern

```ts
export async function createUser(input: CreateUserInput) {
  const secret = process.env.JWT_SECRET
  // ...
}
```

The service should not reach into process state directly.

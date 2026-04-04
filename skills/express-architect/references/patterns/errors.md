# Errors Pattern

Express applications should handle failure through normal `Error` flow and one
centralized error middleware.

## Core Rules

- throw `Error` objects or domain-specific subclasses
- let handlers call `next(error)`
- centralize response mapping in error middleware
- shut down the app when a failure is unrecoverable

## Example App Error

```ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message)
  }
}
```

## Error Middleware

```ts
export function errorMiddleware(error, req, res, next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ code: error.code, message: error.message })
  }

  req.log?.error(error)
  return res.status(500).json({ code: 'internal_error', message: 'Internal server error' })
}
```

## What To Avoid

- sending error responses directly inside every handler
- throwing strings
- swallowing process-level failures that the app cannot recover from

# Middleware Pattern

Middleware is for cross-cutting HTTP flow, not as a dumping ground for business logic.

## Good Uses

- authentication
- request validation
- attaching authenticated user context
- structured logging
- 404 handling
- centralized error handling

## Validation

Validate request structure in middleware before the handler runs.

```ts
app.use('/api/users', usersRouter)
app.use(notFoundMiddleware)
app.use(errorMiddleware)
```

## 404 And Errors

- send the 404 response in dedicated middleware after all routes
- centralize error translation in one error middleware
- do not build ad hoc error responses inside every handler

## Auth User Attachment

When authentication succeeds, attach the user or auth context to the request in
middleware so downstream handlers do not need to re-derive it.

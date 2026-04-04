# Naming Conventions

Follow the existing repository when it has a clear standard. Otherwise use the
defaults below.

## Files And Folders

- modules: plural `kebab-case` folders such as `users/`, `orders/`
- handlers: `users.handlers.ts`
- routes: `users.routes.ts`
- services: `users.service.ts`
- repositories: `users.repository.ts`
- schemas: `users.schemas.ts`
- tests: `users.handlers.test.ts`, `users.service.test.ts`

## Symbols

- routers: `usersRouter`
- handlers: intention-revealing verbs such as `createUser`, `listUsers`
- services: `usersService`
- repositories: `usersRepository`
- middleware: `{purpose}Middleware`
- error classes: `{Domain}Error` or `AppError`

## Rule Of Clarity

The file name should tell another engineer which layer they are opening before
they read the code.

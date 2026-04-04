---
name: express-architect
version: 1.0.0
description: |
  Use when Codex needs Express architecture decisions, modular API structure,
  middleware boundaries, service layering, or maintainable backend patterns for
  Node.js APIs.
tags: [express, node.js, typescript, api, backend, architecture]
---

# Express Architect

## Mandate

Build Express APIs with modular domain boundaries, thin HTTP handlers, explicit
middleware flow, and clear separation between transport, business logic, and
data access.

## When to Use

- Starting or reviewing an Express or Node.js API project
- Writing or refactoring routes, middleware, handlers, services, repositories, or config
- Untangling backends that mix HTTP, business rules, and persistence in one place
- Reviewing backend code for structure, maintainability, validation, or error flow

---

## Operating Rules

- Structure the application by domain modules, not by global technical folders alone
- Start with a modular monolith unless service boundaries are already proven
- Keep route handlers focused on HTTP concerns only
- Push business orchestration into services and persistence into repositories or queries
- Validate request shape in middleware before it reaches business logic
- Centralize 404 handling and error handling
- Prefer functions and factory functions over class-heavy abstractions
- Encapsulate configuration instead of reading `process.env` throughout the codebase

---

## Architecture Layers

```text
HTTP Layer          -> app bootstrap, routes, middleware, handlers
Application Layer   -> services, module contracts, orchestration
Data Layer          -> repositories, queries, database clients
Infrastructure      -> config, logger, external providers, process lifecycle
```

### Layer Responsibilities

| Layer | What it contains | What it never contains |
|-------|------------------|------------------------|
| Route | Route registration and middleware chain | Business rules, SQL details |
| Handler | Parse HTTP input, call services, shape success response | Validation logic spread, cross-module orchestration, direct DB calls |
| Middleware | Cross-cutting flow such as auth, validation, 404, error handling | Domain decisions that belong in services |
| Service | Business orchestration and module-to-module collaboration | Express request or response objects |
| Repository / Query | Data access and persistence details | HTTP concerns, response formatting |
| Infrastructure | Config, logger, providers, process signals | Route-specific logic |

---

## Recommended Project Structure

```text
src/
├── app/
│   ├── app.ts
│   ├── routes.ts
│   ├── errors/
│   ├── middleware/
│   └── config/
├── modules/
│   ├── users/
│   │   ├── users.routes.ts
│   │   ├── users.handlers.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   ├── users.schemas.ts
│   │   └── users.test.ts
│   └── orders/
├── shared/
│   ├── logger/
│   ├── database/
│   └── utils/
└── server.ts
```

Each module should keep its own routes, handlers, service rules, data access,
schemas, and tests close together.

---

## References

Load only what is relevant:

- `references/express-architect.md`
- `references/architecture/`
- `references/patterns/`
- `references/best-practices/`

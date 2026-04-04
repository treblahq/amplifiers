# Architecture Overview

Express applications should reveal business boundaries in the folder structure
and keep transport, orchestration, and persistence decoupled.

## Layer Model

```text
App Bootstrap
     │
     ▼
Routes
     │
     ▼
Middleware
     │
     ▼
Handlers
     │
     ▼
Services
     │
     ▼
Repositories / Queries
     │
     ▼
Database and External Providers
```

## Core Principles

1. Structure by domain modules, not only by technical responsibilities.
2. Keep handlers focused on HTTP work.
3. Move business orchestration into services as complexity grows.
4. Encapsulate persistence behind repositories or query modules when it improves clarity.
5. Keep shared infrastructure explicit instead of importing hidden globals everywhere.

## Recommended Shape

```text
src/
├── app/
│   ├── app.ts
│   ├── routes.ts
│   ├── config/
│   ├── errors/
│   └── middleware/
├── modules/
│   ├── users/
│   ├── orders/
│   └── catalog/
├── shared/
│   ├── database/
│   ├── logger/
│   └── utils/
└── server.ts
```

## What Belongs In A Module

Each module should own what the business capability needs:

- route registration
- handlers
- services
- repositories or queries
- request schemas
- tests

If a module has no meaningful business identity, it probably belongs in `shared/`.

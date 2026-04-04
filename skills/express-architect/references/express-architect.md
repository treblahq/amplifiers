# Express Architect Knowledge Base

Architecture and implementation guidance for Express-based APIs, with Node.js
backend patterns grounded in modular boundaries, middleware discipline, and
runtime pragmatism.

## Directory Structure

```text
express-architect/
├── architecture/       # Module boundaries, layers, configuration, runtime shape
├── patterns/           # Routes, handlers, middleware, services, repositories, errors
└── best-practices/     # Naming, tooling, testing, performance
```

## Quick Reference

### Architecture

- [Overview](architecture/overview.md) - Express module boundaries and layered flow
- [Modular Monolith](architecture/modular-monolith.md) - Why to start modular before extracting services
- [Configuration](architecture/configuration.md) - Encapsulated config and environment boundaries

### Patterns

- [Routes](patterns/routes.md) - Route registration, prefixes, and module-local routing
- [Handlers](patterns/handlers.md) - Thin handlers that only deal with HTTP
- [Middleware](patterns/middleware.md) - Validation, auth, 404, and error middleware flow
- [Services](patterns/services.md) - Business orchestration and module collaboration
- [Repositories](patterns/repositories.md) - Data access and query boundaries
- [Errors](patterns/errors.md) - Error objects, centralized handling, and failure strategy

### Best Practices

- [Naming Conventions](best-practices/naming-conventions.md) - Consistent naming across modules and files
- [Tooling](best-practices/tooling.md) - Minimal tooling, TypeScript, logging, config, and runtime choices
- [Testing](best-practices/testing.md) - Integration-first testing and dependency injection tradeoffs
- [Performance](best-practices/performance.md) - Event loop awareness and pragmatic performance rules

---

**Usage**: Load only the references needed for the current task. Prefer module
and middleware discipline before reaching for framework-level abstraction.

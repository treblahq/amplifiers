# Rust Skill - Knowledge Base

Domain-agnostic architecture and implementation guidance for Rust services, CLIs, async systems, and libraries.

## Directory Structure

```text
software-architect/rust/
|-- architecture/       # Runtime, layering, and workspace boundaries
|-- patterns/           # Reusable implementation patterns
`-- best-practices/     # Performance, naming, and concurrency standards
```

## Quick Reference

### Architecture

- [Overview](architecture/overview.md) - Layering, crate boundaries, and composition roots
- [Async Runtime](architecture/async-runtime.md) - Tokio/runtime rules, blocking work, and task lifecycle

### Patterns

- [Crates](patterns/crates.md) - Workspace and crate split decisions
- [Modules](patterns/modules.md) - Internal module boundaries and re-exports
- [Services](patterns/services.md) - Application use cases and orchestration
- [Handlers](patterns/handlers.md) - Thin HTTP or CLI transport adapters
- [Repositories](patterns/repositories.md) - Persistence seams and query boundaries
- [DTOs](patterns/dtos.md) - Transport and serialization types
- [Errors](patterns/errors.md) - Typed error flows and boundary mapping
- [Integrations](patterns/integrations.md) - External service adapters
- [Testing](patterns/testing.md) - Unit, integration, and port-based testing

### Best Practices

- [Performance](best-practices/performance.md) - Allocation, async, and query efficiency
- [Naming Conventions](best-practices/naming-conventions.md) - Consistent naming across crates and modules
- [Safety and Concurrency](best-practices/safety-and-concurrency.md) - Shared state, locking, and task safety

---

**Usage**: Reference these files in assistant instructions to keep Rust code generation consistent across APIs, workers, libraries, and CLI tools.

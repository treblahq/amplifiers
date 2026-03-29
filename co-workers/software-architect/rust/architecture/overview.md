# Architecture Overview

## Project Architecture

Rust applications should favor explicit boundaries, a small public surface, and composition at the edges.

```text
Interface -> Application -> Domain -> Infrastructure

Interface:
- HTTP handlers
- CLI commands
- Queue consumers

Application:
- Use cases
- Service orchestration
- Transactions

Domain:
- Entities
- Value objects
- Policies
- Repository and gateway traits

Infrastructure:
- SQLx/Diesel repositories
- HTTP clients
- Queues
- File storage
```

## Core Principles

1. Keep I/O and framework code at the edges.
2. Model domain concepts with types instead of loosely typed maps and strings.
3. Introduce traits only at real seams such as persistence, integrations, and testing.
4. Keep public APIs small with `pub(crate)` by default.
5. Treat ownership, async work, and cloning as design decisions, not implementation noise.

## Single-Crate Structure

```text
src/
|-- main.rs or lib.rs
|-- app/                # wiring, state construction, configuration
|-- http/               # handlers, extractors, responses
|-- application/        # services, commands, use cases
|-- domain/             # entities, value objects, traits
|-- infrastructure/     # repositories, clients, adapters
`-- shared/             # small cross-cutting helpers

tests/                  # integration and black-box tests
```

## Workspace Structure

Split into multiple crates only when boundaries are stable and ownership is clearer than keeping one crate.

```text
Cargo.toml
crates/
|-- api/                # runtime, handlers, state wiring
|-- application/        # use cases and orchestration
|-- domain/             # core entities and ports
`-- infrastructure/     # persistence and external adapters
```

## Request Flow

```text
Request or Command
-> Handler
-> Application Service
-> Domain Rules
-> Repository or Integration
-> Typed Result
-> Response Mapping
```

## Key Patterns

- **Handler**: parses transport input and maps output
- **Service**: orchestrates the use case
- **Entity / Value Object**: enforces core rules
- **Repository**: persistence contract for aggregates and queries
- **Integration**: adapter over external services
- **DTO**: serialization boundary type, never the domain itself

See the `patterns/` directory for the implementation rules behind each boundary.

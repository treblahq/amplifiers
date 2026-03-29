# Crates Pattern

## Purpose

Crates define the largest compile-time and ownership boundaries in a Rust codebase.

## Rules

DO:
- start with one crate when the system is still small
- split into crates when domain ownership, reuse, or compile boundaries become clear
- expose a narrow `lib.rs` surface and keep internals private
- keep dependency direction one-way

DO NOT:
- create a crate per folder just to look modular
- let UI/runtime crates leak framework types into domain crates
- create cyclic dependencies between crates

## Suggested Workspace

```text
crates/
|-- api/                # axum/actix/http entrypoints
|-- application/        # services and use cases
|-- domain/             # entities, value objects, ports
`-- infrastructure/     # SQL, queues, HTTP adapters
```

## `lib.rs` Surface

```rust
pub mod application;
pub mod domain;

pub use application::order::CreateOrderService;
pub use domain::order::{Order, OrderId};
```

## When To Split

Create a new crate when at least one of these is true:

- the module has a stable API used by multiple binaries
- ownership belongs to a separate technical or product area
- compile times or dependency weight justify the boundary
- tests become cleaner because infrastructure can be swapped at crate edges

If none of that is true, keep the code in one crate and improve module boundaries first.

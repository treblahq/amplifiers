# Modules Pattern

## Purpose

Modules organize code inside a crate. They should reflect domain and boundary decisions, not just filesystem convenience.

## Rules

DO:
- group code by feature or domain boundary when it improves locality
- use `pub(crate)` by default and re-export intentionally
- keep module files short enough that responsibilities remain obvious
- colocate tests with the module they exercise when possible

DO NOT:
- expose internal helpers as `pub` without a real caller
- put unrelated responsibilities in a generic `utils` module
- re-export everything from every module

## Feature-Oriented Example

```text
src/
|-- domain/
|   |-- mod.rs
|   `-- order/
|       |-- mod.rs
|       |-- entity.rs
|       |-- repository.rs
|       |-- service.rs
|       `-- value_object.rs
`-- application/
    |-- mod.rs
    `-- order/
        |-- mod.rs
        `-- create_order.rs
```

## Selective Re-Export

```rust
// src/domain/order/mod.rs
mod entity;
mod repository;
mod service;
mod value_object;

pub use entity::Order;
pub use repository::OrderRepository;
pub use service::OrderDomainService;
pub use value_object::OrderId;
```

## Practical Guidance

- Prefer explicit module names like `payments`, `catalog`, `billing`, not `common2`.
- Use folders only when a module has real internal structure.
- If a crate already follows flat files instead of nested folders, preserve the established convention unless the current layout is actively blocking maintainability.

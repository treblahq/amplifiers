# Testing Pattern

## Purpose

Testing should validate domain rules, application workflows, and integration boundaries without forcing brittle internal coupling.

## Rules

DO:
- keep pure domain tests close to the module
- use integration tests for end-to-end behavior across real boundaries
- use fakes or lightweight test adapters for repository and gateway traits
- prefer black-box assertions over implementation-detail assertions

DO NOT:
- mock every internal function call
- couple tests to private helper structure
- rely on `sleep` when deterministic synchronization is possible

## Test Layout

```text
src/
`-- domain/
    `-- order/
        |-- entity.rs
        `-- tests.rs

tests/
`-- create_order_flow.rs
```

## Unit Test Example

```rust
#[test]
fn money_cannot_be_negative() {
    let result = Money::from_cents(-1);
    assert!(result.is_err());
}
```

## Async Service Test Example

```rust
#[tokio::test]
async fn creates_order_when_external_id_is_new() {
    let repo = InMemoryOrderRepository::default();
    let gateway = AllowAllPayments::default();
    let service = CreateOrderService::new(repo.into_arc(), gateway.into_arc());

    let result = service.execute(sample_command()).await;

    assert!(result.is_ok());
}
```

## Practical Guidance

- Use fixtures and builders when the domain object setup becomes noisy.
- Keep infrastructure integration tests focused on the contract you truly care about.
- If a repository implementation depends on a real database, prefer transactional tests or an ephemeral database over heavy global state.

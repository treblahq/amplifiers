# DTOs Pattern

## Purpose

DTOs isolate serialization, transport, and storage shapes from domain types.

## Rules

DO:
- use request and response structs at transport boundaries
- map DTOs into commands, queries, or domain value objects
- derive `Serialize` and `Deserialize` only where needed
- keep domain entities free from transport-only metadata

DO NOT:
- reuse database row structs as API responses
- expose internal enums or persistence-only fields by accident
- pass raw `serde_json::Value` through the application layer when a type is known

## Example

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct CreateOrderRequest {
    pub customer_id: String,
    pub total_cents: i64,
    pub external_id: String,
}

impl CreateOrderRequest {
    pub fn into_command(self) -> CreateOrderCommand {
        CreateOrderCommand {
            customer_id: CustomerId::new(self.customer_id),
            total: Money::from_cents(self.total_cents),
            external_id: self.external_id,
        }
    }
}

#[derive(Debug, Serialize)]
pub struct CreateOrderResponse {
    pub order_id: String,
}
```

## Practical Guidance

- Request DTOs describe what came from the outside world.
- Commands describe what the application needs to execute.
- Response DTOs describe exactly what the caller should receive.
- Keep conversions explicit when business validation or normalization happens during mapping.

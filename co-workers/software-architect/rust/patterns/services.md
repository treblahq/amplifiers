# Services Pattern

## Purpose

Services hold application use cases and coordinate domain rules, repositories, and integrations.

## Rules

DO:
- keep services focused on one use case or one cohesive domain area
- inject repositories and gateways through constructor parameters
- return typed `Result`s with domain or application errors
- keep transactions and orchestration in the application layer

DO NOT:
- mix transport parsing into services
- hide business rules in handlers
- introduce traits for every internal helper with no testing or swap need

## Structure

```rust
use std::sync::Arc;

use async_trait::async_trait;

#[async_trait]
pub trait OrderRepository: Send + Sync {
    async fn exists_by_external_id(&self, external_id: &str) -> Result<bool, AppError>;
    async fn save(&self, order: &Order) -> Result<(), AppError>;
}

#[async_trait]
pub trait PaymentGateway: Send + Sync {
    async fn authorize(&self, order: &Order) -> Result<(), AppError>;
}

pub struct CreateOrderService {
    repo: Arc<dyn OrderRepository>,
    payments: Arc<dyn PaymentGateway>,
}

impl CreateOrderService {
    pub fn new(
        repo: Arc<dyn OrderRepository>,
        payments: Arc<dyn PaymentGateway>,
    ) -> Self {
        Self { repo, payments }
    }

    pub async fn execute(&self, cmd: CreateOrderCommand) -> Result<OrderId, AppError> {
        if self.repo.exists_by_external_id(&cmd.external_id).await? {
            return Err(AppError::Conflict);
        }

        let order = Order::new(cmd.customer_id, cmd.total)?;

        self.payments.authorize(&order).await?;
        self.repo.save(&order).await?;

        Ok(order.id().clone())
    }
}
```

## Key Points

### Constructor Injection

Create services with explicit dependencies. Avoid global singletons and hidden service locators.

### Command In, Domain Out

Prefer small command structs as input and domain or response-specific types as output.

### Transaction Ownership

If a workflow must commit multiple persistence operations atomically, the service should own that boundary and delegate the lower-level details to infrastructure.

## When To Create A Service

Create a service when you have:

- multi-step use case orchestration
- transactions
- coordination between repositories and external systems
- domain validation that spans more than one entity

For a trivial pure rule, prefer a domain function or method instead.

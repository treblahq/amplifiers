# Repositories Pattern

## Purpose

Repositories define persistence contracts for aggregates and important query boundaries.

## Rules

DO:
- define traits near the domain or application layer
- implement them in infrastructure
- return domain entities or query-specific read models
- keep transactions and SQL details out of handlers

DO NOT:
- wrap every database statement in a repository if a direct query object is clearer
- return raw database rows to the domain layer
- leak SQLx, Diesel, or ORM-specific details into callers that do not need them

## Structure

```rust
use async_trait::async_trait;

#[async_trait]
pub trait OrderRepository: Send + Sync {
    async fn find_by_id(&self, id: OrderId) -> Result<Option<Order>, AppError>;
    async fn save(&self, order: &Order) -> Result<(), AppError>;
}

pub struct SqlxOrderRepository {
    pool: sqlx::PgPool,
}

#[async_trait]
impl OrderRepository for SqlxOrderRepository {
    async fn find_by_id(&self, id: OrderId) -> Result<Option<Order>, AppError> {
        let row = sqlx::query_as::<_, OrderRow>(
            "select id, customer_id, total_cents from orders where id = $1"
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(row.map(Order::try_from).transpose()?)
    }

    async fn save(&self, order: &Order) -> Result<(), AppError> {
        sqlx::query(
            "insert into orders (id, customer_id, total_cents) values ($1, $2, $3)"
        )
        .bind(order.id())
        .bind(order.customer_id())
        .bind(order.total().as_cents())
        .execute(&self.pool)
        .await?;

        Ok(())
    }
}
```

## Practical Guidance

- Use read models for query-heavy endpoints instead of forcing every read through an aggregate.
- Keep row-to-domain mapping explicit.
- If the project already uses a repository abstraction, stay consistent. If it does not, add one only where it reduces coupling or improves tests.

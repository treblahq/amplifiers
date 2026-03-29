# Handlers Pattern

## Purpose

Handlers are thin transport adapters for HTTP routes, CLI commands, or job consumers.

## Rules

DO:
- parse transport input
- validate transport-level shape and required fields
- call one application service or one clear orchestration path
- map typed errors into the transport response once

DO NOT:
- run SQL directly
- embed business rules
- call external APIs directly when a service or adapter already owns that behavior

## HTTP Example With Axum

```rust
use std::sync::Arc;

use axum::{
    extract::State,
    http::StatusCode,
    Json,
};

pub async fn create_order(
    State(state): State<Arc<AppState>>,
    Json(request): Json<CreateOrderRequest>,
) -> Result<(StatusCode, Json<CreateOrderResponse>), ApiError> {
    let order_id = state
        .create_order
        .execute(request.into_command())
        .await?;

    Ok((
        StatusCode::CREATED,
        Json(CreateOrderResponse {
            order_id: order_id.to_string(),
        }),
    ))
}
```

## CLI Example

```rust
pub async fn run_import(args: ImportArgs, service: &ImportCatalogService) -> Result<(), AppError> {
    let command = ImportCatalogCommand::from(args);
    service.execute(command).await
}
```

## Practical Guidance

- Keep framework extractors and response wrappers inside the handler layer.
- Convert request DTOs into commands before entering the application layer.
- If several handlers repeat the same mapping logic, extract a transport helper, not a god handler.

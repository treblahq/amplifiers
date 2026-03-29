# Errors Pattern

## Purpose

Rust applications should use typed errors to make failure paths explicit and easy to map at boundaries.

## Rules

DO:
- use `thiserror` for library, domain, and application error enums
- add context when crossing infrastructure boundaries
- map errors once at the handler or binary boundary
- reserve `anyhow` for binaries, one-off tasks, or composition roots

DO NOT:
- return plain strings as errors
- use `unwrap` or `expect` outside tests, startup assertions, or truly fatal invariants
- collapse all error cases into `InternalServerError`

## Structure

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("resource not found")]
    NotFound,
    #[error("resource already exists")]
    Conflict,
    #[error("operation timed out")]
    Timeout,
    #[error("background task failed")]
    TaskJoin,
    #[error("database error")]
    Database(#[from] sqlx::Error),
}
```

## HTTP Mapping Example

```rust
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let status = match self {
            ApiError::NotFound => StatusCode::NOT_FOUND,
            ApiError::Conflict => StatusCode::CONFLICT,
            ApiError::Validation(_) => StatusCode::BAD_REQUEST,
            ApiError::Internal => StatusCode::INTERNAL_SERVER_ERROR,
        };

        (status, Json(self.body())).into_response()
    }
}
```

## Practical Guidance

- Keep domain errors distinct from transport errors.
- Convert infrastructure errors into domain or application errors only when the caller can act differently.
- Log internal details where observability belongs, but keep public error responses stable and safe.

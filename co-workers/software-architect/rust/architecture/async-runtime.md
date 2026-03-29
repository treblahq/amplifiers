# Async Runtime Architecture

## Purpose

Async is for I/O concurrency, not for hiding blocking work or compensating for unclear boundaries.

## Rules

DO:
- keep async at I/O boundaries such as HTTP, database, queues, and external APIs
- apply timeouts, cancellation, and retries where remote calls happen
- move blocking or CPU-heavy work to `spawn_blocking` or a dedicated worker
- bound fan-out concurrency with semaphores or batched execution

DO NOT:
- hold a lock across `.await`
- call blocking filesystem or network APIs on the async runtime
- spawn detached tasks with no owner, shutdown path, or error reporting

## Runtime Layout

```text
Tokio Runtime
|-- inbound tasks (HTTP, jobs, CLI entrypoints)
|-- application services
|-- outbound async I/O (database, HTTP, queue)
`-- blocking pool for CPU-heavy or legacy blocking work
```

## Timeout Example

```rust
use std::time::Duration;

pub async fn sync_catalog(
    client: &CatalogClient,
    repo: &dyn CatalogRepository,
) -> Result<(), AppError> {
    let items = tokio::time::timeout(Duration::from_secs(5), client.fetch_items())
        .await
        .map_err(|_| AppError::Timeout)??;

    repo.save_batch(items).await?;
    Ok(())
}
```

## Blocking Work Example

```rust
pub async fn hash_archive(bytes: Vec<u8>) -> Result<String, AppError> {
    tokio::task::spawn_blocking(move || expensive_hash(bytes))
        .await
        .map_err(|_| AppError::TaskJoin)?
}
```

## Practical Guidance

- Prefer passing immutable shared state through `Arc`.
- Keep spawned task ownership in a supervisor, app state, or explicit job runner.
- If an operation must complete before the request ends, await it directly instead of spawning.
- If the runtime choice already exists in the repo, preserve it unless there is a clear operational reason to change.

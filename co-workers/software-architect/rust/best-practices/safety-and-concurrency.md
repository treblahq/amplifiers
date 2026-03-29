# Safety And Concurrency Best Practices

## Shared State

- Prefer immutable data and message passing before shared mutable state.
- Use `Arc` for shared ownership and add `Mutex` or `RwLock` only when mutation is unavoidable.
- Keep lock scope as small as possible.

## Locking Rules

- Never hold a lock across `.await`.
- Use `RwLock` only when reads heavily outnumber writes and contention data supports it.
- Prefer fine-grained ownership over one giant application mutex.

## Task Safety

- Every spawned task should have an owner, cancellation strategy, and error path.
- Apply timeouts to remote calls and long-running task joins.
- Use bounded channels or semaphores when producers can outpace consumers.

## Panic And Unsafe

- Treat panics as exceptional boundaries, not control flow.
- Use `unsafe` only when the performance or FFI requirement is real and the invariants are documented locally.
- Wrap unsafe blocks in a small, well-tested API.

## Practical Guidance

- Prefer `Send + Sync` boundaries for state shared across handlers and jobs.
- If interior mutability is needed, justify it with the exact contention or lifecycle problem it solves.
- Make concurrency visible in type and module design instead of hiding it inside helpers.

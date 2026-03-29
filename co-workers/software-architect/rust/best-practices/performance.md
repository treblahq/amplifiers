# Performance Best Practices

## General Rules

- Avoid cloning large values unless ownership or concurrency truly requires it.
- Prefer borrowing for read-only flows and ownership for long-lived or async task boundaries.
- Batch database and network operations where the access pattern allows it.
- Stream large payloads instead of buffering everything in memory.
- Measure hotspots with profiling and benchmarks before applying low-level optimizations.

## Async And I/O

- Do not block the async runtime with CPU-heavy or synchronous I/O work.
- Bound concurrency when fan-out requests or jobs could overwhelm downstream systems.
- Reuse clients, pools, and expensive allocators through shared application state.

## Data Structures

- Choose `Vec`, `HashMap`, `BTreeMap`, or `IndexMap` based on actual access patterns.
- Reserve capacity when the size is known and the allocation cost matters.
- Prefer small, explicit structs over nested untyped maps.

## Database And Serialization

- Select only the columns you need.
- Avoid N+1 query patterns in repository implementations.
- Serialize only boundary types, not entire internal graphs, by default.

## Practical Rule

Do not trade away clarity for speculative micro-optimizations. In Rust, the fastest long-term code is usually the code whose ownership and allocation story is easy to understand.

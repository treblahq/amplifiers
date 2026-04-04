# Performance

Node performance work starts with protecting the event loop and avoiding
premature complexity.

## Core Rules

- do not block the event loop with heavy synchronous work
- prefer streaming or incremental processing for large payloads
- move CPU-heavy work to background jobs or separate workers when needed
- do not optimize algorithmic complexity in isolation from real bottlenecks
- do not optimize prematurely

## Practical Checks

- are large JSON payloads parsed or generated unnecessarily?
- is filesystem work using promise or streaming APIs instead of blocking calls?
- are slow external calls timed out and observed?
- is logging structured and bounded rather than noisy and synchronous?

## Pragmatic Guidance

Most Express services are limited by I/O, query shape, and external dependencies
before they are limited by micro-optimizations in application code.

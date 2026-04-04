# Testing

Prefer integration tests for business flows, then add targeted unit tests where
they buy clarity.

## Priorities

1. integration tests for complete HTTP or service flows
2. unit tests for business-heavy services
3. focused tests for edge-case utilities

## Rules

- test the domain behavior, not framework internals
- prefer dependency injection or simple factory wiring when it reduces brittle mocks
- avoid complex DI containers just for test ergonomics
- keep test names behavior-focused

## Good Coverage Targets

- happy path per route
- validation failures
- authorization failures
- business-rule conflicts
- persistence failures when they affect behavior

## Arrange-Act-Assert

Keep tests readable:

1. arrange inputs and dependencies
2. act once
3. assert outcomes clearly

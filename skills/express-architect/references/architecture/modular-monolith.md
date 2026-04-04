# Modular Monolith

Start with one deployable Express service that is internally modular before
splitting into multiple services.

## Why Start Here

- business boundaries are usually clearer after real product usage
- moving inside one repo is cheaper than moving across distributed systems
- modules can still act as future extraction candidates

## Rule Of Thumb

Treat each module as if it could become a separate service later:

- keep module contracts explicit
- avoid direct deep imports across modules
- communicate through service functions, not random file reach-through
- keep data ownership clear

## Good Signs

- `users` does not query `orders` tables directly without a clear contract
- route files stay module-local
- shared code is generic infrastructure, not disguised domain leakage

## Extraction Trigger

Only push toward microservices when:

- module boundaries are proven
- scaling or ownership pressure is real
- cross-module coupling is already controlled

Premature extraction creates distributed-systems complexity before the architecture earns it.

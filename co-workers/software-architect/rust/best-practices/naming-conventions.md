# Naming Conventions

## General Rules

- Code, comments, and commits: English
- Public API names: descriptive and intention-revealing
- Prefer domain names over generic technical placeholders

## Crates And Modules

### Crates

- Cargo package names: `kebab-case`
- Rust crate imports: `snake_case`

Examples:

- `billing-api`
- `order-domain`
- `shared-kernel`

### Modules And Files

- Modules and files: `snake_case`
- Feature folders: `snake_case`

Examples:

- `create_order.rs`
- `payment_gateway.rs`
- `order_repository.rs`

## Types

- Structs, enums, and traits: `PascalCase`
- Error enums: end with `Error`
- Request and response DTOs: end with `Request` and `Response`

Examples:

- `CreateOrderService`
- `OrderRepository`
- `ApiError`
- `CreateOrderRequest`

## Functions And Methods

- Functions and methods: `snake_case`
- Prefer verbs for actions and nouns for pure accessors

Examples:

- `create_order`
- `find_by_id`
- `authorize_payment`
- `as_cents`

## Constants

- Constants and statics: `SCREAMING_SNAKE_CASE`

Examples:

- `DEFAULT_PAGE_SIZE`
- `MAX_RETRY_ATTEMPTS`

## Tests

- Test names should describe behavior, not implementation

Examples:

- `creates_order_when_payment_is_authorized`
- `returns_not_found_for_unknown_order`

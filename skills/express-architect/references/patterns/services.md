# Services Pattern

Services hold business orchestration and module collaboration.

## Responsibilities

- coordinate domain rules
- call repositories or queries
- collaborate with other services through clear contracts
- call providers such as email, payments, or queues

## Rules

- do not depend on Express request or response objects
- keep services intention-revealing
- favor functions or factory-built objects over class hierarchies
- keep cross-module communication explicit

## Example

```ts
export const usersService = {
  async create(input: CreateUserInput) {
    const existing = await usersRepository.findByEmail(input.email)
    if (existing) {
      throw new ConflictError('User email already exists')
    }

    return usersRepository.insert(input)
  },
}
```

## Collaboration Rule

If one module needs another, call its service-level contract instead of reaching
into internal repository files directly.

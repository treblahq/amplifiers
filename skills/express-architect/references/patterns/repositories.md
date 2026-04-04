# Repositories Pattern

Repositories or query modules encapsulate persistence details when data access is
complex enough to deserve a boundary.

## Use When

- queries are non-trivial
- the service becomes noisy with SQL or ORM concerns
- persistence strategy should stay isolated from business rules

## Rules

- keep repositories focused on persistence
- return domain-shaped data or typed results
- avoid leaking raw transport concerns into query code
- do not move business decisions into repository methods

## Example

```ts
export const usersRepository = {
  findByEmail(email: string) {
    return db('users').where({ email }).first()
  },

  insert(input: CreateUserInput) {
    return db('users').insert(input).returning('*')
  },
}
```

If the data layer is simple, a direct query module is enough. Add a repository
boundary only when it improves clarity.

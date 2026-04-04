# Handlers Pattern

Handlers should only translate HTTP input into application calls and translate
application results back into HTTP responses.

## Handler Responsibilities

- read validated input from the request
- call the appropriate service
- send the success response
- delegate failures to `next(error)`

## What Handlers Must Avoid

- inline validation logic for non-trivial schemas
- direct SQL or ORM calls
- cross-module orchestration
- custom error response branches repeated in every handler

## Example

```ts
import type { Request, Response, NextFunction } from 'express'
import { usersService } from './users.service'

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.create(req.body)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}
```

If a handler starts deciding business outcomes, the logic belongs in the service.

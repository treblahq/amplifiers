# Routes Pattern

Routes define URL structure and middleware order. They should stay close to the
module they serve.

## Rules

- keep routes inside their domain module
- prefix API routes consistently
- wire middleware explicitly in route order
- keep app-level route aggregation thin

## Example

```ts
import { Router } from 'express'
import { createUser, listUsers } from './users.handlers'
import { validateBody } from '../../app/middleware/validate-body'
import { createUserSchema } from './users.schemas'

export const usersRouter = Router()

usersRouter.get('/', listUsers)
usersRouter.post('/', validateBody(createUserSchema), createUser)
```

## App Registration

```ts
app.use('/api/users', usersRouter)
app.use('/api/orders', ordersRouter)
```

Keep route prefixes obvious and consistent.

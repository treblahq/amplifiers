---
name: django-drf
version: 1.0.0
source: trebla/co-workers/software-architect/django
description: |
  Architecture, patterns, and quality rules for Django REST Framework APIs.
  Covers layered architecture, services/selectors pattern, models, serializers,
  views, naming conventions, and project structure.
tags: [django, python, drf, api, backend, architecture]
---

# Django + DRF Architecture

## Mandate

Build Django REST Framework APIs with a strict layered architecture that separates HTTP concerns from business logic and query logic. Code must be easy to test, trace, and extend.

## When to Use

- Starting or reviewing a Django REST Framework project
- Writing new endpoints, services, models, or serializers
- Code review of Django backend code

---

## Architecture

```text
HTTP Request
     │
     ▼
  View / ViewSet        ← HTTP only: auth, parse, route, respond
     │
  ┌──┴──────────────┐
  ▼                 ▼
Service          Selector   ← Business logic / Query logic
  │                 │
  └────────┬────────┘
           ▼
         Model             ← Schema, constraints, clean()
           │
           ▼
        Database
```

### Layer Responsibilities

| Layer      | Responsible for                                | Not responsible for                    |
|------------|------------------------------------------------|----------------------------------------|
| View       | Parse request, call service/selector, respond  | Business rules, query logic            |
| Service    | Orchestrate business logic, write to DB        | HTTP context, response formatting      |
| Selector   | Complex queries, eager loading                 | Business rules, mutations              |
| Serializer | Validate input, transform output               | Business logic, DB writes              |
| Model      | Schema, constraints, `clean()`, `__str__()`    | Business orchestration, HTTP awareness |

---

## Project Structure

```text
project_root/
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── common/              # Shared abstract models, mixins, utils
│   ├── models.py
│   └── exceptions.py
├── users/               # One folder per domain
├── products/
├── orders/
└── manage.py
```

Each app:
```text
products/
├── models.py
├── views.py
├── serializers.py
├── services.py          # Write/mutation logic
├── selectors.py         # Read/query logic
├── permissions.py
├── urls.py
└── tests/
    ├── test_models.py
    ├── test_services.py
    └── test_views.py
```

---

## Services Pattern

Services hold all **write/mutation business logic**.

**Rules:**
- Always use keyword-only arguments (`def func(*, arg1, arg2)`)
- Always call `full_clean()` before `save()`
- Use `transaction.atomic()` for multi-step operations
- Never access `request` inside a service
- Never return HTTP responses or status codes
- Never perform complex queries (use selectors)

**Naming:** `{model}_{action}` — e.g. `product_create`, `order_cancel`

```python
# products/services.py
from django.db import transaction
from .models import Product

def product_create(
    *,
    name: str,
    price: float,
    establishment_id: int,
    category_id: int | None = None,
) -> Product:
    product = Product(
        name=name,
        price=price,
        establishment_id=establishment_id,
        category_id=category_id,
    )
    product.full_clean()
    product.save()
    return product
```

---

## Selectors Pattern

Selectors hold all **read/query logic**.

**Rules:**
- Return `QuerySet` or typed values — never raw dicts
- Always use keyword-only arguments
- Never mutate data
- Use `select_related` and `prefetch_related` to avoid N+1 queries

**Naming:** `{model}_{operation}` — e.g. `product_list`, `product_get`

```python
# products/selectors.py
from django.db.models import QuerySet
from .models import Product

def product_list(*, establishment_id: int) -> QuerySet:
    return Product.objects.filter(
        establishment_id=establishment_id,
        is_active=True,
    ).select_related("category")

def product_get(*, product_id: int) -> Product:
    return Product.objects.get(id=product_id)
```

---

## Views Pattern

Views handle **HTTP only** — no business logic.

```python
# products/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from .serializers import ProductInputSerializer, ProductOutputSerializer
from .services import product_create
from .selectors import product_list

class ProductViewSet(ModelViewSet):
    def list(self, request):
        qs = product_list(establishment_id=request.user.establishment_id)
        serializer = ProductOutputSerializer(qs, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = ProductInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = product_create(**serializer.validated_data)
        return Response(ProductOutputSerializer(product).data, status=201)
```

---

## Models Pattern

Models hold **schema and constraints only**.

- Use `full_clean()` to enforce constraints — call it from services before `save()`
- Define `__str__` always
- Set `related_name` on every FK and M2M field
- No business logic in models (no service calls, no complex methods)

---

## Naming Conventions

| Element         | Convention                     | Example                        |
|-----------------|--------------------------------|--------------------------------|
| App             | Plural `snake_case`            | `products`, `orders`           |
| Model           | Singular `PascalCase`          | `Product`, `OrderItem`         |
| Model field     | `snake_case`                   | `created_at`, `is_active`      |
| Boolean field   | Prefix `is_` or `has_`         | `is_active`, `has_stock`       |
| FK related_name | Plural `snake_case`            | `establishment.products`       |
| ViewSet         | `{Model}ViewSet`               | `ProductViewSet`               |
| APIView         | `{Action}{Model}View`          | `CheckCouponView`              |
| Service fn      | `{model}_{action}`             | `product_create`               |
| Selector fn     | `{model}_{operation}`          | `product_list`, `product_get`  |
| Serializer      | `{Model}InputSerializer`       | `ProductInputSerializer`       |
|                 | `{Model}OutputSerializer`      | `ProductOutputSerializer`      |

---

## Settings Split

```text
config/settings/
├── base.py          # Shared config
├── development.py   # DEBUG=True, local DB
└── production.py    # DEBUG=False, env var secrets
```

In `production.py` — never hardcode secrets:
```python
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
ALLOWED_HOSTS = os.environ["ALLOWED_HOSTS"].split(",")
```

---

## Type Hints

Use type hints throughout — on all functions, including services and selectors:

```python
from django.db.models import QuerySet
from typing import Optional

def product_list(*, establishment_id: int) -> QuerySet:
    ...

def product_create(*, name: str, price: float) -> "Product":
    ...
```

---

## Anti-Patterns to Avoid

- Business logic inside views
- DB queries inside views (use selectors)
- Accessing `request` inside services
- Saving models without `full_clean()`
- Missing `related_name` on FK fields
- Fat models with business orchestration methods
- Logic inside serializers beyond validation/transformation

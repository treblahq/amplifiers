# Architecture Overview

## Philosophy

Django projects should follow a **clear separation of concerns** with business logic
decoupled from the HTTP layer. The goal is code that is easy to test, trace, and extend
without touching unrelated layers.

## Layer Diagram

```text
HTTP Request
     │
     ▼
  ┌──────────────────────────────────┐
  │           View / ViewSet         │  ← HTTP only: auth, parse, route, respond
  └──────────────────┬───────────────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
  ┌──────────────┐     ┌──────────────────┐
  │   Service    │     │    Selector      │  ← Business logic / Query logic
  └──────┬───────┘     └────────┬─────────┘
         │                      │
         ▼                      ▼
  ┌─────────────────────────────────────┐
  │              Model                  │  ← Schema, constraints, clean()
  └─────────────────────────────────────┘
         │
         ▼
  ┌─────────────────────────────────────┐
  │             Database                │
  └─────────────────────────────────────┘
```

## Project Structure

```text
project_root/
├── config/                  # Django project config (settings, urls, wsgi, asgi)
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
├── common/                  # Shared abstract models, mixins, utilities
│   ├── models.py
│   ├── exceptions.py
│   └── pagination.py
│
├── users/                   # User domain app
├── establishments/          # Establishment domain app
├── products/                # Product domain app
│
├── manage.py
└── requirements.txt
```

## App Internal Structure

Each domain app follows this layout:

```text
products/
├── models.py          # ORM models and abstract base fields
├── views.py           # ViewSets and APIViews
├── serializers.py     # Input/output serializers
├── services.py        # Business logic (write operations)
├── selectors.py       # Query logic (read operations)
├── permissions.py     # Custom DRF permissions
├── urls.py            # URL routing for the app
├── admin.py           # Django admin registration
├── apps.py            # AppConfig
└── tests/
    ├── __init__.py
    ├── test_models.py
    ├── test_services.py
    └── test_views.py
```

## Responsibility Boundaries

| Layer        | Responsibility                                  | NOT responsible for                        |
|--------------|------------------------------------------------|---------------------------------------------|
| View         | Parse request, call service/selector, respond  | Business rules, query logic                 |
| Service      | Orchestrate business logic, write to DB        | HTTP context, response formatting           |
| Selector     | Complex queries, eager loading                 | Business rules, mutations                   |
| Serializer   | Validate input, transform output               | Business logic, DB writes                   |
| Model        | Schema, constraints, `clean()`, `__str__()`    | Business orchestration, HTTP awareness      |

## Settings Split

Split settings by environment to avoid secrets in source control:

```text
config/settings/
├── base.py          # Shared config (INSTALLED_APPS, MIDDLEWARE, etc.)
├── development.py   # DEBUG=True, SQLite or local Postgres, MailHog
└── production.py    # DEBUG=False, env vars for secrets and DB
```

`production.py` example:

```python
from .base import *
import os

DEBUG = False
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
ALLOWED_HOSTS = os.environ["ALLOWED_HOSTS"].split(",")

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["DB_NAME"],
        "USER": os.environ["DB_USER"],
        "PASSWORD": os.environ["DB_PASSWORD"],
        "HOST": os.environ["DB_HOST"],
        "PORT": os.environ.get("DB_PORT", "5432"),
    }
}
```

## URL Organization

Root `urls.py` aggregates app-level routers:

```python
# config/urls.py
from django.urls import path, include

urlpatterns = [
    path("api/v1/products/", include("products.urls")),
    path("api/v1/establishments/", include("establishments.urls")),
    path("api/v1/users/", include("users.urls")),
]
```

Each app owns its router:

```python
# products/urls.py
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ProductCategoryViewSet

router = DefaultRouter()
router.register(r"", ProductViewSet, basename="product")
router.register(r"categories", ProductCategoryViewSet, basename="product-category")

urlpatterns = router.urls
```

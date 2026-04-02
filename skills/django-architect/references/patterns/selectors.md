# Selectors Pattern

## Purpose

Selectors encapsulate **query logic**: filtering, eager loading, and data fetching.
They are the read counterpart to services (which handle writes).

## Rules

✅ **DO** centralise all `QuerySet` filtering and annotation logic
✅ **DO** use `select_related` and `prefetch_related` to prevent N+1
✅ **DO** return `QuerySet` objects for lists (lazy, paginatable)
✅ **DO** return model instances for single-object fetches
✅ **DO** use keyword-only arguments (after `*`)

❌ **DO NOT** mutate data inside selectors
❌ **DO NOT** write query logic directly in views or serializers
❌ **DO NOT** call services from selectors

## Structure

Selector functions live in `selectors.py` inside each app:

```python
# products/selectors.py
from django.db.models import QuerySet
from django.shortcuts import get_object_or_404

from .models import Product, ProductCategory


def product_list(
    *,
    establishment_id: int,
    status: bool | None = None,
    category_id: int | None = None,
) -> QuerySet:
    qs = (
        Product.objects.filter(establishment_id=establishment_id)
        .select_related("category")
        .prefetch_related("images", "food_restrictions")
    )

    if status is not None:
        qs = qs.filter(status=status)
    if category_id is not None:
        qs = qs.filter(category_id=category_id)

    return qs


def product_get(*, product_id: int, establishment_id: int) -> Product:
    return get_object_or_404(
        Product.objects.select_related("category").prefetch_related("images", "food_restrictions"),
        id=product_id,
        establishment_id=establishment_id,
    )


def product_category_list(*, establishment_id: int) -> QuerySet:
    return ProductCategory.objects.filter(
        establishment_id=establishment_id
    ).order_by("name")
```

## Returning QuerySets vs Instances

- Return a **QuerySet** for list endpoints — views can then paginate them
- Return a **model instance** for single-object fetches

```python
# ✅ Returns QuerySet — view can paginate
def product_list(*, establishment_id: int) -> QuerySet:
    return Product.objects.filter(establishment_id=establishment_id)

# ✅ Returns instance — raises 404 if not found
def product_get(*, product_id: int, establishment_id: int) -> Product:
    return get_object_or_404(Product, id=product_id, establishment_id=establishment_id)
```

## Filtering Parameters

Pass all filter parameters as keyword-only arguments with sensible defaults:

```python
def establishment_list(
    *,
    owner_id: int | None = None,
    category_id: int | None = None,
    is_open: bool | None = None,
) -> QuerySet:
    qs = Establishment.objects.select_related("category", "address")

    if owner_id is not None:
        qs = qs.filter(owner_id=owner_id)
    if category_id is not None:
        qs = qs.filter(category_id=category_id)
    if is_open is not None:
        qs = qs.filter(manual_open_close=is_open)

    return qs
```

## Passing Filters from Views

Views extract query params and pass them to selectors:

```python
class ProductViewSet(viewsets.ModelViewSet):
    def get_queryset(self) -> QuerySet:
        return product_list(
            establishment_id=self.kwargs["establishment_id"],
            status=self.request.query_params.get("status"),
            category_id=self.request.query_params.get("category_id"),
        )
```

## Naming Conventions

- **File**: `selectors.py` within the app
- **Functions**: `{model}_{action}` (snake_case)
  - `product_list()` — returns QuerySet
  - `product_get()` — returns single instance (raises 404)
  - `establishment_list_by_owner()` — more descriptive when needed

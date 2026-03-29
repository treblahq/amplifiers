# Services Pattern

## Purpose

Services contain the **application's business logic**: creating, updating, and deleting
resources, enforcing domain rules, and coordinating between models, external integrations,
and async tasks.

## Rules

✅ **DO** contain all write/mutation business logic
✅ **DO** call `full_clean()` before `save()` on model instances
✅ **DO** use `transaction.atomic()` for multi-step operations
✅ **DO** use **keyword-only arguments** (after `*`) for clarity and safety
✅ **DO** remain independent of the HTTP request

❌ **DO NOT** access `request` inside services
❌ **DO NOT** return HTTP responses or status codes
❌ **DO NOT** perform complex queries (use selectors instead)
❌ **DO NOT** call services from models or serializers

## Structure

Service functions live in `services.py` inside each app. Each function is named
`{model}_{action}`:

```python
# products/services.py
from django.db import transaction

from .models import Product, ProductImage
from .selectors import product_get


def product_create(
    *,
    name: str,
    price: float,
    establishment_id: int,
    category_id: int | None = None,
    description: str = "",
    status: bool = False,
    image=None,
) -> Product:
    product = Product(
        name=name,
        price=price,
        description=description,
        status=status,
        category_id=category_id,
        establishment_id=establishment_id,
    )
    product.full_clean()
    product.save()

    if image is not None:
        ProductImage.objects.create(product=product, image=image)

    return product


def product_update(*, product: Product, **kwargs) -> Product:
    for field, value in kwargs.items():
        setattr(product, field, value)

    product.full_clean()
    product.save()
    return product


def product_delete(*, product: Product) -> None:
    product.delete()
```

## Transactions

Wrap multi-step operations in `transaction.atomic()`:

```python
from django.db import transaction

def order_create(*, customer_id: int, establishment_id: int, items: list[dict]) -> Order:
    with transaction.atomic():
        order = Order(customer_id=customer_id, establishment_id=establishment_id)
        order.full_clean()
        order.save()

        for item in items:
            order_item = OrderItem(
                order=order,
                product_id=item["product_id"],
                quantity=item["quantity"],
                unit_price=item["unit_price"],
            )
            order_item.full_clean()
            order_item.save()

    return order
```

## Keyword-Only Arguments

Always use `*` to enforce keyword-only arguments:

```python
# ✅ CORRECT - all args are keyword-only
def product_create(*, name: str, price: float, establishment_id: int) -> Product:
    ...

# ❌ WRONG - positional arguments allow accidental misuse
def product_create(name: str, price: float, establishment_id: int) -> Product:
    ...
```

## Calling from Views

Views unpack serializer data into service calls:

```python
class ProductViewSet(viewsets.ModelViewSet):
    def perform_create(self, serializer) -> None:
        product_create(
            establishment_id=self.kwargs["establishment_id"],
            **serializer.validated_data,
        )

    def perform_update(self, serializer) -> None:
        product_update(product=self.get_object(), **serializer.validated_data)
```

## Validation in Services

Services validate at the domain level. Model `full_clean()` covers field and `clean()` logic.
For business rule violations use application exceptions:

```python
from common.exceptions import ApplicationError

def coupon_apply(*, code: str, order: Order) -> Order:
    try:
        coupon = Coupon.objects.get(code=code, establishment=order.establishment)
    except Coupon.DoesNotExist:
        raise ApplicationError("Coupon not found.")

    if not coupon.is_valid():
        raise ApplicationError("Coupon is expired or inactive.")

    order.coupon = coupon
    order.discount = coupon.calculate_discount(order.subtotal)
    order.full_clean()
    order.save()
    return order
```

## Naming Conventions

- **File**: `services.py` within the app
- **Functions**: `{model}_{action}` (snake_case)
  - `product_create()`
  - `product_update()`
  - `product_delete()`
  - `order_create()`
  - `coupon_apply()`

## When to Create a Service Function

Create a service function when you have:
- Any model `save()` or `delete()` triggered by user action
- Business rules that span multiple models
- External API calls or async tasks as side effects
- Transactional operations

Simple CRUD can still use service functions — they centralize logic and make testing easier.

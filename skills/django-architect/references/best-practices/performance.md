# Performance

## 1. Prevent N+1 Queries

Always eager load related objects in selectors. Never access relations inside a loop
without prefetching.

```python
# ✅ CORRECT — single query with joins
def product_list(*, establishment_id: int) -> QuerySet:
    return (
        Product.objects.filter(establishment_id=establishment_id)
        .select_related("category")
        .prefetch_related("images", "food_restrictions")
    )

# ❌ WRONG — triggers N extra queries inside the serializer
def product_list(*, establishment_id: int) -> QuerySet:
    return Product.objects.filter(establishment_id=establishment_id)
```

Use `select_related` for FK/OneToOne (SQL JOIN) and `prefetch_related` for M2M
or reverse FK (separate query per relation, then Python-side joining).

## 2. Select Only Necessary Columns

Use `.only()` when you need a subset of fields (large models with text/blob fields):

```python
Product.objects.filter(establishment_id=establishment_id).only("id", "name", "price")
```

Use `.values()` when you only need raw data (no model instances):

```python
Product.objects.filter(establishment_id=establishment_id).values("id", "name")
```

## 3. Use `exists()` and `count()` Instead of Fetching Objects

```python
# ✅ CORRECT
if Product.objects.filter(establishment_id=eid).exists():
    ...

# ❌ WRONG — fetches all rows
if Product.objects.filter(establishment_id=eid):
    ...

# ✅ CORRECT
total = Product.objects.filter(establishment_id=eid).count()

# ❌ WRONG — fetches all rows into memory
total = len(Product.objects.filter(establishment_id=eid))
```

## 4. Paginate Large Result Sets

Never return unbounded lists. Use DRF pagination:

```python
# config/settings/base.py
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}
```

For custom page sizes per endpoint:

```python
from rest_framework.pagination import PageNumberPagination

class ProductPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class ProductViewSet(viewsets.ModelViewSet):
    pagination_class = ProductPagination
```

## 5. Use Database Indexes

Add `db_index=True` to fields used frequently in filters and order_by:

```python
class Product(TimeStampedModel):
    status = models.BooleanField(default=False, db_index=True)
    establishment = models.ForeignKey(
        "establishments.Establishment",
        on_delete=models.CASCADE,
        db_index=True,  # automatically added for ForeignKey, but explicit is fine
    )
```

For composite indexes:

```python
class Meta:
    indexes = [
        models.Index(fields=["establishment", "status"], name="product_establishment_status_idx"),
    ]
```

## 6. Use Transactions for Multi-Step Writes

Wrap related writes in `transaction.atomic()` to avoid partial writes and reduce round-trips:

```python
from django.db import transaction

def order_create(*, customer_id: int, items: list[dict]) -> Order:
    with transaction.atomic():
        order = Order.objects.create(customer_id=customer_id)
        OrderItem.objects.bulk_create([
            OrderItem(order=order, **item) for item in items
        ])
    return order
```

## 7. Use `bulk_create` and `bulk_update`

For inserting or updating many rows at once:

```python
# ✅ Single query
ProductImage.objects.bulk_create([
    ProductImage(product=product, image=img) for img in images
])

# ❌ N queries
for img in images:
    ProductImage.objects.create(product=product, image=img)
```

## 8. Cache Expensive Queries

Use Django's cache framework for data that changes infrequently:

```python
from django.core.cache import cache

def food_restriction_list() -> QuerySet:
    cache_key = "food_restriction_list"
    result = cache.get(cache_key)

    if result is None:
        result = list(FoodRestriction.objects.all())
        cache.set(cache_key, result, timeout=3600)  # 1 hour

    return result
```

## 9. Queue Heavy Operations

Use Celery (or Django's built-in task support) for slow or side-effect-heavy work:

```python
from celery import shared_task

@shared_task
def send_order_confirmation_email(order_id: int) -> None:
    order = Order.objects.select_related("customer", "establishment").get(id=order_id)
    # ... send email


# Call from service
def order_confirm(*, order: Order) -> Order:
    order.status = OrderStatus.CONFIRMED
    order.save()
    send_order_confirmation_email.delay(order.id)
    return order
```

## 10. Avoid ORM Pitfalls

```python
# ✅ Filter at database level
Product.objects.filter(establishment_id=eid, status=True)

# ❌ Filter in Python after fetching all rows
[p for p in Product.objects.filter(establishment_id=eid) if p.status]

# ✅ Use annotate for computed fields in queries
from django.db.models import Count
Establishment.objects.annotate(product_count=Count("products"))

# ❌ Count in Python with N+1
for e in Establishment.objects.all():
    count = e.products.count()  # one query per establishment
```

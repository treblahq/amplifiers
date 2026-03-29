# Naming Conventions

## Apps

- Plural snake_case
- Reflects the domain, not the technology

```text
✅ products, establishments, users, orders, coupons
❌ product, Product, ProductApp, api
```

## Models

- Singular PascalCase

```text
✅ Product, Establishment, ProductCategory, OrderItem
❌ Products, product, product_category
```

## Model Fields

- snake_case
- Boolean fields: prefix with `is_` or `has_` when it improves clarity
- FK fields: `{model}_id` suffix is automatic via Django — use `{model}` as the field name

```python
# ✅ CORRECT
class Product(models.Model):
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    category = models.ForeignKey(ProductCategory, ...)  # access as product.category or product.category_id
    created_at = models.DateTimeField(auto_now_add=True)
```

## Related Names

- Always set `related_name` on FK and M2M fields
- Plural snake_case

```python
establishment = models.ForeignKey(
    "establishments.Establishment",
    on_delete=models.CASCADE,
    related_name="products",   # ✅ establishment.products.all()
)
```

## Views

| Type      | Convention              | Example                          |
|-----------|-------------------------|----------------------------------|
| ViewSet   | `{Model}ViewSet`        | `ProductViewSet`                 |
| APIView   | `{Action}{Model}View`   | `CheckCouponView`                |
| Mixin     | `{Behavior}Mixin`       | `EstablishmentNestedMixin`       |

## Serializers

| Use Case         | Convention                    | Example                          |
|------------------|-------------------------------|----------------------------------|
| Simple CRUD      | `{Model}Serializer`           | `FoodRestrictionSerializer`      |
| Input (write)    | `{Model}InputSerializer`      | `ProductInputSerializer`         |
| Output (read)    | `{Model}OutputSerializer`     | `ProductOutputSerializer`        |
| List view        | `{Model}ListSerializer`       | `ProductListSerializer`          |

## Services

- Module-level functions: `{model}_{action}` in snake_case
- Actions: `create`, `update`, `delete`, or descriptive verb phrases

```python
product_create()
product_update()
product_delete()
coupon_apply()
order_confirm()
establishment_toggle_status()
```

## Selectors

- Module-level functions: `{model}_list`, `{model}_get`, or `{model}_get_{criteria}`

```python
product_list()
product_get()
product_get_by_slug()
establishment_list_by_owner()
```

## Permissions

- `Is{Role}` or `Is{Role}Or{Condition}`

```python
IsEstablishmentOwner
IsOwnerOrReadOnly
IsAdminOrReadOnly
```

## Exceptions

- `{Domain}Error`

```python
ProductNotAvailableError
CouponExpiredError
InsufficientStockError
```

## Enums

- Class: descriptive PascalCase
- Members: SCREAMING_SNAKE_CASE

```python
class DeliveryType(models.TextChoices):
    FREE = "free_delivery", "Frete Grátis"
    FIXED = "fixed_delivery", "Frete Fixo"
```

## Files

| File            | Location               |
|-----------------|------------------------|
| `models.py`     | `{app}/`               |
| `views.py`      | `{app}/`               |
| `serializers.py`| `{app}/`               |
| `services.py`   | `{app}/`               |
| `selectors.py`  | `{app}/`               |
| `permissions.py`| `{app}/`               |
| `enums.py`      | `{app}/` or `common/`  |
| `exceptions.py` | `{app}/` or `common/`  |
| `urls.py`       | `{app}/`               |
| `admin.py`      | `{app}/`               |

## URL Patterns

- Lowercase, hyphen-separated path segments
- Plural resource names

```python
/api/v1/products/
/api/v1/establishments/{id}/products/
/api/v1/establishments/{id}/products/{pk}/
/api/v1/establishments/{id}/coupons/
```

## Variables and Functions

- snake_case everywhere
- Use descriptive names; avoid abbreviations

```python
# ✅ CORRECT
establishment_id = self.kwargs["establishment_id"]
product_queryset = product_list(establishment_id=establishment_id)

# ❌ WRONG
eid = self.kwargs["establishment_id"]
qs = product_list(establishment_id=eid)
```

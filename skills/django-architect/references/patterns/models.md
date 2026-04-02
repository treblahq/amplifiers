# Models Pattern

## Purpose

Models define the **database schema**, enforce **data integrity**, and expose simple
**derived properties**. They do not contain business logic or orchestration.

## Rules

✅ **DO** define fields, constraints, and indexes
✅ **DO** implement `__str__()`, `clean()`, and simple `@property`
✅ **DO** use abstract base models for shared fields
✅ **DO** call `full_clean()` before `save()` — in services, not in `save()` itself
✅ **DO** use `Meta.constraints` for database-level integrity

❌ **DO NOT** put business logic in models
❌ **DO NOT** override `save()` for anything beyond trivial field setting
❌ **DO NOT** call external services or trigger side effects from models
❌ **DO NOT** use signals for business logic (prefer explicit service calls)

## Abstract Base Models

Define shared fields in `common/models.py`:

```python
# common/models.py
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class BasicAddressModel(models.Model):
    street = models.CharField(max_length=1000)
    number = models.CharField(max_length=10)
    neighborhood = models.CharField(max_length=50)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=2, choices=BrazilianState.choices)
    zip_code = models.CharField(max_length=11)
    complement = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        abstract = True
```

## Model Structure

```python
# products/models.py
from django.core.validators import MinValueValidator
from django.db import models

from common.models import TimeStampedModel
from .enums import AdditionalGroupType


class ProductCategory(TimeStampedModel):
    name = models.CharField(max_length=255)
    establishment = models.ForeignKey(
        "establishments.Establishment",
        on_delete=models.CASCADE,
        related_name="product_categories",
    )

    class Meta:
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "establishment"],
                name="unique_category_per_establishment",
            )
        ]

    def __str__(self) -> str:
        return f"{self.name} | {self.establishment.name}"


class Product(TimeStampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    status = models.BooleanField(default=False)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    price_from = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="products",
    )
    establishment = models.ForeignKey(
        "establishments.Establishment",
        on_delete=models.CASCADE,
        related_name="products",
    )
    food_restrictions = models.ManyToManyField(
        "FoodRestriction",
        blank=True,
        related_name="products",
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.name

    @property
    def has_promotional_price(self) -> bool:
        return self.price_from is not None and self.price_from < self.price
```

## Validation

Use `clean()` for field-level and cross-field validation:

```python
from django.core.exceptions import ValidationError

class Coupon(TimeStampedModel):
    start_at = models.DateTimeField()
    finish_at = models.DateTimeField()
    discount_percent = models.IntegerField(default=0)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def clean(self) -> None:
        if self.finish_at <= self.start_at:
            raise ValidationError("finish_at must be after start_at.")

        if self.discount_percent == 0 and self.discount_price is None:
            raise ValidationError("Either discount_percent or discount_price must be set.")
```

Services must call `full_clean()` before saving:

```python
def coupon_create(*, establishment_id: int, **kwargs) -> Coupon:
    coupon = Coupon(establishment_id=establishment_id, **kwargs)
    coupon.full_clean()   # triggers clean() + field validators
    coupon.save()
    return coupon
```

## Database Constraints

Prefer database-level constraints over application-only validation:

```python
class OperationDay(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "establishment"],
                name="unique_operation_day_per_establishment",
            ),
            models.CheckConstraint(
                check=models.Q(discount_percent__gte=0) & models.Q(discount_percent__lte=100),
                name="valid_discount_percent_range",
            ),
        ]
```

## Field Conventions

- Use `DecimalField` for money/prices instead of `FloatField`
- Always set `related_name` on `ForeignKey` and `ManyToManyField`
- Prefer `blank=True, default=""` over `null=True` for string fields
- Use `null=True` only when the absence of a value is semantically meaningful
- Avoid `null=True` on `CharField` / `TextField`

## Naming Conventions

- **File**: `models.py` within the app
- **Class**: singular PascalCase (`Product`, `ProductCategory`)
- **Fields**: snake_case (`created_at`, `establishment_id`)
- **Related names**: plural snake_case (`products`, `product_categories`)

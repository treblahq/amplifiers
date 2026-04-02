# Serializers Pattern

## Purpose

Serializers handle **data validation** (input) and **data transformation** (output).
They are not responsible for business logic or persistence.

## Rules

✅ **DO** validate input fields and their types
✅ **DO** use separate serializers for input and output when they differ
✅ **DO** use `read_only_fields` for fields that should never be writable
✅ **DO** use `source` to rename fields between API and model layer
✅ **DO** use `SerializerMethodField` for computed output fields

❌ **DO NOT** call services or write to the database inside serializers
❌ **DO NOT** put business logic in `validate_*` methods (use services)
❌ **DO NOT** use `fields = "__all__"` — always declare fields explicitly
❌ **DO NOT** mix input and output concerns in a single serializer when they differ significantly

## Input / Output Split

When the write payload differs from the read response, use separate serializers:

```python
# products/serializers.py
from rest_framework import serializers
from .models import Product, ProductCategory


class ProductInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)
    price_from = serializers.DecimalField(
        max_digits=10, decimal_places=2, min_value=0, required=False, allow_null=True
    )
    status = serializers.BooleanField(default=False)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductCategory.objects.all(),
        source="category",
        required=False,
        allow_null=True,
    )
    food_restriction_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False, write_only=True
    )


class ProductCategoryOutputSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ["id", "name"]


class ProductOutputSerializer(serializers.ModelSerializer):
    category = ProductCategoryOutputSerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "price_from",
            "status",
            "category",
            "establishment_id",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields
```

## Simple ModelSerializer

For simple cases where input and output are the same:

```python
class FoodRestrictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodRestriction
        fields = ["id", "name"]
        read_only_fields = ["id"]
```

## Nested Write

When a nested object needs to be created or updated along with the parent,
handle it in the service — not in the serializer:

```python
# serializer: just validates the nested data structure
class ProductInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    image = serializers.ImageField(required=False)


# service: handles persistence
def product_create(*, name: str, image=None, establishment_id: int) -> Product:
    product = Product(name=name, establishment_id=establishment_id)
    product.full_clean()
    product.save()

    if image is not None:
        ProductImage.objects.create(product=product, image=image)

    return product
```

## SerializerMethodField

Use for derived or computed output fields:

```python
class ProductOutputSerializer(serializers.ModelSerializer):
    has_promotional_price = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    def get_has_promotional_price(self, obj: Product) -> bool:
        return obj.price_from is not None and obj.price_from < obj.price

    def get_image_url(self, obj: Product) -> str | None:
        request = self.context.get("request")
        first_image = obj.images.first()
        if first_image and request:
            return request.build_absolute_uri(first_image.image.url)
        return None

    class Meta:
        model = Product
        fields = ["id", "name", "price", "has_promotional_price", "image_url"]
```

## Cross-Field Validation

Use `validate()` for simple cross-field checks that do not require database access:

```python
class CouponInputSerializer(serializers.Serializer):
    start_at = serializers.DateTimeField()
    finish_at = serializers.DateTimeField()
    discount_percent = serializers.IntegerField(min_value=0, max_value=100, default=0)
    discount_price = serializers.DecimalField(
        max_digits=10, decimal_places=2, required=False, allow_null=True
    )

    def validate(self, data: dict) -> dict:
        if data["finish_at"] <= data["start_at"]:
            raise serializers.ValidationError("finish_at must be after start_at.")
        return data
```

## Naming Conventions

- **Simple**: `{Model}Serializer` (e.g., `FoodRestrictionSerializer`)
- **Input**: `{Model}InputSerializer` (e.g., `ProductInputSerializer`)
- **Output**: `{Model}OutputSerializer` (e.g., `ProductOutputSerializer`)
- **List**: `{Model}ListSerializer` when list output differs from detail
- **File**: `serializers.py` within the app

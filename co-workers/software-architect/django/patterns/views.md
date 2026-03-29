# Views Pattern

## Purpose

Views handle **HTTP concerns only**: authenticate the request, parse inputs,
call services or selectors, and return a response. No business logic lives here.

## Rules

✅ **DO** parse request data and route to services/selectors
✅ **DO** set `permission_classes` and `authentication_classes` explicitly
✅ **DO** use `get_queryset()` to delegate to selectors
✅ **DO** use `perform_create()` / `perform_update()` to delegate to services
✅ **DO** keep views thin — one line of business logic is already too much

❌ **DO NOT** write query logic in views
❌ **DO NOT** write business rules in views
❌ **DO NOT** call `Model.objects.filter(...)` directly in views

## ViewSet Pattern

Use `ModelViewSet` for full CRUD and mix in only what is needed:

```python
# products/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import QuerySet

from .models import Product
from .serializers import ProductInputSerializer, ProductOutputSerializer
from .services import product_create, product_update
from .selectors import product_list
from .permissions import IsEstablishmentOwner


class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsEstablishmentOwner]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ProductInputSerializer
        return ProductOutputSerializer

    def get_queryset(self) -> QuerySet:
        return product_list(establishment_id=self.kwargs["establishment_id"])

    def perform_create(self, serializer: ProductInputSerializer) -> None:
        product_create(
            establishment_id=self.kwargs["establishment_id"],
            **serializer.validated_data,
        )

    def perform_update(self, serializer: ProductInputSerializer) -> None:
        product_update(product=self.get_object(), **serializer.validated_data)
```

## Read-Only ViewSet

When an endpoint only needs list and retrieve:

```python
from rest_framework import mixins, viewsets

class FoodRestrictionViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = FoodRestrictionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet:
        return food_restriction_list()
```

## Custom Actions

Use `@action` for non-CRUD operations on a resource:

```python
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class EstablishmentViewSet(viewsets.ModelViewSet):

    @action(detail=True, methods=["post"], url_path="toggle-status")
    def toggle_status(self, request, pk=None) -> Response:
        establishment = self.get_object()
        establishment_toggle_status(establishment=establishment)
        return Response(status=status.HTTP_204_NO_CONTENT)
```

## Nested Resources

Pass the parent ID from URL kwargs into services and selectors:

```python
class ProductViewSet(viewsets.ModelViewSet):
    def get_queryset(self) -> QuerySet:
        return product_list(establishment_id=self.kwargs["establishment_id"])

    def perform_create(self, serializer) -> None:
        product_create(
            establishment_id=self.kwargs["establishment_id"],
            **serializer.validated_data,
        )
```

URL config:

```python
# establishments/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EstablishmentViewSet
from products.views import ProductViewSet

router = DefaultRouter()
router.register(r"", EstablishmentViewSet, basename="establishment")

product_router = DefaultRouter()
product_router.register(r"products", ProductViewSet, basename="establishment-product")

urlpatterns = [
    *router.urls,
    path("<int:establishment_id>/", include(product_router.urls)),
]
```

## APIView for Non-Resource Endpoints

Use `APIView` for actions that don't map to a model:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class CheckCouponView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request) -> Response:
        serializer = CouponCheckSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = coupon_check(
            code=serializer.validated_data["code"],
            establishment_id=serializer.validated_data["establishment_id"],
        )
        return Response(CouponOutputSerializer(result).data)
```

## Naming Conventions

- **ViewSet**: `{Model}ViewSet` (e.g., `ProductViewSet`, `EstablishmentViewSet`)
- **APIView**: `{Action}{Model}View` (e.g., `CheckCouponView`, `ToggleStatusView`)
- **File**: `views.py` within the app

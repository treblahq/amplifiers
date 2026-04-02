# Exceptions Pattern

## Purpose

Custom exceptions communicate **domain-level errors** in a structured, consistent way
without leaking implementation details to the HTTP layer.

## Rules

✅ **DO** raise domain exceptions from services when business rules are violated
✅ **DO** handle domain exceptions in views or via a global exception handler
✅ **DO** use DRF's built-in `ValidationError` for input validation failures
✅ **DO** use `get_object_or_404` or raise `Http404` / `NotFound` for missing resources

❌ **DO NOT** raise HTTP exceptions directly from services
❌ **DO NOT** catch all exceptions with bare `except:` clauses
❌ **DO NOT** expose stack traces or internal messages in API responses

## Application Exception

Define a base application exception in `common/exceptions.py`:

```python
# common/exceptions.py
from rest_framework.exceptions import APIException
from rest_framework import status


class ApplicationError(APIException):
    """
    Raised by services when a business rule is violated.
    Translates to HTTP 422 Unprocessable Entity.
    """
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    default_detail = "A business rule was violated."
    default_code = "application_error"

    def __init__(self, detail: str | None = None, code: str | None = None):
        super().__init__(detail=detail, code=code)
```

Since `ApplicationError` extends DRF's `APIException`, DRF's exception handler will
automatically convert it to the correct JSON response — no extra wiring needed.

## Domain-Specific Exceptions

Extend `ApplicationError` for domain-specific cases:

```python
# products/exceptions.py
from common.exceptions import ApplicationError


class ProductNotAvailableError(ApplicationError):
    default_detail = "This product is not available for sale."
    default_code = "product_not_available"


class InsufficientStockError(ApplicationError):
    default_detail = "There is not enough stock for this product."
    default_code = "insufficient_stock"
```

## Raising in Services

```python
# products/services.py
from .exceptions import ProductNotAvailableError
from .selectors import product_get


def cart_add_product(*, product_id: int, establishment_id: int, quantity: int) -> None:
    product = product_get(product_id=product_id, establishment_id=establishment_id)

    if not product.status:
        raise ProductNotAvailableError()

    # ... rest of logic
```

## Handling in Views

Because `ApplicationError` is an `APIException`, DRF handles it automatically:

```python
# No extra try/except needed in the view
class CartViewSet(viewsets.ViewSet):
    def create(self, request, establishment_id: int) -> Response:
        serializer = CartItemInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart_add_product(
            establishment_id=establishment_id,
            **serializer.validated_data,
        )
        return Response(status=status.HTTP_201_CREATED)
```

If a `ProductNotAvailableError` is raised, DRF returns:

```json
HTTP 422
{
  "detail": "This product is not available for sale."
}
```

## Custom Exception Handler (optional)

For a unified error response format across all exception types:

```python
# common/exceptions.py
from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context) -> Response | None:
    response = exception_handler(exc, context)

    if response is not None:
        response.data = {
            "error": response.data,
            "status_code": response.status_code,
        }

    return response
```

Register it in settings:

```python
# config/settings/base.py
REST_FRAMEWORK = {
    "EXCEPTION_HANDLER": "common.exceptions.custom_exception_handler",
}
```

## Naming Conventions

- **File**: `exceptions.py` within the app, shared base in `common/exceptions.py`
- **Class**: `{Domain}Error` (e.g., `ProductNotAvailableError`, `CouponExpiredError`)

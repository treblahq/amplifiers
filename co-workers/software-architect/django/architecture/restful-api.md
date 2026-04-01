# RESTful API Design

## URL Structure

```text
GET    /api/v1/establishments/                          # list
POST   /api/v1/establishments/                          # create
GET    /api/v1/establishments/{id}/                     # retrieve
PUT    /api/v1/establishments/{id}/                     # full update
PATCH  /api/v1/establishments/{id}/                     # partial update
DELETE /api/v1/establishments/{id}/                     # destroy

# Nested resources
GET    /api/v1/establishments/{id}/products/            # list nested
POST   /api/v1/establishments/{id}/products/            # create nested
GET    /api/v1/establishments/{id}/products/{pk}/       # retrieve nested
PATCH  /api/v1/establishments/{id}/products/{pk}/       # update nested
DELETE /api/v1/establishments/{id}/products/{pk}/       # destroy nested
```

## HTTP Methods

| Method | Action          | Idempotent | Body |
|--------|-----------------|------------|------|
| GET    | Read            | Yes        | No   |
| POST   | Create          | No         | Yes  |
| PUT    | Full replace    | Yes        | Yes  |
| PATCH  | Partial update  | Yes        | Yes  |
| DELETE | Destroy         | Yes        | No   |

## Status Codes

| Code | Meaning                              |
|------|--------------------------------------|
| 200  | OK — success with body               |
| 201  | Created — resource created           |
| 204  | No Content — success without body    |
| 400  | Bad Request — validation failed      |
| 401  | Unauthorized — not authenticated     |
| 403  | Forbidden — not authorized           |
| 404  | Not Found                            |
| 422  | Unprocessable Entity — business rule |
| 500  | Internal Server Error                |

## Response Format

All responses should be consistent. Success:

```json
{
  "id": 1,
  "name": "Classic Burger",
  "price": 25.90,
  "category": {
    "id": 3,
    "name": "Snacks"
  },
  "created_at": "2024-01-15T10:30:00Z"
}
```

List responses use DRF pagination:

```json
{
  "count": 42,
  "next": "http://api.example.com/products/?page=2",
  "previous": null,
  "results": [...]
}
```

Error responses from DRF:

```json
{
  "name": ["This field is required."],
  "price": ["Ensure this value is greater than or equal to 0."]
}
```

## Versioning

Version via URL prefix (`/api/v1/`, `/api/v2/`). Do not use headers for versioning.

## Authentication

Use JWT via `SimpleJWT`. All non-public endpoints require `Authorization: Bearer <token>`.

```python
# config/settings/base.py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}
```

## Pagination

Always paginate list endpoints. Use `PageNumberPagination` by default:

```python
# common/pagination.py
from rest_framework.pagination import PageNumberPagination

class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100
```

## Filtering

Use query params for filtering. Keep filter logic in the selector:

```python
# GET /api/v1/establishments/{id}/products/?status=active&category=3

def product_list(
    *,
    establishment_id: int,
    status: str | None = None,
    category_id: int | None = None,
) -> QuerySet:
    qs = Product.objects.filter(establishment_id=establishment_id)

    if status is not None:
        qs = qs.filter(status=status)
    if category_id is not None:
        qs = qs.filter(category_id=category_id)

    return qs.select_related("category").prefetch_related("images")
```

## Nested Resources

For resources that only make sense within a parent, use nested URLs. Pass the parent ID via `kwargs`:

```python
class ProductViewSet(viewsets.ModelViewSet):
    def get_queryset(self) -> QuerySet:
        return product_list(establishment_id=self.kwargs["establishment_id"])

    def perform_create(self, serializer):
        product_create(
            establishment_id=self.kwargs["establishment_id"],
            **serializer.validated_data,
        )
```

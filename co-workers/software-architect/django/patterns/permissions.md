# Permissions Pattern

## Purpose

Custom DRF permissions handle **authorization** — deciding whether the authenticated
user is allowed to perform the requested action on a given object or endpoint.

## Rules

✅ **DO** create custom `BasePermission` subclasses for domain rules
✅ **DO** use `has_permission()` for view-level checks
✅ **DO** use `has_object_permission()` for object-level checks
✅ **DO** set `permission_classes` explicitly on every view (never rely on global defaults alone)

❌ **DO NOT** put authorization logic in views or services
❌ **DO NOT** use the global `DEFAULT_PERMISSION_CLASSES` as a substitute for explicit view-level permissions

## Structure

```python
# establishments/permissions.py
from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView

from .models import Establishment


class IsEstablishmentOwner(BasePermission):
    """Allow access only to the owner of the establishment."""

    message = "You do not have permission to manage this establishment."

    def has_permission(self, request: Request, view: APIView) -> bool:
        establishment_id = view.kwargs.get("establishment_id") or view.kwargs.get("pk")
        if not establishment_id:
            return False
        return Establishment.objects.filter(
            id=establishment_id,
            owner=request.user,
        ).exists()

    def has_object_permission(self, request: Request, view: APIView, obj) -> bool:
        return obj.establishment.owner_id == request.user.id
```

## Applying Permissions

Set permissions directly on the view:

```python
from rest_framework.permissions import IsAuthenticated
from establishments.permissions import IsEstablishmentOwner

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsEstablishmentOwner]
```

## Read vs Write Permissions

Allow read access for anyone but restrict writes to owners:

```python
from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj) -> bool:
        if request.method in SAFE_METHODS:
            return True
        return obj.owner_id == request.user.id
```

## Common Patterns

### IsResourceOwner

```python
class IsResourceOwner(BasePermission):
    """Generic ownership check for resources with a direct `user` FK."""

    def has_object_permission(self, request, view, obj) -> bool:
        return getattr(obj, "user_id", None) == request.user.id
```

### IsAdminOrReadOnly

```python
from rest_framework.permissions import IsAdminUser, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view) -> bool:
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
```

## Naming Conventions

- **File**: `permissions.py` within the app
- **Class**: `Is{Role}` or `Is{Role}Or{Condition}` (e.g., `IsEstablishmentOwner`, `IsOwnerOrReadOnly`)

# Security

## 1. Never Expose Secrets in Code

Store secrets in environment variables, never in source code:

```python
# ✅ CORRECT
import os
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

# ❌ WRONG
SECRET_KEY = "django-insecure-abc123..."
```

Use `python-decouple` or `django-environ` for convenience:

```python
from decouple import config

SECRET_KEY = config("DJANGO_SECRET_KEY")
DEBUG = config("DEBUG", default=False, cast=bool)
```

## 2. Disable Debug in Production

```python
# production.py
DEBUG = False
ALLOWED_HOSTS = os.environ["ALLOWED_HOSTS"].split(",")
```

`DEBUG = True` exposes stack traces, SQL queries, and environment variables.

## 3. Use Django ORM — Never Raw SQL with String Formatting

```python
# ✅ CORRECT — parameterized, safe from SQL injection
Product.objects.filter(establishment_id=establishment_id, name=name)

# ✅ Also correct when raw SQL is truly needed
Product.objects.raw("SELECT * FROM products WHERE id = %s", [product_id])

# ❌ WRONG — SQL injection vulnerability
Product.objects.raw(f"SELECT * FROM products WHERE id = {product_id}")
```

## 4. Validate All Input via Serializers

Never trust raw request data. Always validate with a serializer before processing:

```python
def create(self, request) -> Response:
    serializer = ProductInputSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    product_create(**serializer.validated_data)
    ...
```

## 5. Use Model-Level Validation

Call `full_clean()` in services to enforce `clean()` logic and field validators:

```python
def product_create(*, name: str, price: float, ...) -> Product:
    product = Product(name=name, price=price, ...)
    product.full_clean()  # raises ValidationError if invalid
    product.save()
```

## 6. Authenticate and Authorize Every Endpoint

Set `permission_classes` explicitly on every view — never rely on defaults alone:

```python
class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsEstablishmentOwner]
```

Default to `IsAuthenticated` for all private endpoints. Use custom permissions for ownership checks.

## 7. Use JWT with Short Access Token Lifetime

```python
from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}
```

## 8. Use HTTPS in Production

```python
# production.py
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

## 9. Configure CORS Properly

Never use `CORS_ALLOW_ALL_ORIGINS = True` in production:

```python
# production.py
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://app.yourdomain.com",
]

# development.py
CORS_ALLOW_ALL_ORIGINS = True  # only in local dev
```

## 10. Protect File Uploads

Validate file type and size on uploads. Use a custom ImageField or serializer field:

```python
from rest_framework import serializers

class ProductInputSerializer(serializers.Serializer):
    image = serializers.ImageField(required=False)

    def validate_image(self, value):
        max_size_mb = 5
        if value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(f"Image must be under {max_size_mb}MB.")
        return value
```

Store files outside the web root or in an object storage service (S3, GCS). Never serve
user-uploaded files from a path that allows execution.

## 11. Apply Rate Limiting to Public Endpoints

Use DRF's built-in throttling:

```python
# config/settings/base.py
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/hour",
        "user": "1000/hour",
    },
}
```

Apply stricter throttling on authentication endpoints:

```python
from rest_framework.throttling import AnonRateThrottle

class LoginRateThrottle(AnonRateThrottle):
    rate = "10/minute"


class LoginView(APIView):
    throttle_classes = [LoginRateThrottle]
    permission_classes = []
```

## 12. Run Django's Security Checklist

Before deploying to production:

```bash
python manage.py check --deploy
```

This checks for common misconfigurations and recommends security hardening steps.

# Django + DRF Skill - Agent Instructions (Primary)

`AGENTS.md` is the canonical instruction file for AI assistants in this skill.
All other agent-specific files should reference this one to avoid drift.

## Scope

This skill is a domain-agnostic Django REST Framework API playbook focused on architecture,
implementation patterns, and code quality for coding tasks.

## Where to Look

- Architecture and API design: `architecture/`
- Implementation patterns: `patterns/`
- Cross-cutting practices: `best-practices/`
- If anything conflicts, follow `AGENTS.md` first, then the detailed docs

## Knowledge Base

For comprehensive guidance, use:

- **Architecture**: [Overview](architecture/overview.md), [RESTful API](architecture/restful-api.md)
- **Patterns**: [Models](patterns/models.md), [Views](patterns/views.md), [Serializers](patterns/serializers.md), [Services](patterns/services.md), [Selectors](patterns/selectors.md), [Permissions](patterns/permissions.md), [Enums](patterns/enums.md), [Exceptions](patterns/exceptions.md)
- **Best Practices**: [Performance](best-practices/performance.md), [Naming Conventions](best-practices/naming-conventions.md), [Security](best-practices/security.md)

## Quick Rules

### 1. Type Hints

Use type hints throughout:

```python
from django.db.models import QuerySet

def product_list(*, establishment_id: int) -> QuerySet:
    return Product.objects.filter(establishment_id=establishment_id)
```

### 2. Layered Architecture

```text
Request → View → Service → Model/Selector → Database
                     |
                Serializer (input validation / output)
```

- **Views**: HTTP concerns only — parse input, call service or selector, return response
- **Services**: business logic and orchestration
- **Selectors**: complex query logic and data fetching
- **Models**: schema, constraints, and simple derived properties
- **Serializers**: data validation and transformation

### 3. App Organization

Use domain-based Django apps:

```text
project/
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── common/
│   └── models.py        # Abstract base models (TimeStampedMixin, etc.)
├── users/
├── products/
├── orders/
└── manage.py
```

Each app contains:

```text
products/
├── models.py
├── views.py
├── serializers.py
├── services.py
├── selectors.py
├── permissions.py
├── urls.py
├── admin.py
├── apps.py
└── tests/
    ├── test_models.py
    ├── test_services.py
    └── test_views.py
```

### 4. Model Organization

Use abstract base models and keep models focused on schema:

```python
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Product(TimeStampedModel):
    name = models.CharField(max_length=255)
    establishment = models.ForeignKey(
        "establishments.Establishment",
        on_delete=models.CASCADE,
        related_name="products",
    )

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "establishment"],
                name="unique_product_per_establishment",
            )
        ]

    def __str__(self) -> str:
        return self.name
```

### 5. Service Pattern

Business logic lives in service functions — keyword-only arguments, no request context:

```python
from django.db import transaction

def product_create(*, name: str, price: float, establishment_id: int) -> Product:
    product = Product(name=name, price=price, establishment_id=establishment_id)
    product.full_clean()
    product.save()
    return product


def product_update(*, product: Product, name: str, price: float) -> Product:
    product.name = name
    product.price = price
    product.full_clean()
    product.save()
    return product
```

### 6. Selector Pattern

Complex queries live in selector functions:

```python
def product_list(*, establishment_id: int) -> QuerySet:
    return (
        Product.objects.filter(establishment_id=establishment_id)
        .select_related("category")
        .prefetch_related("images", "food_restrictions")
    )


def product_get(*, product_id: int, establishment_id: int) -> Product:
    return get_object_or_404(
        Product,
        id=product_id,
        establishment_id=establishment_id,
    )
```

### 7. ViewSet Pattern

Views delegate to services and selectors:

```python
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, IsEstablishmentOwner]

    def get_queryset(self) -> QuerySet:
        return product_list(establishment_id=self.kwargs["establishment_id"])

    def perform_create(self, serializer: ProductSerializer) -> None:
        product_create(**serializer.validated_data)
```

### 8. Enums

Prefer `TextChoices` / `IntegerChoices` over raw tuples:

```python
class ProductType(models.TextChoices):
    FOOD = "food", "Comida"
    DRINK = "drink", "Bebida"
    DESSERT = "dessert", "Sobremesa"


class Product(TimeStampedModel):
    type = models.CharField(
        max_length=20,
        choices=ProductType.choices,
        default=ProductType.FOOD,
    )
```

### 9. Naming Conventions

- **Apps**: plural snake_case (`products`, `establishments`, `food_restrictions`)
- **Models**: singular PascalCase (`Product`, `Establishment`)
- **Views**: `{Model}ViewSet` or `{Action}{Model}View`
- **Serializers**: `{Model}Serializer`, `{Model}InputSerializer`, `{Model}OutputSerializer`
- **Services**: `{model}_{action}()` (e.g., `product_create()`, `product_update()`)
- **Selectors**: `{model}_get()`, `{model}_list()` (e.g., `product_get()`, `product_list()`)
- **Permissions**: `Is{Role}` (e.g., `IsEstablishmentOwner`)
- **Exceptions**: `{Domain}Error` (e.g., `ProductNotFoundError`)

### 10. Clean Code

- Avoid unnecessary comments
- Keep functions small and intention-revealing
- Remove debug leftovers (`print`, `breakpoint`, `ipdb.set_trace`)
- Use type hints instead of docstrings when signatures are self-evident

### 11. Performance

- Eager load relationships with `select_related` / `prefetch_related`
- Select only necessary columns with `.only()` or `.values()`
- Paginate large result sets
- Cache expensive queries
- Use `transaction.atomic()` for multi-step writes

### 12. Security

- Hash passwords using Django's built-in `make_password` / `AbstractBaseUser`
- Validate all input via serializers and model `full_clean()`
- Authorize with custom Permissions and object-level checks
- Use ORM — never raw SQL with string formatting
- Apply rate limiting to public endpoints

## Language

- **Code**: English (classes, functions, variables, comments)
- **User-facing text**: follow the product locale consistently
- **Commits**: English with conventional commits (`feat:`, `fix:`, `refactor:`)

## Development Commands

```bash
python manage.py test
python manage.py makemigrations
python manage.py migrate
python manage.py shell_plus   # django-extensions
```

## Additional Resources

- Django Docs: https://docs.djangoproject.com/en/5.0/
- DRF Docs: https://www.django-rest-framework.org/
- HackSoftware Django Styleguide: https://github.com/HackSoftware/Django-Styleguide
- Simple JWT: https://django-rest-framework-simplejwt.readthedocs.io/

# Enums Pattern

## Purpose

Enums define **named choices** for model fields in a type-safe, readable way.
Prefer Django's built-in `TextChoices` / `IntegerChoices` over raw tuples.

## Rules

✅ **DO** use `TextChoices` for string-backed enums
✅ **DO** use `IntegerChoices` for integer-backed enums
✅ **DO** define enums inside the model file or in a dedicated `enums.py`
✅ **DO** reference `ChoiceClass.choices` in the model field definition

❌ **DO NOT** use raw tuple lists like `(("radio", "Radio"), ("counter", "Counter"))`
❌ **DO NOT** use string literals when referencing enum values in queries

## TextChoices

```python
# products/enums.py
from django.db import models


class AdditionalGroupType(models.TextChoices):
    RADIO = "radio", "Radio"
    COUNTER = "counter", "Counter"


class DeliveryType(models.TextChoices):
    FREE = "free_delivery", "Frete Grátis"
    FIXED = "fixed_delivery", "Frete Fixo"
    DYNAMIC = "dynamic_delivery", "Frete Dinâmico"


class WeekDay(models.TextChoices):
    MONDAY = "monday", "Segunda-feira"
    TUESDAY = "tuesday", "Terça-feira"
    WEDNESDAY = "wednesday", "Quarta-feira"
    THURSDAY = "thursday", "Quinta-feira"
    FRIDAY = "friday", "Sexta-feira"
    SATURDAY = "saturday", "Sábado"
    SUNDAY = "sunday", "Domingo"
```

## Using in Models

```python
from .enums import AdditionalGroupType, DeliveryType

class AdditionalProductGroup(models.Model):
    type = models.CharField(
        max_length=15,
        choices=AdditionalGroupType.choices,
        default=AdditionalGroupType.RADIO,
    )


class Establishment(models.Model):
    delivery_type = models.CharField(
        max_length=20,
        choices=DeliveryType.choices,
        null=True,
        blank=True,
    )
```

## Referencing Enum Values

Always use the enum member, never the raw string:

```python
# ✅ CORRECT
establishments = Establishment.objects.filter(delivery_type=DeliveryType.FREE)

# ❌ WRONG - brittle, not refactorable
establishments = Establishment.objects.filter(delivery_type="free_delivery")
```

## IntegerChoices

```python
class OrderStatus(models.IntegerChoices):
    PENDING = 1, "Pendente"
    CONFIRMED = 2, "Confirmado"
    PREPARING = 3, "Em preparo"
    DELIVERED = 4, "Entregue"
    CANCELLED = 5, "Cancelado"


class Order(models.Model):
    status = models.IntegerField(
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING,
    )
```

## Brazilian State Choices

For reusable geographic choices, define them in `common/enums.py`:

```python
# common/enums.py
from django.db import models


class BrazilianState(models.TextChoices):
    AC = "AC", "Acre"
    AL = "AL", "Alagoas"
    AP = "AP", "Amapá"
    AM = "AM", "Amazonas"
    BA = "BA", "Bahia"
    CE = "CE", "Ceará"
    DF = "DF", "Distrito Federal"
    ES = "ES", "Espírito Santo"
    GO = "GO", "Goiás"
    MA = "MA", "Maranhão"
    MT = "MT", "Mato Grosso"
    MS = "MS", "Mato Grosso do Sul"
    MG = "MG", "Minas Gerais"
    PA = "PA", "Pará"
    PB = "PB", "Paraíba"
    PR = "PR", "Paraná"
    PE = "PE", "Pernambuco"
    PI = "PI", "Piauí"
    RJ = "RJ", "Rio de Janeiro"
    RN = "RN", "Rio Grande do Norte"
    RS = "RS", "Rio Grande do Sul"
    RO = "RO", "Rondônia"
    RR = "RR", "Roraima"
    SC = "SC", "Santa Catarina"
    SP = "SP", "São Paulo"
    SE = "SE", "Sergipe"
    TO = "TO", "Tocantins"
```

## Naming Conventions

- **File**: `enums.py` within the app, or `common/enums.py` for shared enums
- **Class**: descriptive PascalCase (`AdditionalGroupType`, `DeliveryType`, `OrderStatus`)
- **Members**: SCREAMING_SNAKE_CASE (`FREE`, `FIXED`, `PENDING`)

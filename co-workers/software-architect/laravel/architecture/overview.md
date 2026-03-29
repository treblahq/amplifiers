# Architecture Overview

## Project Architecture

This API follows a **Layered Architecture with Service Layer and Pragmatic DDD** principles.

```
┌─────────────────────────────────────────┐
│          HTTP Layer (Routes)            │
│  - API Routes (RESTful)                 │
│  - Middleware (Auth, CORS, etc.)        │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│       Presentation Layer                │
│  - Controllers (thin, HTTP only)        │
│  - Requests (validation)                │
│  - Resources (response formatting)      │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│        Application Layer                │
│  - Services (business logic)            │
│  - Jobs (async tasks)                   │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│          Domain Layer                   │
│  - Models (entities + Eloquent)         │
│  - Enums (type-safe constants)          │
│  - Exceptions (domain errors)           │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│      Infrastructure Layer               │
│  - Integrations (external APIs)         │
│  - Modules (internal frameworks)        │
│  - Helpers (utilities)                  │
└─────────────────────────────────────────┘
```

## Core Principles

1. **Separation of Concerns**: Each layer has a single, well-defined responsibility
2. **Dependency Injection**: Constructor injection throughout the application
3. **Type Safety**: Strict types, Enums over strings, typed properties
4. **Clean Code**: Self-documenting code, small functions, clear naming
5. **RESTful API**: Resource-oriented endpoints following HTTP standards

## Folder Structure

```
app/
├── Http/
│   ├── Controllers/      # Thin HTTP handlers
│   ├── Requests/         # Validation rules
│   └── Resources/        # JSON response formatters
├── Services/             # Business logic orchestration
├── Models/               # Eloquent models + Traits
├── Integrations/         # External service adapters
├── Modules/              # Internal reusable frameworks
├── Jobs/                 # Async queue workers
├── Enums/                # Type-safe enumerations
├── Helpers/              # Pure utility functions
└── Exceptions/           # Custom exceptions
```

## Request Flow

```
Request → Middleware → Controller → Service → Model → Database
                          ↓            ↓
                      Validation   Business Logic
                          ↓
                      Resource → JSON Response
```

## Key Patterns

- **Controller**: Receives HTTP request, delegates to Service, returns Resource
- **Service**: Orchestrates business logic, calls Models/Integrations/Jobs
- **Model**: Represents domain entities, performs database queries
- **Integration**: Adapts external APIs to internal interfaces
- **Module**: Self-contained internal framework (e.g., WorkflowEngine)

See detailed documentation in the `patterns/` directory for each layer.

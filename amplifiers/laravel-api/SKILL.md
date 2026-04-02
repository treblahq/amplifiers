---
name: laravel-api
version: 1.0.0
source: trebla/co-workers/software-architect/laravel
description: |
  Architecture, implementation patterns, and quality rules for Laravel APIs.
  Covers layered backend structure, controllers, services, requests, resources,
  models, integrations, jobs, naming, performance, and security.
tags: [laravel, php, api, backend, architecture]
---

# Laravel API

## Mandate

Build Laravel APIs with a layered architecture that keeps HTTP concerns, business
logic, persistence, and response shaping in clear, testable boundaries.

## When to Use

- Starting or reviewing a Laravel API project
- Writing controllers, services, requests, resources, jobs, or integrations
- Refactoring a backend that mixes transport, business, and data concerns
- Performing code review on Laravel backend code

---

## Architecture

```text
Request -> Controller -> Service -> Repository/Model -> Database
                                |
                            Resource
```

### Layer Responsibilities

| Layer | Responsible for | Not responsible for |
| --- | --- | --- |
| Controller | Parse request, authorize, call services, return responses | Business rules, query orchestration |
| Service | Business orchestration and state changes | HTTP details, response formatting |
| Request | Validation and input normalization | Business decisions, persistence |
| Resource | Output shaping for the API contract | Business logic, querying |
| Model | Persistence, relationships, query scopes, local invariants | Request flow, endpoint orchestration |
| Integration | External API or provider communication | UI or HTTP response concerns |
| Job | Deferred or heavy background work | Immediate response formatting |

---

## Recommended Project Structure

```text
app/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
├── Services/
├── Integrations/
├── Models/
├── Enums/
├── Exceptions/
└── Jobs/
```

Keep each file single-purpose and make the service layer the main home for
business orchestration.

---

## Core Rules

### Controllers

- Keep controllers thin and HTTP-focused
- Accept validated data from Form Requests
- Delegate business work to services
- Return API Resources or typed response objects

### Services

- Use services for write flows and business orchestration
- Prefer constructor injection for dependencies
- Keep methods small and intention-revealing
- Use transactions for multi-step write operations
- Avoid vague `Manager` or `Helper` classes when the responsibility is a service

### Requests and Resources

- Validate all external input with Form Requests
- Normalize edge-case input before it reaches the service layer
- Use Resources to define stable API output contracts
- Do not build ad hoc arrays in controllers for non-trivial responses

### Models

- Use singular PascalCase model names
- Keep relationships, scopes, casts, and local invariants close to the model
- Use trait-based organization only when the model becomes too large
- Avoid placing endpoint or workflow orchestration inside models

### Integrations and Jobs

- Isolate third-party API logic in dedicated integrations
- Queue slow or heavy work in jobs
- Keep retry rules, failure handling, and side effects explicit

---

## Type and Language Rules

- Use `declare(strict_types=1);` when the target project supports it
- Type parameters, return types, and properties
- Prefer `final` for non-extensible classes
- Prefer `readonly` for constructor-injected dependencies when appropriate
- Keep code, variable names, and comments in English

---

## Naming Conventions

| Element | Convention | Example |
| --- | --- | --- |
| Controller | `{Model}Controller.php` | `PostController.php` |
| Service | `{Domain}Service.php` | `PostService.php` |
| Request | `{Action}{Model}Request.php` | `StorePostRequest.php` |
| Resource | `{Model}Resource.php` | `PostResource.php` |
| Model | Singular `PascalCase` | `Post.php` |
| Enum | Descriptive `PascalCase` | `PostStatus.php` |
| Job | `{Action}{Entity}Job.php` | `ProcessPostJob.php` |
| Exception | `{Domain}Exception.php` | `PostException.php` |

---

## Quality Rules

- Keep controllers free of business logic
- Prefer services over fat controllers or actionless helper sprawl
- Remove debug leftovers such as `dd`, `dump`, or `var_dump`
- Use eager loading to avoid N+1 issues
- Select only necessary columns when payload size matters
- Paginate large result sets
- Cache expensive read paths when the use case benefits from it
- Protect write paths with authorization, validation, and explicit error handling

---

## When Context Is Missing

Collect the minimum required inputs before implementation:

1. What is the API contract for this endpoint or workflow?
2. What is the authorization model?
3. Is the flow read-heavy, write-heavy, or integration-heavy?
4. Are there performance or background-processing constraints?

If the project conventions differ, follow the project before the generic rule.

---
name: knowledge-writter
description: Use this skill to map, structure, and write project documentation in modular format, in English, with files separated by topic and names in snake_case.
---

# Knowledge Writer

## Objective

Transform a repository into a clean, modular, factual documentation set that is easy to navigate for both humans and AI tools.

Use repositories like `Nolat` as the reference style whenever that pattern is available: separated documentation files, English writing, and consistent `snake_case` naming.

## Core Rules

- Always write the final documentation in English.
- Always separate documentation by subject. Avoid one giant file.
- Always use `snake_case` for documentation filenames and folders.
- Keep `README.md` as the documentation index file.
- Prefer facts verified from the repository over assumptions.
- If something cannot be verified, mark it clearly as an assumption or open question, or omit it.
- If the project already has a consistent documentation structure, extend it instead of creating a competing pattern.

## Default Output Structure

Prefer a modular documentation folder such as `knowledge/` or reuse `docs/` if the project already follows that convention.

```text
knowledge/
├── README.md
├── project_overview.md
├── business_model.md
├── product_modules.md
├── system_architecture.md
├── frontend_application.md
├── backend_api.md
├── development_setup.md
└── integrations.md
```

Only create files that are relevant to the real project. Keep the structure lean. Add focused documents only when the repository actually supports them, such as:

- `database_schema.md`
- `authentication_and_authorization.md`
- `deployment_and_infrastructure.md`
- `design_system.md`
- `ai_workflows.md`
- `glossary.md`

## Documentation Workflow

1. Inspect the repository before writing anything.
2. Identify the product scope, technical stack, runtime setup, and major domains.
3. Group the documentation into separate subjects.
4. Create or update the documentation index in `README.md`.
5. Write one focused markdown file per relevant topic.
6. Review the full set for duplication, inconsistency, and weak assumptions.

## What To Inspect First

Before documenting a project, inspect the sources that define the real system:

- root `README.md`
- `package.json`, `composer.json`, `pyproject.toml`, `go.mod`, or equivalent manifests
- frontend and backend app folders
- routes, controllers, services, models, components, modules, and jobs
- `.env.example`, Docker files, compose files, and CI workflows
- existing `docs/`, `knowledge/`, architecture notes, and setup guides

## Writing Standard Per File

Each documentation file should preferably include:

1. A clear English title.
2. A one-line objective in blockquote format.
3. A short overview.
4. Thematic sections with direct, factual explanation.
5. Short lists when they improve scanability.
6. Cross-references when another document covers the topic better.

## Style Rules

- Use concise technical English.
- Prefer short paragraphs and direct lists.
- Do not write marketing copy unless the file is explicitly about brand, positioning, or messaging.
- Do not repeat the same explanation across multiple files.
- Do not invent implementation details, business rules, or architecture decisions.
- Keep examples minimal and only when they clarify a real behavior or structure.
- Preserve official product names, brand names, and domain terminology.

## Naming Rules

- Filenames must use `snake_case.md`
- Folder names must use `snake_case`
- Titles inside the file should be human-readable English
- Do not use spaces, CamelCase, or mixed naming styles in documentation filenames
- `README.md` is the only index-file exception

## Minimum Delivery Standard

When documenting a full project, try to deliver at least:

1. `README.md`
2. `project_overview.md`
3. `system_architecture.md`
4. `development_setup.md`
5. One file for each major application area, such as frontend, backend, modules, or integrations

## Quality Bar

Good documentation must be:

- modular
- easy to scan
- aligned with the real repository
- fully in English
- consistently named in `snake_case`
- useful without requiring the reader to open the entire codebase first

## When Context Is Missing

- Infer only what is strongly supported by the repository.
- If an area is unclear, describe the current visible state instead of guessing the intended design.
- Prefer explicit gaps over false certainty.

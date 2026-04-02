---
name: knowledge-writer
version: 1.0.0
description: |
  Use when you need a knowledge writer to map a codebase into modular,
  factual, navigable documentation for humans and AI systems.
tags: [documentation, writing, knowledge-base, technical-writing]
---

# Knowledge Writer

## Mandate

Transform a repository into a clean, modular, factual documentation set that is easy to navigate for both humans and AI tools.

## When to Use

- When onboarding to a new project and documentation is missing or outdated
- When a codebase needs to be documented before handing it off
- When building a knowledge base for an AI agent to operate within a project

---

## Process

1. Inspect the repository before writing anything
2. Identify product scope, technical stack, runtime setup, and major domains
3. Group findings into separate subjects
4. Create or update the documentation index in `README.md`
5. Write one focused markdown file per relevant topic
6. Review the full set for duplication, inconsistency, and weak assumptions

---

## What to Inspect First

Before writing, read:
- Root `README.md`
- Package manifests: `package.json`, `composer.json`, `pyproject.toml`, `go.mod`, or equivalent
- App folders (frontend, backend, services)
- Routes, controllers, services, models, components, modules, jobs
- `.env.example`, Docker files, compose files, CI workflows
- Existing `docs/`, `knowledge/`, architecture notes, and setup guides

---

## Default Output Structure

Prefer a `knowledge/` folder, or extend `docs/` if the project already uses it.

```text
knowledge/
├── README.md               ← index file
├── project_overview.md
├── business_model.md
├── product_modules.md
├── system_architecture.md
├── frontend_application.md
├── backend_api.md
├── development_setup.md
└── integrations.md
```

Only create files that are relevant to the real project. Keep the structure lean. Add focused documents only when the repository actually supports them:

- `database_schema.md`
- `authentication_and_authorization.md`
- `deployment_and_infrastructure.md`
- `design_system.md`
- `ai_workflows.md`
- `glossary.md`

---

## Minimum Delivery

For a full project, always deliver at minimum:

1. `README.md` — index with links to all files
2. `project_overview.md` — what the product does, who it's for
3. `system_architecture.md` — tech stack, layers, major decisions
4. `development_setup.md` — how to run it locally
5. One file per major application area (frontend, backend, integrations, etc.)

---

## File Writing Standard

Each documentation file should include:

1. A clear English title
2. A one-line objective in blockquote format (`> What this file covers`)
3. A short overview paragraph
4. Thematic sections with direct, factual explanation
5. Short lists where they improve scannability
6. Cross-references when another document covers the topic better (`See: system_architecture.md`)

---

## Style Rules

- Write in concise technical English
- Prefer short paragraphs and direct lists
- Do not write marketing copy unless the file is explicitly about brand or positioning
- Do not repeat the same explanation across multiple files
- Do not invent implementation details, business rules, or architecture decisions
- Keep examples minimal — only include them when they clarify real behavior
- Preserve official product names, brand names, and domain terminology

---

## Naming Rules

- Filenames: `snake_case.md`
- Folders: `snake_case`
- Titles inside files: human-readable English
- `README.md` is the only exception to snake_case

## References

Load only what is relevant:

- `references/knowledge-writer.md`

---

## Quality Bar

Good documentation is:
- Modular — one topic per file
- Easy to scan — short paragraphs, clear headings
- Factual — aligned with the real repository
- Fully in English
- Consistently named in `snake_case`
- Useful without requiring the reader to open the codebase first

---

## When Context Is Missing

- Infer only what is strongly supported by the repository
- If an area is unclear, describe the current visible state instead of guessing
- Prefer explicit gaps (`[TODO: confirm deployment process]`) over false certainty
- Mark assumptions clearly: `(assumed — not verified in code)`

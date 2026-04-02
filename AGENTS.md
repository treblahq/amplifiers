# AGENTS

This repository is organized around attachable specialist skills.

## Active architecture

- `skills/` is the canonical runtime layer
- `stacks/` documents recurring combinations of skills
- `references/` inside each skill stores deep supporting material
- `knowledge/` stores internal markdown documentation
- `docs/` is reserved for the published HTML site

## Rules for agents editing this repository

1. Prefer updating `skills/` over introducing extra layers.
2. Do not use `docs/` for internal markdown documentation.
3. Publish new runtime behavior in `skills/`.
4. Publish recurring combinations in `stacks/`.
5. Keep deep references inside the relevant skill package.
6. Keep naming aligned with how the team actually attaches skills in daily work.

---
title: Repository Model
sidebar_position: 3
---

# Repository Model

Amplifiers is intentionally organized around a small set of clear layers.

The repository uses the
[Agent Skills](https://agentskills.io/) package anatomy as its baseline for
authoring skills, then adds a few repository-level layers around it.

## Canonical layers

### `skills/`

Runtime-first packages with directly attachable instructions.

Default shape:

```text
skills/<skill-name>/
├── SKILL.md
├── scripts/      # optional
├── references/   # optional
├── assets/       # optional
└── agents/
    └── openai.yaml   # optional
```

### `stacks/`

Human-facing guides for recurring combinations of skills.

Default shape:

```text
stacks/<stack-name>/
└── README.md
```

### `knowledge/`

Internal repository documentation for maintainers.

### `docs/`

The public Docusaurus site and its source files.

## Naming rules

- folders under `skills/` and `stacks/` use `kebab-case`
- internal markdown files use `snake_case.md`
- `README.md` is reserved for human-facing entry points
- `SKILL.md` is reserved for runtime-first packages

## Naming rules for skills

Prefer names that match the way the team thinks when attaching context to a
task.

Use four practical patterns:

1. broad specialist, such as `designer`
2. specialist qualified by artifact or channel, such as `email-copywriter`
3. modifier or effect, such as `humanizer`
4. stack named by delivery type, such as `landing-page`

## Greenfield rule

This repository is treated as greenfield.

Remove obsolete structure instead of preserving compatibility layers.

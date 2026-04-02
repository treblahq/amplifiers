---
title: Repository Model
sidebar_position: 3
---

# Repository Model

Amplifiers is intentionally organized around a small set of clear layers.

The repository uses the
[Agent Skills](https://agentskills.io/) package anatomy as its baseline for
authoring skills, then adds a few repository-level layers around it.

This shape exists for one reason: the runtime skill should be easy to find,
easy to attach, and easy to extend without creating parallel trees.

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

## Why this shape works

- `skills/` stays canonical, so the runtime layer has one source of truth
- deep material stays close to the skill that needs it
- `stacks/` describe recurring combinations without pretending to be another
  runtime layer
- `docs/` explains the system publicly without becoming a second authoring
  layer for skills
- greenfield cleanup stays simple because obsolete structure can be removed
  instead of preserved

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

## Static docs publishing

The docs site is authored with Docusaurus, but deployed as static output.

- source files live under `docs/`
- `npm run build` emits static files into `docs/build/`
- GitHub Actions uploads that build artifact to GitHub Pages

So the production site is a static website, not a live Node application.

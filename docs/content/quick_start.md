---
title: Quick Start
sidebar_position: 2
---

# Quick Start

Start from the delivery you need, then attach the specialists that should shape
that work.

## 1. Find the runtime skill

The canonical runtime skills live in `skills/`.

```bash
ls skills/
```

Example:

```text
skills/
  designer/
    SKILL.md
```

Attach a `SKILL.md` directly when one specialist should influence the task.

## 2. Reuse stacks when combinations repeat

The recurring human-facing combinations live in `stacks/`.

Use a stack when the same delivery repeatedly needs multiple specialists, such
as:

- a landing page
- a React landing page
- a frontend product feature
- repository documentation work

## 3. Install for Claude Code

From the repository root:

```bash
./.claude/install_skills.sh
```

This creates symlinks from `skills/*` into `~/.claude/skills/`.

## 4. Use the lightweight runtime pointer for Codex-style agents

Read `.agents/README.md`.

That file explains that:

- `skills/` is the source of truth
- `stacks/` is the composition layer
- `references/` inside each skill is the deep material layer
- no second authored copy of skills should be created under `.agents/`

## 5. Open deep references only when needed

Use a skill's `references/` folder when you need the broader supporting material
behind the runtime instruction.

Use `knowledge/` when you need internal repository governance and maintainer
notes.

## 6. Understand the docs site

The documentation site is static.

- Docusaurus source lives in `docs/content/`, `docs/src/`, and `docs/static/`
- `npm run build` generates plain static files in `docs/build/`
- GitHub Actions uploads `docs/build/` to GitHub Pages
- production does not depend on a running Node server

That matters because GitHub Pages only needs the generated HTML, CSS,
JavaScript, and assets. Docusaurus is the authoring tool; `docs/build/` is the
published site.

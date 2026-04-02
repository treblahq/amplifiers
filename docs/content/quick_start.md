---
title: Quick Start
sidebar_position: 2
---

# Quick Start

Use Amplifiers by starting from the delivery you need, then attaching the
specialist skills that match that work.

## 1. Browse the runtime layer

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

Attach a `SKILL.md` directly when you want one specialist to influence the
task.

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

## 5. Go deeper only when needed

Use a skill's `references/` folder when you need the broader supporting material
behind the runtime instruction.

Use `knowledge/` when you need internal repository governance and maintainer
notes.

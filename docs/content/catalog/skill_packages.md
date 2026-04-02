---
title: Skill Packages
sidebar_position: 3
---

# Skill Packages

Amplifiers follows the
[Agent Skills](https://agentskills.io/) package direction used across the
ecosystem, including
[OpenAI Codex skills](https://developers.openai.com/codex/skills) and
[Anthropic's Claude skill guidance](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf):
one folder per skill, with the runtime entrypoint and optional support
material colocated.

That is the core discipline behind this repository: each skill is a small,
self-contained package instead of a loose collection of prompts and notes.

## Default shape

```text
my-skill/
├── SKILL.md          # required: instructions + metadata
├── scripts/          # optional: executable code
├── references/       # optional: documentation
├── assets/           # optional: templates, resources
└── agents/
    └── openai.yaml   # optional: OpenAI/Codex metadata
```

Only `SKILL.md` is required.

## What each part does

| Path                 | Purpose                                            | Required |
| -------------------- | -------------------------------------------------- | -------- |
| `SKILL.md`           | Main runtime instructions and metadata             | yes      |
| `references/`        | Longer documentation loaded only when needed       | no       |
| `scripts/`           | Executable helpers for the skill                   | no       |
| `assets/`            | Templates, packaged resources, static inputs       | no       |
| `agents/openai.yaml` | Optional package metadata for OpenAI/Codex tooling | no       |

## Current repository direction

In Amplifiers:

- runtime behavior lives in `skills/<name>/SKILL.md`
- deeper material lives in `skills/<name>/references/`
- executable helpers belong in `skills/<name>/scripts/`
- packaged resources belong in `skills/<name>/assets/`
- optional OpenAI metadata belongs in `skills/<name>/agents/openai.yaml`

## Repository note

Repository-level adapters such as `.agents/` and `.claude/` are not the same
thing as the internal anatomy of a skill package.

They exist only to help each runtime discover or install the canonical skills
authored under `skills/`.

## Examples from this repository

- `skills/designer/`
- `skills/sales-copywriter/`
- `skills/react-architect/`
- `skills/dopamine-driven-copywritter/`

## Rule

Do not create a second top-level authoring layer when the material clearly
belongs to one skill package.

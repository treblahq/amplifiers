---
title: Contributing
sidebar_position: 5
---

# Contributing

Amplifiers is an open-source library of specialist skills, stacks, and
skill-local supporting material.

It follows the
[Agent Skills](https://agentskills.io/) package style used across the broader
skills ecosystem, including
[OpenAI Codex](https://developers.openai.com/codex/skills).

The contribution rule is straightforward: put the material where the runtime
will expect to find it, and keep the public model easy to understand.

## Ways to contribute

- add a new skill under `skills/<name>/SKILL.md`
- add a new stack under `stacks/<name>/README.md`
- improve an existing skill
- improve a skill's `references/`, `scripts/`, or `assets/`
- improve repository documentation and maintainership guidance

## Before opening a pull request

1. Keep each change focused.
2. Use clear English in docs and skill text.
3. Avoid introducing new architectural layers unless the use case is proven.
4. Read `WRITING_STANDARD.md` before adding new content or changing structure.
5. Confirm links still work.

## Publishing flow

1. Start from the target skill package under `skills/<name>/`.
2. Publish a runtime skill only when one clear attachable specialist or modifier exists.
3. Move long supporting material into `references/` when the runtime file gets too large.
4. Publish a stack when multiple skills form a recurring delivery pattern.
5. Update the public docs when the repository model or catalog changes.

## Writing standard

Use `WRITING_STANDARD.md` for project-wide rules on:

- file naming
- `SKILL.md` versus `README.md`
- folder shapes for `skills/`, `stacks/`, and `knowledge/`
- tone and minimum quality expectations

If you are unsure where something belongs, ask this first:

- is this one attachable specialist
- is this a recurring combination of specialists
- is this deep supporting material for one skill
- is this public documentation about the repository itself

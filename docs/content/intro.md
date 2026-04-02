---
title: Introduction
sidebar_position: 1
---

# Introduction

Amplifiers is an open-source library of reusable specialist skills for agent
workflows.

It is written in the
[Agent Skills](https://agentskills.io/) package style used across the skills
ecosystem, including
[OpenAI Codex](https://developers.openai.com/codex/skills) and
[Anthropic's Claude skill guidance](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf).

The goal is simple: keep the runtime layer clean, make specialist context easy
to attach, and stop scattering prompts, references, and helper material across
unrelated folders.

The repository is organized around how this library is actually used in daily
work:

- attach one specialist skill to a task
- attach multiple skills when the work spans multiple disciplines
- reuse named stacks when the same combinations happen repeatedly

In practice, that means:

- `skills/` stores directly attachable runtime specialists and modifiers
- `stacks/` stores recurring combinations of skills for delivery types
- `references/`, `scripts/`, and `assets/` live inside each skill package when
  needed

If you are new to the project, start with:

1. [Quick Start](./quick_start.md)
2. [Repository Model](./repository_model.md)
3. [Skills Catalog](./catalog/skills.md)
4. [Skill Packages](./catalog/skill_packages.md)

## What lives where

Amplifiers works through four primary top-level layers:

1. `skills/`
2. `stacks/`
3. `knowledge/`
4. `docs/`

The public site you are reading now is powered by Docusaurus inside `docs/`,
then built into a static site for GitHub Pages.

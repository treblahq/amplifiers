---
title: Amplifiers
summary: Open source collection of reusable modules for AI agents and co-workers.
updated_at: 2026-03-30
---

# Amplifiers

Amplifiers is a trebla open source project focused on accelerating AI agents with reusable instruction blocks.

Each module lives in its own `SKILL.md` with a clear scope and a single responsibility. The model is simple: less prompt repetition, more consistent execution.

## What you get today

- modules for writing, architecture, documentation, and prompt engineering
- simple adoption model with no package installation
- structure designed for teams running multiple agents

## Quick start

1. Pick a module from `amplifiers/<name>/SKILL.md`.
2. Paste it into your agent context (for example: system prompt, `AGENTS.md`, `CLAUDE.md`).
3. Combine modules when the workflow requires more than one capability.

## Common use cases

- standardize writing and content review
- improve multimodal prompt quality
- speed up technical repository documentation
- apply architecture patterns for specific stacks

## Official links

- Repository: https://github.com/treblahq/amplifiers
- Web docs: ./index.html
- Contribution guide: ../CONTRIBUTING.md

## Project direction

Amplifiers follows a "small capability, high impact" model: each skill solves a specific problem and can evolve independently.

The same pattern lets trebla centralize docs in the open source portal while keeping docs ownership inside each project.

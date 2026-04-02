---
name: using-amplifiers
version: 1.0.0
description: |
  Use when you need to understand which skills and stacks are available in this
  repository and how to combine them for a task.
tags: [meta-skill, catalog, discovery]
---

# Using Amplifiers

## Mandate

Help the user choose the right skill, modifier, or stack for the task at hand.

## When to Use

- When the user asks which skill to attach
- When the task spans multiple disciplines and needs composition
- When the user is unsure whether to use a base skill, a modifier, or a stack

## Selection model

1. Identify the main specialist needed
2. Check whether the task also needs a modifier
3. Check whether the combination already exists as a documented stack
4. Prefer the smallest useful set of attached skills

## Active architecture

- `skills/` = directly attachable specialists and modifiers
- `stacks/` = recurring combinations of skills
- `references/` = deeper supporting material inside each skill
- `knowledge/` = internal repository documentation

## Quick examples

- Improve a screen visually: `designer`
- Polish UI text: `humanizer`
- Write sales copy: `sales-copywriter`
- Add faster rhythm to copy: `dopamine-driven-copywritter`
- Structure a React delivery: `react-architect`
- Document a repository: `knowledge-writer`

## Rule

If the value is in one specialist, use one skill.

If the value is in a recurring combination, use a stack.

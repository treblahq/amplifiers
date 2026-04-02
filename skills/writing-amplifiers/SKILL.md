---
name: writing-amplifiers
version: 1.0.0
description: |
  Use when creating, renaming, splitting, or restructuring skills and stacks
  in this repository.
tags: [meta-skill, authoring, repository]
---

# Writing Amplifiers

## Mandate

Guide the creation and maintenance of skills, stacks, and skill-local references in
this repository.

## When to Use

- Creating a new skill
- Splitting a broad skill into a specialized one
- Extracting a modifier from deeper supporting material
- Publishing a recurring combination as a stack
- Updating naming, descriptions, or layer placement

## Decision model

1. If the unit is attached directly and often, publish a `skill`
2. If the unit only modifies one dimension of output, publish a `modifier`
3. If the value is mostly in composition, publish a `stack`
4. If the material is deep, keep it in `references/` inside the relevant skill package

## Naming rules

- Prefer specialist names: `designer`, `react-architect`
- Use qualified names only when the specialization is materially different:
  `landing-page-designer`
- Use effect names for modifiers: `humanizer`, `dopamine-driven-copywritter`
- Name stacks after the delivery type: `landing-page`, `frontend-feature`

## Checklist

Before publishing, confirm:

1. The artifact lives in the right layer
2. The name matches how the team actually thinks about the task
3. The description explains both what it does and when to use it
4. The runtime file is concise
5. Deep supporting material stays in `references/`

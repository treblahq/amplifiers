---
name: co-worker-publication
version: 1.0.0
source: trebla/co-workers/knowledge-writter + trebla/co-workers/prompt-engineer + trebla/co-workers/humanizer
description: |
  Distill co-worker source material into publishable amplifiers, superpowers,
  and agents by combining documentation structure, prompt-ready skill writing,
  and natural-language cleanup.
tags: [superpower, publication, documentation, prompts, open-source]
---

# Co-worker Publication

## Mandate

Turn broad upstream co-worker material into clearer published artifacts without
forcing unnecessary one-to-one mappings.

## When to Use

- Publishing a new amplifier from an existing co-worker
- Deciding which parts of a co-worker should become superpowers or agents
- Updating repository docs after a new published artifact is added
- Tightening a broad source package into reusable open-source outputs

---

## Workflow

1. Inspect the co-worker package and identify reusable capabilities
2. Separate runtime-facing material from human-facing explanation
3. Distill prompt-ready instructions into `SKILL.md` where the unit is stable
4. Write `README.md` files that explain composition, scope, and intended use
5. Update repository indexes and source maps to reflect the published layer

---

## Input Checklist

Before starting, collect:

1. Which co-worker package is the source?
2. What reusable capability is actually stable enough to publish?
3. Does the source support one artifact type or multiple?
4. What repository docs need to change after publication?

---

## Output Standard

Deliver where possible:

1. A clear artifact decision: amplifier, superpower, agent, or combination
2. A runtime-ready `SKILL.md` when the result is directly reusable
3. Human-facing READMEs for composition and navigation
4. Updated root documentation and source mapping

---

## Composition Rules

- Use knowledge writing to define ownership and document structure
- Use prompt engineering to sharpen runtime instruction blocks
- Use humanized writing to keep published docs direct and readable
- Publish only the units that are genuinely reusable

---
title: Skills
sidebar_position: 1
---

# Skills

Skills are the canonical runtime layer of Amplifiers.

Think of a skill as the smallest attachable specialist package in the
repository. If you want one clear expert voice, constraint set, or modifier to
shape the work, you attach a skill.

Each skill is named after the specialist or effect you want to attach to a
task.

## Current catalog

| Skill                         | Type       | Description                                                                                            |
| ----------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| `designer`                    | specialist | Design interfaces, pages, and visual systems with hierarchy, UX judgment, and implementation awareness |
| `humanizer`                   | modifier   | Remove AI writing patterns and restore natural voice, rhythm, and personality                          |
| `sales-copywriter`            | specialist | Write conversion-focused sales copy for offers, pages, emails, and campaigns                           |
| `dopamine-driven-copywritter` | modifier   | Increase rhythm, curiosity, and tension in copy without collapsing into empty hype                     |
| `prompt-engineer`             | specialist | Turn rough ideas into optimized prompts for specific AI platforms and media types                      |
| `knowledge-writer`            | specialist | Map a codebase into modular, factual, navigable documentation                                          |
| `react-architect`             | specialist | Define component boundaries, hooks, services, and architecture patterns for React projects             |
| `django-architect`            | specialist | Structure Django and DRF backends with clear layers, selectors, services, and view rules               |
| `laravel-architect`           | specialist | Structure Laravel backends with clean controllers, services, requests, resources, and integrations     |
| `html-architect`              | specialist | Structure semantic, maintainable, accessible HTML projects and marketing pages                         |
| `using-amplifiers`            | meta-skill | Explain what is available in the library and how to combine it                                         |
| `writing-amplifiers`          | meta-skill | Explain how to create or update skills and stacks in this repository                                   |

## Authoring rules

- keep `SKILL.md` concise
- move long supporting references into `references/`
- name the skill after the attachable specialist or effect
- avoid creating a new skill only because the final output file changes

## Typical use

- use `designer` when the job needs visual judgment, layout direction, or UI
  structure
- use `sales-copywriter` when the output needs stronger conversion logic
- use `humanizer` when the writing is correct but still sounds templated
- use `react-architect` when the work needs React structure, component
  boundaries, and implementation discipline

## Practical rule

Create a new skill only when the way of thinking changes in a meaningful way.
Do not create a separate skill just because the final artifact changed from a
page to an email or from a doc to a post.

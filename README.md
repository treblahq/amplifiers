<p align="center">
  <img src="docs/static/img/logo.png" alt="Amplifiers logo" width="240" />
</p>

<h1 align="center">Amplifiers</h1>

<p align="center">
  A composable library of attachable specialist skills for agent workflows.
</p>

---

## What Amplifiers is

Amplifiers is an open-source library of reusable specialist skills that you can
attach directly to a task.

The repository is organized around how the library is actually used in daily
work:

- attach one specialist skill to a task
- attach multiple skills when the task spans multiple disciplines
- reuse named stacks when the same combinations happen repeatedly

This repository writes skills in the
[Agent Skills](https://agentskills.io/) package style used across the broader
ecosystem, including
[OpenAI Codex skills](https://developers.openai.com/codex/skills) and
[Anthropic's Claude skill guidance](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf).

---

## Repository model

Amplifiers now follows four primary top-level layers:

1. `skills/` stores the canonical attachable runtime skills.
2. `stacks/` documents recurring combinations of skills for common deliveries.
3. `knowledge/` stores internal markdown documentation about the repository.
4. `docs/` is reserved for the Docusaurus documentation site published via GH Pages.

Deep supporting material now lives inside each skill package, next to the
runtime file:

- `scripts/` for executable helpers when a skill needs them
- `references/` for documentation loaded as needed
- `assets/` for templates and packaged resources
- `agents/openai.yaml` for optional OpenAI/Codex-specific metadata

---

## Core naming rule

Skills are named after the specialist or effect you want to attach.

Examples:

- `designer`
- `humanizer`
- `sales-copywriter`
- `react-architect`
- `dopamine-driven-copywritter`

Stacks are named after the recurring delivery type:

- `landing-page`
- `landing-page-react`
- `frontend-feature`
- `repository-docs`

---

## Available skills

| Skill                                                                      | Type       | Description                                                                                            |
| -------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| [designer](skills/designer/SKILL.md)                                       | specialist | Design interfaces, pages, and visual systems with hierarchy, UX judgment, and implementation awareness |
| [humanizer](skills/humanizer/SKILL.md)                                     | modifier   | Remove AI writing patterns and restore natural voice, rhythm, and personality                          |
| [sales-copywriter](skills/sales-copywriter/SKILL.md)                       | specialist | Write conversion-focused sales copy for offers, pages, emails, and campaigns                           |
| [dopamine-driven-copywritter](skills/dopamine-driven-copywritter/SKILL.md) | modifier   | Increase rhythm, curiosity, and tension in copy without collapsing into hype                           |
| [prompt-engineer](skills/prompt-engineer/SKILL.md)                         | specialist | Turn rough ideas into optimized prompts for specific AI platforms and media types                      |
| [knowledge-writer](skills/knowledge-writer/SKILL.md)                       | specialist | Map a codebase into modular, factual, navigable documentation                                          |
| [react-architect](skills/react-architect/SKILL.md)                         | specialist | Define component boundaries, hooks, services, and architecture patterns for React projects             |
| [django-architect](skills/django-architect/SKILL.md)                       | specialist | Structure Django and DRF backends with clear layers, selectors, services, and view rules               |
| [laravel-architect](skills/laravel-architect/SKILL.md)                     | specialist | Structure Laravel backends with clean controllers, services, requests, resources, and integrations     |
| [html-architect](skills/html-architect/SKILL.md)                           | specialist | Structure semantic, maintainable, accessible HTML projects and marketing pages                         |
| [using-amplifiers](skills/using-amplifiers/SKILL.md)                       | meta-skill | Explain what is available in the library and how to combine it                                         |
| [writing-amplifiers](skills/writing-amplifiers/SKILL.md)                   | meta-skill | Explain how to create or update skills and stacks in this repository                                   |

---

## Available stacks

| Stack                                                     | Description                                                                                 | Uses                                                                             |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| [frontend-feature](stacks/frontend-feature/README.md)     | Ship product-facing frontend work with design, React architecture, and writing polish       | `designer`, `react-architect`, `humanizer`, `knowledge-writer`                   |
| [landing-page](stacks/landing-page/README.md)             | Build a landing page with copy, design, semantic structure, and prompt support              | `sales-copywriter`, `designer`, `html-architect`, `humanizer`, `prompt-engineer` |
| [landing-page-react](stacks/landing-page-react/README.md) | Build a React-based landing page with conversion design, sales copy, and frontend structure | `designer`, `sales-copywriter`, `humanizer`, `react-architect`                   |
| [repository-docs](stacks/repository-docs/README.md)       | Improve repository docs, standards, and public-facing structure                             | `knowledge-writer`, `humanizer`, `html-architect`, `designer`                    |
| [publication](stacks/publication/README.md)               | Distill source material into reusable published skills and stacks                           | `knowledge-writer`, `prompt-engineer`, `humanizer`                               |

---

## Quick start

Browse the repository by layer:

```bash
ls skills/
ls stacks/
ls knowledge/
```

Use a skill directly by attaching its `SKILL.md` to the task context.

Example:

```text
my-skill/
├── SKILL.md
├── scripts/
├── references/
├── assets/
└── agents/
    └── openai.yaml
```

If you are not sure which skill or combination to use, start with
[using-amplifiers](skills/using-amplifiers/SKILL.md).

---

## Installation notes

- `.agents/README.md` points Codex-style runtimes to the canonical runtime
  skills in `skills/`.
- Claude Code installation is handled through `.claude/INSTALL.md` and
  `.claude/install_skills.sh`.

## Docs deployment

The Docusaurus site in `docs/` is built and deployed by GitHub Actions:

- `.github/workflows/test-docs.yml` validates the build on pull requests
- `.github/workflows/deploy-docs.yml` publishes `docs/build` to GitHub Pages on
  pushes to `main`
- `docs/.nvmrc` pins the Node version used locally and in CI

---

## Skill package anatomy

Amplifiers follows the same skill-package anatomy documented by Agent Skills,
Anthropic, and OpenAI Codex:

```text
my-skill/
├── SKILL.md
├── scripts/
├── references/
├── assets/
└── agents/
    └── openai.yaml
```

In this structure:

- `SKILL.md` is the required runtime entrypoint
- `scripts/` is optional executable code
- `references/` is optional deep documentation
- `assets/` is optional templates and packaged resources
- `agents/openai.yaml` is optional metadata for OpenAI/Codex tooling

---

## Contributing

The main authoring flow is:

1. Published runtime behavior lives in `skills/`.
2. Deep supporting references stay inside the relevant skill package.
3. Recurring combinations live in `stacks/`.
4. Internal repository docs live in `knowledge/`.
5. Public site output lives in `docs/`.

Follow [WRITING_STANDARD.md](WRITING_STANDARD.md) before publishing new content.

---

## License

MIT. Use freely, contribute openly.

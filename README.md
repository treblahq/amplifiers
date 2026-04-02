<p align="center">
  <img src="docs/assets/images/logo.png" alt="Amplifiers logo" width="240" />
</p>

<h1 align="center">Amplifiers</h1>

<p align="center">
  A collection of reusable skills, capabilities, and superpowers for AI agents and co-workers.
</p>

---

## What is Amplifiers?

Amplifiers is an open-source library of modular, reusable capabilities designed to extend what AI agents can do. Think of it as a toolkit of intelligence modules. Each one is a self-contained superpower that any agent, workflow, or AI co-worker can plug into and use.

Instead of building the same logic from scratch every time, you drop in an Amplifier. It handles the heavy lifting so your agent focuses on what matters.

---

## Why Amplifiers?

Modern AI agents are powerful but raw. They need structure to be reliable: consistent ways to search the web, reason about files, manage memory, call APIs, and more.

Amplifiers gives you that structure. Each module is:

- **Composable:** combine multiple amplifiers in a single agent
- **Reusable:** works across different agents, frameworks, and use cases
- **Focused:** one capability per module, done well
- **Open:** community-driven, freely available, easy to extend

---

## Concepts

| Term           | Meaning                                                   |
| -------------- | --------------------------------------------------------- |
| **Amplifier**  | A single, self-contained capability module                |
| **Skill**      | A reusable logic block (e.g. "search the web")            |
| **Superpower** | A high-level capability composed of one or more skills    |
| **Agent**      | Any AI system that uses amplifiers to act in the world    |
| **Co-worker**  | The broader source material used to distill new artifacts |

---

## Repository model

Amplifiers now follows a publishing pipeline:

1. `co-workers/` stores the broader source material, role guidance, and deeper references.
2. `amplifiers/` publishes distilled runtime skills as reusable `SKILL.md` modules.
3. `superpowers/` combines multiple amplifiers into repeatable workflows.
4. `agents/` assembles stable combinations into opinionated collaborators.

Not every co-worker needs a one-to-one amplifier, superpower, or agent. Publish
new artifacts only when the source material supports a clear reusable unit.

---

## Available Amplifiers

| Amplifier                                                    | Description                                                             | Tags                        |
| ------------------------------------------------------------ | ----------------------------------------------------------------------- | --------------------------- |
| [humanize-writing](amplifiers/humanize-writing/SKILL.md)     | Remove AI writing patterns — restore voice, rhythm, and personality     | writing, editing            |
| [prompt-engineering](amplifiers/prompt-engineering/SKILL.md) | Turn ideas into optimized prompts for any AI platform or media type     | prompting, multimodal       |
| [knowledge-writing](amplifiers/knowledge-writing/SKILL.md)   | Map and document a codebase into modular, factual knowledge files       | documentation               |
| [sales-copywriting](amplifiers/sales-copywriting/SKILL.md)   | Write conversion-focused copy for any offer, channel, or funnel stage   | copywriting, marketing      |
| [django-drf](amplifiers/django-drf/SKILL.md)                 | Architecture and patterns for Django REST Framework APIs                | django, python, backend     |
| [react-ecosystem](amplifiers/react-ecosystem/SKILL.md)       | Architecture and patterns for React, Next.js, and React Native projects | react, typescript, frontend |
| [product-design](amplifiers/product-design/SKILL.md)         | Design interfaces, landing pages, and systems with UX and hierarchy     | design, ui, ux              |
| [laravel-api](amplifiers/laravel-api/SKILL.md)               | Architecture and implementation rules for Laravel APIs                  | laravel, php, backend       |
| [html-architecture](amplifiers/html-architecture/SKILL.md)   | Semantic, accessible, and maintainable structure for HTML projects      | html, accessibility         |

---

## Available Superpowers

| Superpower                                                                                   | Description                                                                          | Composes                                                                                   |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| [frontend-feature-delivery](superpowers/frontend-feature-delivery/README.md)                 | Ship frontend features with design, React architecture, writing polish, and docs     | product-design, react-ecosystem, humanize-writing, knowledge-writing                       |
| [landing-page-delivery](superpowers/landing-page-delivery/README.md)                         | Deliver landing pages with copy, design, HTML structure, and prompt assets           | sales-copywriting, product-design, html-architecture, humanize-writing, prompt-engineering |
| [repository-documentation-delivery](superpowers/repository-documentation-delivery/README.md) | Improve README, contribution docs, standards, and repository documentation structure | knowledge-writing, humanize-writing, html-architecture, product-design                     |
| [co-worker-publication](superpowers/co-worker-publication/README.md)                         | Distill source material into published amplifiers, superpowers, and agents           | knowledge-writing, prompt-engineering, humanize-writing                                    |

---

## Available Agents

| Agent                                                                   | Description                                                                              | Uses                                                     |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [frontend-product-builder](agents/frontend-product-builder/README.md)   | Product-facing frontend collaborator for React feature delivery                          | frontend-feature-delivery                                |
| [conversion-launch-builder](agents/conversion-launch-builder/README.md) | Launch-focused collaborator for landing pages and campaign assets                        | landing-page-delivery                                    |
| [open-source-publisher](agents/open-source-publisher/README.md)         | Repository-focused collaborator for docs, standards, README polish, and publication flow | repository-documentation-delivery, co-worker-publication |

---

## Quick Start

Browse the repository by layer:

```bash
ls co-workers/
ls amplifiers/
ls superpowers/
ls agents/
```

---

## Using an Amplifier

Each amplifier is a self-contained module. To use one, include its `SKILL.md` in your agent's system prompt or configuration:

```text
amplifiers/
  humanize-writing/
    SKILL.md
```

---

## Source Material

Use [co-workers/README.md](co-workers/README.md) to see how source material maps
to published amplifiers, superpowers, and agents.

---

## Contributing

Amplifiers is community-driven. If you have built a useful capability for your agents, share it here.

1. Fork the repository
2. Create a new folder under `amplifiers/your-amplifier-name/`
3. Add a `SKILL.md` with a clear description, usage instructions, and examples
4. Open a pull request

Please follow the [contribution guide](CONTRIBUTING.md) to keep modules consistent and high quality.

---

## Design Principles

**One thing, done well.** Each amplifier has a single, clear purpose. No bloat.

**Agent-agnostic.** Amplifiers are not tied to any specific framework, model, or platform.

**Plain language first.** Skills are written in clear, readable instructions, not code.

**Community over perfection.** A rough amplifier that works beats a perfect one that never ships.

---

## License

MIT. Use freely, contribute openly.

---

_Built for agents. Powered by community._

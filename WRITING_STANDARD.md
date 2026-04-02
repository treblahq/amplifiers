# Project writing standard

> Defines how content should be written, named, and organized across Amplifiers.

This standard applies to the active repository architecture:

- `skills/`
- `stacks/`
- `knowledge/`
- `docs/`
- root guidance files

`docs/` is reserved for the published Docusaurus site and is not the canonical
home for internal repository markdown.

## External baseline

Amplifiers writes skills using the
[Agent Skills](https://agentskills.io/) package style that is also described by
[OpenAI Codex skills](https://developers.openai.com/codex/skills) and
[Anthropic's Claude skill guidance](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf).

This repository adds `stacks/`, `knowledge/`, and `docs/` around that baseline,
but the internal anatomy of each skill follows the same package direction.

## Content model

| Artifact            | Purpose                                               | Primary audience           | Source of truth     |
| ------------------- | ----------------------------------------------------- | -------------------------- | ------------------- |
| Skill               | A directly attachable runtime instruction package     | AI systems first           | `SKILL.md`          |
| Skill reference     | Deeper supporting material for one skill              | Maintainers and AI systems | `references/`       |
| Skill script        | Executable helper used by one skill                   | AI systems first           | `scripts/`          |
| Skill asset         | Packaged template or resource used by one skill       | AI systems first           | `assets/`           |
| Stack               | A recurring combination of skills for a delivery type | Humans first               | `README.md`         |
| Knowledge document  | Internal documentation about this repository          | Maintainers first          | `*.md`              |
| Published site page | Public Docusaurus page for GH Pages                   | Humans first               | files under `docs/` |

## Repository publishing flow

The repository now follows this direction:

1. `skills/` publishes attachable runtime specialists and modifiers.
2. `references/`, `scripts/`, and `assets/` stay inside the relevant skill package.
3. `stacks/` documents recurring combinations of skills.
4. `knowledge/` documents the repository itself.
5. `docs/` publishes the public Docusaurus site.

Do not create extra architectural layers unless they solve a repeated real use
case.

## `SKILL.md` versus `README.md`

Use `SKILL.md` when the file is meant to be attached, imported, pasted, or
executed as runtime instructions for an AI system.

Use `README.md` when the file is meant to explain composition, navigation,
scope, installation, or usage for humans.

Default rule:

- `skills/` use `SKILL.md`
- `stacks/` use `README.md`
- `knowledge/` use focused markdown files

## Default folder rules

### `skills/`

Skills are runtime-first packages.

```text
skills/<skill-name>/
├── SKILL.md            # required
├── scripts/            # optional
├── references/         # optional
├── assets/             # optional
└── agents/
    └── openai.yaml     # optional
    └── claude.yaml     # optional
```

Rules:

- folder names use `kebab-case`
- `SKILL.md` is required
- keep the runtime file concise
- move long documentation into `references/`
- add `scripts/` only when executable helpers are genuinely useful
- add `assets/` only when the skill needs packaged templates or resources
- add `agents/openai.yaml` only when the skill needs OpenAI/Codex-specific metadata
- prefer names that sound like a specialist or modifier you would attach to a
  task

### `stacks/`

Stacks are composition-first packages.

```text
stacks/<stack-name>/
└── README.md
```

Rules:

- `README.md` is required
- stack folders use `kebab-case`
- stacks describe combinations, not the full internal logic of each skill
- a stack should state when to use it, which skills it composes, and what it
  is expected to produce

### `knowledge/`

Knowledge stores internal repository markdown.

```text
knowledge/
├── README.md
├── architecture/
├── catalog/
└── testing/
```

Rules:

- use `snake_case.md` for files
- keep documents modular and factual
- do not duplicate the same explanation across multiple files

### `docs/`

`docs/` is reserved for the published Docusaurus site.

Rules:

- keep site source, markdown pages, React pages, and public assets here
- do not treat `docs/` as a general markdown knowledge folder

## Naming rules

- folders under `skills/` and `stacks/` use `kebab-case`
- internal documentation files use `snake_case.md`
- `README.md` is the only documentation filename that should not use
  `snake_case`
- `SKILL.md` stays uppercase because it is a fixed runtime artifact name
- root guidance files may use uppercase names such as `WRITING_STANDARD.md`

## Naming rules for skills

Prefer names that match the way the team thinks when attaching context to a
task.

Use four patterns:

1. broad specialist: `designer`, `react-architect`, `knowledge-writer`
2. specialist qualified by artifact or channel:
   `landing-page-designer`, `email-copywriter`
3. modifier or effect: `humanizer`, `dopamine-driven-copywritter`
4. stack named by delivery type: `landing-page`, `frontend-feature`

Do not create a new skill name just because the final output file changes.

Create a specialized skill only when the underlying heuristics, process, or
tradeoffs are materially different from the base skill.

## Writing rules

- write shared repository documentation in English
- prefer concise technical English over promotional copy
- write runtime instructions in direct imperative language
- use short intros and small sections
- mark assumptions clearly
- avoid duplicating the same explanation in multiple layers

## Required structure by file type

### `SKILL.md`

Every new `SKILL.md` should include:

1. YAML frontmatter
2. clear title
3. short mandate or objective
4. when to use the skill
5. process or decision model
6. output or safety constraints when they matter
7. a references section when the skill has deeper material

Recommended frontmatter fields:

- `name`
- `description`
- `version`
- `tags`

### Stack `README.md`

Every stack README should include:

1. a clear title
2. one-paragraph overview
3. the skills it composes
4. when to use it
5. suggested order or workflow
6. expected output

### Reference documents

Every new reference document should include:

1. a clear title
2. a short factual overview
3. topic-focused sections
4. cross-references when another file covers the topic better

## Source of truth rules

- runtime behavior lives in `skills/<name>/SKILL.md`
- deeper supporting material lives in `skills/<name>/references/`
- executable helpers live in `skills/<name>/scripts/`
- packaged resources live in `skills/<name>/assets/`
- recurring combinations live in `stacks/<name>/README.md`
- repository governance and internal notes live in `knowledge/`
- published site output lives in `docs/`

When behavior changes, update the runtime file and the affected references or
knowledge files in the same pull request.

## Quality checklist

Before opening a pull request, confirm that:

- the content is fully in English
- the file or folder naming matches this standard
- the artifact lives in the correct layer
- the primary file exists for that artifact type
- the same explanation is not duplicated across runtime and human docs
- examples are realistic and minimal
- links and relative paths still work

## Greenfield rule

This repository is treated as greenfield. Remove obsolete structure instead of
preserving compatibility layers.

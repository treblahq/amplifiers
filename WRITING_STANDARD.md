# Project writing standard

> Defines how content should be written, named, and organized across Amplifiers.

This standard applies to content added under `amplifiers/`, `co-workers/`, and
any future `superpowers/`, `agents/`, or root guidance files. The goal is to
keep runtime instructions clear for AI systems and explanatory documents clear
for humans.

## Content model

| Artifact | Purpose | Primary audience | Default source of truth |
| --- | --- | --- | --- |
| Amplifier | A reusable capability package | AI systems first | `SKILL.md` |
| Skill | A runnable instruction block inside an amplifier or similar package | AI systems first | `SKILL.md` |
| Co-worker | A richer role package with guidance, references, and optional knowledge files | Humans and maintainers first | `<name>.md` plus `README.md` |
| Superpower | A composed capability that orchestrates multiple skills or amplifiers | Humans first, AI optionally | `README.md` |
| Agent | An assembled persona or workflow that uses amplifiers and superpowers | Humans first, runtime second | `README.md` |

If a new artifact type is introduced, define its audience first. The primary
audience decides whether the canonical file should be a runtime instruction file
or a human guide.

## `SKILL.md` versus `README.md`

Use `SKILL.md` when the file is meant to be imported, pasted, or executed as a
runtime instruction block for an AI system.

Use `README.md` when the file is meant to explain installation, scope, usage,
composition, or navigation for humans.

Use both files when both audiences matter:

- `SKILL.md` remains the runtime source of truth.
- `README.md` summarizes the purpose, how to use it, and where deeper files live.
- Do not duplicate the full prompt text in `README.md`.

## Default folder rules

### Amplifiers

Amplifiers are runtime-first packages. Every amplifier folder must include
`SKILL.md`.

```text
amplifiers/<amplifier-name>/
├── SKILL.md
└── README.md             # optional, only when human onboarding needs more space
```

Rules:

- Folder names use `kebab-case`.
- `SKILL.md` is required.
- `README.md` is optional and should stay brief if present.
- Examples should only be included when they clarify behavior that is otherwise
  hard to infer.

### Co-workers

Co-workers are authoring packages. They can contain a main role file and a
modular knowledge base.

```text
co-workers/<co-worker-name>/
├── README.md
├── <co-worker-name>.md
└── knowledge/
    ├── README.md
    └── topic_name.md
```

Rules:

- Folder names use `kebab-case`.
- `README.md` is the human entry point.
- `<co-worker-name>.md` is the canonical co-worker instruction file.
- `knowledge/` is optional, but if it exists it should include its own
  `README.md` index.
- Knowledge files inside `knowledge/` use `snake_case.md`.

### Superpowers

Superpowers are composition-first packages. They describe how multiple
amplifiers or skills work together.

```text
superpowers/<superpower-name>/
├── README.md
└── SKILL.md             # optional, only if the superpower is directly reusable
```

Rules:

- `README.md` is required.
- Add `SKILL.md` only when the superpower is also distributable as a single
  reusable instruction block.
- Keep orchestration logic and dependency notes in the `README.md`.

### Agents

Agents are assembled systems. Their folders should explain intent, composition,
and operating context before any runtime details.

```text
agents/<agent-name>/
├── README.md
└── knowledge/
    ├── README.md
    └── topic_name.md
```

Rules:

- `README.md` is required.
- Add runtime prompt files only when the agent is meant to be exported or reused
  directly.
- Keep implementation-specific references in modular knowledge files instead of
  one oversized document.

## Naming rules

- Artifact folders under `amplifiers/`, `co-workers/`, `superpowers/`, and
  `agents/` use `kebab-case`.
- Knowledge and documentation files use `snake_case.md`.
- `README.md` is the only documentation filename that should not use
  `snake_case`.
- `SKILL.md` stays uppercase because it is a fixed runtime artifact name.
- Root guidance files may use uppercase names when they define project-wide
  standards, such as `WRITING_STANDARD.md`.
- Titles inside files use clear human-readable English.
- Preserve published names unless there is an explicit migration plan.

## Writing rules

- Write all new shared project documentation in English.
- Prefer concise technical English over promotional copy.
- Write instructions in direct imperative language when the file is operational.
- Prefer sentence case for section headings in new long-form documents.
- Keep introductions short and factual.
- Use short lists only when they improve scanability.
- Reuse project vocabulary consistently: `amplifier`, `skill`, `superpower`,
  `agent`, and `co-worker`.
- Avoid vague claims such as "powerful", "flexible", or "best-in-class" unless
  the file is explicitly about positioning.
- Mark assumptions clearly instead of presenting guesses as facts.

## Required structure by file type

### `SKILL.md`

Every new `SKILL.md` should include:

1. YAML frontmatter.
2. A clear title.
3. A short mandate or objective.
4. When to use the skill.
5. The operating process, rules, or decision model.
6. Output or safety constraints when they matter.

Recommended frontmatter fields:

- `name`
- `version`
- `source` when derived from another internal artifact
- `description`
- `tags`

### `README.md`

Every new package `README.md` should include:

1. A clear title.
2. A one-paragraph overview.
3. What the package contains.
4. How to use or navigate it.
5. Links to deeper files when they exist.

### Knowledge documents

Every new knowledge document should include:

1. A clear title.
2. A one-line objective in blockquote format.
3. A short factual overview.
4. Small, topic-focused sections.
5. Cross-references instead of duplicated explanations.

## Source of truth rules

- Runtime behavior lives in `SKILL.md` or the canonical co-worker instruction
  file.
- Human onboarding and navigation live in `README.md`.
- Multi-file reference material lives under `knowledge/` when needed.
- When behavior changes, update the runtime file and any affected summary
  documentation in the same pull request.
- Do not create competing explanations for the same topic in multiple places.

## Quality checklist

Before opening a pull request, confirm that:

- the content is fully in English
- the file or folder naming matches this standard
- the right primary file exists for the artifact type
- the same explanation is not duplicated across runtime and human docs
- examples are realistic and minimal
- assumptions are marked when something could not be verified
- links and relative paths still work

## Legacy content

This repository already contains legacy structures and naming choices. Use this
document as the standard for new content and for incremental cleanup. Do not
rename or reorganize published artifacts in unrelated pull requests.

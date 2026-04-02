# Contributing to Amplifiers

Thanks for helping improve Amplifiers.

Amplifiers authors skills in the
[Agent Skills](https://agentskills.io/) package style used across tools like
[OpenAI Codex](https://developers.openai.com/codex/skills) and the broader
Claude skill ecosystem.

## Ways to contribute

- Add a new skill under `skills/<name>/SKILL.md`
- Add a new stack under `stacks/<name>/README.md`
- Improve an existing skill
- Improve an existing skill's `references/`, `scripts/`, or `assets/`
- Improve repository docs in `README.md`, `CONTRIBUTING.md`,
  `WRITING_STANDARD.md`, or `knowledge/`
- Report bugs, broken links, or unclear instructions

## Project structure

```text
skills/
  <skill-name>/
    SKILL.md
    scripts/
    references/
    assets/
    agents/
      openai.yaml
stacks/
  <stack-name>/
    README.md
knowledge/
docs/
WRITING_STANDARD.md
```

## Before you open a PR

1. Keep each change focused.
2. Use clear English in docs and skill text.
3. Avoid introducing new architectural layers unless the use case is proven.
4. Read `WRITING_STANDARD.md` before adding new content or changing package
   structure.
5. Confirm links still work.

## Adding a new skill

1. Create a folder under `skills/` using `kebab-case`.
2. Add `SKILL.md` as the runtime source of truth.
3. Keep the skill single-purpose.
4. Move long references into `references/` when needed.
5. Update `README.md` and any relevant stack docs when needed.

## Publishing inside a skill package

1. Start from the target skill under `skills/<name>/`.
2. Publish a skill only when there is one clear attachable specialist or
   modifier.
3. Move deep supporting material into `references/` when the main runtime file gets too large.
4. Add `scripts/` only when executable helpers are genuinely useful.
5. Publish a stack when multiple skills form a recurring delivery pattern.

## Writing and structure standard

Follow [WRITING_STANDARD.md](WRITING_STANDARD.md) for project-wide rules on:

- when to use `SKILL.md` versus `README.md`
- how to structure `skills/`, `stacks/`, and `knowledge/`
- naming conventions for folders and documentation files
- tone, heading style, and minimum quality expectations

## Pull request checklist

- [ ] Change is scoped and understandable
- [ ] Paths and naming are consistent
- [ ] `README.md` updated when needed
- [ ] Docs updated when needed
- [ ] No unrelated files included

## Code of Conduct

By participating, you agree to follow the
[Code of Conduct](CODE_OF_CONDUCT.md).

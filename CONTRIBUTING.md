# Contributing to Amplifiers

Thanks for helping improve Amplifiers.

## Ways to contribute

- Add a new amplifier (`amplifiers/<name>/SKILL.md`)
- Improve an existing amplifier
- Improve docs in `README.md`, `CONTRIBUTING.md`, or `WRITING_STANDARD.md`
- Report bugs, broken links, or unclear instructions

## Project structure

```text
amplifiers/
  <amplifier-name>/
    SKILL.md
WRITING_STANDARD.md
```

## Before you open a PR

1. Keep each change focused.
2. Use clear English in docs and skill text.
3. Avoid breaking existing amplifier names or paths.
4. Read `WRITING_STANDARD.md` before adding new documentation or changing
   package structure.
5. Confirm links still work.

## Adding a new amplifier

1. Create a folder under `amplifiers/` using `kebab-case`.
2. Add `SKILL.md` as the runtime source of truth. It should include objective
   and scope, workflow or steps, constraints or safety notes, and examples when
   useful.
3. Add `README.md` only if the amplifier needs extra human-facing onboarding.
4. Keep the amplifier single-purpose.
5. Update `README.md` (Available Amplifiers table) when relevant.

## Writing and structure standard

Follow [WRITING_STANDARD.md](WRITING_STANDARD.md) for the project-wide rules on:

- When to use `SKILL.md` versus `README.md`
- How to structure amplifiers, co-workers, superpowers, and agents
- Naming conventions for folders and documentation files
- Tone, heading style, and minimum quality expectations

## Writing guidelines

- Prefer practical, direct instructions.
- Avoid vague claims and filler text.
- Keep language tool-agnostic when possible.
- If a skill depends on a specific tool, state it explicitly.

## Pull request checklist

- [ ] Change is scoped and understandable
- [ ] Paths and naming are consistent
- [ ] `README.md` updated when needed
- [ ] Docs updated when needed
- [ ] No unrelated files included

## Reporting issues

Open a GitHub issue with:

- What happened
- What you expected
- Steps to reproduce
- Suggested fix (optional)

## Code of Conduct

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

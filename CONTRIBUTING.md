# Contributing to Amplifiers

Thanks for helping improve Amplifiers.

## Ways to contribute

- Add a new amplifier (`amplifiers/<name>/SKILL.md`)
- Improve an existing amplifier
- Improve docs in `README.md` or `docs/`
- Report bugs, broken links, or unclear instructions

## Project structure

```text
amplifiers/
  <amplifier-name>/
    SKILL.md
docs/
  index.html
  assets/
```

## Before you open a PR

1. Keep each change focused.
2. Use clear English in docs and skill text.
3. Avoid breaking existing amplifier names or paths.
4. Confirm links still work.

## Adding a new amplifier

1. Create a folder under `amplifiers/` using `kebab-case`.
2. Add `SKILL.md` with:
- Objective and scope
- Workflow or steps
- Constraints/safety notes
- Examples when useful
3. Keep the amplifier single-purpose.
4. Update `README.md` (Available Amplifiers table).
5. Update docs navigation in `docs/index.html` if needed.

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

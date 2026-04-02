# Claude Code installation

This folder does not store the canonical skills.

The canonical skills live in the repository root under `skills/`.

## Install by symlinking the repository skills

From the repository root:

```bash
./.claude/install_skills.sh
```

The script creates symlinks from `skills/*` into `~/.claude/skills/`.

## Notes

- rerun the script after adding a new skill
- remove old symlinks manually if you rename a skill directory
- use `skills/` as the source of truth, not `~/.claude/skills/`

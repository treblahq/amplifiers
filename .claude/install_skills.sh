#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SOURCE_DIR="${REPO_ROOT}/skills"
TARGET_DIR="${HOME}/.claude/skills"

mkdir -p "${TARGET_DIR}"

for skill_dir in "${SOURCE_DIR}"/*; do
  [ -d "${skill_dir}" ] || continue
  skill_name="$(basename "${skill_dir}")"
  ln -sfn "${skill_dir}" "${TARGET_DIR}/${skill_name}"
done

printf 'Installed Claude Code skill links into %s\n' "${TARGET_DIR}"

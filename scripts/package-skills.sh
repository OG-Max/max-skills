#!/usr/bin/env bash
set -euo pipefail

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
OUT=${1:-"$ROOT/dist"}

for command_name in zip unzip sha256sum; do
  command -v "$command_name" >/dev/null || {
    echo "$command_name is required to package skills" >&2
    exit 1
  }
done

rm -rf "$OUT"
mkdir -p "$OUT"

mapfile -t skill_dirs < <(find "$ROOT/skills" -type f -name SKILL.md -printf '%h\n' | sort)
if ((${#skill_dirs[@]} == 0)); then
  echo "No skills found under $ROOT/skills" >&2
  exit 1
fi

for skill_dir in "${skill_dirs[@]}"; do
  skill_name=${skill_dir##*/}
  archive="$OUT/$skill_name.zip"
  (
    cd "$skill_dir"
    LC_ALL=C find . -type f ! -name '.DS_Store' -print \
      | LC_ALL=C sort \
      | zip -q -X "$archive" -@
  )
  unzip -tq "$archive" >/dev/null
  echo "Created ${archive#$ROOT/}"
done

(
  cd "$OUT"
  sha256sum ./*.zip > SHA256SUMS
)

echo "Checksums written to ${OUT#$ROOT/}/SHA256SUMS"

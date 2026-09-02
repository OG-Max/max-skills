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
  unzip -Z1 "$archive" | grep -qx 'SKILL.md' || {
    echo "$archive does not contain SKILL.md at its root" >&2
    exit 1
  }
  [[ -s "$archive" ]] || {
    echo "$archive is empty" >&2
    exit 1
  }
  echo "Created ${archive#$ROOT/}"
done

plugin_root="$ROOT/plugins/max-skills"
plugin_archive="$OUT/max-skills-plugin.zip"

[[ -f "$plugin_root/.codex-plugin/plugin.json" ]] || {
  echo "Plugin manifest is missing: $plugin_root/.codex-plugin/plugin.json" >&2
  exit 1
}

# The plugin is intentionally self-contained. Refuse to publish stale copies of
# the canonical category-based skills.
for skill_dir in "${skill_dirs[@]}"; do
  skill_name=${skill_dir##*/}
  bundled_skill="$plugin_root/skills/$skill_name"
  [[ -d "$bundled_skill" ]] || {
    echo "Plugin is missing bundled skill: $skill_name" >&2
    exit 1
  }
  diff -qr --exclude='.DS_Store' "$skill_dir" "$bundled_skill" >/dev/null || {
    echo "Plugin skill is out of sync with canonical source: $skill_name" >&2
    diff -qr --exclude='.DS_Store' "$skill_dir" "$bundled_skill" >&2 || true
    exit 1
  }
done

(
  cd "$plugin_root"
  LC_ALL=C find . -type f ! -name '.DS_Store' -print \
    | LC_ALL=C sort \
    | zip -q -X "$plugin_archive" -@
)
unzip -tq "$plugin_archive" >/dev/null
[[ -s "$plugin_archive" ]] || {
  echo "$plugin_archive is empty" >&2
  exit 1
}
unzip -Z1 "$plugin_archive" | grep -qx '.codex-plugin/plugin.json' || {
  echo "$plugin_archive does not contain .codex-plugin/plugin.json" >&2
  exit 1
}
for skill_dir in "${skill_dirs[@]}"; do
  skill_name=${skill_dir##*/}
  unzip -Z1 "$plugin_archive" | grep -qx "skills/$skill_name/SKILL.md" || {
    echo "$plugin_archive does not contain skills/$skill_name/SKILL.md" >&2
    exit 1
  }
done
echo "Created ${plugin_archive#$ROOT/}"

(
  cd "$OUT"
  sha256sum ./*.zip > SHA256SUMS
)

echo "Checksums written to ${OUT#$ROOT/}/SHA256SUMS"

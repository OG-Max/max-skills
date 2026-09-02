# Portability map

Use this map to choose a canonical destination. Runtime support changes over time, so inspect the target repository and current product documentation before relying on a tool-specific path.

| Cursor artifact | Portable destination | Conversion guidance |
| --- | --- | --- |
| `.cursor/rules/*.mdc` | Root or nested `AGENTS.md` | Keep only durable, scope-specific invariants. Translate globs into directory scope when practical. |
| `.cursor/commands/*.md` | `skills/<category>/<name>/SKILL.md` | Describe the trigger in frontmatter and make inputs explicit in the workflow. |
| `.cursor/skills/<name>/SKILL.md` | Canonical repository skill directory | Preserve valid Agent Skills structure; remove Cursor-only assumptions. |
| Specialist agent prompt | Skill workflow or delegation brief | Express responsibilities, evidence requirements, bounds, and completion criteria without assuming named-agent support. |
| Cursor plugin metadata | `agents/openai.yaml` plus repository catalog | Recreate user-facing metadata; do not copy unsupported manifest fields. |
| Repeated project context | Reference file linked from one skill | Load details only when needed instead of placing them in always-on instructions. |
| GitHub-specific PR or issue command | Forge-neutral workflow plus GitHub adapter | Keep when the detected remote is GitHub; provide a GitLab MR or issue equivalent for GitLab targets. |

## Recommended portable skill shape

```text
<name>/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/   # only when needed
├── scripts/      # deterministic helpers only
└── assets/       # files used in generated output only
```

`SKILL.md` frontmatter should contain only `name` and `description`. The OpenAI metadata file should quote strings and use a `default_prompt` that explicitly mentions `$<skill-name>`.

Do not create a portable copy for a source skill that Codex already supports natively without conversion. Record it as `native`, validate the existing file, and keep the patch minimal. Use [codex-compatibility.md](codex-compatibility.md) for the required per-artifact audit.

## Runtime notes

### Cursor

Retain `.cursor` adapters when the team uses Cursor. Avoid making the portable skill depend on Cursor-only UI features, implicit slash-command argument expansion, or proprietary placeholders.

### Codex

Install a skill into a discovered skills directory, commonly `~/.agents/skills` for a user or `.agents/skills` for a repository, then restart the client if required. Invoke explicitly with `$<skill-name>` when deterministic selection matters.

### ChatGPT

Keep the skill folder self-contained. Zip the folder itself so `SKILL.md` is at the archive's top level, then upload it through the product's custom-skill installation flow when that capability is available to the account or workspace. `agents/openai.yaml` provides presentation metadata, not application secrets or runtime configuration.

## Merge rules

When equivalent instructions already exist:

1. Prefer the artifact with the narrowest correct scope.
2. Prefer tested repository commands over prose examples.
3. Retain stricter safety requirements.
4. Replace duplicate text with a pointer to the canonical source.
5. Surface irreconcilable conflicts instead of silently choosing one.

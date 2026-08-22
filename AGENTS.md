# max-skills

This repository is an **Agent Skills collection** (same shape as [mattpocock/skills](https://github.com/mattpocock/skills)).

- Skills live at `skills/<category>/<name>/SKILL.md`.
- `name` in the YAML frontmatter must equal `<name>` (the parent directory).
- Categories today: `engineering`, `productivity`.
- Do not flatten skills to the repo root.
- `audit-your-codebase` is **read-only** against the *target* codebase: no edits, commits, or pushes.
- `eli5` writes a self-contained HTML picture book.
  - Grok Build: `/eli5 <topic>` — install to `~/.grok/skills/eli5` or `.grok/skills/eli5`.
  - Grok chat (web/iOS/Android): render slides in the reply; do not cite a disk path.
  - Codex: `$eli5 <topic>`.
  - Never leave `$ARGUMENTS` unexpanded.

When adding a skill, follow `README.md` → "Adding a skill" and run:

```bash
node scripts/validate-skill.mjs
npx --yes skills-ref validate ./skills/<category>/<name>
```

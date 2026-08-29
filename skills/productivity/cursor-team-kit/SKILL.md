---
name: cursor-team-kit
description: Audit, port, build, or update a repository's shared AI collaboration kit: project instructions, reusable skills, agent roles, team commands, GitHub or GitLab workflows, and onboarding guidance for Cursor, Codex, and ChatGPT. Use when a team wants to classify which Cursor capabilities Codex supports natively, translate only the unsupported pieces, standardize coding-agent behavior, remove conflicting AI instructions, or create a forge-neutral source of truth.
---

# Cursor Team Kit

Create a small, repository-native collaboration kit instead of scattering the same guidance across tools. Preserve useful Cursor behavior while expressing reusable workflows as portable Agent Skills.

## Operating principles

- Treat the repository as the source of truth; do not install files globally unless asked.
- Inspect before editing. Read existing agent instructions, skills, rules, prompts, commands, contribution docs, and tool configuration.
- Preserve intentional behavior. Translate concepts rather than mechanically renaming files.
- Audit every source artifact individually. Never claim that a plugin is compatible because one representative skill works.
- Prefer Codex-native capabilities over compatibility wrappers; do not port functionality Codex already provides.
- Keep always-loaded instructions short; move task-specific workflows into skills.
- Avoid copying the same prose into several tool-specific files. Link to one canonical file when the runtime supports it, or generate thin adapters.
- Do not overwrite team-owned configuration without showing the proposed merge or obtaining explicit approval.
- Never add secrets, personal paths, internal tokens, or machine-specific state.

## Workflow

### 1. Establish the requested scope

Determine whether the user wants an audit, a proposal, an implementation, or a migration. Confirm the target runtimes—Cursor, Codex, ChatGPT, or a combination—and whether repository-local or user-level installation is desired. Detect the Git forge from `git remote -v`; do not assume GitHub. If there is no remote or the result is ambiguous, ask whether the target is GitHub, GitLab, another forge, or local-only.

For a repository implementation, default to repository-local files. For a review-only request, stop after the plan and do not modify files.

### 2. Inventory existing guidance

Search for `AGENTS.md`, `SKILL.md`, `.cursor/rules`, `.cursor/commands`, `.cursor/skills`, `.agents/skills`, `.codex`, `.github/copilot-instructions.md`, `CLAUDE.md`, and contribution or architecture docs. Also inspect package scripts and CI checks that encode the real workflow.

Record for each artifact:

- its scope and intended runtime;
- the behavior it controls;
- whether it is canonical, duplicated, stale, or conflicting;
- any commands that must be verified rather than guessed.

Produce one inventory row per source rule, command, agent, skill, hook, MCP dependency, and manifest capability. Do not collapse multiple source skills into a single generic row. Include the source path so the audit is reproducible.

Read [references/portability-map.md](references/portability-map.md) when choosing destinations or converting Cursor-specific artifacts.
Read [references/codex-compatibility.md](references/codex-compatibility.md) before deciding whether an artifact needs conversion. Read [references/git-forges.md](references/git-forges.md) for any branch, issue, review, pull-request, merge-request, or CI workflow.
Read [references/skill-suitability.md](references/skill-suitability.md) when reviewing this collection itself or explaining which installed skill fits a user's scenario.

### 3. Classify native Codex support

Assign every inventory row exactly one status:

- **native** — Codex directly supports the behavior; retain canonical content but do not add a wrapper.
- **native-with-rewrite** — Codex supports the capability, but Cursor syntax or implicit context must be expressed in a Codex-native file.
- **portable-skill** — the workflow belongs in an Agent Skill and is not a built-in Codex behavior.
- **adapter-required** — a thin runtime or forge adapter is necessary.
- **unsupported** — the behavior cannot be preserved safely; document the gap and omit it.
- **not-applicable** — the source artifact has no value for the target repository.

For each row, include evidence, destination, required changes, GitHub/GitLab assumptions, and a validation method. Do not equate “Codex can follow Markdown” with native feature support.

### 4. Design the smallest useful kit

Separate content by loading frequency:

1. Put concise, repository-wide invariants in the root `AGENTS.md`.
2. Put directory-specific conventions in nested `AGENTS.md` files.
3. Put reusable, task-specific procedures in `skills/<category>/<name>/SKILL.md` or the repository's established skills directory.
4. Keep detailed schemas, examples, and long explanations in a skill's `references/` directory.
5. Keep runtime adapters thin and point them to the canonical guidance where possible.

For every proposed artifact, state its owner, trigger, scope, and validation command. Remove artifacts that merely restate another file.

### 5. Translate Cursor concepts

- Convert a broadly applicable Cursor rule into the appropriately scoped `AGENTS.md` section.
- Convert a task-specific rule, command, or prompt into a portable skill with valid YAML frontmatter.
- Convert specialist agent prompts into skill workflows or bounded delegation briefs; do not assume every runtime supports named subagents.
- Replace Cursor-only placeholders and implicit context with explicit input instructions. Never leave unresolved argument variables in generated files.
- Preserve Cursor adapters only when the team still uses Cursor.
- Replace GitHub-only terminology and commands with forge-neutral steps plus a GitHub or GitLab adapter. Use “change request” generically, “pull request” for GitHub, and “merge request” for GitLab.

When creating or updating a skill, ensure the frontmatter `name` matches its directory and make the `description` explain both capability and trigger conditions. Add `agents/openai.yaml` so Codex and ChatGPT can present the skill in their interfaces.

### 6. Implement safely

Follow all existing `AGENTS.md` files before editing. Prefer focused patches and retain unrelated configuration. If instructions conflict, apply the most specific in-scope instruction and report any ambiguity that cannot be resolved safely.

Update the repository's skill catalog or installation documentation if it has one. For ChatGPT distribution, make the skill directory self-contained so it can be zipped and uploaded; exclude repository history, caches, secrets, and unrelated files.

### 7. Validate

Run the repository's own checks. At minimum:

- parse every changed skill's YAML frontmatter;
- confirm each skill name matches its parent directory;
- verify every relative link from `SKILL.md` exists;
- search changed files for unresolved placeholders and machine-specific absolute paths;
- verify that GitLab projects do not require `gh`, GitHub APIs, `.github/` paths, or pull-request terminology in executable steps;
- verify that GitHub projects do not accidentally receive GitLab-only paths or `glab` commands;
- run the project's skill validator when present;
- inspect `git diff --check` and the final diff.

Do not claim cross-runtime compatibility solely because files exist. Distinguish structural validation from an actual installation or runtime test.

## Deliverable

Summarize:

- the canonical instruction and skill files created or changed;
- which Cursor behavior was retained, translated, or intentionally omitted;
- the per-artifact Codex compatibility table, including every source skill;
- a scenario-based recommendation for each resulting skill, including when not to invoke it;
- how Codex and ChatGPT users install or invoke each skill;
- GitHub and GitLab paths separately, including any forge-specific limitations;
- validation commands and results;
- remaining tool-specific limitations or decisions for the team.

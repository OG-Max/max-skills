# Skill suitability and scenarios

This file records the Codex suitability review for every skill currently shipped by `max-skills`. Re-run the review whenever a skill is added or its behavior changes.

## Summary

| Skill | Codex status | Suitable for Codex? | Git forge dependency |
| --- | --- | --- | --- |
| `audit-your-codebase` | native Agent Skill; optional delegation | Yes | None; works with GitHub, GitLab, another forge, or no remote |
| `eli5` | native Agent Skill with a Codex file-output adaptation | Yes | None |
| `cursor-team-kit` | portable workflow skill | Yes | Forge-neutral core with GitHub and GitLab adapters |

## `audit-your-codebase`

**Use it for:** a repository-wide, read-only review of state representation, data models, control flow, algorithms, subsystem boundaries, and ownership. Typical requests include “find invalid state combinations,” “inventory every subsystem,” and “identify material simplifications without editing code.”

**Codex diagnosis:** suitable. Codex natively reads repositories, searches files, follows scoped instructions, and can return cited findings. Delegation is an optional accelerator rather than a requirement; when subagents are unavailable or prohibited, the coordinator runs the same bounded reviews sequentially. The skill must remain read-only and must not open a GitHub PR or GitLab MR.

**Do not use it for:** implementing refactors, vulnerability scanning, performance profiling, dependency updates, or a small single-file bug.

## `eli5`

**Use it for:** explaining one topic as a visual, child-friendly picture book—for example DNS, Git rebase, database indexes, or why the sky appears blue.

**Codex diagnosis:** suitable after adaptation. Codex can create a self-contained HTML file, but it does not need Claude's Artifact panel or slash-command argument expansion. The skill therefore takes the topic directly from the user message and writes `eli5-<slug>.html` with inline CSS and SVG.

**Do not use it for:** detailed technical documentation, production UI, architecture audits, or an answer where the user asked for plain text only.

## `cursor-team-kit`

**Use it for:** auditing and migrating team AI configuration; deciding which Cursor rules or skills Codex already supports; converting Cursor commands into portable skills; consolidating duplicated instructions; or making a repository's agent workflow work on GitHub and GitLab.

**Codex diagnosis:** suitable as a portable workflow, not a Codex built-in. Codex natively supports `AGENTS.md` and Agent Skills, but it does not natively consume Cursor plugin manifests, `.mdc` activation metadata, or Cursor slash commands. The workflow must inventory every source artifact, preserve native capabilities without wrappers, and convert only the gaps.

**Do not use it for:** ordinary feature implementation, a general code review, or blindly copying a Cursor plugin without access to and verification of every source artifact.

## Review procedure for new skills

For each new skill, add a row and answer:

1. Is the capability built into Codex, or supplied by the skill?
2. Can Codex discover the folder and trigger it from the frontmatter description?
3. Does it depend on a proprietary command, UI panel, hook, named agent, MCP server, or unresolved placeholder?
4. Is delegation optional, with a sequential fallback?
5. Does it assume GitHub where GitLab or a self-hosted forge may be used?
6. What user request should invoke it, and what request should not?
7. What behavior test—separate from structural validation—demonstrates that it works?

Do not mark a skill suitable until all required dependencies and unsupported behaviors are disclosed.

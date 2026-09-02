# Codex compatibility audit

Use this reference to classify each source artifact. This is a capability matrix, not a substitute for inspecting the actual files in the requested version of `cursor-team-kit`.

## Required audit table

Create one row for every source artifact; do not sample or group distinct skills.

| Source path | Kind | Purpose | Codex status | Codex destination | Forge dependency | Evidence | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<exact path>` | rule / command / skill / agent / hook / MCP / manifest | `<behavior>` | native / native-with-rewrite / portable-skill / adapter-required / unsupported / not-applicable | `<path or built-in>` | none / GitHub / GitLab / both | `<why>` | `<test>` |

Count the source files and reconcile the count with the table before implementation. If the source cannot be read, report the audit as blocked rather than inventing names or behavior.

## Capability guidance

| Cursor concept | Codex support | Default decision |
| --- | --- | --- |
| Repository instructions | Native through scoped `AGENTS.md` files | Rewrite `.mdc` content into the correct `AGENTS.md` scope; preserve only useful instructions. |
| Agent Skills (`SKILL.md`) | Native when the skill follows the Agent Skills structure and is installed in a discovered location | Validate and retain; remove Cursor-only assumptions rather than wrapping it. |
| Explicit skill invocation | Native with `$skill-name` | Document the Codex invocation; do not preserve a Cursor slash command solely as an alias. |
| Cursor slash command | Not natively equivalent | Convert a reusable workflow to a skill and make all inputs explicit. |
| Cursor plugin manifest | Not a Codex installation format | Omit from the Codex package; represent OpenAI UI metadata in `agents/openai.yaml`. |
| Cursor-specific rule globs and activation metadata | Not directly portable | Map directory-scoped rules to nested `AGENTS.md`; put task triggers in skill descriptions. |
| Named specialist agent | Runtime-dependent, not guaranteed by a skill | Preserve the bounded role and output contract; do not require named-subagent support. |
| MCP tool dependency | Supported only when the target has that MCP server configured | Declare or document the dependency and provide a no-MCP path when feasible. |
| Hooks or automatic lifecycle actions | Do not assume equivalence | Replace with repository scripts or CI only when the behavior is safe and requested. |
| Artifact-panel or proprietary UI output | Not portable | Generate a normal file or inline response appropriate to the target client. |

## Native-support decision test

Call a capability **native** only when Codex can discover, invoke, and complete it without a compatibility file that imitates Cursor. Treat syntax conversion as **native-with-rewrite**. Treat a reusable domain workflow as **portable-skill**, even though Codex can execute the instructions, because the workflow is supplied by the skill rather than built into Codex.

## Review gates

Before declaring the port complete:

1. Reconcile every source rule, command, skill, agent, hook, MCP entry, and manifest capability with exactly one audit row.
2. Confirm that every `native` row has no redundant wrapper in the patch.
3. Confirm that every converted row links to its destination file.
4. Confirm that unsupported and omitted behavior is disclosed.
5. Run structural validators separately from behavior tests; do not report one as the other.

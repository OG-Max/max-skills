# Source

Adapted from Aaron Francis's public gist:

https://gist.github.com/aarondfrancis/8735edbe48532f97ee5ea818db4dbd47

Original title: *A read-only, agent-orchestrated codebase audit prompt for data structures, state modeling, algorithms, and ownership.*

The gist is a coordinator prompt. This repository packages it as an [Agent Skill](https://agentskills.io/specification) (`SKILL.md` + references + report template) so coding agents can load it with `npx skills add` / `gh skill install`.

Methodology and constraints (read-only, two findings per subsystem, coverage contract, audit-the-audit) follow the gist. Operational schema, anti-pattern table, and templates were added so the skill is installable and spec-validatable.

The gist itself does not declare a license; this packaging is Apache-2.0 (same as this repository).

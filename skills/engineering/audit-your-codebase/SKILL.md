---
name: audit-your-codebase
description: "Read-only, agent-orchestrated audit of a codebase for materially useful simplifications in data structures, state representation, control flow, algorithms, and ownership. Use when asked to audit a codebase, inventory subsystems, review architecture, find invalid states, simplify state machines, inspect ownership boundaries, fan out subsystem reviews, or run a DSA/data-model audit. Triggers on audit your codebase, codebase audit, subsystem inventory, ownership audit, state-machine audit, invalid combinations, discriminated union, scattered booleans, and read-only audit. Do not use to edit files, implement refactors, commit, or push."
license: Apache-2.0
compatibility: "Requires a coding agent with filesystem read, search, and optional subagent support. Read-only: do not edit, implement, commit, or push."
metadata:
  author: OG-Max
  version: "1.0.0"
  origin: "https://gist.github.com/aarondfrancis/8735edbe48532f97ee5ea818db4dbd47"
  source: "Adapted from Aaron Francis's public gist"
---

# Audit Your Codebase

A read-only, agent-orchestrated audit for **data structures, state representation, control flow, algorithms, and ownership**.

Adapted from [Aaron Francis's public gist](https://gist.github.com/aarondfrancis/8735edbe48532f97ee5ea818db4dbd47). Methodology is his; this file is the installable Agent Skill form.

You are the **coordinator**. Continue until every identifiable subsystem has been reviewed and the final audit is validated.

## Hard rules

This is an **audit-only** exercise.

- Do **not** edit files, implement recommendations, run mutating commands, commit, or push.
- Read-only inspection is allowed: list, read, search, git log/blame, test *discovery* (do not execute tests to "fix" anything).
- Do **not** force an abstraction. Prefer boring local code when it is already clear.
- Do **not** recommend changes solely for stylistic consistency, hypothetical extensibility, minor line-count reduction, or moving existing branching behind a new type.
- Do **not** assume a broad catch-all inventory row proves coverage.

If the user later asks you to implement a finding, that is a **different task**. Finish the audit first; leave the repository unchanged.

## Output artifacts

Write these as **conversation output** (and, only if the user explicitly asks for a file, as markdown they can save). Default filenames if asked to persist:

| Artifact | Purpose |
| --- | --- |
| Coverage contract | Subsystem inventory with IDs, boundaries, files, status |
| Findings ledger | Accepted, rejected, narrowed, and skipped items |
| Final audit | Ranked recommendations plus completeness checklist |

Use the schemas in [references/report-schema.md](references/report-schema.md). Use the section template in [assets/report-template.md](assets/report-template.md) for the final report.

## 1) Establish the coverage contract

Inspect the repository and inventory **every identifiable subsystem**.

Give each subsystem:

- a stable ID (`S001`, `S002`, …) and descriptive name
- an exact ownership boundary (what it owns, what it must not own)
- its key implementation files
- relevant public interfaces, major call sites, and tests
- a status: `queued` | `in_review` | `recommend` | `skip`

Include frontend, backend, shared infrastructure, platform bridges, generated-contract ownership, and test/tooling infrastructure **where materially relevant**.

Create one canonical scratchpad containing:

- the subsystem inventory
- confirmed opportunities
- explicit skip decisions
- cross-cutting patterns
- duplicates and superseded findings
- final priorities and dependencies
- an audit log (who reviewed what, when, verdict)

Treat this inventory as the **coverage contract**. A row named "the rest of the app" is not coverage.

### Inventory heuristics

Discover subsystems from:

1. top-level packages / crates / modules / apps
2. public APIs, routers, CLIs, and schema/contract directories
3. persistence, queues, caches, auth, and config
4. generated code vs. the code that owns generating it
5. test harnesses, fixtures, and developer tooling that encode domain rules

Split a candidate when two teams, two persistence models, or two public interfaces would reasonably change independently. Merge only when a split would duplicate the same types, invariants, and call graph.

## 2) Run bounded subsystem reviews

Use fresh, **read-only** agents where available. Give every worker **one** distinct subsystem with an exact, non-overlapping ownership boundary.

- Keep concurrency bounded to the number of lanes you can actively coordinate.
- Use **one** consolidated wait mechanism.
- Do not interrupt productive workers merely because they are slow.
- Close completed workers after harvesting their results.
- If subagents are unavailable, review subsystems sequentially with the same brief and the same isolation rules.

Each worker receives the brief in [references/worker-brief.md](references/worker-brief.md) (paste it; do not paraphrase away the constraints).

Look for:

- scattered booleans or nullable fields that permit invalid combinations and should become a state machine or discriminated union
- repeated assumptions about object shape that need a shared typed model
- duplicated branching that a small map, registry, reducer, or command model would remove
- unclear state or behavior ownership that a small module boundary would clarify
- repeated scans, transformations, or lookups where a more appropriate collection or index would materially simplify behavior
- lifecycle, concurrency, or async states whose representation permits stale or contradictory state

Return **at most two** opportunities. If nothing clearly meets the threshold, return `skip`.

For every recommendation, provide all eight fields from the worker brief (verdict, evidence, current complexity, proposed representation, smallest scope, regression risks, validation, confidence).

Reject worker output that is missing evidence with file and line references, that exceeds two findings, or that expands past its ownership boundary.

## 3) Validate and synthesize

Independently verify **every** finding against the current repository before accepting it.

- Re-read the cited files and lines. If the citation is wrong, reject or repair it.
- Reject, narrow, or demote recommendations that are vague, duplicate another finding, misunderstand intentional semantics, or merely relocate complexity.
- Record skips as **completed coverage**.
- Deduplicate overlapping findings and assign each accepted recommendation to **one** authoritative subsystem.
- Continue opening bounded review batches until every inventory row is complete.

Cross-cutting patterns belong in the scratchpad. They do not replace per-subsystem coverage.

Before promoting a finding, check it against [references/anti-patterns.md](references/anti-patterns.md). Over-abstraction is a failed audit, not a thorough one.

## 4) Audit the audit

Before finishing, run fresh independent passes for:

1. **Coverage** — missing subsystem boundaries
2. **Duplication** — ownership overlap between rows or findings
3. **Materiality** — over-abstraction, style-only, or hypothetical-extensibility items
4. **Schema completeness** — every required field present
5. **Priority** — dependency-aware ranking

If the coverage pass finds a real omission, add an **explicit** subsystem row and audit it. Do not hide it by broadening a previously completed boundary.

Rank final recommendations by concrete impact, confidence, implementation effort, blast radius, and prerequisites. Identify the best first implementation slices — still without implementing them.

## Completion criteria

The audit is complete **only** when all of the following are true:

- every identifiable subsystem has been reviewed
- every subsystem has a recommendation **or** an explicit skip
- every finding has complete evidence, scope, risk, and validation fields
- duplicates and weak abstractions have been removed
- priorities and dependencies are internally consistent
- the repository remains unchanged

Do not claim completion with open `queued` or `in_review` rows.

## Coordinator workflow (operational)

```
1. Map the repo → draft inventory (status: queued)
2. Freeze ownership boundaries; resolve overlaps before dispatch
3. Dispatch a bounded batch of workers (one subsystem each)
4. Harvest → verify citations → accept / narrow / reject / skip
5. Repeat 3–4 until inventory is empty of queued rows
6. Run the five meta-passes in section 4
7. If a new subsystem appears, add a row and return to 3
8. Emit the final ranked report
9. Confirm git status / working tree is unchanged
```

### Status machine

`queued` → `in_review` → (`recommend` | `skip`)

`recommend` means "at least one accepted finding lives here." A subsystem may still be `skip` after a worker proposed items that the coordinator rejected.

## What "materially useful" means

A finding is material when adopting it would:

- make an invalid state unrepresentable, or
- collapse duplicated branching into a single obvious model, or
- clarify a real ownership fight (who mutates what, who is source of truth), or
- replace a repeated scan/transform with a collection that matches access patterns

A finding is **not** material when it is a rename, a folder move, a new framework, a "might need this later" hook, or a type wrapper around unchanged logic.

## When not to use this skill

- The user wants a security review, performance profile, or dependency CVE scan (different scope).
- The user wants you to **implement** simplifications now (use a refactor skill after the audit).
- The change is a single file or a few-line bugfix (just read that code; do not fan out agents).
- The repository is a generated dump with no owned source (say so and stop).

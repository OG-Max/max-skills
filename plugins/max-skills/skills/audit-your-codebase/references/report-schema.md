# Report schema

The coordinator's canonical scratchpad and final audit must be reconstructible from these fields. Missing fields mean the audit is not complete.

## Subsystem row

```yaml
id: S001
name: Auth session
boundary: >
  Owns session cookie minting, refresh, and logout.
  Does not own user profile fields or OAuth provider adapters.
files:
  implementation: []
  interfaces: []
  call_sites: []
  tests: []
status: queued | in_review | recommend | skip
reviewer: coordinator | worker-<n>
skip_reason: null | string
findings: []          # finding IDs owned by this row
```

## Finding

```yaml
id: F001
subsystem: S001
verdict: recommend | rejected | narrowed | superseded
title: string
evidence:
  - path: src/auth/session.ts
    lines: "88-141"
    note: three booleans allow signed-in + expired + anonymous
current_complexity: string
proposed_representation: string
scope:
  files: []
  interfaces: []
risks: string
validation:
  existing: []
  additional: []
confidence: high | medium | low
authoritative_owner: S001
supersedes: []
depends_on: []        # other finding IDs that must land first
```

## Final ranking fields

Every accepted finding also needs:

| Field | Meaning |
| --- | --- |
| `impact` | What becomes simpler or newly unrepresentable |
| `effort` | smallest / moderate / large |
| `blast_radius` | modules/callers that must change |
| `prerequisites` | findings or migrations that must precede it |
| `first_slice` | the smallest change that proves the new model |

## Audit log entry

```text
[batch 2] S014 Billing invoices → worker-3 → 1 recommend, 1 skip-candidate
[verify] F012 citation src/billing/invoice.ts:40-77 confirmed
[reject] F018 style-only rename of InvoiceDTO
```

## Completeness checklist (required in the final report)

Copy and tick:

- [ ] Every identifiable subsystem has a row
- [ ] No catch-all row is standing in for unreviewed code
- [ ] Every row is `recommend` or `skip` (none `queued` / `in_review`)
- [ ] Every finding has all eight worker fields
- [ ] Citations were independently re-read
- [ ] Duplicates merged; each finding has one owner
- [ ] Weak / over-abstracted items removed
- [ ] Priorities and `depends_on` are acyclic
- [ ] Working tree unchanged

# Anti-patterns (reject or demote)

Use this list in the coordinator's verify pass and in the "audit the audit" materiality pass.

## Instant reject

| Pattern | Why it fails this audit |
| --- | --- |
| Rename-only, import reorder, formatter, folder move | No representation change |
| "Extract an interface for testability" with one production impl | Hypothetical extensibility |
| New framework / EventBus / DI container to hide today's `if`s | Relocates complexity |
| Wrap unchanged logic in a type alias or empty facade | Line-count theater |
| "We might need this for v2" | Not grounded in current call sites |
| Finding with no `path:line` evidence | Unverifiable |
| Third+ finding from one worker | Violates the two-finding cap; keep the best two or skip |
| Worker expanded into another subsystem's files as if it owned them | Boundary violation |

## Usually demote to skip or note

- Duplicated branching that is already a 3-arm `switch` on a sealed type
- A map/registry that would replace two call sites
- "Make this a state machine" when the object has one live boolean and no illegal combo
- Ownership notes that only restate the directory tree
- Algorithmic Big-O remarks with no simpler collection that matches real access patterns (this skill is not a perf profiler)

## Chesterton's fence

If the "invalid" combination is load-bearing (protocol compat, wire format, gradual migration, a feature flag that is the state machine), **keep it**. Record the intentional semantics in the skip reason so a later reviewer does not rediscover it.

## Over-abstraction test

Ask of every `recommend`:

1. Can a new teammate construct an illegal state **without** the change, and **not** with it?
2. Does the proposal delete branching, or only rename it?
3. Is the new module the **smallest** owner, or a new dumping ground?

If (1) is no and (2) is "only rename it," reject.

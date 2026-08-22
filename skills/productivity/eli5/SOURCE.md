# Source

Adapted from Anthropic's community plugin **eli5**, added by Thariq Shihipar (`@trq212` / ThariqS):

- Plugin: https://github.com/anthropics/claude-plugins-community/tree/main/eli5
- Skill: https://github.com/anthropics/claude-plugins-community/blob/main/eli5/skills/eli5/SKILL.md
- PR: https://github.com/anthropics/claude-plugins-community/pull/2372
- Original tweet: https://x.com/trq212/status/2090884854590382515

Original `SKILL.md` body (Claude Code):

```markdown
---
name: eli5
description: Explain a topic like I'm a 5 year old. Use when the user types /eli5 <topic> or asks for a dead-simple picture explainer of how something works.
---

# eli5

Explain like I'm someone who knows nothing about this topic, using a HTML artifact with big pictures and few words.

Topic: $ARGUMENTS
```

That prompt relies on two Claude Code features Codex does not have:

1. **`$ARGUMENTS`** — slash-command expansion of `/eli5 <topic>`. Codex invocation is `$eli5 <topic>`; the topic lives in the user message. Leaving `$ARGUMENTS` in the skill makes Codex explain the literal dollar-string.
2. **HTML artifacts** — an inline preview panel. Codex has none. The port writes a single self-contained `.html` file instead.

Visual rules and the output contract were added so a coding agent produces a picture book instead of a README or a React app. The spirit of the original three-line prompt is unchanged.

Original plugin license is MIT (see `plugin.json` in the upstream folder). This packaging is MIT for the `eli5` skill files. The rest of `max-skills` remains Apache-2.0.

Not affiliated with Anthropic.

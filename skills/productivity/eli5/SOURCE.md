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

That prompt relies on two Claude Code features **Grok and Codex do not have**:

1. **`$ARGUMENTS`** — slash-command expansion of `/eli5 <topic>`. Codex invocation is `$eli5 <topic>`; the topic lives in the user message. Leaving `$ARGUMENTS` in the skill makes Codex explain the literal dollar-string.
2. **HTML artifacts** — an inline preview panel. Codex has none. The port writes a single self-contained `.html` file instead.

Visual rules and the output contract were added so a coding agent produces a picture book instead of a README or a React app. The spirit of the original three-line prompt is unchanged.

Grok support (Build CLI + Grok Skills on web/iOS/Android) adds:

1. Slash command `/eli5` — Grok marks user-invocable skills as slash commands by default (`/<skill-name>`). Spec-valid frontmatter cannot carry Grok-only keys (`when-to-use`, `argument-hint`); those live in the description, `metadata.short-description`, and `references/runtimes.md`.
2. Install paths `~/.grok/skills/` and `.grok/skills/` (Grok also reads `~/.agents/skills/` and Claude plugins).
3. A chat runtime: Grok on a phone has no folder to open, so the skill must render slides in the reply instead of only writing a path.


Original plugin license is MIT (see `plugin.json` in the upstream folder). This packaging is MIT for the `eli5` skill files. The rest of `max-skills` remains Apache-2.0.

Not affiliated with Anthropic.

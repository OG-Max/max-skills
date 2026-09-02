# Runtimes

Same picture book. Different delivery.

## Detect, don't guess

| You are here | How you can tell | Deliver |
| --- | --- | --- |
| **Grok Build CLI** | Project has `.grok/`, user invoked `/eli5`, tools write to a git repo | Write `eli5-<slug>.html`. Grok slash command is `/eli5 [topic]`. |
| **Grok Skills / Grok chat** (web, iOS, Android) | Chat product, no repo, no user-visible working directory | Attach HTML if the product allows file output. **Always** render the slides in the reply. Do not cite a disk path. |
| **Codex** | User invoked `$eli5`, skills live under `.agents/skills` or `~/.agents/skills` | Write `eli5-<slug>.html`. Invocation is `$eli5 [topic]`. |
| **Claude Code** | User invoked `/eli5`, Artifact UI exists | Prefer an HTML artifact. Also fine to write `eli5-<slug>.html`. Do not leave `Topic: $ARGUMENTS` unexpanded — take the topic from the message. |

## Grok specifics

- Install: `~/.grok/skills/eli5/` (user) or `.grok/skills/eli5/` (repo). Grok also reads `~/.agents/skills/` and Claude plugins with no extra config.
- Invoke: `/eli5 how DNS works` (slash command; `user-invocable` defaults on).
- Autocomplete hint: `[topic]`.
- Grok chat is the iOS/web app. The user cannot open `/workspace` or `cwd`. A sentence like "saved to eli5-dns.html" with no attachment is a failed run.
- In chat, each slide is a huge heading + one inline SVG (or a fenced `html` block only if this product renders it). Keep ≤12 words per slide.

## Hard no (every runtime)

- Scaffolding an app to "host" the explainer
- Starting a preview server
- Asking the user to run commands or paste logs

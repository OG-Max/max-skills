---
name: eli5
description: "Explain a topic like I'm 5 as a self-contained HTML picture book with giant pictures and almost no words. Use when the user types $eli5 <topic>, /eli5 <topic>, eli5 <topic>, or asks for a dead-simple picture explainer of how something works. Works in Grok (Build CLI and Grok Skills on web/iOS/Android), Codex, and Claude Code. Do not use for production code, audits, or detailed technical documentation."
license: MIT
compatibility: "Grok Build, Grok Skills, Codex, Claude Code, and any agent that can write HTML or render it in chat. Coding CLIs write a local .html file. Grok chat has no user-visible folder — render the picture book in the reply and attach HTML if the product allows."
metadata:
  author: OG-Max
  version: "1.1.0"
  short-description: "Picture-book explainer: big pictures, few words."
  origin: "https://github.com/anthropics/claude-plugins-community/tree/main/eli5"
  source: "Adapted from Anthropic community plugin eli5 by Thariq Shihipar"
---

# eli5

Explain like I'm someone who knows nothing about this topic, using a **self-contained HTML picture book** with big pictures and few words.

Port of Anthropic's community `/eli5` skill ([source](https://github.com/anthropics/claude-plugins-community/tree/main/eli5)) for **Grok, Codex, and Claude Code**.

Claude Code can paint an Artifact. Codex and Grok Build should **write an `.html` file**. Grok on web/iOS/Android has no folder the user can open — **show the book in the reply**.

Read [references/runtimes.md](references/runtimes.md) for the environment fork, then [references/visual-rules.md](references/visual-rules.md) before you write a tag.

## Topic

The topic is whatever the user asked you to explain.

| User said | Topic |
| --- | --- |
| `/eli5 how DNS works` | how DNS works |
| `$eli5 how DNS works` | how DNS works |
| `eli5 git rebase` | git rebase |
| `explain git rebase like I'm 5` | git rebase |

Do **not** look for a `$ARGUMENTS` placeholder. That is Claude Code slash-command syntax. Grok and Codex will not expand it. If you print the literal string `$ARGUMENTS`, you failed.

If there is no topic, ask for one in a single short sentence, then stop.

## Output contract

Same picture book everywhere. Delivery changes by runtime (see runtimes.md):

1. **One** self-contained HTML document: inline CSS + inline SVG, **zero** network requests.
2. **No** npm, bundler, framework, React app, or dev server.
3. **No** markdown essay, README, or PDF as the main deliverable.
4. Coding CLI (Grok Build, Codex, Claude Code): write `eli5-<slug>.html` in the working directory (or a path the user named). One-line path after. Open a browser only if a browser tool is already available. Do not start a server.
5. **Grok chat / Grok Skills (web, iOS, Android):** do not stop at a filesystem path. Attach the HTML if you can. Always paint the 5–8 slides **in the reply**. Never mention localhost, cwd, or "open this on your machine."

## Spirit (keep this)

The original skill is three lines on purpose:

> Explain like I'm someone who knows nothing about this topic, using a HTML artifact with big pictures and few words.

A 5-year-old should follow the pictures. If a section needs a paragraph, the picture is too weak — redraw it.

## Voice

- Same language the user used.
- Short labels. Almost no sentences.
- Kid-level analogies. No jargon unless the jargon *is* the topic, and then you draw it.

## Done when

Someone who knows nothing about the topic can follow it from the pictures alone — as a file they can open, or as slides they can see in this chat.

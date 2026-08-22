---
name: eli5
description: "Explain a topic like I'm 5 as a self-contained HTML picture book with giant pictures and almost no words. Use when the user types $eli5 <topic>, /eli5 <topic>, eli5 <topic>, or asks for a dead-simple picture explainer of how something works. Do not use for production code, audits, or detailed technical documentation."
license: MIT
compatibility: "Any coding agent that can write a local HTML file. Codex has no Claude Artifact panel — write a .html file and do not call an artifacts API."
metadata:
  author: OG-Max
  version: "1.0.0"
  origin: "https://github.com/anthropics/claude-plugins-community/tree/main/eli5"
  source: "Adapted from Anthropic community plugin eli5 by Thariq Shihipar"
---

# eli5

Explain like I'm someone who knows nothing about this topic, using a **self-contained HTML picture book** with big pictures and few words.

This is the Codex port of Anthropic's community `/eli5` skill ([source](https://github.com/anthropics/claude-plugins-community/tree/main/eli5)). Claude Code paints an Artifact. Codex (and every other agent without that panel) must **write an `.html` file**.

## Topic

The topic is whatever the user asked you to explain.

| User said | Topic |
| --- | --- |
| `$eli5 how DNS works` | how DNS works |
| `/eli5 how DNS works` | how DNS works |
| `explain git rebase like I'm 5` | git rebase |

Do **not** look for a `$ARGUMENTS` placeholder. That is Claude Code slash-command syntax. Codex will not expand it. If you print the literal string `$ARGUMENTS`, you failed.

If there is no topic, ask for one in a single short sentence, then stop.

## Output contract

1. Write **one** self-contained HTML file.
2. Default path: `eli5-<slug>.html` in the current working directory (use a path the user named if they named one).
3. **No** npm, bundler, framework, React app, Tailwind-as-a-project, or dev server.
4. **No** markdown essay, README, or PDF as the main deliverable.
5. Inline CSS + inline SVG (CSS shapes allowed). The page must look right with **zero** network requests.
6. After writing, tell the user the file path in one line. Open it in a browser only if a browser tool is already available. Do not start a server to "preview" it.

Then read [references/visual-rules.md](references/visual-rules.md) and follow it before you write a tag.

## Spirit (keep this)

The original skill is three lines on purpose:

> Explain like I'm someone who knows nothing about this topic, using a HTML artifact with big pictures and few words.

A 5-year-old should follow the pictures. If a section needs a paragraph, the picture is too weak — redraw it.

## Voice

- Same language the user used.
- Short labels. Almost no sentences.
- Kid-level analogies. No jargon unless the jargon *is* the topic, and then you draw it.

## Done when

The HTML file exists, it is a picture book (not a blog), and someone who knows nothing about the topic could follow it from the pictures alone.

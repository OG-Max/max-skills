# max-skills

[![Validate skills](https://github.com/OG-Max/max-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/OG-Max/max-skills/actions/workflows/validate.yml)

Agent skills for real engineering work. Small, composable, and valid against the [Agent Skills spec](https://agentskills.io/specification).

中文学习资料：[Skill 规格与逐项解读](docs/zh-CN/skills-guide.md)。该文档用中文说明仓库中每个 Skill 的触发场景、完整工作流、输出和限制。

This is a **collection**, not a process framework. Each folder under `skills/` is one skill. Install the ones you want. Hack them. Leave the rest.

Layout follows [mattpocock/skills](https://github.com/mattpocock/skills): categories under `skills/`, one directory per skill, `SKILL.md` as the entry point.

## Install

```bash
npx skills add OG-Max/max-skills
```

Browse first, or take a single skill:

```bash
npx skills add OG-Max/max-skills --list
npx skills add OG-Max/max-skills --skill audit-your-codebase
npx skills add OG-Max/max-skills --skill eli5
npx skills add OG-Max/max-skills --skill cursor-team-kit
```

<details>
<summary><strong>Claude Code</strong></summary>

```bash
# marketplace (managed plugin)
/plugin marketplace add OG-Max/max-skills
/plugin install max-skills@max-skills

# or copy editable files, same as other agents
npx skills add OG-Max/max-skills
```

</details>

<details>
<summary><strong>ChatGPT</strong></summary>

Zip an individual skill folder and upload it as a custom skill when custom skills are enabled for your account or workspace. Keep `SKILL.md` at the archive root:

```bash
npm run package
# Upload dist/cursor-team-kit.zip (or another archive from dist/).
```

The included `agents/openai.yaml` supplies the OpenAI-facing display name, description, and starter prompt.

</details>

<details>
<summary><strong>Grok Build</strong></summary>

Grok discovers skills from `~/.grok/skills/`, `.grok/skills/`, `~/.agents/skills/`, and Claude plugins (zero extra config).

```bash
npx skills add OG-Max/max-skills --skill eli5
# pick ~/.grok/skills (user) or .grok/skills (this repo)
```

Or copy:

```bash
cp -R max-skills/skills/productivity/eli5 ~/.grok/skills/eli5
```

Restart Grok Build, then:

```text
/eli5 how does DNS work
```

Grok also reads this repo as a Claude-compatible plugin:

```text
/plugin marketplace add OG-Max/max-skills
/plugin install max-skills@max-skills
```

</details>

<details>
<summary><strong>Grok Skills (web, iOS, Android)</strong></summary>

Zip the folder `skills/productivity/eli5/` and upload it as a custom skill, or tell Grok to install from this GitHub path. Invoke with `/eli5 <topic>` or "explain X like I'm 5".

On a phone there is no folder to open. The skill paints the picture book **in the chat** and attaches HTML when the product allows. It must not reply with only a disk path.

</details>

<details>
<summary><strong>Codex, Cursor, Gemini, and others</strong></summary>

```bash
npx skills add OG-Max/max-skills
```

The installer asks which skills to copy and which agent directories to write (`~/.claude/skills`, `~/.grok/skills`, `~/.agents/skills`, `.cursor/skills`, …). Pull updates later with `npx skills update`.

**Codex:** pick `~/.agents/skills` (user) or `.agents/skills` (this repo). Restart Codex. Invoke with `$eli5 how does DNS work`.

Inside Codex you can also install from the GitHub folder:

```text
$skill-installer install https://github.com/OG-Max/max-skills/tree/main/skills/productivity/eli5
```

</details>

<details>
<summary><strong>Manual</strong></summary>

```bash
git clone https://github.com/OG-Max/max-skills.git
cp -R max-skills/skills/engineering/audit-your-codebase ~/.claude/skills/
cp -R max-skills/skills/productivity/eli5 ~/.grok/skills/eli5
cp -R max-skills/skills/productivity/eli5 ~/.agents/skills/eli5
```

</details>

Then, in a repo:

> Audit this codebase for simplifications in data structures, state, algorithms, and ownership. Read-only.

Or explain something like you're five:

```text
/eli5 how does DNS work      # Grok Build, Claude Code, Grok Skills
$eli5 how does DNS work      # Codex
```

## Skills

### Engineering — model-invoked

Triggered when the request matches the skill description. You can also invoke them by name.

| Skill | Use when |
| --- | --- |
| [audit-your-codebase](skills/engineering/audit-your-codebase/SKILL.md) | Read-only, agent-orchestrated audit of data structures, state representation, control flow, algorithms, and ownership. Inventories every subsystem, fans out bounded reviewers (max two material findings each), verifies citations, then audits the audit. Does **not** edit, implement, commit, or push. |

### Engineering — user-invoked

None yet.

### Productivity — user-invoked

| Skill | Use when |
| --- | --- |
| [eli5](skills/productivity/eli5/SKILL.md) | Dead-simple picture explainer. Grok: `/eli5 <topic>`. Codex: `$eli5 <topic>`. Claude: `/eli5 <topic>`. Picture book with big pictures and few words. On Grok chat the slides render in the reply. |
| [cursor-team-kit](skills/productivity/cursor-team-kit/SKILL.md) | Audit every Cursor team-kit artifact, reuse what Codex supports natively, and port only the gaps into a repository-native kit with GitHub and GitLab workflows. |

### Codex suitability and usage scenarios

| Skill | Codex suitability | Use it when | Do not use it when |
| --- | --- | --- | --- |
| `audit-your-codebase` | Native Agent Skill; subagents are optional and have a sequential fallback. Forge-independent. | You need a read-only, repository-wide audit of data models, invalid states, subsystem ownership, control flow, or material simplifications. | You want edits, a security scan, performance profiling, dependency updates, or a tiny bug fix. |
| `eli5` | Native Agent Skill with Codex-specific self-contained HTML output; no Artifact panel or slash-argument expansion required. | You want a visual, child-friendly explanation of one topic, such as DNS or Git rebase. | You want production UI, detailed documentation, a code audit, or plain text only. |
| `cursor-team-kit` | Portable workflow Skill; Codex natively covers `AGENTS.md` and Agent Skills, while Cursor manifests, `.mdc` metadata, and slash commands require assessment or conversion. | You need to audit or migrate team AI configuration, avoid redundant ports, or support both GitHub PR and GitLab MR workflows. | You are implementing an ordinary feature or cannot inspect the source plugin artifacts. |

The detailed assessment and the checklist used for future skills live in [`skill-suitability.md`](skills/productivity/cursor-team-kit/references/skill-suitability.md). GitLab support includes public and self-hosted instances, `glab mr create`, GitLab CI awareness, and a normal-Git fallback when no forge CLI is available.

## What `audit-your-codebase` does

Adapted from [Aaron Francis's gist](https://gist.github.com/aarondfrancis/8735edbe48532f97ee5ea818db4dbd47).

1. **Coverage contract** — every subsystem gets a stable ID, ownership boundary, files, interfaces, tests, and a status.
2. **Bounded reviews** — one subsystem per worker, at most two findings, or an explicit `skip`.
3. **Verify** — coordinator re-reads every `path:line` citation; rejects style-only and over-abstraction.
4. **Audit the audit** — coverage, duplication, materiality, schema, priority.

Done only when every row is `recommend` or `skip`, every finding has full evidence/scope/risk/validation, and the working tree is unchanged.

## What `eli5` does

Adapted from [Anthropic's community plugin](https://github.com/anthropics/claude-plugins-community/tree/main/eli5) (Thariq Shihipar).

Claude Code's original skill is three lines plus `Topic: $ARGUMENTS` and an HTML **artifact**. Grok and Codex have neither slash-argument expansion nor Claude's Artifact panel, so this port:

1. Takes the topic from the user message (`/eli5 how DNS works` or `$eli5 how DNS works` → `how DNS works`). Never prints the literal `$ARGUMENTS`.
2. On **Grok Build / Codex / Claude Code**, writes **one** self-contained `eli5-<slug>.html` file — inline CSS + inline SVG, zero network requests.
3. On **Grok chat** (web, iOS, Android), paints the same picture book **in the reply** and attaches HTML when possible. Never cites a disk path the user cannot open.
4. Follows picture-book visual rules (5–8 huge slides, ≤12 words each). No README, no React app, no dev server.

```text
/eli5 how does DNS work
```

## Layout

```text
max-skills/
├── skills/
│   ├── engineering/           # code-focused skills
│   │   └── audit-your-codebase/
│   │       ├── SKILL.md       # required: frontmatter + coordinator playbook
│   │       ├── SOURCE.md
│   │       ├── references/    # loaded on demand
│   │       └── assets/        # report template
│   └── productivity/
│       └── eli5/              # ELI5 picture book (Grok + Codex + Claude)
│           ├── SKILL.md
│           ├── SOURCE.md
│           ├── agents/openai.yaml
│           └── references/
│               ├── visual-rules.md
│               └── runtimes.md
├── scripts/validate-skill.mjs
├── .github/workflows/validate.yml
├── .claude-plugin/plugin.json
├── AGENTS.md
└── README.md
```

`name:` in each `SKILL.md` **must** match its directory name (`audit-your-codebase`). That is an [agentskills.io](https://agentskills.io/specification) rule.

## Verify

CI on every push walks `skills/**/SKILL.md` and runs three independent checks:

1. `node scripts/validate-skill.mjs` — frontmatter, name↔directory, description length, referenced files
2. `npx skills-ref validate` — official spec library
3. [validate-skill](https://github.com/Flash-Brew-Digital/validate-skill) GitHub Action

```bash
node scripts/validate-skill.mjs
npx --yes skills-ref validate ./skills/engineering/audit-your-codebase
npx --yes skills-ref validate ./skills/productivity/eli5
npx --yes skills-ref validate ./skills/productivity/cursor-team-kit
npm run package
```

`npm run package` validates every generated ZIP and writes one self-contained
archive per skill plus `dist/SHA256SUMS`. Pull-request CI uploads the complete
`dist/` directory as the `max-skills` workflow artifact, so packages can be
downloaded without cloning the repository.

A green badge means the published skills still satisfy the spec.

## Adding a skill

1. Create `skills/<engineering|productivity>/<name>/SKILL.md`.
2. YAML frontmatter: `name` (matches the directory), `description` (what + when, ≤1024 chars).
3. Keep `SKILL.md` under ~500 lines; put extras in `references/` or `assets/`.
4. Run `node scripts/validate-skill.mjs` and `npx skills-ref validate ./skills/.../<name>`.
5. Link it in the catalog table above.

See [write-a-skill](https://github.com/mattpocock/skills) and the [Agent Skills spec](https://agentskills.io/specification).

## License

[Apache-2.0](LICENSE).

`audit-your-codebase` methodology is from [Aaron Francis](https://gist.github.com/aarondfrancis/8735edbe48532f97ee5ea818db4dbd47). This repo only packages it as a spec-valid skill. Not affiliated.

`eli5` is adapted from [anthropics/claude-plugins-community](https://github.com/anthropics/claude-plugins-community/tree/main/eli5) by Thariq Shihipar (MIT). Skill files under `skills/productivity/eli5/` stay MIT; the rest of this repo is Apache-2.0. Not affiliated with Anthropic.

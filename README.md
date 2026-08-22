# max-skills

[![Validate skills](https://github.com/OG-Max/max-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/OG-Max/max-skills/actions/workflows/validate.yml)

Agent skills for real engineering work. Small, composable, and valid against the [Agent Skills spec](https://agentskills.io/specification).

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
<summary><strong>Codex, Cursor, Gemini, and others</strong></summary>

```bash
npx skills add OG-Max/max-skills
```

The installer asks which skills to copy and which agent directories to write (`~/.claude/skills`, `~/.agents/skills`, `.agents/skills`, `.cursor/skills`, …). Pull updates later with `npx skills update`.

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
cp -R max-skills/skills/productivity/eli5 ~/.agents/skills/eli5
```

</details>

Then, in a repo:

> Audit this codebase for simplifications in data structures, state, algorithms, and ownership. Read-only.

Or, in Codex:

```text
$eli5 how does DNS work
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
| [eli5](skills/productivity/eli5/SKILL.md) | Dead-simple picture explainer. Codex: `$eli5 <topic>`. Writes a self-contained HTML picture book (big pictures, few words). Claude Code `/eli5` still works. |

## What `audit-your-codebase` does

Adapted from [Aaron Francis's gist](https://gist.github.com/aarondfrancis/8735edbe48532f97ee5ea818db4dbd47).

1. **Coverage contract** — every subsystem gets a stable ID, ownership boundary, files, interfaces, tests, and a status.
2. **Bounded reviews** — one subsystem per worker, at most two findings, or an explicit `skip`.
3. **Verify** — coordinator re-reads every `path:line` citation; rejects style-only and over-abstraction.
4. **Audit the audit** — coverage, duplication, materiality, schema, priority.

Done only when every row is `recommend` or `skip`, every finding has full evidence/scope/risk/validation, and the working tree is unchanged.

## What `eli5` does

Adapted from [Anthropic's community plugin](https://github.com/anthropics/claude-plugins-community/tree/main/eli5) (Thariq Shihipar).

Claude Code's original skill is three lines plus `Topic: $ARGUMENTS` and an HTML **artifact**. Codex has neither slash-argument expansion nor an Artifact panel, so this port:

1. Takes the topic from the user message (`$eli5 how DNS works` → `how DNS works`). Never prints the literal `$ARGUMENTS`.
2. Writes **one** self-contained `eli5-<slug>.html` file — inline CSS + inline SVG, zero network requests.
3. Follows picture-book visual rules (5–8 huge slides, ≤12 words each). No README, no React app, no dev server.

```text
$eli5 how does DNS work
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
│       └── eli5/              # Codex-ready ELI5 picture book
│           ├── SKILL.md
│           ├── SOURCE.md
│           ├── agents/openai.yaml
│           └── references/visual-rules.md
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
```

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

# max-skills 中文规格与学习指南

本文面向希望学习 Agent Skills、但阅读英文有困难的使用者。它逐项解释仓库当前发布的三个 Skill。运行时仍以各目录中的英文 `SKILL.md` 为唯一规范；本文是中文学习版，不应复制成第二份运行时 Skill，以免两个版本逐渐不一致。

## 先理解一个 Skill 的目录

```text
skills/<分类>/<名称>/
├── SKILL.md             # 必需；名称、触发描述和执行步骤
├── agents/openai.yaml   # Codex/ChatGPT 中展示的名称、简介和默认提示
├── references/          # 仅在需要时读取的详细规则
├── assets/              # 输出模板等素材
└── SOURCE.md            # 来源和改编说明
```

`SKILL.md` 顶部的 YAML frontmatter 至少包含：

- `name`：只能使用小写字母、数字和连字符，并且必须等于父目录名；
- `description`：说明“它能做什么”和“什么时候触发”；
- `license`、`compatibility`、`metadata`：可选的许可证、运行环境和来源信息。

Codex 通过 `$技能名 参数` 显式调用，例如 `$eli5 DNS 是怎样工作的`。模型也可以根据 `description` 自动选择 Skill。

---

## 1. audit-your-codebase：只读代码库审计

**目录：** `skills/engineering/audit-your-codebase/`

### 目标

在不修改目标仓库的前提下，系统检查数据结构、状态表达、控制流、算法和所有权边界，找出真正有价值的简化机会。它不是普通 code review，也不是自动重构工具。

### 适合使用的场景

- 盘点一个大型仓库的全部子系统；
- 查找多个布尔值或可空字段造成的非法状态；
- 判断状态机、判别联合或共享类型能否简化代码；
- 检查重复分支、重复扫描或错误的数据结构；
- 检查“谁能修改什么、谁是真实数据源”的所有权冲突；
- 对架构做完整、只读、带证据的审计。

### 不适合的场景

- 用户要求立即修改或重构代码；
- 安全审计、性能分析、CVE 或依赖升级；
- 单文件、几行代码的小 Bug；
- 没有项目自有源码、只有生成文件的仓库。

### 不可违反的规则

1. 不编辑文件，不执行会改变状态的命令，不提交，不推送。
2. 可以列目录、读取和搜索文件、查看 Git 历史或 blame；测试只能用于发现，不能为了修复而运行或改动。
3. 不为了风格一致、未来可能扩展或减少几行代码而强行抽象。
4. GitHub、GitLab、其他 forge 和没有 remote 的仓库同等支持；不能依赖 `gh`、`glab`、PR 或 MR。
5. 如果用户之后要求实现建议，应先结束本次审计，再作为新的任务处理。

### 完整工作流

#### 第一步：建立覆盖契约

识别每个可辨认的子系统，为其记录：

- 稳定编号，如 `S001`；
- 精确所有权边界，包括负责和不负责的内容；
- 关键实现文件、公开接口、主要调用点和测试；
- 状态：`queued`、`in_review`、`recommend` 或 `skip`。

发现子系统时应查看顶层包、模块、应用、API、路由、CLI、Schema、持久化、队列、缓存、鉴权、配置、生成代码、测试工具和开发工具。如果两部分会由不同团队独立变化，或有不同持久化模型、不同公开接口，应拆成不同子系统。

#### 第二步：对子系统做有边界的审查

运行环境允许时，可以给只读 worker/subagent 分配互不重叠的子系统；不允许委派时必须按相同规则顺序审查。并行只提高速度，不能成为正确性的前提。

每个子系统最多返回两个机会；没有足够重要的问题就明确返回 `skip`。重点查找：

- 能表达矛盾组合的散乱布尔值或可空字段；
- 对对象形状的重复假设；
- 可以由小型映射、注册表、reducer 或命令模型替代的重复分支；
- 模糊的状态或行为所有权；
- 与访问模式不匹配的重复扫描、转换和查找；
- 可能产生过期或矛盾状态的生命周期、并发和异步表达。

每项建议必须包括结论、文件与行号证据、当前复杂度、建议表达方式、最小改动范围、回归风险、验证方法和置信度。

#### 第三步：验证并综合

协调者必须重新阅读每一处引用，独立确认建议。错误引用、重复发现、误解既有语义、只移动复杂度或超出所有权边界的建议必须拒绝、缩小或降级。`skip` 也是已完成的覆盖结果。

#### 第四步：审计这次审计

结束前再做五轮检查：

1. 覆盖：是否漏掉子系统；
2. 重复：子系统或发现是否所有权重叠；
3. 重要性：是否存在过度抽象、纯风格或假设性扩展；
4. Schema 完整性：所有必需字段是否存在；
5. 优先级：排序是否考虑依赖、收益、风险和工作量。

如果发现遗漏，必须新增明确的子系统行并审计，不能偷偷扩大已完成子系统的边界。

### 完成条件和输出

只有所有子系统都变为 `recommend` 或 `skip`，所有证据、范围、风险与验证字段完整，重复和弱建议已删除，优先级与依赖一致，而且工作树未变化，审计才算完成。

默认在对话中输出覆盖契约、发现台账和最终排序报告。用户明确要求时，才写入 Markdown 文件。详细字段见 `references/report-schema.md`，worker 指令见 `references/worker-brief.md`，反模式见 `references/anti-patterns.md`，报告结构见 `assets/report-template.md`。

---

## 2. eli5：儿童图画书式解释器

**目录：** `skills/productivity/eli5/`

### 目标

把一个主题解释给完全不了解它的人，主要依靠巨大图片和极少文字，生成一份自包含 HTML 图画书。

### 触发方式

```text
$eli5 DNS 是怎样工作的        # Codex
/eli5 DNS 是怎样工作的        # Grok Build / Claude Code
eli5 git rebase
像给五岁孩子一样解释数据库索引
```

主题直接来自用户消息。不得查找或输出字面量 `$ARGUMENTS`；那是 Claude Code 的斜杠命令占位语法，Codex 和 Grok 不会自动展开。如果用户没有提供主题，只用一句短句询问主题，然后停止。

### 输出规格

1. 只生成一份自包含 HTML：CSS 和 SVG 全部内联，网络请求为零。
2. 不使用 npm、打包器、框架、React 或开发服务器。
3. 不把 Markdown 长文、README 或 PDF 当作主要交付物。
4. 在 Codex、Grok Build、Claude Code 等编码 CLI 中，写出 `eli5-<slug>.html`，随后只用一行告诉用户路径；仅在已有浏览器工具时打开，不启动服务器。
5. 在 Grok 网页、iOS 或 Android 聊天中，必须直接在回复里展示 5–8 张幻灯片；可以附加 HTML，但不能只给本地文件路径，也不能提 localhost 或 cwd。

### 视觉和语言规则

- 使用与用户相同的语言；
- 标签要短，句子极少；
- 使用儿童能理解的类比；
- 除非术语本身就是主题，否则避免术语；
- 读者应仅看图片就能理解流程；如果某一页需要一整段文字，应重新画图，而不是继续加字。

运行环境差异见 `references/runtimes.md`，具体画面规则见 `references/visual-rules.md`。当完全不了解主题的人能依靠图片看懂，并能打开文件或直接在聊天中看到幻灯片时，任务完成。

### 不适合的场景

- 生产级网页或 UI；
- 详细技术文档；
- 代码库审计或代码重构；
- 用户明确只要纯文本回答。

---

## 3. cursor-team-kit：团队 AI 配置迁移与治理

**目录：** `skills/productivity/cursor-team-kit/`

### 目标

审计、迁移、创建或更新仓库的共享 AI 协作配置，包括项目说明、Skills、agent 角色、团队命令、GitHub/GitLab 流程和入门材料。它不是 Cursor 插件运行时的复制品，而是把真正有用的行为转为仓库原生、跨工具的配置。

### 适合使用的场景

- 把 Cursor rules、commands、skills 或 agent prompts 迁移给 Codex/ChatGPT；
- 判断 Cursor 能力中哪些是 Codex 原生支持、哪些需要改写；
- 为团队统一 `AGENTS.md` 和可复用 Skills；
- 删除重复、冲突或过时的 AI 指令；
- 同时支持 GitHub PR 和 GitLab MR 工作流；
- 审计已有团队 AI kit，而不是盲目重新创建。

### 不适合的场景

- 普通功能开发或小型 Bug 修复；
- 无法读取源插件、源规则或源 Skill，却要求声称迁移完成；
- 只想复制文件名，不关心语义和运行时差异。

### 核心原则

- 仓库是事实来源，除非用户要求，否则不安装全局文件；
- 先检查再编辑，不机械重命名；
- 每个源规则、命令、agent、Skill、hook、MCP 依赖和 manifest 能力都要单独审计；
- Codex 已原生支持的能力不要再包装；
- 常驻指令保持简短，任务专用流程放入 Skill；
- 不覆盖团队配置，不写入密钥、个人路径、token 或机器状态；
- 运行时仍使用 Cursor 时才保留薄 Cursor adapter。

### 完整工作流

#### 1. 明确范围

先判断用户需要审计、方案、实现还是迁移，并确认目标是 Cursor、Codex、ChatGPT 或组合，以及仓库级还是用户级安装。通过 `git remote -v` 检测 forge；结果不明确时询问 GitHub、GitLab、其他 forge 或仅本地。只要求 review 时，输出方案后停止，不修改文件。

#### 2. 盘点现有说明

搜索 `AGENTS.md`、`SKILL.md`、`.cursor/rules`、`.cursor/commands`、`.cursor/skills`、`.agents/skills`、`.codex`、Copilot 指令、`CLAUDE.md`、贡献文档、架构文档、package scripts 和 CI。

每项记录作用域、目标运行时、控制行为、是否规范/重复/过时/冲突，以及需要真实验证的命令。不能用一个通用行合并多个源 Skill。

#### 3. 对每项判断 Codex 兼容性

每一行只能使用一个状态：

- `native`：Codex 原生支持，不创建包装；
- `native-with-rewrite`：能力原生支持，但必须改写 Cursor 语法或隐式上下文；
- `portable-skill`：应做成通用 Agent Skill；
- `adapter-required`：需要薄运行时或 forge adapter；
- `unsupported`：不能安全保留，应说明缺口并省略；
- `not-applicable`：对目标仓库没有价值。

每行还要给出证据、目标位置、改动、GitHub/GitLab 假设和验证方法。Codex 能阅读 Markdown，不等于它原生支持对应功能。

#### 4. 设计最小可用 kit

- 仓库级不变量放根 `AGENTS.md`；
- 目录特有规则放嵌套 `AGENTS.md`；
- 可复用任务流程放 `skills/<分类>/<名称>/SKILL.md`；
- 详细 Schema 和示例放 `references/`；
- adapter 保持很薄，并尽量指向唯一规范来源。

每个产物都说明 owner、触发条件、作用域和验证命令。删除只是重复另一文件的产物。

#### 5. 翻译 Cursor 概念

- 广泛适用的 rule 转为适当作用域的 `AGENTS.md`；
- 任务型 rule、command 或 prompt 转为合法 Skill；
- 专家 agent prompt 转为 Skill 流程或有边界的委派说明，不能假设所有运行时都有具名 subagent；
- 把 Cursor 占位符和隐式上下文改为显式输入，不遗留未展开变量；
- 使用“change request”作为中性说法，GitHub 用 PR，GitLab 用 MR；
- 为新 Skill 添加 `agents/openai.yaml`，让 Codex/ChatGPT 正确展示。

#### 6. 安全实现并验证

遵守所有适用的 `AGENTS.md`，保留无关配置。验证 frontmatter、目录名、相对链接、占位符、本机绝对路径以及 forge 专用命令。GitLab 项目不得错误依赖 `gh`、GitHub API 或 `.github/`；GitHub 项目不得意外获得 GitLab 专用路径或 `glab`。

ChatGPT 分发包必须自包含，不能包含 Git 历史、缓存、密钥或无关文件。不能只因为文件存在就声称跨运行时兼容；结构验证和真实安装测试必须分别报告。

### 最终交付

报告应包含：创建或修改的规范文件、保留/转换/省略的 Cursor 行为、逐项 Codex 兼容表、每个结果 Skill 的适用与禁用场景、Codex/ChatGPT 安装调用方式、GitHub 与 GitLab 的独立路径、验证结果和剩余限制。

转换位置详见 `references/portability-map.md`；Codex 判断详见 `references/codex-compatibility.md`；forge 差异详见 `references/git-forges.md`；本仓库 Skill 的适用性详见 `references/skill-suitability.md`。

---

## 三个 Skill 怎么选择

| 你的目标 | 应使用 | 原因 |
| --- | --- | --- |
| 全仓库寻找数据模型和所有权简化机会 | `audit-your-codebase` | 只读、全覆盖、证据驱动 |
| 把概念画成儿童能懂的 HTML 图画书 | `eli5` | 巨大图片、极少文字、跨运行时输出 |
| 迁移或治理 Cursor/Codex/ChatGPT 团队配置 | `cursor-team-kit` | 逐项兼容诊断和 GitHub/GitLab 适配 |
| 直接实现功能或修 Bug | 都不使用 | 这三个 Skill 都不是通用编码流程 |

## 学习时建议关注什么

1. `description` 同时写能力和触发条件，这是模型能否正确选择 Skill 的关键。
2. `SKILL.md` 只保留核心流程，细节按需放入 `references/`，避免每次都占用上下文。
3. 用明确完成条件代替“尽量做好”。
4. 对危险任务规定硬边界，例如审计 Skill 的绝对只读规则。
5. 为不同运行时写清楚输出分支，但不要复制整个 Skill。
6. 每一项兼容声明都要配证据和验证方法，不能把“能读 Markdown”当作功能兼容。

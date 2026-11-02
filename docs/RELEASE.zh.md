# 发行说明 — v0.17.0

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.md) | 中文

发行日期：2026-11-02

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云星空二次开发插件）发布 v0.17.0，这是一个**双版本线兼容版本**：构建仍钉定 `0.2.2-alpha.2`（本插件所对齐的 master 预览线），并额外针对 **0.2.1-rc.5** 完成验证 —— 后者是 npm 的 `latest` 标签、最新正式发布，也是桌面版实际内置的运行时。账套兼容性保持不变：金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x；**未进行真实账套联调验证**。

## 本版为何存在

DeepSeek Harness 同时维护两条线：`latest` 标签跟最新的节点版本发布，`alpha` 标签跟 master。撰写本文时 `latest` 是 `0.2.1-rc.5`（2026-10-29 发布），`alpha` 是 `0.2.2-alpha.2`（2026-10-27 发布）。从桌面版或 `latest` 安装 DSH 的用户实际跑的是 **rc.5**，而 0.16.0 只验证过 **alpha.2**。0.17.0 用一张明确的验证矩阵补上这个缺口，而不是假设一条线就等于另一条线。

## 变更

- **两条已验证版本线，同一份源码。** rc.5 线在一个独立环境中验证，钉定 `@deepseek-ai/dsh-*@0.2.1-rc.5`、`@deepseek-ai/cordis@4.0.5` 与 `@deepseek-ai/schemastery@3.18.5`。该环境的 `src/`、`test/`、`scripts/`、`locale/`、`skills/`、`docs/`、`.github/`、`cordis.patch.yml`、`tsconfig*.json` 与 `tsdown.config.ts` 与本仓库**逐字节相同**（已按文件哈希核对），因此这个结论描述的是本包本身，而不是它的某个变体。
- **依赖零改动：peer 区间本就覆盖两条线。** `cordis` 4.0.5 落在既有的 `^4.0.4` 区间内，`schemastery` 3.18.5 落在 `^3.18.4` 内，因此 0.16.0 所做的放宽（`^4.0.4 || ^4.0.6-alpha.1`、`^3.18.4 || ~3.18.6-alpha.1`）原封不动就容纳了 rc.5 那一对版本。`devDependencies` 仍钉在 `0.2.2-alpha.2`，因为清单只能声明一个构建基线。
- **源码改动：无。** `src/`、`test/`、`scripts/`、`.github/`、`skills/`、`cordis.patch.yml` 与构建配置下均无文件改动，配置字段也没有任何迁移：插件行为与 0.16.0 完全一致。
- **供应链豁免清单未动。** 工作区名单已对钉定的 alpha.2 包集合豁免；由于该名单由锁文件推导，而锁文件未变动，因此不需要新增 rc.5 条目。

## 已对照 0.2.1-rc.5 线核对（均确认为无影响）

从上次对齐的基线（`0.2.1-rc.2`）到 `0.2.1-rc.5` 共 19 个提交，其中恰有**两条**面向插件的升级指南。两者均已完整阅读：

- **空会话复用**（`v0.2.1-rc.2/new-session-blank-reuse`）—— Web 与桌面版的「新建会话」改为复用工作区中第一个未启动、未归档的空会话，而不是每次调用都新建 Agent。这属于 Web/桌面端的会话生命周期行为，不读取任何工具、凭据、设置卡片或 locale 接口。
- **Reasoning body 槽位**（`v0.2.1-rc.4/reasoning-body-props`）—— 向 `conversation.chat.reasoning.body` 的贡献现在通过新增的 `rawText` 字段拿到模型原始输出，`text` 则改为 Chat 预处理后的展示文本。本插件不注册 reasoning 渲染器，也不向 Chat 槽位投稿，因此这两个字段都触及不到它。

除升级指南外，逐接口的比对是**直接以 rc.5 构建**得出的，而不是读发布说明推断的：

- **工具注册。** `src/tools.ts` 中的 `defineTool({ … })` 加 `ctx.tools.register(definition)` 在 `dsh-tools@0.2.1-rc.5` 下照常编译；`DefineToolOptions` 与 `ToolDefinition` 仍保留必需的 `output.schema` / `render` 投影。
- **凭据接口。** `credentialRef()` 与 `ctx.credentials.resolve()` 的用法与之前完全一致；解析返回的 `{ value }` 形状未变。
- **Volatile 配置 schema。** `Schema.string().volatile()` 与整个 `Config` 对象在 `schemastery@3.18.5` + `cordis@4.0.5` 下仍通过类型检查，因此在 rc.5 线上「每次操作捕获一次配置」的契约同样成立。
- **设置卡片与 locale。** `ctx.configForms.get()`、`slots` 与 `remote` 在 `dsh-client-ui-settings@0.2.1-rc.5` 下编译通过；卡片单次调用的 `{ en, zh }` `LocaleRuntime.register()` 在 `dsh-client-locale@0.2.1-rc.5` 下也编译通过。
- **`dsh.client.inject` 清单。** 所列五个包（`dsh-client-locale`、`dsh-client-ui-settings`、`dsh-client-ui-plugin-manager`、`dsh-api-remotes`、`dsh-client-connection`）在 `0.2.1-rc.5` 上均照常发布且带 web 客户端 bundle，因此无需删除任何条目。

## 更新说明

- **安装命令**：`dsh plugin --profile web add dsh-kingdee@0.17.0` 装入 DSH profile，然后启用该行。
- **升级命令**：`dsh plugin --profile web update dsh-kingdee`；或执行 `dsh plugin --profile web add dsh-kingdee@0.17.0` 锁定版本。
- **环境要求**：harness `>=0.1.7-alpha.2 <0.3.0`，Node 22 或更新。
- **非强制升级**：`engines.dsh` 区间保持 `>=0.1.7-alpha.2 <0.3.0` 不变，因此 `dsh-kingdee@0.16.0` 与 `0.15.1` 在两条线上同样被准入。

## 验证

- rc.5 线（钉定 `0.2.1-rc.5` / `cordis` 4.0.5 / `schemastery` 3.18.5）：`npx tsc -p tsconfig.json --noEmit` 零错误、`npm run build` 构建干净、**15/15** 单元测试通过。
- alpha.2 线（钉定 `0.2.2-alpha.2` / `cordis` 4.0.6-alpha.1 / `schemastery` 3.18.6-alpha.1）：`npx tsc -p tsconfig.json --noEmit` 零错误、`npm run build` 构建干净、**15/15** 单元测试通过。
- `node scripts/check-docs-language.ts` 与结构/文字排版检查器在全部中英文档对上均为零发现。
- rc.5 环境的 `src/` 目录与本仓库逐文件哈希一致，因此两项结果描述的是同一份代码。
- 未验证项：在真实 rc.5 或 alpha.2 profile 中的实际启动；以及一如既往，未做真实金蝶账套联调。

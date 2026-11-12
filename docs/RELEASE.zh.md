# 发行说明 — v0.19.0

[英文](https://github.com/maxwell-feng/dsh-kingdee/blob/main/docs/RELEASE.md) | 中文

发布日期：2026-11-12

**dsh-kingdee**（面向 DeepSeek Harness 的金蝶云·星空二次开发插件）的**宿主基线版本**。构建基线由 **`0.2.2-rc.1`** 移至 **`0.2.2-rc.2`**（`next` 标签，2026-11-11 发布），并同时针对 **`0.2.2-rc.2`** 与 **`0.2.2-rc.1`**（`latest` 标签上的最新正式发布）完成验证。租户兼容性不变：金蝶云·星空 V9.1 企业版，向下兼容 V9.0 / V8.x。**既未做真实 profile 启动验证，也未做真实账套联调验证。**

## 本版存在的意义

DeepSeek Harness 同时维护两条 dist-tag：`latest` 跟踪最新正式发布，`next` 跟踪下一条产品线的候选发布。2026-11-11，`next` 前进到 `0.2.2-rc.2` —— 与 `0.2.2-rc.1` 同线的新一版候选。构建钉在 rc.1 的插件，比 `next` 用户实际安装的版本落后一档，因此 0.19.0 把构建基线移到 rc.2 并在该线上重跑全套检查，同时保留 rc.1 的验证，使停留在该标签上的用户仍被覆盖。

## 变更

- **构建基线移至 `0.2.2-rc.2`。** 全部 `@deepseek-ai/dsh-*` 开发依赖由 `0.2.2-rc.1` 移至 `0.2.2-rc.2`，锁文件按 rc.2 重新生成，`@deepseek-ai/cordis` 保持 `~4.1.0`，`@deepseek-ai/schemastery` 保持 `~3.19.0`。
- **peer 区间无需改动，这是审计结论而非疏漏。** `@deepseek-ai/cordis` 仍为 `^4.0.4 || ^4.0.6-alpha.1`，`@deepseek-ai/schemastery` 仍为 `^3.18.4 || ~3.18.6-alpha.1`，本就同时覆盖 rc.5 的（4.0.5 / 3.18.5）与 4.1.0 / 3.19.0 两对版本。两条线都不被排除，放宽区间只会暗示一个并不存在的破坏。
- **供应链豁免刷新。** 工作区清单将 rc.2 包集合排除在 pnpm 的最低发布年龄闸门之外；仍是单一、由锁文件派生的块。
- **源码无改动。** `src/`、`test/`、`scripts/`、`locale/`、`skills/`、`docs/`、`.github/`、`cordis.patch.yml`、`tsconfig*.json` 与 `tsdown.config.ts` 下无任何文件改动，也没有配置字段变动：插件行为与 0.18.0 完全一致。相对 0.18.0 的 `git diff --stat` 只列出 `package.json`、`pnpm-lock.yaml` 与 `pnpm-workspace.yaml`。

## 针对 0.2.2-rc.2 的核对（均确认无影响）

本次比对是基于本包实际消费的内容逐项核对，而非只读发布说明：

- **`dsh-credentials` 新增可选 `masked` 预览。** 凭据视图新增 `masked?: string` 及“完整凭据绝不会出现在其中”的说明。纯增量；插件只读取 `value`，无需迁移。
- **`dsh-tools` 新增结构化错误标识。** `ToolContextUnavailableError` 与拒绝结果上可选的 `ToolErrorInfo` 均为增量；`defineTool`、`ToolDefinition` 与 `ctx.tools.register` 未变，`kingdee_*` 工具照旧编译。
- **`dsh-client-ui-settings` 放宽 `openSettings`。** 现接受可选 `sectionId`；向后兼容，且卡片从不调用它。
- **`dsh-client-ui-slots` 新增 `hoc` slot 类型。** `SlotKind` 新增 `'hoc'` 与 `HocRenderOpts` 及相关渲染器说明；属增量，卡片仍注册其 `keyed` 的 `plugins.row.config` / `plugins.bundle.config` slot。
- **`dsh-api-remotes` 再导出更多 remote 类型模块。** 新增项（agent-team、mcp-manager、web、deepseek-account、office-kit）均为纯类型再导出；卡片使用的凭据域 `remote` 合并不变。
- **声明完全一致的包。** `dsh-client-locale`、`dsh-client-ui-renderer`、`dsh-client-ui-plugin-manager` 与 `dsh-util-values` 在 0.2.2-rc.1 与 0.2.2-rc.2 之间无声明变化。
- **rc.2 公布给宿主的破坏性变更都不会触及本插件。** 网页搜索默认改用 DeepSeek Search API、AgentTeam 改用具名子代理、插件可按语言扩展代码块渲染并动态注册 MCP、工具失败提供结构化错误类型与代码、会话支持批量追加事件、Office 改用原生工具、PTC 增加调用预算，且宿主最低 Node.js 维持 **24.9** —— 本包自有 `engines.node` 仍为 `>=22`，但在该宿主上实际要求 Node.js 24.9 或更新版本。这些都不涉及本插件所用的工具、凭据、设置卡片或 locale 接口。`src/kd-core/transport.ts` 的 HTTP 层与 `src/kd-core/security.ts` 的 SSRF 校验保持不变。

## 验证

- `node scripts/check-docs-language.ts` 通过，全部文档对无语言或切换器违规。
- `0.2.2-rc.2` 线（`cordis` 4.1.0 / `schemastery` 3.19.0）：`tsc -p tsconfig.json --noEmit` 干净、`npm run build` 干净、`npm test` 15/15 通过。
- `0.2.2-rc.1` 线（`cordis` 4.1.0 / `schemastery` 3.19.0）：同上三项检查干净，15/15 通过。
- 另对全部文档对逐项审计：表格列数错位、标题层级跳跃、列表编号断裂、未定义链接引用、中英标点混排、重复词，以及双语对之间的结构漂移，均为零发现。
- 未验证：真实 0.2.2-rc.2 或 0.2.2-rc.1 profile 的启动、宿主自身的插件兼容性检查（需要真实 profile），以及 —— 一如既往 —— 未做真实金蝶账套联调。

## 升级

执行 `dsh plugin --profile web add dsh-kingdee@0.19.0`，或让 profile 跟踪最新发行版即可。除此之外无需任何操作：配置字段、取值与默认值均未改动，且本版升级并非必需——0.18.0 在 `0.2.2-rc.2` 上本就加载正常，因为 `engines.dsh` 接纳整条 `0.2.x` 线。

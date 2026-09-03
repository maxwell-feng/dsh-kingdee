# 发行说明 — v0.2.4

发布日期：2026-09-03

**dsh-kingdee**（金蝶云星空二次开发插件）的第五个版本，已按官方插件开发文档适配 **deepseek-harness `0.1.2-rc.1`** 最新 `master`。

## 兼容性

- **Harness `0.1.2-rc.1`**：自 `0.1.2-alpha.5` 以来无影响本插件的 DSH 缝变更 —— `defineTool` / `ctx.credentials` / `ctx.settings` 及 WebAPI 传输保持稳定，行为无需迁移。
- **Compatibility (EN)**: Verified on `0.1.2-rc.1` latest `master`, no seam changes since `0.1.2-alpha.5`.

## 更新说明 / Update notes

- **升级**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.2.4`）。**Update**: `dsh plugin update dsh-kingdee`.
- **环境要求**：harness `0.1.2-rc.1`；Node ≥22。**Requirements**: harness `0.1.2-rc.1`, Node ≥22.
- **安装**：`dsh plugin add dsh-kingdee` —— bundle 补丁自动注册 `kingdee` loader 行。**Install**: the bundle patch self-registers the `kingdee` loader row.
- **卸载**：`dsh plugin remove dsh-kingdee`。**Uninstall**: `dsh plugin remove dsh-kingdee`.
- **使用**：在 **Plugins → kingdee** 设置卡片配置连接，设置凭据环境变量（`DSH_KINGDEE_USER` / `DSH_KINGDEE_PASSWORD` / `DSH_KINGDEE_APP_SECRET`），然后在会话中调用 `kingdee_*` 工具。**Usage**: configure the connection card, set the credential env vars, then call the `kingdee_*` tools in a session.
- **配置**：`baseUrl`、`acctId`、`authMode`（`user` | `app`）、`appId`、凭据引用（`appSecretRef` / `userNameRef` / `passwordRef`）、`organization`、`timeoutMs`、`mock`、可选 `serviceEndpoints`。**Config**: `baseUrl`, `acctId`, `authMode`, `appId`, credential refs, `organization`, `timeoutMs`, `mock`, optional `serviceEndpoints`.

## 亮点

- **对齐官方插件文档** —— 以 npm 上真实的 `0.1.2-rc.1` peer 包（`@deepseek-ai/dsh-tools`、`dsh-settings`、`dsh-credentials`、`cordis`、`schemastery`）替换 ambient `any` 声明：`typecheck` 从 43 个隐式 `any` 错误清零；`apply` 不再基于 `Context = any` 编译。
- **工具输出采用规范 `type: 'json'` schema** —— `execute` 返回 `Promise<JsonValue>`、`render` 接收校验后的值，与 `cordis_inspect_list`、`tool-workflow` 的官方写法一致。
- **设置卡片浏览器半侧可构建、可加载** —— 新增 `dsh.client` 清单（`platform: web`，注入 locale 与 client-settings 包）、`./client` 导出与自包含 `tsdown.config.ts`，按客户端模块系统 lazy-CJS factory 产物格式输出 `lib/client.js`；卡片绑定 `ctx.settingsScope`（命名空间 `kingdee`）、注册进 `settings.plugin.item` slot、注册自有 `settings.kingdee` 词典、自绘外观（通过 bundle 纯净门禁）。
- **修正 `installSection` 钩子用法** —— 按设置缝契约，`setSource` 接收返回权威配置的 thunk；设置页保存即刻影响下一次工具调用。
- **测试与构建** —— `kd-core` 单元测试 7/7 通过（Node ≥22）；构建同时产出 Node 半侧（tsc）与浏览器半侧（tsdown）。

## Highlights (EN)

- Real published peer types replace ambient `any` declarations; typecheck goes from 43 errors to 0.
- Tool outputs use the canonical `type: 'json'` schema with `execute` returning `Promise<JsonValue>`.
- The settings-card browser half now builds and loads via the `dsh.client` manifest and `tsdown.config.ts`.
- `installSection` hooks corrected: `setSource` receives a thunk, so edits reach the next tool call.

## 已知限制

- **平台插件层**（服务器端 C# 表单/列表插件、界面布局、后台事件）**不在** WebAPI 范围内，已在文档中明确边界。
- `./client` 产物遵循文档化的 factory 格式；共享的 `clientBundle` tsdown preset 位于 harness 仓库内部且未发布，本包自行复现该产物。

## 安装

详见 [INSTALL.zh.md](../INSTALL.zh.md)。升级与卸载见 [UPDATE.zh.md](../UPDATE.zh.md) 和 [UNINSTALL.zh.md](../UNINSTALL.zh.md)。

## 链接

- 主页：https://github.com/maxwell-feng/dsh-kingdee
- 变更日志：[CHANGELOG.md](../CHANGELOG.md)

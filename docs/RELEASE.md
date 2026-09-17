# Release notes — v0.8.0

Release date: 2026-09-18

Eleventh release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. Aligns with **DeepSeek Harness `0.1.6-alpha.2`** and its new Plugins Manager specification (`ui-plugin-manager`), while maintaining full conformance with **Kingdee Cloud Starry Sky V9.1 Enterprise Edition** (金蝶云·星空 V9.1 企业版, backward-compatible with V9.0 / V8.x).

## Compatibility / 兼容性

- **DeepSeek Harness `0.1.6-alpha.2`**: `pnpm run typecheck` clean, **15** unit tests passing (`pnpm test`), and the bundle patch applying as a `# == dsh-kingdee` layer when installed into a real `0.1.6-alpha.2` profile.
- **Kingdee Cloud Starry Sky V9.1 Enterprise Edition**: Full support for classic `kdservice-sessionid` sessions (request header + Cookie dual channels), third-party app login (`AuthService.LoginByAppSecret`), query pagination (`orderString`, `limit`, `startRow`), document numbers (`numbers`) for workflow actions, and auto-submit/audit (`isAutoSubmitAndAudit`). Backward-compatible with V9.0 / V8.x.
- **中文兼容性**：全面适配 DeepSeek Harness `0.1.6-alpha.2`；完整支持金蝶云·星空经典 `kdservice-sessionid` 会话（请求头 + Cookie 双通道）、第三方应用登录、游标分页与单据编号驱动；向下兼容 V9.0 / V8.x。已在 deepseek-harness `0.1.6-alpha.2` 上验证：`pnpm run typecheck` 零错误、**15** 项单元测试通过。

## Update notes / 更新说明

- **Update**: `dsh plugin update dsh-kingdee` (or `dsh plugin add dsh-kingdee@0.8.0`).
  **升级**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.8.0`）。
- **Requirements**: harness `^0.1.6-alpha.2`, Node ≥22.
  **环境要求**：harness `^0.1.6-alpha.2`，Node ≥22。
- **Client slot migration**: In DSH `0.1.6-alpha.2`, `settings.plugin.item` was retired. `dsh-kingdee` now registers into `plugins.row.config` (`dsh-kingdee#kingdee`) and `plugins.bundle.config` (`dsh-kingdee`), rendering a summary view under the header and an interactive form in page view.
  **客户端插槽迁移**：DSH `0.1.6-alpha.2` 废弃了 `settings.plugin.item`。`dsh-kingdee` 现接入 `plugins.row.config`（`dsh-kingdee#kingdee`）与 `plugins.bundle.config`（`dsh-kingdee`），支持 summary 紧凑摘要与 page 交互表单双视图。
- **Install**: `dsh plugin add dsh-kingdee` — bundle patch self-registers the `kingdee` loader row.
  **安装**：`dsh plugin add dsh-kingdee` —— bundle 补丁自动注册 `kingdee` loader 行。
- **Uninstall**: `dsh plugin remove dsh-kingdee`.
  **卸载**：`dsh plugin remove dsh-kingdee`。
- **Usage**: Configure the connection in the **Plugins → kingdee** configuration page, set the credential environment variables (`DSH_KINGDEE_USER` / `DSH_KINGDEE_PASSWORD` / `DSH_KINGDEE_APP_SECRET`), then invoke `kingdee_*` tools in chat sessions. See [USAGE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.8.0/USAGE.md) / [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.8.0/USAGE.zh.md).
  **使用**：在 **Plugins → kingdee** 配置页配置连接，配置凭据环境变量，然后在会话中调用 `kingdee_*` 工具。完整工具说明见 [USAGE.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.8.0/USAGE.zh.md)。

## Highlights

- **Plugin Manager Conformance** — fully adapted to DeepSeek Harness `0.1.6-alpha.2`'s dedicated Plugins manager page (`ui-plugin-manager`), registering into `plugins.row.config` and `plugins.bundle.config`.
- **Dual-View UI Rendering** — delivers concise summary copy in `view: 'summary'` and mounts the revision-fenced configuration card in `view: 'page'`.
- **Up-to-date Dependencies** — all `@deepseek-ai/dsh-*` peerDependencies and devDependencies bumped to `0.1.6-alpha.2`, `engines.dsh` set to `^0.1.6-alpha.2`.
- **Robust Verification** — 15 unit tests passing, 0 TypeScript compilation errors, clean tsdown client bundle.

## 亮点（中文）

- **全面对齐插件管理新规范** —— 深度适配 DeepSeek Harness `0.1.6-alpha.2` 全新独立的插件管理页面（`ui-plugin-manager`），规范接入 `plugins.row.config` 与 `plugins.bundle.config` 插槽。
- **双视图 UI 渲染支持** —— 在 `view: 'summary'` 下展示简短描述，在 `view: 'page'` 下提供带版本围栏保存能力的配置表单。
- **全量依赖更新** —— 所有 `@deepseek-ai/dsh-*` peer 依赖与开发依赖更新至 `0.1.6-alpha.2`，`engines.dsh` 锁定至 `^0.1.6-alpha.2`。
- **严格测试与构建** —— 15 项单元测试通过、TypeScript 类型检查零错误、tsdown 客户端 bundle 产物构建正常。

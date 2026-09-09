# Release notes — v0.3.0

Release date: 2026-09-09

Sixth release of **dsh-kingdee**, the Kingdee Cloud Starry Sky secondary-development plugin for DeepSeek Harness. Fully adapted to **deepseek-harness `0.1.5-alpha.1`** (latest `master`) per the official plugin development docs.

## Compatibility / 兼容性

- **Harness `0.1.5-alpha.1`**: Verified on `0.1.5-alpha.1` latest `master`. No breaking DSH seam changes affecting this plugin — `defineTool` / `ctx.credentials` / `ctx.settings` and the WebAPI transport remain stable.
- **中文兼容性**：已按官方规范全面适配并在 `0.1.5-alpha.1` 最新 `master` 上完成验证。核心运行时缝接口稳定兼容，无需行为迁移。

## Update notes / 更新说明

- **Update**: `dsh plugin update dsh-kingdee` (or `dsh plugin add dsh-kingdee@0.3.0`).
  **升级**：`dsh plugin update dsh-kingdee`（或 `dsh plugin add dsh-kingdee@0.3.0`）。
- **Requirements**: harness `0.1.5-alpha.1`, Node ≥22.
  **环境要求**：harness `0.1.5-alpha.1`，Node ≥22。
- **Install**: `dsh plugin add dsh-kingdee` — bundle patch self-registers the `kingdee` loader row.
  **安装**：`dsh plugin add dsh-kingdee` —— bundle 补丁自动注册 `kingdee` loader 行。
- **Uninstall**: `dsh plugin remove dsh-kingdee`.
  **卸载**：`dsh plugin remove dsh-kingdee`。
- **Usage**: Configure connection in the **Plugins → kingdee** settings card, set credential environment variables (`DSH_KINGDEE_USER` / `DSH_KINGDEE_PASSWORD` / `DSH_KINGDEE_APP_SECRET`), then invoke `kingdee_*` tools in chat sessions.
  **使用**：在 **Plugins → kingdee** 设置卡片配置连接，配置凭据环境变量，然后在会话中调用 `kingdee_*` 工具。
- **Config**: See [CONFIG.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/CONFIG.md) / [CONFIG.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/CONFIG.zh.md) for full configuration reference.
  **配置**：详细配置见 [CONFIG.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/CONFIG.zh.md)。支持 `baseUrl`、`acctId`、`authMode`（`user` | `app`）、`appId`、凭据引用、`organization`、`timeoutMs`、`mock`、可选 `serviceEndpoints`。

## Highlights

- **Full compatibility with DeepSeek Harness `0.1.5-alpha.1`** — devDependencies updated to `0.1.5-alpha.1`. Runtime seams (`defineTool`, `ctx.tools.register`, `ctx.credentials.resolve`, `ctx.settings.installSection`) verified.
- **Standalone bilingual configuration guide** — added [CONFIG.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/CONFIG.md) and [CONFIG.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/CONFIG.zh.md) covering all configuration keys, authentication modes, credential security, profile definitions, and UI settings card.
- **Refreshed all documentation** — installation, update, uninstall, and usage guides updated with latest version verification.
- **Robust test & build verification** — 7 unit tests passed, 0 type errors.

## 亮点（中文）

- **全面适配 DeepSeek Harness `0.1.5-alpha.1`** —— 将 `@deepseek-ai/dsh-*` devDependencies 统一升级至 `0.1.5-alpha.1`，核心运行时缝接口均经过严格验证。
- **新增独立双语配置说明文档** —— 提供独立的 [CONFIG.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/CONFIG.zh.md) 与 [CONFIG.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/CONFIG.md)，详尽说明各配置项、两种认证模式、环境变量注入和 Profile 配置。
- **文档体系全面同步** —— 更新使用说明（`README.md` / `README.zh.md`）、安装说明（`INSTALL.md` / `INSTALL.zh.md`）、升级说明（`UPDATE.md` / `UPDATE.zh.md`）和卸载说明（`UNINSTALL.md` / `UNINSTALL.zh.md`）。
- **测试与构建全部通过** —— 单元测试 7/7 通过，TypeScript 类型检查通过，打包生成规范 tarball 资产。

## Known Limitations / 已知限制

- The **platform-plugin layer** (server-side C# form/list plugins, UI layout, background events) is **not** exposed — it is outside the WebAPI's reach and is documented as a boundary.
- **平台插件层**（服务器端 C# 表单/列表插件、界面布局、后台事件）**不在** WebAPI 范围内，需在 BOS 集成开发环境中开发，已在文档中明确边界。
- The `./client` bundle follows the documented factory format; the shared `clientBundle` tsdown preset lives inside the harness repository and is not published, so this package reproduces the artifact itself.
- `./client` 产物遵循文档化的 factory 格式；共享的 `clientBundle` tsdown preset 位于 harness 仓库内部且未发布，本包自行复现该产物。

## Installation / 安装说明

See [INSTALL.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/INSTALL.md) / [INSTALL.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/INSTALL.zh.md). Upgrade and removal are in [UPDATE.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/UPDATE.md) and [UNINSTALL.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/UNINSTALL.md).

## Links / 相关链接

- Homepage / 主页: https://github.com/maxwell-feng/dsh-kingdee
- Config Guide / 配置文档: [CONFIG.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/CONFIG.md) | [CONFIG.zh.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/CONFIG.zh.md)
- Changelog / 变更日志: [CHANGELOG.md](https://github.com/maxwell-feng/dsh-kingdee/blob/v0.3.0/CHANGELOG.md)
